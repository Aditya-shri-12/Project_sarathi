// server/models/Vote.js
const mongoose = require('mongoose');

const VoteSchema = new mongoose.Schema({
  // Which election is this vote for?
  electionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Election',
    required: true
  },
  // The "Sealed Envelope"
  // We will encrypt this on the frontend before sending it here.
  // It will look like: "U2FsdGVkX1..."
  encryptedVote: {
    type: String,
    required: true
  },
  // Optional: To prevent the exact same encrypted string appearing twice
  // (which could leak info), we will add a unique hash later.
  voteHash: {
    type: String,
    unique: true
  }
}, { timestamps: true }); // This adds 'createdAt' time automatically

module.exports = mongoose.model('Vote', VoteSchema);