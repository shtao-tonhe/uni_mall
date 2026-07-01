const { verifyToken } = require('../utils/crypto')
const { fail } = require('../utils/response')

function authRequired(req, res, next) {
  const header = req.headers.authorization
  if (!header || !header.startsWith('Bearer ')) {
    return fail(res, '未登录或token已过期', -1, 401)
  }
  try {
    const token = header.split(' ')[1]
    req.user = verifyToken(token)
    next()
  } catch {
    return fail(res, 'token无效或已过期', -1, 401)
  }
}

function authOptional(req, res, next) {
  const header = req.headers.authorization
  if (header && header.startsWith('Bearer ')) {
    try {
      const token = header.split(' ')[1]
      req.user = verifyToken(token)
    } catch {
      // ignore
    }
  }
  next()
}

module.exports = { authRequired, authOptional }
