'use client'
import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { signIn, validateEmail, storeWorkshopData, rateLimit, logSecurityEvent, sanitizeInput } from '../../../lib/auth'

function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [rateLimitInfo, setRateLimitInfo] = useState(null)
  const [isBlocked, setIsBlocked] = useState(false)
  const [securityWarning, setSecurityWarning] = useState('')
  
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Check for return URL or messages from search params
    const returnUrl = searchParams.get('returnUrl')
    const message = searchParams.get('message')
    const security = searchParams.get('security')
    
    if (message) {
      setError(decodeURIComponent(message))
    }
    
    if (security === 'session_expired') {
      setSecurityWarning('Ihre Sitzung ist abgelaufen. Bitte melden Sie sich erneut an.')
      logSecurityEvent('session_expired_redirect')
    } else if (security === 'suspicious_activity') {
      setSecurityWarning('Verdächtige Aktivitäten erkannt. Bitte bestätigen Sie Ihre Identität.')
    }
  }, [searchParams])

  // Check rate limiting when email changes
  useEffect(() => {
    if (email && validateEmail(email)) {
      const rateLimitKey = `login:${email}`
      const rateCheck = rateLimit.checkLimit(rateLimitKey, 5, 15 * 60 * 1000)
      
      setRateLimitInfo(rateCheck)
      setIsBlocked(!rateCheck.allowed)
      
      if (!rateCheck.allowed) {
        setError(`Zu viele Anmeldeversuche. Versuchen Sie es in ${rateCheck.retryAfter} Sekunden erneut.`)
      } else if (rateCheck.remainingAttempts < 5) {
        setSecurityWarning(`Noch ${rateCheck.remainingAttempts} Versuche übrig bevor das Konto temporär gesperrt wird.`)
      }
    }
  }, [email])

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSecurityWarning('')

    // Sanitize inputs
    const sanitizedEmail = sanitizeInput(email.toLowerCase().trim())
    const sanitizedPassword = sanitizeInput(password)

    // Validate email format
    if (!validateEmail(sanitizedEmail)) {
      setError('Bitte geben Sie eine gültige E-Mail-Adresse ein.')
      setLoading(false)
      return
    }

    if (!sanitizedPassword) {
      setError('Bitte geben Sie Ihr Passwort ein.')
      setLoading(false)
      return
    }

    // Check if blocked by rate limiting
    if (isBlocked) {
      setError('Zu viele fehlgeschlagene Anmeldeversuche. Bitte warten Sie, bevor Sie es erneut versuchen.')
      setLoading(false)
      return
    }

    try {
      // Log login attempt
      await logSecurityEvent('login_attempt', { 
        email: sanitizedEmail,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString()
      })

      const result = await signIn(sanitizedEmail, sanitizedPassword)

      if (result.success) {
        const { user, workshop, role, session } = result.data
        
        // Store workshop and role data
        storeWorkshopData(workshop, role)
        
        // Clear any previous security warnings
        setSecurityWarning('')
        
        // Get return URL or default to dashboard
        const returnUrl = searchParams.get('returnUrl') || '/dashboard'
        
        // Add welcome flag for first login if no recent sessions
        const welcomeUrl = `${returnUrl}${returnUrl.includes('?') ? '&' : '?'}welcome=true`
        
        // Show success message briefly
        setError('')
        
        router.push(welcomeUrl)
      } else {
        setError(result.error)
        
        // Update rate limit info after failed attempt
        const rateLimitKey = `login:${sanitizedEmail}`
        const rateCheck = rateLimit.checkLimit(rateLimitKey, 5, 15 * 60 * 1000)
        setRateLimitInfo(rateCheck)
        
        if (!rateCheck.allowed) {
          setIsBlocked(true)
        } else if (rateCheck.remainingAttempts <= 2) {
          setSecurityWarning(`Warnung: Noch ${rateCheck.remainingAttempts} Versuche übrig.`)
        }
      }
    } catch (error) {
      console.error('Login error:', error)
      setError('Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es erneut.')
      
      // Log unexpected error
      await logSecurityEvent('login_error', { 
        email: sanitizedEmail,
        error: error.message,
        userAgent: navigator.userAgent
      })
    } finally {
      setLoading(false)
    }
  }

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
        maxWidth: '400px'
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
            margin: '5px 0 0 0',
            fontSize: '16px'
          }}>
            Anmeldung zum Dashboard
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: 'bold',
              color: '#374151'
            }}>
              E-Mail-Adresse
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              autoComplete="email"
              autoFocus
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
              Passwort
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '12px 45px 12px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
                placeholder="Ihr Passwort eingeben"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '16px',
                  color: '#666'
                }}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              fontSize: '14px',
              color: '#374151',
              cursor: 'pointer'
            }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{
                  marginRight: '8px'
                }}
              />
              Angemeldet bleiben
            </label>
            <Link 
              href="/auth/forgot-password"
              style={{ 
                color: '#0070f3', 
                textDecoration: 'none',
                fontSize: '14px'
              }}
            >
              Passwort vergessen?
            </Link>
          </div>

          {securityWarning && (
            <div style={{
              background: '#fef3c7',
              border: '1px solid #fcd34d',
              color: '#d97706',
              padding: '12px',
              borderRadius: '6px',
              fontSize: '14px',
              marginBottom: '15px',
              display: 'flex',
              alignItems: 'center'
            }}>
              <span style={{ marginRight: '8px', fontSize: '16px' }}>⚠️</span>
              {securityWarning}
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
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center'
            }}>
              <span style={{ marginRight: '8px', fontSize: '16px' }}>❌</span>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || isBlocked}
            style={{
              width: '100%',
              padding: '12px',
              background: loading || isBlocked ? '#9ca3af' : '#0070f3',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: loading || isBlocked ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s'
            }}
          >
            {loading ? 'Anmeldung läuft...' : isBlocked ? 'Konto temporär gesperrt' : 'Anmelden'}
          </button>
        </form>

        {/* Footer Links */}
        <div style={{ 
          textAlign: 'center', 
          marginTop: '30px',
          fontSize: '14px'
        }}>
          <div style={{ 
            padding: '20px 0',
            borderTop: '1px solid #e5e7eb',
            color: '#6b7280'
          }}>
            Noch kein Konto?
            <br />
            <Link 
              href="/auth/register"
              style={{ 
                color: '#0070f3', 
                textDecoration: 'none',
                fontWeight: 'bold'
              }}
            >
              Jetzt registrieren
            </Link>
            {' • '}
            <Link 
              href="/pricing"
              style={{ 
                color: '#0070f3', 
                textDecoration: 'none'
              }}
            >
              Preise ansehen
            </Link>
          </div>
        </div>

        {/* Security Notice */}
        <div style={{
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          padding: '15px',
          borderRadius: '6px',
          marginTop: '20px',
          fontSize: '11px',
          color: '#64748b'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ marginRight: '6px', fontSize: '14px' }}>🔒</span>
            <strong>Sicherheitshinweis:</strong>
          </div>
          Ihre Anmeldedaten werden verschlüsselt übertragen. Nach 5 fehlgeschlagenen Versuchen wird Ihr Konto temporär gesperrt.
          {rateLimitInfo && !rateLimitInfo.allowed && (
            <div style={{ marginTop: '8px', color: '#dc2626' }}>
              <strong>Konto gesperrt:</strong> Zu viele fehlgeschlagene Anmeldeversuche. 
              Versuchen Sie es in {rateLimitInfo.retryAfter} Sekunden erneut.
            </div>
          )}
        </div>

        {/* Demo Access */}
        <div style={{
          background: '#f0f8ff',
          border: '1px solid #bfdbfe',
          padding: '15px',
          borderRadius: '6px',
          marginTop: '15px',
          textAlign: 'center',
          fontSize: '12px',
          color: '#1e40af'
        }}>
          <strong>Demo-Zugang:</strong><br />
          E-Mail: demo@werkstatt.de<br />
          Passwort: demo123<br />
          <em>Testen Sie CarBot kostenlos!</em>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0070f3 0%, #0051a5 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          background: 'white',
          padding: '40px',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '40px', marginBottom: '20px' }}>⏳</div>
          <div>Lädt...</div>
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}