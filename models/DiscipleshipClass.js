const mongoose = require('mongoose');

const DiscipleshipClassSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  duration: {
    value: { type: Number, required: true }, // Number of weeks/months
    unit: { type: String, enum: ['weeks', 'months'], default: 'weeks' }
  },
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  prerequisites: [{
    type: String // e.g., "Foundation Classes", "Basic Discipleship"
  }],
  curriculum: [{
    week: { type: Number, required: true },
    title: { type: String, required: true },
    description: { type: String },
    topics: [String],
    resources: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Resource' }]
  }],
  instructor: {
    name: { type: String, required: true },
    email: { type: String },
    phone: { type: String },
    bio: { type: String }
  },
  category: {
    type: String,
    enum: ['discipleship', 'leadership', 'ministry', 'biblical_studies', 'spiritual_growth'],
    default: 'discipleship'
  },
  active: { 
    type: Boolean, 
    default: true 
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

// Virtual property to get curriculum length
DiscipleshipClassSchema.virtual('curriculumLength').get(function() {
  return this.curriculum?.length ?? 0;
});

// Virtual property to format duration display
DiscipleshipClassSchema.virtual('durationDisplay').get(function() {
  if (!this.duration) return '';
  return `${this.duration.value} ${this.duration.unit}`;
});

// Ensure virtuals are included in JSON output
DiscipleshipClassSchema.set('toJSON', { virtuals: true });
DiscipleshipClassSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('DiscipleshipClass', DiscipleshipClassSchema);
