const { Op } = require('sequelize')
const { Category } = require('../../model/index').models

class CategoryService {
  async tree() {
    const all = await Category.findAll({
      where: { status: 1 },
      order: [['sort', 'ASC'], ['id', 'ASC']],
    })
    return this.#buildTree(all, '')
  }

  async list({ page, pageSize, status }) {
    const where = {}
    if (status !== undefined) where.status = status
    const { rows, count } = await Category.findAndCountAll({
      where,
      order: [['level', 'ASC'], ['sort', 'ASC'], ['id', 'ASC']],
      offset: (page - 1) * pageSize,
      limit: pageSize,
    })
    return { rows, count, page, pageSize }
  }

  async allFlat() {
    return Category.findAll({ order: [['level', 'ASC'], ['sort', 'ASC'], ['id', 'ASC']] })
  }

  async getById(id) {
    const cat = await Category.findByPk(id)
    if (!cat) throw Object.assign(new Error('分类不存在'), { status: 404 })
    return cat
  }

  async create({ name, pid, sort, status }) {
    if (pid && pid !== '') {
      const parent = await Category.findByPk(pid)
      if (!parent) throw Object.assign(new Error('父级分类不存在'), { status: 400 })
      if (parent.level >= 3) throw Object.assign(new Error('最多支持三级分类'), { status: 400 })
    }
    const level = !pid || pid === '' ? 1 : (await Category.findByPk(pid)).level + 1
    return Category.create({ name, pid, level, sort, status })
  }

  async update(id, data) {
    const cat = await this.getById(id)
    if (data.pid !== undefined && data.pid !== cat.pid) {
      if (data.pid && data.pid !== '') {
        const parent = await Category.findByPk(data.pid)
        if (!parent) throw Object.assign(new Error('父级分类不存在'), { status: 400 })
        if (parent.level + (cat.level - parent.level) > 3) throw Object.assign(new Error('最多支持三级分类'), { status: 400 })
        data.level = parent.level + 1
      } else {
        data.pid = ''
        data.level = 1
      }
    }
    return cat.update(data)
  }

  async delete(id) {
    const cat = await this.getById(id)
    const hasChildren = await Category.findOne({ where: { pid: id } })
    if (hasChildren) throw Object.assign(new Error('请先删除子分类'), { status: 400 })
    return cat.destroy()
  }

  #buildTree(items, pid) {
    const children = items.filter((i) => i.pid === pid)
    if (!children.length) return []
    return children.map((item) => ({
      id: item.id,
      name: item.name,
      pid: item.pid,
      level: item.level,
      sort: item.sort,
      status: item.status,
      children: this.#buildTree(items, item.id),
    }))
  }
}

module.exports = new CategoryService()
