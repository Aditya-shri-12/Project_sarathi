// server/test-cast-vote.js - Test voting API endpoint with Supabase
require('dotenv').config();

async function castVote() {
  console.log("⏳ Testing vote casting...");

  // 👇 UPDATE THESE VALUES WITH ACTUAL IDs FROM YOUR DATABASE 👇
  // Run test-get-elections.js first to get election IDs
  // Check your Supabase dashboard to get candidate IDs
  const myUserId = "YOUR_USER_UUID_HERE";       // Replace with actual user UUID from Supabase
  const candidateId = "YOUR_CANDIDATE_UUID_HERE"; // Replace with actual candidate UUID
  const electionId = "YOUR_ELECTION_UUID_HERE";   // Replace with actual election UUID
  const position = "Society Secretary 2025";      // Election title/position

  const voteData = {
    userId: myUserId,
    candidateId: candidateId,
    electionId: electionId,
    position: position
  };

  try {
    const response = await fetch('http://localhost:5000/api/vote/cast', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(voteData)
    });

    const data = await response.json();

    if (response.ok) {
      console.log("✅ SUCCESS! Vote cast:", data);
    } else {
      console.log("❌ FAILED:", data);
      if (data.error) {
        console.log("Error details:", data.error);
      }
    }

  } catch (error) {
    console.log("❌ Network Error:", error.message);
  }
}

castVote();

