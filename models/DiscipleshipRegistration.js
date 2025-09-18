const mongoose = require("mongoose");

// Simplified discipleship registration - similar to foundation classes
const DiscipleshipRegistrationSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    preferredSession: { type: String, required: true }, // Session name/description
    sessionId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'DiscipleshipSession',
      required: true 
    },
    classId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'DiscipleshipClass',
      required: true 
    },
    previousClasses: { type: String }, // Free text like foundation classes
    questions: { type: String },
    emergencyContact: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      relationship: { type: String, required: true }
    },
    motivationReason: { type: String, required: true },
    registrationDate: { type: Date, default: Date.now },
    status: {
      type: String,
      default: "pending",
      enum: [
        "pending",
        "approved", 
        "attending",
        "completed",
        "cancelled",
        "rejected"
      ],
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "DiscipleshipRegistration",
  DiscipleshipRegistrationSchema
);
