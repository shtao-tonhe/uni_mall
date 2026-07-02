import { get, post, put, del } from '../../utils/request'

export function getCartList() {
  return get('/api/cart/list')
}

export function addToCart(data) {
  return post('/api/cart/add', data)
}

export function updateCartItem(id, data) {
  return put(`/api/cart/update/${id}`, data)
}

export function removeCartItem(id) {
  return del(`/api/cart/remove/${id}`)
}

export function clearCart() {
  return del('/api/cart/clear')
}
