const { success } = require('../../utils/response')
const UserService = require('../../service/base/UserService')

class UserController {
  async profile(req, res, next) {
    try {
      const user = await UserService.getProfile(req.user.id)
      success(res, user)
    } catch (err) { next(err) }
  }

  async updateProfile(req, res, next) {
    try {
      const user = await UserService.updateProfile(req.user.id, req.validatedBody)
      success(res, user, '更新成功')
    } catch (err) { next(err) }
  }
}

module.exports = new UserController()
