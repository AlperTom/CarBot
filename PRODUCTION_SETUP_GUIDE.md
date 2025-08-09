# CarBot Production Setup Guide

This guide covers the complete setup of CarBot for production deployment, including database configuration, authentication, and website integration.

## 🚀 Quick Start

### Prerequisites

1. **Node.js 18+** - Latest LTS version
2. **Supabase Account** - For database and authentication
3. **OpenAI API Key** - For AI chat functionality
4. **Domain** - For production deployment

### 1. Database Setup

#### Option A: Automated Setup (Recommended)

```bash
# Clone the repository
git clone [your-repo-url]
cd CarBot

# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local

# Setup database
node scripts/setup-database.js setup
```

#### Option B: Manual Supabase Setup

1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create new project
   - Note down your project URL and keys

2. **Run Database Migration**
   - Open Supabase SQL Editor
   - Copy contents of `database/supabase-setup.sql`
   - Execute the SQL script

3. **Configure Environment Variables**
   ```bash
   # Copy and edit environment file
   cp .env.example .env.local
   ```

### 2. Environment Configuration

Edit `.env.local` with your actual values:

```env
# === REQUIRED ===
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
OPENAI_API_KEY=sk-your_openai_api_key_here
JWT_SECRET=your_super_secure_jwt_secret_min_32_chars_long

# === RECOMMENDED ===
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NODE_ENV=production
```

### 3. Features Overview

#### 🌐 Complete Website System

CarBot now provides complete website functionality for automotive workshops:

- **Multi-page Routing** - Full website navigation
- **SEO-Optimized Pages** - Home, About, Services, Contact
- **German Legal Compliance** - Impressum, Datenschutz pages
- **GDPR Cookie Consent** - Full compliance management
- **Template Integration** - Works with all 5 automotive templates

#### 🤖 Enhanced Chat System

- **Intelligent AI Responses** - German automotive expertise
- **JWT Authentication** - Secure API access
- **Rate Limiting** - Production-ready security
- **Multiple Endpoints** - Original + new website chat API

#### 🔧 Automotive Templates

1. **Klassische Werkstatt** - Traditional German workshop
2. **Moderne Autowerkstatt** - Modern tech-focused service
3. **Premium Service** - Luxury vehicle specialist
4. **Familienbetrieb** - Family-friendly workshop
5. **Elektro & Hybrid Spezialist** - Electric vehicle expert

## 📊 Database Schema

### Core Tables

- **workshops** - Workshop business information
- **client_keys** - API access keys with domain restrictions
- **chat_sessions** - Chat conversation sessions
- **chat_messages** - Individual chat messages
- **subscriptions** - Subscription management
- **usage_tracking** - Usage analytics and billing
- **user_sessions** - JWT session management
- **audit_logs** - Security and activity logging

### Key Features

- **Row Level Security (RLS)** - Workshop-based data isolation
- **Performance Indexes** - Optimized for high traffic
- **Audit Logging** - Complete activity tracking
- **Automatic Cleanup** - Old data management
- **GDPR Compliance** - Data retention and deletion

## 🔐 Authentication System

### JWT Implementation

- **Access Tokens** - 24-hour expiration
- **Refresh Tokens** - 7-day expiration
- **Token Blacklisting** - Secure logout
- **Rate Limiting** - Brute force protection

### Usage

```javascript
import { useAuth } from '../hooks/useAuth'

function MyComponent() {
  const { signin, signout, user, isAuthenticated } = useAuth()
  
  const handleLogin = async () => {
    const result = await signin('user@example.com', 'password')
    if (result.success) {
      // Login successful
    }
  }
  
  return (
    <div>
      {isAuthenticated ? (
        <p>Welcome, {user.email}!</p>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
    </div>
  )
}
```

## 🌐 Website Integration

### Template Wrapper Usage

```javascript
import TemplateWebsiteWrapper from '../components/integration/TemplateWebsiteWrapper'

function WorkshopWebsite() {
  return (
    <TemplateWebsiteWrapper
      templateType="klassische"
      config={{
        businessName: "Ihre Werkstatt GmbH",
        phone: "+49 30 123456789",
        email: "info@ihre-werkstatt.de",
        address: {
          street: "Hauptstraße 123",
          city: "Berlin",
          postalCode: "10115"
        }
      }}
      enableFullWebsite={true}
    />
  )
}
```

### Chat Widget Integration

```javascript
import ChatWidget from '../components/shared/ChatWidget'

function MyPage() {
  return (
    <div>
      {/* Your page content */}
      
      <ChatWidget
        config={{
          businessName: "Ihre Werkstatt",
          phone: "+49 30 123456789",
          templateType: "klassische"
        }}
        clientKey="ck_live_your_client_key"
        position="bottom-right"
      />
    </div>
  )
}
```

## 🎯 Client Key Management

### Development Keys

Use mock keys for development (automatically available):

```javascript
const developmentKeys = {
  klassische: 'ck_test_klassische_werkstatt_123',
  moderne: 'ck_test_moderne_werkstatt_456',
  premium: 'ck_test_premium_service_789',
  family: 'ck_test_family_werkstatt_abc',
  electric: 'ck_test_elektro_werkstatt_xyz'
}
```

### Production Keys

Generate production keys via the dashboard or API:

```bash
# Create client key
curl -X POST "https://yourapi.com/api/client-keys" \
  -H "Authorization: Bearer your_jwt_token" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Production Website",
    "authorizedDomains": ["yourdomain.com", "www.yourdomain.com"]
  }'
```

## 📱 API Endpoints

### Chat APIs

```bash
# Original chat API (Supabase integrated)
POST /api/widget/chat
{
  "message": "Hallo, ich brauche Hilfe",
  "clientKey": "ck_live_...",
  "sessionId": "session_123"
}

# New website chat API (standalone)
POST /api/widget/website-chat
{
  "message": "Ich möchte einen Termin buchen",
  "sessionId": "session_456",
  "workshopConfig": { ... }
}
```

### Authentication APIs

```bash
# Login with JWT
POST /api/auth/signin
{
  "email": "user@workshop.com",
  "password": "secure_password",
  "useJWT": true
}

# Refresh token
POST /api/auth/refresh
{
  "refreshToken": "refresh_token_here"
}

# Logout
POST /api/auth/logout
Authorization: Bearer access_token_here
{
  "refreshToken": "refresh_token_here",
  "allDevices": false
}
```

## 🚀 Deployment

### Vercel Deployment (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
vercel --prod

# Set environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add OPENAI_API_KEY
vercel env add JWT_SECRET
```

### Docker Deployment

```dockerfile
# Dockerfile example
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

### Environment Variables

Production environment variables:

```env
NODE_ENV=production
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_service_key
OPENAI_API_KEY=sk-your_production_openai_key
JWT_SECRET=your_super_secure_production_jwt_secret
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

## 🔧 Maintenance

### Database Maintenance

```bash
# Run cleanup
node scripts/setup-database.js clean

# Health check
node scripts/setup-database.js health
```

### Monitoring

- **Error Logs** - Stored in `error_logs` table
- **Usage Tracking** - Automatic usage metrics
- **Audit Logs** - Complete activity tracking
- **Performance** - Built-in performance monitoring

### Backup Strategy

1. **Daily Supabase Backups** - Automatic
2. **Weekly Full Export** - Manual via CLI
3. **Real-time Replication** - For enterprise

## 🛡️ Security

### Production Checklist

- [ ] JWT_SECRET is 32+ characters
- [ ] RLS policies are enabled
- [ ] Client keys have domain restrictions
- [ ] Rate limiting is configured
- [ ] HTTPS is enforced
- [ ] Environment variables are secure
- [ ] Database backups are automated
- [ ] Audit logging is enabled

### GDPR Compliance

- **Cookie Consent** - Automatic management
- **Data Retention** - 365-day default
- **Right to Delete** - Built-in functionality
- **Privacy Policy** - Auto-generated pages
- **Audit Trail** - Complete activity logs

## 🎯 Template Configuration

Each template can be customized with:

```javascript
const templateConfig = {
  businessName: "Werkstatt Name",
  tagline: "Ihr Slogan",
  phone: "+49 30 123456789",
  email: "info@werkstatt.de",
  address: {
    street: "Straße 123",
    city: "Stadt",
    postalCode: "12345"
  },
  templateType: "klassische", // or moderne, premium, family, electric
  theme: {
    primary: "#007bff",
    secondary: "#6c757d", 
    accent: "#28a745"
  },
  specializations: ["general", "classic"],
  services: {
    inspections: true,
    repairs: true,
    maintenance: true,
    // ... more services
  }
}
```

## 📞 Support

For setup assistance:

1. **Documentation** - Check this guide first
2. **Database Issues** - Run health check script
3. **API Issues** - Check client key configuration
4. **Template Issues** - Verify template configuration

## 🎉 Success!

Your CarBot installation is now ready for production with:

- ✅ Complete website system
- ✅ Intelligent chat functionality  
- ✅ JWT authentication
- ✅ German legal compliance
- ✅ Production-ready database
- ✅ Multi-template support
- ✅ GDPR compliance
- ✅ Performance monitoring

Welcome to the future of automotive workshop websites! 🚗💨