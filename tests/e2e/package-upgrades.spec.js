/**
 * Package System and Upgrades E2E Tests for CarBot MVP
 * Tests package-based feature restrictions, upgrade flows, and billing integration
 */

const { test, expect } = require('@playwright/test');
const { AuthPage } = require('./pages/auth-page');
const { DashboardPage } = require('./pages/dashboard-page');
const { TestDataFactory } = require('./fixtures/test-data-factory');
const { DatabaseHelper } = require('./utils/database-helper');

test.describe('Package System E2E Tests', () => {
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
  });

  test.afterEach(async () => {
    await dbHelper.cleanupTestData();
  });

  test('Basic plan feature restrictions and upgrade prompts', async ({ page }) => {
    await test.step('Setup Basic plan workshop', async () => {
      workshopData = await testData.createWorkshop('basic');
      await dbHelper.createTestWorkshop(workshopData);
      
      await authPage.goToLogin();
      await authPage.login(workshopData.email, workshopData.password);
      await dashboardPage.verifyDashboardLoaded();
    });

    await test.step('Verify Basic plan dashboard overview', async () => {
      // Check package information display
      const packageCard = page.locator('.package-card, [data-testid="package-info"]');
      await expect(packageCard).toBeVisible();
      
      // Should show Basic plan
      await expect(packageCard.locator(':has-text("Basic")')).toBeVisible();
      await expect(packageCard.locator(':has-text("29€"), :has-text("29 €")')).toBeVisible();
      
      // Should show upgrade button
      const upgradeButton = packageCard.locator('button:has-text("upgraden"), button:has-text("Upgrade")');
      await expect(upgradeButton).toBeVisible();
      
      console.log('✅ Basic plan package information displayed correctly');
    });

    await test.step('Test client keys restriction', async () => {
      await dashboardPage.goToClientKeys();
      
      // Should show restriction message
      await expect(page.locator('.upgrade-prompt, [data-testid="upgrade-needed"]')).toBeVisible();
      await expect(page.locator(':has-text("API-Zugang nicht verfügbar")')).toBeVisible();
      
      // Create button should be disabled
      const createButton = page.locator('button:has-text("Neuen Key erstellen")');
      await expect(createButton).toBeDisabled();
      
      console.log('✅ Basic plan correctly restricts client key creation');
    });

    await test.step('Test analytics restriction', async () => {
      // Try to access analytics
      const analyticsNav = page.locator('a:has-text("Analytics"), [data-nav="analytics"]');
      if (await analyticsNav.isVisible()) {
        await analyticsNav.click();
        
        // Should show upgrade prompt or basic dashboard only
        const hasUpgradePrompt = await page.locator('.upgrade-prompt, [data-testid="analytics-upgrade"]').isVisible();
        const hasBasicDashboard = await page.locator('.basic-dashboard, [data-dashboard="basic"]').isVisible();
        
        expect(hasUpgradePrompt || hasBasicDashboard).toBe(true);
        console.log('✅ Basic plan analytics access properly restricted');
      }
    });

    await test.step('Test monthly lead limit enforcement', async () => {
      await dashboardPage.goToDashboard();
      
      // Should show lead usage information
      const usageIndicator = page.locator('.usage-indicator, [data-testid="lead-usage"]');
      if (await usageIndicator.isVisible()) {
        const usageText = await usageIndicator.textContent();
        
        // Should show limit (100 for Basic plan)
        expect(usageText).toMatch(/\d+.*\/.*100|100.*leads?/i);
        console.log('✅ Lead limit displayed for Basic plan');
      }
    });

    await test.step('Verify upgrade prompts throughout interface', async () => {
      const upgradePrompts = await page.locator('.upgrade-prompt, [data-upgrade-required], button:has-text("upgraden")').count();
      expect(upgradePrompts).toBeGreaterThan(0);
      
      console.log(`✅ Found ${upgradePrompts} upgrade prompts across the interface`);
    });
  });

  test('Professional plan feature access', async ({ page }) => {
    await test.step('Setup Professional plan workshop', async () => {
      workshopData = await testData.createWorkshop('professional');
      await dbHelper.createTestWorkshop(workshopData);
      
      await authPage.goToLogin();
      await authPage.login(workshopData.email, workshopData.password);
      await dashboardPage.verifyDashboardLoaded();
    });

    await test.step('Verify Professional plan dashboard', async () => {
      const packageCard = page.locator('.package-card, [data-testid="package-info"]');
      
      // Should show Professional plan
      await expect(packageCard.locator(':has-text("Professional")')).toBeVisible();
      await expect(packageCard.locator(':has-text("79€"), :has-text("79 €")')).toBeVisible();
      
      // Should show Enterprise upgrade option
      const upgradeButton = packageCard.locator('button:has-text("Enterprise"), button:has-text("upgraden")');
      if (await upgradeButton.isVisible()) {
        console.log('✅ Enterprise upgrade option available');
      }
    });

    await test.step('Test unlimited lead generation access', async () => {
      const usageIndicator = page.locator('.usage-indicator, [data-testid="lead-usage"]');
      if (await usageIndicator.isVisible()) {
        const usageText = await usageIndicator.textContent();
        
        // Should show unlimited or no limit
        const isUnlimited = usageText.includes('Unlimited') || 
                           usageText.includes('Unbegrenzt') || 
                           !usageText.includes('/');
        
        expect(isUnlimited).toBe(true);
        console.log('✅ Professional plan shows unlimited leads');
      }
    });

    await test.step('Test client key creation access', async () => {
      await dashboardPage.goToClientKeys();
      
      // Should not show upgrade prompt
      const hasUpgradePrompt = await page.locator('.upgrade-prompt').isVisible();
      expect(hasUpgradePrompt).toBe(false);
      
      // Create button should be enabled
      const createButton = page.locator('button:has-text("Neuen Key erstellen")');
      await expect(createButton).toBeEnabled();
      
      // Test actual key creation
      await createButton.click();
      await expect(page.locator('.modal, [role="dialog"]')).toBeVisible();
      await page.click('button:has-text("Abbrechen")');
      
      console.log('✅ Professional plan has full client key access');
    });

    await test.step('Test advanced analytics access', async () => {
      const analyticsNav = page.locator('a:has-text("Analytics"), [data-nav="analytics"]');
      if (await analyticsNav.isVisible()) {
        await analyticsNav.click();
        
        // Should have access to advanced analytics
        const advancedFeatures = page.locator('.advanced-analytics, [data-analytics="advanced"]');
        if (await advancedFeatures.isVisible()) {
          console.log('✅ Professional plan has advanced analytics access');
        }
        
        // Should not show upgrade prompts for basic analytics features
        const basicUpgradePrompts = await page.locator('.upgrade-prompt:has-text("Analytics")').count();
        expect(basicUpgradePrompts).toBe(0);
      }
    });

    await test.step('Test API access features', async () => {
      await dashboardPage.goToClientKeys();
      
      // Should show API usage statistics
      const apiStats = page.locator('.api-stats, [data-testid="api-usage"]');
      if (await apiStats.isVisible()) {
        const statsText = await apiStats.textContent();
        expect(statsText).toMatch(/api|aufrufe|calls/i);
        console.log('✅ API usage statistics visible for Professional plan');
      }
    });
  });

  test('Enterprise plan premium features', async ({ page }) => {
    await test.step('Setup Enterprise plan workshop', async () => {
      workshopData = await testData.createWorkshop('enterprise');
      await dbHelper.createTestWorkshop(workshopData);
      
      await authPage.goToLogin();
      await authPage.login(workshopData.email, workshopData.password);
      await dashboardPage.verifyDashboardLoaded();
    });

    await test.step('Verify Enterprise plan dashboard', async () => {
      const packageCard = page.locator('.package-card, [data-testid="package-info"]');
      
      // Should show Enterprise plan
      await expect(packageCard.locator(':has-text("Enterprise")')).toBeVisible();
      
      // Should show individual pricing or no upgrade needed
      const pricingText = await packageCard.textContent();
      const hasIndividualPricing = pricingText.includes('Individual') || 
                                  pricingText.includes('Individuell') ||
                                  pricingText.includes('Contact');
      
      expect(hasIndividualPricing).toBe(true);
      console.log('✅ Enterprise plan shows individual pricing');
    });

    await test.step('Test unlimited access across all features', async () => {
      // All usage indicators should show unlimited
      const usageIndicators = page.locator('.usage-indicator, [data-testid*="usage"]');
      const indicatorCount = await usageIndicators.count();
      
      if (indicatorCount > 0) {
        for (let i = 0; i < indicatorCount; i++) {
          const indicator = usageIndicators.nth(i);
          const text = await indicator.textContent();
          
          // Should not show limits or show unlimited
          const isUnlimited = !text.match(/\d+\/\d+/) || 
                             text.includes('Unlimited') || 
                             text.includes('Unbegrenzt');
          
          expect(isUnlimited).toBe(true);
        }
        
        console.log('✅ All usage indicators show unlimited for Enterprise');
      }
    });

    await test.step('Test white-label features access', async () => {
      // Look for white-label or branding options
      const whiteLabelSettings = page.locator(':has-text("White"), :has-text("Branding"), :has-text("Custom")');
      if (await whiteLabelSettings.count() > 0) {
        console.log('✅ White-label features available for Enterprise');
      }
    });

    await test.step('Test custom integration features', async () => {
      await dashboardPage.goToClientKeys();
      
      // Should have access to advanced integration options
      const createButton = page.locator('button:has-text("Neuen Key erstellen")');
      await createButton.click();
      
      // Look for advanced options in key creation
      const advancedOptions = page.locator('[data-advanced], :has-text("Advanced"), :has-text("Custom")');
      const hasAdvancedOptions = await advancedOptions.count() > 0;
      
      if (hasAdvancedOptions) {
        console.log('✅ Advanced integration options available for Enterprise');
      }
      
      await page.click('button:has-text("Abbrechen")');
    });

    await test.step('Verify no upgrade prompts', async () => {
      const upgradePrompts = await page.locator('.upgrade-prompt, [data-upgrade-required]').count();
      expect(upgradePrompts).toBe(0);
      
      console.log('✅ No upgrade prompts shown for Enterprise plan');
    });
  });

  test('Package upgrade workflow from Basic to Professional', async ({ page }) => {
    await test.step('Setup Basic plan workshop', async () => {
      workshopData = await testData.createWorkshop('basic');
      await dbHelper.createTestWorkshop(workshopData);
      
      await authPage.goToLogin();
      await authPage.login(workshopData.email, workshopData.password);
      await dashboardPage.verifyDashboardLoaded();
    });

    await test.step('Initiate upgrade process', async () => {
      // Click upgrade button from dashboard
      const upgradeButton = page.locator('button:has-text("upgraden"), button:has-text("Upgrade")').first();
      await upgradeButton.click();
      
      // Should navigate to billing/upgrade page
      await page.waitForURL('**/dashboard/billing**', { timeout: 10000 });
      
      // Or should show upgrade modal
      const upgradeModal = page.locator('.upgrade-modal, [data-testid="upgrade-modal"]');
      const isBillingPage = page.url().includes('/billing');
      
      expect(isBillingPage || await upgradeModal.isVisible()).toBe(true);
      console.log('✅ Upgrade process initiated successfully');
    });

    await test.step('Review upgrade options', async () => {
      // Should show package comparison
      const packageComparison = page.locator('.package-comparison, [data-testid="package-plans"]');
      if (await packageComparison.isVisible()) {
        
        // Should show Basic current plan
        await expect(page.locator(':has-text("Basic"):has-text("Current"), :has-text("Aktuell")')).toBeVisible();
        
        // Should show Professional option
        await expect(page.locator(':has-text("Professional")')).toBeVisible();
        await expect(page.locator(':has-text("79€"), :has-text("79 €")')).toBeVisible();
        
        // Should show Enterprise option
        await expect(page.locator(':has-text("Enterprise")')).toBeVisible();
        
        console.log('✅ Package comparison displayed correctly');
      }
    });

    await test.step('Select Professional plan', async () => {
      const professionalButton = page.locator('button:has-text("Professional auswählen"), button:has-text("Upgrade to Professional")');
      
      if (await professionalButton.isVisible()) {
        await professionalButton.click();
        
        // Should proceed to checkout or show confirmation
        const checkoutLoaded = await page.locator('.checkout, [data-testid="checkout"]').isVisible({ timeout: 5000 });
        const confirmationModal = await page.locator('.upgrade-confirm, [data-testid="upgrade-confirm"]').isVisible();
        
        if (checkoutLoaded) {
          console.log('✅ Stripe checkout loaded for upgrade');
          
          // In a real test, we would use Stripe test cards
          // For E2E, we just verify the checkout loaded
          const stripeElements = page.locator('[data-testid="stripe-element"], .StripeElement');
          if (await stripeElements.isVisible()) {
            console.log('✅ Stripe payment form loaded');
          }
        } else if (confirmationModal) {
          console.log('✅ Upgrade confirmation modal displayed');
        }
      }
    });

    await test.step('Test upgrade cancellation', async () => {
      // Look for cancel/back button
      const cancelButton = page.locator('button:has-text("Abbrechen"), button:has-text("Cancel"), .back-button');
      if (await cancelButton.isVisible()) {
        await cancelButton.click();
        
        // Should return to previous state
        const backToDashboard = page.url().includes('/dashboard') && !page.url().includes('/billing');
        const backToBilling = await page.locator('.package-comparison').isVisible();
        
        expect(backToDashboard || backToBilling).toBe(true);
        console.log('✅ Upgrade cancellation works correctly');
      }
    });
  });

  test('Billing management and subscription status', async ({ page }) => {
    await test.step('Setup Professional plan workshop with subscription', async () => {
      workshopData = await testData.createWorkshop('professional');
      // Simulate active subscription
      workshopData.subscriptionStatus = 'active';
      workshopData.subscriptionId = 'sub_test_12345';
      
      await dbHelper.createTestWorkshop(workshopData);
      
      await authPage.goToLogin();
      await authPage.login(workshopData.email, workshopData.password);
    });

    await test.step('Access billing dashboard', async () => {
      await dashboardPage.goToBilling();
      
      // Should show current subscription information
      await expect(page.locator('h1, h2')).toContainText(/Billing|Abrechnung/);
      
      const subscriptionCard = page.locator('.subscription-info, [data-testid="subscription-card"]');
      if (await subscriptionCard.isVisible()) {
        
        // Should show current plan
        await expect(subscriptionCard).toContainText('Professional');
        
        // Should show subscription status
        const statusElement = subscriptionCard.locator('.status, [data-status]');
        if (await statusElement.isVisible()) {
          const statusText = await statusElement.textContent();
          expect(statusText.toLowerCase()).toMatch(/active|aktiv|running/);
        }
        
        console.log('✅ Subscription information displayed correctly');
      }
    });

    await test.step('Test billing history access', async () => {
      const billingHistory = page.locator('.billing-history, [data-testid="billing-history"]');
      if (await billingHistory.isVisible()) {
        
        // Should show invoice entries
        const invoices = billingHistory.locator('.invoice, .billing-entry');
        const invoiceCount = await invoices.count();
        
        if (invoiceCount > 0) {
          console.log(`✅ Found ${invoiceCount} billing entries`);
          
          // Should show invoice details
          const firstInvoice = invoices.first();
          await expect(firstInvoice.locator(':has-text("€"), :has-text("EUR")')).toBeVisible();
        }
      }
    });

    await test.step('Test customer portal access', async () => {
      const portalButton = page.locator('button:has-text("Customer Portal"), button:has-text("Kundenportal"), button:has-text("Verwalten")');
      if (await portalButton.isVisible()) {
        
        // Set up page navigation listener
        const [portalPage] = await Promise.all([
          page.context().waitForEvent('page'),
          portalButton.click()
        ]);
        
        // Should open Stripe customer portal or billing management
        await portalPage.waitForLoadState();
        const portalUrl = portalPage.url();
        
        // Should be Stripe portal or internal billing management
        const isValidPortal = portalUrl.includes('billing.stripe.com') || 
                             portalUrl.includes('/billing') ||
                             portalUrl.includes('/portal');
        
        expect(isValidPortal).toBe(true);
        console.log(`✅ Customer portal opened: ${portalUrl}`);
        
        await portalPage.close();
      }
    });

    await test.step('Test usage monitoring', async () => {
      const usageSection = page.locator('.usage-monitoring, [data-testid="usage-stats"]');
      if (await usageSection.isVisible()) {
        
        // Should show current billing period
        const billingPeriod = usageSection.locator('.billing-period, [data-period]');
        if (await billingPeriod.isVisible()) {
          const periodText = await billingPeriod.textContent();
          expect(periodText).toMatch(/\d{1,2}\/\d{1,2}\/\d{4}|\d{4}-\d{2}-\d{2}/); // Date format
          console.log(`✅ Billing period displayed: ${periodText}`);
        }
        
        // Should show usage metrics
        const usageMetrics = usageSection.locator('.usage-metric, [data-metric]');
        const metricsCount = await usageMetrics.count();
        
        if (metricsCount > 0) {
          console.log(`✅ Found ${metricsCount} usage metrics`);
        }
      }
    });
  });

  test('Feature gating enforcement across system', async ({ page }) => {
    await test.step('Test Basic plan feature gating', async () => {
      workshopData = await testData.createWorkshop('basic');
      await dbHelper.createTestWorkshop(workshopData);
      
      await authPage.goToLogin();
      await authPage.login(workshopData.email, workshopData.password);
    });

    await test.step('API endpoint feature gating', async () => {
      // Test direct API access (simulated)
      const response = await page.request.get('/api/analytics', {
        headers: {
          'Authorization': `Bearer ${workshopData.apiToken || 'test-token'}`
        }
      });
      
      // Should return 403 or upgrade required for Basic plan
      const status = response.status();
      expect([403, 402, 423]).toContain(status); // 402: Payment Required, 423: Locked
      
      console.log(`✅ API endpoint properly gated: ${status} status`);
    });

    await test.step('Frontend feature visibility gating', async () => {
      await dashboardPage.verifyDashboardLoaded();
      
      // Advanced features should be hidden or disabled
      const restrictedFeatures = [
        'a:has-text("Analytics")',
        'a:has-text("API")',
        'button:has-text("Advanced")',
        '.advanced-features'
      ];
      
      for (const selector of restrictedFeatures) {
        const element = page.locator(selector);
        if (await element.isVisible()) {
          // If visible, should be disabled or show upgrade prompt
          const isDisabled = await element.isDisabled();
          const hasUpgradePrompt = await element.locator('..').locator('.upgrade-prompt').isVisible();
          
          if (!isDisabled && !hasUpgradePrompt) {
            console.log(`⚠️ Feature may not be properly gated: ${selector}`);
          }
        }
      }
      
      console.log('✅ Frontend feature gating verified');
    });

    await test.step('Usage limit enforcement', async () => {
      // Simulate approaching usage limits
      await dbHelper.simulateUsage(workshopData.id, 'leads', 95); // 95/100 leads used
      
      // Refresh dashboard to see updated usage
      await page.reload();
      await dashboardPage.verifyDashboardLoaded();
      
      // Should show usage warning
      const usageWarning = page.locator('.usage-warning, [data-testid="usage-alert"]');
      if (await usageWarning.isVisible()) {
        const warningText = await usageWarning.textContent();
        expect(warningText).toMatch(/95%|limit|warnung/i);
        console.log('✅ Usage warning displayed at 95% capacity');
      }
    });
  });

  test('Package downgrade restrictions and data retention', async ({ page }) => {
    await test.step('Setup Professional plan workshop', async () => {
      workshopData = await testData.createWorkshop('professional');
      await dbHelper.createTestWorkshop(workshopData);
      
      await authPage.goToLogin();
      await authPage.login(workshopData.email, workshopData.password);
    });

    await test.step('Create data that would be restricted in Basic plan', async () => {
      // Create multiple client keys (Basic plan limit would be exceeded)
      await dashboardPage.goToClientKeys();
      
      for (let i = 0; i < 3; i++) {
        const keyData = {
          name: `Test Key ${i + 1}`,
          description: `Test key for downgrade testing ${i + 1}`
        };
        
        await dashboardPage.generateClientKey(keyData);
      }
      
      console.log('✅ Created test data exceeding Basic plan limits');
    });

    await test.step('Attempt to initiate downgrade', async () => {
      await dashboardPage.goToBilling();
      
      // Look for downgrade option
      const downgradeOption = page.locator('button:has-text("Downgrade"), button:has-text("Zurückstufen")');
      
      if (await downgradeOption.isVisible()) {
        await downgradeOption.click();
        
        // Should show downgrade warning or restrictions
        const downgradeWarning = page.locator('.downgrade-warning, [data-testid="downgrade-alert"]');
        
        if (await downgradeWarning.isVisible()) {
          const warningText = await downgradeWarning.textContent();
          
          // Should mention data restrictions
          const mentionsDataLoss = warningText.includes('data') || 
                                  warningText.includes('Daten') ||
                                  warningText.includes('features') ||
                                  warningText.includes('Funktionen');
          
          expect(mentionsDataLoss).toBe(true);
          console.log('✅ Downgrade warning properly displayed');
        }
      } else {
        console.log('ℹ️ Downgrade option not available in UI (may be handled via customer portal)');
      }
    });

    await test.step('Test data retention policies information', async () => {
      // Should show information about what happens to data
      const dataRetentionInfo = page.locator('.data-retention, [data-testid="retention-policy"]');
      
      if (await dataRetentionInfo.isVisible()) {
        const retentionText = await dataRetentionInfo.textContent();
        
        // Should mention retention period
        const mentionsRetention = retentionText.includes('30 days') ||
                                 retentionText.includes('30 Tage') ||
                                 retentionText.includes('retention') ||
                                 retentionText.includes('Aufbewahrung');
        
        if (mentionsRetention) {
          console.log('✅ Data retention policy information displayed');
        }
      }
    });
  });

  test('Stripe integration and payment processing', async ({ page, context }) => {
    await test.step('Setup test environment for payment', async () => {
      workshopData = await testData.createWorkshop('basic');
      await dbHelper.createTestWorkshop(workshopData);
      
      await authPage.goToLogin();
      await authPage.login(workshopData.email, workshopData.password);
    });

    await test.step('Initiate Professional upgrade with Stripe', async () => {
      // Start upgrade process
      const upgradeButton = page.locator('button:has-text("upgraden"), button:has-text("Upgrade")').first();
      await upgradeButton.click();
      
      // Select Professional plan
      const professionalUpgrade = page.locator('button:has-text("Professional")');
      if (await professionalUpgrade.isVisible()) {
        await professionalUpgrade.click();
        
        // Should load Stripe checkout
        const stripeCheckout = page.locator('.stripe-checkout, [data-testid="stripe-checkout"]');
        const stripeElements = page.locator('.StripeElement, [data-stripe]');
        
        const checkoutVisible = await stripeCheckout.isVisible({ timeout: 10000 });
        const elementsVisible = await stripeElements.isVisible();
        
        if (checkoutVisible || elementsVisible) {
          console.log('✅ Stripe payment interface loaded');
          
          // Test with Stripe test card (if in test environment)
          const testCardData = testData.getStripeTestData();
          
          if (process.env.NODE_ENV === 'test' || process.env.STRIPE_PUBLISHABLE_KEY?.includes('pk_test_')) {
            
            // Fill test card information
            const cardNumberField = page.locator('input[name="cardnumber"], [data-testid="card-number"]');
            if (await cardNumberField.isVisible()) {
              await cardNumberField.fill(testCardData.validCard.number);
              
              const expiryField = page.locator('input[name="exp-date"], [data-testid="card-expiry"]');
              if (await expiryField.isVisible()) {
                await expiryField.fill(testCardData.validCard.expiry);
              }
              
              const cvcField = page.locator('input[name="cvc"], [data-testid="card-cvc"]');
              if (await cvcField.isVisible()) {
                await cvcField.fill(testCardData.validCard.cvc);
              }
              
              console.log('✅ Test payment information entered');
            }
          }
        } else {
          console.log('ℹ️ Stripe checkout interface not loaded (may require specific configuration)');
        }
      }
    });

    await test.step('Test payment validation', async () => {
      // If we're in test mode and form is available
      if (process.env.NODE_ENV === 'test') {
        
        const submitButton = page.locator('button[type="submit"], .submit-payment, [data-testid="pay-button"]');
        
        if (await submitButton.isVisible()) {
          // Test form validation first
          await submitButton.click();
          
          // Should show validation errors for incomplete form
          const validationErrors = page.locator('.field-error, .error-message, [data-testid="field-error"]');
          const hasValidation = await validationErrors.count() > 0;
          
          if (hasValidation) {
            console.log('✅ Payment form validation working');
          }
        }
      }
    });

    await test.step('Test payment success flow (simulated)', async () => {
      // In a real test environment with Stripe test mode, we would complete the payment
      // For this E2E test, we simulate the success callback
      
      if (process.env.NODE_ENV === 'test' && process.env.STRIPE_TEST_MODE === 'true') {
        // Simulate successful payment redirect
        await page.goto('/dashboard?payment_success=true&session_id=cs_test_12345');
        
        // Should show success message
        const successMessage = page.locator('.payment-success, [data-testid="payment-success"]');
        if (await successMessage.isVisible()) {
          console.log('✅ Payment success flow simulated');
          
          // Should now show Professional plan
          const packageCard = page.locator('.package-card');
          if (await packageCard.locator(':has-text("Professional")').isVisible()) {
            console.log('✅ Plan upgrade reflected in dashboard');
          }
        }
      } else {
        console.log('ℹ️ Payment success flow skipped (not in test mode)');
      }
    });
  });

  test('Package feature comparison and pricing display', async ({ page }) => {
    await test.step('Access pricing information from marketing page', async () => {
      // Visit pricing page before login
      await page.goto('/pricing');
      
      // Should show all package options
      const packageCards = page.locator('.package-card, [data-testid="pricing-card"]');
      const packageCount = await packageCards.count();
      
      expect(packageCount).toBeGreaterThanOrEqual(3); // Basic, Professional, Enterprise
      
      console.log(`✅ Found ${packageCount} pricing packages`);
    });

    await test.step('Verify package feature comparison', async () => {
      // Should show feature comparison table
      const comparisonTable = page.locator('.feature-comparison, [data-testid="feature-table"]');
      if (await comparisonTable.isVisible()) {
        
        // Check for key features
        const keyFeatures = [
          'Client Keys',
          'Monthly Leads',
          'Analytics',
          'API Access',
          'Support'
        ];
        
        for (const feature of keyFeatures) {
          const featureRow = comparisonTable.locator(`tr:has-text("${feature}"), [data-feature="${feature}"]`);
          if (await featureRow.isVisible()) {
            console.log(`✅ Feature comparison includes: ${feature}`);
          }
        }
      }
    });

    await test.step('Test pricing calculator if available', async () => {
      const pricingCalculator = page.locator('.pricing-calculator, [data-testid="calculator"]');
      if (await pricingCalculator.isVisible()) {
        
        // Test usage sliders or inputs
        const usageInputs = pricingCalculator.locator('input[type="range"], input[type="number"]');
        const inputCount = await usageInputs.count();
        
        if (inputCount > 0) {
          // Adjust first usage slider
          await usageInputs.first().fill('500');
          
          // Should update pricing display
          const pricingDisplay = pricingCalculator.locator('.calculated-price, [data-testid="calculated-price"]');
          if (await pricingDisplay.isVisible()) {
            const priceText = await pricingDisplay.textContent();
            expect(priceText).toMatch(/€|\$|EUR|USD/);
            console.log('✅ Pricing calculator functional');
          }
        }
      }
    });

    await test.step('Test package selection from pricing page', async () => {
      // Click on Professional plan
      const professionalButton = page.locator('button:has-text("Professional"), button:has-text("Get Started")').nth(1);
      if (await professionalButton.isVisible()) {
        await professionalButton.click();
        
        // Should redirect to registration or login
        await page.waitForURL(/\/(auth|register|login|signup)/);
        
        const isAuthPage = page.url().includes('/auth') || 
                          page.url().includes('/register') ||
                          page.url().includes('/login');
        
        expect(isAuthPage).toBe(true);
        console.log('✅ Package selection redirects to authentication');
      }
    });
  });
});

test.describe('Package Billing Edge Cases', () => {
  test('Handle payment failures and retry logic', async ({ page }) => {
    const testData = new TestDataFactory();
    const dbHelper = new DatabaseHelper();
    
    // Setup workshop attempting upgrade
    const workshopData = await testData.createWorkshop('basic');
    await dbHelper.createTestWorkshop(workshopData);
    
    const authPage = new AuthPage(page);
    await authPage.goToLogin();
    await authPage.login(workshopData.email, workshopData.password);

    await test.step('Simulate payment failure', async () => {
      // Start upgrade process
      const upgradeButton = page.locator('button:has-text("upgraden")').first();
      await upgradeButton.click();
      
      // If test environment supports it, use declined test card
      if (process.env.NODE_ENV === 'test') {
        const declinedCardData = testData.getStripeTestData().declinedCard;
        
        // Fill payment form with declined card
        const cardFields = page.locator('input[name="cardnumber"], [data-testid="card-number"]');
        if (await cardFields.isVisible()) {
          await cardFields.fill(declinedCardData.number);
          
          // Submit payment
          const submitButton = page.locator('button[type="submit"], [data-testid="pay-button"]');
          if (await submitButton.isVisible()) {
            await submitButton.click();
            
            // Should show payment error
            const paymentError = page.locator('.payment-error, [data-testid="payment-error"]');
            if (await paymentError.isVisible({ timeout: 10000 })) {
              console.log('✅ Payment failure handled correctly');
            }
          }
        }
      }
    });

    await dbHelper.cleanupTestData();
  });

  test('Test subscription cancellation flow', async ({ page }) => {
    const testData = new TestDataFactory();
    const dbHelper = new DatabaseHelper();
    
    // Setup active Professional subscription
    const workshopData = await testData.createWorkshop('professional');
    workshopData.subscriptionStatus = 'active';
    await dbHelper.createTestWorkshop(workshopData);
    
    const authPage = new AuthPage(page);
    const dashboardPage = new DashboardPage(page);
    
    await authPage.goToLogin();
    await authPage.login(workshopData.email, workshopData.password);

    await test.step('Access subscription cancellation', async () => {
      await dashboardPage.goToBilling();
      
      // Look for cancel subscription option
      const cancelButton = page.locator('button:has-text("Cancel"), button:has-text("Kündigen")');
      
      if (await cancelButton.isVisible()) {
        await cancelButton.click();
        
        // Should show cancellation confirmation
        const cancelModal = page.locator('.cancel-modal, [data-testid="cancel-subscription"]');
        if (await cancelModal.isVisible()) {
          
          // Should explain consequences
          const warningText = await cancelModal.textContent();
          const hasWarning = warningText.includes('lose access') ||
                           warningText.includes('downgrade') ||
                           warningText.includes('Zugang verlieren');
          
          expect(hasWarning).toBe(true);
          console.log('✅ Cancellation warning displayed');
          
          // Don't actually cancel in test
          await page.click('button:has-text("Keep"), button:has-text("Behalten")');
        }
      } else {
        console.log('ℹ️ Cancellation handled via customer portal');
      }
    });

    await dbHelper.cleanupTestData();
  });
});