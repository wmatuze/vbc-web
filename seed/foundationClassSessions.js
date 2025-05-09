const mongoose = require("mongoose");
const models = require("../models");

// Function to seed foundation class sessions
const seedFoundationClassSessions = async (forceRefresh = false) => {
  try {
    // Check if there are already sessions in the database
    const existingCount = await models.FoundationClassSession.countDocuments();

    if (existingCount > 0 && !forceRefresh) {
      console.log(
        `Found ${existingCount} existing foundation class sessions, skipping seeding.`
      );
      return;
    }

    // If forceRefresh is true, delete existing sessions
    if (forceRefresh && existingCount > 0) {
      console.log(
        `Deleting ${existingCount} existing foundation class sessions for refresh...`
      );
      await models.FoundationClassSession.deleteMany({});
      console.log("Existing foundation class sessions deleted.");
    }

    // Sample foundation class sessions data
    const sessions = [
      {
        startDate: new Date("2024-06-02"),
        endDate: new Date("2024-06-23"),
        day: "Sundays",
        time: "9:00 AM - 10:30 AM",
        location: "Room 201",
        capacity: 20,
        enrolledCount: 5,
        active: true,
      },
      {
        startDate: new Date("2024-07-07"),
        endDate: new Date("2024-07-28"),
        day: "Sundays",
        time: "9:00 AM - 10:30 AM",
        location: "Room 201",
        capacity: 20,
        enrolledCount: 0,
        active: true,
      },
      {
        startDate: new Date("2024-08-07"),
        endDate: new Date("2024-08-28"),
        day: "Wednesdays",
        time: "6:30 PM - 8:00 PM",
        location: "Room 105",
        capacity: 15,
        enrolledCount: 0,
        active: true,
      },
    ];

    // Insert the sessions into the database
    const result = await models.FoundationClassSession.insertMany(sessions);

    console.log(
      `Successfully seeded ${result.length} foundation class sessions.`
    );

    return result;
  } catch (error) {
    console.error("Error seeding foundation class sessions:", error);
    throw error;
  }
};

module.exports = seedFoundationClassSessions;
