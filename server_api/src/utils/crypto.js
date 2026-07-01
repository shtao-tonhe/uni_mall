const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('../config')

function hashPassword(password) {
  return bcrypt.hashSync(password, 10)
}

function comparePassword(password, hash) {
  return bcrypt.compareSync(password, hash)
}

function signToken(payload) {
  return jwt.sign(payload, config.jwt.secret, { expiresIn: config.jwt.expiresIn })
}

function verifyToken(token) {
  return jwt.verify(token, config.jwt.secret)
}

module.exports = { hashPassword, comparePassword, signToken, verifyToken }
