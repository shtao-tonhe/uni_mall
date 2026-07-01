function success(res, data = null, message = 'ok') {
  return res.json({ code: 0, message, data })
}

function fail(res, message = 'fail', code = -1, status = 200) {
  return res.status(status).json({ code, message })
}

function paginate(res, { rows, count, page, pageSize }) {
  return res.json({
    code: 0,
    message: 'ok',
    data: {
      list: rows,
      total: count,
      page,
      pageSize,
    },
  })
}

module.exports = { success, fail, paginate }
