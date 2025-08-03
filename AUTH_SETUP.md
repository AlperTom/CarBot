# CarBot Workshop Authentication System

This document provides a complete setup guide for the CarBot workshop authentication system built with Supabase and Next.js.

## 🚀 Features

- **Complete Authentication Flow**: Login, Registration, Password Reset
- **Workshop-Specific Onboarding**: Multi-step registration with company details
- **Role-Based Access Control**: Owner, Admin, Employee, Customer roles
- **German Localization**: All UI text in German for the German market
- **Security Features**:
  - Email verification
  - Password strength validation
  - Session management
  - Audit logging
  - Route protection middleware
- **Professional UX**: Modern, mobile-responsive design

## 📁 File Structure

```
app/
├── auth/
│   ├── login/page.jsx              # Login form with German UI
│   ├── register/page.jsx           # Multi-step registration
│   ├── forgot-password/page.jsx    # Password reset request
│   ├── reset-password/page.jsx     # New password form
│   ├── verify/page.jsx             # Email verification
│   └── no-workshop/page.jsx        # No workshop found page
├── api/auth/
│   ├── signup/route.js             # Registration API
│   ├── signin/route.js             # Login API
│   ├── signout/route.js            # Logout API
│   ├── reset-password/route.js     # Password reset API
│   └── session/route.js            # Session management API
├── unauthorized/page.jsx           # Access denied page
├── middleware.js                   # Route protection middleware
└── lib/auth.js                     # Authentication utilities

supabase/
└── schema.sql                      # Database schema with auth tables
```

## 🛠️ Setup Instructions

### 1. Environment Variables

Add the following to your `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 2. Database Setup

1. Run the SQL schema in your Supabase dashboard:
   ```sql
   -- Execute the contents of supabase/schema.sql
   ```

2. Configure Supabase Auth settings:
   - Go to Authentication > Settings
   - Set site URL to your domain
   - Configure email templates (optional)
   - Enable email confirmations

### 3. Supabase Auth Configuration

#### Email Templates (German)
Update your Supabase email templates:

**Confirm Signup Template:**
```html
<h2>Willkommen bei CarBot!</h2>
<p>Bestätigen Sie Ihre E-Mail-Adresse, um Ihr Konto zu aktivieren:</p>
<p><a href="{{ .ConfirmationURL }}">E-Mail bestätigen</a></p>
```

**Reset Password Template:**
```html
<h2>Passwort zurücksetzen</h2>
<p>Klicken Sie auf den Link, um Ihr Passwort zurückzusetzen:</p>
<p><a href="{{ .ConfirmationURL }}">Neues Passwort erstellen</a></p>
```

#### Auth Policies
The schema includes Row Level Security (RLS) policies for:
- Workshops (users can only see their own)
- Workshop users (role-based access)
- Audit logs (limited access)
- Sessions (user-specific)

### 4. Middleware Configuration

The middleware protects routes and handles redirects:

**Protected Routes:**
- `/dashboard/*`
- `/analytics/*` 
- `/cases/*`
- `/api/leads/*`
- `/api/analytics/*`

**Role-Based Routes:**
- `/admin/*` - Owner/Admin only
- `/workshop/settings/*` - Owner only
- `/workshop/users/*` - Owner/Admin only

## 🔐 User Roles

### Owner
- Workshop owner with full access
- Can manage all settings and users
- Created during registration

### Admin  
- Can manage workshop users
- Has access to most features
- Cannot modify core workshop settings

### Employee
- Basic workshop access
- Limited permissions
- Can be invited by Owner/Admin

### Customer
- Default role for users without workshop
- Limited access

## 🎯 Authentication Flow

### 1. Registration
```
User Registration → Email Verification → Workshop Creation → Dashboard Access
```

1. User fills multi-step form (Account → Workshop Info → Plan)
2. Supabase creates auth user
3. Workshop record created with owner relationship
4. Email verification sent
5. User confirms email
6. Redirected to dashboard

### 2. Login
```
Email/Password → Workshop Lookup → Role Assignment → Dashboard
```

1. User enters credentials
2. Supabase authenticates
3. System looks up workshop association
4. Role determined (Owner/Employee)
5. Session created with workshop context

### 3. Password Reset
```
Request Reset → Email Link → New Password → Success
```

1. User enters email
2. Reset link sent (if account exists)
3. User clicks link
4. New password form
5. Password updated

## 🔧 Key Features

### Multi-Step Registration
- **Step 1**: Account details (email, password)
- **Step 2**: Workshop information (name, address, type)
- **Step 3**: Plan selection (Basic, Professional, Enterprise)

### Advanced Security
- **Email Verification**: Required for account activation
- **Password Validation**: Strength requirements with visual feedback
- **Session Management**: Secure token-based sessions
- **Audit Logging**: All auth actions logged with IP/user agent
- **Rate Limiting**: Built-in Supabase rate limiting

### German Localization
- All user-facing text in German
- German phone/postal code validation
- Localized error messages
- Cultural considerations (formal "Sie" form)

## 📱 Responsive Design

The authentication pages are fully responsive with:
- Mobile-first design
- Touch-friendly interfaces
- Optimized for German users
- Professional workshop branding

## 🚨 Error Handling

Comprehensive error handling for:
- Network issues
- Invalid credentials
- Expired tokens
- Missing workshop associations
- Permission denied scenarios

## 🔄 Session Management

### Client-Side
- Workshop data stored in localStorage
- Role-based UI rendering
- Automatic session refresh

### Server-Side
- Middleware validates sessions
- Database session tracking
- Automatic cleanup of expired sessions

## 📊 Monitoring & Analytics

### Audit Logs
All authentication events logged:
- User registration
- Login/logout
- Password changes
- Permission changes
- Failed login attempts

### Session Tracking
- Active session monitoring
- IP address logging
- User agent tracking
- Last activity timestamps

## 🛡️ Security Best Practices

1. **Environment Variables**: All secrets in environment files
2. **SQL Injection**: Parameterized queries via Supabase
3. **XSS Protection**: React's built-in escaping
4. **CSRF**: SameSite cookies and tokens
5. **Rate Limiting**: Supabase built-in protection
6. **Password Security**: Bcrypt hashing via Supabase
7. **Session Security**: JWT tokens with expiration

## 🧪 Testing

### Demo Account
A demo account is available for testing:
- Email: `demo@werkstatt.de`
- Password: `demo123`

### Test Scenarios
1. Registration flow with email verification
2. Login with various error conditions
3. Password reset flow
4. Role-based access control
5. Mobile responsiveness

## 🚀 Deployment

### Production Checklist
- [ ] Update NEXT_PUBLIC_SITE_URL
- [ ] Configure email templates
- [ ] Set up custom domain for Supabase
- [ ] Enable production auth settings
- [ ] Configure SMTP for emails
- [ ] Test all flows in production

### Environment Setup
```bash
# Install dependencies
npm install @supabase/supabase-js

# Run development server
npm run dev

# Build for production
npm run build
```

## 📞 Support

For issues with the authentication system:
1. Check Supabase logs for auth errors
2. Verify environment variables
3. Test with demo account
4. Check network connectivity

## 🔮 Future Enhancements

- [ ] Two-factor authentication (2FA)
- [ ] Social login (Google, Microsoft)
- [ ] Single Sign-On (SSO) for enterprise
- [ ] Advanced password policies
- [ ] Session management dashboard
- [ ] OAuth API for third-party integrations

---

This authentication system provides a robust, secure, and user-friendly foundation for the CarBot workshop platform, specifically designed for the German automotive industry market.