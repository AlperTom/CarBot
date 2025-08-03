'use client'

import { useState } from 'react'
import Link from 'next/link'
import { resetPassword, validateEmail } from '../../../lib/auth'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!validateEmail(email)) {
      setError('Bitte geben Sie eine gültige E-Mail-Adresse ein.')
      setLoading(false)
      return
    }

    try {
      const result = await resetPassword(email)
      
      if (result.success) {
        setSuccess(true)
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
          <div style={{ fontSize: '60px', marginBottom: '20px' }}>📧</div>
          <h1 style={{ 
            color: '#1a202c', 
            margin: '0 0 15px 0', 
            fontSize: '28px',
            fontWeight: 'bold'
          }}>
            E-Mail versendet!
          </h1>
          <p style={{ 
            color: '#666', 
            margin: '0 0 30px 0',
            fontSize: '16px',
            lineHeight: '1.5'
          }}>
            Falls ein Konto mit der E-Mail-Adresse <strong>{email}</strong> existiert, 
            haben wir Ihnen einen Link zum Zurücksetzen des Passworts gesendet.
          </p>
          <p style={{ 
            color: '#666', 
            margin: '0 0 30px 0',
            fontSize: '14px',
            lineHeight: '1.5'
          }}>
            Überprüfen Sie Ihr E-Mail-Postfach und klicken Sie auf den Link, um ein neues Passwort zu erstellen. 
            Der Link ist 60 Minuten gültig.
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
                fontWeight: 'bold'
              }}
            >
              Zur Anmeldung
            </Link>
          </div>

          <div style={{
            fontSize: '12px',
            color: '#6b7280',
            paddingTop: '15px',
            borderTop: '1px solid #e5e7eb'
          }}>
            Keine E-Mail erhalten? Überprüfen Sie Ihren Spam-Ordner oder{' '}
            <button
              onClick={() => {
                setSuccess(false)
                setEmail('')
              }}
              style={{
                background: 'none',
                border: 'none',
                color: '#0070f3',
                textDecoration: 'underline',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              versuchen Sie es erneut
            </button>
          </div>
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
          <div style={{ fontSize: '40px', marginBottom: '10px' }}>🔑</div>
          <h1 style={{ 
            color: '#1a202c', 
            margin: 0, 
            fontSize: '28px',
            fontWeight: 'bold'
          }}>
            Passwort zurücksetzen
          </h1>
          <p style={{ 
            color: '#666', 
            margin: '10px 0 0 0',
            fontSize: '16px',
            lineHeight: '1.5'
          }}>
            Geben Sie Ihre E-Mail-Adresse ein und wir senden Ihnen einen Link zum Zurücksetzen Ihres Passworts.
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
              autoFocus
            />
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
            {loading ? 'E-Mail wird versendet...' : 'Passwort-Reset E-Mail senden'}
          </button>
        </form>

        {/* Information Box */}
        <div style={{
          background: '#f0f8ff',
          border: '1px solid #bfdbfe',
          padding: '15px',
          borderRadius: '6px',
          fontSize: '12px',
          color: '#1e40af',
          marginTop: '20px'
        }}>
          <strong>Sicherheitshinweis:</strong><br />
          Aus Sicherheitsgründen erhalten Sie nur dann eine E-Mail, wenn ein Konto mit dieser 
          E-Mail-Adresse existiert. Der Reset-Link ist 60 Minuten gültig.
        </div>

        {/* Footer Links */}
        <div style={{ 
          textAlign: 'center', 
          marginTop: '30px',
          fontSize: '14px'
        }}>
          <div style={{ marginBottom: '15px' }}>
            <Link 
              href="/auth/login"
              style={{ 
                color: '#0070f3', 
                textDecoration: 'none'
              }}
            >
              ← Zurück zur Anmeldung
            </Link>
          </div>
          
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
          </div>
        </div>
      </div>
    </div>
  )
}