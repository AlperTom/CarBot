export default function Impressum() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px', lineHeight: '1.6' }}>
      <h1 style={{ marginBottom: '30px', color: '#0070f3' }}>Impressum</h1>
      
      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ color: '#0070f3', marginBottom: '20px' }}>Angaben gemäß § 5 TMG</h2>
        
        <div style={{ padding: '20px', background: '#f8f9fa', borderRadius: '8px', marginBottom: '20px' }}>
          <p><strong>CarBot GmbH</strong></p>
          <p>
            Musterstraße 123<br />
            12345 Musterstadt<br />
            Deutschland
          </p>
        </div>

        <h3 style={{ marginBottom: '15px' }}>Vertreten durch:</h3>
        <p>
          Geschäftsführer: Max Mustermann<br />
          Registergericht: Amtsgericht Musterstadt<br />
          Registernummer: HRB 123456<br />
          Umsatzsteuer-Identifikationsnummer: DE123456789
        </p>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ color: '#0070f3', marginBottom: '20px' }}>Kontakt</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
          <div style={{ padding: '15px', background: '#e3f2fd', borderRadius: '8px' }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#0070f3' }}>Allgemeine Anfragen</h4>
            <p style={{ margin: 0 }}>
              <strong>E-Mail:</strong> <a href="mailto:info@carbot.de" style={{ color: '#0070f3' }}>info@carbot.de</a><br />
              <strong>Telefon:</strong> +49 (0) 123 456789<br />
              <strong>Fax:</strong> +49 (0) 123 456788
            </p>
          </div>
          
          <div style={{ padding: '15px', background: '#f3e5f5', borderRadius: '8px' }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#7b1fa2' }}>Datenschutz</h4>
            <p style={{ margin: 0 }}>
              <strong>E-Mail:</strong> <a href="mailto:datenschutz@carbot.de" style={{ color: '#7b1fa2' }}>datenschutz@carbot.de</a><br />
              <strong>Datenschutzbeauftragter:</strong> Dr. Maria Schmidt
            </p>
          </div>
          
          <div style={{ padding: '15px', background: '#e8f5e8', borderRadius: '8px' }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#2e7d32' }}>Support</h4>
            <p style={{ margin: 0 }}>
              <strong>E-Mail:</strong> <a href="mailto:support@carbot.de" style={{ color: '#2e7d32' }}>support@carbot.de</a><br />
              <strong>Support-Hotline:</strong> +49 (0) 123 456790<br />
              <strong>Zeiten:</strong> Mo-Fr, 8-18 Uhr
            </p>
          </div>
        </div>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ color: '#0070f3', marginBottom: '20px' }}>Berufsbezeichnung und berufsrechtliche Regelungen</h2>
        
        <p>
          <strong>Berufsbezeichnung:</strong> Softwareentwicklung und AI-Services<br />
          <strong>Zuständige Kammer:</strong> IHK Musterstadt<br />
          <strong>Verliehen durch:</strong> Deutschland
        </p>
        
        <h3 style={{ marginBottom: '15px' }}>Es gelten folgende berufsrechtliche Regelungen:</h3>
        <ul style={{ paddingLeft: '30px' }}>
          <li>Gewerbeordnung (GewO)</li>
          <li>Bundesdatenschutzgesetz (BDSG)</li>
          <li>Datenschutz-Grundverordnung (DSGVO)</li>
          <li>Telemediengesetz (TMG)</li>
        </ul>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ color: '#0070f3', marginBottom: '20px' }}>EU-Streitschlichtung</h2>
        
        <p>
          Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: 
          <a href="https://ec.europa.eu/consumers/odr/" target="_blank" style={{ color: '#0070f3', marginLeft: '5px' }}>
            https://ec.europa.eu/consumers/odr/
          </a>
        </p>
        <p>Unsere E-Mail-Adresse finden Sie oben im Impressum.</p>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ color: '#0070f3', marginBottom: '20px' }}>Verbraucherstreitbeilegung/Universalschlichtungsstelle</h2>
        
        <p>
          Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer 
          Verbraucherschlichtungsstelle teilzunehmen.
        </p>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ color: '#0070f3', marginBottom: '20px' }}>Haftung für Inhalte</h2>
        
        <p>
          Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den 
          allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht 
          unter der Verpflichtung, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach 
          Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
        </p>
        
        <p>
          Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen 
          Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt 
          der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden 
          Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.
        </p>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ color: '#0070f3', marginBottom: '20px' }}>Haftung für Links</h2>
        
        <p>
          Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. 
          Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der 
          verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.
        </p>
        
        <p>
          Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft. 
          Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar. Eine permanente 
          inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer 
          Rechtsverletzung nicht zumutbar.
        </p>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ color: '#0070f3', marginBottom: '20px' }}>Urheberrecht</h2>
        
        <p>
          Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem 
          deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung 
          außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen 
          Autors bzw. Erstellers.
        </p>
        
        <p>
          Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet. 
          Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die Urheberrechte 
          Dritter beachtet. Insbesondere werden Inhalte Dritter als solche gekennzeichnet.
        </p>
      </section>

      <div style={{ marginTop: '40px', padding: '20px', background: '#fff3e0', borderRadius: '8px', border: '1px solid #ff9800' }}>
        <h3 style={{ color: '#f57c00', marginBottom: '15px' }}>Wichtiger Hinweis</h3>
        <p style={{ margin: 0 }}>
          Dieses Impressum ist ein Muster und muss an die spezifischen Gegebenheiten Ihres Unternehmens 
          angepasst werden. Konsultieren Sie einen Rechtsanwalt für eine rechtssichere Gestaltung.
        </p>
      </div>
    </div>
  )
}
