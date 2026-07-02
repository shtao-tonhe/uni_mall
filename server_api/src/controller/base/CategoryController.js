const { success, paginate } = require('../../utils/response')
const CategoryService = require('../../service/base/CategoryService')

class CategoryController {
  async tree(req, res, next) {
    try {
      const data = await CategoryService.tree()
      success(res, data)
    } catch (err) { next(err) }
  }

  async allFlat(req, res, next) {
    try {
      const data = await CategoryService.allFlat()
      success(res, data)
    } catch (err) { next(err) }
  }

  async list(req, res, next) {
    try {
      const data = await CategoryService.list(req.validatedQuery)
      paginate(res, data)
    } catch (err) { next(err) }
  }

  async getById(req, res, next) {
    try {
      const category = await CategoryService.getById(req.validatedQuery.id)
      success(res, category)
    } catch (err) { next(err) }
  }

  async create(req, res, next) {
    try {
      const category = await CategoryService.create(req.validatedBody)
      success(res, category, '创建成功')
    } catch (err) { next(err) }
  }

  async update(req, res, next) {
    try {
      const { id, ...data } = req.validatedBody
      const category = await CategoryService.update(id, data)
      success(res, category, '更新成功')
    } catch (err) { next(err) }
  }

  async delete(req, res, next) {
    try {
      await CategoryService.delete(req.validatedBody.id)
      success(res, null, '删除成功')
    } catch (err) { next(err) }
  }
}

module.exports = new CategoryController()
