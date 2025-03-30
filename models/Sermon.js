const mongoose = require('mongoose');

const SermonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  speaker: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  videoId: String,
  duration: String,
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

module.exports = mongoose.model('Sermon', SermonSchema); 