const express = require('express')
const router = express.Router()
const User = require('../models/User')
const { signAccess, signRefresh, verifyRefresh } = require('../utils/jwt')
const TokenBlacklist = require('../models/TokenBlacklist')

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body
  let user = await User.findOne({ email })
  if (user) return res.status(400).json({ error: 'User exists' })
  user = new User({ name, email })
  await user.setPassword(password)
  await user.save()
  res.json({ ok: true })
})

router.post('/login', async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })
  if (!user) return res.status(400).json({ error: 'Invalid' })
  const valid = await user.validatePassword(password)
  if (!valid) return res.status(400).json({ error: 'Invalid' })
  const access = signAccess({ id: user._id, role: user.role })
  const refresh = signRefresh({ id: user._id })
  user.refreshTokens.push(refresh)
  await user.save()
  res.json({ access, refresh })
})

router.post('/refresh', async (req, res) => {
  const { refresh } = req.body
  if (!refresh) return res.status(400).json({ error: 'No token' })
  const black = await TokenBlacklist.findOne({ token: refresh })
  if (black) return res.status(401).json({ error: 'Blacklisted' })
  try {
    const payload = verifyRefresh(refresh)
    const user = await User.findById(payload.id)
    if (!user || !user.refreshTokens.includes(refresh)) return res.status(401).json({ error: 'Invalid' })
    const access = signAccess({ id: user._id, role: user.role })
    res.json({ access })
  } catch (e) {
    return res.status(401).json({ error: 'Invalid' })
  }
})

router.post('/logout', async (req, res) => {
  const { refresh } = req.body
  if (refresh) {
    await TokenBlacklist.create({ token: refresh, reason: 'logout' })
    await User.updateOne({ refreshTokens: refresh }, { $pull: { refreshTokens: refresh } })
  }
  res.json({ ok: true })
})

module.exports = router
