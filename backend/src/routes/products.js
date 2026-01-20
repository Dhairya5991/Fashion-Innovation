const express = require('express')
const router = express.Router()
const Product = require('../models/Product')
const mongoose = require('mongoose')

// Mock data for when MongoDB is not available
const mockProducts = [
  {
    _id: '1',
    title: 'Classic White T-Shirt',
    description: 'Comfortable cotton t-shirt perfect for everyday wear',
    priceINR: 1299,
    images: ['https://via.placeholder.com/300x400/ffffff/000000?text=White+T-Shirt'],
    categories: ['Men', 'Women'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['White'],
    inStock: true
  },
  {
    _id: '2',
    title: 'Blue Denim Jeans',
    description: 'Premium quality denim jeans with perfect fit',
    priceINR: 3499,
    images: ['https://via.placeholder.com/300x400/4169e1/ffffff?text=Blue+Jeans'],
    categories: ['Men'],
    sizes: ['30', '32', '34', '36'],
    colors: ['Blue'],
    inStock: true
  },
  {
    _id: '3',
    title: 'Red Summer Dress',
    description: 'Elegant summer dress for special occasions',
    priceINR: 2299,
    images: ['https://via.placeholder.com/300x400/dc143c/ffffff?text=Red+Dress'],
    categories: ['Women'],
    sizes: ['S', 'M', 'L'],
    colors: ['Red'],
    inStock: true
  },
  {
    _id: '4',
    title: 'Kids Cartoon T-Shirt',
    description: 'Fun and colorful t-shirt for kids',
    priceINR: 899,
    images: ['https://via.placeholder.com/300x400/ff69b4/ffffff?text=Kids+T-Shirt'],
    categories: ['Kids'],
    sizes: ['XS', 'S', 'M'],
    colors: ['Pink', 'Blue'],
    inStock: true
  },
  {
    _id: '5',
    title: 'Black Leather Jacket',
    description: 'Stylish leather jacket for a bold look',
    priceINR: 5999,
    images: ['https://via.placeholder.com/300x400/000000/ffffff?text=Leather+Jacket'],
    categories: ['Men', 'Women'],
    sizes: ['M', 'L', 'XL'],
    colors: ['Black'],
    inStock: true
  },
  {
    _id: '6',
    title: 'Floral Maxi Dress',
    description: 'Beautiful floral print maxi dress',
    priceINR: 3199,
    images: ['https://via.placeholder.com/300x400/ffb6c1/000000?text=Floral+Dress'],
    categories: ['Women'],
    sizes: ['S', 'M', 'L'],
    colors: ['Pink', 'Blue'],
    inStock: true
  },
  {
    _id: '7',
    title: 'Kids Denim Overalls',
    description: 'Adorable denim overalls for active kids',
    priceINR: 1599,
    images: ['https://via.placeholder.com/300x400/87ceeb/000000?text=Kids+Overalls'],
    categories: ['Kids'],
    sizes: ['S', 'M'],
    colors: ['Blue'],
    inStock: true
  },
  {
    _id: '8',
    title: 'Grey Hoodie',
    description: 'Comfortable hoodie for casual wear',
    priceINR: 1999,
    images: ['https://via.placeholder.com/300x400/808080/ffffff?text=Grey+Hoodie'],
    categories: ['Men', 'Women'],
    sizes: ['M', 'L', 'XL'],
    colors: ['Grey'],
    inStock: true
  }
]

router.get('/', async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState === 1) {
      const products = await Product.find().limit(50)
      res.json(products)
    } else {
      // Return mock data if MongoDB is not connected
      console.log('MongoDB not connected, returning mock data')
      res.json(mockProducts)
    }
  } catch (error) {
    console.error('Error fetching products:', error)
    res.json(mockProducts)
  }
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
