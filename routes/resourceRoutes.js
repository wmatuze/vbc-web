const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const models = require('../models');
const { authMiddleware } = require('../auth-middleware');
const formatResponse = require('../utils/formatResponse');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = 'uploads/resources/';
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  fileFilter: function (req, file, cb) {
    // Allow common file types
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|ppt|pptx|xls|xlsx|txt|mp3|mp4|avi|mov/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('File type not allowed'));
    }
  }
});

// Get all resources
router.get('/', async (req, res) => {
  try {
    const { category, type, accessLevel, search, featured } = req.query;
    let query = { active: true };
    
    if (category) query.category = category;
    if (type) query.type = type;
    if (accessLevel) query.accessLevel = accessLevel;
    if (featured) query.featured = featured === 'true';
    
    // Search functionality
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const resources = await models.Resource.find(query)
      .sort({ featured: -1, createdAt: -1 });
    
    res.json({
      success: true,
      data: resources.map(resource => formatResponse(resource))
    });
  } catch (error) {
    console.error('Error fetching resources:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch resources'
    });
  }
});

// Get a specific resource
router.get('/:id', async (req, res) => {
  try {
    const resource = await models.Resource.findById(req.params.id);
    
    if (!resource) {
      return res.status(404).json({
        success: false,
        error: 'Resource not found'
      });
    }

    // Increment views
    await models.Resource.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });

    res.json({
      success: true,
      data: formatResponse(resource)
    });
  } catch (error) {
    console.error('Error fetching resource:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch resource'
    });
  }
});

// Create a new resource (admin only)
router.post('/', authMiddleware, upload.single('file'), async (req, res) => {
  try {
    console.log('Creating resource with data:', req.body);
    console.log('File info:', req.file);
    
    const resourceData = { ...req.body };
    
    // Handle file upload
    if (req.file) {
      resourceData.file = {
        filename: req.file.filename,
        originalName: req.file.originalname,
        path: req.file.path,
        mimetype: req.file.mimetype,
        size: req.file.size
      };
    }

    // Parse arrays if they come as strings
    try {
      if (typeof resourceData.tags === 'string') {
        resourceData.tags = JSON.parse(resourceData.tags);
      }
      if (typeof resourceData.classRestrictions === 'string') {
        resourceData.classRestrictions = JSON.parse(resourceData.classRestrictions);
      }
      if (typeof resourceData.author === 'string') {
        resourceData.author = JSON.parse(resourceData.author);
      }
    } catch (parseError) {
      console.error('Error parsing JSON fields:', parseError);
      return res.status(400).json({
        success: false,
        error: 'Invalid JSON in form data'
      });
    }

    console.log('Processed resource data:', resourceData);

    const newResource = new models.Resource(resourceData);
    const savedResource = await newResource.save();
    
    res.status(201).json({
      success: true,
      message: 'Resource created successfully',
      data: formatResponse(savedResource)
    });
  } catch (error) {
    console.error('Error creating resource:', error);
    console.error('Error stack:', error.stack);
    
    // Clean up uploaded file if creation failed
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting uploaded file:', err);
      });
    }
    
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to create resource',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Update a resource (admin only)
router.put('/:id', authMiddleware, upload.single('file'), async (req, res) => {
  try {
    const resourceData = { ...req.body, updatedAt: Date.now() };
    
    // Handle new file upload
    if (req.file) {
      // Get old resource to delete old file
      const oldResource = await models.Resource.findById(req.params.id);
      if (oldResource && oldResource.file && oldResource.file.path) {
        fs.unlink(oldResource.file.path, (err) => {
          if (err) console.error('Error deleting old file:', err);
        });
      }

      resourceData.file = {
        filename: req.file.filename,
        originalName: req.file.originalname,
        path: req.file.path,
        mimetype: req.file.mimetype,
        size: req.file.size
      };
    }

    // Parse arrays if they come as strings
    if (typeof resourceData.tags === 'string') {
      resourceData.tags = JSON.parse(resourceData.tags);
    }
    if (typeof resourceData.classRestrictions === 'string') {
      resourceData.classRestrictions = JSON.parse(resourceData.classRestrictions);
    }

    const updatedResource = await models.Resource.findByIdAndUpdate(
      req.params.id,
      resourceData,
      { new: true }
    );
    
    if (!updatedResource) {
      return res.status(404).json({
        success: false,
        error: 'Resource not found'
      });
    }

    res.json({
      success: true,
      message: 'Resource updated successfully',
      data: formatResponse(updatedResource)
    });
  } catch (error) {
    console.error('Error updating resource:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update resource'
    });
  }
});

// Delete a resource (admin only)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const resource = await models.Resource.findById(req.params.id);
    
    if (!resource) {
      return res.status(404).json({
        success: false,
        error: 'Resource not found'
      });
    }

    // Delete file if it exists
    if (resource.file && resource.file.path) {
      fs.unlink(resource.file.path, (err) => {
        if (err) console.error('Error deleting file:', err);
      });
    }

    // Soft delete by setting active to false
    await models.Resource.findByIdAndUpdate(req.params.id, { active: false });

    res.json({
      success: true,
      message: 'Resource deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting resource:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete resource'
    });
  }
});

// Download a resource file
router.get('/:id/download', async (req, res) => {
  try {
    const resource = await models.Resource.findById(req.params.id);
    
    if (!resource) {
      return res.status(404).json({
        success: false,
        error: 'Resource not found'
      });
    }

    if (!resource.isDownloadable) {
      return res.status(400).json({
        success: false,
        error: 'Resource is not downloadable'
      });
    }

    // Check if file exists
    if (!fs.existsSync(resource.file.path)) {
      return res.status(404).json({
        success: false,
        error: 'File not found'
      });
    }

    // Increment download count
    await models.Resource.findByIdAndUpdate(req.params.id, { $inc: { downloads: 1 } });

    // Send file
    res.download(resource.file.path, resource.file.originalName);
  } catch (error) {
    console.error('Error downloading resource:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to download resource'
    });
  }
});

// Get resources by category
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const resources = await models.Resource.find({ 
      category, 
      active: true 
    }).sort({ featured: -1, createdAt: -1 });
    
    res.json({
      success: true,
      data: resources.map(resource => formatResponse(resource))
    });
  } catch (error) {
    console.error('Error fetching resources by category:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch resources'
    });
  }
});

// Get featured resources
router.get('/featured/list', async (req, res) => {
  try {
    const resources = await models.Resource.find({ 
      featured: true, 
      active: true 
    }).sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: resources.map(resource => formatResponse(resource))
    });
  } catch (error) {
    console.error('Error fetching featured resources:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch featured resources'
    });
  }
});

module.exports = router;
