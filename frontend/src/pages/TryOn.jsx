import React, { useEffect, useState } from 'react'
import ARMirror from '../components/ARMirror'
import { recommendSize } from '../utils/sizeModel'

export default function TryOn(){
  const [suggestion, setSuggestion] = useState(null)

  useEffect(()=>{
    function handler(e){
      const metrics = e.detail
      const r = recommendSize(metrics)
      setSuggestion(r)
    }
    window.addEventListener('poseMetrics', handler)
    return ()=> window.removeEventListener('poseMetrics', handler)
  },[])

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div>
        <ARMirror />
      </div>
      <div>
        <h2 className="text-xl font-bold">AR Try-On (Prototype)</h2>
        <p className="mt-2">This demo uses MediaPipe Pose and Three.js to position 3D garments over the live camera feed. For production, supply GLTF/GLB modelUrl per product and refine landmark-to-bone mapping for precise fit.</p>
        <div className="mt-4 bg-white p-4 rounded shadow">
          <h3 className="font-semibold">Size suggestion</h3>
          {suggestion ? (
            <div className="mt-2">
              <div>Recommended size: <strong>{suggestion.size}</strong></div>
              <div className="text-sm text-gray-600">Confidence score: {Math.round(suggestion.score * 10) / 10}</div>
            </div>
          ) : (
            <div className="text-gray-500 mt-2">Move into view to get a size suggestion</div>
          )}
        </div>
      </div>
    </div>
  )
}
