const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    // Debug: Log the MongoDB URI to verify it's being loaded
    console.log(
      "MongoDB URI:",
      process.env.MONGODB_URI ? "Found" : "Not found",
    );

    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI environment variable is not defined");
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      dbName: process.env.MONGODB_DB_NAME || "vbc_web",
      serverSelectionTimeoutMS: 5000, // 5 second timeout for faster feedback
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
