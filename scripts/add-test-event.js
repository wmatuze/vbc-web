require('dotenv').config();
const connectDB = require('./config/database');
const models = require('./models');

const addTestEvent = async () => {
  try {
    console.log('Starting script to add test event...');
    console.log('MongoDB URI:', process.env.MONGODB_URI);
    
    // Connect to the database
    const conn = await connectDB();
    console.log('Connected to MongoDB:', conn.connection.host);
    
    // Create a new event
    console.log('Creating new event...');
    const newEvent = new models.Event({
      title: "Sunday Worship Service",
      description: "Join us for our weekly worship service. Everyone is welcome!",
      startDate: new Date(2025, 3, 30, 10, 0), // April 30, 2025, 10:00 AM
      location: "Main Sanctuary",
      isRecurring: true,
      recurrencePattern: "weekly",
      imageUrl: "/assets/events/default-event.jpg",
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    console.log('Event object created:', newEvent);
    
    // Save the event to MongoDB
    console.log('Saving event to database...');
    const savedEvent = await newEvent.save();
    console.log('Event added successfully with ID:', savedEvent._id);
    console.log('Event details:', JSON.stringify(savedEvent, null, 2));
    
    process.exit(0);
  } catch (error) {
    console.error('Error adding test event:', error);
    process.exit(1);
  }
};

// Run the function
addTestEvent(); 