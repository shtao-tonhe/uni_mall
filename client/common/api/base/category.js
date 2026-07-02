import { get } from '../../utils/request'

export function getCategoryList() {
  return get('/api/category/list')
}

export function getCategoryProducts(categoryId, page = 1, pageSize = 20) {
  return get('/api/category/products', { categoryId, page, pageSize })
}
