'use client'

/**
 * Premium Service Template
 * Target: Luxury automotive service centers, high-end workshops
 * Colors: Black/Gold (Luxury & Exclusivity)
 * Conversion Focus: Premium Quality, Exclusive Service, VIP Treatment
 */

import React, { useState, useEffect } from 'react'
import { WidgetPreview } from '../WidgetPreview'

export default function PremiumService({ 
  customization = {}, 
  workshop = {}, 
  previewMode = false,
  onLeadGenerated = () => {}
}) {
  const [isVIPModalOpen, setIsVIPModalOpen] = useState(false)
  const [selectedPackage, setSelectedPackage] = useState('')
  const [conciergeRequest, setConciergeRequest] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    name: '',
    email: '',
    phone: '',
    vehicleBrand: '',
    vehicleModel: '',
    services: [],
    preferredDate: '',
    conciergeService: false,
    vipLounge: false,
    message: ''
  })

  // Premium luxury color scheme
  const config = {
    colors: {
      primary: customization.primaryColor || '#000000',        // Luxury Black
      secondary: customization.secondaryColor || '#1a1a1a',   // Deep Black
      gold: customization.goldColor || '#d4af37',             // Premium Gold
      accent: customization.accentColor || '#8b5a2b',         // Bronze
      text: customization.textColor || '#000000',
      textLight: '#6b7280',
      textGold: '#d4af37',
      background: '#ffffff',
      section: '#f8f8f8',
      luxury: '#111111'
    },
    fonts: {
      heading: customization.headingFont || '"Playfair Display", serif',
      body: customization.bodyFont || '"Source Sans Pro", sans-serif'
    },
    content: {
      heroTitle: customization.heroTitle || `${workshop.name || 'Premium Automotive'} Luxury Service`,
      heroSubtitle: customization.heroSubtitle || 'Exzellenz in jedem Detail - Exklusiver Service für anspruchsvolle Fahrzeugbesitzer',
      phone: workshop.phone || '+49 30 55555555',
      email: workshop.email || 'vip@premium-service.de',
      address: workshop.address || 'Luxusstraße 1, 10117 Berlin-Mitte',
      ...customization.content
    }
  }

  const premiumServices = [
    {
      icon: '👑',
      title: 'VIP Concierge Service',
      description: 'Persönlicher Butler für alle Ihre Fahrzeugbedürfnisse',
      features: ['24/7 verfügbar', 'Persönlicher Ansprechpartner', 'Priority-Hotline', 'Vor-Ort-Service'],
      price: 'ab €499/Monat',
      popular: true
    },
    {
      icon: '🏆',
      title: 'Platinum Care Package',
      description: 'Komplettbetreuung für Premium-Fahrzeuge',
      features: ['Monatliche Inspektion', 'Premium-Pflegeprodukte', '2 Jahre Garantie', 'Leihfahrzeug inklusive'],
      price: 'ab €1.299/Jahr',
      popular: false
    },
    {
      icon: '✨',
      title: 'Exclusiv Detail Service',
      description: 'Professionelle Fahrzeugaufbereitung auf höchstem Niveau',
      features: ['Keramikversiegelung', 'Lederbehandlung', 'Paint Correction', '5 Jahre Garantie'],
      price: 'ab €899',
      popular: false
    },
    {
      icon: '🚁',
      title: 'Express VIP Service',
      description: 'Sofortservice für dringende Angelegenheiten',
      features: ['Binnen 2 Stunden vor Ort', 'Direkte Werkstattanbindung', 'Premium-Ersatzteile', 'Notfall-Hotline'],
      price: 'ab €299/Einsatz',
      popular: true
    }
  ]

  const luxuryBrands = [
    { name: 'Mercedes-Benz', icon: '⭐', specialty: 'AMG Performance Center' },
    { name: 'BMW', icon: '🔷', specialty: 'M Performance Specialist' },
    { name: 'Audi', icon: '⚪', specialty: 'RS & S-Line Expert' },
    { name: 'Porsche', icon: '🏆', specialty: 'Certified Porsche Center' },
    { name: 'Bentley', icon: '👑', specialty: 'Authorized Service Partner' },
    { name: 'Ferrari', icon: '🔴', specialty: 'Official Service Center' },
    { name: 'Lamborghini', icon: '🟡', specialty: 'Certified Technicians' },
    { name: 'Rolls-Royce', icon: '💎', specialty: 'Exclusive Service Partner' }
  ]

  const testimonials = [
    {
      name: 'Dr. Alexander von Habsburg',
      title: 'CEO, Luxury Holdings',
      vehicle: 'Bentley Continental GT',
      text: 'Der VIP-Service übertrifft alle Erwartungen. Mein Bentley wird behandelt wie ein Kunstwerk.',
      rating: 5,
      avatar: '👨‍💼'
    },
    {
      name: 'Sophia Müller-Weiss',
      title: 'Kunstsammlerin',
      vehicle: 'Ferrari 488 Spider',
      text: 'Endlich eine Werkstatt, die den Wert meines Fahrzeugs wirklich versteht und schätzt.',
      rating: 5,
      avatar: '👩‍🎨'
    },
    {
      name: 'Graf Wilhelm von Stein',
      title: 'Privatinvestor',
      vehicle: 'Rolls-Royce Phantom',
      text: 'Diskrete, erstklassige Betreuung. Genau das, was man von einem Premium-Service erwartet.',
      rating: 5,
      avatar: '🎩'
    }
  ]

  const handleVIPRequest = (service) => {
    setSelectedPackage(service.title)
    setFormData({...formData, services: [service.title]})
    setIsVIPModalOpen(true)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onLeadGenerated({
      ...formData,
      source: 'premium-service-template',
      template: 'premium',
      value: 'high-end',
      priority: 'vip'
    })
    setIsVIPModalOpen(false)
    setFormData({ 
      title: '', name: '', email: '', phone: '', vehicleBrand: '', vehicleModel: '', 
      services: [], preferredDate: '', conciergeService: false, vipLounge: false, message: '' 
    })
  }

  return (
    <div style={{ 
      fontFamily: config.fonts.body,
      lineHeight: 1.6,
      color: config.colors.text,
      background: config.colors.background
    }}>
      {/* Luxury Header */}
      <header style={{
        background: `linear-gradient(135deg, ${config.colors.primary} 0%, ${config.colors.secondary} 100%)`,
        color: 'white',
        padding: '1.5rem 0',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Gold accent line */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: `linear-gradient(90deg, ${config.colors.gold} 0%, #ffd700 50%, ${config.colors.gold} 100%)`
        }} />
        
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 1rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            {workshop.logo && (
              <img 
                src={workshop.logo} 
                alt="Logo" 
                style={{ 
                  height: '60px', 
                  objectFit: 'contain',
                  filter: 'brightness(1.5) contrast(1.2)'
                }}
              />
            )}
            <div>
              <h1 style={{ 
                margin: 0, 
                fontSize: '1.8rem', 
                fontWeight: '400',
                fontFamily: config.fonts.heading,
                color: config.colors.gold,
                textShadow: '0 2px 4px rgba(0,0,0,0.3)'
              }}>
                {workshop.name || 'Premium Automotive'}
              </h1>
              <p style={{ margin: 0, opacity: 0.9, fontSize: '1rem', fontStyle: 'italic' }}>
                💎 Luxury Service Excellence • 🏆 Since {workshop.founded || '1987'}
              </p>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <div style={{ 
              background: 'rgba(212, 175, 55, 0.2)', 
              padding: '0.75rem 1.5rem', 
              borderRadius: '25px',
              border: `1px solid ${config.colors.gold}`,
              fontSize: '1rem'
            }}>
              <span style={{ color: config.colors.gold }}>📞</span> {config.content.phone}
            </div>
            <button
              onClick={() => setIsVIPModalOpen(true)}
              style={{
                background: `linear-gradient(135deg, ${config.colors.gold} 0%, #ffd700 100%)`,
                color: config.colors.primary,
                border: 'none',
                padding: '1rem 2rem',
                borderRadius: '25px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: `0 6px 20px rgba(212, 175, 55, 0.4)`,
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}
              onMouseOver={e => {
                e.target.style.transform = 'translateY(-2px)'
                e.target.style.boxShadow = `0 10px 30px rgba(212, 175, 55, 0.5)`
              }}
              onMouseOut={e => {
                e.target.style.transform = 'translateY(0)'
                e.target.style.boxShadow = `0 6px 20px rgba(212, 175, 55, 0.4)`
              }}
            >
              👑 VIP Service
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{
        background: `linear-gradient(135deg, ${config.colors.section} 0%, #f0f0f0 100%)`,
        padding: '5rem 0',
        position: 'relative',
        textAlign: 'center'
      }}>
        {/* Luxury pattern overlay */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'url("data:image/svg+xml,%3Csvg width="80" height="80" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="%23d4af37" fill-opacity="0.03"%3E%3Cpath d="M40 0L52.5 27.5L80 40L52.5 52.5L40 80L27.5 52.5L0 40L27.5 27.5Z"/%3E%3C/g%3E%3C/svg%3E")',
          opacity: 0.4
        }} />
        
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 1rem',
          position: 'relative',
          zIndex: 2
        }}>
          <h1 style={{
            fontSize: '3.5rem',
            fontWeight: '400',
            margin: '0 0 1.5rem 0',
            fontFamily: config.fonts.heading,
            color: config.colors.primary,
            textShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            {config.content.heroTitle}
          </h1>
          <p style={{
            fontSize: '1.4rem',
            color: config.colors.textLight,
            margin: '0 0 3rem 0',
            maxWidth: '800px',
            margin: '0 auto 3rem auto',
            fontStyle: 'italic'
          }}>
            {config.content.heroSubtitle}
          </p>
          
          {/* Premium badges */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '3rem',
            flexWrap: 'wrap',
            marginBottom: '3rem'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                fontSize: '3rem', 
                marginBottom: '0.5rem',
                color: config.colors.gold 
              }}>👑</div>
              <div style={{ fontWeight: '600', fontSize: '1.1rem' }}>VIP Service</div>
              <div style={{ fontSize: '0.9rem', color: config.colors.textLight }}>
                Exklusiv für Sie
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                fontSize: '3rem', 
                marginBottom: '0.5rem',
                color: config.colors.gold 
              }}>💎</div>
              <div style={{ fontWeight: '600', fontSize: '1.1rem' }}>Premium Qualität</div>
              <div style={{ fontSize: '0.9rem', color: config.colors.textLight }}>
                Nur das Beste
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                fontSize: '3rem', 
                marginBottom: '0.5rem',
                color: config.colors.gold 
              }}>🏆</div>
              <div style={{ fontWeight: '600', fontSize: '1.1rem' }}>Award Winner</div>
              <div style={{ fontSize: '0.9rem', color: config.colors.textLight }}>
                Best Luxury Service 2024
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                fontSize: '3rem', 
                marginBottom: '0.5rem',
                color: config.colors.gold 
              }}>🚁</div>
              <div style={{ fontWeight: '600', fontSize: '1.1rem' }}>24/7 Service</div>
              <div style={{ fontSize: '0.9rem', color: config.colors.textLight }}>
                Jederzeit für Sie da
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsVIPModalOpen(true)}
            style={{
              background: `linear-gradient(135deg, ${config.colors.primary} 0%, ${config.colors.secondary} 100%)`,
              color: config.colors.gold,
              border: `2px solid ${config.colors.gold}`,
              padding: '1.25rem 3rem',
              borderRadius: '30px',
              fontSize: '1.2rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}
            onMouseOver={e => {
              e.target.style.background = config.colors.gold
              e.target.style.color = config.colors.primary
              e.target.style.transform = 'translateY(-3px)'
              e.target.style.boxShadow = '0 15px 40px rgba(212, 175, 55, 0.4)'
            }}
            onMouseOut={e => {
              e.target.style.background = `linear-gradient(135deg, ${config.colors.primary} 0%, ${config.colors.secondary} 100%)`
              e.target.style.color = config.colors.gold
              e.target.style.transform = 'translateY(0)'
              e.target.style.boxShadow = '0 8px 30px rgba(0,0,0,0.3)'
            }}
          >
            Exklusivberatung vereinbaren
          </button>
        </div>
      </section>

      {/* Luxury Brands Section */}
      <section style={{
        padding: '4rem 0',
        background: config.colors.primary,
        color: 'white'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 1rem'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{
              fontSize: '2.5rem',
              fontWeight: '400',
              color: config.colors.gold,
              margin: '0 0 1rem 0',
              fontFamily: config.fonts.heading
            }}>
              Unsere Premium-Marken
            </h2>
            <p style={{
              color: '#cccccc',
              fontSize: '1.2rem',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Zertifizierte Kompetenz für die exklusivsten Fahrzeugmarken der Welt
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem'
          }}>
            {luxuryBrands.map((brand, index) => (
              <div
                key={index}
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: `1px solid ${config.colors.gold}30`,
                  padding: '2rem',
                  borderRadius: '15px',
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseOver={e => {
                  e.currentTarget.style.background = 'rgba(212, 175, 55, 0.1)'
                  e.currentTarget.style.borderColor = config.colors.gold
                  e.currentTarget.style.transform = 'translateY(-5px)'
                  e.currentTarget.style.boxShadow = `0 15px 30px rgba(212, 175, 55, 0.2)`
                }}
                onMouseOut={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                  e.currentTarget.style.borderColor = `${config.colors.gold}30`
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <div style={{
                  fontSize: '3rem',
                  marginBottom: '1rem'
                }}>
                  {brand.icon}
                </div>
                <h3 style={{
                  fontSize: '1.4rem',
                  fontWeight: '600',
                  color: config.colors.gold,
                  margin: '0 0 0.5rem 0'
                }}>
                  {brand.name}
                </h3>
                <p style={{
                  color: '#cccccc',
                  margin: 0,
                  fontSize: '0.95rem'
                }}>
                  {brand.specialty}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Services Section */}
      <section style={{
        padding: '5rem 0',
        background: config.colors.background
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 1rem'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{
              fontSize: '2.8rem',
              fontWeight: '400',
              color: config.colors.primary,
              margin: '0 0 1rem 0',
              fontFamily: config.fonts.heading
            }}>
              Exklusive Service-Pakete
            </h2>
            <p style={{
              color: config.colors.textLight,
              fontSize: '1.2rem',
              maxWidth: '700px',
              margin: '0 auto'
            }}>
              Maßgeschneiderte Lösungen für höchste Ansprüche - Ihr Fahrzeug verdient das Beste
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
            gap: '3rem'
          }}>
            {premiumServices.map((service, index) => (
              <div
                key={index}
                style={{
                  background: service.popular ? 
                    `linear-gradient(135deg, ${config.colors.gold}10 0%, ${config.colors.gold}05 100%)` :
                    config.colors.section,
                  padding: '3rem',
                  borderRadius: '20px',
                  border: service.popular ? 
                    `3px solid ${config.colors.gold}` : 
                    '1px solid #e5e7eb',
                  transition: 'all 0.4s ease',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseOver={e => {
                  e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)'
                  e.currentTarget.style.boxShadow = service.popular ? 
                    `0 25px 50px rgba(212, 175, 55, 0.3)` :
                    '0 20px 40px rgba(0,0,0,0.15)'
                }}
                onMouseOut={e => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
                onClick={() => handleVIPRequest(service)}
              >
                {service.popular && (
                  <>
                    <div style={{
                      position: 'absolute',
                      top: '-15px',
                      right: '30px',
                      background: `linear-gradient(135deg, ${config.colors.gold} 0%, #ffd700 100%)`,
                      color: config.colors.primary,
                      padding: '0.5rem 1.5rem',
                      borderRadius: '20px',
                      fontSize: '0.9rem',
                      fontWeight: '700',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      boxShadow: `0 4px 15px rgba(212, 175, 55, 0.4)`
                    }}>
                      👑 Most Popular
                    </div>
                    
                    {/* Gold corner accent */}
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100px',
                      height: '100px',
                      background: `linear-gradient(135deg, ${config.colors.gold}20 0%, transparent 70%)`,
                      borderRadius: '0 0 100px 0'
                    }} />
                  </>
                )}
                
                <div style={{
                  fontSize: '4rem',
                  marginBottom: '1.5rem',
                  textAlign: 'center'
                }}>
                  {service.icon}
                </div>
                
                <h3 style={{
                  fontSize: '1.6rem',
                  fontWeight: '600',
                  color: config.colors.primary,
                  margin: '0 0 1rem 0',
                  textAlign: 'center'
                }}>
                  {service.title}
                </h3>
                
                <p style={{
                  color: config.colors.textLight,
                  margin: '0 0 2rem 0',
                  textAlign: 'center',
                  fontSize: '1.1rem',
                  lineHeight: 1.6
                }}>
                  {service.description}
                </p>
                
                <ul style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: '0 0 2rem 0'
                }}>
                  {service.features.map((feature, fIndex) => (
                    <li key={fIndex} style={{
                      padding: '0.5rem 0',
                      color: config.colors.text,
                      fontSize: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem'
                    }}>
                      <span style={{ color: config.colors.gold, fontSize: '1.2rem' }}>✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <div style={{
                  textAlign: 'center',
                  marginBottom: '2rem'
                }}>
                  <div style={{
                    fontSize: '1.8rem',
                    fontWeight: '700',
                    color: config.colors.gold,
                    fontFamily: config.fonts.heading
                  }}>
                    {service.price}
                  </div>
                </div>
                
                <button
                  style={{
                    width: '100%',
                    background: service.popular ? 
                      `linear-gradient(135deg, ${config.colors.gold} 0%, #ffd700 100%)` :
                      'transparent',
                    color: service.popular ? config.colors.primary : config.colors.gold,
                    border: service.popular ? 'none' : `2px solid ${config.colors.gold}`,
                    padding: '1rem 2rem',
                    borderRadius: '15px',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleVIPRequest(service)
                  }}
                  onMouseOver={e => {
                    if (service.popular) {
                      e.target.style.background = config.colors.primary
                      e.target.style.color = config.colors.gold
                    } else {
                      e.target.style.background = config.colors.gold
                      e.target.style.color = config.colors.primary
                    }
                  }}
                  onMouseOut={e => {
                    if (service.popular) {
                      e.target.style.background = `linear-gradient(135deg, ${config.colors.gold} 0%, #ffd700 100%)`
                      e.target.style.color = config.colors.primary
                    } else {
                      e.target.style.background = 'transparent'
                      e.target.style.color = config.colors.gold
                    }
                  }}
                >
                  {service.popular ? '👑 VIP Beratung' : 'Mehr erfahren'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section style={{
        background: `linear-gradient(135deg, ${config.colors.section} 0%, #f0f0f0 100%)`,
        padding: '5rem 0'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 1rem'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{
              fontSize: '2.8rem',
              fontWeight: '400',
              color: config.colors.primary,
              margin: '0 0 1rem 0',
              fontFamily: config.fonts.heading
            }}>
              Stimmen unserer VIP-Kunden
            </h2>
            <p style={{
              color: config.colors.textLight,
              fontSize: '1.2rem',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Exzellenz spricht für sich - Erfahrungen unserer geschätzten Klientel
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '3rem'
          }}>
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                style={{
                  background: config.colors.background,
                  padding: '3rem',
                  borderRadius: '20px',
                  boxShadow: '0 15px 40px rgba(0,0,0,0.1)',
                  position: 'relative',
                  transition: 'all 0.4s ease',
                  border: `1px solid ${config.colors.gold}30`
                }}
                onMouseOver={e => {
                  e.currentTarget.style.transform = 'translateY(-8px)'
                  e.currentTarget.style.boxShadow = '0 25px 50px rgba(0,0,0,0.15)'
                  e.currentTarget.style.borderColor = config.colors.gold
                }}
                onMouseOut={e => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 15px 40px rgba(0,0,0,0.1)'
                  e.currentTarget.style.borderColor = `${config.colors.gold}30`
                }}
              >
                {/* Quote decoration */}
                <div style={{
                  position: 'absolute',
                  top: '20px',
                  left: '30px',
                  fontSize: '3rem',
                  color: config.colors.gold,
                  opacity: 0.3,
                  fontFamily: 'serif'
                }}>
                  "
                </div>
                
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  marginBottom: '1.5rem'
                }}>
                  <div style={{
                    fontSize: '3rem'
                  }}>
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 style={{
                      margin: '0 0 0.25rem 0',
                      fontWeight: '600',
                      color: config.colors.primary,
                      fontSize: '1.2rem'
                    }}>
                      {testimonial.name}
                    </h4>
                    <p style={{
                      margin: '0 0 0.25rem 0',
                      color: config.colors.textLight,
                      fontSize: '0.95rem'
                    }}>
                      {testimonial.title}
                    </p>
                    <p style={{
                      margin: 0,
                      color: config.colors.gold,
                      fontSize: '0.9rem',
                      fontWeight: '500'
                    }}>
                      {testimonial.vehicle}
                    </p>
                  </div>
                </div>
                
                <div style={{
                  color: '#ffd700',
                  fontSize: '1.4rem',
                  marginBottom: '1.5rem',
                  textAlign: 'center'
                }}>
                  {'★'.repeat(testimonial.rating)}
                </div>
                
                <p style={{
                  color: config.colors.text,
                  fontStyle: 'italic',
                  margin: 0,
                  fontSize: '1.1rem',
                  lineHeight: 1.7,
                  textAlign: 'center'
                }}>
                  "{testimonial.text}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VIP Modal */}
      {isVIPModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.8)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          padding: '1rem',
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{
            background: config.colors.background,
            padding: '3rem',
            borderRadius: '25px',
            maxWidth: '700px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: `0 30px 80px rgba(0,0,0,0.4)`,
            border: `2px solid ${config.colors.gold}`,
            position: 'relative'
          }}>
            {/* Gold corner decoration */}
            <div style={{
              position: 'absolute',
              top: '-2px',
              right: '-2px',
              width: '60px',
              height: '60px',
              background: `linear-gradient(135deg, ${config.colors.gold} 0%, #ffd700 100%)`,
              borderRadius: '0 25px 0 25px'
            }} />
            
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '2rem'
            }}>
              <h2 style={{
                margin: 0,
                color: config.colors.primary,
                fontFamily: config.fonts.heading,
                fontSize: '2.2rem',
                fontWeight: '400'
              }}>
                👑 VIP Service Anfrage
              </h2>
              <button
                onClick={() => setIsVIPModalOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '2rem',
                  cursor: 'pointer',
                  color: config.colors.textLight,
                  padding: '0.5rem'
                }}
              >
                ×
              </button>
            </div>

            <div style={{
              background: `linear-gradient(135deg, ${config.colors.gold}10 0%, ${config.colors.gold}05 100%)`,
              padding: '1.5rem',
              borderRadius: '15px',
              marginBottom: '2rem',
              border: `1px solid ${config.colors.gold}30`
            }}>
              <p style={{
                margin: 0,
                color: config.colors.text,
                fontSize: '1rem',
                textAlign: 'center',
                fontStyle: 'italic'
              }}>
                "Exzellenz beginnt mit dem ersten Kontakt. Lassen Sie uns Ihre individuellen Wünsche besprechen."
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: '1rem', marginBottom: '1rem', alignItems: 'center' }}>
                <label style={{ fontWeight: '600' }}>Anrede</label>
                <select
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  style={{
                    padding: '0.75rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '10px',
                    fontSize: '1rem',
                    fontFamily: config.fonts.body,
                    transition: 'border-color 0.3s ease'
                  }}
                  onFocus={e => e.target.style.borderColor = config.colors.gold}
                  onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                >
                  <option value="">Bitte wählen</option>
                  <option value="Herr">Herr</option>
                  <option value="Frau">Frau</option>
                  <option value="Dr.">Dr.</option>
                  <option value="Prof.">Prof.</option>
                  <option value="Graf">Graf</option>
                  <option value="Baron">Baron</option>
                </select>
              </div>

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
                    onFocus={e => e.target.style.borderColor = config.colors.gold}
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
                    onFocus={e => e.target.style.borderColor = config.colors.gold}
                    onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                  Telefon (VIP-Hotline) *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+49 30 ..."
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
                  onFocus={e => e.target.style.borderColor = config.colors.gold}
                  onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                    Fahrzeugmarke
                  </label>
                  <select
                    value={formData.vehicleBrand}
                    onChange={e => setFormData({...formData, vehicleBrand: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid #e5e7eb',
                      borderRadius: '10px',
                      fontSize: '1rem',
                      fontFamily: config.fonts.body,
                      transition: 'border-color 0.3s ease'
                    }}
                    onFocus={e => e.target.style.borderColor = config.colors.gold}
                    onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                  >
                    <option value="">Marke wählen</option>
                    {luxuryBrands.map((brand, index) => (
                      <option key={index} value={brand.name}>{brand.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                    Modell & Baujahr
                  </label>
                  <input
                    type="text"
                    placeholder="z.B. S-Klasse 2023"
                    value={formData.vehicleModel}
                    onChange={e => setFormData({...formData, vehicleModel: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid #e5e7eb',
                      borderRadius: '10px',
                      fontSize: '1rem',
                      fontFamily: config.fonts.body,
                      transition: 'border-color 0.3s ease'
                    }}
                    onFocus={e => e.target.style.borderColor = config.colors.gold}
                    onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '1rem', fontWeight: '600' }}>
                  Premium Services (Mehrfachauswahl möglich)
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  {premiumServices.map((service, index) => (
                    <label key={index} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      cursor: 'pointer',
                      padding: '0.5rem',
                      borderRadius: '5px',
                      transition: 'background-color 0.3s ease'
                    }}
                    onMouseOver={e => e.currentTarget.style.background = `${config.colors.gold}10`}
                    onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <input
                        type="checkbox"
                        checked={formData.services.includes(service.title)}
                        onChange={e => {
                          if (e.target.checked) {
                            setFormData({...formData, services: [...formData.services, service.title]})
                          } else {
                            setFormData({...formData, services: formData.services.filter(s => s !== service.title)})
                          }
                        }}
                        style={{ transform: 'scale(1.2)' }}
                      />
                      <span>{service.icon} {service.title}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  cursor: 'pointer',
                  padding: '1rem',
                  border: `2px solid ${formData.conciergeService ? config.colors.gold : '#e5e7eb'}`,
                  borderRadius: '10px',
                  transition: 'all 0.3s ease',
                  background: formData.conciergeService ? `${config.colors.gold}10` : 'transparent'
                }}>
                  <input
                    type="checkbox"
                    checked={formData.conciergeService}
                    onChange={e => setFormData({...formData, conciergeService: e.target.checked})}
                    style={{ transform: 'scale(1.3)' }}
                  />
                  <div>
                    <div style={{ fontWeight: '600' }}>🤵 Concierge Service</div>
                    <div style={{ fontSize: '0.9rem', color: config.colors.textLight }}>
                      Persönliche Betreuung
                    </div>
                  </div>
                </label>

                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  cursor: 'pointer',
                  padding: '1rem',
                  border: `2px solid ${formData.vipLounge ? config.colors.gold : '#e5e7eb'}`,
                  borderRadius: '10px',
                  transition: 'all 0.3s ease',
                  background: formData.vipLounge ? `${config.colors.gold}10` : 'transparent'
                }}>
                  <input
                    type="checkbox"
                    checked={formData.vipLounge}
                    onChange={e => setFormData({...formData, vipLounge: e.target.checked})}
                    style={{ transform: 'scale(1.3)' }}
                  />
                  <div>
                    <div style={{ fontWeight: '600' }}>🍾 VIP Lounge</div>
                    <div style={{ fontSize: '0.9rem', color: config.colors.textLight }}>
                      Exklusiver Wartebereich
                    </div>
                  </div>
                </label>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                  Ihre Wünsche und Anliegen
                </label>
                <textarea
                  rows={4}
                  placeholder="Teilen Sie uns Ihre besonderen Wünsche mit..."
                  value={formData.message}
                  onChange={e => setFormData({...formData, message: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '10px',
                    fontSize: '1rem',
                    fontFamily: config.fonts.body,
                    resize: 'vertical',
                    transition: 'border-color 0.3s ease'
                  }}
                  onFocus={e => e.target.style.borderColor = config.colors.gold}
                  onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>

              <button
                type="submit"
                style={{
                  width: '100%',
                  background: `linear-gradient(135deg, ${config.colors.primary} 0%, ${config.colors.secondary} 100%)`,
                  color: config.colors.gold,
                  border: `2px solid ${config.colors.gold}`,
                  padding: '1.25rem',
                  borderRadius: '15px',
                  fontSize: '1.2rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}
                onMouseOver={e => {
                  e.target.style.background = config.colors.gold
                  e.target.style.color = config.colors.primary
                }}
                onMouseOut={e => {
                  e.target.style.background = `linear-gradient(135deg, ${config.colors.primary} 0%, ${config.colors.secondary} 100%)`
                  e.target.style.color = config.colors.gold
                }}
              >
                👑 VIP Beratung anfordern
              </button>
            </form>

            <p style={{
              marginTop: '1.5rem',
              fontSize: '0.9rem',
              color: config.colors.textLight,
              textAlign: 'center',
              fontStyle: 'italic'
            }}>
              💎 Diskrete Bearbeitung • 🕐 Rückmeldung binnen 2 Stunden • 🔒 Höchste Vertraulichkeit
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

      {/* Premium Footer */}
      <footer style={{
        background: `linear-gradient(135deg, ${config.colors.primary} 0%, ${config.colors.secondary} 100%)`,
        color: 'white',
        padding: '3rem 0'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: `linear-gradient(90deg, ${config.colors.gold} 0%, #ffd700 50%, ${config.colors.gold} 100%)`
        }} />
        
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 1rem',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '3rem',
            marginBottom: '1rem'
          }}>
            👑
          </div>
          <h3 style={{
            fontSize: '1.8rem',
            fontWeight: '400',
            color: config.colors.gold,
            margin: '0 0 1rem 0',
            fontFamily: config.fonts.heading
          }}>
            {workshop.name || 'Premium Automotive'}
          </h3>
          <p style={{ 
            margin: '0 0 1rem 0',
            opacity: 0.9,
            fontSize: '1.1rem'
          }}>
            © {new Date().getFullYear()} Luxury Service Excellence. Alle Rechte vorbehalten.
          </p>
          <p style={{ 
            margin: 0, 
            opacity: 0.8, 
            fontSize: '0.9rem',
            fontStyle: 'italic'
          }}>
            💎 Powered by CarBot Premium - Exklusiv für Luxury Automotive Services
          </p>
        </div>
      </footer>
    </div>
  )
}