(function() {
  'use strict';
  
  // CarBot Widget - Embeddable Chat Widget for External Websites
  // Usage: <script src="https://carbot.chat/widget.js" data-client="abc123" async></script>
  
  class CarBotWidget {
    constructor() {
      this.clientKey = null;
      this.config = {
        position: 'bottom-right',
        primaryColor: '#0070f3',
        borderRadius: '16px',
        zIndex: 1000,
        width: 300,
        height: 400
      };
      this.isLoaded = false;
      this.isOpen = false;
      
      this.init();
    }
    
    init() {
      // Get client key from script tag
      const scriptTag = document.querySelector('script[src*="widget.js"]');
      if (scriptTag) {
        this.clientKey = scriptTag.getAttribute('data-client') || 'unknown';
        
        // Override config with data attributes
        const position = scriptTag.getAttribute('data-position');
        const color = scriptTag.getAttribute('data-color');
        
        if (position) this.config.position = position;
        if (color) this.config.primaryColor = color;
      }
      
      // Wait for DOM ready
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => this.createWidget());
      } else {
        this.createWidget();
      }
    }
    
    createWidget() {
      // Create widget container
      this.container = document.createElement('div');
      this.container.id = 'carbot-widget-container';
      this.setContainerStyles();
      
      // Create toggle button
      this.createToggleButton();
      
      // Create chat iframe
      this.createChatFrame();
      
      // Append to body
      document.body.appendChild(this.container);
      
      // Setup message handling
      this.setupMessageHandling();
      
      this.isLoaded = true;
    }
    
    setContainerStyles() {
      const styles = {
        position: 'fixed',
        zIndex: this.config.zIndex,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      };
      
      // Position the widget
      switch (this.config.position) {
        case 'bottom-right':
          styles.bottom = '20px';
          styles.right = '20px';
          break;
        case 'bottom-left':
          styles.bottom = '20px';
          styles.left = '20px';
          break;
        case 'top-right':
          styles.top = '20px';
          styles.right = '20px';
          break;
        case 'top-left':
          styles.top = '20px';
          styles.left = '20px';
          break;
      }
      
      Object.assign(this.container.style, styles);
    }
    
    createToggleButton() {
      this.toggleButton = document.createElement('button');
      this.toggleButton.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C6.48 2 2 6.48 2 12C2 13.54 2.38 14.98 3.06 16.24L2 22L7.76 20.94C9.02 21.62 10.46 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C10.74 20 9.54 19.68 8.5 19.1L6.55 19.66L7.11 17.71C6.53 16.67 6.21 15.47 6.21 14.21C6.21 9.93 9.72 6.42 14 6.42C18.28 6.42 21.79 9.93 21.79 14.21C21.79 18.49 18.28 22 14 22H12Z" fill="white"/>
        </svg>
      `;
      
      const buttonStyles = {
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        border: 'none',
        backgroundColor: this.config.primaryColor,
        color: 'white',
        cursor: 'pointer',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.3s ease',
        outline: 'none'
      };
      
      Object.assign(this.toggleButton.style, buttonStyles);
      
      // Hover effects
      this.toggleButton.addEventListener('mouseenter', () => {
        this.toggleButton.style.transform = 'scale(1.1)';
        this.toggleButton.style.boxShadow = '0 6px 16px rgba(0,0,0,0.2)';
      });
      
      this.toggleButton.addEventListener('mouseleave', () => {
        this.toggleButton.style.transform = 'scale(1)';
        this.toggleButton.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
      });
      
      this.toggleButton.addEventListener('click', () => this.toggleChat());
      
      this.container.appendChild(this.toggleButton);
    }
    
    createChatFrame() {
      this.chatFrame = document.createElement('iframe');
      this.chatFrame.src = `http://localhost:3001/widget-chat?client=${encodeURIComponent(this.clientKey)}`;
      this.chatFrame.style.display = 'none';
      
      const frameStyles = {
        width: this.config.width + 'px',
        height: this.config.height + 'px',
        border: 'none',
        borderRadius: this.config.borderRadius,
        boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
        backgroundColor: 'white',
        position: 'absolute',
        bottom: '70px',
        right: '0',
        transition: 'all 0.3s ease',
        opacity: '0',
        transform: 'translateY(10px)'
      };
      
      if (this.config.position.includes('left')) {
        frameStyles.right = 'auto';
        frameStyles.left = '0';
      }
      
      if (this.config.position.includes('top')) {
        frameStyles.bottom = 'auto';
        frameStyles.top = '70px';
      }
      
      Object.assign(this.chatFrame.style, frameStyles);
      this.container.appendChild(this.chatFrame);
    }
    
    toggleChat() {
      if (this.isOpen) {
        this.closeChat();
      } else {
        this.openChat();
      }
    }
    
    openChat() {
      this.chatFrame.style.display = 'block';
      
      // Animate in
      setTimeout(() => {
        this.chatFrame.style.opacity = '1';
        this.chatFrame.style.transform = 'translateY(0)';
      }, 10);
      
      // Update button icon to close
      this.toggleButton.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 6L6 18M6 6L18 18" stroke="white" stroke-width="2" stroke-linecap="round"/>
        </svg>
      `;
      
      this.isOpen = true;
      
      // Send message to parent about widget opening
      this.sendMessageToParent('widget-opened', { clientKey: this.clientKey });
    }
    
    closeChat() {
      this.chatFrame.style.opacity = '0';
      this.chatFrame.style.transform = 'translateY(10px)';
      
      setTimeout(() => {
        this.chatFrame.style.display = 'none';
      }, 300);
      
      // Update button icon back to chat
      this.toggleButton.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C6.48 2 2 6.48 2 12C2 13.54 2.38 14.98 3.06 16.24L2 22L7.76 20.94C9.02 21.62 10.46 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C10.74 20 9.54 19.68 8.5 19.1L6.55 19.66L7.11 17.71C6.53 16.67 6.21 15.47 6.21 14.21C6.21 9.93 9.72 6.42 14 6.42C18.28 6.42 21.79 9.93 21.79 14.21C21.79 18.49 18.28 22 14 22H12Z" fill="white"/>
        </svg>
      `;
      
      this.isOpen = false;
      
      // Send message to parent about widget closing
      this.sendMessageToParent('widget-closed', { clientKey: this.clientKey });
    }
    
    setupMessageHandling() {
      // Listen for messages from the chat iframe
      window.addEventListener('message', (event) => {
        // Enhanced origin validation with strict checking
        const allowedOrigins = [
          'https://carbot.de',
          'https://www.carbot.de',
          'https://car-bot.vercel.app'
        ];
        
        // Add localhost only in development
        if (this.isDevelopment()) {
          allowedOrigins.push('http://localhost:3000', 'http://localhost:3003');
        }
        
        if (!this.isValidOrigin(event.origin, allowedOrigins)) {
          console.warn('Invalid origin blocked:', event.origin);
          return;
        }
        
        // Validate message structure
        if (!event.data || typeof event.data !== 'object') {
          console.warn('Invalid message format');
          return;
        }
        
        const { type, data } = event.data;
        
        switch (type) {
          case 'resize-widget':
            this.resizeWidget(data.width, data.height);
            break;
          case 'close-widget':
            this.closeChat();
            break;
          case 'lead-captured':
            this.onLeadCaptured(data);
            break;
          case 'widget-ready':
            this.onWidgetReady();
            break;
        }
      });
    }
    
    resizeWidget(width, height) {
      if (width) this.chatFrame.style.width = width + 'px';
      if (height) this.chatFrame.style.height = height + 'px';
    }
    
    onLeadCaptured(leadData) {
      // Notify parent page about lead capture
      this.sendMessageToParent('lead-captured', leadData);
      
      // Optional: Show success state
      this.showLeadCapturedState();
    }
    
    showLeadCapturedState() {
      const originalColor = this.toggleButton.style.backgroundColor;
      this.toggleButton.style.backgroundColor = '#22c55e'; // Green
      
      setTimeout(() => {
        this.toggleButton.style.backgroundColor = originalColor;
      }, 2000);
    }
    
    onWidgetReady() {
      // Send initial configuration to the chat frame
      this.sendMessageToFrame('widget-config', {
        clientKey: this.clientKey,
        config: this.config,
        parentUrl: window.location.href
      });
    }
    
    sendMessageToFrame(type, data) {
      if (this.chatFrame && this.chatFrame.contentWindow) {
        this.chatFrame.contentWindow.postMessage({ type, data }, '*');
      }
    }
    
    sendMessageToParent(type, data) {
      // Allow parent page to listen for widget events
      if (window.parent !== window) {
        window.parent.postMessage({ type: 'carbot-' + type, data }, '*');
      }
      
      // Also dispatch custom event
      const event = new CustomEvent('carbot-' + type, { detail: data });
      document.dispatchEvent(event);
    }
    
    // Public API methods
    open() { this.openChat(); }
    close() { this.closeChat(); }
    toggle() { this.toggleChat(); }
    
    updateConfig(newConfig) {
      Object.assign(this.config, newConfig);
      this.setContainerStyles();
    }
    
    // Security helper functions
    isDevelopment() {
      return window.location.hostname === 'localhost' || 
             window.location.hostname === '127.0.0.1' ||
             window.location.hostname.includes('localhost');
    }
    
    isValidOrigin(origin, allowedOrigins) {
      if (!origin || typeof origin !== 'string') return false;
      
      // Exact match check
      if (allowedOrigins.includes(origin)) return true;
      
      // Additional validation for subdomains (if needed)
      try {
        const url = new URL(origin);
        // Only allow HTTPS in production
        if (!this.isDevelopment() && url.protocol !== 'https:') {
          return false;
        }
        return allowedOrigins.some(allowed => {
          const allowedUrl = new URL(allowed);
          return url.hostname === allowedUrl.hostname && url.protocol === allowedUrl.protocol;
        });
      } catch (e) {
        return false;
      }
    }
  }
  
  // Error handling
  try {
    // Initialize widget when script loads
    window.CarBotWidget = new CarBotWidget();
    
    // Expose global API
    window.CarBot = {
      open: () => window.CarBotWidget.open(),
      close: () => window.CarBotWidget.close(),
      toggle: () => window.CarBotWidget.toggle(),
      updateConfig: (config) => window.CarBotWidget.updateConfig(config)
    };
    
  } catch (error) {
    console.error('CarBot Widget failed to initialize:', error);
    
    // Fallback: Create a simple link to the full chat page
    const fallbackLink = document.createElement('a');
    fallbackLink.href = 'https://carbot.chat';
    fallbackLink.target = '_blank';
    fallbackLink.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: #0070f3;
      color: white;
      padding: 12px 20px;
      border-radius: 25px;
      text-decoration: none;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      font-size: 14px;
      font-weight: 500;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 1000;
    `;
    fallbackLink.textContent = 'Chat öffnen';
    
    if (document.body) {
      document.body.appendChild(fallbackLink);
    } else {
      document.addEventListener('DOMContentLoaded', () => {
        document.body.appendChild(fallbackLink);
      });
    }
  }
})();