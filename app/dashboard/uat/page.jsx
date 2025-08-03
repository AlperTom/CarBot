'use client'

import { useState, useEffect } from 'react'

export default function UATDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)

  // Only show in UAT environment
  if (process.env.NODE_ENV !== 'uat' && !process.env.UAT_MODE) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-lg font-medium text-red-800">Nicht verfügbar</h3>
          <p className="text-red-600">UAT Dashboard ist nur in der Testumgebung verfügbar.</p>
        </div>
      </div>
    )
  }

  useEffect(() => {
    loadUATStats()
  }, [])

  async function loadUATStats() {
    try {
      const response = await fetch('/api/uat/generate-test-data')
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error('Error loading UAT stats:', error)
    } finally {
      setLoading(false)
    }
  }

  async function generateTestData(type, count = 10) {
    setGenerating(true)
    try {
      const response = await fetch('/api/uat/generate-test-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, count })
      })
      
      const result = await response.json()
      
      if (result.success) {
        alert(`✅ ${result.message}`)
        await loadUATStats()
      } else {
        alert(`❌ Fehler: ${result.error}`)
      }
    } catch (error) {
      console.error('Error generating test data:', error)
      alert('❌ Fehler beim Generieren der Testdaten')
    } finally {
      setGenerating(false)
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-3 gap-4">
            {[1,2,3].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl">
      {/* UAT Header */}
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mb-8">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">🧪</span>
          <div>
            <h1 className="text-2xl font-bold text-orange-900">UAT Test Dashboard</h1>
            <p className="text-orange-700">User Acceptance Testing Environment - Sichere Testumgebung</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
          <div className="bg-white p-3 rounded border">
            <div className="font-medium text-gray-900">Environment</div>
            <div className="text-orange-600">UAT Testing</div>
          </div>
          <div className="bg-white p-3 rounded border">
            <div className="font-medium text-gray-900">URL</div>
            <div className="text-blue-600 text-xs">carbot-uat.vercel.app</div>
          </div>
          <div className="bg-white p-3 rounded border">
            <div className="font-medium text-gray-900">Database</div>
            <div className="text-green-600">UAT Supabase</div>
          </div>
          <div className="bg-white p-3 rounded border">
            <div className="font-medium text-gray-900">Payments</div>
            <div className="text-purple-600">Stripe Test Mode</div>
          </div>
        </div>
      </div>

      {/* UAT Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Test Workshops</p>
              <p className="text-3xl font-bold text-blue-600">{stats?.data?.workshops || 0}</p>
            </div>
            <div className="text-4xl">🏪</div>
          </div>
          <p className="text-xs text-gray-500 mt-2">UAT Demo Werkstätten</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Test Clients</p>
              <p className="text-3xl font-bold text-green-600">{stats?.data?.clients || 0}</p>
            </div>
            <div className="text-4xl">👥</div>
          </div>
          <p className="text-xs text-gray-500 mt-2">Registrierte Test-Kunden</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Conversations (7d)</p>
              <p className="text-3xl font-bold text-purple-600">{stats?.data?.conversations_last_7_days || 0}</p>
            </div>
            <div className="text-4xl">💬</div>
          </div>
          <p className="text-xs text-gray-500 mt-2">Letzte 7 Tage</p>
        </div>
      </div>

      {/* Test Data Generators */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
        <h2 className="text-xl font-semibold mb-6">Test Data Generators</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="border rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">💬</span>
              <div>
                <h3 className="font-medium">Conversations</h3>
                <p className="text-sm text-gray-600">Chat-Gespräche</p>
              </div>
            </div>
            <button
              onClick={() => generateTestData('conversations', 20)}
              disabled={generating}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-gray-400 text-sm"
            >
              {generating ? 'Generating...' : '20 Gespräche'}
            </button>
          </div>

          <div className="border rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">👥</span>
              <div>
                <h3 className="font-medium">Clients</h3>
                <p className="text-sm text-gray-600">Workshop-Kunden</p>
              </div>
            </div>
            <button
              onClick={() => generateTestData('clients', 10)}
              disabled={generating}
              className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 disabled:bg-gray-400 text-sm"
            >
              {generating ? 'Generating...' : '10 Clients'}
            </button>
          </div>

          <div className="border rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">📊</span>
              <div>
                <h3 className="font-medium">Analytics</h3>
                <p className="text-sm text-gray-600">Analytics Events</p>
              </div>
            </div>
            <button
              onClick={() => generateTestData('analytics', 50)}
              disabled={generating}
              className="w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 disabled:bg-gray-400 text-sm"
            >
              {generating ? 'Generating...' : '50 Events'}
            </button>
          </div>

          <div className="border rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">📅</span>
              <div>
                <h3 className="font-medium">Appointments</h3>
                <p className="text-sm text-gray-600">Termine</p>
              </div>
            </div>
            <button
              onClick={() => generateTestData('appointments', 15)}
              disabled={generating}
              className="w-full bg-orange-600 text-white py-2 px-4 rounded hover:bg-orange-700 disabled:bg-gray-400 text-sm"
            >
              {generating ? 'Generating...' : '15 Termine'}
            </button>
          </div>
        </div>
      </div>

      {/* Test Accounts */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
        <h2 className="text-xl font-semibold mb-6">UAT Test Accounts</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="border rounded-lg p-4">
            <h3 className="font-medium text-green-700 mb-2">✅ Premium Workshop</h3>
            <div className="space-y-1 text-sm">
              <div><strong>Email:</strong> thomas.wagner@uat-demo.de</div>
              <div><strong>Password:</strong> DemoPass123!</div>
              <div><strong>Plan:</strong> Enterprise</div>
              <div><strong>Status:</strong> Active</div>
            </div>
            <button
              onClick={() => navigator.clipboard.writeText('thomas.wagner@uat-demo.de')}
              className="mt-2 text-xs text-blue-600 hover:text-blue-800"
            >
              📋 E-Mail kopieren
            </button>
          </div>

          <div className="border rounded-lg p-4">
            <h3 className="font-medium text-blue-700 mb-2">🔧 Standard Workshop</h3>
            <div className="space-y-1 text-sm">
              <div><strong>Email:</strong> hans.mueller@uat-demo.de</div>
              <div><strong>Password:</strong> DemoPass123!</div>
              <div><strong>Plan:</strong> Professional</div>
              <div><strong>Status:</strong> Active</div>
            </div>
            <button
              onClick={() => navigator.clipboard.writeText('hans.mueller@uat-demo.de')}
              className="mt-2 text-xs text-blue-600 hover:text-blue-800"
            >
              📋 E-Mail kopieren
            </button>
          </div>

          <div className="border rounded-lg p-4">
            <h3 className="font-medium text-orange-700 mb-2">⏳ Trial Workshop</h3>
            <div className="space-y-1 text-sm">
              <div><strong>Email:</strong> maria.schmidt@uat-demo.de</div>
              <div><strong>Password:</strong> DemoPass123!</div>
              <div><strong>Plan:</strong> Starter</div>
              <div><strong>Status:</strong> Trial</div>
            </div>
            <button
              onClick={() => navigator.clipboard.writeText('maria.schmidt@uat-demo.de')}
              className="mt-2 text-xs text-blue-600 hover:text-blue-800"
            >
              📋 E-Mail kopieren
            </button>
          </div>
        </div>
      </div>

      {/* Test Procedures */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold mb-6">UAT Test Procedures</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium mb-3">🧪 Quick Tests</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <span className="w-4 h-4 bg-blue-100 rounded-full flex items-center justify-center text-xs">1</span>
                <span>Login mit Demo-Account testen</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-4 h-4 bg-blue-100 rounded-full flex items-center justify-center text-xs">2</span>
                <span>Client-Key generieren und testen</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-4 h-4 bg-blue-100 rounded-full flex items-center justify-center text-xs">3</span>
                <span>Landing Page erstellen</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-4 h-4 bg-blue-100 rounded-full flex items-center justify-center text-xs">4</span>
                <span>Chat Widget auf Test-Seite</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-4 h-4 bg-blue-100 rounded-full flex items-center justify-center text-xs">5</span>
                <span>Stripe Test-Zahlung</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium mb-3">📋 Full Test Suite</h3>
            <div className="space-y-2">
              <a 
                href="/UAT-TESTING-GUIDE.md" 
                target="_blank"
                className="block p-3 border rounded hover:bg-gray-50 text-sm"
              >
                <div className="font-medium">📖 Complete UAT Guide</div>
                <div className="text-gray-600">Vollständige Testprozeduren</div>
              </a>
              
              <div className="p-3 border rounded text-sm">
                <div className="font-medium">🎯 Test Coverage</div>
                <div className="text-gray-600">17 Core Features, 50+ Test Cases</div>
              </div>
              
              <div className="p-3 border rounded text-sm">
                <div className="font-medium">⏱️ Estimated Time</div>
                <div className="text-gray-600">2-4 hours für vollständige Tests</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Last Updated */}
      <div className="text-center text-sm text-gray-500 mt-8">
        Last updated: {stats?.data?.last_updated ? new Date(stats.data.last_updated).toLocaleString('de-DE') : 'Never'}
        <button 
          onClick={loadUATStats}
          className="ml-4 text-blue-600 hover:text-blue-800"
        >
          🔄 Refresh
        </button>
      </div>
    </div>
  )
}