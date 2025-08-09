import Link from 'next/link'
import { Metadata } from 'next'

export const metadata = {
  title: 'CarBot - KI-gestützte Kundenberatung für Autowerkstätten | 24/7 Chatbot',
  description: 'Automatisieren Sie Ihre Kundenberatung mit CarBot. Terminbuchung, Lead-Generierung und Kundenservice in 4 Sprachen. 30 Tage kostenlos testen.',
  keywords: 'KI Chatbot Autowerkstatt, Automatisierte Terminbuchung, Kundenberatung KFZ, Werkstatt Software, Lead Generierung, Automotive KI',
  openGraph: {
    title: 'CarBot - KI-gestützte Kundenberatung für Autowerkstätten',
    description: 'Revolutionieren Sie Ihre Werkstatt mit KI-gestützter Kundenberatung. Automatische Terminbuchung, Lead-Generierung und 24/7 Service.',
    type: 'website',
    url: 'https://carbot.chat',
    siteName: 'CarBot',
    images: [{
      url: '/api/og?title=CarBot - KI für Autowerkstätten',
      width: 1200,
      height: 630,
      alt: 'CarBot KI-Chatbot für Autowerkstätten'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CarBot - KI-gestützte Kundenberatung für Autowerkstätten',
    description: 'Automatisieren Sie Terminbuchung und Kundenservice mit KI. 30 Tage kostenlos testen.',
    images: ['/api/og?title=CarBot - KI für Autowerkstätten']
  },
  alternates: {
    canonical: 'https://carbot.chat'
  },
  robots: 'index, follow',
  authors: [{ name: 'CarBot Team' }],
  category: 'Automotive Software',
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#ea580c'
}

export default function Home() {
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
      
      <main style={{ position: 'relative', zIndex: 10 }}>
        {/* Navigation */}
        <nav style={{
          background: 'rgba(0, 0, 0, 0.2)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          position: 'relative',
          zIndex: 50
        }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '1rem 1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: '32px',
                height: '32px',
                background: 'linear-gradient(135deg, #ea580c 0%, #9333ea 100%)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <svg width="16" height="16" fill="white" viewBox="0 0 24 24">
                  <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
                </svg>
              </div>
              <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'white' }}>CarBot</span>
            </div>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '1.5rem',
              '@media (max-width: 768px)': { display: 'none' }
            }}>
              <Link href="/pricing" style={{ 
                color: '#d1d5db', 
                textDecoration: 'none',
                transition: 'color 0.2s'
              }}>
                Preise
              </Link>
              <Link href="/auth/login" style={{ 
                color: '#d1d5db', 
                textDecoration: 'none',
                transition: 'color 0.2s'
              }}>
                Anmelden
              </Link>
              <Link href="/auth/register" style={{
                background: 'linear-gradient(135deg, #ea580c 0%, #9333ea 50%, #2563eb 100%)',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                fontWeight: '600',
                color: 'white',
                textDecoration: 'none',
                display: 'inline-block',
                transition: 'transform 0.2s ease'
              }}>
                Kostenlos starten
              </Link>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '5rem 1.5rem',
          textAlign: 'center'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'inline-flex',
            alignItems: 'center',
            padding: '0.5rem 1rem',
            borderRadius: '9999px',
            marginBottom: '2rem'
          }}>
            <div style={{
              width: '8px',
              height: '8px',
              background: '#4ade80',
              borderRadius: '50%',
              marginRight: '0.5rem',
              animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
            }}></div>
            <span style={{ fontSize: '0.875rem', color: '#d1d5db' }}>Jetzt verfügbar in Deutschland</span>
          </div>
          
          <h1 style={{
            fontSize: '4rem',
            fontWeight: 'bold',
            marginBottom: '1.5rem',
            lineHeight: '1.1'
          }}>
            <div style={{ color: 'white', marginBottom: '0.5rem' }}>KI-gestützte</div>
            <div style={{
              background: 'linear-gradient(135deg, #f97316 0%, #a855f7 50%, #3b82f6 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '0.5rem'
            }}>
              Kundenberatung
            </div>
            <div style={{ 
              fontSize: '2rem', 
              color: '#d1d5db', 
              fontWeight: '300' 
            }}>
              für Autowerkstätten
            </div>
          </h1>
          
          <p style={{
            fontSize: '1.25rem',
            color: '#d1d5db',
            marginBottom: '3rem',
            lineHeight: '1.6',
            maxWidth: '768px',
            margin: '0 auto 3rem'
          }}>
            Automatisieren Sie Ihre Kundenberatung mit KI. Buchen Sie Termine, generieren Sie Leads 
            und bedienen Sie Kunden <span style={{ color: 'white', fontWeight: '600' }}>24/7 in 4 Sprachen</span>.
          </p>
          
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: '4rem'
          }}>
            <Link href="/auth/register" style={{
              background: 'linear-gradient(135deg, #ea580c 0%, #9333ea 50%, #2563eb 100%)',
              padding: '0.75rem 1.5rem',
              borderRadius: '12px',
              fontWeight: '600',
              color: 'white',
              textDecoration: 'none',
              display: 'inline-block',
              transition: 'transform 0.2s ease',
              width: '300px'
            }}>
              30 Tage kostenlos testen
            </Link>
            
            <Link href="/demo/workshop" style={{
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
              width: '300px',
              justifyContent: 'center'
            }}>
              <div style={{
                width: '16px',
                height: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
              Live Demo ansehen
            </Link>
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '0.875rem', color: '#9ca3af', marginBottom: '1rem' }}>
              Vertraut von führenden Werkstätten
            </p>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              gap: '2rem', 
              opacity: 0.7, 
              color: '#9ca3af' 
            }}>
              <div style={{ fontSize: '1.125rem', fontWeight: 'bold' }}>BMW</div>
              <div style={{ fontSize: '1.125rem', fontWeight: 'bold' }}>Mercedes</div>
              <div style={{ fontSize: '1.125rem', fontWeight: 'bold' }}>Audi</div>
              <div style={{ fontSize: '1.125rem', fontWeight: 'bold' }}>VW</div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '5rem 1.5rem'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{
              fontSize: '2.5rem',
              fontWeight: 'bold',
              marginBottom: '1rem',
              color: 'white'
            }}>
              Warum CarBot?
            </h2>
            <p style={{
              fontSize: '1.125rem',
              color: '#d1d5db',
              maxWidth: '512px',
              margin: '0 auto'
            }}>
              Modernste KI-Technologie trifft auf jahrelange Automotive-Expertise
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem'
          }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '16px',
              padding: '1.5rem',
              transition: 'all 0.3s ease'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                background: 'rgba(249, 115, 22, 0.2)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem'
              }}>
                <svg width="24" height="24" fill="none" stroke="#fb923c" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'white', marginBottom: '0.75rem' }}>
                Intelligente KI-Beratung
              </h3>
              <p style={{ color: '#d1d5db', lineHeight: '1.6' }}>
                Hochentwickelte KI versteht Fahrzeugprobleme, erstellt automatisch 
                Kostenvoranschläge und schlägt optimale Termine vor.
              </p>
            </div>
            
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '16px',
              padding: '1.5rem',
              transition: 'all 0.3s ease'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                background: 'rgba(168, 85, 247, 0.2)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem'
              }}>
                <svg width="24" height="24" fill="none" stroke="#a855f7" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'white', marginBottom: '0.75rem' }}>
                Nahtlose Terminbuchung
              </h3>
              <p style={{ color: '#d1d5db', lineHeight: '1.6' }}>
                Kunden buchen direkt online Termine. Automatische Kalender-Synchronisation 
                und smarte Erinnerungen per E-Mail und SMS.
              </p>
            </div>
            
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '16px',
              padding: '1.5rem',
              transition: 'all 0.3s ease'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                background: 'rgba(59, 130, 246, 0.2)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem'
              }}>
                <svg width="24" height="24" fill="none" stroke="#3b82f6" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'white', marginBottom: '0.75rem' }}>
                Analytics Dashboard
              </h3>
              <p style={{ color: '#d1d5db', lineHeight: '1.6' }}>
                Tiefe Einblicke in Kundenverhalten, Lead-Qualität und ROI-Metriken. 
                Datengetriebene Optimierung Ihrer Werkstatt-Performance.
              </p>
            </div>
          </div>
        </section>

        {/* Blog Section */}
        <section style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '5rem 1.5rem'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{
              fontSize: '2.5rem',
              fontWeight: 'bold',
              marginBottom: '1rem',
              color: 'white'
            }}>
              Werkstatt-Expertise
            </h2>
            <p style={{
              fontSize: '1.125rem',
              color: '#d1d5db',
              maxWidth: '512px',
              margin: '0 auto'
            }}>
              Praktische Tipps und Trends für erfolgreiche Autowerkstätten
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '2rem'
          }}>
            <Link href="/blog/ki-chatbot-autowerkstatt" style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '16px',
              padding: '1.5rem',
              transition: 'all 0.3s ease',
              textDecoration: 'none',
              color: 'inherit',
              display: 'block'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                background: 'rgba(249, 115, 22, 0.2)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem'
              }}>
                <svg width="24" height="24" fill="#fb923c" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'white', marginBottom: '0.75rem' }}>
                KI-Chatbot für Autowerkstätten
              </h3>
              <p style={{ color: '#d1d5db', lineHeight: '1.6' }}>
                Automatisierte Kundenberatung, Terminbuchung und Lead-Generierung für Werkstätten
              </p>
            </Link>

            <Link href="/blog/automatisierte-terminbuchung-werkstatt" style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '16px',
              padding: '1.5rem',
              transition: 'all 0.3s ease',
              textDecoration: 'none',
              color: 'inherit',
              display: 'block'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                background: 'rgba(168, 85, 247, 0.2)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem'
              }}>
                <svg width="24" height="24" fill="#a855f7" viewBox="0 0 24 24">
                  <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.1 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"/>
                </svg>
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'white', marginBottom: '0.75rem' }}>
                Automatisierte Terminbuchung
              </h3>
              <p style={{ color: '#d1d5db', lineHeight: '1.6' }}>
                Online-Terminbuchung, Kalenderintegration und automatische Erinnerungen
              </p>
            </Link>

            <Link href="/blog/werkstatt-digitalisierung-2025" style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '16px',
              padding: '1.5rem',
              transition: 'all 0.3s ease',
              textDecoration: 'none',
              color: 'inherit',
              display: 'block'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                background: 'rgba(59, 130, 246, 0.2)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem'
              }}>
                <svg width="24" height="24" fill="#3b82f6" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'white', marginBottom: '0.75rem' }}>
                Werkstatt Digitalisierung 2025
              </h3>
              <p style={{ color: '#d1d5db', lineHeight: '1.6' }}>
                Kompletter Leitfaden zur digitalen Transformation von Autowerkstätten
              </p>
            </Link>

            <Link href="/blog/lead-generierung-kfz-betriebe" style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '16px',
              padding: '1.5rem',
              transition: 'all 0.3s ease',
              textDecoration: 'none',
              color: 'inherit',
              display: 'block'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                background: 'rgba(34, 197, 94, 0.2)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem'
              }}>
                <svg width="24" height="24" fill="#22c55e" viewBox="0 0 24 24">
                  <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
                </svg>
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'white', marginBottom: '0.75rem' }}>
                Lead-Generierung für KFZ-Betriebe
              </h3>
              <p style={{ color: '#d1d5db', lineHeight: '1.6' }}>
                Moderne Strategien für nachhaltige Neukundengewinnung in Autowerkstätten
              </p>
            </Link>

            <Link href="/blog/customer-service-automatisierung-werkstatt" style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '16px',
              padding: '1.5rem',
              transition: 'all 0.3s ease',
              textDecoration: 'none',
              color: 'inherit',
              display: 'block'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                background: 'rgba(251, 146, 60, 0.2)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem'
              }}>
                <svg width="24" height="24" fill="#fb923c" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM13 19h-2v-2h2v2zm0-4h-2V7h2v8z"/>
                </svg>
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'white', marginBottom: '0.75rem' }}>
                Customer Service Automatisierung
              </h3>
              <p style={{ color: '#d1d5db', lineHeight: '1.6' }}>
                Effizienz steigern durch intelligente Automatisierung im Werkstatt-Service
              </p>
            </Link>

            <Link href="/blog/dsgvo-konforme-kundenkommunikation" style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '16px',
              padding: '1.5rem',
              transition: 'all 0.3s ease',
              textDecoration: 'none',
              color: 'inherit',
              display: 'block'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                background: 'rgba(239, 68, 68, 0.2)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem'
              }}>
                <svg width="24" height="24" fill="#ef4444" viewBox="0 0 24 24">
                  <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M10,17L6,13L7.41,11.59L10,14.17L16.59,7.58L18,9L10,17Z"/>
                </svg>
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'white', marginBottom: '0.75rem' }}>
                DSGVO-konforme Kommunikation
              </h3>
              <p style={{ color: '#d1d5db', lineHeight: '1.6' }}>
                Rechtssichere Kundenkommunikation und Datenschutz für Autowerkstätten
              </p>
            </Link>
          </div>

          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <div style={{
              display: 'inline-block',
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '1rem'
            }}>
              <p style={{ 
                color: '#d1d5db', 
                marginBottom: '1rem',
                fontSize: '0.875rem'
              }}>
                Weitere Themen:
              </p>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '0.75rem',
                fontSize: '0.875rem'
              }}>
                <Link href="/blog/roi-werkstatt-software-investition" style={{ 
                  color: '#a855f7', 
                  textDecoration: 'none',
                  padding: '0.5rem',
                  borderRadius: '6px',
                  transition: 'background-color 0.2s',
                  display: 'block'
                }}>
                  ROI Werkstatt-Software
                </Link>
                <Link href="/blog/mobile-first-werkstatt-experience" style={{ 
                  color: '#a855f7', 
                  textDecoration: 'none',
                  padding: '0.5rem',
                  borderRadius: '6px',
                  transition: 'background-color 0.2s',
                  display: 'block'
                }}>
                  Mobile-First Experience
                </Link>
                <Link href="/blog/predictive-maintenance-ki-werkstatt" style={{ 
                  color: '#a855f7', 
                  textDecoration: 'none',
                  padding: '0.5rem',
                  borderRadius: '6px',
                  transition: 'background-color 0.2s',
                  display: 'block'
                }}>
                  Predictive Maintenance
                </Link>
                <Link href="/blog/social-media-marketing-werkstatten" style={{ 
                  color: '#a855f7', 
                  textDecoration: 'none',
                  padding: '0.5rem',
                  borderRadius: '6px',
                  transition: 'background-color 0.2s',
                  display: 'block'
                }}>
                  Social Media Marketing
                </Link>
                <Link href="/blog/elektroauto-wartung-werkstatten" style={{ 
                  color: '#a855f7', 
                  textDecoration: 'none',
                  padding: '0.5rem',
                  borderRadius: '6px',
                  transition: 'background-color 0.2s',
                  display: 'block'
                }}>
                  Elektroauto-Wartung
                </Link>
                <Link href="/blog/werkstatt-crm-systeme-vergleich" style={{ 
                  color: '#a855f7', 
                  textDecoration: 'none',
                  padding: '0.5rem',
                  borderRadius: '6px',
                  transition: 'background-color 0.2s',
                  display: 'block'
                }}>
                  CRM-Systeme Vergleich
                </Link>
                <Link href="/blog/kundenbindung-autowerkstatt-strategien" style={{ 
                  color: '#a855f7', 
                  textDecoration: 'none',
                  padding: '0.5rem',
                  borderRadius: '6px',
                  transition: 'background-color 0.2s',
                  display: 'block'
                }}>
                  Kundenbindung Strategien
                </Link>
                <Link href="/blog/werkstatt-marketing-trends-2025" style={{ 
                  color: '#a855f7', 
                  textDecoration: 'none',
                  padding: '0.5rem',
                  borderRadius: '6px',
                  transition: 'background-color 0.2s',
                  display: 'block'
                }}>
                  Marketing Trends 2025
                </Link>
                <Link href="/blog/nachhaltigkeit-kfz-betriebe-zukunft" style={{ 
                  color: '#a855f7', 
                  textDecoration: 'none',
                  padding: '0.5rem',
                  borderRadius: '6px',
                  transition: 'background-color 0.2s',
                  display: 'block'
                }}>
                  Nachhaltigkeit in KFZ
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section style={{
          maxWidth: '1000px',
          margin: '0 auto',
          padding: '5rem 1.5rem'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '24px',
            padding: '3rem',
            textAlign: 'center'
          }}>
            <h2 style={{
              fontSize: '2.5rem',
              fontWeight: 'bold',
              marginBottom: '1rem'
            }}>
              <div style={{ color: 'white', marginBottom: '0.5rem' }}>Bereit für die Zukunft</div>
              <div style={{
                background: 'linear-gradient(135deg, #f97316 0%, #a855f7 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                der Kundenberatung?
              </div>
            </h2>
            <p style={{
              fontSize: '1.125rem',
              color: '#d1d5db',
              marginBottom: '2rem',
              maxWidth: '512px',
              margin: '0 auto 2rem'
            }}>
              Starten Sie heute und transformieren Sie Ihre Werkstatt mit KI-gestützter Automatisierung
            </p>
            <Link href="/auth/register" style={{
              background: 'linear-gradient(135deg, #ea580c 0%, #9333ea 50%, #2563eb 100%)',
              padding: '1rem 2rem',
              borderRadius: '12px',
              fontWeight: 'bold',
              fontSize: '1.125rem',
              color: 'white',
              textDecoration: 'none',
              display: 'inline-block',
              transition: 'transform 0.2s ease'
            }}>
              30 Tage kostenlos testen - keine Kreditkarte erforderlich
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer style={{
          background: 'rgba(0, 0, 0, 0.2)',
          backdropFilter: 'blur(10px)',
          borderTop: '1px solid rgba(107, 114, 128, 1)'
        }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '3rem 1.5rem'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '2rem'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    background: 'linear-gradient(135deg, #ea580c 0%, #9333ea 100%)',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
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
            
            <div style={{
              borderTop: '1px solid rgba(107, 114, 128, 1)',
              marginTop: '2rem',
              paddingTop: '1.5rem',
              textAlign: 'center',
              color: '#9ca3af'
            }}>
              <p>&copy; 2024 CarBot. Alle Rechte vorbehalten.</p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}