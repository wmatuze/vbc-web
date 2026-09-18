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
  width: Number,
  height: Number,
  format: String,
  title: {
    type: String,
    required: true
  },
  category: {
    type: String,
    default: 'general'
  },
  galleryCollection: {
    type: String,
    enum: ['worship', 'youth', 'outreach', 'events', 'ministry'],
  },
  // Cloudinary public_id — used to delete the file from Cloudinary if the record is deleted
  cloudinaryId: {
    type: String,
    default: null,
  },
  resourceType: String,
  uploadDate: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Media', MediaSchema);
