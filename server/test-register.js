// test-register.js
//this script acts linke the frontend react app to test the register route
async function testregistration() {
    console.log("⏳Sending Data ro server...");
try {
    //we are sending a POST request to the register route
    const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json', //we are telling the server:"im sending you json data"
        },
        body: JSON.stringify({
            username:"voter_01",
            password: "MySecretPassword123",
        }),
    });
    const data = await response.json();
    console.log("✅  SUCCESS! Server Responded:", data);
} catch (error) {
    console.error("❌ Error:", error);
}
}

testregistration();