const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');
const sendEmail = require('../utils/mailservice'); // ✅ Import the new service

// Initialize Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// @route POST /api/enquiry
router.post('/', async (req, res) => {
  const { org, head, city, state, phone, email } = req.body;

  // 1. Validation
  if (!org || !head || !email || !phone) {
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }

  try {
    // 2. Insert into Database
    const { data, error } = await supabase
      .from('enquiries')
      .insert([{ org_name: org, head_name: head, city, state, phone, email, status: 'Pending' }])
      .select();

    if (error) throw error;

    // ============================================
    // 3. ✅ SEND EMAILS 
    // ============================================
    
    // Email A: "Thank You" to the User
    await sendEmail({
      to: email,
      subject: "Welcome to Saarthi - Enquiry Received",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #0f172a;">Welcome to Saarthi!</h2>
          <p>Dear <strong>${head}</strong>,</p>
          <p>Thank you for registering <strong>${org}</strong> with us.</p>
          <p>Our team has received your details and will contact you at <strong>${phone}</strong> shortly.</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
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
              <li><strong>Org:</strong> ${org}</li>
              <li><strong>Head:</strong> ${head}</li>
              <li><strong>Phone:</strong> ${phone}</li>
              <li><strong>Email:</strong> ${email}</li>
            </ul>
          `
        });
    }

    // 4. Send Response
    res.status(201).json({ success: true, message: "Enquiry submitted successfully!", data });

  } catch (err) {
    console.error("Route Error:", err.message);
    res.status(500).json({ error: "Failed to submit enquiry" });
  }
});

module.exports = router;