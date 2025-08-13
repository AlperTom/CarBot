#!/usr/bin/env node

/**
 * Production Database Connection Tester
 * 
 * This script tests the database connection in production and provides
 * detailed diagnostics for troubleshooting.
 * 
 * Usage:
 *   node scripts/test-production-database.js
 *   
 * Environment Variables Required:
 *   - NEXT_PUBLIC_SUPABASE_URL
 *   - NEXT_PUBLIC_SUPABASE_ANON_KEY
 *   - SUPABASE_SERVICE_ROLE_KEY
 */

const { createClient } = require('@supabase/supabase-js')

// Color console output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m'
}

function log(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

async function testDatabaseConnection() {
  console.log('\n🔍 CarBot Production Database Connection Test')
  console.log('=' * 50)
  
  try {
    // 1. Environment Variable Check
    log('cyan', '\n1. Environment Variables Check:')
    
    const requiredEnvVars = {
      'NEXT_PUBLIC_SUPABASE_URL': process.env.NEXT_PUBLIC_SUPABASE_URL,
      'NEXT_PUBLIC_SUPABASE_ANON_KEY': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      'SUPABASE_SERVICE_ROLE_KEY': process.env.SUPABASE_SERVICE_ROLE_KEY
    }
    
    let envIssues = []
    
    for (const [key, value] of Object.entries(requiredEnvVars)) {
      if (!value) {
        log('red', `   ❌ ${key}: Missing`)
        envIssues.push(`${key} is missing`)
      } else if (value.includes('your-production-') || value.includes('your-project')) {
        log('yellow', `   ⚠️  ${key}: Contains placeholder value`)
        envIssues.push(`${key} contains placeholder value`)
      } else {
        log('green', `   ✅ ${key}: Set`)
      }
    }
    
    if (envIssues.length > 0) {
      log('red', '\n🚨 CRITICAL: Environment variable issues detected!')
      envIssues.forEach(issue => log('red', `   • ${issue}`))
      log('yellow', '\n🔧 ACTION REQUIRED:')
      log('yellow', '   1. Update your production environment variables in Vercel/deployment platform')
      log('yellow', '   2. Use real Supabase API keys from your Supabase project dashboard')
      log('yellow', '   3. Redeploy your application after updating environment variables')
      return false
    }
    
    // 2. URL Validation
    log('cyan', '\n2. Supabase URL Validation:')
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    
    if (supabaseUrl && supabaseUrl.match(/https:\/\/[a-z0-9]+\.supabase\.co/)) {
      log('green', `   ✅ URL format valid: ${supabaseUrl}`)
    } else {
      log('red', `   ❌ Invalid URL format: ${supabaseUrl}`)
      return false
    }
    
    // 3. Client Creation Test
    log('cyan', '\n3. Client Creation Test:')
    
    let supabaseClient, supabaseAdmin
    
    try {
      supabaseClient = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      )
      log('green', '   ✅ Standard client created successfully')
    } catch (clientError) {
      log('red', `   ❌ Failed to create standard client: ${clientError.message}`)
      return false
    }
    
    try {
      supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
      )
      log('green', '   ✅ Admin client created successfully')
    } catch (adminError) {
      log('red', `   ❌ Failed to create admin client: ${adminError.message}`)
      return false
    }
    
    // 4. Connection Test with Retry Logic
    log('cyan', '\n4. Connection Test:')
    
    const maxRetries = 3
    let connected = false
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        log('blue', `   🔄 Attempt ${attempt}/${maxRetries}: Testing connection...`)
        
        const startTime = Date.now()
        
        // Use information_schema which always exists
        const { data, error } = await supabaseAdmin
          .from('information_schema.tables')
          .select('table_name')
          .eq('table_schema', 'public')
          .limit(1)
        
        const responseTime = Date.now() - startTime
        
        if (error) {
          throw new Error(`Query failed: ${error.message}`)
        }
        
        log('green', `   ✅ Connection successful! (${responseTime}ms)`)
        log('green', `   📊 Found ${data ? data.length : 0} table(s) in public schema`)
        connected = true
        break
        
      } catch (connectionError) {
        log('red', `   ❌ Attempt ${attempt} failed: ${connectionError.message}`)
        
        if (attempt < maxRetries) {
          const delay = Math.pow(2, attempt) * 1000 // Exponential backoff
          log('yellow', `   ⏳ Retrying in ${delay / 1000}s...`)
          await new Promise(resolve => setTimeout(resolve, delay))
        }
      }
    }
    
    if (!connected) {
      log('red', '\n🚨 CRITICAL: Database connection failed after all retries!')
      return false
    }
    
    // 5. Table Existence Check
    log('cyan', '\n5. Required Tables Check:')
    
    const requiredTables = ['workshops', 'client_keys', 'user_sessions', 'chat_conversations']
    let tablesExist = true
    
    for (const tableName of requiredTables) {
      try {
        const { data, error } = await supabaseAdmin
          .from(tableName)
          .select('*')
          .limit(1)
        
        if (error) {
          if (error.message.includes('relation') && error.message.includes('does not exist')) {
            log('yellow', `   ⚠️  Table '${tableName}': Does not exist (may need creation)`)
          } else {
            log('red', `   ❌ Table '${tableName}': Error - ${error.message}`)
            tablesExist = false
          }
        } else {
          log('green', `   ✅ Table '${tableName}': Accessible`)
        }
      } catch (tableError) {
        log('red', `   ❌ Table '${tableName}': ${tableError.message}`)
        tablesExist = false
      }
    }
    
    // 6. Write Permission Test
    log('cyan', '\n6. Write Permission Test:')
    
    try {
      const testData = {
        name: `connection-test-${Date.now()}`,
        email: 'test@carbot.chat',
        created_at: new Date().toISOString(),
        deleted_at: new Date().toISOString() // Mark for cleanup
      }
      
      const { data, error } = await supabaseAdmin
        .from('workshops')
        .insert(testData)
        .select()
      
      if (error) {
        log('yellow', `   ⚠️  Write test failed: ${error.message}`)
        log('yellow', '   This may be expected if tables don\'t exist yet')
      } else {
        log('green', '   ✅ Write permission confirmed')
        
        // Cleanup test data
        if (data && data.length > 0) {
          await supabaseAdmin
            .from('workshops')
            .delete()
            .eq('id', data[0].id)
          log('blue', '   🧹 Test data cleaned up')
        }
      }
    } catch (writeError) {
      log('yellow', `   ⚠️  Write test error: ${writeError.message}`)
    }
    
    // 7. Summary
    log('cyan', '\n7. Test Summary:')
    
    if (connected && !envIssues.length) {
      log('green', '   🎉 SUCCESS: Database connection is working!')
      log('green', '   ✅ All environment variables are properly configured')
      log('green', '   ✅ Supabase connection established')
      log('blue', '\n📝 Next Steps:')
      log('blue', '   1. Ensure all required tables are created')
      log('blue', '   2. Test user registration functionality')
      log('blue', '   3. Monitor connection stability in production')
      return true
    } else {
      log('red', '   🚨 ISSUES DETECTED: Database connection has problems')
      
      if (envIssues.length > 0) {
        log('red', '   • Environment variable issues found')
      }
      if (!connected) {
        log('red', '   • Connection to database failed')
      }
      if (!tablesExist) {
        log('red', '   • Some required tables are missing or inaccessible')
      }
      
      log('yellow', '\n🔧 Recommended Actions:')
      log('yellow', '   1. Update environment variables with real Supabase API keys')
      log('yellow', '   2. Verify Supabase project is active and accessible')
      log('yellow', '   3. Create missing database tables using schema files')
      log('yellow', '   4. Check Supabase project settings and RLS policies')
      
      return false
    }
    
  } catch (error) {
    log('red', `\n💥 UNEXPECTED ERROR: ${error.message}`)
    log('red', `Stack trace: ${error.stack}`)
    return false
  }
}

// Run the test
if (require.main === module) {
  testDatabaseConnection()
    .then(success => {
      process.exit(success ? 0 : 1)
    })
    .catch(error => {
      console.error('Test runner error:', error)
      process.exit(1)
    })
}

module.exports = { testDatabaseConnection }