/**
 * Lighthouse Performance Testing with Playwright
 * Automated performance auditing for CarBot
 */

const { test, expect } = require('@playwright/test');
const { playAudit } = require('playwright-lighthouse');
const lighthouse = require('lighthouse');
const fs = require('fs').promises;
const path = require('path');

// Performance thresholds for Lighthouse scores
const LIGHTHOUSE_THRESHOLDS = {
  performance: 90,
  accessibility: 95,
  bestPractices: 90,
  seo: 90,
  pwa: 90
};

// Core Web Vitals thresholds (in milliseconds or scores)
const CORE_WEB_VITALS_THRESHOLDS = {
  'largest-contentful-paint': 2500,
  'first-input-delay': 100,
  'cumulative-layout-shift': 0.1,
  'first-contentful-paint': 1800,
  'speed-index': 3400,
  'total-blocking-time': 200,
  'time-to-first-byte': 600
};

// Pages to audit
const PAGES_TO_AUDIT = [
  { name: 'Homepage', url: '/' },
  { name: 'Pricing', url: '/pricing' },
  { name: 'Dashboard', url: '/dashboard' },
  { name: 'Login', url: '/auth/login' },
  { name: 'Register', url: '/auth/register' },
  { name: 'Blog', url: '/blog' }
];

// Device configurations for mobile testing
const DEVICES = [
  { name: 'Desktop', formFactor: 'desktop', screenEmulation: { mobile: false, width: 1350, height: 940 } },
  { name: 'Mobile', formFactor: 'mobile', screenEmulation: { mobile: true, width: 375, height: 667 } },
  { name: 'Tablet', formFactor: 'desktop', screenEmulation: { mobile: false, width: 768, height: 1024 } }
];

// Network throttling configurations
const NETWORK_CONDITIONS = [
  { name: 'Fast4G', preset: 'fast4G' },
  { name: 'Slow4G', preset: 'slow4G' },
  { name: '3G', preset: '3G' }
];

let performanceResults = [];

test.describe('Lighthouse Performance Audits', () => {
  
  test.beforeAll(async () => {
    // Create reports directory
    const reportsDir = path.join(__dirname, '..', 'performance-reports');
    try {
      await fs.mkdir(reportsDir, { recursive: true });
    } catch (error) {
      console.log('Reports directory already exists');
    }
  });

  // Test each page on different devices and network conditions
  PAGES_TO_AUDIT.forEach(page => {
    DEVICES.forEach(device => {
      NETWORK_CONDITIONS.forEach(network => {
        test(`${page.name} - ${device.name} - ${network.name}`, async ({ page: playwright }) => {
          const startTime = Date.now();
          
          try {
            // Configure Lighthouse options
            const lighthouseConfig = {
              extends: 'lighthouse:default',
              settings: {
                formFactor: device.formFactor,
                screenEmulation: device.screenEmulation,
                throttling: {
                  rttMs: network.preset === '3G' ? 150 : network.preset === 'slow4G' ? 150 : 40,
                  throughputKbps: network.preset === '3G' ? 1600 : network.preset === 'slow4G' ? 1600 : 10000,
                  cpuSlowdownMultiplier: network.preset === '3G' ? 4 : network.preset === 'slow4G' ? 4 : 1
                },
                onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo', 'pwa']
              }
            };

            // Navigate to page
            const response = await playwright.goto(page.url);
            expect(response.ok()).toBeTruthy();

            // Run Lighthouse audit
            const { lhr } = await playAudit({
              page: playwright,
              config: lighthouseConfig,
              port: 9222
            });

            const testResult = {
              page: page.name,
              url: page.url,
              device: device.name,
              network: network.name,
              timestamp: new Date().toISOString(),
              loadTime: Date.now() - startTime,
              scores: {
                performance: Math.round(lhr.categories.performance.score * 100),
                accessibility: Math.round(lhr.categories.accessibility.score * 100),
                bestPractices: Math.round(lhr.categories['best-practices'].score * 100),
                seo: Math.round(lhr.categories.seo.score * 100),
                pwa: lhr.categories.pwa ? Math.round(lhr.categories.pwa.score * 100) : 0
              },
              metrics: {},
              audits: {}
            };

            // Extract Core Web Vitals
            Object.keys(CORE_WEB_VITALS_THRESHOLDS).forEach(metric => {
              if (lhr.audits[metric]) {
                testResult.metrics[metric] = {
                  value: lhr.audits[metric].numericValue,
                  displayValue: lhr.audits[metric].displayValue,
                  score: lhr.audits[metric].score
                };
              }
            });

            // Extract important audits
            [
              'unused-css-rules',
              'unused-javascript',
              'render-blocking-resources',
              'unminified-css',
              'unminified-javascript',
              'efficient-animated-content',
              'offscreen-images',
              'uses-webp-images',
              'uses-optimized-images',
              'uses-text-compression',
              'uses-responsive-images',
              'server-response-time',
              'redirects',
              'dom-size',
              'critical-request-chains',
              'user-timings',
              'bootup-time',
              'mainthread-work-breakdown',
              'third-party-summary'
            ].forEach(auditId => {
              if (lhr.audits[auditId]) {
                testResult.audits[auditId] = {
                  score: lhr.audits[auditId].score,
                  numericValue: lhr.audits[auditId].numericValue,
                  displayValue: lhr.audits[auditId].displayValue,
                  title: lhr.audits[auditId].title,
                  description: lhr.audits[auditId].description
                };
              }
            });

            performanceResults.push(testResult);

            // Log results
            console.log(`\n🎯 ${page.name} - ${device.name} - ${network.name} Results:`);
            console.log(`📊 Performance: ${testResult.scores.performance}/100`);
            console.log(`♿ Accessibility: ${testResult.scores.accessibility}/100`);
            console.log(`✅ Best Practices: ${testResult.scores.bestPractices}/100`);
            console.log(`🔍 SEO: ${testResult.scores.seo}/100`);
            console.log(`📱 PWA: ${testResult.scores.pwa}/100`);
            
            if (testResult.metrics['largest-contentful-paint']) {
              console.log(`🎨 LCP: ${testResult.metrics['largest-contentful-paint'].displayValue}`);
            }
            if (testResult.metrics['cumulative-layout-shift']) {
              console.log(`📏 CLS: ${testResult.metrics['cumulative-layout-shift'].displayValue}`);
            }
            if (testResult.metrics['total-blocking-time']) {
              console.log(`⏱️ TBT: ${testResult.metrics['total-blocking-time'].displayValue}`);
            }

            // Performance assertions
            expect(testResult.scores.performance).toBeGreaterThanOrEqual(
              device.name === 'Mobile' && network.name === '3G' ? 70 : LIGHTHOUSE_THRESHOLDS.performance
            );
            expect(testResult.scores.accessibility).toBeGreaterThanOrEqual(LIGHTHOUSE_THRESHOLDS.accessibility);
            expect(testResult.scores.bestPractices).toBeGreaterThanOrEqual(LIGHTHOUSE_THRESHOLDS.bestPractices);
            expect(testResult.scores.seo).toBeGreaterThanOrEqual(LIGHTHOUSE_THRESHOLDS.seo);

            // Core Web Vitals assertions
            if (testResult.metrics['largest-contentful-paint']) {
              const lcpThreshold = device.name === 'Mobile' && network.name === '3G' ? 4000 : CORE_WEB_VITALS_THRESHOLDS['largest-contentful-paint'];
              expect(testResult.metrics['largest-contentful-paint'].value).toBeLessThanOrEqual(lcpThreshold);
            }

            if (testResult.metrics['cumulative-layout-shift']) {
              expect(testResult.metrics['cumulative-layout-shift'].value).toBeLessThanOrEqual(CORE_WEB_VITALS_THRESHOLDS['cumulative-layout-shift']);
            }

            // Save individual report
            const reportPath = path.join(__dirname, '..', 'performance-reports', 
              `${page.name.toLowerCase()}-${device.name.toLowerCase()}-${network.name.toLowerCase()}.json`);
            await fs.writeFile(reportPath, JSON.stringify(testResult, null, 2));

          } catch (error) {
            console.error(`❌ Error auditing ${page.name} - ${device.name} - ${network.name}:`, error);
            throw error;
          }
        });
      });
    });
  });
});

// Bundle analysis test
test.describe('Bundle Analysis', () => {
  test('JavaScript bundle size analysis', async ({ page }) => {
    await page.goto('/');

    // Get all script tags
    const scripts = await page.evaluate(() => {
      const scriptTags = Array.from(document.querySelectorAll('script[src]'));
      return scriptTags.map(script => ({
        src: script.src,
        async: script.async,
        defer: script.defer,
        type: script.type
      }));
    });

    console.log('\n📦 JavaScript Bundles:');
    let totalSize = 0;

    for (const script of scripts) {
      if (script.src.includes('/_next/static/')) {
        try {
          const response = await page.request.get(script.src);
          const content = await response.text();
          const size = new Blob([content]).size;
          totalSize += size;
          
          console.log(`  ${script.src.split('/').pop()}: ${(size / 1024).toFixed(2)}KB`);
        } catch (error) {
          console.log(`  ${script.src.split('/').pop()}: Failed to fetch`);
        }
      }
    }

    console.log(`📊 Total JS Bundle Size: ${(totalSize / 1024).toFixed(2)}KB`);
    
    // Bundle size should be reasonable
    expect(totalSize).toBeLessThan(500 * 1024); // 500KB threshold
  });

  test('CSS bundle size analysis', async ({ page }) => {
    await page.goto('/');

    // Get all stylesheet links
    const stylesheets = await page.evaluate(() => {
      const linkTags = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
      return linkTags.map(link => link.href);
    });

    console.log('\n🎨 CSS Bundles:');
    let totalSize = 0;

    for (const stylesheet of stylesheets) {
      if (stylesheet.includes('/_next/static/') || stylesheet.includes('/globals.css')) {
        try {
          const response = await page.request.get(stylesheet);
          const content = await response.text();
          const size = new Blob([content]).size;
          totalSize += size;
          
          console.log(`  ${stylesheet.split('/').pop()}: ${(size / 1024).toFixed(2)}KB`);
        } catch (error) {
          console.log(`  ${stylesheet.split('/').pop()}: Failed to fetch`);
        }
      }
    }

    console.log(`📊 Total CSS Bundle Size: ${(totalSize / 1024).toFixed(2)}KB`);
    
    // CSS bundle size should be reasonable
    expect(totalSize).toBeLessThan(100 * 1024); // 100KB threshold
  });

  test('Image optimization analysis', async ({ page }) => {
    await page.goto('/');

    const images = await page.evaluate(() => {
      const imgTags = Array.from(document.querySelectorAll('img'));
      return imgTags.map(img => ({
        src: img.src,
        width: img.naturalWidth,
        height: img.naturalHeight,
        displayWidth: img.clientWidth,
        displayHeight: img.clientHeight,
        alt: img.alt,
        loading: img.loading
      }));
    });

    console.log('\n🖼️ Image Analysis:');
    
    for (const img of images) {
      console.log(`  ${img.src.split('/').pop()}:`);
      console.log(`    Natural: ${img.width}x${img.height}`);
      console.log(`    Display: ${img.displayWidth}x${img.displayHeight}`);
      console.log(`    Alt text: ${img.alt ? '✅' : '❌'}`);
      console.log(`    Lazy loading: ${img.loading === 'lazy' ? '✅' : '❌'}`);
      
      // Check for oversized images
      if (img.width > img.displayWidth * 2 || img.height > img.displayHeight * 2) {
        console.log(`    ⚠️ Image may be oversized`);
      }
      
      // Ensure alt text exists
      expect(img.alt).toBeTruthy();
    }
  });
});

// Generate comprehensive report
test.afterAll(async () => {
  if (performanceResults.length === 0) return;

  console.log('\n📊 Generating Performance Report...');

  // Calculate averages
  const averages = {
    performance: performanceResults.reduce((sum, result) => sum + result.scores.performance, 0) / performanceResults.length,
    accessibility: performanceResults.reduce((sum, result) => sum + result.scores.accessibility, 0) / performanceResults.length,
    bestPractices: performanceResults.reduce((sum, result) => sum + result.scores.bestPractices, 0) / performanceResults.length,
    seo: performanceResults.reduce((sum, result) => sum + result.scores.seo, 0) / performanceResults.length,
    pwa: performanceResults.reduce((sum, result) => sum + result.scores.pwa, 0) / performanceResults.length
  };

  // Find best and worst performing pages
  const bestPerforming = performanceResults.reduce((best, current) => 
    current.scores.performance > best.scores.performance ? current : best
  );
  
  const worstPerforming = performanceResults.reduce((worst, current) => 
    current.scores.performance < worst.scores.performance ? current : worst
  );

  // Create comprehensive report
  const report = {
    generatedAt: new Date().toISOString(),
    summary: {
      totalTests: performanceResults.length,
      averageScores: averages,
      bestPerforming: {
        page: bestPerforming.page,
        device: bestPerforming.device,
        network: bestPerforming.network,
        score: bestPerforming.scores.performance
      },
      worstPerforming: {
        page: worstPerforming.page,
        device: worstPerforming.device,
        network: worstPerforming.network,
        score: worstPerforming.scores.performance
      }
    },
    results: performanceResults,
    recommendations: generateRecommendations(performanceResults)
  };

  // Save comprehensive report
  const reportPath = path.join(__dirname, '..', 'performance-reports', 'comprehensive-performance-report.json');
  await fs.writeFile(reportPath, JSON.stringify(report, null, 2));

  // Generate HTML report
  await generateHTMLReport(report);

  console.log('\n🎉 Performance Testing Complete!');
  console.log(`📊 Average Scores:`);
  console.log(`   Performance: ${averages.performance.toFixed(1)}/100`);
  console.log(`   Accessibility: ${averages.accessibility.toFixed(1)}/100`);
  console.log(`   Best Practices: ${averages.bestPractices.toFixed(1)}/100`);
  console.log(`   SEO: ${averages.seo.toFixed(1)}/100`);
  console.log(`   PWA: ${averages.pwa.toFixed(1)}/100`);
  console.log(`\n📈 Best: ${bestPerforming.page} (${bestPerforming.device}, ${bestPerforming.network}) - ${bestPerforming.scores.performance}/100`);
  console.log(`📉 Worst: ${worstPerforming.page} (${worstPerforming.device}, ${worstPerforming.network}) - ${worstPerforming.scores.performance}/100`);
  console.log(`\n📁 Reports saved in: ${path.join(__dirname, '..', 'performance-reports')}`);
});

function generateRecommendations(results) {
  const recommendations = [];
  
  // Analyze common issues
  const commonIssues = {};
  results.forEach(result => {
    Object.keys(result.audits).forEach(auditId => {
      if (result.audits[auditId].score !== null && result.audits[auditId].score < 0.9) {
        commonIssues[auditId] = (commonIssues[auditId] || 0) + 1;
      }
    });
  });

  // Generate recommendations based on most common issues
  const sortedIssues = Object.entries(commonIssues)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  sortedIssues.forEach(([auditId, count]) => {
    const percentage = (count / results.length * 100).toFixed(1);
    recommendations.push({
      priority: count > results.length * 0.5 ? 'High' : 'Medium',
      issue: auditId,
      affectedTests: count,
      percentage: `${percentage}%`,
      description: getAuditDescription(auditId)
    });
  });

  return recommendations;
}

function getAuditDescription(auditId) {
  const descriptions = {
    'unused-css-rules': 'Remove unused CSS rules to reduce bundle size',
    'unused-javascript': 'Remove unused JavaScript code to improve performance',
    'render-blocking-resources': 'Eliminate render-blocking resources to improve LCP',
    'unminified-css': 'Minify CSS files to reduce file size',
    'unminified-javascript': 'Minify JavaScript files to reduce file size',
    'offscreen-images': 'Defer loading of offscreen images',
    'uses-webp-images': 'Use WebP format for better image compression',
    'uses-optimized-images': 'Optimize images to reduce file size',
    'server-response-time': 'Improve server response times',
    'dom-size': 'Reduce DOM size to improve rendering performance'
  };
  
  return descriptions[auditId] || `Improve ${auditId} audit score`;
}

async function generateHTMLReport(report) {
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <title>CarBot Performance Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; }
        .container { background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { text-align: center; margin-bottom: 30px; }
        .score { display: inline-block; margin: 10px; padding: 20px; border-radius: 8px; text-align: center; min-width: 100px; }
        .score.good { background: #0cce6b; color: white; }
        .score.average { background: #ffa400; color: white; }
        .score.poor { background: #ff4e42; color: white; }
        .results-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .results-table th, .results-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        .results-table th { background: #f2f2f2; }
        .recommendations { margin: 30px 0; }
        .recommendation { background: #f9f9f9; padding: 15px; margin: 10px 0; border-left: 4px solid #007cba; }
        .recommendation.high { border-left-color: #ff4e42; }
        .recommendation.medium { border-left-color: #ffa400; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚗 CarBot Performance Report</h1>
            <p>Generated: ${report.generatedAt}</p>
            <p>Total Tests: ${report.summary.totalTests}</p>
        </div>

        <h2>📊 Average Scores</h2>
        <div>
            ${Object.entries(report.summary.averageScores).map(([category, score]) => {
              const scoreClass = score >= 90 ? 'good' : score >= 70 ? 'average' : 'poor';
              return `<div class="score ${scoreClass}">
                <h3>${category}</h3>
                <div>${score.toFixed(1)}/100</div>
              </div>`;
            }).join('')}
        </div>

        <h2>🏆 Best vs Worst Performing</h2>
        <table class="results-table">
            <tr>
                <th>Metric</th>
                <th>Best</th>
                <th>Worst</th>
            </tr>
            <tr>
                <td><strong>Page</strong></td>
                <td>${report.summary.bestPerforming.page} (${report.summary.bestPerforming.device}, ${report.summary.bestPerforming.network})</td>
                <td>${report.summary.worstPerforming.page} (${report.summary.worstPerforming.device}, ${report.summary.worstPerforming.network})</td>
            </tr>
            <tr>
                <td><strong>Performance Score</strong></td>
                <td class="score good">${report.summary.bestPerforming.score}/100</td>
                <td class="score poor">${report.summary.worstPerforming.score}/100</td>
            </tr>
        </table>

        <h2>💡 Recommendations</h2>
        <div class="recommendations">
            ${report.recommendations.map(rec => `
              <div class="recommendation ${rec.priority.toLowerCase()}">
                <h4>${rec.priority} Priority: ${rec.issue}</h4>
                <p>${rec.description}</p>
                <small>Affects ${rec.affectedTests} tests (${rec.percentage})</small>
              </div>
            `).join('')}
        </div>

        <h2>📋 Detailed Results</h2>
        <table class="results-table">
            <thead>
                <tr>
                    <th>Page</th>
                    <th>Device</th>
                    <th>Network</th>
                    <th>Performance</th>
                    <th>Accessibility</th>
                    <th>Best Practices</th>
                    <th>SEO</th>
                    <th>PWA</th>
                </tr>
            </thead>
            <tbody>
                ${report.results.map(result => `
                  <tr>
                    <td>${result.page}</td>
                    <td>${result.device}</td>
                    <td>${result.network}</td>
                    <td class="score ${result.scores.performance >= 90 ? 'good' : result.scores.performance >= 70 ? 'average' : 'poor'}">${result.scores.performance}</td>
                    <td class="score ${result.scores.accessibility >= 90 ? 'good' : result.scores.accessibility >= 70 ? 'average' : 'poor'}">${result.scores.accessibility}</td>
                    <td class="score ${result.scores.bestPractices >= 90 ? 'good' : result.scores.bestPractices >= 70 ? 'average' : 'poor'}">${result.scores.bestPractices}</td>
                    <td class="score ${result.scores.seo >= 90 ? 'good' : result.scores.seo >= 70 ? 'average' : 'poor'}">${result.scores.seo}</td>
                    <td class="score ${result.scores.pwa >= 90 ? 'good' : result.scores.pwa >= 70 ? 'average' : 'poor'}">${result.scores.pwa}</td>
                  </tr>
                `).join('')}
            </tbody>
        </table>
    </div>
</body>
</html>`;

  const htmlPath = path.join(__dirname, '..', 'performance-reports', 'performance-report.html');
  await fs.writeFile(htmlPath, htmlContent);
}