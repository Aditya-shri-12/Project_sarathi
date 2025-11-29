// server/test-get-elections.js

async function getAllElections() {
  console.log("⏳ Fetching elections from database...");

  try {
    const response = await fetch('http://localhost:5000/api/election/all');
    const data = await response.json();

    console.log("✅ FOUND ELECTIONS:");
    // This loops through the list and prints the ID and Title
    data.forEach(election => {
        console.log(`--------------------------------`);
        console.log(`📌 ID:    ${election._id}`);   // <--- COPY THIS ID
        console.log(`📝 Title: ${election.title}`);
        console.log(`--------------------------------`);
    });

  } catch (error) {
    console.log("❌ Error:", error.message);
  }
}

getAllElections();