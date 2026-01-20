import React, { useState, useEffect } from 'react'
import axios from 'axios'

export default function Admin() {
  const [products, setProducts] = useState([])
  const [form, setForm] = useState({
    title: '',
    description: '',
    priceINR: '',
    images: [''],
    inventory: '',
    categories: [''],
    sku: '',
    arModels: [{ url: '', format: 'glb' }],
    ecoTag: ''
  })

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = () => {
    axios.get(import.meta.env.VITE_API_URL + '/products').then(r => setProducts(r.data)).catch(console.warn)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    axios.post(import.meta.env.VITE_API_URL + '/products', form).then(() => {
      fetchProducts()
      setForm({
        title: '',
        description: '',
        priceINR: '',
        images: [''],
        inventory: '',
        categories: [''],
        sku: '',
        arModels: [{ url: '', format: 'glb' }],
        ecoTag: ''
      })
    }).catch(console.error)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleArrayChange = (field, index, value) => {
    setForm(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }))
  }

  const addArrayItem = (field) => {
    setForm(prev => ({
      ...prev,
      [field]: [...prev[field], field === 'arModels' ? { url: '', format: 'glb' } : '']
    }))
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Add New Product</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" name="title" value={form.title} onChange={handleChange} placeholder="Title" className="w-full p-2 border rounded" required />
            <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="w-full p-2 border rounded" required />
            <input type="number" name="priceINR" value={form.priceINR} onChange={handleChange} placeholder="Price (INR)" className="w-full p-2 border rounded" required />
            <input type="number" name="inventory" value={form.inventory} onChange={handleChange} placeholder="Inventory" className="w-full p-2 border rounded" required />
            <input type="text" name="sku" value={form.sku} onChange={handleChange} placeholder="SKU" className="w-full p-2 border rounded" required />
            <input type="text" name="ecoTag" value={form.ecoTag} onChange={handleChange} placeholder="Eco Tag" className="w-full p-2 border rounded" />

            <div>
              <label>Images:</label>
              {form.images.map((img, i) => (
                <input key={i} type="url" value={img} onChange={(e) => handleArrayChange('images', i, e.target.value)} placeholder="Image URL" className="w-full p-2 border rounded mt-1" />
              ))}
              <button type="button" onClick={() => addArrayItem('images')} className="mt-2 bg-blue-500 text-white px-3 py-1 rounded">Add Image</button>
            </div>

            <div>
              <label>Categories:</label>
              {form.categories.map((cat, i) => (
                <input key={i} type="text" value={cat} onChange={(e) => handleArrayChange('categories', i, e.target.value)} placeholder="Category" className="w-full p-2 border rounded mt-1" />
              ))}
              <button type="button" onClick={() => addArrayItem('categories')} className="mt-2 bg-blue-500 text-white px-3 py-1 rounded">Add Category</button>
            </div>

            <div>
              <label>AR Models:</label>
              {form.arModels.map((model, i) => (
                <div key={i} className="flex space-x-2 mt-1">
                  <input type="url" value={model.url} onChange={(e) => handleArrayChange('arModels', i, { ...model, url: e.target.value })} placeholder="Model URL" className="flex-1 p-2 border rounded" />
                  <input type="text" value={model.format} onChange={(e) => handleArrayChange('arModels', i, { ...model, format: e.target.value })} placeholder="Format" className="w-20 p-2 border rounded" />
                </div>
              ))}
              <button type="button" onClick={() => addArrayItem('arModels')} className="mt-2 bg-blue-500 text-white px-3 py-1 rounded">Add AR Model</button>
            </div>

            <button type="submit" className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600">Add Product</button>
          </form>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Existing Products ({Array.isArray(products) ? products.length : 0})</h2>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {Array.isArray(products) && products.length > 0 ? (
              products.map(p => (
                <div key={p._id} className="bg-white p-4 rounded shadow">
                  <h3 className="font-semibold">{p.title}</h3>
                  <p>₹{p.priceINR} - Stock: {p.inventory}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                Loading products...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
