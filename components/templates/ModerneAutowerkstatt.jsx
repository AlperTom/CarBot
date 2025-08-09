'use client'

/**
 * Moderne Autowerkstatt Template
 * Target: Tech-forward, contemporary automotive services
 * Colors: Orange/Gray (Innovation & Efficiency)
 * Conversion Focus: Technology, Speed, Modern Service
 */

import React, { useState, useEffect } from 'react'
import { WidgetPreview } from '../WidgetPreview'

export default function ModerneAutowerkstatt({ 
  customization = {}, 
  workshop = {}, 
  previewMode = false,
  onLeadGenerated = () => {}
}) {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
  const [selectedService, setSelectedService] = useState('')
  const [availableSlots, setAvailableSlots] = useState([])
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    date: '',
    time: '',
    vehicle: '',
    urgent: false
  })

  // Modern color scheme optimized for conversion
  const config = {
    colors: {
      primary: customization.primaryColor || '#ea580c',      // Modern Orange
      secondary: customization.secondaryColor || '#f97316',   // Bright Orange
      neutral: customization.neutralColor || '#6b7280',      // Modern Gray
      text: customization.textColor || '#1f2937',
      textLight: '#6b7280',
      background: '#ffffff',
      section: '#f9fafb',
      accent: '#0ea5e9'  // Tech Blue
    },
    fonts: {
      heading: customization.headingFont || '"Inter", sans-serif',
      body: customization.bodyFont || '"Poppins", sans-serif'
    },
    content: {
      heroTitle: customization.heroTitle || `${workshop.name || 'AutoService Pro'} - Werkstatt 4.0`,
      heroSubtitle: customization.heroSubtitle || 'Digitale Effizienz trifft auf handwerkliche Präzision - Ihr Auto in besten Händen',
      phone: workshop.phone || '+49 30 98765432',
      email: workshop.email || 'info@autoservice-pro.de',
      address: workshop.address || 'Technikstraße 45, 10623 Berlin',
      ...customization.content
    }
  }

  const services = [
    {
      icon: '🔍',
      title: 'Digital-Diagnose',
      description: 'KI-gestützte Fahrzeugdiagnose in unter 30 Minuten',
      price: 'ab €89',
      duration: '30 Min',
      highlight: true
    },
    {
      icon: '⚡',
      title: 'Express-Service',
      description: 'Wartung und kleinere Reparaturen in 2 Stunden',
      price: 'ab €149',
      duration: '2 Std',
      highlight: false
    },
    {
      icon: '🔋',
      title: 'E-Mobilität',
      description: 'Spezialist für Elektro- und Hybridfahrzeuge',
      price: 'ab €199',
      duration: 'nach Bedarf',
      highlight: true
    },
    {
      icon: '📱',
      title: 'Online-Termin',
      description: 'Buchen Sie 24/7 online - sofortige Terminbestätigung',
      price: 'kostenlos',
      duration: '1 Min',
      highlight: false
    },
    {
      icon: '🚙',
      title: 'Hol- & Bringservice',
      description: 'Wir holen Ihr Fahrzeug ab und bringen es zurück',
      price: 'ab €49',
      duration: 'flexible',
      highlight: false
    },
    {
      icon: '📊',
      title: 'Live-Updates',
      description: 'Echtzeitbenachrichtigungen über den Reparaturfortschritt',
      price: 'inklusive',
      duration: 'permanent',
      highlight: false
    }
  ]

  const features = [
    {
      icon: '🤖',
      title: 'KI-Diagnose',
      stat: '97%',
      description: 'Genauigkeit bei der Fehlererkennung'
    },
    {
      icon: '⚡',
      title: 'Speed',
      stat: '< 2h',
      description: 'Durchschnittliche Bearbeitungszeit'
    },
    {
      icon: '📱',
      title: 'Digital',
      stat: '24/7',
      description: 'Online-Buchung und Service'
    },
    {
      icon: '🔧',
      title: 'Qualität',
      stat: '4.9/5',
      description: 'Kundenzufriedenheit'
    }
  ]

  const testimonials = [
    {
      name: 'Sarah Tech',
      company: 'IT-Unternehmerin',
      text: 'Endlich eine Werkstatt, die so digital arbeitet wie ich! Alles transparent und schnell.',
      rating: 5,
      avatar: '👩‍💼'
    },
    {
      name: 'Mike Digitalis',
      company: 'Startup-Gründer',
      text: 'Live-Updates während der Reparatur, online buchen - genau das braucht man heute!',
      rating: 5,
      avatar: '👨‍💻'
    },
    {
      name: 'Anna Modern',
      company: 'Marketing-Managerin',
      text: 'Express-Service ist der Hammer! Mein E-Auto war in 2 Stunden wieder fit.',
      rating: 5,
      avatar: '👩‍🎯'
    }
  ]

  // Generate available time slots
  useEffect(() => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    const slots = []
    for (let i = 0; i < 7; i++) {
      const date = new Date(tomorrow)
      date.setDate(date.getDate() + i)
      
      const timeSlots = ['08:00', '10:00', '12:00', '14:00', '16:00']
      timeSlots.forEach(time => {
        slots.push({
          date: date.toISOString().split('T')[0],
          time: time,
          available: Math.random() > 0.3 // 70% availability
        })
      })
    }
    setAvailableSlots(slots)
  }, [])

  const handleBooking = (service) => {
    setSelectedService(service.title)
    setFormData({...formData, service: service.title})
    setIsBookingModalOpen(true)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onLeadGenerated({
      ...formData,
      source: 'moderne-autowerkstatt-template',
      template: 'modern',
      priority: formData.urgent ? 'high' : 'normal'
    })
    setIsBookingModalOpen(false)
    setFormData({ name: '', email: '', phone: '', service: '', date: '', time: '', vehicle: '', urgent: false })
  }

  return (
    <div style={{ 
      fontFamily: config.fonts.body,
      lineHeight: 1.6,
      color: config.colors.text,
      background: config.colors.background
    }}>
      {/* Modern Header */}
      <header style={{
        background: 'linear-gradient(135deg, #1f2937 0%, #374151 100%)',
        color: 'white',
        padding: '1rem 0',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backdropFilter: 'blur(10px)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
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
                style={{ 
                  height: '50px', 
                  objectFit: 'contain',
                  filter: 'brightness(1.2)'
                }}
              />
            )}
            <div>
              <h1 style={{ 
                margin: 0, 
                fontSize: '1.5rem', 
                fontWeight: '700',
                fontFamily: config.fonts.heading,
                background: `linear-gradient(135deg, ${config.colors.primary} 0%, ${config.colors.secondary} 100%)`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                {workshop.name || 'AutoService Pro'}
              </h1>
              <p style={{ margin: 0, opacity: 0.9, fontSize: '0.9rem' }}>
                🤖 Werkstatt 4.0 • 🚗 Alle Marken • ⚡ Express-Service
              </p>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ 
              background: 'rgba(255,255,255,0.1)', 
              padding: '0.5rem 1rem', 
              borderRadius: '20px',
              fontSize: '0.9rem'
            }}>
              📞 {config.content.phone}
            </div>
            <button
              onClick={() => setIsBookingModalOpen(true)}
              style={{
                background: `linear-gradient(135deg, ${config.colors.primary} 0%, ${config.colors.secondary} 100%)`,
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '25px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: `0 4px 15px rgba(234, 88, 12, 0.3)`
              }}
              onMouseOver={e => {
                e.target.style.transform = 'translateY(-2px)'
                e.target.style.boxShadow = `0 8px 25px rgba(234, 88, 12, 0.4)`
              }}
              onMouseOut={e => {
                e.target.style.transform = 'translateY(0)'
                e.target.style.boxShadow = `0 4px 15px rgba(234, 88, 12, 0.3)`
              }}
            >
              🚀 Jetzt buchen
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{
        background: `linear-gradient(135deg, ${config.colors.section} 0%, #e5e7eb 100%)`,
        padding: '4rem 0',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background Pattern */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ea580c" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          opacity: 0.3
        }} />
        
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 1rem',
          position: 'relative',
          zIndex: 2
        }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h1 style={{
              fontSize: '3rem',
              fontWeight: '800',
              margin: '0 0 1rem 0',
              background: `linear-gradient(135deg, ${config.colors.primary} 0%, ${config.colors.secondary} 100%)`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontFamily: config.fonts.heading
            }}>
              {config.content.heroTitle}
            </h1>
            <p style={{
              fontSize: '1.3rem',
              color: config.colors.neutral,
              margin: '0 0 2rem 0',
              maxWidth: '800px',
              margin: '0 auto 2rem auto'
            }}>
              {config.content.heroSubtitle}
            </p>
            
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '1rem',
              flexWrap: 'wrap'
            }}>
              <button
                onClick={() => setIsBookingModalOpen(true)}
                style={{
                  background: `linear-gradient(135deg, ${config.colors.primary} 0%, ${config.colors.secondary} 100%)`,
                  color: 'white',
                  border: 'none',
                  padding: '1rem 2rem',
                  borderRadius: '30px',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: `0 8px 25px rgba(234, 88, 12, 0.3)`
                }}
                onMouseOver={e => {
                  e.target.style.transform = 'translateY(-3px)'
                  e.target.style.boxShadow = `0 12px 35px rgba(234, 88, 12, 0.4)`
                }}
                onMouseOut={e => {
                  e.target.style.transform = 'translateY(0)'
                  e.target.style.boxShadow = `0 8px 25px rgba(234, 88, 12, 0.3)`
                }}
              >
                🚀 Online-Termin buchen
              </button>
              
              <button
                style={{
                  background: 'transparent',
                  color: config.colors.primary,
                  border: `2px solid ${config.colors.primary}`,
                  padding: '1rem 2rem',
                  borderRadius: '30px',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={e => {
                  e.target.style.background = config.colors.primary
                  e.target.style.color = 'white'
                }}
                onMouseOut={e => {
                  e.target.style.background = 'transparent'
                  e.target.style.color = config.colors.primary
                }}
              >
                📱 Live-Demo ansehen
              </button>
            </div>
          </div>

          {/* Features Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2rem',
            marginTop: '4rem'
          }}>
            {features.map((feature, index) => (
              <div
                key={index}
                style={{
                  background: config.colors.background,
                  padding: '2rem',
                  borderRadius: '20px',
                  textAlign: 'center',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease',
                  border: '1px solid transparent'
                }}
                onMouseOver={e => {
                  e.currentTarget.style.transform = 'translateY(-5px)'
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)'
                  e.currentTarget.style.borderColor = config.colors.primary
                }}
                onMouseOut={e => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)'
                  e.currentTarget.style.borderColor = 'transparent'
                }}
              >
                <div style={{
                  fontSize: '3rem',
                  marginBottom: '1rem'
                }}>
                  {feature.icon}
                </div>
                <div style={{
                  fontSize: '2.5rem',
                  fontWeight: '800',
                  color: config.colors.primary,
                  marginBottom: '0.5rem',
                  fontFamily: config.fonts.heading
                }}>
                  {feature.stat}
                </div>
                <h3 style={{
                  fontSize: '1.2rem',
                  fontWeight: '600',
                  margin: '0 0 0.5rem 0',
                  color: config.colors.text
                }}>
                  {feature.title}
                </h3>
                <p style={{
                  color: config.colors.textLight,
                  margin: 0,
                  fontSize: '0.95rem'
                }}>
                  {feature.description}
                </p>
              </div>
            ))}
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
              fontSize: '2.5rem',
              fontWeight: '700',
              background: `linear-gradient(135deg, ${config.colors.primary} 0%, ${config.colors.secondary} 100%)`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              margin: '0 0 1rem 0',
              fontFamily: config.fonts.heading
            }}>
              Digital Services
            </h2>
            <p style={{
              color: config.colors.textLight,
              fontSize: '1.2rem',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Modernste Technologie für maximale Effizienz und Transparenz
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
                  background: service.highlight ? 
                    `linear-gradient(135deg, ${config.colors.primary}15 0%, ${config.colors.secondary}15 100%)` :
                    config.colors.section,
                  padding: '2rem',
                  borderRadius: '20px',
                  border: service.highlight ? 
                    `2px solid ${config.colors.primary}` : 
                    '1px solid #e5e7eb',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  position: 'relative'
                }}
                onMouseOver={e => {
                  e.currentTarget.style.transform = 'translateY(-5px)'
                  e.currentTarget.style.boxShadow = service.highlight ? 
                    `0 20px 40px rgba(234, 88, 12, 0.2)` :
                    '0 15px 35px rgba(0,0,0,0.1)'
                }}
                onMouseOut={e => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
                onClick={() => handleBooking(service)}
              >
                {service.highlight && (
                  <div style={{
                    position: 'absolute',
                    top: '-10px',
                    right: '20px',
                    background: `linear-gradient(135deg, ${config.colors.primary} 0%, ${config.colors.secondary} 100%)`,
                    color: 'white',
                    padding: '0.25rem 1rem',
                    borderRadius: '15px',
                    fontSize: '0.8rem',
                    fontWeight: '600'
                  }}>
                    🔥 Beliebt
                  </div>
                )}
                
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'start',
                  marginBottom: '1rem'
                }}>
                  <div style={{
                    fontSize: '3rem'
                  }}>
                    {service.icon}
                  </div>
                  <div style={{
                    textAlign: 'right'
                  }}>
                    <div style={{
                      background: config.colors.accent,
                      color: 'white',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '15px',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      marginBottom: '0.5rem'
                    }}>
                      {service.duration}
                    </div>
                    <div style={{
                      fontSize: '1.2rem',
                      fontWeight: '700',
                      color: config.colors.primary
                    }}>
                      {service.price}
                    </div>
                  </div>
                </div>
                
                <h3 style={{
                  fontSize: '1.4rem',
                  fontWeight: '600',
                  color: config.colors.text,
                  margin: '0 0 1rem 0'
                }}>
                  {service.title}
                </h3>
                <p style={{
                  color: config.colors.textLight,
                  margin: '0 0 1.5rem 0',
                  lineHeight: 1.6
                }}>
                  {service.description}
                </p>
                
                <button
                  style={{
                    width: '100%',
                    background: service.highlight ? 
                      `linear-gradient(135deg, ${config.colors.primary} 0%, ${config.colors.secondary} 100%)` :
                      'transparent',
                    color: service.highlight ? 'white' : config.colors.primary,
                    border: service.highlight ? 'none' : `2px solid ${config.colors.primary}`,
                    padding: '0.75rem 1rem',
                    borderRadius: '15px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleBooking(service)
                  }}
                >
                  {service.highlight ? '🚀 Jetzt buchen' : '📅 Termin vereinbaren'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section style={{
        background: `linear-gradient(135deg, ${config.colors.section} 0%, #e5e7eb 100%)`,
        padding: '4rem 0'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 1rem'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{
              fontSize: '2.5rem',
              fontWeight: '700',
              background: `linear-gradient(135deg, ${config.colors.primary} 0%, ${config.colors.secondary} 100%)`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              margin: '0 0 1rem 0',
              fontFamily: config.fonts.heading
            }}>
              Was unsere Kunden sagen
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
                  borderRadius: '20px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                  position: 'relative',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={e => {
                  e.currentTarget.style.transform = 'translateY(-5px)'
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)'
                }}
                onMouseOut={e => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)'
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  marginBottom: '1rem'
                }}>
                  <div style={{
                    fontSize: '2.5rem'
                  }}>
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 style={{
                      margin: '0 0 0.25rem 0',
                      fontWeight: '600',
                      color: config.colors.text
                    }}>
                      {testimonial.name}
                    </h4>
                    <p style={{
                      margin: 0,
                      color: config.colors.textLight,
                      fontSize: '0.9rem'
                    }}>
                      {testimonial.company}
                    </p>
                  </div>
                </div>
                
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
                  margin: 0,
                  fontSize: '1.1rem',
                  lineHeight: 1.6
                }}>
                  "{testimonial.text}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        background: `linear-gradient(135deg, ${config.colors.primary} 0%, ${config.colors.secondary} 100%)`,
        color: 'white',
        padding: '4rem 0',
        textAlign: 'center'
      }}>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          padding: '0 1rem'
        }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            margin: '0 0 1rem 0',
            fontFamily: config.fonts.heading
          }}>
            Bereit für Service 4.0?
          </h2>
          <p style={{
            fontSize: '1.2rem',
            margin: '0 0 2rem 0',
            opacity: 0.9
          }}>
            Buchen Sie jetzt online und erleben Sie den Unterschied moderner Werkstatt-Technologie
          </p>
          
          <button
            onClick={() => setIsBookingModalOpen(true)}
            style={{
              background: 'white',
              color: config.colors.primary,
              border: 'none',
              padding: '1rem 2rem',
              borderRadius: '30px',
              fontSize: '1.2rem',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 8px 25px rgba(255,255,255,0.3)'
            }}
            onMouseOver={e => {
              e.target.style.transform = 'translateY(-3px)'
              e.target.style.boxShadow = '0 12px 35px rgba(255,255,255,0.4)'
            }}
            onMouseOut={e => {
              e.target.style.transform = 'translateY(0)'
              e.target.style.boxShadow = '0 8px 25px rgba(255,255,255,0.3)'
            }}
          >
            🚀 Jetzt kostenlos testen
          </button>
        </div>
      </section>

      {/* Booking Modal */}
      {isBookingModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.6)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div style={{
            background: config.colors.background,
            padding: '2rem',
            borderRadius: '20px',
            maxWidth: '600px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '2rem'
            }}>
              <h2 style={{
                margin: 0,
                background: `linear-gradient(135deg, ${config.colors.primary} 0%, ${config.colors.secondary} 100%)`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontFamily: config.fonts.heading,
                fontSize: '1.8rem',
                fontWeight: '700'
              }}>
                🚀 Online-Terminbuchung
              </h2>
              <button
                onClick={() => setIsBookingModalOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.8rem',
                  cursor: 'pointer',
                  color: config.colors.textLight,
                  padding: '0.5rem'
                }}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
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
                      borderRadius: '10px',
                      fontSize: '1rem',
                      fontFamily: config.fonts.body,
                      transition: 'border-color 0.3s ease'
                    }}
                    onFocus={e => e.target.style.borderColor = config.colors.primary}
                    onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
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
                      borderRadius: '10px',
                      fontSize: '1rem',
                      fontFamily: config.fonts.body,
                      transition: 'border-color 0.3s ease'
                    }}
                    onFocus={e => e.target.style.borderColor = config.colors.primary}
                    onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
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
                    borderRadius: '10px',
                    fontSize: '1rem',
                    fontFamily: config.fonts.body,
                    transition: 'border-color 0.3s ease'
                  }}
                  onFocus={e => e.target.style.borderColor = config.colors.primary}
                  onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                    Service
                  </label>
                  <select
                    value={formData.service}
                    onChange={e => setFormData({...formData, service: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid #e5e7eb',
                      borderRadius: '10px',
                      fontSize: '1rem',
                      fontFamily: config.fonts.body,
                      transition: 'border-color 0.3s ease'
                    }}
                    onFocus={e => e.target.style.borderColor = config.colors.primary}
                    onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                  >
                    <option value="">Service wählen</option>
                    {services.map((service, index) => (
                      <option key={index} value={service.title}>{service.title}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                    Fahrzeug
                  </label>
                  <input
                    type="text"
                    placeholder="z.B. Tesla Model 3, Bj. 2022"
                    value={formData.vehicle}
                    onChange={e => setFormData({...formData, vehicle: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid #e5e7eb',
                      borderRadius: '10px',
                      fontSize: '1rem',
                      fontFamily: config.fonts.body,
                      transition: 'border-color 0.3s ease'
                    }}
                    onFocus={e => e.target.style.borderColor = config.colors.primary}
                    onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                    Datum
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={e => setFormData({...formData, date: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid #e5e7eb',
                      borderRadius: '10px',
                      fontSize: '1rem',
                      fontFamily: config.fonts.body,
                      transition: 'border-color 0.3s ease'
                    }}
                    onFocus={e => e.target.style.borderColor = config.colors.primary}
                    onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                    Uhrzeit
                  </label>
                  <select
                    required
                    value={formData.time}
                    onChange={e => setFormData({...formData, time: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid #e5e7eb',
                      borderRadius: '10px',
                      fontSize: '1rem',
                      fontFamily: config.fonts.body,
                      transition: 'border-color 0.3s ease'
                    }}
                    onFocus={e => e.target.style.borderColor = config.colors.primary}
                    onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                  >
                    <option value="">Zeit wählen</option>
                    {availableSlots
                      .filter(slot => slot.date === formData.date && slot.available)
                      .map((slot, index) => (
                        <option key={index} value={slot.time}>{slot.time} Uhr</option>
                      ))
                    }
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  cursor: 'pointer'
                }}>
                  <input
                    type="checkbox"
                    checked={formData.urgent}
                    onChange={e => setFormData({...formData, urgent: e.target.checked})}
                    style={{ transform: 'scale(1.2)' }}
                  />
                  <span style={{ fontWeight: '600' }}>⚡ Express-Service (Aufpreis +50%)</span>
                </label>
              </div>

              <button
                type="submit"
                style={{
                  width: '100%',
                  background: `linear-gradient(135deg, ${config.colors.primary} 0%, ${config.colors.secondary} 100%)`,
                  color: 'white',
                  border: 'none',
                  padding: '1rem',
                  borderRadius: '15px',
                  fontSize: '1.1rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: `0 8px 25px rgba(234, 88, 12, 0.3)`
                }}
                onMouseOver={e => {
                  e.target.style.transform = 'translateY(-2px)'
                  e.target.style.boxShadow = `0 12px 35px rgba(234, 88, 12, 0.4)`
                }}
                onMouseOut={e => {
                  e.target.style.transform = 'translateY(0)'
                  e.target.style.boxShadow = `0 8px 25px rgba(234, 88, 12, 0.3)`
                }}
              >
                🚀 Termin jetzt buchen
              </button>
            </form>

            <p style={{
              marginTop: '1rem',
              fontSize: '0.9rem',
              color: config.colors.textLight,
              textAlign: 'center'
            }}>
              ⚡ Sofortige Bestätigung • 📱 SMS-Updates • 🔒 100% sicher
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
        background: '#1f2937',
        color: 'white',
        padding: '2rem 0',
        textAlign: 'center'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 1rem'
        }}>
          <p style={{ margin: '0 0 1rem 0', fontSize: '1.1rem' }}>
            © {new Date().getFullYear()} {workshop.name || 'AutoService Pro'}. Alle Rechte vorbehalten.
          </p>
          <p style={{ margin: 0, opacity: 0.8, fontSize: '0.9rem' }}>
            🤖 Powered by CarBot - Die Zukunft der Werkstatt-Kommunikation
          </p>
        </div>
      </footer>
    </div>
  )
}