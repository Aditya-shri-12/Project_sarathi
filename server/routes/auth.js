const express = require('express');
const router = express.Router();
const supabase = require('../lib/supabase');

// ==========================================
// 1. REGISTER/SIGNUP ROUTE (New Users)
// ==========================================
router.post('/register', async (req, res) => {
  const { email, password, username, flatNumber } = req.body;

  try {
    // 1. Sign up user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) return res.status(400).json({ error: authError.message });

    // 2. Insert into 'profiles' table
    if (authData.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: authData.user.id,
            email: email,
            username: username,
            flat_number: flatNumber,
            role: 'resident', // Default role
            is_verified: false
          }
        ]);

      if (profileError) {
        console.error("Profile Creation Error:", profileError);
        return res.status(400).json({ 
          error: profileError.message || "Failed to create user profile. Please contact support." 
        });
      }
    }

    res.status(201).json({ message: "Registration successful! Check your email." });

  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ error: "Server Error during registration" });
  }
});

// Alias for /register (some clients use /signup)
router.post('/signup', async (req, res) => {
  const { email, password, username, flatNumber } = req.body;

  // Validate required fields
  if (!email || !password || !username || !flatNumber) {
    return res.status(400).json({ 
      error: "All fields are required: email, password, username, and flatNumber" 
    });
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  // Password length validation
  if (password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters long" });
  }

  try {
    // 1. Sign up user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      console.error("Supabase Auth Error:", authError);
      return res.status(400).json({ error: authError.message || "Registration failed" });
    }

    // 2. Insert into 'profiles' table
    if (authData.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: authData.user.id,
            email: email,
            username: username,
            flat_number: flatNumber,
            role: 'resident', // Default role
            is_verified: false
          }
        ]);

      if (profileError) {
        console.error("Profile Creation Error:", profileError);
        return res.status(400).json({ 
          error: profileError.message || "Failed to create user profile. Please contact support." 
        });
      }
    } else {
      return res.status(400).json({ error: "User account creation failed. Please try again." });
    }

    res.status(201).json({ message: "Registration successful! Check your email." });

  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ error: "Server Error during registration" });
  }
});

// ==========================================
// 2. GENERAL LOGIN (For Voters/Residents)
// ==========================================
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Ask Supabase to sign in
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) return res.status(400).json({ error: "Invalid credentials" });

    // 2. Fetch user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (profileError) return res.status(400).json({ error: "Profile not found" });

    // 3. Send success with userId
    res.status(200).json({
      success: true,
      message: "Login successful",
      token: authData.session.access_token,
      role: profile.role, 
      userId: profile.id, // ✅ ADDED: This allows frontend to save user ID
      user: {
        id: profile.id,
        name: profile.username,
        email: profile.email,
        isVerified: profile.is_verified
      }
    });

  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ error: "Server Error" });
  }
});

// ==========================================
// 3. ADMIN LOGIN (Debug Version)
// ==========================================
router.post('/admin-login', async (req, res) => {
  const { email, password } = req.body;
  
  console.log("-----------------------------------------");
  console.log("👉 ADMIN LOGIN ATTEMPT:");
  console.log("📧 Email:", email);
  // console.log("🔑 Password:", password); // Security: Don't log passwords

  try {
    // 1. Authenticate with Supabase
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      console.log("❌ Supabase Auth Failed:", authError.message);
      return res.status(400).json({ message: "Wrong Password or Email" });
    }

    console.log("✅ Supabase Auth Success. User ID:", authData.user.id);

    // 2. Check the Role in Database
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (profileError || !profile) {
      console.log("❌ Profile Search Failed. Error:", profileError?.message);
      return res.status(400).json({ message: "Admin profile not found in table" });
    }

    console.log("👤 Profile Found. Role is:", profile.role);

    // 3. SECURITY CHECK
    if (profile.role !== 'admin') {
      console.log("⛔ Access Denied: User is a", profile.role);
      return res.status(403).json({ 
        success: false, 
        message: "ACCESS DENIED. You are not an Administrator." 
      });
    }

    // 4. Success
    console.log("🎉 Login Successful!");
    res.status(200).json({
      success: true,
      message: "Welcome Admin",
      token: authData.session.access_token,
      role: 'admin',
      userId: profile.id // ✅ ADDED: Admins might need their ID too
    });

  } catch (err) {
    console.error("🔥 Server Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;