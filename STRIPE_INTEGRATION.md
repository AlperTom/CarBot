# CarBot Stripe Integration Documentation

This document provides a comprehensive guide to the Stripe integration for CarBot's subscription billing system, specifically designed for the German market with EU compliance features.

## Overview

The Stripe integration provides:
- Subscription billing with 14-day free trials
- German localization and EU VAT compliance
- Customer portal for self-service billing management
- Webhook handling for real-time payment events
- Usage tracking and billing alerts
- Plan upgrade/downgrade flows

## Project Structure

### API Routes
- `/api/stripe/checkout/route.js` - Create checkout sessions
- `/api/stripe/webhook/route.js` - Handle Stripe webhooks
- `/api/stripe/subscriptions/route.js` - Manage subscriptions
- `/api/stripe/portal/route.js` - Customer portal access

### UI Components
- `/app/dashboard/billing/page.jsx` - Main billing dashboard
- `/app/pricing/page.jsx` - Enhanced pricing page with Stripe integration

### Utilities
- `/lib/stripe.js` - Stripe client and helper functions

### Database
- `/supabase/billing-schema.sql` - Complete billing schema

## Environment Variables

Copy `.env.example` to `.env.local` and configure:

```bash
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Stripe Price IDs (create these in Stripe Dashboard)
STRIPE_STARTER_MONTHLY_PRICE_ID=price_starter_monthly
STRIPE_PROFESSIONAL_MONTHLY_PRICE_ID=price_professional_monthly
STRIPE_ENTERPRISE_MONTHLY_PRICE_ID=price_enterprise_monthly
STRIPE_STARTER_YEARLY_PRICE_ID=price_starter_yearly
STRIPE_PROFESSIONAL_YEARLY_PRICE_ID=price_professional_yearly
STRIPE_ENTERPRISE_YEARLY_PRICE_ID=price_enterprise_yearly
```

## Stripe Dashboard Setup

### 1. Create Products and Prices

Create the following products in your Stripe Dashboard:

#### Starter Plan
- Product Name: "CarBot Starter"
- Monthly Price: €49.00 (4900 cents)
- Annual Price: €490.00 (49000 cents) - 2 months free

#### Professional Plan
- Product Name: "CarBot Professional"
- Monthly Price: €99.00 (9900 cents)
- Annual Price: €990.00 (99000 cents) - 2 months free

#### Enterprise Plan
- Product Name: "CarBot Enterprise"
- Monthly Price: €199.00 (19900 cents)
- Annual Price: €1990.00 (199000 cents) - 2 months free

### 2. Configure Webhooks

Set up a webhook endpoint pointing to your domain:
```
https://yourdomain.com/api/stripe/webhook
```

Subscribe to these events:
- `checkout.session.completed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_succeeded`
- `invoice.payment_failed`
- `customer.subscription.trial_will_end`
- `invoice.upcoming`
- `customer.created`
- `customer.updated`

### 3. Enable Customer Portal

Configure the customer portal in Stripe Dashboard:
- Enable invoice history
- Enable subscription management
- Enable payment method updates
- Set business information for invoices

## Database Schema

Run the billing schema migration:

```sql
-- Apply the billing schema
\\i supabase/billing-schema.sql
```

Key tables created:
- `subscription_plans` - Plan definitions
- `subscriptions` - Stripe subscription tracking
- `payments` - Payment history
- `billing_events` - Audit trail
- `webhook_events` - Webhook processing log
- `usage_records` - Usage tracking
- `billing_alerts` - Proactive notifications

## API Endpoints

### Checkout Session Creation

**POST** `/api/stripe/checkout`

Creates a new checkout session for plan subscription.

```javascript
const response = await fetch('/api/stripe/checkout', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    planId: 'professional',
    billingInterval: 'month', // or 'year'
    workshopData: {
      id: 'workshop-uuid',
      name: 'Workshop Name',
      businessType: 'independent'
    },
    customerData: {
      email: 'owner@workshop.com',
      name: 'Workshop Name',
      phone: '+49123456789',
      address: 'Street Address',
      city: 'Berlin',
      postalCode: '12345',
      country: 'DE',
      gdprConsent: true
    },
    trialDays: 14
  })
});
```

### Subscription Management

**GET** `/api/stripe/subscriptions?workshop_id=UUID`
- Retrieve subscription details

**PUT** `/api/stripe/subscriptions`
- Update subscription (upgrade/downgrade)

**DELETE** `/api/stripe/subscriptions?subscription_id=ID`
- Cancel subscription

**POST** `/api/stripe/subscriptions`
- Special actions (reactivate, pause, report usage)

### Customer Portal

**POST** `/api/stripe/portal`

```javascript
const response = await fetch('/api/stripe/portal', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    workshopId: 'workshop-uuid'
  })
});
```

## German Localization & EU Compliance

### VAT Handling
- Automatic VAT calculation based on customer location
- Support for EU reverse charge
- German VAT rate (19%) configured by default

### Invoicing
- German invoice format with required business information
- Automatic tax ID collection
- GDPR-compliant customer data handling

### Localization
- German language in Stripe Checkout and Customer Portal
- Euro currency
- German date and number formatting

## Usage Tracking

Track usage metrics for billing:

```javascript
// Report usage
await fetch('/api/stripe/subscriptions', {
  method: 'POST',
  body: JSON.stringify({
    action: 'report_usage',
    subscriptionId: 'sub_xxxx',
    data: {
      itemId: 'si_xxxx',
      quantity: 50, // conversations used
      timestamp: Math.floor(Date.now() / 1000)
    }
  })
});
```

## Billing Dashboard Features

The billing dashboard (`/dashboard/billing`) provides:
- Current subscription overview
- Payment history
- Usage statistics
- Plan upgrade/downgrade options
- Invoice downloads
- Subscription cancellation

## Security Considerations

### Webhook Security
- Webhook signature verification using Stripe's webhook secret
- IP address validation for webhook endpoints

### PCI Compliance
- No sensitive payment data stored locally
- All payments processed through Stripe's secure infrastructure

### GDPR Compliance
- Customer data encryption
- Right to data deletion
- Consent tracking
- Data retention policies

## Error Handling

The integration includes comprehensive error handling:

```javascript
// Example error response
{
  "error": "Fehler beim Erstellen der Checkout-Session",
  "type": "validation_error",
  "code": "missing_required_field"
}
```

Common error scenarios:
- Invalid payment methods
- Expired cards
- Insufficient funds
- Plan limit exceeded
- Webhook verification failures

## Testing

### Test Mode Setup
1. Use Stripe test API keys
2. Use test payment methods:
   - Card: `4242 4242 4242 4242`
   - Expiry: Any future date
   - CVC: Any 3 digits

### Webhook Testing
Use Stripe CLI for local webhook testing:
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

## Production Deployment

### Checklist
- [ ] Switch to live Stripe API keys
- [ ] Configure production webhook endpoint
- [ ] Set up monitoring for webhook failures
- [ ] Enable Stripe Radar for fraud protection
- [ ] Configure email notifications
- [ ] Set up automated backups for billing data

### Monitoring
- Monitor webhook delivery success rates
- Track subscription churn and upgrade metrics
- Set up alerts for payment failures
- Monitor usage against plan limits

## Troubleshooting

### Common Issues

1. **Webhook failures**
   - Verify webhook signature
   - Check endpoint URL accessibility
   - Review webhook event logs in Stripe Dashboard

2. **Checkout session errors**
   - Validate customer data format
   - Ensure price IDs are correct
   - Check plan availability

3. **Subscription updates failing**
   - Verify subscription status
   - Check plan compatibility
   - Ensure customer has valid payment method

### Debug Mode
Enable debug logging by setting:
```bash
DEBUG_STRIPE=true
```

## Support and Documentation

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Germany Guide](https://stripe.com/docs/payments/accept-a-payment?locale=de-DE)
- [EU VAT Guidelines](https://stripe.com/docs/tax/eu-vat)
- [Webhooks Best Practices](https://stripe.com/docs/webhooks/best-practices)

## Migration Guide

If migrating from another billing system:

1. Export customer and subscription data
2. Create corresponding Stripe customers
3. Set up subscriptions with correct billing dates
4. Import payment history for reference
5. Update webhook configurations
6. Test billing flows thoroughly

For any issues or questions, consult the Stripe documentation or contact support.