# CarBot Email System - Complete Setup Guide

## 🚀 Overview

This guide provides step-by-step instructions to configure and deploy the CarBot email system for German automotive workshops. The system includes automated emails for registration, password resets, lead notifications, and more.

## ⚡ Quick Start (5 Minutes)

### 1. Get Resend API Key
1. Go to [resend.com](https://resend.com) and create an account
2. Add and verify your domain (e.g., `carbot.de`)
3. Create an API key in the dashboard
4. Copy the API key (starts with `re_`)

### 2. Update Environment Variables
Add these lines to your `.env.local` file:

```env
# Email Configuration - RESEND (Recommended for German market)
RESEND_API_KEY=re_your_actual_api_key_here
EMAIL_FROM=noreply@your-domain.de
EMAIL_FROM_NAME=Your Workshop Name

# Workshop Configuration
WORKSHOP_EMAIL=your-email@domain.de

# App Configuration
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_SITE_URL=https://your-domain.com

# Email Settings
SMTP_ENABLED=true
```

### 3. Test the System
```bash
# Start your development server
npm run dev

# Test email configuration
curl http://localhost:3000/api/test/email?type=config-test

# Or visit the dashboard
# http://localhost:3000/api/test/email
```

## 📧 Email Service Options

### Option 1: Resend (Recommended)
- **Best for**: German market, GDPR compliance, reliability
- **Cost**: Free tier: 100 emails/day, €20/month for 50,000 emails
- **Setup time**: 5 minutes
- **Domain verification**: Required

### Option 2: SendGrid
```env
SENDGRID_API_KEY=SG.your_api_key_here
EMAIL_FROM=noreply@your-domain.de
```

### Option 3: Mailgun
```env
MAILGUN_API_KEY=your_mailgun_key
MAILGUN_DOMAIN=your-domain.de
EMAIL_FROM=noreply@your-domain.de
```

### Option 4: SMTP (Gmail, Outlook, etc.)
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=your-email@gmail.com
```

## 🔧 Complete Configuration

### Environment Variables Explained

```env
# Required - Email Service
RESEND_API_KEY=re_xxxxxxxxx                    # Your Resend API key
EMAIL_FROM=noreply@carbot.de                   # Sender email address
EMAIL_FROM_NAME=CarBot                         # Sender display name

# Required - Workshop Settings
WORKSHOP_EMAIL=workshop@your-domain.de         # Where lead notifications go

# Required - App URLs
NEXT_PUBLIC_APP_URL=https://your-domain.com    # Your app domain
NEXT_PUBLIC_SITE_URL=https://your-domain.com   # Same as above

# Optional - Advanced Settings
SMTP_ENABLED=true                              # Enable email sending
EMAIL_REPLY_TO=support@your-domain.de          # Reply-to address
EMAIL_UNSUBSCRIBE_URL=https://your-domain.com/unsubscribe
```

### Domain Setup for Resend

1. **Add Domain in Resend Dashboard**
   ```
   Domain: your-domain.de
   ```

2. **Add DNS Records** (provided by Resend)
   ```dns
   Type: TXT
   Name: @
   Value: v=spf1 include:spf.resend.com ~all

   Type: CNAME  
   Name: resend._domainkey
   Value: resend._domainkey.resend.com

   Type: TXT
   Name: _dmarc
   Value: v=DMARC1; p=quarantine; rua=mailto:dmarc@your-domain.de
   ```

3. **Verify Domain** - Wait for DNS propagation (up to 24 hours)

## 📬 Email Types & Templates

The system includes these professionally designed German email templates:

### 1. Welcome Email (`sendWelcomeEmail`)
- **Trigger**: After successful registration
- **Purpose**: Welcome new workshop owners
- **Includes**: Login link, next steps, support information

### 2. Email Confirmation (`sendEmailConfirmation`)
- **Trigger**: Account email verification
- **Purpose**: Verify email address for account activation
- **Includes**: Confirmation link, security notice

### 3. Password Reset (`sendPasswordResetEmail`)
- **Trigger**: Password reset request
- **Purpose**: Secure password reset process
- **Includes**: Reset link, security tips, expiration notice

### 4. Lead Notification (`sendLeadNotification`)
- **Trigger**: New customer inquiry via chat widget
- **Purpose**: Notify workshop of new leads
- **Includes**: Customer details, chat history, action buttons

## 🧪 Testing & Monitoring

### Email Test API

Test all email functionality with the built-in API:

```bash
# Test configuration
GET /api/test/email?type=config-test

# Test welcome email
POST /api/test/email
{
  "type": "welcome",
  "email": "test@example.com",
  "workshopName": "Test Werkstatt",
  "ownerName": "Max Mustermann"
}

# Test password reset
POST /api/test/email
{
  "type": "password-reset",
  "email": "test@example.com",
  "resetUrl": "https://your-domain.com/auth/reset-password?token=test123"
}

# Test lead notification
POST /api/test/email
{
  "type": "lead-notification",
  "customerName": "Max Mustermann",
  "telefon": "+49 30 12345678",
  "anliegen": "Bremsen quietschen",
  "workshopEmail": "workshop@example.com"
}
```

### Email Status Dashboard

Access the monitoring dashboard at:
```
http://localhost:3000/dashboard/email-status
```

Features:
- ⚙️ Configuration status checking
- 🧪 Live email testing
- 📝 Template overview
- 📊 Email delivery statistics

## 🔍 Troubleshooting

### Common Issues

#### 1. Emails Not Sending
```bash
# Check configuration
curl http://localhost:3000/api/test/email?type=config-test

# Common causes:
# - RESEND_API_KEY not set or invalid
# - Domain not verified in Resend
# - Email FROM address not matching verified domain
```

#### 2. Emails Going to Spam
```dns
# Ensure proper DNS records:
SPF Record: v=spf1 include:spf.resend.com ~all
DKIM: Configured via Resend dashboard
DMARC: v=DMARC1; p=quarantine; rua=mailto:dmarc@your-domain.de
```

#### 3. Development vs Production
```env
# Development (.env.local)
RESEND_API_KEY=your-resend-api-key-here  # Will log instead of send
WORKSHOP_EMAIL=test@example.com

# Production
RESEND_API_KEY=re_actual_api_key_here    # Will send emails
WORKSHOP_EMAIL=real-workshop@domain.de
```

### Error Messages & Solutions

| Error | Solution |
|-------|----------|
| "RESEND_API_KEY not configured" | Add valid API key to .env.local |
| "Domain not verified" | Verify domain in Resend dashboard |
| "Email rate limit exceeded" | Upgrade Resend plan or wait |
| "Invalid email format" | Check EMAIL_FROM format |
| "Authentication failed" | Regenerate API key |

## 🚀 Deployment

### Pre-Deployment Checklist

- [ ] ✅ Domain verified in Resend
- [ ] ✅ DNS records configured (SPF, DKIM, DMARC)
- [ ] ✅ API key valid and working
- [ ] ✅ All environment variables set
- [ ] ✅ Email templates tested
- [ ] ✅ Lead notification tested
- [ ] ✅ Test emails received successfully

### Production Environment Variables

```env
# Production .env.local
RESEND_API_KEY=re_live_xxxxxxxxxxxxxxxx
EMAIL_FROM=noreply@your-actual-domain.de
EMAIL_FROM_NAME=Your Actual Workshop Name
WORKSHOP_EMAIL=your-real-email@domain.de
NEXT_PUBLIC_APP_URL=https://your-actual-domain.com
NEXT_PUBLIC_SITE_URL=https://your-actual-domain.com
SMTP_ENABLED=true
```

### Vercel Deployment

1. **Add Environment Variables in Vercel Dashboard**
   ```bash
   # In Vercel project settings > Environment Variables
   RESEND_API_KEY=re_live_xxxxxxxxxxxxxxxx
   EMAIL_FROM=noreply@your-domain.de
   EMAIL_FROM_NAME=Your Workshop Name
   WORKSHOP_EMAIL=workshop@your-domain.de
   NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
   NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
   ```

2. **Deploy and Test**
   ```bash
   vercel --prod
   
   # Test production emails
   curl https://your-domain.vercel.app/api/test/email?type=config-test
   ```

## 📊 Monitoring & Analytics

### Email Delivery Tracking

The system automatically tracks:
- ✅ Email sending attempts
- ✅ Success/failure rates  
- ✅ Email IDs for tracking
- ✅ Error messages and debugging info

### Database Logging

All emails are logged in the `email_notifications` table:
```sql
SELECT 
  to_email,
  subject,
  status,
  sent_at,
  created_at
FROM email_notifications
ORDER BY created_at DESC
LIMIT 50;
```

### Performance Metrics

Monitor these key metrics:
- **Delivery Rate**: % of emails successfully sent
- **Response Time**: Time from trigger to email sent
- **Error Rate**: % of failed email attempts
- **Lead Conversion**: Emails leading to customer contact

## 🔒 Security & GDPR Compliance

### Data Protection
- ✅ No sensitive data in email logs
- ✅ Email addresses encrypted in transit
- ✅ Automatic cleanup of old email records
- ✅ GDPR-compliant unsubscribe mechanism

### Best Practices
1. **Rate Limiting**: Built-in protection against spam
2. **Authentication**: Domain verification prevents spoofing
3. **Encryption**: All emails sent via TLS/SSL
4. **Audit Trail**: Complete logging for compliance

## 📞 Support & Maintenance

### Regular Maintenance Tasks

**Monthly:**
- [ ] Check email delivery rates
- [ ] Verify domain settings
- [ ] Review error logs
- [ ] Test all email types

**Quarterly:**
- [ ] Update email templates
- [ ] Review and optimize subject lines
- [ ] Check compliance with email regulations
- [ ] Performance optimization

### Getting Help

1. **Email Test API**: `/api/test/email` for diagnostics
2. **Status Dashboard**: Monitor system health
3. **Error Logs**: Check Next.js console for issues
4. **Resend Dashboard**: Monitor delivery and bounces

### Emergency Procedures

**If emails stop working:**
1. Check `/api/test/email?type=config-test`
2. Verify API key in Resend dashboard
3. Check DNS records
4. Review error logs
5. Test with different email address

## 🎯 Performance Optimization

### Email Performance Tips

1. **Subject Line Optimization**
   - Keep under 50 characters
   - Include relevant keywords (BMW, Mercedes, etc.)
   - Use action-oriented language

2. **Template Optimization**
   - Mobile-responsive design
   - Fast loading images
   - Clear call-to-action buttons

3. **Delivery Optimization**
   - Send during business hours (9 AM - 5 PM)
   - Avoid weekends for business emails
   - Use consistent sender address

### System Performance

- **Async Processing**: Emails sent asynchronously
- **Error Handling**: Graceful failure handling
- **Retry Logic**: Automatic retry for failed sends
- **Rate Limiting**: Prevents hitting API limits

---

## 🎉 Success! 

Your CarBot email system is now configured and ready to help German automotive workshops:

- ✅ **Registration emails** welcome new workshop owners
- ✅ **Password reset emails** provide secure account recovery
- ✅ **Lead notifications** ensure no customer inquiry is missed
- ✅ **Professional templates** maintain brand consistency
- ✅ **German language** serves your target market
- ✅ **GDPR compliance** protects customer data
- ✅ **Monitoring tools** track performance

The system will automatically handle all email communications, helping workshops stay connected with their customers and grow their business through CarBot's AI-powered platform.

**Need help?** Check the troubleshooting section or test the system using the built-in API endpoints.