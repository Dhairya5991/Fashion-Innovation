import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'

export default function ProductPage() {
  const { id } = useParams()
  const [p, setP] = useState(null)
  const [selectedSize, setSelectedSize] = useState('')
  useEffect(() => {
    axios.get(import.meta.env.VITE_API_URL + '/products/' + id).then(r => {
      setP(r.data)
      if (r.data.sizes && r.data.sizes.length > 0) {
        setSelectedSize(r.data.sizes[0])
      }
    }).catch(console.warn)
  }, [id])

  if (!p) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>

  const addToCart = () => {
    if (!selectedSize && p.sizes && p.sizes.length > 0) {
      alert('Please select a size')
      return
    }
    // simple localStorage cart
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    cart.push({ productId: p._id, title: p.title, price: p.priceINR, qty: 1, size: selectedSize })
    localStorage.setItem('cart', JSON.stringify(cart))
    // Dispatch custom event to update cart count
    window.dispatchEvent(new Event('cartUpdated'))
    alert('Added to cart')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <img src={p.images?.[0] || 'https://via.placeholder.com/600'} alt="" className="w-full rounded-lg shadow-lg" />
        </div>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{p.title}</h1>
            <p className="text-gray-600 mt-2">{p.description}</p>
            <p className="text-3xl font-bold text-green-600 mt-4">₹{p.priceINR}</p>
          </div>

          {p.sizes && p.sizes.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Size</label>
              <div className="flex flex-wrap gap-2">
                {p.sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border rounded-lg transition-colors ${selectedSize === size ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex space-x-4">
            <button 
              onClick={addToCart} 
              className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Add to Cart
            </button>
            {p.arModels && p.arModels.length > 0 && (
              <Link 
                to="/tryon" 
                state={{ selectedProduct: p }}
                className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium"
              >
                Try On AR
              </Link>
            )}
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Product Details</h3>
            <ul className="text-sm space-y-1 text-gray-600">
              <li>• SKU: {p.sku}</li>
              <li>• Category: {p.categories?.join(', ')}</li>
              <li>• In Stock: {p.inventory} units</li>
              {p.ecoTag && <li>• {p.ecoTag}</li>}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
