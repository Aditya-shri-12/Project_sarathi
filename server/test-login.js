// test-login.js
async function testLogin() {
  console.log("⏳ Trying to log in...");

  try {
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: "Arpit_Admin", // Use the name that is ALREADY in the database
        password: "MySecretPassword123" // The password you used first
      })
    });

    // Check if the server says "200 OK" or "400 Error"
   if (response.ok) {
        const data = await response.json(); 
        // Note: We need to make sure auth.js sends back the whole user object, 
        // OR we can just register a new user to see the ID.
        console.log("✅ LOGIN SUCCESS!");
        console.log("YOUR USER ID IS:", data._id); // <--- We need this!
    } else {
        const errorText = await response.json();
        console.log("❌ LOGIN FAILED. Server said:", errorText);
    }

  } catch (error) {
    console.log("❌ Network Error:", error.message);
  }
}

testLogin();