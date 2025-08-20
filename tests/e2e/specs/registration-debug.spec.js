/**
 * Registration Debug E2E Test for CarBot
 * Focused test to debug the actual registration issue
 */

const { test, expect } = require('@playwright/test');

test.describe('Registration Debug Tests', () => {
  let testEmail;
  let testData;

  test.beforeEach(async ({ page }) => {
    // Generate unique test data for each test
    const timestamp = Date.now();
    testEmail = `test${timestamp}@carbot-test.de`;
    testData = {
      email: testEmail,
      password: 'TestPassword123!',
      businessName: `Test Werkstatt ${timestamp}`,
      name: 'Hans Müller',
      phone: '+49 30 12345678',
      templateType: 'klassische'
    };

    console.log(`🧪 Test data prepared: ${testEmail}`);
  });

  test('Debug Registration Flow - Step by Step', async ({ page }) => {
    console.log('\n🔍 DEBUGGING REGISTRATION FLOW...');

    // Step 1: Navigate to registration page
    await test.step('Navigate to registration page', async () => {
      await page.goto('/auth/register');
      await page.waitForLoadState('networkidle');
      
      const title = await page.title();
      console.log(`📄 Page title: ${title}`);
      
      const url = page.url();
      console.log(`🌐 Current URL: ${url}`);
      
      // Check if page loaded correctly
      const hasForm = await page.locator('form').isVisible();
      console.log(`📋 Registration form visible: ${hasForm}`);
      expect(hasForm).toBe(true);
    });

    // Step 2: Inspect actual form fields
    await test.step('Inspect form structure', async () => {
      const formInputs = await page.locator('input').allTextContents();
      const inputFields = await page.locator('input').all();
      
      console.log('\n📝 Available form fields:');
      for (let i = 0; i < inputFields.length; i++) {
        const input = inputFields[i];
        const name = await input.getAttribute('name');
        const type = await input.getAttribute('type');
        const placeholder = await input.getAttribute('placeholder');
        console.log(`  ${i + 1}. Name: "${name}", Type: "${type}", Placeholder: "${placeholder}"`);
      }

      // Check select fields
      const selectFields = await page.locator('select').all();
      console.log('\n📊 Select fields:');
      for (let i = 0; i < selectFields.length; i++) {
        const select = selectFields[i];
        const name = await select.getAttribute('name');
        console.log(`  ${i + 1}. Select name: "${name}"`);
      }

      // Check submit button
      const submitButton = await page.locator('button[type="submit"]');
      const buttonText = await submitButton.textContent();
      console.log(`\n🔘 Submit button text: "${buttonText}"`);
    });

    // Step 3: Fill form with actual field names
    await test.step('Fill registration form', async () => {
      console.log('\n📝 Filling registration form...');

      // Email field
      await page.fill('input[name="email"]', testData.email);
      console.log(`✅ Email filled: ${testData.email}`);

      // Password field
      await page.fill('input[name="password"]', testData.password);
      console.log(`✅ Password filled`);

      // Business name field
      await page.fill('input[name="businessName"]', testData.businessName);
      console.log(`✅ Business name filled: ${testData.businessName}`);

      // Contact name field
      await page.fill('input[name="name"]', testData.name);
      console.log(`✅ Contact name filled: ${testData.name}`);

      // Phone field (optional)
      await page.fill('input[name="phone"]', testData.phone);
      console.log(`✅ Phone filled: ${testData.phone}`);

      // Template type selection
      await page.selectOption('select[name="templateType"]', testData.templateType);
      console.log(`✅ Template type selected: ${testData.templateType}`);

      // Take screenshot before submit
      await page.screenshot({ path: 'debug-registration-before-submit.png', fullPage: true });
      console.log('📸 Screenshot taken: debug-registration-before-submit.png');
    });

    // Step 4: Submit form and monitor network
    await test.step('Submit registration and monitor response', async () => {
      console.log('\n🚀 Submitting registration...');

      // Set up network monitoring
      const responses = [];
      page.on('response', response => {
        if (response.url().includes('/api/auth/register')) {
          responses.push({
            status: response.status(),
            statusText: response.statusText(),
            url: response.url()
          });
        }
      });

      // Monitor console logs
      page.on('console', msg => {
        console.log(`🖥️ Console ${msg.type()}: ${msg.text()}`);
      });

      // Monitor page errors
      page.on('pageerror', error => {
        console.log(`💥 Page error: ${error.message}`);
      });

      // Click submit button
      await page.click('button[type="submit"]');
      console.log('👆 Submit button clicked');

      // Wait for network response
      try {
        await page.waitForResponse(response => 
          response.url().includes('/api/auth/register'), 
          { timeout: 15000 }
        );
        console.log('✅ Registration API response received');
      } catch (error) {
        console.log('❌ Registration API response timeout');
      }

      // Check for loading states
      await page.waitForTimeout(2000);
      
      // Take screenshot after submit
      await page.screenshot({ path: 'debug-registration-after-submit.png', fullPage: true });
      console.log('📸 Screenshot taken: debug-registration-after-submit.png');

      // Log network responses
      console.log('\n🌐 Network responses:');
      responses.forEach((response, index) => {
        console.log(`  ${index + 1}. Status: ${response.status} ${response.statusText} - ${response.url}`);
      });
    });

    // Step 5: Check for errors or success messages
    await test.step('Check registration result', async () => {
      console.log('\n🔍 Checking registration result...');

      // Check for error messages
      const errorMessage = await page.locator('.error-message, [style*="color: #f87171"], [style*="background: rgba(239, 68, 68"]').first().textContent().catch(() => null);
      if (errorMessage) {
        console.log(`❌ Error message found: "${errorMessage}"`);
      } else {
        console.log('✅ No error messages visible');
      }

      // Check current URL
      const currentUrl = page.url();
      console.log(`🌐 Current URL after submit: ${currentUrl}`);

      // Check if redirected to login or dashboard
      if (currentUrl.includes('/dashboard')) {
        console.log('✅ Redirected to dashboard - registration successful!');
      } else if (currentUrl.includes('/auth/login')) {
        console.log('✅ Redirected to login - registration probably successful');
      } else if (currentUrl.includes('/auth/register')) {
        console.log('⚠️ Still on registration page - check for errors');
      } else {
        console.log(`❓ Unexpected redirect: ${currentUrl}`);
      }

      // Check page content for confirmation
      const pageText = await page.textContent('body');
      if (pageText.includes('Account erstellt') || pageText.includes('Registrierung erfolgreich')) {
        console.log('✅ Success message found in page');
      } else if (pageText.includes('Account wird erstellt')) {
        console.log('🔄 Loading state detected');
      }

      // Wait a bit more for potential redirects
      await page.waitForTimeout(3000);
      
      const finalUrl = page.url();
      console.log(`🎯 Final URL: ${finalUrl}`);
      
      // Take final screenshot
      await page.screenshot({ path: 'debug-registration-final.png', fullPage: true });
      console.log('📸 Final screenshot taken: debug-registration-final.png');
    });
  });

  test('Test Registration API Directly', async ({ page, request }) => {
    console.log('\n🔧 TESTING REGISTRATION API DIRECTLY...');

    await test.step('Direct API call to registration endpoint', async () => {
      const response = await request.post('/api/auth/register', {
        data: {
          email: testData.email,
          password: testData.password,
          businessName: testData.businessName,
          name: testData.name,
          phone: testData.phone,
          templateType: testData.templateType,
          useJWT: true
        }
      });

      console.log(`📡 API Response Status: ${response.status()}`);
      console.log(`📡 API Response Status Text: ${response.statusText()}`);

      const responseBody = await response.text();
      console.log(`📡 API Response Body: ${responseBody}`);

      if (response.status() === 200 || response.status() === 201) {
        console.log('✅ Direct API call successful');
        
        try {
          const jsonResponse = JSON.parse(responseBody);
          console.log(`🎯 Registration success: ${jsonResponse.success}`);
          if (jsonResponse.error) {
            console.log(`❌ Registration error: ${jsonResponse.error}`);
          }
          if (jsonResponse.data) {
            console.log(`👤 User data: ${JSON.stringify(jsonResponse.data, null, 2)}`);
          }
        } catch (e) {
          console.log('❌ Could not parse JSON response');
        }
      } else {
        console.log('❌ Direct API call failed');
      }
    });
  });

  test('Test with Different Browser Storage States', async ({ page }) => {
    console.log('\n🔄 TESTING WITH BROWSER STORAGE...');

    await test.step('Clear all browser storage', async () => {
      await page.goto('/auth/register');
      await page.evaluate(() => {
        localStorage.clear();
        sessionStorage.clear();
      });
      
      console.log('🧹 Browser storage cleared');
    });

    await test.step('Attempt registration with clean state', async () => {
      // Fill and submit form
      await page.fill('input[name="email"]', testData.email);
      await page.fill('input[name="password"]', testData.password);
      await page.fill('input[name="businessName"]', testData.businessName);
      await page.fill('input[name="name"]', testData.name);
      await page.fill('input[name="phone"]', testData.phone);
      await page.selectOption('select[name="templateType"]', testData.templateType);

      console.log('📝 Form filled with clean browser state');

      await page.click('button[type="submit"]');
      
      // Wait for result
      await page.waitForTimeout(5000);
      
      const finalUrl = page.url();
      console.log(`🎯 Final URL with clean state: ${finalUrl}`);
    });
  });
});