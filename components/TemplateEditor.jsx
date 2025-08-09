'use client'

import React, { useState, useEffect } from 'react'

/**
 * CarBot Template Editor - Premium automotive template customization
 * Designed for German workshop owners to create converting landing pages
 */
export default function TemplateEditor({ templateId, initialData = {} }) {
  const [templateData, setTemplateData] = useState({
    name: initialData.name || '',
    businessName: initialData.businessName || 'Ihre Autowerkstatt',
    description: initialData.description || 'Professionelle KFZ-Reparaturen und Service',
    phone: initialData.phone || '+49 30 12345678',
    address: initialData.address || 'Musterstraße 123, 12345 Berlin',
    email: initialData.email || 'kontakt@autowerkstatt.de',
    colors: {
      primary: initialData.colors?.primary || '#007bff',
      secondary: initialData.colors?.secondary || '#6c757d',
      accent: initialData.colors?.accent || '#28a745'
    },
    services: initialData.services || [
      'Inspektion & Wartung',
      'Reparaturen aller Art',
      'TÜV & AU',
      'Reifen & Felgen',
      'Klimaanlagenservice'
    ],
    ...initialData
  })

  const [previewMode, setPreviewMode] = useState(false)
  const [saving, setSaving] = useState(false)

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      setTemplateData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }))
    } else {
      setTemplateData(prev => ({
        ...prev,
        [field]: value
      }))
    }
  }

  const handleServiceChange = (index, value) => {
    const newServices = [...templateData.services]
    newServices[index] = value
    setTemplateData(prev => ({
      ...prev,
      services: newServices
    }))
  }

  const addService = () => {
    setTemplateData(prev => ({
      ...prev,
      services: [...prev.services, 'Neue Dienstleistung']
    }))
  }

  const removeService = (index) => {
    const newServices = templateData.services.filter((_, i) => i !== index)
    setTemplateData(prev => ({
      ...prev,
      services: newServices
    }))
  }

  const saveTemplate = async () => {
    setSaving(true)
    try {
      // TODO: API call to save template
      console.log('Saving CarBot template:', templateData)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      alert('Template erfolgreich gespeichert! 🚗')
    } catch (error) {
      console.error('Error saving template:', error)
      alert('Fehler beim Speichern der Vorlage')
    } finally {
      setSaving(false)
    }
  }

  if (previewMode) {
    return (
      <div className="template-editor-preview">
        <div className="preview-header">
          <h2>Vorschau: {templateData.businessName}</h2>
          <button 
            onClick={() => setPreviewMode(false)}
            className="btn btn-secondary"
          >
            Bearbeitung fortsetzen
          </button>
        </div>
        <div className="preview-frame">
          {/* Preview content will be rendered here */}
          <div 
            className="automotive-template-preview"
            style={{
              '--primary-color': templateData.colors.primary,
              '--secondary-color': templateData.colors.secondary,
              '--accent-color': templateData.colors.accent
            }}
          >
            <header style={{ backgroundColor: templateData.colors.primary, color: 'white', padding: '2rem' }}>
              <h1>{templateData.businessName}</h1>
              <p>{templateData.description}</p>
            </header>
            
            <section style={{ padding: '2rem' }}>
              <h2>Unsere Dienstleistungen</h2>
              <ul>
                {templateData.services.map((service, index) => (
                  <li key={index} style={{ marginBottom: '0.5rem' }}>{service}</li>
                ))}
              </ul>
            </section>
            
            <footer style={{ backgroundColor: templateData.colors.secondary, color: 'white', padding: '1rem' }}>
              <p><strong>Kontakt:</strong> {templateData.phone} | {templateData.email}</p>
              <p><strong>Adresse:</strong> {templateData.address}</p>
            </footer>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="template-editor">
      <div className="editor-header">
        <h2>Template bearbeiten: {templateId}</h2>
        <div className="editor-actions">
          <button 
            onClick={() => setPreviewMode(true)}
            className="btn btn-outline-primary"
          >
            Vorschau anzeigen
          </button>
          <button 
            onClick={saveTemplate}
            disabled={saving}
            className="btn btn-primary"
          >
            {saving ? 'Speichern...' : 'Speichern'}
          </button>
        </div>
      </div>

      <div className="editor-content">
        <div className="form-section">
          <h3>Grundinformationen</h3>
          
          <div className="form-group">
            <label htmlFor="businessName">Firmenname:</label>
            <input
              type="text"
              id="businessName"
              value={templateData.businessName}
              onChange={(e) => handleInputChange('businessName', e.target.value)}
              placeholder="Ihre Autowerkstatt"
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Beschreibung:</label>
            <textarea
              id="description"
              value={templateData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Professionelle KFZ-Reparaturen und Service"
              className="form-control"
              rows="3"
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Telefon:</label>
            <input
              type="tel"
              id="phone"
              value={templateData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="+49 30 12345678"
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">E-Mail:</label>
            <input
              type="email"
              id="email"
              value={templateData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="kontakt@autowerkstatt.de"
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label htmlFor="address">Adresse:</label>
            <input
              type="text"
              id="address"
              value={templateData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="Musterstraße 123, 12345 Berlin"
              className="form-control"
            />
          </div>
        </div>

        <div className="form-section">
          <h3>Farbschema</h3>
          
          <div className="color-inputs">
            <div className="form-group">
              <label htmlFor="primaryColor">Hauptfarbe:</label>
              <input
                type="color"
                id="primaryColor"
                value={templateData.colors.primary}
                onChange={(e) => handleInputChange('colors.primary', e.target.value)}
                className="form-control color-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="secondaryColor">Sekundärfarbe:</label>
              <input
                type="color"
                id="secondaryColor"
                value={templateData.colors.secondary}
                onChange={(e) => handleInputChange('colors.secondary', e.target.value)}
                className="form-control color-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="accentColor">Akzentfarbe:</label>
              <input
                type="color"
                id="accentColor"
                value={templateData.colors.accent}
                onChange={(e) => handleInputChange('colors.accent', e.target.value)}
                className="form-control color-input"
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Dienstleistungen</h3>
          
          <div className="services-list">
            {templateData.services.map((service, index) => (
              <div key={index} className="service-item">
                <input
                  type="text"
                  value={service}
                  onChange={(e) => handleServiceChange(index, e.target.value)}
                  className="form-control"
                />
                <button
                  type="button"
                  onClick={() => removeService(index)}
                  className="btn btn-outline-danger btn-sm"
                >
                  Entfernen
                </button>
              </div>
            ))}
          </div>
          
          <button
            type="button"
            onClick={addService}
            className="btn btn-outline-primary"
          >
            Dienstleistung hinzufügen
          </button>
        </div>
      </div>

      <style jsx>{`
        .template-editor {
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem;
        }
        
        .editor-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #dee2e6;
        }
        
        .editor-actions {
          display: flex;
          gap: 1rem;
        }
        
        .form-section {
          margin-bottom: 2rem;
          padding: 1.5rem;
          background: #f8f9fa;
          border-radius: 0.5rem;
        }
        
        .form-section h3 {
          margin-bottom: 1rem;
          color: #495057;
        }
        
        .form-group {
          margin-bottom: 1rem;
        }
        
        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
        }
        
        .form-control {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid #ced4da;
          border-radius: 0.375rem;
          font-size: 1rem;
        }
        
        .color-inputs {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }
        
        .color-input {
          height: 50px;
        }
        
        .services-list {
          margin-bottom: 1rem;
        }
        
        .service-item {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }
        
        .service-item .form-control {
          flex: 1;
        }
        
        .btn {
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 0.375rem;
          cursor: pointer;
          font-size: 0.875rem;
          text-decoration: none;
          display: inline-block;
          text-align: center;
        }
        
        .btn-primary {
          background-color: #007bff;
          color: white;
        }
        
        .btn-outline-primary {
          background-color: transparent;
          color: #007bff;
          border: 1px solid #007bff;
        }
        
        .btn-secondary {
          background-color: #6c757d;
          color: white;
        }
        
        .btn-outline-danger {
          background-color: transparent;
          color: #dc3545;
          border: 1px solid #dc3545;
        }
        
        .btn:hover {
          opacity: 0.9;
        }
        
        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .template-editor-preview {
          height: 100vh;
          overflow-y: auto;
        }
        
        .preview-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 2rem;
          background: #f8f9fa;
          border-bottom: 1px solid #dee2e6;
        }
        
        .automotive-template-preview {
          min-height: 600px;
        }
      `}</style>
    </div>
  )
}