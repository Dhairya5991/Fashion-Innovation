import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'

export default function ProductPage() {
  const { id } = useParams()
  const [p, setP] = useState(null)
  useEffect(() => {
    axios.get(import.meta.env.VITE_API_URL + '/products/' + id).then(r => setP(r.data)).catch(console.warn)
  }, [id])

  if (!p) return <div>Loading...</div>
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div>
        <img src={p.images?.[0] || 'https://via.placeholder.com/600'} alt="" className="w-full rounded" />
      </div>
      <div>
        <h1 className="text-2xl font-bold">{p.title}</h1>
        <p className="mt-2">{p.description}</p>
        <p className="mt-4 font-semibold">₹{p.priceINR}</p>
        <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded" onClick={() => {
          // simple localStorage cart
          const cart = JSON.parse(localStorage.getItem('cart') || '[]')
          cart.push({ productId: p._id, title: p.title, price: p.priceINR, qty: 1 })
          localStorage.setItem('cart', JSON.stringify(cart))
          alert('Added to cart')
        }}>Add to cart</button>
      </div>
    </div>
  )
}
