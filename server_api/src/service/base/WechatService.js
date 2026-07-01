const https = require('https')
const config = require('../../config')
const logger = require('../../utils/logger')

class WechatService {
  #appid = config.wx.appid
  #secret = config.wx.secret

  async code2Session(code) {
    if (!this.#appid || !this.#secret) {
      logger.warn('WeChat appid or secret not configured, using mock openid')
      return { openid: `mock_${code}_${Date.now()}`, sessionKey: 'mock_session_key' }
    }

    const url = `https://api.weixin.qq.com/sns/jscode2session` +
      `?appid=${this.#appid}&secret=${this.#secret}&js_code=${code}&grant_type=authorization_code`

    return new Promise((resolve, reject) => {
      https.get(url, (res) => {
        let data = ''
        res.on('data', (chunk) => { data += chunk })
        res.on('end', () => {
          const result = JSON.parse(data)
          if (result.errcode) {
            return reject(new Error(`微信登录失败: ${result.errmsg}`))
          }
          resolve({ openid: result.openid, sessionKey: result.session_key })
        })
      }).on('error', reject)
    })
  }

  decryptPhone(sessionKey, encryptedData, iv) {
    const crypto = require('crypto')
    const decoded = crypto.createDecipheriv(
      'aes-128-cbc',
      Buffer.from(sessionKey, 'base64'),
      Buffer.from(iv, 'base64')
    )
    let plain = decoded.update(encryptedData, 'base64', 'utf8')
    plain += decoded.final('utf8')
    return JSON.parse(plain).purePhoneNumber
  }
}

module.exports = new WechatService()
