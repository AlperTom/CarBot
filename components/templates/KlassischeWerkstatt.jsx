'use client'

/**
 * Klassische Werkstatt Template
 * Target: Traditional German automotive workshops
 * Colors: Blue/White (Trust & Reliability)
 * Conversion Focus: Trust, Heritage, Reliability
 */

import React, { useState, useEffect } from 'react'
import { WidgetPreview } from '../WidgetPreview'

export default function KlassischeWerkstatt({ 
  customization = {}, 
  workshop = {}, 
  previewMode = false,
  onLeadGenerated = () => {}
}) {
  const [isContactFormOpen, setIsContactFormOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    vehicle: '',
    message: ''
  })

  // Template configuration with German automotive market optimization
  const config = {
    colors: {
      primary: customization.primaryColor || '#1e40af',      // Trust Blue
      secondary: customization.secondaryColor || '#f8fafc',   // Clean White
      accent: customization.accentColor || '#dc2626',         // German Red
      text: customization.textColor || '#1f2937',
      textLight: '#6b7280',
      background: '#ffffff',
      section: '#f8fafc'
    },
    fonts: {
      heading: customization.headingFont || '"Source Sans Pro", sans-serif',
      body: customization.bodyFont || '"Open Sans", sans-serif'
    },
    content: {
      heroTitle: customization.heroTitle || `${workshop.name || 'Ihre vertrauensvolle Werkstatt'} - Seit ${workshop.founded || '1985'}`,
      heroSubtitle: customization.heroSubtitle || 'Tradition, Qualität und Vertrauen - Ihr Fahrzeug in den besten Händen',
      phone: workshop.phone || '+49 30 12345678',
      email: workshop.email || 'kontakt@ihre-werkstatt.de',
      address: workshop.address || 'Hauptstraße 123, 12345 Berlin',
      ...customization.content
    }
  }

  const services = [
    {
      icon: '🔧',
      title: 'Inspektion & Wartung',
      description: 'Regelmäßige Fahrzeugpflege nach Herstellervorgaben',
      price: 'ab €149'
    },
    {
      icon: '🚗',
      title: 'Motor & Getriebe',
      description: 'Diagnose und Reparatur aller Motorkomponenten',
      price: 'auf Anfrage'
    },
    {
      icon: '🛞',
      title: 'Reifen & Räder',
      description: 'Reifenwechsel, Auswuchtung und Achsvermessung',
      price: 'ab €89'
    },
    {
      icon: '🔋',
      title: 'Elektrik & Elektronik',
      description: 'Batterieservice, Lichtanlage und Bordelektronik',
      price: 'ab €69'
    },
    {
      icon: '🛡️',
      title: 'TÜV & AU',
      description: 'Hauptuntersuchung und Abgasuntersuchung',
      price: 'ab €119'
    },
    {
      icon: '🏁',
      title: 'Klimaanlage',
      description: 'Service, Wartung und Reparatur der Klimaanlage',
      price: 'ab €99'
    }
  ]

  const testimonials = [
    {
      name: 'Klaus Müller',
      text: 'Seit 15 Jahren bin ich Kunde hier. Ehrliche Beratung und faire Preise!',
      rating: 5
    },
    {
      name: 'Andrea Schmidt',
      text: 'Sehr kompetent und zuverlässig. Termine werden immer eingehalten.',
      rating: 5
    },
    {
      name: 'Thomas Weber',
      text: 'Familienunternehmen mit Herz. Hier fühlt man sich gut aufgehoben.',
      rating: 5
    }
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    onLeadGenerated({
      ...formData,
      source: 'klassische-werkstatt-template',
      template: 'traditional'
    })
    setIsContactFormOpen(false)
    setFormData({ name: '', email: '', phone: '', service: '', vehicle: '', message: '' })
  }

  return (
    <div style={{ 
      fontFamily: config.fonts.body,
      lineHeight: 1.6,
      color: config.colors.text,
      background: config.colors.background
    }}>
      {/* Header */}
      <header style={{
        background: config.colors.primary,
        color: 'white',
        padding: '1rem 0',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 1rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {workshop.logo && (
              <img 
                src={workshop.logo} 
                alt="Logo" 
                style={{ height: '50px', objectFit: 'contain' }}
              />
            )}
            <div>
              <h1 style={{ 
                margin: 0, 
                fontSize: '1.5rem', 
                fontWeight: 'bold',
                fontFamily: config.fonts.heading
              }}>
                {workshop.name || 'Meisterwerkstatt Schmidt'}
              </h1>
              <p style={{ margin: 0, opacity: 0.9, fontSize: '0.9rem' }}>
                Seit {workshop.founded || '1985'} • Meisterbetrieb
              </p>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', fontSize: '0.9rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>📞</span>
              <span>{config.content.phone}</span>
            </div>
            <button
              onClick={() => setIsContactFormOpen(true)}
              style={{
                background: config.colors.accent,
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '5px',
                fontSize: '1rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={e => e.target.style.background = '#b91c1c'}
              onMouseOut={e => e.target.style.background = config.colors.accent}
            >
              Termin vereinbaren
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{
        background: `linear-gradient(135deg, ${config.colors.section} 0%, #e2e8f0 100%)`,
        padding: '4rem 0',
        textAlign: 'center'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 1rem'
        }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            margin: '0 0 1rem 0',
            color: config.colors.primary,
            fontFamily: config.fonts.heading
          }}>
            {config.content.heroTitle}
          </h1>
          <p style={{
            fontSize: '1.25rem',
            color: config.colors.textLight,
            margin: '0 0 2rem 0',
            maxWidth: '800px',
            margin: '0 auto 2rem auto'
          }}>
            {config.content.heroSubtitle}
          </p>
          
          {/* Trust Indicators */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '2rem',
            flexWrap: 'wrap',
            marginTop: '2rem'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🏆</div>
              <div style={{ fontWeight: 'bold' }}>Meisterbetrieb</div>
              <div style={{ fontSize: '0.9rem', color: config.colors.textLight }}>
                Seit {workshop.founded || '1985'}
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⭐</div>
              <div style={{ fontWeight: 'bold' }}>4.9/5 Sterne</div>
              <div style={{ fontSize: '0.9rem', color: config.colors.textLight }}>
                Über 500 Bewertungen
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🛡️</div>
              <div style={{ fontWeight: 'bold' }}>Garantie</div>
              <div style={{ fontSize: '0.9rem', color: config.colors.textLight }}>
                2 Jahre auf alle Arbeiten
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🚗</div>
              <div style={{ fontWeight: 'bold' }}>Alle Marken</div>
              <div style={{ fontSize: '0.9rem', color: config.colors.textLight }}>
                VW, BMW, Mercedes & mehr
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section style={{
        padding: '4rem 0',
        background: config.colors.background
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 1rem'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              color: config.colors.primary,
              margin: '0 0 1rem 0',
              fontFamily: config.fonts.heading
            }}>
              Unsere Leistungen
            </h2>
            <p style={{
              color: config.colors.textLight,
              fontSize: '1.1rem',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Professionelle Fahrzeugwartung und -reparatur mit modernster Ausstattung
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '2rem'
          }}>
            {services.map((service, index) => (
              <div
                key={index}
                style={{
                  background: config.colors.section,
                  padding: '2rem',
                  borderRadius: '10px',
                  border: `2px solid ${config.colors.secondary}`,
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseOver={e => {
                  e.currentTarget.style.borderColor = config.colors.primary
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(30, 64, 175, 0.15)'
                }}
                onMouseOut={e => {
                  e.currentTarget.style.borderColor = config.colors.secondary
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <div style={{
                  fontSize: '3rem',
                  marginBottom: '1rem',
                  textAlign: 'center'
                }}>
                  {service.icon}
                </div>
                <h3 style={{
                  fontSize: '1.3rem',
                  fontWeight: 'bold',
                  color: config.colors.text,
                  margin: '0 0 1rem 0',
                  textAlign: 'center'
                }}>
                  {service.title}
                </h3>
                <p style={{
                  color: config.colors.textLight,
                  margin: '0 0 1rem 0',
                  textAlign: 'center'
                }}>
                  {service.description}
                </p>
                <div style={{
                  textAlign: 'center',
                  padding: '1rem 0'
                }}>
                  <span style={{
                    background: config.colors.primary,
                    color: 'white',
                    padding: '0.5rem 1rem',
                    borderRadius: '5px',
                    fontWeight: 'bold'
                  }}>
                    {service.price}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section style={{
        background: config.colors.section,
        padding: '4rem 0'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 1rem'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              color: config.colors.primary,
              margin: '0 0 1rem 0',
              fontFamily: config.fonts.heading
            }}>
              Das sagen unsere Kunden
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem'
          }}>
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                style={{
                  background: config.colors.background,
                  padding: '2rem',
                  borderRadius: '10px',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                  position: 'relative'
                }}
              >
                <div style={{
                  color: '#fbbf24',
                  fontSize: '1.2rem',
                  marginBottom: '1rem'
                }}>
                  {'⭐'.repeat(testimonial.rating)}
                </div>
                <p style={{
                  color: config.colors.text,
                  fontStyle: 'italic',
                  margin: '0 0 1rem 0',
                  fontSize: '1.1rem'
                }}>
                  "{testimonial.text}"
                </p>
                <div style={{
                  fontWeight: 'bold',
                  color: config.colors.primary
                }}>
                  — {testimonial.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section style={{
        background: config.colors.primary,
        color: 'white',
        padding: '4rem 0'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 1rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '3rem'
        }}>
          <div>
            <h2 style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              margin: '0 0 2rem 0',
              fontFamily: config.fonts.heading
            }}>
              Kontakt & Öffnungszeiten
            </h2>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem' }}>Adresse</h3>
              <p style={{ margin: 0, opacity: 0.9 }}>{config.content.address}</p>
            </div>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem' }}>Telefon</h3>
              <p style={{ margin: 0, opacity: 0.9, fontSize: '1.1rem' }}>{config.content.phone}</p>
            </div>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem' }}>E-Mail</h3>
              <p style={{ margin: 0, opacity: 0.9 }}>{config.content.email}</p>
            </div>
          </div>

          <div>
            <h3 style={{
              fontSize: '1.5rem',
              margin: '0 0 1rem 0',
              fontFamily: config.fonts.heading
            }}>
              Öffnungszeiten
            </h3>
            <div style={{ fontSize: '1.1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span>Montag - Freitag:</span>
                <span>7:30 - 18:00 Uhr</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span>Samstag:</span>
                <span>8:00 - 14:00 Uhr</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <span>Sonntag:</span>
                <span>Geschlossen</span>
              </div>
            </div>

            <button
              onClick={() => setIsContactFormOpen(true)}
              style={{
                background: config.colors.accent,
                color: 'white',
                border: 'none',
                padding: '1rem 2rem',
                borderRadius: '5px',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                width: '100%',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={e => e.target.style.background = '#b91c1c'}
              onMouseOut={e => e.target.style.background = config.colors.accent}
            >
              Termin online buchen
            </button>
          </div>
        </div>
      </section>

      {/* Contact Modal */}
      {isContactFormOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div style={{
            background: config.colors.background,
            padding: '2rem',
            borderRadius: '10px',
            maxWidth: '500px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.5rem'
            }}>
              <h2 style={{
                margin: 0,
                color: config.colors.primary,
                fontFamily: config.fonts.heading
              }}>
                Termin vereinbaren
              </h2>
              <button
                onClick={() => setIsContactFormOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: config.colors.textLight
                }}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                  Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '5px',
                    fontSize: '1rem',
                    fontFamily: config.fonts.body
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                    E-Mail *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid #e5e7eb',
                      borderRadius: '5px',
                      fontSize: '1rem',
                      fontFamily: config.fonts.body
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                    Telefon *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid #e5e7eb',
                      borderRadius: '5px',
                      fontSize: '1rem',
                      fontFamily: config.fonts.body
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                    Service
                  </label>
                  <select
                    value={formData.service}
                    onChange={e => setFormData({...formData, service: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid #e5e7eb',
                      borderRadius: '5px',
                      fontSize: '1rem',
                      fontFamily: config.fonts.body
                    }}
                  >
                    <option value="">Service wählen</option>
                    {services.map((service, index) => (
                      <option key={index} value={service.title}>{service.title}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                    Fahrzeug
                  </label>
                  <input
                    type="text"
                    placeholder="z.B. BMW 3er, Baujahr 2018"
                    value={formData.vehicle}
                    onChange={e => setFormData({...formData, vehicle: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid #e5e7eb',
                      borderRadius: '5px',
                      fontSize: '1rem',
                      fontFamily: config.fonts.body
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                  Nachricht
                </label>
                <textarea
                  rows={4}
                  value={formData.message}
                  onChange={e => setFormData({...formData, message: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '5px',
                    fontSize: '1rem',
                    fontFamily: config.fonts.body,
                    resize: 'vertical'
                  }}
                />
              </div>

              <button
                type="submit"
                style={{
                  width: '100%',
                  background: config.colors.primary,
                  color: 'white',
                  border: 'none',
                  padding: '1rem',
                  borderRadius: '5px',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={e => e.target.style.background = '#1e3a8a'}
                onMouseOut={e => e.target.style.background = config.colors.primary}
              >
                Termin anfragen
              </button>
            </form>

            <p style={{
              marginTop: '1rem',
              fontSize: '0.9rem',
              color: config.colors.textLight,
              textAlign: 'center'
            }}>
              Wir melden uns innerhalb von 24 Stunden bei Ihnen zurück.
            </p>
          </div>
        </div>
      )}

      {/* CarBot Widget Integration */}
      {!previewMode && (
        <WidgetPreview 
          config={workshop.widgetConfig || {}}
          workshop={workshop}
          mode="desktop"
          isOpen={false}
        />
      )}

      {/* Footer */}
      <footer style={{
        background: config.colors.text,
        color: 'white',
        padding: '2rem 0',
        textAlign: 'center'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 1rem'
        }}>
          <p style={{ margin: '0 0 1rem 0' }}>
            © {new Date().getFullYear()} {workshop.name || 'Meisterwerkstatt Schmidt'}. Alle Rechte vorbehalten.
          </p>
          <p style={{ margin: 0, opacity: 0.8, fontSize: '0.9rem' }}>
            Powered by CarBot - Die professionelle Lösung für Autowerkstätten
          </p>
        </div>
      </footer>
    </div>
  )
}