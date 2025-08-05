'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { validateEmail, validatePassword, validatePhoneNumber, validatePostalCode } from '../../../lib/auth'
import SharedLayout, { GlassCard, PrimaryButton, SecondaryButton } from '@/components/SharedLayout'

export default function RegisterPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    businessType: 'independent',
    plan: 'basic'
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const businessTypes = [
    { value: 'independent', label: 'Unabhängige Werkstatt' },
    { value: 'chain', label: 'Werkstattkette' },
    { value: 'dealership', label: 'Vertragswerkstatt' },
    { value: 'specialty', label: 'Spezialwerkstatt' }
  ]

  const plans = [
    { 
      value: 'basic', 
      label: 'Basic Plan', 
      price: '29€/Monat',
      features: ['Bis zu 100 Leads/Monat', 'E-Mail Support', 'Basis-Dashboard']
    },
    { 
      value: 'professional', 
      label: 'Professional Plan', 
      price: '79€/Monat',
      features: ['Unbegrenzte Leads', 'Telefon Support', 'Erweiterte Analysen', 'API-Zugang']
    },
    { 
      value: 'enterprise', 
      label: 'Enterprise Plan', 
      price: 'Individuell',
      features: ['Maßgeschneiderte Lösungen', 'Persönlicher Support', 'Custom Integrationen']
    }
  ]

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError('')
  }

  const validateStep1 = () => {
    if (!validateEmail(formData.email)) {
      setError('Bitte geben Sie eine gültige E-Mail-Adresse ein.')
      return false
    }

    if (!validatePassword(formData.password)) {
      setError('Passwort muss mindestens 8 Zeichen, einen Groß- und Kleinbuchstaben sowie eine Zahl enthalten.')
      return false
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwörter stimmen nicht überein.')
      return false
    }

    return true
  }

  const validateStep2 = () => {
    if (!formData.name.trim()) {
      setError('Bitte geben Sie den Werkstattnamen ein.')
      return false
    }

    if (!validatePhoneNumber(formData.phone)) {
      setError('Bitte geben Sie eine gültige deutsche Telefonnummer ein.')
      return false
    }

    if (!formData.address.trim()) {
      setError('Bitte geben Sie die Adresse ein.')
      return false
    }

    if (!formData.city.trim()) {
      setError('Bitte geben Sie die Stadt ein.')
      return false
    }

    if (!validatePostalCode(formData.postalCode)) {
      setError('Bitte geben Sie eine gültige deutsche Postleitzahl ein.')
      return false
    }

    return true
  }

  const handleNext = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2)
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/signup-simple', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          workshopData: {
            name: formData.name,
            phone: formData.phone,
            address: formData.address,
            city: formData.city,
            postalCode: formData.postalCode,
            businessType: formData.businessType,
            plan: formData.plan
          }
        })
      })

      const result = await response.json()

      if (response.ok && result.success) {
        if (result.data.requiresConfirmation) {
          setSuccess(true)
        } else {
          // Registration complete, redirect to dashboard
          router.push('/dashboard?onboarding=true')
        }
      } else {
        setError(result.error || 'Ein unerwarteter Fehler ist aufgetreten.')
      }
    } catch (error) {
      console.error('Registration error:', error)
      setError('Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es erneut.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <SharedLayout title="Registrierung erfolgreich" showNavigation={true}>
        <div style={{
          maxWidth: '500px',
          margin: '0 auto',
          padding: '2rem 1.5rem',
          textAlign: 'center'
        }}>
          <GlassCard>
            <div style={{ fontSize: '60px', marginBottom: '1.5rem' }}>✅</div>
            <h1 style={{ 
              color: 'white', 
              margin: '0 0 1rem 0', 
              fontSize: '1.75rem',
              fontWeight: 'bold'
            }}>
              Registrierung erfolgreich!
            </h1>
            <p style={{ 
              color: '#d1d5db', 
              margin: '0 0 2rem 0',
              fontSize: '1rem',
              lineHeight: '1.6'
            }}>
              Wir haben Ihnen eine Bestätigungs-E-Mail an <strong style={{ color: 'white' }}>{formData.email}</strong> gesendet. 
              Bitte überprüfen Sie Ihr Postfach und klicken Sie auf den Bestätigungslink, um Ihr Konto zu aktivieren.
            </p>
            <PrimaryButton href="/auth/login">
              Zur Anmeldung
            </PrimaryButton>
          </GlassCard>
        </div>
      </SharedLayout>
    )
  }

  const stepTitles = [
    'Account erstellen',
    'Werkstatt-Informationen',
    'Plan auswählen'
  ]

  const progressPercentage = (currentStep / 3) * 100

  return (
    <SharedLayout title="Registrierung" showNavigation={true}>
      <div style={{
        maxWidth: '600px',
        margin: '0 auto',
        padding: '2rem 1.5rem'
      }}>
        <GlassCard>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🚗</div>
            <h1 style={{ 
              color: 'white', 
              margin: 0, 
              fontSize: '1.75rem',
              fontWeight: 'bold'
            }}>
              CarBot Workshop
            </h1>
            <p style={{ 
              color: '#d1d5db', 
              margin: '0.5rem 0 1.5rem 0',
              fontSize: '1rem'
            }}>
              {stepTitles[currentStep - 1]}
            </p>

            {/* Progress Bar */}
            <div style={{
              width: '100%',
              height: '4px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '2px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${progressPercentage}%`,
                height: '100%',
                background: 'linear-gradient(135deg, #ea580c 0%, #9333ea 50%, #2563eb 100%)',
                transition: 'width 0.3s ease'
              }} />
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: '0.75rem',
              fontSize: '0.875rem',
              color: '#9ca3af'
            }}>
              <span>Schritt {currentStep} von 3</span>
              <span>{Math.round(progressPercentage)}% abgeschlossen</span>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Step 1: Account Details */}
            {currentStep === 1 && (
              <div>
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: 'white'
                  }}>
                    E-Mail-Adresse *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      boxSizing: 'border-box',
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: 'white'
                    }}
                    placeholder="ihre.werkstatt@email.de"
                  />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: 'white'
                  }}>
                    Passwort *
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      boxSizing: 'border-box',
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: 'white'
                    }}
                    placeholder="Mindestens 8 Zeichen"
                  />
                  <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.375rem' }}>
                    Mindestens 8 Zeichen mit Buchstaben und Zahlen
                  </div>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: 'white'
                  }}>
                    Passwort bestätigen *
                  </label>
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      boxSizing: 'border-box',
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: 'white'
                    }}
                    placeholder="Passwort wiederholen"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Workshop Information */}
            {currentStep === 2 && (
              <div>
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: 'white'
                  }}>
                    Werkstattname *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      boxSizing: 'border-box',
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: 'white'
                    }}
                    placeholder="Müller KFZ-Werkstatt"
                  />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: 'white'
                  }}>
                    Telefonnummer *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      boxSizing: 'border-box',
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: 'white'
                    }}
                    placeholder="+49 30 12345678"
                  />
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div style={{ flex: '2' }}>
                    <label style={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: 'white'
                    }}>
                      Adresse *
                    </label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      required
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        boxSizing: 'border-box',
                        background: 'rgba(255, 255, 255, 0.1)',
                        color: 'white'
                      }}
                      placeholder="Musterstraße 123"
                    />
                  </div>
                  <div style={{ flex: '1' }}>
                    <label style={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: 'white'
                    }}>
                      PLZ *
                    </label>
                    <input
                      type="text"
                      value={formData.postalCode}
                      onChange={(e) => handleInputChange('postalCode', e.target.value)}
                      required
                      maxLength={5}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        boxSizing: 'border-box',
                        background: 'rgba(255, 255, 255, 0.1)',
                        color: 'white'
                      }}
                      placeholder="12345"
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: 'white'
                  }}>
                    Stadt *
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      boxSizing: 'border-box',
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: 'white'
                    }}
                    placeholder="München"
                  />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: 'white'
                  }}>
                    Werkstatt-Typ
                  </label>
                  <select
                    value={formData.businessType}
                    onChange={(e) => handleInputChange('businessType', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      boxSizing: 'border-box',
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: 'white'
                    }}
                  >
                    {businessTypes.map(type => (
                      <option key={type.value} value={type.value} style={{ background: '#1e293b', color: 'white' }}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Step 3: Plan Selection */}
            {currentStep === 3 && (
              <div>
                <div style={{ marginBottom: '1.5rem' }}>
                  <h3 style={{ 
                    color: 'white',
                    fontSize: '1.125rem',
                    fontWeight: 'bold',
                    marginBottom: '1rem'
                  }}>
                    Wählen Sie Ihren Plan
                  </h3>
                  <div style={{ fontSize: '0.875rem', color: '#d1d5db', marginBottom: '1.5rem' }}>
                    Sie können Ihren Plan jederzeit ändern. Die ersten 14 Tage sind kostenlos.
                  </div>

                  {plans.map(plan => (
                    <div
                      key={plan.value}
                      onClick={() => handleInputChange('plan', plan.value)}
                      style={{
                        border: formData.plan === plan.value ? '2px solid #ea580c' : '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '12px',
                        padding: '1.25rem',
                        marginBottom: '1rem',
                        cursor: 'pointer',
                        background: formData.plan === plan.value ? 'rgba(234, 88, 12, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                        backdropFilter: 'blur(10px)',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                        <h4 style={{ 
                          margin: 0,
                          fontSize: '1rem',
                          fontWeight: 'bold',
                          color: 'white'
                        }}>
                          {plan.label}
                        </h4>
                        <div style={{
                          fontSize: '1.125rem',
                          fontWeight: 'bold',
                          color: '#fb923c'
                        }}>
                          {plan.price}
                        </div>
                      </div>
                      <ul style={{ 
                        margin: 0,
                        padding: 0,
                        listStyle: 'none',
                        fontSize: '0.875rem',
                        color: '#d1d5db'
                      }}>
                        {plan.features.map((feature, index) => (
                          <li key={index} style={{ 
                            marginBottom: '0.375rem',
                            paddingLeft: '1.25rem',
                            position: 'relative'
                          }}>
                            <span style={{
                              position: 'absolute',
                              left: 0,
                              color: '#22c55e'
                            }}>✓</span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                <div style={{
                  background: 'rgba(245, 158, 11, 0.1)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  padding: '1rem',
                  borderRadius: '8px',
                  fontSize: '0.75rem',
                  color: '#fbbf24',
                  marginBottom: '1.5rem'
                }}>
                  <strong>Kostenlose Testphase:</strong> 14 Tage kostenfrei testen, danach automatische Verlängerung. 
                  Jederzeit kündbar.
                </div>
              </div>
            )}

            {error && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '8px',
                padding: '1rem',
                marginBottom: '1.5rem',
                color: '#fca5a5'
              }}>
                {error}
              </div>
            )}

            {/* Navigation Buttons */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              gap: '1rem',
              marginTop: '2rem'
            }}>
              {currentStep > 1 && (
                <SecondaryButton type="button" onClick={handleBack}>
                  Zurück
                </SecondaryButton>
              )}

              {currentStep < 3 ? (
                <PrimaryButton
                  type="button"
                  onClick={handleNext}
                  style={{
                    marginLeft: 'auto'
                  }}
                >
                  Weiter
                </PrimaryButton>
              ) : (
                <PrimaryButton
                  type="submit"
                  style={{
                    marginLeft: 'auto',
                    opacity: loading ? 0.5 : 1,
                    cursor: loading ? 'not-allowed' : 'pointer'
                  }}
                  disabled={loading}
                >
                  {loading ? 'Registrierung läuft...' : 'Registrierung abschließen'}
                </PrimaryButton>
              )}
            </div>
          </form>

          {/* Footer */}
          <div style={{ 
            textAlign: 'center', 
            marginTop: '2rem',
            fontSize: '0.875rem',
            color: '#d1d5db',
            paddingTop: '1.5rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            Haben Sie bereits ein Konto?{' '}
            <Link 
              href="/auth/login"
              style={{ 
                color: '#fb923c', 
                textDecoration: 'none',
                fontWeight: '600'
              }}
            >
              Hier anmelden
            </Link>
          </div>
        </GlassCard>
      </div>
    </SharedLayout>
  )
}