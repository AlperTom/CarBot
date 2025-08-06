/**
 * Chat Widget Page Object for CarBot E2E Tests
 * Handles chat widget functionality, lead capture, and conversations
 */

const { BasePage } = require('./base-page');

class ChatWidgetPage extends BasePage {
  constructor(page) {
    super(page);
    
    this.selectors = {
      // Chat widget elements
      widget: {
        container: '[data-testid="chat-widget"], .chat-widget, #carbot-chat-widget',
        launcher: '[data-testid="chat-launcher"], .chat-launcher, .chat-toggle',
        chatWindow: '[data-testid="chat-window"], .chat-window, .chat-container',
        minimizeButton: '[data-testid="minimize-chat"], .minimize-chat, .chat-close',
        
        // Chat header
        header: '[data-testid="chat-header"], .chat-header',
        workshopName: '[data-testid="workshop-name"], .workshop-name',
        onlineStatus: '[data-testid="online-status"], .online-status'
      },

      // GDPR and consent
      gdpr: {
        consentModal: '[data-testid="gdpr-consent"], .gdpr-modal, .consent-modal',
        acceptButton: '[data-testid="accept-gdpr"], button:has-text("Akzeptieren")',
        declineButton: '[data-testid="decline-gdpr"], button:has-text("Ablehnen")',
        privacyLink: '[data-testid="privacy-link"], a:has-text("Datenschutz")',
        consentText: '[data-testid="consent-text"], .consent-text'
      },

      // Chat conversation
      conversation: {
        messagesList: '[data-testid="messages-list"], .messages-container, .chat-messages',
        userMessage: '[data-testid="user-message"], .message.user',
        botMessage: '[data-testid="bot-message"], .message.bot',
        messageInput: '[data-testid="message-input"], .message-input, input[placeholder*="Nachricht"]',
        sendButton: '[data-testid="send-message"], .send-button, button[type="submit"]',
        typingIndicator: '[data-testid="typing"], .typing-indicator',
        
        // Quick replies
        quickReplies: '[data-testid="quick-replies"], .quick-replies',
        quickReply: '[data-testid="quick-reply"], .quick-reply-button'
      },

      // Lead capture form
      leadForm: {
        modal: '[data-testid="lead-form"], .lead-capture-modal, .contact-form-modal',
        nameField: '[data-testid="lead-name"], input[name="name"]',
        emailField: '[data-testid="lead-email"], input[name="email"]',
        phoneField: '[data-testid="lead-phone"], input[name="phone"]',
        messageField: '[data-testid="lead-message"], textarea[name="message"]',
        vehicleField: '[data-testid="lead-vehicle"], input[name="vehicle"]',
        serviceSelect: '[data-testid="service-type"], select[name="service"]',
        urgencySelect: '[data-testid="urgency"], select[name="urgency"]',
        submitButton: '[data-testid="submit-lead"], button[type="submit"]:has-text("Anfrage senden")',
        cancelButton: '[data-testid="cancel-lead"], button:has-text("Abbrechen")',
        
        // Success state
        successMessage: '[data-testid="lead-success"], .lead-submitted',
        confirmationNumber: '[data-testid="confirmation-number"]'
      },

      // Language selection
      language: {
        switcher: '[data-testid="language-switcher"], .language-selector',
        german: '[data-testid="lang-de"], [data-lang="de"]',
        english: '[data-testid="lang-en"], [data-lang="en"]',
        turkish: '[data-testid="lang-tr"], [data-lang="tr"]',
        polish: '[data-testid="lang-pl"], [data-lang="pl"]'
      },

      // Error states
      errors: {
        connectionError: '[data-testid="connection-error"], .connection-error',
        loadingError: '[data-testid="loading-error"], .loading-error',
        rateLimit: '[data-testid="rate-limit"], .rate-limit-error'
      }
    };
  }

  /**
   * Navigate to workshop landing page with client key
   */
  async goToWorkshopPage(clientKey) {
    await this.goto(`/${clientKey}`);
    await this.waitForPageLoad();
    await this.handleCookieConsent();
  }

  /**
   * Wait for chat widget to load
   */
  async waitForChatWidget(timeout = 15000) {
    try {
      await this.waitForElement(this.selectors.widget.container, timeout);
      console.log('✅ Chat widget loaded');
      return true;
    } catch (error) {
      console.log(`❌ Chat widget failed to load: ${error.message}`);
      return false;
    }
  }

  /**
   * Open chat widget
   */
  async openChat() {
    console.log('💬 Opening chat widget...');
    
    if (await this.elementExists(this.selectors.widget.launcher)) {
      await this.clickElement(this.selectors.widget.launcher);
    }
    
    await this.waitForElement(this.selectors.widget.chatWindow, 10000);
    
    // Handle GDPR consent if it appears
    const consentHandled = await this.handleGDPRConsent();
    
    console.log(`✅ Chat opened${consentHandled ? ' (GDPR consent handled)' : ''}`);
    return { opened: true, consentHandled };
  }

  /**
   * Handle GDPR consent modal
   */
  async handleGDPRConsent() {
    if (await this.elementExists(this.selectors.gdpr.consentModal)) {
      console.log('🔒 Handling GDPR consent...');
      
      // Verify consent text is in German
      const consentText = await this.getTextContent(this.selectors.gdpr.consentText);
      const isGerman = consentText.toLowerCase().includes('datenschutz') || 
                      consentText.toLowerCase().includes('einverstand');
      
      await this.clickElement(this.selectors.gdpr.acceptButton);
      await this.page.waitForTimeout(1000);
      
      console.log(`✅ GDPR consent accepted (German: ${isGerman})`);
      return true;
    }
    return false;
  }

  /**
   * Send a message in the chat
   */
  async sendMessage(message) {
    console.log(`📤 Sending message: "${message}"`);
    
    await this.waitForElement(this.selectors.conversation.messageInput);
    await this.fillField(this.selectors.conversation.messageInput, message);
    await this.clickElement(this.selectors.conversation.sendButton);
    
    // Wait for message to appear in conversation
    await this.page.waitForTimeout(500);
    await this.waitForElement(this.selectors.conversation.userMessage);
    
    console.log('✅ Message sent');
  }

  /**
   * Wait for bot response
   */
  async waitForBotResponse(timeout = 15000) {
    console.log('⏳ Waiting for bot response...');
    
    try {
      // Wait for typing indicator to appear and disappear
      if (await this.elementExists(this.selectors.conversation.typingIndicator)) {
        await this.page.waitForSelector(this.selectors.conversation.typingIndicator, 
          { state: 'hidden', timeout: timeout });
      }

      // Wait for new bot message
      const botMessages = await this.page.$$(this.selectors.conversation.botMessage);
      const initialCount = botMessages.length;

      await this.page.waitForFunction(
        (selector, initialCount) => {
          const messages = document.querySelectorAll(selector);
          return messages.length > initialCount;
        },
        this.selectors.conversation.botMessage,
        initialCount,
        { timeout }
      );

      const response = await this.getLastBotMessage();
      console.log(`✅ Bot responded: "${response.substring(0, 50)}..."`);
      return response;

    } catch (error) {
      console.log(`❌ Bot response timeout: ${error.message}`);
      return null;
    }
  }

  /**
   * Get the last bot message
   */
  async getLastBotMessage() {
    const botMessages = await this.page.$$(this.selectors.conversation.botMessage);
    if (botMessages.length === 0) {
      throw new Error('No bot messages found');
    }

    const lastMessage = botMessages[botMessages.length - 1];
    return await lastMessage.textContent();
  }

  /**
   * Get all chat messages
   */
  async getAllMessages() {
    const userMessages = await this.page.$$eval(
      this.selectors.conversation.userMessage,
      elements => elements.map(el => ({ type: 'user', text: el.textContent.trim() }))
    );

    const botMessages = await this.page.$$eval(
      this.selectors.conversation.botMessage,
      elements => elements.map(el => ({ type: 'bot', text: el.textContent.trim() }))
    );

    // Combine and sort by DOM order (approximate)
    const allMessages = [...userMessages, ...botMessages];
    return allMessages;
  }

  /**
   * Trigger lead capture form
   */
  async triggerLeadCapture() {
    console.log('📋 Triggering lead capture...');
    
    // Send messages that typically trigger lead capture
    const triggerMessages = [
      'Ich brauche einen Termin',
      'Was kostet eine Inspektion?',
      'Können Sie mir helfen?',
      'Ich möchte einen Service buchen'
    ];

    for (const message of triggerMessages) {
      await this.sendMessage(message);
      await this.waitForBotResponse();
      
      // Check if lead form appeared
      if (await this.elementExists(this.selectors.leadForm.modal)) {
        console.log('✅ Lead capture form triggered');
        return true;
      }
      
      await this.page.waitForTimeout(2000);
    }

    console.log('⚠️ Lead capture form did not trigger');
    return false;
  }

  /**
   * Fill and submit lead form
   */
  async submitLeadForm(leadData) {
    console.log(`📝 Submitting lead form for: ${leadData.name}`);
    
    await this.waitForElement(this.selectors.leadForm.modal);
    
    // Fill form fields
    await this.fillField(this.selectors.leadForm.nameField, leadData.name);
    await this.fillField(this.selectors.leadForm.emailField, leadData.email);
    await this.fillField(this.selectors.leadForm.phoneField, leadData.phone);
    
    if (leadData.message && await this.elementExists(this.selectors.leadForm.messageField)) {
      await this.fillField(this.selectors.leadForm.messageField, leadData.message);
    }
    
    if (leadData.vehicle && await this.elementExists(this.selectors.leadForm.vehicleField)) {
      await this.fillField(this.selectors.leadForm.vehicleField, leadData.vehicle);
    }
    
    if (leadData.service && await this.elementExists(this.selectors.leadForm.serviceSelect)) {
      await this.selectOption(this.selectors.leadForm.serviceSelect, leadData.service);
    }
    
    if (leadData.urgency && await this.elementExists(this.selectors.leadForm.urgencySelect)) {
      await this.selectOption(this.selectors.leadForm.urgencySelect, leadData.urgency);
    }

    // Submit form
    await this.clickElement(this.selectors.leadForm.submitButton);
    
    // Wait for success message or confirmation
    try {
      await this.waitForElement(this.selectors.leadForm.successMessage, 10000);
      
      let confirmationNumber = null;
      if (await this.elementExists(this.selectors.leadForm.confirmationNumber)) {
        confirmationNumber = await this.getTextContent(this.selectors.leadForm.confirmationNumber);
      }
      
      console.log(`✅ Lead form submitted successfully${confirmationNumber ? ` (${confirmationNumber})` : ''}`);
      return { success: true, confirmationNumber };
      
    } catch (error) {
      console.log(`❌ Lead form submission failed: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  /**
   * Switch chat language
   */
  async switchLanguage(language) {
    console.log(`🌐 Switching to ${language} language...`);
    
    if (await this.elementExists(this.selectors.language.switcher)) {
      await this.clickElement(this.selectors.language.switcher);
      
      const languageSelector = this.selectors.language[language];
      if (languageSelector && await this.elementExists(languageSelector)) {
        await this.clickElement(languageSelector);
        await this.page.waitForTimeout(2000);
        
        console.log(`✅ Language switched to ${language}`);
        return true;
      }
    }
    
    console.log(`❌ Language switch to ${language} failed`);
    return false;
  }

  /**
   * Verify chat responses are in expected language
   */
  async verifyChatLanguage(expectedLanguage) {
    const lastResponse = await this.getLastBotMessage();
    
    const languageKeywords = {
      de: ['der', 'die', 'das', 'ich', 'sie', 'wir', 'haben', 'sind', 'können', 'Werkstatt', 'Auto'],
      en: ['the', 'and', 'we', 'can', 'help', 'service', 'car', 'workshop', 'appointment'],
      tr: ['ve', 'bir', 'için', 'var', 'bu', 'randevu', 'servis', 'araba'],
      pl: ['i', 'w', 'na', 'jest', 'się', 'wizyta', 'serwis', 'samochód']
    };

    const keywords = languageKeywords[expectedLanguage] || [];
    const foundKeywords = keywords.filter(keyword => 
      lastResponse.toLowerCase().includes(keyword.toLowerCase())
    );

    return {
      detectedLanguage: expectedLanguage,
      confidence: foundKeywords.length / keywords.length,
      foundKeywords,
      response: lastResponse
    };
  }

  /**
   * Test chat widget performance
   */
  async measureChatPerformance() {
    const performance = {
      widgetLoadTime: 0,
      messageResponseTime: 0,
      leadFormLoadTime: 0
    };

    // Measure widget load time
    const widgetStart = Date.now();
    await this.waitForChatWidget();
    performance.widgetLoadTime = Date.now() - widgetStart;

    // Measure message response time
    await this.openChat();
    const messageStart = Date.now();
    await this.sendMessage('Hallo, ich brauche Hilfe');
    await this.waitForBotResponse();
    performance.messageResponseTime = Date.now() - messageStart;

    // Measure lead form load time
    const formStart = Date.now();
    await this.triggerLeadCapture();
    if (await this.elementExists(this.selectors.leadForm.modal)) {
      performance.leadFormLoadTime = Date.now() - formStart;
    }

    return performance;
  }

  /**
   * Test chat widget on mobile viewport
   */
  async testMobileChat() {
    console.log('📱 Testing mobile chat widget...');
    
    // Switch to mobile viewport
    await this.page.setViewportSize({ width: 375, height: 667 });
    await this.page.waitForTimeout(1000);

    const mobileTests = {
      widgetVisible: await this.elementExists(this.selectors.widget.container),
      launcherClickable: false,
      chatWindowFitsScreen: false,
      keyboardHandling: false
    };

    // Test launcher functionality
    if (mobileTests.widgetVisible) {
      await this.openChat();
      mobileTests.launcherClickable = await this.elementExists(this.selectors.widget.chatWindow);
      
      // Test if chat window fits mobile screen
      const chatWindow = await this.page.$(this.selectors.widget.chatWindow);
      if (chatWindow) {
        const boundingBox = await chatWindow.boundingBox();
        mobileTests.chatWindowFitsScreen = boundingBox.width <= 375;
      }
      
      // Test keyboard handling
      await this.clickElement(this.selectors.conversation.messageInput);
      await this.page.keyboard.type('Mobile test message');
      mobileTests.keyboardHandling = true;
    }

    // Reset to desktop
    await this.page.setViewportSize({ width: 1280, height: 720 });
    
    console.log('✅ Mobile chat testing completed');
    return mobileTests;
  }

  /**
   * Close chat widget
   */
  async closeChat() {
    if (await this.elementExists(this.selectors.widget.minimizeButton)) {
      await this.clickElement(this.selectors.widget.minimizeButton);
      console.log('✅ Chat widget closed');
      return true;
    }
    return false;
  }

  /**
   * Verify workshop branding in chat
   */
  async verifyWorkshopBranding(expectedWorkshop) {
    const branding = {};
    
    if (await this.elementExists(this.selectors.widget.workshopName)) {
      branding.workshopName = await this.getTextContent(this.selectors.widget.workshopName);
      branding.nameMatches = branding.workshopName.includes(expectedWorkshop.name);
    }
    
    if (await this.elementExists(this.selectors.widget.header)) {
      branding.hasHeader = true;
      branding.headerText = await this.getTextContent(this.selectors.widget.header);
    }

    return branding;
  }
}

module.exports = { ChatWidgetPage };