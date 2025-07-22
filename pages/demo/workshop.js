import Head from 'next/head'
import Script from 'next/script'

export default function Workshop() {
  return (
    <>
      <Head>
        <title>MusterWerkstatt – Willkommen</title>
      </Head>
      <main style={{
        fontFamily: 'Inter, sans-serif',
        backgroundColor: '#fff',
        color: '#121212',
        minHeight: '100vh',
        padding: '4rem 2rem',
        textAlign: 'center'
      }}>
        <h1 style={{ fontSize: '2.5rem' }}>🚘 MusterWerkstatt</h1>
        <p style={{ fontSize: '1.2rem', maxWidth: '600px', margin: '1rem auto' }}>
          Willkommen bei der digitalen Werkstatt-Erfahrung powered by CarBot.
        </p>
        <p style={{ fontSize: '1rem', color: '#555' }}>
          Hier kannst du unseren KI-Serviceberater live testen.
        </p>
      </main>

      <Script id="carbot-widget" strategy="lazyOnload">
        {`
          (function() {
            const bot = document.createElement('div');
            bot.id = 'carbot-container';
            bot.style = 'position:fixed;bottom:24px;right:24px;width:320px;height:400px;background:#fff;border:1px solid #ccc;border-radius:12px;box-shadow:0 4px 12px rgba(0,0,0,0.1);z-index:10000;overflow:hidden;';
            const iframe = document.createElement('iframe');
            iframe.src = '/demo';
            iframe.style = 'width:100%;height:100%;border:none;';
            bot.appendChild(iframe);
            document.body.appendChild(bot);
          })();
        `}
      </Script>
    </>
  );
}
