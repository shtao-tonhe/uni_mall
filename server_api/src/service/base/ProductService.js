const { Op } = require('sequelize')
const { Product, ProductSpec } = require('../../model/index').models

class ProductService {
  async list({ page, pageSize, categoryId, status, keyword }) {
    const where = {}
    if (categoryId) where.categoryId = categoryId
    if (status !== undefined) where.status = status
    if (keyword) where.name = { [Op.like]: `%${keyword}%` }

    const { rows, count } = await Product.findAndCountAll({
      where,
      order: [['sort', 'ASC'], ['id', 'DESC']],
      offset: (page - 1) * pageSize,
      limit: pageSize,
    })
    return { rows, count, page, pageSize }
  }

  async getById(id) {
    const product = await Product.findByPk(id)
    if (!product) throw Object.assign(new Error('商品不存在'), { status: 404 })
    return product
  }

  async getDetail(id) {
    const product = await this.getById(id)
    const specs = await ProductSpec.findAll({ where: { productId: id }, order: [['id', 'ASC']] })

    const data = product.toJSON()
    data.specs = specs.map((s) => ({
      id: s.id,
      specKey: s.specKey,
      specName: s.specName,
      specs: safeParse(s.specs),
      price: s.price,
      stock: s.stock,
      image: s.image,
    }))
    data.params = safeParse(data.params)
    data.specData = safeParse(data.specData)
    try { data.images = JSON.parse(data.images || '[]') } catch { data.images = [] }
    return data
  }

  async create(data) {
    const { specs, ...productData } = data
    const product = await Product.create(productData)

    if (specs && specs.length > 0) {
      const items = specs.map((s) => ({
        productId: product.id,
        specKey: s.specKey || s.specName,
        specName: s.specName,
        specs: JSON.stringify(s.specs || [{ name: '规格', value: s.specName }]),
        price: s.price,
        stock: s.stock,
        image: s.image || '',
      }))
      await ProductSpec.bulkCreate(items)
    }
    return this.getDetail(product.id)
  }

  async update(id, data) {
    const product = await this.getById(id)
    const { specs, ...productData } = data

    if (Object.keys(productData).length > 0) {
      await product.update(productData)
    }

    if (specs && Array.isArray(specs)) {
      await ProductSpec.destroy({ where: { productId: id } })
      if (specs.length > 0) {
        const items = specs.map((s) => ({
          productId: id,
          specKey: s.specKey || s.specName,
          specName: s.specName,
          specs: JSON.stringify(s.specs || [{ name: '规格', value: s.specName }]),
          price: s.price,
          stock: s.stock,
          image: s.image || '',
        }))
        await ProductSpec.bulkCreate(items)
      }
    }

    return this.getDetail(id)
  }

  async delete(id) {
    const product = await this.getById(id)
    await ProductSpec.destroy({ where: { productId: id } })
    return product.destroy()
  }
}

function safeParse(val) {
  if (!val) return null
  try { return JSON.parse(val) } catch { return val }
}

module.exports = new ProductService()
