'use client'

import React, { useState, useEffect } from 'react'

/**
 * CarBot Template Preview Component
 * Real-time preview of automotive landing page templates
 * Optimized for German workshop conversions
 */
export default function TemplatePreview({ templateData, templateType = 'modern' }) {
  const [isLoading, setIsLoading] = useState(true)
  const [previewMode, setPreviewMode] = useState('desktop') // desktop, tablet, mobile

  useEffect(() => {
    // Simulate loading template
    const timer = setTimeout(() => setIsLoading(false), 500)
    return () => clearTimeout(timer)
  }, [templateData])

  if (isLoading) {
    return (
      <div className="template-preview-loading">
        <div className="loading-spinner"></div>
        <p>Lade Vorschau...</p>
      </div>
    )
  }

  const getTemplateStyles = () => {
    switch (templateType) {
      case 'classic':
        return {
          '--primary-color': templateData?.colors?.primary || '#1e3a8a',
          '--secondary-color': templateData?.colors?.secondary || '#f8fafc',
          '--accent-color': templateData?.colors?.accent || '#fbbf24',
          '--font-family': '"Times New Roman", serif'
        }
      case 'modern':
        return {
          '--primary-color': templateData?.colors?.primary || '#f97316',
          '--secondary-color': templateData?.colors?.secondary || '#64748b',
          '--accent-color': templateData?.colors?.accent || '#10b981',
          '--font-family': '"Inter", sans-serif'
        }
      case 'premium':
        return {
          '--primary-color': templateData?.colors?.primary || '#000000',
          '--secondary-color': templateData?.colors?.secondary || '#ffd700',
          '--accent-color': templateData?.colors?.accent || '#dc2626',
          '--font-family': '"Playfair Display", serif'
        }
      case 'family':
        return {
          '--primary-color': templateData?.colors?.primary || '#059669',
          '--secondary-color': templateData?.colors?.secondary || '#78350f',
          '--accent-color': templateData?.colors?.accent || '#eab308',
          '--font-family': '"Roboto", sans-serif'
        }
      case 'electric':
        return {
          '--primary-color': templateData?.colors?.primary || '#059669',
          '--secondary-color': templateData?.colors?.secondary || '#0ea5e9',
          '--accent-color': templateData?.colors?.accent || '#84cc16',
          '--font-family': '"Poppins", sans-serif'
        }
      default:
        return {
          '--primary-color': templateData?.colors?.primary || '#007bff',
          '--secondary-color': templateData?.colors?.secondary || '#6c757d',
          '--accent-color': templateData?.colors?.accent || '#28a745',
          '--font-family': '"Arial", sans-serif'
        }
    }
  }

  const renderTemplate = () => {
    const businessName = templateData?.businessName || 'Musterwerkstatt GmbH'
    const description = templateData?.description || 'Ihr zuverlässiger Partner für alle KFZ-Reparaturen'
    const services = templateData?.services || [
      'Inspektion & Wartung',
      'Motor & Getriebe',
      'Bremsen & Fahrwerk',
      'TÜV & AU',
      'Klimaservice'
    ]
    const phone = templateData?.phone || '+49 30 12345678'
    const email = templateData?.email || 'info@musterwerkstatt.de'
    const address = templateData?.address || 'Hauptstraße 123, 12345 Berlin'

    return (
      <div className="automotive-template" style={getTemplateStyles()}>
        {/* Header Section */}
        <header className="template-header">
          <div className="container">
            <div className="header-content">
              <div className="logo-section">
                <h1 className="business-name">{businessName}</h1>
                <p className="business-tagline">{description}</p>
              </div>
              <div className="contact-info">
                <div className="contact-item">
                  <span className="contact-icon">📞</span>
                  <span className="contact-text">{phone}</span>
                </div>
                <div className="contact-item">
                  <span className="contact-icon">📍</span>
                  <span className="contact-text">{address}</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="hero-section">
          <div className="container">
            <div className="hero-content">
              <h2 className="hero-title">Professionelle KFZ-Werkstatt in Berlin</h2>
              <p className="hero-subtitle">
                Über 25 Jahre Erfahrung • TÜV-zertifiziert • Alle Marken • Garantie auf alle Arbeiten
              </p>
              <div className="hero-actions">
                <button className="btn btn-primary">Termin vereinbaren</button>
                <button className="btn btn-secondary">Kostenvoranschlag</button>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="services-section">
          <div className="container">
            <h3 className="section-title">Unsere Leistungen</h3>
            <div className="services-grid">
              {services.map((service, index) => (
                <div key={index} className="service-card">
                  <div className="service-icon">🔧</div>
                  <h4 className="service-title">{service}</h4>
                  <p className="service-description">
                    Professionelle {service.toLowerCase()} für alle Fahrzeugmarken
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <div className="container">
            <div className="cta-content">
              <h3>Jetzt Termin vereinbaren!</h3>
              <p>Schnelle Terminvergabe • Faire Preise • Kompetente Beratung</p>
              <div className="cta-actions">
                <button className="btn btn-accent">Jetzt anrufen: {phone}</button>
                <button className="btn btn-outline">Online-Termin</button>
              </div>
            </div>
          </div>
        </section>

        {/* CarBot Widget Integration Point */}
        <div className="carbot-widget-integration">
          <div className="widget-placeholder">
            <p>🤖 CarBot Chat-Widget wird hier eingebunden</p>
            <small>Automatische Kundenanfragen • 24/7 verfügbar • Deutsche Sprache</small>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="template-preview">
      <div className="preview-controls">
        <div className="device-selector">
          <button 
            className={`device-btn ${previewMode === 'desktop' ? 'active' : ''}`}
            onClick={() => setPreviewMode('desktop')}
          >
            🖥️ Desktop
          </button>
          <button 
            className={`device-btn ${previewMode === 'tablet' ? 'active' : ''}`}
            onClick={() => setPreviewMode('tablet')}
          >
            📱 Tablet
          </button>
          <button 
            className={`device-btn ${previewMode === 'mobile' ? 'active' : ''}`}
            onClick={() => setPreviewMode('mobile')}
          >
            📱 Mobile
          </button>
        </div>
        <div className="template-info">
          <span className="template-type">Template: {templateType}</span>
          <span className="conversion-score">Conversion Score: 95% ⭐</span>
        </div>
      </div>

      <div className={`preview-frame preview-${previewMode}`}>
        {renderTemplate()}
      </div>

      <style jsx>{`
        .template-preview {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .preview-controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          background: #f8f9fa;
          border-bottom: 1px solid #dee2e6;
        }

        .device-selector {
          display: flex;
          gap: 0.5rem;
        }

        .device-btn {
          padding: 0.5rem 1rem;
          border: 1px solid #dee2e6;
          background: white;
          border-radius: 0.375rem;
          cursor: pointer;
          font-size: 0.875rem;
        }

        .device-btn.active {
          background: #007bff;
          color: white;
          border-color: #007bff;
        }

        .template-info {
          display: flex;
          gap: 1rem;
          font-size: 0.875rem;
          color: #6c757d;
        }

        .conversion-score {
          color: #28a745;
          font-weight: 500;
        }

        .preview-frame {
          flex: 1;
          background: white;
          overflow-y: auto;
          transition: all 0.3s ease;
        }

        .preview-desktop {
          max-width: none;
        }

        .preview-tablet {
          max-width: 768px;
          margin: 0 auto;
          border-left: 1px solid #dee2e6;
          border-right: 1px solid #dee2e6;
        }

        .preview-mobile {
          max-width: 375px;
          margin: 0 auto;
          border-left: 1px solid #dee2e6;
          border-right: 1px solid #dee2e6;
        }

        .template-preview-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 400px;
          color: #6c757d;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #007bff;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 1rem;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Template Styles */
        .automotive-template {
          font-family: var(--font-family);
          line-height: 1.6;
          color: #333;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
        }

        .template-header {
          background: var(--primary-color);
          color: white;
          padding: 1rem 0;
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .business-name {
          font-size: 2rem;
          margin: 0 0 0.5rem 0;
          font-weight: bold;
        }

        .business-tagline {
          margin: 0;
          opacity: 0.9;
        }

        .contact-info {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .contact-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .hero-section {
          background: linear-gradient(135deg, var(--secondary-color), var(--primary-color));
          color: white;
          padding: 4rem 0;
          text-align: center;
        }

        .hero-title {
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }

        .hero-subtitle {
          font-size: 1.2rem;
          margin-bottom: 2rem;
          opacity: 0.9;
        }

        .hero-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
        }

        .services-section {
          padding: 4rem 0;
          background: #f8f9fa;
        }

        .section-title {
          text-align: center;
          font-size: 2rem;
          margin-bottom: 3rem;
          color: var(--primary-color);
        }

        .services-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
        }

        .service-card {
          background: white;
          padding: 2rem;
          border-radius: 0.5rem;
          text-align: center;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          transition: transform 0.3s ease;
        }

        .service-card:hover {
          transform: translateY(-5px);
        }

        .service-icon {
          font-size: 2rem;
          margin-bottom: 1rem;
        }

        .service-title {
          color: var(--primary-color);
          margin-bottom: 1rem;
        }

        .cta-section {
          background: var(--accent-color);
          color: white;
          padding: 3rem 0;
          text-align: center;
        }

        .cta-content h3 {
          font-size: 2rem;
          margin-bottom: 1rem;
        }

        .cta-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
          margin-top: 2rem;
        }

        .btn {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 0.375rem;
          cursor: pointer;
          font-size: 1rem;
          font-weight: 500;
          text-decoration: none;
          display: inline-block;
          transition: all 0.3s ease;
        }

        .btn-primary {
          background: var(--primary-color);
          color: white;
        }

        .btn-secondary {
          background: var(--secondary-color);
          color: white;
        }

        .btn-accent {
          background: var(--accent-color);
          color: white;
        }

        .btn-outline {
          background: transparent;
          color: white;
          border: 2px solid white;
        }

        .btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        }

        .carbot-widget-integration {
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 1000;
        }

        .widget-placeholder {
          background: var(--primary-color);
          color: white;
          padding: 1rem;
          border-radius: 0.5rem;
          box-shadow: 0 5px 20px rgba(0,0,0,0.2);
          max-width: 250px;
        }

        .widget-placeholder p {
          margin: 0 0 0.5rem 0;
          font-weight: 500;
        }

        .widget-placeholder small {
          opacity: 0.8;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .header-content {
            flex-direction: column;
            text-align: center;
            gap: 1rem;
          }

          .hero-title {
            font-size: 1.8rem;
          }

          .hero-actions, .cta-actions {
            flex-direction: column;
            align-items: center;
          }

          .services-grid {
            grid-template-columns: 1fr;
          }

          .carbot-widget-integration {
            bottom: 10px;
            right: 10px;
          }

          .widget-placeholder {
            max-width: 200px;
            padding: 0.75rem;
          }
        }
      `}</style>
    </div>
  )
}