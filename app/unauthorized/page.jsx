'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function UnauthorizedPage() {
  const router = useRouter()

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
        <div style={{ fontSize: '60px', marginBottom: '20px' }}>🚫</div>
        <h1 style={{ 
          color: '#1a202c', 
          margin: '0 0 15px 0', 
          fontSize: '28px',
          fontWeight: 'bold'
        }}>
          Zugriff verweigert
        </h1>
        <p style={{ 
          color: '#666', 
          margin: '0 0 30px 0',
          fontSize: '16px',
          lineHeight: '1.5'
        }}>
          Sie haben nicht die erforderlichen Berechtigungen, um auf diese Seite zuzugreifen. 
          Wenden Sie sich an Ihren Administrator, falls Sie glauben, dass dies ein Fehler ist.
        </p>
        
        <div style={{ marginBottom: '20px' }}>
          <button
            onClick={() => router.back()}
            style={{
              padding: '12px 24px',
              background: '#0070f3',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              marginRight: '10px'
            }}
          >
            Zurück
          </button>
          
          <Link 
            href="/dashboard"
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
            Zum Dashboard
          </Link>
        </div>

        <div style={{
          fontSize: '12px',
          color: '#6b7280',
          paddingTop: '15px',
          borderTop: '1px solid #e5e7eb'
        }}>
          Benötigen Sie erweiterte Berechtigungen?{' '}
          <a 
            href="mailto:admin@carbot.de"
            style={{ 
              color: '#0070f3', 
              textDecoration: 'none' 
            }}
          >
            Administrator kontaktieren
          </a>
        </div>
      </div>
    </div>
  )
}