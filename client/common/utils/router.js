export function navigateTo(url, params = {}) {
  let fullUrl = url
  const query = Object.entries(params)
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join('&')
  if (query) {
    fullUrl += (url.includes('?') ? '&' : '?') + query
  }
  uni.navigateTo({ url: fullUrl })
}

export function switchTab(url) {
  uni.switchTab({ url })
}

export function redirectTo(url, params = {}) {
  let fullUrl = url
  const query = Object.entries(params)
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join('&')
  if (query) {
    fullUrl += (url.includes('?') ? '&' : '?') + query
  }
  uni.redirectTo({ url: fullUrl })
}

export function reLaunch(url) {
  uni.reLaunch({ url })
}

export function navigateBack(delta = 1) {
  uni.navigateBack({ delta })
}
