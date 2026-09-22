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
  officeHours: {
    days: { type: String, default: "Tuesday – Friday" },
    time: { type: String, default: "09:30 – 16:00 hrs" },
  },
  socialLinks: {
    facebook:  { type: String, default: "https://facebook.com/VictoryBibleChurchKitwe" },
    instagram: { type: String, default: "https://instagram.com/victorybiblechurchkitwe" },
    youtube:   { type: String, default: "https://youtube.com/@BishopSimwanza" },
    whatsapp:  { type: String, default: "https://wa.me/260763232222" },
  },
  updatedAt:       { type: Date,   default: Date.now },
}, { collection: "churchconfig" });

module.exports = mongoose.model("ChurchConfig", ChurchConfigSchema);
