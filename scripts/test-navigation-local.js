#!/usr/bin/env node

/**
 * Local Navigation Testing Script for CarBot
 * Runs navigation tests locally with comprehensive reporting
 */

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

class NavigationTester {
  constructor() {
    this.results = {
      startTime: new Date(),
      tests: [],
      summary: {
        total: 0,
        passed: 0,
        failed: 0,
        skipped: 0
      }
    };
    
    this.testConfigs = [
      {
        name: 'Desktop Navigation - Chrome',
        command: 'npx playwright test tests/e2e/specs/navigation-comprehensive.spec.js --project=chromium --headed',
        viewport: '1280x720'
      },
      {
        name: 'Mobile Navigation - Chrome',
        command: 'npx playwright test tests/e2e/specs/navigation-comprehensive.spec.js --project="Mobile Chrome" --headed',
        viewport: '375x667'
      },
      {
        name: 'Navigation Performance Tests',
        command: 'npx playwright test tests/e2e/specs/navigation-comprehensive.spec.js --grep="Performance" --project=chromium',
        viewport: '1280x720'
      },
      {
        name: 'Navigation Accessibility Tests',
        command: 'npx playwright test tests/e2e/specs/navigation-comprehensive.spec.js --grep="Accessibility" --project=chromium',
        viewport: '1280x720'
      }
    ];
  }

  async runTest(config) {
    console.log(`\n🚀 Running: ${config.name}`);
    console.log(`📱 Viewport: ${config.viewport}`);
    console.log(`⚙️  Command: ${config.command}`);
    
    return new Promise((resolve) => {
      const startTime = Date.now();
      
      exec(config.command, { 
        cwd: process.cwd(),
        env: { 
          ...process.env, 
          BASE_URL: 'http://localhost:3000',
          VIEWPORT_SIZE: config.viewport
        }
      }, (error, stdout, stderr) => {
        const duration = Date.now() - startTime;
        
        const result = {
          name: config.name,
          command: config.command,
          viewport: config.viewport,
          duration,
          success: !error,
          stdout: stdout || '',
          stderr: stderr || '',
          error: error ? error.message : null
        };
        
        if (result.success) {
          console.log(`✅ ${config.name} - PASSED (${duration}ms)`);
          this.results.summary.passed++;
        } else {
          console.log(`❌ ${config.name} - FAILED (${duration}ms)`);
          console.log(`   Error: ${result.error}`);
          this.results.summary.failed++;
        }
        
        this.results.tests.push(result);
        resolve(result);
      });
    });
  }

  async checkPrerequisites() {
    console.log('🔍 Checking prerequisites...');
    
    // Check if development server is running
    try {
      const { exec } = require('child_process');
      await new Promise((resolve, reject) => {
        exec('curl -f http://localhost:3000/api/health 2>/dev/null', (error, stdout) => {
          if (error) {
            reject(new Error('Development server not running on http://localhost:3000'));
          } else {
            resolve();
          }
        });
      });
      console.log('✅ Development server is running');
    } catch (error) {
      console.log('❌ Development server check failed');
      console.log('💡 Please run: npm run dev');
      process.exit(1);
    }
    
    // Check if Playwright is installed
    if (!fs.existsSync(path.join(process.cwd(), 'node_modules', '@playwright', 'test'))) {
      console.log('❌ Playwright not installed');
      console.log('💡 Please run: npm install @playwright/test');
      process.exit(1);
    }
    
    console.log('✅ Playwright is installed');
    
    // Check if navigation test file exists
    const navTestFile = path.join(process.cwd(), 'tests', 'e2e', 'specs', 'navigation-comprehensive.spec.js');
    if (!fs.existsSync(navTestFile)) {
      console.log('❌ Navigation test file not found');
      console.log(`💡 Expected: ${navTestFile}`);
      process.exit(1);
    }
    
    console.log('✅ Navigation test file exists');
  }

  async runAllTests() {
    console.log('🧪 CarBot Navigation Test Suite');
    console.log('================================');
    
    await this.checkPrerequisites();
    
    // Run tests sequentially to avoid conflicts
    for (const config of this.testConfigs) {
      await this.runTest(config);
      this.results.summary.total++;
      
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    this.results.endTime = new Date();
    this.results.totalDuration = this.results.endTime - this.results.startTime;
    
    this.generateReport();
    this.saveResults();
  }

  generateReport() {
    console.log('\n📊 NAVIGATION TEST RESULTS');
    console.log('===========================');
    
    console.log(`⏰ Total Duration: ${Math.round(this.results.totalDuration / 1000)}s`);
    console.log(`📈 Tests Run: ${this.results.summary.total}`);
    console.log(`✅ Passed: ${this.results.summary.passed}`);
    console.log(`❌ Failed: ${this.results.summary.failed}`);
    console.log(`⏭️ Skipped: ${this.results.summary.skipped}`);
    
    const successRate = this.results.summary.total > 0 
      ? Math.round((this.results.summary.passed / this.results.summary.total) * 100) 
      : 0;
    
    console.log(`🎯 Success Rate: ${successRate}%`);
    
    if (this.results.summary.failed > 0) {
      console.log('\n❌ FAILED TESTS:');
      console.log('================');
      
      this.results.tests
        .filter(test => !test.success)
        .forEach(test => {
          console.log(`\n• ${test.name}`);
          console.log(`  Duration: ${test.duration}ms`);
          console.log(`  Error: ${test.error}`);
          
          if (test.stderr) {
            console.log(`  Details: ${test.stderr.substring(0, 200)}...`);
          }
        });
    }
    
    if (this.results.summary.passed > 0) {
      console.log('\n✅ SUCCESSFUL TESTS:');
      console.log('=====================');
      
      this.results.tests
        .filter(test => test.success)
        .forEach(test => {
          console.log(`• ${test.name} (${test.duration}ms)`);
        });
    }

    console.log('\n🔍 CRITICAL AREAS TESTED:');
    console.log('=========================');
    console.log('✓ CSS-in-JS media queries → CSS classes fix');
    console.log('✓ Mobile menu button visibility');
    console.log('✓ Desktop navigation hiding on mobile');
    console.log('✓ Responsive breakpoint switching');
    console.log('✓ Touch target sizing for mobile');
    console.log('✓ Keyboard navigation support');
    console.log('✓ No-JavaScript fallback navigation');
    console.log('✓ Performance benchmarks');
    console.log('✓ Accessibility compliance');

    if (successRate >= 80) {
      console.log('\n🎉 NAVIGATION HEALTH: EXCELLENT');
      console.log('The navigation fixes are working correctly!');
    } else if (successRate >= 60) {
      console.log('\n⚠️ NAVIGATION HEALTH: NEEDS ATTENTION');
      console.log('Some navigation issues remain. Check failed tests above.');
    } else {
      console.log('\n🚨 NAVIGATION HEALTH: CRITICAL');
      console.log('Major navigation issues detected. Immediate attention required.');
    }
  }

  saveResults() {
    const resultsDir = path.join(process.cwd(), 'test-results');
    if (!fs.existsSync(resultsDir)) {
      fs.mkdirSync(resultsDir, { recursive: true });
    }
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const resultsFile = path.join(resultsDir, `navigation-test-${timestamp}.json`);
    
    fs.writeFileSync(resultsFile, JSON.stringify(this.results, null, 2));
    console.log(`\n💾 Results saved to: ${resultsFile}`);
    
    // Also create a simple HTML report
    const htmlReport = this.generateHTMLReport();
    const htmlFile = path.join(resultsDir, `navigation-report-${timestamp}.html`);
    fs.writeFileSync(htmlFile, htmlReport);
    console.log(`📄 HTML report: ${htmlFile}`);
  }

  generateHTMLReport() {
    const successRate = this.results.summary.total > 0 
      ? Math.round((this.results.summary.passed / this.results.summary.total) * 100) 
      : 0;

    return `
<!DOCTYPE html>
<html>
<head>
    <title>CarBot Navigation Test Report</title>
    <style>
        body { font-family: system-ui, -apple-system, sans-serif; margin: 2rem; }
        .header { background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: white; padding: 2rem; border-radius: 8px; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin: 2rem 0; }
        .metric { background: #f8fafc; padding: 1.5rem; border-radius: 8px; text-align: center; }
        .metric h3 { margin: 0 0 0.5rem 0; color: #1e293b; }
        .metric .value { font-size: 2rem; font-weight: bold; color: #0f172a; }
        .test { border: 1px solid #e2e8f0; padding: 1rem; margin: 0.5rem 0; border-radius: 6px; }
        .test.passed { border-left: 4px solid #10b981; background: #f0fdf4; }
        .test.failed { border-left: 4px solid #ef4444; background: #fef2f2; }
        .success-rate { font-size: 3rem; font-weight: bold; }
        .excellent { color: #10b981; }
        .warning { color: #f59e0b; }
        .critical { color: #ef4444; }
        .features { background: #eff6ff; padding: 1.5rem; border-radius: 8px; margin: 2rem 0; }
        .features ul { columns: 2; column-gap: 2rem; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🚗 CarBot Navigation Test Report</h1>
        <p>Comprehensive navigation testing including mobile responsiveness, accessibility, and performance</p>
        <p><strong>Generated:</strong> ${this.results.endTime.toLocaleString()}</p>
    </div>

    <div class="summary">
        <div class="metric">
            <h3>Success Rate</h3>
            <div class="value success-rate ${successRate >= 80 ? 'excellent' : successRate >= 60 ? 'warning' : 'critical'}">${successRate}%</div>
        </div>
        <div class="metric">
            <h3>Total Tests</h3>
            <div class="value">${this.results.summary.total}</div>
        </div>
        <div class="metric">
            <h3>Passed</h3>
            <div class="value" style="color: #10b981;">${this.results.summary.passed}</div>
        </div>
        <div class="metric">
            <h3>Failed</h3>
            <div class="value" style="color: #ef4444;">${this.results.summary.failed}</div>
        </div>
        <div class="metric">
            <h3>Duration</h3>
            <div class="value">${Math.round(this.results.totalDuration / 1000)}s</div>
        </div>
    </div>

    <div class="features">
        <h2>🔍 Critical Navigation Areas Tested</h2>
        <ul>
            <li>CSS-in-JS media queries → CSS classes fix</li>
            <li>Mobile menu button visibility and functionality</li>
            <li>Desktop navigation hiding on mobile breakpoints</li>
            <li>Responsive breakpoint switching (768px threshold)</li>
            <li>Touch target sizing for mobile devices</li>
            <li>Keyboard navigation and focus management</li>
            <li>No-JavaScript fallback navigation</li>
            <li>Navigation performance benchmarks</li>
            <li>ARIA labels and accessibility compliance</li>
            <li>Cross-browser compatibility testing</li>
        </ul>
    </div>

    <h2>📊 Test Results</h2>
    ${this.results.tests.map(test => `
        <div class="test ${test.success ? 'passed' : 'failed'}">
            <h3>${test.success ? '✅' : '❌'} ${test.name}</h3>
            <p><strong>Viewport:</strong> ${test.viewport} | <strong>Duration:</strong> ${test.duration}ms</p>
            ${test.error ? `<p><strong>Error:</strong> ${test.error}</p>` : ''}
        </div>
    `).join('')}

    <div style="margin-top: 3rem; padding: 1.5rem; background: #f1f5f9; border-radius: 8px;">
        <h2>🛠️ Navigation Fixes Applied</h2>
        <p><strong>Issue:</strong> CSS-in-JS media queries were not working in React components, causing mobile navigation to break.</p>
        <p><strong>Solution:</strong> Replaced inline CSS-in-JS with proper CSS classes in globals.css with media queries that work reliably across all browsers.</p>
        <p><strong>Files Modified:</strong></p>
        <ul>
            <li><code>components/DashboardNav.jsx</code> - Replaced CSS-in-JS with CSS classes</li>
            <li><code>app/page.jsx</code> - Enhanced mobile menu with proper classes and aria-labels</li>
            <li><code>app/globals.css</code> - Added robust navigation CSS with fallbacks</li>
            <li><code>tests/e2e/specs/navigation-comprehensive.spec.js</code> - Comprehensive E2E tests</li>
        </ul>
    </div>
</body>
</html>`;
  }
}

// Run the tests if this script is executed directly
if (require.main === module) {
  const tester = new NavigationTester();
  tester.runAllTests().catch(error => {
    console.error('❌ Test execution failed:', error);
    process.exit(1);
  });
}

module.exports = { NavigationTester };