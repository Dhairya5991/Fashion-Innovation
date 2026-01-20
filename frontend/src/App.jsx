import React, { useState, useEffect } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import ProductPage from './pages/Product'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import TryOn from './pages/TryOn'
import Admin from './pages/Admin'
import Logo from './components/Logo'
import Footer from './components/Footer'

export default function App() {
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]')
      const count = cart.reduce((sum, item) => sum + item.qty, 0)
      setCartCount(count)
    }
    
    updateCartCount()
    window.addEventListener('storage', updateCartCount)
    window.addEventListener('cartUpdated', updateCartCount)
    return () => {
      window.removeEventListener('storage', updateCartCount)
      window.removeEventListener('cartUpdated', updateCartCount)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <nav className="bg-white shadow-lg border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
            <Logo variant="text" />
            <span className="text-xs text-gray-500 ml-1 leading-tight">Innovation</span>
          </Link>
          <div className="flex items-center space-x-6">
            <Link to="/tryon" className="text-gray-700 hover:text-indigo-600 transition-colors font-medium">Try-On</Link>
            <Link to="/admin" className="text-gray-700 hover:text-indigo-600 transition-colors font-medium">Admin</Link>
            <Link to="/cart" className="text-gray-700 hover:text-indigo-600 transition-colors flex items-center relative">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5H19M7 13v8a2 2 0 002 2h10a2 2 0 002-2v-3" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </nav>
      <main className="container mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/tryon" element={<TryOn />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
