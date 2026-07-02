import { get, post, put } from '../../utils/request'

export function login(data) {
  return post('/api/user/login', data)
}

export function getUserInfo() {
  return get('/api/user/info')
}

export function updateUserInfo(data) {
  return put('/api/user/info', data)
}

export function getAddressList() {
  return get('/api/address/list')
}

export function addAddress(data) {
  return post('/api/address/add', data)
}

export function updateAddress(id, data) {
  return put(`/api/address/update/${id}`, data)
}

export function deleteAddress(id) {
  return post(`/api/address/delete/${id}`)
}
