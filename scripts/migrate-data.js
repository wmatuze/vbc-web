const fs = require('fs');
const path = require('path');
const connectDB = require('./config/database');
const models = require('./models');
const crypto = require('crypto');

// Function to hash passwords
const hashPassword = (password) => {
  return crypto.createHash('sha256').update(password).digest('hex');
};

// Function to create a default media item
const createDefaultMedia = async (imagePath, title) => {
  const filename = path.basename(imagePath);
  const mediaItem = new models.Media({
    filename: filename,
    originalName: filename,
    path: imagePath,
    type: 'image/jpeg',
    size: 0, // We don't know the actual size
    title: title || 'Default Image',
    category: 'general',
    uploadDate: new Date()
  });
  
  return await mediaItem.save();
};

// Function to migrate data from db.json to MongoDB
const migrateData = async () => {
  try {
    console.log('Starting migration...');
    
    // Connect to MongoDB
    await connectDB();
    
    // Read the JSON file
    const jsonData = JSON.parse(fs.readFileSync('./db.json', 'utf8'));
    
    // Migrate users
    if (jsonData.users && jsonData.users.length > 0) {
      console.log('Migrating users...');
      
      // Delete existing users
      await models.User.deleteMany({});
      
      // Insert new users with hashed passwords
      for (const user of jsonData.users) {
        const newUser = new models.User({
          username: user.username,
          password: user.password,
          hashedPassword: user.hashedPassword || hashPassword(user.password),
          role: user.role,
          name: user.name,
          createdAt: new Date()
        });
        
        await newUser.save();
      }
      
      console.log(`Migrated ${jsonData.users.length} users`);
    }
    
    // Check if media collection exists
    const mediaIdMap = {};
    
    // Clear existing media
    await models.Media.deleteMany({});
    
    // Migrate or create media items
    if (jsonData.media && jsonData.media.length > 0) {
      console.log('Migrating media...');
      
      // Insert new media
      for (const media of jsonData.media) {
        const newMedia = new models.Media({
          filename: media.filename || `default-${Date.now()}-${Math.round(Math.random() * 1E9)}.jpg`,
          originalName: media.originalName || 'Default Image',
          path: media.path || '/assets/sermons/default-sermon.jpg',
          type: media.type || 'image/jpeg',
          size: media.size || 0,
          title: media.title || 'Default Title',
          category: media.category || 'general',
          uploadDate: media.uploadDate ? new Date(media.uploadDate) : new Date()
        });
        
        const savedMedia = await newMedia.save();
        
        // Store the mapping between old ID and new MongoDB ID
        mediaIdMap[media.id] = savedMedia._id;
      }
      
      console.log(`Migrated ${jsonData.media.length} media items`);
    } else {
      console.log('No media collection found, creating default media items as needed');
    }
    
    // Migrate sermons
    if (jsonData.sermons && jsonData.sermons.length > 0) {
      console.log('Migrating sermons...');
      
      // Delete existing sermons
      await models.Sermon.deleteMany({});
      
      // Insert new sermons
      for (const sermon of jsonData.sermons) {
        // Get the image from the imageUrl or use the media reference
        let imageId = null;
        
        if (sermon.image && mediaIdMap[sermon.image]) {
          imageId = mediaIdMap[sermon.image];
        } else if (sermon.imageUrl) {
          // Try to find an existing media item
          let mediaItem = await models.Media.findOne({ path: sermon.imageUrl });
          
          // If not found, create a new media item
          if (!mediaItem) {
            mediaItem = await createDefaultMedia(sermon.imageUrl, `Image for sermon: ${sermon.title}`);
          }
          
          imageId = mediaItem._id;
        }
        
        const newSermon = new models.Sermon({
          title: sermon.title,
          speaker: sermon.speaker,
          date: new Date(sermon.date),
          videoId: sermon.videoId,
          duration: sermon.duration,
          image: imageId,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        
        await newSermon.save();
      }
      
      console.log(`Migrated ${jsonData.sermons.length} sermons`);
    }
    
    // Migrate events
    if (jsonData.events && jsonData.events.length > 0) {
      console.log('Migrating events...');
      
      // Delete existing events
      await models.Event.deleteMany({});
      
      // Insert new events
      for (const event of jsonData.events) {
        // Get the image from the imageUrl or use the media reference
        let imageId = null;
        
        if (event.image && mediaIdMap[event.image]) {
          imageId = mediaIdMap[event.image];
        } else if (event.imageUrl) {
          // Try to find an existing media item
          let mediaItem = await models.Media.findOne({ path: event.imageUrl });
          
          // If not found, create a new media item
          if (!mediaItem) {
            mediaItem = await createDefaultMedia(event.imageUrl, `Image for event: ${event.title}`);
          }
          
          imageId = mediaItem._id;
        }
        
        const newEvent = new models.Event({
          title: event.title,
          description: event.description,
          startDate: new Date(event.startDate || event.date),
          endDate: event.endDate ? new Date(event.endDate) : null,
          location: event.location,
          isRecurring: event.isRecurring || false,
          recurrencePattern: event.recurrencePattern,
          image: imageId,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        
        await newEvent.save();
      }
      
      console.log(`Migrated ${jsonData.events.length} events`);
    }
    
    // Migrate leaders
    if (jsonData.leaders && jsonData.leaders.length > 0) {
      console.log('Migrating leaders...');
      
      // Delete existing leaders
      await models.Leader.deleteMany({});
      
      // Insert new leaders
      for (const leader of jsonData.leaders) {
        // Get the image from the imageUrl or use the media reference
        let imageId = null;
        
        if (leader.image && mediaIdMap[leader.image]) {
          imageId = mediaIdMap[leader.image];
        } else if (leader.imageUrl) {
          // Try to find an existing media item
          let mediaItem = await models.Media.findOne({ path: leader.imageUrl });
          
          // If not found, create a new media item
          if (!mediaItem) {
            mediaItem = await createDefaultMedia(leader.imageUrl, `Image for leader: ${leader.name}`);
          }
          
          imageId = mediaItem._id;
        }
        
        const newLeader = new models.Leader({
          name: leader.name,
          title: leader.title,
          bio: leader.bio,
          order: leader.order || 999,
          image: imageId,
          contact: {
            email: leader.email,
            phone: leader.phone,
            socialMedia: {
              facebook: leader.facebook,
              twitter: leader.twitter,
              instagram: leader.instagram
            }
          },
          createdAt: new Date(),
          updatedAt: new Date()
        });
        
        await newLeader.save();
      }
      
      console.log(`Migrated ${jsonData.leaders.length} leaders`);
    }
    
    // Migrate cell groups
    if (jsonData.cellGroups && jsonData.cellGroups.length > 0) {
      console.log('Migrating cell groups...');
      
      // Delete existing cell groups
      await models.CellGroup.deleteMany({});
      
      // Insert new cell groups
      for (const cellGroup of jsonData.cellGroups) {
        // Get the image from the imageUrl or use the media reference
        let imageId = null;
        
        if (cellGroup.image && mediaIdMap[cellGroup.image]) {
          imageId = mediaIdMap[cellGroup.image];
        } else if (cellGroup.imageUrl) {
          // Try to find an existing media item
          let mediaItem = await models.Media.findOne({ path: cellGroup.imageUrl });
          
          // If not found, create a new media item
          if (!mediaItem) {
            mediaItem = await createDefaultMedia(cellGroup.imageUrl, `Image for cell group: ${cellGroup.name}`);
          }
          
          imageId = mediaItem._id;
        }
        
        const newCellGroup = new models.CellGroup({
          name: cellGroup.name,
          leader: cellGroup.leader,
          location: cellGroup.location,
          meetingTime: cellGroup.meetingTime,
          description: cellGroup.description,
          contactInfo: cellGroup.contactInfo,
          image: imageId,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        
        await newCellGroup.save();
      }
      
      console.log(`Migrated ${jsonData.cellGroups.length} cell groups`);
    }
    
    console.log('Migration complete!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

// Run the migration
migrateData(); 