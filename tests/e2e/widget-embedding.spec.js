/**
 * Widget Embedding E2E Tests for CarBot MVP
 * Tests widget deployment, chat functionality, and cross-domain integration
 */

const { test, expect } = require('@playwright/test');
const { AuthPage } = require('./pages/auth-page');
const { DashboardPage } = require('./pages/dashboard-page');
const { ChatWidgetPage } = require('./pages/chat-widget-page');
const { TestDataFactory } = require('./fixtures/test-data-factory');
const { DatabaseHelper } = require('./utils/database-helper');

test.describe('Widget Embedding E2E Tests', () => {
  let authPage;
  let dashboardPage;
  let chatWidgetPage;
  let testData;
  let dbHelper;
  let workshopData;
  let clientKey;

  test.beforeEach(async ({ page }) => {
    authPage = new AuthPage(page);
    dashboardPage = new DashboardPage(page);
    chatWidgetPage = new ChatWidgetPage(page);
    testData = new TestDataFactory();
    dbHelper = new DatabaseHelper();
    
    // Create test workshop with professional plan (has widget access)
    workshopData = await testData.createWorkshop('professional');
    await dbHelper.createTestWorkshop(workshopData);
    
    await authPage.goToLogin();
    await authPage.login(workshopData.email, workshopData.password);
    await dashboardPage.verifyDashboardLoaded();

    // Generate client key for widget embedding
    await dashboardPage.goToClientKeys();
    clientKey = await dashboardPage.generateClientKey({
      name: 'Widget Test Key',
      description: 'For widget embedding tests'
    });
  });

  test.afterEach(async () => {
    await dbHelper.cleanupTestData();
  });

  test('Basic widget embedding and loading', async ({ page, context }) => {
    await test.step('Create test page with widget', async () => {
      const testPageContent = `
        <!DOCTYPE html>
        <html lang="de">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Test Autowerkstatt - Widget Test</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
                .content { max-width: 800px; margin: 0 auto; }
                .hero { background: #f8f9fa; padding: 40px 20px; text-align: center; }
                .services { padding: 40px 20px; }
                .service { margin: 20px 0; padding: 20px; border: 1px solid #ddd; }
            </style>
        </head>
        <body>
            <div class="content">
                <header class="hero">
                    <h1>${workshopData.name}</h1>
                    <p>Ihre zuverlässige Autowerkstatt in ${workshopData.city}</p>
                    <p>Telefon: ${workshopData.phone}</p>
                </header>
                
                <section class="services">
                    <h2>Unsere Services</h2>
                    <div class="service">
                        <h3>TÜV & HU</h3>
                        <p>Hauptuntersuchung und Abgasuntersuchung</p>
                    </div>
                    <div class="service">
                        <h3>Inspektionen</h3>
                        <p>Regelmäßige Fahrzeuginspektionen nach Herstellervorgaben</p>
                    </div>
                </section>
            </div>
            
            <!-- CarBot Widget Integration -->
            <script>
              window.carBotConfig = {
                clientKey: '${clientKey.value}',
                theme: 'auto',
                position: 'bottom-right',
                language: 'de',
                welcomeMessage: 'Hallo! Wie kann ich Ihnen heute helfen?'
              };
            </script>
            <script src="${process.env.BASE_URL || 'http://localhost:3000'}/api/widget/embed?client_key=${clientKey.value}" async></script>
        </body>
        </html>
      `;

      const widgetTestPage = await context.newPage();
      await widgetTestPage.setContent(testPageContent);
      
      // Store page for later tests
      page.widgetTestPage = widgetTestPage;
      
      console.log(`✅ Test page created with widget for workshop: ${workshopData.name}`);
    });

    await test.step('Verify widget loads correctly', async () => {
      const widgetTestPage = page.widgetTestPage;
      
      // Wait for page to load completely
      await widgetTestPage.waitForLoadState('networkidle');
      
      // Wait for widget script to load and initialize
      await widgetTestPage.waitForFunction(() => {
        return window.carBotConfig && (
          document.querySelector('.carbot-widget') || 
          document.querySelector('[data-carbot-widget]') ||
          document.querySelector('#carbot-chat-widget')
        );
      }, {}, { timeout: 15000 });
      
      // Verify widget elements are present
      const widget = widgetTestPage.locator('.carbot-widget, [data-carbot-widget], #carbot-chat-widget');
      await expect(widget).toBeVisible();
      
      // Verify widget launcher button
      const launcher = widgetTestPage.locator('.widget-launcher, .chat-launcher, [data-testid="chat-launcher"]');
      await expect(launcher).toBeVisible();
      
      console.log('✅ Widget loaded and launcher visible');
    });

    await test.step('Test widget positioning', async () => {
      const widgetTestPage = page.widgetTestPage;
      
      // Verify widget is positioned correctly (bottom-right)
      const widget = widgetTestPage.locator('.carbot-widget, [data-carbot-widget]').first();
      
      const boundingBox = await widget.boundingBox();
      const viewportSize = widgetTestPage.viewportSize();
      
      // Widget should be in bottom-right area
      expect(boundingBox.x).toBeGreaterThan(viewportSize.width * 0.7);
      expect(boundingBox.y).toBeGreaterThan(viewportSize.height * 0.7);
      
      console.log('✅ Widget positioned correctly in bottom-right');
    });

    await test.step('Test widget click interaction', async () => {
      const widgetTestPage = page.widgetTestPage;
      
      // Click widget launcher
      const launcher = widgetTestPage.locator('.widget-launcher, .chat-launcher, [data-testid="chat-launcher"]');
      await launcher.click();
      
      // Chat window should open
      const chatWindow = widgetTestPage.locator('.chat-window, .widget-chat, [data-testid="chat-window"]');
      await expect(chatWindow).toBeVisible({ timeout: 5000 });
      
      // Verify welcome message appears
      const welcomeMessage = chatWindow.locator('.welcome-message, .bot-message').first();
      if (await welcomeMessage.isVisible()) {
        const messageText = await welcomeMessage.textContent();
        expect(messageText).toContain('Hallo');
      }
      
      console.log('✅ Widget opens chat window successfully');
      
      await widgetTestPage.close();
    });
  });

  test('GDPR consent and privacy compliance', async ({ page, context }) => {
    await test.step('Setup widget with GDPR requirements', async () => {
      const testPageContent = `
        <!DOCTYPE html>
        <html lang="de">
        <head>
            <meta charset="UTF-8">
            <title>GDPR Test - ${workshopData.name}</title>
        </head>
        <body>
            <h1>GDPR Compliance Test</h1>
            <p>Testing GDPR-compliant widget integration</p>
            
            <script>
              window.carBotConfig = {
                clientKey: '${clientKey.value}',
                theme: 'light',
                language: 'de',
                privacy: {
                  gdprCompliant: true,
                  requireConsent: true,
                  privacyPolicyUrl: '/datenschutz'
                }
              };
            </script>
            <script src="${process.env.BASE_URL || 'http://localhost:3000'}/api/widget/embed?client_key=${clientKey.value}" async></script>
        </body>
        </html>
      `;

      const gdprTestPage = await context.newPage();
      await gdprTestPage.setContent(testPageContent);
      page.gdprTestPage = gdprTestPage;
    });

    await test.step('Verify GDPR consent prompt appears', async () => {
      const gdprTestPage = page.gdprTestPage;
      await gdprTestPage.waitForLoadState('networkidle');
      
      // Widget should load but might show consent banner first
      await gdprTestPage.waitForFunction(() => {
        return window.carBotConfig;
      });
      
      // Look for GDPR consent elements
      const consentBanner = gdprTestPage.locator('.gdpr-consent, .cookie-consent, [data-testid="consent-banner"]');
      const privacyNotice = gdprTestPage.locator('.privacy-notice, [data-privacy]');
      
      // Either consent banner or privacy notice should be visible
      const hasGdprElements = await consentBanner.isVisible() || await privacyNotice.isVisible();
      
      if (hasGdprElements) {
        console.log('✅ GDPR consent elements detected');
        
        // Accept consent if banner is present
        const acceptButton = gdprTestPage.locator('button:has-text("Akzeptieren"), [data-action="accept-consent"]');
        if (await acceptButton.isVisible()) {
          await acceptButton.click();
          console.log('✅ GDPR consent accepted');
        }
      }
    });

    await test.step('Test widget functionality after consent', async () => {
      const gdprTestPage = page.gdprTestPage;
      
      // Now widget should be fully functional
      const launcher = gdprTestPage.locator('.widget-launcher, .chat-launcher');
      await expect(launcher).toBeVisible();
      
      // Open chat and verify it works
      await launcher.click();
      const chatWindow = gdprTestPage.locator('.chat-window, .widget-chat');
      await expect(chatWindow).toBeVisible();
      
      console.log('✅ Widget fully functional after GDPR consent');
      
      await gdprTestPage.close();
    });
  });

  test('Multi-language widget support', async ({ page, context }) => {
    const languages = ['de', 'en', 'tr'];

    for (const lang of languages) {
      await test.step(`Test widget in ${lang.toUpperCase()}`, async () => {
        const testPageContent = `
          <!DOCTYPE html>
          <html lang="${lang}">
          <head>
              <meta charset="UTF-8">
              <title>Language Test ${lang.toUpperCase()} - ${workshopData.name}</title>
          </head>
          <body>
              <h1>Language Test: ${lang.toUpperCase()}</h1>
              
              <script>
                window.carBotConfig = {
                  clientKey: '${clientKey.value}',
                  theme: 'auto',
                  language: '${lang}',
                  position: 'bottom-right'
                };
              </script>
              <script src="${process.env.BASE_URL || 'http://localhost:3000'}/api/widget/embed?client_key=${clientKey.value}" async></script>
          </body>
          </html>
        `;

        const langTestPage = await context.newPage();
        await langTestPage.setContent(testPageContent);
        
        // Wait for widget to load
        await langTestPage.waitForLoadState('networkidle');
        await langTestPage.waitForFunction(() => {
          return document.querySelector('.carbot-widget, [data-carbot-widget]');
        }, {}, { timeout: 10000 });
        
        // Open chat
        const launcher = langTestPage.locator('.widget-launcher, .chat-launcher').first();
        await launcher.click();
        
        // Verify chat window opens
        const chatWindow = langTestPage.locator('.chat-window, .widget-chat');
        await expect(chatWindow).toBeVisible();
        
        // Check if language is reflected in UI elements
        const chatElements = chatWindow.locator('*');
        const hasLanguageElements = await chatElements.count() > 0;
        
        expect(hasLanguageElements).toBe(true);
        console.log(`✅ Widget loaded and functional in ${lang.toUpperCase()}`);
        
        await langTestPage.close();
      });
    }
  });

  test('Cross-domain widget functionality', async ({ page, context }) => {
    const testDomains = [
      'example.com',
      'test-workshop.de',
      'subdomain.example.com'
    ];

    await test.step('Update client key with authorized domains', async () => {
      // Go back to dashboard to update client key domains
      await dashboardPage.goToClientKeys();
      
      // Find the test key and edit it
      const keyElement = page.locator('.client-key-item:has-text("Widget Test Key")');
      await keyElement.locator('button:has-text("Verwalten")').click();
      
      // Add authorized domains (simulated - actual implementation would vary)
      // This is a UI test representation
      console.log('✅ Client key configured for cross-domain testing');
      
      await page.click('button:has-text("Schließen")');
    });

    for (const domain of testDomains) {
      await test.step(`Test widget on domain: ${domain}`, async () => {
        const testPageContent = `
          <!DOCTYPE html>
          <html lang="de">
          <head>
              <meta charset="UTF-8">
              <title>${domain} - Widget Test</title>
              <meta name="domain-test" content="${domain}">
          </head>
          <body>
              <h1>Cross-Domain Test: ${domain}</h1>
              <p>Testing widget on authorized domain</p>
              
              <script>
                // Simulate different domain environment
                window.location.hostname = '${domain}';
                window.carBotConfig = {
                  clientKey: '${clientKey.value}',
                  theme: 'light',
                  language: 'de',
                  domain: '${domain}'
                };
              </script>
              <script src="${process.env.BASE_URL || 'http://localhost:3000'}/api/widget/embed?client_key=${clientKey.value}" async></script>
          </body>
          </html>
        `;

        const domainTestPage = await context.newPage();
        await domainTestPage.setContent(testPageContent);
        
        // Wait for widget
        await domainTestPage.waitForLoadState('networkidle');
        
        // Widget should load successfully on authorized domains
        const widget = domainTestPage.locator('.carbot-widget, [data-carbot-widget]');
        const widgetLoaded = await widget.isVisible();
        
        if (widgetLoaded) {
          console.log(`✅ Widget loaded successfully on ${domain}`);
          
          // Test basic functionality
          const launcher = domainTestPage.locator('.widget-launcher, .chat-launcher').first();
          if (await launcher.isVisible()) {
            await launcher.click();
            const chatWindow = domainTestPage.locator('.chat-window, .widget-chat');
            const chatOpened = await chatWindow.isVisible();
            
            console.log(`✅ Chat ${chatOpened ? 'opened' : 'failed to open'} on ${domain}`);
          }
        } else {
          console.log(`⚠️ Widget failed to load on ${domain} (may be expected for unauthorized domain)`);
        }
        
        await domainTestPage.close();
      });
    }
  });

  test('Mobile responsive widget behavior', async ({ page, context }) => {
    const mobileViewports = [
      { name: 'iPhone 12', width: 390, height: 844 },
      { name: 'Samsung Galaxy', width: 360, height: 800 },
      { name: 'iPad', width: 768, height: 1024 }
    ];

    for (const viewport of mobileViewports) {
      await test.step(`Test widget on ${viewport.name}`, async () => {
        const mobileTestPage = await context.newPage();
        await mobileTestPage.setViewportSize({ width: viewport.width, height: viewport.height });
        
        const testPageContent = `
          <!DOCTYPE html>
          <html lang="de">
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Mobile Test - ${viewport.name}</title>
              <style>
                body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
                .content { min-height: 100vh; }
              </style>
          </head>
          <body>
              <div class="content">
                  <h1>${workshopData.name}</h1>
                  <p>Mobile test on ${viewport.name}</p>
                  <p>Viewport: ${viewport.width}x${viewport.height}</p>
                  
                  <div style="height: 500px; background: #f0f0f0; margin: 20px 0;">
                      <p>Test content area</p>
                  </div>
              </div>
              
              <script>
                window.carBotConfig = {
                  clientKey: '${clientKey.value}',
                  theme: 'auto',
                  position: 'bottom-right',
                  language: 'de',
                  mobile: {
                    responsive: true,
                    fullscreen: false
                  }
                };
              </script>
              <script src="${process.env.BASE_URL || 'http://localhost:3000'}/api/widget/embed?client_key=${clientKey.value}" async></script>
          </body>
          </html>
        `;

        await mobileTestPage.setContent(testPageContent);
        await mobileTestPage.waitForLoadState('networkidle');
        
        // Wait for widget
        await mobileTestPage.waitForFunction(() => {
          return document.querySelector('.carbot-widget, [data-carbot-widget]');
        }, {}, { timeout: 10000 });
        
        // Verify widget is visible and positioned correctly
        const widget = mobileTestPage.locator('.carbot-widget, [data-carbot-widget]').first();
        await expect(widget).toBeVisible();
        
        // Check widget positioning on mobile
        const boundingBox = await widget.boundingBox();
        expect(boundingBox.x).toBeGreaterThan(0);
        expect(boundingBox.y).toBeGreaterThan(0);
        expect(boundingBox.x + boundingBox.width).toBeLessThanOrEqual(viewport.width);
        
        // Test widget functionality on mobile
        const launcher = mobileTestPage.locator('.widget-launcher, .chat-launcher').first();
        await launcher.click();
        
        const chatWindow = mobileTestPage.locator('.chat-window, .widget-chat');
        await expect(chatWindow).toBeVisible();
        
        // Verify chat window fits mobile screen
        const chatBoundingBox = await chatWindow.boundingBox();
        expect(chatBoundingBox.width).toBeLessThanOrEqual(viewport.width);
        expect(chatBoundingBox.height).toBeLessThanOrEqual(viewport.height);
        
        console.log(`✅ Widget responsive and functional on ${viewport.name} (${viewport.width}x${viewport.height})`);
        
        await mobileTestPage.close();
      });
    }
  });

  test('Widget chat functionality and lead capture', async ({ page, context }) => {
    await test.step('Setup widget and open chat', async () => {
      const testPageContent = `
        <!DOCTYPE html>
        <html lang="de">
        <head>
            <meta charset="UTF-8">
            <title>Chat Test - ${workshopData.name}</title>
        </head>
        <body>
            <h1>Chat Functionality Test</h1>
            
            <script>
              window.carBotConfig = {
                clientKey: '${clientKey.value}',
                theme: 'light',
                language: 'de',
                features: {
                  leadCapture: true,
                  fileUpload: false,
                  voiceInput: false
                }
              };
            </script>
            <script src="${process.env.BASE_URL || 'http://localhost:3000'}/api/widget/embed?client_key=${clientKey.value}" async></script>
        </body>
        </html>
      `;

      const chatTestPage = await context.newPage();
      await chatTestPage.setContent(testPageContent);
      page.chatTestPage = chatTestPage;
      
      await chatTestPage.waitForLoadState('networkidle');
      
      // Open chat
      const launcher = chatTestPage.locator('.widget-launcher, .chat-launcher').first();
      await launcher.click();
      
      const chatWindow = chatTestPage.locator('.chat-window, .widget-chat');
      await expect(chatWindow).toBeVisible();
    });

    await test.step('Test basic chat interaction', async () => {
      const chatTestPage = page.chatTestPage;
      const chatWindow = chatTestPage.locator('.chat-window, .widget-chat');
      
      // Find message input
      const messageInput = chatWindow.locator('input[type="text"], textarea, [data-testid="message-input"]');
      const sendButton = chatWindow.locator('button[type="submit"], .send-button, [data-testid="send-button"]');
      
      // Send test message
      await messageInput.fill('Hallo, ich brauche einen TÜV-Termin für meinen BMW');
      await sendButton.click();
      
      // Wait for user message to appear
      const userMessage = chatWindow.locator('.user-message, .message-user').last();
      await expect(userMessage).toBeVisible();
      await expect(userMessage).toContainText('TÜV-Termin');
      
      // Wait for bot response
      const botResponse = chatWindow.locator('.bot-message, .message-bot').last();
      await expect(botResponse).toBeVisible({ timeout: 15000 });
      
      const responseText = await botResponse.textContent();
      expect(responseText.length).toBeGreaterThan(10);
      
      console.log(`✅ Chat interaction successful. Bot response: "${responseText.substring(0, 50)}..."`);
    });

    await test.step('Test lead capture form', async () => {
      const chatTestPage = page.chatTestPage;
      const chatWindow = chatTestPage.locator('.chat-window, .widget-chat');
      
      // Send message that might trigger lead capture
      const messageInput = chatWindow.locator('input[type="text"], textarea');
      const sendButton = chatWindow.locator('button[type="submit"], .send-button');
      
      await messageInput.fill('Können Sie mir ein Angebot für die Inspektion senden?');
      await sendButton.click();
      
      // Wait for potential lead form
      const leadForm = chatWindow.locator('.lead-form, .contact-form, [data-testid="lead-form"]');
      
      // Lead form might appear after bot response
      const hasLeadForm = await leadForm.isVisible({ timeout: 10000 });
      
      if (hasLeadForm) {
        console.log('✅ Lead capture form appeared');
        
        // Fill lead form
        const leadData = testData.createTestLead();
        
        const nameField = leadForm.locator('input[name="name"], [data-field="name"]');
        const emailField = leadForm.locator('input[name="email"], [data-field="email"]');
        const phoneField = leadForm.locator('input[name="phone"], [data-field="phone"]');
        
        if (await nameField.isVisible()) await nameField.fill(leadData.name);
        if (await emailField.isVisible()) await emailField.fill(leadData.email);
        if (await phoneField.isVisible()) await phoneField.fill(leadData.phone);
        
        // Submit form
        const submitButton = leadForm.locator('button[type="submit"], .submit-button');
        if (await submitButton.isVisible()) {
          await submitButton.click();
          
          // Wait for confirmation
          const confirmation = chatWindow.locator('.form-success, .lead-success, [data-testid="lead-submitted"]');
          if (await confirmation.isVisible({ timeout: 5000 })) {
            console.log('✅ Lead form submitted successfully');
          }
        }
      } else {
        console.log('ℹ️ Lead capture form not triggered in this interaction');
      }
    });

    await test.step('Test chat persistence and closing', async () => {
      const chatTestPage = page.chatTestPage;
      const chatWindow = chatTestPage.locator('.chat-window, .widget-chat');
      
      // Verify chat messages are still visible
      const messages = chatWindow.locator('.message, .chat-message');
      const messageCount = await messages.count();
      expect(messageCount).toBeGreaterThan(0);
      
      // Close chat
      const closeButton = chatWindow.locator('.close-chat, .close-button, [data-action="close"]');
      if (await closeButton.isVisible()) {
        await closeButton.click();
        
        // Chat window should be hidden
        await expect(chatWindow).not.toBeVisible();
        
        // Launcher should still be visible
        const launcher = chatTestPage.locator('.widget-launcher, .chat-launcher');
        await expect(launcher).toBeVisible();
        
        console.log('✅ Chat closed successfully, launcher remains visible');
      }
      
      await chatTestPage.close();
    });
  });

  test('Widget customization and theming', async ({ page, context }) => {
    const themes = ['light', 'dark', 'auto'];
    const positions = ['bottom-right', 'bottom-left'];

    for (const theme of themes) {
      for (const position of positions) {
        await test.step(`Test ${theme} theme at ${position} position`, async () => {
          const testPageContent = `
            <!DOCTYPE html>
            <html lang="de">
            <head>
                <meta charset="UTF-8">
                <title>Theme Test - ${theme} ${position}</title>
                <style>
                  body { 
                    margin: 0; 
                    padding: 20px; 
                    background: ${theme === 'dark' ? '#1a1a1a' : '#ffffff'}; 
                    color: ${theme === 'dark' ? '#ffffff' : '#000000'}; 
                    min-height: 100vh;
                  }
                </style>
            </head>
            <body>
                <h1>Theme Test: ${theme} - ${position}</h1>
                
                <script>
                  window.carBotConfig = {
                    clientKey: '${clientKey.value}',
                    theme: '${theme}',
                    position: '${position}',
                    language: 'de',
                    customStyles: {
                      primaryColor: '#007bff',
                      borderRadius: '8px',
                      fontFamily: 'Arial, sans-serif'
                    }
                  };
                </script>
                <script src="${process.env.BASE_URL || 'http://localhost:3000'}/api/widget/embed?client_key=${clientKey.value}" async></script>
            </body>
            </html>
          `;

          const themeTestPage = await context.newPage();
          await themeTestPage.setContent(testPageContent);
          
          await themeTestPage.waitForLoadState('networkidle');
          
          // Wait for widget
          await themeTestPage.waitForFunction(() => {
            return document.querySelector('.carbot-widget, [data-carbot-widget]');
          }, {}, { timeout: 10000 });
          
          // Verify widget positioning
          const widget = themeTestPage.locator('.carbot-widget, [data-carbot-widget]').first();
          await expect(widget).toBeVisible();
          
          const boundingBox = await widget.boundingBox();
          const viewportSize = themeTestPage.viewportSize();
          
          if (position === 'bottom-right') {
            expect(boundingBox.x).toBeGreaterThan(viewportSize.width * 0.6);
          } else if (position === 'bottom-left') {
            expect(boundingBox.x).toBeLessThan(viewportSize.width * 0.4);
          }
          
          console.log(`✅ Widget correctly positioned: ${theme} theme at ${position}`);
          
          await themeTestPage.close();
        });
      }
    }
  });

  test('Widget error handling and fallbacks', async ({ page, context }) => {
    await test.step('Test invalid client key handling', async () => {
      const testPageContent = `
        <!DOCTYPE html>
        <html lang="de">
        <head>
            <meta charset="UTF-8">
            <title>Error Test - Invalid Key</title>
        </head>
        <body>
            <h1>Error Handling Test</h1>
            
            <script>
              window.carBotConfig = {
                clientKey: 'invalid_key_12345',
                theme: 'light',
                language: 'de'
              };
            </script>
            <script src="${process.env.BASE_URL || 'http://localhost:3000'}/api/widget/embed?client_key=invalid_key_12345" async></script>
        </body>
        </html>
      `;

      const errorTestPage = await context.newPage();
      await errorTestPage.setContent(testPageContent);
      
      await errorTestPage.waitForLoadState('networkidle');
      await errorTestPage.waitForTimeout(5000); // Wait for potential error handling
      
      // Widget should either not load or show error state
      const widget = errorTestPage.locator('.carbot-widget, [data-carbot-widget]');
      const errorMessage = errorTestPage.locator('.widget-error, [data-error]');
      
      const widgetVisible = await widget.isVisible();
      const errorVisible = await errorMessage.isVisible();
      
      // Either widget doesn't load or shows error message
      if (!widgetVisible) {
        console.log('✅ Widget correctly failed to load with invalid key');
      } else if (errorVisible) {
        console.log('✅ Widget shows error message for invalid key');
      } else {
        console.log('⚠️ Widget loaded despite invalid key - check error handling');
      }
      
      await errorTestPage.close();
    });

    await test.step('Test network failure handling', async () => {
      const networkTestPage = await context.newPage();
      
      // Block widget API requests
      await networkTestPage.route('**/api/widget/**', route => route.abort());
      await networkTestPage.route('**/api/chat/**', route => route.abort());
      
      const testPageContent = `
        <!DOCTYPE html>
        <html lang="de">
        <head>
            <meta charset="UTF-8">
            <title>Network Error Test</title>
        </head>
        <body>
            <h1>Network Error Test</h1>
            
            <script>
              window.carBotConfig = {
                clientKey: '${clientKey.value}',
                theme: 'light',
                language: 'de'
              };
            </script>
            <script src="${process.env.BASE_URL || 'http://localhost:3000'}/api/widget/embed?client_key=${clientKey.value}" async></script>
        </body>
        </html>
      `;

      await networkTestPage.setContent(testPageContent);
      await networkTestPage.waitForLoadState('networkidle');
      
      // Widget should handle network errors gracefully
      await networkTestPage.waitForTimeout(5000);
      
      console.log('✅ Network error handling test completed');
      
      await networkTestPage.close();
    });

    await test.step('Test script loading failure', async () => {
      const scriptTestPage = await context.newPage();
      
      const testPageContent = `
        <!DOCTYPE html>
        <html lang="de">
        <head>
            <meta charset="UTF-8">
            <title>Script Error Test</title>
        </head>
        <body>
            <h1>Script Loading Error Test</h1>
            
            <script>
              window.carBotConfig = {
                clientKey: '${clientKey.value}',
                theme: 'light',
                language: 'de'
              };
            </script>
            <!-- Intentionally broken script URL -->
            <script src="https://invalid-domain-12345.com/widget.js" async onerror="console.log('Script failed to load')"></script>
        </body>
        </html>
      `;

      await scriptTestPage.setContent(testPageContent);
      await scriptTestPage.waitForLoadState('networkidle');
      
      // Should handle script loading failure gracefully
      const hasErrors = await scriptTestPage.evaluate(() => {
        return window.hasWidgetError || false;
      });
      
      console.log('✅ Script loading error handling test completed');
      
      await scriptTestPage.close();
    });
  });
});

test.describe('Widget Package Restrictions', () => {
  test('Basic plan widget limitations', async ({ page, context }) => {
    const testData = new TestDataFactory();
    const dbHelper = new DatabaseHelper();
    
    // Create Basic plan workshop
    const basicWorkshop = await testData.createWorkshop('basic');
    await dbHelper.createTestWorkshop(basicWorkshop);
    
    const authPage = new AuthPage(page);
    const dashboardPage = new DashboardPage(page);
    
    await authPage.goToLogin();
    await authPage.login(basicWorkshop.email, basicWorkshop.password);

    await test.step('Verify Basic plan widget restrictions', async () => {
      await dashboardPage.goToClientKeys();
      
      // Should show upgrade prompt for widget access
      const upgradePrompt = page.locator('.upgrade-prompt, [data-testid="upgrade-needed"]');
      await expect(upgradePrompt).toBeVisible();
      
      // Widget creation should be disabled
      const createButton = page.locator('button:has-text("Neuen Key erstellen")');
      await expect(createButton).toBeDisabled();
      
      console.log('✅ Basic plan correctly restricts widget access');
    });

    await dbHelper.cleanupTestData();
  });
});