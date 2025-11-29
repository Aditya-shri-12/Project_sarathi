// server/test-create-election.js

async function createElection() {
  console.log("⏳ Creating a new Election Event...");

  // 1. Define the Election Data
  const electionData = {
    title: "Society Secretary 2025",
    description: "Voting for the new RWA Secretary. Please vote wisely.",
    candidates: [
      { name: "Mr. Sharma", party: "Block A Alliance" },
      { name: "Mrs. Verma", party: "Green Society Group" }
    ],
    // Set the deadline to 1 day from now
    endTime: new Date(Date.now() + 24 * 60 * 60 * 1000) 
  };

  try {
    // 2. Send it to the server
    const response = await fetch('http://localhost:5000/api/election/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(electionData)
    });

    const text = await response.text();

    try {
        const data = JSON.parse(text); // Try to turn it into JSON
        if (response.ok) {
            console.log("✅ SUCCESS!", data);
        } else {
            console.log("❌ Server Error JSON:", data);
        }
    } catch (e) {
        // If it fails, it means we got HTML
        console.log("❌ CRITICAL ERROR (HTML Received):");
        console.log(text); // THIS WILL SHOW US THE HTML PAGE
    }

  } catch (error) {
    console.log("❌ Network Error:", error.message);
  }
}

createElection();