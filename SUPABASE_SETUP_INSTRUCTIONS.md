# Supabase Database Setup Instructions

## Important: Execute Database Schema

Your database schema has been corrected and is ready for deployment. Follow these steps to set up your Supabase database:

### Step 1: Access Supabase SQL Editor

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/qthmxzzbscdouzolkjwy
2. Navigate to "SQL Editor" in the left sidebar
3. Click "New Query" to create a new SQL script

### Step 2: Execute the Database Schema

1. Copy the entire contents of `database-setup.sql` from your project root
2. Paste it into the Supabase SQL Editor
3. Click "Run" to execute the script

**Important**: The script includes `IF NOT EXISTS` clauses, so it's safe to run multiple times.

### Step 3: Verify Tables Created

After running the script, verify these critical tables were created:

- `workshops` - Workshop/business information
- `leads` - Lead captures from chat (with German field names: kunde_id, telefon, anliegen, fahrzeug, chatverlauf)
- `chat_messages` - Chat history with GDPR 90-day auto-deletion
- `consent_records` - GDPR consent tracking
- `customers` - Workshop client pages (legacy naming)
- All other supporting tables for analytics, payments, etc.

### Step 4: Switch Registration to Proper Endpoint

Once the database is set up, you need to switch the registration system back to the proper endpoint:

**Edit**: `app/auth/register/page.jsx` line 129:
```javascript
// Change from:
const response = await fetch('/api/auth/signup-simple', {

// Change to:
const response = await fetch('/api/auth/signup', {
```

### Step 5: Test the System

1. **Registration Test**:
   - Go to `/auth/register`
   - Complete all 3 steps
   - Verify workshop data is stored in `workshops` table

2. **Login Test**:
   - Go to `/auth/login`
   - Use the credentials you just registered
   - Verify you can access the dashboard

3. **Chat Widget Test**:
   - Go to `/demo-werkstatt` (or create a customer page)
   - Test the chat functionality
   - Verify leads are captured in the `leads` table with German field names

### Step 6: Verify Key Features

✅ **Lead Capture**: Chat messages should create leads with:
- `kunde_id` (workshop identifier)
- `telefon` (phone number)
- `anliegen` (issue/concern)
- `fahrzeug` (vehicle info)
- `chatverlauf` (chat history as JSON)

✅ **GDPR Compliance**: 
- Consent records stored
- Chat messages auto-delete after 90 days
- All data processing logged

✅ **Row Level Security**: Enabled on all tables with workshop-based access control

## Schema Corrections Made

The database schema has been corrected to match your application code:

1. **Leads Table**: Now uses German field names matching `ChatWidget.jsx`
2. **Chat Messages**: Matches the structure expected by the chat component
3. **Consent Records**: Proper structure for GDPR compliance
4. **Indexes**: Fixed to reference correct column names
5. **Relationships**: Proper foreign key relationships between tables

## Success Message

When the script executes successfully, you'll see:
```
CarBot database schema created successfully!
```

## Next Steps

After database setup is complete:

1. Switch registration endpoint back to `/api/auth/signup`
2. Test complete user registration flow
3. Test chat widget and lead capture
4. Verify GDPR consent and data retention
5. Test dashboard functionality

The system is now ready for full functionality testing!