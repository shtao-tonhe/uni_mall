const OSS_BASE_URL = 'https://oss.ziwuxi.cn/unimall'

export function ossUrl(path) {
  if (!path) return ''
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  return OSS_BASE_URL + '/' + path.replace(/^\//, '')
}

export { OSS_BASE_URL }
