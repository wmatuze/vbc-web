const mongoose = require("mongoose");
const seedFoundationClassSessions = require("./seed/foundationClassSessions");
require("dotenv").config();

// MongoDB connection string from environment or use default
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/vbc-web";

// Main seed function
const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    // Run seed function with forceRefresh option
    console.log("Seeding foundation class sessions with force refresh...");
    await seedFoundationClassSessions(true);

    console.log("Foundation class sessions seeding completed successfully");

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");

    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);

    // Disconnect from MongoDB
    try {
      await mongoose.disconnect();
      console.log("Disconnected from MongoDB after error");
    } catch (disconnectError) {
      console.error("Error disconnecting from MongoDB:", disconnectError);
    }

    process.exit(1);
  }
};

// Run the seed function
seedDatabase();
