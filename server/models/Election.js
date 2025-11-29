// server/models/Election.js
const mongoose = require('mongoose');

const ElectionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true, // e.g. "Secretary Election 2025"
  },
  description: {
    type: String,
  },
  // We store candidates as a list inside the Election
  candidates: [
    {
      name: String, // "Mr. Sharma"
      party: String, // "Wing A Party"
      // We do NOT store vote counts here yet. We count them dynamically later.
    }
  ],
  // When does voting start and stop?
  startTime: {
    type: Date,
    default: Date.now 
  },
  endTime: {
    type: Date, 
    required: true
  },
  // Is the election currently active?
  isActive: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model('Election', ElectionSchema);