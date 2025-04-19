const mongoose = require('mongoose');

const ZoneSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  elder: {
    name: {
      type: String,
      required: true
    },
    title: {
      type: String
    },
    bio: {
      type: String
    },
    contact: {
      type: String
    },
    phone: {
      type: String
    },
    image: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Media'
    }
  },
  coverImage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Media'
  },
  iconName: {
    type: String
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

module.exports = mongoose.model('Zone', ZoneSchema);
