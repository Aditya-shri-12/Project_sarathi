// server`/routes/vote.js
const AES = require("crypto-js/aes"); // <--- Import Encryption
const enc = require("crypto-js/enc-utf8"); // <--- Import Encoding
const router = require('express').Router(); // We are creating a router for vote-related routes
const Vote = require('../models/Vote'); // Import the Vote model
const User = require('../models/user');// Import the User model
const { route } = require('./auth');// Import express route
const crypto = require('crypto');   // <--- Import crypto for generating unique hashes

// POST /api/vote/cast
// This route handles casting a vote

router.post('/cast', async (req, res) => {
  const { userId, electionId, encryptedVote } = req.body;

  try {
    // 1. Check User
    const user = await User.findById(userId);
    if (!user) return res.status(404).json("User not found!");

    // 2. Check Double Voting
    if (user.votedElections.includes(electionId)) {
      return res.status(400).json("FRAUD ALERT: You have already voted!");
    }

    // 3. GENERATE UNIQUE HASH (The Fix) 🛡️
    // This creates a random 32-character string (e.g., "a1b2c3d4...")
    const uniqueHash = crypto.randomBytes(16).toString('hex');

    // 4. Create Vote with the Hash
    const newVote = new Vote({
      electionId: electionId,
      encryptedVote: encryptedVote,
      voteHash: uniqueHash // <--- WE ADDED THIS
    });
    
    // 5. Save Everything
    await newVote.save();
    
    user.votedElections.push(electionId);
    await user.save();

    res.status(200).json("Vote Cast Successfully! 🗳️");

  } catch (err) {
    // If we get a duplicate error again (very rare collision), tell the user to retry
    if (err.code === 11000) {
       return res.status(500).json("Error generating receipt. Please try again.");
    }
    res.status(500).json(err.message);
  }
});

// GET RESULTS (Admin Only)
router.get('/results/:electionId', async (req, res) => {
  try {
    const { electionId } = req.params;

    // 1. Get all votes for this election
    const votes = await Vote.find({ electionId: electionId });

    // 2. The Tally Map (e.g., { "Pizza": 10, "Burger": 5 })
    const results = {};

    // 3. Loop through every vote and decrypt it
    votes.forEach((vote) => {
      try {
        // DECRYPT
        const bytes = AES.decrypt(vote.encryptedVote, "MY_SECRET_KEY");
        const candidateName = bytes.toString(enc);

        // COUNT
        if (candidateName) {
          if (results[candidateName]) {
            results[candidateName]++;
          } else {
            results[candidateName] = 1;
          }
        }
      } catch (e) {
        console.log("Failed to decrypt a vote (might be tampered)");
      }
    });

    // 4. Send back the totals
    res.status(200).json(results);

  } catch (err) {
    res.status(500).json(err.message);
  }
});


module.exports = router;