const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  bio: {
    type: String,
    default: ''
  },
  photo: {
    type: String,
    default: ''
  },
  theme: {
    type: String,
    default: 'default'
  },
  socialLinks: [
    {
      platform: String,
      url: String
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);