// Script to check sermon dates in the database
const mongoose = require("mongoose");
const models = require("./models");
const connectDB = require("./config/database");
require("dotenv").config();

// Connect to MongoDB using the same connection as the application
connectDB()
  .then(() => {
    console.log("Connected to MongoDB");
    checkSermonDates();
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1);
  });

async function checkSermonDates() {
  try {
    // Get all sermons from the database
    const sermons = await models.Sermon.find().sort({ date: -1 });

    console.log(`Found ${sermons.length} sermons in the database`);

    // Print each sermon's date
    sermons.forEach((sermon, index) => {
      console.log(`Sermon ${index + 1}: "${sermon.title}"`);
      console.log(`  - Date in DB: ${sermon.date}`);
      console.log(`  - Date type: ${typeof sermon.date}`);
      console.log(`  - Is Date object: ${sermon.date instanceof Date}`);

      // If it's a Date object, format it
      if (sermon.date instanceof Date) {
        console.log(
          `  - Formatted date: ${sermon.date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}`
        );
      }

      console.log("-----------------------------------");
    });

    // Close the connection
    mongoose.connection.close();
    console.log("MongoDB connection closed");
  } catch (error) {
    console.error("Error checking sermon dates:", error);
    mongoose.connection.close();
    process.exit(1);
  }
}
