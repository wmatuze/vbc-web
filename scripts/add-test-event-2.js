require('dotenv').config();
const connectDB = require('./config/database');
const models = require('./models');
const mongoose = require('mongoose');

const addTestEvent = async () => {
  try {
    console.log('Starting script to add second test event...');
    
    // Connect to the database
    await connectDB();
    console.log('Connected to MongoDB');
    
    // Create a media item for the event image
    const mediaItem = new models.Media({
      filename: 'event-image.jpg',
      originalName: 'event-image.jpg',
      path: '/assets/events/default-event.jpg',
      type: 'image/jpeg',
      size: 1024,
      title: 'Bible Study Image',
      category: 'events',
      uploadDate: new Date()
    });
    
    // Save media item
    const savedMedia = await mediaItem.save();
    console.log('Media item created with ID:', savedMedia._id);
    
    // Create a new event with the media reference
    const newEvent = new models.Event({
      title: "Weekly Bible Study",
      description: "Join us for an in-depth study of the scriptures. This week we'll be studying the Book of Psalms.",
      startDate: new Date(2025, 3, 25, 18, 30), // April 25, 2025, 6:30 PM
      endDate: new Date(2025, 3, 25, 20, 0),   // April 25, 2025, 8:00 PM
      location: "Fellowship Hall",
      isRecurring: true,
      recurrencePattern: "weekly",
      image: savedMedia._id,  // Reference to the media item
      imageUrl: savedMedia.path,  // Also include the direct path for compatibility
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    // Save the event
    const savedEvent = await newEvent.save();
    console.log('Event added successfully with ID:', savedEvent._id);
    
    // Test retrieving the event with populated image
    const retrievedEvent = await models.Event.findById(savedEvent._id).populate('image');
    console.log('Retrieved event with populated image:');
    console.log(JSON.stringify(retrievedEvent, null, 2));
    
    // Also add a third event with no image reference but direct imageUrl
    const thirdEvent = new models.Event({
      title: "Church Picnic",
      description: "Annual church picnic at the city park. Bring food to share and games to play!",
      startDate: new Date(2025, 5, 15, 12, 0), // June 15, 2025, 12:00 PM
      endDate: new Date(2025, 5, 15, 16, 0),   // June 15, 2025, 4:00 PM
      location: "City Park",
      isRecurring: false,
      imageUrl: "/assets/events/picnic.jpg",
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    const savedThirdEvent = await thirdEvent.save();
    console.log('Third event added successfully with ID:', savedThirdEvent._id);
    
    process.exit(0);
  } catch (error) {
    console.error('Error adding test events:', error);
    process.exit(1);
  }
};

// Run the function
addTestEvent(); 