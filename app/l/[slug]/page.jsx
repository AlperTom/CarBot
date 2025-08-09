'use client'

import { useState, useEffect } from 'react'
import { notFound } from 'next/navigation'

/**
 * Dynamic Landing Page - Render customized templates by slug
 * Phase 2 Feature: Public landing pages with custom branding
 */

export default function CustomLandingPage({ params }) {
  const [pageData, setPageData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchPageData() {
      try {
        const response = await fetch(`/api/landing/${params.slug}`)
        
        if (!response.ok) {
          if (response.status === 404) {
            notFound()
          }
          throw new Error('Failed to load page')
        }

        const result = await response.json()
        if (result.success) {
          setPageData(result.data)
        } else {
          throw new Error(result.error)
        }
      } catch (err) {
        console.error('Landing page fetch error:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchPageData()
  }, [params.slug])

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '60px',
            height: '60px',
            border: '4px solid #f3f4f6',
            borderTop: '4px solid #ea580c',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }}></div>
          <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>Lade Landing Page...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#fee2e2'
      }}>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h1 style={{ color: '#dc2626', fontSize: '2rem', marginBottom: '1rem' }}>
            Fehler beim Laden
          </h1>
          <p style={{ color: '#991b1b' }}>{error}</p>
        </div>
      </div>
    )
  }

  if (!pageData) {
    notFound()
  }

  const { customization, workshop } = pageData
  const { colors, branding, content, contact_details } = customization

  return (
    <>
      {/* Dynamic Styles */}
      <style jsx>{`
        :root {
          --primary-color: ${colors.primary};
          --secondary-color: ${colors.secondary};
          --accent-color: ${colors.accent};
          --background-color: ${colors.background};
          --text-color: ${colors.text};
          --font-family: ${customization.typography?.font_family || 'Inter, sans-serif'};
        }
        
        body {
          font-family: var(--font-family);
          color: var(--text-color);
          background-color: var(--background-color);
          line-height: 1.6;
          margin: 0;
          padding: 0;
        }
        
        .header {
          background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
          color: white;
          padding: 1rem 0;
          position: sticky;
          top: 0;
          z-index: 1000;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        
        .nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
        }
        
        .logo {
          font-size: 1.5rem;
          font-weight: bold;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .nav-links {
          display: flex;
          gap: 2rem;
          list-style: none;
          margin: 0;
          padding: 0;
        }
        
        .nav-links a {
          color: white;
          text-decoration: none;
          transition: opacity 0.3s;
        }
        
        .nav-links a:hover {
          opacity: 0.8;
        }
        
        .mobile-menu {
          display: none;
          background: 'none';
          border: 'none';
          color: 'white';
          font-size: '1.5rem';
          cursor: 'pointer';
        }
        
        @media (max-width: 768px) {
          .mobile-menu {
            display: block;
          }
        }
        
        .hero {
          background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), 
                      url('${branding.hero_image || '/api/placeholder/1200/600'}');
          background-size: cover;
          background-position: center;
          color: white;
          text-align: center;
          padding: 6rem 2rem 4rem;
          min-height: 60vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .hero-content h1 {
          font-size: 3.5rem;
          font-weight: bold;
          margin-bottom: 1rem;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
        }
        
        .hero-content p {
          font-size: 1.3rem;
          opacity: 0.95;
          margin-bottom: 2rem;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }
        
        .btn-primary {
          background-color: var(--accent-color);
          color: white;
          padding: 1rem 2.5rem;
          border: none;
          border-radius: 50px;
          font-weight: 600;
          font-size: 1.1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
          display: inline-block;
        }
        
        .btn-primary:hover {
          background-color: var(--primary-color);
          transform: translateY(-3px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        }
        
        .section {
          padding: 4rem 2rem;
        }
        
        .section:nth-child(even) {
          background-color: #f8fafc;
        }
        
        .container {
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .section-title {
          font-size: 2.5rem;
          font-weight: bold;
          text-align: center;
          margin-bottom: 3rem;
          color: var(--secondary-color);
        }
        
        .services-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          margin-top: 3rem;
        }
        
        .service-card {
          background: white;
          padding: 2.5rem;
          border-radius: 16px;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          text-align: center;
        }
        
        .service-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
        }
        
        .service-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }
        
        .about-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
          margin-top: 2rem;
        }
        
        .contact-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
          margin-top: 3rem;
        }
        
        .contact-info {
          background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
          color: white;
          padding: 2.5rem;
          border-radius: 16px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
        
        .contact-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
          font-size: 1.1rem;
        }
        
        .opening-hours {
          background: white;
          padding: 2.5rem;
          border-radius: 16px;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }
        
        .hours-item {
          display: flex;
          justify-content: space-between;
          padding: 0.75rem 0;
          border-bottom: 1px solid #e5e7eb;
        }
        
        .footer {
          background: var(--secondary-color);
          color: white;
          text-align: center;
          padding: 3rem 2rem 2rem;
        }
        
        .footer-links {
          display: flex;
          justify-content: center;
          gap: 2rem;
          margin-bottom: 2rem;
        }
        
        .footer-links a {
          color: white;
          text-decoration: none;
          opacity: 0.8;
          transition: opacity 0.3s;
        }
        
        .footer-links a:hover {
          opacity: 1;
        }
        
        @media (max-width: 768px) {
          .nav-links {
            display: none;
          }
          
          .hero-content h1 {
            font-size: 2.5rem;
          }
          
          .hero {
            padding: 4rem 1rem 3rem;
            min-height: 50vh;
          }
          
          .about-content,
          .contact-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
          
          .section {
            padding: 3rem 1rem;
          }
          
          .services-grid {
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1.5rem;
          }
          
          .service-card {
            padding: 2rem;
          }
          
          .footer-links {
            flex-direction: column;
            gap: 1rem;
          }
        }
      `}</style>

      {/* Header */}
      <header className="header">
        <nav className="nav">
          <div className="logo">
            {branding.logo_url ? (
              <img 
                src={branding.logo_url} 
                alt={branding.hero_title}
                style={{ height: '40px', marginRight: '0.5rem' }}
              />
            ) : (
              <span style={{ fontSize: '1.8rem' }}>🚗</span>
            )}
            {branding.hero_title}
          </div>
          <ul className="nav-links">
            <li><a href="#home">Home</a></li>
            <li><a href="#services">Services</a></li>
            <li><a href="#about">Über uns</a></li>
            <li><a href="#contact">Kontakt</a></li>
          </ul>
          <button className="mobile-menu" onClick={() => {
            const navLinks = document.querySelector('.nav-links');
            navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
            navLinks.style.position = 'absolute';
            navLinks.style.top = '100%';
            navLinks.style.left = '0';
            navLinks.style.right = '0';
            navLinks.style.background = 'var(--primary-color)';
            navLinks.style.flexDirection = 'column';
            navLinks.style.padding = '1rem';
            navLinks.style.borderRadius = '0 0 8px 8px';
          }}>
            ☰
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <section id="home" className="hero">
        <div className="hero-content">
          <h1>{branding.hero_title}</h1>
          <p>{branding.hero_subtitle}</p>
          <a href="#contact" className="btn-primary">
            Termin vereinbaren
          </a>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="section">
        <div className="container">
          <h2 className="section-title">{content.services_title}</h2>
          <div className="services-grid">
            <div className="service-card">
              <div className="service-icon">🔧</div>
              <h3>Wartung & Inspektion</h3>
              <p>Professionelle Wartung nach Herstellervorgaben</p>
            </div>
            <div className="service-card">
              <div className="service-icon">🛠️</div>
              <h3>Reparaturen</h3>
              <p>Schnelle und zuverlässige Reparaturen aller Art</p>
            </div>
            <div className="service-card">
              <div className="service-icon">🏁</div>
              <h3>TÜV & AU</h3>
              <p>Hauptuntersuchung und Abgasuntersuchung</p>
            </div>
            <div className="service-card">
              <div className="service-icon">🚗</div>
              <h3>Reifenservice</h3>
              <p>Reifenwechsel, Einlagerung und Auswuchtung</p>
            </div>
            <div className="service-card">
              <div className="service-icon">⚡</div>
              <h3>Elektrik</h3>
              <p>Diagnose und Reparatur elektronischer Systeme</p>
            </div>
            <div className="service-card">
              <div className="service-icon">🧽</div>
              <h3>Fahrzeugpflege</h3>
              <p>Innen- und Außenreinigung Ihres Fahrzeugs</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="section">
        <div className="container">
          <h2 className="section-title">{content.about_title}</h2>
          <div className="about-content">
            <div>
              <p style={{ fontSize: '1.2rem', lineHeight: '1.8' }}>
                {content.about_content || `Seit Jahren sind wir Ihr vertrauensvoller Partner für alle KFZ-Services. 
                Mit modernster Technik und erfahrenen Mechanikern bieten wir Ihnen höchste Qualität zu fairen Preisen.`}
              </p>
              <p style={{ fontSize: '1.1rem', lineHeight: '1.7', marginTop: '1.5rem' }}>
                Unser Team besteht aus zertifizierten Fachkräften, die sich kontinuierlich weiterbilden, 
                um Ihnen den bestmöglichen Service zu bieten.
              </p>
            </div>
            <div>
              <img 
                src="/api/placeholder/500/400" 
                alt="Werkstatt"
                style={{ width: '100%', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="section">
        <div className="container">
          <h2 className="section-title">{content.contact_title}</h2>
          <div className="contact-grid">
            <div className="contact-info">
              <h3 style={{ marginBottom: '2rem', fontSize: '1.5rem' }}>Kontaktdaten</h3>
              
              {contact_details.address && (
                <div className="contact-item">
                  <span style={{ fontSize: '1.3rem' }}>📍</span>
                  <div>
                    <strong>Adresse</strong><br />
                    {contact_details.address}
                  </div>
                </div>
              )}

              {contact_details.phone && (
                <div className="contact-item">
                  <span style={{ fontSize: '1.3rem' }}>📞</span>
                  <div>
                    <strong>Telefon</strong><br />
                    <a href={`tel:${contact_details.phone}`} style={{ color: 'inherit' }}>
                      {contact_details.phone}
                    </a>
                  </div>
                </div>
              )}

              {contact_details.email && (
                <div className="contact-item">
                  <span style={{ fontSize: '1.3rem' }}>✉️</span>
                  <div>
                    <strong>E-Mail</strong><br />
                    <a href={`mailto:${contact_details.email}`} style={{ color: 'inherit' }}>
                      {contact_details.email}
                    </a>
                  </div>
                </div>
              )}
            </div>

            <div className="opening-hours">
              <h3 style={{ marginBottom: '2rem', fontSize: '1.5rem', color: 'var(--secondary-color)' }}>
                Öffnungszeiten
              </h3>
              
              {Object.entries(contact_details.opening_hours || {}).map(([day, hours]) => (
                <div key={day} className="hours-item">
                  <strong style={{ textTransform: 'capitalize' }}>
                    {translateDay(day)}
                  </strong>
                  <span>{hours}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CarBot Widget Integration */}
          <div style={{
            marginTop: '4rem',
            textAlign: 'center',
            padding: '3rem',
            background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
            borderRadius: '20px',
            border: '2px solid #0ea5e9'
          }}>
            <h3 style={{ color: '#0369a1', marginBottom: '1rem', fontSize: '1.8rem' }}>
              🤖 Haben Sie Fragen?
            </h3>
            <p style={{ color: '#0284c7', fontSize: '1.2rem', marginBottom: '1.5rem' }}>
              Unser KI-Assistent hilft Ihnen gerne weiter!
            </p>
            <div id="carbot-widget"></div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-links">
            <a href="/impressum">Impressum</a>
            <a href="/datenschutz">Datenschutz</a>
            <a href="/agb">AGB</a>
          </div>
          <p style={{ opacity: 0.8 }}>
            © 2024 {branding.hero_title}. Alle Rechte vorbehalten.
          </p>
          <p style={{ opacity: 0.6, fontSize: '0.9rem', marginTop: '1rem' }}>
            Powered by CarBot - KI für Autowerkstätten
          </p>
        </div>
      </footer>

      {/* CarBot Widget Script */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            // CarBot Widget Integration
            (function() {
              const script = document.createElement('script');
              script.src = '/widget.js';
              script.onload = function() {
                if (window.CarBot) {
                  window.CarBot.init({
                    clientKey: '${workshop.client_keys?.[0]?.client_key_hash || ''}',
                    customization: {
                      primaryColor: '${colors.primary}',
                      accentColor: '${colors.accent}',
                      businessName: '${branding.hero_title}'
                    }
                  });
                }
              };
              document.head.appendChild(script);
            })();
          `
        }}
      />
    </>
  )
}

// Helper function to translate day names to German
function translateDay(day) {
  const translations = {
    monday: 'Montag',
    tuesday: 'Dienstag', 
    wednesday: 'Mittwoch',
    thursday: 'Donnerstag',
    friday: 'Freitag',
    saturday: 'Samstag',
    sunday: 'Sonntag'
  }
  return translations[day.toLowerCase()] || day
}