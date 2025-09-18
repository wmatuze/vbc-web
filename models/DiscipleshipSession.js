const mongoose = require('mongoose');

const DiscipleshipSessionSchema = new mongoose.Schema({
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DiscipleshipClass',
    required: true
  },
  cohortName: {
    type: String,
    required: true // e.g., "Spring 2024 Discipleship", "Leadership Track A"
  },
  startDate: { 
    type: Date, 
    required: true 
  },
  endDate: { 
    type: Date, 
    required: true 
  },
  schedule: {
    day: { 
      type: String, 
      required: true // e.g., "Sunday", "Wednesday"
    },
    time: { 
      type: String, 
      required: true // e.g., "6:00 PM - 7:30 PM"
    },
    frequency: {
      type: String,
      enum: ['weekly', 'bi-weekly', 'monthly'],
      default: 'weekly'
    }
  },
  location: { 
    type: String, 
    required: true 
  },
  capacity: { 
    type: Number, 
    required: true, 
    default: 15 
  },
  enrolledCount: { 
    type: Number, 
    default: 0 
  },
  facilitator: {
    name: { type: String, required: true },
    email: { type: String },
    phone: { type: String }
  },
  status: {
    type: String,
    enum: ['upcoming', 'active', 'completed', 'cancelled'],
    default: 'upcoming'
  },
  registrationDeadline: {
    type: Date,
    required: true
  },
  resources: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resource'
  }],
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

// Virtual property to calculate spots left
DiscipleshipSessionSchema.virtual('spotsLeft').get(function() {
  return Math.max(0, this.capacity - this.enrolledCount);
});

// Virtual property to check if registration is open
DiscipleshipSessionSchema.virtual('registrationOpen').get(function() {
  const now = new Date();
  return now <= this.registrationDeadline && this.spotsLeft > 0 && this.status === 'upcoming';
});

// Virtual property to format date range for display
DiscipleshipSessionSchema.virtual('dateRange').get(function() {
  const formatDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString('en-US', options);
  };
  
  return `${formatDate(this.startDate)} - ${formatDate(this.endDate)}`;
});

// Ensure virtuals are included in JSON output
DiscipleshipSessionSchema.set('toJSON', { virtuals: true });
DiscipleshipSessionSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('DiscipleshipSession', DiscipleshipSessionSchema);
