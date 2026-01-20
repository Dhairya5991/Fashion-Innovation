import React from 'react'
import { Link } from 'react-router-dom'
import Logo from './Logo'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-4">Stay in Style</h3>
            <p className="text-gray-100 mb-6 max-w-2xl mx-auto">
              Subscribe to our newsletter and be the first to know about new arrivals, exclusive deals, and AR fashion trends.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-1">
              <div className="flex items-center mb-6">
                <Logo className="w-10 h-10 text-white mr-3" />
                <div>
                  <h3 className="font-bold text-xl">AR Fashion</h3>
                  <p className="text-sm text-gray-400">Innovation in Fashion</p>
                </div>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Experience the future of fashion shopping with our revolutionary AR try-on technology.
                Find your perfect fit virtually before you buy.
              </p>
              <div className="flex space-x-4">
                {[
                  { icon: 'facebook', color: 'hover:text-blue-400' },
                  { icon: 'twitter', color: 'hover:text-blue-300' },
                  { icon: 'instagram', color: 'hover:text-pink-400' },
                  { icon: 'youtube', color: 'hover:text-red-400' }
                ].map((social) => (
                  <a key={social.icon} href="#" className={`text-gray-400 ${social.color} transition-colors duration-300`}>
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                    </svg>
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-lg mb-6">Quick Links</h4>
              <ul className="space-y-3">
                {[
                  { name: 'Home', path: '/' },
                  { name: 'AR Try-On', path: '/tryon' },
                  { name: 'Shop', path: '/' },
                  { name: 'Cart', path: '/cart' },
                  { name: 'Checkout', path: '/checkout' },
                  { name: 'Admin', path: '/admin' }
                ].map((link) => (
                  <li key={link.name}>
                    <Link to={link.path} className="text-gray-400 hover:text-white transition-colors duration-300">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Categories */}
            <div>
              <h4 className="font-semibold text-lg mb-6">Categories</h4>
              <ul className="space-y-3">
                {[
                  'Women\'s Fashion',
                  'Men\'s Fashion',
                  'Kids\' Fashion',
                  'Accessories',
                  'Shoes',
                  'Sustainable Fashion'
                ].map((category) => (
                  <li key={category}>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                      {category}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Customer Service */}
            <div>
              <h4 className="font-semibold text-lg mb-6">Customer Service</h4>
              <ul className="space-y-3">
                {[
                  'Contact Us',
                  'Size Guide',
                  'Shipping Info',
                  'Returns & Exchanges',
                  'FAQ',
                  'Privacy Policy'
                ].map((service) => (
                  <li key={service}>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                      {service}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2026 AR Fashion. All rights reserved. Pioneering the future of fashion retail.
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-gray-400">Secure Payments</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 00-1 1v1h-1a1 1 0 100 2h1v1a1 1 0 102 0V6h1a1 1 0 100-2h-1V3a1 1 0 00-1-1zm0 10a1 1 0 00-1 1v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1v-1a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-gray-400">Free Shipping</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-gray-400">AR Technology</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}