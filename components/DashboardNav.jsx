'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function DashboardNav({ user, workshop, onLogout }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const navItems = [
    { href: '/dashboard', label: 'Übersicht', icon: '📊' },
    { href: '/dashboard/clients', label: 'Clients', icon: '👥' },
    { href: '/dashboard/leads', label: 'Leads', icon: '🎯' },
    { href: '/dashboard/appointments', label: 'Termine', icon: '📅' },
    { href: '/dashboard/client-keys', label: 'Client-Keys', icon: '🔑' },
    { href: '/dashboard/widget-customizer', label: 'Widget Designer', icon: '🎨' },
    { href: '/dashboard/ui-themes', label: 'UI Themes', icon: '🌈' },
    { href: '/dashboard/landing-pages', label: 'Landing Pages', icon: '📄' },
    { href: '/analytics', label: 'Analytics', icon: '📈' },
    { href: '/dashboard/settings', label: 'Einstellungen', icon: '⚙️' },
    { href: '/dashboard/billing', label: 'Abrechnung', icon: '💳' },
    ...(process.env.NODE_ENV === 'uat' || process.env.UAT_MODE ? [
      { href: '/dashboard/uat', label: 'UAT Tests', icon: '🧪' }
    ] : [])
  ]

  const isActive = (href) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard'
    }
    return pathname.startsWith(href)
  }

  return (
    <nav style={{
      background: 'white',
      borderBottom: '1px solid #e2e8f0',
      padding: '0 20px',
      height: '64px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    }}>
      {/* Logo & Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <Link href="/dashboard" style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '10px',
          textDecoration: 'none',
          color: '#1a202c'
        }}>
          <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="faviconGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{stopColor:'#F59E0B', stopOpacity:1}} />
                <stop offset="100%" style={{stopColor:'#EF4444', stopOpacity:1}} />
              </linearGradient>
              <linearGradient id="faviconBg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{stopColor:'#1E293B', stopOpacity:1}} />
                <stop offset="100%" style={{stopColor:'#334155', stopOpacity:1}} />
              </linearGradient>
            </defs>
            <rect x="2" y="2" width="28" height="28" rx="4" fill="url(#faviconBg)"/>
            <g transform="translate(6, 8)">
              <path d="M2 12 Q2 10 4 10 L16 10 Q18 10 18 12 L18 14 Q18 16 16 16 L4 16 Q2 16 2 14 Z" 
                    fill="url(#faviconGrad)"/>
              <path d="M4.5 10 Q6 8 8 8 L12 8 Q14 8 15.5 10" fill="url(#faviconGrad)" opacity="0.7"/>
              <circle cx="6" cy="16" r="2" fill="white" stroke="url(#faviconGrad)" strokeWidth="1"/>
              <circle cx="14" cy="16" r="2" fill="white" stroke="url(#faviconGrad)" strokeWidth="1"/>
              <circle cx="6" cy="16" r="1" fill="url(#faviconGrad)"/>
              <circle cx="14" cy="16" r="1" fill="url(#faviconGrad)"/>
              <circle cx="10" cy="6" r="2" fill="white" opacity="0.9"/>
              <circle cx="10" cy="6" r="1" fill="url(#faviconGrad)"/>
            </g>
          </svg>
          <span style={{ 
            fontSize: '20px', 
            fontWeight: 'bold',
            color: '#0070f3'
          }}>
            CarBot
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div style={{ 
          display: 'none',
          gap: '8px',
          alignItems: 'center'
        }} className="md:flex">
          {navItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '6px',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: '500',
                color: isActive(item.href) ? '#0070f3' : '#6b7280',
                background: isActive(item.href) ? '#eff6ff' : 'transparent',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                if (!isActive(item.href)) {
                  e.target.style.background = '#f8fafc'
                  e.target.style.color = '#374151'
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive(item.href)) {
                  e.target.style.background = 'transparent'
                  e.target.style.color = '#6b7280'
                }
              }}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* User Info & Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        {/* Workshop Info */}
        {workshop && (
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'flex-end',
            fontSize: '12px'
          }}>
            <div style={{ fontWeight: 'bold', color: '#1a202c' }}>
              {workshop.name}
            </div>
            <div style={{ color: '#6b7280' }}>
              {workshop.city}
            </div>
          </div>
        )}

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px',
              border: 'none',
              borderRadius: '8px',
              background: 'transparent',
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.background = '#f8fafc'}
            onMouseLeave={(e) => e.target.style.background = 'transparent'}
            aria-label="Toggle mobile menu"
          >
            <svg
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              style={{ color: '#374151' }}
            >
              {mobileMenuOpen ? (
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

        {/* User Avatar & Menu */}
        <div className="hidden md:block" style={{ position: 'relative' }}>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '8px',
              border: 'none',
              borderRadius: '8px',
              background: 'transparent',
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.background = '#f8fafc'}
            onMouseLeave={(e) => e.target.style.background = 'transparent'}
          >
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: '#0070f3',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '14px',
              fontWeight: 'bold'
            }}>
              {user?.email?.charAt(0).toUpperCase()}
            </div>
            <span style={{ fontSize: '14px', color: '#374151' }}>▼</span>
          </button>

          {/* Desktop Dropdown Menu */}
          {mobileMenuOpen && (
            <div style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: '5px',
              background: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
              minWidth: '200px',
              zIndex: 1000
            }}>
              {/* User Menu */}
              <div style={{ padding: '8px 16px', borderBottom: '1px solid #f1f5f9' }}>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>Angemeldet als</div>
                <div style={{ fontSize: '14px', fontWeight: '500', color: '#1a202c' }}>
                  {user?.email}
                </div>
              </div>

              <div style={{ padding: '5px 0' }}>
                <Link
                  href="/dashboard/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 16px',
                    textDecoration: 'none',
                    color: '#374151',
                    fontSize: '14px',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.target.style.background = '#f8fafc'}
                  onMouseLeave={(e) => e.target.style.background = 'transparent'}
                >
                  <span>👤</span>
                  <span>Profil</span>
                </Link>

                <Link
                  href="/dashboard/help"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 16px',
                    textDecoration: 'none',
                    color: '#374151',
                    fontSize: '14px',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.target.style.background = '#f8fafc'}
                  onMouseLeave={(e) => e.target.style.background = 'transparent'}
                >
                  <span>❓</span>
                  <span>Hilfe</span>
                </Link>

                <div style={{ height: '1px', background: '#e2e8f0', margin: '5px 16px' }} />

                <button
                  onClick={() => {
                    setMobileMenuOpen(false)
                    onLogout()
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 16px',
                    width: '100%',
                    border: 'none',
                    background: 'transparent',
                    textAlign: 'left',
                    color: '#dc2626',
                    fontSize: '14px',
                    cursor: 'pointer',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.target.style.background = '#fef2f2'}
                  onMouseLeave={(e) => e.target.style.background = 'transparent'}
                >
                  <span>🚪</span>
                  <span>Abmelden</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu Overlay - Full Navigation for Mobile */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50" style={{ top: '64px' }}>
          {/* Overlay */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setMobileMenuOpen(false)}
          />
          
          {/* Mobile Menu Content */}
          <div 
            className="relative bg-white h-full overflow-y-auto"
            style={{
              maxWidth: '320px',
              marginLeft: 'auto',
              boxShadow: '-2px 0 10px rgba(0,0,0,0.1)'
            }}
          >
            {/* Mobile User Info */}
            <div style={{ padding: '20px 16px', borderBottom: '1px solid #f1f5f9', background: '#f8fafc' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: '#0070f3',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '18px',
                  fontWeight: 'bold'
                }}>
                  {user?.email?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: '500', color: '#1a202c' }}>
                    {user?.email?.split('@')[0] || 'User'}
                  </div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>
                    {user?.email}
                  </div>
                  {workshop && (
                    <div style={{ fontSize: '12px', color: '#0070f3', marginTop: '2px' }}>
                      {workshop.name}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Mobile Navigation Items */}
            <div style={{ padding: '8px 0' }}>
              {navItems.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '16px 20px',
                    textDecoration: 'none',
                    color: isActive(item.href) ? '#0070f3' : '#374151',
                    fontSize: '16px',
                    borderBottom: '1px solid #f1f5f9',
                    transition: 'all 0.2s',
                    backgroundColor: isActive(item.href) ? '#eff6ff' : 'transparent'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive(item.href)) {
                      e.target.style.backgroundColor = '#f8fafc'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive(item.href)) {
                      e.target.style.backgroundColor = 'transparent'
                    }
                  }}
                >
                  <span style={{ fontSize: '18px' }}>{item.icon}</span>
                  <span style={{ fontWeight: isActive(item.href) ? '600' : '400' }}>{item.label}</span>
                  {isActive(item.href) && (
                    <div style={{
                      marginLeft: 'auto',
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: '#0070f3'
                    }} />
                  )}
                </Link>
              ))}
            </div>

            {/* Mobile User Menu Actions */}
            <div style={{ 
              borderTop: '8px solid #f8fafc',
              padding: '12px 0'
            }}>
              <Link
                href="/dashboard/profile"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '16px 20px',
                  textDecoration: 'none',
                  color: '#374151',
                  fontSize: '16px',
                  borderBottom: '1px solid #f1f5f9',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#f8fafc'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                <span style={{ fontSize: '18px' }}>👤</span>
                <span>Profil bearbeiten</span>
              </Link>

              <Link
                href="/dashboard/help"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '16px 20px',
                  textDecoration: 'none',
                  color: '#374151',
                  fontSize: '16px',
                  borderBottom: '1px solid #f1f5f9',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#f8fafc'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                <span style={{ fontSize: '18px' }}>❓</span>
                <span>Hilfe & Support</span>
              </Link>

              <button
                onClick={() => {
                  setMobileMenuOpen(false)
                  onLogout()
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '16px 20px',
                  width: '100%',
                  border: 'none',
                  background: 'transparent',
                  textAlign: 'left',
                  color: '#dc2626',
                  fontSize: '16px',
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#fef2f2'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                <span style={{ fontSize: '18px' }}>🚪</span>
                <span style={{ fontWeight: '500' }}>Abmelden</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}