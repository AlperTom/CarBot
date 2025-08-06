// @ts-check
const { defineConfig, devices } = require('@playwright/test');

/**
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
  testDir: './tests/e2e',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html', { outputDir: 'playwright-report' }],
    ['json', { outputFile: 'test-results/e2e-results.json' }],
    ['junit', { outputFile: 'test-results/e2e-results.xml' }]
  ],

  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: process.env.BASE_URL || 'http://localhost:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',

    /* Global timeout for actions */
    actionTimeout: 10000,
    navigationTimeout: 30000,

    /* Ignore HTTPS errors for local development */
    ignoreHTTPSErrors: true,
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        // German locale for automotive market testing
        locale: 'de-DE',
        timezoneId: 'Europe/Berlin',
      },
    },

    {
      name: 'firefox',
      use: { 
        ...devices['Desktop Firefox'],
        locale: 'de-DE',
        timezoneId: 'Europe/Berlin',
      },
    },

    {
      name: 'webkit',
      use: { 
        ...devices['Desktop Safari'],
        locale: 'de-DE',
        timezoneId: 'Europe/Berlin',
      },
    },

    /* Test against mobile viewports. */
    {
      name: 'Mobile Chrome',
      use: { 
        ...devices['Pixel 5'],
        locale: 'de-DE',
        timezoneId: 'Europe/Berlin',
      },
    },
    {
      name: 'Mobile Safari',
      use: { 
        ...devices['iPhone 12'],
        locale: 'de-DE',
        timezoneId: 'Europe/Berlin',
      },
    },

    /* Multi-language testing projects */
    {
      name: 'German',
      use: {
        ...devices['Desktop Chrome'],
        locale: 'de-DE',
        timezoneId: 'Europe/Berlin',
        extraHTTPHeaders: {
          'Accept-Language': 'de-DE,de;q=0.9'
        }
      },
    },

    {
      name: 'English',
      use: {
        ...devices['Desktop Chrome'],
        locale: 'en-US',
        timezoneId: 'America/New_York',
        extraHTTPHeaders: {
          'Accept-Language': 'en-US,en;q=0.9'
        }
      },
    },

    {
      name: 'Turkish',
      use: {
        ...devices['Desktop Chrome'],
        locale: 'tr-TR',
        timezoneId: 'Europe/Istanbul',
        extraHTTPHeaders: {
          'Accept-Language': 'tr-TR,tr;q=0.9'
        }
      },
    },

    {
      name: 'Polish',
      use: {
        ...devices['Desktop Chrome'],
        locale: 'pl-PL',
        timezoneId: 'Europe/Warsaw',
        extraHTTPHeaders: {
          'Accept-Language': 'pl-PL,pl;q=0.9'
        }
      },
    },
  ],

  /* Run your local dev server before starting the tests */
  webServer: process.env.CI ? undefined : {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },

  /* Global timeout for each test */
  timeout: 60000,

  /* Expect timeout for assertions */
  expect: {
    timeout: 10000,
  },

  /* Test directory structure */
  testIgnore: '**/node_modules/**',
  
  /* Environment variables for testing */
  globalSetup: require.resolve('./tests/e2e/setup/global-setup.js'),
  globalTeardown: require.resolve('./tests/e2e/setup/global-teardown.js'),
});