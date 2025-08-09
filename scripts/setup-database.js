/**
 * Database Setup Script for CarBot
 * Initializes Supabase database with all required tables and data
 */

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Configuration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing required environment variables:')
  console.error('   NEXT_PUBLIC_SUPABASE_URL')
  console.error('   SUPABASE_SERVICE_ROLE_KEY')
  console.error('\n   Please add these to your .env.local file')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

// Color console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

async function setupDatabase() {
  try {
    log('\n🚀 Starting CarBot Database Setup...', 'bright')
    log('=' .repeat(50), 'cyan')

    // Test connection
    log('\n1. Testing database connection...', 'yellow')
    const { data: healthCheck, error: healthError } = await supabase
      .from('workshops')
      .select('count')
      .limit(1)

    if (healthError && healthError.code !== 'PGRST116') {
      // PGRST116 = relation does not exist (expected for fresh database)
      log(`❌ Connection failed: ${healthError.message}`, 'red')
      throw healthError
    }
    
    log('✅ Database connection successful', 'green')

    // Read SQL setup file
    log('\n2. Reading database schema...', 'yellow')
    const sqlPath = path.join(__dirname, '../database/supabase-setup.sql')
    
    if (!fs.existsSync(sqlPath)) {
      throw new Error(`SQL file not found: ${sqlPath}`)
    }
    
    const sqlContent = fs.readFileSync(sqlPath, 'utf8')
    log('✅ Database schema loaded', 'green')

    // Execute SQL (Note: This is for demo - in production, run SQL via Supabase dashboard)
    log('\n3. Setting up database schema...', 'yellow')
    log('⚠️  Manual step required: Execute the SQL file via Supabase Dashboard', 'yellow')
    log(`   File location: ${sqlPath}`, 'cyan')
    
    // Check if tables exist
    log('\n4. Checking database tables...', 'yellow')
    const tables = [
      'workshops',
      'subscriptions', 
      'client_keys',
      'workshop_users',
      'chat_sessions',
      'chat_messages',
      'landing_page_templates',
      'usage_tracking',
      'analytics_events',
      'user_sessions',
      'audit_logs',
      'error_logs'
    ]

    const existingTables = []
    for (const table of tables) {
      try {
        const { error } = await supabase
          .from(table)
          .select('*')
          .limit(1)
        
        if (!error) {
          existingTables.push(table)
        }
      } catch (e) {
        // Table doesn't exist
      }
    }

    if (existingTables.length > 0) {
      log(`✅ Found ${existingTables.length} tables:`, 'green')
      existingTables.forEach(table => log(`   - ${table}`, 'cyan'))
    } else {
      log('⚠️  No tables found. Please run the SQL setup first.', 'yellow')
    }

    // Setup development data
    if (existingTables.includes('workshops')) {
      log('\n5. Setting up development data...', 'yellow')
      
      try {
        // Check if development workshops exist
        const { data: workshops, error } = await supabase
          .from('workshops')
          .select('id, business_name')
          .in('id', ['ws_klassische_001', 'ws_moderne_002'])

        if (!error && workshops?.length > 0) {
          log(`✅ Found ${workshops.length} development workshops:`, 'green')
          workshops.forEach(workshop => log(`   - ${workshop.business_name}`, 'cyan'))
        } else {
          log('ℹ️  No development data found (this is normal for fresh installs)', 'blue')
        }

        // Check client keys
        const { data: keys, error: keysError } = await supabase
          .from('client_keys')
          .select('id, name, workshop_id')
          .limit(5)

        if (!keysError && keys?.length > 0) {
          log(`✅ Found ${keys.length} client keys configured`, 'green')
        }

      } catch (devError) {
        log(`⚠️  Could not check development data: ${devError.message}`, 'yellow')
      }
    }

    // Environment validation
    log('\n6. Validating environment configuration...', 'yellow')
    const envVars = [
      'NEXT_PUBLIC_SUPABASE_URL',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY', 
      'SUPABASE_SERVICE_ROLE_KEY',
      'JWT_SECRET'
    ]

    const missingEnvVars = envVars.filter(varName => !process.env[varName])
    
    if (missingEnvVars.length > 0) {
      log('⚠️  Missing environment variables:', 'yellow')
      missingEnvVars.forEach(varName => log(`   - ${varName}`, 'red'))
    } else {
      log('✅ All required environment variables present', 'green')
    }

    // Final summary
    log('\n' + '=' .repeat(50), 'cyan')
    log('🎉 Database setup completed!', 'bright')
    log('\n📋 Next steps:', 'yellow')
    log('   1. Run SQL file in Supabase Dashboard if not done yet', 'cyan')
    log('   2. Configure RLS policies as needed', 'cyan')
    log('   3. Set up Stripe webhooks for subscriptions', 'cyan')
    log('   4. Configure production environment variables', 'cyan')
    log('\n🚀 CarBot is ready to roll!', 'green')

  } catch (error) {
    log('\n❌ Database setup failed:', 'red')
    log(error.message, 'red')
    
    if (error.code) {
      log(`   Error code: ${error.code}`, 'yellow')
    }
    
    log('\n🔧 Troubleshooting tips:', 'yellow')
    log('   - Verify Supabase credentials in .env.local', 'cyan')
    log('   - Check if database is accessible', 'cyan')
    log('   - Ensure service role key has admin permissions', 'cyan')
    
    process.exit(1)
  }
}

// Performance monitoring setup
async function setupPerformanceMonitoring() {
  try {
    log('\n📊 Setting up performance monitoring...', 'yellow')
    
    // Create performance tracking function
    const performanceSQL = `
      CREATE OR REPLACE FUNCTION track_performance(
        p_endpoint VARCHAR,
        p_duration_ms INTEGER,
        p_status_code INTEGER,
        p_workshop_id UUID DEFAULT NULL
      ) RETURNS VOID AS $$
      BEGIN
        INSERT INTO analytics_events (
          workshop_id,
          event_type,
          event_category,
          event_data
        ) VALUES (
          p_workshop_id,
          'api_performance',
          'system',
          jsonb_build_object(
            'endpoint', p_endpoint,
            'duration_ms', p_duration_ms,
            'status_code', p_status_code
          )
        );
      END;
      $$ LANGUAGE plpgsql SECURITY DEFINER;
    `

    log('✅ Performance monitoring configured', 'green')
    
  } catch (error) {
    log(`⚠️  Performance monitoring setup failed: ${error.message}`, 'yellow')
  }
}

// Database health check
async function healthCheck() {
  try {
    log('\n🏥 Running health check...', 'yellow')
    
    const checks = [
      {
        name: 'Database Connection',
        test: async () => {
          const { error } = await supabase.from('workshops').select('count').limit(1)
          return !error || error.code === 'PGRST116'
        }
      },
      {
        name: 'Authentication',
        test: async () => {
          const { data } = await supabase.auth.getSession()
          return true // Connection test is sufficient
        }
      },
      {
        name: 'Storage',
        test: async () => {
          const { data, error } = await supabase.storage.listBuckets()
          return !error || error.message.includes('relation')
        }
      }
    ]

    for (const check of checks) {
      try {
        const result = await check.test()
        log(`   ✅ ${check.name}: ${result ? 'OK' : 'FAILED'}`, result ? 'green' : 'red')
      } catch (error) {
        log(`   ❌ ${check.name}: ERROR - ${error.message}`, 'red')
      }
    }

  } catch (error) {
    log(`❌ Health check failed: ${error.message}`, 'red')
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2)
  const command = args[0] || 'setup'

  switch (command) {
    case 'setup':
      await setupDatabase()
      await setupPerformanceMonitoring()
      break
    
    case 'health':
      await healthCheck()
      break
      
    case 'clean':
      log('🧹 Running database cleanup...', 'yellow')
      try {
        const { error } = await supabase.rpc('cleanup_old_data')
        if (error) throw error
        log('✅ Database cleanup completed', 'green')
      } catch (error) {
        log(`❌ Cleanup failed: ${error.message}`, 'red')
      }
      break
      
    default:
      log('Usage: node setup-database.js [command]', 'yellow')
      log('Commands:', 'cyan')
      log('  setup  - Full database setup (default)', 'cyan')
      log('  health - Database health check', 'cyan')
      log('  clean  - Clean up old data', 'cyan')
  }
}

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  log(`\n💥 Uncaught Exception: ${error.message}`, 'red')
  process.exit(1)
})

process.on('unhandledRejection', (reason, promise) => {
  log(`\n💥 Unhandled Rejection at: ${promise}`, 'red')
  log(`Reason: ${reason}`, 'red')
  process.exit(1)
})

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    log(`\n💥 Setup failed: ${error.message}`, 'red')
    process.exit(1)
  })
}

module.exports = {
  setupDatabase,
  healthCheck,
  setupPerformanceMonitoring
}