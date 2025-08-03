'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { updatePassword, validatePassword, logSecurityEvent, sanitizeInput, supabase } from '../../../lib/auth'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [validToken, setValidToken] = useState(true)
  const [session, setSession] = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const checkSession = async () => {
      try {
        // Check if we have access token from URL fragment
        const hash = window.location.hash
        if (hash && hash.includes('access_token')) {
          // Extract tokens from URL fragment
          const hashParams = new URLSearchParams(hash.substring(1))
          const accessToken = hashParams.get('access_token')
          const refreshToken = hashParams.get('refresh_token')
          const type = hashParams.get('type')
          
          if (type === 'recovery' && accessToken) {
            // Set the session with the recovery tokens
            const { data, error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken
            })
            
            if (!error && data.session) {
              setSession(data.session)
              setValidToken(true)
              
              // Log password reset session started
              await logSecurityEvent('password_reset_session_started', {
                userId: data.session.user.id,
                userAgent: navigator.userAgent
              })
              
              // Clear URL fragment for security
              window.history.replaceState({}, document.title, window.location.pathname)
            } else {
              setValidToken(false)
              await logSecurityEvent('password_reset_invalid_token', {
                error: error?.message,
                userAgent: navigator.userAgent
              })
            }
          } else {
            setValidToken(false)
          }
        } else {
          // Check if user already has a recovery session
          const { data: { session }, error } = await supabase.auth.getSession()
          if (session && !error) {
            setSession(session)
            setValidToken(true)
          } else {
            setValidToken(false)
          }
        }
      } catch (error) {
        console.error('Error checking session:', error)
        setValidToken(false)
        await logSecurityEvent('password_reset_session_error', {
          error: error.message,
          userAgent: navigator.userAgent
        })
      }
    }
    
    checkSession()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Sanitize input
    const sanitizedPassword = sanitizeInput(password)

    const passwordValidation = validatePassword(sanitizedPassword)
    if (!passwordValidation.isValid) {
      setError(`Passwort ist nicht stark genug. Benötigt: ${passwordValidation.feedback.join(', ')}`)
      setLoading(false)
      return
    }

    if (sanitizedPassword !== confirmPassword) {
      setError('Passwörter stimmen nicht überein.')
      setLoading(false)
      return
    }

    if (!session) {
      setError('Keine gültige Sitzung. Bitte fordern Sie einen neuen Reset-Link an.')
      setLoading(false)
      return
    }

    try {
      // Log password reset attempt
      await logSecurityEvent('password_reset_attempt', {
        userId: session.user.id,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString()
      })

      const result = await updatePassword(sanitizedPassword)
      
      if (result.success) {
        // Log successful password reset
        await logSecurityEvent('password_reset_successful', {
          userId: session.user.id,
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString()
        })
        
        setSuccess(true)
        
        // Auto-redirect after 3 seconds
        setTimeout(() => {
          router.push('/auth/login?message=Passwort erfolgreich aktualisiert')
        }, 3000)
      } else {
        // Log failed password reset
        await logSecurityEvent('password_reset_failed', {
          userId: session.user.id,
          error: result.error,
          userAgent: navigator.userAgent
        })
        
        setError(result.error)
      }
    } catch (error) {
      console.error('Password reset error:', error)
      
      // Log unexpected error
      await logSecurityEvent('password_reset_error', {
        userId: session?.user?.id,
        error: error.message,
        userAgent: navigator.userAgent
      })
      
      setError('Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es erneut.')
    } finally {
      setLoading(false)
    }
  }

  // Invalid or expired token
  if (!validToken) {
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
          <div style={{ fontSize: '60px', marginBottom: '20px' }}>❌</div>
          <h1 style={{ 
            color: '#1a202c', 
            margin: '0 0 15px 0', 
            fontSize: '28px',
            fontWeight: 'bold'
          }}>
            Ungültiger Link
          </h1>
          <p style={{ 
            color: '#666', 
            margin: '0 0 30px 0',
            fontSize: '16px',
            lineHeight: '1.5'
          }}>
            Der Passwort-Reset-Link ist ungültig oder abgelaufen. 
            Links sind nur 60 Minuten gültig.
          </p>
          
          <div style={{ marginBottom: '20px' }}>
            <Link 
              href="/auth/forgot-password"
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
              Neuen Link anfordern
            </Link>
          </div>

          <Link 
            href="/auth/login"
            style={{ 
              color: '#0070f3', 
              textDecoration: 'none',
              fontSize: '14px'
            }}
          >
            Zur Anmeldung
          </Link>
        </div>
      </div>
    )
  }

  // Success state
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
            Passwort erfolgreich geändert!
          </h1>
          <p style={{ 
            color: '#666', 
            margin: '0 0 20px 0',
            fontSize: '16px',
            lineHeight: '1.5'
          }}>
            Ihr Passwort wurde erfolgreich aktualisiert. Sie können sich jetzt mit Ihrem neuen Passwort anmelden.
          </p>
          
          <div style={{
            background: '#f0f9ff',
            border: '1px solid #bae6fd',
            padding: '15px',
            borderRadius: '6px',
            marginBottom: '20px',
            fontSize: '14px',
            color: '#0369a1'
          }}>
            <div style={{ marginBottom: '8px' }}>
              <strong>Sicherheitshinweis:</strong>
            </div>
            Alle anderen Sitzungen wurden automatisch beendet. Sie werden in wenigen Sekunden zur Anmeldeseite weitergeleitet.
          </div>
          
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
            Jetzt anmelden
          </Link>
        </div>
      </div>
    )
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
        maxWidth: '450px'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ fontSize: '40px', marginBottom: '10px' }}>🔒</div>
          <h1 style={{ 
            color: '#1a202c', 
            margin: 0, 
            fontSize: '28px',
            fontWeight: 'bold'
          }}>
            Neues Passwort erstellen
          </h1>
          <p style={{ 
            color: '#666', 
            margin: '10px 0 0 0',
            fontSize: '16px'
          }}>
            Wählen Sie ein sicheres Passwort für Ihr Konto.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: 'bold',
              color: '#374151'
            }}>
              Neues Passwort
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
                placeholder="Mindestens 8 Zeichen"
                autoFocus
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
            
            {/* Password strength indicator */}
            {password && (
              <div style={{ marginTop: '8px' }}>
                {(() => {
                  const validation = validatePassword(password)
                  return (
                    <div style={{ fontSize: '12px' }}>
                      <div style={{ 
                        color: validation.hasLength ? '#22c55e' : '#ef4444',
                        marginBottom: '2px'
                      }}>
                        {validation.hasLength ? '✓' : '✗'} Mindestens 8 Zeichen
                      </div>
                      <div style={{ 
                        color: validation.hasNumbers ? '#22c55e' : '#ef4444',
                        marginBottom: '2px'
                      }}>
                        {validation.hasNumbers ? '✓' : '✗'} Mindestens eine Zahl
                      </div>
                      <div style={{ 
                        color: validation.hasUpperCase && validation.hasLowerCase ? '#22c55e' : '#ef4444'
                      }}>
                        {validation.hasUpperCase && validation.hasLowerCase ? '✓' : '✗'} Groß- und Kleinbuchstaben
                      </div>
                    </div>
                  )
                })()}
              </div>
            )}
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: 'bold',
              color: '#374151'
            }}>
              Passwort bestätigen
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '12px 45px 12px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
                placeholder="Passwort wiederholen"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
                {showConfirmPassword ? '🙈' : '👁️'}
              </button>
            </div>
            
            {/* Password match indicator */}
            {confirmPassword && (
              <div style={{ 
                marginTop: '8px',
                fontSize: '12px',
                color: password === confirmPassword ? '#22c55e' : '#ef4444'
              }}>
                {password === confirmPassword ? '✓ Passwörter stimmen überein' : '✗ Passwörter stimmen nicht überein'}
              </div>
            )}
          </div>

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

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              background: loading ? '#9ca3af' : '#0070f3',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s'
            }}
          >
            {loading ? 'Passwort wird aktualisiert...' : 'Passwort aktualisieren'}
          </button>
        </form>

        {/* Security Notice */}
        <div style={{
          background: '#f0f8ff',
          border: '1px solid #bfdbfe',
          padding: '15px',
          borderRadius: '6px',
          fontSize: '12px',
          color: '#1e40af',
          marginTop: '20px'
        }}>
          <strong>Sicherheitstipp:</strong><br />
          Verwenden Sie ein einzigartiges Passwort, das Sie nirgendwo anders nutzen. 
          Kombinieren Sie Buchstaben, Zahlen und Sonderzeichen für maximale Sicherheit.
        </div>

        {/* Footer */}
        <div style={{ 
          textAlign: 'center', 
          marginTop: '20px',
          fontSize: '14px',
          color: '#6b7280'
        }}>
          <Link 
            href="/auth/login"
            style={{ 
              color: '#0070f3', 
              textDecoration: 'none'
            }}
          >
            Zurück zur Anmeldung
          </Link>
        </div>
      </div>
    </div>
  )
}