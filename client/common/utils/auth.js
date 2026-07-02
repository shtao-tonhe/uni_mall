const LOGIN_PAGE = '/pages/login/login'
const HOME_PAGE = '/pages/index/index'

const guestPages = [
  '/pages/index/index',
  '/pages/category/category',
  '/pages/cart/cart',
  '/pages/profile/profile',
  '/pages/product/detail',
]

export function isGuestPage(path) {
  return guestPages.some(p => path.startsWith(p))
}

export function checkLogin() {
  const token = uni.getStorageSync('token')
  return !!token
}

export function requireLogin() {
  if (!checkLogin()) {
    const pages = getCurrentPages()
    const currentPage = pages[pages.length - 1]
    const currentPath = '/' + currentPage.route

    uni.navigateTo({
      url: `${LOGIN_PAGE}?redirect=${encodeURIComponent(currentPath)}`
    })
    return false
  }
  return true
}

export function getHomePath() {
  return HOME_PAGE
}
