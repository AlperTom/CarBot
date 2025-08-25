'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export default function UIThemesPage() {
  const [workshop, setWorkshop] = useState(null)
  const [clientKeys, setClientKeys] = useState([])
  const [selectedKey, setSelectedKey] = useState(null)
  const [customization, setCustomization] = useState({
    theme_name: 'default',
    primary_color: '#0070f3',
    secondary_color: '#6b7280',
    accent_color: '#10b981',
    font_family: 'Inter',
    border_radius: '8px',
    chat_position: 'bottom-right',
    welcome_message: 'Hallo! Wie kann ich Ihnen helfen?',
    custom_css: '',
    logo_url: '',
    background_pattern: 'none'
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadWorkshopAndKeys()
  }, [])

  useEffect(() => {
    if (selectedKey) {
      loadCustomization(selectedKey)
    }
  }, [selectedKey])

  async function loadWorkshopAndKeys() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: workshopData, error: workshopError } = await supabase
        .from('workshops')
        .select('*')
        .eq('owner_email', user.email)
        .single()

      if (workshopError) throw workshopError
      setWorkshop(workshopData)

      const { data: keysData, error: keysError } = await supabase
        .from('client_keys')
        .select('*')
        .eq('workshop_id', workshopData.id)
        .eq('is_active', true)

      if (keysError) throw keysError
      setClientKeys(keysData || [])
      
      if (keysData && keysData.length > 0) {
        setSelectedKey(keysData[0].id)
      }
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  async function loadCustomization(keyId) {
    try {
      const { data, error } = await supabase
        .from('ui_customizations')
        .select('*')
        .eq('client_key_id', keyId)
        .single()

      if (error && error.code !== 'PGRST116') throw error
      
      if (data) {
        setCustomization(data)
      } else {
        // Reset to defaults if no customization exists
        setCustomization({
          theme_name: 'default',
          primary_color: '#0070f3',
          secondary_color: '#6b7280',
          accent_color: '#10b981',
          font_family: 'Inter',
          border_radius: '8px',
          chat_position: 'bottom-right',
          welcome_message: `Hallo! Wie kann ich Ihnen bei ${workshop?.name || 'Ihrer Werkstatt'} helfen?`,
          custom_css: '',
          logo_url: '',
          background_pattern: 'none'
        })
      }
    } catch (error) {
      console.error('Error loading customization:', error)
    }
  }

  async function saveCustomization() {
    if (!selectedKey || !workshop) return

    setSaving(true)
    try {
      const customizationData = {
        workshop_id: workshop.id,
        client_key_id: selectedKey,
        ...customization,
        updated_at: new Date().toISOString()
      }

      const { error } = await supabase
        .from('ui_customizations')
        .upsert(customizationData, {
          onConflict: 'client_key_id'
        })

      if (error) throw error
      
      alert('Einstellungen gespeichert!')
    } catch (error) {
      console.error('Error saving customization:', error)
      alert('Fehler beim Speichern')
    } finally {
      setSaving(false)
    }
  }

  const presetThemes = [
    {
      name: 'CarBot Standard',
      primary_color: '#0070f3',
      secondary_color: '#6b7280',
      accent_color: '#10b981',
      font_family: 'Inter'
    },
    {
      name: 'Automotive Pro',
      primary_color: '#1f2937',
      secondary_color: '#9ca3af',
      accent_color: '#f59e0b',
      font_family: 'Inter'
    },
    {
      name: 'Premium Gold',
      primary_color: '#92400e',
      secondary_color: '#6b7280',
      accent_color: '#d97706',
      font_family: 'Playfair Display'
    },
    {
      name: 'Modern Blue',
      primary_color: '#1e40af',
      secondary_color: '#64748b',
      accent_color: '#0ea5e9',
      font_family: 'Inter'
    }
  ]

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">UI Theme Anpassung</h1>
        <p className="text-gray-600 mt-2">
          Passen Sie das Aussehen Ihres CarBot Widgets für verschiedene Client-Keys an
        </p>
      </div>

      {clientKeys.length === 0 ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
          <div className="text-4xl mb-4">🔑</div>
          <h3 className="text-lg font-medium text-yellow-800 mb-2">Keine aktiven Client-Keys</h3>
          <p className="text-yellow-700">
            Erstellen Sie zuerst einen Client-Key, bevor Sie das UI anpassen können.
          </p>
          <Link href="/dashboard/client-keys" className="mt-4 inline-block bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700">
            Client-Keys verwalten
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Settings Panel */}
          <div className="space-y-6">
            {/* Client Key Selection */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h2 className="text-xl font-semibold mb-4">Client-Key auswählen</h2>
              <select
                value={selectedKey || ''}
                onChange={(e) => setSelectedKey(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {clientKeys.map(key => (
                  <option key={key.id} value={key.id}>
                    {key.key_name} ({key.client_key})
                  </option>
                ))}
              </select>
            </div>

            {/* Theme Presets */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h2 className="text-xl font-semibold mb-4">Vorgefertigte Themes</h2>
              <div className="grid grid-cols-2 gap-3">
                {presetThemes.map((theme, index) => (
                  <button
                    key={index}
                    onClick={() => setCustomization(prev => ({
                      ...prev,
                      theme_name: theme.name,
                      primary_color: theme.primary_color,
                      secondary_color: theme.secondary_color,
                      accent_color: theme.accent_color,
                      font_family: theme.font_family
                    }))}
                    className="p-3 border rounded-lg hover:bg-gray-50 text-left"
                  >
                    <div className="font-medium text-sm">{theme.name}</div>
                    <div className="flex gap-2 mt-2">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: theme.primary_color }}
                      ></div>
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: theme.accent_color }}
                      ></div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Color Settings */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h2 className="text-xl font-semibold mb-4">Farben</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Primärfarbe
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="color"
                      value={customization.primary_color}
                      onChange={(e) => setCustomization(prev => ({...prev, primary_color: e.target.value}))}
                      className="w-12 h-10 border border-gray-300 rounded"
                    />
                    <input
                      type="text"
                      value={customization.primary_color}
                      onChange={(e) => setCustomization(prev => ({...prev, primary_color: e.target.value}))}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Akzentfarbe
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="color"
                      value={customization.accent_color}
                      onChange={(e) => setCustomization(prev => ({...prev, accent_color: e.target.value}))}
                      className="w-12 h-10 border border-gray-300 rounded"
                    />
                    <input
                      type="text"
                      value={customization.accent_color}
                      onChange={(e) => setCustomization(prev => ({...prev, accent_color: e.target.value}))}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Layout Settings */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h2 className="text-xl font-semibold mb-4">Layout & Position</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chat Position
                  </label>
                  <select
                    value={customization.chat_position}
                    onChange={(e) => setCustomization(prev => ({...prev, chat_position: e.target.value}))}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="bottom-right">Unten Rechts</option>
                    <option value="bottom-left">Unten Links</option>
                    <option value="top-right">Oben Rechts</option>
                    <option value="top-left">Oben Links</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Schriftart
                  </label>
                  <select
                    value={customization.font_family}
                    onChange={(e) => setCustomization(prev => ({...prev, font_family: e.target.value}))}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Inter">Inter (Modern)</option>
                    <option value="Roboto">Roboto (Google)</option>
                    <option value="Open Sans">Open Sans</option>
                    <option value="Lato">Lato</option>
                    <option value="Playfair Display">Playfair Display (Elegant)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Border Radius
                  </label>
                  <select
                    value={customization.border_radius}
                    onChange={(e) => setCustomization(prev => ({...prev, border_radius: e.target.value}))}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="4px">Scharf (4px)</option>
                    <option value="8px">Normal (8px)</option>
                    <option value="12px">Rund (12px)</option>
                    <option value="20px">Sehr Rund (20px)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Message Settings */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h2 className="text-xl font-semibold mb-4">Nachrichten</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Begrüßungsnachricht
                </label>
                <textarea
                  value={customization.welcome_message}
                  onChange={(e) => setCustomization(prev => ({...prev, welcome_message: e.target.value}))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Hallo! Wie kann ich Ihnen helfen?"
                />
              </div>
            </div>

            <button
              onClick={saveCustomization}
              disabled={saving || !selectedKey}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-medium"
            >
              {saving ? 'Speichere...' : 'Einstellungen speichern'}
            </button>
          </div>

          {/* Preview Panel */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-semibold mb-4">Live Vorschau</h2>
            
            <div className="relative bg-gray-100 rounded-lg h-96 overflow-hidden">
              {/* Fake website background */}
              <div className="p-4 space-y-4 opacity-50">
                <div className="h-8 bg-gray-300 rounded w-1/2"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                <div className="h-32 bg-gray-300 rounded"></div>
              </div>

              {/* Chat Widget Preview */}
              <div 
                className="absolute"
                style={{
                  [customization.chat_position.includes('right') ? 'right' : 'left']: '20px',
                  [customization.chat_position.includes('bottom') ? 'bottom' : 'top']: '20px'
                }}
              >
                {/* Chat Button */}
                <div 
                  className="w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg mb-2 cursor-pointer"
                  style={{ 
                    backgroundColor: customization.primary_color,
                    borderRadius: customization.border_radius === '4px' ? '50%' : '50%'
                  }}
                >
                  💬
                </div>

                {/* Chat Window */}
                <div 
                  className="w-80 h-64 bg-white shadow-xl flex flex-col overflow-hidden"
                  style={{ 
                    borderRadius: customization.border_radius,
                    fontFamily: customization.font_family
                  }}
                >
                  {/* Header */}
                  <div 
                    className="p-4 text-white"
                    style={{ backgroundColor: customization.primary_color }}
                  >
                    <div className="font-semibold text-sm">
                      {workshop?.name || 'Ihre Werkstatt'}
                    </div>
                    <div className="text-xs opacity-90">CarBot Assistant</div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 p-4 bg-gray-50">
                    <div 
                      className="bg-white p-3 text-sm mb-3"
                      style={{ 
                        borderRadius: customization.border_radius,
                        borderLeft: `3px solid ${customization.accent_color}`
                      }}
                    >
                      {customization.welcome_message}
                    </div>
                    
                    <div 
                      className="bg-blue-500 text-white p-3 text-sm ml-8"
                      style={{ 
                        backgroundColor: customization.primary_color,
                        borderRadius: customization.border_radius
                      }}
                    >
                      Ich hätte gerne einen Termin!
                    </div>
                  </div>

                  {/* Input */}
                  <div className="p-3 border-t bg-white">
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="Nachricht..." 
                        className="flex-1 px-3 py-2 border text-sm rounded"
                        style={{ borderRadius: customization.border_radius }}
                        disabled
                      />
                      <button 
                        className="px-4 py-2 text-white text-sm rounded"
                        style={{ 
                          backgroundColor: customization.primary_color,
                          borderRadius: customization.border_radius
                        }}
                        disabled
                      >
                        Send
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium mb-2">Integration Code:</h3>
              <pre className="text-xs bg-white p-3 rounded border overflow-x-auto">
{`<script>
  window.carBotConfig = {
    clientKey: '${clientKeys.find(k => k.id === selectedKey)?.client_key || 'your-key'}',
    theme: {
      primaryColor: '${customization.primary_color}',
      accentColor: '${customization.accent_color}',
      fontFamily: '${customization.font_family}',
      borderRadius: '${customization.border_radius}',
      position: '${customization.chat_position}',
      welcomeMessage: '${customization.welcome_message}'
    }
  };
</script>`}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}