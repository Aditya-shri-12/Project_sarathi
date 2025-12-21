// test-register.js - Test registration API endpoint with Supabase
require('dotenv').config();

async function testRegistration() {
  console.log("⏳ Testing registration endpoint...");

  try {
    const response = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: "Mr_Sharma_Test",
        password: "MySecurePass123",
        flatNumber: "A-101",
        email: "sharma@test.com"
      }),
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log("✅ SUCCESS! Server Responded:", data);
    } else {
      console.log("❌ ERROR:", data);
    }
  } catch (error) {
    console.error("❌ Network Error:", error.message);
  }
}

testRegistration();

