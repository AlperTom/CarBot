#!/usr/bin/env node
/**
 * Mobile & Performance Test Runner
 * Executes comprehensive mobile and performance testing suite
 */

const { spawn } = require('child_process');
const fs = require('fs').promises;
const path = require('path');
const os = require('os');

// Test configuration
const CONFIG = {
  testUrl: process.env.TEST_URL || 'http://localhost:3000',
  workers: process.env.TEST_WORKERS || '1',
  headless: process.env.HEADLESS !== 'false',
  outputDir: path.join(__dirname, '..', 'test-results'),
  reportsDir: path.join(__dirname, '..', 'performance-reports'),
  timeout: 60000, // 60 seconds per test
  retries: 1
};

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

// Utility functions
function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logHeader(message) {
  const line = '='.repeat(60);
  log(line, 'cyan');
  log(`🚗 ${message}`, 'bright');
  log(line, 'cyan');
}

function logSection(message) {
  log(`\n📋 ${message}`, 'blue');
  log('-'.repeat(40), 'dim');
}

async function ensureDirectories() {
  try {
    await fs.mkdir(CONFIG.outputDir, { recursive: true });
    await fs.mkdir(CONFIG.reportsDir, { recursive: true });
    log('✅ Test directories created', 'green');
  } catch (error) {
    log(`❌ Failed to create directories: ${error.message}`, 'red');
    throw error;
  }
}

async function checkDependencies() {
  log('🔍 Checking dependencies...', 'yellow');
  
  const dependencies = [
    { name: 'playwright', command: 'npx playwright --version' },
    { name: 'lighthouse', command: 'npx lighthouse --version' }
  ];
  
  for (const dep of dependencies) {
    try {
      await runCommand(dep.command, { stdio: 'pipe' });
      log(`✅ ${dep.name} found`, 'green');
    } catch (error) {
      log(`❌ ${dep.name} not found. Installing...`, 'red');
      
      if (dep.name === 'playwright') {
        await runCommand('npm install -D @playwright/test');
        await runCommand('npx playwright install');
      } else if (dep.name === 'lighthouse') {
        await runCommand('npm install -D lighthouse playwright-lighthouse');
      }
    }
  }
}

function runCommand(command, options = {}) {
  return new Promise((resolve, reject) => {
    const [cmd, ...args] = command.split(' ');
    const child = spawn(cmd, args, {
      stdio: 'inherit',
      shell: true,
      ...options
    });
    
    child.on('close', (code) => {
      if (code === 0) {
        resolve(code);
      } else {
        reject(new Error(`Command failed with code ${code}: ${command}`));
      }
    });
    
    child.on('error', (error) => {
      reject(error);
    });
  });
}

async function runMobilePerformanceTests() {
  logSection('Running Mobile & Performance Tests');
  
  const playwrightConfig = {
    testDir: path.join(__dirname, '..', 'tests'),
    testMatch: ['mobile-performance-test.js'],
    timeout: CONFIG.timeout,
    retries: CONFIG.retries,
    workers: CONFIG.workers,
    use: {
      headless: CONFIG.headless,
      baseURL: CONFIG.testUrl,
      screenshot: 'only-on-failure',
      video: 'retain-on-failure',
      trace: 'retain-on-failure'
    },
    outputDir: CONFIG.outputDir,
    reporter: [
      ['html', { outputFolder: path.join(CONFIG.reportsDir, 'mobile-tests') }],
      ['json', { outputFile: path.join(CONFIG.reportsDir, 'mobile-results.json') }],
      ['list']
    ]
  };
  
  // Write Playwright config
  const configPath = path.join(__dirname, '..', 'playwright.mobile.config.js');
  const configContent = `module.exports = ${JSON.stringify(playwrightConfig, null, 2)};`;
  await fs.writeFile(configPath, configContent);
  
  try {
    await runCommand(`npx playwright test --config=${configPath}`);
    log('✅ Mobile performance tests completed', 'green');
  } catch (error) {
    log('❌ Mobile performance tests failed', 'red');
    throw error;
  }
}

async function runLighthouseTests() {
  logSection('Running Lighthouse Performance Audits');
  
  const playwrightConfig = {
    testDir: path.join(__dirname, '..', 'tests'),
    testMatch: ['performance-lighthouse.js'],
    timeout: CONFIG.timeout * 2, // Lighthouse tests take longer
    retries: CONFIG.retries,
    workers: 1, // Run lighthouse tests sequentially
    use: {
      headless: CONFIG.headless,
      baseURL: CONFIG.testUrl,
      screenshot: 'only-on-failure',
      video: 'retain-on-failure'
    },
    outputDir: CONFIG.outputDir,
    reporter: [
      ['html', { outputFolder: path.join(CONFIG.reportsDir, 'lighthouse-tests') }],
      ['json', { outputFile: path.join(CONFIG.reportsDir, 'lighthouse-results.json') }],
      ['list']
    ]
  };
  
  // Write Playwright config for Lighthouse
  const configPath = path.join(__dirname, '..', 'playwright.lighthouse.config.js');
  const configContent = `module.exports = ${JSON.stringify(playwrightConfig, null, 2)};`;
  await fs.writeFile(configPath, configContent);
  
  try {
    await runCommand(`npx playwright test --config=${configPath}`);
    log('✅ Lighthouse tests completed', 'green');
  } catch (error) {
    log('❌ Lighthouse tests failed', 'red');
    throw error;
  }
}

async function generateSummaryReport() {
  logSection('Generating Summary Report');
  
  try {
    // Read test results
    const mobileResultsPath = path.join(CONFIG.reportsDir, 'mobile-results.json');
    const lighthouseResultsPath = path.join(CONFIG.reportsDir, 'lighthouse-results.json');
    const comprehensiveReportPath = path.join(CONFIG.reportsDir, 'comprehensive-performance-report.json');
    
    let mobileResults = { suites: [] };
    let lighthouseResults = { suites: [] };
    let comprehensiveReport = null;
    
    try {
      const mobileData = await fs.readFile(mobileResultsPath, 'utf8');
      mobileResults = JSON.parse(mobileData);
    } catch (error) {
      log('⚠️ Mobile results not found', 'yellow');
    }
    
    try {
      const lighthouseData = await fs.readFile(lighthouseResultsPath, 'utf8');
      lighthouseResults = JSON.parse(lighthouseData);
    } catch (error) {
      log('⚠️ Lighthouse results not found', 'yellow');
    }
    
    try {
      const comprehensiveData = await fs.readFile(comprehensiveReportPath, 'utf8');
      comprehensiveReport = JSON.parse(comprehensiveData);
    } catch (error) {
      log('⚠️ Comprehensive report not found', 'yellow');
    }
    
    // Generate summary
    const summary = {
      generatedAt: new Date().toISOString(),
      testUrl: CONFIG.testUrl,
      system: {
        platform: os.platform(),
        arch: os.arch(),
        nodeVersion: process.version,
        cpus: os.cpus().length,
        memory: `${Math.round(os.totalmem() / 1024 / 1024 / 1024)}GB`
      },
      mobileTests: {
        totalSuites: mobileResults.suites?.length || 0,
        totalTests: mobileResults.suites?.reduce((sum, suite) => sum + (suite.specs?.length || 0), 0) || 0,
        passed: mobileResults.suites?.reduce((sum, suite) => 
          sum + (suite.specs?.filter(spec => spec.ok).length || 0), 0) || 0,
        failed: mobileResults.suites?.reduce((sum, suite) => 
          sum + (suite.specs?.filter(spec => !spec.ok).length || 0), 0) || 0
      },
      lighthouseTests: {
        totalSuites: lighthouseResults.suites?.length || 0,
        totalTests: lighthouseResults.suites?.reduce((sum, suite) => sum + (suite.specs?.length || 0), 0) || 0,
        passed: lighthouseResults.suites?.reduce((sum, suite) => 
          sum + (suite.specs?.filter(spec => spec.ok).length || 0), 0) || 0,
        failed: lighthouseResults.suites?.reduce((sum, suite) => 
          sum + (suite.specs?.filter(spec => !spec.ok).length || 0), 0) || 0
      },
      performanceScores: comprehensiveReport?.summary?.averageScores || {},
      recommendations: comprehensiveReport?.recommendations || [],
      files: {
        mobileReport: path.join(CONFIG.reportsDir, 'mobile-tests', 'index.html'),
        lighthouseReport: path.join(CONFIG.reportsDir, 'lighthouse-tests', 'index.html'),
        performanceReport: path.join(CONFIG.reportsDir, 'performance-report.html'),
        summaryReport: path.join(CONFIG.reportsDir, 'test-summary.json')
      }
    };
    
    // Save summary
    await fs.writeFile(summary.files.summaryReport, JSON.stringify(summary, null, 2));
    
    // Generate HTML summary
    await generateHTMLSummary(summary);
    
    log('✅ Summary report generated', 'green');
    return summary;
    
  } catch (error) {
    log(`❌ Failed to generate summary: ${error.message}`, 'red');
    throw error;
  }
}

async function generateHTMLSummary(summary) {
  const htmlContent = `
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CarBot - Mobile & Performance Test Summary</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            background: #f5f7fa;
        }
        .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
        .header { 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white; 
            padding: 40px 20px; 
            border-radius: 12px; 
            margin-bottom: 30px;
            text-align: center;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
        .header h1 { font-size: 2.5em; margin-bottom: 10px; }
        .header p { font-size: 1.2em; opacity: 0.9; }
        .stats-grid { 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); 
            gap: 20px; 
            margin-bottom: 30px; 
        }
        .stat-card { 
            background: white; 
            padding: 30px; 
            border-radius: 12px; 
            text-align: center;
            box-shadow: 0 5px 20px rgba(0,0,0,0.1);
            transition: transform 0.3s ease;
        }
        .stat-card:hover { transform: translateY(-5px); }
        .stat-card h3 { color: #667eea; margin-bottom: 15px; font-size: 1.1em; }
        .stat-card .number { font-size: 2.5em; font-weight: bold; color: #333; margin-bottom: 10px; }
        .stat-card .label { color: #666; font-size: 0.9em; }
        .success { color: #27ae60; }
        .warning { color: #f39c12; }
        .error { color: #e74c3c; }
        .performance-scores {
            background: white;
            padding: 30px;
            border-radius: 12px;
            margin-bottom: 30px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.1);
        }
        .performance-scores h3 { margin-bottom: 20px; color: #333; }
        .score-bar {
            display: flex;
            align-items: center;
            margin-bottom: 15px;
            padding: 10px 0;
        }
        .score-label {
            min-width: 120px;
            font-weight: 500;
        }
        .score-progress {
            flex: 1;
            height: 20px;
            background: #f0f0f0;
            border-radius: 10px;
            margin: 0 15px;
            overflow: hidden;
            position: relative;
        }
        .score-fill {
            height: 100%;
            border-radius: 10px;
            transition: width 0.5s ease;
        }
        .score-fill.excellent { background: #27ae60; }
        .score-fill.good { background: #2ecc71; }
        .score-fill.average { background: #f39c12; }
        .score-fill.poor { background: #e74c3c; }
        .score-value {
            min-width: 50px;
            text-align: right;
            font-weight: bold;
        }
        .recommendations {
            background: white;
            padding: 30px;
            border-radius: 12px;
            margin-bottom: 30px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.1);
        }
        .recommendation {
            padding: 20px;
            margin: 15px 0;
            border-radius: 8px;
            border-left: 4px solid #667eea;
            background: #f8f9fa;
        }
        .recommendation.high { border-left-color: #e74c3c; }
        .recommendation.medium { border-left-color: #f39c12; }
        .recommendation h4 { margin-bottom: 10px; color: #333; }
        .recommendation p { color: #666; margin-bottom: 5px; }
        .recommendation small { color: #999; }
        .system-info {
            background: white;
            padding: 20px;
            border-radius: 12px;
            margin-bottom: 30px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.1);
        }
        .system-info h3 { margin-bottom: 15px; color: #333; }
        .system-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
        }
        .system-item {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #f0f0f0;
        }
        .links {
            background: white;
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.1);
        }
        .links h3 { margin-bottom: 20px; color: #333; }
        .link-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 15px;
        }
        .link-card {
            padding: 20px;
            border: 2px solid #f0f0f0;
            border-radius: 8px;
            text-decoration: none;
            color: #333;
            transition: all 0.3s ease;
        }
        .link-card:hover {
            border-color: #667eea;
            background: #f8f9ff;
            transform: translateY(-2px);
        }
        .link-card h4 { margin-bottom: 10px; color: #667eea; }
        .footer {
            text-align: center;
            margin-top: 40px;
            padding: 20px;
            color: #666;
        }
        @media (max-width: 768px) {
            .container { padding: 10px; }
            .header { padding: 20px 10px; }
            .header h1 { font-size: 2em; }
            .stat-card { padding: 20px; }
            .stats-grid { grid-template-columns: 1fr; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚗 CarBot Mobile & Performance Test Report</h1>
            <p>Comprehensive testing results for mobile experience and performance optimization</p>
            <p style="font-size: 1em; margin-top: 15px;">Generated: ${new Date(summary.generatedAt).toLocaleString('de-DE')}</p>
        </div>

        <div class="stats-grid">
            <div class="stat-card">
                <h3>📱 Mobile Tests</h3>
                <div class="number ${summary.mobileTests.failed > 0 ? 'error' : 'success'}">${summary.mobileTests.totalTests}</div>
                <div class="label">Total Tests</div>
                <div style="margin-top: 10px;">
                    <span class="success">${summary.mobileTests.passed} passed</span> • 
                    <span class="error">${summary.mobileTests.failed} failed</span>
                </div>
            </div>
            
            <div class="stat-card">
                <h3>🔍 Lighthouse Audits</h3>
                <div class="number ${summary.lighthouseTests.failed > 0 ? 'error' : 'success'}">${summary.lighthouseTests.totalTests}</div>
                <div class="label">Performance Audits</div>
                <div style="margin-top: 10px;">
                    <span class="success">${summary.lighthouseTests.passed} passed</span> • 
                    <span class="error">${summary.lighthouseTests.failed} failed</span>
                </div>
            </div>
            
            <div class="stat-card">
                <h3>📊 Average Performance</h3>
                <div class="number ${(summary.performanceScores.performance || 0) >= 90 ? 'success' : (summary.performanceScores.performance || 0) >= 70 ? 'warning' : 'error'}">${Math.round(summary.performanceScores.performance || 0)}</div>
                <div class="label">Performance Score</div>
            </div>
            
            <div class="stat-card">
                <h3>💡 Recommendations</h3>
                <div class="number warning">${summary.recommendations.length}</div>
                <div class="label">Optimization Opportunities</div>
            </div>
        </div>

        ${summary.performanceScores.performance ? `
        <div class="performance-scores">
            <h3>🎯 Lighthouse Performance Scores</h3>
            ${Object.entries(summary.performanceScores).map(([category, score]) => {
              const percentage = Math.round(score || 0);
              const scoreClass = percentage >= 90 ? 'excellent' : percentage >= 70 ? 'good' : percentage >= 50 ? 'average' : 'poor';
              return `
                <div class="score-bar">
                    <div class="score-label">${category}</div>
                    <div class="score-progress">
                        <div class="score-fill ${scoreClass}" style="width: ${percentage}%"></div>
                    </div>
                    <div class="score-value">${percentage}/100</div>
                </div>
              `;
            }).join('')}
        </div>
        ` : ''}

        ${summary.recommendations.length > 0 ? `
        <div class="recommendations">
            <h3>💡 Performance Recommendations</h3>
            ${summary.recommendations.map(rec => `
                <div class="recommendation ${rec.priority.toLowerCase()}">
                    <h4>${rec.priority} Priority: ${rec.issue.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</h4>
                    <p>${rec.description}</p>
                    <small>Affects ${rec.affectedTests} tests (${rec.percentage})</small>
                </div>
            `).join('')}
        </div>
        ` : ''}

        <div class="system-info">
            <h3>💻 Test Environment</h3>
            <div class="system-grid">
                <div class="system-item">
                    <span>Platform:</span>
                    <strong>${summary.system.platform}</strong>
                </div>
                <div class="system-item">
                    <span>Architecture:</span>
                    <strong>${summary.system.arch}</strong>
                </div>
                <div class="system-item">
                    <span>Node Version:</span>
                    <strong>${summary.system.nodeVersion}</strong>
                </div>
                <div class="system-item">
                    <span>CPUs:</span>
                    <strong>${summary.system.cpus}</strong>
                </div>
                <div class="system-item">
                    <span>Memory:</span>
                    <strong>${summary.system.memory}</strong>
                </div>
                <div class="system-item">
                    <span>Test URL:</span>
                    <strong>${summary.testUrl}</strong>
                </div>
            </div>
        </div>

        <div class="links">
            <h3>📋 Detailed Reports</h3>
            <div class="link-grid">
                <a href="mobile-tests/index.html" class="link-card">
                    <h4>📱 Mobile Test Report</h4>
                    <p>Detailed mobile device testing results with screenshots and metrics</p>
                </a>
                <a href="lighthouse-tests/index.html" class="link-card">
                    <h4>🔍 Lighthouse Report</h4>
                    <p>Performance audits and Core Web Vitals measurements</p>
                </a>
                <a href="performance-report.html" class="link-card">
                    <h4>📊 Performance Dashboard</h4>
                    <p>Comprehensive performance analysis and optimization suggestions</p>
                </a>
                <a href="test-summary.json" class="link-card">
                    <h4>📄 Raw Data (JSON)</h4>
                    <p>Machine-readable test results and metrics for further analysis</p>
                </a>
            </div>
        </div>

        <div class="footer">
            <p>🚀 Generated by CarBot Mobile & Performance Test Suite</p>
            <p>For technical support, contact the development team</p>
        </div>
    </div>

    <script>
        // Animate score bars on load
        document.addEventListener('DOMContentLoaded', function() {
            const scoreFills = document.querySelectorAll('.score-fill');
            scoreFills.forEach(fill => {
                const width = fill.style.width;
                fill.style.width = '0%';
                setTimeout(() => {
                    fill.style.width = width;
                }, 500);
            });
        });
    </script>
</body>
</html>`;

  const summaryPath = path.join(CONFIG.reportsDir, 'index.html');
  await fs.writeFile(summaryPath, htmlContent);
}

function printResults(summary) {
  logHeader('Test Results Summary');
  
  log(`🌐 Test URL: ${summary.testUrl}`, 'cyan');
  log(`⏰ Generated: ${new Date(summary.generatedAt).toLocaleString()}`, 'dim');
  
  logSection('Mobile Tests');
  log(`Total Tests: ${summary.mobileTests.totalTests}`, 'blue');
  log(`✅ Passed: ${summary.mobileTests.passed}`, 'green');
  if (summary.mobileTests.failed > 0) {
    log(`❌ Failed: ${summary.mobileTests.failed}`, 'red');
  }
  
  logSection('Lighthouse Performance');
  log(`Total Audits: ${summary.lighthouseTests.totalTests}`, 'blue');
  log(`✅ Passed: ${summary.lighthouseTests.passed}`, 'green');
  if (summary.lighthouseTests.failed > 0) {
    log(`❌ Failed: ${summary.lighthouseTests.failed}`, 'red');
  }
  
  if (summary.performanceScores.performance) {
    logSection('Average Scores');
    Object.entries(summary.performanceScores).forEach(([category, score]) => {
      const rounded = Math.round(score);
      const color = rounded >= 90 ? 'green' : rounded >= 70 ? 'yellow' : 'red';
      log(`${category}: ${rounded}/100`, color);
    });
  }
  
  if (summary.recommendations.length > 0) {
    logSection('Top Recommendations');
    summary.recommendations.slice(0, 3).forEach(rec => {
      const color = rec.priority === 'High' ? 'red' : 'yellow';
      log(`${rec.priority}: ${rec.issue} (${rec.percentage})`, color);
    });
  }
  
  logSection('Reports Generated');
  log(`📱 Mobile Report: ${CONFIG.reportsDir}/mobile-tests/index.html`, 'cyan');
  log(`🔍 Lighthouse Report: ${CONFIG.reportsDir}/lighthouse-tests/index.html`, 'cyan');
  log(`📊 Performance Dashboard: ${CONFIG.reportsDir}/performance-report.html`, 'cyan');
  log(`📋 Summary Report: ${CONFIG.reportsDir}/index.html`, 'cyan');
}

async function main() {
  const startTime = Date.now();
  
  try {
    logHeader('CarBot Mobile & Performance Testing Suite');
    
    log(`📱 Testing URL: ${CONFIG.testUrl}`, 'cyan');
    log(`🔧 Workers: ${CONFIG.workers}`, 'dim');
    log(`👁️ Headless: ${CONFIG.headless}`, 'dim');
    
    // Setup
    await ensureDirectories();
    await checkDependencies();
    
    // Run tests
    await runMobilePerformanceTests();
    await runLighthouseTests();
    
    // Generate reports
    const summary = await generateSummaryReport();
    
    // Print results
    printResults(summary);
    
    const totalTime = ((Date.now() - startTime) / 1000).toFixed(2);
    logHeader(`Testing Complete in ${totalTime}s`);
    
    log('🎉 All tests completed successfully!', 'green');
    log(`📊 View summary report: ${CONFIG.reportsDir}/index.html`, 'cyan');
    
    process.exit(0);
    
  } catch (error) {
    log(`❌ Testing failed: ${error.message}`, 'red');
    console.error(error);
    process.exit(1);
  }
}

// Handle command line arguments
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`
🚗 CarBot Mobile & Performance Test Runner

Usage: node run-mobile-performance-tests.js [options]

Options:
  --url <url>        Test URL (default: http://localhost:3000)
  --workers <n>      Number of test workers (default: 1)
  --headed          Run tests with browser UI (default: headless)
  --help            Show this help message

Environment Variables:
  TEST_URL          Override test URL
  TEST_WORKERS      Override worker count
  HEADLESS          Set to 'false' for headed mode

Examples:
  node run-mobile-performance-tests.js --url https://carbot.chat
  node run-mobile-performance-tests.js --workers 2 --headed
  TEST_URL=https://staging.carbot.chat node run-mobile-performance-tests.js
`);
  process.exit(0);
}

// Parse command line arguments
const urlIndex = process.argv.indexOf('--url');
if (urlIndex !== -1 && process.argv[urlIndex + 1]) {
  CONFIG.testUrl = process.argv[urlIndex + 1];
}

const workersIndex = process.argv.indexOf('--workers');
if (workersIndex !== -1 && process.argv[workersIndex + 1]) {
  CONFIG.workers = process.argv[workersIndex + 1];
}

if (process.argv.includes('--headed')) {
  CONFIG.headless = false;
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { main, CONFIG };