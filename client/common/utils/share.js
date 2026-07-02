const personalPages = [
  '/pages/order/list',
  '/pages/order/detail',
  '/pages/address/list',
  '/pages/address/edit',
  '/pages/profile/profile',
]

function isPersonalPage(path) {
  return personalPages.some(p => path.startsWith(p))
}

function getShareData() {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  const currentPath = '/' + currentPage.route

  if (isPersonalPage(currentPath)) {
    return {
      title: 'uni_mall - 发现好物',
      path: '/pages/index/index'
    }
  }

  return {
    title: 'uni_mall - 发现好物',
    path: currentPath
  }
}

export default {
  onShareAppMessage() {
    return getShareData()
  },
  onShareTimeline() {
    return getShareData()
  }
}
