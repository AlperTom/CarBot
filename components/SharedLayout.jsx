import Link from 'next/link'

export default function SharedLayout({ children, title = "CarBot", showNavigation = true, showFooter = true }) {
  const navigationStyle = {
    background: 'rgba(0, 0, 0, 0.2)',
    backdropFilter: 'blur(10px)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    position: 'relative',
    zIndex: 50
  }

  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '1rem 1.5rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  }

  const logoStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem'
  }

  const logoIconStyle = {
    width: '32px',
    height: '32px',
    background: 'linear-gradient(135deg, #ea580c 0%, #9333ea 100%)',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }

  const logoTextStyle = {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: 'white',
    textDecoration: 'none'
  }

  const navLinksStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem'
  }

  const navLinkStyle = {
    color: '#d1d5db',
    textDecoration: 'none',
    transition: 'color 0.2s'
  }

  const ctaButtonStyle = {
    background: 'linear-gradient(135deg, #ea580c 0%, #9333ea 50%, #2563eb 100%)',
    padding: '0.5rem 1rem',
    borderRadius: '8px',
    fontWeight: '600',
    color: 'white',
    textDecoration: 'none',
    display: 'inline-block',
    transition: 'transform 0.2s ease'
  }

  const footerStyle = {
    background: 'rgba(0, 0, 0, 0.2)',
    backdropFilter: 'blur(10px)',
    borderTop: '1px solid rgba(107, 114, 128, 1)'
  }

  const footerContainerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '3rem 1.5rem'
  }

  const footerGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '2rem'
  }

  const footerBrandStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '1rem'
  }

  const footerBottomStyle = {
    borderTop: '1px solid rgba(107, 114, 128, 1)',
    marginTop: '2rem',
    paddingTop: '1.5rem',
    textAlign: 'center',
    color: '#9ca3af'
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #111827 50%, #1e293b 100%)',
      color: 'white',
      fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      position: 'relative'
    }}>
      {/* Background Effects */}
      <div style={{
        position: 'fixed',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0
      }}>
        <div style={{
          position: 'absolute',
          top: '-10rem',
          right: '-10rem',
          width: '20rem',
          height: '20rem',
          background: 'radial-gradient(circle, rgba(168, 85, 247, 0.2) 0%, rgba(59, 130, 246, 0.2) 100%)',
          borderRadius: '50%',
          filter: 'blur(3rem)'
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '-10rem',
          left: '-10rem',
          width: '20rem',
          height: '20rem',
          background: 'radial-gradient(circle, rgba(249, 115, 22, 0.2) 0%, rgba(168, 85, 247, 0.2) 100%)',
          borderRadius: '50%',
          filter: 'blur(3rem)'
        }}></div>
      </div>

      <div style={{ position: 'relative', zIndex: 10 }}>
        {/* Navigation */}
        {showNavigation && (
          <nav style={navigationStyle}>
            <div style={containerStyle}>
              <Link href="/" style={logoStyle}>
                <div style={logoIconStyle}>
                  <svg width="16" height="16" fill="white" viewBox="0 0 24 24">
                    <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
                  </svg>
                </div>
                <span style={logoTextStyle}>CarBot</span>
              </Link>
              <div style={navLinksStyle}>
                <Link href="/pricing" style={navLinkStyle}>Preise</Link>
                <Link href="/demo/workshop" style={navLinkStyle}>Demo</Link>
                <Link href="/auth/login" style={navLinkStyle}>Anmelden</Link>
                <Link href="/auth/register" style={ctaButtonStyle}>Kostenlos starten</Link>
              </div>
            </div>
          </nav>
        )}

        {/* Page Title */}
        {title !== "CarBot" && (
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '2rem 1.5rem 1rem',
            textAlign: 'center'
          }}>
            <h1 style={{
              fontSize: '2.5rem',
              fontWeight: 'bold',
              color: 'white',
              marginBottom: '0.5rem'
            }}>
              {title}
            </h1>
          </div>
        )}

        {/* Main Content */}
        <main style={{ position: 'relative', zIndex: 10 }}>
          {children}
        </main>

        {/* Footer */}
        {showFooter && (
          <footer style={footerStyle}>
            <div style={footerContainerStyle}>
              <div style={footerGridStyle}>
                <div>
                  <div style={footerBrandStyle}>
                    <div style={logoIconStyle}>
                      <svg width="16" height="16" fill="white" viewBox="0 0 24 24">
                        <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
                      </svg>
                    </div>
                    <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'white' }}>CarBot</span>
                  </div>
                  <p style={{ color: '#9ca3af', lineHeight: '1.6' }}>
                    KI-gestützte Kundenberatung für moderne Autowerkstätten in Deutschland.
                  </p>
                </div>
                
                <div>
                  <h4 style={{ fontWeight: '600', marginBottom: '1rem', color: 'white' }}>Produkt</h4>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: '#9ca3af' }}>
                    <li style={{ marginBottom: '0.5rem' }}>
                      <Link href="/pricing" style={{ color: '#9ca3af', textDecoration: 'none' }}>Preise</Link>
                    </li>
                    <li style={{ marginBottom: '0.5rem' }}>
                      <Link href="/demo/workshop" style={{ color: '#9ca3af', textDecoration: 'none' }}>Demo</Link>
                    </li>
                    <li>
                      <Link href="/auth/register" style={{ color: '#9ca3af', textDecoration: 'none' }}>Kostenlos testen</Link>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h4 style={{ fontWeight: '600', marginBottom: '1rem', color: 'white' }}>Rechtliches</h4>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: '#9ca3af' }}>
                    <li style={{ marginBottom: '0.5rem' }}>
                      <Link href="/legal/datenschutz" style={{ color: '#9ca3af', textDecoration: 'none' }}>Datenschutz</Link>
                    </li>
                    <li>
                      <Link href="/legal/impressum" style={{ color: '#9ca3af', textDecoration: 'none' }}>Impressum</Link>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h4 style={{ fontWeight: '600', marginBottom: '1rem', color: 'white' }}>Support</h4>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: '#9ca3af' }}>
                    <li style={{ marginBottom: '0.5rem' }}>
                      <a href="mailto:support@carbot.chat" style={{ color: '#9ca3af', textDecoration: 'none' }}>support@carbot.chat</a>
                    </li>
                    <li>
                      <a href="tel:+4930123456789" style={{ color: '#9ca3af', textDecoration: 'none' }}>+49 30 123 456 789</a>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div style={footerBottomStyle}>
                <p>&copy; 2025 CarBot. Alle Rechte vorbehalten.</p>
              </div>
            </div>
          </footer>
        )}
      </div>
    </div>
  )
}

// Utility components for consistent styling
export function GlassCard({ children, className = "", style = {} }) {
  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.05)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '16px',
      padding: '1.5rem',
      transition: 'all 0.3s ease',
      ...style
    }}>
      {children}
    </div>
  )
}

export function PrimaryButton({ children, href, onClick, style = {}, type = 'button', disabled = false, ...props }) {
  const buttonStyle = {
    background: 'linear-gradient(135deg, #ea580c 0%, #9333ea 50%, #2563eb 100%)',
    padding: '0.75rem 1.5rem',
    borderRadius: '12px',
    fontWeight: '600',
    color: 'white',
    textDecoration: 'none',
    display: 'inline-block',
    transition: 'transform 0.2s ease',
    border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontSize: '1rem',
    opacity: disabled ? 0.6 : 1,
    ...style
  }

  if (href) {
    return <Link href={href} style={buttonStyle}>{children}</Link>
  }
  
  return <button onClick={onClick} style={buttonStyle} type={type} disabled={disabled} {...props}>{children}</button>
}

export function SecondaryButton({ children, href, onClick, style = {}, type = 'button', disabled = false, ...props }) {
  const buttonStyle = {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    padding: '0.75rem 1.5rem',
    borderRadius: '12px',
    color: 'white',
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    transition: 'all 0.2s ease',
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontSize: '1rem',
    opacity: disabled ? 0.6 : 1,
    ...style
  }

  if (href) {
    return <Link href={href} style={buttonStyle}>{children}</Link>
  }
  
  return <button onClick={onClick} style={buttonStyle} type={type} disabled={disabled} {...props}>{children}</button>
}