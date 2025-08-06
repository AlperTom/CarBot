'use client'
import { useState, useEffect } from 'react'

export default function DashboardStats({ customerSlug }) {
  const [stats, setStats] = useState({
    leads: 0,
    conversion: 0,
    chats: 0,
    appointments: 0,
    revenue: 0,
    response_time: 0,
    satisfaction: 0,
    converted_leads: 0
  })
  const [timeRange, setTimeRange] = useState('7d')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (customerSlug) {
      loadStats()
    }
  }, [customerSlug, timeRange])

  const loadStats = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/analytics?customer=${customerSlug}&range=${timeRange}&metric=overview`)
      const data = await response.json()
      
      if (data.success) {
        setStats({
          leads: data.summary?.totalLeads || 0,
          conversion: parseFloat(data.summary?.conversionRate || 0),
          chats: data.summary?.totalChats || 0,
          appointments: data.summary?.totalAppointments || 0,
          revenue: Math.round((data.summary?.totalLeads || 0) * 150), // Estimated revenue
          response_time: data.summary?.avgResponseTime || 2.3,
          satisfaction: 4.8, // Mock satisfaction score
          converted_leads: Math.round((data.summary?.totalLeads || 0) * 0.3)
        })
      }
    } catch (error) {
      console.error('Error loading stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const statItems = [
    {
      title: 'Neue Leads',
      value: stats.leads,
      icon: '🎯',
      color: '#0070f3',
      suffix: '',
      change: '+12%',
      urgent: stats.leads > 80 && stats.leads < 100 // Near limit warning
    },
    {
      title: 'Conversion Rate',
      value: stats.conversion,
      icon: '📈',
      color: '#16a34a',
      suffix: '%',
      change: '+3.2%'
    },
    {
      title: 'Aktive Chats',
      value: stats.chats,
      icon: '💬',
      color: '#7c3aed',
      suffix: '',
      change: '+8%'
    },
    {
      title: 'Termine',
      value: stats.appointments,
      icon: '📅',
      color: '#dc2626',
      suffix: '',
      change: '+15%'
    },
    {
      title: 'Geschätzter Umsatz',
      value: stats.revenue,
      icon: '💰',
      color: '#ea580c',
      suffix: '€',
      change: '+22%'
    },
    {
      title: 'Ø Antwortzeit',
      value: stats.response_time,
      icon: '⚡',
      color: '#0891b2',
      suffix: 's',
      change: '-0.3s'
    },
    {
      title: 'Zufriedenheit',
      value: stats.satisfaction,
      icon: '⭐',
      color: '#eab308',
      suffix: '/5',
      change: '+0.1'
    },
    {
      title: 'Konvertierte Leads',
      value: stats.converted_leads,
      icon: '✅',
      color: '#059669',
      suffix: '',
      change: '+5'
    }
  ]

  if (loading) {
    return (
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        {Array(8).fill(0).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    )
  }

  return (
    <div>
      {/* Time Range Selector */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h2 style={{ 
          margin: 0, 
          fontSize: '24px', 
          fontWeight: 'bold', 
          color: '#1a202c' 
        }}>
          📊 Performance Übersicht
        </h2>
        
        <div style={{
          display: 'flex',
          background: 'white',
          borderRadius: '8px',
          border: '1px solid #e2e8f0',
          padding: '4px'
        }}>
          {[
            { key: '7d', label: '7 Tage' },
            { key: '30d', label: '30 Tage' },
            { key: '90d', label: '90 Tage' },
            { key: '365d', label: '1 Jahr' }
          ].map(range => (
            <button
              key={range.key}
              onClick={() => setTimeRange(range.key)}
              style={{
                padding: '8px 16px',
                border: 'none',
                borderRadius: '6px',
                background: timeRange === range.key ? '#0070f3' : 'transparent',
                color: timeRange === range.key ? 'white' : '#6b7280',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        {statItems.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
            suffix={stat.suffix}
            change={stat.change}
            urgent={stat.urgent}
          />
        ))}
      </div>

      {/* Quick Actions */}
      <div style={{
        display: 'flex',
        gap: '15px',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginTop: '20px'
      }}>
        <QuickAction
          href="/analytics"
          icon="📈"
          text="Detaillierte Analytics"
          color="#0070f3"
        />
        <QuickAction
          href="/dashboard/leads"
          icon="🎯"
          text="Lead Management"
          color="#16a34a"
        />
        <QuickAction
          href="/dashboard/appointments"
          icon="📅"
          text="Termine verwalten"
          color="#dc2626"
        />
        <QuickAction
          href="/dashboard/settings"
          icon="⚙️"
          text="Bot optimieren"
          color="#7c3aed"
        />
      </div>
    </div>
  )
}

function StatCard({ title, value, icon, color, suffix, change, urgent = false }) {
  const isPositive = change && (change.includes('+') || change.includes('-') && title.includes('Antwortzeit'))
  
  return (
    <div style={{
      background: 'white',
      padding: '20px',
      borderRadius: '12px',
      border: urgent ? '2px solid #f59e0b' : '1px solid #e2e8f0',
      boxShadow: urgent ? '0 4px 12px rgba(245, 158, 11, 0.15)' : '0 1px 3px rgba(0,0,0,0.1)',
      transition: 'transform 0.2s, box-shadow 0.2s',
      position: 'relative'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '15px'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '10px',
          background: `${color}20`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px'
        }}>
          {icon}
        </div>
        
        {change && (
          <div style={{
            padding: '4px 8px',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: 'bold',
            background: isPositive ? '#dcfce7' : '#fef2f2',
            color: isPositive ? '#166534' : '#dc2626'
          }}>
            {change}
          </div>
        )}
      </div>
      
      <div style={{
        fontSize: '28px',
        fontWeight: 'bold',
        color: color,
        marginBottom: '5px'
      }}>
        {typeof value === 'number' && value >= 1000 
          ? `${(value / 1000).toFixed(1)}k` 
          : value}{suffix}
      </div>
      
      <div style={{
        fontSize: '14px',
        color: '#6b7280',
        fontWeight: '500'
      }}>
        {title}
      </div>
    </div>
  )
}

function SkeletonCard() {
  return (
    <div style={{
      background: 'white',
      padding: '20px',
      borderRadius: '12px',
      border: '1px solid #e2e8f0',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '15px'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '10px',
          background: '#f1f5f9',
          animation: 'pulse 2s infinite'
        }} />
        <div style={{
          width: '40px',
          height: '20px',
          borderRadius: '12px',
          background: '#f1f5f9',
          animation: 'pulse 2s infinite'
        }} />
      </div>
      
      <div style={{
        height: '32px',
        width: '80px',
        background: '#f1f5f9',
        borderRadius: '4px',
        marginBottom: '8px',
        animation: 'pulse 2s infinite'
      }} />
      
      <div style={{
        height: '16px',
        width: '120px',
        background: '#f1f5f9',
        borderRadius: '4px',
        animation: 'pulse 2s infinite'
      }} />
    </div>
  )
}

function QuickAction({ href, icon, text, color }) {
  return (
    <a
      href={href}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '10px 16px',
        background: 'white',
        border: `2px solid ${color}20`,
        borderRadius: '8px',
        textDecoration: 'none',
        color: color,
        fontSize: '14px',
        fontWeight: '500',
        transition: 'all 0.2s'
      }}
      onMouseEnter={(e) => {
        e.target.style.background = `${color}10`
        e.target.style.transform = 'translateY(-1px)'
      }}
      onMouseLeave={(e) => {
        e.target.style.background = 'white'
        e.target.style.transform = 'translateY(0)'
      }}
    >
      <span>{icon}</span>
      <span>{text}</span>
    </a>
  )
}