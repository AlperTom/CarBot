'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

export default function ModernNavigation({ variant = 'home' }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [isNavVisible, setIsNavVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const pathname = usePathname()
  const navRef = useRef(null)
  const mobileMenuRef = useRef(null)
  const logoRef = useRef(null)

  // Handle client-side hydration
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Enhanced scroll handling with hide/show navigation
  const handleScroll = useCallback(() => {
    if (typeof window === 'undefined') return

    const currentScrollY = window.scrollY
    const scrollThreshold = 10
    const hideNavThreshold = 100

    // Set scrolled state for styling changes
    setIsScrolled(currentScrollY > scrollThreshold)

    // Hide/show navigation on mobile for better UX
    if (currentScrollY > hideNavThreshold) {
      const isScrollingDown = currentScrollY > lastScrollY
      setIsNavVisible(!isScrollingDown || currentScrollY < lastScrollY - 50)
    } else {
      setIsNavVisible(true)
    }

    setLastScrollY(currentScrollY)
  }, [lastScrollY])

  useEffect(() => {
    // Throttled scroll handler for better performance
    let ticking = false
    
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll()
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', throttledScroll, { passive: true })
    return () => window.removeEventListener('scroll', throttledScroll)
  }, [handleScroll])

  // Enhanced mobile menu management with accessibility
  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false)
    // Return focus to menu button for accessibility
    const menuButton = document.querySelector('[data-mobile-menu-button]')
    if (menuButton) {
      menuButton.focus()
    }
  }, [])

  const toggleMobileMenu = useCallback((e) => {
    e.preventDefault()
    setIsMobileMenuOpen(prev => {
      const newState = !prev
      // Announce state change for screen readers
      const announcement = newState ? 'Menu opened' : 'Menu closed'
      const liveRegion = document.querySelector('[aria-live="polite"]')
      if (liveRegion) {
        liveRegion.textContent = announcement
      }
      return newState
    })
  }, [])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false)
      }
    }

    const handleEscape = (e) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        closeMobileMenu()
      }
    }

    const handleClickOutside = (e) => {
      if (isMobileMenuOpen && 
          mobileMenuRef.current && 
          !mobileMenuRef.current.contains(e.target) &&
          !e.target.closest('[data-mobile-menu-button]')) {
        closeMobileMenu()
      }
    }

    window.addEventListener('resize', handleResize)
    document.addEventListener('keydown', handleEscape)
    document.addEventListener('mousedown', handleClickOutside)
    
    return () => {
      window.removeEventListener('resize', handleResize)
      document.removeEventListener('keydown', handleEscape)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isMobileMenuOpen, closeMobileMenu])

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

  // Navigation items with enhanced accessibility and performance
  const navigationItems = [
    { 
      href: '/pricing', 
      label: 'Preisübersicht', 
      showOnDesktop: true,
      ariaLabel: 'Preisübersicht und Tarifinformationen anzeigen',
      icon: '💰'
    },
    { 
      href: '/demo/workshop', 
      label: 'Live Demo', 
      showOnDesktop: true,
      ariaLabel: 'Interaktive CarBot Demo starten',
      icon: '▶️'
    },
    { 
      href: '/docs', 
      label: 'Dokumentation', 
      showOnDesktop: true,
      ariaLabel: 'API Dokumentation und Guides öffnen',
      icon: '📚'
    },
    { 
      href: '/blog', 
      label: 'Blog', 
      showOnDesktop: true,
      ariaLabel: 'Blog und Fachbeiträge lesen',
      icon: '📝'
    },
    { 
      href: '/products', 
      label: 'Produkte', 
      showOnDesktop: false,
      ariaLabel: 'Alle CarBot Produkte anzeigen',
      icon: '🔧'
    },
    { 
      href: '/cases', 
      label: 'Fallstudien', 
      showOnDesktop: false,
      ariaLabel: 'Erfolgsgeschichten und Referenzen',
      icon: '✨'
    }
  ]

  const authItems = [
    { 
      href: '/auth/login', 
      label: 'Anmelden', 
      style: 'ghost',
      ariaLabel: 'Bei CarBot anmelden'
    },
    { 
      href: '/auth/register', 
      label: 'Jetzt starten', 
      style: 'primary',
      ariaLabel: '30 Tage kostenlosen Test starten'
    }
  ]

  const isActive = (href) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  // Server-side fallback with professional logo and accessibility
  if (!isClient) {
    return (
      <nav 
        className="fixed top-0 left-0 right-0 z-[9999] h-16"
        style={{
          background: variant === 'home' 
            ? 'rgba(17, 24, 39, 0.95)' 
            : 'rgba(255, 255, 255, 0.98)',
          backdropFilter: 'blur(20px)',
          borderBottom: variant === 'home'
            ? '1px solid rgba(75, 85, 99, 0.3)'
            : '1px solid rgba(229, 231, 235, 1)'
        }}
        role="navigation"
        aria-label="CarBot Hauptnavigation"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          <div className="flex-shrink-0">
            <Link 
              href="/" 
              className="flex items-center transition-all duration-300 hover:opacity-90"
              aria-label="CarBot Startseite"
            >
              <div className="h-10 w-36">
                <Image
                  src="/CarBot_Logo_Professional_Short.svg"
                  alt="CarBot - KI-gestützte Kundenberatung für Autowerkstätten"
                  width={144}
                  height={40}
                  priority
                  className="h-full w-full object-contain"
                  style={{ 
                    filter: variant === 'home' ? 'none' : 'brightness(0.8)' 
                  }}
                />
              </div>
            </Link>
          </div>
          
          <div className="hidden lg:flex items-center gap-8">
            {navigationItems.filter(item => item.showOnDesktop !== false).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors ${
                  variant === 'home' 
                    ? 'text-gray-300 hover:text-white' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                aria-label={item.ariaLabel}
              >
                {item.label}
              </Link>
            ))}
            
            <div className="flex items-center gap-3">
              {authItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    item.style === 'primary'
                      ? 'bg-orange-600 hover:bg-orange-700 text-white shadow-sm'
                      : variant === 'home'
                        ? 'text-gray-300 hover:text-white hover:bg-white/10'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                  aria-label={item.ariaLabel}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
        
        {/* Screen reader announcement region */}
        <div aria-live="polite" aria-atomic="true" className="sr-only"></div>
      </nav>
    )
  }

  return (
    <>
      <nav 
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-[9999] transition-all duration-500 ease-apple-signature ${
          !isNavVisible ? 'transform -translate-y-full' : 'transform translate-y-0'
        } ${
          isScrolled 
            ? 'h-16 bg-white/98 backdrop-blur-xl border-b border-gray-200 shadow-lg' 
            : 'h-16 bg-gray-900/95 backdrop-blur-xl border-b border-gray-700'
        }`}
        style={{
          // Professional styling with enhanced blur effects
          ...(!isScrolled && {
            background: 'rgba(17, 24, 39, 0.95)',
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            borderBottom: '1px solid rgba(75, 85, 99, 0.3)'
          })
        }}
        role="navigation"
        aria-label="CarBot Hauptnavigation"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex items-center justify-between h-full">
            
            {/* Enhanced Professional CarBot Logo */}
            <div className="flex-shrink-0">
              <Link 
                href="/" 
                ref={logoRef}
                className="flex items-center group transition-all duration-300 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-transparent rounded-lg p-1"
                aria-label="CarBot Startseite - KI-gestützte Kundenberatung für Autowerkstätten"
              >
                <div className="h-10 w-36 relative overflow-hidden">
                  <Image
                    src="/CarBot_Logo_Professional_Short.svg"
                    alt="CarBot - KI-gestützte Kundenberatung für Autowerkstätten"
                    width={144}
                    height={40}
                    priority
                    className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                    style={{ 
                      filter: isScrolled ? 'brightness(0.8)' : 'none',
                      transform: 'translateZ(0)' // GPU acceleration
                    }}
                  />
                  <div 
                    className="absolute inset-0 bg-gradient-to-r from-orange-500/0 via-orange-500/10 to-orange-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    aria-hidden="true"
                  />
                </div>
              </Link>
            </div>

            {/* Enhanced Desktop Navigation with Accessibility */}
            <div className="hidden lg:flex lg:items-center lg:gap-8">
              {navigationItems.filter(item => item.showOnDesktop !== false).map((item, index) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-medium transition-all duration-300 relative px-3 py-2 rounded-lg 
                    focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-transparent
                    ${
                    isActive(item.href)
                      ? isScrolled
                        ? 'text-gray-900 bg-gray-100/80'
                        : 'text-white bg-white/10'
                      : isScrolled
                        ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/50'
                        : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                  aria-label={item.ariaLabel}
                  style={{
                    animationDelay: `${index * 0.1}s`,
                    transform: 'translateZ(0)'
                  }}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-xs" role="img" aria-hidden="true">
                      {item.icon}
                    </span>
                    {item.label}
                  </span>
                  {isActive(item.href) && (
                    <div 
                      className={`absolute -bottom-1 left-3 right-3 h-0.5 rounded-full transition-all duration-300 ${
                        isScrolled ? 'bg-orange-600' : 'bg-orange-400'
                      }`}
                      aria-hidden="true"
                    />
                  )}
                </Link>
              ))}
            </div>

            {/* Enhanced Desktop Auth Buttons */}
            <div className="hidden lg:flex lg:items-center lg:gap-3">
              {authItems.map((item, index) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 
                    focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-transparent
                    transform hover:scale-105 active:scale-95 ${
                    item.style === 'primary'
                      ? 'bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white shadow-lg hover:shadow-xl'
                      : isScrolled
                        ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 border border-gray-200 hover:border-gray-300'
                        : 'text-gray-300 hover:text-white hover:bg-white/10 border border-white/20 hover:border-white/30'
                  }`}
                  aria-label={item.ariaLabel}
                  style={{
                    animationDelay: `${(navigationItems.length + index) * 0.1}s`,
                    transform: 'translateZ(0)'
                  }}
                >
                  {item.label}
                  {item.style === 'primary' && (
                    <span className="ml-1" role="img" aria-hidden="true">✨</span>
                  )}
                </Link>
              ))}
            </div>

            {/* Enhanced Mobile Menu Button */}
            <div className="lg:hidden">
              <button
                type="button"
                data-mobile-menu-button
                className={`inline-flex items-center justify-center p-3 rounded-xl transition-all duration-300 
                  focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-transparent
                  transform hover:scale-105 active:scale-95 ${
                  isScrolled
                    ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/80'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                } ${isMobileMenuOpen ? 'bg-orange-500 text-white' : ''}`}
                aria-expanded={isMobileMenuOpen}
                aria-label={isMobileMenuOpen ? 'Menü schließen' : 'Menü öffnen'}
                aria-controls="mobile-menu"
                onClick={toggleMobileMenu}
              >
                <div className="w-6 h-6 flex flex-col items-center justify-center">
                  <div className={`hamburger-line transition-all duration-300 ${
                    isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''
                  }`} />
                  <div className={`hamburger-line transition-all duration-300 ${
                    isMobileMenuOpen ? 'opacity-0' : 'opacity-100'
                  }`} />
                  <div className={`hamburger-line transition-all duration-300 ${
                    isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''
                  }`} />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Mobile Menu Overlay */}
        <div
          className={`lg:hidden fixed inset-0 bg-black/30 backdrop-blur-sm transition-all duration-300 ${
            isMobileMenuOpen 
              ? 'opacity-100 pointer-events-auto z-[9998]' 
              : 'opacity-0 pointer-events-none z-[-1]'
          }`}
          style={{ top: '64px' }}
          aria-hidden="true"
          onClick={closeMobileMenu}
        />

        {/* Enhanced Mobile Menu */}
        <div
          id="mobile-menu"
          ref={mobileMenuRef}
          className={`lg:hidden absolute left-0 right-0 glass-apple shadow-2xl transition-all duration-500 ease-apple-reveal ${
            isMobileMenuOpen 
              ? 'translate-y-0 opacity-100 scale-100' 
              : '-translate-y-4 opacity-0 scale-95 pointer-events-none'
          }`}
          style={{
            top: '100%',
            maxHeight: 'calc(100vh - 64px)',
            overflowY: 'auto',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px) saturate(180%)',
            borderBottom: '1px solid rgba(229, 231, 235, 0.8)'
          }}
          role="menu"
          aria-label="Mobile Navigation Menu"
        >
          <div className="px-6 py-8 space-y-2">
            {/* Mobile Navigation Links with Enhanced Accessibility */}
            {navigationItems.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-4 px-4 py-4 rounded-xl text-base font-medium transition-all duration-300 
                  focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-white
                  transform hover:scale-[1.02] active:scale-[0.98] ${
                  isActive(item.href)
                    ? 'bg-gradient-to-r from-orange-50 to-orange-100 text-orange-900 border border-orange-200'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50/80'
                }`}
                onClick={closeMobileMenu}
                aria-current={isActive(item.href) ? 'page' : undefined}
                aria-label={item.ariaLabel}
                role="menuitem"
                style={{
                  animationDelay: `${index * 0.1}s`,
                  transform: 'translateZ(0)'
                }}
              >
                <span className="text-lg flex-shrink-0" role="img" aria-hidden="true">
                  {item.icon}
                </span>
                <span className="flex-1">{item.label}</span>
                {isActive(item.href) && (
                  <span className="text-orange-600" role="img" aria-label="Aktuelle Seite">
                    ●
                  </span>
                )}
              </Link>
            ))}

            {/* Enhanced Mobile Auth Buttons */}
            <div className="pt-8 border-t border-gray-200/50 space-y-4">
              <div className="text-sm text-gray-500 text-center mb-4">
                Starten Sie noch heute
              </div>
              {authItems.map((item, index) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-base font-semibold transition-all duration-300 
                    focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-white
                    transform hover:scale-[1.02] active:scale-[0.98] ${
                    item.style === 'primary'
                      ? 'bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white shadow-lg hover:shadow-xl'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100/80 border-2 border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={closeMobileMenu}
                  aria-label={item.ariaLabel}
                  role="menuitem"
                  style={{
                    animationDelay: `${(navigationItems.length + index) * 0.1}s`,
                    transform: 'translateZ(0)'
                  }}
                >
                  {item.label}
                  {item.style === 'primary' && (
                    <span className="ml-1" role="img" aria-hidden="true">✨</span>
                  )}
                </Link>
              ))}
            </div>

            {/* Quick Info Section */}
            <div className="pt-6 border-t border-gray-200/50 text-center text-sm text-gray-500">
              <p>
                🚀 30 Tage kostenlos testen<br/>
                🔒 DSGVO-konform
              </p>
            </div>
          </div>
        </div>
      </nav>

      {/* Enhanced Spacer with Dynamic Height */}
      <div 
        className="transition-all duration-500"
        style={{ 
          height: isNavVisible ? '64px' : '0px',
          pointerEvents: 'none' 
        }} 
        aria-hidden="true" 
      />
      
      {/* Screen Reader Live Region for Announcements */}
      <div 
        aria-live="polite" 
        aria-atomic="true" 
        className="sr-only"
        role="status"
      ></div>
      
      {/* Skip Navigation Link for Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[10000] 
          focus:px-4 focus:py-2 focus:bg-orange-600 focus:text-white focus:rounded-lg focus:shadow-lg
          focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
      >
        Zum Hauptinhalt springen
      </a>
    </>
  )
}