/**
 * Global Setup for CarBot E2E Tests
 * Prepares test environment, creates test data, and handles authentication
 */

const { chromium } = require('@playwright/test');
const { TestDataFactory } = require('../fixtures/test-data-factory');
const { DatabaseHelper } = require('../utils/database-helper');

async function globalSetup(config) {
  console.log('🚀 Starting CarBot E2E Test Global Setup...');

  // Initialize test data factory
  const testData = new TestDataFactory();
  const dbHelper = new DatabaseHelper();

  try {
    // 1. Verify test environment
    console.log('📊 Verifying test environment...');
    await verifyTestEnvironment();

    // 2. Clean up any existing test data
    console.log('🧹 Cleaning up existing test data...');
    await dbHelper.cleanupTestData();

    // 3. Create test workshops and users
    console.log('👥 Creating test workshops and users...');
    const testWorkshops = await testData.createTestWorkshops();
    
    // Store test data for tests to use
    process.env.TEST_WORKSHOPS = JSON.stringify(testWorkshops);

    // 4. Setup authentication state for faster login in tests
    console.log('🔐 Setting up authentication states...');
    await setupAuthenticationStates(testWorkshops);

    // 5. Verify all services are running
    console.log('🔍 Verifying services...');
    await verifyServices();

    console.log('✅ Global setup completed successfully!');

  } catch (error) {
    console.error('❌ Global setup failed:', error);
    throw error;
  }
}

async function verifyTestEnvironment() {
  const requiredEnvVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY',
    'STRIPE_SECRET_KEY',
    'OPENAI_API_KEY'
  ];

  const missing = requiredEnvVars.filter(env => !process.env[env]);
  if (missing.length > 0) {
    throw new Error(`Missing environment variables: ${missing.join(', ')}`);
  }
}

async function setupAuthenticationStates(testWorkshops) {
  const browser = await chromium.launch();
  const baseURL = process.env.BASE_URL || 'http://localhost:3000';

  for (const workshop of testWorkshops) {
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
      // Login with test workshop credentials
      await page.goto(`${baseURL}/auth/login`);
      await page.fill('[data-testid="email"]', workshop.email);
      await page.fill('[data-testid="password"]', workshop.password);
      await page.click('[data-testid="login-submit"]');
      
      // Wait for successful login
      await page.waitForURL('**/dashboard', { timeout: 10000 });

      // Save authentication state
      await context.storageState({ 
        path: `tests/e2e/fixtures/auth-states/${workshop.type}-auth.json` 
      });

      console.log(`✅ Authentication state saved for ${workshop.type} workshop`);

    } catch (error) {
      console.error(`❌ Failed to setup auth for ${workshop.type}:`, error);
    } finally {
      await context.close();
    }
  }

  await browser.close();
}

async function verifyServices() {
  // Verify main application is running
  const fetch = require('node-fetch');
  const baseURL = process.env.BASE_URL || 'http://localhost:3000';

  try {
    const response = await fetch(`${baseURL}/api/test`);
    if (!response.ok) {
      throw new Error(`API health check failed: ${response.status}`);
    }
    console.log('✅ Main application is running');
  } catch (error) {
    console.error('❌ Main application check failed:', error);
    throw error;
  }

  // Verify database connectivity
  try {
    const dbHelper = new DatabaseHelper();
    await dbHelper.testConnection();
    console.log('✅ Database connection verified');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    throw error;
  }
}

module.exports = globalSetup;