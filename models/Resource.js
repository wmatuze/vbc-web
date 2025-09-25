const mongoose = require('mongoose');

const ResourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['document', 'video', 'audio', 'link', 'image', 'presentation'],
    required: true
  },
  category: {
    type: String,
    enum: ['audio_sermons', 'foundation', 'discipleship', 'leadership', 'ministry', 'bible_study', 'worship', 'general'],
    default: 'general'
  },
  file: {
    filename: String,
    originalName: String,
    path: String,
    mimetype: String,
    size: Number
  },
  url: String, // For external links
  // Removed accessLevel and classRestrictions - everything is public
  // Categories provide sufficient organization
  tags: [String],
  author: {
    name: String,
    email: String
  },
  downloads: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0
  },
  active: {
    type: Boolean,
    default: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Virtual to get file size in human readable format
ResourceSchema.virtual('fileSizeFormatted').get(function() {
  if (!this.file?.size) return null;
  
  const bytes = this.file.size;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  
  if (bytes === 0) return '0 Bytes';
  
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
});

// Virtual to check if resource is downloadable
ResourceSchema.virtual('isDownloadable').get(function() {
  return this.type !== 'link' && this.file && this.file.path;
});

// Ensure virtuals are included in JSON output
ResourceSchema.set('toJSON', { virtuals: true });
ResourceSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Resource', ResourceSchema);
