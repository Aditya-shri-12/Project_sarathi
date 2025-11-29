// server/test-cast-vote.js

async function castVote() {
  console.log("⏳ Casting vote...");

  // 👇 PASTE YOUR COPIED IDS HERE 👇
  const myUserId = "6929f6da6cb552154851e8bf";      
  const myElectionId = "6929ec357ee0cc1cdf2dc686"; 

  const voteData = {
    userId: myUserId,
    electionId: myElectionId,
    encryptedVote: "Encrypted_Vote_For_Sharma" 
  };

  try {
    const response = await fetch('http://localhost:5000/api/vote/cast', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(voteData)
    });

    const data = await response.json();

    if (response.ok) {
      console.log("✅ SUCCESS:", data);
    } else {
      console.log("❌ FAILED:", data);
    }

  } catch (error) {
    console.log("❌ Network Error:", error.message);
  }
}

castVote();