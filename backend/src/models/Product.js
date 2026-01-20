const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema({
  title: String,
  description: String,
  priceINR: Number,
  images: [String],
  inventory: { type: Number, default: 10 },
  categories: [String],
  sku: String,
  arModels: [{ url: String, format: String }],
  ecoTag: { type: String },
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Product', ProductSchema)
