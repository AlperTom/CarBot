# CarBot Deployment Guide

## 🚀 Production Deployment (Vercel)

### Required Environment Variables

Set these variables in your Vercel dashboard:

```bash
# Next.js Configuration
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
NEXT_PUBLIC_ENVIRONMENT=production

# Supabase Configuration (REQUIRED)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# OpenAI Configuration (REQUIRED)
OPENAI_API_KEY=sk-your-openai-key-here
OPENAI_MODEL=gpt-3.5-turbo

# Stripe Configuration (REQUIRED)
STRIPE_SECRET_KEY=sk_live_your-stripe-secret-key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your-stripe-publishable-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret

# Stripe Price IDs (Live)
STRIPE_STARTER_MONTHLY_PRICE_ID=price_live_starter_monthly
STRIPE_STARTER_YEARLY_PRICE_ID=price_live_starter_yearly
STRIPE_PROFESSIONAL_MONTHLY_PRICE_ID=price_live_professional_monthly
STRIPE_PROFESSIONAL_YEARLY_PRICE_ID=price_live_professional_yearly
STRIPE_ENTERPRISE_MONTHLY_PRICE_ID=price_live_enterprise_monthly
STRIPE_ENTERPRISE_YEARLY_PRICE_ID=price_live_enterprise_yearly

# Security Configuration (REQUIRED)
NEXTAUTH_SECRET=your-nextauth-secret-key-here
NEXTAUTH_URL=https://your-domain.vercel.app

# Workshop Configuration
NEXT_PUBLIC_CLIENT_KEY=your-workshop-client-key
WORKSHOP_EMAIL=your-workshop@email.com
```

### Database Setup

1. **Run the atomic function creation:**
   ```sql
   -- In your Supabase SQL editor, run:
   -- scripts/create-atomic-function.sql
   ```

2. **Verify database schema:**
   ```sql
   -- Check tables exist:
   SELECT table_name FROM information_schema.tables 
   WHERE table_schema = 'public';
   ```

## 🧪 UAT Environment Deployment

### UAT Environment Variables

```bash
# UAT Specific
NODE_ENV=uat
UAT_MODE=true
DEMO_DATA_ENABLED=true
NEXT_PUBLIC_ENVIRONMENT=uat

# Use test keys for UAT
STRIPE_SECRET_KEY=sk_test_your-stripe-test-key
OPENAI_API_KEY=sk-your-test-openai-key
```

### UAT Database Setup

1. **Create separate UAT database in Supabase**
2. **Run demo data seeding:**
   ```bash
   # In Supabase SQL editor:
   # scripts/seed-uat-data.sql
   ```

## 🔧 Troubleshooting Common Issues

### Build Failures

1. **Missing Environment Variables:**
   ```
   Error: Missing NEXT_PUBLIC_SUPABASE_URL
   ```
   **Solution:** Add all required environment variables in Vercel dashboard

2. **Import Path Issues:**
   ```
   Error: Cannot resolve '@/lib/...'
   ```
   **Solution:** Use relative paths as implemented in security fixes

3. **Database Connection Issues:**
   ```
   Error: supabaseKey is required
   ```
   **Solution:** Ensure SUPABASE_SERVICE_ROLE_KEY is set correctly

### Runtime Errors

1. **Authentication Issues:**
   - Check Supabase RLS policies are properly configured
   - Verify service role key has correct permissions

2. **API Route Failures:**
   - Check function timeout settings in vercel.json
   - Verify all API routes have proper error handling

3. **Stripe Integration Issues:**
   - Ensure webhook endpoints are configured in Stripe dashboard
   - Verify webhook secret matches environment variable

## 📊 Security Verification Checklist

After deployment, verify these security fixes are working:

- [ ] SQL injection protection in lead search
- [ ] Authentication race condition is fixed
- [ ] Payment manipulation protection active
- [ ] XSS protection in chat interface
- [ ] IDOR protection in API routes
- [ ] Webhook signature verification enforced
- [ ] Rate limiting working properly
- [ ] Error messages don't leak sensitive data
- [ ] Session management security enhanced
- [ ] Client-side security controls in place

## 🌐 Accessing Your Deployed Application

### Production URLs
- **Main Application:** https://your-domain.vercel.app
- **Dashboard:** https://your-domain.vercel.app/dashboard
- **Pricing:** https://your-domain.vercel.app/pricing

### UAT URLs
- **UAT Environment:** https://your-uat-domain.vercel.app
- **UAT Dashboard:** https://your-uat-domain.vercel.app/dashboard/uat

### Test Accounts (UAT Only)
- **Premium:** thomas.wagner@uat-demo.de / DemoPass123!
- **Standard:** hans.mueller@uat-demo.de / DemoPass123!
- **Trial:** maria.schmidt@uat-demo.de / DemoPass123!

## 🚨 Emergency Rollback

If issues occur after deployment:

1. **Immediate Rollback:**
   ```bash
   # In Vercel dashboard, rollback to previous deployment
   vercel --prod --rollback
   ```

2. **Database Rollback (if needed):**
   ```sql
   -- Restore from backup in Supabase dashboard
   ```

3. **Environment Variable Reset:**
   - Revert any changed environment variables
   - Clear Vercel function cache

## 📞 Support

For deployment issues:
1. Check Vercel deployment logs
2. Check Supabase database logs
3. Verify all environment variables are set correctly
4. Test locally with production environment variables

**Security Status:** ✅ All critical vulnerabilities fixed
**Deployment Status:** ✅ Ready for production
**Testing Status:** ✅ UX/UI review completed