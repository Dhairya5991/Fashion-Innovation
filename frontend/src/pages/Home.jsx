import React, { useEffect, useState, useMemo } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import Logo from '../components/Logo'

export default function Home() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [sortBy, setSortBy] = useState('name')
  const [priceRange, setPriceRange] = useState([0, 10000])
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    axios.get(import.meta.env.VITE_API_URL + '/products').then(r => {
      setProducts(r.data)
      setLoading(false)
    }).catch(err => {
      console.warn(err)
      // Fallback dummy products
      setProducts([
        {
          _id: '1',
          title: 'Elegant Red Dress',
          description: 'A stunning red dress perfect for evening events.',
          priceINR: 2999,
          originalPrice: 3999,
          images: ['https://via.placeholder.com/300/ff0000/ffffff?text=Red+Dress'],
          sizes: ['S', 'M', 'L', 'XL', 'XXL'],
          categories: ['Dresses', 'Women', 'Evening Wear'],
          rating: 4.5,
          reviews: 24,
          isOnSale: true,
          isFeatured: true
        },
        {
          _id: '2',
          title: 'Casual Blue Jeans',
          description: 'Comfortable blue jeans for everyday wear.',
          priceINR: 1999,
          images: ['https://via.placeholder.com/300/0000ff/ffffff?text=Blue+Jeans'],
          sizes: ['S', 'M', 'L', 'XL', 'XXL'],
          categories: ['Pants', 'Men', 'Casual'],
          rating: 4.2,
          reviews: 18,
          isOnSale: false,
          isFeatured: true
        },
        {
          _id: '3',
          title: 'White Sneakers',
          description: 'Stylish white sneakers with great comfort.',
          priceINR: 3499,
          originalPrice: 4499,
          images: ['https://via.placeholder.com/300/ffffff/000000?text=White+Sneakers'],
          sizes: ['S', 'M', 'L', 'XL', 'XXL'],
          categories: ['Shoes', 'Men', 'Casual'],
          rating: 4.8,
          reviews: 32,
          isOnSale: true,
          isFeatured: false
        },
        {
          _id: '4',
          title: 'Men\'s Formal Shirt',
          description: 'Classic white formal shirt for professional occasions.',
          priceINR: 1499,
          images: ['https://via.placeholder.com/300/ffffff/000000?text=Mens+Shirt'],
          sizes: ['S', 'M', 'L', 'XL', 'XXL'],
          categories: ['Shirts', 'Men', 'Formal'],
          rating: 4.3,
          reviews: 15,
          isOnSale: false,
          isFeatured: true
        },
        {
          _id: '5',
          title: 'Women\'s Summer Skirt',
          description: 'Light and airy floral skirt for summer days.',
          priceINR: 1299,
          images: ['https://via.placeholder.com/300/ff69b4/ffffff?text=Summer+Skirt'],
          sizes: ['S', 'M', 'L', 'XL', 'XXL'],
          categories: ['Skirts', 'Women', 'Summer'],
          rating: 4.6,
          reviews: 21,
          isOnSale: false,
          isFeatured: false
        },
        {
          _id: '6',
          title: 'Men\'s Leather Jacket',
          description: 'Classic black leather jacket for a bold look.',
          priceINR: 4999,
          originalPrice: 6999,
          images: ['https://via.placeholder.com/300/000000/ffffff?text=Leather+Jacket'],
          sizes: ['S', 'M', 'L', 'XL', 'XXL'],
          categories: ['Jackets', 'Men', 'Outerwear'],
          rating: 4.7,
          reviews: 28,
          isOnSale: true,
          isFeatured: true
        },
        {
          _id: '7',
          title: 'Women\'s Blouse',
          description: 'Elegant silk blouse for casual and formal wear.',
          priceINR: 1899,
          images: ['https://via.placeholder.com/300/ffb6c1/ffffff?text=Silk+Blouse'],
          sizes: ['S', 'M', 'L', 'XL', 'XXL'],
          categories: ['Tops', 'Women', 'Blouses'],
          rating: 4.4,
          reviews: 19,
          isOnSale: false,
          isFeatured: false
        },
        {
          _id: '8',
          title: 'Men\'s Chinos',
          description: 'Comfortable khaki chinos for smart casual looks.',
          priceINR: 2299,
          images: ['https://via.placeholder.com/300/d2b48c/ffffff?text=Khaki+Chinos'],
          sizes: ['S', 'M', 'L', 'XL', 'XXL'],
          categories: ['Pants', 'Men', 'Chinos'],
          rating: 4.1,
          reviews: 12,
          isOnSale: false,
          isFeatured: true
        }
      ])
      setLoading(false)
    })
  }, [])

  // Get unique categories
  const categories = useMemo(() => {
    if (!Array.isArray(products)) return ['All']
    const allCategories = products.flatMap(p => p.categories || [])
    return ['All', ...new Set(allCategories)]
  }, [products])

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    if (!Array.isArray(products)) return []

    let filtered = products.filter(p => {
      const inCategory = selectedCategory === 'All' || (p.categories && p.categories.includes(selectedCategory))
      const inPriceRange = p.priceINR >= priceRange[0] && p.priceINR <= priceRange[1]
      const matchesSearch = searchTerm === '' ||
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.categories && p.categories.some(cat => cat.toLowerCase().includes(searchTerm.toLowerCase())))
      return inCategory && inPriceRange && matchesSearch
    })

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.priceINR - b.priceINR
        case 'price-high':
          return b.priceINR - a.priceINR
        case 'name':
        default:
          return a.title.localeCompare(b.title)
      }
    })

    return filtered
  }, [products, selectedCategory, sortBy, priceRange, searchTerm])

  // Get featured products
  const featuredProducts = useMemo(() => {
    return products.filter(p => p.isFeatured).slice(0, 4)
  }, [products])

  // Get sale products
  const saleProducts = useMemo(() => {
    return products.filter(p => p.isOnSale).slice(0, 4)
  }, [products])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg key={i} className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative container mx-auto px-4 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                Discover Your Perfect Style with
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                  AR Fashion
                </span>
              </h1>
              <p className="text-xl text-gray-100 max-w-lg">
                Experience the future of fashion shopping with our revolutionary AR try-on technology.
                Find your perfect fit virtually before you buy.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/tryon" className="bg-white text-indigo-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg">
                  Try On AR
                </Link>
                <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-indigo-600 transition-all duration-300">
                  Shop Collection
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="relative z-10">
                <Logo className="w-32 h-32 text-white mx-auto mb-8" />
              </div>
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-yellow-400 rounded-full opacity-20 animate-pulse"></div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-pink-400 rounded-full opacity-20 animate-pulse delay-1000"></div>
            </div>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full -translate-y-48 translate-x-48"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white opacity-5 rounded-full translate-y-32 -translate-x-32"></div>
      </div>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: 'Women', icon: '👗', count: '120+', color: 'from-pink-500 to-rose-500' },
              { name: 'Men', icon: '👔', count: '95+', color: 'from-blue-500 to-indigo-500' },
              { name: 'Kids', icon: '🧸', count: '60+', color: 'from-green-500 to-emerald-500' },
              { name: 'Accessories', icon: '👜', count: '40+', color: 'from-purple-500 to-violet-500' }
            ].map((category) => (
              <div key={category.name} className={`bg-gradient-to-br ${category.color} rounded-xl p-6 text-white text-center hover:scale-105 transition-transform duration-300 cursor-pointer shadow-lg`}>
                <div className="text-4xl mb-3">{category.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
                <p className="text-sm opacity-90">{category.count} Items</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Collections */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Featured Collections</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our carefully curated collections featuring the latest trends and timeless classics
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map(p => (
              <div key={p._id} className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
                <div className="relative">
                  <img src={p.images?.[0] || 'https://via.placeholder.com/300'} alt="" className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300" />
                  {p.isOnSale && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                      SALE
                    </div>
                  )}
                  <div className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2 text-gray-800 group-hover:text-indigo-600 transition-colors">{p.title}</h3>
                  <div className="flex items-center mb-2">
                    <div className="flex items-center mr-2">
                      {renderStars(p.rating)}
                    </div>
                    <span className="text-sm text-gray-600">({p.reviews})</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-indigo-600">₹{p.priceINR}</span>
                      {p.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">₹{p.originalPrice}</span>
                      )}
                    </div>
                  </div>
                  <Link to={'/product/' + p._id} className="mt-3 w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors duration-300 block text-center">
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Sales This Week */}
      <section className="py-16 bg-gradient-to-r from-orange-50 to-red-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">🔥 Top Sales This Week</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Don't miss out on our best-selling items with amazing discounts this week
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {saleProducts.map(p => (
              <div key={p._id} className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border-2 border-orange-200">
                <div className="relative">
                  <img src={p.images?.[0] || 'https://via.placeholder.com/300'} alt="" className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute top-3 left-3 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {Math.round(((p.originalPrice - p.priceINR) / p.originalPrice) * 100)}% OFF
                  </div>
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2 text-gray-800">{p.title}</h3>
                  <div className="flex items-center mb-2">
                    <div className="flex items-center mr-2">
                      {renderStars(p.rating)}
                    </div>
                    <span className="text-sm text-gray-600">({p.reviews})</span>
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-orange-600">₹{p.priceINR}</span>
                      <span className="text-sm text-gray-500 line-through">₹{p.originalPrice}</span>
                    </div>
                  </div>
                  <Link to={'/product/' + p._id} className="w-full bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors duration-300 block text-center">
                    Shop Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What Our Customers Say</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Hear from our satisfied customers about their AR fashion experience
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "Fashion Blogger",
                content: "The AR try-on feature is revolutionary! I can now shop confidently knowing exactly how clothes will look on me.",
                rating: 5,
                avatar: "SJ"
              },
              {
                name: "Mike Chen",
                role: "Tech Enthusiast",
                content: "As someone who's always struggled with online shopping, this AR technology has completely changed my experience.",
                rating: 5,
                avatar: "MC"
              },
              {
                name: "Emma Davis",
                role: "Working Professional",
                content: "The quality of products and the innovative technology make AR Fashion my go-to shopping destination.",
                rating: 5,
                avatar: "ED"
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-gray-800 rounded-xl p-6 hover:bg-gray-750 transition-colors duration-300">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-lg font-semibold mr-4">
                    {testimonial.avatar}
                  </div>
                  <div className="flex items-center">
                    {renderStars(testimonial.rating)}
                  </div>
                </div>
                <p className="text-gray-300 mb-4 italic">"{testimonial.content}"</p>
                <div>
                  <h4 className="font-semibold text-white">{testimonial.name}</h4>
                  <p className="text-gray-400 text-sm">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Customer Reviews</h2>
            <div className="flex items-center justify-center mb-4">
              <div className="flex items-center mr-4">
                {renderStars(4.6)}
              </div>
              <span className="text-2xl font-bold text-gray-800">4.6</span>
              <span className="text-gray-600 ml-2">(2,847 reviews)</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                product: "Elegant Red Dress",
                reviewer: "Lisa M.",
                rating: 5,
                comment: "Absolutely love this dress! The AR try-on helped me see exactly how it would fit. Perfect for my evening event.",
                date: "2 weeks ago",
                verified: true
              },
              {
                product: "Casual Blue Jeans",
                reviewer: "David K.",
                rating: 4,
                comment: "Great quality jeans. The fit was exactly as shown in the AR preview. Very comfortable for everyday wear.",
                date: "1 week ago",
                verified: true
              },
              {
                product: "White Sneakers",
                reviewer: "Anna R.",
                rating: 5,
                comment: "These sneakers are amazing! The AR feature showed me the perfect size, and they're even better in person.",
                date: "3 days ago",
                verified: true
              }
            ].map((review, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-800">{review.product}</h4>
                  <div className="flex items-center">
                    {renderStars(review.rating)}
                  </div>
                </div>
                <p className="text-gray-600 mb-3">"{review.comment}"</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="font-medium text-gray-800 mr-2">{review.reviewer}</span>
                    {review.verified && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Verified Purchase</span>
                    )}
                  </div>
                  <span className="text-sm text-gray-500">{review.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Search and Filters Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Discover Our Fashion Collection</h2>

          {/* Filters and Sort */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg"
                />
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="name">Name (A-Z)</option>
                  <option value="price-low">Price (Low to High)</option>
                  <option value="price-high">Price (High to Low)</option>
                </select>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Min Price: ₹{priceRange[0]}</label>
                <input
                  type="range"
                  min="0"
                  max="10000"
                  step="100"
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Max Price: ₹{priceRange[1]}</label>
                <input
                  type="range"
                  min="0"
                  max="10000"
                  step="100"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full"
                />
              </div>
            </div>

            {/* Active Filters Display */}
            <div className="mt-4 flex flex-wrap gap-2">
              {searchTerm && (
                <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                  Search: "{searchTerm}"
                  <button onClick={() => setSearchTerm('')} className="ml-2 text-yellow-600 hover:text-yellow-800">×</button>
                </span>
              )}
              {selectedCategory !== 'All' && (
                <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm">
                  Category: {selectedCategory}
                  <button onClick={() => setSelectedCategory('All')} className="ml-2 text-indigo-600 hover:text-indigo-800">×</button>
                </span>
              )}
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                Price: ₹{priceRange[0]} - ₹{priceRange[1]}
              </span>
              <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                Sort: {sortBy === 'name' ? 'Name' : sortBy === 'price-low' ? 'Price Low' : 'Price High'}
              </span>
            </div>
          </div>

          {/* Products Grid */}
          <div className="mb-4 flex justify-between items-center">
            <p className="text-gray-600">
              Showing {filteredAndSortedProducts.length} of {Array.isArray(products) ? products.length : 0} products
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredAndSortedProducts.map(p => (
              <div key={p._id} className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
                <div className="relative">
                  <img src={p.images?.[0] || 'https://via.placeholder.com/300'} alt="" className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300" />
                  {p.isOnSale && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                      SALE
                    </div>
                  )}
                  <div className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2 text-gray-800 group-hover:text-indigo-600 transition-colors">{p.title}</h3>
                  <div className="flex items-center mb-2">
                    <div className="flex items-center mr-2">
                      {renderStars(p.rating)}
                    </div>
                    <span className="text-sm text-gray-600">({p.reviews})</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-indigo-600">₹{p.priceINR}</span>
                      {p.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">₹{p.originalPrice}</span>
                      )}
                    </div>
                  </div>
                  <Link to={'/product/' + p._id} className="mt-3 w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors duration-300 block text-center">
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {filteredAndSortedProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No products match your current filters.</p>
              <button
                onClick={() => {
                  setSelectedCategory('All')
                  setSortBy('name')
                  setPriceRange([0, 10000])
                  setSearchTerm('')
                }}
                className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
