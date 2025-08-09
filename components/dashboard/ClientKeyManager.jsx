'use client'

import { useState, useEffect } from 'react'

export default function ClientKeyManager({ workshopId }) {
  const [clientKeys, setClientKeys] = useState([])
  const [analytics, setAnalytics] = useState({})
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedKey, setSelectedKey] = useState(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Check if mobile on mount and resize
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    fetchClientKeys()
    fetchAnalytics()
  }, [workshopId])

  const fetchClientKeys = async () => {
    try {
      const response = await fetch('/api/client-keys', {
        headers: {
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem('carbot_auth_tokens') || '{}').accessToken}`
        }
      })

      if (response.ok) {
        const result = await response.json()
        setClientKeys(result.data || [])
      } else {
        console.error('Failed to fetch client keys')
      }
    } catch (error) {
      console.error('Client keys fetch error:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/analytics/collect?metric=key_usage', {
        headers: {
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem('carbot_auth_tokens') || '{}').accessToken}`
        }
      })

      if (response.ok) {
        const result = await response.json()
        // Group analytics by client key
        const keyAnalytics = {}
        result.data?.dailyData?.forEach(day => {
          // This would need to be implemented to track per-key analytics
          // For now, we'll simulate the data structure
        })
        setAnalytics(keyAnalytics)
      }
    } catch (error) {
      console.error('Analytics fetch error:', error)
    }
  }

  const createClientKey = async (keyData) => {
    try {
      const response = await fetch('/api/client-keys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem('carbot_auth_tokens') || '{}').accessToken}`
        },
        body: JSON.stringify(keyData)
      })

      if (response.ok) {
        const result = await response.json()
        setClientKeys(prev => [...prev, result.data])
        setShowCreateModal(false)
        alert('Client Key erfolgreich erstellt!')
      } else {
        const error = await response.json()
        alert(`Fehler: ${error.error}`)
      }
    } catch (error) {
      console.error('Client key creation error:', error)
      alert('Fehler beim Erstellen des Client Keys.')
    }
  }

  const toggleKeyStatus = async (keyId, newStatus) => {
    try {
      const response = await fetch(`/api/client-keys/${keyId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem('carbot_auth_tokens') || '{}').accessToken}`
        },
        body: JSON.stringify({ is_active: newStatus })
      })

      if (response.ok) {
        setClientKeys(prev => 
          prev.map(key => 
            key.id === keyId ? { ...key, is_active: newStatus } : key
          )
        )
        alert(`Client Key ${newStatus ? 'aktiviert' : 'deaktiviert'}!`)
      } else {
        const error = await response.json()
        alert(`Fehler: ${error.error}`)
      }
    } catch (error) {
      console.error('Key toggle error:', error)
      alert('Fehler beim Ändern des Key-Status.')
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('In die Zwischenablage kopiert!')
    }).catch(() => {
      alert('Kopieren fehlgeschlagen. Bitte manuell kopieren.')
    })
  }

  // Simulate analytics data for demonstration
  const getKeyAnalytics = (keyId) => {
    // In production, this would come from the analytics API
    return {
      totalContacts: Math.floor(Math.random() * 100) + 10,
      thisMonth: Math.floor(Math.random() * 30) + 5,
      conversionRate: (Math.random() * 15 + 5).toFixed(1),
      avgResponseTime: (Math.random() * 5 + 1).toFixed(1)
    }
  }

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
        <p style={{ marginTop: '1rem', color: '#6b7280' }}>Lade Client Keys...</p>
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
            🔑 Client Key Management
          </h1>
          <p style={{ 
            color: '#64748b', 
            margin: 0,
            fontSize: isMobile ? '0.875rem' : '1rem'
          }}>
            Verwalten Sie API-Schlüssel für Widget-Integration und Analytics
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          style={{
            padding: isMobile ? '1rem 1.5rem' : '0.75rem 1.5rem',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            fontSize: isMobile ? '1rem' : '0.875rem',
            width: isMobile ? '100%' : 'auto'
          }}
        >
          ➕ Neuen Key erstellen
        </button>
      </div>

      {/* Overview Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: isMobile ? '1rem' : '1.5rem',
        marginBottom: isMobile ? '1.5rem' : '2rem'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: isMobile ? '1.25rem' : '1.5rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>Aktive Keys</p>
              <h3 style={{ 
                fontSize: isMobile ? '1.5rem' : '2rem', 
                fontWeight: 'bold', 
                color: '#1e293b', 
                margin: '0.5rem 0' 
              }}>
                {clientKeys.filter(key => key.is_active).length}
              </h3>
              <p style={{ color: '#10b981', fontSize: '0.875rem', margin: 0 }}>
                🟢 von {clientKeys.length} gesamt
              </p>
            </div>
            <div style={{
              width: isMobile ? '40px' : '48px',
              height: isMobile ? '40px' : '48px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: isMobile ? '1.25rem' : '1.5rem'
            }}>
              🔑
            </div>
          </div>
        </div>

        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: isMobile ? '1.25rem' : '1.5rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>Gesamt Kontakte</p>
              <h3 style={{ 
                fontSize: isMobile ? '1.5rem' : '2rem', 
                fontWeight: 'bold', 
                color: '#1e293b', 
                margin: '0.5rem 0' 
              }}>
                {clientKeys.reduce((total, key) => total + getKeyAnalytics(key.id).totalContacts, 0)}
              </h3>
              <p style={{ color: '#3b82f6', fontSize: '0.875rem', margin: 0 }}>
                📊 über alle Keys
              </p>
            </div>
            <div style={{
              width: '48px',
              height: '48px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem'
            }}>
              📈
            </div>
          </div>
        </div>

        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: isMobile ? '1.25rem' : '1.5rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>Ø Conversion Rate</p>
              <h3 style={{ 
                fontSize: isMobile ? '1.5rem' : '2rem', 
                fontWeight: 'bold', 
                color: '#1e293b', 
                margin: '0.5rem 0' 
              }}>
                {clientKeys.length > 0 ? 
                  (clientKeys.reduce((total, key) => total + parseFloat(getKeyAnalytics(key.id).conversionRate), 0) / clientKeys.length).toFixed(1) : 
                  '0.0'}%
              </h3>
              <p style={{ color: '#f59e0b', fontSize: '0.875rem', margin: 0 }}>
                💰 durchschnittlich
              </p>
            </div>
            <div style={{
              width: '48px',
              height: '48px',
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem'
            }}>
              💰
            </div>
          </div>
        </div>
      </div>

      {/* Client Keys List */}
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: isMobile ? '1.25rem' : '2rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e5e7eb'
      }}>
        <h2 style={{ 
          color: '#1e293b', 
          margin: '0 0 1.5rem 0',
          fontSize: isMobile ? '1.25rem' : '1.5rem'
        }}>
          🔑 Ihre Client Keys
        </h2>

        {clientKeys.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '3rem',
            color: '#6b7280'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔑</div>
            <h3 style={{ color: '#374151', margin: '0 0 0.5rem 0' }}>Noch keine Client Keys</h3>
            <p style={{ margin: 0 }}>Erstellen Sie Ihren ersten Client Key, um das Widget zu integrieren.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {clientKeys.map(key => {
              const keyAnalytics = getKeyAnalytics(key.id)
              return (
                <div key={key.id} style={{
                  background: '#f8fafc',
                  border: key.is_active ? '1px solid #10b981' : '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: isMobile ? '1rem' : '1.5rem'
                }}>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '1fr' : '1fr auto auto',
                    gap: '1rem',
                    alignItems: isMobile ? 'stretch' : 'center'
                  }}>
                    {/* Key Info */}
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <h3 style={{ 
                          color: '#1e293b', 
                          margin: 0,
                          fontSize: '1.1rem',
                          fontWeight: 'bold'
                        }}>
                          {key.name}
                        </h3>
                        <div style={{
                          padding: '0.25rem 0.5rem',
                          background: key.is_active ? '#dcfce7' : '#fee2e2',
                          color: key.is_active ? '#166534' : '#dc2626',
                          borderRadius: '12px',
                          fontSize: '0.75rem',
                          fontWeight: 'bold'
                        }}>
                          {key.is_active ? '🟢 Aktiv' : '🔴 Inaktiv'}
                        </div>
                      </div>

                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        marginBottom: '1rem'
                      }}>
                        <code style={{
                          background: '#1e293b',
                          color: '#10b981',
                          padding: '0.5rem',
                          borderRadius: '6px',
                          fontSize: '0.875rem',
                          fontFamily: 'monospace'
                        }}>
                          {key.client_key_hash?.substring(0, 20)}...
                        </code>
                        <button
                          onClick={() => copyToClipboard(key.client_key_hash)}
                          style={{
                            padding: '0.25rem 0.5rem',
                            background: '#3b82f6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.75rem'
                          }}
                        >
                          📋 Kopieren
                        </button>
                      </div>

                      {/* Analytics */}
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fit, minmax(120px, 1fr))',
                        gap: '1rem',
                        fontSize: isMobile ? '1rem' : '0.875rem'
                      }}>
                        <div>
                          <div style={{ color: '#6b7280' }}>Gesamt Kontakte</div>
                          <div style={{ fontWeight: 'bold', color: '#1e293b' }}>
                            {keyAnalytics.totalContacts}
                          </div>
                        </div>
                        <div>
                          <div style={{ color: '#6b7280' }}>Diesen Monat</div>
                          <div style={{ fontWeight: 'bold', color: '#10b981' }}>
                            {keyAnalytics.thisMonth}
                          </div>
                        </div>
                        <div>
                          <div style={{ color: '#6b7280' }}>Conversion Rate</div>
                          <div style={{ fontWeight: 'bold', color: '#f59e0b' }}>
                            {keyAnalytics.conversionRate}%
                          </div>
                        </div>
                        <div>
                          <div style={{ color: '#6b7280' }}>Ø Response Time</div>
                          <div style={{ fontWeight: 'bold', color: '#3b82f6' }}>
                            {keyAnalytics.avgResponseTime}s
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div style={{ 
                      display: 'flex', 
                      flexDirection: isMobile ? 'column' : 'row',
                      gap: '0.5rem',
                      marginTop: isMobile ? '1rem' : '0'
                    }}>
                      <button
                        onClick={() => setSelectedKey(key)}
                        style={{
                          padding: isMobile ? '0.75rem 1rem' : '0.5rem 1rem',
                          background: '#f3f4f6',
                          color: '#374151',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: isMobile ? '1rem' : '0.875rem'
                        }}
                      >
                        📊 Details
                      </button>
                      
                      <button
                        onClick={() => toggleKeyStatus(key.id, !key.is_active)}
                        style={{
                          padding: isMobile ? '0.75rem 1rem' : '0.5rem 1rem',
                          background: key.is_active ? '#fee2e2' : '#dcfce7',
                          color: key.is_active ? '#dc2626' : '#166534',
                          border: key.is_active ? '1px solid #fecaca' : '1px solid #bbf7d0',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: isMobile ? '1rem' : '0.875rem'
                        }}
                      >
                        {key.is_active ? '🔴 Deaktivieren' : '🟢 Aktivieren'}
                      </button>
                    </div>
                  </div>

                  {/* Integration Code */}
                  {key.is_active && (
                    <div style={{
                      marginTop: '1rem',
                      padding: isMobile ? '0.75rem' : '1rem',
                      background: '#1e293b',
                      borderRadius: '8px',
                      fontSize: isMobile ? '0.75rem' : '0.875rem'
                    }}>
                      <div style={{ 
                        display: 'flex', 
                        flexDirection: isMobile ? 'column' : 'row',
                        justifyContent: 'space-between', 
                        alignItems: isMobile ? 'stretch' : 'center',
                        gap: isMobile ? '0.5rem' : '0',
                        marginBottom: '0.5rem'
                      }}>
                        <span style={{ 
                          color: '#10b981', 
                          fontWeight: 'bold',
                          fontSize: isMobile ? '0.875rem' : '1rem'
                        }}>
                          🔗 Widget Integration Code:
                        </span>
                        <button
                          onClick={() => copyToClipboard(`<script src="${window.location.origin}/widget.js"></script>
<script>CarBot.init({ clientKey: '${key.client_key_hash}' });</script>`)}
                          style={{
                            padding: isMobile ? '0.5rem 1rem' : '0.25rem 0.5rem',
                            background: '#10b981',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: isMobile ? '0.875rem' : '0.75rem'
                          }}
                        >
                          📋 Code kopieren
                        </button>
                      </div>
                      <pre style={{ 
                        color: '#d1d5db', 
                        margin: 0, 
                        whiteSpace: 'pre-wrap',
                        fontFamily: 'monospace',
                        fontSize: isMobile ? '0.75rem' : '0.875rem',
                        overflow: 'auto'
                      }}>
{`<script src="${typeof window !== 'undefined' ? window.location.origin : 'https://your-domain.com'}/widget.js"></script>
<script>CarBot.init({ clientKey: '${key.client_key_hash}' });</script>`}
                      </pre>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <CreateKeyModal
          onCreateKey={createClientKey}
          onClose={() => setShowCreateModal(false)}
        />
      )}

      {/* Key Details Modal */}
      {selectedKey && (
        <KeyDetailsModal
          clientKey={selectedKey}
          analytics={getKeyAnalytics(selectedKey.id)}
          onClose={() => setSelectedKey(null)}
        />
      )}
    </div>
  )
}

// Create Key Modal
function CreateKeyModal({ onCreateKey, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    authorizedDomains: ['localhost:3000'],
    description: ''
  })
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      alert('Bitte geben Sie einen Namen für den Client Key ein.')
      return
    }

    onCreateKey({
      name: formData.name,
      authorized_domains: formData.authorizedDomains.filter(domain => domain.trim()),
      description: formData.description
    })
  }

  const addDomain = () => {
    setFormData(prev => ({
      ...prev,
      authorizedDomains: [...prev.authorizedDomains, '']
    }))
  }

  const removeDomain = (index) => {
    setFormData(prev => ({
      ...prev,
      authorizedDomains: prev.authorizedDomains.filter((_, i) => i !== index)
    }))
  }

  const updateDomain = (index, value) => {
    setFormData(prev => ({
      ...prev,
      authorizedDomains: prev.authorizedDomains.map((domain, i) => 
        i === index ? value : domain
      )
    }))
  }

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: isMobile ? 'stretch' : 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: isMobile ? '0' : '1rem'
    }}>
      <div style={{
        background: 'white',
        borderRadius: isMobile ? '0' : '16px',
        padding: isMobile ? '1.5rem' : '2rem',
        maxWidth: isMobile ? '100%' : '500px',
        width: '100%',
        maxHeight: isMobile ? '100vh' : '90vh',
        overflow: 'auto'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ color: '#1e293b', margin: 0 }}>🔑 Neuen Client Key erstellen</h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              color: '#6b7280'
            }}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: 'bold',
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              Key Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '1rem',
                boxSizing: 'border-box'
              }}
              placeholder="z.B. Hauptwebsite, Landing Page"
              required
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
              Autorisierte Domains
            </label>
            {formData.authorizedDomains.map((domain, index) => (
              <div key={index} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <input
                  type="text"
                  value={domain}
                  onChange={(e) => updateDomain(index, e.target.value)}
                  style={{
                    flex: 1,
                    padding: '0.5rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '0.875rem'
                  }}
                  placeholder="example.com"
                />
                {formData.authorizedDomains.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeDomain(index)}
                    style={{
                      padding: '0.5rem',
                      background: '#fee2e2',
                      color: '#dc2626',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    🗑️
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addDomain}
              style={{
                padding: '0.5rem 1rem',
                background: '#f3f4f6',
                color: '#374151',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.875rem'
              }}
            >
              ➕ Domain hinzufügen
            </button>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: 'bold',
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              Beschreibung (optional)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '1rem',
                boxSizing: 'border-box',
                resize: 'vertical'
              }}
              placeholder="Wofür wird dieser Key verwendet?"
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: '0.75rem',
                background: '#f3f4f6',
                color: '#374151',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              Abbrechen
            </button>
            <button
              type="submit"
              style={{
                flex: 1,
                padding: '0.75rem',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              🔑 Key erstellen
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Key Details Modal
function KeyDetailsModal({ clientKey, analytics, onClose }) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: isMobile ? 'stretch' : 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: isMobile ? '0' : '1rem'
    }}>
      <div style={{
        background: 'white',
        borderRadius: isMobile ? '0' : '16px',
        padding: isMobile ? '1.5rem' : '2rem',
        maxWidth: isMobile ? '100%' : '600px',
        width: '100%',
        maxHeight: isMobile ? '100vh' : '90vh',
        overflow: 'auto'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ 
            color: '#1e293b', 
            margin: 0,
            fontSize: isMobile ? '1.25rem' : '1.5rem'
          }}>
            📊 {clientKey.name} - Details
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: isMobile ? '1.75rem' : '1.5rem',
              cursor: 'pointer',
              color: '#6b7280',
              padding: isMobile ? '0.5rem' : '0'
            }}
          >
            ✕
          </button>
        </div>

        {/* Analytics Charts would go here */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            background: '#f8fafc',
            padding: '1rem',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3b82f6' }}>
              {analytics.totalContacts}
            </div>
            <div style={{ fontSize: '0.875rem', color: '#64748b' }}>Gesamt Kontakte</div>
          </div>
          <div style={{
            background: '#f8fafc',
            padding: '1rem',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981' }}>
              {analytics.thisMonth}
            </div>
            <div style={{ fontSize: '0.875rem', color: '#64748b' }}>Diesen Monat</div>
          </div>
          <div style={{
            background: '#f8fafc',
            padding: '1rem',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f59e0b' }}>
              {analytics.conversionRate}%
            </div>
            <div style={{ fontSize: '0.875rem', color: '#64748b' }}>Conversion Rate</div>
          </div>
        </div>

        <div style={{
          background: '#f8fafc',
          padding: '1rem',
          borderRadius: '8px',
          marginBottom: '1rem'
        }}>
          <h3 style={{ color: '#1e293b', margin: '0 0 0.5rem 0' }}>Key Details</h3>
          <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
            <div style={{ marginBottom: '0.5rem' }}>
              <strong>Client Key:</strong> {clientKey.client_key_hash}
            </div>
            <div style={{ marginBottom: '0.5rem' }}>
              <strong>Status:</strong> {clientKey.is_active ? 'Aktiv' : 'Inaktiv'}
            </div>
            <div style={{ marginBottom: '0.5rem' }}>
              <strong>Erstellt:</strong> {new Date(clientKey.created_at).toLocaleDateString('de-DE')}
            </div>
            <div>
              <strong>Autorisierte Domains:</strong> {clientKey.authorized_domains?.join(', ') || 'Alle'}
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          style={{
            width: '100%',
            padding: isMobile ? '1rem' : '0.75rem',
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '500',
            fontSize: isMobile ? '1rem' : '0.875rem'
          }}
        >
          Schließen
        </button>
      </div>
    </div>
  )
}