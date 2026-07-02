const { User } = require('../../model/index').models

class UserService {
  #sanitize(user) {
    return {
      id: user.id,
      nickname: user.nickname,
      avatar: user.avatar,
      phone: user.phone,
      gender: user.gender,
      status: user.status,
      createdAt: user.createdAt,
    }
  }

  async getProfile(userId) {
    const user = await User.findByPk(userId)
    if (!user) throw Object.assign(new Error('用户不存在'), { status: 404 })
    return this.#sanitize(user)
  }

  async updateProfile(userId, data) {
    const user = await User.findByPk(userId)
    if (!user) throw Object.assign(new Error('用户不存在'), { status: 404 })
    await user.update(data)
    return this.#sanitize(user)
  }
}

module.exports = new UserService()
