const { Op } = require('sequelize')
const sequelize = require('../../config/database')
const { Order, OrderItem, Cart, Product, ProductSpec, Address, Payment, User } = require('../../model/index').models
const wechatPayService = require('./WechatPayService')
const paymentService = require('./PaymentService')
const { nextId } = require('../../utils/snowflake')

function generateOrderNo() {
  return nextId()
}

class OrderService {
  async create(userId, { type, addressId, remark, items }) {
    const address = await Address.findOne({ where: { id: addressId, userId } })
    if (!address) throw Object.assign(new Error('收货地址不存在'), { status: 404 })

    const addressStr = [address.province, address.city, address.district, address.street, address.detail]
      .filter(Boolean).join(' ')

    let cartItems = []
    if (type === 'cart') {
      cartItems = await Cart.findAll({
        where: { userId, selected: 1 },
        raw: true,
      })
      if (cartItems.length === 0) throw Object.assign(new Error('购物车未选中任何商品'), { status: 400 })
    } else {
      cartItems = items.map((it) => ({ productId: it.productId, specId: it.specId, num: it.num }))
    }

    const orderItems = []
    for (const item of cartItems) {
      const product = await Product.findByPk(item.productId)
      if (!product) throw Object.assign(new Error(`商品ID ${item.productId} 不存在`), { status: 404 })
      if (product.status !== 1) throw Object.assign(new Error(`"${product.name}" 已下架`), { status: 400 })

      let price = Number(product.price)
      let specName = ''
      let specImage = ''

      if (item.specId) {
        const spec = await ProductSpec.findByPk(item.specId)
        if (!spec || spec.productId !== item.productId) {
          throw Object.assign(new Error(`规格ID ${item.specId} 不存在`), { status: 404 })
        }
        if (spec.stock < item.num) throw Object.assign(new Error(`"${product.name}" 库存不足`), { status: 400 })
        price = Number(spec.price)
        specName = spec.specName
        specImage = spec.image
      } else {
        if (product.stock < item.num) throw Object.assign(new Error(`"${product.name}" 库存不足`), { status: 400 })
      }

      orderItems.push({
        productId: item.productId,
        productName: product.name,
        productImage: product.image,
        specId: item.specId,
        specName,
        specImage,
        price,
        num: item.num,
        subtotal: Number((price * item.num).toFixed(2)),
      })
    }

    const totalAmount = Number(orderItems.reduce((sum, it) => sum + it.subtotal, 0).toFixed(2))

    const orderNo = generateOrderNo()

    const order = await sequelize.transaction(async (t) => {
      // deduct stock
      for (const item of cartItems) {
        if (item.specId) {
          await ProductSpec.decrement('stock', { by: item.num, where: { id: item.specId, stock: { [Op.gte]: item.num } }, transaction: t })
          const spec = await ProductSpec.findByPk(item.specId, { transaction: t })
          if (spec.stock < 0) throw Object.assign(new Error(`"${orderItems.find((o) => o.productId === item.productId).productName}" 库存不足`), { status: 400 })
        } else {
          await Product.decrement('stock', { by: item.num, where: { id: item.productId, stock: { [Op.gte]: item.num } }, transaction: t })
          const product = await Product.findByPk(item.productId, { transaction: t })
          if (product.stock < 0) throw Object.assign(new Error(`"${product.name}" 库存不足`), { status: 400 })
        }
      }

      // create order
      const order = await Order.create({
        orderNo,
        userId,
        totalAmount,
        payAmount: totalAmount,
        freightAmount: 0,
        discountAmount: 0,
        status: 0,
        consignee: address.consignee,
        phone: address.phone,
        address: addressStr,
        remark,
      }, { transaction: t })

      // create order items
      const itemsToCreate = orderItems.map((it) => ({ ...it, orderId: order.id }))
      await OrderItem.bulkCreate(itemsToCreate, { transaction: t })

      // clear cart if from cart
      if (type === 'cart') {
        await Cart.destroy({
          where: { userId, productId: cartItems.map((c) => c.productId) },
          transaction: t,
        })
      }

      return order
    })

    return this.getById(order.id, userId)
  }

  async list(userId, { page, pageSize, status }) {
    const where = { userId }
    if (status !== undefined) where.status = status

    const { rows, count } = await Order.findAndCountAll({
      where,
      order: [['id', 'DESC']],
      offset: (page - 1) * pageSize,
      limit: pageSize,
    })
    return { rows, count, page, pageSize }
  }

  async adminList({ page, pageSize, status, orderNo, startDate, endDate }) {
    const where = {}
    if (status !== undefined && status !== '') where.status = status
    if (orderNo) where.orderNo = { [Op.like]: `%${orderNo}%` }
    if (startDate || endDate) {
      where.createdAt = {}
      if (startDate) where.createdAt[Op.gte] = new Date(startDate)
      if (endDate) where.createdAt[Op.lte] = new Date(endDate + ' 23:59:59')
    }

    const { rows, count } = await Order.findAndCountAll({
      where,
      order: [['id', 'DESC']],
      offset: (page - 1) * pageSize,
      limit: pageSize,
      include: [
        { model: OrderItem, as: 'items', foreignKey: 'orderId' },
        { model: User, as: 'user', attributes: ['id', 'nickname', 'avatar', 'phone'] },
      ],
    })
    return { rows, count, page, pageSize }
  }

  async adminGetById(id) {
    const order = await Order.findOne({
      where: { id },
      include: [
        { model: OrderItem, as: 'items', foreignKey: 'orderId' },
        { model: User, as: 'user', attributes: ['id', 'nickname', 'avatar', 'phone'] },
      ],
    })
    if (!order) throw Object.assign(new Error('订单不存在'), { status: 404 })
    return order
  }

  async getById(id, userId) {
    const order = await Order.findOne({
      where: { id, userId },
      include: [{ model: OrderItem, as: 'items', foreignKey: 'orderId' }],
    })
    if (!order) throw Object.assign(new Error('订单不存在'), { status: 404 })
    return order
  }

  async cancel(id, userId) {
    const where = { id }
    if (userId) where.userId = userId
    const order = await Order.findOne({ where })
    if (!order) throw Object.assign(new Error('订单不存在'), { status: 404 })
    if (order.status !== 0) throw Object.assign(new Error('仅待付款订单可取消'), { status: 400 })

    // restore stock
    const items = await OrderItem.findAll({ where: { orderId: id } })
    await sequelize.transaction(async (t) => {
      for (const item of items) {
        if (item.specId) {
          await ProductSpec.increment('stock', { by: item.num, where: { id: item.specId }, transaction: t })
        } else {
          await Product.increment('stock', { by: item.num, where: { id: item.productId }, transaction: t })
        }
      }
      await order.update({ status: 4, closeTime: new Date() }, { transaction: t })
    })

    return order
  }

  async deliver(id, { deliveryCompany, deliveryNo }) {
    const order = await Order.findByPk(id)
    if (!order) throw Object.assign(new Error('订单不存在'), { status: 404 })
    if (order.status !== 1) throw Object.assign(new Error('仅待发货订单可发货'), { status: 400 })

    await order.update({ status: 2, deliveryTime: new Date(), deliveryCompany, deliveryNo })
    return order
  }

  async confirm(id, userId) {
    const order = await Order.findOne({ where: { id, userId } })
    if (!order) throw Object.assign(new Error('订单不存在'), { status: 404 })
    if (order.status !== 2) throw Object.assign(new Error('仅待收货订单可确认'), { status: 400 })

    await order.update({ status: 3, receiveTime: new Date() })
    return order
  }

  async pay(id, userId) {
    const order = await Order.findOne({ where: { id, userId } })
    if (!order) throw Object.assign(new Error('订单不存在'), { status: 404 })
    if (order.status !== 0) throw Object.assign(new Error('仅待付款订单可发起支付'), { status: 400 })

    const { prepayId, paymentParams } = await wechatPayService.createUnifiedOrder(order)

    // upsert payment record
    let payment = await Payment.findOne({ where: { orderId: id } })
    if (payment) {
      await payment.update({ transactionId: prepayId, amount: order.payAmount })
    } else {
      payment = await Payment.create({
        orderId: id,
        orderNo: order.orderNo,
        userId,
        amount: order.payAmount,
        payType: 1,
        transactionId: prepayId,
        status: 0,
      })
    }

    return { paymentParams, payment }
  }

  async simulatePay(id, userId) {
    const order = await Order.findOne({ where: { id, userId } })
    if (!order) throw Object.assign(new Error('订单不存在'), { status: 404 })
    if (order.status !== 0) throw Object.assign(new Error('仅待付款订单可支付'), { status: 400 })

    await paymentService.markOrderPaid({
      orderNo: order.orderNo,
      transactionId: `mock_${Date.now()}`,
      payAmount: order.payAmount,
      payType: 1,
    })

    return this.getById(id, userId)
  }

  async remove(id, userId) {
    const order = await Order.findOne({ where: { id, userId } })
    if (!order) throw Object.assign(new Error('订单不存在'), { status: 404 })
    if (![3, 4].includes(order.status)) throw Object.assign(new Error('仅已完成或已取消订单可删除'), { status: 400 })

    await order.destroy()
  }
}

module.exports = new OrderService()
