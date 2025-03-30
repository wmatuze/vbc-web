const jwt = require('jsonwebtoken');
const fs = require('fs');
const crypto = require('crypto');
require('dotenv').config();

// Get JWT secret from environment variable or use fallback
const JWT_SECRET = process.env.JWT_SECRET || 'vbc-website-fallback-secret-key';
// Token expiry time (24 hours)
const TOKEN_EXPIRY = '24h';

// Simple hash function for password comparison
const hashPassword = (password) => {
  return crypto.createHash('sha256').update(password).digest('hex');
};

// Middleware function to handle authentication
const authMiddleware = (req, res, next) => {
  // Skip authentication for GET requests to public endpoints
  if (req.method === 'GET' && 
      !req.path.includes('/users') && 
      !req.path.includes('/admin')) {
    return next();
  }

  // Skip authentication for login endpoint and membership renewal
  if ((req.method === 'POST' && req.path === '/login') || 
      (req.method === 'POST' && req.path === '/membership/renew')) {
    return next();
  }

  // Check for the authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verify the token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Add the user info to the request
    req.user = decoded;
    
    // Continue to the next middleware
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// Function to generate a JWT token
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: TOKEN_EXPIRY }
  );
};

// Function to verify user credentials
const verifyCredentials = async (username, password) => {
  try {
    // Read the users from db.json
    const dbFile = fs.readFileSync('./db.json', 'utf8');
    const data = JSON.parse(dbFile);
    
    // Find the user - temporarily still using plaintext passwords
    // This allows existing users to login while we transition to hashed passwords
    const user = data.users.find(u => u.username === username && 
                                  (u.password === password || u.hashedPassword === hashPassword(password)));
    
    if (!user) {
      return null;
    }
    
    // Remove password from returned user object
    const { password: _, hashedPassword: __, ...userWithoutPassword } = user;
    
    return userWithoutPassword;
  } catch (error) {
    console.error('Error verifying credentials:', error);
    throw error;
  }
};

module.exports = {
  authMiddleware,
  generateToken,
  verifyCredentials,
  JWT_SECRET,
  hashPassword
};
