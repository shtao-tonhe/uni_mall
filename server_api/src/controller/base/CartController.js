const { success } = require('../../utils/response')
const CartService = require('../../service/base/CartService')

class CartController {
  async list(req, res, next) {
    try {
      const list = await CartService.list(req.user.id)
      success(res, list)
    } catch (err) { next(err) }
  }

  async add(req, res, next) {
    try {
      const item = await CartService.add(req.user.id, req.validatedBody)
      success(res, item, '添加成功')
    } catch (err) { next(err) }
  }

  async update(req, res, next) {
    try {
      const { id, ...data } = req.validatedBody
      const item = await CartService.update(id, req.user.id, data)
      success(res, item, '更新成功')
    } catch (err) { next(err) }
  }

  async toggleSelected(req, res, next) {
    try {
      const { id, ...data } = req.validatedBody
      const item = await CartService.toggleSelected(id, req.user.id, data)
      success(res, item, '更新成功')
    } catch (err) { next(err) }
  }

  async remove(req, res, next) {
    try {
      await CartService.remove(req.validatedBody.id, req.user.id)
      success(res, null, '删除成功')
    } catch (err) { next(err) }
  }

  async clear(req, res, next) {
    try {
      await CartService.clear(req.user.id)
      success(res, null, '已清空')
    } catch (err) { next(err) }
  }
}

module.exports = new CartController()
