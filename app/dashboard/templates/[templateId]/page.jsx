'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import TemplateEditor from '../../../../components/TemplateEditor'
import TemplatePreview from '../../../../components/TemplatePreview'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function TemplateEditorPage({ params }) {
  const [landingPage, setLandingPage] = useState(null)
  const [template, setTemplate] = useState(null)
  const [workshop, setWorkshop] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('editor')
  const [customizations, setCustomizations] = useState({})
  const [previewMode, setPreviewMode] = useState('desktop')
  const [publishingState, setPublishingState] = useState('draft')
  const [hasChanges, setHasChanges] = useState(false)
  const [lastSaved, setLastSaved] = useState(null)
  const router = useRouter()

  useEffect(() => {
    if (params.templateId) {
      loadLandingPage()
    }
  }, [params.templateId])

  useEffect(() => {
    // Auto-save functionality
    const autoSave = setInterval(() => {
      if (hasChanges && customizations && Object.keys(customizations).length > 0) {
        handleAutoSave()
      }
    }, 30000) // Auto-save every 30 seconds

    return () => clearInterval(autoSave)
  }, [hasChanges, customizations])

  async function loadLandingPage() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Load workshop
      const { data: workshopData, error: workshopError } = await supabase
        .from('workshops')
        .select('*')
        .eq('owner_email', user.email)
        .single()

      if (workshopError) throw workshopError
      setWorkshop(workshopData)

      // Load landing page with template
      const { data: pageData, error: pageError } = await supabase
        .from('workshop_landing_pages')
        .select(`
          *,
          landing_page_templates(
            id, name, description, category, template_html, template_css, template_js,
            customization_schema, default_config, color_scheme, target_audience
          )
        `)
        .eq('id', params.templateId)
        .eq('workshop_id', workshopData.id)
        .single()

      if (pageError) {
        console.error('Error loading landing page:', pageError)
        router.push('/dashboard/templates')
        return
      }

      setLandingPage(pageData)
      setTemplate(pageData.landing_page_templates)
      setCustomizations(JSON.parse(pageData.customizations || '{}'))
      setPublishingState(pageData.is_published ? 'published' : 'draft')
      
    } catch (error) {
      console.error('Error loading landing page:', error)
      router.push('/dashboard/templates')
    } finally {
      setLoading(false)
    }
  }

  async function handleAutoSave() {
    if (!landingPage || !hasChanges) return

    try {
      const { error } = await supabase
        .from('workshop_landing_pages')
        .update({
          auto_save_data: JSON.stringify(customizations),
          updated_at: new Date().toISOString()
        })
        .eq('id', landingPage.id)

      if (!error) {
        setLastSaved(new Date())
      }
    } catch (error) {
      console.error('Auto-save error:', error)
    }
  }

  async function handleSave() {
    if (!landingPage || !customizations) return

    try {
      const { error } = await supabase
        .from('workshop_landing_pages')
        .update({
          customizations: JSON.stringify(customizations),
          updated_at: new Date().toISOString()
        })
        .eq('id', landingPage.id)

      if (error) throw error

      setHasChanges(false)
      setLastSaved(new Date())
      
      // Show success message
      const successMessage = document.createElement('div')
      successMessage.style.cssText = `
        position: fixed; top: 20px; right: 20px; z-index: 1000;
        background: #10b981; color: white; padding: 12px 20px;
        border-radius: 8px; font-weight: 500; box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      `
      successMessage.textContent = '✅ Änderungen gespeichert!'
      document.body.appendChild(successMessage)
      
      setTimeout(() => document.body.removeChild(successMessage), 3000)

    } catch (error) {
      console.error('Save error:', error)
      alert('Fehler beim Speichern der Änderungen')
    }
  }

  async function handlePublish() {
    if (!landingPage || !workshop) return

    try {
      const { data, error } = await supabase.rpc('publish_landing_page', {
        p_landing_page_id: landingPage.id,
        p_user_id: (await supabase.auth.getUser()).data.user?.id
      })

      if (error) throw error

      if (data.success) {
        setPublishingState('published')
        setLandingPage(prev => ({
          ...prev,
          is_published: true,
          published_at: new Date().toISOString()
        }))

        alert(`✅ Landing Page erfolgreich veröffentlicht!\n\nURL: ${data.url}`)
      } else {
        alert(`❌ Fehler beim Veröffentlichen: ${data.error}`)
      }

    } catch (error) {
      console.error('Publish error:', error)
      alert('Fehler beim Veröffentlichen der Landing Page')
    }
  }

  async function handleUnpublish() {
    if (!landingPage) return

    try {
      const { error } = await supabase
        .from('workshop_landing_pages')
        .update({
          is_published: false,
          updated_at: new Date().toISOString()
        })
        .eq('id', landingPage.id)

      if (error) throw error

      setPublishingState('draft')
      setLandingPage(prev => ({
        ...prev,
        is_published: false
      }))

      alert('Landing Page wurde offline genommen')

    } catch (error) {
      console.error('Unpublish error:', error)
      alert('Fehler beim Offline-nehmen der Landing Page')
    }
  }

  function handleCustomizationChange(newCustomizations) {
    setCustomizations(newCustomizations)
    setHasChanges(true)
  }

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f9fafb'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎨</div>
          <div style={{ color: '#6b7280', fontSize: '1.1rem' }}>Lade Template Editor...</div>
        </div>
      </div>
    )
  }

  if (!landingPage || !template) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f9fafb'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>❌</div>
          <div style={{ color: '#6b7280', fontSize: '1.1rem' }}>Template nicht gefunden</div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#f3f4f6' }}>
      {/* Header */}
      <div style={{
        background: 'white',
        borderBottom: '1px solid #e5e7eb',
        padding: '1rem 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            onClick={() => router.push('/dashboard/templates')}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              padding: '0.5rem',
              borderRadius: '6px',
              color: '#6b7280'
            }}
          >
            ←
          </button>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.25rem', color: '#1f2937' }}>
              {landingPage.page_title}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.25rem' }}>
              <span style={{
                fontSize: '0.8rem',
                color: '#6b7280',
                background: '#f3f4f6',
                padding: '0.25rem 0.5rem',
                borderRadius: '4px'
              }}>
                {template.name} • {template.category}
              </span>
              {lastSaved && (
                <span style={{ fontSize: '0.75rem', color: '#10b981' }}>
                  Zuletzt gespeichert: {lastSaved.toLocaleTimeString('de-DE')}
                </span>
              )}
              {hasChanges && (
                <span style={{ fontSize: '0.75rem', color: '#f59e0b' }}>
                  • Ungespeicherte Änderungen
                </span>
              )}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Preview Mode Toggle */}
          <div style={{
            display: 'flex',
            background: '#f3f4f6',
            borderRadius: '8px',
            padding: '0.25rem'
          }}>
            {['desktop', 'tablet', 'mobile'].map(mode => (
              <button
                key={mode}
                onClick={() => setPreviewMode(mode)}
                style={{
                  padding: '0.5rem 0.75rem',
                  background: previewMode === mode ? 'white' : 'transparent',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  color: previewMode === mode ? '#1f2937' : '#6b7280',
                  boxShadow: previewMode === mode ? '0 1px 2px rgba(0,0,0,0.1)' : 'none'
                }}
              >
                {mode === 'desktop' && '🖥️'} 
                {mode === 'tablet' && '📱'} 
                {mode === 'mobile' && '📱'}
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </button>
            ))}
          </div>

          {/* Actions */}
          <button
            onClick={handleSave}
            disabled={!hasChanges}
            style={{
              padding: '0.5rem 1rem',
              background: hasChanges ? '#3b82f6' : '#e5e7eb',
              color: hasChanges ? 'white' : '#9ca3af',
              border: 'none',
              borderRadius: '6px',
              fontSize: '0.9rem',
              fontWeight: '500',
              cursor: hasChanges ? 'pointer' : 'not-allowed'
            }}
          >
            Speichern
          </button>

          {publishingState === 'published' ? (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <a
                href={`/workshop/${workshop.slug}/${landingPage.slug}`}
                target="_blank"
                style={{
                  padding: '0.5rem 1rem',
                  background: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  textDecoration: 'none'
                }}
              >
                🌐 Ansehen
              </a>
              <button
                onClick={handleUnpublish}
                style={{
                  padding: '0.5rem 1rem',
                  background: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                Offline nehmen
              </button>
            </div>
          ) : (
            <button
              onClick={handlePublish}
              style={{
                padding: '0.5rem 1rem',
                background: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '0.9rem',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              🚀 Veröffentlichen
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        background: 'white',
        borderBottom: '1px solid #e5e7eb',
        padding: '0 2rem',
        display: 'flex',
        gap: '0'
      }}>
        {[
          { id: 'editor', label: '🎨 Editor', icon: '🎨' },
          { id: 'preview', label: '👁️ Vorschau', icon: '👁️' },
          { id: 'settings', label: '⚙️ Einstellungen', icon: '⚙️' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '0.75rem 1.5rem',
              background: 'none',
              border: 'none',
              borderBottom: `2px solid ${activeTab === tab.id ? '#3b82f6' : 'transparent'}`,
              color: activeTab === tab.id ? '#3b82f6' : '#6b7280',
              fontSize: '0.9rem',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {activeTab === 'editor' && (
          <>
            {/* Editor Sidebar */}
            <div style={{
              width: '400px',
              background: 'white',
              borderRight: '1px solid #e5e7eb',
              overflow: 'auto'
            }}>
              <TemplateEditor
                template={template}
                customizations={customizations}
                onChange={handleCustomizationChange}
                workshop={workshop}
              />
            </div>

            {/* Preview */}
            <div style={{ flex: 1, background: '#f9fafb', overflow: 'auto' }}>
              <TemplatePreview
                template={template}
                customizations={customizations}
                previewMode={previewMode}
                workshop={workshop}
              />
            </div>
          </>
        )}

        {activeTab === 'preview' && (
          <div style={{ flex: 1, background: '#f9fafb', overflow: 'auto' }}>
            <TemplatePreview
              template={template}
              customizations={customizations}
              previewMode={previewMode}
              workshop={workshop}
              fullScreen={true}
            />
          </div>
        )}

        {activeTab === 'settings' && (
          <div style={{ flex: 1, padding: '2rem', background: 'white', overflow: 'auto' }}>
            <TemplateSettingsPanel
              landingPage={landingPage}
              workshop={workshop}
              onSettingsChange={(settings) => {
                // Handle settings changes
                console.log('Settings changed:', settings)
              }}
            />
          </div>
        )}
      </div>
    </div>
  )
}

// Template Settings Panel Component
function TemplateSettingsPanel({ landingPage, workshop, onSettingsChange }) {
  const [settings, setSettings] = useState({
    customDomain: landingPage.custom_domain || '',
    googleAnalyticsId: landingPage.google_analytics_id || '',
    facebookPixelId: landingPage.facebook_pixel_id || '',
    sslEnabled: landingPage.ssl_enabled || false,
    cookieConsent: landingPage.cookie_consent_enabled || true,
    privacyPolicyUrl: landingPage.privacy_policy_url || '',
    imprintUrl: landingPage.imprint_url || ''
  })

  async function handleSaveSettings() {
    try {
      const { error } = await supabase
        .from('workshop_landing_pages')
        .update({
          custom_domain: settings.customDomain || null,
          google_analytics_id: settings.googleAnalyticsId || null,
          facebook_pixel_id: settings.facebookPixelId || null,
          ssl_enabled: settings.sslEnabled,
          cookie_consent_enabled: settings.cookieConsent,
          privacy_policy_url: settings.privacyPolicyUrl || null,
          imprint_url: settings.imprintUrl || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', landingPage.id)

      if (error) throw error

      alert('✅ Einstellungen erfolgreich gespeichert!')
      onSettingsChange(settings)

    } catch (error) {
      console.error('Settings save error:', error)
      alert('❌ Fehler beim Speichern der Einstellungen')
    }
  }

  return (
    <div style={{ maxWidth: '800px' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '2rem', color: '#1f2937' }}>
        ⚙️ Landing Page Einstellungen
      </h2>

      {/* Domain Settings */}
      <div style={{ marginBottom: '2rem', padding: '1.5rem', background: '#f9fafb', borderRadius: '12px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem', color: '#1f2937' }}>
          🌐 Domain & URL
        </h3>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '500', marginBottom: '0.5rem', color: '#374151' }}>
            Aktuelle URL:
          </label>
          <code style={{ 
            background: '#e5e7eb', 
            padding: '0.5rem', 
            borderRadius: '4px', 
            fontSize: '0.9rem',
            display: 'block'
          }}>
            https://carbot.de/workshop/{workshop.slug}/{landingPage.slug}
          </code>
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '500', marginBottom: '0.5rem', color: '#374151' }}>
            Eigene Domain (optional):
          </label>
          <input
            type="text"
            value={settings.customDomain}
            onChange={(e) => setSettings(prev => ({ ...prev, customDomain: e.target.value }))}
            placeholder="meine-werkstatt.de"
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '0.9rem'
            }}
          />
          <div style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '0.5rem' }}>
            Nur für Professional und Enterprise Pakete verfügbar
          </div>
        </div>
      </div>

      {/* Analytics */}
      <div style={{ marginBottom: '2rem', padding: '1.5rem', background: '#f9fafb', borderRadius: '12px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem', color: '#1f2937' }}>
          📊 Analytics & Tracking
        </h3>
        <div style={{ display: 'grid', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '500', marginBottom: '0.5rem', color: '#374151' }}>
              Google Analytics ID:
            </label>
            <input
              type="text"
              value={settings.googleAnalyticsId}
              onChange={(e) => setSettings(prev => ({ ...prev, googleAnalyticsId: e.target.value }))}
              placeholder="GA-XXXXXXXXX-X"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '0.9rem'
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '500', marginBottom: '0.5rem', color: '#374151' }}>
              Facebook Pixel ID:
            </label>
            <input
              type="text"
              value={settings.facebookPixelId}
              onChange={(e) => setSettings(prev => ({ ...prev, facebookPixelId: e.target.value }))}
              placeholder="123456789012345"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '0.9rem'
              }}
            />
          </div>
        </div>
      </div>

      {/* GDPR Compliance */}
      <div style={{ marginBottom: '2rem', padding: '1.5rem', background: '#f9fafb', borderRadius: '12px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem', color: '#1f2937' }}>
          🔒 DSGVO & Datenschutz
        </h3>
        <div style={{ display: 'grid', gap: '1rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={settings.cookieConsent}
              onChange={(e) => setSettings(prev => ({ ...prev, cookieConsent: e.target.checked }))}
              style={{ cursor: 'pointer' }}
            />
            <span style={{ fontSize: '0.9rem', color: '#374151' }}>Cookie-Consent Banner aktivieren</span>
          </label>
          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '500', marginBottom: '0.5rem', color: '#374151' }}>
              Datenschutzerklärung URL:
            </label>
            <input
              type="url"
              value={settings.privacyPolicyUrl}
              onChange={(e) => setSettings(prev => ({ ...prev, privacyPolicyUrl: e.target.value }))}
              placeholder="https://meine-werkstatt.de/datenschutz"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '0.9rem'
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '500', marginBottom: '0.5rem', color: '#374151' }}>
              Impressum URL:
            </label>
            <input
              type="url"
              value={settings.imprintUrl}
              onChange={(e) => setSettings(prev => ({ ...prev, imprintUrl: e.target.value }))}
              placeholder="https://meine-werkstatt.de/impressum"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '0.9rem'
              }}
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSaveSettings}
        style={{
          padding: '1rem 2rem',
          background: '#3b82f6',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '1rem',
          fontWeight: '600',
          cursor: 'pointer',
          boxShadow: '0 2px 4px rgba(59, 130, 246, 0.25)'
        }}
      >
        Einstellungen speichern
      </button>
    </div>
  )
}