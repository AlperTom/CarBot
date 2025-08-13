#!/usr/bin/env node
/**
 * Production API Testing Script for CarBot
 * Tests critical endpoints after deployment to verify fixes
 */

const https = require('https');
const http = require('http');

const PRODUCTION_URL = 'https://carbot.chat';
const LOCAL_URL = 'http://localhost:3000';

// Test configuration
const TEST_CONFIG = {
  timeout: 10000,
  retries: 3,
  testUser: {
    email: `test-${Date.now()}@example.com`,
    password: 'SecureTestPassword123!',
    businessName: 'Test Auto Workshop',
    name: 'Test User',
    templateType: 'klassische'
  }
};

class ProductionTester {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
    this.results = [];
    this.isHttps = baseUrl.startsWith('https:');
  }

  async makeRequest(method, path, data = null) {
    return new Promise((resolve, reject) => {
      const url = new URL(path, this.baseUrl);
      const requestLib = this.isHttps ? https : http;
      
      const options = {
        hostname: url.hostname,
        port: url.port || (this.isHttps ? 443 : 80),
        path: url.pathname + url.search,
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'CarBot-Production-Tester/1.0'
        },
        timeout: TEST_CONFIG.timeout
      };

      if (data) {
        const jsonData = JSON.stringify(data);
        options.headers['Content-Length'] = Buffer.byteLength(jsonData);
      }

      const req = requestLib.request(options, (res) => {
        let responseData = '';
        
        res.on('data', (chunk) => {
          responseData += chunk;
        });

        res.on('end', () => {
          try {
            const parsed = responseData ? JSON.parse(responseData) : {};
            resolve({
              statusCode: res.statusCode,
              headers: res.headers,
              data: parsed,
              raw: responseData
            });
          } catch (parseError) {
            resolve({
              statusCode: res.statusCode,
              headers: res.headers,
              data: {},
              raw: responseData,
              parseError: parseError.message
            });
          }
        });
      });

      req.on('error', (error) => {
        reject(error);
      });

      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Request timeout'));
      });

      if (data) {
        req.write(JSON.stringify(data));
      }

      req.end();
    });
  }

  async testHealthEndpoint() {
    console.log('🏥 Testing Health Endpoint...');
    
    try {
      const response = await this.makeRequest('GET', '/api/health');
      const isHealthy = response.statusCode === 200 && response.data.status === 'healthy';
      
      this.results.push({
        test: 'Health Check',
        status: isHealthy ? 'PASS' : 'FAIL',
        details: {
          statusCode: response.statusCode,
          status: response.data.status || 'unknown',
          jwtCheck: response.data.checks?.authentication?.status || 'missing',
          dbCheck: response.data.checks?.database?.status || 'missing',
          envVars: response.data.checks?.environment?.status || 'missing',
          missingVars: response.data.checks?.environment?.missing_variables || []
        }
      });

      if (isHealthy) {
        console.log('✅ Health endpoint is working correctly');
        console.log(`   - JWT Auth: ${response.data.checks?.authentication?.status || 'unknown'}`);
        console.log(`   - Database: ${response.data.checks?.database?.status || 'unknown'}`);
        console.log(`   - Environment: ${response.data.checks?.environment?.status || 'unknown'}`);
      } else {
        console.log('❌ Health endpoint failed');
        console.log(`   - Status Code: ${response.statusCode}`);
        console.log(`   - Response: ${JSON.stringify(response.data, null, 2)}`);
      }

      return isHealthy;
    } catch (error) {
      console.log('❌ Health endpoint error:', error.message);
      this.results.push({
        test: 'Health Check',
        status: 'FAIL',
        details: { error: error.message }
      });
      return false;
    }
  }

  async testRegistrationEndpoint() {
    console.log('📝 Testing User Registration...');
    
    try {
      const response = await this.makeRequest('POST', '/api/auth/register', TEST_CONFIG.testUser);
      const isSuccess = response.statusCode === 201 && response.data.success === true;
      
      this.results.push({
        test: 'User Registration',
        status: isSuccess ? 'PASS' : 'FAIL',
        details: {
          statusCode: response.statusCode,
          success: response.data.success || false,
          error: response.data.error || null,
          hasTokens: !!(response.data.data?.tokens?.accessToken),
          authMethod: response.data.data?.authMethod || 'unknown'
        }
      });

      if (isSuccess) {
        console.log('✅ Registration endpoint working correctly');
        console.log(`   - User created with ID: ${response.data.data?.user?.id || 'unknown'}`);
        console.log(`   - Workshop created: ${response.data.data?.workshop?.name || 'unknown'}`);
        console.log(`   - Auth method: ${response.data.data?.authMethod || 'unknown'}`);
      } else {
        console.log('❌ Registration endpoint failed');
        console.log(`   - Status Code: ${response.statusCode}`);
        console.log(`   - Error: ${response.data.error || 'unknown'}`);
        console.log(`   - Response: ${JSON.stringify(response.data, null, 2)}`);
      }

      return isSuccess;
    } catch (error) {
      console.log('❌ Registration endpoint error:', error.message);
      this.results.push({
        test: 'User Registration',
        status: 'FAIL',
        details: { error: error.message }
      });
      return false;
    }
  }

  async testDatabaseConnectivity() {
    console.log('🗄️ Testing Database Connectivity...');
    
    try {
      // Test via health endpoint's database check
      const response = await this.makeRequest('GET', '/api/health');
      const dbHealthy = response.data.checks?.database?.status === 'healthy';
      
      this.results.push({
        test: 'Database Connectivity',
        status: dbHealthy ? 'PASS' : 'FAIL',
        details: {
          status: response.data.checks?.database?.status || 'unknown',
          responseTime: response.data.checks?.database?.response_time || 'unknown',
          message: response.data.checks?.database?.message || 'no message'
        }
      });

      if (dbHealthy) {
        console.log('✅ Database connectivity working');
        console.log(`   - Response time: ${response.data.checks?.database?.response_time || 'unknown'}`);
      } else {
        console.log('❌ Database connectivity failed');
        console.log(`   - Status: ${response.data.checks?.database?.status || 'unknown'}`);
        console.log(`   - Message: ${response.data.checks?.database?.message || 'no details'}`);
      }

      return dbHealthy;
    } catch (error) {
      console.log('❌ Database connectivity error:', error.message);
      this.results.push({
        test: 'Database Connectivity',
        status: 'FAIL',
        details: { error: error.message }
      });
      return false;
    }
  }

  async runAllTests() {
    console.log(`🚀 Starting Production API Tests for: ${this.baseUrl}\n`);
    
    const startTime = Date.now();
    
    // Run tests in sequence
    const healthOk = await this.testHealthEndpoint();
    console.log('');
    
    const dbOk = await this.testDatabaseConnectivity();
    console.log('');
    
    const registrationOk = await this.testRegistrationEndpoint();
    console.log('');
    
    const duration = Date.now() - startTime;
    const totalTests = this.results.length;
    const passedTests = this.results.filter(r => r.status === 'PASS').length;
    const failedTests = totalTests - passedTests;
    
    // Summary
    console.log('📊 TEST SUMMARY');
    console.log('================');
    console.log(`Total Tests: ${totalTests}`);
    console.log(`Passed: ${passedTests} ✅`);
    console.log(`Failed: ${failedTests} ❌`);
    console.log(`Duration: ${duration}ms`);
    console.log(`Success Rate: ${Math.round((passedTests / totalTests) * 100)}%`);
    console.log('');

    // Detailed results
    console.log('📝 DETAILED RESULTS');
    console.log('==================');
    this.results.forEach((result, index) => {
      const icon = result.status === 'PASS' ? '✅' : '❌';
      console.log(`${index + 1}. ${icon} ${result.test}: ${result.status}`);
      if (result.status === 'FAIL' || Object.keys(result.details).length > 0) {
        console.log(`   Details:`, JSON.stringify(result.details, null, 4));
      }
    });
    
    console.log('');
    
    // Critical issues
    if (failedTests > 0) {
      console.log('🚨 CRITICAL ISSUES DETECTED:');
      console.log('============================');
      
      if (!healthOk) {
        console.log('- Health endpoint failing - check environment variables');
      }
      if (!dbOk) {
        console.log('- Database connectivity issues - verify Supabase configuration');
      }
      if (!registrationOk) {
        console.log('- User registration broken - likely JWT_SECRET or database issue');
      }
      
      console.log('');
      console.log('🔧 RECOMMENDED ACTIONS:');
      console.log('1. Check Vercel environment variables');
      console.log('2. Verify JWT_SECRET is set correctly');
      console.log('3. Confirm Supabase keys are valid');
      console.log('4. Check deployment logs in Vercel');
    } else {
      console.log('🎉 ALL TESTS PASSED! Production is healthy.');
    }
    
    return passedTests === totalTests;
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  const target = args[0] || 'production';
  
  let baseUrl;
  switch (target.toLowerCase()) {
    case 'local':
    case 'dev':
      baseUrl = LOCAL_URL;
      break;
    case 'production':
    case 'prod':
    default:
      baseUrl = PRODUCTION_URL;
      break;
  }
  
  console.log(`🔍 Testing CarBot API at: ${baseUrl}`);
  console.log(`📅 Test run: ${new Date().toISOString()}`);
  console.log('');
  
  const tester = new ProductionTester(baseUrl);
  const success = await tester.runAllTests();
  
  // Exit with appropriate code
  process.exit(success ? 0 : 1);
}

// Error handling
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

// Help text
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log('CarBot Production API Tester');
  console.log('');
  console.log('Usage:');
  console.log('  node test-production-api.js [target]');
  console.log('');
  console.log('Targets:');
  console.log('  production, prod (default) - Test https://carbot.chat');
  console.log('  local, dev                 - Test http://localhost:3000');
  console.log('');
  console.log('Examples:');
  console.log('  node test-production-api.js production');
  console.log('  node test-production-api.js local');
  process.exit(0);
}

// Run tests
main().catch(error => {
  console.error('❌ Test runner failed:', error);
  process.exit(1);
});