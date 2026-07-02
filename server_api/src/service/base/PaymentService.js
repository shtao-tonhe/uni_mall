const { Op } = require('sequelize')
const sequelize = require('../../config/database')
const { Order, Payment } = require('../../model/index').models
const logger = require('../../utils/logger')

class PaymentService {
  /**
   * Mark an order as paid (called by payment callback or simulate)
   * @param {string} orderNo
   * @param {string} transactionId
   * @param {number} payAmount
   * @param {number} payType 1=wechat
   */
  async markOrderPaid({ orderNo, transactionId, payAmount, payType = 1 }) {
    const order = await Order.findOne({ where: { orderNo } })
    if (!order) throw Object.assign(new Error('订单不存在'), { status: 404 })
    if (order.status !== 0) {
      logger.warn('支付回调：订单状态异常', { orderNo, status: order.status })
      return order
    }
    if (payAmount !== undefined && Math.abs(Number(payAmount) - Number(order.payAmount)) > 0.01) {
      throw Object.assign(new Error('支付金额不匹配'), { status: 400 })
    }

    const now = new Date()
    await sequelize.transaction(async (t) => {
      await order.update({ status: 1, payTime: now }, { transaction: t })

      let payment = await Payment.findOne({ where: { orderId: order.id }, transaction: t })
      if (payment) {
        await payment.update({ status: 1, payTime: now, transactionId, payType }, { transaction: t })
      } else {
        await Payment.create({
          orderId: order.id, orderNo, userId: order.userId,
          amount: order.payAmount, payType,
          transactionId, status: 1, payTime: now,
        }, { transaction: t })
      }
    })

    logger.info('订单支付成功', { orderNo, transactionId })
    return order
  }

  /**
   * Process WeChat Pay notification (XML)
   */
  async handleWechatNotify(xmlData) {
    // TODO: parse XML, verify sign, extract result_code/order_no/transaction_id
    // For now, mock implementation
    const orderNo = xmlData.out_trade_no || ''
    const transactionId = xmlData.transaction_id || ''
    const totalFee = xmlData.total_fee ? Number(xmlData.total_fee) / 100 : undefined
    if (!orderNo) throw Object.assign(new Error('回调参数缺失'), { status: 400 })
    return this.markOrderPaid({ orderNo, transactionId, payAmount: totalFee, payType: 1 })
  }
}

module.exports = new PaymentService()
