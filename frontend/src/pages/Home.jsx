import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'

export default function Home() {
  const [products, setProducts] = useState([])
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const { addToCart } = useCart()

  useEffect(() => {
    axios.get(import.meta.env.VITE_API_URL + '/products').then(r => setProducts(r.data)).catch(console.warn)
  }, [])

  const menProducts = products && Array.isArray(products) ? products.filter(p => p.categories && p.categories.includes('Men')).slice(0, 4) : []
  const womenProducts = products && Array.isArray(products) ? products.filter(p => p.categories && p.categories.includes('Women')).slice(0, 4) : []
  const kidsProducts = products && Array.isArray(products) ? products.filter(p => p.categories && p.categories.includes('Kids')).slice(0, 4) : []
  const bestSaleProducts = products && Array.isArray(products) ? products.filter(p => p.priceINR > 2000).slice(0, 4) : []

  const testimonials = [
    {
      name: 'Alice Johnson',
      text: 'Amazing AR try-on feature! I can see how clothes look on me before buying.',
      rating: 5,
      image: '👩‍💼'
    },
    {
      name: 'Bob Smith',
      text: 'Great quality products and fast delivery. Love the eco-friendly options!',
      rating: 5,
      image: '👨‍💻'
    },
    {
      name: 'Charlie Brown',
      text: 'The size recommendations are spot on. Perfect fit every time!',
      rating: 5,
      image: '👨‍🎨'
    },
    {
      name: 'Diana Wilson',
      text: 'Incredible shopping experience with virtual try-on. Highly recommended!',
      rating: 5,
      image: '👩‍🎤'
    }
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [testimonials.length])

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="container mx-auto text-center px-4 relative z-10">
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent animate-pulse">
            Welcome to AR Fashion
          </h1>
          <p className="text-xl mb-10 text-gray-300 max-w-2xl mx-auto">
            Experience fashion like never before with our cutting-edge AR try-on technology. Discover your perfect fit virtually.
          </p>
          <button className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-10 py-4 rounded-full font-semibold text-lg shadow-lg transform hover:scale-105 transition-all duration-200 animate-bounce">
            Shop Now
          </button>
        </div>
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-pink-500 rounded-full opacity-20 animate-ping"></div>
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-purple-500 rounded-full opacity-20 animate-pulse"></div>
      </section>

      {/* Best Sale Offers */}
      <section className="py-20 bg-gradient-to-r from-red-900 to-pink-900 relative">
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">🔥 FLASH SALE - UP TO 70% OFF!</h2>
            <p className="text-xl text-pink-200">Limited time offers on premium fashion items</p>
            <div className="flex justify-center items-center space-x-4 mt-6">
              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg px-4 py-2">
                <span className="text-2xl font-bold text-white">02</span>
                <span className="text-sm text-pink-200 block">Days</span>
              </div>
              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg px-4 py-2">
                <span className="text-2xl font-bold text-white">14</span>
                <span className="text-sm text-pink-200 block">Hours</span>
              </div>
              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg px-4 py-2">
                <span className="text-2xl font-bold text-white">35</span>
                <span className="text-sm text-pink-200 block">Minutes</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {bestSaleProducts.map(p => (
              <div key={p._id} className="bg-white bg-opacity-10 backdrop-blur-sm p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-white border-opacity-20">
                <div className="relative">
                  <img src={p.images?.[0] || 'https://via.placeholder.com/300'} alt={p.title} className="h-56 w-full object-cover rounded-xl mb-6" />
                  <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold animate-pulse">
                    SALE
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{p.title}</h3>
                <p className="text-gray-300 text-sm mb-4 line-clamp-2">{p.description}</p>
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <span className="text-2xl font-bold text-green-400">₹{Math.floor(p.priceINR * 0.7)}</span>
                    <span className="text-sm text-gray-400 line-through ml-2">₹{p.priceINR}</span>
                  </div>
                  <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">70% OFF</span>
                </div>
                <div className="flex space-x-3">
                  <button onClick={() => addToCart(p)} className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105">Add to Cart</button>
                  <Link to={'/product/' + p._id} className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105">View</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Categories */}
      <section className="py-20 bg-gradient-to-br from-gray-800 via-gray-900 to-black">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-white">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <Link to="/products?category=Women" className="group bg-gradient-to-br from-gray-700 to-gray-800 p-8 rounded-2xl shadow-xl text-center hover:shadow-2xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 border border-gray-600 hover:border-pink-500">
              <div className="text-6xl mb-4 group-hover:animate-bounce">👗</div>
              <h3 className="font-semibold text-xl text-white group-hover:text-pink-300 transition-colors">Women</h3>
              <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm text-gray-400">Explore elegant styles</div>
            </Link>
            <Link to="/products?category=Men" className="group bg-gradient-to-br from-gray-700 to-gray-800 p-8 rounded-2xl shadow-xl text-center hover:shadow-2xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 border border-gray-600 hover:border-pink-500">
              <div className="text-6xl mb-4 group-hover:animate-bounce">👔</div>
              <h3 className="font-semibold text-xl text-white group-hover:text-pink-300 transition-colors">Men</h3>
              <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm text-gray-400">Latest trends & classics</div>
            </Link>
            <Link to="/products?category=Kids" className="group bg-gradient-to-br from-gray-700 to-gray-800 p-8 rounded-2xl shadow-xl text-center hover:shadow-2xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 border border-gray-600 hover:border-pink-500">
              <div className="text-6xl mb-4 group-hover:animate-bounce">🧒</div>
              <h3 className="font-semibold text-xl text-white group-hover:text-pink-300 transition-colors">Kids</h3>
              <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm text-gray-400">Fun & comfortable wear</div>
            </Link>
            <Link to="/products?category=Accessories" className="group bg-gradient-to-br from-gray-700 to-gray-800 p-8 rounded-2xl shadow-xl text-center hover:shadow-2xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 border border-gray-600 hover:border-pink-500">
              <div className="text-6xl mb-4 group-hover:animate-bounce">👜</div>
              <h3 className="font-semibold text-xl text-white group-hover:text-pink-300 transition-colors">Accessories</h3>
              <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm text-gray-400">Complete your look</div>
            </Link>
          </div>
        </div>
      </section>

      {/* Men's Collection */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-4xl font-bold text-white">Men's Collection</h2>
            <Link to="/products?category=Men" className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105">
              View All Men's →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {menProducts.map(p => (
              <div key={p._id} className="bg-gradient-to-br from-gray-800 to-gray-700 p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-gray-600">
                <div className="relative">
                  <img src={p.images?.[0] || 'https://via.placeholder.com/300'} alt={p.title} className="h-56 w-full object-cover rounded-xl mb-6" />
                  {p.priceINR > 3000 && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                      Premium
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{p.title}</h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{p.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-3xl font-bold text-green-400">₹{p.priceINR}</span>
                  <div className="flex space-x-3">
                    <button onClick={() => addToCart(p)} className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105">Add to Cart</button>
                    <Link to={'/product/' + p._id} className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105">View</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Women's Collection */}
      <section className="py-20 bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-white">Women's Collection</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {womenProducts.map(p => (
              <div key={p._id} className="bg-gradient-to-br from-gray-700 to-gray-800 p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-gray-600">
                <img src={p.images?.[0] || 'https://via.placeholder.com/300'} alt={p.title} className="h-56 w-full object-cover rounded-xl mb-6" />
                <h3 className="text-xl font-semibold text-white mb-3">{p.title}</h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{p.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-3xl font-bold text-green-400">₹{p.priceINR}</span>
                  <div className="flex space-x-3">
                    <button onClick={() => addToCart(p)} className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105">Add to Cart</button>
                    <Link to={'/product/' + p._id} className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105">View</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Kids' Collection */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-white">Kids' Collection</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {kidsProducts.map(p => (
              <div key={p._id} className="bg-gradient-to-br from-gray-800 to-gray-700 p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-gray-600">
                <img src={p.images?.[0] || 'https://via.placeholder.com/300'} alt={p.title} className="h-56 w-full object-cover rounded-xl mb-6" />
                <h3 className="text-xl font-semibold text-white mb-3">{p.title}</h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{p.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-3xl font-bold text-green-400">₹{p.priceINR}</span>
                  <div className="flex space-x-3">
                    <button onClick={() => addToCart(p)} className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105">Add to Cart</button>
                    <Link to={'/product/' + p._id} className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105">View</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Slider */}
      <section className="py-20 bg-gray-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-pink-900/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-4xl font-bold text-center mb-12 text-white">What Our Customers Say</h2>
          <div className="relative max-w-4xl mx-auto">
            <div className="overflow-hidden rounded-2xl">
              <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentTestimonial * 100}%)` }}>
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="w-full flex-shrink-0">
                    <div className="bg-gradient-to-br from-gray-700 to-gray-800 p-12 rounded-2xl shadow-2xl border border-gray-600 mx-4">
                      <div className="flex items-center mb-6">
                        <img src={testimonial.image} alt={testimonial.name} className="w-16 h-16 rounded-full mr-6 border-2 border-pink-500" />
                        <div>
                          <h3 className="text-xl font-semibold text-white">{testimonial.name}</h3>
                          <div className="flex text-yellow-400 mb-2">
                            {[...Array(testimonial.rating)].map((_, i) => (
                              <span key={i}>⭐</span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-300 text-lg italic leading-relaxed mb-6">"{testimonial.text}"</p>
                      <p className="text-pink-400 font-medium">{testimonial.location}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-center mt-8 space-x-3">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    index === currentTestimonial ? 'bg-pink-500 scale-125' : 'bg-gray-600 hover:bg-gray-500'
                  }`}
                />
              ))}
            </div>
            <button
              onClick={() => setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
            >
              ‹
            </button>
            <button
              onClick={() => setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
            >
              ›
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-900 to-black py-12 border-t border-gray-700">
        <div className="container mx-auto text-center px-4">
          <p className="text-gray-400 text-lg">&copy; 2026 AR Fashion. All rights reserved.</p>
          <div className="mt-4 flex justify-center space-x-6">
            <a href="#" className="text-gray-400 hover:text-pink-400 transition-colors">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-pink-400 transition-colors">Terms of Service</a>
            <a href="#" className="text-gray-400 hover:text-pink-400 transition-colors">Contact Us</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
