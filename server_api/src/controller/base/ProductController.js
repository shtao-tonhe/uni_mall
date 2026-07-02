const { success, paginate } = require('../../utils/response')
const ProductService = require('../../service/base/ProductService')

class ProductController {
  async list(req, res, next) {
    try {
      const data = await ProductService.list(req.validatedQuery)
      paginate(res, data)
    } catch (err) { next(err) }
  }

  async getById(req, res, next) {
    try {
      const product = await ProductService.getDetail(req.validatedQuery.id)
      success(res, product)
    } catch (err) { next(err) }
  }

  async create(req, res, next) {
    try {
      const product = await ProductService.create(req.validatedBody)
      success(res, product, '创建成功')
    } catch (err) { next(err) }
  }

  async update(req, res, next) {
    try {
      const { id, ...data } = req.validatedBody
      const product = await ProductService.update(id, data)
      success(res, product, '更新成功')
    } catch (err) { next(err) }
  }

  async delete(req, res, next) {
    try {
      await ProductService.delete(req.validatedBody.id)
      success(res, null, '删除成功')
    } catch (err) { next(err) }
  }
}

module.exports = new ProductController()
