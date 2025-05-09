const mongoose = require('mongoose');

const FoundationClassSessionSchema = new mongoose.Schema({
  startDate: { 
    type: Date, 
    required: true 
  },
  endDate: { 
    type: Date, 
    required: true 
  },
  day: { 
    type: String, 
    required: true 
  },
  time: { 
    type: String, 
    required: true 
  },
  location: { 
    type: String, 
    required: true 
  },
  capacity: { 
    type: Number, 
    required: true, 
    default: 20 
  },
  enrolledCount: { 
    type: Number, 
    default: 0 
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

// Virtual property to calculate spots left
FoundationClassSessionSchema.virtual('spotsLeft').get(function() {
  return Math.max(0, this.capacity - this.enrolledCount);
});

// Virtual property to format date range for display
FoundationClassSessionSchema.virtual('dateRange').get(function() {
  const formatDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString('en-US', options);
  };
  
  return `${formatDate(this.startDate)} - ${formatDate(this.endDate)}`;
});

// Ensure virtuals are included in JSON output
FoundationClassSessionSchema.set('toJSON', { virtuals: true });
FoundationClassSessionSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('FoundationClassSession', FoundationClassSessionSchema);
