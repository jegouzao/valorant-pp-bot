const mongoose = require('mongoose');

const inviteSchema = new mongoose.Schema({
  inviterId: { type: String, required: true, unique: true },
  invites: { type: Number, default: 0 },
  members: { type: [String], default: [] }
});

module.exports = mongoose.model('Invite', inviteSchema);