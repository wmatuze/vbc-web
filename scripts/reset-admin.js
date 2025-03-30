const mongoose = require('mongoose');
const crypto = require('crypto');
require('dotenv').config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${mongoose.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

// Hash password function (same as in server.js)
const hashPassword = (password) => {
  return crypto.createHash('sha256').update(password).digest('hex');
};

// Reset admin user
const resetAdmin = async () => {
  try {
    // Import the User model
    const User = require('../models/User');
    
    // First, try to find the admin user
    const existingAdmin = await User.findOne({ username: 'admin' });
    
    // If admin exists, delete it
    if (existingAdmin) {
      console.log('Existing admin user found. Deleting...');
      await User.deleteOne({ username: 'admin' });
      console.log('Admin user deleted.');
    }
    
    // Create a new admin user with correct credentials
    const newAdmin = new User({
      username: 'admin',
      password: 'church_admin_2025', // Plain text for reference
      hashedPassword: hashPassword('church_admin_2025'),
      role: 'admin',
      name: 'Church Administrator'
    });
    
    await newAdmin.save();
    console.log('New admin user created with username: admin, password: church_admin_2025');
    console.log('Hashed password:', newAdmin.hashedPassword);
    
    // Also check if pastor user exists and reset if needed
    const existingPastor = await User.findOne({ username: 'pastor' });
    
    if (existingPastor) {
      console.log('Existing pastor user found. Deleting...');
      await User.deleteOne({ username: 'pastor' });
      console.log('Pastor user deleted.');
    }
    
    // Create a new pastor user
    const newPastor = new User({
      username: 'pastor',
      password: 'pastor_2025', // Plain text for reference
      hashedPassword: hashPassword('pastor_2025'),
      role: 'editor',
      name: 'Church Pastor'
    });
    
    await newPastor.save();
    console.log('New pastor user created with username: pastor, password: pastor_2025');
    console.log('Hashed password:', newPastor.hashedPassword);
    
  } catch (error) {
    console.error('Error resetting users:', error);
  } finally {
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('MongoDB Disconnected');
  }
};

// Run the script
connectDB().then(() => {
  resetAdmin().catch(err => console.error(err));
}); 