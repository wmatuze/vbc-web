const mongoose = require("mongoose");

const VisitorRegistrationSchema = new mongoose.Schema(
  {
    title:          { type: String, enum: ["Mr", "Mrs", "Miss", ""] },
    fullName:       { type: String, required: true, trim: true },
    ageGroup:       { type: String, enum: ["13-17", "18-25", "26-35", "36-45", "46-55", "56+", ""] },
    maritalStatus:  { type: String, enum: ["Single", "Engaged", "Married", "Divorced", ""] },
    phone:          { type: String, trim: true },
    email:          { type: String, trim: true, lowercase: true },
    address:        { type: String, trim: true },
    birthday:       { type: String, trim: true },
    hasChildren:    { type: Boolean, default: false },
    children:       [{ type: String, trim: true }],
    requestContact: { type: Boolean, default: false },
    acceptedJesus:  { type: Boolean, default: null },
    wantToAccept:   { type: String, enum: ["yes", "not-today", ""], default: "" },
    visitDate:      { type: Date, default: Date.now },
    status:         { type: String, enum: ["new", "contacted", "followed-up"], default: "new" },
    notes:          { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("VisitorRegistration", VisitorRegistrationSchema);
