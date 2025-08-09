'use client'

/**
 * Familienbetrieb Template
 * Target: Family-owned automotive workshops with generational heritage
 * Colors: Green/Brown (Warmth & Trust)
 * Conversion Focus: Family Values, Personal Service, Generational Trust
 */

import React, { useState, useEffect } from 'react'
import { WidgetPreview } from '../WidgetPreview'

export default function Familienbetrieb({ 
  customization = {}, 
  workshop = {}, 
  previewMode = false,
  onLeadGenerated = () => {}
}) {
  const [isContactOpen, setIsContactOpen] = useState(false)
  const [selectedFamilyMember, setSelectedFamilyMember] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    vehicle: '',
    message: '',
    preferredContact: '',
    familyReferral: false
  })

  // Warm family colors inspired by German craftsmanship
  const config = {
    colors: {
      primary: customization.primaryColor || '#16a34a',       // Forest Green
      secondary: customization.secondaryColor || '#22c55e',   // Fresh Green
      brown: customization.brownColor || '#8b5a2b',           // Warm Brown
      accent: customization.accentColor || '#dc2626',         // Family Red
      text: customization.textColor || '#1f2937',
      textLight: '#6b7280',
      textWarm: '#8b5a2b',
      background: '#ffffff',
      section: '#fef9f3',    // Warm cream
      family: '#f0fdf4'      // Light green
    },
    fonts: {
      heading: customization.headingFont || '"Merriweather", serif',
      body: customization.bodyFont || '"Open Sans", sans-serif'
    },
    content: {
      heroTitle: customization.heroTitle || `${workshop.name || 'Familienwerkstatt Müller'} - Seit ${workshop.founded || '1962'}`,
      heroSubtitle: customization.heroSubtitle || 'Drei Generationen Handwerkskunst - Ihr Auto ist bei uns Familie',
      phone: workshop.phone || '+49 30 44455566',
      email: workshop.email || 'info@familie-mueller.de',
      address: workshop.address || 'Dorfstraße 23, 12345 Musterhausen',
      ...customization.content
    }
  }

  const familyMembers = [
    {
      name: 'Hans Müller',
      role: 'Werkstatt-Gründer (3. Generation)',
      age: '78 Jahre',
      experience: '60 Jahre Berufserfahrung',
      specialty: 'Oldtimer & Klassiker',
      photo: '👴',
      quote: '"Mit Liebe zum Detail - so habe ich es von meinem Vater gelernt."',
      story: 'Gründete 1962 die Werkstatt und baute sie mit viel Herzblut auf.'
    },
    {
      name: 'Klaus Müller',
      role: 'Werkstattleiter (2. Generation)',
      age: '52 Jahre',
      experience: '30 Jahre Berufserfahrung',
      specialty: 'Moderne Fahrzeugtechnik',
      photo: '👨‍🔧',
      quote: '"Tradition und Innovation - das ist unser Erfolgsrezept."',
      story: 'Übernahm 1995 die Leitung und modernisierte die Werkstatt.'
    },
    {
      name: 'Thomas Müller',
      role: 'Kfz-Meister (1. Generation)',
      age: '28 Jahre',
      experience: '8 Jahre Berufserfahrung',
      specialty: 'Elektronik & Diagnose',
      photo: '👨‍💻',
      quote: '"Neue Technik mit bewährten Werten - das ist die Zukunft."',
      story: 'Bringt frischen Wind und modernste Technik in die Familien-tradition.'
    },
    {
      name: 'Maria Müller',
      role: 'Kundenservice & Buchhaltung',
      age: '50 Jahre',
      experience: '25 Jahre im Familienbetrieb',
      specialty: 'Kundenbetreuung',
      photo: '👩‍💼',
      quote: '"Für unsere Kunden geben wir immer unser Bestes - wie für die Familie."',
      story: 'Das Herz der Werkstatt - kümmert sich liebevoll um jeden Kunden.'
    }
  ]

  const familyServices = [
    {
      icon: '👥',
      title: 'Persönliche Betreuung',
      description: 'Ihr fester Ansprechpartner aus der Familie',
      features: ['Direkter Draht zum Chef', 'Persönliche Termine', 'Individuelle Beratung'],
      price: 'inklusive'
    },
    {
      icon: '🏠',
      title: 'Familien-Rabatt',
      description: 'Besondere Konditionen für Stammkunden',
      features: ['5% Familienrabatt', 'Treuepunkte sammeln', 'Empfehlungsbonus'],
      price: 'dauerhaft'
    },
    {
      icon: '🤝',
      title: 'Vertrauensgarantie',
      description: 'Ehrliche Preise, faire Beratung',
      features: ['Kostenvoranschlag gratis', 'Keine versteckten Kosten', 'Festpreisgarantie'],
      price: 'garantiert'
    },
    {
      icon: '🔧',
      title: 'Handwerkskunst',
      description: 'Drei Generationen Erfahrung',
      features: ['60 Jahre Tradition', 'Meisterbetrieb', '3 Jahre Garantie'],
      price: 'unbezahlbar'
    }
  ]

  const services = [
    {
      category: 'Grundversorgung',
      items: [
        { name: 'Inspektion nach Herstellervorgabe', price: 'ab €129', icon: '🔍' },
        { name: 'Ölwechsel mit Premiumöl', price: 'ab €49', icon: '🛢️' },
        { name: 'Bremsenservice komplett', price: 'ab €149', icon: '🛑' },
        { name: 'Reifen wechseln & einlagern', price: 'ab €39', icon: '🛞' }
      ]
    },
    {
      category: 'Familien-Spezial',
      items: [
        { name: 'TÜV + AU (mit Vorbereitung)', price: 'ab €99', icon: '✅' },
        { name: 'Klimaanlage prüfen & warten', price: 'ab €79', icon: '❄️' },
        { name: 'Familienfahrzeug Komplettcheck', price: 'ab €89', icon: '👨‍👩‍👧‍👦' },
        { name: 'Anhängerkupplung montieren', price: 'ab €199', icon: '🚛' }
      ]
    }
  ]

  const familyValues = [
    {
      icon: '❤️',
      title: 'Herzlichkeit',
      description: 'Wir behandeln jeden Kunden wie Familie'
    },
    {
      icon: '🤝',
      title: 'Vertrauen',
      description: 'Ehrlichkeit und Transparenz in allem was wir tun'
    },
    {
      icon: '⚡',
      title: 'Zuverlässigkeit',
      description: 'Pünktlich und verlässlich seit über 60 Jahren'
    },
    {
      icon: '🏆',
      title: 'Qualität',
      description: 'Handwerkskunst auf höchstem Niveau'
    }
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    onLeadGenerated({
      ...formData,
      source: 'familienbetrieb-template',
      template: 'family',
      familyMember: selectedFamilyMember?.name || 'Allgemein'
    })
    setIsContactOpen(false)
    setFormData({ name: '', email: '', phone: '', service: '', vehicle: '', message: '', preferredContact: '', familyReferral: false })
  }

  return (
    <div style={{ 
      fontFamily: config.fonts.body,
      lineHeight: 1.6,
      color: config.colors.text,
      background: config.colors.background
    }}>
      {/* Family Header */}
      <header style={{
        background: `linear-gradient(135deg, ${config.colors.primary} 0%, ${config.colors.secondary} 100%)`,
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            {workshop.logo && (
              <img 
                src={workshop.logo} 
                alt="Logo" 
                style={{ height: '60px', objectFit: 'contain' }}
              />
            )}
            <div>
              <h1 style={{ 
                margin: 0, 
                fontSize: '1.6rem', 
                fontWeight: '700',
                fontFamily: config.fonts.heading
              }}>
                {workshop.name || 'Familienwerkstatt Müller'}
              </h1>
              <p style={{ margin: 0, opacity: 0.9, fontSize: '1rem' }}>
                👨‍👩‍👧‍👦 Familienbetrieb seit {workshop.founded || '1962'} • 🏆 Meisterbetrieb
              </p>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', fontSize: '1rem' }}>
            <div style={{ 
              background: 'rgba(255,255,255,0.2)', 
              padding: '0.5rem 1rem', 
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <span>📞</span>
              <span>{config.content.phone}</span>
            </div>
            <button
              onClick={() => setIsContactOpen(true)}
              style={{
                background: config.colors.brown,
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '25px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(139, 90, 43, 0.3)'
              }}
              onMouseOver={e => {
                e.target.style.background = '#a0522d'
                e.target.style.transform = 'translateY(-2px)'
                e.target.style.boxShadow = '0 6px 20px rgba(139, 90, 43, 0.4)'
              }}
              onMouseOut={e => {
                e.target.style.background = config.colors.brown
                e.target.style.transform = 'translateY(0)'
                e.target.style.boxShadow = '0 4px 15px rgba(139, 90, 43, 0.3)'
              }}
            >
              👥 Familie kontaktieren
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{
        background: `linear-gradient(135deg, ${config.colors.section} 0%, #fefce8 100%)`,
        padding: '4rem 0',
        position: 'relative'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 1rem'
        }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', 
            gap: '3rem',
            alignItems: 'center'
          }}>
            {/* Left side - Text */}
            <div>
              <h1 style={{
                fontSize: '2.8rem',
                fontWeight: '700',
                margin: '0 0 1rem 0',
                color: config.colors.primary,
                fontFamily: config.fonts.heading
              }}>
                {config.content.heroTitle}
              </h1>
              <p style={{
                fontSize: '1.3rem',
                color: config.colors.textWarm,
                margin: '0 0 2rem 0',
                lineHeight: 1.6
              }}>
                {config.content.heroSubtitle}
              </p>

              {/* Family Values */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '1.5rem',
                marginBottom: '2rem'
              }}>
                {familyValues.map((value, index) => (
                  <div 
                    key={index}
                    style={{
                      background: config.colors.background,
                      padding: '1.5rem',
                      borderRadius: '15px',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
                      border: `2px solid ${config.colors.family}`,
                      transition: 'all 0.3s ease'
                    }}
                    onMouseOver={e => {
                      e.currentTarget.style.transform = 'translateY(-3px)'
                      e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.12)'
                    }}
                    onMouseOut={e => {
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.08)'
                    }}
                  >
                    <div style={{
                      fontSize: '2rem',
                      marginBottom: '0.5rem'
                    }}>
                      {value.icon}
                    </div>
                    <h3 style={{
                      fontSize: '1.1rem',
                      fontWeight: '600',
                      margin: '0 0 0.5rem 0',
                      color: config.colors.primary
                    }}>
                      {value.title}
                    </h3>
                    <p style={{
                      color: config.colors.textLight,
                      margin: 0,
                      fontSize: '0.9rem'
                    }}>
                      {value.description}
                    </p>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setIsContactOpen(true)}
                style={{
                  background: `linear-gradient(135deg, ${config.colors.primary} 0%, ${config.colors.secondary} 100%)`,
                  color: 'white',
                  border: 'none',
                  padding: '1rem 2rem',
                  borderRadius: '25px',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: `0 6px 20px rgba(22, 163, 74, 0.3)`
                }}
                onMouseOver={e => {
                  e.target.style.transform = 'translateY(-2px)'
                  e.target.style.boxShadow = `0 10px 30px rgba(22, 163, 74, 0.4)`
                }}
                onMouseOut={e => {
                  e.target.style.transform = 'translateY(0)'
                  e.target.style.boxShadow = `0 6px 20px rgba(22, 163, 74, 0.3)`
                }}
              >
                👨‍👩‍👧‍👦 Jetzt Familien-Termin buchen
              </button>
            </div>

            {/* Right side - Family photo placeholder */}
            <div style={{
              background: `linear-gradient(135deg, ${config.colors.family} 0%, ${config.colors.section} 100%)`,
              borderRadius: '20px',
              padding: '3rem',
              textAlign: 'center',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
            }}>
              <div style={{
                fontSize: '8rem',
                marginBottom: '1rem',
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))'
              }}>
                👨‍👩‍👧‍👦
              </div>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                color: config.colors.primary,
                margin: '0 0 0.5rem 0'
              }}>
                Die Familie Müller
              </h3>
              <p style={{
                color: config.colors.textWarm,
                margin: '0 0 1rem 0',
                fontStyle: 'italic'
              }}>
                "Drei Generationen im Dienst Ihrer Mobilität"
              </p>
              <div style={{
                background: config.colors.background,
                padding: '1rem',
                borderRadius: '10px',
                fontSize: '0.9rem',
                color: config.colors.text
              }}>
                <strong>Seit 1962</strong><br />
                Über 15.000 zufriedene Kunden<br />
                3 Generationen Handwerkskunst
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Family Members Section */}
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
              color: config.colors.primary,
              margin: '0 0 1rem 0',
              fontFamily: config.fonts.heading
            }}>
              Lernen Sie unsere Familie kennen
            </h2>
            <p style={{
              color: config.colors.textLight,
              fontSize: '1.2rem',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Jedes Familienmitglied bringt seine ganz besonderen Fähigkeiten mit ein
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem'
          }}>
            {familyMembers.map((member, index) => (
              <div
                key={index}
                style={{
                  background: config.colors.section,
                  padding: '2rem',
                  borderRadius: '20px',
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  border: '2px solid transparent',
                  position: 'relative'
                }}
                onMouseOver={e => {
                  e.currentTarget.style.transform = 'translateY(-5px)'
                  e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.1)'
                  e.currentTarget.style.borderColor = config.colors.primary
                }}
                onMouseOut={e => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                  e.currentTarget.style.borderColor = 'transparent'
                }}
                onClick={() => {
                  setSelectedFamilyMember(member)
                  setIsContactOpen(true)
                }}
              >
                <div style={{
                  fontSize: '4rem',
                  marginBottom: '1rem'
                }}>
                  {member.photo}
                </div>
                
                <h3 style={{
                  fontSize: '1.4rem',
                  fontWeight: '600',
                  color: config.colors.primary,
                  margin: '0 0 0.5rem 0'
                }}>
                  {member.name}
                </h3>
                
                <p style={{
                  color: config.colors.textWarm,
                  fontWeight: '500',
                  margin: '0 0 0.5rem 0',
                  fontSize: '1rem'
                }}>
                  {member.role}
                </p>
                
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '1rem',
                  fontSize: '0.9rem',
                  color: config.colors.textLight
                }}>
                  <span>{member.age}</span>
                  <span>{member.experience}</span>
                </div>
                
                <div style={{
                  background: config.colors.primary,
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '15px',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  marginBottom: '1rem'
                }}>
                  Spezialist für: {member.specialty}
                </div>
                
                <blockquote style={{
                  fontStyle: 'italic',
                  color: config.colors.textWarm,
                  margin: '0 0 1rem 0',
                  fontSize: '0.95rem',
                  lineHeight: 1.5
                }}>
                  "{member.quote}"
                </blockquote>
                
                <p style={{
                  color: config.colors.textLight,
                  margin: 0,
                  fontSize: '0.9rem'
                }}>
                  {member.story}
                </p>
                
                <button
                  style={{
                    marginTop: '1rem',
                    background: config.colors.brown,
                    color: 'white',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '15px',
                    fontSize: '0.9rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={e => e.target.style.background = '#a0522d'}
                  onMouseOut={e => e.target.style.background = config.colors.brown}
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedFamilyMember(member)
                    setIsContactOpen(true)
                  }}
                >
                  👋 Persönlich kontaktieren
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section style={{
        background: `linear-gradient(135deg, ${config.colors.family} 0%, ${config.colors.section} 100%)`,
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
              color: config.colors.primary,
              margin: '0 0 1rem 0',
              fontFamily: config.fonts.heading
            }}>
              Unsere Familienleistungen
            </h2>
            <p style={{
              color: config.colors.textLight,
              fontSize: '1.2rem',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Faire Preise, ehrliche Beratung - so wie es sich in einer Familie gehört
            </p>
          </div>

          {/* Family Services */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem',
            marginBottom: '4rem'
          }}>
            {familyServices.map((service, index) => (
              <div
                key={index}
                style={{
                  background: config.colors.background,
                  padding: '2rem',
                  borderRadius: '15px',
                  boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                  border: `2px solid ${config.colors.primary}20`
                }}
                onMouseOver={e => {
                  e.currentTarget.style.transform = 'translateY(-5px)'
                  e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.12)'
                  e.currentTarget.style.borderColor = config.colors.primary
                }}
                onMouseOut={e => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.08)'
                  e.currentTarget.style.borderColor = `${config.colors.primary}20`
                }}
              >
                <div style={{
                  fontSize: '3rem',
                  marginBottom: '1rem'
                }}>
                  {service.icon}
                </div>
                <h3 style={{
                  fontSize: '1.3rem',
                  fontWeight: '600',
                  color: config.colors.primary,
                  margin: '0 0 1rem 0'
                }}>
                  {service.title}
                </h3>
                <p style={{
                  color: config.colors.textLight,
                  margin: '0 0 1rem 0'
                }}>
                  {service.description}
                </p>
                <ul style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: '0 0 1rem 0'
                }}>
                  {service.features.map((feature, fIndex) => (
                    <li key={fIndex} style={{
                      padding: '0.25rem 0',
                      color: config.colors.text,
                      fontSize: '0.9rem'
                    }}>
                      ✓ {feature}
                    </li>
                  ))}
                </ul>
                <div style={{
                  background: config.colors.primary,
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '15px',
                  fontWeight: '600'
                }}>
                  {service.price}
                </div>
              </div>
            ))}
          </div>

          {/* Service Categories */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
            gap: '3rem'
          }}>
            {services.map((category, categoryIndex) => (
              <div
                key={categoryIndex}
                style={{
                  background: config.colors.background,
                  padding: '2rem',
                  borderRadius: '20px',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
                }}
              >
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  color: config.colors.primary,
                  margin: '0 0 1.5rem 0',
                  textAlign: 'center',
                  fontFamily: config.fonts.heading
                }}>
                  {category.category}
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {category.items.map((item, itemIndex) => (
                    <div
                      key={itemIndex}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '1rem',
                        background: config.colors.section,
                        borderRadius: '10px',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseOver={e => {
                        e.currentTarget.style.background = config.colors.family
                        e.currentTarget.style.transform = 'translateX(5px)'
                      }}
                      onMouseOut={e => {
                        e.currentTarget.style.background = config.colors.section
                        e.currentTarget.style.transform = 'translateX(0)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span style={{ fontSize: '1.5rem' }}>{item.icon}</span>
                        <span style={{ color: config.colors.text, fontWeight: '500' }}>
                          {item.name}
                        </span>
                      </div>
                      <span style={{
                        color: config.colors.primary,
                        fontWeight: '700',
                        fontSize: '1rem'
                      }}>
                        {item.price}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section style={{
        background: `linear-gradient(135deg, ${config.colors.primary} 0%, ${config.colors.secondary} 100%)`,
        color: 'white',
        padding: '4rem 0'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 1rem',
          textAlign: 'center'
        }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            margin: '0 0 2rem 0',
            fontFamily: config.fonts.heading
          }}>
            Besuchen Sie unsere Familienwerkstatt
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '3rem',
            marginBottom: '3rem'
          }}>
            <div>
              <h3 style={{ 
                fontSize: '1.3rem', 
                margin: '0 0 1rem 0', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '0.5rem'
              }}>
                🏠 Besuchen Sie uns
              </h3>
              <p style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>
                {config.content.address}
              </p>
              <p style={{ margin: 0, opacity: 0.9 }}>
                Parkplätze direkt vor der Werkstatt
              </p>
            </div>

            <div>
              <h3 style={{ 
                fontSize: '1.3rem', 
                margin: '0 0 1rem 0', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '0.5rem'
              }}>
                📞 Rufen Sie an
              </h3>
              <p style={{ margin: '0 0 0.5rem 0', fontSize: '1.3rem', fontWeight: '600' }}>
                {config.content.phone}
              </p>
              <p style={{ margin: 0, opacity: 0.9 }}>
                Mo-Fr: 7:30-18:00, Sa: 8:00-13:00
              </p>
            </div>

            <div>
              <h3 style={{ 
                fontSize: '1.3rem', 
                margin: '0 0 1rem 0', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '0.5rem'
              }}>
                ✉️ Schreiben Sie uns
              </h3>
              <p style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>
                {config.content.email}
              </p>
              <p style={{ margin: 0, opacity: 0.9 }}>
                Antwort binnen 24 Stunden
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsContactOpen(true)}
            style={{
              background: config.colors.brown,
              color: 'white',
              border: 'none',
              padding: '1rem 2rem',
              borderRadius: '25px',
              fontSize: '1.2rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 6px 20px rgba(139, 90, 43, 0.4)'
            }}
            onMouseOver={e => {
              e.target.style.background = '#a0522d'
              e.target.style.transform = 'translateY(-2px)'
              e.target.style.boxShadow = '0 10px 30px rgba(139, 90, 43, 0.5)'
            }}
            onMouseOut={e => {
              e.target.style.background = config.colors.brown
              e.target.style.transform = 'translateY(0)'
              e.target.style.boxShadow = '0 6px 20px rgba(139, 90, 43, 0.4)'
            }}
          >
            👨‍👩‍👧‍👦 Familie Müller kontaktieren
          </button>
        </div>
      </section>

      {/* Contact Modal */}
      {isContactOpen && (
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
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            border: `3px solid ${config.colors.primary}`
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.5rem'
            }}>
              <div>
                <h2 style={{
                  margin: 0,
                  color: config.colors.primary,
                  fontFamily: config.fonts.heading,
                  fontSize: '1.8rem',
                  fontWeight: '700'
                }}>
                  👨‍👩‍👧‍👦 Familie kontaktieren
                </h2>
                {selectedFamilyMember && (
                  <p style={{
                    margin: '0.5rem 0 0 0',
                    color: config.colors.textWarm,
                    fontSize: '1rem'
                  }}>
                    Direkt an {selectedFamilyMember.name} ({selectedFamilyMember.role})
                  </p>
                )}
              </div>
              <button
                onClick={() => {
                  setIsContactOpen(false)
                  setSelectedFamilyMember(null)
                }}
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

            {selectedFamilyMember && (
              <div style={{
                background: config.colors.section,
                padding: '1rem',
                borderRadius: '15px',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
              }}>
                <div style={{ fontSize: '3rem' }}>
                  {selectedFamilyMember.photo}
                </div>
                <div>
                  <h4 style={{ margin: '0 0 0.25rem 0', color: config.colors.primary }}>
                    {selectedFamilyMember.name}
                  </h4>
                  <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.9rem', color: config.colors.textWarm }}>
                    {selectedFamilyMember.specialty}
                  </p>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: config.colors.textLight, fontStyle: 'italic' }}>
                    {selectedFamilyMember.quote}
                  </p>
                </div>
              </div>
            )}

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
                    Gewünschte Leistung
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
                    {services.map(category => 
                      category.items.map((item, index) => (
                        <option key={index} value={item.name}>{item.name}</option>
                      ))
                    )}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                    Fahrzeug
                  </label>
                  <input
                    type="text"
                    placeholder="z.B. VW Golf, Baujahr 2019"
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

              <div style={{ marginBottom: '1rem' }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  cursor: 'pointer'
                }}>
                  <input
                    type="checkbox"
                    checked={formData.familyReferral}
                    onChange={e => setFormData({...formData, familyReferral: e.target.checked})}
                    style={{ transform: 'scale(1.2)' }}
                  />
                  <span style={{ fontWeight: '600' }}>👨‍👩‍👧‍👦 Ich bin bereits Stammkunde der Familie</span>
                </label>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                  Ihre Nachricht
                </label>
                <textarea
                  rows={4}
                  placeholder="Erzählen Sie uns, wie wir Ihnen helfen können..."
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
                  onFocus={e => e.target.style.borderColor = config.colors.primary}
                  onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                />
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
                  boxShadow: `0 6px 20px rgba(22, 163, 74, 0.3)`
                }}
                onMouseOver={e => {
                  e.target.style.transform = 'translateY(-2px)'
                  e.target.style.boxShadow = `0 10px 30px rgba(22, 163, 74, 0.4)`
                }}
                onMouseOut={e => {
                  e.target.style.transform = 'translateY(0)'
                  e.target.style.boxShadow = `0 6px 20px rgba(22, 163, 74, 0.3)`
                }}
              >
                👨‍👩‍👧‍👦 Nachricht an Familie senden
              </button>
            </form>

            <p style={{
              marginTop: '1rem',
              fontSize: '0.9rem',
              color: config.colors.textLight,
              textAlign: 'center'
            }}>
              ❤️ Persönliche Antwort • ⏰ Innerhalb von 24 Stunden • 🤝 Wie in der Familie
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

      {/* Family Footer */}
      <footer style={{
        background: `linear-gradient(135deg, ${config.colors.brown} 0%, #8b5a2b 100%)`,
        color: 'white',
        padding: '2rem 0',
        textAlign: 'center'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 1rem'
        }}>
          <div style={{
            fontSize: '3rem',
            marginBottom: '1rem'
          }}>
            👨‍👩‍👧‍👦
          </div>
          <p style={{ margin: '0 0 1rem 0', fontSize: '1.1rem' }}>
            © {new Date().getFullYear()} {workshop.name || 'Familienwerkstatt Müller'}. Mit ❤️ geführt seit {workshop.founded || '1962'}.
          </p>
          <p style={{ margin: 0, opacity: 0.8, fontSize: '0.9rem' }}>
            🏠 Powered by CarBot - Familienfreundliche Werkstatt-Software
          </p>
        </div>
      </footer>
    </div>
  )
}