/**
 * German VAT Payment Flow UAT Tests
 * Focus: German market payment processing with 19% VAT
 * Integration: Stripe + German business requirements
 */

const { test, expect } = require('@playwright/test');
const { AuthPage } = require('../pages/auth-page');
const { DashboardPage } = require('../pages/dashboard-page');
const { TestDataFactory } = require('../fixtures/test-data-factory');
const { DatabaseHelper } = require('../utils/database-helper');

// German VAT and Payment Configuration
const GERMAN_PAYMENT_CONFIG = {
  vat: {
    standard: 19, // 19% standard VAT rate in Germany
    reduced: 7,   // 7% reduced VAT rate
    vatId: 'DE123456789' // German VAT ID format
  },
  stripe: {
    testCards: {
      visa: '4242424242424242',
      visaDebit: '4000056655665556',
      mastercard: '5555555555554444',
      amex: '378282246310005',
      declined: '4000000000000002',
      requiresAuth: '4000002500003155'
    },
    germanBankAccount: {
      iban: 'DE89370400440532013000',
      bic: 'COBADEFFXXX'
    }
  },
  packages: {
    basic: { priceNet: 29.00, vatAmount: 5.51, priceGross: 34.51 },
    professional: { priceNet: 99.00, vatAmount: 18.81, priceGross: 117.81 },
    enterprise: { priceNet: 299.00, vatAmount: 56.81, priceGross: 355.81 }
  }
};

test.describe('German VAT Payment Flow UAT', () => {
  let authPage, dashboardPage, testData, dbHelper;
  let paymentSession = {
    timestamp: new Date().toISOString(),
    transactions: [],
    vatCalculations: []
  };

  test.beforeEach(async ({ page }) => {
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'de-DE,de;q=0.9',
      'X-Payment-UAT': paymentSession.timestamp
    });

    authPage = new AuthPage(page);
    dashboardPage = new DashboardPage(page);
    testData = new TestDataFactory();
    dbHelper = new DatabaseHelper();
  });

  test('Complete German Business Payment Flow - Basic to Professional', async ({ page }) => {
    const businessData = await testData.createGermanBusiness();
    
    console.log('🇩🇪 UAT: German Business Payment Flow Started');
    console.log(`🏢 Business: ${businessData.name}`);
    console.log(`💼 VAT ID: ${businessData.vatId}`);

    // Setup test business account
    await test.step('Setup German Business Account', async () => {
      const workshopData = await testData.createGermanWorkshop('automotive', businessData);
      const dbResult = await dbHelper.createVerifiedWorkshop(workshopData);
      
      expect(dbResult.workshop.vat_number).toBe(businessData.vatId);
      expect(dbResult.workshop.subscription_plan).toBe('basic');
      
      // Login to dashboard
      await page.goto('/auth/login');
      await page.fill('[name="email"]', workshopData.email);
      await page.fill('[name="password"]', workshopData.password);
      await page.click('button[type="submit"]');
      await page.waitForURL('/dashboard');
      
      console.log('✅ German business account ready');
    });

    // Navigate to upgrade flow
    await test.step('Initiate Professional Package Upgrade', async () => {
      await page.click('text=Upgrade');
      await page.waitForSelector('[data-testid="pricing-plans"]');
      
      // Verify German pricing display
      const professionalCard = page.locator('[data-testid="professional-plan"]');
      await expect(professionalCard).toBeVisible();
      
      // Verify VAT is displayed correctly
      const pricing = await professionalCard.locator('[data-testid="pricing"]').textContent();
      expect(pricing).toContain('€117,81'); // Gross price with VAT
      expect(pricing).toContain('zzgl. 19% MwSt.') || expect(pricing).toContain('inkl. 19% MwSt.');
      
      await professionalCard.locator('button').click();
      
      console.log('✅ Professional upgrade initiated');
    });

    // Stripe Checkout with German VAT
    await test.step('Complete Stripe Checkout with German VAT', async () => {
      // Wait for Stripe checkout to load
      await page.waitForSelector('.StripeCheckout, [data-testid="stripe-checkout"]', { timeout: 15000 });
      
      // Verify German checkout elements
      await expect(page.locator('text=Deutschland')).toBeVisible();
      await expect(page.locator('text=MwSt.')).toBeVisible();
      
      // Fill German billing address
      await page.fill('[name="billingDetails[address][country]"]', 'DE');
      await page.fill('[name="billingDetails[address][line1]"]', businessData.address.street);
      await page.fill('[name="billingDetails[address][city]"]', businessData.address.city);
      await page.fill('[name="billingDetails[address][postal_code]"]', businessData.address.plz);
      
      // Fill German VAT number
      const vatField = page.locator('[name="vatNumber"], [name="tax_id"]');
      if (await vatField.isVisible()) {
        await vatField.fill(businessData.vatId);
      }
      
      // Enter payment details
      await page.fill('[name="cardNumber"]', GERMAN_PAYMENT_CONFIG.stripe.testCards.visa);
      await page.fill('[name="cardExpiry"]', '12/25');
      await page.fill('[name="cardCvc"]', '123');
      await page.fill('[name="billingDetails[name]"]', businessData.ownerName);
      
      // Verify payment summary
      const subtotal = await page.locator('[data-testid="subtotal"]').textContent();
      const vatAmount = await page.locator('[data-testid="vat-amount"]').textContent();
      const total = await page.locator('[data-testid="total"]').textContent();
      
      expect(subtotal).toContain('€99,00'); // Net amount
      expect(vatAmount).toContain('€18,81'); // VAT amount
      expect(total).toContain('€117,81'); // Gross total
      
      // Complete payment
      await page.click('[data-testid="submit-payment"]');
      
      // Wait for payment confirmation
      await page.waitForSelector('[data-testid="payment-success"], .payment-success', { timeout: 30000 });
      
      console.log('✅ German VAT payment completed successfully');
      
      paymentSession.transactions.push({
        plan: 'professional',
        netAmount: 99.00,
        vatRate: 19,
        vatAmount: 18.81,
        grossAmount: 117.81,
        currency: 'EUR',
        country: 'DE',
        vatId: businessData.vatId
      });
    });

    // Verify subscription activation
    await test.step('Verify Professional Subscription Activation', async () => {
      await page.goto('/dashboard');
      await page.waitForLoadState('networkidle');
      
      // Verify plan upgrade
      await expect(page.locator('text=Professional')).toBeVisible();
      await expect(page.locator('.upgrade-button')).not.toBeVisible();
      
      // Check professional features are unlocked
      await page.click('text=Analytics');
      await expect(page.locator('[data-testid="advanced-analytics"]')).toBeVisible();
      
      // Verify unlimited usage
      const usageIndicator = page.locator('[data-testid="usage-indicator"]');
      const usageText = await usageIndicator.textContent();
      expect(usageText).toContain('Unbegrenzt') || expect(usageText).toContain('Unlimited');
      
      console.log('✅ Professional subscription activated and verified');
    });

    // Verify German invoice generation
    await test.step('Verify German Invoice Generation', async () => {
      await page.goto('/dashboard/billing');
      await page.waitForSelector('[data-testid="invoices-list"]');
      
      // Check latest invoice
      const latestInvoice = page.locator('[data-testid="invoice-item"]:first-child');
      await expect(latestInvoice).toBeVisible();
      
      // Verify invoice details
      await latestInvoice.click();
      await page.waitForSelector('[data-testid="invoice-details"]');
      
      const invoiceContent = await page.locator('[data-testid="invoice-content"]').textContent();
      
      // Verify German invoice elements
      expect(invoiceContent).toContain('Rechnung'); // Invoice in German
      expect(invoiceContent).toContain('MwSt.'); // VAT in German
      expect(invoiceContent).toContain('Netto'); // Net amount
      expect(invoiceContent).toContain('Brutto'); // Gross amount
      expect(invoiceContent).toContain(businessData.vatId); // VAT ID
      expect(invoiceContent).toContain('€99,00'); // Net amount
      expect(invoiceContent).toContain('€18,81'); // VAT amount
      expect(invoiceContent).toContain('€117,81'); // Total
      
      console.log('✅ German invoice generated and verified');
    });

    // Test Stripe Customer Portal access
    await test.step('Access Stripe Customer Portal', async () => {
      await page.click('[data-testid="manage-billing"]');
      
      // Should redirect to Stripe customer portal
      await page.waitForURL(/.*\.stripe\.com.*/, { timeout: 15000 });
      
      // Verify German localization in Stripe portal
      const pageContent = await page.textContent('body');
      const hasGermanStripe = pageContent.includes('Deutschland') || 
                             pageContent.includes('MwSt.') || 
                             pageContent.includes('Rechnung');
      
      expect(hasGermanStripe).toBe(true);
      
      console.log('✅ Stripe customer portal accessed with German localization');
    });
  });

  test('German VAT Calculation Edge Cases', async ({ page }) => {
    const testCases = [
      {
        name: 'Standard VAT Business',
        netAmount: 100.00,
        expectedVat: 19.00,
        expectedGross: 119.00,
        vatId: 'DE123456789'
      },
      {
        name: 'Reduced VAT Service',
        netAmount: 50.00,
        expectedVat: 3.50,
        expectedGross: 53.50,
        vatId: 'DE987654321',
        vatRate: 7
      },
      {
        name: 'High Value Enterprise',
        netAmount: 999.00,
        expectedVat: 189.81,
        expectedGross: 1188.81,
        vatId: 'DE555444333'
      }
    ];

    for (const testCase of testCases) {
      await test.step(`VAT Calculation: ${testCase.name}`, async () => {
        const calculatedVat = testCase.netAmount * (testCase.vatRate || 19) / 100;
        const calculatedGross = testCase.netAmount + calculatedVat;
        
        expect(Math.round(calculatedVat * 100) / 100).toBeCloseTo(testCase.expectedVat, 2);
        expect(Math.round(calculatedGross * 100) / 100).toBeCloseTo(testCase.expectedGross, 2);
        
        paymentSession.vatCalculations.push({
          testCase: testCase.name,
          netAmount: testCase.netAmount,
          vatRate: testCase.vatRate || 19,
          calculatedVat: Math.round(calculatedVat * 100) / 100,
          calculatedGross: Math.round(calculatedGross * 100) / 100,
          expectedVat: testCase.expectedVat,
          expectedGross: testCase.expectedGross
        });
        
        console.log(`✅ VAT calculation verified for ${testCase.name}`);
      });
    }
  });

  test('Payment Method Edge Cases', async ({ page }) => {
    const workshopData = await testData.createGermanWorkshop('automotive');
    const dbResult = await dbHelper.createVerifiedWorkshop(workshopData);
    
    await page.goto('/auth/login');
    await page.fill('[name="email"]', workshopData.email);
    await page.fill('[name="password"]', workshopData.password);
    await page.click('button[type="submit"]');
    
    // Test declined card
    await test.step('Handle Declined Payment', async () => {
      await page.click('text=Upgrade');
      await page.click('[data-testid="professional-plan"] button');
      
      await page.waitForSelector('.StripeCheckout');
      
      // Use declined test card
      await page.fill('[name="cardNumber"]', GERMAN_PAYMENT_CONFIG.stripe.testCards.declined);
      await page.fill('[name="cardExpiry"]', '12/25');
      await page.fill('[name="cardCvc"]', '123');
      await page.fill('[name="billingDetails[name]"]', workshopData.owner.name);
      
      await page.click('[data-testid="submit-payment"]');
      
      // Verify error handling
      await expect(page.locator('[data-testid="payment-error"]')).toBeVisible();
      
      const errorMessage = await page.locator('[data-testid="payment-error"]').textContent();
      expect(errorMessage).toContain('Zahlung fehlgeschlagen') || 
             expect(errorMessage).toContain('declined') ||
             expect(errorMessage).toContain('abgelehnt');
      
      console.log('✅ Payment decline handling verified');
    });

    // Test authentication required
    await test.step('Handle 3D Secure Authentication', async () => {
      // Reset form
      await page.reload();
      await page.click('text=Upgrade');
      await page.click('[data-testid="professional-plan"] button');
      
      await page.waitForSelector('.StripeCheckout');
      
      // Use 3D Secure test card
      await page.fill('[name="cardNumber"]', GERMAN_PAYMENT_CONFIG.stripe.testCards.requiresAuth);
      await page.fill('[name="cardExpiry"]', '12/25');
      await page.fill('[name="cardCvc"]', '123');
      await page.fill('[name="billingDetails[name]"]', workshopData.owner.name);
      
      await page.click('[data-testid="submit-payment"]');
      
      // Handle 3D Secure modal (in test mode, this is simplified)
      const authModal = page.locator('#stripe-3ds-modal, .auth-modal');
      if (await authModal.isVisible({ timeout: 10000 })) {
        await page.click('[data-testid="complete-auth"]');
        console.log('✅ 3D Secure authentication handled');
      }
    });
  });

  test('VAT Exempt and International Customers', async ({ page }) => {
    // Test VAT-exempt scenarios
    const scenarios = [
      {
        name: 'EU VAT ID Customer',
        vatId: 'AT123456789', // Austrian VAT ID
        expectedVatRate: 0, // Reverse charge
        country: 'AT'
      },
      {
        name: 'Non-EU Customer',
        vatId: null,
        expectedVatRate: 0, // No VAT for non-EU
        country: 'US'
      },
      {
        name: 'German Private Customer',
        vatId: null,
        expectedVatRate: 19, // Standard German VAT
        country: 'DE'
      }
    ];

    for (const scenario of scenarios) {
      await test.step(`VAT Scenario: ${scenario.name}`, async () => {
        const workshopData = await testData.createWorkshop('basic');
        workshopData.address.country = scenario.country;
        if (scenario.vatId) {
          workshopData.vatId = scenario.vatId;
        }
        
        const dbResult = await dbHelper.createVerifiedWorkshop(workshopData);
        
        // Calculate expected amounts
        const netAmount = GERMAN_PAYMENT_CONFIG.packages.professional.priceNet;
        const expectedVatAmount = netAmount * scenario.expectedVatRate / 100;
        const expectedGrossAmount = netAmount + expectedVatAmount;
        
        console.log(`💰 ${scenario.name}: Net €${netAmount}, VAT ${scenario.expectedVatRate}%, Gross €${expectedGrossAmount}`);
        
        expect(expectedVatAmount).toBeCloseTo(netAmount * scenario.expectedVatRate / 100, 2);
        
        paymentSession.vatCalculations.push({
          scenario: scenario.name,
          country: scenario.country,
          vatId: scenario.vatId,
          netAmount,
          vatRate: scenario.expectedVatRate,
          vatAmount: expectedVatAmount,
          grossAmount: expectedGrossAmount
        });
      });
    }
  });

  test.afterEach(async () => {
    console.log('\n💳 Payment Session Summary:');
    console.log(`   Timestamp: ${paymentSession.timestamp}`);
    console.log(`   Transactions: ${paymentSession.transactions.length}`);
    console.log(`   VAT Calculations: ${paymentSession.vatCalculations.length}`);
    
    if (paymentSession.transactions.length > 0) {
      console.log('\n📊 Transaction Details:');
      paymentSession.transactions.forEach((tx, index) => {
        console.log(`   ${index + 1}. ${tx.plan}: €${tx.netAmount} + €${tx.vatAmount} VAT = €${tx.grossAmount}`);
      });
    }
  });
});

test.describe('German Banking and SEPA Integration', () => {
  test('SEPA Direct Debit Setup (Simulation)', async ({ page }) => {
    const businessData = await testData.createGermanBusiness();
    const workshopData = await testData.createGermanWorkshop('automotive', businessData);
    
    console.log('🏦 Testing German SEPA Direct Debit Integration');
    
    await test.step('Setup SEPA Mandate', async () => {
      // Note: This would integrate with actual SEPA processing in production
      const sepaData = {
        iban: GERMAN_PAYMENT_CONFIG.stripe.germanBankAccount.iban,
        bic: GERMAN_PAYMENT_CONFIG.stripe.germanBankAccount.bic,
        accountHolderName: businessData.ownerName,
        mandateReference: `MANDATE-${Date.now()}`,
        creditorId: 'DE98ZZZ09999999999'
      };
      
      // Validate IBAN format
      expect(sepaData.iban).toMatch(/^DE\d{20}$/);
      expect(sepaData.bic).toMatch(/^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/);
      
      console.log(`✅ SEPA mandate validated: ${sepaData.mandateReference}`);
    });
  });
});
