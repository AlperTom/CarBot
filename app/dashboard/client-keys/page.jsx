'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { v4 as uuidv4 } from 'uuid'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function ClientKeysPage() {
  const [workshop, setWorkshop] = useState(null)
  const [clientKeys, setClientKeys] = useState([])
  const [newKeyName, setNewKeyName] = useState('')
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    loadWorkshopAndKeys()
  }, [])

  async function loadWorkshopAndKeys() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Get workshop data
      const { data: workshopData, error: workshopError } = await supabase
        .from('workshops')
        .select('*')
        .eq('owner_email', user.email)
        .single()

      if (workshopError) throw workshopError
      setWorkshop(workshopData)

      // Get client keys
      const { data: keysData, error: keysError } = await supabase
        .from('client_keys')
        .select('*')
        .eq('workshop_id', workshopData.id)
        .order('created_at', { ascending: false })

      if (keysError) throw keysError
      setClientKeys(keysData || [])
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  async function generateClientKey() {
    if (!newKeyName.trim() || !workshop) return
    
    setGenerating(true)
    try {
      const newKey = {
        id: uuidv4(),
        workshop_id: workshop.id,
        key_name: newKeyName.trim(),
        client_key: `${workshop.slug}-${uuidv4().substring(0, 8)}`,
        is_active: true,
        usage_count: 0,
        last_used_at: null,
        created_at: new Date().toISOString()
      }

      const { error } = await supabase
        .from('client_keys')
        .insert([newKey])

      if (error) throw error

      setClientKeys([newKey, ...clientKeys])
      setNewKeyName('')
    } catch (error) {
      console.error('Error generating client key:', error)
      alert('Fehler beim Erstellen des Client-Keys')
    } finally {
      setGenerating(false)
    }
  }

  async function toggleKeyStatus(keyId, isActive) {
    try {
      const { error } = await supabase
        .from('client_keys')
        .update({ is_active: !isActive })
        .eq('id', keyId)

      if (error) throw error

      setClientKeys(keys => 
        keys.map(key => 
          key.id === keyId ? { ...key, is_active: !isActive } : key
        )
      )
    } catch (error) {
      console.error('Error updating key status:', error)
    }
  }

  async function deleteClientKey(keyId) {
    if (!confirm('Sind Sie sicher, dass Sie diesen Client-Key löschen möchten?')) return

    try {
      const { error } = await supabase
        .from('client_keys')
        .delete()
        .eq('id', keyId)

      if (error) throw error

      setClientKeys(keys => keys.filter(key => key.id !== keyId))
    } catch (error) {
      console.error('Error deleting key:', error)
    }
  }

  function copyToClipboard(text) {
    navigator.clipboard.writeText(text)
    alert('Client-Key in die Zwischenablage kopiert!')
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

  return (
    <div className="p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Client-Keys verwalten</h1>
        <p className="text-gray-600 mt-2">
          Erstellen und verwalten Sie Client-Keys für Ihre Website-Integration
        </p>
      </div>

      {/* Generate New Key */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Neuen Client-Key erstellen</h2>
        
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Key-Name
            </label>
            <input
              type="text"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              placeholder="z.B. Haupt-Website, Landingpage, Test"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={generateClientKey}
            disabled={!newKeyName.trim() || generating}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
          >
            {generating ? 'Erstelle...' : 'Key erstellen'}
          </button>
        </div>
      </div>

      {/* Client Keys List */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">Ihre Client-Keys</h2>
          <p className="text-gray-600 text-sm mt-1">
            {clientKeys.length} {clientKeys.length === 1 ? 'Key' : 'Keys'} erstellt
          </p>
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
                        onClick={() => copyToClipboard(key.client_key)}
                        className="text-blue-600 hover:text-blue-700 text-sm"
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
                      onClick={() => toggleKeyStatus(key.id, key.is_active)}
                      className={`px-3 py-1 text-sm rounded ${
                        key.is_active
                          ? 'bg-red-100 text-red-700 hover:bg-red-200'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      {key.is_active ? 'Deaktivieren' : 'Aktivieren'}
                    </button>
                    <button
                      onClick={() => deleteClientKey(key.id)}
                      className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
                    >
                      Löschen
                    </button>
                  </div>
                </div>

                {/* Integration Code */}
                <div className="mt-4 p-4 bg-gray-50 rounded">
                  <h4 className="font-medium mb-2">Integration Code:</h4>
                  <pre className="text-sm bg-white p-3 rounded border overflow-x-auto">
{`<!-- CarBot Chat Widget -->
<script>
  window.carBotConfig = {
    clientKey: '${key.client_key}',
    workshopName: '${workshop?.name || 'Ihre Werkstatt'}',
    language: 'de'
  };
</script>
<script src="https://your-carbot-domain.vercel.app/widget.js"></script>`}
                  </pre>
                  <button
                    onClick={() => copyToClipboard(`<!-- CarBot Chat Widget -->
<script>
  window.carBotConfig = {
    clientKey: '${key.client_key}',
    workshopName: '${workshop?.name || 'Ihre Werkstatt'}',
    language: 'de'
  };
</script>
<script src="https://your-carbot-domain.vercel.app/widget.js"></script>`)}
                    className="mt-2 text-blue-600 hover:text-blue-700 text-sm"
                  >
                    📋 Code kopieren
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Help Section */}
      <div className="mt-6 bg-blue-50 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-2">💡 Wie verwende ich Client-Keys?</h3>
        <ul className="text-blue-800 text-sm space-y-1">
          <li>• Jeder Client-Key ist eindeutig und mit Ihrer Werkstatt verknüpft</li>
          <li>• Verwenden Sie verschiedene Keys für verschiedene Websites/Seiten</li>
          <li>• Kopieren Sie den Integration Code und fügen Sie ihn vor dem &lt;/body&gt; Tag ein</li>
          <li>• Deaktivieren Sie Keys, wenn Sie sie temporär nicht verwenden möchten</li>
          <li>• Löschen Sie Keys nur, wenn Sie sie nie wieder verwenden werden</li>
        </ul>
      </div>
    </div>
  )
}