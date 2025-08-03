'use client'
import { useState, useEffect } from 'react'
import ChatWidget from '../../components/ChatWidget'

export default function WidgetChatPage() {
  const [clientKey, setClientKey] = useState(null)
  const [config, setConfig] = useState({})
  const [parentUrl, setParentUrl] = useState('')

  useEffect(() => {
    // Get client key from URL params
    const urlParams = new URLSearchParams(window.location.search)
    const client = urlParams.get('client')
    setClientKey(client)

    // Setup message handling with parent window
    const handleMessage = (event) => {
      const { type, data } = event.data
      
      switch (type) {
        case 'widget-config':
          setClientKey(data.clientKey)
          setConfig(data.config)
          setParentUrl(data.parentUrl)
          break
      }
    }

    window.addEventListener('message', handleMessage)

    // Notify parent that widget is ready
    if (window.parent !== window) {
      window.parent.postMessage({ type: 'widget-ready' }, '*')
    }

    return () => {
      window.removeEventListener('message', handleMessage)
    }
  }, [])

  const sendMessageToParent = (type, data) => {
    if (window.parent !== window) {
      window.parent.postMessage({ type, data }, '*')
    }
  }

  if (!clientKey) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        color: '#666'
      }}>
        <div>Loading CarBot...</div>
      </div>
    )
  }

  return (
    <div style={{
      width: '100%',
      height: '100vh',
      overflow: 'hidden',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <ChatWidget 
        clientKey={clientKey}
        isEmbedded={true}
        onLeadCaptured={(leadData) => {
          sendMessageToParent('lead-captured', leadData)
        }}
        onClose={() => {
          sendMessageToParent('close-widget')
        }}
        config={config}
        parentUrl={parentUrl}
      />
    </div>
  )
}