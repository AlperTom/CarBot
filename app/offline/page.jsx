/**
 * Offline Page - Displayed when user is offline and page isn't cached
 */

'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Wifi, WifiOff, RefreshCw, Home, MessageSquare, BarChart } from 'lucide-react'

/**
 * Enhanced Offline Page for PWA
 * Provides comprehensive offline functionality and cached content access
 * Business Impact: Maintains user engagement during network issues
 */
export default function OfflinePage() {
  const [isOnline, setIsOnline] = useState(false)
  const [isRetrying, setIsRetrying] = useState(false)
  const [offlineFeatures, setOfflineFeatures] = useState([])
  const [cachedData, setCachedData] = useState(null)

  useEffect(() => {
    // Check initial online status
    setIsOnline(navigator.onLine)

    // Listen for network changes
    const handleOnline = () => {
      setIsOnline(true)
      // Auto-redirect to dashboard when back online
      setTimeout(() => {
        window.location.href = '/dashboard'
      }, 2000)
    }
    
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Load offline features
    loadOfflineFeatures()
    
    // Try to load cached data
    loadCachedData()

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const loadOfflineFeatures = () => {
    setOfflineFeatures([
      {
        id: 'cached-leads',
        title: 'Gespeicherte Leads',
        description: 'Zugriff auf zuletzt geladene Kundendaten',
        icon: '👥',
        available: true,
        action: () => window.location.href = '/dashboard/leads'
      },
      {
        id: 'offline-chat',
        title: 'Offline Chat-Vorlagen',
        description: 'Vorgefertigte Antworten für häufige Fragen',
        icon: '💬',
        available: true,
        action: () => showOfflineChatTemplates()
      },
      {
        id: 'cached-analytics',
        title: 'Lokale Analytics',
        description: 'Zuletzt synchronisierte Leistungsdaten',
        icon: '📊',
        available: true,
        action: () => window.location.href = '/analytics'
      },
      {
        id: 'workshop-info',
        title: 'Werkstatt-Infos',
        description: 'Kontaktdaten und Öffnungszeiten bearbeiten',
        icon: '🏪',
        available: true,
        action: () => window.location.href = '/dashboard/settings'
      }
    ])
  }

  const loadCachedData = async () => {
    try {
      // Try to load cached dashboard data
      const cached = localStorage.getItem('carbot_offline_data')
      if (cached) {
        setCachedData(JSON.parse(cached))
      }
    } catch (error) {
      console.warn('Could not load cached data:', error)
    }
  }

  const handleRetry = async () => {
    setIsRetrying(true)
    
    try {
      // Test connectivity
      const response = await fetch('/api/health', { 
        method: 'HEAD',
        cache: 'no-cache'
      })
      
      if (response.ok) {
        window.location.reload()
      } else {
        throw new Error('Connection test failed')
      }
    } catch (error) {
      console.log('Still offline')
      setTimeout(() => setIsRetrying(false), 1000)
    }
  }

  const showOfflineChatTemplates = () => {
    const templates = [
      "Vielen Dank für Ihre Anfrage! Wir melden uns sobald wie möglich bei Ihnen.",
      "Gerne können Sie einen Termin für eine Fahrzeuginspektion vereinbaren.",
      "Für Notfälle außerhalb der Öffnungszeiten wenden Sie sich bitte an: [Notrufnummer]",
      "Unsere Öffnungszeiten: Mo-Fr 8:00-18:00, Sa 9:00-14:00",
      "Wir sind spezialisiert auf: TÜV, Reparaturen, Wartung und Unfallschäden."
    ]
    
    alert(`Offline Chat-Vorlagen:\n\n${templates.join('\n\n')}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%239C92AC\" fill-opacity=\"0.1\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"2\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]" />
      </div>

      <div className="relative z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          
          {/* Header */}
          <div className="text-center mb-12">
            <div className="mb-6">
              {isOnline ? (
                <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500 rounded-full mb-4">
                  <Wifi className="w-10 h-10 text-white" />
                </div>
              ) : (
                <div className="inline-flex items-center justify-center w-20 h-20 bg-red-500 rounded-full mb-4 animate-pulse">
                  <WifiOff className="w-10 h-10 text-white" />
                </div>
              )}
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              {isOnline ? (
                <>
                  <span className="text-green-400">Verbindung</span> wiederhergestellt!
                </>
              ) : (
                <>
                  <span className="text-orange-400">CarBot</span> Offline-Modus
                </>
              )}
            </h1>
            
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              {isOnline ? (
                "Ihre Internetverbindung ist wieder da. Sie werden automatisch zum Dashboard weitergeleitet."
              ) : (
                "Keine Internetverbindung verfügbar. Nutzen Sie die verfügbaren Offline-Funktionen."
              )}
            </p>

            {/* Online Status Indicator */}
            <div className="mt-6">
              <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                isOnline 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {isOnline ? (
                  <>
                    <Wifi className="w-4 h-4 mr-2" />
                    Online
                  </>
                ) : (
                  <>
                    <WifiOff className="w-4 h-4 mr-2" />
                    Offline
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Auto-redirect notice when online */}
          {isOnline && (
            <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4 mb-8 text-center">
              <p className="text-green-300">
                🎉 Verbindung wiederhergestellt! Automatische Weiterleitung in 2 Sekunden...
              </p>
            </div>
          )}

          {/* Retry Button */}
          {!isOnline && (
            <div className="text-center mb-12">
              <button
                onClick={handleRetry}
                disabled={isRetrying}
                className={`inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:opacity-50 text-white font-semibold rounded-lg transition-colors duration-200 ${
                  isRetrying ? 'cursor-not-allowed' : ''
                }`}
              >
                <RefreshCw className={`w-5 h-5 mr-2 ${isRetrying ? 'animate-spin' : ''}`} />
                {isRetrying ? 'Verbindung prüfen...' : 'Erneut versuchen'}
              </button>
            </div>
          )}

          {/* Offline Features Grid */}
          {!isOnline && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-center mb-8">
                Verfügbare Offline-Funktionen
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {offlineFeatures.map((feature) => (
                  <div
                    key={feature.id}
                    className={`bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 text-center transition-all duration-200 ${
                      feature.available 
                        ? 'hover:bg-white/20 hover:scale-105 cursor-pointer' 
                        : 'opacity-50 cursor-not-allowed'
                    }`}
                    onClick={feature.available ? feature.action : undefined}
                  >
                    <div className="text-4xl mb-3">{feature.icon}</div>
                    <h3 className="text-lg font-semibold mb-2 text-white">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-300">
                      {feature.description}
                    </p>
                    {feature.available && (
                      <div className="mt-4">
                        <span className="inline-block bg-green-500/20 text-green-400 text-xs px-3 py-1 rounded-full">
                          Verfügbar
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Cached Data Preview */}
          {!isOnline && cachedData && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-center mb-8">
                Letzte gespeicherte Daten
              </h2>
              
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
                <div className="text-sm text-gray-400 mb-4">
                  Zuletzt synchronisiert: {new Date(cachedData.lastSync).toLocaleString('de-DE')}
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">
                      {cachedData.leads || 0}
                    </div>
                    <div className="text-sm text-gray-300">Gespeicherte Leads</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">
                      {cachedData.conversations || 0}
                    </div>
                    <div className="text-sm text-gray-300">Chat-Verläufe</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400">
                      {cachedData.analytics || 0}
                    </div>
                    <div className="text-sm text-gray-300">Analytics-Berichte</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-6">
              Navigation
            </h2>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/dashboard"
                className="inline-flex items-center px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium rounded-lg transition-colors duration-200"
              >
                <Home className="w-5 h-5 mr-2" />
                Dashboard
              </Link>
              
              <Link
                href="/dashboard/leads"
                className="inline-flex items-center px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium rounded-lg transition-colors duration-200"
              >
                <MessageSquare className="w-5 h-5 mr-2" />
                Leads
              </Link>
              
              <Link
                href="/analytics"
                className="inline-flex items-center px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium rounded-lg transition-colors duration-200"
              >
                <BarChart className="w-5 h-5 mr-2" />
                Analytics
              </Link>
            </div>
          </div>

          {/* Tips for Offline Usage */}
          {!isOnline && (
            <div className="mt-12 bg-blue-500/20 border border-blue-500/30 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-blue-300 mb-4">
                💡 Tipps für den Offline-Modus
              </h3>
              
              <ul className="space-y-3 text-sm text-gray-300">
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3"></span>
                  Alle Änderungen werden lokal gespeichert und synchronisiert sobald die Verbindung wieder da ist
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3"></span>
                  Zugriff auf alle zuletzt geladenen Leads und Kundendaten
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3"></span>
                  Chat-Vorlagen können auch ohne Internet verwendet werden
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3"></span>
                  Analytics-Daten werden aus dem lokalen Cache geladen
                </li>
              </ul>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

// Metadata moved to layout or parent component - can't export from client component