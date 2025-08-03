export const metadata = {
  title: 'Impressum - CarBot',
  description: 'Impressum und rechtliche Informationen zu CarBot'
}

export default function Impressum() {
  return (
    <div style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: '40px 20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      lineHeight: 1.6,
      color: '#1a202c'
    }}>
      <h1 style={{ marginBottom: '30px', color: '#0070f3' }}>Impressum</h1>

      <section style={{ marginBottom: '30px' }}>
        <h2>Angaben gemäß § 5 TMG</h2>
        <p>
          <strong>CarBot Services GmbH</strong><br/>
          Musterstraße 123<br/>
          12345 Musterstadt<br/>
          Deutschland
        </p>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2>Vertreten durch</h2>
        <p>
          Geschäftsführer: Max Mustermann, Maria Musterfrau
        </p>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2>Kontakt</h2>
        <p>
          <strong>Telefon:</strong> +49 123 456789<br/>
          <strong>E-Mail:</strong> info@carbot.chat<br/>
          <strong>Website:</strong> https://carbot.chat
        </p>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2>Registereintrag</h2>
        <p>
          Eintragung im Handelsregister<br/>
          <strong>Registergericht:</strong> Amtsgericht Musterstadt<br/>
          <strong>Registernummer:</strong> HRB 12345
        </p>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2>Umsatzsteuer-ID</h2>
        <p>
          Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:<br/>
          <strong>DE123456789</strong>
        </p>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2>Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
        <p>
          Max Mustermann<br/>
          Musterstraße 123<br/>
          12345 Musterstadt
        </p>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2>EU-Streitschlichtung</h2>
        <p>
          Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: 
          <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer" style={{ color: '#0070f3' }}>
            https://ec.europa.eu/consumers/odr/
          </a>
        </p>
        <p>Unsere E-Mail-Adresse finden Sie oben im Impressum.</p>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2>Verbraucher­streit­beilegung/Universal­schlichtungs­stelle</h2>
        <p>
          Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer 
          Verbraucherschlichtungsstelle teilzunehmen.
        </p>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2>Haftungsausschluss</h2>
        
        <h3>Haftung für Inhalte</h3>
        <p>
          Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten 
          nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als 
          Diensteanbieter jedoch nicht unter der Verpflichtung, übermittelte oder gespeicherte 
          fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine 
          rechtswidrige Tätigkeit hinweisen.
        </p>

        <h3>Haftung für Links</h3>
        <p>
          Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen 
          Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. 
          Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber 
          der Seiten verantwortlich.
        </p>

        <h3>Urheberrecht</h3>
        <p>
          Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen 
          dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art 
          der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen 
          Zustimmung des jeweiligen Autors bzw. Erstellers.
        </p>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2>Verwendung von KI-Technologie</h2>
        <p>
          Unser Service nutzt Künstliche Intelligenz (KI) zur Bereitstellung von Beratungsleistungen 
          im Automobilbereich. Die KI-generierten Antworten dienen ausschließlich als erste 
          Orientierung und ersetzen nicht die professionelle Beratung durch qualifizierte 
          KFZ-Fachkräfte.
        </p>
        
        <h3>Haftungsausschluss für KI-Inhalte</h3>
        <p>
          Trotz sorgfältiger Programmierung und ständiger Verbesserung können wir keine Gewähr 
          für die Vollständigkeit, Richtigkeit oder Aktualität der von der KI bereitgestellten 
          Informationen übernehmen. Bei konkreten technischen Problemen oder Reparaturen empfehlen 
          wir grundsätzlich die Konsultation einer qualifizierten Fachwerkstatt.
        </p>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2>Technische Hinweise</h2>
        <p>
          Dieses Angebot nutzt folgende Technologien und Dienstleister:
        </p>
        <ul>
          <li><strong>Hosting:</strong> Vercel Inc., USA</li>
          <li><strong>Datenbank:</strong> Supabase Inc., EU-Hosting</li>
          <li><strong>KI-Service:</strong> OpenAI, USA</li>
          <li><strong>Analytics:</strong> Anonymisierte Nutzungsstatistiken</li>
        </ul>
        <p>
          Weitere Informationen zur Datenverarbeitung finden Sie in unserer 
          <a href="/legal/datenschutz" style={{ color: '#0070f3' }}> Datenschutzerklärung</a>.
        </p>
      </section>

      <div style={{ 
        textAlign: 'center', 
        padding: '20px', 
        background: '#f8fafc', 
        borderRadius: '8px',
        border: '1px solid #e2e8f0'
      }}>
        <a 
          href="/"
          style={{
            display: 'inline-block',
            background: '#0070f3',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '6px',
            textDecoration: 'none',
            fontWeight: 'bold',
            marginRight: '10px'
          }}
        >
          Zurück zum Chat
        </a>
        <a 
          href="/legal/datenschutz"
          style={{
            display: 'inline-block',
            background: 'transparent',
            color: '#0070f3',
            padding: '12px 24px',
            borderRadius: '6px',
            textDecoration: 'none',
            border: '1px solid #0070f3'
          }}
        >
          Datenschutzerklärung
        </a>
      </div>
    </div>
  )
}