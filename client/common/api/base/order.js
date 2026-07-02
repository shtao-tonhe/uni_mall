import { get, post, put } from '../../utils/request'

export function getOrderList(params) {
  return get('/api/order/list', params)
}

export function getOrderDetail(id) {
  return get('/api/order/detail', { id })
}

export function createOrder(data) {
  return post('/api/order/create', data)
}

export function cancelOrder(id) {
  return put(`/api/order/cancel/${id}`)
}

export function confirmReceipt(id) {
  return put(`/api/order/confirm/${id}`)
}
