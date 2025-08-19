import ModernNavigation from '@/components/ModernNavigation';
import { GlassCard } from '@/components/SharedLayout';

export const metadata = {
  title: 'Datenschutzerklärung - CarBot',
  description: 'Datenschutzerklärung für CarBot - KI-gestützter Serviceberater für KFZ-Werkstätten'
}

export default function Datenschutz() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #111827 50%, #1e293b 100%)',
      color: 'white'
    }}>
      {/* Modern Navigation */}
      <ModernNavigation variant="legal" />
      
      <main id="main-content" style={{
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
              Datenschutzerklärung
            </h2>
            
            <p style={{ marginBottom: '1.5rem', color: '#d1d5db' }}>
              Die CarBot GmbH nimmt den Schutz Ihrer persönlichen Daten sehr ernst. Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend der gesetzlichen Datenschutzvorschriften sowie dieser Datenschutzerklärung.
            </p>

            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              marginBottom: '1rem',
              marginTop: '2rem',
              color: 'white'
            }}>
              1. Verantwortlicher
            </h3>
            <p style={{ marginBottom: '1.5rem', color: '#d1d5db' }}>
              Verantwortlicher für die Datenverarbeitung auf dieser Website ist:<br />
              CarBot GmbH<br />
              Musterstraße 123<br />
              12345 Berlin<br />
              Deutschland<br />
              E-Mail: datenschutz@carbot.chat
            </p>

            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              marginBottom: '1rem',
              marginTop: '2rem',
              color: 'white'
            }}>
              2. Erfassung und Verarbeitung personenbezogener Daten
            </h3>
            <p style={{ marginBottom: '1.5rem', color: '#d1d5db' }}>
              Wir erheben und verwenden personenbezogene Daten nur, soweit dies gesetzlich erlaubt ist oder Sie in die Datenerhebung einwilligen. Als personenbezogene Daten gelten sämtliche Informationen, die dazu dienen, Ihre Person zu bestimmen und die zu Ihnen zurückverfolgt werden können.
            </p>

            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              marginBottom: '1rem',
              marginTop: '2rem',
              color: 'white'
            }}>
              3. Zwecke der Datenverarbeitung
            </h3>
            <p style={{ marginBottom: '1.5rem', color: '#d1d5db' }}>
              Wir verarbeiten Ihre personenbezogenen Daten zu folgenden Zwecken:
            </p>
            <ul style={{ 
              marginBottom: '1.5rem', 
              color: '#d1d5db',
              paddingLeft: '1.5rem'
            }}>
              <li style={{ marginBottom: '0.5rem' }}>Bereitstellung unserer Dienstleistungen</li>
              <li style={{ marginBottom: '0.5rem' }}>Kundenbetreuung und -support</li>
              <li style={{ marginBottom: '0.5rem' }}>Verbesserung unserer Services</li>
              <li style={{ marginBottom: '0.5rem' }}>Erfüllung rechtlicher Verpflichtungen</li>
            </ul>

            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              marginBottom: '1rem',
              marginTop: '2rem',
              color: 'white'
            }}>
              4. Ihre Rechte
            </h3>
            <p style={{ marginBottom: '1.5rem', color: '#d1d5db' }}>
              Sie haben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Widerspruch gegen die Verarbeitung und Datenübertragbarkeit. Bei Fragen zum Datenschutz wenden Sie sich bitte an datenschutz@carbot.chat.
            </p>

            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              marginBottom: '1rem',
              marginTop: '2rem',
              color: 'white'
            }}>
              5. Cookies
            </h3>
            <p style={{ marginBottom: '1.5rem', color: '#d1d5db' }}>
              Unsere Website verwendet Cookies, um die Benutzerfreundlichkeit zu verbessern. Sie können Ihren Browser so einstellen, dass er Sie über das Setzen von Cookies informiert und Cookies nur im Einzelfall erlaubt.
            </p>

            <p style={{ 
              marginTop: '2rem', 
              fontSize: '0.875rem', 
              color: '#9ca3af',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              paddingTop: '1rem'
            }}>
              Letzte Aktualisierung: Januar 2025
            </p>
          </div>
        </GlassCard>
      </main>
      
      {/* Footer */}
      <footer style={{
        background: 'rgba(0, 0, 0, 0.2)',
        backdropFilter: 'blur(10px)',
        borderTop: '1px solid rgba(107, 114, 128, 1)',
        marginTop: '4rem'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '2rem 1.5rem',
          textAlign: 'center',
          color: '#9ca3af'
        }}>
          <p>&copy; 2025 CarBot. Alle Rechte vorbehalten.</p>
        </div>
      </footer>
    </div>
  );
}