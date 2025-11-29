const router = require('express').Router();
const User = require('../models/user'); // Import the Blueprint we just made

// REGISTER ROUTE
// This listens for requests at "/api/auth/register"
router.post('/register', async (req, res) => {
  try {
    // 1. Get the data from the user (Frontend sends this)
    const { username, password } = req.body;

    // 2. Create a new User object using our Blueprint
    const newUser = new User({
      username: username,
      password: password,
    });

    // 3. Save it to MongoDB
    const user = await newUser.save();

    // 4. Send back a success message
    res.status(200).json(user);
    console.log("✅ New User Registered:", username);

  } catch (err) {
    // If something goes wrong (like duplicate name), tell us
    res.status(500).json(err);
    console.log("❌ Registration Failed:", err.message);
  }
});

// LOGIN ROUTE
router.post('/login', async (req, res) => {
  try {
    // 1. Find the user by their name
    const user = await User.findOne({ username: req.body.username });
    
    // 2. If no user found...
    if (!user) {
      return res.status(404).json("User not found!");
    }

    // 3. Check password (Simple check for now, we will encrypt later)
    if (user.password !== req.body.password) {
      return res.status(400).json("Wrong Password!");
    }

    // 4. Success!
   // INSTEAD OF JUST TEXT, SEND THE WHOLE USER DATA
    // We exclude the password for security (optional but good practice)
    const { password, ...others } = user._doc; 
    res.status(200).json(others);
    console.log("🔓 User Logged In:", user.username);

  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;