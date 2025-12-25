const express = require('express');
const router = express.Router();
const supabase = require('../lib/supabase'); // Use shared Supabase client

// @route POST /api/enquiry
router.post('/', async (req, res) => {
  const { org, head, city, state, phone, email } = req.body;

  // 1. Validation
  if (!org || !head || !email || !phone) {
    return res.status(400).json({ 
      success: false, 
      error: "Missing required fields: Organization, Committee Head, Email, and Phone are required" 
    });
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ success: false, error: "Invalid email format" });
  }

  try {
    // 2. Insert into Database
    // Map frontend field names to database column names
    const { data, error } = await supabase
      .from('enquiries')
      .insert([{ 
        organization_name: org, 
        committee_head: head, 
        city: city || null, 
        state: state || null, 
        contact_number: phone, 
        email: email, 
        status: 'pending' 
      }])
      .select();

    if (error) {
      console.error("Database error:", error);
      
      // Handle duplicate email error
      if (error.code === '23505') {
        return res.status(400).json({ 
          success: false,
          error: "An enquiry with this email already exists. Please use a different email." 
        });
      }
      
      // Handle missing table error
      if (error.code === '42P01') {
        return res.status(500).json({ 
          success: false,
          error: "Database table not found. Please ensure the 'enquiries' table exists in Supabase." 
        });
      }
      
      throw error;
    }

    // 3. Send Response
    res.status(201).json({ 
      success: true, 
      message: "Enquiry submitted successfully! We'll contact you soon.", 
      data: data[0] 
    });

  } catch (err) {
    console.error("Enquiry Route Error:", err);
    res.status(500).json({ 
      success: false,
      error: err.message || "Failed to submit enquiry. Please try again later." 
    });
  }
});

module.exports = router;