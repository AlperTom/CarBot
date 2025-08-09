'use client'
import { useState, useEffect } from 'react'

export default function WidgetPreview({ config, workshop, mode = 'desktop', isOpen = false }) {
  const [previewMessages, setPreviewMessages] = useState([])
  const [isWidgetOpen, setIsWidgetOpen] = useState(isOpen)
  const [currentInput, setCurrentInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  const simulationMessages = [
    {
      type: 'assistant',
      text: config.behavior.welcomeMessage || 'Hallo! Wie kann ich Ihnen heute helfen? 🔧'
    },
    {
      type: 'user',
      text: 'Ich brauche einen Termin für die Inspektion'
    },
    {
      type: 'assistant',
      text: 'Gerne! Für welches Fahrzeug benötigen Sie die Inspektion? Und welcher Zeitraum wäre für Sie passend?'
    },
    {
      type: 'user',
      text: 'BMW 3er, Baujahr 2018. Am liebsten nächste Woche.'
    },
    {
      type: 'assistant',
      text: 'Perfekt! Ich habe folgende Termine frei:\n\n📅 Montag, 15.01. um 14:00 Uhr\n📅 Mittwoch, 17.01. um 10:30 Uhr\n📅 Freitag, 19.01. um 16:00 Uhr\n\nWelcher Termin passt Ihnen?'
    }
  ]

  useEffect(() => {
    if (isWidgetOpen && previewMessages.length === 0) {
      // Start with welcome message
      setPreviewMessages([simulationMessages[0]])
    }
  }, [isWidgetOpen])

  const simulateMessage = () => {
    if (previewMessages.length >= simulationMessages.length) {
      // Reset simulation
      setPreviewMessages([simulationMessages[0]])
      return
    }

    const nextMessage = simulationMessages[previewMessages.length]
    
    if (nextMessage.type === 'assistant') {
      setIsTyping(true)
      setTimeout(() => {
        setIsTyping(false)
        setPreviewMessages(prev => [...prev, nextMessage])
      }, 1500)
    } else {
      setPreviewMessages(prev => [...prev, nextMessage])
    }
  }

  const toggleWidget = () => {
    setIsWidgetOpen(!isWidgetOpen)
    if (!isWidgetOpen && previewMessages.length === 0) {
      setPreviewMessages([simulationMessages[0]])
    }
  }

  const getDimensions = () => {
    switch (mode) {
      case 'mobile':
        return {
          containerWidth: '320px',
          containerHeight: '568px',
          chatWidth: '280px',
          chatHeight: '400px'
        }
      case 'tablet':
        return {
          containerWidth: '768px',
          containerHeight: '400px',
          chatWidth: config.dimensions.chatWidth + 'px',
          chatHeight: config.dimensions.chatHeight + 'px'
        }
      default:
        return {
          containerWidth: '100%',
          containerHeight: '500px',
          chatWidth: config.dimensions.chatWidth + 'px',
          chatHeight: config.dimensions.chatHeight + 'px'
        }
    }
  }

  const getPositionStyles = () => {
    const dims = getDimensions()
    const position = config.positioning.position
    
    const styles = {
      position: 'absolute',
      zIndex: config.positioning.zIndex
    }

    // Apply positioning
    if (position.includes('bottom')) {
      styles.bottom = config.positioning.offsetY + 'px'
    } else if (position.includes('top')) {
      styles.top = config.positioning.offsetY + 'px'
    } else if (position.includes('center')) {
      styles.top = '50%'
      styles.transform = 'translateY(-50%)'
    }

    if (position.includes('right')) {
      styles.right = config.positioning.offsetX + 'px'
    } else if (position.includes('left')) {
      styles.left = config.positioning.offsetX + 'px'
    }

    return styles
  }

  const dimensions = getDimensions()
  const positionStyles = getPositionStyles()

  return (
    <div style={{ padding: '20px' }}>
      {/* Preview Controls */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        padding: '10px',
        background: '#f8f9fa',
        borderRadius: '6px'
      }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button
            onClick={simulateMessage}
            style={{
              padding: '6px 12px',
              background: '#0070f3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            📝 Simulation
          </button>
          
          <button
            onClick={() => setPreviewMessages([])}
            style={{
              padding: '6px 12px',
              background: '#6b7280',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            🗑️ Reset
          </button>
        </div>

        <div style={{ fontSize: '12px', color: '#666' }}>
          {mode === 'desktop' ? '🖥️ Desktop' : 
           mode === 'tablet' ? '📱 Tablet' : 
           '📱 Mobile'} Ansicht
        </div>
      </div>

      {/* Preview Container */}
      <div style={{
        width: dimensions.containerWidth,
        height: dimensions.containerHeight,
        background: mode === 'desktop' ? 
          'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' :
          '#f8f9fa',
        borderRadius: '8px',
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid #e2e8f0',
        margin: '0 auto'
      }}>
        {/* Sample Website Content for context */}
        {mode === 'desktop' && (
          <div style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            right: '20px',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '8px',
            padding: '20px',
            color: 'white',
            backdropFilter: 'blur(10px)'
          }}>
            <h3 style={{ margin: '0 0 10px 0' }}>
              {workshop?.name || 'Ihre Werkstatt'} - Website
            </h3>
            <p style={{ margin: '0', opacity: 0.8, fontSize: '14px' }}>
              Beispiel-Website mit CarBot Widget Integration
            </p>
          </div>
        )}

        {/* Widget Trigger Button */}
        <div
          style={{
            ...positionStyles,
            width: config.dimensions.triggerSize + 'px',
            height: config.dimensions.triggerSize + 'px',
            background: config.colors.primary,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            transition: 'all 0.3s ease',
            color: 'white',
            fontSize: Math.max(12, config.dimensions.triggerSize * 0.4) + 'px',
            fontFamily: config.typography.fontFamily
          }}
          onClick={toggleWidget}
          onMouseEnter={e => {
            if (config.animations.enabled && config.animations.hoverEffect === 'scale') {
              e.target.style.transform = 'scale(1.1)'
            } else if (config.animations.enabled && config.animations.hoverEffect === 'pulse') {
              e.target.style.animation = 'pulse 1s infinite'
            }
          }}
          onMouseLeave={e => {
            e.target.style.transform = 'scale(1)'
            e.target.style.animation = 'none'
          }}
        >
          💬
        </div>

        {/* Chat Window */}
        {isWidgetOpen && (
          <div
            style={{
              position: 'absolute',
              bottom: config.positioning.position.includes('bottom') ? 
                (config.positioning.offsetY + config.dimensions.triggerSize + 10) + 'px' : 'auto',
              top: config.positioning.position.includes('top') ? 
                (config.positioning.offsetY + config.dimensions.triggerSize + 10) + 'px' : 'auto',
              right: config.positioning.position.includes('right') ? 
                config.positioning.offsetX + 'px' : 'auto',
              left: config.positioning.position.includes('left') ? 
                config.positioning.offsetX + 'px' : 'auto',
              width: dimensions.chatWidth,
              height: dimensions.chatHeight,
              background: config.colors.background,
              borderRadius: config.dimensions.borderRadius + 'px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              fontFamily: config.typography.fontFamily,
              fontSize: config.typography.fontSize,
              fontWeight: config.typography.fontWeight,
              animation: config.animations.enabled ? 
                (config.animations.openAnimation === 'slideUp' ? 'slideUp 0.3s ease' :
                 config.animations.openAnimation === 'fadeIn' ? 'fadeIn 0.3s ease' :
                 config.animations.openAnimation === 'scaleIn' ? 'scaleIn 0.3s ease' :
                 config.animations.openAnimation === 'bounceIn' ? 'bounceIn 0.5s ease' :
                 'none') : 'none'
            }}
          >
            {/* Chat Header */}
            <div style={{
              background: config.colors.primary,
              color: 'white',
              padding: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              borderRadius: `${config.dimensions.borderRadius}px ${config.dimensions.borderRadius}px 0 0`
            }}>
              {workshop?.logo_url && (
                <img
                  src={workshop.logo_url}
                  alt="Logo"
                  style={{
                    width: '32px',
                    height: '32px',
                    objectFit: 'contain',
                    background: 'white',
                    borderRadius: '4px'
                  }}
                />
              )}
              <div>
                <div style={{ fontWeight: '600' }}>
                  {workshop?.name || 'Ihre Werkstatt'}
                </div>
                <div style={{ fontSize: '12px', opacity: 0.9 }}>
                  Online-Beratung
                </div>
              </div>
              <button
                onClick={() => setIsWidgetOpen(false)}
                style={{
                  marginLeft: 'auto',
                  background: 'rgba(255,255,255,0.2)',
                  border: 'none',
                  color: 'white',
                  fontSize: '16px',
                  cursor: 'pointer',
                  borderRadius: '4px',
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                ×
              </button>
            </div>

            {/* Messages Area */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '16px',
              background: config.colors.secondary
            }}>
              {previewMessages.map((message, index) => (
                <div
                  key={index}
                  style={{
                    textAlign: message.type === 'user' ? 'right' : 'left',
                    margin: '8px 0'
                  }}
                >
                  <div style={{
                    display: 'inline-block',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: message.type === 'user' ? config.colors.primary : 'white',
                    color: message.type === 'user' ? 'white' : config.colors.text,
                    maxWidth: '85%',
                    wordWrap: 'break-word',
                    whiteSpace: 'pre-line',
                    animation: config.animations.enabled && config.animations.messageAnimation === 'fadeIn' ? 
                      'fadeIn 0.3s ease' : 'none',
                    fontSize: config.typography.fontSize,
                    fontWeight: config.typography.fontWeight,
                    border: message.type === 'assistant' ? '1px solid #e9ecef' : 'none',
                    boxShadow: message.type === 'assistant' ? '0 1px 2px rgba(0,0,0,0.1)' : 'none'
                  }}>
                    {message.text}
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && config.behavior.enableTyping && (
                <div style={{ textAlign: 'left', margin: '8px 0' }}>
                  <div style={{
                    display: 'inline-block',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: 'white',
                    color: '#666',
                    border: '1px solid #e9ecef'
                  }}>
                    <span style={{ animation: 'blink 1.4s infinite' }}>●●●</span> Schreibt...
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div style={{
              padding: '16px',
              borderTop: '1px solid #e9ecef',
              background: config.colors.background
            }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  value={currentInput}
                  onChange={e => setCurrentInput(e.target.value)}
                  onKeyPress={e => {
                    if (e.key === 'Enter' && currentInput.trim()) {
                      setPreviewMessages(prev => [...prev, { type: 'user', text: currentInput }])
                      setCurrentInput('')
                      setTimeout(() => simulateMessage(), 500)
                    }
                  }}
                  placeholder="Ihre Nachricht eingeben..."
                  style={{
                    flex: 1,
                    padding: '8px',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    fontSize: config.typography.fontSize,
                    fontFamily: config.typography.fontFamily
                  }}
                />
                <button
                  onClick={() => {
                    if (currentInput.trim()) {
                      setPreviewMessages(prev => [...prev, { type: 'user', text: currentInput }])
                      setCurrentInput('')
                      setTimeout(() => simulateMessage(), 500)
                    }
                  }}
                  style={{
                    padding: '8px 12px',
                    background: config.colors.primary,
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  ➤
                </button>
              </div>
              
              {config.behavior.showBranding && (
                <div style={{
                  fontSize: '11px',
                  color: '#9ca3af',
                  textAlign: 'center',
                  marginTop: '8px'
                }}>
                  Powered by CarBot
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Animation Styles */}
      <style jsx>{`
        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes scaleIn {
          from {
            transform: scale(0.8);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        @keyframes bounceIn {
          0% {
            transform: scale(0.3);
            opacity: 0;
          }
          50% {
            transform: scale(1.05);
          }
          70% {
            transform: scale(0.9);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        @keyframes pulse {
          0% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(0, 112, 243, 0.7);
          }
          70% {
            transform: scale(1.05);
            box-shadow: 0 0 0 10px rgba(0, 112, 243, 0);
          }
          100% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(0, 112, 243, 0);
          }
        }
        
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
      `}</style>

      {/* Preview Info */}
      <div style={{
        marginTop: '20px',
        padding: '15px',
        background: '#f8f9fa',
        borderRadius: '6px',
        fontSize: '12px',
        color: '#666'
      }}>
        <div style={{ marginBottom: '10px', fontWeight: 'bold' }}>
          💡 Interaktive Vorschau:
        </div>
        <ul style={{ margin: 0, paddingLeft: '20px' }}>
          <li>Klicken Sie auf den blauen Button um das Widget zu öffnen</li>
          <li>Nutzen Sie "Simulation" für automatische Chat-Nachrichten</li>
          <li>Schreiben Sie eigene Nachrichten in das Eingabefeld</li>
          <li>Alle Ihre Design-Änderungen werden sofort angezeigt</li>
        </ul>
      </div>
    </div>
  )
}