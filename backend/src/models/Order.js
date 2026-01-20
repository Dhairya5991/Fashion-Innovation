const mongoose = require('mongoose')

const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [{ product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, qty: Number, price: Number, size: String }],
  totalINR: Number,
  payment: { method: String, status: String, details: Object },
  status: { type: String, default: 'pending' },
  invoiceNumber: String,
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Order', OrderSchema)
