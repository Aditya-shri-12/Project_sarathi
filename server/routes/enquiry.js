const express = require('express');
const router = express.Router();
const supabase = require('../lib/supabase');

// SUBMIT ENQUIRY ROUTE
router.post('/submit', async (req, res) => {
  const { organizationName, committeeHead, city, state, contactNumber, email } = req.body;

  // Validate required fields
  if (!organizationName || !committeeHead || !city || !state || !contactNumber || !email) {
    return res.status(400).json({ 
      error: "All fields are required" 
    });
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  // Phone validation (basic)
  const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
  if (!phoneRegex.test(contactNumber.replace(/\s/g, ''))) {
    return res.status(400).json({ error: "Invalid contact number format" });
  }

  try {
    // Insert enquiry into database
    // Assuming you have an 'enquiries' table in Supabase
    const { data, error } = await supabase
      .from('enquiries')
      .insert([
        {
          organization_name: organizationName,
          committee_head: committeeHead,
          city: city,
          state: state,
          contact_number: contactNumber,
          email: email,
          status: 'pending', // New enquiries start as pending
          created_at: new Date().toISOString()
        }
      ])
      .select();

    if (error) {
      console.error("Enquiry submission error:", error);
      
      // Handle duplicate email error
      if (error.code === '23505') {
        return res.status(400).json({ 
          error: "An enquiry with this email already exists. Please use a different email or contact support." 
        });
      }
      
      return res.status(500).json({ 
        error: "Failed to submit enquiry. Please try again later." 
      });
    }

    res.status(201).json({
      success: true,
      message: "Enquiry submitted successfully! We'll contact you soon.",
      data: data[0]
    });

  } catch (err) {
    console.error("Enquiry submission error:", err);
    res.status(500).json({ 
      error: "Server error. Please try again later." 
    });
  }
});

// GET ALL ENQUIRIES (Admin only - optional)
router.get('/all', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('enquiries')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json(data);
  } catch (err) {
    console.error("Error fetching enquiries:", err);
    res.status(500).json({ error: "Failed to fetch enquiries" });
  }
});

module.exports = router;

