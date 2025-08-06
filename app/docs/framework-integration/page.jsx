'use client'

import Link from 'next/link'
import SharedLayout, { GlassCard, PrimaryButton, SecondaryButton } from '@/components/SharedLayout'

export default function FrameworkIntegrationPage() {
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <SharedLayout title="React/Vue/Angular Integration" showNavigation={true}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '2rem 1.5rem'
      }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <Link href="/docs" style={{ 
            color: '#fb923c', 
            textDecoration: 'none',
            fontSize: '0.875rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '1rem'
          }}>
            ← Zurück zur Dokumentation
          </Link>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ fontSize: '3rem' }}>⚛️</div>
            <div>
              <h1 style={{ 
                color: 'white', 
                margin: 0, 
                fontSize: '2rem',
                fontWeight: 'bold'
              }}>
                React/Vue/Angular Integration
              </h1>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                <span style={{
                  background: '#ef4444',
                  color: 'white',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  fontWeight: '600'
                }}>
                  Fortgeschritten
                </span>
                <span style={{
                  color: '#9ca3af',
                  fontSize: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}>
                  🕐 25 Minuten
                </span>
              </div>
            </div>
          </div>
          
          <p style={{ 
            color: '#d1d5db', 
            margin: 0,
            fontSize: '1rem',
            lineHeight: '1.6'
          }}>
            Integration von CarBot in moderne JavaScript-Frameworks. 
            Komponenten, Hooks und reaktive Integrationen für React, Vue und Angular.
          </p>
        </div>

        {/* Framework Selection */}
        <GlassCard style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: 'white', marginBottom: '1rem', fontSize: '1.25rem' }}>
            🎯 Framework auswählen
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem'
          }}>
            <div style={{
              border: '2px solid #61dafb',
              borderRadius: '8px',
              padding: '1rem',
              background: 'rgba(97, 218, 251, 0.1)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⚛️</div>
              <h3 style={{ color: '#61dafb', fontSize: '1rem', marginBottom: '0.5rem' }}>React</h3>
              <p style={{ color: '#d1d5db', fontSize: '0.875rem', margin: 0 }}>
                Hooks, Komponenten, Next.js
              </p>
            </div>
            <div style={{
              border: '2px solid #4fc08d',
              borderRadius: '8px',
              padding: '1rem',
              background: 'rgba(79, 192, 141, 0.1)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💚</div>
              <h3 style={{ color: '#4fc08d', fontSize: '1rem', marginBottom: '0.5rem' }}>Vue.js</h3>
              <p style={{ color: '#d1d5db', fontSize: '0.875rem', margin: 0 }}>
                Composition API, Nuxt.js
              </p>
            </div>
            <div style={{
              border: '2px solid #dd0031',
              borderRadius: '8px',
              padding: '1rem',
              background: 'rgba(221, 0, 49, 0.1)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🅰️</div>
              <h3 style={{ color: '#dd0031', fontSize: '1rem', marginBottom: '0.5rem' }}>Angular</h3>
              <p style={{ color: '#d1d5db', fontSize: '0.875rem', margin: 0 }}>
                Services, Komponenten
              </p>
            </div>
          </div>
        </GlassCard>

        {/* React Integration */}
        <GlassCard style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: '#61dafb', marginBottom: '1rem', fontSize: '1.25rem' }}>
            ⚛️ React Integration
          </h2>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ color: 'white', fontSize: '1rem', marginBottom: '0.5rem' }}>
              1. CarBot Hook erstellen
            </h3>
            <p style={{ color: '#d1d5db', marginBottom: '1rem' }}>
              Erstellen Sie einen wiederverwendbaren Hook für CarBot:
            </p>
            <div style={{
              background: '#1e293b',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              padding: '1rem',
              position: 'relative'
            }}>
              <button
                onClick={() => copyToClipboard(`// hooks/useCarBot.js
import { useEffect, useCallback, useRef } from 'react';

export const useCarBot = (config = {}) => {
  const isLoadedRef = useRef(false);
  
  const defaultConfig = {
    clientKey: process.env.NEXT_PUBLIC_CARBOT_CLIENT_KEY,
    position: 'bottom-right',
    color: '#0070f3',
    ...config
  };

  const loadCarBot = useCallback(() => {
    if (isLoadedRef.current || typeof window === 'undefined') return;
    
    const script = document.createElement('script');
    script.src = 'https://carbot.de/widget.js';
    script.setAttribute('data-client', defaultConfig.clientKey);
    script.setAttribute('data-position', defaultConfig.position);
    script.setAttribute('data-color', defaultConfig.color);
    script.async = true;

    // React-spezifische Attribute
    if (defaultConfig.container) {
      script.setAttribute('data-container', defaultConfig.container);
    }

    document.head.appendChild(script);
    isLoadedRef.current = true;

    // Event Listeners für React State Management
    const handleCarBotEvent = (event) => {
      if (defaultConfig.onMessage) {
        defaultConfig.onMessage(event.detail);
      }
    };

    window.addEventListener('carbot:message', handleCarBotEvent);
    window.addEventListener('carbot:lead_captured', (event) => {
      if (defaultConfig.onLeadCaptured) {
        defaultConfig.onLeadCaptured(event.detail);
      }
    });

    return () => {
      window.removeEventListener('carbot:message', handleCarBotEvent);
    };
  }, [defaultConfig]);

  useEffect(() => {
    loadCarBot();
  }, [loadCarBot]);

  const openChat = useCallback(() => {
    if (window.CarBot) {
      window.CarBot.open();
    }
  }, []);

  const closeChat = useCallback(() => {
    if (window.CarBot) {
      window.CarBot.close();
    }
  }, []);

  const sendMessage = useCallback((message) => {
    if (window.CarBot) {
      window.CarBot.sendMessage(message);
    }
  }, []);

  return {
    openChat,
    closeChat,
    sendMessage
  };
};`)}
                style={{
                  position: 'absolute',
                  top: '0.5rem',
                  right: '0.5rem',
                  background: '#61dafb',
                  color: 'white',
                  border: 'none',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  cursor: 'pointer'
                }}
              >
                📋 Kopieren
              </button>
              <pre style={{
                color: '#e2e8f0',
                margin: 0,
                fontSize: '0.875rem',
                lineHeight: '1.5',
                overflow: 'auto'
              }}>
{`// hooks/useCarBot.js
import { useEffect, useCallback, useRef } from 'react';

export const useCarBot = (config = {}) => {
  const isLoadedRef = useRef(false);
  
  const defaultConfig = {
    clientKey: process.env.NEXT_PUBLIC_CARBOT_CLIENT_KEY,
    position: 'bottom-right',
    color: '#0070f3',
    ...config
  };

  const loadCarBot = useCallback(() => {
    if (isLoadedRef.current || typeof window === 'undefined') return;
    
    const script = document.createElement('script');
    script.src = 'https://carbot.de/widget.js';
    script.setAttribute('data-client', defaultConfig.clientKey);
    script.setAttribute('data-position', defaultConfig.position);
    script.setAttribute('data-color', defaultConfig.color);
    script.async = true;

    // React-spezifische Attribute
    if (defaultConfig.container) {
      script.setAttribute('data-container', defaultConfig.container);
    }

    document.head.appendChild(script);
    isLoadedRef.current = true;

    // Event Listeners für React State Management
    const handleCarBotEvent = (event) => {
      if (defaultConfig.onMessage) {
        defaultConfig.onMessage(event.detail);
      }
    };

    window.addEventListener('carbot:message', handleCarBotEvent);
    window.addEventListener('carbot:lead_captured', (event) => {
      if (defaultConfig.onLeadCaptured) {
        defaultConfig.onLeadCaptured(event.detail);
      }
    });

    return () => {
      window.removeEventListener('carbot:message', handleCarBotEvent);
    };
  }, [defaultConfig]);

  useEffect(() => {
    loadCarBot();
  }, [loadCarBot]);

  const openChat = useCallback(() => {
    if (window.CarBot) {
      window.CarBot.open();
    }
  }, []);

  const closeChat = useCallback(() => {
    if (window.CarBot) {
      window.CarBot.close();
    }
  }, []);

  const sendMessage = useCallback((message) => {
    if (window.CarBot) {
      window.CarBot.sendMessage(message);
    }
  }, []);

  return {
    openChat,
    closeChat,
    sendMessage
  };
};`}
              </pre>
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ color: 'white', fontSize: '1rem', marginBottom: '0.5rem' }}>
              2. Hook in Komponente verwenden
            </h3>
            <div style={{
              background: '#1e293b',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              padding: '1rem'
            }}>
              <pre style={{
                color: '#e2e8f0',
                margin: 0,
                fontSize: '0.875rem',
                lineHeight: '1.5'
              }}>
{`// components/ContactPage.jsx
import { useCarBot } from '../hooks/useCarBot';
import { useState } from 'react';

export default function ContactPage() {
  const [messages, setMessages] = useState([]);
  
  const { openChat, sendMessage } = useCarBot({
    clientKey: 'ihr-client-key',
    color: '#ff6b35',
    onMessage: (message) => {
      setMessages(prev => [...prev, message]);
    },
    onLeadCaptured: (lead) => {
      console.log('Neuer Lead:', lead);
      // Analytics tracken
    }
  });

  const handleQuickContact = (message) => {
    sendMessage(message);
    openChat();
  };

  return (
    <div className="contact-page">
      <h1>Kontakt aufnehmen</h1>
      
      <div className="quick-actions">
        <button 
          onClick={() => handleQuickContact('Ich brauche einen Kostenvoranschlag')}
          className="btn-primary"
        >
          💰 Kostenvoranschlag
        </button>
        
        <button 
          onClick={() => handleQuickContact('Wann haben Sie einen Termin frei?')}
          className="btn-secondary"
        >
          📅 Termin buchen
        </button>
        
        <button 
          onClick={openChat}
          className="btn-outline"
        >
          💬 Chat öffnen
        </button>
      </div>
      
      {messages.length > 0 && (
        <div className="chat-history">
          <h3>Chat-Verlauf:</h3>
          {messages.map((msg, i) => (
            <div key={i} className="message">
              {msg.content}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}`}
              </pre>
            </div>
          </div>

          <div>
            <h3 style={{ color: 'white', fontSize: '1rem', marginBottom: '0.5rem' }}>
              3. Inline Chat Komponente
            </h3>
            <div style={{
              background: '#1e293b',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              padding: '1rem'
            }}>
              <pre style={{
                color: '#e2e8f0',
                margin: 0,
                fontSize: '0.875rem',
                lineHeight: '1.5'
              }}>
{`// components/InlineChat.jsx
import { useEffect, useRef } from 'react';
import { useCarBot } from '../hooks/useCarBot';

export default function InlineChat({ 
  clientKey, 
  height = '500px',
  className = '' 
}) {
  const chatContainerRef = useRef(null);
  
  const { openChat } = useCarBot({
    clientKey,
    container: 'inline-chat-container',
    color: '#0070f3'
  });

  useEffect(() => {
    // Chat automatisch laden wenn Container sichtbar
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => openChat(), 1000);
        }
      },
      { threshold: 0.5 }
    );

    if (chatContainerRef.current) {
      observer.observe(chatContainerRef.current);
    }

    return () => observer.disconnect();
  }, [openChat]);

  return (
    <div 
      ref={chatContainerRef}
      id="inline-chat-container"
      className={\`inline-chat \${className}\`}
      style={{ 
        height, 
        border: '1px solid #e5e5e5',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}
    />
  );
}`}
              </pre>
            </div>
          </div>
        </GlassCard>

        {/* Vue.js Integration */}
        <GlassCard style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: '#4fc08d', marginBottom: '1rem', fontSize: '1.25rem' }}>
            💚 Vue.js Integration
          </h2>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ color: 'white', fontSize: '1rem', marginBottom: '0.5rem' }}>
              1. Composable erstellen (Vue 3)
            </h3>
            <div style={{
              background: '#1e293b',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              padding: '1rem',
              position: 'relative'
            }}>
              <button
                onClick={() => copyToClipboard(`// composables/useCarBot.js
import { ref, onMounted, onUnmounted } from 'vue'

export function useCarBot(config = {}) {
  const isLoaded = ref(false)
  const messages = ref([])
  
  const defaultConfig = {
    clientKey: process.env.VUE_APP_CARBOT_CLIENT_KEY,
    position: 'bottom-right',
    color: '#4fc08d',
    ...config
  }

  const loadCarBot = () => {
    if (isLoaded.value || typeof window === 'undefined') return
    
    const script = document.createElement('script')
    script.src = 'https://carbot.de/widget.js'
    script.setAttribute('data-client', defaultConfig.clientKey)
    script.setAttribute('data-position', defaultConfig.position)
    script.setAttribute('data-color', defaultConfig.color)
    script.async = true

    if (defaultConfig.container) {
      script.setAttribute('data-container', defaultConfig.container)
    }

    document.head.appendChild(script)
    isLoaded.value = true

    // Vue-reaktive Event Handler
    const handleMessage = (event) => {
      messages.value.push(event.detail)
      if (config.onMessage) config.onMessage(event.detail)
    }

    const handleLeadCaptured = (event) => {
      if (config.onLeadCaptured) config.onLeadCaptured(event.detail)
    }

    window.addEventListener('carbot:message', handleMessage)
    window.addEventListener('carbot:lead_captured', handleLeadCaptured)

    // Cleanup function
    return () => {
      window.removeEventListener('carbot:message', handleMessage)
      window.removeEventListener('carbot:lead_captured', handleLeadCaptured)
    }
  }

  const openChat = () => {
    if (window.CarBot) {
      window.CarBot.open()
    }
  }

  const closeChat = () => {
    if (window.CarBot) {
      window.CarBot.close()
    }
  }

  const sendMessage = (message) => {
    if (window.CarBot) {
      window.CarBot.sendMessage(message)
    }
  }

  onMounted(() => {
    const cleanup = loadCarBot()
    onUnmounted(() => {
      if (cleanup) cleanup()
    })
  })

  return {
    isLoaded,
    messages,
    openChat,
    closeChat,
    sendMessage
  }
}`)}
                style={{
                  position: 'absolute',
                  top: '0.5rem',
                  right: '0.5rem',
                  background: '#4fc08d',
                  color: 'white',
                  border: 'none',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  cursor: 'pointer'
                }}
              >
                📋 Kopieren
              </button>
              <pre style={{
                color: '#e2e8f0',
                margin: 0,
                fontSize: '0.875rem',
                lineHeight: '1.5',
                overflow: 'auto'
              }}>
{`// composables/useCarBot.js
import { ref, onMounted, onUnmounted } from 'vue'

export function useCarBot(config = {}) {
  const isLoaded = ref(false)
  const messages = ref([])
  
  const defaultConfig = {
    clientKey: process.env.VUE_APP_CARBOT_CLIENT_KEY,
    position: 'bottom-right',
    color: '#4fc08d',
    ...config
  }

  const loadCarBot = () => {
    if (isLoaded.value || typeof window === 'undefined') return
    
    const script = document.createElement('script')
    script.src = 'https://carbot.de/widget.js'
    script.setAttribute('data-client', defaultConfig.clientKey)
    script.setAttribute('data-position', defaultConfig.position)
    script.setAttribute('data-color', defaultConfig.color)
    script.async = true

    if (defaultConfig.container) {
      script.setAttribute('data-container', defaultConfig.container)
    }

    document.head.appendChild(script)
    isLoaded.value = true

    // Vue-reaktive Event Handler
    const handleMessage = (event) => {
      messages.value.push(event.detail)
      if (config.onMessage) config.onMessage(event.detail)
    }

    const handleLeadCaptured = (event) => {
      if (config.onLeadCaptured) config.onLeadCaptured(event.detail)
    }

    window.addEventListener('carbot:message', handleMessage)
    window.addEventListener('carbot:lead_captured', handleLeadCaptured)

    // Cleanup function
    return () => {
      window.removeEventListener('carbot:message', handleMessage)
      window.removeEventListener('carbot:lead_captured', handleLeadCaptured)
    }
  }

  const openChat = () => {
    if (window.CarBot) {
      window.CarBot.open()
    }
  }

  const closeChat = () => {
    if (window.CarBot) {
      window.CarBot.close()
    }
  }

  const sendMessage = (message) => {
    if (window.CarBot) {
      window.CarBot.sendMessage(message)
    }
  }

  onMounted(() => {
    const cleanup = loadCarBot()
    onUnmounted(() => {
      if (cleanup) cleanup()
    })
  })

  return {
    isLoaded,
    messages,
    openChat,
    closeChat,
    sendMessage
  }
}`}
              </pre>
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ color: 'white', fontSize: '1rem', marginBottom: '0.5rem' }}>
              2. In Vue-Komponente verwenden
            </h3>
            <div style={{
              background: '#1e293b',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              padding: '1rem'
            }}>
              <pre style={{
                color: '#e2e8f0',
                margin: 0,
                fontSize: '0.875rem',
                lineHeight: '1.5'
              }}>
{`<template>
  <div class="contact-page">
    <h1>Kontakt</h1>
    
    <div class="quick-actions">
      <button 
        @click="handleQuickContact('Ich brauche einen Kostenvoranschlag')"
        class="btn-primary"
      >
        💰 Kostenvoranschlag
      </button>
      
      <button 
        @click="handleQuickContact('Wann haben Sie einen Termin frei?')"
        class="btn-secondary"
      >
        📅 Termin buchen
      </button>
      
      <button @click="openChat" class="btn-outline">
        💬 Chat öffnen
      </button>
    </div>
    
    <div v-if="messages.length > 0" class="chat-history">
      <h3>Chat-Verlauf:</h3>
      <div 
        v-for="(message, index) in messages" 
        :key="index" 
        class="message"
      >
        {{ message.content }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCarBot } from '@/composables/useCarBot'

const { messages, openChat, sendMessage } = useCarBot({
  clientKey: 'ihr-client-key',
  color: '#ff6b35',
  onLeadCaptured: (lead) => {
    console.log('Neuer Lead:', lead)
    // Vuex/Pinia State aktualisieren
  }
})

const handleQuickContact = (message) => {
  sendMessage(message)
  openChat()
}
</script>`}
              </pre>
            </div>
          </div>

          <div>
            <h3 style={{ color: 'white', fontSize: '1rem', marginBottom: '0.5rem' }}>
              3. Vue 2 Plugin (Options API)
            </h3>
            <div style={{
              background: '#1e293b',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              padding: '1rem'
            }}>
              <pre style={{
                color: '#e2e8f0',
                margin: 0,
                fontSize: '0.875rem',
                lineHeight: '1.5'
              }}>
{`// plugins/carbot.js
const CarBotPlugin = {
  install(Vue, options = {}) {
    Vue.prototype.$carbot = {
      load(config = {}) {
        const script = document.createElement('script')
        script.src = 'https://carbot.de/widget.js'
        script.setAttribute('data-client', config.clientKey || options.clientKey)
        script.setAttribute('data-position', config.position || 'bottom-right')
        script.setAttribute('data-color', config.color || '#4fc08d')
        script.async = true
        document.head.appendChild(script)
      },
      
      open() {
        if (window.CarBot) window.CarBot.open()
      },
      
      close() {
        if (window.CarBot) window.CarBot.close()
      },
      
      sendMessage(message) {
        if (window.CarBot) window.CarBot.sendMessage(message)
      }
    }
  }
}

export default CarBotPlugin

// main.js
import CarBotPlugin from './plugins/carbot'
Vue.use(CarBotPlugin, {
  clientKey: process.env.VUE_APP_CARBOT_CLIENT_KEY
})`}
              </pre>
            </div>
          </div>
        </GlassCard>

        {/* Angular Integration */}
        <GlassCard style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: '#dd0031', marginBottom: '1rem', fontSize: '1.25rem' }}>
            🅰️ Angular Integration
          </h2>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ color: 'white', fontSize: '1rem', marginBottom: '0.5rem' }}>
              1. CarBot Service erstellen
            </h3>
            <div style={{
              background: '#1e293b',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              padding: '1rem',
              position: 'relative'
            }}>
              <button
                onClick={() => copyToClipboard(`// services/carbot.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface CarBotConfig {
  clientKey: string;
  position?: string;
  color?: string;
  container?: string;
}

export interface ChatMessage {
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

@Injectable({
  providedIn: 'root'
})
export class CarBotService {
  private isLoadedSubject = new BehaviorSubject<boolean>(false);
  private messagesSubject = new BehaviorSubject<ChatMessage[]>([]);
  
  public isLoaded$: Observable<boolean> = this.isLoadedSubject.asObservable();
  public messages$: Observable<ChatMessage[]> = this.messagesSubject.asObservable();
  
  private config: CarBotConfig | null = null;

  constructor() {
    this.setupEventListeners();
  }

  public load(config: CarBotConfig): void {
    if (this.isLoadedSubject.value) return;
    
    this.config = config;
    
    const script = document.createElement('script');
    script.src = 'https://carbot.de/widget.js';
    script.setAttribute('data-client', config.clientKey);
    script.setAttribute('data-position', config.position || 'bottom-right');
    script.setAttribute('data-color', config.color || '#dd0031');
    script.async = true;

    if (config.container) {
      script.setAttribute('data-container', config.container);
    }

    document.head.appendChild(script);
    this.isLoadedSubject.next(true);
  }

  public open(): void {
    if ((window as any).CarBot) {
      (window as any).CarBot.open();
    }
  }

  public close(): void {
    if ((window as any).CarBot) {
      (window as any).CarBot.close();
    }
  }

  public sendMessage(message: string): void {
    if ((window as any).CarBot) {
      (window as any).CarBot.sendMessage(message);
    }
  }

  private setupEventListeners(): void {
    if (typeof window === 'undefined') return;

    window.addEventListener('carbot:message', (event: any) => {
      const currentMessages = this.messagesSubject.value;
      const newMessage: ChatMessage = {
        content: event.detail.content,
        role: event.detail.role,
        timestamp: new Date()
      };
      this.messagesSubject.next([...currentMessages, newMessage]);
    });

    window.addEventListener('carbot:lead_captured', (event: any) => {
      // Lead-Daten verarbeiten
      console.log('Lead captured:', event.detail);
    });
  }
}`)}
                style={{
                  position: 'absolute',
                  top: '0.5rem',
                  right: '0.5rem',
                  background: '#dd0031',
                  color: 'white',
                  border: 'none',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  cursor: 'pointer'
                }}
              >
                📋 Kopieren
              </button>
              <pre style={{
                color: '#e2e8f0',
                margin: 0,
                fontSize: '0.875rem',
                lineHeight: '1.5',
                overflow: 'auto'
              }}>
{`// services/carbot.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface CarBotConfig {
  clientKey: string;
  position?: string;
  color?: string;
  container?: string;
}

export interface ChatMessage {
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

@Injectable({
  providedIn: 'root'
})
export class CarBotService {
  private isLoadedSubject = new BehaviorSubject<boolean>(false);
  private messagesSubject = new BehaviorSubject<ChatMessage[]>([]);
  
  public isLoaded$: Observable<boolean> = this.isLoadedSubject.asObservable();
  public messages$: Observable<ChatMessage[]> = this.messagesSubject.asObservable();
  
  private config: CarBotConfig | null = null;

  constructor() {
    this.setupEventListeners();
  }

  public load(config: CarBotConfig): void {
    if (this.isLoadedSubject.value) return;
    
    this.config = config;
    
    const script = document.createElement('script');
    script.src = 'https://carbot.de/widget.js';
    script.setAttribute('data-client', config.clientKey);
    script.setAttribute('data-position', config.position || 'bottom-right');
    script.setAttribute('data-color', config.color || '#dd0031');
    script.async = true;

    if (config.container) {
      script.setAttribute('data-container', config.container);
    }

    document.head.appendChild(script);
    this.isLoadedSubject.next(true);
  }

  public open(): void {
    if ((window as any).CarBot) {
      (window as any).CarBot.open();
    }
  }

  public close(): void {
    if ((window as any).CarBot) {
      (window as any).CarBot.close();
    }
  }

  public sendMessage(message: string): void {
    if ((window as any).CarBot) {
      (window as any).CarBot.sendMessage(message);
    }
  }

  private setupEventListeners(): void {
    if (typeof window === 'undefined') return;

    window.addEventListener('carbot:message', (event: any) => {
      const currentMessages = this.messagesSubject.value;
      const newMessage: ChatMessage = {
        content: event.detail.content,
        role: event.detail.role,
        timestamp: new Date()
      };
      this.messagesSubject.next([...currentMessages, newMessage]);
    });

    window.addEventListener('carbot:lead_captured', (event: any) => {
      // Lead-Daten verarbeiten
      console.log('Lead captured:', event.detail);
    });
  }
}`}
              </pre>
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ color: 'white', fontSize: '1rem', marginBottom: '0.5rem' }}>
              2. Angular Komponente
            </h3>
            <div style={{
              background: '#1e293b',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              padding: '1rem'
            }}>
              <pre style={{
                color: '#e2e8f0',
                margin: 0,
                fontSize: '0.875rem',
                lineHeight: '1.5'
              }}>
{`// components/contact.component.ts
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CarBotService, ChatMessage } from '../services/carbot.service';

@Component({
  selector: 'app-contact',
  template: \`
    <div class="contact-page">
      <h1>Kontakt aufnehmen</h1>
      
      <div class="quick-actions">
        <button 
          (click)="handleQuickContact('Ich brauche einen Kostenvoranschlag')"
          class="btn-primary"
        >
          💰 Kostenvoranschlag
        </button>
        
        <button 
          (click)="handleQuickContact('Wann haben Sie einen Termin frei?')"
          class="btn-secondary"
        >
          📅 Termin buchen
        </button>
        
        <button (click)="openChat()" class="btn-outline">
          💬 Chat öffnen
        </button>
      </div>
      
      <div *ngIf="(messages$ | async)?.length > 0" class="chat-history">
        <h3>Chat-Verlauf:</h3>
        <div 
          *ngFor="let message of messages$ | async" 
          class="message"
          [class.user]="message.role === 'user'"
        >
          {{ message.content }}
          <small>{{ message.timestamp | date:'short' }}</small>
        </div>
      </div>
    </div>
  \`,
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
  messages$: Observable<ChatMessage[]>;
  isLoaded$: Observable<boolean>;

  constructor(private carBotService: CarBotService) {
    this.messages$ = this.carBotService.messages$;
    this.isLoaded$ = this.carBotService.isLoaded$;
  }

  ngOnInit(): void {
    this.carBotService.load({
      clientKey: 'ihr-client-key',
      color: '#ff6b35'
    });
  }

  openChat(): void {
    this.carBotService.open();
  }

  handleQuickContact(message: string): void {
    this.carBotService.sendMessage(message);
    this.carBotService.open();
  }
}`}
              </pre>
            </div>
          </div>

          <div>
            <h3 style={{ color: 'white', fontSize: '1rem', marginBottom: '0.5rem' }}>
              3. Inline Chat Komponente
            </h3>
            <div style={{
              background: '#1e293b',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              padding: '1rem'
            }}>
              <pre style={{
                color: '#e2e8f0',
                margin: 0,
                fontSize: '0.875rem',
                lineHeight: '1.5'
              }}>
{`// components/inline-chat.component.ts
import { Component, Input, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { CarBotService } from '../services/carbot.service';

@Component({
  selector: 'app-inline-chat',
  template: \`
    <div 
      #chatContainer 
      class="inline-chat"
      [style.height]="height"
      [style.border]="'1px solid #e5e5e5'"
      [style.border-radius]="'12px'"
      [style.overflow]="'hidden'"
    >
      <!-- CarBot wird hier eingebettet -->
    </div>
  \`
})
export class InlineChatComponent implements OnInit, AfterViewInit {
  @Input() clientKey: string = '';
  @Input() height: string = '500px';
  @Input() color: string = '#dd0031';

  constructor(
    private carBotService: CarBotService,
    private elementRef: ElementRef
  ) {}

  ngOnInit(): void {
    // Warten auf View-Initialisierung
  }

  ngAfterViewInit(): void {
    const containerId = 'inline-chat-' + Math.random().toString(36).substr(2, 9);
    const container = this.elementRef.nativeElement.querySelector('.inline-chat');
    container.id = containerId;

    this.carBotService.load({
      clientKey: this.clientKey,
      color: this.color,
      container: containerId
    });
  }
}`}
              </pre>
            </div>
          </div>
        </GlassCard>

        {/* Universal Patterns */}
        <GlassCard style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: 'white', marginBottom: '1rem', fontSize: '1.25rem' }}>
            🔄 Universelle Patterns
          </h2>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ color: 'white', fontSize: '1rem', marginBottom: '0.5rem' }}>
              Server-Side Rendering (SSR)
            </h3>
            <p style={{ color: '#d1d5db', marginBottom: '1rem' }}>
              Für Next.js, Nuxt.js und Angular Universal:
            </p>
            <div style={{
              background: '#1e293b',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              padding: '1rem'
            }}>
              <pre style={{
                color: '#e2e8f0',
                margin: 0,
                fontSize: '0.875rem',
                lineHeight: '1.5'
              }}>
{`// SSR-sichere Implementierung
const loadCarBot = () => {
  // Nur im Browser ausführen
  if (typeof window === 'undefined') return;
  
  // Dynamic import für bessere Performance
  const loadScript = async () => {
    const script = document.createElement('script');
    script.src = 'https://carbot.de/widget.js';
    script.setAttribute('data-client', clientKey);
    script.async = true;
    
    // Lazy Loading nach Interaktion
    document.addEventListener('scroll', () => {
      document.head.appendChild(script);
    }, { once: true });
  };
  
  // Nach DOM-Laden
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadScript);
  } else {
    loadScript();
  }
};

// Next.js
useEffect(() => {
  loadCarBot();
}, []);

// Nuxt.js
onMounted(() => {
  loadCarBot();
});

// Angular
ngAfterViewInit() {
  loadCarBot();
}`}
              </pre>
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ color: 'white', fontSize: '1rem', marginBottom: '0.5rem' }}>
              State Management Integration
            </h3>
            <div style={{
              background: '#1e293b',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              padding: '1rem'
            }}>
              <pre style={{
                color: '#e2e8f0',
                margin: 0,
                fontSize: '0.875rem',
                lineHeight: '1.5'
              }}>
{`// Redux/Zustand (React)
const chatSlice = createSlice({
  name: 'chat',
  initialState: { messages: [], isOpen: false },
  reducers: {
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    toggleChat: (state) => {
      state.isOpen = !state.isOpen;
    }
  }
});

// Vuex/Pinia (Vue)
const useChatStore = defineStore('chat', {
  state: () => ({
    messages: [],
    isOpen: false
  }),
  actions: {
    addMessage(message) {
      this.messages.push(message);
    },
    toggleChat() {
      this.isOpen = !this.isOpen;
    }
  }
});

// NgRx (Angular)
@Injectable()
export class ChatEffects {
  loadMessages$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChatActions.loadMessages),
      switchMap(() =>
        this.chatService.getMessages().pipe(
          map(messages => ChatActions.loadMessagesSuccess({ messages }))
        )
      )
    )
  );
}`}
              </pre>
            </div>
          </div>

          <div>
            <h3 style={{ color: 'white', fontSize: '1rem', marginBottom: '0.5rem' }}>
              TypeScript Definitionen
            </h3>
            <div style={{
              background: '#1e293b',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              padding: '1rem'
            }}>
              <pre style={{
                color: '#e2e8f0',
                margin: 0,
                fontSize: '0.875rem',
                lineHeight: '1.5'
              }}>
{`// types/carbot.d.ts
declare global {
  interface Window {
    CarBot: {
      open(): void;
      close(): void;
      toggle(): void;
      sendMessage(message: string): void;
    };
  }
}

export interface CarBotConfig {
  clientKey: string;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'center';
  color?: string;
  container?: string;
  greeting?: string;
  language?: 'de' | 'en' | 'tr' | 'pl';
}

export interface ChatMessage {
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export interface LeadData {
  name: string;
  phone: string;
  email?: string;
  message: string;
  source: string;
}

export {};`}
              </pre>
            </div>
          </div>
        </GlassCard>

        {/* Performance */}
        <GlassCard style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: 'white', marginBottom: '1rem', fontSize: '1.25rem' }}>
            🚀 Performance-Optimierung
          </h2>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ color: 'white', fontSize: '1rem', marginBottom: '0.5rem' }}>
              Lazy Loading
            </h3>
            <ul style={{ color: '#d1d5db', margin: 0, paddingLeft: '1.5rem' }}>
              <li style={{ marginBottom: '0.5rem' }}>CarBot erst nach Benutzer-Interaktion laden</li>
              <li style={{ marginBottom: '0.5rem' }}>Intersection Observer für Sichtbarkeit nutzen</li>
              <li style={{ marginBottom: '0.5rem' }}>Code Splitting für große Anwendungen</li>
              <li>Service Worker für Offline-Funktionalität</li>
            </ul>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ color: 'white', fontSize: '1rem', marginBottom: '0.5rem' }}>
              Bundle-Größe
            </h3>
            <ul style={{ color: '#d1d5db', margin: 0, paddingLeft: '1.5rem' }}>
              <li style={{ marginBottom: '0.5rem' }}>CarBot Widget: ~13KB gzipped</li>
              <li style={{ marginBottom: '0.5rem' }}>Asynchrones Laden - keine Auswirkung auf Initial Load</li>
              <li style={{ marginBottom: '0.5rem' }}>Tree Shaking-freundlich</li>
              <li>CDN-Auslieferung für optimale Performance</li>
            </ul>
          </div>

          <div>
            <h3 style={{ color: 'white', fontSize: '1rem', marginBottom: '0.5rem' }}>
              Best Practices
            </h3>
            <ul style={{ color: '#d1d5db', margin: 0, paddingLeft: '1.5rem' }}>
              <li style={{ marginBottom: '0.5rem' }}>Event Listener in useEffect/onMounted cleanup</li>
              <li style={{ marginBottom: '0.5rem' }}>Debounce für häufige API-Calls</li>
              <li style={{ marginBottom: '0.5rem' }}>Memory Leaks durch Subscription Management vermeiden</li>
              <li>Error Boundaries für robuste Fehlerbehandlung</li>
            </ul>
          </div>
        </GlassCard>

        {/* Next Steps */}
        <GlassCard style={{ 
          background: 'linear-gradient(135deg, rgba(234, 88, 12, 0.1) 0%, rgba(147, 51, 234, 0.1) 50%, rgba(37, 99, 235, 0.1) 100%)',
          border: '1px solid rgba(234, 88, 12, 0.3)',
          marginBottom: '2rem'
        }}>
          <h2 style={{ color: 'white', marginBottom: '1rem', fontSize: '1.25rem' }}>
            🎉 Framework-Integration abgeschlossen!
          </h2>
          <p style={{ color: '#d1d5db', marginBottom: '1.5rem' }}>
            CarBot ist jetzt nahtlos in Ihr Framework integriert. Nutzen Sie die volle Power:
          </p>
          
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <PrimaryButton href="/docs/api-reference">
              API Dokumentation
            </PrimaryButton>
            <SecondaryButton href="/docs/widget-customization">
              Widget anpassen
            </SecondaryButton>
            <SecondaryButton href="/dashboard/analytics">
              Analytics Dashboard
            </SecondaryButton>
          </div>
        </GlassCard>

        {/* Navigation */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          marginTop: '2rem',
          padding: '1rem 0',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <Link href="/docs/html-integration" style={{ 
            color: '#fb923c', 
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            ← HTML Integration
          </Link>
          <Link href="/docs/api-reference" style={{ 
            color: '#fb923c', 
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            API Referenz →
          </Link>
        </div>
      </div>
    </SharedLayout>
  )
}