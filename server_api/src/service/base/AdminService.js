const { Admin } = require('../../model/index').models
const { hashPassword, comparePassword, adminSignToken } = require('../../utils/crypto')

class AdminService {
  async login({ username, password }) {
    const admin = await Admin.findOne({ where: { username } })
    if (!admin) throw Object.assign(new Error('账号或密码错误'), { status: 400 })
    if (!admin.status) throw Object.assign(new Error('账号已被禁用'), { status: 400 })
    if (!comparePassword(password, admin.password)) throw Object.assign(new Error('账号或密码错误'), { status: 400 })

    const token = adminSignToken({ id: admin.id, username: admin.username, role: admin.role })
    return {
      token,
      admin: { id: admin.id, username: admin.username, nickname: admin.nickname, avatar: admin.avatar, role: admin.role },
    }
  }

  async getProfile(adminId) {
    const admin = await Admin.findByPk(adminId)
    if (!admin) throw Object.assign(new Error('管理员不存在'), { status: 404 })
    return { id: admin.id, username: admin.username, nickname: admin.nickname, avatar: admin.avatar, role: admin.role }
  }

  async updateProfile(adminId, data) {
    const admin = await Admin.findByPk(adminId)
    if (!admin) throw Object.assign(new Error('管理员不存在'), { status: 404 })
    await admin.update(data)
    return { id: admin.id, username: admin.username, nickname: admin.nickname, avatar: admin.avatar, role: admin.role }
  }
}

module.exports = new AdminService()
