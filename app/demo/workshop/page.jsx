'use client';
import { useState } from 'react';
import ModernNavigation from '@/components/ModernNavigation';
import { GlassCard, PrimaryButton, SecondaryButton } from '@/components/SharedLayout';

export default function ChatDemo() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hallo! Ich bin CarBot, Ihr KI-Serviceberater. Wie kann ich Ihnen heute helfen? Sie können mir zum Beispiel Fahrzeugprobleme schildern oder nach Terminen fragen.'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: data.choices[0].message.content },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Entschuldigung, es gab einen Fehler beim Verarbeiten Ihrer Nachricht. Versuchen Sie es bitte erneut.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    'Mein Auto macht seltsame Geräusche beim Bremsen',
    'Ich brauche einen Termin für den Ölwechsel',
    'Wie viel kostet eine Inspektion?',
    'Meine Warnleuchte im Dashboard leuchtet'
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #111827 50%, #1e293b 100%)',
      color: 'white',
      fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <ModernNavigation variant="page" />
      
      <main style={{ paddingTop: '4rem' }}>
        <div style={{
          maxWidth: '900px',
          margin: '0 auto',
          padding: '2rem 1.5rem'
        }}>
        {/* Demo Introduction */}
        <div style={{
          textAlign: 'center',
          marginBottom: '3rem'
        }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            color: 'white',
            marginBottom: '1rem'
          }}>
            CarBot Live Demo
          </h1>
          <p style={{
            fontSize: '1.25rem',
            color: '#d1d5db',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Testen Sie unseren KI-Serviceberater! Stellen Sie Fragen zu Fahrzeugproblemen, 
            buchen Sie Termine oder lassen Sie sich beraten.
          </p>
        </div>

        {/* Chat Container */}
        <GlassCard style={{
          height: '500px',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Messages Area */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1rem',
            marginBottom: '1rem'
          }}>
            {messages.map((message, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
                  marginBottom: '1rem'
                }}
              >
                <div style={{
                  maxWidth: '70%',
                  padding: '0.75rem 1rem',
                  borderRadius: '12px',
                  background: message.role === 'user' 
                    ? 'linear-gradient(135deg, #ea580c 0%, #9333ea 100%)' 
                    : 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  border: message.role === 'assistant' ? '1px solid rgba(255, 255, 255, 0.2)' : 'none'
                }}>
                  {message.role === 'assistant' && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      marginBottom: '0.5rem',
                      fontSize: '0.875rem',
                      opacity: 0.8
                    }}>
                      <div style={{
                        width: '20px',
                        height: '20px',
                        background: 'linear-gradient(135deg, #ea580c 0%, #9333ea 100%)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <svg width="12" height="12" fill="white" viewBox="0 0 24 24">
                          <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99z"/>
                        </svg>
                      </div>
                      CarBot
                    </div>
                  )}
                  <div style={{ lineHeight: '1.5' }}>
                    {message.content}
                  </div>
                </div>
              </div>
            ))}
            
            {loading && (
              <div style={{
                display: 'flex',
                justifyContent: 'flex-start',
                marginBottom: '1rem'
              }}>
                <div style={{
                  padding: '0.75rem 1rem',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#d1d5db'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <div style={{
                      width: '8px',
                      height: '8px',
                      background: '#fb923c',
                      borderRadius: '50%',
                      animation: 'pulse 1.5s ease-in-out infinite'
                    }}></div>
                    <div style={{
                      width: '8px',
                      height: '8px',
                      background: '#fb923c',
                      borderRadius: '50%',
                      animation: 'pulse 1.5s ease-in-out infinite 0.3s'
                    }}></div>
                    <div style={{
                      width: '8px',
                      height: '8px',
                      background: '#fb923c',
                      borderRadius: '50%',
                      animation: 'pulse 1.5s ease-in-out infinite 0.6s'
                    }}></div>
                    <span style={{ marginLeft: '0.5rem' }}>CarBot tippt...</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '1rem'
          }}>
            <div style={{
              display: 'flex',
              gap: '0.75rem',
              alignItems: 'stretch'
            }}>
              <div style={{ flex: 1 }}>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  placeholder="Stellen Sie Ihre Frage..."
                  style={{
                    width: '100%',
                    height: '50px',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    fontSize: '1rem',
                    resize: 'none',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'stretch'
              }}>
                <PrimaryButton
                  onClick={sendMessage}
                  style={{
                    minWidth: '80px',
                    height: '50px',
                    padding: '0 1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: loading || !input.trim() ? 0.5 : 1,
                    cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: '600'
                  }}
                  disabled={loading || !input.trim()}
                >
                  {loading ? 'Lädt...' : 'Senden'}
                </PrimaryButton>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Quick Actions */}
        <div style={{
          marginTop: '2rem'
        }}>
          <h3 style={{
            color: 'white',
            fontWeight: '600',
            marginBottom: '1rem',
            textAlign: 'center'
          }}>
            Schnelle Beispielfragen:
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1rem'
          }}>
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => setInput(action)}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  padding: '0.75rem',
                  color: '#d1d5db',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  textAlign: 'left',
                  fontSize: '0.875rem'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                }}
              >
                "{action}"
              </button>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div style={{
          textAlign: 'center',
          marginTop: '3rem'
        }}>
          <GlassCard style={{
            maxWidth: '500px',
            margin: '0 auto',
            textAlign: 'center'
          }}>
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: 'white',
              marginBottom: '1rem'
            }}>
              Überzeugt?
            </h3>
            <p style={{
              color: '#d1d5db',
              marginBottom: '1.5rem'
            }}>
              Starten Sie noch heute mit CarBot und revolutionieren Sie Ihren Kundenservice.
            </p>
            <div style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              <PrimaryButton href="/auth/register">
                Kostenlos testen
              </PrimaryButton>
              <SecondaryButton href="/pricing">
                Preise ansehen
              </SecondaryButton>
            </div>
          </GlassCard>
        </div>
        </div>
      </main>
      
      {/* Professional Footer */}
      <footer style={{
        background: 'rgba(0, 0, 0, 0.2)',
        backdropFilter: 'blur(10px)',
        borderTop: '1px solid rgba(107, 114, 128, 1)',
        marginTop: '4rem',
        padding: '3rem 1.5rem'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          textAlign: 'center',
          color: '#9ca3af'
        }}>
          <p>&copy; 2025 CarBot. Alle Rechte vorbehalten.</p>
          <p style={{ marginTop: '1rem' }}>
            <a href="mailto:support@carbot.chat" style={{ color: '#9ca3af', textDecoration: 'none' }}>
              support@carbot.chat
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}