'use client'

/**
 * Client Keys Management Interface
 * CarBot MVP - Professional Client Key Management Dashboard
 * Implements US-001, US-002, US-003 from specifications
 */

import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'

export default function ClientKeysPage() {
  const [clientKeys, setClientKeys] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPackage, setCurrentPackage] = useState(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedKey, setSelectedKey] = useState(null)
  const [analytics, setAnalytics] = useState({})
  const [refreshing, setRefreshing] = useState(false)
  
  const router = useRouter()

  // Load data callback
  const loadData = useCallback(async () => {
    if (refreshing) return
    setRefreshing(true)
    setError(null)

    try {
      // Get current package information
      const packageResponse = await fetch('/api/packages?action=current')
      if (packageResponse.ok) {
        const packageData = await packageResponse.json()
        setCurrentPackage(packageData.package)
      }

      // Get client keys and analytics
      const keysResponse = await fetch('/api/keys')
      if (keysResponse.ok) {
        const keysData = await keysResponse.json()
        setClientKeys(keysData.keys || [])
        setAnalytics(keysData.analytics || {})
      }

    } catch (error) {
      console.error('Error loading data:', error)
      setError('Fehler beim Laden der Daten')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [refreshing])

  useEffect(() => {
    loadData()
  }, [])

  // Create new client key
  const handleCreateKey = async (keyData) => {
    try {
      const response = await fetch('/api/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(keyData)
      })

      if (response.ok) {
        const result = await response.json()
        setClientKeys(prev => [result.key, ...prev])
        setShowCreateModal(false)
      } else {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create key')
      }
    } catch (error) {
      console.error('Error creating client key:', error)
      alert('Fehler beim Erstellen des Client-Keys: ' + error.message)
    }
  }

  // Toggle key status
  const handleToggleKey = async (keyId, isActive) => {
    try {
      const response = await fetch('/api/keys', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyId, isActive: !isActive })
      })

      if (response.ok) {
        setClientKeys(keys => 
          keys.map(key => 
            key.id === keyId ? { ...key, is_active: !isActive } : key
          )
        )
      }
    } catch (error) {
      console.error('Error updating key status:', error)
    }
  }

  // Delete client key
  const handleDeleteKey = async (keyId) => {
    if (!confirm('Sind Sie sicher, dass Sie diesen Client-Key löschen möchten?')) return

    try {
      const response = await fetch(`/api/keys?keyId=${keyId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setClientKeys(keys => keys.filter(key => key.id !== keyId))
      }
    } catch (error) {
      console.error('Error deleting key:', error)
    }
  }

  // Copy text to clipboard with feedback
  const copyToClipboard = (text, label = 'Text') => {
    navigator.clipboard.writeText(text).then(() => {
      alert(`${label} in die Zwischenablage kopiert!`)
    }).catch(err => {
      console.error('Failed to copy:', err)
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = text
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      alert(`${label} kopiert!`)
    })
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Package feature check
  const canCreateKeys = currentPackage?.feature_access?.apiAccess || false
  const keyLimitReached = currentPackage && currentPackage.limits?.clientKeys !== -1 && clientKeys.length >= currentPackage.limits.clientKeys

  return (
    <div className="p-6 max-w-7xl">
      {/* Header with Package Info */}
      <div className="mb-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Client-Keys verwalten</h1>
            <p className="text-gray-600 mt-2">
              Erstellen und verwalten Sie Client-Keys für Ihre Website-Integration
            </p>
          </div>
          
          {/* Package Status Card */}
          {currentPackage && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 min-w-[280px]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-blue-900">Aktuelles Paket</span>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                  {currentPackage.name}
                </span>
              </div>
              <p className="text-sm text-blue-700 mb-3">
                {currentPackage.formatted_price}/Monat
              </p>
              
              {/* Usage Stats */}
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-xs">
                    <span className="text-blue-700">Client-Keys</span>
                    <span className="text-blue-800 font-medium">
                      {clientKeys.length}{currentPackage.limits?.clientKeys !== -1 ? `/${currentPackage.limits.clientKeys}` : ''}
                    </span>
                  </div>
                  {currentPackage.limits?.clientKeys !== -1 && (
                    <div className="w-full bg-blue-200 rounded-full h-1.5 mt-1">
                      <div 
                        className="bg-blue-600 h-1.5 rounded-full transition-all" 
                        style={{ width: `${Math.min((clientKeys.length / currentPackage.limits.clientKeys) * 100, 100)}%` }}
                      ></div>
                    </div>
                  )}
                </div>
                
                {currentPackage.usage_percentages?.leads !== undefined && (
                  <div>
                    <div className="flex justify-between text-xs">
                      <span className="text-blue-700">Monatliche Leads</span>
                      <span className="text-blue-800 font-medium">{currentPackage.usage_percentages.leads}%</span>
                    </div>
                    <div className="w-full bg-blue-200 rounded-full h-1.5 mt-1">
                      <div 
                        className={`h-1.5 rounded-full transition-all ${
                          currentPackage.usage_percentages.leads > 80 ? 'bg-red-500' : 
                          currentPackage.usage_percentages.leads > 60 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${Math.min(currentPackage.usage_percentages.leads, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
              
              {!canCreateKeys && (
                <div className="mt-3 pt-3 border-t border-blue-200">
                  <p className="text-xs text-blue-700 mb-2">Upgrade für API-Zugang erforderlich</p>
                  <button className="w-full bg-blue-600 text-white text-xs py-2 px-3 rounded hover:bg-blue-700 transition">
                    Jetzt upgraden
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

      {/* Create New Key Section */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Client-Keys</h2>
          <div className="flex items-center gap-3">
            <button
              onClick={() => loadData()}
              disabled={refreshing}
              className="px-3 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 flex items-center gap-2"
            >
              <span className={`inline-block ${refreshing ? 'animate-spin' : ''}`}>⟳</span>
              {refreshing ? 'Aktualisiert...' : 'Aktualisieren'}
            </button>
            
            <button
              onClick={() => setShowCreateModal(true)}
              disabled={!canCreateKeys || keyLimitReached}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <span className="text-lg leading-none">+</span>
              Neuen Key erstellen
            </button>
          </div>
        </div>
        
        {!canCreateKeys && (
          <div className="mb-4 bg-orange-50 border border-orange-200 text-orange-800 px-4 py-3 rounded-lg">
            <div className="flex items-center gap-2">
              <span className="text-orange-600">⚠️</span>
              <div>
                <p className="font-medium">API-Zugang nicht verfügbar</p>
                <p className="text-sm">Upgraden Sie auf Professional oder höher, um Client-Keys zu erstellen und API-Zugang zu erhalten.</p>
              </div>
            </div>
          </div>
        )}
        
        {keyLimitReached && (
          <div className="mb-4 bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg">
            <div className="flex items-center gap-2">
              <span className="text-yellow-600">📊</span>
              <div>
                <p className="font-medium">Client-Key Limit erreicht</p>
                <p className="text-sm">Sie haben das Maximum von {currentPackage?.limits?.clientKeys} Client-Keys erreicht. Upgraden Sie für unbegrenzte Keys.</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Client Keys List */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Ihre Client-Keys</h2>
              <p className="text-gray-600 text-sm mt-1">
                {clientKeys.length} {clientKeys.length === 1 ? 'Key' : 'Keys'} erstellt
                {currentPackage?.limits?.clientKeys !== -1 && (
                  <span className="ml-1">von {currentPackage.limits.clientKeys} möglich</span>
                )}
              </p>
            </div>
            
            {/* Analytics Summary */}
            {analytics && Object.keys(analytics).length > 0 && (
              <div className="text-right">
                <div className="text-sm text-gray-600">Letzte 30 Tage</div>
                <div className="flex gap-4 text-sm mt-1">
                  {analytics.total_requests && (
                    <div>
                      <span className="font-semibold text-green-600">{analytics.total_requests}</span>
                      <span className="text-gray-500 ml-1">API-Aufrufe</span>
                    </div>
                  )}
                  {analytics.active_keys && (
                    <div>
                      <span className="font-semibold text-blue-600">{analytics.active_keys}</span>
                      <span className="text-gray-500 ml-1">aktiv</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {clientKeys.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <div className="text-4xl mb-4">🔑</div>
            <h3 className="text-lg font-medium mb-2">Noch keine Client-Keys</h3>
            <p>Erstellen Sie Ihren ersten Client-Key, um CarBot auf Ihrer Website zu integrieren.</p>
          </div>
        ) : (
          <div className="divide-y">
            {clientKeys.map((key) => (
              <div key={key.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{key.key_name}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        key.is_active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {key.is_active ? 'Aktiv' : 'Inaktiv'}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-2">
                      <code className="bg-gray-100 px-3 py-1 rounded text-sm font-mono">
                        {key.client_key}
                      </code>
                      <button
                        onClick={() => copyToClipboard(key.client_key, 'Client-Key')}
                        className="text-blue-600 hover:text-blue-700 text-sm px-2 py-1 rounded hover:bg-blue-50 flex items-center gap-1"
                      >
                        📋 Kopieren
                      </button>
                    </div>

                    <div className="text-sm text-gray-500">
                      <span>Verwendungen: {key.usage_count}</span>
                      {key.last_used_at && (
                        <span className="ml-4">
                          Zuletzt verwendet: {new Date(key.last_used_at).toLocaleDateString('de-DE')}
                        </span>
                      )}
                      <span className="ml-4">
                        Erstellt: {new Date(key.created_at).toLocaleDateString('de-DE')}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => setSelectedKey(key)}
                      className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 flex items-center gap-1"
                    >
                      ⚙️ Verwalten
                    </button>
                    <button
                      onClick={() => handleToggleKey(key.id, key.is_active)}
                      className={`px-3 py-2 text-sm rounded flex items-center gap-1 ${
                        key.is_active
                          ? 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      {key.is_active ? '🚫 Deaktivieren' : '✅ Aktivieren'}
                    </button>
                    <button
                      onClick={() => handleDeleteKey(key.id)}
                      className="px-3 py-2 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 flex items-center gap-1"
                    >
                      🗑️ Löschen
                    </button>
                  </div>
                </div>

                {/* Integration Code */}
                <div className="mt-4 p-4 bg-gray-50 rounded border">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900">Widget Integration Code</h4>
                    <div className="flex gap-2">
                      <button
                        onClick={() => copyToClipboard(`https://${typeof window !== 'undefined' ? window.location.host : ''}/api/widget/embed?client_key=${key.client_key}`, 'Widget-URL')}
                        className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                      >
                        🔗 URL kopieren
                      </button>
                      <button
                        onClick={() => copyToClipboard(getIntegrationCode(key), 'Integration Code')}
                        className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200"
                      >
                        📋 Code kopieren
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {/* Standard Integration */}
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-2">Standard Integration (Empfohlen)</h5>
                      <pre className="text-xs bg-white p-3 rounded border overflow-x-auto font-mono">
{getIntegrationCode(key)}
                      </pre>
                    </div>
                    
                    {/* Advanced Configuration */}
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-2">Erweiterte Konfiguration</h5>
                      <pre className="text-xs bg-white p-3 rounded border overflow-x-auto font-mono text-gray-600">
{getAdvancedIntegrationCode(key)}
                      </pre>
                    </div>
                    
                    {/* Usage Stats for this key */}
                    {key.usage_count > 0 && (
                      <div className="pt-3 border-t border-gray-200">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Widget Statistiken:</span>
                          <div className="flex gap-4 text-xs">
                            <span className="text-green-600 font-medium">{key.usage_count} Aufrufe</span>
                            {key.last_used_at && (
                              <span className="text-gray-500">
                                Zuletzt: {new Date(key.last_used_at).toLocaleDateString('de-DE')}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Help Section */}
      <div className="mt-6 space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Usage Guide */}
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
              💡 Wie verwende ich Client-Keys?
            </h3>
            <ul className="text-blue-800 text-sm space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span>Jeder Client-Key ist eindeutig und sicher mit Ihrer Werkstatt verknüpft</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span>Verwenden Sie verschiedene Keys für verschiedene Websites/Domains</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span>Fügen Sie den Code vor dem &lt;/body&gt; Tag Ihrer Website ein</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span>Keys können jederzeit aktiviert/deaktiviert werden</span>
              </li>
            </ul>
          </div>
          
          {/* Security Info */}
          <div className="bg-green-50 rounded-lg p-6">
            <h3 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
              🔒 Sicherheit & Kontrolle
            </h3>
            <ul className="text-green-800 text-sm space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">•</span>
                <span>Domain-Autorisierung verhindert Missbrauch</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">•</span>
                <span>Rate-Limiting schützt vor Überlastung</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">•</span>
                <span>Vollständige Nutzungsstatistiken verfügbar</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">•</span>
                <span>DSGVO-konformes Tracking und Datenschutz</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Create Key Modal */}
      {showCreateModal && (
        <CreateKeyModal
          currentPackage={currentPackage}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateKey}
        />
      )}
      
      {/* Key Management Modal */}
      {selectedKey && (
        <KeyManagementModal
          key={selectedKey}
          currentPackage={currentPackage}
          onClose={() => setSelectedKey(null)}
          onUpdate={loadData}
        />
      )}
    </div>
  )
}

// Helper functions
function getIntegrationCode(key) {
  return `<!-- CarBot Chat Widget -->
<script>
  window.carBotConfig = {
    clientKey: '${key.client_key}',
    theme: 'auto', // 'light', 'dark', 'auto'
    position: 'bottom-right', // Widget position
    language: 'de'
  };
</script>
<script src="${typeof window !== 'undefined' ? window.location.origin : ''}/api/widget/embed?client_key=${key.client_key}" async></script>`
}

function getAdvancedIntegrationCode(key) {
  return `<!-- CarBot Advanced Configuration -->
<script>
  window.carBotConfig = {
    clientKey: '${key.client_key}',
    theme: 'auto',
    customStyles: {
      primaryColor: '#007bff',
      borderRadius: '8px',
      fontFamily: 'inherit'
    },
    behavior: {
      autoOpen: false,
      showWelcomeMessage: true,
      enableNotifications: true
    },
    domain: window.location.hostname // Auto-detected
  };
</script>
<script src="${typeof window !== 'undefined' ? window.location.origin : ''}/api/widget/embed?client_key=${key.client_key}" async></script>`
}

// Create Key Modal Component
function CreateKeyModal({ currentPackage, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    authorizedDomains: [''],
    usageLimit: 1000
  })
  const [submitting, setSubmitting] = useState(false)
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name.trim()) return
    
    setSubmitting(true)
    try {
      await onSubmit({
        ...formData,
        authorizedDomains: formData.authorizedDomains.filter(d => d.trim())
      })
    } finally {
      setSubmitting(false)
    }
  }
  
  const addDomainField = () => {
    setFormData(prev => ({
      ...prev,
      authorizedDomains: [...prev.authorizedDomains, '']
    }))
  }
  
  const updateDomain = (index, value) => {
    setFormData(prev => ({
      ...prev,
      authorizedDomains: prev.authorizedDomains.map((d, i) => i === index ? value : d)
    }))
  }
  
  const removeDomain = (index) => {
    if (formData.authorizedDomains.length > 1) {
      setFormData(prev => ({
        ...prev,
        authorizedDomains: prev.authorizedDomains.filter((_, i) => i !== index)
      }))
    }
  }
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900">Neuen Client-Key erstellen</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
            >
              ×
            </button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Key Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Key-Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="z.B. Haupt-Website, Landingpage, Mobile App"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Beschreibung (Optional)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Beschreibung für diesen Client-Key..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          {/* Authorized Domains */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Autorisierte Domains
            </label>
            <p className="text-xs text-gray-600 mb-3">
              Leer lassen für alle Domains. Mehrere Domains für höhere Sicherheit.
            </p>
            
            <div className="space-y-2">
              {formData.authorizedDomains.map((domain, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={domain}
                    onChange={(e) => updateDomain(index, e.target.value)}
                    placeholder="beispiel.de oder www.meinewerkstatt.de"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {formData.authorizedDomains.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeDomain(index)}
                      className="px-3 py-2 text-red-600 border border-red-300 rounded-md hover:bg-red-50"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addDomainField}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                + Weitere Domain hinzufügen
              </button>
            </div>
          </div>
          
          {/* Usage Limit */}
          {currentPackage?.id !== 'enterprise' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Monatliches API-Limit
              </label>
              <select
                value={formData.usageLimit}
                onChange={(e) => setFormData(prev => ({ ...prev, usageLimit: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={1000}>1,000 Anfragen/Monat</option>
                <option value={5000}>5,000 Anfragen/Monat</option>
                <option value={10000}>10,000 Anfragen/Monat</option>
                <option value={25000}>25,000 Anfragen/Monat</option>
              </select>
              <p className="text-xs text-gray-600 mt-1">
                Higher limits available with Professional/Enterprise packages
              </p>
            </div>
          )}
          
          {/* Submit */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              disabled={!formData.name.trim() || submitting}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {submitting ? 'Erstelle...' : 'Client-Key erstellen'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Key Management Modal Component
function KeyManagementModal({ key: clientKey, currentPackage, onClose, onUpdate }) {
  const [activeTab, setActiveTab] = useState('details')
  const [settings, setSettings] = useState({
    name: clientKey.key_name,
    description: clientKey.description || '',
    authorizedDomains: clientKey.authorized_domains || [''],
    usageLimit: clientKey.usage_limit || 1000,
    rateLimitPerMinute: clientKey.rate_limit_per_minute || 60
  })
  const [saving, setSaving] = useState(false)
  
  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/keys', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          keyId: clientKey.id,
          ...settings
        })
      })
      
      if (response.ok) {
        onUpdate()
        onClose()
      }
    } catch (error) {
      console.error('Error updating key:', error)
    } finally {
      setSaving(false)
    }
  }
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900">Client-Key verwalten</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
            >
              ×
            </button>
          </div>
          
          {/* Tabs */}
          <div className="flex gap-1 mt-4">
            {[
              { id: 'details', label: 'Details & Einstellungen' },
              { id: 'analytics', label: 'Nutzungsstatistiken' },
              { id: 'security', label: 'Sicherheit' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-sm rounded-md ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        
        <div className="p-6">
          {activeTab === 'details' && (
            <div className="space-y-6">
              {/* Key Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Client-Key Information</h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Key:</span>
                    <code className="ml-2 bg-white px-2 py-1 rounded border font-mono">
                      {clientKey.client_key}
                    </code>
                  </div>
                  <div>
                    <span className="text-gray-600">Status:</span>
                    <span className={`ml-2 px-2 py-1 rounded text-xs ${
                      clientKey.is_active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {clientKey.is_active ? 'Aktiv' : 'Inaktiv'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Erstellt:</span>
                    <span className="ml-2">{new Date(clientKey.created_at).toLocaleDateString('de-DE')}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Verwendungen:</span>
                    <span className="ml-2 font-medium">{clientKey.usage_count || 0}</span>
                  </div>
                </div>
              </div>
              
              {/* Settings Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    value={settings.name}
                    onChange={(e) => setSettings(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Beschreibung</label>
                  <textarea
                    value={settings.description}
                    onChange={(e) => setSettings(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-4">📊</div>
                <p>Detaillierte Nutzungsstatistiken werden hier angezeigt.</p>
                <p className="text-sm mt-2">Feature in Entwicklung - coming soon!</p>
              </div>
            </div>
          )}
          
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-4">🔒</div>
                <p>Erweiterte Sicherheitseinstellungen werden hier angezeigt.</p>
                <p className="text-sm mt-2">Feature in Entwicklung - coming soon!</p>
              </div>
            </div>
          )}
          
          {/* Actions */}
          <div className="flex gap-3 pt-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              Schließen
            </button>
            {activeTab === 'details' && (
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
              >
                {saving ? 'Speichere...' : 'Änderungen speichern'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}