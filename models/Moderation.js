const mongoose = require('mongoose');

const moderationSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  banned: { type: Boolean, default: false },
  reason: { type: String, default: '' },
  date: { type: String, default: '' },
  riotPseudo: { type: String, default: '' },
  username: { type: String, default: '' }
});

module.exports = mongoose.model('Moderation', moderationSchema);