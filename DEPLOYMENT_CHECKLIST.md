# CarBot Deployment Checklist

## Pre-Deployment Validation ✅

### 1. Local Environment Testing
- [ ] **Dependencies Installed**: All npm packages installed without errors
- [ ] **Linting Passes**: `npm run lint` executes successfully
- [ ] **Type Checking**: `npm run type-check` passes
- [ ] **Local Build**: `npm run build` completes without memory errors
- [ ] **Local Start**: `npm run start` serves the application correctly
- [ ] **All Routes Accessible**: Test key application routes locally

### 2. Environment Variables Configuration
- [ ] **Production .env**: `.env.production` configured with production values
- [ ] **Supabase URLs**: Production Supabase URL and keys configured
- [ ] **API Keys**: All API keys (OpenAI, Stripe, Resend) set for production
- [ ] **Domain URLs**: All `NEXT_PUBLIC_APP_URL` values point to production domain
- [ ] **Email Configuration**: Production email settings configured
- [ ] **Security Keys**: `NEXTAUTH_SECRET` and other security keys generated

### 3. Database & External Services
- [ ] **Supabase Database**: Production database schema deployed
- [ ] **Stripe Configuration**: Production Stripe keys and webhooks configured
- [ ] **Email Service**: Resend API configured for production domain
- [ ] **Directus CMS**: Production CMS instance configured (if using)

## Build & Memory Optimizations ⚡

### Applied Optimizations
- [x] **Node.js Memory Limit**: Increased to 4GB (`--max-old-space-size=4096`)
- [x] **Bundle Splitting**: Optimized webpack configuration for smaller chunks
- [x] **Package Optimization**: Enabled `optimizePackageImports` for major packages
- [x] **SWC Minification**: Enabled for faster builds
- [x] **Cross-env**: Added for consistent environment variable handling

### Build Commands Available
```bash
# Standard build with memory optimization
npm run build

# Production build with full optimization
npm run build:production

# Bundle analysis (for debugging)
npm run build:analyze

# Full validation pipeline
npm run validate:local
```

## UAT Deployment Steps 🚀

### 1. Pre-UAT Validation
```bash
# Run complete validation
npm run validate:local

# This runs:
# - npm run lint
# - npm run type-check  
# - npm run build
```

### 2. UAT Environment Setup
- [ ] **UAT Domain**: Configure UAT-specific domain
- [ ] **UAT Database**: Separate Supabase project for UAT
- [ ] **UAT API Keys**: Test API keys configured
- [ ] **UAT Mode**: `UAT_MODE=true` in environment
- [ ] **Demo Data**: `DEMO_DATA_ENABLED=true` for testing

### 3. Deployment Platform Configuration

#### Vercel Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to UAT
vercel --env UAT_MODE=true

# Deploy to Production
vercel --prod
```

#### Alternative Platforms
- **Netlify**: Configure build command as `npm run build:production`
- **Railway**: Set `NODE_OPTIONS=--max-old-space-size=4096` in environment
- **Digital Ocean**: Use Docker with memory limits configured

## Post-Deployment Validation ✅

### 1. Functional Testing
- [ ] **Homepage Loads**: Main page loads without errors
- [ ] **Authentication**: Login/register functionality works
- [ ] **Dashboard**: User dashboard accessible and functional
- [ ] **Chat Widget**: AI chat functionality operational
- [ ] **Payments**: Stripe integration working (test mode for UAT)
- [ ] **Email**: Email notifications sending correctly

### 2. Performance Testing
- [ ] **Page Load Times**: All pages load within acceptable limits
- [ ] **API Response Times**: Backend APIs responding quickly
- [ ] **Memory Usage**: No memory leaks in production
- [ ] **Bundle Size**: JavaScript bundles optimized and cached

### 3. Security Testing
- [ ] **Environment Variables**: No sensitive data exposed in frontend
- [ ] **HTTPS**: All connections use HTTPS
- [ ] **CORS**: Proper CORS configuration
- [ ] **Rate Limiting**: API rate limiting functional

## Monitoring & Maintenance 📊

### 1. Production Monitoring
- [ ] **Error Tracking**: Sentry or similar error tracking configured
- [ ] **Performance Monitoring**: Core Web Vitals tracking
- [ ] **Uptime Monitoring**: Service health checks configured
- [ ] **Database Monitoring**: Supabase monitoring enabled

### 2. Regular Maintenance
- [ ] **Weekly Checks**: Monitor performance and error rates
- [ ] **Monthly Updates**: Keep dependencies updated
- [ ] **Quarterly Reviews**: Review and optimize performance
- [ ] **Backup Strategy**: Database and asset backup procedures

## Rollback Plan 🔄

### Quick Rollback Steps
1. **Immediate**: Revert to last known good deployment
2. **Database**: Restore database snapshot if needed
3. **DNS**: Update DNS to point to backup instance
4. **Communication**: Notify users of temporary issues

### Rollback Commands
```bash
# Vercel rollback to previous deployment
vercel rollback

# Manual rollback
git revert HEAD
npm run build:production
# Redeploy
```

## Success Criteria ✨

### UAT Success
- [ ] All functionality works as expected
- [ ] Performance meets requirements
- [ ] No critical security issues
- [ ] Stakeholder approval received

### Production Success  
- [ ] Zero downtime deployment
- [ ] All monitoring systems operational
- [ ] User feedback positive
- [ ] Business metrics stable or improved

## Emergency Contacts 🚨

- **Technical Lead**: [Contact Info]
- **DevOps Engineer**: [Contact Info]
- **Product Owner**: [Contact Info]
- **On-call Support**: [Contact Info]

---

**Last Updated**: {BUILD_TIME}
**Deployment Version**: 2.0.0
**Build Configuration**: Optimized for production with 4GB memory limit

## Quick Commands Reference

```bash
# Full validation before deployment
npm run validate:local

# Production build
npm run build:production  

# Deploy to UAT (Vercel)
npm run deploy:uat

# Analyze bundle size
npm run build:analyze

# Emergency rollback
vercel rollback
```