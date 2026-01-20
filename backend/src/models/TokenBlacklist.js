const mongoose = require('mongoose')

const TokenBlacklistSchema = new mongoose.Schema({
  token: String,
  reason: String,
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('TokenBlacklist', TokenBlacklistSchema)
