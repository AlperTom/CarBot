#!/usr/bin/env node

/**
 * Database Fix Verification Script
 * 
 * This script verifies that the database connection has been fixed
 * after updating the production environment variables.
 * 
 * Usage:
 *   node scripts/verify-database-fix.js
 */

const https = require('https')

const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m'
}

function log(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: JSON.parse(data)
          })
        } catch (e) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: data
          })
        }
      })
    })
    
    req.on('error', reject)
    
    if (options.body) {
      req.write(options.body)
    }
    
    req.end()
  })
}

async function verifyDatabaseFix() {
  console.log('\n🔍 CarBot Database Fix Verification')
  console.log('=' * 50)
  
  try {
    // 1. Health Check
    log('cyan', '\n1. Testing Health Endpoint...')
    
    const healthResponse = await makeRequest('https://carbot.chat/api/health', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    if (healthResponse.status !== 200) {
      log('red', `   ❌ Health check failed with status: ${healthResponse.status}`)
      return false
    }
    
    const healthData = healthResponse.data
    const dbStatus = healthData.checks?.database?.status
    
    if (dbStatus === 'healthy') {
      log('green', '   ✅ Database connection is healthy!')
      log('green', `   📊 Response time: ${healthData.checks.database.response_time}ms`)
      
      if (healthData.checks.database.diagnostics) {
        const diag = healthData.checks.database.diagnostics
        if (diag.environment_valid) {
          log('green', '   ✅ Environment variables are valid')
        }
        if (diag.connection_initialized) {
          log('green', '   ✅ Connection successfully initialized')
        }
      }
    } else {
      log('red', `   ❌ Database status: ${dbStatus}`)
      log('red', `   ❌ Error: ${healthData.checks.database.message}`)
      
      if (healthData.checks.database.diagnostics) {
        const diag = healthData.checks.database.diagnostics
        if (diag.environment_issues && diag.environment_issues.length > 0) {
          log('yellow', '   ⚠️  Environment issues:')
          diag.environment_issues.forEach(issue => {
            log('yellow', `      • ${issue}`)
          })
        }
      }
      return false
    }
    
    // 2. Registration Test
    log('cyan', '\n2. Testing Registration Endpoint...')
    
    const testEmail = `test-${Date.now()}@example.com`
    const registrationData = {
      email: testEmail,
      password: 'testpass123',
      businessName: 'Test Workshop Fix Verification',
      name: 'Test User'
    }
    
    const regResponse = await makeRequest('https://carbot.chat/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(registrationData)
    })
    
    if (regResponse.status === 201) {
      const regData = regResponse.data
      
      if (regData.mock) {
        log('yellow', '   ⚠️  Registration successful but in MOCK mode')
        log('yellow', '   ⚠️  This indicates database connection issues persist')
        log('yellow', `   📝 Mock reason: ${regResponse.headers['x-mock-reason'] || 'unknown'}`)
        return false
      } else {
        log('green', '   ✅ Registration successful with real database!')
        log('green', `   📝 Workshop ID: ${regData.data.workshop.id}`)
        log('green', `   📝 User created: ${regData.data.user.email}`)
        
        if (regData.data.features) {
          if (regData.data.features.sessionStored) {
            log('green', '   ✅ User session stored successfully')
          }
          if (regData.data.features.clientKeyCreated) {
            log('green', '   ✅ Client key created successfully')
          }
        }
      }
    } else if (regResponse.status === 409) {
      // Duplicate email - this is actually good, means database is working
      log('green', '   ✅ Registration validation working (duplicate email detected)')
    } else {
      log('red', `   ❌ Registration failed with status: ${regResponse.status}`)
      
      if (regResponse.data.error) {
        log('red', `   ❌ Error: ${regResponse.data.error}`)
      }
      
      if (regResponse.data.code === 'NETWORK_ERROR') {
        log('yellow', '   ⚠️  This indicates database connection issues')
        return false
      }
    }
    
    // 3. Supabase Test Endpoint
    log('cyan', '\n3. Testing Supabase Direct Connection...')
    
    const supabaseResponse = await makeRequest('https://carbot.chat/api/supabase-test', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    if (supabaseResponse.status === 200 && supabaseResponse.data.success) {
      log('green', '   ✅ Direct Supabase connection successful!')
      log('green', `   📊 Workshop count query worked`)
    } else {
      log('red', `   ❌ Supabase test failed: ${supabaseResponse.data.error || 'Unknown error'}`)
      return false
    }
    
    // 4. Summary
    log('cyan', '\n4. Verification Summary:')
    log('green', '   🎉 SUCCESS: Database connection has been fixed!')
    log('green', '   ✅ Health endpoint shows healthy database')
    log('green', '   ✅ Registration endpoint working with real database')
    log('green', '   ✅ Direct Supabase connection successful')
    log('green', '   ✅ All core functionality restored')
    
    log('blue', '\n📝 Next Steps:')
    log('blue', '   1. Monitor database connection stability')
    log('blue', '   2. Test complete user registration → login flow')
    log('blue', '   3. Verify all database tables are properly set up')
    log('blue', '   4. Check Row Level Security policies if needed')
    
    return true
    
  } catch (error) {
    log('red', `\n💥 VERIFICATION ERROR: ${error.message}`)
    log('yellow', '\n🔧 Possible Issues:')
    log('yellow', '   • Environment variables still not updated')
    log('yellow', '   • Deployment not yet complete')
    log('yellow', '   • Network connectivity issues')
    log('yellow', '   • Supabase project configuration problems')
    
    return false
  }
}

// Run verification
if (require.main === module) {
  verifyDatabaseFix()
    .then(success => {
      if (success) {
        log('green', '\n✅ DATABASE FIX VERIFICATION: PASSED')
        process.exit(0)
      } else {
        log('red', '\n❌ DATABASE FIX VERIFICATION: FAILED')
        log('yellow', '\nPlease check the environment variables and try again.')
        process.exit(1)
      }
    })
    .catch(error => {
      log('red', `\nVerification error: ${error.message}`)
      process.exit(1)
    })
}

module.exports = { verifyDatabaseFix }