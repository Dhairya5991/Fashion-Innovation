import React from 'react'
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

export default function Checkout(){
  async function handlePay(){
    // load cart from localStorage
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    if (!cart.length) return alert('Cart is empty')
    const items = cart.map(i => ({ product: i.productId, qty: i.qty || 1, price: i.price }))
    const total = cart.reduce((s,i) => s + (i.price * (i.qty || 1)), 0)

    // create local order on backend with items and user info
    const user = JSON.parse(localStorage.getItem('user') || 'null')
    const orderPayload = { userId: user ? user.id : null, items, paymentMethod: 'razorpay' }
    const orderRes = await axios.post(import.meta.env.VITE_API_URL + '/orders', orderPayload)
    const orderId = orderRes.data.orderId
    const invoiceNumber = orderRes.data.invoiceNumber

    // ask backend to create razorpay order for the actual total
    const amountINR = total
    const createRes = await axios.post(import.meta.env.VITE_API_URL + '/payments/razorpay/create-order', { orderId, amountINR })
    const { razorpayOrderId, amount, currency, key } = createRes.data

    const loaded = await loadRazorpayScript()
    if (!loaded) return alert('Razorpay SDK failed to load')

    const options = {
      key: key,
      amount: amount,
      currency: currency,
      order_id: razorpayOrderId,
      name: 'AR Fashion',
      description: `Order ${invoiceNumber}`,
      handler: async function (response) {
          try {
            // verify on server
            const verifyRes = await axios.post(import.meta.env.VITE_API_URL + '/payments/razorpay/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId
            })
            if (verifyRes.data.ok) {
              // clear cart on success
              localStorage.removeItem('cart')
              alert('Payment successful and verified')
            } else {
              alert('Verification failed')
            }
          } catch (e) {
            console.error(e)
            alert('Verification error')
          }
      },
      prefill: { name: '', email: '' },
      theme: { color: '#3399cc' }
    }

    const rzp = new window.Razorpay(options)
    rzp.open()
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Checkout</h1>
      <p className="mt-2">This demo uses Razorpay sandbox. Replace `amountINR` with your cart total.</p>
      <button className="mt-4 bg-green-600 text-white px-4 py-2 rounded" onClick={handlePay}>Pay with Razorpay (Sandbox)</button>
    </div>
  )
}
