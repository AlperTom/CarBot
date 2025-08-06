/**
 * Base Page Object for CarBot E2E Tests
 * Contains common functionality shared across all pages
 */

class BasePage {
  constructor(page) {
    this.page = page;
    this.baseURL = process.env.BASE_URL || 'http://localhost:3000';
  }

  /**
   * Navigate to a specific path
   */
  async goto(path = '') {
    const url = path.startsWith('http') ? path : `${this.baseURL}${path}`;
    await this.page.goto(url, { waitUntil: 'networkidle' });
  }

  /**
   * Wait for element to be visible
   */
  async waitForElement(selector, timeout = 10000) {
    return await this.page.waitForSelector(selector, { 
      state: 'visible', 
      timeout 
    });
  }

  /**
   * Wait for text to appear on page
   */
  async waitForText(text, timeout = 10000) {
    return await this.page.waitForFunction(
      text => document.body.textContent.includes(text),
      text,
      { timeout }
    );
  }

  /**
   * Fill form field with validation
   */
  async fillField(selector, value, options = {}) {
    await this.waitForElement(selector);
    await this.page.fill(selector, value);
    
    if (options.validate) {
      const fieldValue = await this.page.inputValue(selector);
      if (fieldValue !== value) {
        throw new Error(`Field ${selector} value mismatch. Expected: ${value}, Got: ${fieldValue}`);
      }
    }
  }

  /**
   * Click element with wait
   */
  async clickElement(selector, options = {}) {
    await this.waitForElement(selector);
    await this.page.click(selector, { timeout: options.timeout || 10000 });
  }

  /**
   * Select dropdown option
   */
  async selectOption(selector, value) {
    await this.waitForElement(selector);
    await this.page.selectOption(selector, value);
  }

  /**
   * Check if element exists
   */
  async elementExists(selector) {
    try {
      await this.page.waitForSelector(selector, { timeout: 1000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get element text content
   */
  async getTextContent(selector) {
    await this.waitForElement(selector);
    return await this.page.textContent(selector);
  }

  /**
   * Get multiple elements text content
   */
  async getAllTextContent(selector) {
    await this.page.waitForSelector(selector, { timeout: 5000 });
    return await this.page.$$eval(selector, elements => 
      elements.map(el => el.textContent.trim())
    );
  }

  /**
   * Wait for URL to match pattern
   */
  async waitForURL(pattern, timeout = 10000) {
    await this.page.waitForURL(pattern, { timeout });
  }

  /**
   * Wait for network to be idle
   */
  async waitForNetworkIdle(timeout = 5000) {
    await this.page.waitForLoadState('networkidle', { timeout });
  }

  /**
   * Take screenshot with custom name
   */
  async takeScreenshot(name) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    await this.page.screenshot({ 
      path: `test-artifacts/screenshots/${name}-${timestamp}.png`,
      fullPage: true 
    });
  }

  /**
   * Check if page contains error messages
   */
  async hasErrorMessage() {
    const errorSelectors = [
      '[data-testid="error-message"]',
      '.error',
      '.alert-error',
      '.text-red-500'
    ];

    for (const selector of errorSelectors) {
      if (await this.elementExists(selector)) {
        return {
          hasError: true,
          message: await this.getTextContent(selector)
        };
      }
    }

    return { hasError: false, message: null };
  }

  /**
   * Wait for success message
   */
  async waitForSuccessMessage() {
    const successSelectors = [
      '[data-testid="success-message"]',
      '.success',
      '.alert-success',
      '.text-green-500'
    ];

    for (const selector of successSelectors) {
      try {
        await this.waitForElement(selector, 5000);
        return {
          found: true,
          message: await this.getTextContent(selector)
        };
      } catch {
        continue;
      }
    }

    return { found: false, message: null };
  }

  /**
   * Handle German GDPR cookie consent
   */
  async handleCookieConsent() {
    const cookieSelectors = [
      '[data-testid="cookie-accept"]',
      'button:has-text("Akzeptieren")',
      'button:has-text("Accept")',
      '.cookie-consent button'
    ];

    for (const selector of cookieSelectors) {
      if (await this.elementExists(selector)) {
        await this.clickElement(selector);
        await this.page.waitForTimeout(1000);
        return true;
      }
    }

    return false;
  }

  /**
   * Verify German language is active
   */
  async verifyGermanLanguage() {
    const germanIndicators = [
      'Anmelden',
      'Registrieren', 
      'Dashboard',
      'Werkstatt',
      'Impressum',
      'Datenschutz'
    ];

    for (const text of germanIndicators) {
      try {
        await this.waitForText(text, 2000);
        return true;
      } catch {
        continue;
      }
    }

    return false;
  }

  /**
   * Wait for page to load completely
   */
  async waitForPageLoad() {
    await Promise.all([
      this.page.waitForLoadState('domcontentloaded'),
      this.page.waitForLoadState('networkidle')
    ]);
  }

  /**
   * Get current URL
   */
  getCurrentURL() {
    return this.page.url();
  }

  /**
   * Get page title
   */
  async getPageTitle() {
    return await this.page.title();
  }

  /**
   * Check mobile responsiveness
   */
  async verifyMobileResponsive() {
    // Set mobile viewport
    await this.page.setViewportSize({ width: 375, height: 667 });
    await this.page.waitForTimeout(1000);

    // Check if mobile navigation exists
    const hasMobileNav = await this.elementExists('.mobile-nav, .hamburger, [data-testid="mobile-menu"]');
    
    // Reset to desktop
    await this.page.setViewportSize({ width: 1280, height: 720 });
    await this.page.waitForTimeout(1000);

    return hasMobileNav;
  }

  /**
   * Handle unexpected popup or modal
   */
  async handleUnexpectedPopup() {
    const popupSelectors = [
      '.modal.show',
      '.popup.visible',
      '[data-testid="modal"]',
      '.overlay.active'
    ];

    for (const selector of popupSelectors) {
      if (await this.elementExists(selector)) {
        // Try to close with common close buttons
        const closeSelectors = [
          `${selector} .close`,
          `${selector} [data-testid="close"]`,
          `${selector} button:has-text("✕")`,
          `${selector} button:has-text("Schließen")`
        ];

        for (const closeSelector of closeSelectors) {
          if (await this.elementExists(closeSelector)) {
            await this.clickElement(closeSelector);
            return true;
          }
        }

        // Try escape key
        await this.page.keyboard.press('Escape');
        return true;
      }
    }

    return false;
  }
}

module.exports = { BasePage };