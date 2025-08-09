/**
 * ChatWidget - Intelligent Chat Widget for CarBot Websites
 * Floating chat widget with automotive expertise for workshop websites
 */

import { useState, useEffect, useRef } from 'react'

export default function ChatWidget({
  config = {},
  clientKey = null,
  position = 'bottom-right',
  theme = 'auto'
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`)
  const [hasNewMessages, setHasNewMessages] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  // Default configuration
  const defaultConfig = {
    businessName: "Ihre Werkstatt",
    phone: "+49 30 123456789",
    email: "info@werkstatt.de",
    templateType: 'general',
    theme: {
      primary: '#007bff',
      secondary: '#6c757d',
      accent: '#28a745'
    },
    
    // Chat settings
    welcomeMessage: "👋 Hallo! Wie kann ich Ihnen helfen?",
    placeholder: "Schreiben Sie Ihre Nachricht...",
    offlineMessage: "Wir sind momentan nicht verfügbar. Hinterlassen Sie gerne eine Nachricht!",
    
    // Widget appearance
    showTypingIndicator: true,
    showTimestamps: false,
    maxMessages: 50,
    autoOpen: false,
    persistChat: true,
    
    ...config
  }

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Auto-focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  // Load persisted chat on mount
  useEffect(() => {
    if (defaultConfig.persistChat) {
      const saved = localStorage.getItem(`carbot_chat_${sessionId}`)
      if (saved) {
        try {
          const data = JSON.parse(saved)
          setMessages(data.messages || [])
          setIsOpen(data.isOpen || false)
        } catch (e) {
          console.warn('Failed to load saved chat:', e)
        }
      }
    }

    // Add welcome message if no messages
    if (messages.length === 0) {
      addMessage({
        type: 'bot',
        message: defaultConfig.welcomeMessage,
        timestamp: new Date().toISOString(),
        isWelcome: true
      })
    }
  }, [])

  // Persist chat state
  useEffect(() => {
    if (defaultConfig.persistChat && messages.length > 0) {
      localStorage.setItem(`carbot_chat_${sessionId}`, JSON.stringify({
        messages: messages.slice(-defaultConfig.maxMessages),
        isOpen,
        lastActivity: new Date().toISOString()
      }))
    }
  }, [messages, isOpen])

  // Get visitor information
  const getVisitorInfo = () => {
    return {
      userAgent: navigator.userAgent,
      language: navigator.language || 'de',
      screenSize: `${screen.width}x${screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      referrer: document.referrer,
      pageUrl: window.location.href
    }
  }

  // Add message to chat
  const addMessage = (message) => {
    setMessages(prev => {
      const newMessages = [...prev, {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        ...message
      }]
      return newMessages.slice(-defaultConfig.maxMessages)
    })
    
    // Show notification if widget is closed
    if (!isOpen && message.type === 'bot') {
      setHasNewMessages(true)
    }
  }

  // Send message to API
  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage = inputMessage.trim()
    setInputMessage('')
    setIsLoading(true)

    // Add user message immediately
    addMessage({
      type: 'user',
      message: userMessage,
      timestamp: new Date().toISOString()
    })

    try {
      // Show typing indicator
      if (defaultConfig.showTypingIndicator) {
        addMessage({
          type: 'typing',
          message: '...',
          timestamp: new Date().toISOString(),
          isTyping: true
        })
      }

      // Call API
      const response = await fetch('/api/widget/website-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          sessionId,
          clientKey,
          workshopConfig: defaultConfig,
          visitorInfo: getVisitorInfo(),
          pageInfo: {
            title: document.title,
            url: window.location.href,
            path: window.location.pathname
          }
        })
      })

      const data = await response.json()

      // Remove typing indicator
      if (defaultConfig.showTypingIndicator) {
        setMessages(prev => prev.filter(msg => !msg.isTyping))
      }

      if (data.success) {
        // Add bot response
        addMessage({
          type: 'bot',
          message: data.data.message,
          responseType: data.data.responseType,
          urgency: data.data.urgency,
          actions: data.data.actions,
          followUp: data.data.followUp,
          timestamp: new Date().toISOString()
        })
      } else {
        // Error response
        addMessage({
          type: 'bot',
          message: data.message || 'Entschuldigung, es gab einen Fehler. Bitte versuchen Sie es erneut.',
          timestamp: new Date().toISOString(),
          isError: true
        })
      }

    } catch (error) {
      console.error('Chat error:', error)
      
      // Remove typing indicator on error
      setMessages(prev => prev.filter(msg => !msg.isTyping))
      
      addMessage({
        type: 'bot',
        message: `Es tut mir leid, ich bin momentan nicht verfügbar. Bitte rufen Sie uns direkt an: ${defaultConfig.phone}`,
        timestamp: new Date().toISOString(),
        isError: true
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Handle keyboard shortcuts
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  // Handle action buttons
  const handleAction = (action) => {
    switch (action.type) {
      case 'call':
        window.location.href = `tel:${action.value}`
        break
      case 'email':
        window.location.href = `mailto:${action.value}`
        break
      case 'form':
        // Navigate to contact form
        if (window.navigateTo) {
          window.navigateTo('contact', { type: action.value.replace('_form', '') })
        }
        break
      case 'quick_reply':
        setInputMessage(action.value)
        setTimeout(() => sendMessage(), 100)
        break
      case 'location':
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords
              addMessage({
                type: 'user',
                message: `📍 Mein Standort: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
                timestamp: new Date().toISOString()
              })
            },
            (error) => {
              addMessage({
                type: 'user',
                message: '❌ Standort konnte nicht ermittelt werden',
                timestamp: new Date().toISOString()
              })
            }
          )
        }
        break
      default:
        console.log('Unhandled action:', action)
    }
  }

  // Widget position classes
  const positionClasses = {
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4'
  }

  // Format timestamp
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('de-DE', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className={`fixed ${positionClasses[position]} z-50`}>
      {/* Chat Window */}
      {isOpen && !isMinimized && (
        <div className="bg-white rounded-lg shadow-xl border border-gray-200 w-80 h-96 mb-4 flex flex-col overflow-hidden">
          {/* Header */}
          <div 
            className="px-4 py-3 text-white rounded-t-lg flex justify-between items-center"
            style={{ backgroundColor: defaultConfig.theme.primary }}
          >
            <div className="flex items-center">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center mr-3">
                <span className="text-lg">🤖</span>
              </div>
              <div>
                <div className="font-semibold text-sm">{defaultConfig.businessName}</div>
                <div className="text-xs opacity-90">CarBot Assistant</div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsMinimized(true)}
                className="text-white hover:text-gray-200 text-lg"
                title="Minimieren"
              >
                −
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-gray-200 text-lg"
                title="Schließen"
              >
                ×
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                    message.type === 'user'
                      ? 'bg-blue-600 text-white'
                      : message.isError
                      ? 'bg-red-50 text-red-800 border border-red-200'
                      : message.isTyping
                      ? 'bg-gray-200 text-gray-600'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {message.isTyping ? (
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  ) : (
                    <div>
                      <div className="whitespace-pre-wrap">{message.message}</div>
                      {defaultConfig.showTimestamps && (
                        <div className="text-xs opacity-70 mt-1">
                          {formatTime(message.timestamp)}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Action Buttons */}
            {messages.length > 0 && messages[messages.length - 1].actions && (
              <div className="flex flex-wrap gap-2 mt-3">
                {messages[messages.length - 1].actions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => handleAction(action)}
                    className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                      action.priority === 'high'
                        ? 'bg-red-600 text-white border-red-600 hover:bg-red-700'
                        : 'bg-white text-blue-600 border-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={defaultConfig.placeholder}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm"
                disabled={isLoading}
              />
              <button
                onClick={sendMessage}
                disabled={isLoading || !inputMessage.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
              >
                {isLoading ? '⏳' : '➤'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Minimized Chat */}
      {isOpen && isMinimized && (
        <div className="bg-white rounded-lg shadow-xl border border-gray-200 w-80 mb-4 overflow-hidden">
          <div 
            className="px-4 py-3 text-white rounded-t-lg flex justify-between items-center cursor-pointer"
            style={{ backgroundColor: defaultConfig.theme.primary }}
            onClick={() => setIsMinimized(false)}
          >
            <div className="flex items-center">
              <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center mr-2">
                <span className="text-sm">🤖</span>
              </div>
              <span className="font-semibold text-sm">{defaultConfig.businessName}</span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setIsOpen(false)
              }}
              className="text-white hover:text-gray-200 text-lg"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => {
            setIsOpen(true)
            setIsMinimized(false)
            setHasNewMessages(false)
          }}
          className="w-14 h-14 rounded-full text-white shadow-lg hover:scale-105 transition-transform relative"
          style={{ backgroundColor: defaultConfig.theme.primary }}
          title="Chat öffnen"
        >
          <span className="text-2xl">💬</span>
          
          {/* Notification Badge */}
          {hasNewMessages && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-xs text-white">!</span>
            </div>
          )}
        </button>
      )}
    </div>
  )
}