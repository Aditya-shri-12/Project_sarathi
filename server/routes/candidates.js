const router = require('express').Router();
// ✅ FIX: Import Supabase instead of the missing '../db' file
const supabase = require('../lib/supabase'); 

// 1. Apply for Nomination
router.post('/apply', async (req, res) => {
  try {
    const { userId, electionId, manifesto } = req.body;

    // Validation
    if (!userId || !electionId || !manifesto) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Insert into 'candidates' table using Supabase
    const { data, error } = await supabase
      .from('candidates')
      .insert([
        { 
          user_id: userId, 
          election_id: electionId, 
          manifesto: manifesto,
          status: 'pending' // Ensure default is pending
        }
      ])
      .select();

    if (error) {
      console.error("Supabase Insert Error:", error);
      return res.status(400).json({ error: error.message });
    }

    res.json({ success: true, data: data[0] });

  } catch (err) {
    console.error("Server Error:", err.message);
    res.status(500).json({ error: "Server Error" });
  }
});

// 2. Get Pending Nominations (For Admin Dashboard)
router.get('/pending', async (req, res) => {
  try {
    // Fetch candidates and join with profiles & elections
    const { data, error } = await supabase
      .from('candidates')
      .select(`
        id, 
        manifesto, 
        status, 
        user_id,
        profiles:user_id ( username, flat_number ),
        elections:election_id ( title )
      `)
      .eq('status', 'pending');

    if (error) {
      console.error("Supabase Fetch Error:", error);
      return res.status(400).json({ error: error.message });
    }

    // Format the data for the frontend
    const formattedData = data.map(item => ({
      id: item.id,
      manifesto: item.manifesto,
      status: item.status,
      full_name: item.profiles?.username || "Unknown",
      flat_no: item.profiles?.flat_number || "N/A",
      election_title: item.elections?.title || "General Election"
    }));

    res.json(formattedData);

  } catch (err) {
    console.error("Server Error:", err.message);
    res.status(500).json({ error: "Server Error" });
  }
});

module.exports = router;