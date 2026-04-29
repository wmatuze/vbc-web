const mongoose = require('mongoose');

const MediaSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  path: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  category: {
    type: String,
    default: 'general'
  },
  // Cloudinary public_id — used to delete the file from Cloudinary if the record is deleted
  cloudinaryId: {
    type: String,
    default: null,
  },
  uploadDate: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Media', MediaSchema); 