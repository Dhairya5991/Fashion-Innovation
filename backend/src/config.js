require('dotenv').config({ path: require('path').join(__dirname, '../../.env') })
module.exports = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/ar_fashion',
  jwtSecret: process.env.JWT_SECRET || 'secret',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'refreshsecret',
  email: {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  razorpay: {
    key: process.env.RAZORPAY_KEY,
    secret: process.env.RAZORPAY_SECRET
  }
}
