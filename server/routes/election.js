// server/routes/election.js
const router = require('express').Router();
const Election = require('../models/Election');

// ROUTE 1: Create a new Election (Admin only)
router.post('/create', async (req, res) => {
  try {
    const newElection = new Election({
      title: req.body.title,
      description: req.body.description,
      candidates: req.body.candidates, // List of names
      endTime: req.body.endTime // When does it end?
    });

    const savedElection = await newElection.save();
    res.status(200).json(savedElection);
    console.log("✅ Election Created:", savedElection.title);

  } catch (err) {
    res.status(500).json(err);
  }
});

// ROUTE 2: Get all Elections (For the Voter Dashboard)
router.get('/all', async (req, res) => {
  try {
    const elections = await Election.find();
    res.status(200).json(elections);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;