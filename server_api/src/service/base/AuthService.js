const { Op } = require('sequelize')
const { User } = require('../../model/index').models
const { signToken } = require('../../utils/crypto')
const wechatService = require('./WechatService')
const smsService = require('./SmsService')
const logger = require('../../utils/logger')

class AuthService {
  async wxLogin({ code, encryptedData, iv, nickname, avatar, gender }) {
    const { openid, sessionKey } = await wechatService.code2Session(code)

    let user = await User.findOne({ where: { openid } })

    if (user) {
      const update = {}
      if (nickname) update.nickname = nickname
      if (avatar) update.avatar = avatar
      if (gender !== undefined) update.gender = gender
      if (encryptedData && iv) {
        try {
          const phone = wechatService.decryptPhone(sessionKey, encryptedData, iv)
          if (phone) update.phone = phone
        } catch (err) {
          logger.warn('解密手机号失败', { error: err.message })
        }
      }
      if (Object.keys(update).length) await user.update(update)
    } else {
      const data = { openid, nickname: nickname || '', avatar: avatar || '', gender: gender || 0 }
      if (encryptedData && iv) {
        try {
          const phone = wechatService.decryptPhone(sessionKey, encryptedData, iv)
          if (phone) data.phone = phone
        } catch (err) {
          logger.warn('解密手机号失败', { error: err.message })
        }
      }
      user = await User.create(data)
    }

    const token = signToken({ id: user.id, openid: user.openid })
    return { token, user: this.#sanitize(user) }
  }

  async sendCode(phone) {
    const { SmsCode } = require('../../model/index').models

    // 1分钟内不允许重复发送
    const recent = await SmsCode.findOne({
      where: { phone, created_at: { [Op.gte]: new Date(Date.now() - 60000) }, used: 0 },
    })
    if (recent) throw Object.assign(new Error('请60秒后再获取验证码'), { status: 429 })

    const code = String(Math.floor(100000 + Math.random() * 900000))
    const expiredAt = new Date(Date.now() + 5 * 60 * 1000)

    await SmsCode.create({ phone, code, type: 1, expiredAt })
    await smsService.sendCode(phone, code)

    return { expiresIn: 300 }
  }

  async phoneLogin(phone, code) {
    const { SmsCode } = require('../../model/index').models

    const record = await SmsCode.findOne({
      where: { phone, code, type: 1, used: 0 },
      order: [['id', 'DESC']],
    })
    if (!record) throw Object.assign(new Error('验证码错误'), { status: 400 })
    if (new Date() > record.expiredAt) throw Object.assign(new Error('验证码已过期'), { status: 400 })

    await record.update({ used: 1, usedAt: new Date() })

    let user = await User.findOne({ where: { phone } })
    if (!user) {
      user = await User.create({ phone, nickname: `用户${phone.slice(-4)}` })
    }

    const token = signToken({ id: user.id, phone: user.phone })
    return { token, user: this.#sanitize(user) }
  }

  #sanitize(user) {
    return {
      id: user.id,
      nickname: user.nickname,
      avatar: user.avatar,
      phone: user.phone,
      gender: user.gender,
    }
  }
}

module.exports = new AuthService()
