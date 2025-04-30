const mongoose = require('mongoose');

const EventSignupRequestSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  eventType: {
    type: String,
    required: true,
    enum: ['baptism', 'babyDedication', 'other']
  },
  fullName: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true 
  },
  phone: { 
    type: String, 
    required: true 
  },
  // Baptism-specific fields
  testimony: { 
    type: String 
  },
  previousReligion: { 
    type: String 
  },
  // Baby dedication-specific fields
  childName: { 
    type: String 
  },
  childDateOfBirth: { 
    type: Date 
  },
  parentNames: { 
    type: String 
  },
  // General fields
  message: { 
    type: String 
  },
  status: { 
    type: String, 
    default: 'pending', 
    enum: ['pending', 'approved', 'declined'] 
  },
  submittedAt: { 
    type: Date, 
    default: Date.now 
  }
}, { timestamps: true });

module.exports = mongoose.model('EventSignupRequest', EventSignupRequestSchema);
