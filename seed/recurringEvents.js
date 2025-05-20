const mongoose = require("mongoose");
const RecurringEvent = require("../models/RecurringEvent");

const recurringEvents = [
  {
    title: "Anointing Service",
    description: "A special service dedicated to prayer for healing and anointing.",
    recurrenceType: "monthly",
    weekOfMonth: "first",
    dayOfWeek: 0, // Sunday
    time: "9:30 AM",
    icon: "oil-lamp",
    color: "yellow",
    featured: true,
    active: true,
    location: "Main Sanctuary",
    ministry: "General",
  },
  {
    title: "Holy Communion Service",
    description: "A sacred time of remembrance and communion with Christ.",
    recurrenceType: "monthly",
    weekOfMonth: "third",
    dayOfWeek: 0, // Sunday
    time: "9:30 AM",
    icon: "communion",
    color: "red",
    featured: true,
    active: true,
    location: "Main Sanctuary",
    ministry: "General",
  },
  {
    title: "Prayer and Fasting Week",
    description: "A dedicated week of prayer and fasting for spiritual growth and breakthrough.",
    recurrenceType: "monthly",
    weekOfMonth: "last",
    time: "Various times",
    icon: "praying-hands",
    color: "blue",
    featured: true,
    active: true,
    location: "Various locations",
    ministry: "Prayer Ministry",
  }
];

const seedRecurringEvents = async () => {
  try {
    // Clear existing recurring events
    await RecurringEvent.deleteMany({});
    console.log("Cleared existing recurring events");

    // Insert new recurring events
    const result = await RecurringEvent.insertMany(recurringEvents);
    console.log(`Added ${result.length} recurring events`);

    return result;
  } catch (error) {
    console.error("Error seeding recurring events:", error);
    throw error;
  }
};

module.exports = seedRecurringEvents;
