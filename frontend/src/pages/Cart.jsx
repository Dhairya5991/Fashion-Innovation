import React from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, clearCart, getTotal } = useCart()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
      {cart.length === 0 ? (
        <p className="text-gray-500">Your cart is empty. <Link to="/" className="text-blue-600">Continue shopping</Link></p>
      ) : (
        <>
          <div className="space-y-4">
            {cart.map((item) => (
              <div key={item._id} className="flex items-center justify-between bg-white p-4 rounded-lg shadow">
                <div className="flex items-center space-x-4">
                  <img src={item.images?.[0] || 'https://via.placeholder.com/100'} alt={item.title} className="w-16 h-16 object-cover rounded" />
                  <div>
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-gray-600">₹{item.priceINR} each</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <button onClick={() => updateQuantity(item._id, item.quantity - 1)} className="bg-gray-200 px-2 py-1 rounded">-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item._id, item.quantity + 1)} className="bg-gray-200 px-2 py-1 rounded">+</button>
                  </div>
                  <span className="font-semibold">₹{item.priceINR * item.quantity}</span>
                  <button onClick={() => removeFromCart(item._id)} className="text-red-600 hover:text-red-800">Remove</button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 flex justify-between items-center">
            <button onClick={clearCart} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Clear Cart</button>
            <div className="text-right">
              <p className="text-xl font-bold">Total: ₹{getTotal()}</p>
              <Link to="/checkout" className="bg-green-500 text-white px-6 py-3 rounded hover:bg-green-600 inline-block mt-2">Proceed to Checkout</Link>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
