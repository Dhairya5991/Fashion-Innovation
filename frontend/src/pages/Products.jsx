import React, { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import axios from 'axios'
import { useCart } from '../contexts/CartContext'

export default function Products() {
  const [searchParams] = useSearchParams()
  const category = searchParams.get('category')
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const { addToCart } = useCart()

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    filterProducts()
  }, [products, category])

  const fetchProducts = async () => {
    try {
      const response = await axios.get(import.meta.env.VITE_API_URL + '/products')
      setProducts(response.data)
    } catch (error) {
      console.error('Error fetching products:', error)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  const filterProducts = () => {
    if (!Array.isArray(products)) {
      setFilteredProducts([])
      return
    }

    if (category) {
      const filtered = products.filter(p =>
        p.categories && Array.isArray(p.categories) &&
        p.categories.some(cat => cat.toLowerCase() === category.toLowerCase())
      )
      setFilteredProducts(filtered)
    } else {
      setFilteredProducts(products)
    }
  }

  const getCategoryTitle = () => {
    if (!category) return 'All Products'
    return `${category.charAt(0).toUpperCase() + category.slice(1)}'s Collection`
  }

  const getCategoryDescription = () => {
    switch (category?.toLowerCase()) {
      case 'men':
        return 'Discover the latest trends in men\'s fashion with our curated collection of clothing and accessories.'
      case 'women':
        return 'Explore elegant and stylish women\'s wear, from casual outfits to formal attire.'
      case 'kids':
        return 'Adorable and comfortable clothing for kids, designed for play and everyday adventures.'
      case 'accessories':
        return 'Complete your look with our range of fashion accessories and complementary items.'
      default:
        return 'Browse our complete collection of fashion products with AR try-on capabilities.'
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 text-white py-16">
        <div className="container mx-auto text-center px-4">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
            {getCategoryTitle()}
          </h1>
          <p className="text-xl mb-8 text-gray-300 max-w-2xl mx-auto">
            {getCategoryDescription()}
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              to="/tryon"
              className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-8 py-3 rounded-full font-semibold transition-all duration-200 transform hover:scale-105"
            >
              Try On Virtually
            </Link>
            <Link
              to="/"
              className="bg-white bg-opacity-20 backdrop-blur-sm hover:bg-opacity-30 text-white px-8 py-3 rounded-full font-semibold transition-all duration-200"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🛍️</div>
              <h2 className="text-3xl font-bold text-white mb-4">No Products Found</h2>
              <p className="text-gray-400 mb-8">We couldn't find any products in this category.</p>
              <Link
                to="/"
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200"
              >
                Browse All Products
              </Link>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-white">
                  {filteredProducts.length} Product{filteredProducts.length !== 1 ? 's' : ''} Found
                </h2>
                <div className="flex space-x-4">
                  <select className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700">
                    <option>Sort by: Featured</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                    <option>Newest First</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {filteredProducts.map(p => (
                  <div key={p._id} className="bg-gradient-to-br from-gray-800 to-gray-700 p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-gray-600">
                    <div className="relative">
                      <img
                        src={p.images?.[0] || 'https://via.placeholder.com/300'}
                        alt={p.title}
                        className="h-56 w-full object-cover rounded-xl mb-6"
                      />
                      {p.priceINR > 2000 && (
                        <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                          SALE
                        </div>
                      )}
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-3 line-clamp-2">{p.title}</h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">{p.description}</p>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-3xl font-bold text-green-400">₹{p.priceINR}</span>
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => addToCart(p)}
                        className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105"
                      >
                        Add to Cart
                      </button>
                      <Link
                        to={'/product/' + p._id}
                        className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Related Categories */}
      <section className="py-16 bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">Explore Other Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: 'Men', emoji: '👔', color: 'from-blue-600 to-purple-600' },
              { name: 'Women', emoji: '👗', color: 'from-pink-600 to-red-600' },
              { name: 'Kids', emoji: '🧒', color: 'from-green-600 to-teal-600' },
              { name: 'Accessories', emoji: '👜', color: 'from-yellow-600 to-orange-600' }
            ].filter(cat => cat.name.toLowerCase() !== category?.toLowerCase()).map(cat => (
              <Link
                key={cat.name}
                to={`/products?category=${cat.name}`}
                className={`bg-gradient-to-br ${cat.color} p-6 rounded-2xl text-white text-center hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl`}
              >
                <div className="text-4xl mb-3">{cat.emoji}</div>
                <h3 className="font-semibold text-lg">{cat.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}