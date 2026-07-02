const { Cart, Product, ProductSpec } = require('../../model/index').models
const sequelize = require('../../config/database')

class CartService {
  async list(userId) {
    const sql = `
      SELECT
        c.id, c.user_id, c.product_id, c.spec_id, c.num, c.selected,
        p.name AS product_name, p.image AS product_image, p.price AS product_price,
        p.status AS product_status, p.stock AS product_stock,
        ps.spec_name, ps.price AS spec_price, ps.stock AS spec_stock, ps.image AS spec_image
      FROM cart c
      LEFT JOIN product p ON c.product_id = p.id
      LEFT JOIN product_spec ps ON c.spec_id = ps.id
      WHERE c.user_id = ?
      ORDER BY c.id DESC
    `
    const [rows] = await sequelize.query(sql, { replacements: [userId] })
    return rows
  }

  async add(userId, { productId, specId, num }) {
    const product = await Product.findByPk(productId)
    if (!product) throw Object.assign(new Error('商品不存在'), { status: 404 })
    if (product.status !== 1) throw Object.assign(new Error('商品已下架'), { status: 400 })

    if (specId) {
      const spec = await ProductSpec.findByPk(specId)
      if (!spec || spec.productId !== productId) throw Object.assign(new Error('规格不存在'), { status: 404 })
    }

    const existing = await Cart.findOne({ where: { userId, productId, specId } })
    if (existing) {
      const newNum = existing.num + num
      await existing.update({ num: newNum })
      return existing
    }

    return Cart.create({ userId, productId, specId, num })
  }

  async update(id, userId, { num }) {
    const item = await Cart.findOne({ where: { id, userId } })
    if (!item) throw Object.assign(new Error('购物车记录不存在'), { status: 404 })
    await item.update({ num })
    return item
  }

  async toggleSelected(id, userId, { selected }) {
    const item = await Cart.findOne({ where: { id, userId } })
    if (!item) throw Object.assign(new Error('购物车记录不存在'), { status: 404 })
    await item.update({ selected })
    return item
  }

  async remove(id, userId) {
    const item = await Cart.findOne({ where: { id, userId } })
    if (!item) throw Object.assign(new Error('购物车记录不存在'), { status: 404 })
    await item.destroy()
  }

  async clear(userId) {
    await Cart.destroy({ where: { userId, selected: 1 } })
  }
}

module.exports = new CartService()
