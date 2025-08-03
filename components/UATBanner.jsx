'use client'

import { useState } from 'react'

export default function UATBanner() {
  const [isVisible, setIsVisible] = useState(true)
  
  // Only show in UAT environment
  if (process.env.NODE_ENV !== 'uat' && !process.env.UAT_MODE) {
    return null
  }

  if (!isVisible) return null

  return (
    <div className="bg-orange-500 text-white px-4 py-2 text-center relative z-50">
      <div className="flex items-center justify-center gap-4">
        <div className="flex items-center gap-2">
          <span className="animate-pulse">🧪</span>
          <span className="font-semibold">UAT TESTING ENVIRONMENT</span>
          <span className="animate-pulse">🧪</span>
        </div>
        
        <div className="text-sm opacity-90">
          Dies ist eine Testumgebung - Keine echten Zahlungen oder Daten
        </div>
        
        <button
          onClick={() => setIsVisible(false)}
          className="ml-4 text-white hover:text-orange-200 font-bold text-lg"
          aria-label="Banner schließen"
        >
          ×
        </button>
      </div>
      
      <div className="text-xs opacity-75 mt-1">
        UAT URL: {typeof window !== 'undefined' ? window.location.origin : 'carbot-uat.vercel.app'}
      </div>
    </div>
  )
}