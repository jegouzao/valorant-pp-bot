const mongoose = require('mongoose');

const pointsSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  rr: { type: Number, default: 0 },
  games: { type: Number, default: 0 },
  wins: { type: Number, default: 0 }
});

module.exports = mongoose.model('Points', pointsSchema);