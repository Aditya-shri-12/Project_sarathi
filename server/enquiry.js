// test-enquiry.js - Test enquiry submission endpoint
require('dotenv').config();

async function testEnquiry() {
  console.log("⏳ Testing enquiry endpoint...");

  try {
    const response = await fetch('http://localhost:5000/api/enquiry', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        org: "Green Valley Society",      // Organization Name
        head: "Mr. Rajesh Kumar",         // Head Name
        city: "Mumbai",
        state: "Maharashtra",
        phone: "9876543210",
        email: "test_user@example.com"    // Change this to your real email to test Nodemailer
      }),
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log("✅ SUCCESS! Server Responded:", data);
      console.log("👉 Check your Supabase Dashboard table 'enquiries'");
      console.log("👉 Check your Email Inbox (if Nodemailer is configured)");
    } else {
      console.log("❌ ERROR:", data);
    }
  } catch (error) {
    console.error("❌ Network Error:", error.message);
  }
}

testEnquiry();