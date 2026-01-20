const express = require('express')
const router = express.Router()
const Order = require('../models/Order')
const User = require('../models/User')
const { generateInvoiceBuffer } = require('../utils/invoice')
const { sendOrderConfirmation } = require('../utils/email')
const { v4: uuidv4 } = require('uuid')

router.post('/', async (req, res) => {
  const { userId, items, paymentMethod } = req.body
  const user = await User.findById(userId)
  const total = items.reduce((s, it) => s + it.price * it.qty, 0)
  const invoiceNumber = `INV-${Date.now()}`
  const order = new Order({ user: userId, items, totalINR: total, payment: { method: paymentMethod, status: 'pending' }, invoiceNumber })
  await order.save()

  // simulate payment success
  order.payment.status = 'paid'
  order.status = 'confirmed'
  await order.save()

  // generate invoice and email
  const pdf = await generateInvoiceBuffer(order)
  try {
    await sendOrderConfirmation(user.email, 'Order Confirmed', `<p>Thanks for order ${invoiceNumber}</p>`) 
  } catch (e) {
    console.warn('Email failed', e.message)
  }

  res.json({ orderId: order._id, invoiceNumber })
})

router.get('/history/:userId', async (req, res) => {
  const list = await Order.find({ user: req.params.userId }).limit(50)
  res.json(list)
})

module.exports = router
