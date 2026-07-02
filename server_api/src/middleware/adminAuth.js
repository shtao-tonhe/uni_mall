const { adminVerifyToken } = require('../utils/crypto')
const { fail } = require('../utils/response')

function adminAuthRequired(req, res, next) {
  const header = req.headers.authorization
  if (!header || !header.startsWith('Bearer ')) {
    return fail(res, '未登录或token已过期', -1, 401)
  }
  try {
    const token = header.split(' ')[1]
    req.admin = adminVerifyToken(token)
    next()
  } catch {
    return fail(res, 'token无效或已过期', -1, 401)
  }
}

module.exports = { adminAuthRequired }
