/**
 * CRITICAL CUSTOMER JOURNEY TEST: German Workshop Registration & Login
 * Test real-world scenario: Auto Service München GmbH - Klaus Weber
 */

const testWorkshopData = {
  email: "klaus.weber@autoservice-muenchen.de",
  password: "MünchenWerkstatt2025!",
  businessName: "Auto Service München GmbH",
  name: "Klaus Weber",
  phone: "+49 89 123456789",
  templateType: "klassische"
};

async function testRegistrationAPI() {
  console.log('🧪 Testing Registration API for:', testWorkshopData.businessName);
  
  try {
    const response = await fetch('https://carbot.chat/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'ProductionValidator/1.0'
      },
      body: JSON.stringify(testWorkshopData)
    });
    
    const data = await response.json();
    
    console.log('📊 Registration Response Status:', response.status);
    console.log('📊 Registration Response Headers:', Object.fromEntries(response.headers));
    console.log('📊 Registration Response Data:', data);
    
    if (response.ok && data.success) {
      console.log('✅ REGISTRATION SUCCESS: German workshop registered successfully');
      return {
        success: true,
        tokens: data.data.tokens,
        user: data.data.user,
        workshop: data.data.workshop,
        mock: data.mock || false
      };
    } else {
      console.log('❌ REGISTRATION FAILED:', data.error);
      return { success: false, error: data.error };
    }
    
  } catch (error) {
    console.log('💥 REGISTRATION ERROR:', error.message);
    return { success: false, error: error.message };
  }
}

async function testLoginAPI(email, password) {
  console.log('🔐 Testing Login API for:', email);
  
  try {
    const response = await fetch('https://carbot.chat/api/auth/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'ProductionValidator/1.0'
      },
      body: JSON.stringify({
        email: email,
        password: password,
        useJWT: true
      })
    });
    
    const data = await response.json();
    
    console.log('📊 Login Response Status:', response.status);
    console.log('📊 Login Response Data:', data);
    
    if (response.ok && data.success) {
      console.log('✅ LOGIN SUCCESS: Authentication successful');
      return {
        success: true,
        tokens: data.data.tokens,
        user: data.data.user,
        workshop: data.data.workshop
      };
    } else {
      console.log('❌ LOGIN FAILED:', data.error);
      return { success: false, error: data.error };
    }
    
  } catch (error) {
    console.log('💥 LOGIN ERROR:', error.message);
    return { success: false, error: error.message };
  }
}

async function testDashboardAccess(accessToken) {
  console.log('🏠 Testing Dashboard Access with token');
  
  try {
    const response = await fetch('https://carbot.chat/dashboard', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'User-Agent': 'ProductionValidator/1.0'
      }
    });
    
    console.log('📊 Dashboard Response Status:', response.status);
    console.log('📊 Dashboard Response Headers:', Object.fromEntries(response.headers));
    
    if (response.ok) {
      console.log('✅ DASHBOARD ACCESS: Successful');
      return { success: true };
    } else {
      console.log('❌ DASHBOARD ACCESS FAILED: Status', response.status);
      return { success: false, status: response.status };
    }
    
  } catch (error) {
    console.log('💥 DASHBOARD ERROR:', error.message);
    return { success: false, error: error.message };
  }
}

async function runGermanWorkshopJourneyTest() {
  console.log('🚀 STARTING CRITICAL CUSTOMER JOURNEY TEST');
  console.log('🎯 Scenario: German Workshop Owner Registration & Login');
  console.log('📍 Workshop: Auto Service München GmbH');
  console.log('👤 Owner: Klaus Weber');
  console.log('=' * 60);
  
  const results = {
    registration: null,
    login: null,
    dashboard: null,
    overall: 'PENDING'
  };
  
  // Test 1: Registration
  console.log('\n📝 STEP 1: Testing Registration Process');
  results.registration = await testRegistrationAPI();
  
  if (!results.registration.success) {
    console.log('🛑 CRITICAL FAILURE: Registration failed - customer journey blocked');
    results.overall = 'CRITICAL_FAILURE';
    return results;
  }
  
  // Test 2: Login (using same credentials)
  console.log('\n🔐 STEP 2: Testing Login Process');
  results.login = await testLoginAPI(testWorkshopData.email, testWorkshopData.password);
  
  if (!results.login.success) {
    console.log('🛑 CRITICAL FAILURE: Login failed - customer cannot access dashboard');
    results.overall = 'CRITICAL_FAILURE';
    return results;
  }
  
  // Test 3: Dashboard Access
  console.log('\n🏠 STEP 3: Testing Dashboard Access');
  const accessToken = results.login.tokens?.accessToken || results.registration.tokens?.accessToken;
  
  if (accessToken) {
    results.dashboard = await testDashboardAccess(accessToken);
  } else {
    console.log('⚠️ WARNING: No access token available for dashboard test');
    results.dashboard = { success: false, error: 'No access token' };
  }
  
  // Overall Assessment
  console.log('\n📊 CUSTOMER JOURNEY ASSESSMENT');
  console.log('=' * 60);
  
  if (results.registration.success && results.login.success && results.dashboard.success) {
    results.overall = 'SUCCESS';
    console.log('🎉 CUSTOMER JOURNEY: COMPLETE SUCCESS');
    console.log('✅ German workshop owners can successfully register, login, and access dashboard');
  } else if (results.registration.success && results.login.success) {
    results.overall = 'PARTIAL_SUCCESS';
    console.log('⚠️ CUSTOMER JOURNEY: PARTIAL SUCCESS');
    console.log('✅ Registration and login work, but dashboard access may have issues');
  } else {
    results.overall = 'FAILURE';
    console.log('❌ CUSTOMER JOURNEY: CRITICAL FAILURE');
    console.log('🛑 Core authentication flow is broken - immediate fix required');
  }
  
  console.log('\n🔍 DETAILED RESULTS:');
  console.log('Registration:', results.registration.success ? '✅ SUCCESS' : '❌ FAILED');
  console.log('Login:', results.login.success ? '✅ SUCCESS' : '❌ FAILED');
  console.log('Dashboard:', results.dashboard.success ? '✅ SUCCESS' : '❌ FAILED');
  
  return results;
}

// Run the test
runGermanWorkshopJourneyTest().then(results => {
  console.log('\n🏁 TEST COMPLETED');
  console.log('Overall Status:', results.overall);
  
  if (results.overall === 'CRITICAL_FAILURE') {
    process.exit(1);
  } else {
    process.exit(0);
  }
}).catch(error => {
  console.error('💥 TEST EXECUTION ERROR:', error);
  process.exit(1);
});