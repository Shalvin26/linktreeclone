const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  linkId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Link',
    default: null
  },
  type: {
    type: String,
    enum: ['visit', 'click'],
    required: true
  },
  platform: {
    type: String,
    default: ''
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Analytics', analyticsSchema);
