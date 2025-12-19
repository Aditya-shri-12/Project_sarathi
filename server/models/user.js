const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  // CORE IDENTITY
  username: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true, 
  },
  
  // SOCIETY DETAILS
  flatNumber: {
    type: String,
    required: true,
    unique: true // Prevents 2 people claiming the same flat
  },
  email: {
    type: String,
    required: true,
    unique: true
  },

  // PERMISSIONS
  isAdmin: { 
    type: Boolean, 
    default: false, 
  },
  
  // THE NEW "DIGITAL BOUNCER" STATUS 🛡️
  status: {
    type: String,
    enum: ['pending', 'active', 'rejected'],
    default: 'pending' // Everyone starts here!
  },

  // VOTING HISTORY
  votedElections: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Election',
    default: [] 
  }]
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);