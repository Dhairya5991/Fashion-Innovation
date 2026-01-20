const express = require('express')
const router = express.Router()
const Product = require('../models/Product')
const User = require('../models/User')

router.get('/stats', async (req, res) => {
  const products = await Product.countDocuments()
  const users = await User.countDocuments()
  res.json({ products, users })
})

module.exports = router
