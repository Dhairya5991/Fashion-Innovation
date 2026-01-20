import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import axios from 'axios'

async function loadRazorpayScript() {
  return new Promise((resolve) => {
    const id = 'razorpay-sdk'
    if (document.getElementById(id)) return resolve(true)
    const script = document.createElement('script')
    script.id = id
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

export default function Checkout() {
  const { cart, getTotal, clearCart } = useCart()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India'
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handlePayment = async () => {
    if (!cart.length) return alert('Cart is empty')

    const items = cart.map(i => ({ product: i._id, qty: i.quantity, price: i.priceINR, size: i.selectedSize }))
    const total = getTotal()

    // Create order on backend
    const orderPayload = { items, shippingInfo: formData, paymentMethod: 'razorpay' }
    const orderRes = await axios.post(import.meta.env.VITE_API_URL + '/orders', orderPayload)
    const orderId = orderRes.data.orderId

    // Create Razorpay order
    const createRes = await axios.post(import.meta.env.VITE_API_URL + '/payments/razorpay/create-order', { orderId, amountINR: total })
    const { razorpayOrderId, amount, currency, key } = createRes.data

    const loaded = await loadRazorpayScript()
    if (!loaded) return alert('Razorpay SDK failed to load')

    const options = {
      key: key,
      amount: amount,
      currency: currency,
      order_id: razorpayOrderId,
      name: 'AR Fashion',
      description: `Order ${orderId}`,
      handler: async function (response) {
        try {
          const verifyRes = await axios.post(import.meta.env.VITE_API_URL + '/payments/razorpay/verify', {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            orderId
          })
          if (verifyRes.data.ok) {
            clearCart()
            alert('Payment successful!')
          } else {
            alert('Verification failed')
          }
        } catch (e) {
          console.error(e)
          alert('Verification error')
        }
      },
      prefill: { name: formData.firstName + ' ' + formData.lastName, email: formData.email },
      theme: { color: '#7c3aed' }
    }

    const rzp = new window.Razorpay(options)
    rzp.open()
  }

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-4 text-white">Your cart is empty</h1>
        <Link to="/" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">Continue Shopping</Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-white">Checkout</h1>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Order Summary */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4 text-white">Order Summary</h2>
          <div className="space-y-4">
            {cart.map((item) => (
              <div key={item._id} className="flex justify-between items-center text-white">
                <div>
                  <p className="font-medium">{item.title}</p>
                  <p className="text-sm text-gray-300">Quantity: {item.quantity}</p>
                  {item.selectedSize && <p className="text-sm text-gray-300">Size: {item.selectedSize}</p>}
                </div>
                <p className="font-semibold">₹{item.priceINR * item.quantity}</p>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-600 mt-4 pt-4">
            <div className="flex justify-between text-xl font-bold text-white">
              <span>Total:</span>
              <span>₹{getTotal()}</span>
            </div>
          </div>
        </div>

        {/* Shipping Information */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4 text-white">Shipping Information</h2>
          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />

            <input
              type="tel"
              name="phone"
              placeholder="Phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />

            <textarea
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
              rows="3"
              className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={handleChange}
                className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
              <input
                type="text"
                name="state"
                placeholder="State"
                value={formData.state}
                onChange={handleChange}
                className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="zipCode"
                placeholder="ZIP Code"
                value={formData.zipCode}
                onChange={handleChange}
                className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
              <input
                type="text"
                name="country"
                placeholder="Country"
                value={formData.country}
                onChange={handleChange}
                className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            <button
              type="button"
              onClick={handlePayment}
              className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Pay with Razorpay (₹{getTotal()})
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
