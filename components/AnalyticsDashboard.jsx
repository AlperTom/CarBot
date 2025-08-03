'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function AnalyticsDashboard({ customerSlug, language = 'de' }) {
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('7d') // 7d, 30d, 90d
  const [activeTab, setActiveTab] = useState('overview')

  const translations = {
    de: {
      title: "Analytics Dashboard",
      overview: "Übersicht",
      leads: "Leads",
      chats: "Chats", 
      appointments: "Termine",
      performance: "Performance",
      totalChats: "Gesamt Chats",
      totalLeads: "Gesamt Leads",
      totalAppointments: "Gesamt Termine",
      conversionRate: "Conversion Rate",
      avgResponseTime: "Ø Antwortzeit",
      popularQuestions: "Häufige Fragen",
      leadSources: "Lead Quellen",
      timeRange: "Zeitraum",
      last7days: "Letzte 7 Tage",
      last30days: "Letzte 30 Tage", 
      last90days: "Letzte 90 Tage",
      chatsByHour: "Chats nach Stunde",
      leadsByDay: "Leads nach Tag",
      noData: "Keine Daten verfügbar"
    },
    en: {
      title: "Analytics Dashboard",
      overview: "Overview",
      leads: "Leads",
      chats: "Chats",
      appointments: "Appointments", 
      performance: "Performance",
      totalChats: "Total Chats",
      totalLeads: "Total Leads",
      totalAppointments: "Total Appointments",
      conversionRate: "Conversion Rate",
      avgResponseTime: "Avg Response Time",
      popularQuestions: "Popular Questions",
      leadSources: "Lead Sources",
      timeRange: "Time Range",
      last7days: "Last 7 Days",
      last30days: "Last 30 Days",
      last90days: "Last 90 Days",
      chatsByHour: "Chats by Hour",
      leadsByDay: "Leads by Day",
      noData: "No data available"
    }
  }

  const t = translations[language] || translations.de

  useEffect(() => {
    loadAnalytics()
  }, [customerSlug, timeRange])

  const loadAnalytics = async () => {
    try {
      setLoading(true)
      
      const endDate = new Date()
      const startDate = new Date()
      
      switch (timeRange) {
        case '7d':
          startDate.setDate(endDate.getDate() - 7)
          break
        case '30d':
          startDate.setDate(endDate.getDate() - 30)
          break
        case '90d':
          startDate.setDate(endDate.getDate() - 90)
          break
      }

      // Fetch comprehensive analytics data
      const [
        chatStats,
        leadStats,
        appointmentStats,
        popularQuestions,
        hourlyDistribution,
        dailyLeads
      ] = await Promise.all([
        fetchChatStats(startDate, endDate),
        fetchLeadStats(startDate, endDate),
        fetchAppointmentStats(startDate, endDate),
        fetchPopularQuestions(startDate, endDate),
        fetchHourlyDistribution(startDate, endDate),
        fetchDailyLeads(startDate, endDate)
      ])

      setAnalytics({
        chats: chatStats,
        leads: leadStats,
        appointments: appointmentStats,
        popularQuestions,
        hourlyDistribution,
        dailyLeads,
        conversionRate: leadStats.total > 0 ? ((leadStats.total / chatStats.total) * 100).toFixed(1) : 0,
        avgResponseTime: chatStats.avgResponseTime || 0
      })

    } catch (error) {
      console.error('Error loading analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchChatStats = async (startDate, endDate) => {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('created_at, message_type')
      .eq('client_key', customerSlug)
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString())

    if (error) throw error

    const userMessages = data?.filter(m => m.message_type === 'user') || []
    const assistantMessages = data?.filter(m => m.message_type === 'assistant') || []

    return {
      total: userMessages.length,
      sessions: new Set(userMessages.map(m => m.client_key)).size,
      avgResponseTime: calculateAvgResponseTime(userMessages, assistantMessages)
    }
  }

  const fetchLeadStats = async (startDate, endDate) => {
    const { data, error } = await supabase
      .from('leads')
      .select('created_at, anliegen, source_url')
      .eq('kunde_id', customerSlug)
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString())

    if (error) throw error

    return {
      total: data?.length || 0,
      sources: aggregateLeadSources(data || []),
      byService: aggregateByService(data || [])
    }
  }

  const fetchAppointmentStats = async (startDate, endDate) => {
    const { data, error } = await supabase
      .from('appointments')
      .select('created_at, status, service_requested')
      .eq('customer_slug', customerSlug)
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString())

    if (error) throw error

    return {
      total: data?.length || 0,
      confirmed: data?.filter(a => a.status === 'confirmed').length || 0,
      byService: aggregateAppointmentsByService(data || [])
    }
  }

  const fetchPopularQuestions = async (startDate, endDate) => {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('message')
      .eq('client_key', customerSlug)
      .eq('message_type', 'user')
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString())

    if (error) throw error

    return analyzePopularQuestions(data?.map(m => m.message) || [])
  }

  const fetchHourlyDistribution = async (startDate, endDate) => {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('created_at')
      .eq('client_key', customerSlug)
      .eq('message_type', 'user')
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString())

    if (error) throw error

    return aggregateByHour(data || [])
  }

  const fetchDailyLeads = async (startDate, endDate) => {
    const { data, error } = await supabase
      .from('leads')
      .select('created_at')
      .eq('kunde_id', customerSlug)
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString())

    if (error) throw error

    return aggregateByDay(data || [])
  }

  // Helper functions
  const calculateAvgResponseTime = (userMessages, assistantMessages) => {
    // Simplified calculation - in production, implement proper response time tracking
    return Math.floor(Math.random() * 3000) + 1000 // Mock: 1-4 seconds
  }

  const aggregateLeadSources = (leads) => {
    const sources = {}
    leads.forEach(lead => {
      const domain = extractDomain(lead.source_url)
      sources[domain] = (sources[domain] || 0) + 1
    })
    return Object.entries(sources).map(([source, count]) => ({ source, count }))
  }

  const aggregateByService = (leads) => {
    const services = {}
    leads.forEach(lead => {
      const service = categorizeService(lead.anliegen)
      services[service] = (services[service] || 0) + 1
    })
    return Object.entries(services).map(([service, count]) => ({ service, count }))
  }

  const aggregateAppointmentsByService = (appointments) => {
    const services = {}
    appointments.forEach(apt => {
      const service = apt.service_requested || 'Unspecified'
      services[service] = (services[service] || 0) + 1
    })
    return Object.entries(services).map(([service, count]) => ({ service, count }))
  }

  const analyzePopularQuestions = (messages) => {
    const keywords = {}
    const commonWords = ['der', 'die', 'das', 'und', 'ist', 'ich', 'für', 'mit', 'auf', 'ein', 'eine']
    
    messages.forEach(message => {
      const words = message.toLowerCase().split(/\s+/).filter(word => 
        word.length > 3 && !commonWords.includes(word)
      )
      words.forEach(word => {
        keywords[word] = (keywords[word] || 0) + 1
      })
    })

    return Object.entries(keywords)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([keyword, count]) => ({ keyword, count }))
  }

  const aggregateByHour = (messages) => {
    const hours = Array(24).fill(0)
    messages.forEach(msg => {
      const hour = new Date(msg.created_at).getHours()
      hours[hour]++
    })
    return hours.map((count, hour) => ({ hour, count }))
  }

  const aggregateByDay = (leads) => {
    const days = {}
    leads.forEach(lead => {
      const day = new Date(lead.created_at).toDateString()
      days[day] = (days[day] || 0) + 1
    })
    return Object.entries(days).map(([day, count]) => ({ day, count }))
  }

  const extractDomain = (url) => {
    try {
      return new URL(url).hostname
    } catch {
      return 'Direct'
    }
  }

  const categorizeService = (anliegen) => {
    const service = anliegen?.toLowerCase() || ''
    if (service.includes('tüv') || service.includes('hauptuntersuchung')) return 'TÜV/HU'
    if (service.includes('reparatur') || service.includes('defekt')) return 'Reparatur'
    if (service.includes('wartung') || service.includes('service')) return 'Wartung'
    if (service.includes('bremse')) return 'Bremsen'
    if (service.includes('reifen')) return 'Reifen'
    return 'Sonstiges'
  }

  if (loading) {
    return (
      <div style={{ 
        padding: '40px',
        textAlign: 'center',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        <div style={{ color: '#666' }}>Loading analytics...</div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div style={{ 
        padding: '40px',
        textAlign: 'center',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        <div style={{ color: '#666' }}>{t.noData}</div>
      </div>
    )
  }

  return (
    <div style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <h1 style={{ color: '#1a202c', margin: 0 }}>{t.title}</h1>
        
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          style={{
            padding: '8px 12px',
            border: '1px solid #e2e8f0',
            borderRadius: '6px',
            fontSize: '14px'
          }}
        >
          <option value="7d">{t.last7days}</option>
          <option value="30d">{t.last30days}</option>
          <option value="90d">{t.last90days}</option>
        </select>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        borderBottom: '1px solid #e2e8f0',
        marginBottom: '30px'
      }}>
        {['overview', 'leads', 'chats', 'appointments'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '12px 20px',
              border: 'none',
              background: 'transparent',
              borderBottom: activeTab === tab ? '2px solid #0070f3' : '2px solid transparent',
              color: activeTab === tab ? '#0070f3' : '#666',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: activeTab === tab ? 'bold' : 'normal'
            }}
          >
            {t[tab]}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div>
          {/* KPI Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px',
            marginBottom: '30px'
          }}>
            <KPICard
              title={t.totalChats}
              value={analytics.chats.total}
              icon="💬"
              color="#0070f3"
            />
            <KPICard
              title={t.totalLeads}
              value={analytics.leads.total}
              icon="🎯"
              color="#16a34a"
            />
            <KPICard
              title={t.totalAppointments}
              value={analytics.appointments.total}
              icon="📅"
              color="#dc2626"
            />
            <KPICard
              title={t.conversionRate}
              value={`${analytics.conversionRate}%`}
              icon="📈"
              color="#7c3aed"
            />
          </div>

          {/* Charts */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
            gap: '20px'
          }}>
            <ChartCard
              title={t.chatsByHour}
              data={analytics.hourlyDistribution}
              type="bar"
            />
            <ChartCard
              title={t.popularQuestions}
              data={analytics.popularQuestions}
              type="list"
            />
          </div>
        </div>
      )}

      {/* Leads Tab */}
      {activeTab === 'leads' && (
        <div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
            gap: '20px'
          }}>
            <ChartCard
              title={t.leadSources}
              data={analytics.leads.sources}
              type="pie"
            />
            <ChartCard
              title="Leads by Service"
              data={analytics.leads.byService}
              type="bar"
            />
          </div>
        </div>
      )}

      {/* Other tabs can be implemented similarly */}
    </div>
  )
}

// KPI Card Component
function KPICard({ title, value, icon, color }) {
  return (
    <div style={{
      background: 'white',
      padding: '20px',
      borderRadius: '8px',
      border: '1px solid #e2e8f0',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '10px'
      }}>
        <span style={{ fontSize: '24px' }}>{icon}</span>
        <span style={{ 
          fontSize: '24px', 
          fontWeight: 'bold', 
          color: color 
        }}>
          {value}
        </span>
      </div>
      <div style={{ 
        fontSize: '14px', 
        color: '#666',
        fontWeight: 'medium'
      }}>
        {title}
      </div>
    </div>
  )
}

// Chart Card Component
function ChartCard({ title, data, type }) {
  return (
    <div style={{
      background: 'white',
      padding: '20px',
      borderRadius: '8px',
      border: '1px solid #e2e8f0',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    }}>
      <h3 style={{ 
        margin: '0 0 20px 0', 
        fontSize: '16px',
        color: '#1a202c'
      }}>
        {title}
      </h3>
      
      {type === 'list' && (
        <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
          {data?.map((item, index) => (
            <div 
              key={index}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '8px 0',
                borderBottom: '1px solid #f1f5f9'
              }}
            >
              <span style={{ fontSize: '14px' }}>{item.keyword || item.service || item.source}</span>
              <span style={{ 
                fontSize: '14px', 
                fontWeight: 'bold',
                color: '#0070f3'
              }}>
                {item.count}
              </span>
            </div>
          )) || <div style={{ color: '#666', fontSize: '14px' }}>No data</div>}
        </div>
      )}

      {type === 'bar' && (
        <div style={{ height: '200px', position: 'relative' }}>
          {/* Simple bar chart visualization */}
          <div style={{
            display: 'flex',
            alignItems: 'end',
            height: '100%',
            gap: '4px'
          }}>
            {data?.slice(0, 12).map((item, index) => {
              const maxValue = Math.max(...(data?.map(d => d.count) || [1]))
              const height = ((item.count || 0) / maxValue) * 100
              return (
                <div
                  key={index}
                  style={{
                    flex: 1,
                    background: '#0070f3',
                    height: `${height}%`,
                    minHeight: '2px',
                    borderRadius: '2px',
                    opacity: 0.7
                  }}
                  title={`${item.hour || item.service}: ${item.count}`}
                />
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}