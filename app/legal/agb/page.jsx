import ModernNavigation from '@/components/ModernNavigation';
import { GlassCard } from '@/components/SharedLayout';

export const metadata = {
  title: 'AGB - Allgemeine Geschäftsbedingungen - CarBot',
  description: 'Allgemeine Geschäftsbedingungen für die Nutzung der CarBot Services'
}

export default function AGB() {
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
              Allgemeine Geschäftsbedingungen (AGB)
            </h2>
            
            <p style={{ marginBottom: '1.5rem', color: '#d1d5db' }}>
              Diese Allgemeinen Geschäftsbedingungen gelten für alle Verträge zwischen der CarBot GmbH und unseren Kunden über die Nutzung unserer KI-gestützten Chatbot-Services für Autowerkstätten.
            </p>

            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              marginBottom: '1rem',
              marginTop: '2rem',
              color: 'white'
            }}>
              § 1 Geltungsbereich
            </h3>
            <p style={{ marginBottom: '1.5rem', color: '#d1d5db' }}>
              (1) Diese Allgemeinen Geschäftsbedingungen (nachfolgend "AGB") gelten für alle Verträge zwischen der CarBot GmbH (nachfolgend "CarBot") und dem Kunden über die Bereitstellung und Nutzung der CarBot-Software und zugehörigen Services.<br /><br />
              (2) Entgegenstehende oder von diesen AGB abweichende Bedingungen des Kunden werden nicht Vertragsbestandteil, es sei denn, ihrer Geltung wird ausdrücklich schriftlich zugestimmt.<br /><br />
              (3) Diese AGB gelten auch für alle zukünftigen Geschäftsbeziehungen, auch wenn sie nicht nochmals ausdrücklich vereinbart werden.
            </p>

            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              marginBottom: '1rem',
              marginTop: '2rem',
              color: 'white'
            }}>
              § 2 Vertragsgegenstand
            </h3>
            <p style={{ marginBottom: '1.5rem', color: '#d1d5db' }}>
              (1) CarBot stellt dem Kunden eine cloudbasierte Software-as-a-Service (SaaS) Lösung zur Verfügung, die einen KI-gestützten Chatbot für Autowerkstätten umfasst.<br /><br />
              (2) Die Software ermöglicht automatisierte Kundenberatung, Terminbuchung, Lead-Generierung und Kundenservice in deutscher, englischer, türkischer und französischer Sprache.<br /><br />
              (3) Der genaue Funktionsumfang richtet sich nach dem gewählten Tarif und ist auf der Website unter https://carbot.chat/pricing beschrieben.
            </p>

            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              marginBottom: '1rem',
              marginTop: '2rem',
              color: 'white'
            }}>
              § 3 Vertragsschluss
            </h3>
            <p style={{ marginBottom: '1.5rem', color: '#d1d5db' }}>
              (1) Die Darstellung der Services auf der Website stellt kein rechtlich bindendes Angebot dar, sondern eine Aufforderung zur Abgabe einer Bestellung.<br /><br />
              (2) Der Vertrag kommt durch die Registrierung des Kunden und die anschließende Bestätigung durch CarBot zustande.<br /><br />
              (3) CarBot behält sich vor, Vertragsangebote ohne Angabe von Gründen abzulehnen.
            </p>

            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              marginBottom: '1rem',
              marginTop: '2rem',
              color: 'white'
            }}>
              § 4 Leistungen von CarBot
            </h3>
            <p style={{ marginBottom: '1.5rem', color: '#d1d5db' }}>
              (1) CarBot stellt die Software über das Internet zur Verfügung. Die Verfügbarkeit beträgt 99,5% im Jahresdurchschnitt, ausgenommen geplante Wartungsarbeiten.<br /><br />
              (2) CarBot führt regelmäßige Datensicherungen durch und gewährleistet die Sicherheit der übertragenen und gespeicherten Daten nach dem Stand der Technik.<br /><br />
              (3) Support wird während der Geschäftszeiten (Montag bis Freitag, 9:00 bis 17:00 Uhr) per E-Mail und Chat angeboten.
            </p>

            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              marginBottom: '1rem',
              marginTop: '2rem',
              color: 'white'
            }}>
              § 5 Pflichten des Kunden
            </h3>
            <p style={{ marginBottom: '1.5rem', color: '#d1d5db' }}>
              (1) Der Kunde verpflichtet sich, die Software nur bestimmungsgemäß zu nutzen und keine rechtswidrigen Inhalte zu übertragen.<br /><br />
              (2) Der Kunde ist für die Sicherheit seiner Zugangsdaten verantwortlich und hat diese vor unbefugtem Zugriff zu schützen.<br /><br />
              (3) Bei Verdacht auf Missbrauch der Zugangsdaten ist CarBot unverzüglich zu informieren.
            </p>

            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              marginBottom: '1rem',
              marginTop: '2rem',
              color: 'white'
            }}>
              § 6 Vergütung und Zahlungsbedingungen
            </h3>
            <p style={{ marginBottom: '1.5rem', color: '#d1d5db' }}>
              (1) Die Vergütung richtet sich nach der gewählten Tarifoption und ist auf der Website unter https://carbot.chat/pricing einzusehen.<br /><br />
              (2) Die Abrechnung erfolgt monatlich oder jährlich im Voraus, je nach gewähltem Abrechnungszeitraum.<br /><br />
              (3) Zahlungen sind binnen 14 Tagen nach Rechnungsstellung fällig. Bei Verzug werden Verzugszinsen in Höhe von 9 Prozentpunkten über dem Basiszinssatz berechnet.
            </p>

            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              marginBottom: '1rem',
              marginTop: '2rem',
              color: 'white'
            }}>
              § 7 Laufzeit und Kündigung
            </h3>
            <p style={{ marginBottom: '1.5rem', color: '#d1d5db' }}>
              (1) Der Vertrag wird auf unbestimmte Zeit geschlossen und kann von beiden Parteien mit einer Frist von 30 Tagen zum Monatsende gekündigt werden.<br /><br />
              (2) Das Recht zur außerordentlichen Kündigung aus wichtigem Grund bleibt unberührt.<br /><br />
              (3) Kündigungen bedürfen der Schriftform oder können über das Kundenkonto vorgenommen werden.
            </p>

            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              marginBottom: '1rem',
              marginTop: '2rem',
              color: 'white'
            }}>
              § 8 Haftung
            </h3>
            <p style={{ marginBottom: '1.5rem', color: '#d1d5db' }}>
              (1) CarBot haftet unbeschränkt bei Vorsatz und grober Fahrlässigkeit sowie bei der Verletzung von Leben, Körper oder Gesundheit.<br /><br />
              (2) Bei der leicht fahrlässigen Verletzung wesentlicher Vertragspflichten ist die Haftung auf den typischen, vorhersehbaren Schaden begrenzt.<br /><br />
              (3) Im Übrigen ist die Haftung ausgeschlossen.
            </p>

            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              marginBottom: '1rem',
              marginTop: '2rem',
              color: 'white'
            }}>
              § 9 Datenschutz
            </h3>
            <p style={{ marginBottom: '1.5rem', color: '#d1d5db' }}>
              (1) CarBot verarbeitet personenbezogene Daten des Kunden gemäß der Datenschutz-Grundverordnung (DSGVO) und dem Bundesdatenschutzgesetz.<br /><br />
              (2) Einzelheiten zum Datenschutz sind in der Datenschutzerklärung unter /datenschutz geregelt.<br /><br />
              (3) CarBot schließt mit dem Kunden bei Bedarf eine Vereinbarung zur Auftragsverarbeitung ab.
            </p>

            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              marginBottom: '1rem',
              marginTop: '2rem',
              color: 'white'
            }}>
              § 10 Schlussbestimmungen
            </h3>
            <p style={{ marginBottom: '1.5rem', color: '#d1d5db' }}>
              (1) Es gilt ausschließlich deutsches Recht unter Ausschluss des UN-Kaufrechts.<br /><br />
              (2) Gerichtsstand für alle Streitigkeiten ist Berlin, sofern der Kunde Kaufmann, juristische Person des öffentlichen Rechts oder öffentlich-rechtliches Sondervermögen ist.<br /><br />
              (3) Sollten einzelne Bestimmungen dieser AGB unwirksam sein oder werden, berührt dies die Wirksamkeit der übrigen Bestimmungen nicht.
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