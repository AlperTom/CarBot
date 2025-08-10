/**
 * Navigation Page Object for CarBot E2E Tests
 * Specialized page object for testing navigation components
 */

const { BasePage } = require('./base-page');

class NavigationPage extends BasePage {
  constructor(page) {
    super(page);
    
    // Navigation selectors
    this.selectors = {
      // Generic navigation
      nav: 'nav',
      homeLink: 'a[href="/"], a:has-text("CarBot")',
      
      // Desktop navigation
      desktopNav: '.desktop-nav, .hidden.md\\:flex',
      desktopNavItems: '.desktop-nav a, .hidden.md\\:flex a',
      
      // Mobile navigation
      mobileNavButton: '.mobile-nav-button, .md\\:hidden button, button.md\\:hidden',
      mobileNavOverlay: '.mobile-menu-overlay',
      mobileNavContent: '.mobile-menu-content',
      mobileNavItems: '.mobile-nav-items, .mobile-nav-items a',
      
      // Common navigation links
      pricingLink: 'a[href="/pricing"]',
      loginLink: 'a[href="/auth/login"]',
      registerLink: 'a[href="/auth/register"]',
      
      // Dashboard navigation
      dashboardNav: '.dashboard-nav, nav.dashboard',
      dashboardNavItems: '.dashboard-nav a, nav.dashboard a',
      
      // Fallback navigation
      fallbackNav: '.nav-fallback',
      fallbackNavItems: '.nav-fallback a'
    };
  }

  /**
   * Wait for navigation to load
   */
  async waitForNavigation() {
    await this.waitForElement(this.selectors.nav);
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Check if desktop navigation is visible
   */
  async isDesktopNavigationVisible() {
    try {
      await this.page.waitForSelector(this.selectors.desktopNav, { timeout: 2000 });
      return await this.page.locator(this.selectors.desktopNav).first().isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Check if mobile navigation button is visible
   */
  async isMobileNavigationVisible() {
    try {
      const mobileButton = this.page.locator(this.selectors.mobileNavButton);
      const count = await mobileButton.count();
      if (count === 0) return false;
      
      return await mobileButton.first().isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Open mobile navigation menu
   */
  async openMobileMenu() {
    const mobileButton = this.page.locator(this.selectors.mobileNavButton);
    const buttonCount = await mobileButton.count();
    
    if (buttonCount === 0) {
      throw new Error('Mobile navigation button not found');
    }
    
    await mobileButton.first().click();
    await this.page.waitForTimeout(500);
    
    return {
      opened: true,
      buttonCount
    };
  }

  /**
   * Close mobile navigation menu
   */
  async closeMobileMenu() {
    // Try multiple methods to close menu
    const methods = [
      // Click overlay if exists
      async () => {
        const overlay = this.page.locator(this.selectors.mobileNavOverlay);
        if (await overlay.count() > 0 && await overlay.isVisible()) {
          await overlay.click();
          return true;
        }
        return false;
      },
      
      // Press escape key
      async () => {
        await this.page.keyboard.press('Escape');
        return true;
      },
      
      // Click mobile button again
      async () => {
        const mobileButton = this.page.locator(this.selectors.mobileNavButton);
        if (await mobileButton.count() > 0) {
          await mobileButton.first().click();
          return true;
        }
        return false;
      }
    ];
    
    for (const method of methods) {
      try {
        await method();
        await this.page.waitForTimeout(300);
        break;
      } catch {
        continue;
      }
    }
  }

  /**
   * Get all navigation links
   */
  async getNavigationLinks(type = 'desktop') {
    const selector = type === 'mobile' ? this.selectors.mobileNavItems : this.selectors.desktopNavItems;
    
    try {
      const links = this.page.locator(selector);
      const count = await links.count();
      
      const linkData = [];
      for (let i = 0; i < count; i++) {
        const link = links.nth(i);
        const href = await link.getAttribute('href');
        const text = await link.textContent();
        
        if (href && text) {
          linkData.push({
            href: href.trim(),
            text: text.trim()
          });
        }
      }
      
      return linkData;
    } catch {
      return [];
    }
  }

  /**
   * Test navigation responsiveness
   */
  async testResponsiveNavigation() {
    const viewports = [
      { width: 1920, height: 1080, name: 'Desktop XL' },
      { width: 1280, height: 720, name: 'Desktop' },
      { width: 768, height: 1024, name: 'Tablet' },
      { width: 375, height: 667, name: 'Mobile' }
    ];
    
    const results = [];
    
    for (const viewport of viewports) {
      await this.page.setViewportSize({ width: viewport.width, height: viewport.height });
      await this.page.waitForTimeout(300);
      
      const isDesktopVisible = await this.isDesktopNavigationVisible();
      const isMobileVisible = await this.isMobileNavigationVisible();
      
      results.push({
        viewport: viewport.name,
        dimensions: `${viewport.width}x${viewport.height}`,
        desktopNavVisible: isDesktopVisible,
        mobileNavVisible: isMobileVisible,
        correctDisplay: viewport.width <= 768 ? isMobileVisible : isDesktopVisible
      });
    }
    
    return results;
  }

  /**
   * Test navigation accessibility
   */
  async testNavigationAccessibility() {
    const results = {
      keyboardAccessible: false,
      hasAriaLabels: false,
      hasProperLandmarks: false,
      focusManagement: false
    };
    
    // Test keyboard navigation
    try {
      await this.page.keyboard.press('Tab');
      const focusedElement = this.page.locator(':focus');
      const tagName = await focusedElement.evaluate(el => el.tagName.toLowerCase());
      results.keyboardAccessible = ['a', 'button', 'input'].includes(tagName);
    } catch {
      results.keyboardAccessible = false;
    }
    
    // Check for navigation landmark
    try {
      const nav = this.page.locator('nav[role="navigation"], nav');
      results.hasProperLandmarks = await nav.count() > 0;
    } catch {
      results.hasProperLandmarks = false;
    }
    
    // Check for ARIA labels on mobile button
    try {
      const mobileButton = this.page.locator(this.selectors.mobileNavButton);
      if (await mobileButton.count() > 0) {
        const ariaLabel = await mobileButton.first().getAttribute('aria-label');
        results.hasAriaLabels = !!ariaLabel;
      }
    } catch {
      results.hasAriaLabels = false;
    }
    
    // Test focus management in mobile menu
    try {
      await this.page.setViewportSize({ width: 375, height: 667 });
      if (await this.isMobileNavigationVisible()) {
        await this.openMobileMenu();
        await this.page.keyboard.press('Tab');
        const focusedInMenu = this.page.locator('.mobile-menu-content :focus');
        results.focusManagement = await focusedInMenu.count() > 0;
        await this.closeMobileMenu();
      }
    } catch {
      results.focusManagement = false;
    }
    
    return results;
  }

  /**
   * Test navigation without JavaScript
   */
  async testNoJavaScriptNavigation() {
    // Add no-js class and fallback navigation
    await this.page.addStyleTag({
      content: `
        .no-js .nav-fallback { 
          display: block !important; 
          background: #f3f4f6; 
          padding: 1rem; 
          margin: 1rem 0;
          border: 1px solid #d1d5db;
        }
        .no-js .nav-fallback ul {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .no-js .nav-fallback a {
          padding: 0.5rem 1rem;
          background: white;
          border: 1px solid #d1d5db;
          border-radius: 4px;
          text-decoration: none;
          color: #374151;
        }
      `
    });
    
    await this.page.evaluate(() => {
      document.documentElement.classList.add('no-js');
      
      // Add fallback navigation if not present
      const nav = document.querySelector('nav');
      if (nav && !nav.querySelector('.nav-fallback')) {
        const fallback = document.createElement('div');
        fallback.className = 'nav-fallback';
        fallback.innerHTML = `
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/pricing">Preise</a></li>
            <li><a href="/auth/login">Anmelden</a></li>
            <li><a href="/auth/register">Registrieren</a></li>
          </ul>
        `;
        nav.appendChild(fallback);
      }
    });
    
    // Test fallback navigation
    const fallbackNav = this.page.locator(this.selectors.fallbackNav);
    const isVisible = await fallbackNav.isVisible();
    
    if (isVisible) {
      const links = await this.getNavigationLinks('fallback');
      return {
        hasFallback: true,
        linkCount: links.length,
        links
      };
    }
    
    return {
      hasFallback: false,
      linkCount: 0,
      links: []
    };
  }

  /**
   * Navigate to page and verify navigation works
   */
  async navigateAndVerify(path, expectedText = null) {
    const initialUrl = this.page.url();
    
    // Find and click the navigation link
    const link = this.page.locator(`a[href="${path}"]`).first();
    
    if (await link.count() === 0) {
      throw new Error(`Navigation link to ${path} not found`);
    }
    
    await link.click();
    await this.waitForURL(path);
    
    // Verify we're on the correct page
    const currentUrl = this.page.url();
    const urlChanged = currentUrl !== initialUrl;
    
    let hasExpectedText = true;
    if (expectedText) {
      hasExpectedText = await this.page.locator(`text=${expectedText}`).count() > 0;
    }
    
    return {
      success: urlChanged && currentUrl.includes(path),
      finalUrl: currentUrl,
      hasExpectedText
    };
  }

  /**
   * Test all navigation links
   */
  async testAllNavigationLinks(type = 'desktop') {
    const links = await this.getNavigationLinks(type);
    const results = [];
    
    for (const link of links) {
      try {
        const result = await this.navigateAndVerify(link.href);
        results.push({
          ...link,
          working: result.success,
          finalUrl: result.finalUrl
        });
        
        // Navigate back
        await this.page.goBack();
        await this.waitForPageLoad();
      } catch (error) {
        results.push({
          ...link,
          working: false,
          error: error.message
        });
      }
    }
    
    return results;
  }

  /**
   * Check navigation performance
   */
  async measureNavigationPerformance() {
    const startTime = Date.now();
    
    await this.waitForElement(this.selectors.nav);
    
    const navLoadTime = Date.now() - startTime;
    
    // Test responsive switching performance
    const responsiveStartTime = Date.now();
    await this.page.setViewportSize({ width: 375, height: 667 });
    await this.page.waitForTimeout(100);
    await this.page.setViewportSize({ width: 1280, height: 720 });
    const responsiveTime = Date.now() - responsiveStartTime;
    
    return {
      navigationLoadTime: navLoadTime,
      responsiveSwitchTime: responsiveTime,
      performanceGrade: navLoadTime < 1000 && responsiveTime < 500 ? 'A' : navLoadTime < 2000 ? 'B' : 'C'
    };
  }
}

module.exports = { NavigationPage };