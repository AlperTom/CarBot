'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

export default function EnhancedDashboardNav({ user, workshop, onLogout }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const navRef = useRef(null)
  const profileMenuRef = useRef(null)

  // Handle client-side hydration
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Navigation items with enhanced structure
  const navItems = [
    { 
      href: '/dashboard', 
      label: 'Übersicht', 
      icon: '📊', 
      description: 'Dashboard und Statistiken',
      category: 'main' 
    },
    { 
      href: '/dashboard/clients', 
      label: 'Clients', 
      icon: '👥', 
      description: 'Client-Verwaltung',
      category: 'main' 
    },
    { 
      href: '/dashboard/client-keys', 
      label: 'API-Keys', 
      icon: '🔑', 
      description: 'Client-Keys verwalten',
      category: 'main' 
    },
    { 
      href: '/dashboard/widget-customizer', 
      label: 'Widget Designer', 
      icon: '🎨', 
      description: 'Chatbot anpassen',
      category: 'customization' 
    },
    { 
      href: '/dashboard/ui-themes', 
      label: 'UI Themes', 
      icon: '🌈', 
      description: 'Design-Vorlagen',
      category: 'customization' 
    },
    { 
      href: '/dashboard/landing-pages', 
      label: 'Landing Pages', 
      icon: '📄', 
      description: 'Seiten verwalten',
      category: 'customization' 
    },
    { 
      href: '/analytics', 
      label: 'Analytics', 
      icon: '📈', 
      description: 'Detaillierte Analysen',
      category: 'analytics' 
    },
    { 
      href: '/dashboard/settings', 
      label: 'Einstellungen', 
      icon: '⚙️', 
      description: 'Konto-Einstellungen',
      category: 'account' 
    },
    { 
      href: '/dashboard/billing', 
      label: 'Abrechnung', 
      icon: '💳', 
      description: 'Rechnungen und Zahlungen',
      category: 'account' 
    }
  ]

  // Add UAT items in development
  if (process.env.NODE_ENV === 'development' || process.env.UAT_MODE === 'true') {
    navItems.push({
      href: '/dashboard/uat', 
      label: 'UAT Tests', 
      icon: '🧪', 
      description: 'Test-Umgebung',
      category: 'dev' 
    })
  }

  // Profile menu items
  const profileMenuItems = [
    { href: '/dashboard/profile', label: 'Profil bearbeiten', icon: '👤' },
    { href: '/dashboard/help', label: 'Hilfe & Support', icon: '❓' },
    { href: '/dashboard/shortcuts', label: 'Tastaturkürzel', icon: '⌨️' },
    { type: 'divider' },
    { action: 'logout', label: 'Abmelden', icon: '🚪', destructive: true }
  ]

  // Handle mobile menu closing on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false)
        setIsProfileMenuOpen(false)
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [])

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false)
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('touchstart', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMobileMenuOpen])

  const isActive = (href) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard'
    }
    return pathname.startsWith(href)
  }

  const handleProfileMenuAction = (action) => {
    setIsProfileMenuOpen(false)
    if (action === 'logout') {
      onLogout()
    }
  }

  // Don't render on server to prevent hydration mismatch
  if (!isClient) {
    return (
      <div className="nav-fallback">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem' }}>
          <div style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>CarBot Dashboard</div>
          <div>{user?.email}</div>
        </div>
      </div>
    )
  }

  return (
    <nav 
      ref={navRef}
      className="bg-white border-b border-gray-200 sticky top-0 z-50"
      style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}
      role="navigation"
      aria-label="Dashboard navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-4">
            <Link 
              href="/dashboard" 
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
              aria-label="Dashboard Home"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-lg">🚗</span>
              </div>
              <span className="text-xl font-bold text-gray-900">CarBot</span>
            </Link>

            {/* Desktop Quick Navigation */}
            <div className="hidden lg:flex items-center space-x-1 ml-8">
              {navItems.slice(0, 5).map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 ${
                    isActive(item.href)
                      ? 'bg-blue-50 text-blue-700 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                  title={item.description}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                >
                  <span role="img" aria-hidden="true">{item.icon}</span>
                  <span className="hidden xl:inline">{item.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* User Info & Actions */}
          <div className="flex items-center gap-4">
            {/* Workshop Status */}
            {workshop && (
              <div className="hidden sm:flex flex-col items-end text-sm">
                <div className="font-semibold text-gray-900 truncate max-w-32">
                  {workshop.business_name || workshop.name}
                </div>
                <div className="text-gray-500 text-xs flex items-center gap-1">
                  <span className={`w-2 h-2 rounded-full ${workshop.verified ? 'bg-green-400' : 'bg-yellow-400'}`}></span>
                  {workshop.verified ? 'Verifiziert' : 'Nicht verifiziert'}
                </div>
              </div>
            )}

            {/* Profile Menu */}
            <div className="relative" ref={profileMenuRef}>
              <button
                type="button"
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                aria-expanded={isProfileMenuOpen}
                aria-label="Profile menu"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-sm font-medium text-gray-900 truncate max-w-32">
                    {user?.name || user?.email?.split('@')[0] || 'User'}
                  </div>
                  <div className="text-xs text-gray-500">
                    {user?.email ? user.email.split('@')[1] : 'account'}
                  </div>
                </div>
                <svg
                  className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                    isProfileMenuOpen ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Profile Dropdown */}
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  {/* User Info Header */}
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {user?.email}
                    </div>
                    <div className="text-xs text-gray-500">
                      {workshop?.business_name || 'Kein Workshop'}
                    </div>
                  </div>

                  {/* Profile Menu Items */}
                  {profileMenuItems.map((item, index) => (
                    item.type === 'divider' ? (
                      <div key={index} className="my-1 border-b border-gray-100" />
                    ) : item.action ? (
                      <button
                        key={index}
                        onClick={() => handleProfileMenuAction(item.action)}
                        className={`w-full text-left flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                          item.destructive ? 'text-red-600 hover:bg-red-50' : 'text-gray-700'
                        }`}
                      >
                        <span role="img" aria-hidden="true">{item.icon}</span>
                        {item.label}
                      </button>
                    ) : (
                      <Link
                        key={index}
                        href={item.href}
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <span role="img" aria-hidden="true">{item.icon}</span>
                        {item.label}
                      </Link>
                    )
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              type="button"
              className="lg:hidden inline-flex items-center justify-center p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
              aria-expanded={isMobileMenuOpen}
              aria-label="Toggle dashboard menu"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile/Tablet Navigation Menu */}
      <div
        className={`lg:hidden absolute top-full left-0 right-0 transform transition-all duration-300 ease-in-out ${
          isMobileMenuOpen 
            ? 'translate-y-0 opacity-100 pointer-events-auto' 
            : '-translate-y-4 opacity-0 pointer-events-none'
        }`}
        style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(229, 231, 235, 0.5)',
          maxHeight: 'calc(100vh - 4rem)',
          overflowY: 'auto'
        }}
      >
        <div className="px-4 py-4 space-y-1">
          {/* Grouped Navigation */}
          {Object.entries(
            navItems.reduce((acc, item) => {
              if (!acc[item.category]) acc[item.category] = []
              acc[item.category].push(item)
              return acc
            }, {})
          ).map(([category, items]) => (
            <div key={category} className="space-y-1">
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                {category === 'main' && 'Hauptbereich'}
                {category === 'customization' && 'Anpassung'}
                {category === 'analytics' && 'Analysen'}
                {category === 'account' && 'Konto'}
                {category === 'dev' && 'Entwicklung'}
              </div>
              {items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 ${
                    isActive(item.href)
                      ? 'bg-blue-50 text-blue-700 shadow-sm'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                >
                  <span className="text-lg" role="img" aria-hidden="true">{item.icon}</span>
                  <div className="flex-1">
                    <div className="font-medium">{item.label}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{item.description}</div>
                  </div>
                  {isActive(item.href) && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  )}
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          aria-hidden="true"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </nav>
  )
}