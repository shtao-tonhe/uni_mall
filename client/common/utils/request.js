const BASE_URL = 'http://localhost:3000'

const request = (options) => {
  return new Promise((resolve, reject) => {
    const token = uni.getStorageSync('token')
    const header = {
      'Content-Type': 'application/json',
      ...options.header
    }
    if (token) {
      header['Authorization'] = 'Bearer ' + token
    }

    uni.request({
      url: BASE_URL + options.url,
      method: options.method || 'GET',
      data: options.data || {},
      header,
      timeout: options.timeout || 15000,
      success: (res) => {
        const { code, data, message } = res.data
        if (code === 0) {
          resolve(data)
        } else if (code === 401) {
          uni.removeStorageSync('token')
          uni.navigateTo({ url: '/pages/login/login' })
          reject(new Error(message || '登录已过期'))
        } else {
          uni.showToast({ title: message || '请求失败', icon: 'none' })
          reject(new Error(message))
        }
      },
      fail: (err) => {
        uni.showToast({ title: '网络异常，请稍后重试', icon: 'none' })
        reject(err)
      }
    })
  })
}

export const get = (url, data, options) =>
  request({ url, data, method: 'GET', ...options })

export const post = (url, data, options) =>
  request({ url, data, method: 'POST', ...options })

export const put = (url, data, options) =>
  request({ url, data, method: 'PUT', ...options })

export const del = (url, data, options) =>
  request({ url, data, method: 'DELETE', ...options })

export default request
