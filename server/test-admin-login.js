// server/test-admin-login.js - Test admin login endpoint with Supabase
require('dotenv').config();

async function testAdminLogin() {
  console.log("⏳ Testing admin login endpoint...");

  try {
    const response = await fetch('http://localhost:5000/api/auth/admin-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: "admin@example.com", // Admin email from Supabase
        password: "AdminPassword123"
      })
    });

    const data = await response.json();

    if (response.ok) {
      console.log("✅ ADMIN LOGIN SUCCESS!");
      console.log("Token:", data.token);
      console.log("Role:", data.role);
      console.log("Message:", data.message);
    } else {
      console.log("❌ ADMIN LOGIN FAILED:");
      console.log("Response:", data);
      
      if (data.message) {
        console.log("Reason:", data.message);
      }
    }

  } catch (error) {
    console.log("❌ Network Error:", error.message);
  }
}

testAdminLogin();

