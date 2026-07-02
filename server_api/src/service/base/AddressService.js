const { Address } = require('../../model/index').models

class AddressService {
  async list(userId) {
    return Address.findAll({
      where: { userId },
      order: [['isDefault', 'DESC'], ['id', 'DESC']],
    })
  }

  async getById(id, userId) {
    const addr = await Address.findOne({ where: { id, userId } })
    if (!addr) throw Object.assign(new Error('地址不存在'), { status: 404 })
    return addr
  }

  async create(userId, data) {
    if (data.isDefault === 1) {
      await Address.update({ isDefault: 0 }, { where: { userId, isDefault: 1 } })
    }
    return Address.create({ ...data, userId })
  }

  async update(id, userId, data) {
    const addr = await this.getById(id, userId)
    if (data.isDefault === 1) {
      await Address.update({ isDefault: 0 }, { where: { userId, isDefault: 1, id: { [require('sequelize').Op.ne]: id } } })
    }
    await addr.update(data)
    return addr
  }

  async setDefault(id, userId) {
    const addr = await this.getById(id, userId)
    await Address.update({ isDefault: 0 }, { where: { userId, isDefault: 1 } })
    await addr.update({ isDefault: 1 })
    return addr
  }

  async delete(id, userId) {
    const addr = await this.getById(id, userId)
    await addr.destroy()
  }
}

module.exports = new AddressService()
