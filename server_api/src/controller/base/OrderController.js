const { success, paginate } = require('../../utils/response')
const OrderService = require('../../service/base/OrderService')

class OrderController {
  async create(req, res, next) {
    try {
      const order = await OrderService.create(req.user.id, req.validatedBody)
      success(res, order, '下单成功')
    } catch (err) { next(err) }
  }

  async list(req, res, next) {
    try {
      const data = await OrderService.list(req.user.id, req.validatedQuery)
      paginate(res, data)
    } catch (err) { next(err) }
  }

  async getById(req, res, next) {
    try {
      const order = await OrderService.getById(req.validatedQuery.id, req.user.id)
      success(res, order)
    } catch (err) { next(err) }
  }

  async cancel(req, res, next) {
    try {
      const order = await OrderService.cancel(req.validatedBody.id, req.user.id)
      success(res, order, '取消成功')
    } catch (err) { next(err) }
  }

  async confirm(req, res, next) {
    try {
      const order = await OrderService.confirm(req.validatedBody.id, req.user.id)
      success(res, order, '确认收货成功')
    } catch (err) { next(err) }
  }

  async pay(req, res, next) {
    try {
      const result = await OrderService.pay(req.validatedBody.id, req.user.id)
      success(res, result, '发起支付成功')
    } catch (err) { next(err) }
  }

  async deliver(req, res, next) {
    try {
      const { id, ...data } = req.validatedBody
      const order = await OrderService.deliver(id, data)
      success(res, order, '发货成功')
    } catch (err) { next(err) }
  }

  async simulatePay(req, res, next) {
    try {
      const order = await OrderService.simulatePay(req.validatedBody.id, req.user.id)
      success(res, order, '支付成功')
    } catch (err) { next(err) }
  }

  async remove(req, res, next) {
    try {
      await OrderService.remove(req.validatedBody.id, req.user.id)
      success(res, null, '删除成功')
    } catch (err) { next(err) }
  }

  // Admin methods
  async adminList(req, res, next) {
    try {
      const data = await OrderService.adminList(req.validatedQuery)
      paginate(res, data)
    } catch (err) { next(err) }
  }

  async adminGetById(req, res, next) {
    try {
      const order = await OrderService.adminGetById(req.validatedQuery.id)
      success(res, order)
    } catch (err) { next(err) }
  }

  async adminCancel(req, res, next) {
    try {
      const order = await OrderService.cancel(req.validatedBody.id)
      success(res, order, '取消成功')
    } catch (err) { next(err) }
  }

  async adminDeliver(req, res, next) {
    try {
      const { id, ...data } = req.validatedBody
      const order = await OrderService.deliver(id, data)
      success(res, order, '发货成功')
    } catch (err) { next(err) }
  }
}

module.exports = new OrderController()
