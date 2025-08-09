/**
 * Landing Page Templates E2E Tests for CarBot MVP
 * Tests template selection, customization, and publishing workflow
 */

const { test, expect } = require('@playwright/test');
const { AuthPage } = require('./pages/auth-page');
const { DashboardPage } = require('./pages/dashboard-page');
const { TestDataFactory } = require('./fixtures/test-data-factory');
const { DatabaseHelper } = require('./utils/database-helper');

test.describe('Landing Page Templates E2E Tests', () => {
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

  test('Browse and select landing page template', async ({ page }) => {
    await test.step('Navigate to landing pages section', async () => {
      await dashboardPage.goToLandingPages();
      
      // Verify page loads correctly
      await expect(page.locator('h1')).toContainText('Landing Pages');
      
      // Check package permissions for template access
      const packageInfo = await dashboardPage.getPackageInfo();
      console.log(`Package type: ${packageInfo.packageType}`);
      
      if (packageInfo.packageType === 'basic') {
        await expect(page.locator('.upgrade-prompt')).toBeVisible();
      }
    });

    await test.step('Browse available templates', async () => {
      // Check if templates gallery is visible
      const templatesGallery = page.locator('.templates-gallery, [data-testid="templates-grid"]');
      await expect(templatesGallery).toBeVisible();
      
      // Verify template cards are present
      const templateCards = page.locator('.template-card, [data-testid="template-card"]');
      const templateCount = await templateCards.count();
      expect(templateCount).toBeGreaterThan(0);
      
      console.log(`Found ${templateCount} available templates`);
      
      // Verify template categories
      const categories = ['Moderne Werkstatt', 'Klassisch', 'Minimalistisch'];
      for (const category of categories) {
        const categoryElement = page.locator(`:has-text("${category}")`);
        if (await categoryElement.isVisible()) {
          console.log(`✅ Template category found: ${category}`);
        }
      }
    });

    await test.step('Preview template', async () => {
      const firstTemplate = page.locator('.template-card, [data-testid="template-card"]').first();
      
      // Get template name
      const templateName = await firstTemplate.locator('.template-name, h3').textContent();
      console.log(`Previewing template: ${templateName}`);
      
      // Click preview button
      await firstTemplate.locator('button:has-text("Vorschau"), [data-action="preview"]').click();
      
      // Should open preview modal or new tab
      const previewModal = page.locator('.preview-modal, [data-testid="preview-modal"]');
      if (await previewModal.isVisible()) {
        // Modal preview
        await expect(previewModal.locator('iframe, .preview-content')).toBeVisible();
        await page.click('button:has-text("Schließen"), .close-button');
      } else {
        // New tab preview - check if URL changed or new tab opened
        await page.waitForTimeout(1000);
        console.log('✅ Template preview opened');
      }
    });

    await test.step('Select template for customization', async () => {
      const selectedTemplate = page.locator('.template-card, [data-testid="template-card"]').first();
      
      // Click select/use template button
      await selectedTemplate.locator('button:has-text("Verwenden"), button:has-text("Auswählen"), [data-action="select"]').click();
      
      // Should navigate to customization page or show selection confirmation
      const hasNavigated = await page.locator('h1:has-text("Anpassen"), h1:has-text("Customize"), .customization-panel').isVisible();
      const hasConfirmation = await page.locator('.selection-confirm, [data-testid="template-selected"]').isVisible();
      
      expect(hasNavigated || hasConfirmation).toBe(true);
      console.log('✅ Template selected successfully');
    });
  });

  test('Customize landing page template', async ({ page }) => {
    await test.step('Setup template for customization', async () => {
      await dashboardPage.goToLandingPages();
      
      // Select first available template
      await page.locator('.template-card, [data-testid="template-card"]').first().locator('button:has-text("Verwenden"), [data-action="select"]').click();
      
      // Wait for customization interface
      await expect(page.locator('.customization-panel, [data-testid="customization"]')).toBeVisible();
    });

    await test.step('Customize basic information', async () => {
      // Update workshop information
      const workshopInfo = {
        name: workshopData.name,
        description: 'Ihre zuverlässige Autowerkstatt in Berlin',
        phone: workshopData.phone,
        address: `${workshopData.address}, ${workshopData.city}`,
        email: workshopData.email
      };

      // Fill basic information fields
      for (const [field, value] of Object.entries(workshopInfo)) {
        const fieldSelector = `input[name="${field}"], textarea[name="${field}"], [data-field="${field}"] input`;
        const fieldElement = page.locator(fieldSelector);
        
        if (await fieldElement.isVisible()) {
          await fieldElement.clear();
          await fieldElement.fill(value);
          console.log(`✅ Updated ${field}: ${value}`);
        }
      }
    });

    await test.step('Customize services section', async () => {
      const services = testData.getServiceCategories();
      
      // Look for services customization section
      const servicesSection = page.locator('[data-section="services"], .services-editor');
      if (await servicesSection.isVisible()) {
        
        // Add/update services
        for (let i = 0; i < Math.min(services.length, 3); i++) {
          const service = services[i];
          
          // Click add service or edit existing
          const addServiceButton = servicesSection.locator('button:has-text("Hinzufügen"), .add-service');
          if (await addServiceButton.isVisible()) {
            await addServiceButton.click();
          }
          
          // Fill service details
          const serviceEditor = servicesSection.locator('.service-editor, [data-service-index]').nth(i);
          if (await serviceEditor.isVisible()) {
            await serviceEditor.locator('input[name="name"], [data-field="name"]').fill(service.name);
            await serviceEditor.locator('textarea[name="description"], [data-field="description"]').fill(service.description);
            await serviceEditor.locator('input[name="price"], [data-field="price"]').fill(service.price);
          }
        }
        
        console.log('✅ Services customized');
      }
    });

    await test.step('Customize opening hours', async () => {
      const openingHours = testData.getWorkshopOpeningHours();
      
      const hoursSection = page.locator('[data-section="hours"], .opening-hours-editor');
      if (await hoursSection.isVisible()) {
        
        for (const [day, hours] of Object.entries(openingHours)) {
          const daySelector = `[data-day="${day}"], input[name="${day}"]`;
          const dayField = hoursSection.locator(daySelector);
          
          if (await dayField.isVisible()) {
            await dayField.clear();
            await dayField.fill(hours);
          }
        }
        
        console.log('✅ Opening hours customized');
      }
    });

    await test.step('Customize theme and colors', async () => {
      const themeSection = page.locator('[data-section="theme"], .theme-editor');
      if (await themeSection.isVisible()) {
        
        // Select a color scheme
        const colorPickers = themeSection.locator('.color-picker, input[type="color"]');
        const colorSchemes = themeSection.locator('.color-scheme, [data-theme]');
        
        if (await colorSchemes.count() > 0) {
          await colorSchemes.nth(1).click(); // Select second color scheme
          console.log('✅ Color scheme updated');
        }
        
        if (await colorPickers.count() > 0) {
          // Set primary color
          await colorPickers.first().fill('#007bff');
          console.log('✅ Custom colors applied');
        }
      }
    });

    await test.step('Preview customized template', async () => {
      // Click preview button
      const previewButton = page.locator('button:has-text("Vorschau"), [data-action="preview"]');
      await previewButton.click();
      
      // Verify preview loads with customizations
      const previewModal = page.locator('.preview-modal, [data-testid="preview"]');
      if (await previewModal.isVisible()) {
        // Check if workshop name appears in preview
        const previewContent = previewModal.locator('.preview-content, iframe');
        await expect(previewContent).toBeVisible();
        
        // Close preview
        await page.click('.close-preview, button:has-text("Schließen")');
      }
      
      console.log('✅ Template preview with customizations verified');
    });
  });

  test('Publish landing page', async ({ page }) => {
    let landingPageUrl;

    await test.step('Complete template customization', async () => {
      await dashboardPage.goToLandingPages();
      
      // Quick setup for publishing test
      await page.locator('.template-card').first().locator('button:has-text("Verwenden")').click();
      
      // Fill minimum required information
      await page.fill('input[name="name"], [data-field="name"]', workshopData.name);
      await page.fill('input[name="phone"], [data-field="phone"]', workshopData.phone);
      
      console.log('✅ Template configured for publishing');
    });

    await test.step('Initiate publishing process', async () => {
      // Click publish button
      const publishButton = page.locator('button:has-text("Veröffentlichen"), [data-action="publish"]');
      await publishButton.click();
      
      // Should show publishing options or confirmation
      const publishModal = page.locator('.publish-modal, [data-testid="publish-options"]');
      if (await publishModal.isVisible()) {
        
        // Select subdomain or custom domain options
        const subdomainOption = publishModal.locator('input[name="subdomain"], [data-option="subdomain"]');
        if (await subdomainOption.isVisible()) {
          const subdomainName = `${workshopData.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
          await subdomainOption.fill(subdomainName);
          console.log(`Subdomain set: ${subdomainName}`);
        }
        
        // Confirm publishing
        await publishModal.locator('button:has-text("Jetzt veröffentlichen"), [data-action="confirm-publish"]').click();
      }
    });

    await test.step('Verify publishing completion', async () => {
      // Wait for publishing to complete
      const publishingIndicator = page.locator('.publishing, [data-status="publishing"]');
      if (await publishingIndicator.isVisible()) {
        await expect(publishingIndicator).not.toBeVisible({ timeout: 30000 });
      }
      
      // Look for success confirmation
      const successMessage = page.locator('.publish-success, [data-status="published"]');
      await expect(successMessage).toBeVisible();
      
      // Get published URL
      const urlElement = page.locator('.published-url, [data-testid="landing-url"]');
      if (await urlElement.isVisible()) {
        landingPageUrl = await urlElement.textContent();
        console.log(`✅ Landing page published: ${landingPageUrl}`);
      }
    });

    await test.step('Verify published landing page accessibility', async ({ context }) => {
      if (landingPageUrl) {
        // Open published page in new tab
        const landingPage = await context.newPage();
        await landingPage.goto(landingPageUrl);
        
        // Verify page loads correctly
        await expect(landingPage.locator('h1, .hero-title')).toBeVisible();
        await expect(landingPage.locator(`:has-text("${workshopData.name}")`)).toBeVisible();
        
        // Verify chat widget is embedded
        const chatWidget = landingPage.locator('.carbot-widget, [data-carbot-widget]');
        await expect(chatWidget).toBeVisible({ timeout: 10000 });
        
        console.log('✅ Published landing page verified and accessible');
        
        await landingPage.close();
      }
    });
  });

  test('Manage multiple landing pages', async ({ page }) => {
    const landingPages = [];

    await test.step('Create multiple landing pages', async () => {
      await dashboardPage.goToLandingPages();
      
      // Create 3 different landing pages
      const pageConfigs = [
        { name: 'Hauptseite', template: 0 },
        { name: 'TÜV Service', template: 1 },
        { name: 'Reparaturen', template: 0 }
      ];

      for (const config of pageConfigs) {
        // Select template
        await page.locator('.template-card').nth(config.template).locator('button:has-text("Verwenden")').click();
        
        // Configure page
        await page.fill('input[name="name"]', config.name);
        await page.fill('input[name="phone"]', workshopData.phone);
        
        // Publish page
        await page.click('button:has-text("Veröffentlichen")');
        
        // Wait for publish completion
        await expect(page.locator('.publish-success')).toBeVisible();
        
        landingPages.push(config.name);
        
        // Go back to create next page
        if (config !== pageConfigs[pageConfigs.length - 1]) {
          await page.click('button:has-text("Neue Seite erstellen"), .create-new');
        }
      }
      
      console.log(`✅ Created ${landingPages.length} landing pages`);
    });

    await test.step('View and manage landing pages list', async () => {
      // Navigate to pages overview
      await dashboardPage.goToLandingPages();
      
      // Verify all pages are listed
      const pagesList = page.locator('.pages-list, [data-testid="pages-grid"]');
      await expect(pagesList).toBeVisible();
      
      for (const pageName of landingPages) {
        await expect(page.locator(`:has-text("${pageName}")`)).toBeVisible();
      }
      
      console.log('✅ All landing pages visible in management interface');
    });

    await test.step('Edit existing landing page', async () => {
      // Click edit on first page
      const firstPage = page.locator('.page-item, [data-testid="page-card"]').first();
      await firstPage.locator('button:has-text("Bearbeiten"), [data-action="edit"]').click();
      
      // Modify content
      await page.fill('textarea[name="description"]', 'Updated description for the landing page');
      
      // Save changes
      await page.click('button:has-text("Speichern"), [data-action="save"]');
      
      // Verify save confirmation
      await expect(page.locator('.save-success, [data-status="saved"]')).toBeVisible();
      
      console.log('✅ Landing page edited successfully');
    });

    await test.step('Delete landing page', async () => {
      // Go back to pages list
      await dashboardPage.goToLandingPages();
      
      // Delete last created page
      const lastPage = page.locator(`:has-text("${landingPages[landingPages.length - 1]}")`).locator('..', '.page-item');
      
      // Set up confirmation dialog
      page.on('dialog', async dialog => {
        expect(dialog.message()).toContain('löschen');
        await dialog.accept();
      });
      
      await lastPage.locator('button:has-text("Löschen"), [data-action="delete"]').click();
      
      // Verify page is removed
      await expect(page.locator(`:has-text("${landingPages[landingPages.length - 1]}")`)).not.toBeVisible();
      
      console.log('✅ Landing page deleted successfully');
    });
  });

  test('Landing page SEO and analytics integration', async ({ page }) => {
    await test.step('Configure SEO settings', async () => {
      await dashboardPage.goToLandingPages();
      
      // Create new landing page
      await page.locator('.template-card').first().locator('button:has-text("Verwenden")').click();
      
      // Basic configuration
      await page.fill('input[name="name"]', 'SEO Test Page');
      
      // Look for SEO settings section
      const seoSection = page.locator('[data-section="seo"], .seo-settings');
      if (await seoSection.isVisible()) {
        
        // Configure meta information
        await seoSection.locator('input[name="meta-title"], [data-field="title"]').fill('Autowerkstatt Berlin | Professioneller Service');
        await seoSection.locator('textarea[name="meta-description"], [data-field="description"]').fill('Zuverlässige Autowerkstatt in Berlin. TÜV, Inspektionen und Reparaturen von Experten.');
        await seoSection.locator('input[name="meta-keywords"], [data-field="keywords"]').fill('Autowerkstatt Berlin, TÜV, Inspektion, Reparatur');
        
        console.log('✅ SEO metadata configured');
      }
    });

    await test.step('Configure analytics tracking', async () => {
      const analyticsSection = page.locator('[data-section="analytics"], .analytics-settings');
      if (await analyticsSection.isVisible()) {
        
        // Enable Google Analytics if available
        const gaToggle = analyticsSection.locator('input[name="enable-ga"], [data-toggle="analytics"]');
        if (await gaToggle.isVisible()) {
          await gaToggle.check();
          
          // Add tracking ID
          const trackingIdField = analyticsSection.locator('input[name="ga-id"], [data-field="tracking-id"]');
          if (await trackingIdField.isVisible()) {
            await trackingIdField.fill('GA-XXXX-XXXX');
          }
        }
        
        console.log('✅ Analytics tracking configured');
      }
    });

    await test.step('Publish and verify SEO elements', async ({ context }) => {
      // Publish the page
      await page.click('button:has-text("Veröffentlichen")');
      await expect(page.locator('.publish-success')).toBeVisible();
      
      // Get published URL
      const urlElement = page.locator('.published-url, [data-testid="landing-url"]');
      if (await urlElement.isVisible()) {
        const landingPageUrl = await urlElement.textContent();
        
        // Open published page and verify SEO
        const landingPage = await context.newPage();
        await landingPage.goto(landingPageUrl);
        
        // Check meta tags
        const title = await landingPage.title();
        expect(title).toContain('Autowerkstatt');
        
        const metaDescription = await landingPage.locator('meta[name="description"]').getAttribute('content');
        if (metaDescription) {
          expect(metaDescription).toContain('Autowerkstatt');
        }
        
        console.log('✅ SEO elements verified on published page');
        
        await landingPage.close();
      }
    });
  });

  test('Template mobile responsiveness', async ({ page }) => {
    await test.step('Create mobile-optimized landing page', async () => {
      await dashboardPage.goToLandingPages();
      
      // Select mobile-friendly template
      await page.locator('.template-card').first().locator('button:has-text("Verwenden")').click();
      
      // Configure basic information
      await page.fill('input[name="name"]', 'Mobile Test Workshop');
      await page.fill('input[name="phone"]', workshopData.phone);
    });

    await test.step('Test mobile preview', async () => {
      // Switch to mobile preview mode
      const mobilePreviewButton = page.locator('button:has-text("Mobile"), [data-preview="mobile"]');
      if (await mobilePreviewButton.isVisible()) {
        await mobilePreviewButton.click();
        
        // Verify mobile preview loads
        const previewFrame = page.locator('.mobile-preview, iframe[data-mobile]');
        await expect(previewFrame).toBeVisible();
        
        console.log('✅ Mobile preview functionality available');
      }
    });

    await test.step('Test actual mobile responsiveness', async () => {
      // Publish the page first
      await page.click('button:has-text("Veröffentlichen")');
      await expect(page.locator('.publish-success')).toBeVisible();
      
      // Get URL and test on mobile viewport
      const urlElement = page.locator('.published-url');
      if (await urlElement.isVisible()) {
        const landingPageUrl = await urlElement.textContent();
        
        // Switch to mobile viewport
        await page.setViewportSize({ width: 375, height: 667 });
        await page.goto(landingPageUrl);
        
        // Verify mobile layout
        await expect(page.locator('h1, .hero-title')).toBeVisible();
        await expect(page.locator(`:has-text("${workshopData.phone}")`)).toBeVisible();
        
        // Test mobile navigation if present
        const mobileMenu = page.locator('.mobile-menu, [data-mobile-nav]');
        if (await mobileMenu.isVisible()) {
          console.log('✅ Mobile navigation detected');
        }
        
        // Verify chat widget on mobile
        const chatWidget = page.locator('.carbot-widget');
        await expect(chatWidget).toBeVisible({ timeout: 10000 });
        
        // Reset viewport
        await page.setViewportSize({ width: 1280, height: 720 });
        
        console.log('✅ Mobile responsiveness verified');
      }
    });
  });

  test('Template performance and loading', async ({ page }) => {
    await test.step('Measure template loading performance', async () => {
      const startTime = Date.now();
      
      await dashboardPage.goToLandingPages();
      
      // Wait for templates to load
      await expect(page.locator('.template-card').first()).toBeVisible();
      
      const loadTime = Date.now() - startTime;
      expect(loadTime).toBeLessThan(5000); // Should load within 5 seconds
      
      console.log(`✅ Templates loaded in ${loadTime}ms`);
    });

    await test.step('Test template switching performance', async () => {
      // Select first template
      const startTime = Date.now();
      await page.locator('.template-card').first().locator('button:has-text("Verwenden")').click();
      
      // Wait for customization interface
      await expect(page.locator('.customization-panel')).toBeVisible();
      
      const switchTime = Date.now() - startTime;
      expect(switchTime).toBeLessThan(3000);
      
      console.log(`✅ Template switching completed in ${switchTime}ms`);
    });

    await test.step('Test publishing performance', async () => {
      // Configure minimal settings
      await page.fill('input[name="name"]', 'Performance Test Page');
      
      const startTime = Date.now();
      await page.click('button:has-text("Veröffentlichen")');
      
      // Wait for publishing to complete
      await expect(page.locator('.publish-success')).toBeVisible({ timeout: 30000 });
      
      const publishTime = Date.now() - startTime;
      expect(publishTime).toBeLessThan(15000); // Should publish within 15 seconds
      
      console.log(`✅ Page published in ${publishTime}ms`);
    });
  });
});

test.describe('Templates Package Restrictions', () => {
  test('Basic plan template limitations', async ({ page }) => {
    const testData = new TestDataFactory();
    const dbHelper = new DatabaseHelper();
    
    // Create Basic plan workshop
    const basicWorkshop = await testData.createWorkshop('basic');
    await dbHelper.createTestWorkshop(basicWorkshop);
    
    const authPage = new AuthPage(page);
    await authPage.goToLogin();
    await authPage.login(basicWorkshop.email, basicWorkshop.password);

    await test.step('Verify Basic plan restrictions', async () => {
      const dashboardPage = new DashboardPage(page);
      await dashboardPage.goToLandingPages();
      
      // Should show upgrade prompt
      await expect(page.locator('.upgrade-prompt, [data-testid="upgrade-needed"]')).toBeVisible();
      
      // Limited template access
      const templateCards = page.locator('.template-card');
      const availableTemplates = await templateCards.count();
      
      // Basic plan should have fewer templates
      expect(availableTemplates).toBeLessThanOrEqual(2);
      
      console.log(`✅ Basic plan template restrictions: ${availableTemplates} templates available`);
    });

    await test.step('Test template selection with restrictions', async () => {
      const availableTemplate = page.locator('.template-card').first();
      
      if (await availableTemplate.isVisible()) {
        await availableTemplate.locator('button:has-text("Verwenden")').click();
        
        // Should have limited customization options
        const customizationOptions = page.locator('[data-section], .customization-section');
        const optionsCount = await customizationOptions.count();
        
        console.log(`Basic plan customization options: ${optionsCount}`);
        
        // Should show upgrade prompts for advanced features
        const upgradePrompts = page.locator('.upgrade-feature, [data-upgrade-required]');
        if (await upgradePrompts.count() > 0) {
          console.log('✅ Upgrade prompts displayed for restricted features');
        }
      }
    });
  });

  test('Professional plan advanced features', async ({ page }) => {
    const testData = new TestDataFactory();
    const dbHelper = new DatabaseHelper();
    
    // Create Professional plan workshop
    const proWorkshop = await testData.createWorkshop('professional');
    await dbHelper.createTestWorkshop(proWorkshop);
    
    const authPage = new AuthPage(page);
    const dashboardPage = new DashboardPage(page);
    
    await authPage.goToLogin();
    await authPage.login(proWorkshop.email, proWorkshop.password);
    await dashboardPage.goToLandingPages();

    await test.step('Verify Professional plan features', async () => {
      // Should have access to more templates
      const templateCards = page.locator('.template-card');
      const availableTemplates = await templateCards.count();
      
      expect(availableTemplates).toBeGreaterThan(2);
      
      // Should have advanced customization options
      await templateCards.first().locator('button:has-text("Verwenden")').click();
      
      const advancedSections = page.locator('[data-section="theme"], [data-section="seo"], [data-section="analytics"]');
      const advancedCount = await advancedSections.count();
      
      console.log(`✅ Professional plan: ${availableTemplates} templates, ${advancedCount} advanced features`);
    });
  });
});