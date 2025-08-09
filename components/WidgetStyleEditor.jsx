'use client'
import { useState } from 'react'

const POSITION_OPTIONS = [
  { value: 'bottom-right', label: 'Unten Rechts', icon: '↘️' },
  { value: 'bottom-left', label: 'Unten Links', icon: '↙️' },
  { value: 'top-right', label: 'Oben Rechts', icon: '↗️' },
  { value: 'top-left', label: 'Oben Links', icon: '↖️' },
  { value: 'center-right', label: 'Mitte Rechts', icon: '➡️' },
  { value: 'center-left', label: 'Mitte Links', icon: '⬅️' }
]

const FONT_OPTIONS = [
  { value: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', label: 'System Standard' },
  { value: '"Helvetica Neue", Helvetica, Arial, sans-serif', label: 'Helvetica' },
  { value: 'Arial, sans-serif', label: 'Arial' },
  { value: '"Times New Roman", Times, serif', label: 'Times New Roman' },
  { value: 'Georgia, serif', label: 'Georgia' },
  { value: '"Courier New", Courier, monospace', label: 'Courier New' },
  { value: '"Inter", sans-serif', label: 'Inter' },
  { value: '"Open Sans", sans-serif', label: 'Open Sans' },
  { value: '"Roboto", sans-serif', label: 'Roboto' }
]

export default function WidgetStyleEditor({ config, onConfigChange, workshop }) {
  const [activeSection, setActiveSection] = useState('colors')

  const handleColorChange = (colorKey, value) => {
    onConfigChange('colors', { [colorKey]: value })
  }

  const handleTypographyChange = (typographyKey, value) => {
    onConfigChange('typography', { [typographyKey]: value })
  }

  const handlePositioningChange = (positionKey, value) => {
    onConfigChange('positioning', { [positionKey]: value })
  }

  const handleDimensionsChange = (dimensionKey, value) => {
    onConfigChange('dimensions', { [dimensionKey]: parseInt(value) })
  }

  const sections = [
    { id: 'colors', label: 'Farben', icon: '🎨' },
    { id: 'typography', label: 'Schrift', icon: '📝' },
    { id: 'positioning', label: 'Position', icon: '📍' },
    { id: 'dimensions', label: 'Größe', icon: '📏' }
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <h3 style={{ margin: 0, fontSize: '18px', color: '#1a202c' }}>
        🎨 Widget-Design anpassen
      </h3>

      {/* Section Tabs */}
      <div style={{
        display: 'flex',
        gap: '10px',
        borderBottom: '1px solid #e2e8f0',
        paddingBottom: '10px'
      }}>
        {sections.map(section => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            style={{
              padding: '8px 16px',
              border: 'none',
              background: activeSection === section.id ? '#0070f3' : '#f8f9fa',
              color: activeSection === section.id ? 'white' : '#6b7280',
              borderRadius: '6px',
              fontSize: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span>{section.icon}</span>
            {section.label}
          </button>
        ))}
      </div>

      {/* Colors Section */}
      {activeSection === 'colors' && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px'
        }}>
          <ColorPicker
            label="🎯 Primärfarbe"
            description="Hauptfarbe für Button und Header"
            value={config.colors.primary}
            onChange={value => handleColorChange('primary', value)}
            presets={[
              '#0070f3', '#dc2626', '#059669', '#7c3aed', 
              '#ea580c', '#0891b2', '#be123c', '#4338ca'
            ]}
          />

          <ColorPicker
            label="🎨 Sekundärfarbe"
            description="Hintergrundfarbe für Nachrichten"
            value={config.colors.secondary}
            onChange={value => handleColorChange('secondary', value)}
            presets={[
              '#f8f9fa', '#f3f4f6', '#fef2f2', '#f0fff4', 
              '#faf5ff', '#fff7ed', '#ecfeff', '#fdf2f8'
            ]}
          />

          <ColorPicker
            label="📝 Textfarbe"
            description="Farbe für Text und Nachrichten"
            value={config.colors.text}
            onChange={value => handleColorChange('text', value)}
            presets={[
              '#1a202c', '#374151', '#4b5563', '#6b7280',
              '#000000', '#1f2937', '#111827', '#030712'
            ]}
          />

          <ColorPicker
            label="🏠 Hintergrundfarbe"
            description="Chat-Fenster Hintergrund"
            value={config.colors.background}
            onChange={value => handleColorChange('background', value)}
            presets={[
              '#ffffff', '#f8fafc', '#f1f5f9', '#ecfdf5',
              '#fefce8', '#fef2f2', '#f0f9ff', '#faf5ff'
            ]}
          />
        </div>
      )}

      {/* Typography Section */}
      {activeSection === 'typography' && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px'
        }}>
          <div style={{
            background: '#f8f9fa',
            padding: '20px',
            borderRadius: '8px'
          }}>
            <h4 style={{ margin: '0 0 15px 0', fontSize: '16px' }}>📝 Schriftart</h4>
            
            <select
              value={config.typography.fontFamily}
              onChange={e => handleTypographyChange('fontFamily', e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            >
              {FONT_OPTIONS.map(font => (
                <option key={font.value} value={font.value}>
                  {font.label}
                </option>
              ))}
            </select>

            <div style={{ 
              marginTop: '10px', 
              padding: '10px', 
              background: 'white', 
              borderRadius: '4px',
              fontFamily: config.typography.fontFamily,
              fontSize: config.typography.fontSize
            }}>
              <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Vorschau:</div>
              <div>Hallo! Wie kann ich Ihnen helfen? 👋</div>
            </div>
          </div>

          <div style={{
            background: '#f8f9fa',
            padding: '20px',
            borderRadius: '8px'
          }}>
            <h4 style={{ margin: '0 0 15px 0', fontSize: '16px' }}>📏 Schriftgröße</h4>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>
                Größe: {config.typography.fontSize}
              </label>
              <input
                type="range"
                min="10"
                max="20"
                value={parseInt(config.typography.fontSize)}
                onChange={e => handleTypographyChange('fontSize', e.target.value + 'px')}
                style={{ width: '100%' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#666' }}>
                <span>10px</span>
                <span>15px</span>
                <span>20px</span>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>
                Schriftgewicht: {config.typography.fontWeight}
              </label>
              <select
                value={config.typography.fontWeight}
                onChange={e => handleTypographyChange('fontWeight', e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
              >
                <option value="300">Dünn (300)</option>
                <option value="400">Normal (400)</option>
                <option value="500">Medium (500)</option>
                <option value="600">Semibold (600)</option>
                <option value="700">Fett (700)</option>
              </select>
            </div>
          </div>

          {/* Custom Google Fonts */}
          <div style={{
            background: '#f8f9fa',
            padding: '20px',
            borderRadius: '8px',
            gridColumn: '1 / -1'
          }}>
            <h4 style={{ margin: '0 0 15px 0', fontSize: '16px' }}>🌐 Google Fonts</h4>
            
            <div style={{
              background: '#eff6ff',
              padding: '15px',
              borderRadius: '6px',
              border: '1px solid #3b82f6',
              marginBottom: '15px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span>💡</span>
                <strong style={{ color: '#1e40af' }}>Google Fonts Integration</strong>
              </div>
              <p style={{ margin: 0, fontSize: '14px', color: '#1e40af' }}>
                Um Google Fonts zu verwenden, fügen Sie den entsprechenden CSS-Import in den erweiterten Einstellungen hinzu:
              </p>
              <code style={{ 
                display: 'block', 
                marginTop: '8px', 
                padding: '8px', 
                background: '#dbeafe', 
                borderRadius: '4px',
                fontSize: '12px'
              }}>
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
              </code>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '10px' }}>
              {[
                { name: 'Inter', family: '"Inter", sans-serif' },
                { name: 'Roboto', family: '"Roboto", sans-serif' },
                { name: 'Open Sans', family: '"Open Sans", sans-serif' },
                { name: 'Lato', family: '"Lato", sans-serif' },
                { name: 'Montserrat', family: '"Montserrat", sans-serif' },
                { name: 'Poppins', family: '"Poppins", sans-serif' },
                { name: 'Source Sans Pro', family: '"Source Sans Pro", sans-serif' },
                { name: 'Nunito', family: '"Nunito", sans-serif' }
              ].map(font => (
                <button
                  key={font.name}
                  onClick={() => handleTypographyChange('fontFamily', font.family)}
                  style={{
                    padding: '10px',
                    border: config.typography.fontFamily === font.family ? '2px solid #0070f3' : '1px solid #d1d5db',
                    background: config.typography.fontFamily === font.family ? '#eff6ff' : 'white',
                    borderRadius: '6px',
                    fontSize: '12px',
                    cursor: 'pointer',
                    fontFamily: font.family
                  }}
                >
                  {font.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Positioning Section */}
      {activeSection === 'positioning' && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px'
        }}>
          <div style={{
            background: '#f8f9fa',
            padding: '20px',
            borderRadius: '8px'
          }}>
            <h4 style={{ margin: '0 0 15px 0', fontSize: '16px' }}>📍 Position auf der Seite</h4>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
              {POSITION_OPTIONS.map(position => (
                <button
                  key={position.value}
                  onClick={() => handlePositioningChange('position', position.value)}
                  style={{
                    padding: '12px',
                    border: config.positioning.position === position.value ? '2px solid #0070f3' : '1px solid #d1d5db',
                    background: config.positioning.position === position.value ? '#eff6ff' : 'white',
                    borderRadius: '6px',
                    fontSize: '14px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    textAlign: 'left'
                  }}
                >
                  <span style={{ fontSize: '18px' }}>{position.icon}</span>
                  {position.label}
                </button>
              ))}
            </div>
          </div>

          <div style={{
            background: '#f8f9fa',
            padding: '20px',
            borderRadius: '8px'
          }}>
            <h4 style={{ margin: '0 0 15px 0', fontSize: '16px' }}>📐 Abstand vom Rand</h4>
            
            <div style={{ display: 'grid', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>
                  Horizontal: {config.positioning.offsetX}px
                </label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={config.positioning.offsetX}
                  onChange={e => handlePositioningChange('offsetX', parseInt(e.target.value))}
                  style={{ width: '100%' }}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>
                  Vertikal: {config.positioning.offsetY}px
                </label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={config.positioning.offsetY}
                  onChange={e => handlePositioningChange('offsetY', parseInt(e.target.value))}
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>
                  Z-Index: {config.positioning.zIndex}
                </label>
                <input
                  type="range"
                  min="1000"
                  max="999999"
                  step="1000"
                  value={config.positioning.zIndex}
                  onChange={e => handlePositioningChange('zIndex', parseInt(e.target.value))}
                  style={{ width: '100%' }}
                />
                <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                  Höhere Werte erscheinen über anderen Elementen
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dimensions Section */}
      {activeSection === 'dimensions' && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px'
        }}>
          <div style={{
            background: '#f8f9fa',
            padding: '20px',
            borderRadius: '8px'
          }}>
            <h4 style={{ margin: '0 0 15px 0', fontSize: '16px' }}>🔘 Trigger-Button</h4>
            
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>
                Größe: {config.dimensions.triggerSize}px
              </label>
              <input
                type="range"
                min="40"
                max="80"
                value={config.dimensions.triggerSize}
                onChange={e => handleDimensionsChange('triggerSize', e.target.value)}
                style={{ width: '100%' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#666' }}>
                <span>40px</span>
                <span>60px</span>
                <span>80px</span>
              </div>
            </div>

            <div style={{ 
              marginTop: '15px', 
              textAlign: 'center',
              padding: '10px',
              background: 'white',
              borderRadius: '4px'
            }}>
              <div
                style={{
                  width: config.dimensions.triggerSize + 'px',
                  height: config.dimensions.triggerSize + 'px',
                  background: config.colors.primary,
                  borderRadius: '50%',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: Math.max(12, config.dimensions.triggerSize * 0.4) + 'px'
                }}
              >
                💬
              </div>
              <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                Vorschau
              </div>
            </div>
          </div>

          <div style={{
            background: '#f8f9fa',
            padding: '20px',
            borderRadius: '8px'
          }}>
            <h4 style={{ margin: '0 0 15px 0', fontSize: '16px' }}>💬 Chat-Fenster</h4>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>
                Breite: {config.dimensions.chatWidth}px
              </label>
              <input
                type="range"
                min="280"
                max="500"
                value={config.dimensions.chatWidth}
                onChange={e => handleDimensionsChange('chatWidth', e.target.value)}
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>
                Höhe: {config.dimensions.chatHeight}px
              </label>
              <input
                type="range"
                min="400"
                max="700"
                value={config.dimensions.chatHeight}
                onChange={e => handleDimensionsChange('chatHeight', e.target.value)}
                style={{ width: '100%' }}
              />
            </div>

            <div style={{ 
              marginTop: '15px',
              fontSize: '12px',
              color: '#666',
              textAlign: 'center'
            }}>
              Chat-Größe: {config.dimensions.chatWidth} × {config.dimensions.chatHeight}px
            </div>
          </div>

          <div style={{
            background: '#f8f9fa',
            padding: '20px',
            borderRadius: '8px'
          }}>
            <h4 style={{ margin: '0 0 15px 0', fontSize: '16px' }}>🔄 Rundung</h4>
            
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>
                Border Radius: {config.dimensions.borderRadius}px
              </label>
              <input
                type="range"
                min="0"
                max="30"
                value={config.dimensions.borderRadius}
                onChange={e => handleDimensionsChange('borderRadius', e.target.value)}
                style={{ width: '100%' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#666' }}>
                <span>Eckig</span>
                <span>Mittel</span>
                <span>Rund</span>
              </div>
            </div>

            <div style={{ 
              marginTop: '15px', 
              textAlign: 'center',
              padding: '10px',
              background: 'white',
              borderRadius: '4px'
            }}>
              <div
                style={{
                  width: '60px',
                  height: '40px',
                  background: config.colors.primary,
                  borderRadius: config.dimensions.borderRadius + 'px',
                  display: 'inline-block',
                  margin: '5px'
                }}
              />
              <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                Vorschau
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Color Picker Component
function ColorPicker({ label, description, value, onChange, presets = [] }) {
  const [showPicker, setShowPicker] = useState(false)

  return (
    <div style={{
      background: '#f8f9fa',
      padding: '20px',
      borderRadius: '8px',
      position: 'relative'
    }}>
      <h4 style={{ margin: '0 0 8px 0', fontSize: '16px' }}>
        {label}
      </h4>
      <p style={{ margin: '0 0 15px 0', fontSize: '14px', color: '#666' }}>
        {description}
      </p>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
        <div
          style={{
            width: '40px',
            height: '40px',
            background: value,
            border: '2px solid #e5e7eb',
            borderRadius: '6px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}
          onClick={() => setShowPicker(!showPicker)}
        >
          <span style={{ color: '#666', fontSize: '12px' }}>🎨</span>
          {showPicker && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              zIndex: 1000,
              background: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '10px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              minWidth: '200px'
            }}>
              <input
                type="color"
                value={value}
                onChange={e => onChange(e.target.value)}
                style={{
                  width: '100%',
                  height: '40px',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              />
            </div>
          )}
        </div>

        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          style={{
            flex: 1,
            padding: '8px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '14px',
            fontFamily: 'Monaco, Menlo, monospace'
          }}
          placeholder="#000000"
        />
      </div>

      {presets.length > 0 && (
        <div>
          <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
            Vorgaben:
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {presets.map(preset => (
              <button
                key={preset}
                onClick={() => onChange(preset)}
                style={{
                  width: '24px',
                  height: '24px',
                  background: preset,
                  border: value === preset ? '2px solid #0070f3' : '1px solid #e5e7eb',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  padding: 0
                }}
                title={preset}
              />
            ))}
          </div>
        </div>
      )}

      {/* Close picker when clicking outside */}
      {showPicker && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999
          }}
          onClick={() => setShowPicker(false)}
        />
      )}
    </div>
  )
}