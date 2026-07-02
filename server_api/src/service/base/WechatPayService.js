const config = require('../../config')
const crypto = require('crypto')

class WechatPayService {
  async createUnifiedOrder(order) {
    const appid = config.wx.appid

    // dev mode: mock prepay
    if (!appid) {
      return this.#mockPrepay(order)
    }

    // TODO: real WeChat Pay unified order API
    throw Object.assign(new Error('微信支付尚未配置'), { status: 500 })
  }

  #mockPrepay(order) {
    const nonceStr = crypto.randomBytes(16).toString('hex')
    const prepayId = `wx${Date.now()}${String(Math.random()).slice(2, 10)}`
    const timeStamp = String(Math.floor(Date.now() / 1000))

    // Mock paySign — in real scenario this is generated with the WeChat merchant key
    const signStr = `appId=${config.wx.appid || 'mock_appid'}&nonceStr=${nonceStr}&package=prepay_id=${prepayId}&signType=RSA&timeStamp=${timeStamp}`
    const paySign = crypto.createHash('md5').update(signStr).digest('hex')

    return {
      prepayId,
      paymentParams: {
        appId: config.wx.appid || 'mock_appid',
        timeStamp,
        nonceStr,
        package: `prepay_id=${prepayId}`,
        signType: 'RSA',
        paySign,
      },
    }
  }
}

module.exports = new WechatPayService()
