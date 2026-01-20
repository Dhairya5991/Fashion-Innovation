import React from 'react'

export default function Logo({ className = "w-8 h-8", variant = "default" }) {
  if (variant === "text") {
    return (
      <div className="flex items-center space-x-2">
        <svg
          viewBox="0 0 100 100"
          className="w-6 h-6 text-indigo-600"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Hexagonal frame */}
          <path
            d="M50 5L87.5 27.5V72.5L50 95L12.5 72.5V27.5L50 5Z"
            stroke="currentColor"
            strokeWidth="1.5"
            opacity="0.3"
          />
          <path
            d="M50 15L75 32.5V67.5L50 85L25 67.5V32.5L50 15Z"
            stroke="currentColor"
            strokeWidth="2"
            fill="currentColor"
            opacity="0.1"
          />
          <path
            d="M50 35L47 38V52L48 54V58L50 60L52 58V54L53 52V38L50 35Z"
            fill="currentColor"
          />
          <rect x="46" y="42" width="8" height="6" rx="1" fill="white" />
          <circle cx="50" cy="45" r="1.5" fill="currentColor" />
          <line x1="35" y1="50" x2="40" y2="50" stroke="currentColor" strokeWidth="1" opacity="0.6" />
          <line x1="60" y1="50" x2="65" y2="50" stroke="currentColor" strokeWidth="1" opacity="0.6" />
        </svg>
        <span className="font-bold text-xl text-indigo-600">AR Fashion</span>
      </div>
    )
  }

  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Hexagonal frame */}
      <path
        d="M50 5L87.5 27.5V72.5L50 95L12.5 72.5V27.5L50 5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.3"
      />

      {/* Inner hexagon */}
      <path
        d="M50 15L75 32.5V67.5L50 85L25 67.5V32.5L50 15Z"
        stroke="currentColor"
        strokeWidth="2"
        fill="currentColor"
        opacity="0.1"
      />

      {/* Fashion figure - ultra minimalist */}
      <path
        d="M50 35L47 38V52L48 54V58L50 60L52 58V54L53 52V38L50 35Z"
        fill="currentColor"
      />

      {/* AR camera/viewfinder */}
      <rect x="46" y="42" width="8" height="6" rx="1" fill="white" />
      <circle cx="50" cy="45" r="1.5" fill="currentColor" />

      {/* Tech accent lines */}
      <line x1="35" y1="50" x2="40" y2="50" stroke="currentColor" strokeWidth="1" opacity="0.6" />
      <line x1="60" y1="50" x2="65" y2="50" stroke="currentColor" strokeWidth="1" opacity="0.6" />
    </svg>
  )
}