'use client'

import { useState, useEffect } from 'react'

export default function EmailStatusDashboard() {
  const [emailConfig, setEmailConfig] = useState(null)
  const [testResults, setTestResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('config')

  useEffect(() => {
    checkEmailConfiguration()
  }, [])

  const checkEmailConfiguration = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/test/email?type=config-test')
      const result = await response.json()
      setEmailConfig(result)
    } catch (error) {
      console.error('Failed to check email configuration:', error)
    } finally {
      setLoading(false)
    }
  }

  const runEmailTest = async (type, data = {}) => {
    try {
      setLoading(true)
      const response = await fetch('/api/test/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type,
          ...data
        })
      })
      const result = await response.json()
      setTestResults({ type, result })
      return result
    } catch (error) {
      console.error('Email test failed:', error)
      setTestResults({ type, result: { success: false, error: error.message } })
    } finally {
      setLoading(false)
    }
  }

  const ConfigStatus = ({ label, value, status }) => (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <span className="font-medium text-gray-700">{label}:</span>
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-600">{value}</span>
        <div className={`w-3 h-3 rounded-full ${
          status === 'good' ? 'bg-green-500' : 
          status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
        }`} />
      </div>
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
          <h1 className="text-2xl font-bold text-white flex items-center">
            📧 Email System Status
          </h1>
          <p className="text-blue-100 mt-1">
            Überwachen und testen Sie das CarBot Email-System
          </p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'config', label: 'Konfiguration', icon: '⚙️' },
              { id: 'test', label: 'Tests', icon: '🧪' },
              { id: 'templates', label: 'Templates', icon: '📝' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Configuration Tab */}
          {activeTab === 'config' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  Email-Konfiguration
                </h2>
                <button
                  onClick={checkEmailConfiguration}
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {loading ? '🔄 Prüfung läuft...' : '🔄 Neu prüfen'}
                </button>
              </div>

              {emailConfig && (
                <div className="space-y-4">
                  <div className={`p-4 rounded-lg border-l-4 ${
                    emailConfig.success 
                      ? 'bg-green-50 border-green-500' 
                      : 'bg-red-50 border-red-500'
                  }`}>
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">
                        {emailConfig.success ? '✅' : '❌'}
                      </span>
                      <div>
                        <h3 className="font-semibold">
                          {emailConfig.success ? 'Email-System funktionsfähig' : 'Email-System Problem'}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {emailConfig.message}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ConfigStatus
                      label="API-Schlüssel"
                      value={emailConfig.config?.hasApiKey ? 'Konfiguriert' : 'Fehlend'}
                      status={emailConfig.config?.hasApiKey ? 'good' : 'error'}
                    />
                    <ConfigStatus
                      label="Absender-Email"
                      value={emailConfig.config?.emailFrom || 'Nicht gesetzt'}
                      status={emailConfig.config?.emailFrom ? 'good' : 'warning'}
                    />
                    <ConfigStatus
                      label="Absender-Name"
                      value={emailConfig.config?.emailFromName || 'Nicht gesetzt'}
                      status={emailConfig.config?.emailFromName ? 'good' : 'warning'}
                    />
                    <ConfigStatus
                      label="Werkstatt-Email"
                      value={emailConfig.config?.workshopEmail || 'Nicht gesetzt'}
                      status={emailConfig.config?.workshopEmail ? 'good' : 'warning'}
                    />
                  </div>

                  {!emailConfig.config?.hasApiKey && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <h4 className="font-semibold text-yellow-800 mb-2">
                        🔧 Konfiguration erforderlich
                      </h4>
                      <p className="text-sm text-yellow-700 mb-3">
                        Um das Email-System zu aktivieren, fügen Sie folgende Umgebungsvariablen zu Ihrer .env.local Datei hinzu:
                      </p>
                      <div className="bg-gray-900 text-green-400 p-3 rounded text-sm font-mono">
                        RESEND_API_KEY=re_xxxxxxxxx<br/>
                        EMAIL_FROM=noreply@ihre-domain.de<br/>
                        EMAIL_FROM_NAME=Ihr Werkstatt Name<br/>
                        WORKSHOP_EMAIL=ihre-email@domain.de
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Test Tab */}
          {activeTab === 'test' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Email-Tests
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  {
                    type: 'config-test',
                    title: 'Konfiguration testen',
                    description: 'Prüft die Email-Konfiguration',
                    icon: '⚙️',
                    color: 'blue'
                  },
                  {
                    type: 'welcome',
                    title: 'Willkommen-Email',
                    description: 'Test der Registrierungs-Email',
                    icon: '👋',
                    color: 'green'
                  },
                  {
                    type: 'password-reset',
                    title: 'Passwort zurücksetzen',
                    description: 'Test der Reset-Email',
                    icon: '🔐',
                    color: 'yellow'
                  },
                  {
                    type: 'lead-notification',
                    title: 'Lead-Benachrichtigung',
                    description: 'Test der Kunden-Anfrage Email',
                    icon: '🚗',
                    color: 'purple'
                  }
                ].map((test) => (
                  <div key={test.type} className="border border-gray-200 rounded-lg p-4">
                    <div className="text-center mb-4">
                      <div className="text-3xl mb-2">{test.icon}</div>
                      <h3 className="font-semibold text-gray-900">{test.title}</h3>
                      <p  className="text-sm text-gray-600 mt-1">{test.description}</p>
                    </div>
                    <button
                      onClick={() => runEmailTest(test.type)}
                      disabled={loading}
                      className={`w-full px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 ${
                        test.color === 'blue' ? 'bg-blue-600 hover:bg-blue-700 text-white' :
                        test.color === 'green' ? 'bg-green-600 hover:bg-green-700 text-white' :
                        test.color === 'yellow' ? 'bg-yellow-600 hover:bg-yellow-700 text-white' :
                        test.color === 'purple' ? 'bg-purple-600 hover:bg-purple-700 text-white' :
                        'bg-gray-600 hover:bg-gray-700 text-white'
                      }`}
                    >
                      {loading ? 'Läuft...' : 'Testen'}
                    </button>
                  </div>
                ))}
              </div>

              {testResults && (
                <div className="mt-6">
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Test-Ergebnis: {testResults.type}
                  </h3>
                  <div className={`p-4 rounded-lg border-l-4 ${
                    testResults.result.success 
                      ? 'bg-green-50 border-green-500' 
                      : 'bg-red-50 border-red-500'
                  }`}>
                    <div className="flex items-start">
                      <span className="text-xl mr-3">
                        {testResults.result.success ? '✅' : '❌'}
                      </span>
                      <div className="flex-1">
                        <h4 className="font-semibold">
                          {testResults.result.success ? 'Test erfolgreich' : 'Test fehlgeschlagen'}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {testResults.result.message}
                        </p>
                        {testResults.result.error && (
                          <p className="text-sm text-red-600 mt-2 font-mono">
                            Fehler: {testResults.result.error}
                          </p>
                        )}
                        {testResults.result.id && (
                          <p className="text-sm text-gray-500 mt-2">
                            Email-ID: {testResults.result.id}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Templates Tab */}
          {activeTab === 'templates' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Email Templates
              </h2>

              <div className="space-y-4">
                {[
                  {
                    name: 'Willkommen-Email',
                    description: 'Wird nach der Registrierung gesendet',
                    status: 'Aktiv',
                    language: 'DE',
                    icon: '👋'
                  },
                  {
                    name: 'Email-Bestätigung',
                    description: 'Für die Account-Aktivierung',
                    status: 'Aktiv',
                    language: 'DE',
                    icon: '✉️'
                  },
                  {
                    name: 'Passwort zurücksetzen',
                    description: 'Für Password-Reset-Anfragen',
                    status: 'Aktiv',
                    language: 'DE',
                    icon: '🔐'
                  },
                  {
                    name: 'Lead-Benachrichtigung',
                    description: 'Informiert über neue Kundenanfragen',
                    status: 'Aktiv',
                    language: 'DE',
                    icon: '🚗'
                  }
                ].map((template, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="text-2xl">{template.icon}</div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{template.name}</h3>
                        <p className="text-sm text-gray-600">{template.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                        {template.language}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        template.status === 'Aktiv' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {template.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">
                  📋 Template-Features
                </h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>✅ Deutsche Sprache und professionelles Design</li>
                  <li>✅ Mobile-responsive HTML-Templates</li>
                  <li>✅ CarBot-Branding und Corporate Design</li>
                  <li>✅ GDPR-konforme Datenschutzhinweise</li>
                  <li>✅ Personalisierte Inhalte und Werkstatt-Daten</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}