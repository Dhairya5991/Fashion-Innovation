import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import ARMirror from '../components/ARMirror'
import { recommendSize } from '../utils/sizeModel'
import axios from 'axios'

export default function TryOn(){
  const location = useLocation()
  const [suggestion, setSuggestion] = useState(null)
  const [products, setProducts] = useState([])
  const [selectedProduct, setSelectedProduct] = useState(location.state?.selectedProduct || null)

  useEffect(()=>{
    // Fetch products for try-on selection
    axios.get(import.meta.env.VITE_API_URL + '/products').then(r => {
      setProducts(r.data)
      // If no product selected and we have products, select first one
      if (!selectedProduct && r.data.length > 0) {
        setSelectedProduct(r.data[0])
      }
    }).catch(err => {
      console.warn(err)
      // Fallback products
      const fallbackProducts = [
        { _id: '1', title: 'Elegant Red Dress', arModels: [{ url: 'https://example.com/red-dress.glb' }] },
        { _id: '2', title: 'Casual Blue Jeans', arModels: [{ url: 'https://example.com/blue-jeans.glb' }] }
      ]
      setProducts(fallbackProducts)
      if (!selectedProduct) {
        setSelectedProduct(fallbackProducts[0])
      }
    })

    function handler(e){
      const metrics = e.detail
      const r = recommendSize(metrics)
      setSuggestion(r)
    }
    window.addEventListener('poseMetrics', handler)
    return ()=> window.removeEventListener('poseMetrics', handler)
  },[])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">AR Try-On Experience</h1>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ARMirror modelUrl={selectedProduct?.arModels?.[0]?.url} />
        </div>
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold mb-4">Select Product to Try On</h2>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {products.map(p => (
                <button
                  key={p._id}
                  onClick={() => setSelectedProduct(p)}
                  className={`w-full text-left p-3 rounded-lg border ${selectedProduct?._id === p._id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}
                >
                  <div className="font-medium">{p.title}</div>
                  <div className="text-sm text-gray-600">₹{p.priceINR}</div>
                </button>
              ))}
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold mb-2">Size Suggestion</h3>
            {suggestion ? (
              <div>
                <div>Recommended size: <strong>{suggestion.size}</strong></div>
                <div className="text-sm text-gray-600">Confidence: {Math.round(suggestion.score * 100)}%</div>
              </div>
            ) : (
              <div className="text-gray-500">Position yourself in front of the camera to get size recommendations</div>
            )}
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">How it works</h3>
            <ul className="text-sm space-y-1">
              <li>• Uses MediaPipe Pose detection for body tracking</li>
              <li>• Three.js renders 3D garments over live video</li>
              <li>• AI-powered size recommendations based on your measurements</li>
              <li>• Supports GLTF/GLB 3D models for realistic try-on</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
