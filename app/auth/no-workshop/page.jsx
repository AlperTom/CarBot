'use client'

import Link from 'next/link'
import { signOut } from '../../../lib/auth'

export default function NoWorkshopPage() {
  const handleSignOut = async () => {
    await signOut()
    window.location.href = '/'
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
        maxWidth: '500px',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '60px', marginBottom: '20px' }}>🏭</div>
        <h1 style={{ 
          color: '#1a202c', 
          margin: '0 0 15px 0', 
          fontSize: '28px',
          fontWeight: 'bold'
        }}>
          Keine Werkstatt gefunden
        </h1>
        <p style={{ 
          color: '#666', 
          margin: '0 0 30px 0',
          fontSize: '16px',
          lineHeight: '1.5'
        }}>
          Ihr Konto ist nicht mit einer Werkstatt verknüpft. 
          Bitte vervollständigen Sie Ihre Registrierung oder wenden Sie sich an den Support.
        </p>
        
        <div style={{ marginBottom: '20px' }}>
          <Link 
            href="/auth/register"
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
            Werkstatt registrieren
          </Link>
          
          <button
            onClick={handleSignOut}
            style={{
              padding: '12px 24px',
              background: 'white',
              color: '#0070f3',
              border: '1px solid #0070f3',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Abmelden
          </button>
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