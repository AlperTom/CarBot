'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signUp, validateEmail, validatePassword, validatePhoneNumber, validatePostalCode } from '../../../lib/auth'

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

    const passwordValidation = validatePassword(formData.password)
    if (!passwordValidation.isValid) {
      setError('Passwort muss mindestens 8 Zeichen lang sein.')
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
      const result = await signUp(formData.email, formData.password, {
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        postalCode: formData.postalCode,
        businessType: formData.businessType,
        plan: formData.plan
      })

      if (result.success) {
        if (result.requiresConfirmation) {
          setSuccess(true)
        } else {
          // Registration complete, redirect to dashboard
          router.push('/dashboard?onboarding=true')
        }
      } else {
        setError(result.error)
      }
    } catch (error) {
      setError('Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es erneut.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0070f3 0%, #0051a5 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        <div style={{
          background: 'white',
          padding: '40px',
          borderRadius: '12px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
          width: '100%',
          maxWidth: '500px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '60px', marginBottom: '20px' }}>✅</div>
          <h1 style={{ 
            color: '#1a202c', 
            margin: '0 0 15px 0', 
            fontSize: '28px',
            fontWeight: 'bold'
          }}>
            Registrierung erfolgreich!
          </h1>
          <p style={{ 
            color: '#666', 
            margin: '0 0 30px 0',
            fontSize: '16px',
            lineHeight: '1.5'
          }}>
            Wir haben Ihnen eine Bestätigungs-E-Mail an <strong>{formData.email}</strong> gesendet. 
            Bitte überprüfen Sie Ihr Postfach und klicken Sie auf den Bestätigungslink, um Ihr Konto zu aktivieren.
          </p>
          <Link 
            href="/auth/login"
            style={{
              display: 'inline-block',
              padding: '12px 24px',
              background: '#0070f3',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            Zur Anmeldung
          </Link>
        </div>
      </div>
    )
  }

  const stepTitles = [
    'Account erstellen',
    'Werkstatt-Informationen',
    'Plan auswählen'
  ]

  const progressPercentage = (currentStep / 3) * 100

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0070f3 0%, #0051a5 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '600px'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ fontSize: '40px', marginBottom: '10px' }}>🚗</div>
          <h1 style={{ 
            color: '#1a202c', 
            margin: 0, 
            fontSize: '28px',
            fontWeight: 'bold'
          }}>
            CarBot Workshop
          </h1>
          <p style={{ 
            color: '#666', 
            margin: '5px 0 20px 0',
            fontSize: '16px'
          }}>
            {stepTitles[currentStep - 1]}
          </p>

          {/* Progress Bar */}
          <div style={{
            width: '100%',
            height: '4px',
            background: '#e5e7eb',
            borderRadius: '2px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${progressPercentage}%`,
              height: '100%',
              background: '#0070f3',
              transition: 'width 0.3s ease'
            }} />
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '10px',
            fontSize: '12px',
            color: '#666'
          }}>
            <span>Schritt {currentStep} von 3</span>
            <span>{Math.round(progressPercentage)}% abgeschlossen</span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Step 1: Account Details */}
          {currentStep === 1 && (
            <div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  color: '#374151'
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
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                  placeholder="ihre.werkstatt@email.de"
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  color: '#374151'
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
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                  placeholder="Mindestens 8 Zeichen"
                />
                <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                  Mindestens 8 Zeichen mit Buchstaben und Zahlen
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  color: '#374151'
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
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                  placeholder="Passwort wiederholen"
                />
              </div>
            </div>
          )}

          {/* Step 2: Workshop Information */}
          {currentStep === 2 && (
            <div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  color: '#374151'
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
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                  placeholder="Müller KFZ-Werkstatt"
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  color: '#374151'
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
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                  placeholder="+49 30 12345678"
                />
              </div>

              <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
                <div style={{ flex: '2' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    color: '#374151'
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
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                    placeholder="Musterstraße 123"
                  />
                </div>
                <div style={{ flex: '1' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    color: '#374151'
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
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                    placeholder="12345"
                  />
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  color: '#374151'
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
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                  placeholder="München"
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  color: '#374151'
                }}>
                  Werkstatt-Typ
                </label>
                <select
                  value={formData.businessType}
                  onChange={(e) => handleInputChange('businessType', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                >
                  {businessTypes.map(type => (
                    <option key={type.value} value={type.value}>
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
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ 
                  color: '#1a202c',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  marginBottom: '15px'
                }}>
                  Wählen Sie Ihren Plan
                </h3>
                <div style={{ fontSize: '14px', color: '#666', marginBottom: '20px' }}>
                  Sie können Ihren Plan jederzeit ändern. Die ersten 14 Tage sind kostenlos.
                </div>

                {plans.map(plan => (
                  <div
                    key={plan.value}
                    onClick={() => handleInputChange('plan', plan.value)}
                    style={{
                      border: formData.plan === plan.value ? '2px solid #0070f3' : '1px solid #d1d5db',
                      borderRadius: '8px',
                      padding: '20px',
                      marginBottom: '15px',
                      cursor: 'pointer',
                      background: formData.plan === plan.value ? '#f0f8ff' : 'white',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <h4 style={{ 
                        margin: 0,
                        fontSize: '16px',
                        fontWeight: 'bold',
                        color: '#1a202c'
                      }}>
                        {plan.label}
                      </h4>
                      <div style={{
                        fontSize: '18px',
                        fontWeight: 'bold',
                        color: '#0070f3'
                      }}>
                        {plan.price}
                      </div>
                    </div>
                    <ul style={{ 
                      margin: 0,
                      padding: 0,
                      listStyle: 'none',
                      fontSize: '14px',
                      color: '#666'
                    }}>
                      {plan.features.map((feature, index) => (
                        <li key={index} style={{ 
                          marginBottom: '5px',
                          paddingLeft: '20px',
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
                background: '#f8fafc',
                padding: '15px',
                borderRadius: '6px',
                fontSize: '12px',
                color: '#6b7280',
                marginBottom: '20px'
              }}>
                <strong>Kostenlose Testphase:</strong> 14 Tage kostenfrei testen, danach automatische Verlängerung. 
                Jederzeit kündbar.
              </div>
            </div>
          )}

          {error && (
            <div style={{
              background: '#fee2e2',
              border: '1px solid #fecaca',
              color: '#dc2626',
              padding: '12px',
              borderRadius: '6px',
              fontSize: '14px',
              marginBottom: '20px'
            }}>
              {error}
            </div>
          )}

          {/* Navigation Buttons */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            gap: '15px',
            marginTop: '30px'
          }}>
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handleBack}
                style={{
                  padding: '12px 24px',
                  background: 'white',
                  color: '#0070f3',
                  border: '1px solid #0070f3',
                  borderRadius: '6px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                Zurück
              </button>
            )}

            {currentStep < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                style={{
                  padding: '12px 24px',
                  background: '#0070f3',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  marginLeft: 'auto',
                  transition: 'background-color 0.2s'
                }}
              >
                Weiter
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: '12px 24px',
                  background: loading ? '#9ca3af' : '#0070f3',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  marginLeft: 'auto',
                  transition: 'background-color 0.2s'
                }}
              >
                {loading ? 'Registrierung läuft...' : 'Registrierung abschließen'}
              </button>
            )}
          </div>
        </form>

        {/* Footer */}
        <div style={{ 
          textAlign: 'center', 
          marginTop: '30px',
          fontSize: '14px',
          color: '#666',
          paddingTop: '20px',
          borderTop: '1px solid #e5e7eb'
        }}>
          Haben Sie bereits ein Konto?{' '}
          <Link 
            href="/auth/login"
            style={{ 
              color: '#0070f3', 
              textDecoration: 'none',
              fontWeight: 'bold'
            }}
          >
            Hier anmelden
          </Link>
        </div>
      </div>
    </div>
  )
}