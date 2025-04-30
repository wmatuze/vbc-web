const express = require('express');
const router = express.Router();
const models = require('../models');
const { authMiddleware } = require('../auth-middleware');
const formatResponse = require('../utils/formatResponse');

// Get all event signup requests (admin only)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const requests = await models.EventSignupRequest.find()
      .populate('eventId')
      .sort({ submittedAt: -1 });

    const formattedRequests = formatResponse(requests);
    res.json(formattedRequests);
  } catch (error) {
    console.error('Error fetching event signup requests:', error);
    res.status(500).json({ error: 'Failed to fetch event signup requests' });
  }
});

// Get event signup requests by event type (admin only)
router.get('/type/:eventType', authMiddleware, async (req, res) => {
  try {
    const { eventType } = req.params;
    
    const requests = await models.EventSignupRequest.find({ eventType })
      .populate('eventId')
      .sort({ submittedAt: -1 });

    const formattedRequests = formatResponse(requests);
    res.json(formattedRequests);
  } catch (error) {
    console.error(`Error fetching ${req.params.eventType} signup requests:`, error);
    res.status(500).json({ error: 'Failed to fetch signup requests' });
  }
});

// Get event signup requests for a specific event (admin only)
router.get('/event/:eventId', authMiddleware, async (req, res) => {
  try {
    const { eventId } = req.params;
    
    const requests = await models.EventSignupRequest.find({ eventId })
      .populate('eventId')
      .sort({ submittedAt: -1 });

    const formattedRequests = formatResponse(requests);
    res.json(formattedRequests);
  } catch (error) {
    console.error(`Error fetching signup requests for event ${req.params.eventId}:`, error);
    res.status(500).json({ error: 'Failed to fetch signup requests' });
  }
});

// Create a new event signup request (public)
router.post('/', async (req, res) => {
  try {
    const {
      eventId,
      eventType,
      fullName,
      email,
      phone,
      testimony,
      previousReligion,
      childName,
      childDateOfBirth,
      parentNames,
      message
    } = req.body;

    // Validate required fields
    if (!eventId || !eventType || !fullName || !email || !phone) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        requiredFields: ['eventId', 'eventType', 'fullName', 'email', 'phone']
      });
    }

    // Verify the event exists
    const event = await models.Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Create the signup request
    const signupRequest = new models.EventSignupRequest({
      eventId,
      eventType,
      fullName,
      email,
      phone,
      testimony,
      previousReligion,
      childName,
      childDateOfBirth,
      parentNames,
      message,
      status: 'pending',
      submittedAt: new Date()
    });

    const savedRequest = await signupRequest.save();
    const formattedRequest = formatResponse(savedRequest);
    
    res.status(201).json(formattedRequest);
  } catch (error) {
    console.error('Error creating event signup request:', error);
    res.status(500).json({ error: 'Failed to create signup request' });
  }
});

// Update an event signup request status (admin only)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    if (!status || !['pending', 'approved', 'declined'].includes(status)) {
      return res.status(400).json({ 
        error: 'Invalid status value',
        allowedValues: ['pending', 'approved', 'declined']
      });
    }

    const updatedRequest = await models.EventSignupRequest.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate('eventId');

    if (!updatedRequest) {
      return res.status(404).json({ error: 'Signup request not found' });
    }

    const formattedRequest = formatResponse(updatedRequest);
    res.json(formattedRequest);
  } catch (error) {
    console.error(`Error updating signup request ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to update signup request' });
  }
});

// Delete an event signup request (admin only)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedRequest = await models.EventSignupRequest.findByIdAndDelete(id);
    
    if (!deletedRequest) {
      return res.status(404).json({ error: 'Signup request not found' });
    }
    
    res.json({ message: 'Signup request deleted successfully' });
  } catch (error) {
    console.error(`Error deleting signup request ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to delete signup request' });
  }
});

module.exports = router;
