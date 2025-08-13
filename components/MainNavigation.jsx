'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function MainNavigation({ variant = 'home' }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const pathname = usePathname()
  const navRef = useRef(null)

  // Handle client-side hydration
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      setIsScrolled(scrollTop > 20)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Handle mobile menu closing on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Handle escape key to close mobile menu
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false)
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [])

  // Handle click outside to close mobile menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false)
      }
    }

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('touchstart', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [isMobileMenuOpen])

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

  // Navigation items based on variant
  const getNavigationItems = () => {
    const baseItems = [
      { href: '/pricing', label: 'Preise', icon: '💰' },
      { href: '/docs', label: 'Dokumentation', icon: '📚' },
      { href: '/cases', label: 'Referenzen', icon: '🏆' },
      { href: '/blog', label: 'Blog', icon: '📝' }
    ]

    const authItems = [
      { href: '/auth/login', label: 'Anmelden', icon: '🔐', style: 'secondary' },
      { href: '/auth/register', label: 'Kostenlos starten', icon: '🚀', style: 'primary' }
    ]

    return { baseItems, authItems }
  }

  const { baseItems, authItems } = getNavigationItems()

  const isActive = (href) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  // Server-side fallback navigation to prevent hydration mismatch
  if (!isClient) {
    return (
      <nav 
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '1rem 0'
        }}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link 
              href="/" 
              className="flex items-center gap-3 text-decoration-none hover:opacity-80 transition-opacity"
              aria-label="CarBot Homepage"
              style={{ textDecoration: 'none', color: 'white' }}
            >
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #ea580c 0%, #9333ea 100%)',
                }}
              >
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
              <span className="text-xl font-bold" style={{ color: 'white' }}>
                CarBot
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex md:items-center md:space-x-1">
              {baseItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                  style={{ 
                    color: '#cbd5e1', 
                    textDecoration: 'none' 
                  }}
                >
                  <span style={{ marginRight: '0.5rem' }} role="img" aria-hidden="true">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex md:items-center md:space-x-3">
              {authItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200"
                  style={{
                    color: item.style === 'primary' ? 'white' : '#cbd5e1',
                    textDecoration: 'none',
                    background: item.style === 'primary' 
                      ? 'linear-gradient(135deg, #ea580c 0%, #9333ea 50%, #2563eb 100%)' 
                      : 'transparent',
                    border: item.style === 'secondary' 
                      ? '1px solid rgba(255, 255, 255, 0.2)' 
                      : 'none'
                  }}
                >
                  <span style={{ marginRight: '0.5rem' }} role="img" aria-hidden="true">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Mobile Menu Button - simple fallback */}
            <div className="md:hidden">
              <div className="w-6 h-6 text-gray-300">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </div>
            </div>
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
          isScrolled ? 'backdrop-blur-md bg-white/80 border-b border-gray-200/50' : 'bg-transparent'
        }`}
        style={{
          background: variant === 'home' 
            ? (isScrolled ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.2)')
            : (isScrolled ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.9)'),
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: isScrolled ? '1px solid rgba(255, 255, 255, 0.1)' : 'none'
        }}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link 
                href="/" 
                className="flex items-center gap-3 text-decoration-none hover:opacity-80 transition-opacity"
                aria-label="CarBot Homepage"
              >
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, #ea580c 0%, #9333ea 100%)',
                  }}
                >
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
                <span 
                  className="text-xl font-bold"
                  style={{ 
                    color: variant === 'home' ? 'white' : '#1f2937' 
                  }}
                >
                  CarBot
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex md:items-center md:space-x-1">
              {baseItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 ${
                    isActive(item.href)
                      ? 'bg-white/20 text-white shadow-sm'
                      : variant === 'home' 
                        ? 'text-gray-300 hover:text-white hover:bg-white/10' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                >
                  <span className="mr-2" role="img" aria-hidden="true">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex md:items-center md:space-x-3">
              {authItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 hover:scale-105 ${
                    item.style === 'primary'
                      ? 'bg-gradient-to-r from-orange-500 to-purple-600 text-white shadow-lg hover:shadow-xl'
                      : variant === 'home'
                        ? 'text-gray-300 hover:text-white hover:bg-white/10'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <span className="mr-2" role="img" aria-hidden="true">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                type="button"
                className={`inline-flex items-center justify-center p-2 rounded-lg transition-all duration-200 hover:scale-105 ${
                  variant === 'home' 
                    ? 'text-gray-300 hover:text-white hover:bg-white/10' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
                aria-expanded={isMobileMenuOpen}
                aria-label="Toggle mobile menu"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <svg
                  className="w-6 h-6"
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

        {/* Mobile Menu */}
        <div
          className={`md:hidden absolute top-full left-0 right-0 transform transition-all duration-300 ease-in-out ${
            isMobileMenuOpen 
              ? 'translate-y-0 opacity-100 pointer-events-auto' 
              : '-translate-y-4 opacity-0 pointer-events-none'
          }`}
          style={{
            background: variant === 'home' 
              ? 'rgba(0, 0, 0, 0.95)' 
              : 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            maxHeight: 'calc(100vh - 4rem)',
            overflowY: 'auto'
          }}
        >
          <div className="px-4 py-4 space-y-2">
            {/* Mobile Navigation Links */}
            {baseItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                  isActive(item.href)
                    ? 'bg-white/20 text-white shadow-sm'
                    : variant === 'home'
                      ? 'text-gray-300 hover:text-white hover:bg-white/10'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
                aria-current={isActive(item.href) ? 'page' : undefined}
              >
                <span className="mr-3 text-lg" role="img" aria-hidden="true">{item.icon}</span>
                {item.label}
              </Link>
            ))}

            {/* Mobile Auth Buttons */}
            <div className="pt-4 border-t border-white/10 space-y-2">
              {authItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-center px-4 py-3 rounded-lg text-base font-semibold transition-all duration-200 ${
                    item.style === 'primary'
                      ? 'bg-gradient-to-r from-orange-500 to-purple-600 text-white shadow-lg'
                      : variant === 'home'
                        ? 'text-gray-300 hover:text-white hover:bg-white/10'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="mr-3 text-lg" role="img" aria-hidden="true">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
          aria-hidden="true"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Spacer to prevent content from hiding behind fixed nav */}
      <div className="h-16" aria-hidden="true" />
    </>
  )
}