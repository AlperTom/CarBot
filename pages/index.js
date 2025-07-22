import Head from 'next/head'
import Link from 'next/link'

export default function Home() {
  return (
    <>
      <Head>
        <title>CarBot – KI für Werkstätten</title>
      </Head>

      <header style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '64px',
        backgroundColor: '#ffffffcc',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 2rem',
        borderBottom: '1px solid #eee',
        zIndex: 1000
      }}>
        <h2 style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>CarBot</h2>
        <nav>
          <Link href="/" legacyBehavior><a style={navStyle}>Home</a></Link>
          <Link href="/pricing" legacyBehavior><a style={navStyle}>Preise</a></Link>
          <Link href="/cases" legacyBehavior><a style={navStyle}>Fallbeispiele</a></Link>
          <Link href="/demo" legacyBehavior><a style={{ ...navStyle, backgroundColor: '#FF4D30', color: '#fff', borderRadius: '6px', padding: '0.5rem 1rem' }}>Demo</a></Link>
        </nav>
      </header>

      <main style={{
        fontFamily: 'Inter, sans-serif',
        backgroundColor: '#F9FAFB',
        color: '#121212',
        minHeight: '100vh',
        padding: '8rem 2rem 2rem',
        textAlign: 'center'
      }}>
        <h1 style={{ fontSize: '3rem' }}>🚗 CarBot</h1>
        <p style={{ fontSize: '1.25rem', maxWidth: '600px', margin: '1rem auto' }}>
          KI-Agenten für Werkstätten & Automotive-Dienstleister. Automatisiert. Präzise. Umsatzsteigernd.
        </p>
        <div style={{ marginTop: '2rem' }}>
          <Link href="/demo" legacyBehavior><a style={linkStyle}>➤ Demo starten</a></Link>
        </div>
      </main>
    </>
  );
}

const navStyle = {
  marginLeft: '1rem',
  textDecoration: 'none',
  color: '#121212',
  fontWeight: '500',
};

const linkStyle = {
  display: 'inline-block',
  margin: '0.5rem 1rem',
  backgroundColor: '#FF4D30',
  color: '#fff',
  padding: '0.75rem 1.5rem',
  borderRadius: '8px',
  fontWeight: 'bold',
  textDecoration: 'none'
};
