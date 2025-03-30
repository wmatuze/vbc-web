const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const fsExtra = require('fs-extra');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const connectDB = require('./config/database');
const models = require('./models');
require('dotenv').config();

// Initialize express app
const app = express();
const PORT = process.env.PORT || 3000;

// Setup required directories
const dirs = {
  uploads: path.join(__dirname, 'uploads'),
  assets: path.join(__dirname, 'assets'),
  sermons: path.join(__dirname, 'assets', 'sermons'),
  events: path.join(__dirname, 'assets', 'events'),
  leadership: path.join(__dirname, 'assets', 'leadership'),
  cellGroups: path.join(__dirname, 'assets', 'cell-groups'),
  media: path.join(__dirname, 'assets', 'media')
};

// Ensure all directories exist
Object.values(dirs).forEach(dir => {
  fsExtra.ensureDirSync(dir);
  console.log(`Directory ensured: ${dir}`);
});

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, dirs.uploads);
  },
  filename: function (req, file, cb) {
    // Create a unique filename with original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  }
});

// Create the multer upload middleware
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max file size
  fileFilter: function (req, file, cb) {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  }
});

// CORS middleware - updated configuration
app.use(cors({
  origin: 'http://localhost:5173', // Specify the exact frontend origin
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

// Handle preflight requests explicitly
app.options('*', cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

// Handle preflight requests explicitly for login
app.options('/login', (req, res) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.sendStatus(204);
});

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Simple logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  
  // Enhanced debugging for API calls
  if (req.path.startsWith('/api/membership/renew') && req.method === 'POST') {
    console.log('Membership renewal request body:', JSON.stringify(req.body, null, 2));
    
    // Add response logging for this endpoint
    const originalSend = res.send;
    res.send = function(data) {
      console.log('Membership renewal response:', typeof data, data ? data.substring(0, 200) : 'empty');
      originalSend.call(this, data);
    };
  }
  
  next();
});

// Serve static files with proper CORS headers
app.use('/uploads', express.static(dirs.uploads, {
  setHeaders: (res) => {
    res.setHeader('Cache-Control', 'max-age=86400'); // 24 hours
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }
}));

app.use('/assets', express.static(dirs.assets, {
  setHeaders: (res) => {
    res.setHeader('Cache-Control', 'max-age=86400'); // 24 hours
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }
}));

// Serve files from root directory
app.use(express.static(__dirname, {
  setHeaders: (res) => {
    res.setHeader('Cache-Control', 'max-age=86400'); // 24 hours
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }
}));

// Specific route for test-form.html
app.get('/test-form', (req, res) => {
  res.sendFile(path.join(__dirname, 'test-form.html'));
});

app.use(express.static(path.join(__dirname, 'public'), {
  setHeaders: (res) => {
    res.setHeader('Cache-Control', 'max-age=86400'); // 24 hours
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }
}));

// Mount API routes
const apiRoutes = require('./api-routes');
app.use('/api', apiRoutes);
app.use('/', apiRoutes); // For compatibility with old routes

// Auth middleware function
const authMiddleware = (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No token, authorization denied' });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Auth error:', error.message);
    res.status(401).json({ error: 'Token is not valid' });
  }
};

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user._id, 
      username: user.username, 
      role: user.role,
      name: user.name
    },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
};

// Hash password
const hashPassword = (password) => {
  return crypto.createHash('sha256').update(password).digest('hex');
};

// Routes
app.post('/login', async (req, res) => {
  // Log the incoming request for debugging
  console.log('Received login request:', {
    headers: req.headers,
    body: req.body,
    method: req.method,
    path: req.path
  });
  
  // Set CORS headers explicitly for this endpoint
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }
  
  try {
    // Find user by username
    const user = await models.User.findOne({ username });
    
    // Check if user exists
    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }
    
    // Verify password
    const hashedPassword = hashPassword(password);
    if (hashedPassword !== user.hashedPassword) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }
    
    // Generate token
    const token = generateToken(user);
    
    // Return user info and token
    return res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        name: user.name
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
});

// File upload endpoint
app.post('/api/upload', authMiddleware, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      console.error('No file in request');
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    // Log the upload details
    console.log('File upload initiated:', {
      originalName: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype,
      category: req.body.category || 'general'
    });
    
    // Get file information
    const filePath = req.file.path;
    
    // Verify the file was saved successfully
    if (!fs.existsSync(filePath)) {
      console.error('File not found on disk after upload:', filePath);
      return res.status(500).json({ error: 'File upload failed - could not verify file existence' });
    }
    
    // Check file size on disk to make sure it wasn't corrupted
    const fileStats = fs.statSync(filePath);
    if (fileStats.size === 0 || fileStats.size !== req.file.size) {
      console.error(`File size mismatch: reported ${req.file.size}, actual ${fileStats.size}`);
      // Try to clean up corrupted file
      try {
        fs.unlinkSync(filePath);
      } catch (cleanupErr) {
        console.error('Failed to clean up corrupted file:', cleanupErr);
      }
      return res.status(500).json({ error: 'File upload failed - file appears to be corrupted' });
    }
    
    // Save to MongoDB
    const newMedia = new models.Media({
      filename: req.file.filename,
      originalName: req.file.originalname,
      path: `/uploads/${req.file.filename}`,
      type: req.file.mimetype,
      size: req.file.size,
      title: req.body.title || path.basename(req.file.originalname, path.extname(req.file.originalname)),
      category: req.body.category || 'general'
    });
    
    await newMedia.save();
    
    // Return the new media object with absolute URLs for convenience
    const mediaWithUrls = {
      ...newMedia._doc,
      id: newMedia._id,
      fullPath: `http://localhost:${PORT}${newMedia.path}`,
      thumbnailUrl: `http://localhost:${PORT}${newMedia.path}`
    };
    
    console.log('Upload successful, returning:', mediaWithUrls.id, mediaWithUrls.path);
    res.status(200).json(mediaWithUrls);
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload file: ' + error.message });
  }
});

// Auth status route
app.get('/auth/status', authMiddleware, (req, res) => {
  res.json({ authenticated: true, user: req.user });
});

// Media routes
app.get('/api/media', async (req, res) => {
  try {
    const media = await models.Media.find().sort({ uploadDate: -1 });
    res.json(media);
  } catch (error) {
    console.error('Error fetching media:', error);
    res.status(500).json({ error: 'Failed to fetch media' });
  }
});

// Also add routes without the /api prefix for compatibility
app.get('/media', async (req, res) => {
  try {
    const media = await models.Media.find().sort({ uploadDate: -1 });
    res.json(media);
  } catch (error) {
    console.error('Error fetching media:', error);
    res.status(500).json({ error: 'Failed to fetch media' });
  }
});

// Leaders routes
app.get('/api/leaders', async (req, res) => {
  try {
    const leaders = await models.Leader.find()
      .populate('image')
      .sort({ order: 1 });
    res.json(leaders);
  } catch (error) {
    console.error('Error fetching leaders:', error);
    res.status(500).json({ error: 'Failed to fetch leaders' });
  }
});

app.post('/api/leaders', authMiddleware, async (req, res) => {
  try {
    const leader = new models.Leader(req.body);
    await leader.save();
    res.status(201).json(leader);
  } catch (error) {
    console.error('Error creating leader:', error);
    res.status(500).json({ error: 'Failed to create leader' });
  }
});

app.get('/api/leaders/:id', async (req, res) => {
  try {
    const leader = await models.Leader.findById(req.params.id)
      .populate('image');
    if (!leader) {
      return res.status(404).json({ error: 'Leader not found' });
    }
    res.json(leader);
  } catch (error) {
    console.error('Error fetching leader:', error);
    res.status(500).json({ error: 'Failed to fetch leader' });
  }
});

app.put('/api/leaders/:id', authMiddleware, async (req, res) => {
  try {
    const leader = await models.Leader.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );
    if (!leader) {
      return res.status(404).json({ error: 'Leader not found' });
    }
    res.json(leader);
  } catch (error) {
    console.error('Error updating leader:', error);
    res.status(500).json({ error: 'Failed to update leader' });
  }
});

app.delete('/api/leaders/:id', authMiddleware, async (req, res) => {
  try {
    const leader = await models.Leader.findByIdAndDelete(req.params.id);
    if (!leader) {
      return res.status(404).json({ error: 'Leader not found' });
    }
    res.json({ message: 'Leader deleted successfully' });
  } catch (error) {
    console.error('Error deleting leader:', error);
    res.status(500).json({ error: 'Failed to delete leader' });
  }
});

// Cell Group routes
app.get('/api/cell-groups', async (req, res) => {
  try {
    const cellGroups = await models.CellGroup.find()
      .populate('image')
      .sort({ name: 1 });
    res.json(cellGroups);
  } catch (error) {
    console.error('Error fetching cell groups:', error);
    res.status(500).json({ error: 'Failed to fetch cell groups' });
  }
});

app.post('/api/cell-groups', authMiddleware, async (req, res) => {
  try {
    const cellGroup = new models.CellGroup(req.body);
    await cellGroup.save();
    res.status(201).json(cellGroup);
  } catch (error) {
    console.error('Error creating cell group:', error);
    res.status(500).json({ error: 'Failed to create cell group' });
  }
});

app.get('/api/cell-groups/:id', async (req, res) => {
  try {
    const cellGroup = await models.CellGroup.findById(req.params.id)
      .populate('image');
    if (!cellGroup) {
      return res.status(404).json({ error: 'Cell group not found' });
    }
    res.json(cellGroup);
  } catch (error) {
    console.error('Error fetching cell group:', error);
    res.status(500).json({ error: 'Failed to fetch cell group' });
  }
});

app.put('/api/cell-groups/:id', authMiddleware, async (req, res) => {
  try {
    const cellGroup = await models.CellGroup.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );
    if (!cellGroup) {
      return res.status(404).json({ error: 'Cell group not found' });
    }
    res.json(cellGroup);
  } catch (error) {
    console.error('Error updating cell group:', error);
    res.status(500).json({ error: 'Failed to update cell group' });
  }
});

app.delete('/api/cell-groups/:id', authMiddleware, async (req, res) => {
  try {
    const cellGroup = await models.CellGroup.findByIdAndDelete(req.params.id);
    if (!cellGroup) {
      return res.status(404).json({ error: 'Cell group not found' });
    }
    res.json({ message: 'Cell group deleted successfully' });
  } catch (error) {
    console.error('Error deleting cell group:', error);
    res.status(500).json({ error: 'Failed to delete cell group' });
  }
});

// Sermon routes
app.get('/api/sermons', async (req, res) => {
  try {
    console.log('Fetching sermons from /api/sermons endpoint');
    const sermons = await models.Sermon.find()
      .populate('image')
      .sort({ date: -1 });
    
    // Format sermons for frontend compatibility
    const formattedSermons = formatResponse(sermons);
    console.log(`Returning ${formattedSermons.length} sermons`);
    
    res.json(formattedSermons);
  } catch (error) {
    console.error('Error fetching sermons:', error);
    res.status(500).json({ error: 'Failed to fetch sermons' });
  }
});

app.post('/api/sermons', authMiddleware, async (req, res) => {
  try {
    console.log("Received sermon creation request:", req.body);

    // Create a new sermon from the request body
    const sermonData = {
      ...req.body,
      // Parse date string to Date object if needed
      date: req.body.date ? new Date(req.body.date) : new Date(),
      // Set default values if not provided
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // If imageUrl is provided but no image object, use the imageUrl
    if (req.body.imageUrl && !req.body.image) {
      sermonData.imageUrl = req.body.imageUrl;
    }

    // Create and save the new sermon
    const sermon = new models.Sermon(sermonData);
    const savedSermon = await sermon.save();

    // Format for response
    const formattedSermon = formatResponse(savedSermon);

    console.log("Successfully created sermon:", formattedSermon.title);

    res.status(201).json(formattedSermon);
  } catch (error) {
    console.error("Error creating sermon:", error);
    res.status(500).json({ error: "Failed to create sermon" });
  }
});

app.get('/api/sermons/:id', async (req, res) => {
  try {
    const sermon = await models.Sermon.findById(req.params.id)
      .populate('image');
    if (!sermon) {
      return res.status(404).json({ error: 'Sermon not found' });
    }
    
    // Format sermon for frontend compatibility
    const formattedSermon = formatResponse(sermon);
    
    res.json(formattedSermon);
  } catch (error) {
    console.error('Error fetching sermon:', error);
    res.status(500).json({ error: 'Failed to fetch sermon' });
  }
});

app.put('/api/sermons/:id', authMiddleware, async (req, res) => {
  try {
    // Parse date string to Date object if needed
    const updateData = { ...req.body, updatedAt: new Date() };
    if (updateData.date) {
      updateData.date = new Date(updateData.date);
    }

    const sermon = await models.Sermon.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate('image');

    if (!sermon) {
      return res.status(404).json({ error: 'Sermon not found' });
    }

    // Format for response
    const formattedSermon = formatResponse(sermon);

    res.json(formattedSermon);
  } catch (error) {
    console.error('Error updating sermon:', error);
    res.status(500).json({ error: 'Failed to update sermon' });
  }
});

app.delete('/api/sermons/:id', authMiddleware, async (req, res) => {
  try {
    const sermon = await models.Sermon.findByIdAndDelete(req.params.id);
    if (!sermon) {
      return res.status(404).json({ error: 'Sermon not found' });
    }
    res.json({ message: 'Sermon deleted successfully' });
  } catch (error) {
    console.error('Error deleting sermon:', error);
    res.status(500).json({ error: 'Failed to delete sermon' });
  }
});

// API documentation route
app.get('/api', (req, res) => {
  const routes = [
    { method: 'POST', path: '/login', description: 'Authenticate user and get token' },
    { method: 'GET', path: '/auth/status', description: 'Check authentication status' },
    { method: 'POST', path: '/api/upload', description: 'Upload a file (requires authentication)' },
    { method: 'GET', path: '/api/media', description: 'Get all media items' },
    { method: 'GET', path: '/media', description: 'Get all media items (compatibility)' },
    { method: 'GET', path: '/api/media/:id', description: 'Get a specific media item' },
    { method: 'GET', path: '/api/sermons', description: 'Get all sermons' },
    { method: 'GET', path: '/sermons', description: 'Get all sermons (compatibility)' },
    { method: 'POST', path: '/api/sermons', description: 'Create a sermon (requires authentication)' },
    { method: 'GET', path: '/api/sermons/:id', description: 'Get a specific sermon' },
    { method: 'PUT', path: '/api/sermons/:id', description: 'Update a sermon (requires authentication)' },
    { method: 'DELETE', path: '/api/sermons/:id', description: 'Delete a sermon (requires authentication)' },
    { method: 'GET', path: '/api/events', description: 'Get all events' },
    { method: 'GET', path: '/events', description: 'Get all events (compatibility)' },
    { method: 'POST', path: '/api/events', description: 'Create an event (requires authentication)' },
    { method: 'GET', path: '/api/events/:id', description: 'Get a specific event' },
    { method: 'PUT', path: '/api/events/:id', description: 'Update an event (requires authentication)' },
    { method: 'DELETE', path: '/api/events/:id', description: 'Delete an event (requires authentication)' },
    { method: 'GET', path: '/api/leaders', description: 'Get all leaders' },
    { method: 'GET', path: '/leaders', description: 'Get all leaders (compatibility)' },
    { method: 'POST', path: '/api/leaders', description: 'Create a leader (requires authentication)' },
    { method: 'GET', path: '/api/leaders/:id', description: 'Get a specific leader' },
    { method: 'PUT', path: '/api/leaders/:id', description: 'Update a leader (requires authentication)' },
    { method: 'DELETE', path: '/api/leaders/:id', description: 'Delete a leader (requires authentication)' },
    { method: 'GET', path: '/api/cell-groups', description: 'Get all cell groups' },
    { method: 'GET', path: '/cell-groups', description: 'Get all cell groups (compatibility)' },
    { method: 'POST', path: '/api/cell-groups', description: 'Create a cell group (requires authentication)' },
    { method: 'GET', path: '/api/cell-groups/:id', description: 'Get a specific cell group' },
    { method: 'PUT', path: '/api/cell-groups/:id', description: 'Update a cell group (requires authentication)' },
    { method: 'DELETE', path: '/api/cell-groups/:id', description: 'Delete a cell group (requires authentication)' }
  ];
  
  res.json({
    api: 'VBC API',
    version: '1.0.0',
    routes
  });
});

// API routes for events
app.get('/api/events', async (req, res) => {
  try {
    const events = await models.Event.find()
      .populate('image')
      .sort({ startDate: 1 });
      
    // Format for compatibility with frontend
    const formattedEvents = events.map(event => {
      const plainEvent = event.toObject();
      
      // Frontend expects id
      plainEvent.id = plainEvent._id.toString();
      
      // Ensure type is set (required by frontend)
      plainEvent.type = 'event';
      
      // Make sure imageUrl is set correctly
      if (plainEvent.image && plainEvent.image.path) {
        plainEvent.imageUrl = plainEvent.image.path;
      } else if (!plainEvent.imageUrl) {
        plainEvent.imageUrl = '/assets/events/default-event.jpg';
      }
      
      return plainEvent;
    });
    
    console.log(`API: Returning ${formattedEvents.length} formatted events`);
    formattedEvents.forEach(e => {
      console.log(`- ${e.title} (${e.id}) - image: ${e.imageUrl}`);
    });
    
    res.json(formattedEvents);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// Add POST endpoint for creating events via API
app.post('/api/events', async (req, res) => {
  try {
    console.log('Received API event creation request:', req.body);
    
    // Create a new event from the request body
    const eventData = {
      ...req.body,
      // Ensure dates are properly converted to Date objects
      startDate: new Date(req.body.startDate),
      endDate: new Date(req.body.endDate),
      // Set default values if not provided
      type: 'event',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // If imageUrl is provided but no image object, use the imageUrl
    if (req.body.imageUrl && !req.body.image) {
      eventData.imageUrl = req.body.imageUrl;
    }
    
    // Create and save the new event
    const event = new models.Event(eventData);
    const savedEvent = await event.save();
    
    // Format for response
    const formattedEvent = savedEvent.toObject();
    formattedEvent.id = formattedEvent._id.toString();
    
    console.log('Successfully created API event:', formattedEvent.title);
    
    res.status(201).json(formattedEvent);
  } catch (error) {
    console.error('Error creating API event:', error);
    res.status(500).json({ error: 'Failed to create event' });
  }
});

// Add compatibility routes for events
app.get('/events', async (req, res) => {
  try {
    const events = await models.Event.find()
      .populate('image')
      .sort({ startDate: 1 });
      
    // Format for compatibility with frontend
    const formattedEvents = events.map(event => {
      const plainEvent = event.toObject();
      
      // Frontend expects id
      plainEvent.id = plainEvent._id.toString();
      
      // Ensure type is set (required by frontend)
      plainEvent.type = 'event';
      
      // Make sure imageUrl is set correctly
      if (plainEvent.image && plainEvent.image.path) {
        plainEvent.imageUrl = plainEvent.image.path;
      } else if (!plainEvent.imageUrl) {
        plainEvent.imageUrl = '/assets/events/default-event.jpg';
      }
      
      return plainEvent;
    });
    
    console.log(`Legacy: Returning ${formattedEvents.length} formatted events`);
    formattedEvents.forEach(e => {
      console.log(`- ${e.title} (${e.id}) - image: ${e.imageUrl}`);
    });
    
    res.json(formattedEvents);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// Add POST endpoint for creating events
app.post('/events', async (req, res) => {
  try {
    console.log('Received event creation request:', req.body);
    
    // Create a new event from the request body
    const eventData = {
      ...req.body,
      // Ensure dates are properly converted to Date objects
      startDate: new Date(req.body.startDate),
      endDate: new Date(req.body.endDate),
      // Set default values if not provided
      type: 'event',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // If imageUrl is provided but no image object, use the imageUrl
    if (req.body.imageUrl && !req.body.image) {
      eventData.imageUrl = req.body.imageUrl;
    }
    
    // Create and save the new event
    const event = new models.Event(eventData);
    const savedEvent = await event.save();
    
    // Format for response
    const formattedEvent = savedEvent.toObject();
    formattedEvent.id = formattedEvent._id.toString();
    
    console.log('Successfully created event:', formattedEvent.title);
    
    res.status(201).json(formattedEvent);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ error: 'Failed to create event' });
  }
});

// Get a single event - Added here before startServer()
app.get('/api/events/:id', async (req, res) => {
  try {
    const event = await models.Event.findById(req.params.id)
      .populate('image');
    
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    // Format the event for frontend compatibility
    const plainEvent = event.toObject();
    plainEvent.id = plainEvent._id.toString();
    
    // Add imageUrl for compatibility
    if (plainEvent.image && plainEvent.image.path) {
      plainEvent.imageUrl = plainEvent.image.path;
    } else if (plainEvent.imageUrl) {
      // Keep existing imageUrl if it exists
    } else {
      plainEvent.imageUrl = '/assets/events/default-event.jpg';
    }
    
    res.json(plainEvent);
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ error: 'Failed to fetch event' });
  }
});

// Also support the old format for event IDs (numeric IDs)
app.get('/events/:id', async (req, res) => {
  try {
    // First try to find by MongoDB ID
    let event = null;
    
    // Check if the ID can be a valid MongoDB ID
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      event = await models.Event.findById(req.params.id).populate('image');
    }
    
    // If not found, try to find by the numeric id field
    if (!event) {
      const events = await models.Event.find().populate('image');
      event = events.find(e => e._id.toString() === req.params.id || e.id === parseInt(req.params.id));
    }
    
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    // Format the event for frontend compatibility
    const plainEvent = event.toObject();
    plainEvent.id = plainEvent._id.toString();
    
    // Add imageUrl for compatibility
    if (plainEvent.image && plainEvent.image.path) {
      plainEvent.imageUrl = plainEvent.image.path;
    } else if (plainEvent.imageUrl) {
      // Keep existing imageUrl if it exists
    } else {
      plainEvent.imageUrl = '/assets/events/default-event.jpg';
    }
    
    res.json(plainEvent);
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ error: 'Failed to fetch event' });
  }
});

// Add compatibility routes for leaders
app.get('/leaders', async (req, res) => {
  try {
    const leaders = await models.Leader.find()
      .populate('image')
      .sort({ order: 1 });
      
    // Convert to plain objects and adjust for frontend compatibility
    const formattedLeaders = leaders.map(leader => {
      const plainLeader = leader.toObject();
      plainLeader.id = plainLeader._id.toString();
      
      // Add imageUrl for compatibility
      if (plainLeader.image && plainLeader.image.path) {
        plainLeader.imageUrl = plainLeader.image.path;
      } else {
        plainLeader.imageUrl = '/assets/leadership/default-leader.jpg';
      }
      
      return plainLeader;
    });
    
    res.json(formattedLeaders);
  } catch (error) {
    console.error('Error fetching leaders:', error);
    res.status(500).json({ error: 'Failed to fetch leaders' });
  }
});

// Add POST endpoint for creating leaders
app.post('/leaders', authMiddleware, async (req, res) => {
  try {
    console.log('Received leader creation request:', req.body);
    
    // Create a new leader from the request body
    const leaderData = {
      ...req.body,
      // Set default values if not provided
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // If imageUrl is provided but no image object, use the imageUrl
    if (req.body.imageUrl && !req.body.image) {
      leaderData.imageUrl = req.body.imageUrl;
    }
    
    // Create and save the new leader
    const leader = new models.Leader(leaderData);
    const savedLeader = await leader.save();
    
    // Format for response
    const formattedLeader = savedLeader.toObject();
    formattedLeader.id = formattedLeader._id.toString();
    
    console.log('Successfully created leader:', formattedLeader.name);
    
    res.status(201).json(formattedLeader);
  } catch (error) {
    console.error('Error creating leader:', error);
    res.status(500).json({ error: 'Failed to create leader' });
  }
});

// Add PUT endpoint for updating leaders
app.put('/leaders/:id', authMiddleware, async (req, res) => {
  try {
    const leader = await models.Leader.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true }
    ).populate('image');
    
    if (!leader) {
      return res.status(404).json({ error: 'Leader not found' });
    }
    
    // Format for response
    const formattedLeader = leader.toObject();
    formattedLeader.id = formattedLeader._id.toString();
    
    // Add imageUrl for compatibility
    if (formattedLeader.image && formattedLeader.image.path) {
      formattedLeader.imageUrl = formattedLeader.image.path;
    } else if (formattedLeader.imageUrl) {
      // Keep existing imageUrl if it exists
    } else {
      formattedLeader.imageUrl = '/assets/leadership/default-leader.jpg';
    }
    
    res.json(formattedLeader);
  } catch (error) {
    console.error('Error updating leader:', error);
    res.status(500).json({ error: 'Failed to update leader' });
  }
});

// Add DELETE endpoint for leaders
app.delete('/leaders/:id', authMiddleware, async (req, res) => {
  try {
    const leader = await models.Leader.findByIdAndDelete(req.params.id);
    if (!leader) {
      return res.status(404).json({ error: 'Leader not found' });
    }
    res.json({ message: 'Leader deleted successfully' });
  } catch (error) {
    console.error('Error deleting leader:', error);
    res.status(500).json({ error: 'Failed to delete leader' });
  }
});

// Add compatibility routes for sermons
app.get('/sermons', async (req, res) => {
  try {
    const sermons = await models.Sermon.find()
      .populate('image')
      .sort({ date: -1 });
      
    // Convert to plain objects and adjust for frontend compatibility
    const formattedSermons = sermons.map(sermon => {
      const plainSermon = sermon.toObject();
      plainSermon.id = plainSermon._id.toString();
      
      // Add imageUrl for compatibility
      if (plainSermon.image && plainSermon.image.path) {
        plainSermon.imageUrl = plainSermon.image.path;
      } else {
        plainSermon.imageUrl = '/assets/sermons/default-sermon.jpg';
      }
      
      return plainSermon;
    });
    
    res.json(formattedSermons);
  } catch (error) {
    console.error('Error fetching sermons:', error);
    res.status(500).json({ error: 'Failed to fetch sermons' });
  }
});

// Add compatibility routes for cell groups
app.get('/cell-groups', async (req, res) => {
  try {
    const cellGroups = await models.CellGroup.find()
      .populate('image')
      .sort({ name: 1 });
      
    // Convert to plain objects and adjust for frontend compatibility
    const formattedCellGroups = cellGroups.map(cellGroup => {
      const plainCellGroup = cellGroup.toObject();
      plainCellGroup.id = plainCellGroup._id.toString();
      
      // Add imageUrl for compatibility
      if (plainCellGroup.image && plainCellGroup.image.path) {
        plainCellGroup.imageUrl = plainCellGroup.image.path;
      } else {
        plainCellGroup.imageUrl = '/assets/cell-groups/default-cell-group.jpg';
      }
      
      return plainCellGroup;
    });
    
    res.json(formattedCellGroups);
  } catch (error) {
    console.error('Error fetching cell groups:', error);
    res.status(500).json({ error: 'Failed to fetch cell groups' });
  }
});

// Add specific route for hero-bg.jpg with proper CORS headers
app.get('/assets/hero-bg.jpg', (req, res) => {
  const heroImagePath = path.join(__dirname, 'assets', 'hero-bg.jpg');
  
  // Check if the file exists
  if (fs.existsSync(heroImagePath)) {
    res.setHeader('Cache-Control', 'max-age=86400'); // 24 hours
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.sendFile(heroImagePath);
  } else {
    // If file doesn't exist, check if we need to create it from db.json
    try {
      const assetsDir = path.join(__dirname, 'assets');
      if (!fs.existsSync(assetsDir)) {
        fs.mkdirSync(assetsDir, { recursive: true });
      }
      
      // Create an empty image if none exists
      fs.writeFileSync(heroImagePath, Buffer.alloc(0));
      res.setHeader('Cache-Control', 'max-age=86400');
      res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.sendFile(heroImagePath);
    } catch (error) {
      console.error('Error serving hero-bg.jpg:', error);
      res.status(404).send('Image not found');
    }
  }
});

// Function to seed initial users
const seedUsers = async () => {
  try {
    const usersCount = await models.User.countDocuments();
    
    if (usersCount === 0) {
      console.log('Seeding initial users...');
      
      const adminUser = new models.User({
        username: 'admin',
        password: 'church_admin_2025',
        hashedPassword: hashPassword('church_admin_2025'),
        role: 'admin',
        name: 'Church Administrator'
      });
      
      const pastorUser = new models.User({
        username: 'pastor',
        password: 'pastor_2025',
        hashedPassword: hashPassword('pastor_2025'),
        role: 'editor',
        name: 'Church Pastor'
      });
      
      await adminUser.save();
      await pastorUser.save();
      
      console.log('Initial users seeded successfully!');
    } else {
      console.log('Users already exist, skipping seed');
    }
  } catch (error) {
    console.error('Error seeding users:', error);
  }
};

// Helper function to format MongoDB data for frontend compatibility
const formatResponse = (data) => {
  // If data is an array, map over each item
  if (Array.isArray(data)) {
    return data.map(item => formatObject(item));
  }
  
  // If data is a single object
  return formatObject(data);
};

// Helper to format a single object
const formatObject = (item) => {
  // If item is a Mongoose document, convert to plain object
  const obj = item && item.toObject ? item.toObject() : { ...item };
  
  // Add id property (frontend expects this)
  if (obj._id) {
    obj.id = obj._id.toString();
  }
  
  // Handle image/imageUrl
  if (obj.image) {
    // If image is a populated object with path
    if (obj.image.path) {
      obj.imageUrl = obj.image.path;
    } 
    // If image is just an ID reference
    else if (obj.image._id || obj.image.toString) {
      // Keep any existing imageUrl or set default based on type
      if (!obj.imageUrl) {
        if (obj.type === 'sermon' || obj.category === 'sermon') {
          obj.imageUrl = '/assets/sermons/default-sermon.jpg';
        } else if (obj.type === 'event' || obj.category === 'event') {
          obj.imageUrl = '/assets/events/default-event.jpg';
        } else if (obj.type === 'leader' || obj.category === 'leader') {
          obj.imageUrl = '/assets/leadership/default-leader.jpg';
        } else if (obj.type === 'cell-group' || obj.category === 'cell-group') {
          obj.imageUrl = '/assets/cell-groups/default-cell-group.jpg';
        } else {
          obj.imageUrl = '/assets/media/default-image.jpg';
        }
      }
    }
  } 
  // No image reference but need imageUrl
  else if (!obj.imageUrl) {
    if (obj.type === 'sermon' || obj.category === 'sermon') {
      obj.imageUrl = '/assets/sermons/default-sermon.jpg';
    } else if (obj.type === 'event' || obj.category === 'event') {
      obj.imageUrl = '/assets/events/default-event.jpg';
    } else if (obj.type === 'leader' || obj.category === 'leader') {
      obj.imageUrl = '/assets/leadership/default-leader.jpg';
    } else if (obj.type === 'cell-group' || obj.category === 'cell-group') {
      obj.imageUrl = '/assets/cell-groups/default-cell-group.jpg';
    } else {
      obj.imageUrl = '/assets/media/default-image.jpg';
    }
  }
  
  return obj;
};

// Add a diagnostic endpoint
app.get('/api/test-connection', (req, res) => {
  console.log('Test connection endpoint accessed with headers:', req.headers);
  
  res.json({
    success: true,
    message: 'Server connection successful',
    requestInfo: {
      headers: req.headers,
      ip: req.ip,
      method: req.method,
      path: req.path,
      timestamp: new Date().toISOString()
    }
  });
});

// Add explicit event creation test endpoint
app.post('/api/test-event-create', authMiddleware, (req, res) => {
  console.log('Test event creation endpoint accessed with data:', req.body);
  
  // Check token in headers
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  
  try {
    // Log if we can decode the token
    let decodedToken = null;
    if (token) {
      decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    }
    
    res.json({
      success: true,
      message: 'Event creation test endpoint accessed successfully',
      receivedData: req.body,
      authStatus: {
        headerReceived: !!authHeader,
        tokenReceived: !!token,
        tokenValid: !!decodedToken,
        tokenDetails: decodedToken 
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in test endpoint:', error);
    res.status(400).json({
      success: false,
      message: 'Error processing request',
      error: error.message
    });
  }
});

// Add explicit image upload test endpoint
app.post('/api/test-upload', authMiddleware, upload.single('file'), (req, res) => {
  console.log('Test upload endpoint accessed');
  
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'No file received',
      requestDetails: {
        body: req.body,
        headers: req.headers
      }
    });
  }
  
  console.log('Test file upload received:', {
    filename: req.file.filename,
    originalname: req.file.originalname,
    mimetype: req.file.mimetype,
    size: req.file.size,
    path: req.file.path
  });
  
  res.json({
    success: true,
    message: 'File upload test successful',
    fileDetails: {
      filename: req.file.filename,
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      path: `/uploads/${req.file.filename}`,
      fullUrl: `http://localhost:${PORT}/uploads/${req.file.filename}`
    }
  });
});

// Start server with MongoDB connection
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    
    // Seed initial data
    await seedUsers();
    
    // Start the Express server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Simple test endpoint to verify connection
app.get('/test-connection', (req, res) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.json({ status: 'success', message: 'Server is running and connection is working' });
});

startServer();