const mongoose = require('mongoose');

const LeaderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  bio: String,
  department: String,
  order: {
    type: Number,
    default: 999,
  },
  // Cloudinary URL (or legacy /uploads/... path) stored directly
  imageUrl: {
    type: String,
    default: null,
  },
  // ObjectId ref kept for backward compatibility with populated queries
  image: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Media',
    default: null,
  },
  ministryFocus: {
    type: [String],
    default: [],
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  },
  startDate: String,
  contact: {
    email: String,
    phone: String,
    socialMedia: {
      facebook: String,
      twitter: String,
      instagram: String,
      linkedin: String,
      youtube: String,
    },
  },
  // Flattened contact fields sent directly by the form
  email: String,
  phone: String,
  socialMedia: {
    facebook: String,
    twitter: String,
    instagram: String,
    linkedin: String,
    youtube: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Leader', LeaderSchema);