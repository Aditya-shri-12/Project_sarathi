const express = require('express');
const router = express.Router();
const supabase = require('../lib/supabase'); // Your existing shared Supabase client
const sendEmail = require('../utils/mailservice'); // ✅ IMPORT EMAIL SERVICE

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
          error: "An enquiry with this email already exists." 
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

    // ============================================
    // 3. ✅ SEND EMAILS (Added this section)
    // ============================================
    
    // Email A: "Thank You" to the User (The person who filled the form)
    await sendEmail({
      to: email,
      subject: "Welcome to Saarthi - Enquiry Received",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #0f172a;">Welcome to Saarthi!</h2>
          <p>Dear <strong>${head}</strong>,</p>
          <p>Thank you for registering interest for <strong>${org}</strong>.</p>
          <p>We have received your details. Our team will verify your organization and contact you at <strong>${phone}</strong> shortly.</p>
          <br>
          <p style="color: #64748b; font-size: 14px;">Regards,<br><strong>Team Saarthi</strong></p>
        </div>
      `
    });

    // Email B: Alert to ADMIN (You)
    if (process.env.ADMIN_EMAIL) {
        await sendEmail({
          to: process.env.ADMIN_EMAIL,
          subject: `🚀 New Lead: ${org}`,
          html: `
            <h3>New Enquiry Received</h3>
            <ul>
              <li><strong>Organization:</strong> ${org}</li>
              <li><strong>Head Name:</strong> ${head}</li>
              <li><strong>Phone:</strong> ${phone}</li>
              <li><strong>Email:</strong> ${email}</li>
              <li><strong>Location:</strong> ${city}, ${state}</li>
            </ul>
          `
        });
    }

    // 4. Send Success Response
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