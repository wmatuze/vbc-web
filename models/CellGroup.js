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
  leaderImage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Media",
  },
  leaderContact: String,
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
  image: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Media",
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
