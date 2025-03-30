const mongoose = require('mongoose');

const FoundationClassRegistrationSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  preferredSession: { type: String, required: true },
  questions: { type: String },
  registrationDate: { type: Date, default: Date.now },
  status: { type: String, default: 'registered', enum: ['registered', 'attending', 'completed', 'cancelled'] }
}, { timestamps: true });

module.exports = mongoose.model('FoundationClassRegistration', FoundationClassRegistrationSchema); 