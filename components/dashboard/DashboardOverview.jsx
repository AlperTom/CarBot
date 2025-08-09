'use client'

import { useState, useEffect } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'

export default function DashboardOverview({ workshopId }) {
  const [kpiData, setKpiData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState('30') // days
  const [selectedMetric, setSelectedMetric] = useState('contacts')
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Check if mobile on mount and resize
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    fetchKPIData()
  }, [dateRange, workshopId])

  const fetchKPIData = async () => {
    try {
      setLoading(true)
      const fromDate = new Date()
      fromDate.setDate(fromDate.getDate() - parseInt(dateRange))
      
      const response = await fetch(
        `/api/analytics/collect?from=${fromDate.toISOString()}&to=${new Date().toISOString()}`,
        {
          headers: {
            'Authorization': `Bearer ${JSON.parse(localStorage.getItem('carbot_auth_tokens') || '{}').accessToken}`
          }
        }
      )

      if (response.ok) {
        const result = await response.json()
        setKpiData(result.data)
      } else {
        console.error('Failed to fetch KPI data')
      }
    } catch (error) {
      console.error('KPI fetch error:', error)
    } finally {
      setLoading(false)
    }
  }

  const exportToCSV = async () => {
    if (!kpiData) return

    const csvData = kpiData.dailyData.map(day => ({
      'Datum': day.date,
      'Kontakte': day.total_contacts,
      'Qualifizierte Leads': day.qualified_leads,
      'Conversions': day.conversions,
      'Nachrichten': day.total_messages,
      'Unique Visitors': day.unique_visitors,
      'Conversion Rate %': day.total_contacts > 0 ? 
        ((day.conversions / day.total_contacts) * 100).toFixed(2) : '0.00'
    }))

    const csvContent = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `carbot-kpi-${new Date().toISOString().split('T')[0]}.csv`
    link.click()
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
        <p style={{ marginTop: '1rem', color: '#6b7280' }}>Lade KPI Daten...</p>
      </div>
    )
  }

  if (!kpiData) {
    return (
      <div style={{ 
        padding: isMobile ? '1rem' : '2rem', 
        textAlign: 'center' 
      }}>
        <h3 style={{ color: '#374151', marginBottom: '1rem' }}>Keine Daten verfügbar</h3>
        <p style={{ color: '#6b7280' }}>Noch keine Analytics-Daten vorhanden.</p>
      </div>
    )
  }

  const { dailyData, summary } = kpiData

  // Prepare chart data
  const chartData = dailyData.map(day => ({
    date: new Date(day.date).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' }),
    contacts: day.total_contacts,
    leads: day.qualified_leads,
    conversions: day.conversions,
    messages: day.total_messages,
    conversionRate: day.total_contacts > 0 ? 
      ((day.conversions / day.total_contacts) * 100) : 0
  }))

  // Pie chart data for conversion funnel
  const funnelData = [
    { name: 'Kontakte', value: summary.totalContacts, color: '#3b82f6' },
    { name: 'Qualifizierte Leads', value: summary.totalLeads, color: '#10b981' },
    { name: 'Conversions', value: summary.totalConversions, color: '#f59e0b' }
  ]

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
            margin: 0,
            marginBottom: '0.5rem'
          }}>
            📊 KPI Dashboard
          </h1>
          <p style={{ 
            color: '#64748b', 
            margin: 0,
            fontSize: isMobile ? '0.875rem' : '1rem'
          }}>
            Letzte {dateRange} Tage • {isMobile ? '' : 'Zuletzt aktualisiert: '}
            {new Date().toLocaleString('de-DE')}
          </p>
        </div>

        <div style={{ 
          display: 'flex', 
          flexDirection: isMobile ? 'column' : 'row',
          gap: '1rem', 
          alignItems: 'stretch'
        }}>
          {/* Date Range Selector */}
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            style={{
              padding: isMobile ? '0.75rem' : '0.5rem 1rem',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              background: 'white',
              fontSize: isMobile ? '1rem' : '0.875rem'
            }}
          >
            <option value="7">7 Tage</option>
            <option value="30">30 Tage</option>
            <option value="90">90 Tage</option>
            <option value="365">1 Jahr</option>
          </select>

          {/* Export Button */}
          <button
            onClick={exportToCSV}
            style={{
              padding: isMobile ? '0.75rem 1rem' : '0.5rem 1rem',
              background: 'linear-gradient(135deg, #ea580c 0%, #dc2626 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '500',
              fontSize: isMobile ? '1rem' : '0.875rem',
              whiteSpace: 'nowrap'
            }}
          >
            📥 CSV Export
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: isMobile ? '1rem' : '1.5rem',
        marginBottom: isMobile ? '1.5rem' : '2rem'
      }}>
        {/* Total Contacts Card */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: isMobile ? '1.25rem' : '1.5rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            flexDirection: isMobile ? 'row' : 'row'
          }}>
            <div style={{ flex: 1 }}>
              <p style={{ 
                color: '#6b7280', 
                fontSize: '0.875rem', 
                margin: 0 
              }}>
                Gesamt Kontakte
              </p>
              <h3 style={{ 
                fontSize: isMobile ? '1.75rem' : '2rem', 
                fontWeight: 'bold', 
                color: '#1e293b', 
                margin: '0.5rem 0' 
              }}>
                {summary.totalContacts.toLocaleString()}
              </h3>
              <p style={{ 
                color: '#10b981', 
                fontSize: '0.875rem', 
                margin: 0 
              }}>
                📞 via Chat Widget
              </p>
            </div>
            <div style={{
              width: isMobile ? '40px' : '48px',
              height: isMobile ? '40px' : '48px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: isMobile ? '1.25rem' : '1.5rem'
            }}>
              👥
            </div>
          </div>
        </div>

        {/* Qualified Leads Card */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: isMobile ? '1.25rem' : '1.5rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ flex: 1 }}>
              <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>Qualifizierte Leads</p>
              <h3 style={{ 
                fontSize: isMobile ? '1.75rem' : '2rem', 
                fontWeight: 'bold', 
                color: '#1e293b', 
                margin: '0.5rem 0' 
              }}>
                {summary.totalLeads.toLocaleString()}
              </h3>
              <p style={{ color: '#10b981', fontSize: '0.875rem', margin: 0 }}>
                🎯 {summary.totalContacts > 0 ? 
                  `${((summary.totalLeads / summary.totalContacts) * 100).toFixed(1)}%` : 
                  '0%'} der Kontakte
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
              🎯
            </div>
          </div>
        </div>

        {/* Conversions Card */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: isMobile ? '1.25rem' : '1.5rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ flex: 1 }}>
              <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>Conversions</p>
              <h3 style={{ 
                fontSize: isMobile ? '1.75rem' : '2rem', 
                fontWeight: 'bold', 
                color: '#1e293b', 
                margin: '0.5rem 0' 
              }}>
                {summary.totalConversions.toLocaleString()}
              </h3>
              <p style={{ color: '#f59e0b', fontSize: '0.875rem', margin: 0 }}>
                💰 {summary.avgConversionRate.toFixed(1)}% Conversion Rate
              </p>
            </div>
            <div style={{
              width: isMobile ? '40px' : '48px',
              height: isMobile ? '40px' : '48px',
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: isMobile ? '1.25rem' : '1.5rem'
            }}>
              💰
            </div>
          </div>
        </div>

        {/* Messages Card */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: isMobile ? '1.25rem' : '1.5rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ flex: 1 }}>
              <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>Nachrichten</p>
              <h3 style={{ 
                fontSize: isMobile ? '1.75rem' : '2rem', 
                fontWeight: 'bold', 
                color: '#1e293b', 
                margin: '0.5rem 0' 
              }}>
                {summary.totalMessages.toLocaleString()}
              </h3>
              <p style={{ color: '#8b5cf6', fontSize: '0.875rem', margin: 0 }}>
                💬 Gesamt Chat-Nachrichten
              </p>
            </div>
            <div style={{
              width: isMobile ? '40px' : '48px',
              height: isMobile ? '40px' : '48px',
              background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: isMobile ? '1.25rem' : '1.5rem'
            }}>
              💬
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr',
        gap: '1.5rem',
        marginBottom: isMobile ? '1.5rem' : '2rem'
      }}>
        {/* Main Trend Chart */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: isMobile ? '1rem' : '1.5rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            justifyContent: 'space-between',
            alignItems: isMobile ? 'stretch' : 'center',
            gap: isMobile ? '1rem' : '0',
            marginBottom: '1rem'
          }}>
            <h3 style={{ 
              color: '#1e293b', 
              margin: 0,
              fontSize: isMobile ? '1.25rem' : '1.5rem'
            }}>
              📈 Kontakt-Trend
            </h3>
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              style={{
                padding: isMobile ? '0.75rem' : '0.25rem 0.5rem',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: isMobile ? '1rem' : '0.875rem'
              }}
            >
              <option value="contacts">Kontakte</option>
              <option value="leads">Leads</option>
              <option value="conversions">Conversions</option>
              <option value="conversionRate">Conversion Rate %</option>
            </select>
          </div>

          <ResponsiveContainer width="100%" height={isMobile ? 250 : 300}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis 
                dataKey="date" 
                stroke="#64748b"
                fontSize={isMobile ? 10 : 12}
                angle={isMobile ? -45 : 0}
                textAnchor={isMobile ? 'end' : 'middle'}
                height={isMobile ? 60 : 30}
              />
              <YAxis 
                stroke="#64748b"
                fontSize={isMobile ? 10 : 12}
                width={isMobile ? 40 : 60}
              />
              <Tooltip 
                contentStyle={{
                  background: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  fontSize: isMobile ? '0.875rem' : '1rem'
                }}
              />
              <Area
                type="monotone"
                dataKey={selectedMetric}
                stroke="#ea580c"
                fill="url(#colorGradient)"
                strokeWidth={2}
              />
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ea580c" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ea580c" stopOpacity={0.05}/>
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Conversion Funnel */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: isMobile ? '1rem' : '1.5rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb'
        }}>
          <h3 style={{ 
            color: '#1e293b', 
            margin: '0 0 1rem 0',
            fontSize: isMobile ? '1.25rem' : '1.5rem'
          }}>
            🔄 Conversion Funnel
          </h3>
          
          <ResponsiveContainer width="100%" height={isMobile ? 180 : 200}>
            <PieChart>
              <Pie
                data={funnelData}
                cx="50%"
                cy="50%"
                innerRadius={isMobile ? 30 : 40}
                outerRadius={isMobile ? 60 : 80}
                paddingAngle={5}
                dataKey="value"
              >
                {funnelData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>

          <div style={{ marginTop: '1rem' }}>
            {funnelData.map((item, index) => (
              <div key={index} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: isMobile ? '0.75rem 0' : '0.5rem 0',
                borderBottom: index < funnelData.length - 1 ? '1px solid #f1f5f9' : 'none'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '2px',
                    background: item.color
                  }}></div>
                  <span style={{ 
                    fontSize: isMobile ? '1rem' : '0.875rem', 
                    color: '#64748b' 
                  }}>
                    {item.name}
                  </span>
                </div>
                <span style={{ 
                  fontWeight: 'bold', 
                  color: '#1e293b',
                  fontSize: isMobile ? '1rem' : '0.875rem'
                }}>
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Insights */}
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: isMobile ? '1rem' : '1.5rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e5e7eb'
      }}>
        <h3 style={{ 
          color: '#1e293b', 
          margin: '0 0 1rem 0',
          fontSize: isMobile ? '1.25rem' : '1.5rem'
        }}>
          💡 Performance Insights
        </h3>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem'
        }}>
          <div style={{
            padding: '1rem',
            background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
            borderRadius: '8px'
          }}>
            <h4 style={{ 
              margin: '0 0 0.5rem 0', 
              color: '#1e40af',
              fontSize: isMobile ? '1rem' : '1.1rem'
            }}>
              📊 Beste Performance
            </h4>
            <p style={{ 
              margin: 0, 
              fontSize: isMobile ? '1rem' : '0.875rem', 
              color: '#1e40af' 
            }}>
              {chartData.length > 0 && 
                chartData.reduce((best, day) => 
                  day.contacts > best.contacts ? day : best, chartData[0]
                ).date
              } - {chartData.length > 0 && 
                Math.max(...chartData.map(d => d.contacts))
              } Kontakte
            </p>
          </div>

          <div style={{
            padding: '1rem',
            background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)',
            borderRadius: '8px'
          }}>
            <h4 style={{ 
              margin: '0 0 0.5rem 0', 
              color: '#166534',
              fontSize: isMobile ? '1rem' : '1.1rem'
            }}>
              🎯 Lead Qualität
            </h4>
            <p style={{ 
              margin: 0, 
              fontSize: isMobile ? '1rem' : '0.875rem', 
              color: '#166534' 
            }}>
              {summary.totalContacts > 0 ? 
                `${((summary.totalLeads / summary.totalContacts) * 100).toFixed(1)}%` : 
                '0%'} der Kontakte werden zu Leads
            </p>
          </div>

          <div style={{
            padding: '1rem',
            background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
            borderRadius: '8px'
          }}>
            <h4 style={{ 
              margin: '0 0 0.5rem 0', 
              color: '#92400e',
              fontSize: isMobile ? '1rem' : '1.1rem'
            }}>
              💰 Conversion
            </h4>
            <p style={{ 
              margin: 0, 
              fontSize: isMobile ? '1rem' : '0.875rem', 
              color: '#92400e' 
            }}>
              {summary.avgConversionRate.toFixed(1)}% durchschnittliche Conversion Rate
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}