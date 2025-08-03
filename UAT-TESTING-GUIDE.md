# 🧪 CarBot UAT (User Acceptance Testing) Guide

*Comprehensive testing procedures for the CarBot Workshop System*

---

## 📋 **UAT Environment Overview**

### **🎯 Purpose**
- Test all CarBot features in a safe, isolated environment
- Validate user workflows and business processes
- Identify bugs and usability issues before production
- Train users and gather feedback

### **🌐 UAT Environment Details**
- **URL:** `https://carbot-uat.vercel.app`
- **Database:** Separate UAT Supabase instance
- **Payment:** Stripe Test Mode (no real charges)
- **Email:** Test email configuration
- **Demo Data:** Pre-loaded with realistic test data

---

## 🚀 **UAT Environment Setup**

### **Step 1: Deploy UAT Environment**

```bash
# 1. Create UAT branch
git checkout -b uat-environment
git push origin uat-environment

# 2. Deploy to Vercel UAT
vercel --prod --env UAT_MODE=true

# 3. Set UAT environment variables in Vercel dashboard
# Copy all values from .env.uat file
```

### **Step 2: Setup UAT Database**

1. **Create UAT Supabase Project:**
   - New project: `carbot-uat`
   - Copy connection details to `.env.uat`

2. **Run Schema Setup:**
   ```sql
   -- Run supabase-workshop-schema.sql
   -- Then run scripts/seed-uat-data.sql
   ```

3. **Verify Demo Data:**
   - 5 demo workshops
   - 20+ demo clients  
   - 100+ demo conversations
   - Sample landing pages and themes

### **Step 3: Configure Test Services**

**Stripe Test Mode:**
- Use test API keys
- Create test products with €1 prices
- Configure test webhooks

**Email Testing:**
- Use test email service
- All emails go to testing inbox

---

## 📝 **UAT Test Scenarios**

### **🔐 A. Authentication & User Management**

#### **Test Case A1: Workshop Registration**
**Objective:** Verify workshop owner can register successfully

**Steps:**
1. Go to UAT environment
2. Click "Registrieren" 
3. Fill out workshop details:
   - **Name:** "UAT Test Werkstatt"
   - **Owner:** "Test User"
   - **Email:** "test@uat-carbot.de"
   - **Phone:** "+49 30 12345678"
   - **City:** "Berlin"
4. Submit registration
5. Check email for confirmation

**Expected Results:**
- ✅ Registration form accepts all data
- ✅ Confirmation email received
- ✅ Account created in database
- ✅ Redirected to dashboard

**Test Data:**
```
Workshop: UAT Test Werkstatt
Email: test@uat-carbot.de
Password: TestPass123!
```

#### **Test Case A2: Login & Dashboard Access**
**Objective:** Verify login works and dashboard loads

**Steps:**
1. Go to login page
2. Enter test credentials
3. Submit login form
4. Verify dashboard loads

**Expected Results:**
- ✅ Login successful
- ✅ Dashboard displays workshop data
- ✅ Navigation menu works
- ✅ No error messages

---

### **👥 B. Client Management System**

#### **Test Case B1: View Client List**
**Objective:** Verify client management interface works

**Demo Login:**
```
Email: hans.mueller@uat-demo.de
Password: DemoPass123!
```

**Steps:**
1. Login with demo account
2. Navigate to "Clients" section
3. Verify client list displays
4. Test search functionality
5. Test status filters

**Expected Results:**
- ✅ Client list loads with demo data
- ✅ Search by name/email works
- ✅ Status filtering works
- ✅ Statistics cards show correct numbers
- ✅ Client details are accurate

#### **Test Case B2: Client Status Management**
**Objective:** Verify client status updates work

**Steps:**
1. Select a demo client
2. Change status from "Lead Only" to "Registered & Ordered"
3. Add notes to client
4. Save changes
5. Verify changes persist

**Expected Results:**
- ✅ Status update saves successfully
- ✅ Notes are stored
- ✅ Statistics update automatically
- ✅ Changes visible on refresh

---

### **🔑 C. Client Key Management**

#### **Test Case C1: Generate Client Keys**
**Objective:** Verify client key generation and management

**Steps:**
1. Go to "Client-Keys" section
2. Click "Key erstellen"
3. Enter name: "UAT Test Key"
4. Generate key
5. Copy integration code
6. Test key activation/deactivation

**Expected Results:**
- ✅ Key generated successfully
- ✅ Unique key format: `workshop-slug-random`
- ✅ Integration code includes correct key
- ✅ Activation toggle works
- ✅ Usage statistics display

#### **Test Case C2: Integration Code Testing**
**Objective:** Verify generated integration code works

**Steps:**
1. Copy integration code from UAT
2. Create test HTML page
3. Add integration code
4. Load page and test chat widget
5. Verify chat connects to UAT backend

**Test HTML:**
```html
<!DOCTYPE html>
<html>
<head><title>UAT Test Page</title></head>
<body>
    <h1>UAT Test Integration</h1>
    
    <!-- Paste integration code here -->
    <script>
        window.carBotConfig = {
            clientKey: 'your-uat-key-here',
            workshopName: 'UAT Test Werkstatt',
            language: 'de'
        };
    </script>
    <script src="https://carbot-uat.vercel.app/widget.js"></script>
</body>
</html>
```

---

### **🎨 D. UI Theme Customization**

#### **Test Case D1: Theme Customization**
**Objective:** Verify UI theme system works

**Steps:**
1. Go to "UI Themes" section
2. Select a client key
3. Change primary color to red (#ff0000)
4. Change chat position to top-left
5. Update welcome message
6. Save changes
7. Verify live preview updates

**Expected Results:**
- ✅ Color picker works
- ✅ Live preview updates in real-time
- ✅ Settings save successfully
- ✅ Integration code includes theme
- ✅ All customization options work

#### **Test Case D2: Theme Presets**
**Objective:** Verify preset themes work

**Steps:**
1. Select "Automotive Pro" preset
2. Verify colors change
3. Apply "Premium Gold" preset
4. Test custom CSS field
5. Save and verify changes

**Expected Results:**
- ✅ Presets apply correctly
- ✅ All theme elements update
- ✅ Custom CSS is accepted
- ✅ Changes persist on refresh

---

### **📄 E. Landing Page System**

#### **Test Case E1: Create Landing Page**
**Objective:** Verify landing page creation works

**Steps:**
1. Go to "Landing Pages" section
2. Select "Modern Autowerkstatt" template
3. Verify auto-populated data
4. Publish page
5. Visit generated URL
6. Test mobile responsiveness

**Expected Results:**
- ✅ Template loads with workshop data
- ✅ Page publishes successfully
- ✅ URL is accessible
- ✅ Mobile design works
- ✅ CarBot widget appears
- ✅ All sections display correctly

#### **Test Case E2: Landing Page Customization**
**Objective:** Verify page editing capabilities

**Steps:**
1. Edit existing landing page
2. Change hero title and subtitle
3. Update services list
4. Add custom content
5. Save changes
6. Verify updates on live page

**Expected Results:**
- ✅ Content editor works
- ✅ Changes save successfully
- ✅ Live page updates
- ✅ SEO meta tags update
- ✅ Analytics tracking works

---

### **💬 F. Chat System Testing**

#### **Test Case F1: Basic Chat Functionality**
**Objective:** Verify chat widget works end-to-end

**Steps:**
1. Open UAT landing page with chat widget
2. Click chat button
3. Send test message: "Hallo, ich brauche einen Termin"
4. Verify AI response
5. Test appointment booking flow
6. Check dashboard for new lead

**Expected Results:**
- ✅ Chat widget loads and opens
- ✅ AI responds appropriately in German
- ✅ Appointment booking works
- ✅ Lead appears in dashboard
- ✅ Conversation is logged

#### **Test Case F2: Multi-Language Support**
**Objective:** Verify language switching works

**Steps:**
1. Open chat widget
2. Send message in English: "Hello, I need service"
3. Verify response is in English
4. Test Turkish: "Merhaba, servis gerekiyor"
5. Test Polish: "Cześć, potrzebuję serwisu"

**Expected Results:**
- ✅ AI detects language automatically
- ✅ Responses in correct language
- ✅ All 4 languages work (DE, EN, TR, PL)
- ✅ Language preference persists

---

### **💳 G. Payment & Billing System**

#### **Test Case G1: Subscription Purchase**
**Objective:** Verify Stripe integration works

**Steps:**
1. Go to pricing page on UAT
2. Select "Professional" plan
3. Click subscribe
4. Use Stripe test card: `4242 4242 4242 4242`
5. Complete checkout
6. Verify subscription in dashboard

**Test Card Details:**
```
Card: 4242 4242 4242 4242
Expiry: 12/25
CVC: 123
```

**Expected Results:**
- ✅ Stripe checkout loads
- ✅ Test payment processes
- ✅ Subscription activates
- ✅ Dashboard shows active status
- ✅ Features unlock

#### **Test Case G2: Billing Portal**
**Objective:** Verify customer portal works

**Steps:**
1. Go to "Abrechnung" in dashboard
2. Click "Billing verwalten"
3. Verify Stripe portal opens
4. Test invoice download
5. Test plan changes

**Expected Results:**
- ✅ Portal opens successfully
- ✅ Current subscription displays
- ✅ Invoices are downloadable
- ✅ Plan changes work
- ✅ VAT is calculated correctly

---

### **📊 H. Analytics & Reporting**

#### **Test Case H1: Dashboard Analytics**
**Objective:** Verify analytics display correctly

**Steps:**
1. Go to dashboard overview
2. Verify KPI widgets load
3. Check recent activity feed
4. Test date range filtering
5. Verify data accuracy

**Expected Results:**
- ✅ All KPI widgets display data
- ✅ Charts and graphs load
- ✅ Activity feed shows recent events
- ✅ Date filtering works
- ✅ Numbers match demo data

#### **Test Case H2: Client Analytics**
**Objective:** Verify per-client analytics work

**Steps:**
1. Select specific client
2. View client details page
3. Check conversation history
4. Verify lead scoring
5. Test export functionality

**Expected Results:**
- ✅ Client details load
- ✅ Conversation history displays
- ✅ Lead scores are calculated
- ✅ Export functions work
- ✅ Data is accurate

---

## 🐛 **Bug Tracking & Reporting**

### **Bug Report Template**

```markdown
**Bug ID:** UAT-BUG-001
**Date:** 2024-01-15
**Tester:** [Your Name]
**Priority:** High/Medium/Low

**Test Case:** [e.g., B1 - View Client List]
**Environment:** UAT (carbot-uat.vercel.app)

**Steps to Reproduce:**
1. 
2. 
3. 

**Expected Result:**
[What should happen]

**Actual Result:**
[What actually happened]

**Screenshots:**
[Attach screenshots]

**Browser/Device:**
- Browser: Chrome 120
- OS: Windows 11
- Screen: 1920x1080

**Severity:**
- [ ] Critical (blocks testing)
- [ ] Major (feature doesn't work)
- [ ] Minor (cosmetic issue)
- [ ] Enhancement (improvement suggestion)
```

### **Common Test Areas to Focus On**

1. **Cross-Browser Testing:**
   - Chrome, Firefox, Safari, Edge
   - Mobile browsers (iOS Safari, Android Chrome)

2. **Responsive Design:**
   - Desktop (1920x1080, 1366x768)
   - Tablet (768x1024, 1024x768)
   - Mobile (375x667, 414x896)

3. **Performance Testing:**
   - Page load times
   - Chat response times
   - Database queries
   - API response times

4. **Security Testing:**
   - Authentication flows
   - Authorization checks
   - Input validation
   - SQL injection prevention

---

## ✅ **UAT Acceptance Criteria**

### **Must Pass Criteria:**

1. **Authentication:** 100% of auth flows work
2. **Client Management:** All CRUD operations work
3. **Key Generation:** Keys generate and work correctly
4. **Theme System:** All customizations apply
5. **Landing Pages:** Create, edit, publish works
6. **Chat System:** End-to-end chat works in all languages
7. **Payments:** Stripe integration works completely
8. **Analytics:** All data displays correctly

### **Performance Criteria:**

- Page load < 3 seconds
- Chat response < 2 seconds
- Database queries < 500ms
- 99% uptime during testing

### **Usability Criteria:**

- Non-technical users can complete all workflows
- Error messages are clear and helpful
- UI is intuitive and responsive
- Documentation is clear and accurate

---

## 📈 **UAT Success Metrics**

### **Quantitative Metrics:**

- **Bug Discovery Rate:** < 5 bugs per test session
- **Test Coverage:** > 95% of features tested
- **User Task Completion:** > 90% success rate
- **Performance Benchmarks:** All targets met

### **Qualitative Metrics:**

- User feedback scoring (1-10): > 8.0
- Ease of use rating: > 8.0
- Feature completeness: > 9.0
- Documentation quality: > 8.5

---

## 🎯 **UAT Demo Accounts**

### **Workshop Owners (Test Login):**

```
1. Premium Workshop:
   Email: thomas.wagner@uat-demo.de
   Password: DemoPass123!
   Plan: Enterprise

2. Standard Workshop:
   Email: hans.mueller@uat-demo.de  
   Password: DemoPass123!
   Plan: Professional

3. Trial Workshop:
   Email: maria.schmidt@uat-demo.de
   Password: DemoPass123!
   Plan: Starter (Trial)

4. Multi-language Workshop:
   Email: ahmed.yilmaz@uat-demo.de
   Password: DemoPass123!
   Languages: DE, TR, EN

5. Eco Workshop:
   Email: lisa.gruen@uat-demo.de
   Password: DemoPass123!
   Specialization: Electric vehicles
```

### **Admin Access:**
```
Email: admin@carbot-uat.de
Password: UATAdmin2024!
Access: Full system administration
```

---

## 🚀 **Go-Live Checklist**

### **Before Production Deployment:**

- [ ] All UAT test cases passed
- [ ] Performance benchmarks met
- [ ] Security testing completed
- [ ] User training completed
- [ ] Documentation updated
- [ ] Backup procedures tested
- [ ] Monitoring setup verified
- [ ] Support procedures documented

### **Post Go-Live:**

- [ ] Production monitoring active
- [ ] User feedback collection setup
- [ ] Bug reporting system ready
- [ ] Performance monitoring active
- [ ] Backup verification completed
- [ ] User support available

---

## 📞 **UAT Support**

### **Technical Issues:**
- **Email:** uat-support@carbot.de
- **Slack:** #uat-testing
- **Phone:** +49 30 12345678 (9-17 Uhr)

### **Bug Reporting:**
- **GitHub Issues:** CarBot UAT Repository
- **Email:** bugs@carbot-uat.de
- **Priority Response:** < 4 hours

### **User Training:**
- **Schedule:** uat-training@carbot.de
- **Documentation:** Available in `/docs` folder
- **Video Tutorials:** carbot.de/uat-tutorials

---

**🎯 UAT Environment is ready for comprehensive testing! Start with Authentication tests and work through each scenario systematically.**