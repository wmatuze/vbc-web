const dotenv = require('dotenv');
const connectDB = require('./config/database');
const models = require('./models');

dotenv.config();

const createCurrentEvents = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    console.log('Connected to MongoDB');
    
    // Get current date components
    const now = new Date();
    const currentYear = 2024; // Force current year
    const currentMonth = now.getMonth();
    const currentDay = now.getDate();
    
    // Create events for today, tomorrow and next week (in current year)
    const eventData = [
      {
        title: "TODAY 2024 - Prayer Meeting",
        description: "Join us for a special prayer meeting today.",
        startDate: new Date(currentYear, currentMonth, currentDay, 18, 0), // Today at 6:00 PM
        endDate: new Date(currentYear, currentMonth, currentDay, 19, 30),  // Today at 7:30 PM
        location: "Prayer Room",
        imageUrl: "/assets/events/default-event.jpg",
        type: "event",
        isRecurring: false
      },
      {
        title: "TOMORROW 2024 - Youth Worship Night",
        description: "Special worship night for the youth.",
        startDate: new Date(currentYear, currentMonth, currentDay + 1, 19, 0), // Tomorrow at 7:00 PM
        endDate: new Date(currentYear, currentMonth, currentDay + 1, 21, 0),   // Tomorrow at 9:00 PM
        location: "Main Sanctuary",
        imageUrl: "/assets/events/default-event.jpg",
        type: "event",
        isRecurring: false
      },
      {
        title: "NEXT WEEK 2024 - Special Service",
        description: "Special guest speaker service next week.",
        startDate: new Date(currentYear, currentMonth, currentDay + 7, 10, 0), // Next week at 10:00 AM
        endDate: new Date(currentYear, currentMonth, currentDay + 7, 12, 0),   // Next week at 12:00 PM
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
    
    console.log(`\nSuccessfully created ${savedEvents.length} new events with 2024 dates`);
    
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

createCurrentEvents(); 