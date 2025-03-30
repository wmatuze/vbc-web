const mongoose = require('mongoose');

const LeaderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  bio: String,
  order: {
    type: Number,
    default: 999
  },
  image: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Media'
  },
  contact: {
    email: String,
    phone: String,
    socialMedia: {
      facebook: String,
      twitter: String,
      instagram: String
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Leader', LeaderSchema); 