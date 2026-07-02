const { Op } = require('sequelize')
const { Category } = require('../../model/index').models

class CategoryService {
  async tree() {
    const all = await Category.findAll({
      where: { status: 1 },
      order: [['sort', 'ASC']],
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
    const parentPid = pid ? String(pid) : '0'
    if (parentPid !== '0') {
      const parent = await Category.findByPk(parentPid)
      if (!parent) throw Object.assign(new Error('父级分类不存在'), { status: 400 })
      if (parent.level >= 3) throw Object.assign(new Error('最多支持三级分类'), { status: 400 })
    }
    const level = parentPid !== '0' ? (await Category.findByPk(parentPid)).level + 1 : 1
    const existing = await Category.findOne({ where: { name, pid: parentPid } })
    if (existing) throw Object.assign(new Error('同级分类下已存在同名分类'), { status: 400 })
    return Category.create({ name, pid: parentPid, level, sort, status })
  }

  async update(id, data) {
    const cat = await this.getById(id)
    const newPid = data.pid !== undefined ? String(data.pid) : undefined
    if (newPid !== undefined && newPid !== String(cat.pid || '')) {
      if (newPid && newPid !== '0') {
        const parent = await Category.findByPk(newPid)
        if (!parent) throw Object.assign(new Error('父级分类不存在'), { status: 400 })
        if (parent.level + (cat.level - parent.level) > 3) throw Object.assign(new Error('最多支持三级分类'), { status: 400 })
        data.pid = newPid
        data.level = parent.level + 1
      } else {
        data.pid = '0'
        data.level = 1
      }
    }
    if (data.name && data.name !== cat.name) {
      const checkPid = newPid !== undefined ? newPid : cat.pid
      const existing = await Category.findOne({ where: { name: data.name, pid: checkPid, id: { [Op.ne]: id } } })
      if (existing) throw Object.assign(new Error('同级分类下已存在同名分类'), { status: 400 })
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
    const children = items.filter((i) => {
      if (!pid) return !i.pid || i.pid === '0'
      return i.pid === pid
    })
    if (!children.length) return []
    return children.map((item) => ({
      id: String(item.id),
      name: item.name,
      pid: item.pid === '0' ? '' : String(item.pid),
      level: item.level,
      sort: item.sort,
      status: item.status,
      children: this.#buildTree(items, String(item.id)),
    }))
  }
}

module.exports = new CategoryService()
