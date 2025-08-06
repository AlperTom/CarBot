/**
 * Dashboard Page Object for CarBot E2E Tests
 * Handles workshop dashboard functionality and package features
 */

const { BasePage } = require('./base-page');

class DashboardPage extends BasePage {
  constructor(page) {
    super(page);
    
    this.selectors = {
      // Navigation
      nav: {
        overview: '[data-testid="nav-overview"], a[href="/dashboard"]',
        clients: '[data-testid="nav-clients"], a[href="/dashboard/clients"]',
        clientKeys: '[data-testid="nav-client-keys"], a[href="/dashboard/client-keys"]',
        analytics: '[data-testid="nav-analytics"], a[href="/dashboard/analytics"]',
        billing: '[data-testid="nav-billing"], a[href="/dashboard/billing"]',
        settings: '[data-testid="nav-settings"], a[href="/dashboard/settings"]',
        logout: '[data-testid="logout"], button:has-text("Abmelden")'
      },

      // Overview dashboard
      overview: {
        welcomeMessage: '[data-testid="welcome-message"], .welcome-text',
        packageInfo: '[data-testid="package-info"], .package-info',
        leadCounter: '[data-testid="lead-counter"], .lead-counter',
        usageIndicator: '[data-testid="usage-indicator"], .usage-indicator',
        upgradeButton: '[data-testid="upgrade-button"], button:has-text("Upgraden")',
        stats: {
          totalLeads: '[data-testid="stat-total-leads"]',
          thisMonth: '[data-testid="stat-this-month"]',
          conversion: '[data-testid="stat-conversion"]',
          revenue: '[data-testid="stat-revenue"]'
        }
      },

      // Client Keys section
      clientKeys: {
        generateButton: '[data-testid="generate-key"], button:has-text("Neuen Schlüssel generieren")',
        keysList: '[data-testid="keys-list"], .keys-list',
        keyItem: '[data-testid="key-item"]',
        keyName: '[data-testid="key-name"]',
        keyValue: '[data-testid="key-value"]',
        copyButton: '[data-testid="copy-key"]',
        deleteButton: '[data-testid="delete-key"]',
        integrationCode: '[data-testid="integration-code"]',
        
        // Generate key modal
        modal: {
          nameField: '[data-testid="key-name-field"], input[name="keyName"]',
          descriptionField: '[data-testid="key-description"], textarea[name="description"]',
          submitButton: '[data-testid="create-key-submit"]',
          cancelButton: '[data-testid="create-key-cancel"]'
        }
      },

      // Analytics section
      analytics: {
        dateRangePicker: '[data-testid="date-range"], .date-picker',
        chatMetrics: '[data-testid="chat-metrics"]',
        leadMetrics: '[data-testid="lead-metrics"]',
        conversionChart: '[data-testid="conversion-chart"]',
        trafficSources: '[data-testid="traffic-sources"]',
        exportButton: '[data-testid="export-analytics"]'
      },

      // Billing section
      billing: {
        currentPlan: '[data-testid="current-plan"]',
        planFeatures: '[data-testid="plan-features"]',
        usageLimits: '[data-testid="usage-limits"]',
        upgradeOptions: '[data-testid="upgrade-options"]',
        billingHistory: '[data-testid="billing-history"]',
        paymentMethod: '[data-testid="payment-method"]',
        invoices: '[data-testid="invoices"]',
        
        // Upgrade buttons
        upgradeBasic: '[data-testid="upgrade-basic"]',
        upgradePro: '[data-testid="upgrade-professional"]',
        upgradeEnterprise: '[data-testid="upgrade-enterprise"]',
        
        // Stripe elements
        stripeCheckout: '#stripe-checkout',
        cancelSubscription: '[data-testid="cancel-subscription"]'
      },

      // Settings section
      settings: {
        profileTab: '[data-testid="profile-tab"]',
        workshopTab: '[data-testid="workshop-tab"]',
        notificationTab: '[data-testid="notification-tab"]',
        securityTab: '[data-testid="security-tab"]',
        
        // Profile settings
        profile: {
          nameField: '[data-testid="profile-name"]',
          emailField: '[data-testid="profile-email"]',
          phoneField: '[data-testid="profile-phone"]',
          saveButton: '[data-testid="save-profile"]'
        },
        
        // Workshop settings
        workshop: {
          nameField: '[data-testid="workshop-name"]',
          addressField: '[data-testid="workshop-address"]',
          servicesField: '[data-testid="workshop-services"]',
          hoursField: '[data-testid="workshop-hours"]',
          saveButton: '[data-testid="save-workshop"]'
        },
        
        // Notification settings
        notifications: {
          emailLeads: '[data-testid="notify-email-leads"]',
          smsLeads: '[data-testid="notify-sms-leads"]',
          emailReports: '[data-testid="notify-email-reports"]',
          saveButton: '[data-testid="save-notifications"]'
        }
      },

      // Common elements
      common: {
        loadingSpinner: '[data-testid="loading"], .loading',
        errorMessage: '[data-testid="error"], .error-message',
        successMessage: '[data-testid="success"], .success-message',
        confirmModal: '[data-testid="confirm-modal"]',
        confirmYes: '[data-testid="confirm-yes"]',
        confirmNo: '[data-testid="confirm-no"]'
      }
    };
  }

  /**
   * Navigate to dashboard
   */
  async goToDashboard() {
    await this.goto('/dashboard');
    await this.waitForPageLoad();
    await this.waitForElement(this.selectors.overview.welcomeMessage);
  }

  /**
   * Verify dashboard loads correctly
   */
  async verifyDashboardLoaded() {
    try {
      await this.waitForElement(this.selectors.overview.welcomeMessage, 10000);
      await this.waitForElement(this.selectors.nav.overview, 5000);
      
      const url = this.getCurrentURL();
      const hasWelcome = await this.elementExists(this.selectors.overview.welcomeMessage);
      
      return {
        loaded: hasWelcome && url.includes('/dashboard'),
        url,
        hasNavigation: await this.elementExists(this.selectors.nav.overview)
      };
    } catch (error) {
      return {
        loaded: false,
        error: error.message
      };
    }
  }

  /**
   * Get current package information
   */
  async getPackageInfo() {
    await this.waitForElement(this.selectors.overview.packageInfo);
    
    const packageText = await this.getTextContent(this.selectors.overview.packageInfo);
    const usageText = await this.elementExists(this.selectors.overview.usageIndicator) 
      ? await this.getTextContent(this.selectors.overview.usageIndicator)
      : null;

    return {
      packageType: this.extractPackageType(packageText),
      usageInfo: usageText,
      hasUpgradeButton: await this.elementExists(this.selectors.overview.upgradeButton)
    };
  }

  /**
   * Extract package type from package info text
   */
  extractPackageType(text) {
    if (text.toLowerCase().includes('basic')) return 'basic';
    if (text.toLowerCase().includes('professional')) return 'professional';
    if (text.toLowerCase().includes('enterprise')) return 'enterprise';
    return 'unknown';
  }

  /**
   * Get dashboard statistics
   */
  async getDashboardStats() {
    const stats = {};
    
    for (const [key, selector] of Object.entries(this.selectors.overview.stats)) {
      if (await this.elementExists(selector)) {
        stats[key] = await this.getTextContent(selector);
      }
    }

    return stats;
  }

  /**
   * Navigate to client keys section
   */
  async goToClientKeys() {
    await this.clickElement(this.selectors.nav.clientKeys);
    await this.waitForElement(this.selectors.clientKeys.generateButton);
  }

  /**
   * Generate a new client key
   */
  async generateClientKey(keyData) {
    console.log(`🔑 Generating client key: ${keyData.name}`);
    
    await this.clickElement(this.selectors.clientKeys.generateButton);
    await this.waitForElement(this.selectors.clientKeys.modal.nameField);
    
    await this.fillField(this.selectors.clientKeys.modal.nameField, keyData.name);
    
    if (keyData.description && await this.elementExists(this.selectors.clientKeys.modal.descriptionField)) {
      await this.fillField(this.selectors.clientKeys.modal.descriptionField, keyData.description);
    }
    
    await this.clickElement(this.selectors.clientKeys.modal.submitButton);
    
    // Wait for key to appear in list
    await this.waitForElement(this.selectors.clientKeys.keyItem);
    
    console.log('✅ Client key generated successfully');
    return await this.getLatestClientKey();
  }

  /**
   * Get the most recently created client key
   */
  async getLatestClientKey() {
    await this.waitForElement(this.selectors.clientKeys.keyItem);
    
    const keyElements = await this.page.$$(this.selectors.clientKeys.keyItem);
    if (keyElements.length === 0) {
      throw new Error('No client keys found');
    }

    // Get the first key (assuming newest first)
    const latestKey = keyElements[0];
    const name = await latestKey.$eval(this.selectors.clientKeys.keyName, el => el.textContent);
    const value = await latestKey.$eval(this.selectors.clientKeys.keyValue, el => el.textContent);

    return { name, value, element: latestKey };
  }

  /**
   * Copy client key integration code
   */
  async copyIntegrationCode() {
    if (await this.elementExists(this.selectors.clientKeys.integrationCode)) {
      const code = await this.getTextContent(this.selectors.clientKeys.integrationCode);
      
      // Try to click copy button if exists
      if (await this.elementExists(this.selectors.clientKeys.copyButton)) {
        await this.clickElement(this.selectors.clientKeys.copyButton);
      }
      
      return code;
    }
    return null;
  }

  /**
   * Navigate to analytics section
   */
  async goToAnalytics() {
    await this.clickElement(this.selectors.nav.analytics);
    await this.waitForElement(this.selectors.analytics.chatMetrics);
  }

  /**
   * Get analytics data
   */
  async getAnalyticsData() {
    await this.waitForElement(this.selectors.analytics.chatMetrics);
    
    const data = {};
    
    if (await this.elementExists(this.selectors.analytics.chatMetrics)) {
      data.chatMetrics = await this.getTextContent(this.selectors.analytics.chatMetrics);
    }
    
    if (await this.elementExists(this.selectors.analytics.leadMetrics)) {
      data.leadMetrics = await this.getTextContent(this.selectors.analytics.leadMetrics);
    }
    
    if (await this.elementExists(this.selectors.analytics.trafficSources)) {
      data.trafficSources = await this.getTextContent(this.selectors.analytics.trafficSources);
    }

    return data;
  }

  /**
   * Navigate to billing section
   */
  async goToBilling() {
    await this.clickElement(this.selectors.nav.billing);
    await this.waitForElement(this.selectors.billing.currentPlan);
  }

  /**
   * Get current billing information
   */
  async getBillingInfo() {
    await this.waitForElement(this.selectors.billing.currentPlan);
    
    const currentPlan = await this.getTextContent(this.selectors.billing.currentPlan);
    const usageLimits = await this.elementExists(this.selectors.billing.usageLimits)
      ? await this.getTextContent(this.selectors.billing.usageLimits)
      : null;

    const upgradeOptions = [];
    const upgradeButtons = [
      { type: 'basic', selector: this.selectors.billing.upgradeBasic },
      { type: 'professional', selector: this.selectors.billing.upgradePro },
      { type: 'enterprise', selector: this.selectors.billing.upgradeEnterprise }
    ];

    for (const option of upgradeButtons) {
      if (await this.elementExists(option.selector)) {
        upgradeOptions.push(option.type);
      }
    }

    return {
      currentPlan,
      usageLimits,
      availableUpgrades: upgradeOptions
    };
  }

  /**
   * Initiate package upgrade
   */
  async upgradePackage(targetPackage) {
    console.log(`⬆️ Upgrading to ${targetPackage} package`);
    
    const upgradeSelectors = {
      basic: this.selectors.billing.upgradeBasic,
      professional: this.selectors.billing.upgradePro,
      enterprise: this.selectors.billing.upgradeEnterprise
    };

    const upgradeSelector = upgradeSelectors[targetPackage];
    if (!upgradeSelector) {
      throw new Error(`Unknown package type: ${targetPackage}`);
    }

    if (!await this.elementExists(upgradeSelector)) {
      throw new Error(`Upgrade option for ${targetPackage} not available`);
    }

    await this.clickElement(upgradeSelector);
    
    // Wait for Stripe checkout or confirmation
    try {
      await this.page.waitForSelector(this.selectors.billing.stripeCheckout, { timeout: 10000 });
      console.log('✅ Stripe checkout loaded');
      return { success: true, checkoutLoaded: true };
    } catch {
      // Check if upgrade was immediate (like free tier)
      const success = await this.waitForSuccessMessage();
      return { success: success.found, message: success.message };
    }
  }

  /**
   * Navigate to settings
   */
  async goToSettings() {
    await this.clickElement(this.selectors.nav.settings);
    await this.waitForElement(this.selectors.settings.profileTab);
  }

  /**
   * Update profile settings
   */
  async updateProfile(profileData) {
    await this.clickElement(this.selectors.settings.profileTab);
    await this.waitForElement(this.selectors.settings.profile.nameField);

    if (profileData.name) {
      await this.fillField(this.selectors.settings.profile.nameField, profileData.name);
    }
    
    if (profileData.email) {
      await this.fillField(this.selectors.settings.profile.emailField, profileData.email);
    }
    
    if (profileData.phone) {
      await this.fillField(this.selectors.settings.profile.phoneField, profileData.phone);
    }

    await this.clickElement(this.selectors.settings.profile.saveButton);
    
    const success = await this.waitForSuccessMessage();
    return success;
  }

  /**
   * Verify package feature restrictions
   */
  async verifyPackageRestrictions(expectedPackage) {
    const restrictions = {};
    
    // Check analytics access
    try {
      await this.goToAnalytics();
      restrictions.analyticsAccess = true;
    } catch {
      restrictions.analyticsAccess = false;
    }

    // Check API features (look for API-related elements)
    await this.goToDashboard();
    restrictions.apiAccess = await this.elementExists('[data-feature="api"], .api-features');
    
    // Check upgrade prompts
    restrictions.upgradePrompts = await this.elementExists(this.selectors.overview.upgradeButton);
    
    // Check usage limits display
    await this.goToBilling();
    const billingInfo = await this.getBillingInfo();
    restrictions.usageLimits = billingInfo.usageLimits;

    return restrictions;
  }

  /**
   * Logout from dashboard
   */
  async logout() {
    await this.clickElement(this.selectors.nav.logout);
    
    try {
      await this.waitForURL('**/auth/login', 10000);
      console.log('✅ Logged out successfully');
      return { success: true };
    } catch (error) {
      console.log('❌ Logout failed');
      return { success: false, error: error.message };
    }
  }

  /**
   * Verify German language in dashboard
   */
  async verifyGermanInterface() {
    const germanElements = [
      'Dashboard',
      'Übersicht',
      'Kunden',
      'Einstellungen',
      'Rechnungen',
      'Abmelden'
    ];

    for (const text of germanElements) {
      try {
        await this.waitForText(text, 2000);
        return true;
      } catch {
        continue;
      }
    }

    return false;
  }
}

module.exports = { DashboardPage };