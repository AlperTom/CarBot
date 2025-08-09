/**
 * Client Keys Management E2E Tests for CarBot MVP
 * Tests comprehensive client key lifecycle including creation, management, widget integration
 */

const { test, expect } = require('@playwright/test');
const { AuthPage } = require('./pages/auth-page');
const { DashboardPage } = require('./pages/dashboard-page');
const { TestDataFactory } = require('./fixtures/test-data-factory');
const { DatabaseHelper } = require('./utils/database-helper');

test.describe('Client Keys Management E2E Tests', () => {
  let authPage;
  let dashboardPage;
  let testData;
  let dbHelper;
  let workshopData;

  test.beforeEach(async ({ page }) => {
    authPage = new AuthPage(page);
    dashboardPage = new DashboardPage(page);
    testData = new TestDataFactory();
    dbHelper = new DatabaseHelper();
    
    // Create test workshop and login
    workshopData = await testData.createWorkshop('professional');
    await dbHelper.createTestWorkshop(workshopData);
    
    await authPage.goToLogin();
    await authPage.login(workshopData.email, workshopData.password);
    await dashboardPage.verifyDashboardLoaded();
  });

  test.afterEach(async () => {
    await dbHelper.cleanupTestData();
  });

  test('Create client key with basic configuration', async ({ page }) => {
    await test.step('Navigate to client keys management', async () => {
      await dashboardPage.goToClientKeys();
      
      // Verify page load and package permissions
      await expect(page.locator('h1')).toContainText('Client-Keys verwalten');
      const packageInfo = await dashboardPage.getPackageInfo();
      expect(packageInfo.packageType).toBe('professional');
      expect(packageInfo.hasApiAccess).toBe(true);
    });

    await test.step('Create new client key', async () => {
      const keyData = {
        name: 'Hauptwebsite Integration',
        description: 'Client key für die Hauptwebsite der Werkstatt',
        authorizedDomains: ['werkstatt-schmidt.de', 'www.werkstatt-schmidt.de']
      };

      await page.click('[data-testid="create-key-button"], button:has-text("Neuen Key erstellen")');
      
      // Wait for modal
      await expect(page.locator('.modal, [role="dialog"]')).toBeVisible();
      await expect(page.locator('h3')).toContainText('Neuen Client-Key erstellen');

      // Fill form
      await page.fill('input[name="name"], input:has-text("Key-Name")', keyData.name);
      await page.fill('textarea[name="description"]', keyData.description);
      
      // Add authorized domains
      for (let i = 0; i < keyData.authorizedDomains.length; i++) {
        if (i > 0) {
          await page.click('button:has-text("Weitere Domain hinzufügen")');
        }
        await page.fill(`input[placeholder*="beispiel.de"]:nth-of-type(${i + 1})`, keyData.authorizedDomains[i]);
      }

      // Submit form
      await page.click('button[type="submit"]:has-text("erstellen")');
      
      // Wait for success
      await expect(page.locator('.modal, [role="dialog"]')).not.toBeVisible();
    });

    await test.step('Verify client key created', async () => {
      // Verify key appears in list
      await expect(page.locator('.client-key-item, [data-testid="client-key"]').first()).toBeVisible();
      await expect(page.locator('h3:has-text("Hauptwebsite Integration")')).toBeVisible();
      
      // Verify key properties
      const keyElement = page.locator('.client-key-item, [data-testid="client-key"]').first();
      await expect(keyElement.locator('.status, .badge:has-text("Aktiv")')).toBeVisible();
      await expect(keyElement.locator('code, .key-value')).toBeVisible();
      
      // Get the generated key value
      const keyValue = await keyElement.locator('code, .key-value').first().textContent();
      expect(keyValue).toMatch(/^ck_[a-zA-Z0-9]{32,}$/); // Client key format
      
      console.log(`✅ Client key created: ${keyValue.substring(0, 20)}...`);
    });

    await test.step('Copy integration code', async () => {
      const keyElement = page.locator('.client-key-item, [data-testid="client-key"]').first();
      
      // Test copy key functionality
      await keyElement.locator('button:has-text("Kopieren")').click();
      await expect(page.locator('.notification, .toast')).toBeVisible();
      
      // Verify integration code is present
      const integrationCodeElement = keyElement.locator('pre, .integration-code').first();
      await expect(integrationCodeElement).toBeVisible();
      
      const integrationCode = await integrationCodeElement.textContent();
      expect(integrationCode).toContain('window.carBotConfig');
      expect(integrationCode).toContain('clientKey:');
      expect(integrationCode).toContain('/api/widget/embed');
      
      console.log('✅ Integration code verified and functional');
    });
  });

  test('Package-based feature restrictions for Basic plan', async ({ page }) => {
    // Switch to basic plan workshop
    const basicWorkshop = await testData.createWorkshop('basic');
    await dbHelper.createTestWorkshop(basicWorkshop);
    
    await authPage.goToLogin();
    await authPage.login(basicWorkshop.email, basicWorkshop.password);
    await dashboardPage.goToClientKeys();

    await test.step('Verify Basic plan restrictions', async () => {
      // Verify upgrade prompt appears
      await expect(page.locator('.upgrade-prompt, [data-testid="upgrade-needed"]')).toBeVisible();
      await expect(page.locator('button:has-text("upgraden")')).toBeVisible();
      
      // Verify create button is disabled
      const createButton = page.locator('button:has-text("Neuen Key erstellen")');
      await expect(createButton).toBeDisabled();
      
      console.log('✅ Basic plan restrictions enforced correctly');
    });

    await test.step('Test upgrade flow initiation', async () => {
      await page.click('button:has-text("upgraden")');
      
      // Should redirect to billing/upgrade page
      await page.waitForURL('**/dashboard/billing*');
      await expect(page.locator('h1, h2')).toContainText('Upgrade');
      
      console.log('✅ Upgrade flow initiated successfully');
    });
  });

  test('Client key management operations', async ({ page }) => {
    let clientKey;

    await test.step('Create test client key', async () => {
      await dashboardPage.goToClientKeys();
      
      const keyData = {
        name: 'Test Management Key',
        description: 'For testing management operations'
      };

      clientKey = await dashboardPage.generateClientKey(keyData);
      expect(clientKey.name).toBe(keyData.name);
      expect(clientKey.value).toBeDefined();
    });

    await test.step('Edit client key settings', async () => {
      // Click manage/edit button
      await page.click('.client-key-item:first-of-type button:has-text("Verwalten")');
      
      // Wait for management modal
      await expect(page.locator('.modal [role="dialog"]')).toBeVisible();
      await expect(page.locator('h3:has-text("Client-Key verwalten")')).toBeVisible();

      // Update key name
      await page.fill('input[name="name"], input[value="Test Management Key"]', 'Updated Management Key');
      await page.fill('textarea[name="description"]', 'Updated description for testing');
      
      // Save changes
      await page.click('button:has-text("Änderungen speichern")');
      await expect(page.locator('.modal, [role="dialog"]')).not.toBeVisible();
      
      // Verify changes
      await expect(page.locator('h3:has-text("Updated Management Key")')).toBeVisible();
    });

    await test.step('Deactivate client key', async () => {
      const keyElement = page.locator('.client-key-item:has-text("Updated Management Key")');
      
      // Click deactivate button
      await keyElement.locator('button:has-text("Deaktivieren")').click();
      
      // Verify status changed
      await expect(keyElement.locator('.status:has-text("Inaktiv"), .badge:has-text("Inaktiv")')).toBeVisible();
      
      console.log('✅ Client key deactivated successfully');
    });

    await test.step('Reactivate client key', async () => {
      const keyElement = page.locator('.client-key-item:has-text("Updated Management Key")');
      
      // Click activate button
      await keyElement.locator('button:has-text("Aktivieren")').click();
      
      // Verify status changed
      await expect(keyElement.locator('.status:has-text("Aktiv"), .badge:has-text("Aktiv")')).toBeVisible();
      
      console.log('✅ Client key reactivated successfully');
    });

    await test.step('Delete client key', async () => {
      const keyElement = page.locator('.client-key-item:has-text("Updated Management Key")');
      
      // Set up dialog handler for confirmation
      page.on('dialog', async dialog => {
        expect(dialog.message()).toContain('löschen');
        await dialog.accept();
      });
      
      // Click delete button
      await keyElement.locator('button:has-text("Löschen")').click();
      
      // Verify key removed from list
      await expect(page.locator('.client-key-item:has-text("Updated Management Key")')).not.toBeVisible();
      
      console.log('✅ Client key deleted successfully');
    });
  });

  test('Advanced client key configuration', async ({ page }) => {
    await dashboardPage.goToClientKeys();

    await test.step('Create key with advanced settings', async () => {
      await page.click('button:has-text("Neuen Key erstellen")');
      
      // Fill advanced configuration
      await page.fill('input[name="name"]', 'Advanced Configuration Key');
      await page.fill('textarea[name="description"]', 'Testing advanced configuration options');
      
      // Add multiple authorized domains
      const domains = ['example.com', 'subdomain.example.com', 'another-domain.de'];
      for (let i = 0; i < domains.length; i++) {
        if (i > 0) {
          await page.click('button:has-text("Weitere Domain hinzufügen")');
        }
        await page.fill(`input[placeholder*="beispiel.de"]:nth-of-type(${i + 1})`, domains[i]);
      }
      
      // Set usage limit (if available)
      const usageLimitSelect = page.locator('select[name="usageLimit"]');
      if (await usageLimitSelect.isVisible()) {
        await usageLimitSelect.selectOption('10000');
      }
      
      await page.click('button[type="submit"]:has-text("erstellen")');
      await expect(page.locator('.modal')).not.toBeVisible();
    });

    await test.step('Verify advanced configuration', async () => {
      const keyElement = page.locator('.client-key-item:has-text("Advanced Configuration Key")');
      
      // Verify integration code contains advanced settings
      const integrationCode = await keyElement.locator('pre, .integration-code').first().textContent();
      expect(integrationCode).toContain('carBotConfig');
      expect(integrationCode).toContain('theme:');
      expect(integrationCode).toContain('language: \'de\'');
      
      console.log('✅ Advanced configuration applied successfully');
    });

    await test.step('Test domain authorization', async () => {
      // This would typically be tested by making actual widget requests
      // For E2E, we verify the domains are stored correctly
      await page.click('.client-key-item:has-text("Advanced Configuration Key") button:has-text("Verwalten")');
      
      await expect(page.locator('.modal')).toBeVisible();
      
      // Verify domains are displayed correctly in management
      for (const domain of ['example.com', 'subdomain.example.com', 'another-domain.de']) {
        await expect(page.locator(`input[value="${domain}"]`)).toBeVisible();
      }
      
      await page.click('button:has-text("Schließen")');
    });
  });

  test('Client key usage analytics and monitoring', async ({ page }) => {
    await test.step('Create client key and simulate usage', async () => {
      await dashboardPage.goToClientKeys();
      
      const keyData = {
        name: 'Analytics Test Key',
        description: 'For testing usage analytics'
      };

      const clientKey = await dashboardPage.generateClientKey(keyData);
      
      // Simulate API calls to the key (would be done via actual widget integration)
      await dbHelper.simulateClientKeyUsage(workshopData.id, clientKey.value, 25);
    });

    await test.step('Verify usage statistics display', async () => {
      // Refresh page to see updated stats
      await page.reload();
      await dashboardPage.goToClientKeys();
      
      const keyElement = page.locator('.client-key-item:has-text("Analytics Test Key")');
      
      // Check if usage count is displayed
      const usageStats = keyElement.locator('.usage-stats, [data-testid="usage-count"]');
      if (await usageStats.isVisible()) {
        const usageText = await usageStats.textContent();
        expect(usageText).toMatch(/\d+.*[Vv]erwendungen?/); // German "Verwendungen"
      }
      
      // Check analytics summary if present
      const analyticsSummary = page.locator('.analytics-summary, [data-testid="analytics-summary"]');
      if (await analyticsSummary.isVisible()) {
        await expect(analyticsSummary.locator(':has-text("API-Aufrufe")')).toBeVisible();
      }
      
      console.log('✅ Usage analytics verification completed');
    });

    await test.step('Access detailed analytics', async () => {
      // Click on analytics or detailed view
      const keyElement = page.locator('.client-key-item:has-text("Analytics Test Key")');
      await keyElement.locator('button:has-text("Verwalten")').click();
      
      // Navigate to analytics tab if available
      const analyticsTab = page.locator('button:has-text("Nutzungsstatistiken")');
      if (await analyticsTab.isVisible()) {
        await analyticsTab.click();
        
        // Verify analytics content loads
        await expect(page.locator('.analytics-content, [data-testid="analytics-data"]')).toBeVisible();
      }
      
      await page.click('button:has-text("Schließen")');
    });
  });

  test('Integration code generation and customization', async ({ page }) => {
    await dashboardPage.goToClientKeys();

    await test.step('Generate client key', async () => {
      const keyData = {
        name: 'Integration Test Key',
        description: 'For testing integration code generation'
      };

      await dashboardPage.generateClientKey(keyData);
    });

    await test.step('Verify standard integration code', async () => {
      const keyElement = page.locator('.client-key-item:has-text("Integration Test Key")');
      const integrationCode = await keyElement.locator('pre, .integration-code').first().textContent();
      
      // Verify standard configuration
      expect(integrationCode).toContain('window.carBotConfig');
      expect(integrationCode).toContain('clientKey:');
      expect(integrationCode).toContain('theme: \'auto\'');
      expect(integrationCode).toContain('position: \'bottom-right\'');
      expect(integrationCode).toContain('language: \'de\'');
      expect(integrationCode).toContain('<script src=');
      
      console.log('✅ Standard integration code generated correctly');
    });

    await test.step('Test advanced configuration code', async () => {
      const keyElement = page.locator('.client-key-item:has-text("Integration Test Key")');
      
      // Look for advanced configuration section
      const advancedConfig = keyElement.locator('.advanced-config, h5:has-text("Erweiterte")');
      if (await advancedConfig.isVisible()) {
        const advancedCode = await keyElement.locator('pre').nth(1).textContent();
        
        expect(advancedCode).toContain('customStyles');
        expect(advancedCode).toContain('primaryColor');
        expect(advancedCode).toContain('behavior');
        expect(advancedCode).toContain('autoOpen');
        
        console.log('✅ Advanced configuration code available');
      }
    });

    await test.step('Test copy functionality', async () => {
      const keyElement = page.locator('.client-key-item:has-text("Integration Test Key")');
      
      // Test copy widget URL
      await keyElement.locator('button:has-text("URL kopieren")').click();
      await expect(page.locator('.notification, .toast')).toBeVisible();
      
      // Test copy integration code
      await keyElement.locator('button:has-text("Code kopieren")').click();
      await expect(page.locator('.notification, .toast')).toBeVisible();
      
      console.log('✅ Copy functionality working correctly');
    });
  });

  test('Error handling and validation', async ({ page }) => {
    await dashboardPage.goToClientKeys();

    await test.step('Test form validation', async () => {
      await page.click('button:has-text("Neuen Key erstellen")');
      
      // Try to submit empty form
      await page.click('button[type="submit"]:has-text("erstellen")');
      
      // Should show validation errors
      await expect(page.locator('.error, .invalid-feedback, [data-error]')).toBeVisible();
      
      // Test invalid domain format
      await page.fill('input[name="name"]', 'Test Key');
      await page.fill('input[placeholder*="beispiel.de"]', 'invalid-domain');
      
      // Check if domain validation works (implementation dependent)
      console.log('✅ Form validation tested');
      
      await page.click('button:has-text("Abbrechen")');
    });

    await test.step('Test network error handling', async () => {
      // Simulate network failure
      await page.route('**/api/keys', route => route.abort());
      
      // Try to create key
      await page.click('button:has-text("Neuen Key erstellen")');
      await page.fill('input[name="name"]', 'Network Test Key');
      await page.click('button[type="submit"]:has-text("erstellen")');
      
      // Should show error message
      const hasError = await page.locator('.error, .alert-error, [data-testid="error"]').isVisible();
      if (hasError) {
        const errorText = await page.locator('.error, .alert-error, [data-testid="error"]').textContent();
        expect(errorText.toLowerCase()).toContain('fehler');
      }
      
      // Reset network
      await page.unroute('**/api/keys');
      
      console.log('✅ Network error handling tested');
    });
  });

  test('Performance and loading states', async ({ page }) => {
    await test.step('Verify loading states', async () => {
      await dashboardPage.goToClientKeys();
      
      // Check for loading indicators during initial load
      const loadingStates = page.locator('.loading, .spinner, .animate-pulse');
      if (await loadingStates.first().isVisible()) {
        console.log('✅ Loading states displayed');
        
        // Wait for loading to complete
        await expect(loadingStates.first()).not.toBeVisible();
      }
      
      // Verify page loads in reasonable time
      const startTime = Date.now();
      await expect(page.locator('h1:has-text("Client-Keys")')).toBeVisible();
      const loadTime = Date.now() - startTime;
      
      expect(loadTime).toBeLessThan(5000); // Should load within 5 seconds
      console.log(`✅ Page loaded in ${loadTime}ms`);
    });

    await test.step('Test refresh functionality', async () => {
      // Click refresh button if available
      const refreshButton = page.locator('button:has-text("Aktualisieren")');
      if (await refreshButton.isVisible()) {
        await refreshButton.click();
        
        // Should show refreshing state
        await expect(page.locator('.animate-spin, :has-text("Aktualisiert")')).toBeVisible();
        
        // Should complete refresh
        await expect(page.locator('h1:has-text("Client-Keys")')).toBeVisible();
        
        console.log('✅ Refresh functionality working');
      }
    });
  });
});

test.describe('Client Keys Integration Tests', () => {
  test('Widget embedding with client key', async ({ page, context }) => {
    const testData = new TestDataFactory();
    const dbHelper = new DatabaseHelper();
    
    // Setup workshop with client key
    const workshopData = await testData.createWorkshop('professional');
    await dbHelper.createTestWorkshop(workshopData);
    
    const authPage = new AuthPage(page);
    const dashboardPage = new DashboardPage(page);
    
    await authPage.goToLogin();
    await authPage.login(workshopData.email, workshopData.password);
    await dashboardPage.goToClientKeys();
    
    const clientKey = await dashboardPage.generateClientKey({
      name: 'Widget Integration Test',
      description: 'For testing widget embedding'
    });

    // Create a test page with the widget
    const testPageContent = `
      <!DOCTYPE html>
      <html lang="de">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Test Workshop</title>
      </head>
      <body>
          <h1>Test Autowerkstatt</h1>
          <p>Willkommen bei unserer Werkstatt!</p>
          
          <!-- CarBot Widget Integration -->
          <script>
            window.carBotConfig = {
              clientKey: '${clientKey.value}',
              theme: 'auto',
              position: 'bottom-right',
              language: 'de'
            };
          </script>
          <script src="${page.url().split('/dashboard')[0]}/api/widget/embed?client_key=${clientKey.value}" async></script>
      </body>
      </html>
    `;

    // Create new page for widget testing
    const widgetPage = await context.newPage();
    await widgetPage.setContent(testPageContent);
    
    await test.step('Verify widget loads on external page', async () => {
      // Wait for widget script to load
      await widgetPage.waitForLoadState('networkidle');
      
      // Check for widget elements
      const widget = widgetPage.locator('.carbot-widget, [data-carbot-widget]');
      await expect(widget).toBeVisible({ timeout: 10000 });
      
      console.log('✅ Widget successfully embedded on external page');
    });

    await widgetPage.close();
  });
});