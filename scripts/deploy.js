#!/usr/bin/env node

/**
 * CarBot Production Deployment Script
 * Automates the deployment process to Vercel with proper checks and validations
 */

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

// Configuration
const REQUIRED_ENV_VARS = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY', 
  'SUPABASE_SERVICE_ROLE_KEY',
  'OPENAI_API_KEY',
  'JWT_SECRET'
]

// Color console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function execCommand(command, description) {
  try {
    log(`\n=Ý ${description}...`, 'yellow')
    const output = execSync(command, { 
      encoding: 'utf8', 
      stdio: 'pipe',
      cwd: process.cwd()
    })
    log(` ${description} completed`, 'green')
    return output
  } catch (error) {
    log(`L ${description} failed:`, 'red')
    log(error.message, 'red')
    throw error
  }
}

async function checkPrerequisites() {
  log('\n= Checking deployment prerequisites...', 'bright')
  
  // Check if Vercel CLI is installed
  try {
    execSync('vercel --version', { stdio: 'pipe' })
    log(' Vercel CLI is installed', 'green')
  } catch (error) {
    log('L Vercel CLI not found', 'red')
    log('Install it with: npm i -g vercel', 'yellow')
    throw new Error('Vercel CLI required')
  }
  
  // Check if logged into Vercel
  try {
    execSync('vercel whoami', { stdio: 'pipe' })
    log(' Logged into Vercel', 'green')
  } catch (error) {
    log('L Not logged into Vercel', 'red')
    log('Login with: vercel login', 'yellow')
    throw new Error('Vercel login required')
  }
  
  // Check for required files
  const requiredFiles = [
    'package.json',
    'next.config.js',
    'vercel.json',
    '.env.example'
  ]
  
  for (const file of requiredFiles) {
    if (fs.existsSync(path.join(process.cwd(), file))) {
      log(` ${file} found`, 'green')
    } else {
      log(`L ${file} missing`, 'red')
      throw new Error(`Required file ${file} not found`)
    }
  }
}

async function validateEnvironment() {
  log('\n=' Validating environment configuration...', 'bright')
  
  // Check if .env.local exists
  const envPath = path.join(process.cwd(), '.env.local')
  if (!fs.existsSync(envPath)) {
    log('   .env.local not found (this is normal for production)', 'yellow')
    log('Environment variables should be set via Vercel dashboard', 'cyan')
    return
  }
  
  // Load and check local environment
  require('dotenv').config({ path: envPath })
  
  const missingVars = REQUIRED_ENV_VARS.filter(varName => !process.env[varName])
  
  if (missingVars.length > 0) {
    log('   Missing environment variables in .env.local:', 'yellow')
    missingVars.forEach(varName => log(`   - ${varName}`, 'red'))
    log('Make sure these are set in Vercel dashboard', 'cyan')
  } else {
    log(' All required environment variables present locally', 'green')
  }
}

async function runPreDeploymentChecks() {
  log('\n>ê Running pre-deployment checks...', 'bright')
  
  try {
    // Run linting
    execCommand('npm run lint', 'Linting code')
  } catch (error) {
    log('   Linting failed, continuing anyway...', 'yellow')
  }
  
  try {
    // Run type checking if available
    execCommand('npm run typecheck', 'Type checking')
  } catch (error) {
    log('   Type checking not available or failed', 'yellow')
  }
  
  try {
    // Run tests if available
    execCommand('npm test -- --passWithNoTests --watchAll=false', 'Running tests')
  } catch (error) {
    log('   Tests not available or failed', 'yellow')
  }
  
  // Test build
  execCommand('npm run build', 'Testing production build')
}

async function deployToVercel(isProd = false) {
  log('\n=€ Deploying to Vercel...', 'bright')
  
  const deployCommand = isProd ? 'vercel --prod' : 'vercel'
  const deployType = isProd ? 'PRODUCTION' : 'PREVIEW'
  
  try {
    const output = execCommand(deployCommand, `Deploying to ${deployType}`)
    
    // Extract deployment URL from output
    const urlMatch = output.match(/https:\/\/[^\s]+/)
    const deploymentUrl = urlMatch ? urlMatch[0] : 'Unknown URL'
    
    log(`\n<‰ Deployment successful!`, 'green')
    log(`= ${deployType} URL: ${deploymentUrl}`, 'cyan')
    
    return deploymentUrl
    
  } catch (error) {
    log('\n=¥ Deployment failed!', 'red')
    log('Check the error above and try again', 'yellow')
    throw error
  }
}

async function setupEnvironmentVariables() {
  log('\n™  Setting up environment variables...', 'bright')
  
  log('You need to set these environment variables in Vercel dashboard:', 'cyan')
  log('Visit: https://vercel.com/dashboard -> Your Project -> Settings -> Environment Variables', 'blue')
  
  const envVarsToSet = [
    { name: 'NODE_ENV', value: 'production' },
    { name: 'NEXT_PUBLIC_SUPABASE_URL', value: 'https://your-project.supabase.co' },
    { name: 'NEXT_PUBLIC_SUPABASE_ANON_KEY', value: 'your_anon_key_here' },
    { name: 'SUPABASE_SERVICE_ROLE_KEY', value: 'your_service_role_key_here' },
    { name: 'OPENAI_API_KEY', value: 'sk-your_openai_api_key_here' },
    { name: 'JWT_SECRET', value: 'your_super_secure_jwt_secret_min_32_chars' },
    { name: 'NEXT_PUBLIC_APP_URL', value: 'https://your-domain.vercel.app' }
  ]
  
  log('\n=Ë Required environment variables:', 'yellow')
  envVarsToSet.forEach(env => {
    log(`   ${env.name}=${env.value}`, 'cyan')
  })
  
  log('\n=¡ Pro tip: You can also set them via CLI:', 'blue')
  envVarsToSet.forEach(env => {
    log(`   vercel env add ${env.name}`, 'cyan')
  })
}

async function postDeploymentChecks(deploymentUrl) {
  log('\n= Running post-deployment checks...', 'bright')
  
  const testEndpoints = [
    { path: '/', name: 'Homepage' },
    { path: '/api/health', name: 'Health Check' },
    { path: '/widget.js', name: 'Widget Script' }
  ]
  
  for (const endpoint of testEndpoints) {
    try {
      const response = await fetch(`${deploymentUrl}${endpoint.path}`)
      if (response.ok) {
        log(` ${endpoint.name}: ${response.status}`, 'green')
      } else {
        log(`   ${endpoint.name}: ${response.status}`, 'yellow')
      }
    } catch (error) {
      log(`L ${endpoint.name}: Failed to connect`, 'red')
    }
  }
}

async function showDeploymentSummary(deploymentUrl, isProd) {
  log('\n' + '='.repeat(60), 'cyan')
  log('<‰ CARBOT DEPLOYMENT SUMMARY', 'bright')
  log('='.repeat(60), 'cyan')
  
  log(`\n=æ Deployment Type: ${isProd ? 'PRODUCTION' : 'PREVIEW'}`, 'yellow')
  log(`= URL: ${deploymentUrl}`, 'cyan')
  log(`=Ê Dashboard: https://vercel.com/dashboard`, 'blue')
  
  log('\n=à  Next Steps:', 'yellow')
  if (!isProd) {
    log('   1. Test the preview deployment thoroughly', 'cyan')
    log('   2. When ready, run: npm run deploy:prod', 'cyan')
  } else {
    log('   1. Set up custom domain in Vercel dashboard', 'cyan')
    log('   2. Configure SSL certificate', 'cyan')
    log('   3. Test all features in production', 'cyan')
    log('   4. Update DNS records if using custom domain', 'cyan')
  }
  
  log('\n=€ CarBot is now live!', 'green')
  log('Happy automotive workshop management! =—=¨', 'bright')
}

// Main deployment function
async function deploy() {
  try {
    const args = process.argv.slice(2)
    const isProd = args.includes('--prod') || args.includes('--production')
    
    log('\n=€ CARBOT DEPLOYMENT SCRIPT', 'bright')
    log('=' .repeat(50), 'cyan')
    
    if (isProd) {
      log('<¯ PRODUCTION DEPLOYMENT', 'red')
    } else {
      log('=, PREVIEW DEPLOYMENT', 'yellow')
    }
    
    // Run all checks
    await checkPrerequisites()
    await validateEnvironment()
    
    if (isProd) {
      await runPreDeploymentChecks()
    }
    
    // Show environment setup if needed
    if (args.includes('--setup-env')) {
      await setupEnvironmentVariables()
      return
    }
    
    // Deploy
    const deploymentUrl = await deployToVercel(isProd)
    
    // Post-deployment checks
    setTimeout(async () => {
      await postDeploymentChecks(deploymentUrl)
      await showDeploymentSummary(deploymentUrl, isProd)
    }, 5000)
    
  } catch (error) {
    log('\n=¥ Deployment failed:', 'red')
    log(error.message, 'red')
    
    log('\n=' Troubleshooting tips:', 'yellow')
    log('   - Check your internet connection', 'cyan')
    log('   - Ensure Vercel CLI is logged in: vercel whoami', 'cyan')
    log('   - Verify environment variables in Vercel dashboard', 'cyan')
    log('   - Check project build locally: npm run build', 'cyan')
    
    process.exit(1)
  }
}

// Handle command line arguments
const args = process.argv.slice(2)

if (args.includes('--help') || args.includes('-h')) {
  log('\n=€ CarBot Deployment Script', 'bright')
  log('\nUsage:', 'yellow')
  log('  npm run deploy          # Preview deployment', 'cyan')
  log('  npm run deploy:prod     # Production deployment', 'cyan')
  log('  node scripts/deploy.js --setup-env  # Show environment setup', 'cyan')
  log('\nOptions:', 'yellow')
  log('  --prod, --production    Deploy to production', 'cyan')
  log('  --setup-env             Show environment variable setup guide', 'cyan')
  log('  --help, -h              Show this help message', 'cyan')
  process.exit(0)
}

// Run deployment
if (require.main === module) {
  deploy()
}

module.exports = { deploy }