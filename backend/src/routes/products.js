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
  },
  {
    _id: '9',
    title: 'Fashion Sunglasses',
    description: 'Stylish sunglasses for sun protection and fashion',
    priceINR: 2499,
    images: ['https://via.placeholder.com/300x400/000000/ffffff?text=Sunglasses'],
    categories: ['Accessories'],
    sizes: ['One Size'],
    colors: ['Black', 'Brown'],
    inStock: true
  },
  {
    _id: '10',
    title: 'Leather Handbag',
    description: 'Elegant leather handbag for everyday use',
    priceINR: 4599,
    images: ['https://via.placeholder.com/300x400/8b4513/ffffff?text=Leather+Handbag'],
    categories: ['Accessories'],
    sizes: ['Medium'],
    colors: ['Brown', 'Black'],
    inStock: true
  },
  {
    _id: '11',
    title: 'Kids Sneakers',
    description: 'Comfortable and durable sneakers for active kids',
    priceINR: 1799,
    images: ['https://via.placeholder.com/300x400/ff6347/ffffff?text=Kids+Sneakers'],
    categories: ['Kids'],
    sizes: ['24', '25', '26', '27'],
    colors: ['Red', 'Blue'],
    inStock: true
  },
  {
    _id: '13',
    title: 'Men\'s Casual Polo Shirt',
    description: 'Comfortable cotton polo shirt for everyday wear',
    priceINR: 1899,
    images: ['https://via.placeholder.com/300x400/32cd32/ffffff?text=Polo+Shirt'],
    categories: ['Men'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Green', 'Blue', 'White'],
    inStock: true
  },
  {
    _id: '14',
    title: 'Men\'s Formal Shirt',
    description: 'Elegant formal shirt for office and occasions',
    priceINR: 2499,
    images: ['https://via.placeholder.com/300x400/f0f8ff/000000?text=Formal+Shirt'],
    categories: ['Men'],
    sizes: ['M', 'L', 'XL'],
    colors: ['White', 'Light Blue'],
    inStock: true
  },
  {
    _id: '15',
    title: 'Women\'s Blouse',
    description: 'Stylish blouse perfect for work and casual outings',
    priceINR: 1699,
    images: ['https://via.placeholder.com/300x400/daa520/ffffff?text=Blouse'],
    categories: ['Women'],
    sizes: ['S', 'M', 'L'],
    colors: ['Gold', 'White', 'Black'],
    inStock: true
  },
  {
    _id: '16',
    title: 'Women\'s Skirt',
    description: 'Elegant skirt for a sophisticated look',
    priceINR: 2199,
    images: ['https://via.placeholder.com/300x400/9932cc/ffffff?text=Skirt'],
    categories: ['Women'],
    sizes: ['S', 'M', 'L'],
    colors: ['Purple', 'Black'],
    inStock: true
  },
  {
    _id: '17',
    title: 'Kids\' Pajama Set',
    description: 'Comfortable pajama set for cozy nights',
    priceINR: 1299,
    images: ['https://via.placeholder.com/300x400/ffb6c1/000000?text=Kids+Pajamas'],
    categories: ['Kids'],
    sizes: ['S', 'M'],
    colors: ['Pink', 'Blue'],
    inStock: true
  },
  {
    _id: '18',
    title: 'Kids\' School Uniform',
    description: 'Durable and comfortable school uniform',
    priceINR: 1999,
    images: ['https://via.placeholder.com/300x400/ffffff/000000?text=School+Uniform'],
    categories: ['Kids'],
    sizes: ['S', 'M', 'L'],
    colors: ['Navy Blue', 'Grey'],
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
  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState === 1) {
      const p = await Product.findById(req.params.id)
      if (p) {
        res.json(p)
      } else {
        res.status(404).json({ error: 'Product not found' })
      }
    } else {
      // Return mock data if MongoDB is not connected
      console.log('MongoDB not connected, returning mock product data')
      const product = mockProducts.find(p => p._id === req.params.id)
      if (product) {
        res.json(product)
      } else {
        res.status(404).json({ error: 'Product not found' })
      }
    }
  } catch (error) {
    console.error('Error fetching product:', error)
    const product = mockProducts.find(p => p._id === req.params.id)
    if (product) {
      res.json(product)
    } else {
      res.status(404).json({ error: 'Product not found' })
    }
  }
})

module.exports = router
