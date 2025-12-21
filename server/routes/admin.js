const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase (Same as in auth.js)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// ==========================================
// 1. GET PENDING RESIDENTS
// ==========================================
router.get('/pending-residents', async (req, res) => {
  try {
    // Fetch all profiles where is_verified is FALSE and role is NOT 'admin'
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('is_verified', false)
      .neq('role', 'admin'); // Don't show unverified admins, just residents

    if (error) throw error;

    res.json(data);
  } catch (err) {
    console.error("Error fetching pending:", err);
    res.status(500).json({ error: "Failed to fetch residents" });
  }
});

// ==========================================
// 2. APPROVE RESIDENT
// ==========================================
router.put('/approve/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Update the user's profile to verified = true
    const { error } = await supabase
      .from('profiles')
      .update({ is_verified: true })
      .eq('id', id);

    if (error) throw error;

    res.json({ success: true, message: "Resident Approved!" });
  } catch (err) {
    console.error("Approve Error:", err);
    res.status(500).json({ error: "Failed to approve" });
  }
});

// ==========================================
// 3. REJECT RESIDENT
// ==========================================
router.delete('/reject/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // 1. Delete from profiles
    const { error: profileError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', id);

    if (profileError) throw profileError;

    // 2. Delete from Auth Users (So they can register again if it was a mistake)
    // Note: This requires the 'service_role' key usually, but works if RLS is off.
    const { error: authError } = await supabase.auth.admin.deleteUser(id);
    
    // If we can't delete from Auth (due to permissions), just profile delete is okay for now.
    if (authError) console.log("Could not delete from auth (permissions issue), but profile is gone.");

    res.json({ success: true, message: "Resident Rejected" });
  } catch (err) {
    console.error("Reject Error:", err);
    res.status(500).json({ error: "Failed to reject" });
  }
});

module.exports = router;