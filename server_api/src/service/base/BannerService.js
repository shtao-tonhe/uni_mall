const { Op } = require('sequelize')
const { Banner } = require('../../model/index').models

class BannerService {
  async list({ page, pageSize, status }) {
    const where = {}
    if (status !== undefined) where.status = status
    const { rows, count } = await Banner.findAndCountAll({
      where,
      order: [['sort', 'ASC'], ['id', 'DESC']],
      offset: (page - 1) * pageSize,
      limit: pageSize,
    })
    return { rows, count, page, pageSize }
  }

  async listActive() {
    const now = new Date()
    return Banner.findAll({
      where: {
        status: 1,
        [Op.and]: [
          { startTime: { [Op.or]: [{ [Op.lte]: now }, null] } },
          { endTime:   { [Op.or]: [{ [Op.gte]: now }, null] } },
        ],
      },
      order: [['sort', 'ASC'], ['id', 'DESC']],
    })
  }

  async getById(id) {
    const banner = await Banner.findByPk(id)
    if (!banner) throw Object.assign(new Error('banner不存在'), { status: 404 })
    return banner
  }

  async create(data) {
    return Banner.create(data)
  }

  async update(id, data) {
    const banner = await this.getById(id)
    return banner.update(data)
  }

  async delete(id) {
    const banner = await this.getById(id)
    return banner.destroy()
  }
}

module.exports = new BannerService()
