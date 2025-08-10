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
          <span style={{ fontSize: '24px' }}>🚗</span>
          <span style={{ 
            fontSize: '20px', 
            fontWeight: 'bold',
            color: '#0070f3'
          }}>
            CarBot
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="desktop-nav">
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

        {/* User Avatar & Menu */}
        <div style={{ position: 'relative' }}>
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

          {/* Dropdown Menu */}
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
              {/* Mobile Navigation */}
              <div className="mobile-nav-items">
                {navItems.map(item => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '12px 16px',
                      textDecoration: 'none',
                      color: isActive(item.href) ? '#0070f3' : '#374151',
                      fontSize: '14px',
                      borderBottom: '1px solid #f1f5f9',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.background = '#f8fafc'}
                    onMouseLeave={(e) => e.target.style.background = 'transparent'}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                ))}
                <div style={{ height: '1px', background: '#e2e8f0', margin: '5px 0' }} />
              </div>

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

      {/* Click outside to close dropdown */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999
          }}
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </nav>
  )
}