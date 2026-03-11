const mongoose = require('mongoose');

const riotUserSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  pseudo: { type: String, default: '' }
});

module.exports = mongoose.model('RiotUser', riotUserSchema);