/**
 * Authentication Page Object for CarBot E2E Tests
 * Handles login, registration, and password reset flows
 */

const { BasePage } = require('./base-page');

class AuthPage extends BasePage {
  constructor(page) {
    super(page);
    
    // Selectors for authentication forms
    this.selectors = {
      // Login form
      login: {
        emailField: '[data-testid="login-email"], input[name="email"], #email',
        passwordField: '[data-testid="login-password"], input[name="password"], #password',
        submitButton: '[data-testid="login-submit"], button[type="submit"]:has-text("Anmelden")',
        forgotPasswordLink: 'a:has-text("Passwort vergessen")',
        registerLink: 'a:has-text("Registrieren")'
      },
      
      // Registration form
      register: {
        emailField: '[data-testid="register-email"], input[name="email"]',
        passwordField: '[data-testid="register-password"], input[name="password"]',
        confirmPasswordField: '[data-testid="confirm-password"], input[name="confirmPassword"]',
        workshopNameField: '[data-testid="workshop-name"], input[name="workshopName"]',
        phoneField: '[data-testid="phone"], input[name="phone"]',
        addressField: '[data-testid="address"], input[name="address"]',
        cityField: '[data-testid="city"], input[name="city"]',
        plzField: '[data-testid="plz"], input[name="plz"]',
        businessTypeSelect: '[data-testid="business-type"], select[name="businessType"]',
        planSelect: '[data-testid="plan"], select[name="plan"]',
        termsCheckbox: '[data-testid="terms"], input[name="terms"]',
        gdprCheckbox: '[data-testid="gdpr"], input[name="gdpr"]',
        submitButton: '[data-testid="register-submit"], button[type="submit"]:has-text("Registrieren")',
        loginLink: 'a:has-text("Bereits registriert")'
      },

      // Password reset
      reset: {
        emailField: '[data-testid="reset-email"], input[name="email"]',
        submitButton: '[data-testid="reset-submit"], button[type="submit"]',
        backToLoginLink: 'a:has-text("Zurück zur Anmeldung")'
      },

      // Common elements
      common: {
        errorMessage: '[data-testid="error-message"], .error-message, .alert-error',
        successMessage: '[data-testid="success-message"], .success-message, .alert-success',
        loadingSpinner: '[data-testid="loading"], .loading, .spinner',
        languageSwitcher: '[data-testid="language-switcher"], .language-selector'
      }
    };
  }

  /**
   * Navigate to login page
   */
  async goToLogin() {
    await this.goto('/auth/login');
    await this.waitForPageLoad();
    await this.handleCookieConsent();
  }

  /**
   * Navigate to registration page
   */
  async goToRegister() {
    await this.goto('/auth/register');
    await this.waitForPageLoad();
    await this.handleCookieConsent();
  }

  /**
   * Navigate to password reset page
   */
  async goToPasswordReset() {
    await this.goto('/auth/forgot-password');
    await this.waitForPageLoad();
  }

  /**
   * Perform login with credentials
   */
  async login(email, password) {
    console.log(`🔐 Logging in with email: ${email}`);
    
    await this.fillField(this.selectors.login.emailField, email, { validate: true });
    await this.fillField(this.selectors.login.passwordField, password);
    
    await this.clickElement(this.selectors.login.submitButton);
    
    // Wait for either success (redirect) or error
    try {
      await this.waitForURL('**/dashboard', 10000);
      console.log('✅ Login successful - redirected to dashboard');
      return { success: true, error: null };
    } catch {
      const error = await this.hasErrorMessage();
      console.log(`❌ Login failed: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  /**
   * Perform complete workshop registration
   */
  async register(workshopData) {
    console.log(`📝 Registering workshop: ${workshopData.name}`);
    
    try {
      // Fill basic information
      await this.fillField(this.selectors.register.emailField, workshopData.email);
      await this.fillField(this.selectors.register.passwordField, workshopData.password);
      
      // Confirm password if field exists
      if (await this.elementExists(this.selectors.register.confirmPasswordField)) {
        await this.fillField(this.selectors.register.confirmPasswordField, workshopData.password);
      }

      // Workshop details
      await this.fillField(this.selectors.register.workshopNameField, workshopData.name);
      await this.fillField(this.selectors.register.phoneField, workshopData.phone);
      await this.fillField(this.selectors.register.addressField, workshopData.address);
      await this.fillField(this.selectors.register.cityField, workshopData.city);
      await this.fillField(this.selectors.register.plzField, workshopData.plz);

      // Business type and plan selection
      if (await this.elementExists(this.selectors.register.businessTypeSelect)) {
        await this.selectOption(this.selectors.register.businessTypeSelect, workshopData.businessType);
      }
      
      if (await this.elementExists(this.selectors.register.planSelect)) {
        await this.selectOption(this.selectors.register.planSelect, workshopData.plan);
      }

      // Accept terms and conditions
      if (await this.elementExists(this.selectors.register.termsCheckbox)) {
        await this.clickElement(this.selectors.register.termsCheckbox);
      }

      // Accept GDPR
      if (await this.elementExists(this.selectors.register.gdprCheckbox)) {
        await this.clickElement(this.selectors.register.gdprCheckbox);
      }

      // Submit registration
      await this.clickElement(this.selectors.register.submitButton);

      // Wait for success or error
      const successMessage = await this.waitForSuccessMessage();
      if (successMessage.found) {
        console.log('✅ Registration successful');
        return { success: true, message: successMessage.message };
      }

      // Check for errors
      const error = await this.hasErrorMessage();
      if (error.hasError) {
        console.log(`❌ Registration failed: ${error.message}`);
        return { success: false, error: error.message };
      }

      // If no explicit success/error, assume success and wait for redirect
      try {
        await this.waitForURL(['**/verify', '**/dashboard', '**/auth/login'], 15000);
        console.log('✅ Registration completed - redirected for verification or login');
        return { success: true, message: 'Registration completed' };
      } catch {
        return { success: false, error: 'Registration timeout - no redirect' };
      }

    } catch (error) {
      console.log(`❌ Registration error: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  /**
   * Request password reset
   */
  async requestPasswordReset(email) {
    console.log(`🔑 Requesting password reset for: ${email}`);

    await this.fillField(this.selectors.reset.emailField, email);
    await this.clickElement(this.selectors.reset.submitButton);

    const successMessage = await this.waitForSuccessMessage();
    if (successMessage.found) {
      console.log('✅ Password reset email sent');
      return { success: true, message: successMessage.message };
    }

    const error = await this.hasErrorMessage();
    console.log(`❌ Password reset failed: ${error.message}`);
    return { success: false, error: error.message };
  }

  /**
   * Verify email confirmation page
   */
  async verifyEmailConfirmation() {
    await this.waitForText('E-Mail bestätigt', 10000);
    const confirmationMessage = await this.getTextContent('.confirmation-message, [data-testid="confirmation"]');
    return confirmationMessage;
  }

  /**
   * Switch language during authentication
   */
  async switchLanguage(language) {
    if (await this.elementExists(this.selectors.common.languageSwitcher)) {
      await this.clickElement(this.selectors.common.languageSwitcher);
      await this.clickElement(`[data-lang="${language}"], option[value="${language}"]`);
      await this.page.waitForTimeout(1000);
      return true;
    }
    return false;
  }

  /**
   * Verify German validation messages
   */
  async verifyGermanValidation() {
    // Try to submit empty form to trigger validation
    if (await this.elementExists(this.selectors.register.submitButton)) {
      await this.clickElement(this.selectors.register.submitButton);
      
      // Check for German validation messages
      const germanValidations = [
        'E-Mail ist erforderlich',
        'Passwort ist erforderlich',
        'Werkstattname ist erforderlich',
        'Telefonnummer ist erforderlich'
      ];

      for (const validation of germanValidations) {
        try {
          await this.waitForText(validation, 2000);
          return true;
        } catch {
          continue;
        }
      }
    }

    return false;
  }

  /**
   * Test registration form validation with invalid data
   */
  async testFormValidation() {
    const validationTests = [
      {
        field: this.selectors.register.emailField,
        value: 'invalid-email',
        expectedError: 'E-Mail-Format ungültig'
      },
      {
        field: this.selectors.register.passwordField,
        value: '123',
        expectedError: 'Passwort zu kurz'
      },
      {
        field: this.selectors.register.phoneField,
        value: 'invalid-phone',
        expectedError: 'Telefonnummer ungültig'
      },
      {
        field: this.selectors.register.plzField,
        value: '999999',
        expectedError: 'PLZ ungültig'
      }
    ];

    const results = [];

    for (const test of validationTests) {
      try {
        await this.fillField(test.field, test.value);
        await this.page.keyboard.press('Tab'); // Trigger validation
        await this.page.waitForTimeout(500);

        const error = await this.hasErrorMessage();
        results.push({
          field: test.field,
          value: test.value,
          hasError: error.hasError,
          errorMessage: error.message
        });
      } catch (error) {
        results.push({
          field: test.field,
          value: test.value,
          hasError: false,
          error: error.message
        });
      }
    }

    return results;
  }

  /**
   * Verify authentication state
   */
  async verifyAuthenticationState() {
    // Check if user is logged in by looking for dashboard elements
    const url = this.getCurrentURL();
    
    if (url.includes('/dashboard')) {
      return { authenticated: true, location: 'dashboard' };
    } else if (url.includes('/auth/')) {
      return { authenticated: false, location: 'auth' };
    } else if (url.includes('/verify')) {
      return { authenticated: false, location: 'verify' };
    }

    return { authenticated: false, location: 'unknown' };
  }
}

module.exports = { AuthPage };