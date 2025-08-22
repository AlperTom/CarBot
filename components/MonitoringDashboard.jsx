'use client'

/**
 * Production Monitoring Dashboard Component
 * Real-time system health and performance metrics
 */

import { useState, useEffect } from 'react'
import { ChartBarIcon, ExclamationTriangleIcon, CheckCircleIcon, XCircleIcon, ClockIcon, ServerIcon, CpuChipIcon, CircleStackIcon as DatabaseIcon } from '@heroicons/react/24/outline'

export default function MonitoringDashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdate, setLastUpdate] = useState(null)
  const [autoRefresh, setAutoRefresh] = useState(true)

  // Fetch monitoring data
  const fetchData = async () => {
    try {
      setError(null)
      const response = await fetch('/api/monitoring/dashboard?section=overview')
      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.error)
      }
      
      setData(result.data)
      setLastUpdate(new Date())
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Auto-refresh effect
  useEffect(() => {
    fetchData()
    
    let interval
    if (autoRefresh) {
      interval = setInterval(fetchData, 30000) // Refresh every 30 seconds
    }
    
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [autoRefresh])

  // Status indicator component
  const StatusIndicator = ({ status, label }) => {
    const getStatusColor = (status) => {
      switch (status) {
        case 'healthy': return 'text-green-600'
        case 'degraded': return 'text-yellow-600'
        case 'error': return 'text-red-600'
        case 'mock_mode': return 'text-blue-600'
        default: return 'text-gray-600'
      }
    }

    const getStatusIcon = (status) => {
      switch (status) {
        case 'healthy': return <CheckCircleIcon className="w-5 h-5" />
        case 'degraded': return <ExclamationTriangleIcon className="w-5 h-5" />
        case 'error': return <XCircleIcon className="w-5 h-5" />
        default: return <ClockIcon className="w-5 h-5" />
      }
    }

    return (
      <div className={`flex items-center space-x-2 ${getStatusColor(status)}`}>
        {getStatusIcon(status)}
        <span className="font-medium capitalize">{status.replace('_', ' ')}</span>
        {label && <span className="text-gray-600">({label})</span>}
      </div>
    )
  }

  // Metric card component
  const MetricCard = ({ title, icon, children, status = 'healthy' }) => {
    const borderColor = status === 'healthy' ? 'border-green-200' : status === 'degraded' ? 'border-yellow-200' : 'border-red-200'
    
    return (
      <div className={`bg-white border-2 ${borderColor} rounded-lg p-6 shadow-sm`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {icon}
        </div>
        {children}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <div className="flex items-center mb-4">
            <XCircleIcon className="w-8 h-8 text-red-600 mr-3" />
            <h1 className="text-xl font-bold text-gray-900">Monitoring Error</h1>
          </div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={fetchData}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  const { health, business, performance } = data

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Production Monitoring</h1>
            <p className="text-gray-600">CarBot System Health & Performance</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="autoRefresh"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="autoRefresh" className="text-sm text-gray-600">
                Auto-refresh (30s)
              </label>
            </div>
            {lastUpdate && (
              <p className="text-sm text-gray-500">
                Last updated: {lastUpdate.toLocaleTimeString()}
              </p>
            )}
            <button
              onClick={fetchData}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* System Overview */}
      <div className="mb-8">
        <div className="bg-white border rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">System Status</h2>
            <StatusIndicator status={health.status} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">Environment</p>
              <p className="font-medium">{health.environment}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Uptime</p>
              <p className="font-medium">{Math.floor(health.uptime / 3600)}h {Math.floor((health.uptime % 3600) / 60)}m</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Version</p>
              <p className="font-medium">{health.version}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
        
        {/* Database Health */}
        <MetricCard 
          title="Database" 
          icon={<DatabaseIcon className="w-6 h-6 text-blue-600" />}
          status={health.database}
        >
          <StatusIndicator status={health.database} />
          {health.databaseError && (
            <p className="text-sm text-red-600 mt-2">{health.databaseError}</p>
          )}
        </MetricCard>

        {/* Services Status */}
        <MetricCard 
          title="External Services" 
          icon={<ServerIcon className="w-6 h-6 text-green-600" />}
        >
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm">Resend Email</span>
              <span className={`text-sm font-medium ${health.services.resend === 'configured' ? 'text-green-600' : 'text-yellow-600'}`}>
                {health.services.resend}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Stripe Payments</span>
              <span className={`text-sm font-medium ${health.services.stripe === 'configured' ? 'text-green-600' : 'text-yellow-600'}`}>
                {health.services.stripe}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">OpenAI API</span>
              <span className={`text-sm font-medium ${health.services.openai === 'configured' ? 'text-green-600' : 'text-yellow-600'}`}>
                {health.services.openai}
              </span>
            </div>
          </div>
        </MetricCard>

        {/* Memory Usage */}
        <MetricCard 
          title="Memory & Performance" 
          icon={<CpuChipIcon className="w-6 h-6 text-purple-600" />}
        >
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm">Used Memory</span>
              <span className="text-sm font-medium">{performance.memory.used}MB</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Total Memory</span>
              <span className="text-sm font-medium">{performance.memory.total}MB</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">External</span>
              <span className="text-sm font-medium">{performance.memory.external}MB</span>
            </div>
          </div>
        </MetricCard>
      </div>

      {/* Business Metrics */}
      {business && !business.mock && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <MetricCard 
            title="Workshops" 
            icon={<ChartBarIcon className="w-6 h-6 text-blue-600" />}
          >
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Total</span>
                <span className="text-lg font-bold">{business.workshops.total}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Active</span>
                <span className="font-medium">{business.workshops.active}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Last 24h</span>
                <span className="font-medium text-green-600">+{business.workshops.last24h}</span>
              </div>
            </div>
          </MetricCard>

          <MetricCard 
            title="Leads" 
            icon={<ChartBarIcon className="w-6 h-6 text-orange-600" />}
          >
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Total</span>
                <span className="text-lg font-bold">{business.leads.total}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Last 24h</span>
                <span className="font-medium text-green-600">+{business.leads.last24h}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Last 7 days</span>
                <span className="font-medium">+{business.leads.last7d}</span>
              </div>
            </div>
          </MetricCard>
        </div>
      )}

      {/* Error Summary */}
      {performance.errors && (
        <div className="mb-8">
          <MetricCard 
            title="Error Summary" 
            icon={<ExclamationTriangleIcon className="w-6 h-6 text-red-600" />}
            status={performance.errors.error ? 'error' : 'healthy'}
          >
            {performance.errors.error ? (
              <p className="text-red-600">{performance.errors.error}</p>
            ) : (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Total Errors (24h)</span>
                  <span className="font-medium">{performance.errors.total || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Critical Errors</span>
                  <span className="font-medium text-red-600">{performance.errors.critical || 0}</span>
                </div>
              </div>
            )}
          </MetricCard>
        </div>
      )}

      {/* Rate Limiting Status */}
      {performance.rateLimits && (
        <div className="mb-8">
          <MetricCard 
            title="Rate Limiting Status" 
            icon={<ClockIcon className="w-6 h-6 text-yellow-600" />}
          >
            {performance.rateLimits.error ? (
              <p className="text-yellow-600">{performance.rateLimits.error}</p>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Rate limiting is active and protecting the API endpoints</p>
                <div className="text-xs text-gray-500">
                  Auth: 5 req/15min • API: 100 req/15min • Register: 3 req/1h
                </div>
              </div>
            )}
          </MetricCard>
        </div>
      )}
    </div>
  )
}