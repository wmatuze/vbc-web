const mongoose = require('mongoose');

const CellGroupJoinRequestSchema = new mongoose.Schema({
  cellGroup: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CellGroup',
    required: true
  },
  name: {
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
  whatsapp: {
    type: String
  },
  message: {
    type: String
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('CellGroupJoinRequest', CellGroupJoinRequestSchema);
