import SharedLayout, { GlassCard } from '@/components/SharedLayout';

export const metadata = {
  title: 'Cookie-Richtlinie - CarBot',
  description: 'Informationen über die Verwendung von Cookies auf CarBot.chat'
}

export default function Cookies() {
  return (
    <SharedLayout title="Cookie-Richtlinie">
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
              Cookie-Richtlinie
            </h2>
            
            <p style={{ marginBottom: '1.5rem', color: '#d1d5db' }}>
              Diese Cookie-Richtlinie erklärt, wie CarBot GmbH ("wir", "uns", "unser") Cookies und ähnliche Technologien verwendet, um Sie zu erkennen, wenn Sie unsere Website besuchen.
            </p>

            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              marginBottom: '1rem',
              marginTop: '2rem',
              color: 'white'
            }}>
              Was sind Cookies?
            </h3>
            <p style={{ marginBottom: '1.5rem', color: '#d1d5db' }}>
              Cookies sind kleine Datendateien, die auf Ihrem Computer oder mobilen Gerät gespeichert werden, wenn Sie eine Website besuchen. Cookies werden häufig verwendet, um Websites funktionsfähig zu machen oder effizienter zu gestalten sowie um Berichtsinformationen bereitzustellen.
            </p>

            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              marginBottom: '1rem',
              marginTop: '2rem',
              color: 'white'
            }}>
              Warum verwenden wir Cookies?
            </h3>
            <p style={{ marginBottom: '1.5rem', color: '#d1d5db' }}>
              Wir verwenden Cookies aus verschiedenen Gründen, die in den folgenden Abschnitten beschrieben werden. Leider gibt es in den meisten Fällen keine branchenüblichen Optionen, um Cookies zu deaktivieren, ohne die Funktionalität und Features, die sie zu dieser Website hinzufügen, vollständig zu deaktivieren.
            </p>

            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              marginBottom: '1rem',
              marginTop: '2rem',
              color: 'white'
            }}>
              Arten von Cookies, die wir verwenden
            </h3>
            
            <h4 style={{
              fontSize: '1.1rem',
              fontWeight: '600',
              marginBottom: '0.5rem',
              marginTop: '1.5rem',
              color: 'white'
            }}>
              Unbedingt erforderliche Cookies
            </h4>
            <p style={{ marginBottom: '1.5rem', color: '#d1d5db' }}>
              Diese Cookies sind für das ordnungsgemäße Funktionieren unserer Website unerlässlich. Sie ermöglichen es Ihnen, durch die Website zu navigieren und deren Features zu nutzen, wie etwa den Zugang zu sicheren Bereichen.
            </p>

            <h4 style={{
              fontSize: '1.1rem',
              fontWeight: '600',
              marginBottom: '0.5rem',
              marginTop: '1.5rem',
              color: 'white'
            }}>
              Leistungs- und Analyse-Cookies
            </h4>
            <p style={{ marginBottom: '1.5rem', color: '#d1d5db' }}>
              Diese Cookies sammeln Informationen darüber, wie Besucher unsere Website nutzen, z.B. welche Seiten am häufigsten besucht werden und ob Benutzer Fehlermeldungen von Webseiten erhalten. Diese Cookies sammeln keine Informationen, die einen Besucher identifizieren.
            </p>

            <h4 style={{
              fontSize: '1.1rem',
              fontWeight: '600',
              marginBottom: '0.5rem',
              marginTop: '1.5rem',
              color: 'white'
            }}>
              Funktionalitäts-Cookies
            </h4>
            <p style={{ marginBottom: '1.5rem', color: '#d1d5db' }}>
              Diese Cookies ermöglichen es der Website, verbesserte Funktionalität und Personalisierung bereitzustellen. Sie können von uns oder von Drittanbietern gesetzt werden, deren Dienste wir zu unseren Seiten hinzugefügt haben.
            </p>

            <h4 style={{
              fontSize: '1.1rem',
              fontWeight: '600',
              marginBottom: '0.5rem',
              marginTop: '1.5rem',
              color: 'white'
            }}>
              Marketing-Cookies
            </h4>
            <p style={{ marginBottom: '1.5rem', color: '#d1d5db' }}>
              Diese Cookies werden verwendet, um Werbung für Sie und Ihre Interessen relevanter zu machen. Sie werden auch verwendet, um die Anzahl der Anzeigen zu begrenzen und die Effektivität von Werbekampagnen zu messen.
            </p>

            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              marginBottom: '1rem',
              marginTop: '2rem',
              color: 'white'
            }}>
              Wie kann ich Cookies kontrollieren?
            </h3>
            <p style={{ marginBottom: '1.5rem', color: '#d1d5db' }}>
              Sie haben das Recht zu entscheiden, ob Sie Cookies akzeptieren oder ablehnen möchten. Sie können Ihre Cookie-Präferenzen über unser Cookie-Consent-Tool festlegen, das beim ersten Besuch unserer Website angezeigt wird.
            </p>

            <p style={{ marginBottom: '1.5rem', color: '#d1d5db' }}>
              Sie können auch Ihren Webbrowser so einstellen, dass er Cookies ablehnt oder Sie benachrichtigt, wenn Cookies gesendet werden. Beachten Sie jedoch, dass dadurch die Funktionalität unserer Website beeinträchtigt werden kann.
            </p>

            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              marginBottom: '1rem',
              marginTop: '2rem',
              color: 'white'
            }}>
              Häufig verwendete Cookies auf unserer Website
            </h3>
            <div style={{ marginBottom: '1.5rem', color: '#d1d5db' }}>
              <strong>carbot_cookies_{'{'}businessSlug{'}'}</strong>: Speichert Ihre Cookie-Präferenzen<br />
              <strong>session</strong>: Notwendig für die Benutzeranmeldung<br />
              <strong>_ga</strong>: Google Analytics zur Analyse des Website-Traffics<br />
              <strong>_gid</strong>: Google Analytics zur Unterscheidung von Benutzern
            </div>

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
              Wenn Sie Fragen zu unserer Verwendung von Cookies haben, können Sie uns unter datenschutz@carbot.chat kontaktieren.
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
      </div>
    </SharedLayout>
  );
}