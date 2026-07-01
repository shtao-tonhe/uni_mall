const logger = require('../utils/logger')

function errorHandler(err, req, res, next) {
  logger.error(`${req.method} ${req.originalUrl} - ${err.message}`, {
    stack: err.stack,
    body: req.body,
  })

  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({
      code: -1,
      message: err.errors?.map((e) => e.message).join('; ') || '数据校验失败',
    })
  }

  if (err.name === 'ZodError') {
    return res.status(400).json({
      code: -1,
      message: err.errors?.map((e) => e.message).join('; ') || '参数校验失败',
    })
  }

  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).json({ code: -1, message: 'token无效或已过期' })
  }

  const status = err.status || 500
  res.status(status).json({
    code: -1,
    message: process.env.NODE_ENV === 'production' && status === 500
      ? '服务器内部错误'
      : err.message,
  })
}

module.exports = errorHandler
