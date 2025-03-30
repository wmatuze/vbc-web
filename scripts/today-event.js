const dotenv = require('dotenv');
const connectDB = require('./config/database');
const models = require('./models');

dotenv.config();

const createRecentEvents = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    console.log('Connected to MongoDB');
    
    // Check existing events
    const existingEvents = await models.Event.find();
    console.log(`Found ${existingEvents.length} existing events`);
    
    // Create dates for today, tomorrow and next week
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    // Create events
    const eventData = [
      {
        title: "TODAY - Prayer Meeting",
        description: "Join us for a special prayer meeting today.",
        startDate: new Date(today.setHours(18, 0, 0, 0)), // Today at 6:00 PM
        endDate: new Date(today.setHours(19, 30, 0, 0)),  // Today at 7:30 PM
        location: "Prayer Room",
        imageUrl: "/assets/events/default-event.jpg",
        type: "event",
        isRecurring: false
      },
      {
        title: "TOMORROW - Youth Worship Night",
        description: "Special worship night for the youth.",
        startDate: new Date(tomorrow.setHours(19, 0, 0, 0)), // Tomorrow at 7:00 PM
        endDate: new Date(tomorrow.setHours(21, 0, 0, 0)),   // Tomorrow at 9:00 PM
        location: "Main Sanctuary",
        imageUrl: "/assets/events/default-event.jpg",
        type: "event",
        isRecurring: false
      },
      {
        title: "NEXT WEEK - Special Service",
        description: "Special guest speaker service next week.",
        startDate: new Date(nextWeek.setHours(10, 0, 0, 0)), // Next week at 10:00 AM
        endDate: new Date(nextWeek.setHours(12, 0, 0, 0)),   // Next week at 12:00 PM
        location: "Main Sanctuary",
        imageUrl: "/assets/events/default-event.jpg",
        type: "event",
        isRecurring: false
      }
    ];
    
    // Save events to database
    const savedEvents = [];
    for (const data of eventData) {
      const event = new models.Event({
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      const savedEvent = await event.save();
      
      // Format for logging
      const formatted = {
        ...savedEvent.toObject(),
        id: savedEvent._id.toString()
      };
      
      savedEvents.push(formatted);
      console.log(`Created event: ${formatted.title} on ${formatted.startDate}`);
    }
    
    console.log(`\nSuccessfully created ${savedEvents.length} new events with current dates`);
    
    // Get all events and log them
    const allEvents = await models.Event.find().sort({ startDate: 1 });
    console.log(`\nAll ${allEvents.length} events in database:`);
    
    allEvents.forEach(event => {
      const formatted = {
        ...event.toObject(),
        id: event._id.toString()
      };
      
      // Format date for easier reading
      const date = new Date(formatted.startDate);
      const dateStr = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
      
      console.log(`- ${formatted.title} (${formatted.id}) on ${dateStr}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

createRecentEvents();