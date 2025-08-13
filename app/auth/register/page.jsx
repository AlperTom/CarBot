'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    businessName: '',
    name: '',
    phone: '',
    templateType: 'klassische'
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const templateOptions = [
    { value: 'klassische', label: '🏭 Klassische Werkstatt' },
    { value: 'moderne', label: '🔧 Moderne Autowerkstatt' },
    { value: 'premium', label: '⭐ Premium Service Center' },
    { value: 'elektro', label: '⚡ Elektro & Hybrid Spezialist' },
    { value: 'oldtimer', label: '🚗 Oldtimer Spezialwerkstatt' }
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          businessName: formData.businessName,
          name: formData.name,
          phone: formData.phone,
          templateType: formData.templateType,
          useJWT: true
        })
      })

      const data = await response.json()

      if (response.ok && data.success) {
        // Store tokens in localStorage
        if (data.data.tokens) {
          localStorage.setItem('carbot_auth_tokens', JSON.stringify(data.data.tokens))
          localStorage.setItem('carbot_auth_user', JSON.stringify({
            user: data.data.user,
            workshop: data.data.workshop,
            role: 'owner'
          }))
        }
        
        // Redirect to dashboard
        router.push('/dashboard')
      } else {
        setError(data.error || 'Registrierung fehlgeschlagen. Bitte versuchen Sie es erneut.')
      }
    } catch (err) {
      setError('Verbindungsfehler. Bitte überprüfen Sie Ihre Internetverbindung.')
      console.error('Register error:', err)
    }

    setIsLoading(false)
  }

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #111827 50%, #1e293b 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
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
          background: 'radial-gradient(circle, rgba(168, 85, 247, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)',
          borderRadius: '50%',
          filter: 'blur(3rem)'
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '-10rem',
          left: '-10rem',
          width: '20rem',
          height: '20rem',
          background: 'radial-gradient(circle, rgba(249, 115, 22, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)',
          borderRadius: '50%',
          filter: 'blur(3rem)'
        }}></div>
      </div>

      <div style={{
        position: 'relative',
        zIndex: 10,
        width: '100%',
        maxWidth: '500px'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '24px',
          padding: '2rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
        }}>
          {/* Logo */}
          <div style={{
            textAlign: 'center',
            marginBottom: '2rem'
          }}>
            <Link href="/" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.75rem',
              textDecoration: 'none'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                background: 'linear-gradient(135deg, #ea580c 0%, #9333ea 100%)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <svg width="20" height="20" fill="white" viewBox="0 0 24 24">
                  <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
                </svg>
              </div>
              <span style={{ 
                fontSize: '1.5rem', 
                fontWeight: 'bold', 
                color: 'white',
                fontFamily: 'Inter, sans-serif'
              }}>
                CarBot
              </span>
            </Link>
          </div>

          {/* Header */}
          <div style={{
            textAlign: 'center',
            marginBottom: '2rem'
          }}>
            <h1 style={{
              fontSize: '1.875rem',
              fontWeight: 'bold',
              color: 'white',
              marginBottom: '0.5rem',
              fontFamily: 'Inter, sans-serif'
            }}>
              Account erstellen
            </h1>
            <p style={{
              color: '#9ca3af',
              fontSize: '0.875rem'
            }}>
              Starten Sie Ihre digitale Werkstatt-Reise
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '8px',
              padding: '0.75rem',
              marginBottom: '1.5rem'
            }}>
              <p style={{ 
                color: '#f87171', 
                fontSize: '0.875rem',
                margin: 0,
                textAlign: 'center'
              }}>
                {error}
              </p>
            </div>
          )}

          {/* Register Form */}
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#d1d5db',
                marginBottom: '0.5rem'
              }}>
                E-Mail-Adresse
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  boxSizing: 'border-box'
                }}
                placeholder="ihre@email.de"
                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#d1d5db',
                marginBottom: '0.5rem'
              }}>
                Passwort
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  boxSizing: 'border-box'
                }}
                placeholder="••••••••"
                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#d1d5db',
                marginBottom: '0.5rem'
              }}>
                Firmenname
              </label>
              <input
                type="text"
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  boxSizing: 'border-box'
                }}
                placeholder="Müller KFZ-Werkstatt"
                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#d1d5db',
                marginBottom: '0.5rem'
              }}>
                Ansprechpartner
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  boxSizing: 'border-box'
                }}
                placeholder="Hans Müller"
                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#d1d5db',
                marginBottom: '0.5rem'
              }}>
                Telefonnummer (optional)
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  boxSizing: 'border-box'
                }}
                placeholder="+49 30 12345678"
                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
              />
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#d1d5db',
                marginBottom: '0.5rem'
              }}>
                Werkstatt-Typ
              </label>
              <select
                name="templateType"
                value={formData.templateType}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
              >
                {templateOptions.map(option => (
                  <option 
                    key={option.value} 
                    value={option.value}
                    style={{ background: '#1e293b', color: 'white' }}
                  >
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '0.75rem',
                background: isLoading ? 
                  'linear-gradient(135deg, rgba(234, 88, 12, 0.5) 0%, rgba(147, 51, 234, 0.5) 100%)' : 
                  'linear-gradient(135deg, #ea580c 0%, #9333ea 50%, #2563eb 100%)',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              {isLoading ? (
                <>
                  <div style={{
                    width: '16px',
                    height: '16px',
                    border: '2px solid transparent',
                    borderTop: '2px solid white',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }}></div>
                  Account wird erstellt...
                </>
              ) : (
                'Account erstellen'
              )}
            </button>
          </form>

          {/* Login Link */}
          <div style={{
            textAlign: 'center',
            marginTop: '2rem',
            paddingTop: '2rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <p style={{ 
              color: '#9ca3af', 
              fontSize: '0.875rem',
              margin: 0
            }}>
              Bereits registriert?{' '}
              <Link 
                href="/auth/login" 
                style={{ 
                  color: '#3b82f6',
                  textDecoration: 'none',
                  fontWeight: '500'
                }}
              >
                Hier anmelden
              </Link>
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}