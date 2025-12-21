// test-login.js - Test login API endpoint with Supabase
require('dotenv').config();

async function testLogin() {
  console.log("⏳ Testing login endpoint...");

  try {
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: "admin@example.com", // Use email (Supabase uses email, not username)
        password: "YourPassword123"
      })
    });

    const data = await response.json();

    if (response.ok) {
      console.log("✅ LOGIN SUCCESS!");
      console.log("Token:", data.token);
      console.log("Role:", data.role);
      console.log("User ID:", data.user?.id);
      console.log("Username:", data.user?.name);
      console.log("Email:", data.user?.email);
      console.log("Verified:", data.user?.isVerified);
    } else {
      console.log("❌ LOGIN FAILED. Server said:", data);
    }

  } catch (error) {
    console.log("❌ Network Error:", error.message);
  }
}

testLogin();

