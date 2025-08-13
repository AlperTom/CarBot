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

  // Navigation items
  const navigationItems = [
    { href: '/', label: 'Home', showOnDesktop: false },
    { href: '/products', label: 'Products', icon: '🛠️' },
    { href: '/pricing', label: 'Pricing', icon: '💰' },
    { href: '/docs', label: 'Docs', icon: '📚' },
    { href: '/blog', label: 'Blog', icon: '📝' },
    { href: '/cases', label: 'Cases', icon: '🏆' }
  ]

  const authItems = [
    { href: '/auth/login', label: 'Sign in', style: 'ghost' },
    { href: '/auth/register', label: 'Get started', style: 'primary' }
  ]

  const isActive = (href) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  // Server fallback
  if (!isClient) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 h-16" style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(0, 0, 0, 0.08)'
      }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-purple-600 flex items-center justify-center">
              <svg width="16" height="16" fill="white" viewBox="0 0 24 24">
                <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99z"/>
              </svg>
            </div>
            <span className="text-xl font-bold text-gray-900">CarBot</span>
          </Link>
          
          <div className="hidden lg:flex items-center gap-1">
            {navigationItems.filter(item => item.showOnDesktop !== false).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-3 py-2 text-sm text-gray-600 rounded-lg hover:bg-gray-100"
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
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'h-16 bg-white/95 backdrop-blur-xl border-b border-black/[0.08] shadow-sm' 
            : 'h-20 bg-transparent'
        }`}
        style={{
          // Modern glassmorphism effect
          ...(isScrolled && {
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(0, 0, 0, 0.08)'
          })
        }}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex items-center justify-between h-full">
            
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link 
                href="/" 
                className="flex items-center gap-3 group"
                aria-label="CarBot Homepage"
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-105 ${
                  isScrolled 
                    ? 'bg-gradient-to-br from-orange-500 to-purple-600 shadow-lg' 
                    : 'bg-gradient-to-br from-orange-500 to-purple-600 shadow-xl'
                }`}>
                  <svg 
                    width="16" 
                    height="16" 
                    fill="white" 
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
                  </svg>
                </div>
                <span className={`text-xl font-bold transition-colors duration-300 ${
                  isScrolled ? 'text-gray-900' : 'text-white'
                }`}>
                  CarBot
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex lg:items-center lg:gap-1">
              {navigationItems.filter(item => item.showOnDesktop !== false).map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive(item.href)
                      ? isScrolled
                        ? 'bg-gray-100 text-gray-900'
                        : 'bg-white/20 text-white'
                      : isScrolled
                        ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                >
                  <span className="flex items-center gap-2">
                    {item.icon && (
                      <span className="text-sm" role="img" aria-hidden="true">
                        {item.icon}
                      </span>
                    )}
                    {item.label}
                  </span>
                </Link>
              ))}
            </div>

            {/* Desktop Auth Buttons */}
            <div className="hidden lg:flex lg:items-center lg:gap-3">
              {authItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    item.style === 'primary'
                      ? 'bg-gradient-to-r from-orange-500 to-purple-600 text-white shadow-lg hover:shadow-xl hover:scale-105'
                      : isScrolled
                        ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 border border-gray-200'
                        : 'text-gray-300 hover:text-white hover:bg-white/10 border border-white/20'
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
      <div className={isScrolled ? 'h-16' : 'h-20'} aria-hidden="true" />
    </>
  )
}