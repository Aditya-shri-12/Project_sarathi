// server/models/Whitelist.js
const mongoose = require('mongoose');

const WhitelistSchema = new mongoose.Schema({
  flatNumber: { 
    type: String, 
    required: true, 
    unique: true // e.g. "A-101"
  },
  email: { 
    type: String, 
    required: true,
    unique: true // e.g. "sharma@example.com"
  },
  // This is the checkmark. 
  // false = Resident hasn't signed up yet. 
  // true = Resident has claimed their account.
  isRegistered: { 
    type: Boolean, 
    default: false 
  }
});

module.exports = mongoose.model('Whitelist', WhitelistSchema);