const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: Date,
  // Frontend compatibility fields
  date: String, // Formatted date string (e.g., "April 30, 2025")
  time: String, // Formatted time string (e.g., "7:00 PM")
  ministry: String, // Ministry organizing the event
  location: String,
  capacity: Number,
  registrationUrl: String,
  organizer: String,
  contactEmail: String,
  featured: {
    type: Boolean,
    default: false,
  },
  tags: [String],
  isRecurring: {
    type: Boolean,
    default: false,
  },
  recurrencePattern: String,
  // Type field for proper categorization
  type: {
    type: String,
    default: "event",
  },
  image: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Media",
  },
  imageUrl: String, // Direct URL to image if not using Media reference
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Event", EventSchema);
