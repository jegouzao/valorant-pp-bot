const mongoose = require('mongoose');

const clipSchema = new mongoose.Schema({
  guildId: {
    type: String,
    required: true
  },

  channelId: {
    type: String,
    required: true
  },

  messageId: {
    type: String,
    required: true
  },

  botMessageId: {
    type: String,
    default: null
  },

  authorId: {
    type: String,
    required: true
  },

  mediaIndex: {
    type: Number,
    required: true
  },

  mediaUrl: {
    type: String,
    required: true
  },

  mediaType: {
    type: String,
    default: 'unknown'
  },

  likes: {
    type: [String],
    default: []
  },

  monthKey: {
    type: String,
    required: true
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

clipSchema.index(
  {
    messageId: 1,
    mediaIndex: 1
  },
  {
    unique: true
  }
);

module.exports = mongoose.model(
  'Clip',
  clipSchema
);