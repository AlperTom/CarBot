'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { supabase, logSecurityEvent } from '../../../lib/auth'

export default function VerifyEmailPage() {
  const [status, setStatus] = useState('verifying') // 'verifying', 'success', 'error', 'expired'
  const [error, setError] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        // Get the token from URL hash or search params
        const hash = window.location.hash
        const token = searchParams.get('token')
        
        if (hash.includes('access_token')) {
          // User clicked verification link - auto-verify
          const params = new URLSearchParams(hash.substring(1))
          const accessToken = params.get('access_token')
          const refreshToken = params.get('refresh_token')
          const type = params.get('type')
          
          if (accessToken && refreshToken && type === 'signup') {
            // Set the session
            const { data, error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken
            })
            
            if (error) {
              setStatus('error')
              setError('Fehler beim Verifizieren der E-Mail.')
              
              // Log verification failure
              await logSecurityEvent('email_verification_failed', {
                error: error.message,
                userAgent: navigator.userAgent,
                timestamp: new Date().toISOString()
              })
            } else {
              setStatus('success')
              
              // Log successful verification
              await logSecurityEvent('email_verification_successful', {
                userId: data.session.user.id,
                email: data.session.user.email,
                userAgent: navigator.userAgent,
                timestamp: new Date().toISOString()
              })
              
              // Clear URL fragment for security
              window.history.replaceState({}, document.title, window.location.pathname)
              
              // Redirect to dashboard after 3 seconds
              setTimeout(() => {
                router.push('/dashboard?welcome=true&verified=true')
              }, 3000)
            }
          } else {
            setStatus('error')
            setError('Ungültiger Verifizierungslink.')
            
            // Log invalid verification attempt
            await logSecurityEvent('email_verification_invalid_link', {
              hasAccessToken: !!accessToken,
              hasRefreshToken: !!refreshToken,
              type: type,
              userAgent: navigator.userAgent
            })
          }
        } else if (token) {
          // Handle token-based verification if needed
          setStatus('error')
          setError('Ungültiger Verifizierungslink.')
        } else {
          setStatus('error')
          setError('Kein Verifizierungstoken gefunden.')
        }
      } catch (error) {
        console.error('Email verification error:', error)
        setStatus('error')
        setError('Ein unerwarteter Fehler ist aufgetreten.')
      }
    }

    verifyEmail()
  }, [router, searchParams])

  if (status === 'verifying') {
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
          <div style={{ 
            fontSize: '60px', 
            marginBottom: '20px',
            animation: 'spin 2s linear infinite'
          }}>⏳</div>
          <h1 style={{ 
            color: '#1a202c', 
            margin: '0 0 15px 0', 
            fontSize: '28px',
            fontWeight: 'bold'
          }}>
            E-Mail wird verifiziert...
          </h1>
          <p style={{ 
            color: '#666', 
            margin: '0',
            fontSize: '16px'
          }}>
            Bitte warten Sie, während wir Ihre E-Mail-Adresse bestätigen.
          </p>
          <style jsx>{`
            @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    )
  }

  if (status === 'success') {
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
            E-Mail erfolgreich bestätigt!
          </h1>
          <p style={{ 
            color: '#666', 
            margin: '0 0 30px 0',
            fontSize: '16px',
            lineHeight: '1.5'
          }}>
            Ihr Konto wurde erfolgreich aktiviert. Sie werden automatisch 
            zu Ihrem Dashboard weitergeleitet.
          </p>
          
          <div style={{
            background: '#f0f8ff',
            border: '1px solid #bfdbfe',
            padding: '15px',
            borderRadius: '6px',
            fontSize: '14px',
            color: '#1e40af',
            marginBottom: '20px'
          }}>
            Weiterleitung in 3 Sekunden...
          </div>

          <Link 
            href="/dashboard"
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
            Jetzt zum Dashboard
          </Link>
        </div>
      </div>
    )
  }

  // Error state
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
          Verifizierung fehlgeschlagen
        </h1>
        <p style={{ 
          color: '#666', 
          margin: '0 0 30px 0',
          fontSize: '16px',
          lineHeight: '1.5'
        }}>
          {error || 'Der Verifizierungslink ist ungültig oder abgelaufen.'}
        </p>
        
        <div style={{ marginBottom: '20px' }}>
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
              fontWeight: 'bold',
              marginRight: '10px'
            }}
          >
            Zur Anmeldung
          </Link>
          
          <Link 
            href="/auth/register"
            style={{
              display: 'inline-block',
              padding: '12px 24px',
              background: 'white',
              color: '#0070f3',
              border: '1px solid #0070f3',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: 'bold',
              textDecoration: 'none'
            }}
          >
            Neu registrieren
          </Link>
        </div>

        <div style={{
          fontSize: '12px',
          color: '#6b7280',
          paddingTop: '15px',
          borderTop: '1px solid #e5e7eb'
        }}>
          Benötigen Sie Hilfe?{' '}
          <a 
            href="mailto:support@carbot.de"
            style={{ 
              color: '#0070f3', 
              textDecoration: 'none' 
            }}
          >
            Kontaktieren Sie unseren Support
          </a>
        </div>
      </div>
    </div>
  )
}