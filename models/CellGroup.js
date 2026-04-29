const mongoose = require("mongoose");

const CellGroupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  leader: {
    type: String,
    required: true,
  },
  contact: String,
  leaderContact: String, // legacy alias
  leaderImage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Media",
  },
  location: {
    type: String,
    required: true,
  },
  zone: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Zone",
    required: true,
  },
  meetingDay: String,
  meetingTime: String,
  description: String,
  capacity: String,
  tags: [String],
  coordinates: {
    lat: Number,
    lng: Number,
  },
  imageUrl: {
    type: String,
    default: null,
  },
  image: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Media",
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("CellGroup", CellGroupSchema);
