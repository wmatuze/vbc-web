const mongoose = require('mongoose');

const CellGroupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  leader: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  meetingTime: String,
  description: String,
  contactInfo: String,
  image: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Media'
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

module.exports = mongoose.model('CellGroup', CellGroupSchema);