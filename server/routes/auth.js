const router = require('express').Router();
const User = require('../models/user');

// PERFECT SIGNUP ROUTE (VIP Email Check)
router.post('/signup', async (req, res) => {
  try {
    const { username, password, flatNumber, email } = req.body;

    // 1. Check Duplicates
    const existingUser = await User.findOne({ 
      $or: [{ email: email }, { flatNumber: flatNumber }, { username: username }] 
    });

    if (existingUser) {
      return res.status(400).json("User details already exist!");
    }

    // 2. THE SECURITY CHECK 🛡️
    // We check if the email matches the Secret VIP Email in .env
    const isSuperAdmin = email === process.env.SUPER_ADMIN_EMAIL;

    // 3. Set Status based on the check
    const roleStatus = isSuperAdmin ? 'active' : 'pending';
    const roleAdmin = isSuperAdmin ? true : false;

    // 4. Create User
    const newUser = new User({
      username,
      password,
      flatNumber,
      email,
      status: roleStatus,
      isAdmin: roleAdmin
    });

    await newUser.save();

    // 5. Response
    if (isSuperAdmin) {
      res.status(200).json("Welcome Founder! Admin Access Granted.");
    } else {
      res.status(200).json("Request Submitted! Wait for Approval.");
    }

  } catch (err) {
    res.status(500).json(err.message);
  }
});

// 2. SECURE LOGIN (Enterprise Grade)
router.post('/login', async (req, res) => {
  try {
    // 1. Find User
    const user = await User.findOne({ 
      // Allow logging in with either Username OR Email
      $or: [{ username: req.body.username }, { email: req.body.username }]
    });

    if (!user) return res.status(404).json("User not found!");

    // 2. STATUS CHECK (The Gatekeeper)
    if (user.status === 'pending') {
      return res.status(403).json("ACCOUNT PENDING: Please wait for Committee approval.");
    }
    if (user.status === 'rejected') {
      return res.status(403).json("ACCESS DENIED: Your account has been suspended.");
    }

    // 3. PASSWORD CHECK (Mandatory for Everyone)
    // In a real production app, use bcrypt.compare(req.body.password, user.password)
    if (user.password !== req.body.password) {
      return res.status(400).json("Invalid Credentials!");
    }

    // 4. SUCCESS
    // Remove password from the data we send back
    const { password, ...others } = user._doc;
    res.status(200).json(others);

  } catch (err) {
    res.status(500).json(err.message);
  }
});

// 3. ADMIN: Get Pending Requests
router.get('/pending-users', async (req, res) => {
  try {
    // Only fetch users who are waiting
    const pendingList = await User.find({ status: 'pending' });
    res.status(200).json(pendingList);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// 4. ADMIN: Approve or Reject
router.put('/update-status/:id', async (req, res) => {
  try {
    const { status } = req.body; // Expecting 'active' or 'rejected'
    
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id, 
      { status: status },
      { new: true }
    );
    
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

module.exports = router;