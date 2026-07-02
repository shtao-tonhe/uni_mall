import { get } from '../../utils/request'

export function getHomeData() {
  return get('/api/home')
}

export function getBannerList() {
  return get('/api/banner/list')
}

export function getRecommendList() {
  return get('/api/product/recommend')
}

export function getProductDetail(id) {
  return get('/api/product/detail', { id })
}

export function getProductList(params) {
  return get('/api/product/list', params)
}

export function searchProduct(keyword) {
  return get('/api/product/search', { keyword })
}
