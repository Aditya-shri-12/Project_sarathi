const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  // 👇 THIS WAS MISSING! 👇
  // This is the memory list of elections this user has voted in.
  votedElections: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Election',
    default: [] // Important: Start with an empty list, not 'undefined'
  }]
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);