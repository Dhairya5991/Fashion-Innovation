import React from 'react'
import Logo from './Logo'

export default function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-pulse mb-6">
          <Logo className="w-16 h-16 text-indigo-600 mx-auto" />
        </div>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading AR Fashion...</p>
      </div>
    </div>
  )
}