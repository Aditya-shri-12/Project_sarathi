// server/test-signup-flow.js - Test complete signup and login flow with Supabase
require('dotenv').config();

async function testSignupFlow() {
  console.log("📝 Testing complete signup and login flow...\n");
  
  // Generate unique email to avoid conflicts
  const timestamp = Date.now();
  const testEmail = `test${timestamp}@example.com`;
  
  // Step 1: Try to Sign Up
  console.log("1️⃣  Attempting to register new user...");
  const signupRes = await fetch('http://localhost:5000/api/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: `TestUser_${timestamp}`,
      password: "TestPassword123",
      email: testEmail,
      flatNumber: `B-${Math.floor(Math.random() * 500)}`
    })
  });
  
  const signupData = await signupRes.json();
  console.log("Signup Response:", signupData);
  
  if (signupRes.ok) {
    console.log("✅ Registration successful!\n");
  } else {
    console.log("❌ Registration failed:", signupData);
    return;
  }

  // Step 2: Try to Log In immediately
  console.log("2️⃣  Attempting to log in with new account...");
  const loginRes = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: testEmail, // Supabase uses email for login
      password: "TestPassword123"
    })
  });
  
  const loginData = await loginRes.json();
  
  if (loginRes.ok) {
    console.log("✅ Login successful!");
    console.log("User ID:", loginData.user?.id);
    console.log("Role:", loginData.role);
    console.log("Token:", loginData.token ? "Received" : "Not received");
  } else {
    console.log("❌ Login failed:", loginData);
    console.log("Note: This might be expected if email verification is required.");
  }
  
  console.log("\n✅ Test flow completed!");
}

testSignupFlow();

