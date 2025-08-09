# CarBot MVP - Comprehensive Project Specification
## German Automotive Workshop Chatbot System

**Version:** 1.0  
**Date:** January 2025  
**Product Owner:** CarBot Development Team  
**Target Market:** German Automotive Workshops

---

## 🎯 EXECUTIVE SUMMARY

CarBot MVP delivers essential chatbot functionality for German automotive workshops with three core features:
1. **Client Keys Management** - One key per website for widget embedding
2. **Landing Page Templates** - 5 professional templates (Premium package only)
3. **Simple Widget Embedding** - One-line script integration

**Success Metrics:** 3-minute setup time, one-line embed code, mobile-optimized templates

---

## 📋 CORE FEATURES SPECIFICATION

### 1. CLIENT KEYS MANAGEMENT SYSTEM

#### 1.1 Feature Overview
**Purpose:** Enable workshops to create and manage client keys for widget embedding on multiple websites/domains.

**Business Rules:**
- Basic Package (€29): Up to 3 client keys
- Premium Package (€79): Up to 10 client keys  
- Enterprise Package (€199): Unlimited client keys

#### 1.2 User Stories

**US-001: Create Client Key**
```
As a workshop owner
I want to create a new client key for my website
So that I can embed the CarBot widget with proper tracking

Acceptance Criteria:
- Generate unique, secure client key (32 characters alphanumeric)
- Assign descriptive name (e.g., "Main Website", "Mobile Site")
- Set authorized domains for security
- Display integration code snippet immediately
- Validate package limits before creation
```

**US-002: Manage Client Keys**
```
As a workshop owner  
I want to view and manage all my client keys
So that I can control where my chatbot is embedded

Acceptance Criteria:
- List all client keys with names, domains, creation dates
- Show usage statistics (conversations, leads generated)
- Enable/disable individual keys
- Regenerate keys when compromised
- Delete unused keys
```

**US-003: Client Key Usage Tracking**
```
As a workshop owner
I want to see usage analytics per client key
So that I can understand which websites perform best

Acceptance Criteria:
- Track conversations per client key per day/week/month
- Show leads generated per client key
- Display conversion rates by source
- Export usage data as CSV
```

#### 1.3 Technical Specifications

**Database Schema:**
```sql
CREATE TABLE client_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workshop_id UUID NOT NULL REFERENCES workshops(id),
  key_value VARCHAR(32) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  authorized_domains TEXT[], -- Array of allowed domains
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_used_at TIMESTAMPTZ,
  usage_count INTEGER DEFAULT 0,
  monthly_conversations INTEGER DEFAULT 0,
  monthly_leads INTEGER DEFAULT 0
);

CREATE INDEX idx_client_keys_workshop ON client_keys(workshop_id);
CREATE INDEX idx_client_keys_value ON client_keys(key_value);
CREATE INDEX idx_client_keys_active ON client_keys(is_active);
```

**API Endpoints:**
```typescript
// Client Keys Management API
POST /api/client-keys - Create new client key
GET /api/client-keys - List all keys for workshop
PUT /api/client-keys/:id - Update client key
DELETE /api/client-keys/:id - Delete client key
POST /api/client-keys/:id/regenerate - Regenerate key value
GET /api/client-keys/:id/stats - Get usage statistics

// Widget Integration API  
GET /api/widget/:clientKey - Serve widget JavaScript
POST /api/chat/:clientKey - Handle chat messages
POST /api/leads/:clientKey - Capture leads
```

---

### 2. LANDING PAGE TEMPLATES SYSTEM (Premium Package)

#### 2.1 Feature Overview
**Purpose:** Provide professional landing pages for workshops without websites, available only in Premium (€79) and Enterprise (€199) packages.

**Business Rules:**
- 5 pre-designed templates optimized for German automotive workshops
- Template selection and customization interface
- SEO-optimized URLs: `carbot.de/workshop/[workshop-slug]`
- Mobile-first responsive design
- GDPR compliant contact forms

#### 2.2 Template Specifications

**Template 1: "Klassische Werkstatt" (Classic Workshop)**
- Traditional German workshop design
- Blue and white color scheme
- Emphasis on reliability and experience
- Service showcase with pricing hints

**Template 2: "Moderne Autowerkstatt" (Modern Auto Workshop)**  
- Clean, contemporary design
- Orange and gray color scheme
- Focus on technology and efficiency
- Online appointment booking prominent

**Template 3: "Premium Service" (Premium Service)**
- Luxury automotive service design
- Black and gold color scheme  
- High-end branding elements
- Premium service messaging

**Template 4: "Familienbetrieb" (Family Business)**
- Warm, family-oriented design
- Green and brown color scheme
- Personal touch and trust emphasis
- Multi-generational workshop story

**Template 5: "Elektro & Hybrid Spezialist" (Electric & Hybrid Specialist)**
- Modern eco-friendly design
- Green and blue color scheme
- Environmental consciousness
- Electric vehicle expertise highlight

#### 2.3 User Stories

**US-004: Select Landing Page Template**
```
As a premium workshop owner
I want to choose from 5 professional templates
So that I can create a landing page that matches my workshop style

Acceptance Criteria:
- Preview all 5 templates with sample content
- Select template with one click
- Customize basic colors, logo, contact information
- Preview changes in real-time
- Publish landing page with custom URL
```

**US-005: Customize Landing Page Content**
```
As a premium workshop owner
I want to customize my landing page content
So that it reflects my workshop's unique services and personality

Acceptance Criteria:
- Edit workshop name, description, services
- Upload workshop logo and photos (max 5)
- Set contact information (address, phone, email, hours)
- Customize service list with descriptions
- Add testimonials/reviews section
- Set call-to-action buttons
```

**US-006: Manage Landing Page SEO**
```
As a premium workshop owner  
I want my landing page to be found on Google
So that I can attract new customers online

Acceptance Criteria:
- Automatic SEO optimization (titles, descriptions, schema markup)
- Google Analytics integration
- Social media preview optimization
- Mobile-friendly validation
- Page speed optimization (< 3 seconds load time)
```

#### 2.4 Technical Specifications

**Database Schema:**
```sql
CREATE TABLE landing_page_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  preview_image VARCHAR(255),
  html_template TEXT NOT NULL,
  css_template TEXT NOT NULL,
  customization_schema JSONB, -- Available customization options
  is_active BOOLEAN DEFAULT true
);

CREATE TABLE workshop_landing_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workshop_id UUID NOT NULL REFERENCES workshops(id),
  template_id UUID NOT NULL REFERENCES landing_page_templates(id),
  slug VARCHAR(100) UNIQUE NOT NULL, -- URL slug
  customizations JSONB NOT NULL, -- Template customizations
  seo_settings JSONB, -- SEO metadata
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_landing_pages_workshop ON workshop_landing_pages(workshop_id);
CREATE INDEX idx_landing_pages_slug ON workshop_landing_pages(slug);
```

**API Endpoints:**
```typescript
// Landing Page Management API
GET /api/landing-page-templates - List available templates
GET /api/landing-pages - Get workshop's landing page
POST /api/landing-pages - Create new landing page
PUT /api/landing-pages/:id - Update landing page
DELETE /api/landing-pages/:id - Delete landing page
POST /api/landing-pages/:id/publish - Publish landing page
GET /api/landing-pages/:id/preview - Preview unpublished changes

// Public Landing Page API
GET /workshop/:slug - Serve public landing page
POST /workshop/:slug/contact - Handle contact form submissions
GET /api/workshop/:slug/widget-config - Get embedded widget config
```

---

### 3. WIDGET EMBEDDING SYSTEM

#### 3.1 Feature Overview
**Purpose:** Provide simple, secure widget embedding for all package tiers with client key authentication.

#### 3.2 User Stories

**US-007: Generate Widget Code**
```
As a workshop owner
I want to get simple embedding code for my website
So that I can add CarBot to my site in under 5 minutes

Acceptance Criteria:
- Generate one-line script tag with client key
- Provide installation instructions in German
- Show preview of widget appearance
- Include customization options (colors, position, language)
- Test widget functionality before going live
```

**US-008: Embed Widget on Website**
```
As a website visitor
I want to chat with the workshop through an intuitive widget
So that I can quickly get answers about automotive services

Acceptance Criteria:
- Widget loads within 2 seconds
- Responsive design works on all devices
- GDPR consent handled automatically
- Multi-language support (DE/EN/TR/PL)
- Lead capture form appears contextually
- Chat history preserved during session
```

#### 3.3 Technical Specifications

**Widget Code Generation:**
```html
<!-- Generated embed code -->
<script>
  window.CarBotConfig = {
    clientKey: 'cb_1234567890abcdef',
    language: 'de',
    theme: 'auto',
    position: 'bottom-right'
  };
</script>
<script src="https://widget.carbot.de/v1/embed.js" async></script>
```

**Widget JavaScript Structure:**
```typescript
// /public/widget/v1/embed.js
interface CarBotConfig {
  clientKey: string;
  language?: 'de' | 'en' | 'tr' | 'pl';
  theme?: 'light' | 'dark' | 'auto';
  position?: 'bottom-right' | 'bottom-left';
  customColors?: {
    primary: string;
    background: string;
    text: string;
  };
}

// Widget loading and initialization
class CarBotWidget {
  constructor(config: CarBotConfig);
  init(): Promise<void>;
  open(): void;
  close(): void;
  sendMessage(message: string): void;
  on(event: string, callback: Function): void;
}
```

---

## 🏗️ TECHNICAL ARCHITECTURE

### 4.1 System Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   API Gateway   │    │   Database      │
│   Dashboard     │◄──►│   Rate Limiting │◄──►│   PostgreSQL    │
│   Templates     │    │   Auth/Keys     │    │   Supabase      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         ▲                       ▲                       ▲
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Widget CDN    │    │   Chat Service  │    │   Analytics     │
│   Global Caching│    │   AI Processing │    │   Usage Tracking│
│   Edge Locations│    │   Lead Capture  │    │   Reporting     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### 4.2 Security Requirements
- Client key validation on every request
- Domain authorization checking
- Rate limiting per client key (100 req/min)
- HTTPS enforcement for all endpoints
- XSS protection in widget embedding
- CSRF tokens for sensitive operations
- Regular security audits and penetration testing

### 4.3 Performance Requirements
- Widget load time: < 2 seconds
- Landing page load time: < 3 seconds
- API response time: < 200ms average
- 99.9% uptime availability
- Support for 1000+ concurrent conversations
- CDN caching for static assets

---

## 📊 PACKAGE SPECIFICATIONS

### 5.1 Basic Package (€29/month)
**Target:** Small workshops with existing websites
- ✅ Up to 3 client keys
- ✅ Widget embedding
- ✅ Basic chat functionality
- ✅ Lead capture (100/month limit)
- ✅ Email support
- ❌ No landing pages
- ❌ No template customization

### 5.2 Premium Package (€79/month) 
**Target:** Established workshops needing online presence
- ✅ Up to 10 client keys
- ✅ Widget embedding
- ✅ Advanced chat functionality
- ✅ Unlimited leads
- ✅ **5 Landing page templates**
- ✅ **Template customization**
- ✅ **SEO optimization**
- ✅ Advanced analytics
- ✅ Phone support

### 5.3 Enterprise Package (€199/month)
**Target:** Large workshops/chains
- ✅ Unlimited client keys
- ✅ All Premium features
- ✅ **Custom template design**
- ✅ **Multi-location management**
- ✅ API access
- ✅ Custom integrations
- ✅ Dedicated support

---

## 🧪 TESTING STRATEGY

### 6.1 Unit Testing Requirements
- 90%+ code coverage for all new features
- Client key generation and validation
- Template rendering and customization
- Widget embedding security
- Package limit enforcement

### 6.2 Integration Testing
- End-to-end client key creation workflow
- Template selection and customization flow
- Widget embedding on external domains
- Landing page publishing and SEO
- Payment processing with package upgrades

### 6.3 Security Testing
- Client key authorization bypass attempts
- Cross-site scripting (XSS) in widget
- Domain restriction enforcement
- Rate limiting effectiveness
- GDPR compliance validation

### 6.4 Performance Testing
- Widget load time under various network conditions
- Landing page rendering speed
- Database query performance with 1000+ keys
- CDN caching effectiveness
- Concurrent user handling

---

## 📅 DEVELOPMENT TIMELINE

### Phase 1: Foundation (Weeks 1-2)
- [ ] Client keys database schema and API
- [ ] Basic widget embedding system
- [ ] Package limit enforcement
- [ ] Security implementation

### Phase 2: Templates (Weeks 3-4)
- [ ] 5 landing page templates design and development
- [ ] Template selection interface
- [ ] Customization system
- [ ] SEO optimization

### Phase 3: Polish (Weeks 5-6)
- [ ] Advanced widget customization
- [ ] Analytics and reporting
- [ ] Performance optimization
- [ ] Comprehensive testing

### Phase 4: Launch (Week 7)
- [ ] UAT testing completion
- [ ] Production deployment
- [ ] Monitoring setup
- [ ] Documentation completion

---

## ✅ ACCEPTANCE CRITERIA CHECKLIST

### Client Keys Management
- [ ] Workshop can create up to package limit of client keys
- [ ] Each key has unique 32-character identifier
- [ ] Domain authorization prevents unauthorized usage
- [ ] Usage statistics tracked per client key
- [ ] Keys can be regenerated and deactivated

### Landing Page Templates
- [ ] 5 distinct templates available for Premium+ packages
- [ ] Template preview before selection
- [ ] Real-time customization with preview
- [ ] SEO-optimized landing pages
- [ ] Mobile-responsive design on all templates
- [ ] Contact form integration with lead capture

### Widget Embedding
- [ ] One-line script tag integration
- [ ] Widget loads within 2 seconds
- [ ] GDPR consent management
- [ ] Multi-language support
- [ ] Customizable appearance
- [ ] Cross-browser compatibility

### Package Integration
- [ ] Feature access controlled by package level
- [ ] Upgrade prompts for Premium features
- [ ] Usage limits enforced automatically
- [ ] Billing integration with feature access

---

## 📚 DOCUMENTATION REQUIREMENTS

### User Documentation
- [ ] Client key creation guide (German)
- [ ] Widget embedding tutorial
- [ ] Landing page customization guide
- [ ] Template selection recommendations
- [ ] SEO best practices guide

### Technical Documentation
- [ ] API reference documentation
- [ ] Database schema documentation
- [ ] Widget integration guide
- [ ] Security implementation details
- [ ] Performance optimization guide

### Support Documentation
- [ ] Troubleshooting guide
- [ ] FAQ for common issues
- [ ] Package comparison chart
- [ ] Upgrade process documentation
- [ ] Contact support procedures

---

## 🎯 SUCCESS METRICS

### Business Metrics
- Time to first widget embedding: < 5 minutes
- Landing page creation time: < 10 minutes  
- Premium package conversion rate: > 25%
- Customer satisfaction score: > 4.5/5
- Monthly recurring revenue growth: > 20%

### Technical Metrics
- Widget uptime: 99.9%
- Average API response time: < 200ms
- Landing page load time: < 3 seconds
- Zero security incidents
- < 1% error rate across all endpoints

---

**This specification provides the complete roadmap for implementing client keys, landing page templates, and widget embedding system with 100% quality assurance.**