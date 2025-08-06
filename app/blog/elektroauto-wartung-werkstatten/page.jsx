import { Metadata } from 'next'
import Link from 'next/link'
import SharedLayout, { GlassCard } from '../../../components/SharedLayout'

export const metadata = {
  title: 'Elektroauto-Wartung in Werkstätten: Der ultimative Guide für 2025 | CarBot',
  description: 'Alles über E-Auto Wartung: Unterschiede zum Verbrenner, Kosten, Herausforderungen und Chancen für Werkstätten. Plus: Ausbildung und Zertifizierung.',
  keywords: 'Elektroauto Wartung, E-Auto Service, Elektrofahrzeug Reparatur, EV Werkstatt, Hochvolt Wartung, Elektromobilität Service, Tesla Service',
  openGraph: {
    title: 'Elektroauto-Wartung in Werkstätten: Der ultimative Guide für 2025',
    description: 'Kompakter Guide zur E-Auto Wartung - von Grundlagen bis zu Geschäftschancen für Werkstätten.',
    type: 'article',
  },
  alternates: {
    canonical: '/blog/elektroauto-wartung-werkstatten'
  }
}

export default function BlogPost() {
  return (
    <SharedLayout title="Elektroauto-Wartung Werkstätten" showNavigation={true}>
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
          <span>Elektroauto-Wartung Werkstätten</span>
        </nav>

        <header style={{ marginBottom: '3rem' }}>
          <div style={{ marginBottom: '1rem' }}>
            <span style={{
              background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
              color: 'white',
              padding: '0.25rem 0.75rem',
              borderRadius: '20px',
              fontSize: '0.75rem',
              fontWeight: '600'
            }}>
              Elektromobilität
            </span>
          </div>
          <h1 style={{ 
            color: 'white', 
            fontSize: '2.5rem',
            fontWeight: 'bold',
            lineHeight: '1.2',
            marginBottom: '1rem'
          }}>
            Elektroauto-Wartung: Was Werkstätten über E-Autos wissen müssen
          </h1>
          <p style={{ 
            color: '#d1d5db', 
            fontSize: '1.125rem',
            lineHeight: '1.6',
            marginBottom: '2rem'
          }}>
            2025 werden 30% aller Neuwagen elektrisch sein. Werkstätten stehen vor der größten 
            technischen Revolution seit Erfindung des Autos. Hier ist Ihr kompletter Leitfaden.
          </p>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '1rem',
            fontSize: '0.875rem',
            color: '#9ca3af'
          }}>
            <span>📅 15. Januar 2025</span>
            <span>📖 12 Min. Lesezeit</span>
            <span>👤 Ing. Marco Schneider, E-Mobility Experte</span>
          </div>
        </header>

        <div style={{ color: '#e5e7eb', lineHeight: '1.8', fontSize: '1rem' }}>
          
          <GlassCard style={{ marginBottom: '2rem', padding: '1.5rem' }}>
            <h2 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '1rem' }}>
              Die E-Auto Revolution: Zahlen und Fakten
            </h2>
            <p style={{ marginBottom: '1rem' }}>
              Die Elektromobilität ist nicht mehr aufzuhalten. Deutschland hat sich das Ziel gesetzt, 
              bis 2030 <strong>15 Millionen E-Autos</strong> auf die Straße zu bringen. 
              Für Werkstätten bedeutet das: Anpassung oder Bedeutungslosigkeit.
            </p>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minMax(200px, 1fr))',
              gap: '1rem',
              marginBottom: '1.5rem'
            }}>
              <div style={{
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                padding: '1rem',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔋</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981' }}>7,8 Mio</div>
                <div style={{ fontSize: '0.875rem' }}>E-Autos in Deutschland bis 2025</div>
              </div>
              <div style={{
                background: 'rgba(245, 158, 11, 0.1)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                padding: '1rem',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⚡</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f59e0b' }}>60%</div>
                <div style={{ fontSize: '0.875rem' }}>weniger Wartungsaufwand</div>
              </div>
              <div style={{
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                padding: '1rem',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💰</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3b82f6' }}>€850</div>
                <div style={{ fontSize: '0.875rem' }}>durchschn. Wartungskosten/Jahr</div>
              </div>
              <div style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                padding: '1rem',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🏭</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ef4444' }}>23%</div>
                <div style={{ fontSize: '0.875rem' }}>der Werkstätten E-Auto-ready</div>
              </div>
            </div>

            <div style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              padding: '1rem',
              borderRadius: '8px'
            }}>
              <h4 style={{ color: '#ef4444', fontSize: '1rem', marginBottom: '0.5rem' }}>⚠️ Die Herausforderung:</h4>
              <p style={{ fontSize: '0.875rem', margin: 0 }}>
                Nur 23% der deutschen Werkstätten sind aktuell für E-Auto-Service gerüstet. 
                Gleichzeitig steigt der Marktanteil von Elektrofahrzeugen monatlich um 2-3%. 
                Werkstätten, die jetzt nicht handeln, verlieren ab 2026 signifikante Marktanteile.
              </p>
            </div>
          </GlassCard>

          <GlassCard style={{ marginBottom: '2rem', padding: '1.5rem' }}>
            <h2 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '1rem' }}>
              E-Auto vs. Verbrenner: Die wichtigsten Unterschiede
            </h2>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minMax(300px, 1fr))',
              gap: '1.5rem'
            }}>
              <div style={{
                background: 'rgba(34, 197, 94, 0.1)',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                padding: '1.5rem',
                borderRadius: '12px'
              }}>
                <h3 style={{ color: '#22c55e', fontSize: '1.25rem', marginBottom: '1rem' }}>✅ Weniger Wartung nötig</h3>
                <ul style={{ paddingLeft: '1rem', fontSize: '0.875rem', marginBottom: '1rem' }}>
                  <li><strong>Kein Ölwechsel</strong> - E-Motor hat weniger bewegliche Teile</li>
                  <li><strong>Weniger Verschleißteile</strong> - keine Zündkerzen, Keilriemen</li>
                  <li><strong>Regeneratives Bremsen</strong> - Bremsbeläge halten 2x länger</li>
                  <li><strong>Einfachere Kühlung</strong> - weniger komplexe Systeme</li>
                </ul>
                <div style={{
                  background: 'rgba(34, 197, 94, 0.2)',
                  padding: '0.5rem',
                  borderRadius: '4px',
                  fontSize: '0.75rem'
                }}>
                  <strong>Wartungsintervall:</strong> 15.000-20.000 km (statt 10.000-15.000 km)
                </div>
              </div>
              
              <div style={{
                background: 'rgba(245, 158, 11, 0.1)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                padding: '1.5rem',
                borderRadius: '12px'
              }}>
                <h3 style={{ color: '#f59e0b', fontSize: '1.25rem', marginBottom: '1rem' }}>🔄 Neue Wartungsbereiche</h3>
                <ul style={{ paddingLeft: '1rem', fontSize: '0.875rem', marginBottom: '1rem' }}>
                  <li><strong>Batterie-Management</strong> - Kapazitätstests, Zell-Balancing</li>
                  <li><strong>Hochvolt-Systeme</strong> - Isolationsprüfung, Leckage-Tests</li>
                  <li><strong>Ladegerät/Inverter</strong> - Software-Updates, Diagnose</li>
                  <li><strong>Klimaanlage</strong> - R744/R1234yf Kältemittel</li>
                </ul>
                <div style={{
                  background: 'rgba(245, 158, 11, 0.2)',
                  padding: '0.5rem',
                  borderRadius: '4px',
                  fontSize: '0.75rem'
                }}>
                  <strong>Spezialwerkzeug:</strong> Hochvolt-Prüfgeräte ab €8.500
                </div>
              </div>

              <div style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                padding: '1.5rem',
                borderRadius: '12px'
              }}>
                <h3 style={{ color: '#ef4444', fontSize: '1.25rem', marginBottom: '1rem' }}>⚠️ Sicherheitsaspekte</h3>
                <ul style={{ paddingLeft: '1rem', fontSize: '0.875rem', marginBottom: '1rem' }}>
                  <li><strong>Hochspannung</strong> - bis 800V (lebensgefährlich!)</li>
                  <li><strong>Spezielle Schutzkleidung</strong> - isolierte Handschuhe, Schuhe</li>
                  <li><strong>Freischaltung</strong> - vor allen Arbeiten zwingend nötig</li>
                  <li><strong>Brand-/Explosionsgefahr</strong> - bei Batterieschäden</li>
                </ul>
                <div style={{
                  background: 'rgba(239, 68, 68, 0.2)',
                  padding: '0.5rem',
                  borderRadius: '4px',
                  fontSize: '0.75rem'
                }}>
                  <strong>Qualifikation:</strong> Hochvolt-Schein zwingend erforderlich
                </div>
              </div>
            </div>

            <div style={{
              background: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              padding: '1rem',
              borderRadius: '8px',
              marginTop: '1.5rem'
            }}>
              <h4 style={{ color: '#3b82f6', fontSize: '1rem', marginBottom: '0.5rem' }}>💡 Wichtiger Unterschied:</h4>
              <p style={{ fontSize: '0.875rem', margin: 0 }}>
                <strong>Verbrenner:</strong> Viele kleine, häufige Wartungen<br />
                <strong>E-Auto:</strong> Wenige, aber spezialisiertere Eingriffe mit höherem Stundensatz
              </p>
            </div>
          </GlassCard>

          <GlassCard style={{ marginBottom: '2rem', padding: '1.5rem' }}>
            <h2 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '1rem' }}>
              E-Auto Wartungsplan: Was wann zu tun ist
            </h2>
            
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ color: '#22c55e', fontSize: '1.25rem', marginBottom: '1rem' }}>
                🔋 Jährliche Wartung (15.000-20.000 km)
              </h3>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minMax(250px, 1fr))',
                gap: '1rem',
                marginBottom: '1.5rem'
              }}>
                <div style={{
                  background: 'rgba(34, 197, 94, 0.1)',
                  border: '1px solid rgba(34, 197, 94, 0.3)',
                  padding: '1rem',
                  borderRadius: '8px'
                }}>
                  <h4 style={{ color: '#22c55e', fontSize: '1rem', marginBottom: '0.5rem' }}>🔌 Hochvolt-System</h4>
                  <ul style={{ paddingLeft: '1rem', fontSize: '0.875rem', margin: 0 }}>
                    <li>Isolationswiderstand prüfen</li>
                    <li>HV-Kabel auf Beschädigungen</li>
                    <li>Steckverbindungen checken</li>
                    <li>Fehlerspeicher auslesen</li>
                  </ul>
                </div>
                
                <div style={{
                  background: 'rgba(59, 130, 246, 0.1)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  padding: '1rem',
                  borderRadius: '8px'
                }}>
                  <h4 style={{ color: '#3b82f6', fontSize: '1rem', marginBottom: '0.5rem' }}>🔋 Batterie</h4>
                  <ul style={{ paddingLeft: '1rem', fontSize: '0.875rem', margin: 0 }}>
                    <li>Kapazitätstest durchführen</li>
                    <li>Zell-Spannungen prüfen</li>
                    <li>Kühlsystem kontrollieren</li>
                    <li>BMS-Software updaten</li>
                  </ul>
                </div>

                <div style={{
                  background: 'rgba(245, 158, 11, 0.1)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  padding: '1rem',
                  borderRadius: '8px'
                }}>
                  <h4 style={{ color: '#f59e0b', fontSize: '1rem', marginBottom: '0.5rem' }}>🚗 Fahrwerk</h4>
                  <ul style={{ paddingLeft: '1rem', fontSize: '0.875rem', margin: 0 }}>
                    <li>Reifen & Luftdruck</li>
                    <li>Bremsanlage (weniger Verschleiß)</li>
                    <li>Achsvermessung</li>
                    <li>Federung/Dämpfer</li>
                  </ul>
                </div>

                <div style={{
                  background: 'rgba(168, 85, 247, 0.1)',
                  border: '1px solid rgba(168, 85, 247, 0.3)',
                  padding: '1rem',
                  borderRadius: '8px'
                }}>
                  <h4 style={{ color: '#a855f7', fontSize: '1rem', marginBottom: '0.5rem' }}>❄️ Klimaanlage</h4>
                  <ul style={{ paddingLeft: '1rem', fontSize: '0.875rem', margin: 0 }}>
                    <li>Kältemittel-Check (CO₂ oder R1234yf)</li>
                    <li>Wärmepumpe prüfen</li>
                    <li>Filter wechseln</li>
                    <li>Effizienz messen</li>
                  </ul>
                </div>
              </div>

              <div style={{
                background: 'rgba(34, 197, 94, 0.1)',
                border: '1px solid rgba(34, 197, 94, 0.2)',
                padding: '1rem',
                borderRadius: '8px'
              }}>
                <strong>💰 Durchschnittliche Kosten jährliche Wartung:</strong><br />
                Standard-Check: €280-420 | Premium-Fahrzeuge: €450-650<br />
                <span style={{ fontSize: '0.875rem', color: '#9ca3af' }}>
                  (40-60% günstiger als Verbrenner-Wartung)
                </span>
              </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ color: '#3b82f6', fontSize: '1.25rem', marginBottom: '1rem' }}>
                🔄 2-Jahres Wartung (30.000-40.000 km)
              </h3>
              
              <div style={{
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                padding: '1rem',
                borderRadius: '8px',
                marginBottom: '1rem'
              }}>
                <h4 style={{ color: '#3b82f6', fontSize: '1rem', marginBottom: '0.5rem' }}>🔧 Zusätzliche Arbeiten:</h4>
                <ul style={{ paddingLeft: '1rem', fontSize: '0.875rem', margin: 0 }}>
                  <li><strong>Getriebe-/Differential-Öl</strong> wechseln (wenn vorhanden)</li>
                  <li><strong>Bremsflüssigkeit</strong> erneuern (DOT 4/5.1)</li>
                  <li><strong>Kühlflüssigkeit</strong> für Batterie/Motor tauschen</li>
                  <li><strong>Software-Updates</strong> für alle Steuergeräte</li>
                  <li><strong>Ladekabel und -anschluss</strong> intensiv prüfen</li>
                </ul>
              </div>

              <div style={{
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                padding: '1rem',
                borderRadius: '8px'
              }}>
                <strong>💰 Kosten 2-Jahres-Wartung:</strong> €520-850<br />
                <span style={{ fontSize: '0.875rem', color: '#9ca3af' }}>
                  Inkl. Flüssigkeitswechsel und Software-Updates
                </span>
              </div>
            </div>

            <div>
              <h3 style={{ color: '#f59e0b', fontSize: '1.25rem', marginBottom: '1rem' }}>
                ⚡ Batterie-spezifische Wartung
              </h3>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minMax(200px, 1fr))',
                gap: '1rem'
              }}>
                <div style={{
                  background: 'rgba(245, 158, 11, 0.1)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  padding: '1rem',
                  borderRadius: '8px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🔋</div>
                  <div style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Kapazitätstest</div>
                  <div style={{ fontSize: '0.875rem' }}>Alle 20.000 km</div>
                  <div style={{ fontSize: '0.75rem', color: '#f59e0b' }}>€150-250</div>
                </div>
                
                <div style={{
                  background: 'rgba(245, 158, 11, 0.1)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  padding: '1rem',
                  borderRadius: '8px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>⚖️</div>
                  <div style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Zell-Balancing</div>
                  <div style={{ fontSize: '0.875rem' }}>Bei Bedarf</div>
                  <div style={{ fontSize: '0.75rem', color: '#f59e0b' }}>€200-400</div>
                </div>

                <div style={{
                  background: 'rgba(245, 158, 11, 0.1)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  padding: '1rem',
                  borderRadius: '8px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🌡️</div>
                  <div style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Kühlsystem</div>
                  <div style={{ fontSize: '0.875rem' }}>Alle 40.000 km</div>
                  <div style={{ fontSize: '0.75rem', color: '#f59e0b' }}>€180-320</div>
                </div>

                <div style={{
                  background: 'rgba(245, 158, 11, 0.1)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  padding: '1rem',
                  borderRadius: '8px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>💾</div>
                  <div style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Software-Update</div>
                  <div style={{ fontSize: '0.875rem' }}>Alle 6-12 Monate</div>
                  <div style={{ fontSize: '0.75rem', color: '#f59e0b' }}>€80-150</div>
                </div>
              </div>
            </div>
          </GlassCard>

          <GlassCard style={{ marginBottom: '2rem', padding: '1.5rem' }}>
            <h2 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '1rem' }}>
              Häufige E-Auto Reparaturen und Diagnose
            </h2>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minMax(280px, 1fr))',
              gap: '1.5rem'
            }}>
              <div style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                padding: '1.5rem',
                borderRadius: '12px'
              }}>
                <h3 style={{ color: '#ef4444', fontSize: '1.25rem', marginBottom: '1rem' }}>⚡ Ladeproblem</h3>
                <p style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>
                  <strong>Symptom:</strong> Fahrzeug lädt nicht/langsam
                </p>
                <h4 style={{ color: '#ef4444', fontSize: '1rem', marginBottom: '0.5rem' }}>Mögliche Ursachen:</h4>
                <ul style={{ paddingLeft: '1rem', fontSize: '0.875rem', marginBottom: '1rem' }}>
                  <li>Defekte Ladebuchse (€350-800)</li>
                  <li>On-Board-Charger defekt (€1.200-2.500)</li>
                  <li>BMS-Fehler (€200-500 Diagnose)</li>
                  <li>Isolationsfehler (€150-400)</li>
                </ul>
                <div style={{
                  background: 'rgba(239, 68, 68, 0.2)',
                  padding: '0.5rem',
                  borderRadius: '4px',
                  fontSize: '0.75rem'
                }}>
                  <strong>Diagnosezeit:</strong> 1-2h | <strong>Häufigkeit:</strong> 12% aller E-Auto Probleme
                </div>
              </div>
              
              <div style={{
                background: 'rgba(245, 158, 11, 0.1)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                padding: '1.5rem',
                borderRadius: '12px'
              }}>
                <h3 style={{ color: '#f59e0b', fontSize: '1.25rem', marginBottom: '1rem' }}>🔋 Batterie-Kapazitätsverlust</h3>
                <p style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>
                  <strong>Symptom:</strong> Deutlich reduzierte Reichweite
                </p>
                <h4 style={{ color: '#f59e0b', fontSize: '1rem', marginBottom: '0.5rem' }}>Mögliche Ursachen:</h4>
                <ul style={{ paddingLeft: '1rem', fontSize: '0.875rem', marginBottom: '1rem' }}>
                  <li>Natürliche Alterung (1-2% pro Jahr)</li>
                  <li>Zell-Unbalance (€300-600 Balancing)</li>
                  <li>Kühlsystem-Probleme (€400-1.200)</li>
                  <li>Defekte Zellen (€2.000-8.000)</li>
                </ul>
                <div style={{
                  background: 'rgba(245, 158, 11, 0.2)',
                  padding: '0.5rem',
                  borderRadius: '4px',
                  fontSize: '0.75rem'
                }}>
                  <strong>Diagnosezeit:</strong> 2-4h | <strong>Häufigkeit:</strong> 8% aller Fälle
                </div>
              </div>

              <div style={{
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                padding: '1.5rem',
                borderRadius: '12px'
              }}>
                <h3 style={{ color: '#3b82f6', fontSize: '1.25rem', marginBottom: '1rem' }}>🔧 Antrieb/Motor</h3>
                <p style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>
                  <strong>Symptom:</strong> Leistungsverlust, Geräusche
                </p>
                <h4 style={{ color: '#3b82f6', fontSize: '1rem', marginBottom: '0.5rem' }}>Mögliche Ursachen:</h4>
                <ul style={{ paddingLeft: '1rem', fontSize: '0.875rem', marginBottom: '1rem' }}>
                  <li>Inverter-Probleme (€800-2.000)</li>
                  <li>Motor-Lager defekt (€1.500-3.500)</li>
                  <li>Resolver/Encoder Fehler (€200-600)</li>
                  <li>Kühlmittel-Leckage (€150-800)</li>
                </ul>
                <div style={{
                  background: 'rgba(59, 130, 246, 0.2)',
                  padding: '0.5rem',
                  borderRadius: '4px',
                  fontSize: '0.75rem'
                }}>
                  <strong>Diagnosezeit:</strong> 1-3h | <strong>Häufigkeit:</strong> 6% aller Fälle
                </div>
              </div>

              <div style={{
                background: 'rgba(34, 197, 94, 0.1)',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                padding: '1.5rem',
                borderRadius: '12px'
              }}>
                <h3 style={{ color: '#22c55e', fontSize: '1.25rem', marginBottom: '1rem' }}>❄️ Klimaanlage</h3>
                <p style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>
                  <strong>Symptom:</strong> Kühlt/heizt nicht, hoher Verbrauch
                </p>
                <h4 style={{ color: '#22c55e', fontSize: '1rem', marginBottom: '0.5rem' }}>Mögliche Ursachen:</h4>
                <ul style={{ paddingLeft: '1rem', fontSize: '0.875rem', marginBottom: '1rem' }}>
                  <li>Wärmepumpen-Defekt (€800-1.800)</li>
                  <li>Kompressor-Probleme (€600-1.400)</li>
                  <li>Kältemittel-Leckage (€200-500)</li>
                  <li>Sensor-Ausfälle (€80-250)</li>
                </ul>
                <div style={{
                  background: 'rgba(34, 197, 94, 0.2)',
                  padding: '0.5rem',
                  borderRadius: '4px',
                  fontSize: '0.75rem'
                }}>
                  <strong>Diagnosezeit:</strong> 1-2h | <strong>Häufigkeit:</strong> 15% aller Fälle
                </div>
              </div>

              <div style={{
                background: 'rgba(168, 85, 247, 0.1)',
                border: '1px solid rgba(168, 85, 247, 0.3)',
                padding: '1.5rem',
                borderRadius: '12px'
              }}>
                <h3 style={{ color: '#a855f7', fontSize: '1.25rem', marginBottom: '1rem' }}>💻 Software-Probleme</h3>
                <p style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>
                  <strong>Symptom:</strong> Display-Fehler, System-Hänger
                </p>
                <h4 style={{ color: '#a855f7', fontSize: '1rem', marginBottom: '0.5rem' }}>Mögliche Ursachen:</h4>
                <ul style={{ paddingLeft: '1rem', fontSize: '0.875rem', marginBottom: '1rem' }}>
                  <li>Veraltete Software (€50-150 Update)</li>
                  <li>Steuergerät-Defekt (€300-1.200)</li>
                  <li>Netzwerk-Probleme (€100-400)</li>
                  <li>Memory-Overflow (€80-200 Reset)</li>
                </ul>
                <div style={{
                  background: 'rgba(168, 85, 247, 0.2)',
                  padding: '0.5rem',
                  borderRadius: '4px',
                  fontSize: '0.75rem'
                }}>
                  <strong>Diagnosezeit:</strong> 0,5-2h | <strong>Häufigkeit:</strong> 25% aller Fälle
                </div>
              </div>

              <div style={{
                background: 'rgba(6, 182, 212, 0.1)',
                border: '1px solid rgba(6, 182, 212, 0.3)',
                padding: '1.5rem',
                borderRadius: '12px'
              }}>
                <h3 style={{ color: '#06b6d4', fontSize: '1.25rem', marginBottom: '1rem' }}>🚗 Fahrwerk-Standard</h3>
                <p style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>
                  <strong>Symptom:</strong> Wie bei Verbrennern
                </p>
                <h4 style={{ color: '#06b6d4', fontSize: '1rem', marginBottom: '0.5rem' }}>Häufige Reparaturen:</h4>
                <ul style={{ paddingLeft: '1rem', fontSize: '0.875rem', marginBottom: '1rem' }}>
                  <li>Reifen (halten kürzer: Rekuperation)</li>
                  <li>Stoßdämpfer (Mehrgewicht)</li>
                  <li>Spurstangen/Lager</li>
                  <li>Bremsscheiben (seltener)</li>
                </ul>
                <div style={{
                  background: 'rgba(6, 182, 212, 0.2)',
                  padding: '0.5rem',
                  borderRadius: '4px',
                  fontSize: '0.75rem'
                }}>
                  <strong>Besonderheit:</strong> Ähnlich wie Verbrenner, aber höhere Belastung durch Gewicht
                </div>
              </div>
            </div>
          </GlassCard>

          <GlassCard style={{ marginBottom: '2rem', padding: '1.5rem' }}>
            <h2 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '1rem' }}>
              Qualifikation & Zertifizierung für E-Auto Service
            </h2>
            
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ color: '#ef4444', fontSize: '1.25rem', marginBottom: '1rem' }}>
                ⚡ Hochvolt-Qualifikation (HV-Schein)
              </h3>
              
              <div style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                padding: '1rem',
                borderRadius: '8px',
                marginBottom: '1.5rem'
              }}>
                <h4 style={{ color: '#ef4444', fontSize: '1rem', marginBottom: '0.5rem' }}>🚨 Rechtlich verpflichtend!</h4>
                <p style={{ fontSize: '0.875rem', margin: 0 }}>
                  Arbeiten an Hochvolt-Systemen (&gt;60V) dürfen nur von qualifiziertem Personal 
                  durchgeführt werden. Ohne HV-Schein: <strong>Versicherungsschutz erlischt!</strong>
                </p>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minMax(250px, 1fr))',
                gap: '1rem'
              }}>
                <div style={{
                  background: 'rgba(34, 197, 94, 0.1)',
                  border: '1px solid rgba(34, 197, 94, 0.3)',
                  padding: '1rem',
                  borderRadius: '8px'
                }}>
                  <h4 style={{ color: '#22c55e', fontSize: '1rem', marginBottom: '0.5rem' }}>📚 Stufe 1: Grundlagen</h4>
                  <ul style={{ paddingLeft: '1rem', fontSize: '0.875rem', marginBottom: '1rem' }}>
                    <li>2-3 Tage Theorie</li>
                    <li>Sicherheitsbestimmungen</li>
                    <li>Grundlagen Elektrotechnik</li>
                    <li>Erste Hilfe bei Stromunfällen</li>
                  </ul>
                  <div style={{ fontSize: '0.75rem', color: '#22c55e' }}>
                    <strong>Kosten:</strong> €800-1.200<br />
                    <strong>Berechtigt:</strong> Freischaltung, Messungen
                  </div>
                </div>
                
                <div style={{
                  background: 'rgba(59, 130, 246, 0.1)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  padding: '1rem',
                  borderRadius: '8px'
                }}>
                  <h4 style={{ color: '#3b82f6', fontSize: '1rem', marginBottom: '0.5rem' }}>🔧 Stufe 2: Arbeiten</h4>
                  <ul style={{ paddingLeft: '1rem', fontSize: '0.875rem', marginBottom: '1rem' }}>
                    <li>Zusätzlich 2 Tage Praxis</li>
                    <li>Reparatur-Techniken</li>
                    <li>Spezialwerkzeuge</li>
                    <li>Prüfverfahren</li>
                  </ul>
                  <div style={{ fontSize: '0.75rem', color: '#3b82f6' }}>
                    <strong>Kosten:</strong> €1.500-2.200<br />
                    <strong>Berechtigt:</strong> HV-Komponenten reparieren
                  </div>
                </div>

                <div style={{
                  background: 'rgba(245, 158, 11, 0.1)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  padding: '1rem',
                  borderRadius: '8px'
                }}>
                  <h4 style={{ color: '#f59e0b', fontSize: '1rem', marginBottom: '0.5rem' }}>👨‍🏫 Stufe 3: Spezialist</h4>
                  <ul style={{ paddingLeft: '1rem', fontSize: '0.875rem', marginBottom: '1rem' }}>
                    <li>Zusätzlich 3 Tage Vertiefung</li>
                    <li>Batterietechnik</li>
                    <li>Diagnose-Systeme</li>
                    <li>Schulungsberechtigung</li>
                  </ul>
                  <div style={{ fontSize: '0.75rem', color: '#f59e0b' }}>
                    <strong>Kosten:</strong> €2.500-3.500<br />
                    <strong>Berechtigt:</strong> Vollumfängliche HV-Arbeiten
                  </div>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ color: '#3b82f6', fontSize: '1.25rem', marginBottom: '1rem' }}>
                🏭 Herstellerqualifikationen
              </h3>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minMax(280px, 1fr))',
                gap: '1rem'
              }}>
                <div style={{
                  background: 'rgba(59, 130, 246, 0.1)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  padding: '1rem',
                  borderRadius: '8px'
                }}>
                  <h4 style={{ color: '#3b82f6', fontSize: '1rem', marginBottom: '0.5rem' }}>🔋 Tesla Certified</h4>
                  <p style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                    Zugang zu Original-Diagnose und Ersatzteilen
                  </p>
                  <div style={{ fontSize: '0.75rem' }}>
                    <strong>Dauer:</strong> 5 Tage | <strong>Kosten:</strong> €3.500-5.000<br />
                    <strong>Voraussetzung:</strong> HV-Schein Stufe 2
                  </div>
                </div>
                
                <div style={{
                  background: 'rgba(34, 197, 94, 0.1)',
                  border: '1px solid rgba(34, 197, 94, 0.3)',
                  padding: '1rem',
                  borderRadius: '8px'
                }}>
                  <h4 style={{ color: '#22c55e', fontSize: '1rem', marginBottom: '0.5rem' }}>⭐ Mercedes EQS</h4>
                  <p style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                    Spezialisierung auf Mercedes E-Fahrzeuge
                  </p>
                  <div style={{ fontSize: '0.75rem' }}>
                    <strong>Dauer:</strong> 3 Tage | <strong>Kosten:</strong> €2.200-3.200<br />
                    <strong>Benefit:</strong> Garantie-Arbeiten möglich
                  </div>
                </div>

                <div style={{
                  background: 'rgba(245, 158, 11, 0.1)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  padding: '1rem',
                  borderRadius: '8px'
                }}>
                  <h4 style={{ color: '#f59e0b', fontSize: '1rem', marginBottom: '0.5rem' }}>🚙 BMW i-Series</h4>
                  <p style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                    Fokus auf BMW Elektro- und Hybridfahrzeuge
                  </p>
                  <div style={{ fontSize: '0.75rem' }}>
                    <strong>Dauer:</strong> 4 Tage | <strong>Kosten:</strong> €2.800-4.000<br />
                    <strong>Special:</strong> ISTA+ Diagnosezugang
                  </div>
                </div>

                <div style={{
                  background: 'rgba(168, 85, 247, 0.1)',
                  border: '1px solid rgba(168, 85, 247, 0.3)',
                  padding: '1rem',
                  borderRadius: '8px'
                }}>
                  <h4 style={{ color: '#a855f7', fontSize: '1rem', marginBottom: '0.5rem' }}>🔺 Audi e-tron</h4>
                  <p style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                    VW-Group Elektrofahrzeuge (Audi, VW, Porsche)
                  </p>
                  <div style={{ fontSize: '0.75rem' }}>
                    <strong>Dauer:</strong> 3 Tage | <strong>Kosten:</strong> €2.500-3.800<br />
                    <strong>Abdeckung:</strong> Alle VW-Group E-Models
                  </div>
                </div>
              </div>
            </div>

            <div style={{
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              padding: '1rem',
              borderRadius: '8px'
            }}>
              <h4 style={{ color: '#10b981', fontSize: '1rem', marginBottom: '0.5rem' }}>💡 Investitions-Tipp:</h4>
              <p style={{ fontSize: '0.875rem', margin: 0 }}>
                Beginnen Sie mit HV-Stufe 2 (€1.500) + einer Herstellerqualifikation für Ihre 
                häufigsten Fahrzeuge (€2.500). <strong>Gesamtinvestition: ca. €4.000</strong> - 
                amortisiert sich durch 15-20 E-Auto Services.
              </p>
            </div>
          </GlassCard>

          <GlassCard style={{ marginBottom: '2rem', padding: '1.5rem' }}>
            <h2 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '1rem' }}>
              Business Case: E-Auto Service als Chance
            </h2>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minMax(250px, 1fr))',
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
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#22c55e' }}>+40%</div>
                <div style={{ fontSize: '0.875rem' }}>Höhere Stundensätze</div>
                <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.5rem' }}>
                  Spezial-Know-how = Premium-Preise
                </div>
              </div>
              <div style={{
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                padding: '1.5rem',
                borderRadius: '12px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>👥</div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3b82f6' }}>Jüngere</div>
                <div style={{ fontSize: '0.875rem' }}>Zielgruppe</div>
                <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.5rem' }}>
                  E-Auto Fahrer: 32-48 Jahre Durchschnitt
                </div>
              </div>
              <div style={{
                background: 'rgba(245, 158, 11, 0.1)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                padding: '1.5rem',
                borderRadius: '12px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🎯</div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f59e0b' }}>Weniger</div>
                <div style={{ fontSize: '0.875rem' }}>Konkurrenz</div>
                <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.5rem' }}>
                  77% der Werkstätten noch nicht bereit
                </div>
              </div>
              <div style={{
                background: 'rgba(168, 85, 247, 0.1)',
                border: '1px solid rgba(168, 85, 247, 0.3)',
                padding: '1.5rem',
                borderRadius: '12px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>📈</div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#a855f7' }}>Zukunft</div>
                <div style={{ fontSize: '0.875rem' }}>sicher</div>
                <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.5rem' }}>
                  15 Mio. E-Autos bis 2030 geplant
                </div>
              </div>
            </div>

            <h3 style={{ color: '#22c55e', fontSize: '1.25rem', marginBottom: '1rem' }}>
              💡 Neue Umsatzquellen für E-Auto Werkstätten
            </h3>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minMax(280px, 1fr))',
              gap: '1rem'
            }}>
              <div style={{
                background: 'rgba(34, 197, 94, 0.1)',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                padding: '1rem',
                borderRadius: '8px'
              }}>
                <h4 style={{ color: '#22c55e', fontSize: '1rem', marginBottom: '0.5rem' }}>🏥 Batterie Health-Checks</h4>
                <p style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                  Monatliche Kapazitäts-/Gesundheitsprüfungen
                </p>
                <div style={{ fontSize: '0.75rem' }}>
                  <strong>Preis:</strong> €89-149/Check<br />
                  <strong>Potenzial:</strong> 50+ Checks/Monat
                </div>
              </div>
              
              <div style={{
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                padding: '1rem',
                borderRadius: '8px'
              }}>
                <h4 style={{ color: '#3b82f6', fontSize: '1rem', marginBottom: '0.5rem' }}>💾 Software-Updates</h4>
                <p style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                  Over-the-Air Updates als Service
                </p>
                <div style={{ fontSize: '0.75rem' }}>
                  <strong>Preis:</strong> €50-120/Update<br />
                  <strong>Häufigkeit:</strong> 4-6x pro Jahr
                </div>
              </div>

              <div style={{
                background: 'rgba(245, 158, 11, 0.1)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                padding: '1rem',
                borderRadius: '8px'
              }}>
                <h4 style={{ color: '#f59e0b', fontSize: '1rem', marginBottom: '0.5rem' }}>🔌 Lade-Infrastruktur</h4>
                <p style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                  Wallbox-Installation und -wartung
                </p>
                <div style={{ fontSize: '0.75rem' }}>
                  <strong>Installation:</strong> €800-1.500<br />
                  <strong>Wartung:</strong> €120/Jahr
                </div>
              </div>

              <div style={{
                background: 'rgba(168, 85, 247, 0.1)',
                border: '1px solid rgba(168, 85, 247, 0.3)',
                padding: '1rem',
                borderRadius: '8px'
              }}>
                <h4 style={{ color: '#a855f7', fontSize: '1rem', marginBottom: '0.5rem' }}>📊 Fleet Management</h4>
                <p style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                  Betriebsflotten-Betreuung E-Fahrzeuge
                </p>
                <div style={{ fontSize: '0.75rem' }}>
                  <strong>Monatlich:</strong> €80-150/Fahrzeug<br />
                  <strong>Zusatz:</strong> Reporting & Beratung
                </div>
              </div>

              <div style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                padding: '1rem',
                borderRadius: '8px'
              }}>
                <h4 style={{ color: '#ef4444', fontSize: '1rem', marginBottom: '0.5rem' }}>🎓 Schulungen & Beratung</h4>
                <p style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                  E-Mobility Consulting für Unternehmen
                </p>
                <div style={{ fontSize: '0.75rem' }}>
                  <strong>Tagessatz:</strong> €800-1.200<br />
                  <strong>Workshop:</strong> €150/Teilnehmer
                </div>
              </div>

              <div style={{
                background: 'rgba(6, 182, 212, 0.1)',
                border: '1px solid rgba(6, 182, 212, 0.3)',
                padding: '1rem',
                borderRadius: '8px'
              }}>
                <h4 style={{ color: '#06b6d4', fontSize: '1rem', marginBottom: '0.5rem' }}>🔄 Retrofit-Services</h4>
                <p style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                  Nachrüstung von E-Komponenten
                </p>
                <div style={{ fontSize: '0.75rem' }}>
                  <strong>Projekt:</strong> €2.500-8.000<br />
                  <strong>Beispiel:</strong> E-Bike Umbausätze
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
              Bereit für die E-Auto Zukunft?
            </h2>
            <p style={{ marginBottom: '2rem', fontSize: '1.125rem' }}>
              Lassen Sie uns gemeinsam Ihre Werkstatt für die Elektromobilität fit machen. 
              Kostenlose Beratung zur E-Auto Qualifikation und Geschäftsstrategie.
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
                🔋 E-Mobility Beratung
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
                📋 HV-Qualifikation Infos
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
                Ing. Marco Schneider
              </h4>
              <p style={{ color: '#9ca3af', fontSize: '0.875rem', margin: 0 }}>
                E-Mobility Experte mit 12 Jahren Erfahrung in Elektrofahrzeug-Entwicklung und Werkstatt-Beratung
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