'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

export default function EmergencyNavigation({ variant = 'home' }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isActive = (href) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const navItems = [
    { href: '/pricing', label: 'Preisübersicht' },
    { href: '/demo/workshop', label: 'Live Demo' },
    { href: '/docs', label: 'Dokumentation' },
    { href: '/blog', label: 'Blog' }
  ]

  // Emergency inline styles
  const navStyles = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    height: '64px',
    background: isScrolled 
      ? 'rgba(255, 255, 255, 0.98)' 
      : variant === 'home' 
        ? 'rgba(17, 24, 39, 0.95)' 
        : 'rgba(255, 255, 255, 0.98)',
    backdropFilter: 'blur(20px)',
    borderBottom: isScrolled || variant !== 'home' 
      ? '1px solid rgba(229, 231, 235, 1)' 
      : '1px solid rgba(75, 85, 99, 0.3)',
    transition: 'all 0.3s ease'
  }

  const containerStyles = {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '0 1rem',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  }

  const logoStyles = {
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
    transition: 'opacity 0.3s ease'
  }

  const logoImageStyles = {
    height: '40px',
    width: '144px',
    objectFit: 'contain'
  }

  const desktopNavStyles = {
    display: 'none',
    alignItems: 'center',
    gap: '2rem'
  }

  const mobileButtonStyles = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '48px',
    height: '48px',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: '12px',
    borderRadius: '8px',
    transition: 'all 0.3s ease'
  }

  const hamburgerLineStyles = {
    width: '20px',
    height: '2px',
    background: isScrolled || variant !== 'home' ? '#374151' : '#e5e7eb',
    margin: '2px 0',
    transition: 'all 0.3s ease',
    borderRadius: '1px'
  }

  const mobileMenuStyles = {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    background: 'rgba(255, 255, 255, 0.98)',
    backdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(229, 231, 235, 0.8)',
    padding: '1.5rem',
    display: isMobileMenuOpen ? 'block' : 'none',
    maxHeight: 'calc(100vh - 64px)',
    overflowY: 'auto'
  }

  const authButtonStyles = {
    padding: '0.625rem 1.5rem',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '14px',
    transition: 'all 0.3s ease',
    display: 'inline-block'
  }

  const primaryButtonStyles = {
    ...authButtonStyles,
    background: 'linear-gradient(135deg, #ea580c 0%, #9333ea 50%, #2563eb 100%)',
    color: 'white',
    border: 'none'
  }

  const secondaryButtonStyles = {
    ...authButtonStyles,
    background: 'transparent',
    color: isScrolled || variant !== 'home' ? '#374151' : '#e5e7eb',
    border: `1px solid ${isScrolled || variant !== 'home' ? '#d1d5db' : 'rgba(255, 255, 255, 0.3)'}`
  }

  // Media query styles using CSS
  const responsiveStyles = `
    @media (min-width: 1024px) {
      .desktop-nav { display: flex !important; }
      .mobile-button { display: none !important; }
    }
    @media (max-width: 1023px) {
      .desktop-nav { display: none !important; }
      .mobile-button { display: flex !important; }
    }
  `

  return (
    <>
      <style jsx>{responsiveStyles}</style>
      
      <nav style={navStyles} role="navigation" aria-label="CarBot Hauptnavigation">
        <div style={containerStyles}>
          {/* Logo */}
          <div>
            <Link href="/" style={logoStyles} aria-label="CarBot Startseite">
              <div style={{ height: '40px', width: '144px' }}>
                <Image
                  src="/CarBot_Logo_Professional_Short.svg"
                  alt="CarBot - KI-gestützte Kundenberatung für Autowerkstätten"
                  width={144}
                  height={40}
                  priority
                  style={logoImageStyles}
                />
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="desktop-nav" style={desktopNavStyles}>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  textDecoration: 'none',
                  color: isActive(item.href)
                    ? '#ea580c'
                    : isScrolled || variant !== 'home'
                      ? '#374151'
                      : '#e5e7eb',
                  fontWeight: isActive(item.href) ? '600' : '500',
                  fontSize: '14px',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '6px',
                  transition: 'all 0.3s ease',
                  backgroundColor: isActive(item.href)
                    ? 'rgba(234, 88, 12, 0.1)'
                    : 'transparent'
                }}
                onMouseEnter={(e) => {
                  if (!isActive(item.href)) {
                    e.target.style.color = '#ea580c'
                    e.target.style.backgroundColor = 'rgba(234, 88, 12, 0.05)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive(item.href)) {
                    e.target.style.color = isScrolled || variant !== 'home' ? '#374151' : '#e5e7eb'
                    e.target.style.backgroundColor = 'transparent'
                  }
                }}
              >
                {item.label}
              </Link>
            ))}

            {/* Auth Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Link href="/auth/login" style={secondaryButtonStyles}>
                Anmelden
              </Link>
              <Link href="/auth/register" style={primaryButtonStyles}>
                Jetzt starten
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="mobile-button"
            style={mobileButtonStyles}
            onClick={toggleMobileMenu}
            aria-expanded={isMobileMenuOpen}
            aria-label={isMobileMenuOpen ? 'Menü schließen' : 'Menü öffnen'}
          >
            <div style={{
              ...hamburgerLineStyles,
              transform: isMobileMenuOpen ? 'rotate(45deg) translateY(6px)' : 'none'
            }} />
            <div style={{
              ...hamburgerLineStyles,
              opacity: isMobileMenuOpen ? 0 : 1
            }} />
            <div style={{
              ...hamburgerLineStyles,
              transform: isMobileMenuOpen ? 'rotate(-45deg) translateY(-6px)' : 'none'
            }} />
          </button>
        </div>

        {/* Mobile Menu */}
        <div style={mobileMenuStyles}>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'block',
                padding: '1rem 0',
                textDecoration: 'none',
                color: isActive(item.href) ? '#ea580c' : '#374151',
                fontWeight: isActive(item.href) ? '600' : '500',
                fontSize: '16px',
                borderBottom: '1px solid rgba(229, 231, 235, 0.5)'
              }}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}

          <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <Link
              href="/auth/login"
              style={{
                ...authButtonStyles,
                backgroundColor: 'transparent',
                border: '1px solid #d1d5db',
                color: '#374151',
                textAlign: 'center'
              }}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Anmelden
            </Link>
            <Link
              href="/auth/register"
              style={{
                ...primaryButtonStyles,
                textAlign: 'center'
              }}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Jetzt starten
            </Link>
          </div>
        </div>
      </nav>

      {/* Spacer */}
      <div style={{ height: '64px' }} aria-hidden="true" />
    </>
  )
}