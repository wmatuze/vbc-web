const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const models = require('../models');
const { authMiddleware } = require('../auth-middleware');
const { cloudinary, folderFor, uploadBuffer } = require('../config/cloudinary');
const formatResponse = require('../utils/formatResponse');

const normalizeOriginalName = (filename) => {
  try {
    return decodeURIComponent(filename);
  } catch {
    return filename;
  }
};

const createPublicId = (filename) => {
  const normalizedName = normalizeOriginalName(filename);
  const baseName = path.basename(normalizedName, path.extname(normalizedName));
  const safeName = baseName
    .replace(/[^a-zA-Z0-9_-]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 50);
  return `${Date.now()}-${safeName || 'resource'}`;
};

const upload = multer({
  // Files are sent to durable storage after validation rather than being kept
  // on the application server's ephemeral filesystem.
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
  },
  fileFilter: function (req, file, cb) {
    // Allow common file types - expanded list
    const allowedExtensions = /\.(jpeg|jpg|png|gif|webp|pdf|doc|docx|ppt|pptx|xls|xlsx|txt|rtf|odt|ods|odp|mp3|wav|ogg|aac|m4a|mp4|avi|mov|wmv|webm|mkv)$/i;
    
    // Allow common MIME types
    const allowedMimeTypes = [
      // Images
      'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
      // Documents
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain', 'text/rtf',
      'application/vnd.oasis.opendocument.text',
      'application/vnd.oasis.opendocument.spreadsheet',
      'application/vnd.oasis.opendocument.presentation',
      // Audio
      'audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/aac', 'audio/m4a', 'audio/x-m4a',
      // Video
      'video/mp4', 'video/avi', 'video/quicktime', 'video/x-msvideo', 'video/webm', 'video/x-matroska'
    ];

    const extname = allowedExtensions.test(file.originalname);
    const mimetype = allowedMimeTypes.includes(file.mimetype.toLowerCase());

    if (extname || mimetype) {
      return cb(null, true);
    } else {
      console.error('File type rejected:', {
        filename: file.originalname,
        mimetype: file.mimetype,
        extension: path.extname(file.originalname).toLowerCase()
      });
      cb(new Error(`File type not allowed. Uploaded file: ${file.originalname} (${file.mimetype}). Please use: images, PDFs, documents, audio, or video files.`));
    }
  }
});

// Get all resources
router.get('/', async (req, res) => {
  try {
    const { category, excludeCategory, type, search, featured } = req.query;
    let query = { active: true };
    
    if (category) {
      query.category = category;
    } else if (excludeCategory) {
      query.category = { $ne: excludeCategory };
    }
    if (type) query.type = type;
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

// Record a public resource view. The frontend calls this when playback starts.
router.post('/:id/view', async (req, res) => {
  try {
    const resource = await models.Resource.findOneAndUpdate(
      { _id: req.params.id, active: true },
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!resource) {
      return res.status(404).json({
        success: false,
        error: 'Resource not found'
      });
    }

    res.json({
      success: true,
      views: resource.views
    });
  } catch (error) {
    console.error('Error recording resource view:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to record resource view'
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
  let uploadedFile = null;
  try {
    const resourceData = { ...req.body };

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

    // Upload only after request fields have been parsed successfully.
    if (req.file) {
      uploadedFile = await uploadBuffer(req.file.buffer, {
        folder: folderFor(resourceData.category === 'audio_sermons' ? 'audio' : 'resources'),
        public_id: createPublicId(req.file.originalname),
      });
      resourceData.file = {
        filename: uploadedFile.public_id,
        originalName: normalizeOriginalName(req.file.originalname),
        path: uploadedFile.secure_url,
        cloudinaryId: uploadedFile.public_id,
        resourceType: uploadedFile.resource_type,
        mimetype: req.file.mimetype,
        size: uploadedFile.bytes
      };
    }

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
    
    // Clean up the remote file when database creation fails.
    if (uploadedFile?.public_id) {
      try {
        await cloudinary.uploader.destroy(uploadedFile.public_id, {
          resource_type: uploadedFile.resource_type,
        });
      } catch (cleanupError) {
        console.error('Error cleaning up Cloudinary upload:', cleanupError);
      }
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
  let uploadedFile = null;
  let oldResource = null;
  try {
    const resourceData = { ...req.body, updatedAt: Date.now() };

    // Parse arrays if they come as strings
    if (typeof resourceData.tags === 'string') {
      resourceData.tags = JSON.parse(resourceData.tags);
    }
    if (typeof resourceData.classRestrictions === 'string') {
      resourceData.classRestrictions = JSON.parse(resourceData.classRestrictions);
    }
    if (typeof resourceData.author === 'string') {
      resourceData.author = JSON.parse(resourceData.author);
    }

    // Confirm the target exists before storing a replacement file.
    if (req.file) {
      oldResource = await models.Resource.findById(req.params.id);
      if (!oldResource) {
        return res.status(404).json({
          success: false,
          error: 'Resource not found'
        });
      }

      uploadedFile = await uploadBuffer(req.file.buffer, {
        folder: folderFor(resourceData.category === 'audio_sermons' ? 'audio' : 'resources'),
        public_id: createPublicId(req.file.originalname),
      });
      resourceData.file = {
        filename: uploadedFile.public_id,
        originalName: normalizeOriginalName(req.file.originalname),
        path: uploadedFile.secure_url,
        cloudinaryId: uploadedFile.public_id,
        resourceType: uploadedFile.resource_type,
        mimetype: req.file.mimetype,
        size: uploadedFile.bytes
      };
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

    // Only remove the previous file after the database points at the new one.
    if (uploadedFile) {
      try {
        if (oldResource?.file?.cloudinaryId) {
          await cloudinary.uploader.destroy(oldResource.file.cloudinaryId, {
            resource_type: oldResource.file.resourceType || 'image',
          });
        } else if (oldResource?.file?.path && fs.existsSync(oldResource.file.path)) {
          fs.unlink(oldResource.file.path, (err) => {
            if (err) console.error('Error deleting old local file:', err);
          });
        }
      } catch (cleanupError) {
        console.error('Resource updated, but the previous file could not be removed:', cleanupError);
      }
    }

    res.json({
      success: true,
      message: 'Resource updated successfully',
      data: formatResponse(updatedResource)
    });
  } catch (error) {
    console.error('Error updating resource:', error);
    if (uploadedFile?.public_id) {
      try {
        await cloudinary.uploader.destroy(uploadedFile.public_id, {
          resource_type: uploadedFile.resource_type,
        });
      } catch (cleanupError) {
        console.error('Error cleaning up Cloudinary upload:', cleanupError);
      }
    }
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
    if (resource.file?.cloudinaryId) {
      await cloudinary.uploader.destroy(resource.file.cloudinaryId, {
        resource_type: resource.file.resourceType || 'image',
      });
    } else if (resource.file?.path && fs.existsSync(resource.file.path)) {
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
      if (resource.type === 'link' && resource.url) {
        await models.Resource.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });
        return res.redirect(resource.url);
      }
      return res.status(400).json({
        success: false,
        error: 'Resource is not downloadable'
      });
    }

    // Cloudinary and other durable-storage URLs can be downloaded directly.
    if (/^https?:\/\//i.test(resource.file.path)) {
      await models.Resource.findByIdAndUpdate(req.params.id, { $inc: { downloads: 1 } });
      return res.redirect(resource.file.path);
    }

    // Backward compatibility for files saved on local disk.
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
