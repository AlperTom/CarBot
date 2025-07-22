import Head from 'next/head'

export default function Home() {
  return (
    <>
      <Head>
        <title>CarBot – Dein KI-Werkstattassistent</title>
      </Head>

      <main style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '2rem',
        fontFamily: 'Inter, sans-serif',
        backgroundColor: '#F9FAFB',
        textAlign: 'center',
        color: '#121212'
      }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
          🚗 Willkommen bei <span style={{ color: '#FF4D30' }}>CarBot</span>
        </h1>
        <p style={{ fontSize: '1.2rem', maxWidth: '600px' }}>
          Dein smarter KI-Chatbot für Werkstätten und Automotive-Services. Erweitere deine Website um automatisierte Preisabfragen, Serviceberatung und mehr.
        </p>
        <a
          href="/demo"
          style={{
            marginTop: '2rem',
            backgroundColor: '#FF4D30',
            color: '#fff',
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            fontWeight: 'bold',
            textDecoration: 'none',
            transition: 'background-color 0.3s ease'
          }}
        >
          ➤ Demo starten
        </a>
      </main>
    </>
  )
}
