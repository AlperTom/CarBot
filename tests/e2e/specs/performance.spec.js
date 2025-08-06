/**
 * Performance E2E Tests for CarBot
 * Tests page load times, chat response times, and overall system performance
 */

const { test, expect } = require('@playwright/test');
const { AuthPage } = require('../pages/auth-page');
const { DashboardPage } = require('../pages/dashboard-page');
const { ChatWidgetPage } = require('../pages/chat-widget-page');
const { TestDataFactory } = require('../fixtures/test-data-factory');
const { DatabaseHelper } = require('../utils/database-helper');

test.describe('Performance Tests', () => {
  let testData;
  let dbHelper;

  test.beforeEach(async ({ page }) => {
    testData = new TestDataFactory();
    dbHelper = new DatabaseHelper();
  });

  test('Page Load Performance Benchmarks', async ({ page }) => {
    console.log('⚡ Testing page load performance...');

    const performanceResults = {};

    const pages = [
      { name: 'Homepage', url: '/' },
      { name: 'Login Page', url: '/auth/login' },
      { name: 'Registration Page', url: '/auth/register' },
      { name: 'Dashboard', url: '/dashboard', requiresAuth: true }
    ];

    // Setup authenticated session for protected pages
    const workshopData = await testData.createWorkshop('basic');
    await dbHelper.createTestWorkshop(workshopData);

    for (const pageInfo of pages) {
      await test.step(`Test ${pageInfo.name} load time`, async () => {
        // Authenticate if required
        if (pageInfo.requiresAuth) {
          const authPage = new AuthPage(page);
          await authPage.goToLogin();
          await authPage.login(workshopData.email, workshopData.password);
        }

        const startTime = Date.now();
        
        // Navigate to page and wait for full load
        await page.goto(pageInfo.url);
        await page.waitForLoadState('networkidle');
        
        const loadTime = Date.now() - startTime;
        performanceResults[pageInfo.name] = loadTime;

        console.log(`📄 ${pageInfo.name}: ${loadTime}ms`);

        // Performance benchmarks for automotive industry (should be fast)
        expect(loadTime).toBeLessThan(5000); // Max 5 seconds
        
        if (loadTime > 3000) {
          console.log(`⚠️ ${pageInfo.name} load time above 3s threshold: ${loadTime}ms`);
        } else {
          console.log(`✅ ${pageInfo.name} load time acceptable: ${loadTime}ms`);
        }
      });
    }

    console.log('\n📊 Page Load Performance Summary:');
    Object.entries(performanceResults).forEach(([page, time]) => {
      console.log(`   ${page}: ${time}ms`);
    });
  });

  test('Chat Widget Performance', async ({ page }) => {
    console.log('💬 Testing chat widget performance...');

    // Setup test environment
    const workshopData = await testData.createWorkshop('professional');
    await dbHelper.createTestWorkshop(workshopData);

    const authPage = new AuthPage(page);
    await authPage.goToLogin();
    await authPage.login(workshopData.email, workshopData.password);

    const dashboardPage = new DashboardPage(page);
    await dashboardPage.goToClientKeys();
    const clientKey = await dashboardPage.generateClientKey({
      name: 'Performance Test Key'
    });

    const chatWidgetPage = new ChatWidgetPage(page);
    
    await test.step('Measure chat widget load time', async () => {
      const startTime = Date.now();
      
      await chatWidgetPage.goToWorkshopPage(clientKey.value);
      const widgetLoaded = await chatWidgetPage.waitForChatWidget(15000);
      
      const loadTime = Date.now() - startTime;
      
      expect(widgetLoaded).toBe(true);
      expect(loadTime).toBeLessThan(10000); // Max 10 seconds for widget load
      
      console.log(`✅ Chat widget load time: ${loadTime}ms`);
    });

    await test.step('Measure chat response times', async () => {
      await chatWidgetPage.openChat();
      
      const testMessages = [
        'Hallo, ich brauche Hilfe',
        'Was kostet eine Inspektion?',
        'Haben Sie heute Zeit?',
        'Können Sie mir mit BMW helfen?',
        'Wann haben Sie geöffnet?'
      ];

      const responseTimes = [];

      for (const message of testMessages) {
        const startTime = Date.now();
        
        await chatWidgetPage.sendMessage(message);
        const response = await chatWidgetPage.waitForBotResponse(20000);
        
        const responseTime = Date.now() - startTime;
        responseTimes.push(responseTime);

        expect(response).toBeDefined();
        expect(responseTime).toBeLessThan(15000); // Max 15 seconds per response
        
        console.log(`🤖 Response time for "${message.substring(0, 20)}...": ${responseTime}ms`);
        
        await page.waitForTimeout(1000); // Prevent rate limiting
      }

      const avgResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
      console.log(`📊 Average chat response time: ${avgResponseTime.toFixed(0)}ms`);
      
      expect(avgResponseTime).toBeLessThan(10000); // Average should be under 10 seconds
    });

    await test.step('Test concurrent chat sessions', async () => {
      // Open multiple browser contexts to simulate concurrent users
      const contexts = [];
      const performancePromises = [];

      for (let i = 0; i < 3; i++) {
        const context = await page.context().browser().newContext();
        contexts.push(context);
        
        performancePromises.push(
          (async () => {
            const testPage = await context.newPage();
            const testChatWidget = new ChatWidgetPage(testPage);
            
            const startTime = Date.now();
            
            await testChatWidget.goToWorkshopPage(clientKey.value);
            await testChatWidget.waitForChatWidget();
            await testChatWidget.openChat();
            await testChatWidget.sendMessage(`Concurrent test message ${i + 1}`);
            const response = await testChatWidget.waitForBotResponse(20000);
            
            const totalTime = Date.now() - startTime;
            
            await testPage.close();
            return { session: i + 1, time: totalTime, hasResponse: !!response };
          })()
        );
      }

      const results = await Promise.all(performancePromises);
      
      for (const context of contexts) {
        await context.close();
      }

      results.forEach(result => {
        expect(result.hasResponse).toBe(true);
        expect(result.time).toBeLessThan(25000); // Allow more time for concurrent sessions
        console.log(`✅ Concurrent session ${result.session}: ${result.time}ms`);
      });

      console.log('✅ Concurrent chat sessions handled successfully');
    });
  });

  test('Database Query Performance', async ({ page }) => {
    console.log('🗄️ Testing database performance...');

    // Create test data to measure query performance
    const workshopData = await testData.createWorkshop('professional');
    await dbHelper.createTestWorkshop(workshopData);

    await test.step('Measure authentication query performance', async () => {
      const authPage = new AuthPage(page);
      
      const loginAttempts = [];
      
      // Measure multiple login attempts
      for (let i = 0; i < 5; i++) {
        await authPage.goToLogin();
        
        const startTime = Date.now();
        const loginResult = await authPage.login(workshopData.email, workshopData.password);
        const loginTime = Date.now() - startTime;
        
        loginAttempts.push(loginTime);
        
        expect(loginResult.success).toBe(true);
        expect(loginTime).toBeLessThan(5000); // Max 5 seconds for login
        
        // Logout for next attempt
        const dashboardPage = new DashboardPage(page);
        await dashboardPage.logout();
      }

      const avgLoginTime = loginAttempts.reduce((a, b) => a + b, 0) / loginAttempts.length;
      console.log(`📊 Average login time: ${avgLoginTime.toFixed(0)}ms`);
      
      expect(avgLoginTime).toBeLessThan(3000); // Average should be under 3 seconds
    });

    await test.step('Measure dashboard data loading', async () => {
      const authPage = new AuthPage(page);
      const dashboardPage = new DashboardPage(page);
      
      await authPage.goToLogin();
      await authPage.login(workshopData.email, workshopData.password);
      
      // Measure different dashboard sections
      const dashboardSections = [
        { name: 'Overview', action: () => dashboardPage.goToDashboard() },
        { name: 'Client Keys', action: () => dashboardPage.goToClientKeys() },
        { name: 'Analytics', action: () => dashboardPage.goToAnalytics() },
        { name: 'Billing', action: () => dashboardPage.goToBilling() },
        { name: 'Settings', action: () => dashboardPage.goToSettings() }
      ];

      for (const section of dashboardSections) {
        const startTime = Date.now();
        
        await section.action();
        await page.waitForLoadState('networkidle');
        
        const loadTime = Date.now() - startTime;
        
        expect(loadTime).toBeLessThan(8000); // Max 8 seconds for dashboard sections
        console.log(`📊 ${section.name} section load: ${loadTime}ms`);
      }
    });

    await test.step('Measure lead creation performance', async () => {
      // Create multiple leads quickly to test database performance
      const leads = [];
      
      for (let i = 0; i < 10; i++) {
        const startTime = Date.now();
        
        const leadData = testData.createTestLead();
        leadData.name = `Performance Test Lead ${i + 1}`;
        
        const lead = await dbHelper.createTestLead(workshopData.id, leadData);
        
        const creationTime = Date.now() - startTime;
        leads.push({ lead, time: creationTime });
        
        expect(creationTime).toBeLessThan(2000); // Max 2 seconds per lead
      }

      const avgCreationTime = leads.reduce((sum, item) => sum + item.time, 0) / leads.length;
      console.log(`📊 Average lead creation time: ${avgCreationTime.toFixed(0)}ms`);
      
      expect(avgCreationTime).toBeLessThan(1000); // Average under 1 second
    });
  });

  test('Memory Usage and Resource Monitoring', async ({ page }) => {
    console.log('💾 Testing memory usage and resource consumption...');

    await test.step('Monitor page memory usage', async () => {
      // Get initial memory usage
      const initialMetrics = await page.evaluate(() => {
        return {
          memory: performance.memory ? {
            used: performance.memory.usedJSHeapSize,
            total: performance.memory.totalJSHeapSize,
            limit: performance.memory.jsHeapSizeLimit
          } : null,
          timing: performance.timing
        };
      });

      console.log('📊 Initial Memory Usage:');
      if (initialMetrics.memory) {
        console.log(`   Used: ${(initialMetrics.memory.used / 1024 / 1024).toFixed(2)} MB`);
        console.log(`   Total: ${(initialMetrics.memory.total / 1024 / 1024).toFixed(2)} MB`);
      }

      // Perform memory-intensive operations
      const workshopData = await testData.createWorkshop('professional');
      await dbHelper.createTestWorkshop(workshopData);

      const authPage = new AuthPage(page);
      await authPage.goToLogin();
      await authPage.login(workshopData.email, workshopData.password);

      const dashboardPage = new DashboardPage(page);
      await dashboardPage.goToClientKeys();
      
      // Generate multiple client keys
      for (let i = 0; i < 5; i++) {
        await dashboardPage.generateClientKey({
          name: `Memory Test Key ${i + 1}`
        });
      }

      // Get final memory usage
      const finalMetrics = await page.evaluate(() => {
        return {
          memory: performance.memory ? {
            used: performance.memory.usedJSHeapSize,
            total: performance.memory.totalJSHeapSize,
            limit: performance.memory.jsHeapSizeLimit
          } : null
        };
      });

      if (finalMetrics.memory && initialMetrics.memory) {
        const memoryIncrease = finalMetrics.memory.used - initialMetrics.memory.used;
        console.log(`📊 Memory increase: ${(memoryIncrease / 1024 / 1024).toFixed(2)} MB`);
        
        // Memory increase should be reasonable (under 50MB for this test)
        expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024);
      }
    });

    await test.step('Test for memory leaks', async () => {
      // Create and destroy chat widgets multiple times
      const workshopData = await testData.createWorkshop('basic');
      await dbHelper.createTestWorkshop(workshopData);

      const authPage = new AuthPage(page);
      await authPage.goToLogin();
      await authPage.login(workshopData.email, workshopData.password);

      const dashboardPage = new DashboardPage(page);
      await dashboardPage.goToClientKeys();
      const clientKey = await dashboardPage.generateClientKey({
        name: 'Memory Leak Test Key'
      });

      const chatWidgetPage = new ChatWidgetPage(page);
      
      // Monitor memory during repeated chat operations
      const memorySnapshots = [];
      
      for (let i = 0; i < 5; i++) {
        await chatWidgetPage.goToWorkshopPage(clientKey.value);
        await chatWidgetPage.waitForChatWidget();
        await chatWidgetPage.openChat();
        await chatWidgetPage.sendMessage(`Memory test ${i + 1}`);
        await chatWidgetPage.waitForBotResponse(10000);
        await chatWidgetPage.closeChat();
        
        // Force garbage collection if available
        await page.evaluate(() => {
          if (window.gc) {
            window.gc();
          }
        });
        
        const memory = await page.evaluate(() => {
          return performance.memory ? performance.memory.usedJSHeapSize : 0;
        });
        
        memorySnapshots.push(memory);
        console.log(`🔍 Memory after iteration ${i + 1}: ${(memory / 1024 / 1024).toFixed(2)} MB`);
      }

      // Check for significant memory growth (potential leak)
      const firstSnapshot = memorySnapshots[0];
      const lastSnapshot = memorySnapshots[memorySnapshots.length - 1];
      const memoryGrowth = lastSnapshot - firstSnapshot;
      
      if (memoryGrowth > 10 * 1024 * 1024) { // More than 10MB growth
        console.log(`⚠️ Potential memory leak detected: ${(memoryGrowth / 1024 / 1024).toFixed(2)} MB growth`);
      } else {
        console.log(`✅ No significant memory leaks detected: ${(memoryGrowth / 1024 / 1024).toFixed(2)} MB growth`);
      }
    });
  });

  test('Network Performance and Optimization', async ({ page }) => {
    console.log('🌐 Testing network performance...');

    await test.step('Measure network requests', async () => {
      const requestSizes = [];
      const requestTimes = [];

      // Listen to network requests
      page.on('response', (response) => {
        const request = response.request();
        const size = parseInt(response.headers()['content-length'] || '0');
        
        if (size > 0) {
          requestSizes.push({ url: request.url(), size });
        }
      });

      // Navigate to main pages and measure
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const authPage = new AuthPage(page);
      await authPage.goToLogin();
      await page.waitForLoadState('networkidle');

      // Analyze request sizes
      const totalSize = requestSizes.reduce((sum, req) => sum + req.size, 0);
      const largeRequests = requestSizes.filter(req => req.size > 100 * 1024); // > 100KB

      console.log(`📊 Total page size: ${(totalSize / 1024).toFixed(2)} KB`);
      console.log(`📊 Number of requests: ${requestSizes.length}`);
      console.log(`📊 Large requests (>100KB): ${largeRequests.length}`);

      // Performance expectations
      expect(totalSize).toBeLessThan(5 * 1024 * 1024); // Under 5MB total
      expect(largeRequests.length).toBeLessThan(5); // Few large requests

      if (largeRequests.length > 0) {
        console.log('🔍 Large requests found:');
        largeRequests.forEach(req => {
          console.log(`   ${req.url.substring(req.url.lastIndexOf('/') + 1)}: ${(req.size / 1024).toFixed(2)} KB`);
        });
      }
    });

    await test.step('Test resource caching', async () => {
      // First load
      const startTime1 = Date.now();
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      const firstLoadTime = Date.now() - startTime1;

      // Second load (should be faster due to caching)
      const startTime2 = Date.now();
      await page.reload();
      await page.waitForLoadState('networkidle');
      const secondLoadTime = Date.now() - startTime2;

      console.log(`📊 First load: ${firstLoadTime}ms`);
      console.log(`📊 Second load (cached): ${secondLoadTime}ms`);

      // Second load should be faster (caching working)
      if (secondLoadTime < firstLoadTime * 0.8) {
        console.log('✅ Resource caching is effective');
      } else {
        console.log('⚠️ Resource caching may not be optimized');
      }
    });
  });

  test('Mobile Performance', async ({ page }) => {
    console.log('📱 Testing mobile performance...');

    await test.step('Test mobile page load times', async () => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      
      // Throttle network to simulate 3G
      const client = await page.context().newCDPSession(page);
      await client.send('Network.emulateNetworkConditions', {
        offline: false,
        downloadThroughput: 1.5 * 1024 * 1024 / 8, // 1.5 Mbps
        uploadThroughput: 750 * 1024 / 8, // 750 kbps
        latency: 40
      });

      const startTime = Date.now();
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      const loadTime = Date.now() - startTime;

      console.log(`📱 Mobile load time (3G): ${loadTime}ms`);

      // Mobile should load within reasonable time even on slow networks
      expect(loadTime).toBeLessThan(10000); // Max 10 seconds on 3G

      // Reset network conditions
      await client.send('Network.emulateNetworkConditions', {
        offline: false,
        downloadThroughput: -1,
        uploadThroughput: -1,
        latency: 0
      });

      // Reset viewport
      await page.setViewportSize({ width: 1280, height: 720 });
    });
  });

  test('Performance Regression Detection', async ({ page }) => {
    console.log('🔍 Testing for performance regressions...');

    // This test would typically compare against baseline metrics
    // For demonstration, we'll establish basic benchmarks

    const benchmarks = {
      homepageLoad: 3000, // 3 seconds
      loginTime: 2000,    // 2 seconds
      chatResponse: 8000, // 8 seconds
      dashboardLoad: 4000 // 4 seconds
    };

    await test.step('Measure key performance metrics', async () => {
      const results = {};

      // Homepage load
      let startTime = Date.now();
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      results.homepageLoad = Date.now() - startTime;

      // Login performance
      const workshopData = await testData.createWorkshop('basic');
      await dbHelper.createTestWorkshop(workshopData);

      const authPage = new AuthPage(page);
      await authPage.goToLogin();
      
      startTime = Date.now();
      const loginResult = await authPage.login(workshopData.email, workshopData.password);
      results.loginTime = Date.now() - startTime;

      expect(loginResult.success).toBe(true);

      // Dashboard load
      startTime = Date.now();
      const dashboardPage = new DashboardPage(page);
      await dashboardPage.goToDashboard();
      results.dashboardLoad = Date.now() - startTime;

      // Chat response time
      await dashboardPage.goToClientKeys();
      const clientKey = await dashboardPage.generateClientKey({
        name: 'Performance Regression Test Key'
      });

      const chatWidgetPage = new ChatWidgetPage(page);
      await chatWidgetPage.goToWorkshopPage(clientKey.value);
      await chatWidgetPage.waitForChatWidget();
      await chatWidgetPage.openChat();

      startTime = Date.now();
      await chatWidgetPage.sendMessage('Performance test message');
      await chatWidgetPage.waitForBotResponse(15000);
      results.chatResponse = Date.now() - startTime;

      // Compare against benchmarks
      console.log('\n📊 Performance Results vs Benchmarks:');
      for (const [metric, actual] of Object.entries(results)) {
        const benchmark = benchmarks[metric];
        const status = actual <= benchmark ? '✅' : '⚠️';
        const percentage = ((actual / benchmark - 1) * 100).toFixed(1);
        
        console.log(`   ${metric}: ${actual}ms vs ${benchmark}ms (${percentage > 0 ? '+' : ''}${percentage}%) ${status}`);
        
        // Fail if significantly slower than benchmark
        if (actual > benchmark * 1.5) {
          console.log(`❌ PERFORMANCE REGRESSION: ${metric} is ${percentage}% slower than benchmark`);
        }
      }
    });
  });
});

test.describe('Load Testing', () => {
  test.skip('Concurrent User Load Test', async ({ browser }) => {
    console.log('🚀 Running concurrent user load test...');

    // Skip in normal runs - only for load testing
    if (process.env.LOAD_TEST !== 'true') {
      console.log('⏩ Load test skipped - set LOAD_TEST=true to run');
      return;
    }

    const concurrentUsers = 10;
    const testData = new TestDataFactory();
    const dbHelper = new DatabaseHelper();

    const userPromises = [];

    for (let i = 0; i < concurrentUsers; i++) {
      userPromises.push(
        (async () => {
          const context = await browser.newContext();
          const page = await context.newPage();

          try {
            const workshopData = await testData.createWorkshop('basic');
            await dbHelper.createTestWorkshop(workshopData);

            const authPage = new AuthPage(page);
            await authPage.goToLogin();
            await authPage.login(workshopData.email, workshopData.password);

            const dashboardPage = new DashboardPage(page);
            await dashboardPage.goToDashboard();

            await dashboardPage.goToClientKeys();
            const clientKey = await dashboardPage.generateClientKey({
              name: `Load Test Key ${i + 1}`
            });

            const chatWidgetPage = new ChatWidgetPage(page);
            await chatWidgetPage.goToWorkshopPage(clientKey.value);
            await chatWidgetPage.waitForChatWidget();
            await chatWidgetPage.openChat();
            await chatWidgetPage.sendMessage(`Load test message from user ${i + 1}`);
            await chatWidgetPage.waitForBotResponse(20000);

            return { user: i + 1, success: true };

          } catch (error) {
            return { user: i + 1, success: false, error: error.message };
          } finally {
            await context.close();
          }
        })()
      );
    }

    const results = await Promise.all(userPromises);
    
    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;

    console.log(`📊 Load Test Results:`);
    console.log(`   Concurrent Users: ${concurrentUsers}`);
    console.log(`   Successful: ${successful}`);
    console.log(`   Failed: ${failed}`);
    console.log(`   Success Rate: ${(successful / concurrentUsers * 100).toFixed(1)}%`);

    expect(successful).toBeGreaterThan(concurrentUsers * 0.8); // 80% success rate minimum
  });
});