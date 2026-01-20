import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import ProductPage from './pages/Product'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import TryOn from './pages/TryOn'
import Admin from './pages/Admin'
import Contact from './pages/Contact'
import { useCart } from './contexts/CartContext'

export default function App() {
  const { getItemCount } = useCart()
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <nav className="bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 shadow-lg p-4 sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-3 hover:scale-105 transition-transform duration-200">
            <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">AR</span>
            </div>
            <span className="text-white font-bold text-2xl hover:text-pink-300 transition-colors">Fashion</span>
          </Link>
          <div className="flex items-center space-x-6">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search products..." 
                className="px-4 py-2 rounded-lg bg-gray-800 text-white placeholder-gray-400 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200" 
              />
              <svg className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <Link to="/tryon" className="text-white hover:text-pink-300 transition-colors font-medium">Try-On</Link>
            <Link to="/contact" className="text-white hover:text-pink-300 transition-colors font-medium">Contact</Link>
            <Link to="/admin" className="text-white hover:text-pink-300 transition-colors font-medium">Admin</Link>
            <Link to="/cart" className="text-white text-2xl hover:text-pink-300 transition-colors relative">
              🛒
              {getItemCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold">
                  {getItemCount()}
                </span>
              )}
            </Link>
          </div>
        </div>
      </nav>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/tryon" element={<TryOn />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
    </div>
  )
}
