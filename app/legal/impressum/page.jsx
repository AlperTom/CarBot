import SharedLayout, { GlassCard } from '@/components/SharedLayout';

export const metadata = {
  title: 'Impressum - CarBot',
  description: 'Impressum und rechtliche Informationen zu CarBot'
}

export default function Impressum() {
  return (
    <SharedLayout title="Impressum">
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '2rem 1.5rem'
      }}>
        <GlassCard>
          <div style={{
            color: 'white',
            lineHeight: '1.6'
          }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              marginBottom: '1.5rem',
              color: 'white'
            }}>
              Impressum
            </h2>
            
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              marginBottom: '1rem',
              color: 'white'
            }}>
              Angaben gemäß § 5 TMG
            </h3>
            <p style={{ marginBottom: '1.5rem', color: '#d1d5db' }}>
              CarBot GmbH<br />
              Musterstraße 123<br />
              12345 Berlin<br />
              Deutschland
            </p>

            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              marginBottom: '1rem',
              marginTop: '2rem',
              color: 'white'
            }}>
              Kontakt
            </h3>
            <p style={{ marginBottom: '1.5rem', color: '#d1d5db' }}>
              Telefon: +49 (0) 30 123 456 789<br />
              E-Mail: info@carbot.chat<br />
              Website: https://carbot.chat
            </p>

            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              marginBottom: '1rem',
              marginTop: '2rem',
              color: 'white'
            }}>
              Vertretungsberechtigte Geschäftsführer
            </h3>
            <p style={{ marginBottom: '1.5rem', color: '#d1d5db' }}>
              Max Mustermann<br />
              Dr. Maria Musterfrau
            </p>

            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              marginBottom: '1rem',
              marginTop: '2rem',
              color: 'white'
            }}>
              Registereintrag
            </h3>
            <p style={{ marginBottom: '1.5rem', color: '#d1d5db' }}>
              Eintragung im Handelsregister<br />
              Registergericht: Amtsgericht Berlin-Charlottenburg<br />
              Registernummer: HRB 123456 B
            </p>

            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              marginBottom: '1rem',
              marginTop: '2rem',
              color: 'white'
            }}>
              Umsatzsteuer-ID
            </h3>
            <p style={{ marginBottom: '1.5rem', color: '#d1d5db' }}>
              Umsatzsteuer-Identifikationsnummer gemäß §27 a Umsatzsteuergesetz:<br />
              DE123456789
            </p>

            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              marginBottom: '1rem',
              marginTop: '2rem',
              color: 'white'
            }}>
              Streitschlichtung
            </h3>
            <p style={{ marginBottom: '1.5rem', color: '#d1d5db' }}>
              Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
            </p>

            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              marginBottom: '1rem',
              marginTop: '2rem',
              color: 'white'
            }}>
              Haftung für Inhalte
            </h3>
            <p style={{ marginBottom: '1.5rem', color: '#d1d5db' }}>
              Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht unter der Verpflichtung, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
            </p>

            <p style={{ 
              marginTop: '2rem', 
              fontSize: '0.875rem', 
              color: '#9ca3af',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              paddingTop: '1rem'
            }}>
              Stand: Januar 2025
            </p>
          </div>
        </GlassCard>
      </div>
    </SharedLayout>
  );
}