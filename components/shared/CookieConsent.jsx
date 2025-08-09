/**
 * CookieConsent - GDPR Compliant Cookie Management
 * Advanced cookie consent system for German automotive workshops
 */

import { useState, useEffect } from 'react'

export default function CookieConsent({ 
  config,
  onAccept,
  onDecline,
  onConfigure 
}) {
  const [showBanner, setShowBanner] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [preferences, setPreferences] = useState({
    essential: true, // Always required
    analytics: false,
    marketing: false,
    personalization: false
  })

  // Default configuration
  const defaultConfig = {
    businessName: "Musterwerkstatt",
    businessSlug: "musterwerkstatt",
    cookiePolicyUrl: "/cookies",
    privacyPolicyUrl: "/datenschutz",
    theme: {
      primary: '#007bff',
      secondary: '#6c757d',
      success: '#28a745',
      background: '#ffffff'
    },
    ...config
  }

  // Check for existing consent on mount
  useEffect(() => {
    const consentKey = `carbot_cookies_${defaultConfig.businessSlug}`
    const existingConsent = localStorage.getItem(consentKey)
    
    if (!existingConsent) {
      // Show banner after short delay for better UX
      const timer = setTimeout(() => {
        setShowBanner(true)
      }, 1000)
      return () => clearTimeout(timer)
    } else {
      // Load existing preferences
      try {
        const consent = JSON.parse(existingConsent)
        setPreferences(consent.preferences || preferences)
        
        // Initialize services based on existing consent
        initializeServices(consent.preferences || preferences)
      } catch (e) {
        console.warn('Invalid cookie consent data:', e)
        setShowBanner(true)
      }
    }
  }, [defaultConfig.businessSlug])

  // Initialize third-party services based on consent
  const initializeServices = (prefs) => {
    // Google Analytics
    if (prefs.analytics && typeof window !== 'undefined') {
      window.gtag = window.gtag || function() {
        (window.dataLayer = window.dataLayer || []).push(arguments)
      }
      
      // Load Google Analytics
      const script = document.createElement('script')
      script.async = true
      script.src = 'https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID'
      document.head.appendChild(script)
      
      window.gtag('js', new Date())
      window.gtag('config', 'GA_MEASUREMENT_ID', {
        anonymize_ip: true,
        cookie_flags: 'secure;samesite=lax'
      })
    }

    // CarBot Analytics (always allowed for essential functionality)
    if (typeof window !== 'undefined') {
      window.carbot_analytics_enabled = prefs.analytics
    }

    // Marketing tools
    if (prefs.marketing && typeof window !== 'undefined') {
      // Initialize Facebook Pixel, Google Ads, etc.
      console.log('Marketing tools initialized')
    }

    // Personalization
    if (prefs.personalization && typeof window !== 'undefined') {
      // Initialize personalization features
      console.log('Personalization features enabled')
    }
  }

  // Save consent preferences
  const saveConsent = (accepted, customPrefs = null) => {
    const consentData = {
      accepted,
      timestamp: new Date().toISOString(),
      preferences: customPrefs || (accepted ? {
        essential: true,
        analytics: true,
        marketing: true,
        personalization: true
      } : {
        essential: true,
        analytics: false,
        marketing: false,
        personalization: false
      }),
      version: '1.0'
    }

    const consentKey = `carbot_cookies_${defaultConfig.businessSlug}`
    localStorage.setItem(consentKey, JSON.stringify(consentData))
    
    // Initialize services
    initializeServices(consentData.preferences)
    
    // Callback to parent
    if (accepted) {
      onAccept?.(consentData)
    } else {
      onDecline?.(consentData)
    }
    
    setShowBanner(false)
    setShowSettings(false)
  }

  // Handle accept all
  const handleAcceptAll = () => {
    setPreferences({
      essential: true,
      analytics: true,
      marketing: true,
      personalization: true
    })
    saveConsent(true)
  }

  // Handle decline (only essential)
  const handleDeclineAll = () => {
    const essentialOnly = {
      essential: true,
      analytics: false,
      marketing: false,
      personalization: false
    }
    setPreferences(essentialOnly)
    saveConsent(false, essentialOnly)
  }

  // Handle custom preferences
  const handleSavePreferences = () => {
    const hasAcceptedAny = preferences.analytics || preferences.marketing || preferences.personalization
    saveConsent(hasAcceptedAny, preferences)
  }

  // Update preferences
  const updatePreference = (category, value) => {
    setPreferences(prev => ({
      ...prev,
      [category]: value
    }))
  }

  // Cookie categories with descriptions
  const cookieCategories = [
    {
      key: 'essential',
      name: 'Notwendige Cookies',
      description: 'Diese Cookies sind für die Grundfunktionen der Website erforderlich und können nicht deaktiviert werden.',
      icon: '🔒',
      required: true,
      examples: ['Session-Management', 'Sicherheitseinstellungen', 'Cookie-Präferenzen', 'CarBot Widget-Funktionalität']
    },
    {
      key: 'analytics',
      name: 'Analyse-Cookies',
      description: 'Helfen uns zu verstehen, wie Besucher mit der Website interagieren, um die Benutzererfahrung zu verbessern.',
      icon: '📊',
      required: false,
      examples: ['Google Analytics', 'Besuchsstatistiken', 'Performance-Monitoring', 'Heatmap-Analyse']
    },
    {
      key: 'marketing',
      name: 'Marketing-Cookies',
      description: 'Werden verwendet, um relevante Werbung anzuzeigen und die Effektivität von Werbekampagnen zu messen.',
      icon: '🎯',
      required: false,
      examples: ['Google Ads', 'Facebook Pixel', 'Retargeting', 'Conversion-Tracking']
    },
    {
      key: 'personalization',
      name: 'Personalisierungs-Cookies',
      description: 'Ermöglichen es, die Website an Ihre Präferenzen anzupassen und ein personalisiertes Erlebnis zu bieten.',
      icon: '⚙️',
      required: false,
      examples: ['Sprach-Einstellungen', 'Design-Präferenzen', 'Gespeicherte Suchen', 'Persönliche Inhalte']
    }
  ]

  // Don't render if banner shouldn't be shown
  if (!showBanner && !showSettings) {
    return null
  }

  return (
    <>
      {/* Cookie Consent Banner */}
      {showBanner && !showSettings && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
          <div className="max-w-7xl mx-auto p-4">
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
              {/* Cookie Icon and Message */}
              <div className="flex-1 flex items-start gap-3">
                <div className="text-3xl">🍪</div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    Cookie-Einstellungen
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Wir verwenden Cookies, um Ihnen die bestmögliche Erfahrung auf unserer Website zu bieten. 
                    Einige Cookies sind notwendig für die Funktionalität, während andere uns helfen, 
                    die Website zu verbessern und Ihnen relevante Inhalte anzuzeigen.
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2 text-xs">
                    <a 
                      href={defaultConfig.cookiePolicyUrl}
                      target="_blank"
                      rel="noopener noreferrer" 
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      Cookie-Richtlinie
                    </a>
                    <span className="text-gray-400">•</span>
                    <a 
                      href={defaultConfig.privacyPolicyUrl}
                      target="_blank"
                      rel="noopener noreferrer" 
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      Datenschutzerklärung
                    </a>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                <button
                  onClick={handleDeclineAll}
                  className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Nur notwendige
                </button>
                <button
                  onClick={() => setShowSettings(true)}
                  className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Einstellungen
                </button>
                <button
                  onClick={handleAcceptAll}
                  className="px-6 py-2 text-sm text-white rounded-lg transition-all hover:opacity-90"
                  style={{ backgroundColor: defaultConfig.theme.primary }}
                >
                  Alle akzeptieren
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Detailed Cookie Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  🍪 Cookie-Einstellungen
                </h2>
                <button
                  onClick={() => setShowSettings(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                  aria-label="Schließen"
                >
                  ×
                </button>
              </div>
              <p className="text-gray-600 mt-2">
                Verwalten Sie Ihre Cookie-Präferenzen für {defaultConfig.businessName}
              </p>
            </div>

            {/* Content */}
            <div className="px-6 py-4 overflow-y-auto max-h-[60vh]">
              <div className="space-y-6">
                {cookieCategories.map((category) => (
                  <div key={category.key} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{category.icon}</span>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {category.name}
                          </h3>
                          {category.required && (
                            <span className="text-xs text-green-600 font-medium">
                              Immer aktiv
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center">
                        {category.required ? (
                          <div className="w-12 h-6 bg-green-500 rounded-full flex items-center justify-end px-1">
                            <div className="w-4 h-4 bg-white rounded-full"></div>
                          </div>
                        ) : (
                          <button
                            onClick={() => updatePreference(category.key, !preferences[category.key])}
                            className={`w-12 h-6 rounded-full flex items-center transition-colors ${
                              preferences[category.key] 
                                ? 'bg-blue-500 justify-end' 
                                : 'bg-gray-300 justify-start'
                            }`}
                            style={preferences[category.key] ? { backgroundColor: defaultConfig.theme.primary } : {}}
                          >
                            <div className="w-4 h-4 bg-white rounded-full mx-1 transition-transform"></div>
                          </button>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">
                      {category.description}
                    </p>
                    
                    <div className="text-xs text-gray-500">
                      <strong>Beispiele:</strong> {category.examples.join(', ')}
                    </div>
                  </div>
                ))}
              </div>

              {/* GDPR Information */}
              <div className="mt-8 bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                  🛡️ Ihre Datenschutzrechte
                </h4>
                <div className="text-sm text-gray-700 space-y-2">
                  <p>
                    Nach der DSGVO haben Sie folgende Rechte bezüglich Ihrer Daten:
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Recht auf Auskunft über gespeicherte Daten</li>
                    <li>Recht auf Berichtigung falscher Daten</li>
                    <li>Recht auf Löschung Ihrer Daten</li>
                    <li>Recht auf Datenübertragbarkeit</li>
                    <li>Widerspruchsrecht gegen Datenverarbeitung</li>
                  </ul>
                  <p className="mt-2">
                    Sie können Ihre Cookie-Einstellungen jederzeit über den Button in der Fußzeile ändern.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex flex-col sm:flex-row gap-3 justify-end">
                <button
                  onClick={() => {
                    setPreferences({
                      essential: true,
                      analytics: false,
                      marketing: false,
                      personalization: false
                    })
                    handleSavePreferences()
                  }}
                  className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Alle ablehnen
                </button>
                <button
                  onClick={handleSavePreferences}
                  className="px-6 py-2 text-sm text-white rounded-lg transition-all hover:opacity-90"
                  style={{ backgroundColor: defaultConfig.theme.primary }}
                >
                  Einstellungen speichern
                </button>
                <button
                  onClick={() => {
                    setPreferences({
                      essential: true,
                      analytics: true,
                      marketing: true,
                      personalization: true
                    })
                    handleAcceptAll()
                  }}
                  className="px-6 py-2 text-sm text-white rounded-lg transition-all hover:opacity-90"
                  style={{ backgroundColor: defaultConfig.theme.success }}
                >
                  Alle akzeptieren
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Cookie Settings Button (always available after initial consent) */}
      {!showBanner && !showSettings && (
        <button
          onClick={() => setShowSettings(true)}
          className="fixed bottom-4 left-4 z-40 bg-gray-800 text-white px-3 py-2 rounded-lg text-xs hover:bg-gray-700 transition-colors shadow-lg"
          title="Cookie-Einstellungen ändern"
        >
          🍪 Cookies
        </button>
      )}
    </>
  )
}