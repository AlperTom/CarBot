'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function ClientsPage() {
  const [workshop, setWorkshop] = useState(null)
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadWorkshopAndClients()
  }, [])

  async function loadWorkshopAndClients() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Get workshop
      const { data: workshopData, error: workshopError } = await supabase
        .from('workshops')
        .select('*')
        .eq('owner_email', user.email)
        .single()

      if (workshopError) throw workshopError
      setWorkshop(workshopData)

      // Get clients
      const { data: clientsData, error: clientsError } = await supabase
        .from('workshop_clients')
        .select('*')
        .eq('workshop_id', workshopData.id)
        .order('created_at', { ascending: false })

      if (clientsError && clientsError.code !== 'PGRST116') throw clientsError
      setClients(clientsData || [])
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'registered_ordered': return 'bg-green-100 text-green-800'
      case 'registered_no_order': return 'bg-yellow-100 text-yellow-800'
      case 'registered_no_confirmation': return 'bg-orange-100 text-orange-800'
      case 'lead_only': return 'bg-blue-100 text-blue-800'
      case 'inactive': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'registered_ordered': return '✅ Registriert & Bestellt'
      case 'registered_no_order': return '⚠️ Registriert ohne Bestellung'
      case 'registered_no_confirmation': return '❌ Registriert ohne Bestätigung'
      case 'lead_only': return '🎯 Nur Lead'
      case 'inactive': return '😴 Inaktiv'
      default: return '❓ Unbekannt'
    }
  }

  const filteredClients = clients.filter(client => {
    const matchesSearch = searchTerm === '' || 
      client.workshop_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.owner_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.owner_name?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = filter === 'all' || client.registration_status === filter
    
    return matchesSearch && matchesFilter
  })

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="space-y-3">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Client Management</h1>
        <p className="text-gray-600 mt-2">
          Verwalten Sie alle registrierten Werkstätten und deren Status
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Gesamt Clients</p>
              <p className="text-3xl font-bold text-gray-900">{clients.length}</p>
            </div>
            <div className="text-3xl">👥</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Aktive Kunden</p>
              <p className="text-3xl font-bold text-green-600">
                {clients.filter(c => c.registration_status === 'registered_ordered').length}
              </p>
            </div>
            <div className="text-3xl">✅</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Ohne Bestellung</p>
              <p className="text-3xl font-bold text-yellow-600">
                {clients.filter(c => c.registration_status === 'registered_no_order').length}
              </p>
            </div>
            <div className="text-3xl">⚠️</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Nur Leads</p>
              <p className="text-3xl font-bold text-blue-600">
                {clients.filter(c => c.registration_status === 'lead_only').length}
              </p>
            </div>
            <div className="text-3xl">🎯</div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Suchen nach Name, E-Mail oder Werkstatt..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Alle Status</option>
              <option value="registered_ordered">Registriert & Bestellt</option>
              <option value="registered_no_order">Registriert ohne Bestellung</option>
              <option value="registered_no_confirmation">Ohne Bestätigung</option>
              <option value="lead_only">Nur Leads</option>
              <option value="inactive">Inaktiv</option>
            </select>
          </div>
        </div>
      </div>

      {/* Client List */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">
            Clients ({filteredClients.length})
          </h2>
        </div>

        {filteredClients.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-lg font-medium mb-2">Keine Clients gefunden</h3>
            <p>
              {searchTerm || filter !== 'all' 
                ? 'Versuchen Sie andere Suchkriterien'
                : 'Noch keine Werkstätten registriert'
              }
            </p>
          </div>
        ) : (
          <div className="divide-y">
            {filteredClients.map((client) => (
              <div key={client.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{client.workshop_name}</h3>
                      <span className={`px-3 py-1 text-xs rounded-full ${getStatusColor(client.registration_status)}`}>
                        {getStatusText(client.registration_status)}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div>
                        <strong>Inhaber:</strong> {client.owner_name}<br/>
                        <strong>E-Mail:</strong> {client.owner_email}
                      </div>
                      <div>
                        <strong>Telefon:</strong> {client.phone || 'Nicht angegeben'}<br/>
                        <strong>Stadt:</strong> {client.city || 'Nicht angegeben'}
                      </div>
                      <div>
                        <strong>Plan:</strong> {client.subscription_plan || 'Keiner'}<br/>
                        <strong>Registriert:</strong> {new Date(client.created_at).toLocaleDateString('de-DE')}
                      </div>
                    </div>

                    {client.notes && (
                      <div className="mt-3 p-3 bg-yellow-50 rounded-lg">
                        <strong className="text-yellow-800">Notizen:</strong>
                        <p className="text-yellow-700 text-sm mt-1">{client.notes}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 ml-4">
                    <Link
                      href={`/dashboard/clients/${client.id}`}
                      className="px-3 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-sm"
                    >
                      Details
                    </Link>
                    <button
                      onClick={() => updateClientStatus(client.id)}
                      className="px-3 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-sm"
                    >
                      Status ändern
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="mt-6 bg-blue-50 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/dashboard/client-keys"
            className="flex items-center gap-3 p-4 bg-white rounded-lg hover:shadow-md transition-shadow"
          >
            <span className="text-2xl">🔑</span>
            <div>
              <div className="font-medium">Client Keys verwalten</div>
              <div className="text-sm text-gray-600">Neue Keys erstellen</div>
            </div>
          </Link>

          <Link
            href="/dashboard/landing-pages"
            className="flex items-center gap-3 p-4 bg-white rounded-lg hover:shadow-md transition-shadow"
          >
            <span className="text-2xl">🎨</span>
            <div>
              <div className="font-medium">Landing Pages</div>
              <div className="text-sm text-gray-600">Seiten für Clients erstellen</div>
            </div>
          </Link>

          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-3 p-4 bg-white rounded-lg hover:shadow-md transition-shadow"
          >
            <span className="text-2xl">🔄</span>
            <div>
              <div className="font-medium">Daten aktualisieren</div>
              <div className="text-sm text-gray-600">Client-Liste neu laden</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  )

  async function updateClientStatus(clientId) {
    // Simple status update - could be expanded
    const newStatus = prompt('Neuer Status (registered_ordered, registered_no_order, etc.):')
    if (!newStatus) return

    try {
      const { error } = await supabase
        .from('workshop_clients')
        .update({ registration_status: newStatus })
        .eq('id', clientId)

      if (error) throw error
      
      await loadWorkshopAndClients()
      alert('Status aktualisiert!')
    } catch (error) {
      console.error('Error updating status:', error)
      alert('Fehler beim Aktualisieren')
    }
  }
}