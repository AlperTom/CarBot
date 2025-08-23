# 🔐 GitHub Workflow Secrets Configuration

This document outlines the required secrets and environment variables for CarBot's GitHub workflow automation.

## Required Repository Secrets

### Production Environment Secrets

#### **Authentication & Database**
```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...your-anon-key
SUPABASE_SERVICE_ROLE_KEY=eyJ...your-service-role-key

# JWT Configuration
JWT_SECRET=your-strong-jwt-secret-key

# Database URL (if using external database)
DATABASE_URL=postgresql://username:password@host:port/database
```

#### **Email Service**
```bash
# Resend API Configuration
RESEND_API_KEY=re_...your-resend-api-key

# Email Configuration
FROM_EMAIL=noreply@carbot.chat
SUPPORT_EMAIL=support@carbot.chat
```

#### **Payment Processing** (Future)
```bash
# Stripe Configuration
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

#### **Monitoring & Analytics**
```bash
# Production Monitoring
PRODUCTION_URL=https://car-gblttmonj-car-bot.vercel.app
STAGING_URL=https://carbot-staging.vercel.app
TARGET_DOMAIN=carbot.chat

# Error Monitoring (Optional)
SENTRY_DSN=https://...@sentry.io/...
SENTRY_AUTH_TOKEN=...

# Analytics (Optional)
GOOGLE_ANALYTICS_ID=GA_MEASUREMENT_ID
```

### GitHub Workflow Secrets

#### **Deployment**
```bash
# Vercel Deployment (if using Vercel CLI)
VERCEL_TOKEN=your-vercel-token
VERCEL_ORG_ID=your-organization-id
VERCEL_PROJECT_ID=your-project-id
```

#### **Notification & Communication**
```bash
# Slack Integration (Optional)
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...
SLACK_BOT_TOKEN=xoxb-...

# Discord Integration (Optional)
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...

# Email Notifications
NOTIFICATION_EMAIL=alerts@carbot.chat
```

#### **German Market Compliance**
```bash
# GDPR Compliance Monitoring
GDPR_COMPLIANCE_ENDPOINT=https://api.carbot.chat/gdpr/check
PRIVACY_POLICY_URL=https://carbot.chat/privacy
TERMS_OF_SERVICE_URL=https://carbot.chat/terms
```

## Environment Variables (Public)

These are set in workflow files and can be public:

```yaml
env:
  NODE_VERSION: '18'
  PRODUCTION_URL: https://car-gblttmonj-car-bot.vercel.app
  STAGING_URL: https://carbot-staging.vercel.app
  TARGET_DOMAIN: carbot.chat
  DEFAULT_LOCALE: de-DE
  SUPPORTED_LOCALES: de-DE,en-US
```

## How to Set Repository Secrets

### Via GitHub Web Interface

1. **Navigate to Repository Settings**
   - Go to your CarBot repository on GitHub
   - Click on "Settings" tab
   - Select "Secrets and variables" → "Actions"

2. **Add New Repository Secret**
   - Click "New repository secret"
   - Enter the secret name (e.g., `SUPABASE_SERVICE_ROLE_KEY`)
   - Paste the secret value
   - Click "Add secret"

3. **Repeat for All Required Secrets**
   - Add all secrets listed above
   - Verify each secret is correctly added

### Via GitHub CLI

```bash
# Set secrets using GitHub CLI
gh secret set SUPABASE_SERVICE_ROLE_KEY --body "your-secret-value"
gh secret set RESEND_API_KEY --body "your-resend-key"
gh secret set JWT_SECRET --body "your-jwt-secret"

# Set multiple secrets from file
gh secret set --env-file .env.secrets
```

### Environment-Specific Secrets

For different environments, use environment-specific naming:

```bash
# Production
PROD_SUPABASE_URL=...
PROD_RESEND_API_KEY=...

# Staging
STAGING_SUPABASE_URL=...
STAGING_RESEND_API_KEY=...

# Development
DEV_SUPABASE_URL=...
DEV_RESEND_API_KEY=...
```

## Security Best Practices

### Secret Management
- ✅ **Never commit secrets to repository**
- ✅ **Use strong, unique secrets for production**
- ✅ **Rotate secrets regularly (quarterly)**
- ✅ **Use environment-specific secrets**
- ✅ **Limit secret access to necessary workflows only**

### Secret Validation
```yaml
# Example secret validation in workflow
- name: 🔐 Validate Required Secrets
  run: |
    required_secrets=(
      "SUPABASE_SERVICE_ROLE_KEY"
      "RESEND_API_KEY"
      "JWT_SECRET"
    )
    
    for secret in "${required_secrets[@]}"; do
      if [ -z "${!secret}" ]; then
        echo "❌ Missing required secret: $secret"
        exit 1
      fi
    done
    
    echo "✅ All required secrets are present"
```

### German Market Compliance Secrets

#### GDPR/DSGVO Compliance
```bash
# Cookie Consent Management
COOKIE_CONSENT_API_KEY=...

# Data Processing Tracking
DATA_PROCESSOR_API_KEY=...

# German Legal Requirements
LEGAL_COMPLIANCE_WEBHOOK=...
```

## Workflow-Specific Configuration

### Issue Management Workflows
```bash
# Auto-assignment configuration
GITHUB_TOKEN=ghp_... # Automatically provided by GitHub
DEFAULT_ASSIGNEE=tech-lead-username
EMERGENCY_CONTACT=emergency@carbot.chat
```

### Production Monitoring
```bash
# Health check endpoints
HEALTH_CHECK_TOKEN=... # If health endpoints require auth
MONITORING_WEBHOOK=... # For external monitoring services
```

### Business Integration
```bash
# Business metrics
ANALYTICS_API_KEY=...
CUSTOMER_SUCCESS_WEBHOOK=...
REVENUE_TRACKING_TOKEN=...
```

## Testing Secrets Configuration

Create a test script to validate all secrets:

```bash
#!/bin/bash
# test-secrets.sh

echo "🔍 Testing GitHub Secrets Configuration..."

# Test Supabase connection
if curl -s -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
   "$NEXT_PUBLIC_SUPABASE_URL/rest/v1/" | grep -q "swagger"; then
  echo "✅ Supabase connection successful"
else
  echo "❌ Supabase connection failed"
fi

# Test Resend API
if curl -s -H "Authorization: Bearer $RESEND_API_KEY" \
   "https://api.resend.com/domains" | grep -q "data"; then
  echo "✅ Resend API connection successful"
else
  echo "❌ Resend API connection failed"
fi

echo "🔍 Secrets validation completed"
```

## Emergency Access

### Production Issue Response
```bash
# Emergency contacts (store in secrets)
EMERGENCY_TECH_LEAD=+49...
EMERGENCY_PRODUCT_OWNER=+49...
EMERGENCY_DEVOPS=+49...

# Emergency deployment rollback
VERCEL_ROLLBACK_TOKEN=... # With deployment rollback permissions
```

### Security Incident Response
```bash
# Incident response
SECURITY_INCIDENT_WEBHOOK=...
COMPLIANCE_OFFICER_EMAIL=...
LEGAL_TEAM_EMAIL=...
```

## Monitoring Secret Usage

Add secret usage monitoring to workflows:

```yaml
- name: 📊 Monitor Secret Usage
  run: |
    echo "📊 Secret usage audit for workflow: ${{ github.workflow }}"
    echo "Repository: ${{ github.repository }}"
    echo "Triggered by: ${{ github.actor }}"
    echo "Timestamp: $(date -u +"%Y-%m-%dT%H:%M:%SZ")"
    
    # Log which secrets are being used (without values)
    echo "Secrets in use:"
    [ ! -z "$SUPABASE_SERVICE_ROLE_KEY" ] && echo "- Supabase Service Role Key: ✅"
    [ ! -z "$RESEND_API_KEY" ] && echo "- Resend API Key: ✅"
    [ ! -z "$JWT_SECRET" ] && echo "- JWT Secret: ✅"
```

## Next Steps

1. **Set All Required Secrets**
   - Add all production secrets to repository
   - Verify each secret works correctly

2. **Test Workflow Execution**
   - Run a test workflow to verify secrets
   - Check all monitoring and notification systems

3. **Set up Secret Rotation**
   - Schedule quarterly secret rotation
   - Document secret rotation procedures

4. **Configure Monitoring**
   - Set up alerts for secret usage
   - Monitor for unauthorized access

5. **German Market Setup**
   - Add GDPR compliance secrets
   - Configure German language notifications
   - Set up local compliance monitoring

---

**Security Notice:** This document contains references to secret names but no actual secret values. Always follow security best practices when handling sensitive information.