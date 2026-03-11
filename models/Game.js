const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  messageId: String,
  manageMessageId: String,
  betMessageId: String,
  channelId: String,
  valorantCode: String,
  categoryId: String,
  waitingVC: String,
  attVC: String,
  defVC: String,
  players: { type: [String], default: [] },
  spectators: { type: Object, default: {} },
  mapName: String,
  mapImage: String,
  changeMapVotes: { type: [String], default: [] },
  locks: { type: Object, default: {} },
  creatorId: String,
  creatorName: String,
  creatorAvatar: String,
  attackers: { type: Array, default: [] },
  defenders: { type: Array, default: [] }
});

module.exports = mongoose.model('Game', gameSchema);