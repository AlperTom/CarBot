'use client'

import { useState, useEffect } from 'react'

export default function ServiceManager({ workshopId }) {
  const [services, setServices] = useState([])
  const [categories, setCategories] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('')
  const [loading, setLoading] = useState(false)
  const [searching, setSearching] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedService, setSelectedService] = useState(null)
  const [sessionId] = useState(`session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Check if mobile on mount and resize
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    fetchWorkshopServices()
    fetchSearchSuggestions()
  }, [workshopId])

  const fetchWorkshopServices = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/services', {
        headers: {
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem('carbot_auth_tokens') || '{}').accessToken}`
        }
      })

      if (response.ok) {
        const result = await response.json()
        setServices(result.data.services || [])
        setCategories(result.data.categories || [])
      } else {
        console.error('Failed to fetch services')
      }
    } catch (error) {
      console.error('Service fetch error:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchSearchSuggestions = async () => {
    try {
      const response = await fetch('/api/services/search', {
        headers: {
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem('carbot_auth_tokens') || '{}').accessToken}`
        }
      })

      if (response.ok) {
        const result = await response.json()
        // Store suggestions for later use
        console.log('Search suggestions loaded:', result.data)
      }
    } catch (error) {
      console.error('Search suggestions error:', error)
    }
  }

  const handleSearch = async () => {
    if (!searchTerm || searchTerm.length < 2) {
      setSearchResults([])
      return
    }

    try {
      setSearching(true)
      const response = await fetch('/api/services/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem('carbot_auth_tokens') || '{}').accessToken}`
        },
        body: JSON.stringify({
          searchTerm,
          categoryId: selectedCategory,
          sessionId
        })
      })

      if (response.ok) {
        const result = await response.json()
        setSearchResults(result.data.services || [])
      } else {
        console.error('Search failed')
      }
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setSearching(false)
    }
  }

  const addServiceToWorkshop = async (serviceData) => {
    try {
      const response = await fetch('/api/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem('carbot_auth_tokens') || '{}').accessToken}`,
          'X-Search-Term': searchTerm,
          'X-Session-ID': sessionId
        },
        body: JSON.stringify({
          masterServiceId: serviceData.masterServiceId,
          customName: serviceData.customName,
          priceMin: parseFloat(serviceData.priceMin),
          priceMax: parseFloat(serviceData.priceMax),
          customDescription: serviceData.customDescription,
          isFeatured: serviceData.isFeatured || false
        })
      })

      if (response.ok) {
        const result = await response.json()
        setServices(prev => [...prev, result.data])
        setShowAddModal(false)
        setSelectedService(null)
        alert('Service erfolgreich hinzugefügt!')
        
        // Refresh search results to remove added service
        handleSearch()
      } else {
        const error = await response.json()
        alert(`Fehler: ${error.error}`)
      }
    } catch (error) {
      console.error('Add service error:', error)
      alert('Fehler beim Hinzufügen des Services.')
    }
  }

  // Real-time search as user types
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchTerm.length >= 2) {
        handleSearch()
      } else {
        setSearchResults([])
      }
    }, 300)

    return () => clearTimeout(debounceTimer)
  }, [searchTerm, selectedCategory])

  return (
    <div style={{
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
      minHeight: '100vh',
      padding: isMobile ? '1rem' : '2rem'
    }}>
      {/* Header */}
      <div style={{ marginBottom: isMobile ? '1.5rem' : '2rem' }}>
        <h1 style={{
          fontSize: isMobile ? '1.5rem' : '2rem',
          fontWeight: 'bold',
          color: '#1e293b',
          margin: '0 0 0.5rem 0'
        }}>
          🔧 Service Management
        </h1>
        <p style={{ 
          color: '#64748b', 
          margin: 0,
          fontSize: isMobile ? '0.875rem' : '1rem'
        }}>
          Verwalten Sie Ihre Dienstleistungen und fügen Sie neue Services hinzu
        </p>
      </div>

      {/* Search Section */}
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: isMobile ? '1.25rem' : '2rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e5e7eb',
        marginBottom: isMobile ? '1.5rem' : '2rem'
      }}>
        <h2 style={{ 
          color: '#1e293b', 
          margin: '0 0 1rem 0',
          fontSize: isMobile ? '1.25rem' : '1.5rem'
        }}>
          🔍 Neue Services finden
        </h2>
        <p style={{ 
          color: '#64748b', 
          margin: '0 0 1.5rem 0', 
          fontSize: '0.875rem' 
        }}>
          Suchen Sie nach Services und fügen Sie sie mit einem Klick zu Ihrem Angebot hinzu
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr auto auto',
          gap: '1rem',
          alignItems: 'center',
          marginBottom: '1.5rem'
        }}>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="z.B. Ölwechsel, Bremsen, Klimaanlage..."
            style={{
              padding: isMobile ? '1rem' : '0.75rem 1rem',
              border: '2px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: isMobile ? '1rem' : '1rem',
              outline: 'none',
              transition: 'border-color 0.2s',
              width: '100%',
              boxSizing: 'border-box'
            }}
            onFocus={(e) => e.target.style.borderColor = '#ea580c'}
            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
          />

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{
              padding: isMobile ? '1rem' : '0.75rem 1rem',
              border: '2px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: isMobile ? '1rem' : '1rem',
              minWidth: isMobile ? '100%' : '200px',
              width: isMobile ? '100%' : 'auto',
              boxSizing: 'border-box'
            }}
          >
            <option value="">Alle Kategorien</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.icon} {category.name_de}
              </option>
            ))}
          </select>

          <button
            onClick={handleSearch}
            disabled={searching || searchTerm.length < 2}
            style={{
              padding: isMobile ? '1rem 1.5rem' : '0.75rem 1.5rem',
              background: searching ? '#9ca3af' : 'linear-gradient(135deg, #ea580c 0%, #dc2626 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: searching ? 'not-allowed' : 'pointer',
              fontWeight: '500',
              transition: 'all 0.2s',
              width: isMobile ? '100%' : 'auto'
            }}
          >
            {searching ? '🔄 Suche...' : '🔍 Suchen'}
          </button>
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div>
            <h3 style={{ 
              color: '#1e293b', 
              margin: '0 0 1rem 0',
              fontSize: isMobile ? '1.1rem' : '1.25rem'
            }}>
              📋 Verfügbare Services ({searchResults.length})
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(350px, 1fr))',
              gap: isMobile ? '1rem' : '1rem'
            }}>
              {searchResults.map(service => (
                <div key={service.id} style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: isMobile ? '1rem' : '1.5rem',
                  position: 'relative'
                }}>
                  <div style={{
                    display: 'flex',
                    flexDirection: isMobile ? 'column' : 'row',
                    justifyContent: 'space-between',
                    alignItems: isMobile ? 'stretch' : 'flex-start',
                    marginBottom: '1rem',
                    gap: isMobile ? '1rem' : '0'
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '1.2rem' }}>
                          {service.service_categories?.icon || '🔧'}
                        </span>
                        <h4 style={{ 
                          color: '#1e293b', 
                          margin: 0,
                          fontSize: '1.1rem',
                          fontWeight: 'bold'
                        }}>
                          {service.service_name_de}
                        </h4>
                        {service.is_popular && (
                          <span style={{
                            background: '#fbbf24',
                            color: 'white',
                            fontSize: '0.75rem',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '12px',
                            fontWeight: 'bold'
                          }}>
                            ⭐ Beliebt
                          </span>
                        )}
                      </div>
                      <p style={{
                        color: '#64748b',
                        margin: '0 0 1rem 0',
                        fontSize: '0.875rem'
                      }}>
                        {service.description_de}
                      </p>

                      {/* Suggested Pricing */}
                      {service.suggestedPricing && (
                        <div style={{
                          background: '#dbeafe',
                          border: '1px solid #bfdbfe',
                          borderRadius: '6px',
                          padding: '0.75rem',
                          marginBottom: '1rem'
                        }}>
                          <p style={{ 
                            margin: '0 0 0.5rem 0',
                            fontSize: '0.875rem',
                            fontWeight: 'bold',
                            color: '#1e40af'
                          }}>
                            💰 Empfohlene Preise:
                          </p>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                            <span style={{ color: '#1e40af' }}>
                              Empfohlen: {service.suggestedPricing.minPrice}€ - {service.suggestedPricing.maxPrice}€
                            </span>
                            <span style={{ color: '#6b7280' }}>
                              Markt Ø: {service.suggestedPricing.marketAverage.min}€ - {service.suggestedPricing.marketAverage.max}€
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Service Details */}
                      <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: '#6b7280' }}>
                        <span>⏱️ {service.typical_duration_minutes || 30} Min</span>
                        <span>🔧 {service.complexity_level || 'Standard'}</span>
                        {service.vehicle_types?.length > 0 && (
                          <span>🚗 {service.vehicle_types.slice(0, 2).join(', ')}</span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedService(service)
                        setShowAddModal(true)
                      }}
                      style={{
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        padding: isMobile ? '0.75rem 1rem' : '0.5rem 1rem',
                        cursor: 'pointer',
                        fontWeight: '500',
                        fontSize: isMobile ? '1rem' : '0.875rem',
                        marginLeft: isMobile ? '0' : '1rem',
                        width: isMobile ? '100%' : 'auto'
                      }}
                    >
                      ➕ Hinzufügen
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {searchTerm && searchTerm.length >= 2 && searchResults.length === 0 && !searching && (
          <div style={{
            background: '#fef3c7',
            border: '1px solid #fbbf24',
            borderRadius: '8px',
            padding: '1rem',
            textAlign: 'center'
          }}>
            <p style={{ margin: '0 0 0.5rem 0', color: '#92400e', fontWeight: 'bold' }}>
              🤔 Keine Services gefunden für "{searchTerm}"
            </p>
            <p style={{ margin: 0, fontSize: '0.875rem', color: '#92400e' }}>
              Versuchen Sie andere Begriffe oder kontaktieren Sie uns für individuelle Services.
            </p>
          </div>
        )}
      </div>

      {/* Current Services */}
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: isMobile ? '1.25rem' : '2rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e5e7eb'
      }}>
        <h2 style={{ 
          color: '#1e293b', 
          margin: '0 0 1rem 0',
          fontSize: isMobile ? '1.25rem' : '1.5rem'
        }}>
          📋 Ihre aktuellen Services
        </h2>
        
        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '4px solid #f3f4f6',
              borderTop: '4px solid #ea580c',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto'
            }}></div>
            <p style={{ marginTop: '1rem', color: '#6b7280' }}>Lade Services...</p>
          </div>
        ) : services.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '2rem',
            color: '#6b7280'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔧</div>
            <h3 style={{ color: '#374151', margin: '0 0 0.5rem 0' }}>Noch keine Services hinzugefügt</h3>
            <p style={{ margin: 0 }}>Nutzen Sie die Suche oben, um Services zu Ihrem Angebot hinzuzufügen.</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1rem'
          }}>
            {services.map(service => (
              <div key={service.id} style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: isMobile ? '1rem' : '1.5rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '1.2rem' }}>
                    {service.master_services?.service_categories?.icon || '🔧'}
                  </span>
                  <h4 style={{ 
                    color: '#1e293b', 
                    margin: 0,
                    fontSize: '1.1rem',
                    fontWeight: 'bold'
                  }}>
                    {service.custom_name || service.master_services?.service_name_de}
                  </h4>
                  {service.is_featured && (
                    <span style={{
                      background: '#ea580c',
                      color: 'white',
                      fontSize: '0.75rem',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '12px',
                      fontWeight: 'bold'
                    }}>
                      ⭐
                    </span>
                  )}
                </div>

                <p style={{
                  color: '#64748b',
                  margin: '0 0 1rem 0',
                  fontSize: '0.875rem'
                }}>
                  {service.custom_description || service.master_services?.description_de}
                </p>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.75rem',
                  background: service.is_fixed_price ? '#dcfce7' : '#dbeafe',
                  borderRadius: '8px',
                  marginBottom: '1rem'
                }}>
                  <span style={{
                    fontWeight: 'bold',
                    color: service.is_fixed_price ? '#166534' : '#1e40af',
                    fontSize: '1.1rem'
                  }}>
                    {service.is_fixed_price ? 
                      `${service.price_min}€` : 
                      `${service.price_min}€ - ${service.price_max}€`
                    }
                  </span>
                  <span style={{
                    fontSize: '0.75rem',
                    color: service.is_fixed_price ? '#166534' : '#1e40af'
                  }}>
                    {service.is_fixed_price ? 'Festpreis' : 'Preisspanne'}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.75rem', color: '#6b7280' }}>
                  <span>📁 {service.master_services?.service_categories?.name_de}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Service Modal */}
      {showAddModal && selectedService && (
        <AddServiceModal
          service={selectedService}
          onAdd={addServiceToWorkshop}
          onClose={() => {
            setShowAddModal(false)
            setSelectedService(null)
          }}
        />
      )}
    </div>
  )
}

// Add Service Modal Component
function AddServiceModal({ service, onAdd, onClose }) {
  const [formData, setFormData] = useState({
    customName: service.service_name_de,
    priceMin: service.suggestedPricing?.minPrice || 50,
    priceMax: service.suggestedPricing?.maxPrice || 100,
    customDescription: service.description_de,
    isFeatured: false
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
    
    if (formData.priceMin <= 0 || formData.priceMax < formData.priceMin) {
      alert('Bitte geben Sie gültige Preise ein.')
      return
    }

    onAdd({
      masterServiceId: service.id,
      ...formData
    })
  }

  const isFixedPrice = parseFloat(formData.priceMin) === parseFloat(formData.priceMax)

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
          <h2 style={{ 
            color: '#1e293b', 
            margin: 0,
            fontSize: isMobile ? '1.25rem' : '1.5rem'
          }}>
            ➕ Service hinzufügen
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

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: 'bold',
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              Service Name
            </label>
            <input
              type="text"
              value={formData.customName}
              onChange={(e) => setFormData(prev => ({ ...prev, customName: e.target.value }))}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '1rem',
                boxSizing: 'border-box'
              }}
              required
            />
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
            gap: '1rem',
            marginBottom: '1rem'
          }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: 'bold',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                Mindestpreis (€)
              </label>
              <input
                type="number"
                value={formData.priceMin}
                onChange={(e) => setFormData(prev => ({ ...prev, priceMin: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  boxSizing: 'border-box'
                }}
                min="0"
                step="0.01"
                required
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
                Höchstpreis (€)
              </label>
              <input
                type="number"
                value={formData.priceMax}
                onChange={(e) => setFormData(prev => ({ ...prev, priceMax: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  boxSizing: 'border-box'
                }}
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>

          {isFixedPrice && (
            <div style={{
              background: '#dcfce7',
              border: '1px solid #bbf7d0',
              borderRadius: '8px',
              padding: '0.75rem',
              marginBottom: '1rem'
            }}>
              <p style={{ margin: 0, fontSize: '0.875rem', color: '#166534' }}>
                ✓ Festpreis: {formData.priceMin}€
              </p>
            </div>
          )}

          <div style={{ marginBottom: '1rem' }}>
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
              value={formData.customDescription}
              onChange={(e) => setFormData(prev => ({ ...prev, customDescription: e.target.value }))}
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
              placeholder="Individuelle Beschreibung für diesen Service..."
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              cursor: 'pointer'
            }}>
              <input
                type="checkbox"
                checked={formData.isFeatured}
                onChange={(e) => setFormData(prev => ({ ...prev, isFeatured: e.target.checked }))}
                style={{ marginRight: '0.5rem' }}
              />
              <span style={{ fontSize: '0.875rem', color: '#374151' }}>
                ⭐ Als empfohlenen Service hervorheben
              </span>
            </label>
          </div>

          <div style={{ 
            display: 'flex', 
            flexDirection: isMobile ? 'column' : 'row',
            gap: '1rem' 
          }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: isMobile ? '1rem' : '0.75rem',
                background: '#f3f4f6',
                color: '#374151',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '500',
                fontSize: isMobile ? '1rem' : '0.875rem'
              }}
            >
              Abbrechen
            </button>
            <button
              type="submit"
              style={{
                flex: 1,
                padding: isMobile ? '1rem' : '0.75rem',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '500',
                fontSize: isMobile ? '1rem' : '0.875rem'
              }}
            >
              ➕ Service hinzufügen
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}