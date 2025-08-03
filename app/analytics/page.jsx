'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import AnalyticsDashboard from '../../components/AnalyticsDashboard'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function AnalyticsPage() {
  const [customers, setCustomers] = useState([])
  const [selectedCustomer, setSelectedCustomer] = useState('')
  const [loading, setLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)
  const [authKey, setAuthKey] = useState('')

  useEffect(() => {
    loadCustomers()
  }, [])

  const loadCustomers = async () => {
    try {
      const { data } = await supabase
        .from('customers')
        .select('slug, name, city')
        .order('name')
      
      setCustomers(data || [])
    } catch (error) {
      console.error('Error loading customers:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAuth = () => {
    // Simple authentication - in production use proper auth
    if (authKey === 'carbot-admin-2024' || authKey === process.env.NEXT_PUBLIC_ADMIN_KEY) {
      setAuthenticated(true)
    } else {
      alert('Invalid authentication key')
    }
  }

  if (!authenticated) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0070f3 0%, #0051a5 100%)',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        <div style={{
          background: 'white',
          padding: '40px',
          borderRadius: '12px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
          width: '100%',
          maxWidth: '400px'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <h1 style={{ color: '#1a202c', margin: 0, fontSize: '24px' }}>🚗 CarBot Analytics</h1>
            <p style={{ color: '#666', margin: '10px 0 0 0' }}>Admin Dashboard</p>
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontSize: '14px', 
              fontWeight: 'bold',
              color: '#374151'
            }}>
              Access Key
            </label>
            <input
              type="password"
              value={authKey}
              onChange={(e) => setAuthKey(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAuth()}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
              placeholder="Enter admin access key"
            />
          </div>
          
          <button
            onClick={handleAuth}
            style={{
              width: '100%',
              padding: '12px',
              background: '#0070f3',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Access Dashboard
          </button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        <div style={{ color: '#666' }}>Loading customers...</div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f8fafc',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Header */}
      <div style={{
        background: 'white',
        borderBottom: '1px solid #e2e8f0',
        padding: '20px 0'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <h1 style={{ color: '#1a202c', margin: 0, fontSize: '24px' }}>
              🚗 CarBot Analytics
            </h1>
            
            <select
              value={selectedCustomer}
              onChange={(e) => setSelectedCustomer(e.target.value)}
              style={{
                padding: '8px 12px',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                fontSize: '14px',
                minWidth: '200px'
              }}
            >
              <option value="">Select Customer</option>
              {customers.map(customer => (
                <option key={customer.slug} value={customer.slug}>
                  {customer.name} - {customer.city}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span style={{ fontSize: '12px', color: '#666' }}>
              {customers.length} customers active
            </span>
            <button
              onClick={() => setAuthenticated(false)}
              style={{
                padding: '6px 12px',
                border: '1px solid #e2e8f0',
                background: 'white',
                color: '#666',
                borderRadius: '4px',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div style={{ padding: '20px' }}>
        {selectedCustomer ? (
          <AnalyticsDashboard 
            customerSlug={selectedCustomer}
            language="de"
          />
        ) : (
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            textAlign: 'center',
            padding: '60px 20px'
          }}>
            <div style={{
              background: 'white',
              padding: '40px',
              borderRadius: '12px',
              border: '1px solid #e2e8f0'
            }}>
              <h2 style={{ color: '#1a202c', margin: '0 0 15px 0' }}>
                Welcome to CarBot Analytics
              </h2>
              <p style={{ color: '#666', margin: '0 0 30px 0' }}>
                Select a customer from the dropdown above to view their analytics dashboard.
              </p>
              
              {customers.length > 0 ? (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                  gap: '20px',
                  marginTop: '30px'
                }}>
                  {customers.slice(0, 6).map(customer => (
                    <div
                      key={customer.slug}
                      onClick={() => setSelectedCustomer(customer.slug)}
                      style={{
                        padding: '20px',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        ':hover': { borderColor: '#0070f3' }
                      }}
                      onMouseEnter={(e) => e.target.style.borderColor = '#0070f3'}
                      onMouseLeave={(e) => e.target.style.borderColor = '#e2e8f0'}
                    >
                      <h3 style={{ 
                        margin: '0 0 8px 0', 
                        fontSize: '16px', 
                        color: '#1a202c' 
                      }}>
                        {customer.name}
                      </h3>
                      <p style={{ 
                        margin: 0, 
                        fontSize: '14px', 
                        color: '#666' 
                      }}>
                        {customer.city}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: '#666' }}>No customers found</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Quick Stats Footer */}
      {selectedCustomer && (
        <QuickStatsFooter customerSlug={selectedCustomer} />
      )}
    </div>
  )
}

function QuickStatsFooter({ customerSlug }) {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    loadQuickStats()
  }, [customerSlug])

  const loadQuickStats = async () => {
    try {
      const response = await fetch(`/api/analytics?customer=${customerSlug}&range=7d&metric=overview`)
      const data = await response.json()
      setStats(data.summary)
    } catch (error) {
      console.error('Error loading quick stats:', error)
    }
  }

  if (!stats) return null

  return (
    <div style={{
      background: 'white',
      borderTop: '1px solid #e2e8f0',
      padding: '15px 0'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ fontSize: '12px', color: '#666' }}>
          Last 7 days summary
        </div>
        <div style={{ display: 'flex', gap: '30px' }}>
          <QuickStat label="Chats" value={stats.totalChats} />
          <QuickStat label="Leads" value={stats.totalLeads} />
          <QuickStat label="Appointments" value={stats.totalAppointments} />
          <QuickStat label="Conversion" value={`${stats.conversionRate}%`} />
        </div>
      </div>
    </div>
  )
}

function QuickStat({ label, value }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#0070f3' }}>
        {value}
      </div>
      <div style={{ fontSize: '12px', color: '#666' }}>
        {label}
      </div>
    </div>
  )
}