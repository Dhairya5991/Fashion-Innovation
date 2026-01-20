import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

export default function Home() {
  const [products, setProducts] = useState([])
  useEffect(() => {
    axios.get(import.meta.env.VITE_API_URL + '/products').then(r => setProducts(r.data)).catch(console.warn)
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {products.map(p => (
          <div key={p._id} className="bg-white p-4 rounded shadow">
            <img src={p.images?.[0] || 'https://via.placeholder.com/300'} alt="" className="h-48 w-full object-cover rounded" />
            <h3 className="mt-2 font-semibold">{p.title}</h3>
            <p>₹{p.priceINR}</p>
            <Link to={'/product/' + p._id} className="text-blue-600">View</Link>
          </div>
        ))}
      </div>
    </div>
  )
}
