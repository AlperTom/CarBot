'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function ModernNavigation({ variant = 'home' }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const pathname = usePathname()
  const navRef = useRef(null)

  // Handle client-side hydration
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Modern scroll handling with smooth transitions
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      setIsScrolled(scrollTop > 10)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Handle mobile menu closing
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false)
      }
    }

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    document.addEventListener('keydown', handleEscape)
    
    return () => {
      window.removeEventListener('resize', handleResize)
      document.removeEventListener('keydown', handleEscape)
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

  // Navigation items - n8n.io inspired clean layout
  const navigationItems = [
    { href: '/pricing', label: 'Preisübersicht', showOnDesktop: true },
    { href: '/demo/workshop', label: 'Live Demo', showOnDesktop: true },
    { href: '/docs', label: 'Dokumentation', showOnDesktop: true },
    { href: '/blog', label: 'Blog', showOnDesktop: true },
    { href: '/products', label: 'Products', showOnDesktop: false },
    { href: '/cases', label: 'Cases', showOnDesktop: false }
  ]

  const authItems = [
    { href: '/auth/login', label: 'Anmelden', style: 'ghost' },
    { href: '/auth/register', label: 'Jetzt starten', style: 'primary' }
  ]

  const isActive = (href) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  // Server fallback - Use proper background based on variant
  if (!isClient) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-[9999] h-16" style={{
        background: variant === 'home' 
          ? 'rgba(17, 24, 39, 0.95)' 
          : 'rgba(255, 255, 255, 0.98)',
        backdropFilter: 'blur(20px)',
        borderBottom: variant === 'home'
          ? '1px solid rgba(75, 85, 99, 0.3)'
          : '1px solid rgba(229, 231, 235, 1)'
      }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <img 
              src="/images/logo-short.svg" 
              alt="CarBot - Ihr digitaler Serviceberater"
              width="140"
              height="38"
              className="transition-all duration-300 hover:scale-105"
            />
          </Link>
          
          <div className="hidden lg:flex items-center gap-8">
            {navigationItems.filter(item => item.showOnDesktop !== false).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors ${variant === 'home' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    )
  }

  return (
    <>
      <nav 
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-[9999] transition-all duration-300 ${
          isScrolled 
            ? 'h-16 bg-white/98 backdrop-blur-xl border-b border-gray-200 shadow-sm' 
            : 'h-16 bg-gray-900/95 backdrop-blur-xl border-b border-gray-700'
        }`}
        style={{
          // Clean n8n.io inspired styling
          ...(!isScrolled && {
            background: 'rgba(17, 24, 39, 0.95)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(75, 85, 99, 0.3)'
          })
        }}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex items-center justify-between h-full">
            
            {/* Professional CarBot Logo */}
            <div className="flex-shrink-0">
              <Link 
                href="/" 
                className="flex items-center transition-all duration-300 hover:opacity-90"
                aria-label="CarBot - Ihr digitaler Serviceberater"
              >
                <div className="h-10 w-36">
                  <img 
                    src="/CarBot_Logo_Professional_Short.svg" 
                    alt="CarBot - Ihr digitaler Serviceberater"
                    className="h-full w-full object-contain"
                    height="40"
                    width="144"
                  />
                </div>
              </Link>
            </div>

            {/* Desktop Navigation - n8n.io clean style */}
            <div className="hidden lg:flex lg:items-center lg:gap-8">
              {navigationItems.filter(item => item.showOnDesktop !== false).map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-medium transition-all duration-200 relative ${
                    isActive(item.href)
                      ? isScrolled
                        ? 'text-gray-900'
                        : 'text-white'
                      : isScrolled
                        ? 'text-gray-600 hover:text-gray-900'
                        : 'text-gray-300 hover:text-white'
                  }`}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                >
                  {item.label}
                  {isActive(item.href) && (
                    <div className={`absolute -bottom-1 left-0 right-0 h-0.5 rounded-full ${
                      isScrolled ? 'bg-gray-900' : 'bg-white'
                    }`} />
                  )}
                </Link>
              ))}
            </div>

            {/* Desktop Auth Buttons - n8n.io style */}
            <div className="hidden lg:flex lg:items-center lg:gap-3">
              {authItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    item.style === 'primary'
                      ? isScrolled
                        ? 'bg-orange-600 hover:bg-orange-700 text-white shadow-sm'
                        : 'bg-orange-600 hover:bg-orange-700 text-white shadow-sm'
                      : isScrolled
                        ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                        : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <button
                type="button"
                className={`inline-flex items-center justify-center p-2 rounded-xl transition-all duration-200 ${
                  isScrolled
                    ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
                aria-expanded={isMobileMenuOpen}
                aria-label="Toggle mobile menu"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <svg
                  className={`w-6 h-6 transition-transform duration-300 ${
                    isMobileMenuOpen ? 'rotate-90' : 'rotate-0'
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {isMobileMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <div
          className={`lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-300 ${
            isMobileMenuOpen 
              ? 'opacity-100 pointer-events-auto' 
              : 'opacity-0 pointer-events-none'
          }`}
          style={{ top: isScrolled ? '64px' : '80px' }}
          aria-hidden="true"
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* Mobile Menu */}
        <div
          className={`lg:hidden absolute left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-gray-200/50 shadow-xl transition-all duration-300 ${
            isMobileMenuOpen 
              ? 'translate-y-0 opacity-100' 
              : '-translate-y-4 opacity-0 pointer-events-none'
          }`}
          style={{
            top: '100%',
            maxHeight: 'calc(100vh - 80px)',
            overflowY: 'auto'
          }}
        >
          <div className="px-4 py-6 space-y-1">
            {/* Mobile Navigation Links */}
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 ${
                  isActive(item.href)
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
                aria-current={isActive(item.href) ? 'page' : undefined}
              >
                {item.icon && (
                  <span className="text-lg" role="img" aria-hidden="true">
                    {item.icon}
                  </span>
                )}
                {item.label}
              </Link>
            ))}

            {/* Mobile Auth Buttons */}
            <div className="pt-6 border-t border-gray-200/50 space-y-3">
              {authItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-center px-4 py-3 rounded-xl text-base font-semibold transition-all duration-200 ${
                    item.style === 'primary'
                      ? 'bg-gradient-to-r from-orange-500 to-purple-600 text-white shadow-lg'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 border border-gray-200'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer */}
      <div className="h-16" aria-hidden="true" />
    </>
  )
}