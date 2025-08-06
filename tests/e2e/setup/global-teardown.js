/**
 * Global Teardown for CarBot E2E Tests
 * Cleans up test data and generates test reports
 */

const fs = require('fs').promises;
const path = require('path');
const { DatabaseHelper } = require('../utils/database-helper');

async function globalTeardown(config) {
  console.log('🧹 Starting CarBot E2E Test Global Teardown...');

  const dbHelper = new DatabaseHelper();

  try {
    // 1. Clean up test data from database
    console.log('🗑️ Cleaning up test data...');
    await dbHelper.cleanupTestData();

    // 2. Clean up authentication states
    console.log('🔐 Cleaning up auth states...');
    await cleanupAuthStates();

    // 3. Generate test summary report
    console.log('📊 Generating test summary...');
    await generateTestSummary();

    // 4. Archive test artifacts if on CI
    if (process.env.CI) {
      console.log('📦 Archiving test artifacts...');
      await archiveTestArtifacts();
    }

    console.log('✅ Global teardown completed successfully!');

  } catch (error) {
    console.error('❌ Global teardown failed:', error);
    // Don't throw - we don't want teardown failures to fail the build
  }
}

async function cleanupAuthStates() {
  try {
    const authStatesDir = 'tests/e2e/fixtures/auth-states';
    const files = await fs.readdir(authStatesDir);
    
    for (const file of files) {
      if (file.endsWith('-auth.json')) {
        await fs.unlink(path.join(authStatesDir, file));
      }
    }
    
    console.log('✅ Authentication states cleaned up');
  } catch (error) {
    console.error('⚠️ Failed to cleanup auth states:', error);
  }
}

async function generateTestSummary() {
  try {
    const resultsFile = 'test-results/e2e-results.json';
    
    // Check if results file exists
    try {
      const results = JSON.parse(await fs.readFile(resultsFile, 'utf8'));
      
      const summary = {
        timestamp: new Date().toISOString(),
        totalTests: results.tests?.length || 0,
        passed: results.tests?.filter(t => t.outcome === 'passed').length || 0,
        failed: results.tests?.filter(t => t.outcome === 'failed').length || 0,
        skipped: results.tests?.filter(t => t.outcome === 'skipped').length || 0,
        duration: results.duration || 0,
        environment: process.env.NODE_ENV || 'test',
        baseURL: process.env.BASE_URL || 'http://localhost:3000'
      };

      await fs.writeFile(
        'test-results/e2e-summary.json',
        JSON.stringify(summary, null, 2)
      );

      console.log('📊 Test Summary:');
      console.log(`   Total Tests: ${summary.totalTests}`);
      console.log(`   Passed: ${summary.passed}`);
      console.log(`   Failed: ${summary.failed}`);
      console.log(`   Skipped: ${summary.skipped}`);
      console.log(`   Duration: ${(summary.duration / 1000).toFixed(2)}s`);

    } catch (error) {
      console.log('⚠️ No test results found to summarize');
    }

  } catch (error) {
    console.error('⚠️ Failed to generate test summary:', error);
  }
}

async function archiveTestArtifacts() {
  try {
    const artifactDirs = [
      'test-results',
      'playwright-report',
      'test-artifacts'
    ];

    for (const dir of artifactDirs) {
      try {
        await fs.access(dir);
        console.log(`📦 Archiving ${dir}...`);
        // In a real CI environment, you would upload to artifact storage here
      } catch {
        // Directory doesn't exist, skip
      }
    }

  } catch (error) {
    console.error('⚠️ Failed to archive test artifacts:', error);
  }
}

module.exports = globalTeardown;