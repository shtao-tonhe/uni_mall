const { success, fail, paginate } = require('../../utils/response')
const BannerService = require('../../service/base/BannerService')

class BannerController {
  async list(req, res, next) {
    try {
      const data = await BannerService.list(req.validatedQuery)
      paginate(res, data)
    } catch (err) { next(err) }
  }

  async listActive(req, res, next) {
    try {
      const list = await BannerService.listActive()
      success(res, list)
    } catch (err) { next(err) }
  }

  async getById(req, res, next) {
    try {
      const banner = await BannerService.getById(req.params.id)
      success(res, banner)
    } catch (err) { next(err) }
  }

  async create(req, res, next) {
    try {
      const banner = await BannerService.create(req.validatedBody)
      success(res, banner, '创建成功')
    } catch (err) { next(err) }
  }

  async update(req, res, next) {
    try {
      const banner = await BannerService.update(req.params.id, req.validatedBody)
      success(res, banner, '更新成功')
    } catch (err) { next(err) }
  }

  async delete(req, res, next) {
    try {
      await BannerService.delete(req.params.id)
      success(res, null, '删除成功')
    } catch (err) { next(err) }
  }
}

module.exports = new BannerController()
