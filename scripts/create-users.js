const mongoose = require('mongoose');
const crypto = require('crypto');
const User = require('./models/User');
require('dotenv').config();

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

async function createTestUsers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Delete existing test users
    await User.deleteMany({ username: { $in: ['admin', 'pastor'] } });
    console.log('Deleted existing users');
    
    // Create admin user
    const admin = new User({
      username: 'admin',
      password: 'church_admin_2025',
      hashedPassword: hashPassword('church_admin_2025'),
      role: 'admin',
      name: 'Church Administrator'
    });
    
    // Create pastor user
    const pastor = new User({
      username: 'pastor',
      password: 'pastor_2025',
      hashedPassword: hashPassword('pastor_2025'),
      role: 'editor',
      name: 'Church Pastor'
    });
    
    // Save both users
    await admin.save();
    await pastor.save();
    
    console.log('Test users created successfully');
    console.log('Admin hash:', hashPassword('church_admin_2025'));
    console.log('Pastor hash:', hashPassword('pastor_2025'));
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

createTestUsers(); 