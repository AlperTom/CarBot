import { Metadata } from 'next'
import Link from 'next/link'
import SharedLayout, { GlassCard } from '../../../components/SharedLayout'

export const metadata = {
  title: 'Predictive Maintenance mit KI: Die Zukunft der Werkstatt-Diagnostik | CarBot',
  description: 'Entdecken Sie, wie KI-gestützte Predictive Maintenance Werkstätten revolutioniert. Frühzeitige Fehlererkennung, präventive Wartung und höhere Kundenzufriedenheit.',
  keywords: 'Predictive Maintenance, KI Werkstatt, Fahrzeugdiagnose, Präventive Wartung, Machine Learning Automotive, IoT Werkstatt, Künstliche Intelligenz Auto',
  openGraph: {
    title: 'Predictive Maintenance mit KI: Die Zukunft der Werkstatt-Diagnostik',
    description: 'Wie künstliche Intelligenz die Fahrzeugwartung revolutioniert und Werkstätten einen entscheidenden Wettbewerbsvorteil verschafft.',
    type: 'article',
  },
  alternates: {
    canonical: '/blog/predictive-maintenance-ki-werkstatt'
  }
}

export default function BlogPost() {
  return (
    <SharedLayout title="Predictive Maintenance mit KI" showNavigation={true}>
      <article style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '2rem 1.5rem'
      }}>
        <nav style={{ marginBottom: '2rem', fontSize: '0.875rem', color: '#9ca3af' }}>
          <Link href="/" style={{ color: '#fb923c', textDecoration: 'none' }}>Home</Link>
          {' → '}
          <Link href="/blog" style={{ color: '#fb923c', textDecoration: 'none' }}>Blog</Link>
          {' → '}
          <span>Predictive Maintenance KI</span>
        </nav>

        <header style={{ marginBottom: '3rem' }}>
          <div style={{ marginBottom: '1rem' }}>
            <span style={{
              background: 'linear-gradient(135deg, #9333ea 0%, #7c3aed 100%)',
              color: 'white',
              padding: '0.25rem 0.75rem',
              borderRadius: '20px',
              fontSize: '0.75rem',
              fontWeight: '600'
            }}>
              Innovation & Zukunft
            </span>
          </div>
          <h1 style={{ 
            color: 'white', 
            fontSize: '2.5rem',
            fontWeight: 'bold',
            lineHeight: '1.2',
            marginBottom: '1rem'
          }}>
            Predictive Maintenance mit KI: Wie Werkstätten die Zukunft voraussagen
          </h1>
          <p style={{ 
            color: '#d1d5db', 
            fontSize: '1.125rem',
            lineHeight: '1.6',
            marginBottom: '2rem'
          }}>
            Stellen Sie sich vor, Sie wissen bereits vor dem Kunden, wann sein Auto eine Reparatur braucht. 
            KI-gestützte Predictive Maintenance macht genau das möglich - und revolutioniert die Werkstattbranche.
          </p>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '1rem',
            fontSize: '0.875rem',
            color: '#9ca3af'
          }}>
            <span>📅 13. Januar 2025</span>
            <span>📖 10 Min. Lesezeit</span>
            <span>👤 Dr. Alexander Berg, KI-Forscher</span>
          </div>
        </header>

        <div style={{ color: '#e5e7eb', lineHeight: '1.8', fontSize: '1rem' }}>
          
          <GlassCard style={{ marginBottom: '2rem', padding: '1.5rem' }}>
            <h2 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '1rem' }}>
              Was ist Predictive Maintenance?
            </h2>
            <p style={{ marginBottom: '1rem' }}>
              Predictive Maintenance (vorausschauende Wartung) nutzt künstliche Intelligenz, 
              Sensordaten und Machine Learning, um <strong>Ausfälle vorherzusagen, bevor sie eintreten</strong>. 
              Statt reaktiv zu reparieren oder blind zu warten, wird präventiv gehandelt.
            </p>
            
            <div style={{
              background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.1) 0%, rgba(124, 58, 237, 0.1) 100%)',
              border: '1px solid rgba(147, 51, 234, 0.3)',
              padding: '1.5rem',
              borderRadius: '12px',
              marginBottom: '1.5rem'
            }}>
              <h3 style={{ color: '#9333ea', fontSize: '1.25rem', marginBottom: '1rem' }}>
                🧠 Wie KI Fahrzeugprobleme vorhersagt:
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📊</div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 'bold' }}>Datensammlung</div>
                  <div style={{ fontSize: '0.75rem', color: '#d1d5db' }}>Sensoren, OBD, Fahrzeughistorie</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🤖</div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 'bold' }}>KI-Analyse</div>
                  <div style={{ fontSize: '0.75rem', color: '#d1d5db' }}>Muster erkennen, Anomalien finden</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔮</div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 'bold' }}>Vorhersage</div>
                  <div style={{ fontSize: '0.75rem', color: '#d1d5db' }}>Ausfallwahrscheinlichkeit berechnen</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⚡</div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 'bold' }}>Aktion</div>
                  <div style={{ fontSize: '0.75rem', color: '#d1d5db' }}>Proaktive Wartung planen</div>
                </div>
              </div>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem'
            }}>
              <div style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                padding: '1rem',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>❌</div>
                <div style={{ fontSize: '1rem', fontWeight: 'bold', color: '#ef4444', marginBottom: '0.5rem' }}>Reaktive Wartung</div>
                <div style={{ fontSize: '0.875rem' }}>Reparatur nach Defekt</div>
              </div>
              <div style={{
                background: 'rgba(245, 158, 11, 0.1)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                padding: '1rem',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>📅</div>
                <div style={{ fontSize: '1rem', fontWeight: 'bold', color: '#f59e0b', marginBottom: '0.5rem' }}>Präventive Wartung</div>
                <div style={{ fontSize: '0.875rem' }}>Wartung nach Zeit/km</div>
              </div>
              <div style={{
                background: 'rgba(34, 197, 94, 0.1)',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                padding: '1rem',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🧠</div>
                <div style={{ fontSize: '1rem', fontWeight: 'bold', color: '#22c55e', marginBottom: '0.5rem' }}>Predictive Wartung</div>
                <div style={{ fontSize: '0.875rem' }}>Wartung bei Bedarf</div>
              </div>
            </div>
          </GlassCard>

          <GlassCard style={{ marginBottom: '2rem', padding: '1.5rem' }}>
            <h2 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '1rem' }}>
              Die 5 Datenquellen für KI-Diagnose
            </h2>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.5rem'
            }}>
              <div style={{
                background: 'rgba(34, 197, 94, 0.1)',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                padding: '1.5rem',
                borderRadius: '12px'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🔌</div>
                <h3 style={{ color: '#22c55e', fontSize: '1.125rem', marginBottom: '1rem' }}>1. OBD-II Daten</h3>
                <p style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>
                  On-Board-Diagnose liefert über 100 Parameter in Echtzeit.
                </p>
                <ul style={{ paddingLeft: '1rem', fontSize: '0.75rem', margin: 0 }}>
                  <li>Motorparameter</li>
                  <li>Emissionswerte</li>
                  <li>Fehlercodes (DTCs)</li>
                  <li>Systemstatus</li>
                </ul>
              </div>
              
              <div style={{
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                padding: '1.5rem',
                borderRadius: '12px'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🌡️</div>
                <h3 style={{ color: '#3b82f6', fontSize: '1.125rem', marginBottom: '1rem' }}>2. IoT-Sensoren</h3>
                <p style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>
                  Zusätzliche Sensoren für detaillierte Überwachung.
                </p>
                <ul style={{ paddingLeft: '1rem', fontSize: '0.75rem', margin: 0 }}>
                  <li>Vibrationsanalyse</li>
                  <li>Temperaturverläufe</li>
                  <li>Ölqualität</li>
                  <li>Verschleißmessung</li>
                </ul>
              </div>

              <div style={{
                background: 'rgba(168, 85, 247, 0.1)',
                border: '1px solid rgba(168, 85, 247, 0.3)',
                padding: '1.5rem',
                borderRadius: '12px'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📚</div>
                <h3 style={{ color: '#a855f7', fontSize: '1.125rem', marginBottom: '1rem' }}>3. Fahrzeughistorie</h3>
                <p style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>
                  Historische Daten für bessere Prognosen.
                </p>
                <ul style={{ paddingLeft: '1rem', fontSize: '0.75rem', margin: 0 }}>
                  <li>Wartungshistorie</li>
                  <li>Reparaturaufzeichnungen</li>
                  <li>Kilometerstand</li>
                  <li>Fahrzeugalter</li>
                </ul>
              </div>

              <div style={{
                background: 'rgba(245, 158, 11, 0.1)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                padding: '1.5rem',
                borderRadius: '12px'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🚗</div>
                <h3 style={{ color: '#f59e0b', fontSize: '1.125rem', marginBottom: '1rem' }}>4. Fahrmuster</h3>
                <p style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>
                  Wie das Fahrzeug genutzt wird beeinflusst Verschleiß.
                </p>
                <ul style={{ paddingLeft: '1rem', fontSize: '0.75rem', margin: 0 }}>
                  <li>Fahrzyklen</li>
                  <li>Geschwindigkeitsprofile</li>
                  <li>Bremshäufigkeit</li>
                  <li>Umgebungsbedingungen</li>
                </ul>
              </div>

              <div style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                padding: '1.5rem',
                borderRadius: '12px'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📈</div>
                <h3 style={{ color: '#ef4444', fontSize: '1.125rem', marginBottom: '1rem' }}>5. Marktdaten</h3>
                <p style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>
                  Branchenweite Erfahrungen fließen ein.
                </p>
                <ul style={{ paddingLeft: '1rem', fontSize: '0.75rem', margin: 0 }}>
                  <li>Typische Ausfallmuster</li>
                  <li>Herstellerdaten</li>
                  <li>Saisonale Trends</li>
                  <li>Rückrufaktionen</li>
                </ul>
              </div>
            </div>
          </GlassCard>

          <GlassCard style={{ marginBottom: '2rem', padding: '1.5rem' }}>
            <h2 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '1rem' }}>
              Konkrete Anwendungsfälle in der Praxis
            </h2>
            
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ color: '#22c55e', fontSize: '1.25rem', marginBottom: '1rem' }}>
                🔧 Anwendungsfall 1: Bremsendiagnose
              </h3>
              <p style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>
                <strong>Traditionell:</strong> Kunde bemerkt quietschende Bremsen, kommt zur Werkstatt, 
                Bremsbeläge sind bereits abgenutzt.
              </p>
              <p style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>
                <strong>Mit KI:</strong> System erkennt 3 Wochen vorher anhand von Vibrations- und 
                Bremsdruckmustern den Verschleiß und informiert Kunde proaktiv.
              </p>
              <div style={{
                background: 'rgba(34, 197, 94, 0.1)',
                border: '1px solid rgba(34, 197, 94, 0.2)',
                padding: '1rem',
                borderRadius: '8px',
                fontSize: '0.875rem'
              }}>
                <strong>Resultat:</strong> 40% weniger Notfälle, 25% längere Lebensdauer der Bremsscheiben, 
                zufriedenere Kunden durch planbare Termine.
              </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ color: '#3b82f6', fontSize: '1.25rem', marginBottom: '1rem' }}>
                ⚙️ Anwendungsfall 2: Motorölanalyse
              </h3>
              <p style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>
                <strong>Problem:</strong> Motorschäden durch zu späte Ölwechsel kosten durchschnittlich €3.500.
              </p>
              <p style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>
                <strong>KI-Lösung:</strong> Kontinuierliche Analyse der Ölqualität basierend auf Fahrverhalten, 
                Temperaturdaten und Fahrzeughistorie.
              </p>
              <div style={{
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                padding: '1rem',
                borderRadius: '8px',
                fontSize: '0.875rem'
              }}>
                <strong>Beispiel:</strong> Stadtverkehr-Fahrer bekommt nach 8.000km die Empfehlung für Ölwechsel, 
                während Autobahn-Fahrer erst nach 12.000km benachrichtigt wird.
              </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ color: '#f59e0b', fontSize: '1.25rem', marginBottom: '1rem' }}>
                🔋 Anwendungsfall 3: Batterieüberwachung
              </h3>
              <p style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>
                <strong>Herausforderung:</strong> Batterieausfall ist der häufigste Pannengrund (42% aller Pannen).
              </p>
              <p style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>
                <strong>Predictive Maintenance:</strong> KI analysiert Ladeverhalten, Temperaturzyklen und 
                Startmuster zur Vorhersage der Batterielebensdauer.
              </p>
              <div style={{
                background: 'rgba(245, 158, 11, 0.1)',
                border: '1px solid rgba(245, 158, 11, 0.2)',
                padding: '1rem',
                borderRadius: '8px',
                fontSize: '0.875rem'
              }}>
                <strong>Kundennutzen:</strong> Keine überraschenden Ausfälle mehr. Batterieveränderungen 
                werden 4-6 Wochen im Voraus prognostiziert mit 92% Genauigkeit.
              </div>
            </div>

            <div>
              <h3 style={{ color: '#8b5cf6', fontSize: '1.25rem', marginBottom: '1rem' }}>
                🚙 Anwendungsfall 4: Getriebediagnose
              </h3>
              <p style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>
                <strong>Komplexität:</strong> Getriebeschäden sind schwer zu diagnostizieren und teuer zu reparieren.
              </p>
              <p style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>
                <strong>KI-Ansatz:</strong> Analyse von Schaltmustern, Drehmomentverläufen und 
                Getriebeöltemperaturen zur Früherkennung.
              </p>
              <div style={{
                background: 'rgba(139, 92, 246, 0.1)',
                border: '1px solid rgba(139, 92, 246, 0.2)',
                padding: '1rem',
                borderRadius: '8px',
                fontSize: '0.875rem'
              }}>
                <strong>Praxisbeispiel:</strong> Automatikgetriebe zeigt erste Anzeichen von Verschleiß. 
                KI empfiehlt Getriebeölwechsel statt teurer Reparatur (€350 statt €2.800).
              </div>
            </div>
          </GlassCard>

          <GlassCard style={{ marginBottom: '2rem', padding: '1.5rem' }}>
            <h2 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '1rem' }}>
              Business-Impact für Werkstätten
            </h2>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1.5rem',
              marginBottom: '2rem'
            }}>
              <div style={{
                background: 'rgba(34, 197, 94, 0.1)',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                padding: '1.5rem',
                borderRadius: '12px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>💰</div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#22c55e' }}>+35%</div>
                <div style={{ fontSize: '0.875rem' }}>Umsatzsteigerung</div>
                <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.5rem' }}>
                  Durch proaktive Services und höhere Auslastung
                </div>
              </div>
              <div style={{
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                padding: '1.5rem',
                borderRadius: '12px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>⭐</div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3b82f6' }}>+45%</div>
                <div style={{ fontSize: '0.875rem' }}>Kundenzufriedenheit</div>
                <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.5rem' }}>
                  Weniger ungeplante Ausfälle und Pannen
                </div>
              </div>
              <div style={{
                background: 'rgba(245, 158, 11, 0.1)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                padding: '1.5rem',
                borderRadius: '12px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>⏱️</div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f59e0b' }}>-30%</div>
                <div style={{ fontSize: '0.875rem' }}>Diagnosezeit</div>
                <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.5rem' }}>
                  KI liefert präzise Vorab-Diagnosen
                </div>
              </div>
              <div style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                padding: '1.5rem',
                borderRadius: '12px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🔧</div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ef4444' }}>-50%</div>
                <div style={{ fontSize: '0.875rem' }}>Ungeplante Reparaturen</div>
                <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.5rem' }}>
                  Vorbeugende Wartung verhindert Ausfälle
                </div>
              </div>
            </div>

            <h3 style={{ color: '#fb923c', fontSize: '1.25rem', marginBottom: '1rem' }}>
              Neue Geschäftsmodelle durch Predictive Maintenance:
            </h3>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1rem'
            }}>
              <div style={{
                background: 'rgba(147, 51, 234, 0.1)',
                border: '1px solid rgba(147, 51, 234, 0.3)',
                padding: '1rem',
                borderRadius: '8px'
              }}>
                <h4 style={{ color: '#9333ea', fontSize: '1rem', marginBottom: '0.5rem' }}>🏥 Health-Check Subscriptions</h4>
                <p style={{ fontSize: '0.875rem', margin: 0 }}>
                  Monatliche Fahrzeug-Gesundheitsberichte für €29/Monat mit präventiven Empfehlungen.
                </p>
              </div>
              
              <div style={{
                background: 'rgba(147, 51, 234, 0.1)',
                border: '1px solid rgba(147, 51, 234, 0.3)',
                padding: '1rem',
                borderRadius: '8px'
              }}>
                <h4 style={{ color: '#9333ea', fontSize: '1rem', marginBottom: '0.5rem' }}>🛡️ Predictive Warranties</h4>
                <p style={{ fontSize: '0.875rem', margin: 0 }}>
                  KI-basierte Garantien, die sich an den tatsächlichen Fahrzeugzustand anpassen.
                </p>
              </div>

              <div style={{
                background: 'rgba(147, 51, 234, 0.1)',
                border: '1px solid rgba(147, 51, 234, 0.3)',
                padding: '1rem',
                borderRadius: '8px'
              }}>
                <h4 style={{ color: '#9333ea', fontSize: '1rem', marginBottom: '0.5rem' }}>📊 Fleet Management Services</h4>
                <p style={{ fontSize: '0.875rem', margin: 0 }}>
                  Überwachung ganzer Fuhrparks mit intelligenter Wartungsplanung.
                </p>
              </div>

              <div style={{
                background: 'rgba(147, 51, 234, 0.1)',
                border: '1px solid rgba(147, 51, 234, 0.3)',
                padding: '1rem',
                borderRadius: '8px'
              }}>
                <h4 style={{ color: '#9333ea', fontSize: '1rem', marginBottom: '0.5rem' }}>🎯 Premium Diagnostics</h4>
                <p style={{ fontSize: '0.875rem', margin: 0 }}>
                  Hochpräzise KI-Diagnosen als Premium-Service für €99 statt aufwendiger Fehlersuche.
                </p>
              </div>
            </div>
          </GlassCard>

          <GlassCard style={{ marginBottom: '2rem', padding: '1.5rem' }}>
            <h2 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '1rem' }}>
              Implementierungs-Roadmap: Von 0 auf KI in 6 Monaten
            </h2>
            
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ color: '#22c55e', fontSize: '1.25rem', marginBottom: '1rem' }}>
                Phase 1: Foundation (Monat 1-2)
              </h3>
              <div style={{
                background: 'rgba(34, 197, 94, 0.1)',
                border: '1px solid rgba(34, 197, 94, 0.2)',
                padding: '1rem',
                borderRadius: '8px',
                marginBottom: '1rem'
              }}>
                <h4 style={{ color: '#22c55e', fontSize: '1rem', marginBottom: '0.5rem' }}>🏗️ Technische Basis schaffen:</h4>
                <ul style={{ paddingLeft: '1rem', fontSize: '0.875rem', margin: 0 }}>
                  <li>OBD-II Schnittstellen für alle Diagnoseplätze</li>
                  <li>Cloud-Infrastruktur für Datensammlung</li>
                  <li>Werkstatt-Management-System mit API-Anbindung</li>
                  <li>Erste IoT-Sensoren für Testfahrzeuge</li>
                </ul>
              </div>
              <div style={{
                background: 'rgba(34, 197, 94, 0.1)',
                border: '1px solid rgba(34, 197, 94, 0.2)',
                padding: '1rem',
                borderRadius: '8px'
              }}>
                <strong>💰 Investition Phase 1:</strong> €8.500 - €15.000<br />
                <strong>🎯 Ziel:</strong> Datensammlung für mindestens 50 Fahrzeuge
              </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ color: '#3b82f6', fontSize: '1.25rem', marginBottom: '1rem' }}>
                Phase 2: AI Training (Monat 3-4)
              </h3>
              <div style={{
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                padding: '1rem',
                borderRadius: '8px',
                marginBottom: '1rem'
              }}>
                <h4 style={{ color: '#3b82f6', fontSize: '1rem', marginBottom: '0.5rem' }}>🧠 KI-Modell entwickeln:</h4>
                <ul style={{ paddingLeft: '1rem', fontSize: '0.875rem', margin: 0 }}>
                  <li>Historische Werkstattdaten für Training nutzen</li>
                  <li>Machine Learning Algorithmen trainieren</li>
                  <li>Erste Predictive Models für häufige Defekte</li>
                  <li>Validierung mit bekannten Fahrzeugproblemen</li>
                </ul>
              </div>
              <div style={{
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                padding: '1rem',
                borderRadius: '8px'
              }}>
                <strong>💰 Investition Phase 2:</strong> €12.000 - €25.000<br />
                <strong>🎯 Ziel:</strong> 70% Vorhersage-Genauigkeit für Top-5 Defekte
              </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ color: '#f59e0b', fontSize: '1.25rem', marginBottom: '1rem' }}>
                Phase 3: Pilot Launch (Monat 5)
              </h3>
              <div style={{
                background: 'rgba(245, 158, 11, 0.1)',
                border: '1px solid rgba(245, 158, 11, 0.2)',
                padding: '1rem',
                borderRadius: '8px',
                marginBottom: '1rem'
              }}>
                <h4 style={{ color: '#f59e0b', fontSize: '1rem', marginBottom: '0.5rem' }}>🚀 Kontrollierter Start:</h4>
                <ul style={{ paddingLeft: '1rem', fontSize: '0.875rem', margin: 0 }}>
                  <li>Pilotprogramm mit 20 Stammkunden</li>
                  <li>Kundenportal für Predictive Maintenance Reports</li>
                  <li>Automatisierte Benachrichtigungen testen</li>
                  <li>Feedback sammeln und System optimieren</li>
                </ul>
              </div>
              <div style={{
                background: 'rgba(245, 158, 11, 0.1)',
                border: '1px solid rgba(245, 158, 11, 0.2)',
                padding: '1rem',
                borderRadius: '8px'
              }}>
                <strong>💰 Investition Phase 3:</strong> €5.000 - €8.000<br />
                <strong>🎯 Ziel:</strong> Erste erfolgreiche Vorhersagen und zufriedene Pilotkunden
              </div>
            </div>

            <div>
              <h3 style={{ color: '#8b5cf6', fontSize: '1.25rem', marginBottom: '1rem' }}>
                Phase 4: Full Rollout (Monat 6)
              </h3>
              <div style={{
                background: 'rgba(139, 92, 246, 0.1)',
                border: '1px solid rgba(139, 92, 246, 0.2)',
                padding: '1rem',
                borderRadius: '8px',
                marginBottom: '1rem'
              }}>
                <h4 style={{ color: '#8b5cf6', fontSize: '1rem', marginBottom: '0.5rem' }}>🌟 Vollständige Einführung:</h4>
                <ul style={{ paddingLeft: '1rem', fontSize: '0.875rem', margin: 0 }}>
                  <li>Alle Kunden können Predictive Services nutzen</li>
                  <li>Marketing-Kampagne für neue Services</li>
                  <li>Mitarbeiter-Training für KI-gestützte Diagnose</li>
                  <li>Kontinuierliche Systemverbesserung</li>
                </ul>
              </div>
              <div style={{
                background: 'rgba(139, 92, 246, 0.1)',
                border: '1px solid rgba(139, 92, 246, 0.2)',
                padding: '1rem',
                borderRadius: '8px'
              }}>
                <strong>💰 Investition Phase 4:</strong> €3.000 - €6.000<br />
                <strong>🎯 Ziel:</strong> 200+ aktive Predictive Maintenance Kunden
              </div>
            </div>
          </GlassCard>

          <GlassCard style={{ marginBottom: '2rem', padding: '1.5rem' }}>
            <h2 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '1rem' }}>
              Technologie-Partner und Lösungen
            </h2>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '1.5rem'
            }}>
              <div style={{
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                padding: '1.5rem',
                borderRadius: '12px'
              }}>
                <h3 style={{ color: '#3b82f6', fontSize: '1.125rem', marginBottom: '1rem' }}>🚗 Automotive-spezifische KI</h3>
                <ul style={{ paddingLeft: '1rem', fontSize: '0.875rem', marginBottom: '1rem' }}>
                  <li><strong>Bosch Connected Repair:</strong> OEM-Datenintegration</li>
                  <li><strong>Continental ProViu:</strong> Predictive Analytics Platform</li>
                  <li><strong>Mahle TechPRO:</strong> Diagnostic Intelligence</li>
                  <li><strong>Snap-on ZEUS:</strong> AI-powered diagnostics</li>
                </ul>
                <div style={{
                  background: 'rgba(59, 130, 246, 0.2)',
                  padding: '0.5rem',
                  borderRadius: '4px',
                  fontSize: '0.75rem'
                }}>
                  <strong>Preisspanne:</strong> €150-400/Monat pro Diagnoseplatz
                </div>
              </div>
              
              <div style={{
                background: 'rgba(34, 197, 94, 0.1)',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                padding: '1.5rem',
                borderRadius: '12px'
              }}>
                <h3 style={{ color: '#22c55e', fontSize: '1.125rem', marginBottom: '1rem' }}>☁️ Cloud-basierte Lösungen</h3>
                <ul style={{ paddingLeft: '1rem', fontSize: '0.875rem', marginBottom: '1rem' }}>
                  <li><strong>AWS IoT Core:</strong> Sensor-Datensammlung</li>
                  <li><strong>Microsoft Azure AI:</strong> Machine Learning Services</li>
                  <li><strong>Google Cloud AutoML:</strong> Custom AI Models</li>
                  <li><strong>IBM Watson IoT:</strong> Predictive Analytics</li>
                </ul>
                <div style={{
                  background: 'rgba(34, 197, 94, 0.2)',
                  padding: '0.5rem',
                  borderRadius: '4px',
                  fontSize: '0.75rem'
                }}>
                  <strong>Preisspanne:</strong> €200-800/Monat je nach Datenvolumen
                </div>
              </div>

              <div style={{
                background: 'rgba(245, 158, 11, 0.1)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                padding: '1.5rem',
                borderRadius: '12px'
              }}>
                <h3 style={{ color: '#f59e0b', fontSize: '1.125rem', marginBottom: '1rem' }}>🔧 Werkstatt-Integration</h3>
                <ul style={{ paddingLeft: '1rem', fontSize: '0.875rem', marginBottom: '1rem' }}>
                  <li><strong>Moteo:</strong> AI-enhanced Workshop Management</li>
                  <li><strong>AutoFaktura Pro:</strong> Predictive Maintenance Module</li>
                  <li><strong>CarLabs:</strong> Diagnostic Intelligence Suite</li>
                  <li><strong>TecRMI:</strong> Workshop AI Assistant</li>
                </ul>
                <div style={{
                  background: 'rgba(245, 158, 11, 0.2)',
                  padding: '0.5rem',
                  borderRadius: '4px',
                  fontSize: '0.75rem'
                }}>
                  <strong>Preisspanne:</strong> €99-350/Monat für Komplettsystem
                </div>
              </div>

              <div style={{
                background: 'rgba(168, 85, 247, 0.1)',
                border: '1px solid rgba(168, 85, 247, 0.3)',
                padding: '1.5rem',
                borderRadius: '12px'
              }}>
                <h3 style={{ color: '#a855f7', fontSize: '1.125rem', marginBottom: '1rem' }}>🛠️ Hardware-Lösungen</h3>
                <ul style={{ paddingLeft: '1rem', fontSize: '0.875rem', marginBottom: '1rem' }}>
                  <li><strong>OBD Solutions:</strong> Wireless OBD-II Dongles</li>
                  <li><strong>Delphi DS150E:</strong> Universal Diagnostic Tool</li>
                  <li><strong>Autel MaxiSys:</strong> AI-powered Scanner</li>
                  <li><strong>Launch X431:</strong> Cloud-connected Diagnostics</li>
                </ul>
                <div style={{
                  background: 'rgba(168, 85, 247, 0.2)',
                  padding: '0.5rem',
                  borderRadius: '4px',
                  fontSize: '0.75rem'
                }}>
                  <strong>Investition:</strong> €2.500-8.500 pro Diagnoseplatz (einmalig)
                </div>
              </div>
            </div>
          </GlassCard>

          <GlassCard style={{ 
            background: 'linear-gradient(135deg, rgba(251, 146, 60, 0.1) 0%, rgba(234, 88, 12, 0.1) 100%)',
            border: '1px solid rgba(251, 146, 60, 0.3)',
            padding: '2rem',
            textAlign: 'center'
          }}>
            <h2 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '1rem' }}>
              Bereit für die KI-Revolution in Ihrer Werkstatt?
            </h2>
            <p style={{ marginBottom: '2rem', fontSize: '1.125rem' }}>
              Starten Sie noch heute mit einer kostenlosen KI-Readiness Analyse und entdecken Sie, 
              wie Predictive Maintenance Ihre Werkstatt zum Vorreiter macht.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link 
                href="/demo" 
                style={{
                  background: 'linear-gradient(135deg, #ea580c 0%, #fb923c 100%)',
                  color: 'white',
                  padding: '1rem 2rem',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontWeight: 'bold',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                🧠 KI-Readiness Analyse
              </Link>
              <Link 
                href="/docs" 
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  padding: '1rem 2rem',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}
              >
                📚 KI-Implementation Guide
              </Link>
            </div>
          </GlassCard>

        </div>

        <footer style={{ 
          marginTop: '3rem', 
          padding: '2rem 0', 
          borderTop: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h4 style={{ color: 'white', fontSize: '1rem', marginBottom: '0.5rem' }}>
                Dr. Alexander Berg
              </h4>
              <p style={{ color: '#9ca3af', fontSize: '0.875rem', margin: 0 }}>
                KI-Forscher und Experte für Predictive Maintenance im Automotive-Bereich mit 15 Jahren Erfahrung
              </p>
            </div>
            <Link href="/blog" style={{ color: '#fb923c', textDecoration: 'none' }}>
              ← Alle Artikel
            </Link>
          </div>
        </footer>
      </article>
    </SharedLayout>
  )
}