const Whitelist = require('../models/whitelist');
const router = require('express').Router();
const User = require('../models/user'); // Import the Blueprint we just made

// REGISTER ROUTE
// This listens for requests at "/api/auth/register"
// SECURE REGISTER ROUTE (The Bouncer)
router.post('/register', async (req, res) => {
  try {
    // We expect the user to send these 4 things
    const { username, password, flatNumber, email } = req.body;

    // 🛑 CHECK 1: Is this person on the Guest List?
    const validResident = await Whitelist.findOne({ 
      flatNumber: flatNumber, 
      email: email 
    });

    // If not found in whitelist, KICK THEM OUT
    if (!validResident) {
      return res.status(401).json("ACCESS DENIED: You are not in the society records. Please contact the Secretary.");
    }

    // 🛑 CHECK 2: Have they already registered?
    if (validResident.isRegistered) {
      return res.status(400).json("FRAUD ALERT: An account for this flat already exists!");
    }

    // ✅ CHECK 3: If passed, Create the User
    const newUser = new User({
      username: username,
      password: password,
      // We explicitly save these details now
      email: email,
      flatNumber: flatNumber,
      // Default role is 'resident'
      role: 'resident'
    });

    const user = await newUser.save();

    // 📝 IMPORTANT: Mark them as "Registered" in the Whitelist
    // This prevents them (or anyone else) from signing up with this flat again.
    validResident.isRegistered = true;
    await validResident.save();

    res.status(200).json(user);
    console.log(`✅ Secure Registration: ${username} claimed Flat ${flatNumber}`);

  } catch (err) {
    res.status(500).json(err.message);
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