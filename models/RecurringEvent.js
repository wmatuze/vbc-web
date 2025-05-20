const mongoose = require("mongoose");

const RecurringEventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  // Recurrence pattern
  recurrenceType: {
    type: String,
    enum: ["weekly", "monthly", "yearly"],
    required: true,
  },
  // For weekly: 0 = Sunday, 1 = Monday, etc.
  dayOfWeek: {
    type: Number,
    min: 0,
    max: 6,
  },
  // For monthly by day: "first", "second", "third", "fourth", "last"
  weekOfMonth: {
    type: String,
    enum: ["first", "second", "third", "fourth", "last"],
  },
  // For monthly by date: 1-31
  dayOfMonth: {
    type: Number,
    min: 1,
    max: 31,
  },
  // For yearly
  month: {
    type: Number,
    min: 0,
    max: 11,
  },
  // Time information
  time: {
    type: String,
    required: true,
  },
  // Display information
  icon: {
    type: String,
  },
  color: {
    type: String,
    default: "primary",
  },
  // Whether this is a featured recurring event
  featured: {
    type: Boolean,
    default: false,
  },
  // Whether this event is active
  active: {
    type: Boolean,
    default: true,
  },
  // Additional metadata
  location: String,
  ministry: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("RecurringEvent", RecurringEventSchema);
