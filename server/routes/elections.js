const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// ==========================================
// 1. CREATE ELECTION (Matches Admin Dashboard)
// ==========================================
router.post('/create', async (req, res) => {
  // Receive exactly what the Admin Dashboard sends
  const { title, description, startDate, endDate } = req.body;

  try {
    // Validate inputs
    if (!title || !startDate || !endDate) {
      return res.status(400).json({ error: 'Title, Start Date, and End Date are required' });
    }

    // Insert into 'elections' table
    const { data, error } = await supabase
      .from('elections')
      .insert([
        {
          title,
          description,
          start_date: startDate, // Map 'startDate' to DB column 'start_date'
          end_date: endDate,     // Map 'endDate' to DB column 'end_date'
          status: 'upcoming'
        }
      ])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ 
      success: true, 
      message: 'Election created successfully', 
      election: data 
    });

  } catch (err) {
    console.error('Error creating election:', err);
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 2. GET ALL ELECTIONS (For Voters)
// ==========================================
router.get('/all', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('elections')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 3. NOMINATE YOURSELF (For Future Use)
// ==========================================
router.post('/nominate', async (req, res) => {
  const { userId, electionId, position, manifesto } = req.body;

  try {
    // Check if already nominated
    const { data: existing } = await supabase
      .from('candidates')
      .select('*')
      .eq('user_id', userId)
      .eq('election_id', electionId)
      .single();

    if (existing) {
      return res.status(400).json({ error: "You have already nominated yourself!" });
    }

    const { data, error } = await supabase
      .from('candidates')
      .insert([
        {
          user_id: userId,
          election_id: electionId,
          position: position,
          manifesto: manifesto,
          status: 'pending'
        }
      ]);

    if (error) throw error;
    res.status(201).json({ message: "Nomination submitted!" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;