import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function Cart(){
  const [cart, setCart] = useState([])

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart') || '[]')
    setCart(storedCart)
  }, [])

  const updateQuantity = (index, newQty) => {
    if (newQty < 1) return
    const newCart = [...cart]
    newCart[index].qty = newQty
    setCart(newCart)
    localStorage.setItem('cart', JSON.stringify(newCart))
    window.dispatchEvent(new Event('cartUpdated'))
  }

  const removeFromCart = (index) => {
    const newCart = [...cart]
    newCart.splice(index, 1)
    setCart(newCart)
    localStorage.setItem('cart', JSON.stringify(newCart))
    window.dispatchEvent(new Event('cartUpdated'))
  }

  const clearCart = () => {
    setCart([])
    localStorage.setItem('cart', JSON.stringify([]))
    window.dispatchEvent(new Event('cartUpdated'))
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
      {cart.length === 0 ? (
        <p className="text-gray-500">Your cart is empty. <Link to="/" className="text-blue-600">Continue shopping</Link></p>
      ) : (
        <>
          <div className="space-y-4">
            {cart.map((item, index) => (
              <div key={index} className="flex items-center justify-between bg-white p-4 rounded-lg shadow">
                <div className="flex-1">
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-gray-600">₹{item.price} each</p>
                  {item.size && <p className="text-sm text-gray-500">Size: {item.size}</p>}
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <button onClick={() => updateQuantity(index, item.qty - 1)} className="bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded">-</button>
                    <span className="w-8 text-center">{item.qty}</span>
                    <button onClick={() => updateQuantity(index, item.qty + 1)} className="bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded">+</button>
                  </div>
                  <span className="font-semibold w-20 text-right">₹{item.price * item.qty}</span>
                  <button onClick={() => removeFromCart(index)} className="text-red-600 hover:text-red-800 ml-4">Remove</button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 flex justify-between items-center">
            <button onClick={clearCart} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">Clear Cart</button>
            <div className="text-xl font-bold">Total: ₹{total}</div>
            <Link to="/checkout" className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700">Proceed to Checkout</Link>
          </div>
        </>
      )}
    </div>
  )
}
