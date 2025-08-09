/**
 * UAT Helper Utilities
 * Focus: Production readiness validation utilities
 */

const fs = require('fs').promises;
const path = require('path');

class UATHelper {
  constructor(config = {}) {
    this.config = {
      baseURL: config.baseURL || process.env.UAT_BASE_URL || 'http://localhost:3000',
      timeout: config.timeout || 30000,
      retryAttempts: config.retryAttempts || 3,
      performanceThresholds: {
        pageLoad: 3000,
        chatResponse: 5000,
        databaseQuery: 500,
        apiResponse: 2000
      },
      ...config
    };
    
    this.metrics = {
      testResults: [],
      performanceData: [],
      errorLog: [],
      coverage: {
        features: new Set(),
        endpoints: new Set(),
        userFlows: new Set()
      }
    };
  }

  // Performance monitoring
  async measurePerformance(operation, fn) {
    const start = Date.now();
    const startMemory = process.memoryUsage();
    
    try {
      const result = await fn();
      const duration = Date.now() - start;
      const endMemory = process.memoryUsage();
      
      const performanceData = {
        operation,
        duration,
        memoryDelta: {
          rss: endMemory.rss - startMemory.rss,
          heapUsed: endMemory.heapUsed - startMemory.heapUsed,
          heapTotal: endMemory.heapTotal - startMemory.heapTotal
        },
        timestamp: new Date().toISOString(),
        success: true
      };
      
      this.metrics.performanceData.push(performanceData);
      
      // Check against thresholds
      const threshold = this.config.performanceThresholds[operation];
      if (threshold && duration > threshold) {
        console.warn(`⚠️ Performance threshold exceeded: ${operation} took ${duration}ms (threshold: ${threshold}ms)`);
      }
      
      return { result, performanceData };
    } catch (error) {
      const duration = Date.now() - start;
      
      this.metrics.performanceData.push({
        operation,
        duration,
        timestamp: new Date().toISOString(),
        success: false,
        error: error.message
      });
      
      throw error;
    }
  }

  // Screenshot and evidence collection
  async captureEvidence(page, stepName, additionalData = {}) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `${stepName}_${timestamp}`;
    
    const evidence = {
      stepName,
      timestamp: new Date().toISOString(),
      url: page.url(),
      viewport: await page.viewportSize(),
      ...additionalData
    };
    
    try {
      // Capture screenshot
      const screenshotPath = path.join('test-artifacts', 'screenshots', `${fileName}.png`);
      await page.screenshot({ 
        path: screenshotPath, 
        fullPage: true 
      });
      evidence.screenshot = screenshotPath;
      
      // Capture page source
      const htmlPath = path.join('test-artifacts', 'html', `${fileName}.html`);
      const htmlContent = await page.content();
      await fs.mkdir(path.dirname(htmlPath), { recursive: true });
      await fs.writeFile(htmlPath, htmlContent);
      evidence.pageSource = htmlPath;
      
      // Capture network activity
      evidence.networkLog = this.getNetworkLog(page);
      
      // Capture console logs
      evidence.consoleLogs = this.getConsoleLogs(page);
      
      console.log(`📸 Evidence captured for: ${stepName}`);
      return evidence;
    } catch (error) {
      console.error(`Failed to capture evidence for ${stepName}:`, error);
      return { ...evidence, error: error.message };
    }
  }

  // Database verification helpers
  async verifyDatabaseState(expectedData, actualQuery) {
    const verificationResults = {
      timestamp: new Date().toISOString(),
      expected: expectedData,
      actual: null,
      matches: false,
      differences: []
    };
    
    try {
      // In a real implementation, this would execute the database query
      // For UAT, we simulate this
      verificationResults.actual = await this.simulateDBQuery(actualQuery);
      
      // Compare expected vs actual
      verificationResults.matches = this.deepCompare(expectedData, verificationResults.actual);
      
      if (!verificationResults.matches) {
        verificationResults.differences = this.findDifferences(expectedData, verificationResults.actual);
      }
      
      return verificationResults;
    } catch (error) {
      verificationResults.error = error.message;
      return verificationResults;
    }
  }

  // German-specific validation helpers
  validateGermanData(data) {
    const validations = {
      phoneNumber: this.validateGermanPhoneNumber(data.phone),
      postalCode: this.validateGermanPostalCode(data.plz),
      vatNumber: this.validateGermanVATNumber(data.vatNumber),
      iban: this.validateGermanIBAN(data.iban),
      address: this.validateGermanAddress(data.address)
    };
    
    const isValid = Object.values(validations).every(v => v.isValid);
    
    return {
      isValid,
      validations,
      errors: Object.entries(validations)
        .filter(([_, v]) => !v.isValid)
        .map(([field, v]) => ({ field, error: v.error }))
    };
  }

  validateGermanPhoneNumber(phone) {
    // German phone number patterns
    const patterns = [
      /^\+49\s?\d{2,5}\s?\d{6,9}$/, // International format
      /^0\d{2,5}\s?\d{6,9}$/, // National format
      /^\(\d{2,5}\)\s?\d{6,9}$/ // With area code in brackets
    ];
    
    const isValid = patterns.some(pattern => pattern.test(phone));
    return {
      isValid,
      error: isValid ? null : 'Invalid German phone number format'
    };
  }

  validateGermanPostalCode(plz) {
    const isValid = /^\d{5}$/.test(plz);
    return {
      isValid,
      error: isValid ? null : 'German postal code must be 5 digits'
    };
  }

  validateGermanVATNumber(vatNumber) {
    if (!vatNumber) return { isValid: true, error: null }; // Optional
    
    const isValid = /^DE\d{9}$/.test(vatNumber);
    return {
      isValid,
      error: isValid ? null : 'German VAT number format: DExxxxxxxxx'
    };
  }

  validateGermanIBAN(iban) {
    if (!iban) return { isValid: true, error: null }; // Optional
    
    const isValid = /^DE\d{20}$/.test(iban.replace(/\s/g, ''));
    return {
      isValid,
      error: isValid ? null : 'German IBAN format: DE + 20 digits'
    };
  }

  validateGermanAddress(address) {
    const required = ['street', 'city', 'plz'];
    const missing = required.filter(field => !address?.[field]);
    
    return {
      isValid: missing.length === 0,
      error: missing.length > 0 ? `Missing required fields: ${missing.join(', ')}` : null
    };
  }

  // Chat widget testing helpers
  async testChatWidget(page, clientKey) {
    const chatTests = {
      widgetLoads: false,
      widgetVisible: false,
      clickable: false,
      chatWindowOpens: false,
      messageCanBeSent: false,
      responseReceived: false,
      gdprHandled: false
    };
    
    try {
      // Test widget loading
      await page.waitForSelector('#carbot-chat-widget', { timeout: 15000 });
      chatTests.widgetLoads = true;
      
      // Test visibility
      const isVisible = await page.locator('#carbot-chat-widget').isVisible();
      chatTests.widgetVisible = isVisible;
      
      // Test clickability
      if (isVisible) {
        await page.click('#carbot-chat-widget');
        chatTests.clickable = true;
        
        // Test chat window opening
        await page.waitForSelector('.chat-window', { timeout: 5000 });
        chatTests.chatWindowOpens = true;
        
        // Handle GDPR consent if present
        const gdprModal = page.locator('[data-testid=\"gdpr-consent\"]');
        if (await gdprModal.isVisible({ timeout: 2000 })) {
          await page.click('button[data-testid=\"accept-gdpr\"]');
          chatTests.gdprHandled = true;
        }
        
        // Test message sending
        const testMessage = 'UAT Test Message';
        await page.fill('.chat-input', testMessage);
        await page.press('.chat-input', 'Enter');
        chatTests.messageCanBeSent = true;
        
        // Test response reception
        await page.waitForSelector('.bot-message:last-child', { timeout: 10000 });
        const response = await page.textContent('.bot-message:last-child');
        chatTests.responseReceived = response && response.length > 0;
      }
    } catch (error) {
      console.error('Chat widget test error:', error);
      chatTests.error = error.message;
    }
    
    return chatTests;
  }

  // Load testing simulation
  async simulateLoad(page, testFunction, concurrency = 5, iterations = 10) {
    console.log(`🔄 Starting load test: ${concurrency} concurrent users, ${iterations} iterations each`);
    
    const results = [];
    const promises = [];
    
    for (let user = 0; user < concurrency; user++) {
      const userPromise = this.simulateUser(page, testFunction, iterations, user);
      promises.push(userPromise);
    }
    
    const userResults = await Promise.all(promises);
    
    // Aggregate results
    const aggregated = {
      totalRequests: concurrency * iterations,
      successful: 0,
      failed: 0,
      averageResponseTime: 0,
      maxResponseTime: 0,
      minResponseTime: Infinity,
      errors: []
    };
    
    userResults.forEach(userResult => {\n      userResult.iterations.forEach(iteration => {\n        if (iteration.success) {\n          aggregated.successful++;\n        } else {\n          aggregated.failed++;\n          aggregated.errors.push(iteration.error);\n        }\n        \n        aggregated.averageResponseTime += iteration.duration;\n        aggregated.maxResponseTime = Math.max(aggregated.maxResponseTime, iteration.duration);\n        aggregated.minResponseTime = Math.min(aggregated.minResponseTime, iteration.duration);\n      });\n    });\n    \n    aggregated.averageResponseTime = aggregated.averageResponseTime / aggregated.totalRequests;\n    \n    console.log(`✅ Load test completed:`);\n    console.log(`   Total requests: ${aggregated.totalRequests}`);\n    console.log(`   Successful: ${aggregated.successful}`);\n    console.log(`   Failed: ${aggregated.failed}`);\n    console.log(`   Average response time: ${aggregated.averageResponseTime.toFixed(2)}ms`);\n    console.log(`   Min/Max response time: ${aggregated.minResponseTime}ms / ${aggregated.maxResponseTime}ms`);\n    \n    return aggregated;\n  }\n\n  async simulateUser(page, testFunction, iterations, userId) {\n    const userResults = {\n      userId,\n      iterations: []\n    };\n    \n    for (let i = 0; i < iterations; i++) {\n      const start = Date.now();\n      \n      try {\n        await testFunction(page, userId, i);\n        \n        userResults.iterations.push({\n          iteration: i,\n          success: true,\n          duration: Date.now() - start\n        });\n      } catch (error) {\n        userResults.iterations.push({\n          iteration: i,\n          success: false,\n          duration: Date.now() - start,\n          error: error.message\n        });\n      }\n      \n      // Small delay between iterations\n      await page.waitForTimeout(100 + Math.random() * 200);\n    }\n    \n    return userResults;\n  }\n\n  // UAT Report generation\n  generateUATReport() {\n    const report = {\n      timestamp: new Date().toISOString(),\n      environment: this.config.baseURL,\n      summary: {\n        totalTests: this.metrics.testResults.length,\n        passed: this.metrics.testResults.filter(t => t.status === 'passed').length,\n        failed: this.metrics.testResults.filter(t => t.status === 'failed').length,\n        errors: this.metrics.errorLog.length\n      },\n      performance: this.analyzePerformance(),\n      coverage: {\n        features: Array.from(this.metrics.coverage.features),\n        endpoints: Array.from(this.metrics.coverage.endpoints),\n        userFlows: Array.from(this.metrics.coverage.userFlows)\n      },\n      recommendations: this.generateRecommendations()\n    };\n    \n    return report;\n  }\n\n  analyzePerformance() {\n    if (this.metrics.performanceData.length === 0) {\n      return { message: 'No performance data collected' };\n    }\n    \n    const successful = this.metrics.performanceData.filter(p => p.success);\n    const failed = this.metrics.performanceData.filter(p => !p.success);\n    \n    const durations = successful.map(p => p.duration);\n    \n    return {\n      totalOperations: this.metrics.performanceData.length,\n      successful: successful.length,\n      failed: failed.length,\n      averageDuration: durations.reduce((a, b) => a + b, 0) / durations.length,\n      minDuration: Math.min(...durations),\n      maxDuration: Math.max(...durations),\n      thresholdViolations: this.findThresholdViolations()\n    };\n  }\n\n  findThresholdViolations() {\n    const violations = [];\n    \n    this.metrics.performanceData.forEach(data => {\n      const threshold = this.config.performanceThresholds[data.operation];\n      if (threshold && data.duration > threshold) {\n        violations.push({\n          operation: data.operation,\n          duration: data.duration,\n          threshold,\n          excess: data.duration - threshold\n        });\n      }\n    });\n    \n    return violations;\n  }\n\n  generateRecommendations() {\n    const recommendations = [];\n    \n    // Performance recommendations\n    const violations = this.findThresholdViolations();\n    if (violations.length > 0) {\n      recommendations.push({\n        type: 'performance',\n        priority: 'high',\n        message: `${violations.length} operations exceeded performance thresholds`,\n        details: violations\n      });\n    }\n    \n    // Error rate recommendations\n    const errorRate = this.metrics.errorLog.length / this.metrics.testResults.length;\n    if (errorRate > 0.05) { // More than 5% error rate\n      recommendations.push({\n        type: 'reliability',\n        priority: 'high',\n        message: `High error rate detected: ${(errorRate * 100).toFixed(1)}%`,\n        suggestion: 'Review error logs and improve error handling'\n      });\n    }\n    \n    // Coverage recommendations\n    if (this.metrics.coverage.features.size < 10) {\n      recommendations.push({\n        type: 'coverage',\n        priority: 'medium',\n        message: 'Low feature coverage detected',\n        suggestion: 'Increase test coverage of core features'\n      });\n    }\n    \n    return recommendations;\n  }\n\n  // Utility methods\n  simulateDBQuery(query) {\n    // Simulate database query for UAT\n    return new Promise(resolve => {\n      setTimeout(() => {\n        resolve({ id: 'test-id', created: true, query });\n      }, Math.random() * 100);\n    });\n  }\n\n  deepCompare(obj1, obj2) {\n    return JSON.stringify(obj1) === JSON.stringify(obj2);\n  }\n\n  findDifferences(expected, actual) {\n    // Simple difference detection\n    const diffs = [];\n    \n    Object.keys(expected).forEach(key => {\n      if (expected[key] !== actual?.[key]) {\n        diffs.push({\n          field: key,\n          expected: expected[key],\n          actual: actual?.[key]\n        });\n      }\n    });\n    \n    return diffs;\n  }\n\n  getNetworkLog(page) {\n    // In a real implementation, this would collect network requests\n    return [];\n  }\n\n  getConsoleLogs(page) {\n    // In a real implementation, this would collect console logs\n    return [];\n  }\n\n  // Add test result\n  addTestResult(testName, status, duration, details = {}) {\n    this.metrics.testResults.push({\n      testName,\n      status,\n      duration,\n      timestamp: new Date().toISOString(),\n      ...details\n    });\n  }\n\n  // Add performance data\n  addPerformanceData(operation, duration, success = true, details = {}) {\n    this.metrics.performanceData.push({\n      operation,\n      duration,\n      success,\n      timestamp: new Date().toISOString(),\n      ...details\n    });\n  }\n\n  // Track feature coverage\n  trackFeature(featureName) {\n    this.metrics.coverage.features.add(featureName);\n  }\n\n  // Track endpoint coverage\n  trackEndpoint(endpoint) {\n    this.metrics.coverage.endpoints.add(endpoint);\n  }\n\n  // Track user flow coverage\n  trackUserFlow(flowName) {\n    this.metrics.coverage.userFlows.add(flowName);\n  }\n\n  // Log error\n  logError(error, context = {}) {\n    this.metrics.errorLog.push({\n      error: error.message,\n      stack: error.stack,\n      context,\n      timestamp: new Date().toISOString()\n    });\n  }\n}\n\nmodule.exports = { UATHelper };\n"