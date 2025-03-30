const dotenv = require('dotenv');
const connectDB = require('./config/database');
const models = require('./models');

dotenv.config();

const createTestEvent = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    console.log('Connected to MongoDB');
    
    // Check existing events
    const existingEvents = await models.Event.find();
    console.log(`Found ${existingEvents.length} existing events`);
    
    // Create a test event that matches EXACTLY what frontend expects
    const testEvent = {
      title: "Church Anniversary Celebration",
      description: "Join us to celebrate our church anniversary with music, food, and fellowship.",
      startDate: new Date(2025, 3, 20, 10, 0), // April 20, 2025 at 10:00 AM
      endDate: new Date(2025, 3, 20, 14, 0),   // April 20, 2025 at 2:00 PM
      location: "Main Sanctuary",
      imageUrl: "/assets/events/default-event.jpg",
      type: "event", // Make sure type is explicitly set to "event"
      isRecurring: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Save to MongoDB
    const event = new models.Event(testEvent);
    const savedEvent = await event.save();
    
    // Log the saved event with formatted ID
    const formattedEvent = {
      ...savedEvent.toObject(),
      id: savedEvent._id.toString() // Make sure id is a string
    };
    
    console.log('Created test event:', formattedEvent);
    
    // Get and log all events in formatted structure that frontend expects
    const allEvents = await models.Event.find().sort({ startDate: 1 });
    console.log(`\nAll ${allEvents.length} events with frontend-compatible format:`);
    
    allEvents.forEach(event => {
      const formatted = {
        ...event.toObject(),
        id: event._id.toString(),
        type: "event",
        imageUrl: event.imageUrl || "/assets/events/default-event.jpg"
      };
      
      console.log(`- ${formatted.title} (${formatted.id}) on ${formatted.startDate.toISOString()}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

createTestEvent(); 