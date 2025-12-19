async function testSignupFlow() {
  console.log("1. 📝 Applying for account (Flat B-505)...");
  
  // A. Try to Sign Up
  const signupRes = await fetch('http://localhost:5000/api/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: "New_Resident_Test",
      password: "123",
      email: "new@test.com",
      flatNumber: "B-505"
    })
  });
  console.log("Signup Response:", await signupRes.json());

  console.log("\n2. 🔐 Trying to Log In immediately...");
  
  // B. Try to Log In (Should Fail)
  const loginRes = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: "New_Resident_Test",
      password: "123"
    })
  });
  
  if (loginRes.status === 403) {
    console.log("✅ SUCCESS! The login was BLOCKED (Pending Status).");
    console.log("Server Message:", await loginRes.json());
  } else {
    console.log("❌ FAILURE! The user got in without approval.");
  }
}

testSignupFlow();