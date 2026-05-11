const mongoose = require("mongoose");

// Singleton — only one document ever exists
const ChurchConfigSchema = new mongoose.Schema({
  name:            { type: String, default: "Victory Bible Church" },
  address:         { type: String, default: "" },
  email:           { type: String, default: "" },
  phone:           { type: String, default: "" },
  website:         { type: String, default: "" },
  siteTitle:       { type: String, default: "Victory Bible Church" },
  metaDescription: { type: String, default: "" },
  updatedAt:       { type: Date,   default: Date.now },
}, { collection: "churchconfig" });

module.exports = mongoose.model("ChurchConfig", ChurchConfigSchema);
