const { success } = require('../../utils/response')
const AddressService = require('../../service/base/AddressService')

class AddressController {
  async list(req, res, next) {
    try {
      const list = await AddressService.list(req.user.id)
      success(res, list)
    } catch (err) { next(err) }
  }

  async getById(req, res, next) {
    try {
      const addr = await AddressService.getById(req.validatedQuery.id, req.user.id)
      success(res, addr)
    } catch (err) { next(err) }
  }

  async create(req, res, next) {
    try {
      const addr = await AddressService.create(req.user.id, req.validatedBody)
      success(res, addr, '新增成功')
    } catch (err) { next(err) }
  }

  async update(req, res, next) {
    try {
      const { id, ...data } = req.validatedBody
      const addr = await AddressService.update(id, req.user.id, data)
      success(res, addr, '更新成功')
    } catch (err) { next(err) }
  }

  async setDefault(req, res, next) {
    try {
      const addr = await AddressService.setDefault(req.validatedBody.id, req.user.id)
      success(res, addr, '设置成功')
    } catch (err) { next(err) }
  }

  async delete(req, res, next) {
    try {
      await AddressService.delete(req.validatedBody.id, req.user.id)
      success(res, null, '删除成功')
    } catch (err) { next(err) }
  }
}

module.exports = new AddressController()
