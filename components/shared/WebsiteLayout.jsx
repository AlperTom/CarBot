/**
 * WebsiteLayout - Base layout component for all CarBot client websites
 * Provides consistent structure, navigation, and German legal compliance
 */

import { useState, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'

export default function WebsiteLayout({ 
  children, 
  config,
  currentPage = 'home',
  className = ''
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showCookieBanner, setShowCookieBanner] = useState(false)
  const router = useRouter()

  // Check for cookie consent on mount
  useEffect(() => {
    const cookieConsent = localStorage.getItem(`carbot_cookies_${config.businessSlug}`)
    if (!cookieConsent) {
      setShowCookieBanner(true)
    }
  }, [config.businessSlug])

  // Default configuration structure
  const defaultConfig = {
    // Basic Business Info
    businessName: "Musterwerkstatt",
    businessSlug: "musterwerkstatt",
    ownerName: "Hans Müller",
    tagline: "Ihre vertrauensvolle KFZ-Werkstatt",
    
    // Contact Information
    phone: "+49 30 123456789",
    email: "info@musterwerkstatt.de",
    address: {
      street: "Hauptstraße 123",
      city: "Berlin", 
      postalCode: "10115",
      country: "Deutschland"
    },
    
    // Theme Configuration
    theme: {
      primary: '#007bff',
      secondary: '#6c757d',
      accent: '#28a745',
      neutral: '#1f2937',
      light: '#f8fafc'
    },
    
    // SEO Configuration
    seo: {
      title: "Musterwerkstatt - KFZ-Reparatur & Inspektion",
      description: "Ihre vertrauensvolle Werkstatt für Autoreparaturen, HU/AU und Wartung.",
      keywords: ["Autowerkstatt", "KFZ Reparatur", "Auto Service"]
    },
    
    // Navigation Configuration
    navigation: {
      main: [
        { label: "Home", href: "/", key: "home" },
        { label: "Services", href: "/services", key: "services" },
        { label: "Über uns", href: "/about", key: "about" },
        { label: "Kontakt", href: "/contact", key: "contact" }
      ],
      legal: [
        { label: "Impressum", href: "/impressum" },
        { label: "Datenschutz", href: "/datenschutz" },
        { label: "AGB", href: "/agb" },
        { label: "Cookies", href: "/cookies" }
      ]
    },
    
    // Business Hours
    hours: {
      monday: { open: "07:00", close: "18:00" },
      tuesday: { open: "07:00", close: "18:00" },
      wednesday: { open: "07:00", close: "18:00" },
      thursday: { open: "07:00", close: "18:00" },
      friday: { open: "07:00", close: "18:00" },
      saturday: { open: "08:00", close: "14:00" },
      sunday: { closed: true }
    },
    
    // Social Media
    social: {
      facebook: null,
      instagram: null,
      google: null
    },
    
    // Features
    features: {
      carBotWidget: true,
      cookieConsent: true,
      contactForm: true,
      googleMaps: true
    },
    
    ...config // Override with provided config
  }

  // Generate page title
  const getPageTitle = () => {
    const pageNames = {
      home: defaultConfig.seo.title,
      services: `Services | ${defaultConfig.businessName}`,
      about: `Über uns | ${defaultConfig.businessName}`,
      contact: `Kontakt | ${defaultConfig.businessName}`,
      impressum: `Impressum | ${defaultConfig.businessName}`,
      datenschutz: `Datenschutz | ${defaultConfig.businessName}`,
      agb: `AGB | ${defaultConfig.businessName}`,
      cookies: `Cookie-Richtlinie | ${defaultConfig.businessName}`
    }
    return pageNames[currentPage] || `${currentPage} | ${defaultConfig.businessName}`
  }

  // Handle cookie consent
  const handleCookieConsent = (accepted) => {
    localStorage.setItem(`carbot_cookies_${defaultConfig.businessSlug}`, JSON.stringify({
      accepted,
      timestamp: new Date().toISOString(),
      essential: true,
      analytics: accepted,
      marketing: accepted
    }))
    setShowCookieBanner(false)
    
    // Initialize analytics if accepted
    if (accepted && typeof window !== 'undefined') {
      // Initialize Google Analytics, CarBot analytics, etc.
      console.log('Analytics initialized for:', defaultConfig.businessName)
    }
  }

  // Check if current page is active
  const isActivePage = (pageKey) => {
    return currentPage === pageKey || router.pathname === `/${pageKey}`
  }

  return (
    <>
      {/* SEO Head */}
      <Head>
        <title>{getPageTitle()}</title>
        <meta name="description" content={defaultConfig.seo.description} />
        <meta name="keywords" content={defaultConfig.seo.keywords.join(", ")} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
        
        {/* Open Graph / Social Media */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={getPageTitle()} />
        <meta property="og:description" content={defaultConfig.seo.description} />
        <meta property="og:site_name" content={defaultConfig.businessName} />
        
        {/* Local Business Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "AutoRepair",
              "name": defaultConfig.businessName,
              "description": defaultConfig.seo.description,
              "url": `https://${defaultConfig.businessSlug}.carbot.de`,
              "telephone": defaultConfig.phone,
              "email": defaultConfig.email,
              "address": {
                "@type": "PostalAddress",
                "streetAddress": defaultConfig.address.street,
                "addressLocality": defaultConfig.address.city,
                "postalCode": defaultConfig.address.postalCode,
                "addressCountry": defaultConfig.address.country
              },
              "geo": {
                "@type": "GeoCoordinates",
                // These would be dynamically determined
                "latitude": "52.5200",
                "longitude": "13.4050"
              },
              "openingHoursSpecification": Object.entries(defaultConfig.hours).map(([day, hours]) => ({
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": day.charAt(0).toUpperCase() + day.slice(1),
                "opens": hours.closed ? null : hours.open,
                "closes": hours.closed ? null : hours.close
              })).filter(spec => spec.opens),
              "priceRange": "€€",
              "paymentAccepted": ["Cash", "Credit Card", "Bank Transfer"],
              "currenciesAccepted": "EUR"
            })
          }}
        />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={`min-h-screen bg-white flex flex-col ${className}`}>
        {/* Navigation Header */}
        <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo/Brand */}
              <div className="flex items-center">
                <a 
                  href="/"
                  className="text-2xl font-bold hover:opacity-80 transition-opacity"
                  style={{ color: defaultConfig.theme.primary }}
                >
                  🚗 {defaultConfig.businessName}
                </a>
                {defaultConfig.tagline && (
                  <span className="hidden md:block ml-3 text-sm text-gray-600 border-l pl-3">
                    {defaultConfig.tagline}
                  </span>
                )}
              </div>
              
              {/* Desktop Navigation */}
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  {defaultConfig.navigation.main.map((item) => (
                    <a
                      key={item.key}
                      href={item.href}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActivePage(item.key)
                          ? 'text-white'
                          : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                      style={isActivePage(item.key) ? { backgroundColor: defaultConfig.theme.primary } : {}}
                    >
                      {item.label}
                    </a>
                  ))}
                  
                  {/* Call Button */}
                  <a 
                    href={`tel:${defaultConfig.phone}`}
                    className="text-white px-4 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105 ml-4"
                    style={{ backgroundColor: defaultConfig.theme.primary }}
                  >
                    📞 {defaultConfig.phone}
                  </a>
                </div>
              </div>

              {/* Mobile menu button */}
              <div className="md:hidden">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="text-gray-700 hover:text-gray-900 focus:outline-none focus:text-gray-900"
                  aria-label="Toggle menu"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} 
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden border-t border-gray-100">
              <div className="px-2 pt-2 pb-3 space-y-1 bg-white">
                {defaultConfig.navigation.main.map((item) => (
                  <a
                    key={item.key}
                    href={item.href}
                    className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                      isActivePage(item.key)
                        ? 'text-white'
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                    style={isActivePage(item.key) ? { backgroundColor: defaultConfig.theme.primary } : {}}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </a>
                ))}
                <a 
                  href={`tel:${defaultConfig.phone}`}
                  className="block px-3 py-2 rounded-md text-base font-medium text-white mt-4"
                  style={{ backgroundColor: defaultConfig.theme.primary }}
                >
                  📞 Jetzt anrufen
                </a>
              </div>
            </div>
          )}
        </nav>

        {/* Main Content */}
        <main className="flex-grow">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-gray-900 text-white mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid md:grid-cols-4 gap-8">
              {/* Business Information */}
              <div className="col-span-2 md:col-span-1">
                <div className="text-xl font-bold mb-4" style={{ color: defaultConfig.theme.primary }}>
                  🚗 {defaultConfig.businessName}
                </div>
                <div className="space-y-2 text-sm text-gray-300">
                  <p>{defaultConfig.address.street}</p>
                  <p>{defaultConfig.address.postalCode} {defaultConfig.address.city}</p>
                  <p className="pt-2">
                    <a href={`tel:${defaultConfig.phone}`} className="hover:text-white transition-colors">
                      📞 {defaultConfig.phone}
                    </a>
                  </p>
                  <p>
                    <a href={`mailto:${defaultConfig.email}`} className="hover:text-white transition-colors">
                      ✉️ {defaultConfig.email}
                    </a>
                  </p>
                </div>
              </div>

              {/* Business Hours */}
              <div>
                <h4 className="font-semibold mb-4">Öffnungszeiten</h4>
                <div className="space-y-1 text-sm text-gray-300">
                  {Object.entries(defaultConfig.hours).map(([day, hours]) => (
                    <div key={day} className="flex justify-between">
                      <span className="capitalize">{
                        day === 'monday' ? 'Mo' :
                        day === 'tuesday' ? 'Di' :
                        day === 'wednesday' ? 'Mi' :
                        day === 'thursday' ? 'Do' :
                        day === 'friday' ? 'Fr' :
                        day === 'saturday' ? 'Sa' :
                        'So'
                      }:</span>
                      <span>
                        {hours.closed ? 'Geschlossen' : `${hours.open}-${hours.close}`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="font-semibold mb-4">Services</h4>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li><a href="/services" className="hover:text-white transition-colors">Reparaturen</a></li>
                  <li><a href="/services" className="hover:text-white transition-colors">Inspektionen</a></li>
                  <li><a href="/services" className="hover:text-white transition-colors">HU/AU</a></li>
                  <li><a href="/contact" className="hover:text-white transition-colors">Termin buchen</a></li>
                </ul>
              </div>

              {/* Legal Links */}
              <div>
                <h4 className="font-semibold mb-4">Rechtliches</h4>
                <ul className="space-y-2 text-sm text-gray-300">
                  {defaultConfig.navigation.legal.map((link) => (
                    <li key={link.href}>
                      <a href={link.href} className="hover:text-white transition-colors">
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            {/* Bottom Footer */}
            <div className="border-t border-gray-800 mt-8 pt-8">
              <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
                <p>&copy; 2025 {defaultConfig.businessName}. Alle Rechte vorbehalten.</p>
                <p className="mt-2 md:mt-0">
                  Website powered by{' '}
                  <a 
                    href="https://carbot.de" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                    style={{ color: defaultConfig.theme.primary }}
                  >
                    CarBot - Deutsche Automotive SaaS
                  </a>
                </p>
              </div>
            </div>
          </div>
        </footer>

        {/* Cookie Consent Banner */}
        {showCookieBanner && (
          <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 z-50 shadow-lg">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-sm">
                <p>
                  🍪 Diese Website verwendet Cookies, um Ihnen die bestmögliche Erfahrung zu bieten.{' '}
                  <a href="/cookies" className="underline hover:no-underline">
                    Mehr erfahren
                  </a>
                </p>
              </div>
              <div className="flex gap-3 flex-shrink-0">
                <button
                  onClick={() => handleCookieConsent(false)}
                  className="px-4 py-2 text-sm border border-gray-600 rounded hover:bg-gray-800 transition-colors"
                >
                  Nur notwendige
                </button>
                <button
                  onClick={() => handleCookieConsent(true)}
                  className="px-4 py-2 text-sm rounded text-white transition-colors hover:opacity-90"
                  style={{ backgroundColor: defaultConfig.theme.primary }}
                >
                  Alle akzeptieren
                </button>
              </div>
            </div>
          </div>
        )}

        {/* CarBot Widget Integration Point */}
        {defaultConfig.features.carBotWidget && (
          <div id="carbot-widget-container" />
        )}
      </div>
    </>
  )
}