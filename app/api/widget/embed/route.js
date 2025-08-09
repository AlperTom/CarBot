/**
 * Widget Embedding API - Secure Domain-Authorized Widget Delivery
 * CarBot MVP - Implementation of US-007 and US-008 from specifications
 * Provides secure, domain-authorized widget embedding with real-time validation
 */

import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { validateClientKey } from '../../../../lib/client-key-validation.js'
import { recordUsage } from '../../../../lib/packageFeatures.js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

/**
 * GET /api/widget/embed - Serve widget JavaScript with client key validation
 * Implements secure widget delivery with domain authorization
 */
export async function GET(request) {
  try {
    const { searchParams, origin } = new URL(request.url)
    const clientKey = searchParams.get('client_key') || searchParams.get('key')
    const domain = searchParams.get('domain') || extractDomainFromOrigin(origin)
    const version = searchParams.get('v') || '1.0'
    const theme = searchParams.get('theme') || 'auto'
    
    // CORS headers for cross-origin requests
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*', // Will be restricted per client key
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Cache-Control': 'public, max-age=300', // 5 minute cache
      'Content-Type': 'application/javascript; charset=utf-8'
    }

    if (!clientKey) {
      return new NextResponse(generateErrorWidget('Client key required'), {
        status: 400,
        headers: corsHeaders
      })
    }

    // Validate client key and domain authorization
    const validation = await validateClientKey(clientKey)
    if (!validation.valid) {
      console.warn(`Widget embed blocked: ${validation.error} for key ${clientKey}`)
      return new NextResponse(
        generateErrorWidget(`Access denied: ${validation.error}`),
        {
          status: 403,
          headers: corsHeaders
        }
      )
    }

    // Additional domain validation if domain provided
    if (domain && validation.key.authorized_domains?.length > 0) {
      const isAuthorized = validation.key.authorized_domains.some(authorizedDomain => 
        domain === authorizedDomain || domain.endsWith('.' + authorizedDomain)
      )
      
      if (!isAuthorized) {
        console.warn(`Domain not authorized: ${domain} for key ${clientKey}`)
        return new NextResponse(
          generateErrorWidget(`Domain ${domain} not authorized for this widget`),
          {
            status: 403,
            headers: {
              ...corsHeaders,
              'Access-Control-Allow-Origin': 'null' // Restrict origin
            }
          }
        )
      }
    }

    // Record widget load usage
    await recordUsage(validation.workshop.id, 'widget_loads', 1)

    // Get workshop configuration for widget
    const { data: workshopConfig } = await supabase
      .from('workshops')
      .select(`
        id,
        name,
        logo_url,
        brand_colors,
        languages_supported,
        timezone,
        opening_hours,
        widget_config
      `)
      .eq('id', validation.workshop.id)
      .single()

    // Get active widget configuration if available
    let activeWidgetConfig = null
    if (theme === 'custom' || theme === 'auto') {
      const { data: customConfig } = await supabase
        .from('widget_configurations')
        .select('configuration')
        .eq('workshop_id', validation.workshop.id)
        .eq('is_active', true)
        .single()
      
      activeWidgetConfig = customConfig?.configuration || workshopConfig?.widget_config
    }

    // Generate secure, personalized widget JavaScript
    const widgetJS = generateWidgetJS({
      clientKey,
      workshop: workshopConfig,
      domain,
      theme,
      version,
      rateLimitInfo: validation.key_info,
      customConfig: activeWidgetConfig
    })

    // Set CORS origin to specific domain if authorized
    const finalCorsHeaders = {
      ...corsHeaders,
      'Access-Control-Allow-Origin': domain ? `https://${domain}` : '*'
    }

    return new NextResponse(widgetJS, {
      status: 200,
      headers: finalCorsHeaders
    })

  } catch (error) {
    console.error('Widget embed error:', error)
    return new NextResponse(
      generateErrorWidget('Widget service temporarily unavailable'),
      {
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/javascript; charset=utf-8'
        }
      }
    )
  }
}

/**
 * OPTIONS /api/widget/embed - Handle CORS preflight requests
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400' // 24 hours
    }
  })
}

/**
 * Generate secure, personalized widget JavaScript
 * @param {Object} config - Widget configuration
 * @returns {string} Complete widget JavaScript
 */
function generateWidgetJS(config) {
  const { clientKey, workshop, domain, theme, version, rateLimitInfo, customConfig } = config

  return `
(function() {
  'use strict';
  
  // CarBot Widget v${version}
  // Generated at: ${new Date().toISOString()}
  // Client Key: ${clientKey.substring(0, 12)}...
  // Domain: ${domain || 'any'}
  
  // Security check - prevent multiple widget loads
  if (window.CarBotWidget) {
    console.warn('CarBot widget already loaded');
    return;
  }

  // Widget configuration
  const config = {
    clientKey: '${clientKey}',
    workshop: ${JSON.stringify({
      id: workshop.id,
      name: workshop.name,
      logoUrl: workshop.logo_url,
      brandColors: workshop.brand_colors || {},
      languages: workshop.languages_supported || ['de'],
      timezone: workshop.timezone || 'Europe/Berlin'
    })},
    theme: '${theme}',
    domain: '${domain || ''}',
    apiEndpoint: '${process.env.NEXT_PUBLIC_BASE_URL || 'https://carbot.chat'}/api/widget',
    version: '${version}',
    rateLimit: ${JSON.stringify(rateLimitInfo)},
    customConfig: ${customConfig ? JSON.stringify(customConfig) : 'null'}
  };

  // Widget main class
  class CarBotWidget {
    constructor(config) {
      this.config = config;
      this.customConfig = config.customConfig;
      this.isOpen = false;
      this.sessionId = this.generateSessionId();
      this.messages = [];
      this.container = null;
      this.isInitialized = false;
      
      // GDPR compliance
      this.consentGiven = false;
      this.checkConsent();
      
      this.init();
    }

    // Method to apply custom configuration
    applyCustomConfig(customConfig) {
      this.customConfig = customConfig;
      if (this.isInitialized) {
        this.updateStyles();
        this.updateBehavior();
      }
    }

    // Get configuration value with custom override
    getConfigValue(section, key, defaultValue = null) {
      if (this.customConfig && this.customConfig[section] && this.customConfig[section][key] !== undefined) {
        return this.customConfig[section][key];
      }
      return defaultValue;
    }

    generateSessionId() {
      return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    checkConsent() {
      // Check for existing GDPR consent
      const consent = localStorage.getItem('carbot_gdpr_consent');
      if (consent) {
        try {
          const consentData = JSON.parse(consent);
          this.consentGiven = consentData.given && new Date(consentData.expiry) > new Date();
        } catch (e) {
          console.warn('Invalid consent data');
        }
      }
    }

    async init() {
      if (this.isInitialized) return;
      
      try {
        // Load CSS styles
        this.loadStyles();
        
        // Create widget container
        this.createContainer();
        
        // Initialize event listeners
        this.attachEventListeners();
        
        // Apply behavior configurations
        this.updateBehavior();
        
        // Mark as initialized
        this.isInitialized = true;
        
        console.log('CarBot widget initialized successfully');
        
        // Dispatch custom event for tracking
        window.dispatchEvent(new CustomEvent('carbot:widget:initialized', {
          detail: { workshopId: this.config.workshop.id, sessionId: this.sessionId }
        }));
        
      } catch (error) {
        console.error('Failed to initialize CarBot widget:', error);
      }
    }

    loadStyles() {
      this.updateStyles();
    }

    updateStyles() {
      // Remove existing CarBot styles
      const existingStyles = document.querySelectorAll('style[data-carbot-styles]');
      existingStyles.forEach(style => style.remove());

      // Get configuration values with custom overrides
      const primaryColor = this.getConfigValue('colors', 'primary', this.config.workshop.brandColors?.primary || '#007bff');
      const secondaryColor = this.getConfigValue('colors', 'secondary', '#f8f9fa');
      const textColor = this.getConfigValue('colors', 'text', '#333');
      const backgroundColor = this.getConfigValue('colors', 'background', 'white');
      
      const fontFamily = this.getConfigValue('typography', 'fontFamily', '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif');
      const fontSize = this.getConfigValue('typography', 'fontSize', '14px');
      const fontWeight = this.getConfigValue('typography', 'fontWeight', '400');
      
      const position = this.getConfigValue('positioning', 'position', 'bottom-right');
      const offsetX = this.getConfigValue('positioning', 'offsetX', 20);
      const offsetY = this.getConfigValue('positioning', 'offsetY', 20);
      const zIndex = this.getConfigValue('positioning', 'zIndex', 999999);
      
      const triggerSize = this.getConfigValue('dimensions', 'triggerSize', 60);
      const chatWidth = this.getConfigValue('dimensions', 'chatWidth', 350);
      const chatHeight = this.getConfigValue('dimensions', 'chatHeight', 500);
      const borderRadius = this.getConfigValue('dimensions', 'borderRadius', 12);
      
      const customCSS = this.getConfigValue('advanced', 'customCSS', '');

      // Position calculations
      const positionStyles = this.getPositionStyles(position, offsetX, offsetY);

      const styles = \`
        .carbot-widget {
          position: fixed;
          \${positionStyles}
          z-index: \${zIndex};
          font-family: \${fontFamily};
          font-size: \${fontSize};
          font-weight: \${fontWeight};
          --primary-color: \${primaryColor};
          --secondary-color: \${secondaryColor};
          --text-color: \${textColor};
          --background-color: \${backgroundColor};
          --font-family: \${fontFamily};
          --font-size: \${fontSize};
          --border-radius: \${borderRadius}px;
          --trigger-size: \${triggerSize}px;
          --chat-width: \${chatWidth}px;
          --chat-height: \${chatHeight}px;
        }
        
        .carbot-trigger {
          width: \${triggerSize}px;
          height: \${triggerSize}px;
          background: \${primaryColor};
          border-radius: 50%;
          border: none;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          color: white;
          font-size: \${Math.max(12, triggerSize * 0.4)}px;
        }
        
        .carbot-trigger:hover {
          transform: scale(1.05);
          box-shadow: 0 6px 16px rgba(0,0,0,0.3);
        }
        
        .carbot-chat-window {
          position: absolute;
          \${position.includes('bottom') ? 'bottom: ' + (triggerSize + 10) + 'px;' : ''}
          \${position.includes('top') ? 'top: ' + (triggerSize + 10) + 'px;' : ''}
          \${position.includes('right') ? 'right: 0;' : ''}
          \${position.includes('left') ? 'left: 0;' : ''}
          width: \${chatWidth}px;
          height: \${chatHeight}px;
          background: \${backgroundColor};
          border-radius: \${borderRadius}px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.2);
          display: none;
          flex-direction: column;
          overflow: hidden;
        }
        
        .carbot-chat-header {
          background: \${primaryColor};
          color: white;
          padding: 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          border-radius: \${borderRadius}px \${borderRadius}px 0 0;
        }
        
        .carbot-chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
          background: \${secondaryColor};
        }
        
        .carbot-chat-input {
          padding: 16px;
          border-top: 1px solid #e9ecef;
          background: \${backgroundColor};
        }
        
        .carbot-input-field {
          width: 100%;
          padding: 12px;
          border: 1px solid #dee2e6;
          border-radius: 8px;
          resize: none;
          font-family: \${fontFamily};
          font-size: \${fontSize};
        }
        
        .carbot-gdpr-notice {
          font-size: 11px;
          color: #6c757d;
          margin-top: 8px;
        }
        
        .carbot-message {
          margin-bottom: 12px;
          padding: 8px 12px;
          border-radius: 8px;
          max-width: 85%;
          font-size: \${fontSize};
          font-weight: \${fontWeight};
        }
        
        .carbot-message.user {
          background: \${primaryColor};
          color: white;
          margin-left: auto;
        }
        
        .carbot-message.assistant {
          background: \${backgroundColor};
          color: \${textColor};
          border: 1px solid #e9ecef;
        }
        
        @media (max-width: 480px) {
          .carbot-chat-window {
            width: calc(100vw - 40px);
            height: calc(100vh - 120px);
            \${position.includes('bottom') ? 'bottom: ' + (triggerSize + 10) + 'px;' : ''}
            \${position.includes('top') ? 'top: ' + (triggerSize + 10) + 'px;' : ''}
            left: 20px;
            right: 20px;
          }
        }
        
        \${customCSS}
      \`;
      
      const styleSheet = document.createElement('style');
      styleSheet.setAttribute('data-carbot-styles', 'true');
      styleSheet.textContent = styles;
      document.head.appendChild(styleSheet);
    }

    getPositionStyles(position, offsetX, offsetY) {
      const styles = [];
      
      if (position.includes('bottom')) {
        styles.push(\`bottom: \${offsetY}px;\`);
      } else if (position.includes('top')) {
        styles.push(\`top: \${offsetY}px;\`);
      } else if (position.includes('center')) {
        styles.push(\`top: 50%; transform: translateY(-50%);\`);
      }
      
      if (position.includes('right')) {
        styles.push(\`right: \${offsetX}px;\`);
      } else if (position.includes('left')) {
        styles.push(\`left: \${offsetX}px;\`);
      }
      
      return styles.join(' ');
    }

    updateBehavior() {
      // Apply behavior configurations
      const autoOpen = this.getConfigValue('behavior', 'autoOpen', false);
      const autoOpenDelay = this.getConfigValue('behavior', 'autoOpenDelay', 3000);
      const welcomeMessage = this.getConfigValue('behavior', 'welcomeMessage', 
        'Hallo! Ich bin Ihr digitaler Werkstatt-Assistent. Wie kann ich Ihnen heute helfen? 🔧');

      // Auto-open functionality
      if (autoOpen && !this.isOpen) {
        setTimeout(() => {
          if (!this.isOpen) {
            this.open();
          }
        }, autoOpenDelay);
      }

      // Update welcome message if messages are empty
      if (this.messages.length === 0) {
        this.messages.push({
          role: 'assistant',
          content: welcomeMessage
        });
        this.updateMessagesDisplay();
      }
    }

    updateMessagesDisplay() {
      const messagesContainer = document.getElementById('carbot-messages');
      if (!messagesContainer) return;

      messagesContainer.innerHTML = '';
      this.messages.forEach(message => {
        const messageDiv = document.createElement('div');
        messageDiv.className = \`carbot-message \${message.role}\`;
        messageDiv.textContent = message.content;
        messagesContainer.appendChild(messageDiv);
      });
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    createContainer() {
      this.container = document.createElement('div');
      this.container.className = 'carbot-widget';
      this.container.innerHTML = \`
        <button class="carbot-trigger" onclick="window.CarBotWidget.toggle()">
          💬
        </button>
        <div class="carbot-chat-window">
          <div class="carbot-chat-header">
            <img src="\${this.config.workshop.logoUrl || ''}" alt="Logo" style="width: 32px; height: 32px; object-fit: contain; background: white; border-radius: 4px;">
            <div>
              <div style="font-weight: 600;">\${this.config.workshop.name}</div>
              <div style="font-size: 12px; opacity: 0.9;">Online-Beratung</div>
            </div>
            <button onclick="window.CarBotWidget.close()" style="margin-left: auto; background: none; border: none; color: white; font-size: 20px; cursor: pointer;">×</button>
          </div>
          <div class="carbot-chat-messages" id="carbot-messages">
            <div class="carbot-message assistant">
              Hallo! Ich bin Ihr digitaler Werkstatt-Assistent. Wie kann ich Ihnen heute helfen? 🔧
            </div>
          </div>
          <div class="carbot-chat-input">
            <textarea 
              id="carbot-input" 
              class="carbot-input-field" 
              placeholder="Ihre Frage eingeben..." 
              rows="2"
              onkeydown="window.CarBotWidget.handleKeyDown(event)"
            ></textarea>
            <div class="carbot-gdpr-notice">
              Mit der Nutzung stimmen Sie der Datenverarbeitung zu. 
              <a href="#" onclick="window.CarBotWidget.showGDPRInfo()">Mehr Infos</a>
            </div>
          </div>
        </div>
      \`;
      
      document.body.appendChild(this.container);
    }

    attachEventListeners() {
      // Global widget instance
      window.CarBotWidget = this;
      
      // Keyboard shortcuts
      document.addEventListener('keydown', (e) => {
        if (e.altKey && e.key === 'c') {
          this.toggle();
        }
        if (e.key === 'Escape' && this.isOpen) {
          this.close();
        }
      });
    }

    toggle() {
      if (this.isOpen) {
        this.close();
      } else {
        this.open();
      }
    }

    open() {
      const chatWindow = this.container.querySelector('.carbot-chat-window');
      chatWindow.style.display = 'flex';
      this.isOpen = true;
      
      // Focus input field
      setTimeout(() => {
        const input = document.getElementById('carbot-input');
        if (input) input.focus();
      }, 100);
      
      // Track widget open
      this.trackEvent('widget_opened');
    }

    close() {
      const chatWindow = this.container.querySelector('.carbot-chat-window');
      chatWindow.style.display = 'none';
      this.isOpen = false;
      
      // Track widget close
      this.trackEvent('widget_closed');
    }

    handleKeyDown(event) {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        this.sendMessage();
      }
    }

    async sendMessage() {
      const input = document.getElementById('carbot-input');
      const message = input.value.trim();
      
      if (!message) return;
      
      // Clear input
      input.value = '';
      
      // Add user message to chat
      this.addMessage(message, 'user');
      
      // Show typing indicator
      this.showTyping();
      
      try {
        // Send message to API
        const response = await fetch(\`\${this.config.apiEndpoint}/chat\`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: message,
            clientKey: this.config.clientKey,
            sessionId: this.sessionId,
            context: {
              domain: window.location.hostname,
              userAgent: navigator.userAgent,
              timestamp: new Date().toISOString()
            }
          })
        });
        
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        
        const data = await response.json();
        
        // Remove typing indicator
        this.hideTyping();
        
        // Add assistant response
        this.addMessage(data.response, 'assistant');
        
        // Track message sent
        this.trackEvent('message_sent');
        
      } catch (error) {
        console.error('Failed to send message:', error);
        this.hideTyping();
        this.addMessage('Entschuldigung, es gab ein Problem bei der Übertragung. Bitte versuchen Sie es erneut.', 'assistant');
      }
    }

    addMessage(message, sender) {
      const messagesContainer = document.getElementById('carbot-messages');
      const messageDiv = document.createElement('div');
      messageDiv.className = \`carbot-message \${sender}\`;
      messageDiv.textContent = message;
      
      messagesContainer.appendChild(messageDiv);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
      
      this.messages.push({ message, sender, timestamp: new Date().toISOString() });
    }

    showTyping() {
      const messagesContainer = document.getElementById('carbot-messages');
      const typingDiv = document.createElement('div');
      typingDiv.className = 'carbot-message assistant carbot-typing';
      typingDiv.innerHTML = 'Schreibt... <span style="animation: blink 1.4s infinite;">●●●</span>';
      typingDiv.id = 'carbot-typing';
      
      messagesContainer.appendChild(typingDiv);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    hideTyping() {
      const typingIndicator = document.getElementById('carbot-typing');
      if (typingIndicator) {
        typingIndicator.remove();
      }
    }

    showGDPRInfo() {
      alert('Datenschutzhinweis:\\n\\nWir verarbeiten Ihre Chat-Nachrichten, um Ihnen bestmögliche Beratung zu bieten. Die Daten werden verschlüsselt übertragen und gemäß DSGVO verarbeitet.\\n\\nWeitere Informationen finden Sie in unserer Datenschutzerklärung.');
    }

    trackEvent(eventType, data = {}) {
      // Track events for analytics
      try {
        fetch(\`\${this.config.apiEndpoint}/analytics\`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: eventType,
            clientKey: this.config.clientKey,
            sessionId: this.sessionId,
            data: {
              ...data,
              domain: window.location.hostname,
              timestamp: new Date().toISOString()
            }
          })
        }).catch(console.warn);
      } catch (e) {
        console.warn('Analytics tracking failed:', e);
      }
    }
  }

  // Initialize widget when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      new CarBotWidget(config);
    });
  } else {
    new CarBotWidget(config);
  }

})();
`
}

/**
 * Generate error widget for blocked or invalid requests
 * @param {string} errorMessage - Error message to display
 * @returns {string} Error widget JavaScript
 */
function generateErrorWidget(errorMessage) {
  return `
(function() {
  console.error('CarBot Widget Error: ${errorMessage}');
  
  // Create minimal error indicator for debugging
  if (window.location.hostname === 'localhost' || window.location.hostname.includes('dev')) {
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = 'position:fixed;bottom:20px;right:20px;background:#dc3545;color:white;padding:8px 12px;border-radius:4px;font-size:12px;z-index:999999;max-width:200px;';
    errorDiv.textContent = 'CarBot Error: ${errorMessage}';
    document.body.appendChild(errorDiv);
    
    setTimeout(() => errorDiv.remove(), 5000);
  }
})();
`
}

/**
 * Extract domain from origin header or URL
 * @param {string} origin - Request origin
 * @returns {string|null} Extracted domain
 */
function extractDomainFromOrigin(origin) {
  if (!origin) return null
  
  try {
    const url = new URL(origin)
    return url.hostname
  } catch (error) {
    return null
  }
}