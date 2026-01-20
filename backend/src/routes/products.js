const express = require('express')
const router = express.Router()
const Product = require('../models/Product')

router.get('/', async (req, res) => {
  const products = await Product.find().limit(50)
  res.json(products)
})

router.post('/', async (req, res) => {
  // Admin creation stub — auth middleware not implemented here for brevity
  const p = new Product(req.body)
  await p.save()
  res.json(p)
})

router.get('/:id', async (req, res) => {
  const p = await Product.findById(req.params.id)
  res.json(p)
})

module.exports = router
