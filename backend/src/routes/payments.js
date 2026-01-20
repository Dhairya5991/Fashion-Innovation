const express = require('express')
const router = express.Router()
const Razorpay = require('razorpay')
const crypto = require('crypto')
const bodyParser = require('body-parser')
const config = require('../config')
const Order = require('../models/Order')

const razor = new Razorpay({ key_id: config.razorpay.key, key_secret: config.razorpay.secret })

router.post('/razorpay/create-order', async (req, res) => {
  const { orderId, amountINR } = req.body
  if (!orderId || !amountINR) return res.status(400).json({ error: 'orderId and amountINR required' })
  const receipt = `rcpt_${orderId}`
  const amountPaise = Math.round(amountINR * 100)
  try {
    const order = await razor.orders.create({ amount: amountPaise, currency: 'INR', receipt, payment_capture: 1 })
    // store razorpay order id in our Order
    await Order.findByIdAndUpdate(orderId, { $set: { 'payment.details.razorpay_order_id': order.id } })
    res.json({ razorpayOrderId: order.id, amount: amountPaise, currency: 'INR', key: config.razorpay.key })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'create order failed' })
  }
})

router.post('/razorpay/verify', async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !orderId) return res.status(400).json({ error: 'missing fields' })
  const generated_signature = crypto.createHmac('sha256', config.razorpay.secret).update(razorpay_order_id + '|' + razorpay_payment_id).digest('hex')
  if (generated_signature === razorpay_signature) {
    // mark order paid
    await Order.findByIdAndUpdate(orderId, { $set: { 'payment.status': 'paid', 'payment.details.razorpay_payment_id': razorpay_payment_id } })
    return res.json({ ok: true })
  }
  res.status(400).json({ error: 'invalid signature' })
})

// Razorpay webhook endpoint (raw body required for signature verification)
router.post('/webhook', bodyParser.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const signature = req.headers['x-razorpay-signature']
    const body = req.body
    const expected = crypto.createHmac('sha256', config.razorpay.secret).update(body).digest('hex')
    if (signature !== expected) {
      console.warn('Invalid webhook signature')
      return res.status(400).send('invalid signature')
    }
    const payload = JSON.parse(body.toString())
    // handle event types
    const ev = payload.event
    if (ev === 'payment.captured' || ev === 'payment.authorized') {
      const payment = payload.payload.payment.entity
      const razorpayOrderId = payment.order_id
      // find our order by razorpay order id
      const ord = await Order.findOne({ 'payment.details.razorpay_order_id': razorpayOrderId })
      if (ord) {
        ord.payment.status = 'paid'
        ord.payment.details = ord.payment.details || {}
        ord.payment.details.razorpay_payment_id = payment.id
        ord.status = 'confirmed'
        await ord.save()
      }
    }
    // respond quickly
    res.json({ ok: true })
  } catch (e) {
    console.error('webhook error', e)
    res.status(500).send('error')
  }
})

module.exports = router
