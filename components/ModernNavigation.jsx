'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

export default function ModernNavigation({ variant = 'home' }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()

  // Scroll detection with emergency fallback
  useEffect(() => {
    const handleScroll = () => {
      try {
        setIsScrolled(window.scrollY > 10)
      } catch (error) {
        console.error('Scroll handler error:', error)
      }
    }
    
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', handleScroll, { passive: true })
      return () => window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // Close mobile menu on escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false)
      }
    }
    
    if (isMobileMenuOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isMobileMenuOpen])

  const isActive = (href) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  const navItems = [
    { href: '/pricing', label: 'Preisübersicht', icon: '💰' },
    { href: '/demo/workshop', label: 'Live Demo', icon: '▶️' },
    { href: '/docs', label: 'Dokumentation', icon: '📚' },
    { href: '/blog', label: 'Blog', icon: '📝' }
  ]

  const authItems = [
    { href: '/auth/login', label: 'Anmelden', style: 'ghost' },
    { href: '/auth/register', label: 'Jetzt starten', style: 'primary' }
  ]

  // Emergency inline styles for guaranteed rendering
  const emergencyStyles = `
    .emergency-nav {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 9999;
      height: 64px;
      transition: all 0.3s ease;
    }
    
    .emergency-nav.scrolled {
      background: rgba(255, 255, 255, 0.98);
      backdrop-filter: blur(20px);
      border-bottom: 1px solid rgba(229, 231, 235, 1);
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }
    
    .emergency-nav.home {
      background: rgba(17, 24, 39, 0.95);
      backdrop-filter: blur(20px);
      border-bottom: 1px solid rgba(75, 85, 99, 0.3);
    }
    
    .emergency-nav.page {
      background: rgba(255, 255, 255, 0.98);
      backdrop-filter: blur(20px);
      border-bottom: 1px solid rgba(229, 231, 235, 1);
    }
    
    .emergency-container {
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 1rem;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    
    .emergency-logo {
      display: flex;
      align-items: center;
      text-decoration: none;
      transition: opacity 0.3s ease;
    }
    
    .emergency-logo:hover {
      opacity: 0.9;
    }
    
    .emergency-desktop-nav {
      display: none;
      align-items: center;
      gap: 2rem;
    }
    
    .emergency-nav-link {
      text-decoration: none;
      font-weight: 500;
      font-size: 14px;
      padding: 0.5rem 0.75rem;
      border-radius: 6px;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    
    .emergency-nav-link.active {
      font-weight: 600;
      background: rgba(234, 88, 12, 0.1);
      color: #ea580c;
    }
    
    .emergency-auth-buttons {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    
    .emergency-auth-link {
      padding: 0.625rem 1.5rem;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 600;
      font-size: 14px;
      transition: all 0.3s ease;
      display: inline-block;
    }
    
    .emergency-auth-primary {
      background: linear-gradient(135deg, #ea580c 0%, #9333ea 50%, #2563eb 100%);
      color: white;
      border: none;
    }
    
    .emergency-auth-primary:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(234, 88, 12, 0.3);
    }
    
    .emergency-auth-ghost {
      background: transparent;
      border: 1px solid rgba(255, 255, 255, 0.3);
      color: #e5e7eb;
    }
    
    .emergency-auth-ghost.scrolled {
      color: #374151;
      border-color: #d1d5db;
    }
    
    .emergency-auth-ghost:hover {
      background: rgba(255, 255, 255, 0.1);
    }
    
    .emergency-mobile-button {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 48px;
      height: 48px;
      background: transparent;
      border: none;
      cursor: pointer;
      padding: 12px;
      border-radius: 8px;
      transition: all 0.3s ease;
    }
    
    .emergency-hamburger {
      width: 20px;
      height: 2px;
      background: currentColor;
      margin: 2px 0;
      transition: all 0.3s ease;
      border-radius: 1px;
    }
    
    .emergency-hamburger.active:nth-child(1) {
      transform: rotate(45deg) translateY(6px);
    }
    
    .emergency-hamburger.active:nth-child(2) {
      opacity: 0;
    }
    
    .emergency-hamburger.active:nth-child(3) {
      transform: rotate(-45deg) translateY(-6px);
    }
    
    .emergency-mobile-menu {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: rgba(255, 255, 255, 0.98);
      backdrop-filter: blur(20px);
      border-bottom: 1px solid rgba(229, 231, 235, 0.8);
      padding: 1.5rem;
      max-height: calc(100vh - 64px);
      overflow-y: auto;
      display: none;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    }
    
    .emergency-mobile-menu.open {
      display: block;
    }
    
    .emergency-mobile-link {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem 0;
      text-decoration: none;
      color: #374151;
      font-weight: 500;
      font-size: 16px;
      border-bottom: 1px solid rgba(229, 231, 235, 0.5);
      transition: all 0.3s ease;
    }
    
    .emergency-mobile-link.active {
      color: #ea580c;
      font-weight: 600;
    }
    
    .emergency-mobile-link:hover {
      color: #ea580c;
    }
    
    .emergency-mobile-auth {
      margin-top: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    
    .emergency-spacer {
      height: 64px;
    }
    
    /* Emergency text colors based on state */
    .emergency-nav.home .emergency-nav-link:not(.active) {
      color: #e5e7eb;
    }
    
    .emergency-nav.home .emergency-nav-link:not(.active):hover {
      color: #ea580c;
    }
    
    .emergency-nav.scrolled .emergency-nav-link:not(.active),
    .emergency-nav.page .emergency-nav-link:not(.active) {
      color: #374151;
    }
    
    .emergency-nav.scrolled .emergency-nav-link:not(.active):hover,
    .emergency-nav.page .emergency-nav-link:not(.active):hover {
      color: #ea580c;
    }
    
    .emergency-nav.home .emergency-mobile-button {
      color: #e5e7eb;
    }
    
    .emergency-nav.scrolled .emergency-mobile-button,
    .emergency-nav.page .emergency-mobile-button {
      color: #374151;
    }
    
    @media (min-width: 1024px) {
      .emergency-desktop-nav {
        display: flex !important;
      }
      .emergency-mobile-button {
        display: none !important;
      }
    }
    
    @media (max-width: 1023px) {
      .emergency-desktop-nav {
        display: none !important;
      }
      .emergency-mobile-button {
        display: flex !important;
      }
    }
  `

  const getNavClasses = () => {
    let classes = 'emergency-nav'
    if (isScrolled) classes += ' scrolled'
    else if (variant === 'home') classes += ' home'
    else classes += ' page'
    return classes
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: emergencyStyles }} />
      
      <nav className={getNavClasses()} role="navigation" aria-label="CarBot Hauptnavigation">
        <div className="emergency-container">
          {/* Logo */}
          <div>
            <Link href="/" className="emergency-logo" aria-label="CarBot Startseite">
              <div style={{ height: '40px', width: '144px' }}>
                <Image
                  src="/CarBot_Logo_Professional_Short.svg"
                  alt="CarBot - KI-gestützte Kundenberatung für Autowerkstätten"
                  width={144}
                  height={40}
                  priority
                  style={{ 
                    height: '100%', 
                    width: '100%', 
                    objectFit: 'contain'
                  }}
                />
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="emergency-desktop-nav">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`emergency-nav-link ${isActive(item.href) ? 'active' : ''}`}
                aria-current={isActive(item.href) ? 'page' : undefined}
              >
                <span role="img" aria-hidden="true">{item.icon}</span>
                {item.label}
              </Link>
            ))}

            {/* Auth Buttons */}
            <div className="emergency-auth-buttons">
              {authItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`emergency-auth-link emergency-auth-${item.style} ${
                    item.style === 'ghost' && (isScrolled || variant !== 'home') ? 'scrolled' : ''
                  }`}
                >
                  {item.label}
                  {item.style === 'primary' && <span style={{ marginLeft: '4px' }}>✨</span>}
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="emergency-mobile-button"
            onClick={toggleMobileMenu}
            aria-expanded={isMobileMenuOpen}
            aria-label={isMobileMenuOpen ? 'Menü schließen' : 'Menü öffnen'}
          >
            <div className={`emergency-hamburger ${isMobileMenuOpen ? 'active' : ''}`} />
            <div className={`emergency-hamburger ${isMobileMenuOpen ? 'active' : ''}`} />
            <div className={`emergency-hamburger ${isMobileMenuOpen ? 'active' : ''}`} />
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`emergency-mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`emergency-mobile-link ${isActive(item.href) ? 'active' : ''}`}
              onClick={closeMobileMenu}
              aria-current={isActive(item.href) ? 'page' : undefined}
            >
              <span role="img" aria-hidden="true">{item.icon}</span>
              {item.label}
            </Link>
          ))}

          <div className="emergency-mobile-auth">
            {authItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`emergency-auth-link emergency-auth-${item.style}`}
                onClick={closeMobileMenu}
                style={{ textAlign: 'center' }}
              >
                {item.label}
                {item.style === 'primary' && <span style={{ marginLeft: '4px' }}>✨</span>}
              </Link>
            ))}
          </div>

          <div style={{ 
            marginTop: '1.5rem', 
            paddingTop: '1.5rem', 
            borderTop: '1px solid rgba(229, 231, 235, 0.5)',
            textAlign: 'center',
            fontSize: '14px',
            color: '#6b7280'
          }}>
            🚀 30 Tage kostenlos testen<br/>
            🔒 DSGVO-konform
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            top: '64px',
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.3)',
            zIndex: 9998,
            backdropFilter: 'blur(2px)'
          }}
          onClick={closeMobileMenu}
          aria-hidden="true"
        />
      )}

      {/* Spacer */}
      <div className="emergency-spacer" aria-hidden="true" />

      {/* Skip Navigation Link */}
      <a
        href="#main-content"
        style={{
          position: 'absolute',
          top: '-100px',
          left: '1rem',
          zIndex: 10000,
          padding: '0.5rem 1rem',
          background: '#ea580c',
          color: 'white',
          borderRadius: '6px',
          textDecoration: 'none',
          fontSize: '14px',
          fontWeight: '600',
          transition: 'all 0.3s ease'
        }}
        onFocus={(e) => {
          e.target.style.top = '1rem'
        }}
        onBlur={(e) => {
          e.target.style.top = '-100px'
        }}
      >
        Zum Hauptinhalt springen
      </a>
    </>
  )
}