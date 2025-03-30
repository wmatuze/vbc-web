// Simple script to start json-server with custom settings and JWT authentication
const jsonServer = require('json-server');
const express = require('express');
const server = jsonServer.create();
const router = jsonServer.router('./db.json');
const middlewares = jsonServer.defaults();
const { authMiddleware, generateToken, verifyCredentials } = require('./auth-middleware');
const multer = require('multer');
const fsExtra = require('fs-extra');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
require('dotenv').config();

// Get port from environment or default to 3000
const PORT = process.env.PORT || 3000;

// Setup required directories
const dirs = {
  uploads: path.join(__dirname, 'uploads'),
  publicAssets: path.join(__dirname, 'public', 'assets'),
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

// Create default placeholder images if they don't exist
const defaultImages = {
  sermon: path.join(dirs.sermons, 'default-sermon.jpg'),
  event: path.join(dirs.events, 'default-event.jpg'),
  leader: path.join(dirs.leadership, 'placeholder.jpg'),
  cellGroup: path.join(dirs.cellGroups, 'default-cell-group.jpg')
};

// Check for default images and create basic placeholders if missing
Object.entries(defaultImages).forEach(([type, imagePath]) => {
  if (!fs.existsSync(imagePath)) {
    console.log(`Creating default ${type} image at: ${imagePath}`);
    // Copy a sample placeholder image if available, or create an empty one
    try {
      const samplePath = path.join(__dirname, 'public', 'placeholder.jpg');
      if (fs.existsSync(samplePath)) {
        fs.copyFileSync(samplePath, imagePath);
      } else {
        // Create an empty file as placeholder
        fs.writeFileSync(imagePath, Buffer.alloc(0));
      }
    } catch (err) {
      console.error(`Error creating placeholder image: ${err.message}`);
    }
  }
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

// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares);

// Setup CORS properly
server.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
}));

// Additional headers for cross-origin resource sharing
server.use((req, res, next) => {
  res.header('Cross-Origin-Resource-Policy', 'cross-origin');
  res.header('Cross-Origin-Embedder-Policy', 'credentialless');
  res.header('Cross-Origin-Opener-Policy', 'same-origin');
  next();
});

// Simple logging middleware
server.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Serve uploaded files
server.use('/uploads', express.static(dirs.uploads, {
  setHeaders: (res) => {
    res.setHeader('Cache-Control', 'max-age=86400'); // 24 hours
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  }
}));

// Serve assets
server.use('/assets', express.static(dirs.assets, {
  setHeaders: (res) => {
    res.setHeader('Cache-Control', 'max-age=86400'); // 24 hours
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  }
}));

// Serve the public directory as static files
server.use(express.static(path.join(__dirname, 'public'), {
  setHeaders: (res) => {
    res.setHeader('Cache-Control', 'max-age=86400'); // 24 hours
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  }
}));

// Parse JSON body
server.use(jsonServer.bodyParser);

// Create a media collection if it doesn't exist
let db = JSON.parse(fs.readFileSync('./db.json', 'UTF-8'));
if (!db.media) {
  db.media = [];
  fs.writeFileSync('./db.json', JSON.stringify(db, null, 2));
}

// Add custom routes before JSON Server router
server.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }
  
  try {
    // Verify user credentials
    const user = await verifyCredentials(username, password);
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }
    
    // Generate a JWT token
    const token = generateToken(user);
    
    // Return the token and user info
    return res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        name: user.name
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Server error during authentication' });
  }
});

// File upload endpoint with validation and error handling
server.post('/api/upload', upload.single('file'), (req, res) => {
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
    const filePath = path.join(dirs.uploads, req.file.filename);
    
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
    
    // Add the file to the media collection
    db = JSON.parse(fs.readFileSync('./db.json', 'UTF-8'));
    
    const newMedia = {
      id: Date.now(),
      filename: req.file.filename,
      originalName: req.file.originalname,
      path: `/uploads/${req.file.filename}`, // Use consistent path format
      type: req.file.mimetype,
      size: req.file.size,
      title: req.body.title || path.basename(req.file.originalname, path.extname(req.file.originalname)),
      category: req.body.category || 'general',
      uploadDate: new Date().toISOString()
    };
    
    db.media.push(newMedia);
    fs.writeFileSync('./db.json', JSON.stringify(db, null, 2));
    
    // Return the new media object with absolute URLs for convenience
    const mediaWithUrls = {
      ...newMedia,
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

// Check authentication status
server.get('/auth/status', authMiddleware, (req, res) => {
  res.json({ authenticated: true, user: req.user });
});

// Secure routes with authentication middleware
server.use('/users', authMiddleware);
server.use('/admin', authMiddleware);

// Custom route for media that allows public GET requests
server.use((req, res, next) => {
  // Only secure non-GET requests to collections that should be protected
  if ((req.method !== 'GET') && 
      (req.path.includes('/users') || req.path.includes('/admin'))) {
    return authMiddleware(req, res, next);
  }
  next();
});

// Use default router
server.use(router);

server.listen(PORT, () => {
  console.log(`JSON Server is running on port ${PORT}`);
  console.log(`Server directories:`);
  Object.entries(dirs).forEach(([name, dir]) => {
    console.log(`- ${name}: ${dir}`);
  });
});
