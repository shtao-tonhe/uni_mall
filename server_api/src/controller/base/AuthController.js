const { success, fail } = require('../../utils/response')
const AuthService = require('../../service/base/AuthService')

class AuthController {
  async wxLogin(req, res, next) {
    try {
      const result = await AuthService.wxLogin(req.validatedBody)
      success(res, result, '登录成功')
    } catch (err) { next(err) }
  }

  async sendCode(req, res, next) {
    try {
      const result = await AuthService.sendCode(req.validatedBody.phone)
      success(res, result, '验证码已发送')
    } catch (err) { next(err) }
  }

  async phoneLogin(req, res, next) {
    try {
      const result = await AuthService.phoneLogin(req.validatedBody.phone, req.validatedBody.code)
      success(res, result, '登录成功')
    } catch (err) { next(err) }
  }
}

module.exports = new AuthController()
