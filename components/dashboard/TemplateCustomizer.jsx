'use client'

import { useState, useEffect } from 'react'

export default function TemplateCustomizer({ workshopId }) {
  const [isMobile, setIsMobile] = useState(false)
  const [customization, setCustomization] = useState({
    template_type: 'kfz_werkstatt_classic',
    custom_slug: '',
    colors: {
      primary: '#ea580c',
      secondary: '#1e293b',
      accent: '#10b981',
      background: '#ffffff',
      text: '#1e293b'
    },
    typography: {
      font_family: 'Inter, sans-serif'
    },
    branding: {
      logo_url: '',
      hero_title: '',
      hero_subtitle: '',
      hero_image: ''
    },
    content: {
      about_title: 'Über uns',
      about_content: '',
      services_title: 'Unsere Services',
      contact_title: 'Kontakt'
    },
    contact_details: {
      address: '',
      phone: '',
      email: '',
      opening_hours: {
        monday: '08:00-17:00',
        tuesday: '08:00-17:00',
        wednesday: '08:00-17:00',
        thursday: '08:00-17:00',
        friday: '08:00-17:00',
        saturday: '09:00-14:00',
        sunday: 'Geschlossen'
      }
    },
    legal: {
      impressum_content: '',
      privacy_policy_content: ''
    },
    custom_css: '',
    seo: {
      meta_title: '',
      meta_description: '',
      meta_keywords: ''
    },
    is_published: false
  })
  
  const [templates, setTemplates] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('template')

  useEffect(() => {
    // Check if mobile on mount and resize
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    fetchTemplateData()
  }, [workshopId])

  const fetchTemplateData = async () => {
    try {
      setLoading(true)
      
      const response = await fetch('/api/templates?include_customizations=true', {
        headers: {
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem('carbot_auth_tokens') || '{}').accessToken}`
        }
      })

      if (response.ok) {
        const result = await response.json()
        setTemplates(result.data.templates)
        
        if (result.data.customizations) {
          setCustomization(prev => ({ ...prev, ...result.data.customizations }))
        }
      }
    } catch (error) {
      console.error('Template fetch error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      
      const response = await fetch('/api/templates', {
        method: customization.id ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem('carbot_auth_tokens') || '{}').accessToken}`
        },
        body: JSON.stringify(customization)
      })

      if (response.ok) {
        const result = await response.json()
        setCustomization(result.data)
        alert('Template-Anpassungen gespeichert!')
      } else {
        const error = await response.json()
        alert(`Fehler: ${error.error}`)
      }
    } catch (error) {
      console.error('Save error:', error)
      alert('Fehler beim Speichern')
    } finally {
      setSaving(false)
    }
  }

  const handlePublish = async () => {
    try {
      setSaving(true)
      
      const response = await fetch('/api/templates/publish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem('carbot_auth_tokens') || '{}').accessToken}`
        },
        body: JSON.stringify({ publish: !customization.is_published })
      })

      if (response.ok) {
        const result = await response.json()
        setCustomization(prev => ({
          ...prev,
          is_published: result.data.isPublished
        }))
        alert(result.message)
        
        if (result.data.liveUrl) {
          window.open(result.data.liveUrl, '_blank')
        }
      } else {
        const error = await response.json()
        alert(`Fehler: ${error.error}`)
      }
    } catch (error) {
      console.error('Publish error:', error)
      alert('Fehler beim Veröffentlichen')
    } finally {
      setSaving(false)
    }
  }

  const handlePreview = async () => {
    try {
      const response = await fetch('/api/templates/preview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem('carbot_auth_tokens') || '{}').accessToken}`
        },
        body: JSON.stringify({
          template_type: customization.template_type,
          customization: customization
        })
      })

      if (response.ok) {
        const result = await response.json()
        if (result.data.previewUrl) {
          window.open(result.data.previewUrl, '_blank')
        }
      }
    } catch (error) {
      console.error('Preview error:', error)
      alert('Fehler beim Erstellen der Vorschau')
    }
  }

  const tabs = [
    { id: 'template', label: 'Template', icon: '🎨' },
    { id: 'branding', label: 'Branding', icon: '🏷️' },
    { id: 'content', label: 'Inhalte', icon: '📝' },
    { id: 'contact', label: 'Kontakt', icon: '📞' },
    { id: 'seo', label: 'SEO', icon: '🔍' }
  ]

  const availableTemplates = [
    {
      id: 'kfz_werkstatt_classic',
      name: 'KFZ-Werkstatt Klassisch',
      description: 'Klassisches Design für traditionelle Autowerkstätten',
      preview: '/templates/classic-preview.jpg',
      colors: { primary: '#ea580c', secondary: '#1e293b', accent: '#10b981' }
    },
    {
      id: 'modern_autoservice',
      name: 'Moderner Autoservice',
      description: 'Zeitgemäßes Design mit modernen Elementen',
      preview: '/templates/modern-preview.jpg',
      colors: { primary: '#3b82f6', secondary: '#1e40af', accent: '#f59e0b' }
    },
    {
      id: 'premium_luxury_garage',
      name: 'Premium Luxus Garage',
      description: 'Elegantes Design für Luxusfahrzeug-Werkstätten',
      preview: '/templates/luxury-preview.jpg',
      colors: { primary: '#1f2937', secondary: '#d97706', accent: '#dc2626' },
      isPremium: true
    },
    {
      id: 'elektro_hybrid_spezialist',
      name: 'Elektro & Hybrid Spezialist',
      description: 'Spezialisiert auf Elektro- und Hybridfahrzeuge',
      preview: '/templates/elektro-preview.jpg',
      colors: { primary: '#10b981', secondary: '#059669', accent: '#34d399' },
      isPremium: true
    },
    {
      id: 'nutzfahrzeug_service',
      name: 'Nutzfahrzeug Service',
      description: 'Optimiert für LKW und Nutzfahrzeug-Werkstätten',
      preview: '/templates/nutzfahrzeug-preview.jpg',
      colors: { primary: '#f59e0b', secondary: '#d97706', accent: '#92400e' }
    }
  ]

  if (loading) {
    return (
      <div style={{ 
        padding: isMobile ? '1rem' : '2rem', 
        textAlign: 'center' 
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid #f3f4f6',
          borderTop: '4px solid #ea580c',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto'
        }}></div>
        <p style={{ marginTop: '1rem', color: '#6b7280' }}>Lade Template Editor...</p>
      </div>
    )
  }

  return (
    <div style={{
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
      minHeight: '100vh',
      padding: isMobile ? '1rem' : '2rem'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: 'space-between',
        alignItems: isMobile ? 'stretch' : 'center',
        gap: isMobile ? '1rem' : '0',
        marginBottom: isMobile ? '1.5rem' : '2rem'
      }}>
        <div>
          <h1 style={{
            fontSize: isMobile ? '1.5rem' : '2rem',
            fontWeight: 'bold',
            color: '#1e293b',
            margin: '0 0 0.5rem 0'
          }}>
            🎨 Template Anpassung
          </h1>
          <p style={{ 
            color: '#64748b', 
            margin: 0,
            fontSize: isMobile ? '0.875rem' : '1rem'
          }}>
            Gestalten Sie Ihre individuelle Landing Page
          </p>
        </div>

        <div style={{ 
          display: 'flex', 
          flexDirection: isMobile ? 'column' : 'row',
          gap: '1rem', 
          alignItems: 'stretch'
        }}>
          <button
            onClick={handlePreview}
            disabled={saving}
            style={{
              padding: isMobile ? '0.875rem 1rem' : '0.75rem 1.5rem',
              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: saving ? 'not-allowed' : 'pointer',
              fontWeight: '500',
              fontSize: isMobile ? '1rem' : '0.875rem',
              opacity: saving ? 0.7 : 1,
              whiteSpace: 'nowrap'
            }}
          >
            👁️ Vorschau
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              padding: isMobile ? '0.875rem 1rem' : '0.75rem 1.5rem',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: saving ? 'not-allowed' : 'pointer',
              fontWeight: '500',
              fontSize: isMobile ? '1rem' : '0.875rem',
              opacity: saving ? 0.7 : 1,
              whiteSpace: 'nowrap'
            }}
          >
            {saving ? '💾 Speichere...' : '💾 Speichern'}
          </button>

          <button
            onClick={handlePublish}
            disabled={saving}
            style={{
              padding: isMobile ? '0.875rem 1rem' : '0.75rem 1.5rem',
              background: customization.is_published ? 
                'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' :
                'linear-gradient(135deg, #ea580c 0%, #dc2626 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: saving ? 'not-allowed' : 'pointer',
              fontWeight: '500',
              fontSize: isMobile ? '1rem' : '0.875rem',
              opacity: saving ? 0.7 : 1,
              whiteSpace: 'nowrap'
            }}
          >
            {customization.is_published ? '📝 Unveröffentlichen' : '🚀 Veröffentlichen'}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
        gap: isMobile ? '1.5rem' : '2rem',
        minHeight: isMobile ? 'auto' : '600px'
      }}>
        {/* Customization Panel */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: isMobile ? '1rem' : '2rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb'
        }}>
          {/* Tab Navigation */}
          <div style={{
            display: 'flex',
            flexWrap: isMobile ? 'wrap' : 'nowrap',
            borderBottom: '1px solid #e5e7eb',
            marginBottom: isMobile ? '1.5rem' : '2rem',
            gap: isMobile ? '0.25rem' : '0',
            overflowX: isMobile ? 'auto' : 'visible'
          }}>
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: isMobile ? '0.5rem 0.75rem' : '0.75rem 1rem',
                  border: 'none',
                  background: 'none',
                  color: activeTab === tab.id ? '#ea580c' : '#64748b',
                  borderBottom: activeTab === tab.id ? '2px solid #ea580c' : '2px solid transparent',
                  cursor: 'pointer',
                  fontWeight: activeTab === tab.id ? '600' : '400',
                  fontSize: isMobile ? '0.875rem' : '1rem',
                  transition: 'all 0.2s',
                  minWidth: 'fit-content',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <span>{tab.icon}</span>
                <span>{isMobile ? tab.label.split(' ')[0] : tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div style={{ maxHeight: isMobile ? 'none' : '500px', overflowY: 'auto' }}>
            {activeTab === 'template' && (
              <TemplateTab 
                customization={customization}
                setCustomization={setCustomization}
                templates={availableTemplates}
                isMobile={isMobile}
              />
            )}
            
            {activeTab === 'branding' && (
              <BrandingTab 
                customization={customization}
                setCustomization={setCustomization}
                isMobile={isMobile}
              />
            )}
            
            {activeTab === 'content' && (
              <ContentTab 
                customization={customization}
                setCustomization={setCustomization}
                isMobile={isMobile}
              />
            )}
            
            {activeTab === 'contact' && (
              <ContactTab 
                customization={customization}
                setCustomization={setCustomization}
                isMobile={isMobile}
              />
            )}
            
            {activeTab === 'seo' && (
              <SEOTab 
                customization={customization}
                setCustomization={setCustomization}
                isMobile={isMobile}
              />
            )}
          </div>
        </div>

        {/* Live Preview */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: isMobile ? '1rem' : '2rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb',
          position: 'relative',
          order: isMobile ? -1 : 0
        }}>
          <h3 style={{ 
            color: '#1e293b', 
            margin: '0 0 1rem 0',
            fontSize: isMobile ? '1.25rem' : '1.5rem'
          }}>
            🖥️ Live Vorschau
          </h3>

          {/* Preview Frame */}
          <div style={{
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            height: isMobile ? '300px' : '500px',
            background: '#f8fafc',
            overflow: 'hidden',
            position: 'relative'
          }}>
            <LivePreview 
              customization={customization} 
              isMobile={isMobile}
            />
          </div>

          {/* Template Info */}
          {customization.is_published && (
            <div style={{
              marginTop: '1rem',
              padding: '1rem',
              background: '#dcfce7',
              border: '1px solid #bbf7d0',
              borderRadius: '8px'
            }}>
              <p style={{ 
                margin: '0 0 0.5rem 0', 
                fontWeight: 'bold', 
                color: '#166534',
                fontSize: isMobile ? '0.875rem' : '1rem'
              }}>
                ✅ Veröffentlicht
              </p>
              <p style={{ 
                margin: 0, 
                fontSize: isMobile ? '0.875rem' : '1rem', 
                color: '#166534' 
              }}>
                URL: <strong>{window.location.origin}/l/{customization.custom_slug}</strong>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Template Selection Tab
function TemplateTab({ customization, setCustomization, templates, isMobile }) {
  const handleTemplateChange = (templateId) => {
    const template = templates.find(t => t.id === templateId)
    setCustomization(prev => ({
      ...prev,
      template_type: templateId,
      colors: {
        ...prev.colors,
        ...template.colors
      }
    }))
  }

  return (
    <div style={{ padding: isMobile ? '0.5rem' : '1rem' }}>
      <h4 style={{ 
        color: '#1e293b', 
        margin: '0 0 1rem 0',
        fontSize: isMobile ? '1.1rem' : '1.25rem'
      }}>
        🎨 Template auswählen
      </h4>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
        gap: '1rem'
      }}>
        {templates.map(template => (
          <div
            key={template.id}
            onClick={() => handleTemplateChange(template.id)}
            style={{
              border: customization.template_type === template.id ? 
                '2px solid #ea580c' : '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '1rem',
              cursor: 'pointer',
              background: customization.template_type === template.id ? 
                '#fef7f0' : 'white',
              transition: 'all 0.2s'
            }}
          >
            <div style={{
              width: '100%',
              height: '60px',
              background: `linear-gradient(135deg, ${template.colors.primary}, ${template.colors.secondary})`,
              borderRadius: '4px',
              marginBottom: '0.5rem'
            }}></div>
            
            <h5 style={{ 
              margin: '0 0 0.25rem 0',
              fontSize: isMobile ? '0.875rem' : '1rem',
              fontWeight: 'bold'
            }}>
              {template.name}
              {template.isPremium && (
                <span style={{
                  marginLeft: '0.5rem',
                  padding: '0.125rem 0.5rem',
                  background: '#f59e0b',
                  color: 'white',
                  borderRadius: '12px',
                  fontSize: '0.75rem'
                }}>
                  Premium
                </span>
              )}
            </h5>
            
            <p style={{ 
              margin: 0, 
              fontSize: isMobile ? '0.75rem' : '0.875rem', 
              color: '#64748b' 
            }}>
              {template.description}
            </p>
          </div>
        ))}
      </div>

      {/* Custom Slug */}
      <div style={{ marginTop: '2rem' }}>
        <label style={{
          display: 'block',
          fontSize: isMobile ? '0.875rem' : '1rem',
          fontWeight: 'bold',
          color: '#374151',
          marginBottom: '0.5rem'
        }}>
          🔗 URL Slug (eindeutig)
        </label>
        <input
          type="text"
          value={customization.custom_slug}
          onChange={(e) => setCustomization(prev => ({
            ...prev,
            custom_slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-')
          }))}
          placeholder="meine-werkstatt"
          style={{
            width: '100%',
            padding: isMobile ? '0.75rem' : '0.5rem',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: isMobile ? '1rem' : '0.875rem',
            boxSizing: 'border-box'
          }}
        />
        <p style={{ 
          fontSize: '0.75rem', 
          color: '#64748b', 
          margin: '0.25rem 0 0 0' 
        }}>
          Ihre Landing Page wird unter: {window.location.origin}/l/{customization.custom_slug || 'ihr-slug'} verfügbar sein
        </p>
      </div>
    </div>
  )
}

// Branding Tab
function BrandingTab({ customization, setCustomization, isMobile }) {
  return (
    <div style={{ padding: isMobile ? '0.5rem' : '1rem' }}>
      <h4 style={{ 
        color: '#1e293b', 
        margin: '0 0 1rem 0',
        fontSize: isMobile ? '1.1rem' : '1.25rem'
      }}>
        🏷️ Branding & Design
      </h4>

      {/* Colors */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h5 style={{ 
          margin: '0 0 1rem 0',
          fontSize: isMobile ? '1rem' : '1.1rem'
        }}>
          🎨 Farben
        </h5>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(3, 1fr)',
          gap: '1rem'
        }}>
          {Object.entries(customization.colors).map(([key, value]) => (
            <div key={key}>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: 'bold',
                color: '#374151',
                marginBottom: '0.25rem'
              }}>
                {key === 'primary' ? 'Hauptfarbe' :
                 key === 'secondary' ? 'Zweitfarbe' :
                 key === 'accent' ? 'Akzentfarbe' :
                 key === 'background' ? 'Hintergrund' :
                 'Text'}
              </label>
              <input
                type="color"
                value={value}
                onChange={(e) => setCustomization(prev => ({
                  ...prev,
                  colors: { ...prev.colors, [key]: e.target.value }
                }))}
                style={{
                  width: '100%',
                  height: isMobile ? '40px' : '35px',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Hero Content */}
      <div>
        <h5 style={{ 
          margin: '0 0 1rem 0',
          fontSize: isMobile ? '1rem' : '1.1rem'
        }}>
          🏠 Hero Bereich
        </h5>
        
        <div style={{ marginBottom: '1rem' }}>
          <label style={{
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: 'bold',
            color: '#374151',
            marginBottom: '0.5rem'
          }}>
            Hauptüberschrift
          </label>
          <input
            type="text"
            value={customization.branding.hero_title}
            onChange={(e) => setCustomization(prev => ({
              ...prev,
              branding: { ...prev.branding, hero_title: e.target.value }
            }))}
            placeholder="Ihr Firmenname"
            style={{
              width: '100%',
              padding: isMobile ? '0.75rem' : '0.5rem',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: isMobile ? '1rem' : '0.875rem',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <div>
          <label style={{
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: 'bold',
            color: '#374151',
            marginBottom: '0.5rem'
          }}>
            Untertitel
          </label>
          <input
            type="text"
            value={customization.branding.hero_subtitle}
            onChange={(e) => setCustomization(prev => ({
              ...prev,
              branding: { ...prev.branding, hero_subtitle: e.target.value }
            }))}
            placeholder="Ihr zuverlässiger Partner für KFZ-Service"
            style={{
              width: '100%',
              padding: isMobile ? '0.75rem' : '0.5rem',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: isMobile ? '1rem' : '0.875rem',
              boxSizing: 'border-box'
            }}
          />
        </div>
      </div>
    </div>
  )
}

// Content Tab
function ContentTab({ customization, setCustomization, isMobile }) {
  return (
    <div style={{ padding: isMobile ? '0.5rem' : '1rem' }}>
      <h4 style={{ 
        color: '#1e293b', 
        margin: '0 0 1rem 0',
        fontSize: isMobile ? '1.1rem' : '1.25rem'
      }}>
        📝 Inhalte bearbeiten
      </h4>

      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{
          display: 'block',
          fontSize: '0.875rem',
          fontWeight: 'bold',
          color: '#374151',
          marginBottom: '0.5rem'
        }}>
          Über uns - Titel
        </label>
        <input
          type="text"
          value={customization.content.about_title}
          onChange={(e) => setCustomization(prev => ({
            ...prev,
            content: { ...prev.content, about_title: e.target.value }
          }))}
          style={{
            width: '100%',
            padding: isMobile ? '0.75rem' : '0.5rem',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: isMobile ? '1rem' : '0.875rem',
            boxSizing: 'border-box'
          }}
        />
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{
          display: 'block',
          fontSize: '0.875rem',
          fontWeight: 'bold',
          color: '#374151',
          marginBottom: '0.5rem'
        }}>
          Über uns - Text
        </label>
        <textarea
          value={customization.content.about_content}
          onChange={(e) => setCustomization(prev => ({
            ...prev,
            content: { ...prev.content, about_content: e.target.value }
          }))}
          rows={isMobile ? 4 : 6}
          placeholder="Beschreiben Sie Ihre Werkstatt und Ihre Leistungen..."
          style={{
            width: '100%',
            padding: isMobile ? '0.75rem' : '0.5rem',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: isMobile ? '1rem' : '0.875rem',
            boxSizing: 'border-box',
            resize: 'vertical'
          }}
        />
      </div>

      <div>
        <label style={{
          display: 'block',
          fontSize: '0.875rem',
          fontWeight: 'bold',
          color: '#374151',
          marginBottom: '0.5rem'
        }}>
          Services - Titel
        </label>
        <input
          type="text"
          value={customization.content.services_title}
          onChange={(e) => setCustomization(prev => ({
            ...prev,
            content: { ...prev.content, services_title: e.target.value }
          }))}
          style={{
            width: '100%',
            padding: isMobile ? '0.75rem' : '0.5rem',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: isMobile ? '1rem' : '0.875rem',
            boxSizing: 'border-box'
          }}
        />
      </div>
    </div>
  )
}

// Contact Tab
function ContactTab({ customization, setCustomization, isMobile }) {
  return (
    <div style={{ padding: isMobile ? '0.5rem' : '1rem' }}>
      <h4 style={{ 
        color: '#1e293b', 
        margin: '0 0 1rem 0',
        fontSize: isMobile ? '1.1rem' : '1.25rem'
      }}>
        📞 Kontaktdaten
      </h4>

      <div style={{ marginBottom: '1rem' }}>
        <label style={{
          display: 'block',
          fontSize: '0.875rem',
          fontWeight: 'bold',
          color: '#374151',
          marginBottom: '0.5rem'
        }}>
          Adresse
        </label>
        <textarea
          value={customization.contact_details.address}
          onChange={(e) => setCustomization(prev => ({
            ...prev,
            contact_details: { ...prev.contact_details, address: e.target.value }
          }))}
          rows={3}
          style={{
            width: '100%',
            padding: isMobile ? '0.75rem' : '0.5rem',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: isMobile ? '1rem' : '0.875rem',
            boxSizing: 'border-box',
            resize: 'vertical'
          }}
        />
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label style={{
          display: 'block',
          fontSize: '0.875rem',
          fontWeight: 'bold',
          color: '#374151',
          marginBottom: '0.5rem'
        }}>
          Telefon
        </label>
        <input
          type="tel"
          value={customization.contact_details.phone}
          onChange={(e) => setCustomization(prev => ({
            ...prev,
            contact_details: { ...prev.contact_details, phone: e.target.value }
          }))}
          style={{
            width: '100%',
            padding: isMobile ? '0.75rem' : '0.5rem',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: isMobile ? '1rem' : '0.875rem',
            boxSizing: 'border-box'
          }}
        />
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{
          display: 'block',
          fontSize: '0.875rem',
          fontWeight: 'bold',
          color: '#374151',
          marginBottom: '0.5rem'
        }}>
          E-Mail
        </label>
        <input
          type="email"
          value={customization.contact_details.email}
          onChange={(e) => setCustomization(prev => ({
            ...prev,
            contact_details: { ...prev.contact_details, email: e.target.value }
          }))}
          style={{
            width: '100%',
            padding: isMobile ? '0.75rem' : '0.5rem',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: isMobile ? '1rem' : '0.875rem',
            boxSizing: 'border-box'
          }}
        />
      </div>

      {/* Opening Hours */}
      <div>
        <h5 style={{ 
          margin: '0 0 1rem 0',
          fontSize: isMobile ? '1rem' : '1.1rem'
        }}>
          🕒 Öffnungszeiten
        </h5>
        
        {Object.entries(customization.contact_details.opening_hours).map(([day, hours]) => (
          <div key={day} style={{ 
            display: 'flex', 
            alignItems: 'center', 
            marginBottom: '0.5rem',
            gap: '1rem'
          }}>
            <label style={{ 
              minWidth: isMobile ? '80px' : '100px',
              fontSize: '0.875rem',
              fontWeight: '500'
            }}>
              {day === 'monday' ? 'Montag' :
               day === 'tuesday' ? 'Dienstag' :
               day === 'wednesday' ? 'Mittwoch' :
               day === 'thursday' ? 'Donnerstag' :
               day === 'friday' ? 'Freitag' :
               day === 'saturday' ? 'Samstag' :
               'Sonntag'}:
            </label>
            <input
              type="text"
              value={hours}
              onChange={(e) => setCustomization(prev => ({
                ...prev,
                contact_details: {
                  ...prev.contact_details,
                  opening_hours: {
                    ...prev.contact_details.opening_hours,
                    [day]: e.target.value
                  }
                }
              }))}
              style={{
                flex: 1,
                padding: isMobile ? '0.5rem' : '0.25rem 0.5rem',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                fontSize: '0.875rem'
              }}
              placeholder="08:00-17:00"
            />
          </div>
        ))}
      </div>
    </div>
  )
}

// SEO Tab
function SEOTab({ customization, setCustomization, isMobile }) {
  return (
    <div style={{ padding: isMobile ? '0.5rem' : '1rem' }}>
      <h4 style={{ 
        color: '#1e293b', 
        margin: '0 0 1rem 0',
        fontSize: isMobile ? '1.1rem' : '1.25rem'
      }}>
        🔍 SEO Optimierung
      </h4>

      <div style={{ marginBottom: '1rem' }}>
        <label style={{
          display: 'block',
          fontSize: '0.875rem',
          fontWeight: 'bold',
          color: '#374151',
          marginBottom: '0.5rem'
        }}>
          Meta Titel
        </label>
        <input
          type="text"
          value={customization.seo.meta_title}
          onChange={(e) => setCustomization(prev => ({
            ...prev,
            seo: { ...prev.seo, meta_title: e.target.value }
          }))}
          placeholder="Ihre Werkstatt - Professioneller KFZ-Service"
          maxLength={60}
          style={{
            width: '100%',
            padding: isMobile ? '0.75rem' : '0.5rem',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: isMobile ? '1rem' : '0.875rem',
            boxSizing: 'border-box'
          }}
        />
        <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '0.25rem 0 0 0' }}>
          {customization.seo.meta_title.length}/60 Zeichen
        </p>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label style={{
          display: 'block',
          fontSize: '0.875rem',
          fontWeight: 'bold',
          color: '#374151',
          marginBottom: '0.5rem'
        }}>
          Meta Beschreibung
        </label>
        <textarea
          value={customization.seo.meta_description}
          onChange={(e) => setCustomization(prev => ({
            ...prev,
            seo: { ...prev.seo, meta_description: e.target.value }
          }))}
          placeholder="Professionelle KFZ-Services in Ihrer Nähe. Wartung, Reparatur und TÜV von erfahrenen Mechanikern."
          maxLength={160}
          rows={3}
          style={{
            width: '100%',
            padding: isMobile ? '0.75rem' : '0.5rem',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: isMobile ? '1rem' : '0.875rem',
            boxSizing: 'border-box',
            resize: 'vertical'
          }}
        />
        <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '0.25rem 0 0 0' }}>
          {customization.seo.meta_description.length}/160 Zeichen
        </p>
      </div>

      <div>
        <label style={{
          display: 'block',
          fontSize: '0.875rem',
          fontWeight: 'bold',
          color: '#374151',
          marginBottom: '0.5rem'
        }}>
          Keywords (kommagetrennt)
        </label>
        <input
          type="text"
          value={customization.seo.meta_keywords}
          onChange={(e) => setCustomization(prev => ({
            ...prev,
            seo: { ...prev.seo, meta_keywords: e.target.value }
          }))}
          placeholder="Autowerkstatt, KFZ-Service, Reparatur, Wartung, TÜV"
          style={{
            width: '100%',
            padding: isMobile ? '0.75rem' : '0.5rem',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: isMobile ? '1rem' : '0.875rem',
            boxSizing: 'border-box'
          }}
        />
      </div>
    </div>
  )
}

// Live Preview Component
function LivePreview({ customization, isMobile }) {
  return (
    <div style={{
      width: '100%',
      height: '100%',
      background: customization.colors.background,
      color: customization.colors.text,
      fontFamily: customization.typography.font_family,
      overflow: 'auto'
    }}>
      {/* Header */}
      <div style={{
        background: `linear-gradient(135deg, ${customization.colors.primary}, ${customization.colors.secondary})`,
        color: 'white',
        padding: isMobile ? '0.5rem' : '1rem',
        textAlign: 'center'
      }}>
        <h1 style={{ 
          margin: 0, 
          fontSize: isMobile ? '1rem' : '1.5rem' 
        }}>
          {customization.branding.hero_title || 'Ihre Werkstatt'}
        </h1>
        <p style={{ 
          margin: '0.25rem 0 0 0', 
          opacity: 0.9,
          fontSize: isMobile ? '0.75rem' : '1rem'
        }}>
          {customization.branding.hero_subtitle || 'Ihr zuverlässiger Partner'}
        </p>
      </div>

      {/* Content Preview */}
      <div style={{ padding: isMobile ? '1rem' : '1.5rem' }}>
        <section style={{ marginBottom: isMobile ? '1rem' : '2rem' }}>
          <h2 style={{ 
            color: customization.colors.primary,
            margin: '0 0 0.5rem 0',
            fontSize: isMobile ? '1rem' : '1.25rem'
          }}>
            {customization.content.about_title}
          </h2>
          <p style={{ 
            margin: 0, 
            lineHeight: '1.5',
            fontSize: isMobile ? '0.75rem' : '0.875rem'
          }}>
            {customization.content.about_content || 'Hier steht Ihr Text über die Werkstatt...'}
          </p>
        </section>

        <section style={{ marginBottom: isMobile ? '1rem' : '2rem' }}>
          <h2 style={{ 
            color: customization.colors.primary,
            margin: '0 0 0.5rem 0',
            fontSize: isMobile ? '1rem' : '1.25rem'
          }}>
            {customization.content.services_title}
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr 1fr' : '1fr 1fr 1fr',
            gap: '0.5rem'
          }}>
            {['Wartung', 'Reparatur', 'TÜV'].map(service => (
              <div key={service} style={{
                padding: '0.5rem',
                background: customization.colors.accent + '20',
                borderRadius: '4px',
                textAlign: 'center',
                fontSize: isMobile ? '0.75rem' : '0.875rem'
              }}>
                {service}
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 style={{ 
            color: customization.colors.primary,
            margin: '0 0 0.5rem 0',
            fontSize: isMobile ? '1rem' : '1.25rem'
          }}>
            Kontakt
          </h2>
          <div style={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}>
            {customization.contact_details.address && (
              <p style={{ margin: '0.25rem 0' }}>📍 {customization.contact_details.address}</p>
            )}
            {customization.contact_details.phone && (
              <p style={{ margin: '0.25rem 0' }}>📞 {customization.contact_details.phone}</p>
            )}
            {customization.contact_details.email && (
              <p style={{ margin: '0.25rem 0' }}>✉️ {customization.contact_details.email}</p>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}