const jwt = require('jsonwebtoken')
const { jwtSecret, jwtRefreshSecret } = require('../config')

function signAccess(payload) {
  return jwt.sign(payload, jwtSecret, { expiresIn: '15m' })
}

function signRefresh(payload) {
  return jwt.sign(payload, jwtRefreshSecret, { expiresIn: '30d' })
}

function verifyAccess(token) {
  return jwt.verify(token, jwtSecret)
}

function verifyRefresh(token) {
  return jwt.verify(token, jwtRefreshSecret)
}

module.exports = { signAccess, signRefresh, verifyAccess, verifyRefresh }
