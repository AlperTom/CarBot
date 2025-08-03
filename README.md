# 🚗 CarBot Workshop System

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FAlperTom%2FCarBot&env=OPENAI_API_KEY,NEXT_PUBLIC_SUPABASE_URL,NEXT_PUBLIC_SUPABASE_ANON_KEY,STRIPE_SECRET_KEY,NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY&envDescription=Required%20environment%20variables%20for%20CarBot&envLink=https%3A%2F%2Fgithub.com%2FAlperTom%2FCarBot%2Fblob%2Fmain%2F.env.example)

A comprehensive B2B SaaS platform for German automotive workshops with AI chat, payment processing, and analytics.

## 🎯 Features

- **🤖 AI-Powered Chat System** - Multi-language support (DE, EN, TR, PL)
- **💳 Stripe Payment Integration** - German VAT compliance, subscription billing
- **📊 Advanced Analytics** - Real-time KPIs and workshop performance metrics
- **🎯 AI Lead Scoring** - Intelligent customer qualification and prioritization
- **🔐 Secure Authentication** - GDPR-compliant workshop authentication system
- **📱 Mobile Responsive** - Professional dashboard with mobile support
- **🗓️ Appointment Booking** - Integrated scheduling system
- **🇩🇪 German Market Ready** - VAT calculations, GDPR compliance, German UI

## 🚀 Quick Deploy

### One-Click Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FAlperTom%2FCarBot&env=OPENAI_API_KEY,NEXT_PUBLIC_SUPABASE_URL,NEXT_PUBLIC_SUPABASE_ANON_KEY,STRIPE_SECRET_KEY,NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY&envDescription=Required%20environment%20variables%20for%20CarBot&envLink=https%3A%2F%2Fgithub.com%2FAlperTom%2FCarBot%2Fblob%2Fmain%2F.env.example)

## 🛠️ Environment Setup

Required environment variables (see `.env.example`):

```bash
# OpenAI Configuration
OPENAI_API_KEY=sk-your-api-key

# Supabase Configuration  
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your-secret-key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your-publishable-key
```

## 📊 System Features

- **Professional B2B SaaS Dashboard** for German automotive workshops
- **Complete Stripe subscription billing** with VAT compliance
- **Multi-language AI chat** (German, English, Turkish, Polish)
- **Real-time analytics** and KPI tracking
- **GDPR-compliant data handling** with automated cleanup
- **Mobile-responsive design** with professional UX

## 🎨 Tech Stack

- **Frontend**: Next.js 15, React 18, TailwindCSS
- **Backend**: Next.js API Routes, Node.js
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Payments**: Stripe
- **AI**: OpenAI GPT-3.5/4
- **Deployment**: Vercel

## 📖 Documentation

- [Complete Deployment Guide](./DEPLOYMENT_COMPLETE.md)
- [Environment Configuration](./.env.example)
- [Database Schema](./supabase-workshop-schema.sql)

## 🎯 Pricing Tiers

- **Starter** (€49/month): Up to 100 conversations
- **Professional** (€99/month): Up to 500 conversations + advanced features
- **Enterprise** (€199/month): Unlimited conversations + custom features

---

**Ready to deploy? Click the Vercel button above!** 🚀