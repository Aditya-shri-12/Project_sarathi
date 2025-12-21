// server/test-get-results.js - Test fetching vote results for an election
require('dotenv').config();

async function getResults() {
  console.log("⏳ Fetching vote results...");

  // 👇 UPDATE THIS WITH AN ACTUAL ELECTION ID 👇
  // Run test-get-elections.js first to get election IDs
  const electionId = "YOUR_ELECTION_UUID_HERE"; // Replace with actual election UUID

  if (electionId === "YOUR_ELECTION_UUID_HERE") {
    console.log("❌ Please update electionId in this file first!");
    console.log("   Run: node test-get-elections.js to find election IDs");
    return;
  }

  try {
    const response = await fetch(`http://localhost:5000/api/vote/results/${electionId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });

    const data = await response.json();

    if (response.ok) {
      console.log("✅ VOTE RESULTS:");
      console.log("======================================");
      
      if (Object.keys(data).length === 0) {
        console.log("No votes cast yet for this election.");
      } else {
        // Sort by vote count (descending)
        const sortedResults = Object.entries(data)
          .sort(([, a], [, b]) => b - a);
        
        sortedResults.forEach(([candidateName, voteCount], index) => {
          console.log(`${index + 1}. ${candidateName}: ${voteCount} vote(s)`);
        });
        
        const totalVotes = Object.values(data).reduce((sum, count) => sum + count, 0);
        console.log("======================================");
        console.log(`Total Votes: ${totalVotes}`);
      }
    } else {
      console.log("❌ Error:", data);
    }

  } catch (error) {
    console.log("❌ Network Error:", error.message);
  }
}

getResults();

