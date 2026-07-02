const { success } = require('../../utils/response')
const AdminService = require('../../service/base/AdminService')

class AdminController {
  async login(req, res, next) {
    try {
      const result = await AdminService.login(req.validatedBody)
      success(res, result, '登录成功')
    } catch (err) { next(err) }
  }

  async profile(req, res, next) {
    try {
      const admin = await AdminService.getProfile(req.admin.id)
      success(res, admin)
    } catch (err) { next(err) }
  }

  async updateProfile(req, res, next) {
    try {
      const admin = await AdminService.updateProfile(req.admin.id, req.validatedBody)
      success(res, admin, '更新成功')
    } catch (err) { next(err) }
  }
}

module.exports = new AdminController()
