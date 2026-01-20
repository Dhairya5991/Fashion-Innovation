const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  passwordHash: String,
  role: { type: String, default: 'user' },
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  refreshTokens: [String],
  createdAt: { type: Date, default: Date.now }
})

UserSchema.methods.setPassword = async function (password) {
  this.passwordHash = await bcrypt.hash(password, 10)
}

UserSchema.methods.validatePassword = async function (password) {
  return bcrypt.compare(password, this.passwordHash)
}

module.exports = mongoose.model('User', UserSchema)
