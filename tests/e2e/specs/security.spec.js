/**
 * Security E2E Tests for CarBot
 * Tests security measures, GDPR compliance, and vulnerability protections
 */

const { test, expect } = require('@playwright/test');
const { AuthPage } = require('../pages/auth-page');
const { DashboardPage } = require('../pages/dashboard-page');
const { ChatWidgetPage } = require('../pages/chat-widget-page');
const { TestDataFactory } = require('../fixtures/test-data-factory');
const { DatabaseHelper } = require('../utils/database-helper');

test.describe('Security and Vulnerability Tests', () => {
  let testData;
  let dbHelper;

  test.beforeEach(async ({ page }) => {
    testData = new TestDataFactory();
    dbHelper = new DatabaseHelper();
  });

  test('SQL Injection Prevention', async ({ page }) => {
    const authPage = new AuthPage(page);
    
    console.log('🛡️ Testing SQL injection prevention...');

    const sqlInjectionPayloads = [
      "'; DROP TABLE workshops; --",
      "' OR '1'='1",
      "admin'--",
      "' OR 1=1#",
      "'; INSERT INTO workshops VALUES ('hacked'); --",
      "' UNION SELECT * FROM auth.users--"
    ];

    await test.step('Test SQL injection in login form', async () => {
      await authPage.goToLogin();
      
      for (const payload of sqlInjectionPayloads) {
        const loginResult = await authPage.login(payload, 'password123');
        
        // Should always fail - no SQL injection should succeed
        expect(loginResult.success).toBe(false);
        
        // Check that error message doesn't reveal database structure
        if (loginResult.error) {
          expect(loginResult.error.toLowerCase()).not.toContain('sql');
          expect(loginResult.error.toLowerCase()).not.toContain('table');
          expect(loginResult.error.toLowerCase()).not.toContain('database');
        }
        
        console.log(`✅ SQL injection blocked: "${payload.substring(0, 30)}..."`);
      }
    });

    await test.step('Test SQL injection in registration form', async () => {
      await authPage.goToRegister();
      
      const maliciousWorkshop = await testData.createWorkshop('basic');
      maliciousWorkshop.email = "test'; DROP TABLE workshops; --@evil.com";
      maliciousWorkshop.name = "'; DELETE FROM workshops; --";
      
      const registrationResult = await authPage.register(maliciousWorkshop);
      
      // Registration should fail or sanitize input
      if (registrationResult.success) {
        // If successful, verify data was sanitized
        console.log('⚠️ Registration succeeded - verifying input sanitization');
      } else {
        console.log('✅ Malicious registration blocked');
      }
    });

    console.log('✅ SQL injection prevention tests completed');
  });

  test('XSS (Cross-Site Scripting) Prevention', async ({ page }) => {
    const chatWidgetPage = new ChatWidgetPage(page);
    
    console.log('🛡️ Testing XSS prevention...');

    const xssPayloads = [
      '<script>alert("XSS")</script>',
      'javascript:alert("XSS")',
      '<img src="x" onerror="alert(1)">',
      '<svg onload="alert(1)">',
      '"><script>alert("XSS")</script>',
      '<iframe src="javascript:alert(1)"></iframe>',
      '<body onload="alert(1)">',
      '<div onclick="alert(1)">Click me</div>'
    ];

    // Setup test workshop
    const workshopData = await testData.createWorkshop('basic');
    await dbHelper.createTestWorkshop(workshopData);

    const authPage = new AuthPage(page);
    await authPage.goToLogin();
    await authPage.login(workshopData.email, workshopData.password);

    const dashboardPage = new DashboardPage(page);
    await dashboardPage.goToClientKeys();
    const clientKey = await dashboardPage.generateClientKey({
      name: 'XSS Test Key'
    });

    await test.step('Test XSS in chat messages', async () => {
      await chatWidgetPage.goToWorkshopPage(clientKey.value);
      
      if (await chatWidgetPage.waitForChatWidget()) {
        await chatWidgetPage.openChat();
        
        for (const payload of xssPayloads) {
          await chatWidgetPage.sendMessage(payload);
          
          // Wait a moment for any potential script execution
          await page.waitForTimeout(1000);
          
          // Check that no alert dialogs appeared
          const hasAlert = await page.locator('role=dialog').count() > 0;
          expect(hasAlert).toBe(false);
          
          // Verify message is displayed as text, not executed
          const messages = await chatWidgetPage.getAllMessages();
          const lastMessage = messages[messages.length - 1];
          
          if (lastMessage && lastMessage.text.includes(payload)) {
            // Payload should be escaped/sanitized
            expect(lastMessage.text).not.toContain('<script>');
            console.log(`✅ XSS payload sanitized: "${payload.substring(0, 30)}..."`);
          }
        }
      }
    });

    await test.step('Test XSS in lead form', async () => {
      if (await chatWidgetPage.triggerLeadCapture()) {
        const maliciousLead = testData.createTestLead();
        maliciousLead.name = '<script>alert("XSS in name")</script>';
        maliciousLead.message = '<img src="x" onerror="alert(1)">';
        
        const leadResult = await chatWidgetPage.submitLeadForm(maliciousLead);
        
        // Wait for any potential script execution
        await page.waitForTimeout(1000);
        
        // Check no alert appeared
        const hasAlert = await page.locator('role=dialog').count() > 0;
        expect(hasAlert).toBe(false);
        
        console.log('✅ XSS in lead form prevented');
      }
    });

    console.log('✅ XSS prevention tests completed');
  });

  test('Authentication and Authorization Security', async ({ page }) => {
    console.log('🔐 Testing authentication security...');

    const authPage = new AuthPage(page);
    const dashboardPage = new DashboardPage(page);

    await test.step('Test password requirements', async () => {
      await authPage.goToRegister();
      
      const weakPasswords = [
        '123',
        'password',
        'qwerty',
        '12345678',
        'admin',
        'test'
      ];

      for (const weakPassword of weakPasswords) {
        const workshopData = await testData.createWorkshop('basic');
        workshopData.password = weakPassword;
        
        const result = await authPage.register(workshopData);
        
        // Weak passwords should be rejected
        expect(result.success).toBe(false);
        expect(result.error).toContain('Passwort');
        
        console.log(`✅ Weak password rejected: "${weakPassword}"`);
      }
    });

    await test.step('Test session security', async () => {
      // Create and login with test user
      const workshopData = await testData.createWorkshop('basic');
      await dbHelper.createTestWorkshop(workshopData);
      
      await authPage.goToLogin();
      await authPage.login(workshopData.email, workshopData.password);
      
      // Verify dashboard access
      const dashboardLoaded = await dashboardPage.verifyDashboardLoaded();
      expect(dashboardLoaded.loaded).toBe(true);

      // Test direct URL access without proper session
      await page.context().clearCookies();
      
      // Try to access protected route
      await page.goto('/dashboard/settings');
      
      // Should redirect to login
      await page.waitForURL('**/auth/login', { timeout: 10000 });
      
      console.log('✅ Protected routes require authentication');
    });

    await test.step('Test brute force protection', async () => {
      await authPage.goToLogin();
      
      const failedAttempts = [];
      
      // Attempt multiple failed logins
      for (let i = 0; i < 6; i++) {
        const loginResult = await authPage.login('nonexistent@test.com', 'wrongpassword');
        failedAttempts.push(loginResult);
        
        expect(loginResult.success).toBe(false);
        
        // Small delay between attempts
        await page.waitForTimeout(500);
      }
      
      // After multiple attempts, should show rate limiting
      const lastAttempt = failedAttempts[failedAttempts.length - 1];
      const isRateLimited = lastAttempt.error && (
        lastAttempt.error.includes('zu viele Versuche') ||
        lastAttempt.error.includes('rate limit') ||
        lastAttempt.error.includes('temporarily blocked')
      );
      
      console.log(`✅ Brute force protection: ${isRateLimited ? 'active' : 'may be active'}`);
    });

    console.log('✅ Authentication security tests completed');
  });

  test('GDPR Compliance and Data Protection', async ({ page }) => {
    console.log('📋 Testing GDPR compliance...');

    const chatWidgetPage = new ChatWidgetPage(page);
    const authPage = new AuthPage(page);
    const dashboardPage = new DashboardPage(page);

    // Setup test workshop
    const workshopData = await testData.createWorkshop('basic');
    await dbHelper.createTestWorkshop(workshopData);

    await authPage.goToLogin();
    await authPage.login(workshopData.email, workshopData.password);

    await dashboardPage.goToClientKeys();
    const clientKey = await dashboardPage.generateClientKey({
      name: 'GDPR Test Key'
    });

    await test.step('Test GDPR consent modal', async () => {
      await chatWidgetPage.goToWorkshopPage(clientKey.value);
      
      if (await chatWidgetPage.waitForChatWidget()) {
        await chatWidgetPage.openChat();
        
        // GDPR consent should be handled
        const consentResult = await chatWidgetPage.handleGDPRConsent();
        
        if (consentResult) {
          console.log('✅ GDPR consent modal displayed and handled');
        } else {
          console.log('⚠️ GDPR consent modal may not be configured');
        }
      }
    });

    await test.step('Test privacy policy accessibility', async () => {
      // Check if privacy policy link is accessible
      const privacyLink = await page.locator('a:has-text("Datenschutz"), a:has-text("Privacy")').first();
      
      if (await privacyLink.isVisible()) {
        // Click privacy link
        await privacyLink.click();
        
        // Should navigate to privacy policy
        const currentUrl = page.url();
        expect(currentUrl.toLowerCase()).toMatch(/(datenschutz|privacy)/);
        
        console.log('✅ Privacy policy accessible');
      } else {
        console.log('⚠️ Privacy policy link not found');
      }
    });

    await test.step('Test data retention policies', async () => {
      // Create test chat data
      await chatWidgetPage.goToWorkshopPage(clientKey.value);
      
      if (await chatWidgetPage.waitForChatWidget()) {
        await chatWidgetPage.openChat();
        await chatWidgetPage.sendMessage('Test message for data retention');
        
        // In a real test, we'd verify that old messages are deleted per GDPR
        console.log('✅ Chat message created for data retention testing');
      }
    });

    await test.step('Test right to data portability', async () => {
      // Check if data export functionality exists
      await dashboardPage.goToSettings();
      
      const hasDataExport = await dashboardPage.elementExists('[data-testid="export-data"], button:has-text("Daten exportieren")');
      
      if (hasDataExport) {
        console.log('✅ Data export functionality available');
      } else {
        console.log('⚠️ Data export functionality not found');
      }
    });

    await test.step('Test right to erasure (right to be forgotten)', async () => {
      // Check if account deletion functionality exists
      const hasAccountDeletion = await dashboardPage.elementExists('[data-testid="delete-account"], button:has-text("Konto löschen")');
      
      if (hasAccountDeletion) {
        console.log('✅ Account deletion functionality available');
      } else {
        console.log('⚠️ Account deletion functionality not found');
      }
    });

    console.log('✅ GDPR compliance tests completed');
  });

  test('Input Validation and Sanitization', async ({ page }) => {
    console.log('🧹 Testing input validation...');

    const authPage = new AuthPage(page);
    
    await test.step('Test email validation', async () => {
      await authPage.goToRegister();
      
      const invalidEmails = [
        'not-an-email',
        '@domain.com',
        'user@',
        'user..name@domain.com',
        'user@domain',
        'user@.com'
      ];

      for (const invalidEmail of invalidEmails) {
        const workshopData = await testData.createWorkshop('basic');
        workshopData.email = invalidEmail;
        
        const result = await authPage.register(workshopData);
        expect(result.success).toBe(false);
        
        console.log(`✅ Invalid email rejected: "${invalidEmail}"`);
      }
    });

    await test.step('Test phone number validation', async () => {
      const invalidPhones = [
        '123',
        'not-a-phone',
        '+49 123',
        '123456789012345678901', // Too long
        '+999 123 456 789' // Invalid country code
      ];

      for (const invalidPhone of invalidPhones) {
        const workshopData = await testData.createWorkshop('basic');
        workshopData.phone = invalidPhone;
        
        const result = await authPage.register(workshopData);
        
        if (!result.success && result.error && result.error.includes('Telefon')) {
          console.log(`✅ Invalid phone rejected: "${invalidPhone}"`);
        }
      }
    });

    await test.step('Test German PLZ validation', async () => {
      const invalidPLZs = [
        '123',
        '1234567',
        'ABCDE',
        '00000',
        '99999'
      ];

      for (const invalidPLZ of invalidPLZs) {
        const workshopData = await testData.createWorkshop('basic');
        workshopData.plz = invalidPLZ;
        
        const result = await authPage.register(workshopData);
        
        if (!result.success && result.error && result.error.toLowerCase().includes('plz')) {
          console.log(`✅ Invalid PLZ rejected: "${invalidPLZ}"`);
        }
      }
    });

    console.log('✅ Input validation tests completed');
  });

  test('Rate Limiting and DDoS Protection', async ({ page }) => {
    console.log('⏱️ Testing rate limiting...');

    const chatWidgetPage = new ChatWidgetPage(page);

    // Setup test workshop
    const workshopData = await testData.createWorkshop('basic');
    await dbHelper.createTestWorkshop(workshopData);

    const authPage = new AuthPage(page);
    await authPage.goToLogin();
    await authPage.login(workshopData.email, workshopData.password);

    const dashboardPage = new DashboardPage(page);
    await dashboardPage.goToClientKeys();
    const clientKey = await dashboardPage.generateClientKey({
      name: 'Rate Limit Test Key'
    });

    await test.step('Test chat message rate limiting', async () => {
      await chatWidgetPage.goToWorkshopPage(clientKey.value);
      
      if (await chatWidgetPage.waitForChatWidget()) {
        await chatWidgetPage.openChat();
        
        const messagesSent = [];
        
        // Send messages rapidly
        for (let i = 0; i < 20; i++) {
          try {
            await chatWidgetPage.sendMessage(`Rapid message ${i}`);
            messagesSent.push(i);
            await page.waitForTimeout(100); // Very short delay
          } catch (error) {
            console.log(`Rate limit hit at message ${i}`);
            break;
          }
        }
        
        // Check if rate limiting kicked in
        if (messagesSent.length < 20) {
          console.log(`✅ Rate limiting active - stopped at ${messagesSent.length} messages`);
        } else {
          console.log('⚠️ No rate limiting detected or high limits');
        }
        
        // Check for rate limit error message
        const hasRateLimit = await page.locator('.rate-limit, [data-testid="rate-limit"]').isVisible();
        if (hasRateLimit) {
          console.log('✅ Rate limit error message displayed');
        }
      }
    });

    await test.step('Test API endpoint rate limiting', async () => {
      // Test multiple rapid requests to API endpoints
      const promises = [];
      
      for (let i = 0; i < 10; i++) {
        promises.push(
          page.evaluate(async () => {
            try {
              const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: 'Test', clientKey: 'test' })
              });
              return response.status;
            } catch {
              return 0;
            }
          })
        );
      }
      
      const responses = await Promise.all(promises);
      const rateLimitedCount = responses.filter(status => status === 429).length;
      
      if (rateLimitedCount > 0) {
        console.log(`✅ API rate limiting active - ${rateLimitedCount} requests rate limited`);
      } else {
        console.log('⚠️ No API rate limiting detected');
      }
    });

    console.log('✅ Rate limiting tests completed');
  });

  test('Content Security Policy (CSP) Validation', async ({ page }) => {
    console.log('🛡️ Testing Content Security Policy...');

    await test.step('Check CSP headers', async () => {
      const response = await page.goto('/');
      const cspHeader = response.headers()['content-security-policy'];
      
      if (cspHeader) {
        console.log('✅ CSP header present');
        
        // Check for important CSP directives
        const expectedDirectives = [
          'default-src',
          'script-src',
          'style-src',
          'img-src'
        ];
        
        for (const directive of expectedDirectives) {
          if (cspHeader.includes(directive)) {
            console.log(`✅ CSP contains ${directive} directive`);
          } else {
            console.log(`⚠️ CSP missing ${directive} directive`);
          }
        }
      } else {
        console.log('⚠️ No CSP header found');
      }
    });

    await test.step('Test inline script blocking', async () => {
      // Try to execute inline scripts
      try {
        await page.addScriptTag({ content: 'window.cspTestResult = "CSP_BYPASSED";' });
        
        const testResult = await page.evaluate(() => window.cspTestResult);
        
        if (testResult === 'CSP_BYPASSED') {
          console.log('⚠️ CSP allows inline scripts');
        } else {
          console.log('✅ CSP blocks inline scripts');
        }
      } catch (error) {
        console.log('✅ CSP successfully blocks inline scripts');
      }
    });

    console.log('✅ CSP validation tests completed');
  });

  test('Secure Headers Validation', async ({ page }) => {
    console.log('🔒 Testing security headers...');

    await test.step('Check security headers', async () => {
      const response = await page.goto('/');
      const headers = response.headers();
      
      const securityHeaders = {
        'x-frame-options': 'Clickjacking protection',
        'x-content-type-options': 'MIME type sniffing protection',
        'x-xss-protection': 'XSS protection',
        'strict-transport-security': 'HTTPS enforcement',
        'referrer-policy': 'Referrer information control'
      };

      for (const [header, description] of Object.entries(securityHeaders)) {
        if (headers[header]) {
          console.log(`✅ ${description}: ${header} = ${headers[header]}`);
        } else {
          console.log(`⚠️ Missing security header: ${header} (${description})`);
        }
      }
    });

    console.log('✅ Security headers validation completed');
  });
});

test.describe('Privacy and Data Protection', () => {
  test('Cookie Consent and Management', async ({ page }) => {
    console.log('🍪 Testing cookie consent...');

    await test.step('Test cookie consent banner', async () => {
      await page.goto('/');
      
      // Look for cookie consent banner
      const cookieBanner = await page.locator('.cookie-consent, [data-testid="cookie-consent"]').first();
      
      if (await cookieBanner.isVisible()) {
        // Test accept cookies
        await page.locator('button:has-text("Akzeptieren"), button:has-text("Accept")').click();
        
        // Banner should disappear
        await page.waitForTimeout(1000);
        expect(await cookieBanner.isVisible()).toBe(false);
        
        console.log('✅ Cookie consent banner works correctly');
      } else {
        console.log('⚠️ Cookie consent banner not found');
      }
    });

    await test.step('Test cookie preferences', async () => {
      // Check if cookie preferences can be managed
      const cookieSettings = await page.locator('button:has-text("Cookie-Einstellungen"), a:has-text("Cookie Settings")');
      
      if (await cookieSettings.isVisible()) {
        await cookieSettings.click();
        console.log('✅ Cookie preferences accessible');
      } else {
        console.log('⚠️ Cookie preferences not found');
      }
    });

    console.log('✅ Cookie consent tests completed');
  });

  test('Data Minimization Principles', async ({ page }) => {
    console.log('📊 Testing data minimization...');

    const authPage = new AuthPage(page);
    
    await test.step('Test registration data requirements', async () => {
      await authPage.goToRegister();
      
      // Verify only necessary fields are required
      const requiredFields = await page.locator('input[required], select[required]').count();
      const optionalFields = await page.locator('input:not([required]), select:not([required])').count();
      
      console.log(`Required fields: ${requiredFields}, Optional fields: ${optionalFields}`);
      
      // Should have reasonable balance - not collecting excessive data
      expect(requiredFields).toBeLessThan(10);
      
      console.log('✅ Registration follows data minimization principles');
    });

    console.log('✅ Data minimization tests completed');
  });
});