# 🗄️ CarBot Database Setup Guide

**Issue**: Registration failing due to database connection errors
**Cause**: Missing/invalid Supabase credentials in production environment
**Status**: 🔧 NEEDS DATABASE CONFIGURATION

---

## 🚨 **Current Problem**

The registration form is failing because:

```bash
Error: Missing Supabase configuration: 
- NEXT_PUBLIC_SUPABASE_URL ✅ (configured)
- SUPABASE_SERVICE_ROLE_KEY ❌ (placeholder value)
- NEXT_PUBLIC_SUPABASE_ANON_KEY ❌ (placeholder value)
```

---

## 🛠️ **Quick Fix Options**

### **Option 1: Set up Real Database (Recommended)**

1. **Create Supabase Project**:
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Note down the Project URL and API keys

2. **Update Vercel Environment Variables**:
   ```bash
   # In Vercel Dashboard → Settings → Environment Variables
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-real-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-real-service-role-key
   ```

3. **Database Schema** (run in Supabase SQL Editor):
   ```sql
   -- Users table
   CREATE TABLE users (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     email TEXT UNIQUE NOT NULL,
     password_hash TEXT NOT NULL,
     name TEXT,
     created_at TIMESTAMP DEFAULT NOW()
   );

   -- Workshops table  
   CREATE TABLE workshops (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     name TEXT NOT NULL,
     owner_id UUID REFERENCES users(id),
     template_type TEXT DEFAULT 'klassische',
     phone TEXT,
     created_at TIMESTAMP DEFAULT NOW()
   );

   -- Enable RLS (Row Level Security)
   ALTER TABLE users ENABLE ROW LEVEL SECURITY;
   ALTER TABLE workshops ENABLE ROW LEVEL SECURITY;
   ```

### **Option 2: Mock Registration (For Testing)**

I can create a temporary mock registration that:
- ✅ Accepts form submissions
- ✅ Shows success messages  
- ✅ Redirects to dashboard
- ❌ Doesn't store data permanently

Would you like me to implement the mock version for immediate testing?

---

## 🔍 **Current Environment Status**

### **Supabase Configuration**
```bash
✅ NEXT_PUBLIC_SUPABASE_URL: https://qthmxzzbscdouzolkjwy.supabase.co
❌ NEXT_PUBLIC_SUPABASE_ANON_KEY: placeholder
❌ SUPABASE_SERVICE_ROLE_KEY: placeholder
```

### **Other Database-Related Settings**
```bash
❌ DIRECTUS_URL: placeholder (your-directus-instance.com)  
❌ DIRECTUS_TOKEN: placeholder
⚠️ Redis: Not configured (using in-memory storage)
```

---

## 🚀 **Immediate Action Required**

**To fix registration right now:**

1. **Quick Test Solution**: I can implement mock registration
2. **Production Solution**: Set up real Supabase database
3. **Hybrid Solution**: Use localStorage for demo purposes

Which approach would you prefer?

---

## 📋 **Database Schema Overview**

When you set up the real database, CarBot needs these tables:

| **Table** | **Purpose** | **Key Fields** |
|-----------|-------------|----------------|
| **users** | User accounts | email, password_hash, name |
| **workshops** | Workshop profiles | name, owner_id, template_type, phone |
| **sessions** | Authentication | user_id, token, expires_at |
| **templates** | Workshop templates | type, name, configuration |

---

## 🔧 **Next Steps**

1. **Decide on approach** (mock vs real database)
2. **I can implement the chosen solution**
3. **Test registration functionality**
4. **Deploy working version**

Let me know which option you'd prefer, and I'll implement it immediately! 🚀