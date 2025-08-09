'use client'

/**
 * Widget Customization Interface
 * CarBot MVP - Professional Widget Appearance Editor
 * Implements advanced widget styling and behavior configuration
 */

import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'

export default function WidgetCustomizerPage() {
  const [clientKeys, setClientKeys] = useState([])
  const [selectedKey, setSelectedKey] = useState(null)
  const [currentPackage, setCurrentPackage] = useState(null)
  const [widgetConfig, setWidgetConfig] = useState(DEFAULT_WIDGET_CONFIG)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [previewMode, setPreviewMode] = useState('desktop') // desktop, tablet, mobile
  const [showChatPreview, setShowChatPreview] = useState(false)
  const [saving, setSaving] = useState(false)
  
  const router = useRouter()

  // Load data
  const loadData = useCallback(async () => {
    try {
      // Get current package information
      const packageResponse = await fetch('/api/packages?action=current')
      if (packageResponse.ok) {
        const packageData = await packageResponse.json()
        setCurrentPackage(packageData.package)
      }

      // Get client keys
      const keysResponse = await fetch('/api/keys')
      if (keysResponse.ok) {
        const keysData = await keysResponse.json()
        setClientKeys(keysData.keys || [])
        if (keysData.keys?.length > 0) {
          setSelectedKey(keysData.keys[0])
        }
      }

    } catch (error) {
      console.error('Error loading data:', error)
      setError('Fehler beim Laden der Daten')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [])

  // Load widget config for selected key
  useEffect(() => {
    if (selectedKey) {
      loadWidgetConfig()
    }
  }, [selectedKey])

  const loadWidgetConfig = async () => {
    try {
      const response = await fetch(`/api/widget/config?client_key=${selectedKey.client_key}`)
      if (response.ok) {
        const config = await response.json()
        setWidgetConfig({ ...DEFAULT_WIDGET_CONFIG, ...config.config })
      }
    } catch (error) {
      console.error('Error loading widget config:', error)
    }
  }

  const saveWidgetConfig = async () => {
    if (!selectedKey) return
    
    setSaving(true)
    try {
      const response = await fetch('/api/widget/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_key: selectedKey.client_key,
          config: widgetConfig
        })
      })

      if (response.ok) {
        alert('Widget-Konfiguration gespeichert!')
      } else {
        throw new Error('Failed to save configuration')
      }
    } catch (error) {
      console.error('Error saving widget config:', error)
      alert('Fehler beim Speichern der Konfiguration')
    } finally {
      setSaving(false)
    }
  }

  const canCustomizeWidget = currentPackage?.feature_access?.advancedCustomization || false

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Widget Customizer</h1>
            <p className="text-gray-600 mt-2">
              Passen Sie das Aussehen und Verhalten Ihres Chat-Widgets an
            </p>
          </div>
          
          {/* Package Status */}
          {currentPackage && (
            <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4 min-w-[280px]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-green-900">Widget Anpassung</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                  {currentPackage.name}
                </span>
              </div>
              
              {canCustomizeWidget ? (
                <p className="text-sm text-green-700">✅ Erweiterte Anpassung verfügbar</p>
              ) : (
                <div>
                  <p className="text-sm text-green-700 mb-2">⚠️ Basis-Anpassung</p>
                  <button 
                    onClick={() => router.push('/dashboard/billing')}
                    className="w-full bg-green-600 text-white text-xs py-2 px-3 rounded hover:bg-green-700 transition"
                  >
                    Für erweiterte Features upgraden
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        
        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
            <button onClick={() => setError(null)} className="ml-2 text-red-500 hover:text-red-700">×</button>
          </div>
        )}
      </div>

      {/* Client Key Selection */}
      {clientKeys.length > 0 && (
        <div className="mb-8 bg-white rounded-lg border p-6">
          <h2 className="text-lg font-semibold mb-4">Client-Key auswählen</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {clientKeys.map((key) => (
              <button
                key={key.id}
                onClick={() => setSelectedKey(key)}
                className={`p-4 border rounded-lg text-left transition ${
                  selectedKey?.id === key.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-medium">{key.key_name}</div>
                <div className="text-sm text-gray-500 font-mono mt-1">
                  {key.client_key.substring(0, 20)}...
                </div>
                <div className={`text-xs mt-2 px-2 py-1 rounded-full inline-block ${
                  key.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {key.is_active ? 'Aktiv' : 'Inaktiv'}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Feature Gate */}
      {!canCustomizeWidget && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-8 mb-8 text-center">
          <div className="text-6xl mb-4">🎨</div>
          <h2 className="text-2xl font-bold text-yellow-900 mb-2">Erweiterte Widget-Anpassung</h2>
          <p className="text-yellow-800 mb-6 max-w-2xl mx-auto">
            Passen Sie Ihr Chat-Widget vollständig an Ihr Corporate Design an. 
            Verfügbar ab dem Professional-Paket.
          </p>
          
          <div className="grid md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white/50 rounded-lg p-4">
              <div className="text-2xl mb-2">🎨</div>
              <h3 className="font-semibold text-yellow-900">Custom Colors</h3>
              <p className="text-sm text-yellow-700">Eigene Farben & Branding</p>
            </div>
            <div className="bg-white/50 rounded-lg p-4">
              <div className="text-2xl mb-2">📱</div>
              <h3 className="font-semibold text-yellow-900">Responsive Design</h3>
              <p className="text-sm text-yellow-700">Mobile & Desktop optimiert</p>
            </div>
            <div className="bg-white/50 rounded-lg p-4">
              <div className="text-2xl mb-2">⚙️</div>
              <h3 className="font-semibold text-yellow-900">Behavior Settings</h3>
              <p className="text-sm text-yellow-700">Auto-Open, Notifications</p>
            </div>
            <div className="bg-white/50 rounded-lg p-4">
              <div className="text-2xl mb-2">🔧</div>
              <h3 className="font-semibold text-yellow-900">Advanced Options</h3>
              <p className="text-sm text-yellow-700">Custom CSS & JavaScript</p>
            </div>
          </div>
          
          <button
            onClick={() => router.push('/dashboard/billing')}
            className="bg-yellow-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-yellow-700 transition-all transform hover:scale-105"
          >
            Auf Professional upgraden - ab €79/Monat
          </button>
        </div>
      )}

      {/* Main Customizer Interface */}
      {canCustomizeWidget && selectedKey && (
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Panel - Controls */}
          <div className="space-y-6">
            {/* Save Button */}
            <div className="bg-white rounded-lg border p-4">
              <button
                onClick={saveWidgetConfig}
                disabled={saving}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 transition flex items-center justify-center gap-2"
              >
                {saving ? '💾 Speichere...' : '💾 Konfiguration speichern'}
              </button>
            </div>

            {/* Style Presets */}
            <StylePresetsPanel 
              widgetConfig={widgetConfig}
              setWidgetConfig={setWidgetConfig}
            />

            {/* Colors */}
            <ColorsPanel 
              widgetConfig={widgetConfig}
              setWidgetConfig={setWidgetConfig}
            />

            {/* Position & Size */}
            <PositionPanel 
              widgetConfig={widgetConfig}
              setWidgetConfig={setWidgetConfig}
            />

            {/* Behavior */}
            <BehaviorPanel 
              widgetConfig={widgetConfig}
              setWidgetConfig={setWidgetConfig}
            />

            {/* Messages */}
            <MessagesPanel 
              widgetConfig={widgetConfig}
              setWidgetConfig={setWidgetConfig}
            />

            {/* Advanced */}
            <AdvancedPanel 
              widgetConfig={widgetConfig}
              setWidgetConfig={setWidgetConfig}
            />
          </div>

          {/* Right Panel - Preview */}
          <div className="sticky top-6">
            <WidgetPreviewPanel 
              widgetConfig={widgetConfig}
              selectedKey={selectedKey}
              previewMode={previewMode}
              setPreviewMode={setPreviewMode}
              showChatPreview={showChatPreview}
              setShowChatPreview={setShowChatPreview}
            />
          </div>
        </div>
      )}

      {/* No Client Keys */}
      {clientKeys.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔑</div>
          <h2 className="text-2xl font-semibold mb-2">Keine Client-Keys vorhanden</h2>
          <p className="text-gray-600 mb-6">
            Sie benötigen mindestens einen Client-Key, um Ihr Widget zu customizen.
          </p>
          <button
            onClick={() => router.push('/dashboard/client-keys')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Client-Key erstellen
          </button>
        </div>
      )}
    </div>
  )
}

// Default Widget Configuration
const DEFAULT_WIDGET_CONFIG = {
  // Appearance
  theme: 'auto', // auto, light, dark
  primaryColor: '#007bff',
  backgroundColor: '#ffffff',
  textColor: '#333333',
  borderRadius: 12,
  
  // Position
  position: 'bottom-right', // bottom-right, bottom-left, top-right, top-left
  offsetX: 20,
  offsetY: 20,
  
  // Size
  triggerSize: 60,
  chatWindowWidth: 350,
  chatWindowHeight: 500,
  
  // Behavior
  autoOpen: false,
  autoOpenDelay: 3000, // ms
  showWelcomeMessage: true,
  enableNotifications: true,
  enableSounds: true,
  
  // Messages
  welcomeMessage: 'Hallo! Wie kann ich Ihnen heute helfen? 🔧',
  triggerTooltip: 'Chat starten',
  offlineMessage: 'Wir sind gerade offline. Hinterlassen Sie eine Nachricht!',
  
  // Advanced
  customCSS: '',
  enableTypingIndicator: true,
  showTimestamps: false,
  enableFileUpload: false,
  maxMessages: 50
}

// Style Presets Panel
function StylePresetsPanel({ widgetConfig, setWidgetConfig }) {
  const presets = [
    {
      name: 'Standard',
      config: {
        primaryColor: '#007bff',
        backgroundColor: '#ffffff',
        borderRadius: 12,
        theme: 'auto'
      }
    },
    {
      name: 'Modern Dark',
      config: {
        primaryColor: '#6366f1',
        backgroundColor: '#1f2937',
        borderRadius: 16,
        theme: 'dark'
      }
    },
    {
      name: 'Automotive',
      config: {
        primaryColor: '#dc2626',
        backgroundColor: '#ffffff',
        borderRadius: 8,
        theme: 'light'
      }
    },
    {
      name: 'Minimalistisch',
      config: {
        primaryColor: '#10b981',
        backgroundColor: '#ffffff',
        borderRadius: 4,
        theme: 'light'
      }
    }
  ]

  return (
    <div className="bg-white rounded-lg border p-6">
      <h3 className="text-lg font-semibold mb-4">Style Presets</h3>
      <div className="grid grid-cols-2 gap-3">
        {presets.map((preset) => (
          <button
            key={preset.name}
            onClick={() => setWidgetConfig(prev => ({ ...prev, ...preset.config }))}
            className="p-3 border rounded-lg hover:border-blue-300 transition text-left"
          >
            <div className="flex items-center gap-3">
              <div 
                className="w-6 h-6 rounded"
                style={{ backgroundColor: preset.config.primaryColor }}
              />
              <span className="font-medium">{preset.name}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

// Colors Panel
function ColorsPanel({ widgetConfig, setWidgetConfig }) {
  return (
    <div className="bg-white rounded-lg border p-6">
      <h3 className="text-lg font-semibold mb-4">Farben</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Primärfarbe</label>
          <div className="flex gap-3">
            <input
              type="color"
              value={widgetConfig.primaryColor}
              onChange={(e) => setWidgetConfig(prev => ({ ...prev, primaryColor: e.target.value }))}
              className="w-12 h-10 rounded border cursor-pointer"
            />
            <input
              type="text"
              value={widgetConfig.primaryColor}
              onChange={(e) => setWidgetConfig(prev => ({ ...prev, primaryColor: e.target.value }))}
              className="flex-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Hintergrundfarbe</label>
          <div className="flex gap-3">
            <input
              type="color"
              value={widgetConfig.backgroundColor}
              onChange={(e) => setWidgetConfig(prev => ({ ...prev, backgroundColor: e.target.value }))}
              className="w-12 h-10 rounded border cursor-pointer"
            />
            <input
              type="text"
              value={widgetConfig.backgroundColor}
              onChange={(e) => setWidgetConfig(prev => ({ ...prev, backgroundColor: e.target.value }))}
              className="flex-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

// Position Panel
function PositionPanel({ widgetConfig, setWidgetConfig }) {
  const positions = [
    { value: 'bottom-right', label: 'Unten Rechts', icon: '↘️' },
    { value: 'bottom-left', label: 'Unten Links', icon: '↙️' },
    { value: 'top-right', label: 'Oben Rechts', icon: '↗️' },
    { value: 'top-left', label: 'Oben Links', icon: '↖️' }
  ]

  return (
    <div className="bg-white rounded-lg border p-6">
      <h3 className="text-lg font-semibold mb-4">Position & Größe</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Position</label>
          <div className="grid grid-cols-2 gap-2">
            {positions.map((pos) => (
              <button
                key={pos.value}
                onClick={() => setWidgetConfig(prev => ({ ...prev, position: pos.value }))}
                className={`p-3 border rounded text-sm font-medium transition ${
                  widgetConfig.position === pos.value
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div>{pos.icon}</div>
                <div>{pos.label}</div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Button-Größe: {widgetConfig.triggerSize}px
          </label>
          <input
            type="range"
            min="40"
            max="80"
            value={widgetConfig.triggerSize}
            onChange={(e) => setWidgetConfig(prev => ({ ...prev, triggerSize: parseInt(e.target.value) }))}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Ecken-Rundung: {widgetConfig.borderRadius}px
          </label>
          <input
            type="range"
            min="0"
            max="30"
            value={widgetConfig.borderRadius}
            onChange={(e) => setWidgetConfig(prev => ({ ...prev, borderRadius: parseInt(e.target.value) }))}
            className="w-full"
          />
        </div>
      </div>
    </div>
  )
}

// Behavior Panel
function BehaviorPanel({ widgetConfig, setWidgetConfig }) {
  return (
    <div className="bg-white rounded-lg border p-6">
      <h3 className="text-lg font-semibold mb-4">Verhalten</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Automatisch öffnen</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={widgetConfig.autoOpen}
              onChange={(e) => setWidgetConfig(prev => ({ ...prev, autoOpen: e.target.checked }))}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Willkommensnachricht</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={widgetConfig.showWelcomeMessage}
              onChange={(e) => setWidgetConfig(prev => ({ ...prev, showWelcomeMessage: e.target.checked }))}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Benachrichtigungen</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={widgetConfig.enableNotifications}
              onChange={(e) => setWidgetConfig(prev => ({ ...prev, enableNotifications: e.target.checked }))}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>
    </div>
  )
}

// Messages Panel
function MessagesPanel({ widgetConfig, setWidgetConfig }) {
  return (
    <div className="bg-white rounded-lg border p-6">
      <h3 className="text-lg font-semibold mb-4">Nachrichten</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Willkommensnachricht</label>
          <textarea
            value={widgetConfig.welcomeMessage}
            onChange={(e) => setWidgetConfig(prev => ({ ...prev, welcomeMessage: e.target.value }))}
            rows={2}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Hallo! Wie kann ich Ihnen helfen?"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Button Tooltip</label>
          <input
            type="text"
            value={widgetConfig.triggerTooltip}
            onChange={(e) => setWidgetConfig(prev => ({ ...prev, triggerTooltip: e.target.value }))}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Chat starten"
          />
        </div>
      </div>
    </div>
  )
}

// Advanced Panel
function AdvancedPanel({ widgetConfig, setWidgetConfig }) {
  return (
    <div className="bg-white rounded-lg border p-6">
      <h3 className="text-lg font-semibold mb-4">Erweiterte Einstellungen</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Custom CSS</label>
          <textarea
            value={widgetConfig.customCSS}
            onChange={(e) => setWidgetConfig(prev => ({ ...prev, customCSS: e.target.value }))}
            rows={6}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
            placeholder="/* Custom CSS hier eingeben */"
          />
          <p className="text-xs text-gray-500 mt-1">
            Vorsicht: Custom CSS kann die Widget-Funktionalität beeinträchtigen
          </p>
        </div>
      </div>
    </div>
  )
}

// Widget Preview Panel
function WidgetPreviewPanel({ widgetConfig, selectedKey, previewMode, setPreviewMode, showChatPreview, setShowChatPreview }) {
  const previewSizes = {
    desktop: { width: '100%', height: '600px' },
    tablet: { width: '768px', height: '500px' },
    mobile: { width: '375px', height: '400px' }
  }

  const currentSize = previewSizes[previewMode]

  return (
    <div className="bg-white rounded-lg border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Live Vorschau</h3>
        
        {/* Preview Mode Selector */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          {Object.keys(previewSizes).map((mode) => (
            <button
              key={mode}
              onClick={() => setPreviewMode(mode)}
              className={`px-3 py-1 rounded text-sm font-medium transition ${
                previewMode === mode
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {mode === 'desktop' ? '🖥️' : mode === 'tablet' ? '📱' : '📱'}
            </button>
          ))}
        </div>
      </div>

      {/* Preview Frame */}
      <div 
        className="mx-auto border-2 border-gray-300 rounded-lg overflow-hidden bg-gray-50 relative transition-all duration-300"
        style={{ 
          width: currentSize.width, 
          height: currentSize.height,
          maxWidth: '100%'
        }}
      >
        {/* Mock Website Content */}
        <div className="h-full bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-4">🏗️</div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Ihre Website</h2>
            <p className="text-gray-600">Widget Vorschau</p>
          </div>
        </div>

        {/* Widget Preview */}
        <WidgetMockup 
          config={widgetConfig} 
          showChat={showChatPreview}
          onToggleChat={() => setShowChatPreview(!showChatPreview)}
          size={previewMode}
        />
      </div>

      {/* Preview Controls */}
      <div className="mt-4 space-y-3">
        <button
          onClick={() => setShowChatPreview(!showChatPreview)}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded font-medium hover:bg-blue-700 transition"
        >
          {showChatPreview ? '💬 Chat schließen' : '💬 Chat öffnen'}
        </button>

        {selectedKey && (
          <div className="p-3 bg-gray-50 rounded text-sm">
            <div className="font-medium text-gray-700 mb-1">Integration Code:</div>
            <code className="text-xs text-gray-600">
              &lt;script src="/api/widget/embed?client_key={selectedKey.client_key.substring(0, 20)}..."&gt;
            </code>
          </div>
        )}
      </div>
    </div>
  )
}

// Widget Mockup Component
function WidgetMockup({ config, showChat, onToggleChat, size }) {
  const getPositionStyles = () => {
    const base = {
      position: 'absolute',
      zIndex: 1000
    }

    switch (config.position) {
      case 'bottom-right':
        return { ...base, bottom: config.offsetY, right: config.offsetX }
      case 'bottom-left':
        return { ...base, bottom: config.offsetY, left: config.offsetX }
      case 'top-right':
        return { ...base, top: config.offsetY, right: config.offsetX }
      case 'top-left':
        return { ...base, top: config.offsetY, left: config.offsetX }
      default:
        return { ...base, bottom: config.offsetY, right: config.offsetX }
    }
  }

  const triggerSize = size === 'mobile' ? Math.max(40, config.triggerSize - 10) : config.triggerSize

  return (
    <div style={getPositionStyles()}>
      {/* Chat Window */}
      {showChat && (
        <div 
          className="mb-4 bg-white rounded-lg shadow-2xl border overflow-hidden"
          style={{ 
            width: size === 'mobile' ? '280px' : config.chatWindowWidth,
            height: size === 'mobile' ? '400px' : config.chatWindowHeight,
            borderRadius: config.borderRadius
          }}
        >
          {/* Header */}
          <div 
            className="p-4 text-white flex items-center justify-between"
            style={{ backgroundColor: config.primaryColor }}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                🔧
              </div>
              <div>
                <div className="font-semibold text-sm">CarBot Assistant</div>
                <div className="text-xs opacity-90">Online</div>
              </div>
            </div>
            <button 
              onClick={onToggleChat}
              className="text-white/80 hover:text-white text-xl leading-none"
            >
              ×
            </button>
          </div>

          {/* Messages */}
          <div className="p-4 space-y-3 flex-1 overflow-y-auto">
            {config.showWelcomeMessage && (
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs">
                  🤖
                </div>
                <div 
                  className="bg-gray-100 rounded-lg p-3 text-sm max-w-xs"
                  style={{ borderRadius: config.borderRadius / 2 }}
                >
                  {config.welcomeMessage}
                </div>
              </div>
            )}
            
            {/* User message */}
            <div className="flex justify-end">
              <div 
                className="text-white rounded-lg p-3 text-sm max-w-xs"
                style={{ 
                  backgroundColor: config.primaryColor,
                  borderRadius: config.borderRadius / 2
                }}
              >
                Hallo! Ich brauche Hilfe.
              </div>
            </div>

            {/* Bot response */}
            <div className="flex items-start gap-2">
              <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs">
                🤖
              </div>
              <div 
                className="bg-gray-100 rounded-lg p-3 text-sm max-w-xs"
                style={{ borderRadius: config.borderRadius / 2 }}
              >
                Gerne helfe ich Ihnen! Wobei kann ich behilflich sein?
              </div>
            </div>
          </div>

          {/* Input */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Nachricht eingeben..."
                className="flex-1 px-3 py-2 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                style={{ borderRadius: config.borderRadius / 2 }}
                readOnly
              />
              <button 
                className="text-white px-4 py-2 rounded text-sm font-medium"
                style={{ 
                  backgroundColor: config.primaryColor,
                  borderRadius: config.borderRadius / 2
                }}
              >
                ➤
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Trigger Button */}
      <button
        onClick={onToggleChat}
        className="shadow-2xl text-white font-semibold flex items-center justify-center transition-transform hover:scale-105"
        style={{
          width: triggerSize,
          height: triggerSize,
          backgroundColor: config.primaryColor,
          borderRadius: config.borderRadius
        }}
        title={config.triggerTooltip}
      >
        {showChat ? '×' : '💬'}
      </button>
    </div>
  )
}