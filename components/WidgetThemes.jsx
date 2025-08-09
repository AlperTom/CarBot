'use client'
import { useState } from 'react'

const PREDEFINED_THEMES = [
  {
    id: 'professional-blue',
    name: 'Professionell Blau',
    description: 'Klassisches Blau für seriöse Autowerkstätten',
    category: 'professional',
    preview: '💼',
    colors: {
      primary: '#0070f3',
      secondary: '#f8fafc',
      text: '#1a202c',
      background: '#ffffff'
    },
    typography: {
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      fontSize: '14px',
      fontWeight: '400'
    },
    dimensions: {
      triggerSize: 60,
      chatWidth: 350,
      chatHeight: 500,
      borderRadius: 12
    }
  },
  {
    id: 'modern-green',
    name: 'Modern Grün',
    description: 'Umweltfreundlich und nachhaltig',
    category: 'modern',
    preview: '🌱',
    colors: {
      primary: '#10b981',
      secondary: '#f0fdf4',
      text: '#064e3b',
      background: '#ffffff'
    },
    typography: {
      fontFamily: '"Inter", sans-serif',
      fontSize: '14px',
      fontWeight: '400'
    },
    dimensions: {
      triggerSize: 55,
      chatWidth: 360,
      chatHeight: 520,
      borderRadius: 16
    }
  },
  {
    id: 'premium-gold',
    name: 'Premium Gold',
    description: 'Luxuriös für Hochklasse-Werkstätten',
    category: 'premium',
    preview: '✨',
    colors: {
      primary: '#f59e0b',
      secondary: '#fffbeb',
      text: '#78350f',
      background: '#ffffff'
    },
    typography: {
      fontFamily: '"Montserrat", sans-serif',
      fontSize: '14px',
      fontWeight: '500'
    },
    dimensions: {
      triggerSize: 65,
      chatWidth: 380,
      chatHeight: 550,
      borderRadius: 20
    }
  },
  {
    id: 'tech-purple',
    name: 'Tech Lila',
    description: 'Modern und technisch für innovative Betriebe',
    category: 'modern',
    preview: '🔮',
    colors: {
      primary: '#7c3aed',
      secondary: '#faf5ff',
      text: '#3730a3',
      background: '#ffffff'
    },
    typography: {
      fontFamily: '"Roboto", sans-serif',
      fontSize: '14px',
      fontWeight: '400'
    },
    dimensions: {
      triggerSize: 58,
      chatWidth: 340,
      chatHeight: 480,
      borderRadius: 14
    }
  },
  {
    id: 'sporty-red',
    name: 'Sportlich Rot',
    description: 'Dynamisch für Performance-Werkstätten',
    category: 'sporty',
    preview: '🏎️',
    colors: {
      primary: '#dc2626',
      secondary: '#fef2f2',
      text: '#7f1d1d',
      background: '#ffffff'
    },
    typography: {
      fontFamily: '"Open Sans", sans-serif',
      fontSize: '14px',
      fontWeight: '600'
    },
    dimensions: {
      triggerSize: 62,
      chatWidth: 355,
      chatHeight: 510,
      borderRadius: 10
    }
  },
  {
    id: 'classic-navy',
    name: 'Klassisch Navy',
    description: 'Traditionell und vertrauenswürdig',
    category: 'classic',
    preview: '⚓',
    colors: {
      primary: '#1e40af',
      secondary: '#eff6ff',
      text: '#1e3a8a',
      background: '#ffffff'
    },
    typography: {
      fontFamily: '"Times New Roman", Times, serif',
      fontSize: '14px',
      fontWeight: '400'
    },
    dimensions: {
      triggerSize: 60,
      chatWidth: 350,
      chatHeight: 500,
      borderRadius: 8
    }
  },
  {
    id: 'fresh-teal',
    name: 'Frisch Türkis',
    description: 'Erfrischend und modern',
    category: 'modern',
    preview: '🌊',
    colors: {
      primary: '#0891b2',
      secondary: '#ecfeff',
      text: '#155e75',
      background: '#ffffff'
    },
    typography: {
      fontFamily: '"Lato", sans-serif',
      fontSize: '14px',
      fontWeight: '400'
    },
    dimensions: {
      triggerSize: 56,
      chatWidth: 345,
      chatHeight: 495,
      borderRadius: 18
    }
  },
  {
    id: 'warm-orange',
    name: 'Warm Orange',
    description: 'Freundlich und einladend',
    category: 'friendly',
    preview: '🧡',
    colors: {
      primary: '#ea580c',
      secondary: '#fff7ed',
      text: '#9a3412',
      background: '#ffffff'
    },
    typography: {
      fontFamily: '"Nunito", sans-serif',
      fontSize: '14px',
      fontWeight: '400'
    },
    dimensions: {
      triggerSize: 60,
      chatWidth: 350,
      chatHeight: 500,
      borderRadius: 15
    }
  },
  {
    id: 'dark-mode',
    name: 'Dark Mode',
    description: 'Dunkles Design für moderne Websites',
    category: 'dark',
    preview: '🌙',
    colors: {
      primary: '#3b82f6',
      secondary: '#1f2937',
      text: '#f9fafb',
      background: '#111827'
    },
    typography: {
      fontFamily: '"Inter", sans-serif',
      fontSize: '14px',
      fontWeight: '400'
    },
    dimensions: {
      triggerSize: 58,
      chatWidth: 360,
      chatHeight: 520,
      borderRadius: 16
    }
  }
]

const CATEGORY_LABELS = {
  professional: 'Professionell',
  modern: 'Modern',
  premium: 'Premium',
  sporty: 'Sportlich',
  classic: 'Klassisch',
  friendly: 'Freundlich',
  dark: 'Dark Mode'
}

export default function WidgetThemes({ onApplyTheme, currentConfig }) {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [hoveredTheme, setHoveredTheme] = useState(null)

  const categories = ['all', ...Object.keys(CATEGORY_LABELS)]

  const filteredThemes = selectedCategory === 'all' 
    ? PREDEFINED_THEMES
    : PREDEFINED_THEMES.filter(theme => theme.category === selectedCategory)

  const isCurrentTheme = (theme) => {
    return (
      currentConfig.colors.primary === theme.colors.primary &&
      currentConfig.colors.secondary === theme.colors.secondary &&
      currentConfig.colors.text === theme.colors.text &&
      currentConfig.colors.background === theme.colors.background
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h3 style={{ margin: '0 0 10px 0', fontSize: '18px', color: '#1a202c' }}>
          🌈 Design-Vorlagen
        </h3>
        <p style={{ margin: '0', fontSize: '14px', color: '#6b7280' }}>
          Wählen Sie eine vorgefertigte Vorlage oder passen Sie diese nach Ihren Wünschen an
        </p>
      </div>

      {/* Category Filter */}
      <div style={{
        display: 'flex',
        gap: '10px',
        flexWrap: 'wrap',
        padding: '15px',
        background: '#f8f9fa',
        borderRadius: '8px'
      }}>
        <button
          onClick={() => setSelectedCategory('all')}
          style={{
            padding: '6px 12px',
            border: selectedCategory === 'all' ? '2px solid #0070f3' : '1px solid #d1d5db',
            background: selectedCategory === 'all' ? '#eff6ff' : 'white',
            color: selectedCategory === 'all' ? '#0070f3' : '#6b7280',
            borderRadius: '6px',
            fontSize: '12px',
            cursor: 'pointer',
            fontWeight: selectedCategory === 'all' ? 'bold' : 'normal'
          }}
        >
          🎨 Alle Kategorien
        </button>

        {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setSelectedCategory(key)}
            style={{
              padding: '6px 12px',
              border: selectedCategory === key ? '2px solid #0070f3' : '1px solid #d1d5db',
              background: selectedCategory === key ? '#eff6ff' : 'white',
              color: selectedCategory === key ? '#0070f3' : '#6b7280',
              borderRadius: '6px',
              fontSize: '12px',
              cursor: 'pointer',
              fontWeight: selectedCategory === key ? 'bold' : 'normal'
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Theme Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '20px'
      }}>
        {filteredThemes.map(theme => (
          <div
            key={theme.id}
            onMouseEnter={() => setHoveredTheme(theme.id)}
            onMouseLeave={() => setHoveredTheme(null)}
            style={{
              background: 'white',
              border: isCurrentTheme(theme) ? '2px solid #10b981' : '1px solid #e2e8f0',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: hoveredTheme === theme.id ? '0 8px 25px rgba(0,0,0,0.1)' : '0 2px 4px rgba(0,0,0,0.1)',
              transform: hoveredTheme === theme.id ? 'translateY(-2px)' : 'translateY(0)',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              position: 'relative'
            }}
            onClick={() => onApplyTheme(theme)}
          >
            {/* Current Theme Badge */}
            {isCurrentTheme(theme) && (
              <div style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: '#10b981',
                color: 'white',
                padding: '4px 8px',
                borderRadius: '12px',
                fontSize: '10px',
                fontWeight: 'bold',
                zIndex: 10
              }}>
                ✓ AKTIV
              </div>
            )}

            {/* Theme Preview */}
            <div style={{
              height: '120px',
              background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%)`,
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {/* Mini Widget Preview */}
              <div style={{
                position: 'relative'
              }}>
                {/* Trigger Button */}
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: theme.colors.primary,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                  color: 'white',
                  fontSize: '16px'
                }}>
                  {theme.preview}
                </div>

                {/* Mini Chat Window */}
                <div style={{
                  position: 'absolute',
                  bottom: '50px',
                  right: '0',
                  width: '120px',
                  height: '80px',
                  background: theme.colors.background,
                  borderRadius: theme.dimensions.borderRadius * 0.5 + 'px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  overflow: 'hidden',
                  fontSize: '8px'
                }}>
                  {/* Mini Header */}
                  <div style={{
                    background: theme.colors.primary,
                    color: 'white',
                    padding: '4px 6px',
                    fontSize: '7px',
                    fontWeight: 'bold'
                  }}>
                    CarBot
                  </div>
                  
                  {/* Mini Messages */}
                  <div style={{
                    padding: '4px',
                    background: theme.colors.secondary,
                    height: '100%'
                  }}>
                    <div style={{
                      background: 'white',
                      padding: '2px 4px',
                      borderRadius: '4px',
                      marginBottom: '2px',
                      fontSize: '6px',
                      color: theme.colors.text
                    }}>
                      Hallo! 👋
                    </div>
                    <div style={{
                      background: theme.colors.primary,
                      color: 'white',
                      padding: '2px 4px',
                      borderRadius: '4px',
                      fontSize: '6px',
                      textAlign: 'right',
                      marginLeft: '20px'
                    }}>
                      Hi!
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Theme Info */}
            <div style={{ padding: '16px' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '8px'
              }}>
                <h4 style={{
                  margin: 0,
                  fontSize: '16px',
                  fontWeight: 'bold',
                  color: '#1a202c'
                }}>
                  {theme.name}
                </h4>
                
                <span style={{
                  background: theme.colors.primary,
                  color: 'white',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontSize: '10px',
                  fontWeight: 'bold'
                }}>
                  {CATEGORY_LABELS[theme.category]}
                </span>
              </div>

              <p style={{
                margin: '0 0 12px 0',
                fontSize: '12px',
                color: '#6b7280',
                lineHeight: '1.4'
              }}>
                {theme.description}
              </p>

              {/* Color Palette */}
              <div style={{
                display: 'flex',
                gap: '6px',
                marginBottom: '12px'
              }}>
                {Object.entries(theme.colors).map(([key, color]) => (
                  <div
                    key={key}
                    style={{
                      width: '16px',
                      height: '16px',
                      borderRadius: '3px',
                      background: color,
                      border: '1px solid #e5e7eb'
                    }}
                    title={`${key}: ${color}`}
                  />
                ))}
              </div>

              {/* Theme Details */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '8px',
                fontSize: '11px',
                color: '#9ca3af'
              }}>
                <div>
                  <strong>Font:</strong><br />
                  {theme.typography.fontFamily.split(',')[0].replace(/"/g, '')}
                </div>
                <div>
                  <strong>Größe:</strong><br />
                  {theme.dimensions.chatWidth}×{theme.dimensions.chatHeight}px
                </div>
              </div>

              {/* Apply Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onApplyTheme(theme)
                }}
                style={{
                  width: '100%',
                  marginTop: '12px',
                  padding: '8px 16px',
                  background: isCurrentTheme(theme) ? '#10b981' : theme.colors.primary,
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'opacity 0.2s'
                }}
                onMouseEnter={e => e.target.style.opacity = '0.9'}
                onMouseLeave={e => e.target.style.opacity = '1'}
              >
                {isCurrentTheme(theme) ? '✓ Aktuell aktiv' : 'Vorlage anwenden'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Custom Theme Creation */}
      <div style={{
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        border: '2px dashed #cbd5e1',
        borderRadius: '12px',
        padding: '30px',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '32px', marginBottom: '15px' }}>🎨</div>
        <h4 style={{ margin: '0 0 10px 0', fontSize: '18px', color: '#1a202c' }}>
          Eigenes Design erstellen
        </h4>
        <p style={{ margin: '0 0 20px 0', fontSize: '14px', color: '#6b7280' }}>
          Nutzen Sie die Design-Einstellungen um Ihr individuelles Widget-Theme zu erstellen
        </p>
        <div style={{
          background: '#eff6ff',
          border: '1px solid #3b82f6',
          borderRadius: '8px',
          padding: '15px',
          fontSize: '12px',
          color: '#1e40af',
          textAlign: 'left'
        }}>
          <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
            💡 Tipp: Speichern Sie Ihr eigenes Design
          </div>
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            <li>Passen Sie Farben, Schrift und Layout an</li>
            <li>Testen Sie das Design in der Live-Vorschau</li>
            <li>Speichern Sie die Konfiguration im "Export"-Tab</li>
            <li>Laden Sie sie später wieder oder teilen Sie sie mit anderen</li>
          </ul>
        </div>
      </div>

      {/* Theme Statistics */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '15px',
        padding: '20px',
        background: '#f8f9fa',
        borderRadius: '8px',
        fontSize: '12px'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '20px', marginBottom: '5px' }}>🎨</div>
          <div style={{ fontWeight: 'bold', color: '#1a202c' }}>
            {PREDEFINED_THEMES.length} Vorlagen
          </div>
          <div style={{ color: '#6b7280' }}>Verfügbar</div>
        </div>
        
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '20px', marginBottom: '5px' }}>📱</div>
          <div style={{ fontWeight: 'bold', color: '#1a202c' }}>
            Responsive
          </div>
          <div style={{ color: '#6b7280' }}>Alle Geräte</div>
        </div>
        
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '20px', marginBottom: '5px' }}>⚡</div>
          <div style={{ fontWeight: 'bold', color: '#1a202c' }}>
            Sofort
          </div>
          <div style={{ color: '#6b7280' }}>Anwendbar</div>
        </div>
        
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '20px', marginBottom: '5px' }}>🔧</div>
          <div style={{ fontWeight: 'bold', color: '#1a202c' }}>
            Anpassbar
          </div>
          <div style={{ color: '#6b7280' }}>Nach Bedarf</div>
        </div>
      </div>
    </div>
  )
}