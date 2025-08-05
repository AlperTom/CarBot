'use client'
import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { signIn, validateEmail, storeWorkshopData, rateLimit, logSecurityEvent, sanitizeInput } from '../../../lib/auth'
import SharedLayout, { GlassCard, PrimaryButton, SecondaryButton } from '@/components/SharedLayout'

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
        setError('')
      }
    }
  }, [email])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (isBlocked) {
      setError('Account temporär gesperrt. Versuchen Sie es später erneut.')
      return
    }

    if (!validateEmail(email)) {
      setError('Bitte geben Sie eine gültige E-Mail-Adresse ein.')
      return
    }

    if (!password || password.length < 6) {
      setError('Passwort muss mindestens 6 Zeichen lang sein.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const sanitizedEmail = sanitizeInput(email)
      const result = await signIn(sanitizedEmail, password, rememberMe)
      
      if (result.success) {
        // Store workshop data if provided
        if (result.workshop) {
          storeWorkshopData(result.workshop, result.token)
        }

        // Redirect to return URL or dashboard
        const returnUrl = searchParams.get('returnUrl') || '/dashboard'
        router.push(returnUrl)
      } else {
        // Handle rate limiting
        const rateLimitKey = `login:${sanitizedEmail}`
        rateLimit.incrementAttempt(rateLimitKey)
        
        setError(result.error || 'Anmeldung fehlgeschlagen')
        
        // Log security event for failed login
        logSecurityEvent('login_failed', { email: sanitizedEmail })
      }
    } catch (err) {
      console.error('Login error:', err)
      setError('Ein unerwarteter Fehler ist aufgetreten. Versuchen Sie es erneut.')
      
      // Log security event for login error
      logSecurityEvent('login_error', { error: err.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      maxWidth: '400px',
      margin: '0 auto',
      padding: '2rem 1.5rem'
    }}>
      <div style={{
        textAlign: 'center',
        marginBottom: '2rem'
      }}>
        <h1 style={{
          fontSize: '2rem',
          fontWeight: 'bold',
          color: 'white',
          marginBottom: '0.5rem'
        }}>
          Willkommen zurück
        </h1>
        <p style={{
          color: '#d1d5db'
        }}>
          Melden Sie sich in Ihrem CarBot-Konto an
        </p>
      </div>

      {/* Security Warning */}
      {securityWarning && (
        <div style={{
          background: 'rgba(245, 158, 11, 0.1)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          borderRadius: '8px',
          padding: '1rem',
          marginBottom: '1.5rem',
          color: '#fbbf24'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
            <span style={{ fontWeight: '600' }}>Sicherheitshinweis</span>
          </div>
          <p style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>
            {securityWarning}
          </p>
        </div>
      )}

      <GlassCard>
        <form onSubmit={handleSubmit}>
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

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              color: 'white',
              fontWeight: '600',
              marginBottom: '0.5rem'
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
                padding: '0.75rem',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: 'white',
                fontSize: '1rem',
                boxSizing: 'border-box'
              }}
              placeholder="ihre@email.de"
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              color: 'white',
              fontWeight: '600',
              marginBottom: '0.5rem'
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
                  padding: '0.75rem',
                  paddingRight: '3rem',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  fontSize: '1rem',
                  boxSizing: 'border-box'
                }}
                placeholder="Ihr Passwort"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#9ca3af',
                  cursor: 'pointer'
                }}
              >
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {showPassword ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem'
          }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: '#d1d5db',
              cursor: 'pointer'
            }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{
                  width: '16px',
                  height: '16px'
                }}
              />
              Angemeldet bleiben
            </label>
            <Link href="/auth/forgot-password" style={{
              color: '#fb923c',
              textDecoration: 'none',
              fontSize: '0.875rem'
            }}>
              Passwort vergessen?
            </Link>
          </div>

          <PrimaryButton
            onClick={handleSubmit}
            style={{
              width: '100%',
              opacity: loading || isBlocked ? 0.5 : 1,
              cursor: loading || isBlocked ? 'not-allowed' : 'pointer'
            }}
            disabled={loading || isBlocked}
          >
            {loading ? 'Wird angemeldet...' : 'Anmelden'}
          </PrimaryButton>
        </form>

        <div style={{
          textAlign: 'center',
          marginTop: '1.5rem',
          paddingTop: '1.5rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <p style={{ color: '#d1d5db' }}>
            Noch kein Konto?{' '}
            <Link href="/auth/register" style={{
              color: '#fb923c',
              textDecoration: 'none',
              fontWeight: '600'
            }}>
              Jetzt registrieren
            </Link>
          </p>
        </div>
      </GlassCard>

      {/* Rate Limit Info */}
      {rateLimitInfo && rateLimitInfo.remainingAttempts < 5 && rateLimitInfo.remainingAttempts > 0 && (
        <div style={{
          background: 'rgba(245, 158, 11, 0.1)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          borderRadius: '8px',
          padding: '1rem',
          marginTop: '1rem',
          color: '#fbbf24',
          textAlign: 'center',
          fontSize: '0.875rem'
        }}>
          Warnung: Noch {rateLimitInfo.remainingAttempts} Anmeldeversuche übrig
        </div>
      )}
    </div>
  )
}

export default function LoginPage() {
  return (
    <SharedLayout title="Anmelden" showNavigation={true}>
      <Suspense fallback={
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div style={{ color: 'white' }}>Lädt...</div>
        </div>
      }>
        <LoginForm />
      </Suspense>
    </SharedLayout>
  )
}