'use client';

import React, { useState } from 'react';
import { getStoredWorkshopData } from '@/lib/auth';
import ModernNavigation from '@/components/ModernNavigation';
import { GlassCard, PrimaryButton, SecondaryButton } from '@/components/SharedLayout';

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [loading, setLoading] = useState('');
  const [error, setError] = useState('');

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      description: 'Perfekt für kleine Werkstätten',
      monthlyPrice: 49,
      annualPrice: 490,
      features: [
        'Bis zu 100 Kundengespräche/Monat',
        'Grundlegende KI-Serviceberatung',
        'E-Mail-Support',
        'DSGVO-konforme Datenspeicherung',
        'Basis-Analytics Dashboard',
        'Mobile App Zugang'
      ],
      limitations: [
        'Keine Terminbuchung',
        'Standardisierte Antworten'
      ],
      cta: 'Kostenlos testen',
      popular: false
    },
    {
      id: 'professional',
      name: 'Professional',
      description: 'Ideal für wachsende Betriebe',
      monthlyPrice: 99,
      annualPrice: 990,
      features: [
        'Bis zu 500 Kundengespräche/Monat',
        'Erweiterte KI-Serviceberatung',
        'Intelligente Terminbuchung',
        'Prioritäts-Support',
        'Erweiterte Analytics',
        'Individuelle Anpassungen',
        'WhatsApp Integration',
        'Kostenvoranschlag-Generator',
        'Multi-Standort Verwaltung'
      ],
      limitations: [],
      cta: 'Jetzt starten',
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'Für große Werkstattketten',
      monthlyPrice: 199,
      annualPrice: 1990,
      features: [
        'Unbegrenzte Kundengespräche',
        'KI-Training auf Ihre Daten',
        'Dedizierter Account Manager',
        '24/7 Premium Support',
        'Custom Integrationen',
        'White-Label Lösung',
        'API-Zugang',
        'Erweiterte Sicherheitsfeatures',
        'Compliance-Reporting',
        'Schulungen & Onboarding'
      ],
      limitations: [],
      cta: 'Kontakt aufnehmen',
      popular: false
    }
  ];

  const faqs = [
    {
      question: 'Kann ich jederzeit kündigen?',
      answer: 'Ja, Sie können Ihr Abonnement jederzeit kündigen. Es gibt keine Mindestlaufzeit und keine Kündigungsgebühren.'
    },
    {
      question: 'Ist meine Daten sicher?',
      answer: 'Absolut. Wir befolgen strenge DSGVO-Richtlinien und verwenden modernste Verschlüsselung. Ihre Daten werden ausschließlich in Deutschland gespeichert.'
    },
    {
      question: 'Bieten Sie eine kostenlose Testversion an?',
      answer: 'Ja, alle Pläne kommen mit einer 30-tägigen kostenlosen Testversion. Keine Kreditkarte erforderlich.'
    },
    {
      question: 'Kann ich meinen Plan später ändern?',
      answer: 'Ja, Sie können jederzeit zwischen den Plänen wechseln. Upgrades werden sofort aktiviert, Downgrades zum nächsten Abrechnungszyklus.'
    },
    {
      question: 'Welche Zahlungsmethoden akzeptieren Sie?',
      answer: 'Wir akzeptieren alle gängigen Kreditkarten, SEPA-Lastschrift und Rechnung (ab Professional Plan).'
    }
  ];

  // Handle checkout process
  const handleCheckout = async (planId) => {
    try {
      setLoading(planId);
      setError('');

      // Get workshop data
      const { workshop } = getStoredWorkshopData();
      
      if (!workshop) {
        // Redirect to registration if no workshop found
        window.location.href = `/auth/register?plan=${planId}&billing=${isAnnual ? 'year' : 'month'}`;
        return;
      }

      // For enterprise plan, redirect to contact
      if (planId === 'enterprise') {
        window.location.href = '/contact?plan=enterprise';
        return;
      }

      // Create checkout session
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          planId,
          billing: isAnnual ? 'year' : 'month',
          workshopId: workshop.id
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Fehler beim Erstellen der Checkout-Session');
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (err) {
      console.error('Checkout error:', err);
      setError(err.message || 'Ein Fehler ist aufgetreten. Versuchen Sie es erneut.');
    } finally {
      setLoading('');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #111827 50%, #1e293b 100%)',
      color: 'white'
    }}>
      {/* Modern Navigation */}
      <ModernNavigation variant="page" />
      
      <main id="main-content" style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem 1.5rem'
      }}>
        {/* Hero Section */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h1 style={{
            fontSize: '3rem',
            fontWeight: 'bold',
            marginBottom: '1rem',
            color: 'white'
          }}>
            Einfache, transparente Preise
          </h1>
          <p style={{
            fontSize: '1.25rem',
            color: '#d1d5db',
            marginBottom: '2rem',
            maxWidth: '600px',
            margin: '0 auto 2rem'
          }}>
            Wählen Sie den Plan, der am besten zu Ihrer Werkstatt passt. 
            Alle Pläne beinhalten eine 30-tägige kostenlose Testversion.
          </p>

          {/* Billing Toggle */}
          <div style={{
            display: 'inline-flex',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            padding: '4px',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <button
              onClick={() => setIsAnnual(false)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                background: !isAnnual ? 'white' : 'transparent',
                color: !isAnnual ? '#1f2937' : 'white',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '500',
                transition: 'all 0.2s'
              }}
            >
              Monatlich
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                background: isAnnual ? 'white' : 'transparent',
                color: isAnnual ? '#1f2937' : 'white',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '500',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              Jährlich
              <span style={{
                background: '#16a34a',
                color: 'white',
                padding: '0.125rem 0.375rem',
                borderRadius: '4px',
                fontSize: '0.75rem',
                fontWeight: '600'
              }}>
                -17%
              </span>
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '8px',
            padding: '1rem',
            marginBottom: '2rem',
            color: '#fca5a5',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        {/* Pricing Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '2rem',
          marginBottom: '4rem'
        }}>
          {plans.map((plan) => (
            <div key={plan.id} style={{ position: 'relative' }}>
              {plan.popular && (
                <div style={{
                  position: 'absolute',
                  top: '-12px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'linear-gradient(135deg, #ea580c 0%, #9333ea 100%)',
                  color: 'white',
                  padding: '0.25rem 1rem',
                  borderRadius: '9999px',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  zIndex: 10
                }}>
                  Beliebtester Plan
                </div>
              )}
              
              <GlassCard style={{
                position: 'relative',
                height: '100%',
                border: plan.popular ? '2px solid rgba(234, 88, 12, 0.5)' : '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <div style={{
                  textAlign: 'center',
                  marginBottom: '2rem'
                }}>
                  <h3 style={{
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    color: 'white',
                    marginBottom: '0.5rem'
                  }}>
                    {plan.name}
                  </h3>
                  <p style={{
                    color: '#d1d5db',
                    marginBottom: '1rem'
                  }}>
                    {plan.description}
                  </p>
                  
                  <div style={{ marginBottom: '1rem' }}>
                    <span style={{
                      fontSize: '3rem',
                      fontWeight: 'bold',
                      color: 'white'
                    }}>
                      €{isAnnual ? Math.round(plan.annualPrice / 12) : plan.monthlyPrice}
                    </span>
                    <span style={{
                      color: '#9ca3af',
                      fontSize: '1rem'
                    }}>
                      /Monat
                    </span>
                  </div>
                  
                  {isAnnual && (
                    <p style={{
                      color: '#16a34a',
                      fontSize: '0.875rem',
                      marginBottom: '1rem'
                    }}>
                      €{plan.annualPrice} jährlich abgerechnet
                    </p>
                  )}
                  
                  <PrimaryButton
                    onClick={() => handleCheckout(plan.id)}
                    style={{
                      width: '100%',
                      opacity: loading === plan.id ? 0.7 : 1,
                      cursor: loading === plan.id ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {loading === plan.id ? 'Lädt...' : plan.cta}
                  </PrimaryButton>
                </div>

                {/* Features */}
                <div style={{ marginBottom: '1rem' }}>
                  <h4 style={{
                    color: 'white',
                    fontWeight: '600',
                    marginBottom: '1rem'
                  }}>
                    Enthalten:
                  </h4>
                  <ul style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: 0
                  }}>
                    {plan.features.map((feature, index) => (
                      <li key={index} style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.75rem',
                        marginBottom: '0.5rem',
                        color: '#d1d5db'
                      }}>
                        <svg width="16" height="16" fill="none" stroke="#16a34a" viewBox="0 0 24 24" style={{
                          marginTop: '2px',
                          flexShrink: 0
                        }}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Limitations */}
                {plan.limitations.length > 0 && (
                  <div>
                    <h4 style={{
                      color: '#9ca3af',
                      fontWeight: '600',
                      marginBottom: '1rem'
                    }}>
                      Nicht enthalten:
                    </h4>
                    <ul style={{
                      listStyle: 'none',
                      padding: 0,
                      margin: 0
                    }}>
                      {plan.limitations.map((limitation, index) => (
                        <li key={index} style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '0.75rem',
                          marginBottom: '0.5rem',
                          color: '#9ca3af'
                        }}>
                          <svg width="16" height="16" fill="none" stroke="#ef4444" viewBox="0 0 24 24" style={{
                            marginTop: '2px',
                            flexShrink: 0
                          }}>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          {limitation}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </GlassCard>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div style={{
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: '2rem',
            color: 'white'
          }}>
            Häufig gestellte Fragen
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div key={index}>
                  <GlassCard style={{
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    border: isOpen ? '1px solid rgba(234, 88, 12, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)'
                  }}>
                    <div 
                      onClick={() => setOpenFaq(isOpen ? null : index)}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: isOpen ? '1rem' : 0
                      }}
                    >
                      <h3 style={{
                        color: 'white',
                        fontWeight: '600',
                        margin: 0,
                        fontSize: '1.1rem'
                      }}>
                        {faq.question}
                      </h3>
                      <div style={{
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.3s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '24px',
                        height: '24px'
                      }}>
                        <svg 
                          width="16" 
                          height="16" 
                          fill="none" 
                          stroke="white" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                    
                    <div style={{
                      maxHeight: isOpen ? '200px' : '0px',
                      overflow: 'hidden',
                      transition: 'max-height 0.3s ease-in-out, opacity 0.3s ease-in-out',
                      opacity: isOpen ? 1 : 0
                    }}>
                      <div style={{ 
                        color: '#d1d5db',
                        lineHeight: '1.6',
                        paddingTop: isOpen ? '0.5rem' : '0',
                        borderTop: isOpen ? '1px solid rgba(255, 255, 255, 0.1)' : 'none'
                      }}>
                        {faq.answer}
                      </div>
                    </div>
                  </GlassCard>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA Section */}
        <div style={{
          textAlign: 'center',
          marginTop: '4rem'
        }}>
          <GlassCard style={{
            maxWidth: '600px',
            margin: '0 auto',
            textAlign: 'center'
          }}>
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: 'white',
              marginBottom: '1rem'
            }}>
              Noch Fragen?
            </h3>
            <p style={{
              color: '#d1d5db',
              marginBottom: '1.5rem'
            }}>
              Sprechen Sie mit unserem Team über Ihre individuellen Anforderungen.
            </p>
            <SecondaryButton href="mailto:sales@carbot.chat">
              Kontakt aufnehmen
            </SecondaryButton>
          </GlassCard>
        </div>
      </main>
      
      {/* Footer */}
      <footer style={{
        background: 'rgba(0, 0, 0, 0.2)',
        backdropFilter: 'blur(10px)',
        borderTop: '1px solid rgba(107, 114, 128, 1)',
        marginTop: '4rem'
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
                  <a href="/pricing" style={{ color: '#9ca3af', textDecoration: 'none' }}>Preise</a>
                </li>
                <li style={{ marginBottom: '0.5rem' }}>
                  <a href="/demo/workshop" style={{ color: '#9ca3af', textDecoration: 'none' }}>Demo</a>
                </li>
                <li>
                  <a href="/auth/register" style={{ color: '#9ca3af', textDecoration: 'none' }}>Kostenlos testen</a>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 style={{ fontWeight: '600', marginBottom: '1rem', color: 'white' }}>Rechtliches</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: '#9ca3af' }}>
                <li style={{ marginBottom: '0.5rem' }}>
                  <a href="/legal/datenschutz" style={{ color: '#9ca3af', textDecoration: 'none' }}>Datenschutz</a>
                </li>
                <li style={{ marginBottom: '0.5rem' }}>
                  <a href="/legal/impressum" style={{ color: '#9ca3af', textDecoration: 'none' }}>Impressum</a>
                </li>
                <li style={{ marginBottom: '0.5rem' }}>
                  <a href="/legal/agb" style={{ color: '#9ca3af', textDecoration: 'none' }}>AGB</a>
                </li>
                <li>
                  <a href="/legal/cookies" style={{ color: '#9ca3af', textDecoration: 'none' }}>Cookie-Richtlinie</a>
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
            <p>&copy; 2025 CarBot. Alle Rechte vorbehalten.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}