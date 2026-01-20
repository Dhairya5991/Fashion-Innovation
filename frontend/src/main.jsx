import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App'
import { CartProvider } from './contexts/CartContext'
import './styles/index.css'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <CartProvider>
        <Routes>
          <Route path="/*" element={<App />} />
        </Routes>
      </CartProvider>
    </BrowserRouter>
  </React.StrictMode>
)
