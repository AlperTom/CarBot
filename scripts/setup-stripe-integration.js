#!/usr/bin/env node

/**
 * CarBot Stripe Integration Setup Script
 * 
 * This script helps set up and validate the Stripe integration:
 * - Creates products and prices in Stripe
 * - Sets up webhooks
 * - Validates configuration
 * - Tests payment flows
 */

import Stripe from 'stripe';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PRODUCTS } from '../lib/stripe.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const WEBHOOK_EVENTS = [
  'checkout.session.completed',
  'customer.subscription.created',
  'customer.subscription.updated',
  'customer.subscription.deleted',
  'invoice.payment_succeeded',
  'invoice.payment_failed',
  'customer.subscription.trial_will_end',
  'customer.created',
  'customer.updated',
  'payment_method.attached'
];

class StripeIntegrationSetup {
  constructor() {
    this.stripe = null;
    this.webhookEndpoint = null;
    this.priceIds = {};
  }

  async initialize() {
    console.log('🚀 CarBot Stripe Integration Setup\n');

    // Check for required environment variables
    const requiredEnvVars = [
      'STRIPE_SECRET_KEY',
      'NEXT_PUBLIC_APP_URL'
    ];

    const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
    if (missingEnvVars.length > 0) {
      console.error('❌ Missing required environment variables:');
      missingEnvVars.forEach(envVar => console.error(`   - ${envVar}`));
      console.error('\nPlease set these in your .env.local file and try again.');
      process.exit(1);
    }

    // Initialize Stripe
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16',
    });

    console.log('✅ Stripe client initialized');
  }

  async createProducts() {
    console.log('\n📦 Creating Stripe Products and Prices...');

    for (const [planKey, planData] of Object.entries(PRODUCTS)) {
      console.log(`\n  Creating product: ${planData.name}`);

      try {
        // Create product
        const product = await this.stripe.products.create({
          name: planData.name,
          description: `CarBot ${planData.name} - Automotive Workshop AI Assistant`,
          metadata: {
            plan_key: planKey,
            market: 'german',
            industry: 'automotive'
          },
        });

        console.log(`  ✅ Product created: ${product.id}`);

        // Create monthly price
        const monthlyPrice = await this.stripe.prices.create({
          product: product.id,
          currency: 'eur',
          recurring: {
            interval: 'month',
            trial_period_days: 14
          },
          unit_amount: planData.monthly.price,
          tax_behavior: 'exclusive', // VAT will be calculated automatically
          metadata: {
            plan: planKey,
            billing: 'monthly'
          }
        });

        console.log(`  ✅ Monthly price created: ${monthlyPrice.id} (€${planData.monthly.price / 100}/month)`);

        // Create yearly price
        const yearlyPrice = await this.stripe.prices.create({
          product: product.id,
          currency: 'eur',
          recurring: {
            interval: 'year',
            trial_period_days: 14
          },
          unit_amount: planData.yearly.price,
          tax_behavior: 'exclusive',
          metadata: {
            plan: planKey,
            billing: 'yearly'
          }
        });

        console.log(`  ✅ Yearly price created: ${yearlyPrice.id} (€${planData.yearly.price / 100}/year)`);

        // Store price IDs for environment file update
        this.priceIds[`STRIPE_${planKey.toUpperCase()}_MONTHLY_PRICE_ID`] = monthlyPrice.id;
        this.priceIds[`STRIPE_${planKey.toUpperCase()}_YEARLY_PRICE_ID`] = yearlyPrice.id;

      } catch (error) {
        if (error.code === 'resource_already_exists') {
          console.log(`  ⚠️  Product already exists, skipping...`);
        } else {
          console.error(`  ❌ Error creating product: ${error.message}`);
        }
      }
    }
  }

  async setupWebhooks() {
    console.log('\n🔗 Setting up Stripe Webhooks...');

    const webhookUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/stripe`;
    console.log(`  Webhook URL: ${webhookUrl}`);

    try {
      // Check if webhook already exists
      const existingWebhooks = await this.stripe.webhookEndpoints.list({
        limit: 100
      });

      const existingWebhook = existingWebhooks.data.find(webhook => 
        webhook.url === webhookUrl
      );

      if (existingWebhook) {
        console.log('  ⚠️  Webhook endpoint already exists, updating...');
        
        this.webhookEndpoint = await this.stripe.webhookEndpoints.update(
          existingWebhook.id,
          {
            enabled_events: WEBHOOK_EVENTS,
            url: webhookUrl
          }
        );
      } else {
        console.log('  Creating new webhook endpoint...');
        
        this.webhookEndpoint = await this.stripe.webhookEndpoints.create({
          url: webhookUrl,
          enabled_events: WEBHOOK_EVENTS,
          description: 'CarBot Payment Processing Webhook'
        });
      }

      console.log(`  ✅ Webhook endpoint configured: ${this.webhookEndpoint.id}`);
      console.log(`  🔑 Webhook secret: ${this.webhookEndpoint.secret}`);

    } catch (error) {
      console.error(`  ❌ Error setting up webhook: ${error.message}`);
    }
  }

  async updateEnvironmentFile() {
    console.log('\n📝 Updating environment configuration...');

    const envFiles = ['.env.local', '.env.template'];
    
    for (const envFile of envFiles) {
      const filePath = path.join(__dirname, '..', envFile);
      
      if (!fs.existsSync(filePath) && envFile === '.env.local') {
        console.log(`  Creating ${envFile}...`);
        // Copy from template if .env.local doesn't exist
        const templatePath = path.join(__dirname, '..', '.env.template');
        if (fs.existsSync(templatePath)) {
          fs.copyFileSync(templatePath, filePath);
        }
      }

      if (fs.existsSync(filePath)) {
        console.log(`  Updating ${envFile}...`);
        
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Update price IDs
        Object.entries(this.priceIds).forEach(([key, value]) => {
          const regex = new RegExp(`^${key}=.*$`, 'm');
          const replacement = `${key}=${value}`;
          
          if (content.match(regex)) {
            content = content.replace(regex, replacement);
          } else {
            content += `\n${replacement}`;
          }
        });
        
        // Update webhook secret if available
        if (this.webhookEndpoint?.secret) {
          const webhookRegex = /^STRIPE_WEBHOOK_SECRET=.*$/m;
          const webhookReplacement = `STRIPE_WEBHOOK_SECRET=${this.webhookEndpoint.secret}`;
          
          if (content.match(webhookRegex)) {
            content = content.replace(webhookRegex, webhookReplacement);
          } else {
            content += `\n${webhookReplacement}`;
          }
        }
        
        fs.writeFileSync(filePath, content);
        console.log(`  ✅ Updated ${envFile}`);
      }
    }
  }

  async validateConfiguration() {
    console.log('\n🔍 Validating Stripe Configuration...');

    try {
      // Test API connection
      const account = await this.stripe.accounts.retrieve();
      console.log(`  ✅ Connected to Stripe account: ${account.display_name || account.id}`);
      console.log(`  📧 Account email: ${account.email || 'Not set'}`);
      console.log(`  🌍 Country: ${account.country}`);

      // List products
      const products = await this.stripe.products.list({ limit: 10 });
      const carbotProducts = products.data.filter(product => 
        product.name.includes('CarBot')
      );
      console.log(`  📦 CarBot products found: ${carbotProducts.length}`);

      // List prices
      const prices = await this.stripe.prices.list({ limit: 50 });
      const carbotPrices = prices.data.filter(price => 
        price.metadata?.plan && ['starter', 'professional', 'enterprise'].includes(price.metadata.plan)
      );
      console.log(`  💰 CarBot prices found: ${carbotPrices.length}`);

      // List webhooks
      const webhooks = await this.stripe.webhookEndpoints.list();
      const carbotWebhooks = webhooks.data.filter(webhook => 
        webhook.url.includes('/api/webhooks/stripe')
      );
      console.log(`  🔗 CarBot webhooks found: ${carbotWebhooks.length}`);

      // Validate tax settings
      const taxSettings = await this.stripe.taxSettings.retrieve();
      console.log(`  🧾 Automatic tax: ${taxSettings.defaults.automatic_tax ? 'Enabled' : 'Disabled'}`);

      return true;
    } catch (error) {
      console.error(`  ❌ Validation error: ${error.message}`);
      return false;
    }
  }

  async testPaymentFlow() {
    console.log('\n🧪 Testing Payment Flow...');

    try {
      // Create a test checkout session
      const testSession = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card', 'sepa_debit'],
        line_items: [{
          price: Object.values(this.priceIds)[0], // Use first price ID
          quantity: 1,
        }],
        mode: 'subscription',
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
        automatic_tax: { enabled: true },
        customer_update: {
          address: 'auto',
          name: 'auto',
        },
        subscription_data: {
          trial_period_days: 14,
        },
        locale: 'de',
        billing_address_collection: 'required',
        tax_id_collection: { enabled: true },
      });

      console.log(`  ✅ Test checkout session created: ${testSession.id}`);
      console.log(`  🔗 Test URL: ${testSession.url}`);
      console.log('  💡 You can use this URL to test the complete payment flow');

      return testSession;
    } catch (error) {
      console.error(`  ❌ Test payment flow error: ${error.message}`);
      return null;
    }
  }

  async generateIntegrationReport() {
    console.log('\n📊 Stripe Integration Report');
    console.log('=' .repeat(50));

    // Account information
    const account = await this.stripe.accounts.retrieve();
    console.log(`Account: ${account.display_name || account.id}`);
    console.log(`Country: ${account.country}`);
    console.log(`Business Type: ${account.business_type || 'Not set'}`);

    // Products and prices
    console.log('\n📦 Products & Prices:');
    const products = await this.stripe.products.list({ limit: 10 });
    const prices = await this.stripe.prices.list({ limit: 50 });

    for (const product of products.data) {
      if (product.name.includes('CarBot')) {
        console.log(`\n  ${product.name} (${product.id})`);
        
        const productPrices = prices.data.filter(price => price.product === product.id);
        productPrices.forEach(price => {
          const amount = price.unit_amount / 100;
          const interval = price.recurring?.interval || 'one-time';
          console.log(`    - €${amount}/${interval} (${price.id})`);
        });
      }
    }

    // Webhooks
    console.log('\n🔗 Webhooks:');
    const webhooks = await this.stripe.webhookEndpoints.list();
    webhooks.data.forEach(webhook => {
      if (webhook.url.includes('carbot') || webhook.url.includes('/api/webhooks/stripe')) {
        console.log(`  ${webhook.url}`);
        console.log(`    Status: ${webhook.status}`);
        console.log(`    Events: ${webhook.enabled_events.length}`);
      }
    });

    // Configuration summary
    console.log('\n⚙️  Environment Variables Needed:');
    Object.entries(this.priceIds).forEach(([key, value]) => {
      console.log(`  ${key}=${value}`);
    });

    if (this.webhookEndpoint?.secret) {
      console.log(`  STRIPE_WEBHOOK_SECRET=${this.webhookEndpoint.secret}`);
    }
  }

  async run() {
    try {
      await this.initialize();
      await this.createProducts();
      await this.setupWebhooks();
      await this.updateEnvironmentFile();
      
      const isValid = await this.validateConfiguration();
      if (isValid) {
        await this.testPaymentFlow();
        await this.generateIntegrationReport();
        
        console.log('\n🎉 Stripe integration setup completed successfully!');
        console.log('\nNext steps:');
        console.log('1. Review the updated environment variables in .env.local');
        console.log('2. Restart your development server');
        console.log('3. Test the payment flows in your application');
        console.log('4. Set up Stripe CLI for local webhook testing:');
        console.log('   stripe listen --forward-to localhost:3000/api/webhooks/stripe');
      } else {
        console.log('\n⚠️  Setup completed with validation errors. Please review the configuration.');
      }
      
    } catch (error) {
      console.error('\n❌ Setup failed:', error.message);
      process.exit(1);
    }
  }
}

// CLI handling
const args = process.argv.slice(2);
const command = args[0];

const setup = new StripeIntegrationSetup();

switch (command) {
  case 'validate':
    setup.initialize().then(() => setup.validateConfiguration());
    break;
  case 'test':
    setup.initialize().then(() => setup.testPaymentFlow());
    break;
  case 'report':
    setup.initialize().then(() => setup.generateIntegrationReport());
    break;
  case 'webhook':
    setup.initialize().then(() => setup.setupWebhooks());
    break;
  default:
    setup.run();
}

export default StripeIntegrationSetup;