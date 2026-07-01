const { fail } = require('../utils/response')

function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body)
    if (!result.success) {
      const messages = result.error.errors.map((e) => e.message).join('; ')
      return fail(res, messages)
    }
    req.validatedBody = result.data
    next()
  }
}

function validateQuery(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.query)
    if (!result.success) {
      const messages = result.error.errors.map((e) => e.message).join('; ')
      return fail(res, messages)
    }
    req.validatedQuery = result.data
    next()
  }
}

module.exports = { validate, validateQuery }
