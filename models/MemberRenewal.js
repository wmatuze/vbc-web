const mongoose = require('mongoose');

const MemberRenewalSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  birthday: { type: Date, required: true },
  memberSince: { type: String, required: true },
  ministryInvolvement: { type: String },
  addressChange: { type: Boolean, default: false },
  newAddress: { type: String },
  agreeToTerms: { type: Boolean, required: true },
  renewalDate: { type: Date, default: Date.now },
  status: { type: String, default: 'pending', enum: ['pending', 'approved', 'declined'] }
}, { timestamps: true });

module.exports = mongoose.model('MemberRenewal', MemberRenewalSchema); 