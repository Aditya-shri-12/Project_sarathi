// server/test-get-elections.js - Test fetching all elections with Supabase
require('dotenv').config();

async function getAllElections() {
  console.log("⏳ Fetching elections from database...");

  try {
    // Using correct route: /api/elections/all
    const response = await fetch('http://localhost:5000/api/elections/all');
    
    if (!response.ok) {
      const error = await response.json();
      console.log("❌ Error:", error);
      return;
    }

    const data = await response.json();

    console.log("✅ FOUND ELECTIONS:", data.length);
    
    // Loop through the list and print details
    data.forEach((election, index) => {
      const electionId = election.id || election._id; // Support both formats
      console.log(`--------------------------------`);
      console.log(`📌 Election #${index + 1}`);
      console.log(`   ID:          ${electionId}`);
      console.log(`   Title:       ${election.title}`);
      console.log(`   Description: ${election.description || 'N/A'}`);
      console.log(`   Candidates:  ${election.candidates?.length || 0}`);
      console.log(`--------------------------------`);
    });

    if (data.length === 0) {
      console.log("ℹ️  No elections found in database.");
    }

  } catch (error) {
    console.log("❌ Error:", error.message);
  }
}

getAllElections();

