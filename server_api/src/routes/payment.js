const { Router } = require('express')
const PaymentService = require('../service/base/PaymentService')
const { success, fail } = require('../utils/response')
const logger = require('../utils/logger')

const router = Router()

// WeChat Pay notification callback (XML format, no auth)
router.post('/notify', async (req, res, next) => {
  try {
    const xmlData = req.body
    logger.info('支付回调 received', { body: typeof xmlData === 'object' ? JSON.stringify(xmlData).slice(0, 200) : xmlData })
    const order = await PaymentService.handleWechatNotify(xmlData)
    // WeChat expects XML success response
    res.set('Content-Type', 'application/xml')
    res.send('<xml><return_code><![CDATA[SUCCESS]]></return_code><return_msg><![CDATA[OK]]></return_msg></xml>')
  } catch (err) { next(err) }
})

// JSON callback (for other payment methods or mock testing)
router.post('/notify/json', async (req, res, next) => {
  try {
    const { orderNo, transactionId, payAmount, payType } = req.body
    if (!orderNo) return fail(res, '订单号不能为空')
    const order = await PaymentService.markOrderPaid({ orderNo, transactionId: transactionId || `mock_${Date.now()}`, payAmount, payType: payType || 1 })
    success(res, order, '支付成功')
  } catch (err) { next(err) }
})

module.exports = router
