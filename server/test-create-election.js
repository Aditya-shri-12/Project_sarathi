// server/test-create-election.js - Test election creation with Supabase
require('dotenv').config();

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
    endTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
  };

  try {
    // 2. Send it to the server (using correct route: /api/elections/create)
    const response = await fetch('http://localhost:5000/api/elections/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(electionData)
    });

    const data = await response.json();

    if (response.ok) {
      console.log("✅ SUCCESS! Election created:", data);
      console.log("Election ID:", data.election?.id || data.election?._id);
      console.log("Candidates:", data.election?.candidates?.length || 0);
    } else {
      console.log("❌ Server Error:", data);
    }

  } catch (error) {
    console.log("❌ Network Error:", error.message);
  }
}

createElection();

