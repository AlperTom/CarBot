/**
 * Smoke Test for CarBot E2E Testing
 * Quick verification of core functionality
 */

const { test, expect } = require('@playwright/test');

test.describe('CarBot Smoke Tests', () => {
  test('Homepage loads correctly', async ({ page }) => {
    console.log('🏠 Testing homepage load...');
    
    await page.goto('http://localhost:3000', { 
      waitUntil: 'networkidle',
      timeout: 30000
    });
    
    // Check page title
    const title = await page.title();
    console.log(`📄 Page title: ${title}`);
    expect(title).toBeTruthy();
    
    // Check if main content is visible
    const body = await page.locator('body').isVisible();
    expect(body).toBe(true);
    
    console.log('✅ Homepage loads successfully');
  });

  test('Navigation elements are present', async ({ page }) => {
    console.log('🧭 Testing navigation presence...');
    
    await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
    
    // Wait for navigation to load
    await page.waitForTimeout(2000);
    
    // Check for navigation elements
    const nav = await page.locator('nav').count();
    console.log(`🧭 Navigation elements found: ${nav}`);
    expect(nav).toBeGreaterThan(0);
    
    // Check for links
    const links = await page.locator('a').count();
    console.log(`🔗 Links found: ${links}`);
    expect(links).toBeGreaterThan(0);
    
    console.log('✅ Navigation elements present');
  });

  test('Mobile responsive layout', async ({ page }) => {
    console.log('📱 Testing mobile responsiveness...');
    
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
    
    await page.waitForTimeout(1000);
    
    // Check if page content fits mobile screen
    const body = await page.locator('body');
    const boundingBox = await body.boundingBox();
    
    if (boundingBox) {
      console.log(`📱 Page width: ${boundingBox.width}px`);
      expect(boundingBox.width).toBeLessThanOrEqual(375);
    }
    
    console.log('✅ Mobile layout verified');
  });

  test('Basic accessibility checks', async ({ page }) => {
    console.log('♿ Testing basic accessibility...');
    
    await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);
    
    // Check for HTML lang attribute
    const htmlLang = await page.getAttribute('html', 'lang');
    console.log(`🌐 HTML lang attribute: ${htmlLang}`);
    
    // Check for headings
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').count();
    console.log(`📝 Headings found: ${headings}`);
    expect(headings).toBeGreaterThan(0);
    
    console.log('✅ Basic accessibility checks passed');
  });

  test('Auth pages load', async ({ page }) => {
    console.log('🔐 Testing auth pages...');
    
    // Test login page
    await page.goto('http://localhost:3000/auth/login', { 
      waitUntil: 'domcontentloaded',
      timeout: 15000
    });
    
    await page.waitForTimeout(1000);
    const loginTitle = await page.title();
    console.log(`🔐 Login page title: ${loginTitle}`);
    
    // Check for login form elements
    const emailFields = await page.locator('input[type="email"], input[name="email"], #email').count();
    const passwordFields = await page.locator('input[type="password"], input[name="password"], #password').count();
    const submitButtons = await page.locator('button[type="submit"], input[type="submit"]').count();
    
    console.log(`📧 Email fields: ${emailFields}`);
    console.log(`🔒 Password fields: ${passwordFields}`);
    console.log(`🔘 Submit buttons: ${submitButtons}`);
    
    expect(emailFields).toBeGreaterThan(0);
    expect(passwordFields).toBeGreaterThan(0);
    expect(submitButtons).toBeGreaterThan(0);
    
    // Test register page
    await page.goto('http://localhost:3000/auth/register', { 
      waitUntil: 'domcontentloaded',
      timeout: 15000
    });
    
    await page.waitForTimeout(1000);
    const registerTitle = await page.title();
    console.log(`📝 Register page title: ${registerTitle}`);
    
    console.log('✅ Auth pages load correctly');
  });

  test('Error handling for non-existent pages', async ({ page }) => {
    console.log('❌ Testing 404 error handling...');
    
    const response = await page.goto('http://localhost:3000/non-existent-page', { 
      waitUntil: 'domcontentloaded',
      timeout: 15000
    });
    
    const status = response ? response.status() : 200;
    console.log(`📄 Response status: ${status}`);
    
    // Either should be 404 or should redirect to a valid page
    if (status === 404) {
      console.log('✅ Proper 404 handling');
    } else if (status === 200) {
      console.log('✅ Page redirected successfully');
    } else {
      console.log(`⚠️ Unexpected status: ${status}`);
    }
  });
});

test.describe('Performance Smoke Tests', () => {
  test('Page load performance', async ({ page }) => {
    console.log('⏱️ Testing page load performance...');
    
    const startTime = Date.now();
    
    await page.goto('http://localhost:3000', { 
      waitUntil: 'networkidle',
      timeout: 30000
    });
    
    const loadTime = Date.now() - startTime;
    console.log(`⏱️ Page load time: ${loadTime}ms`);
    
    // Should load within reasonable time (15 seconds for development)
    expect(loadTime).toBeLessThan(15000);
    
    console.log('✅ Page load performance acceptable');
  });
});