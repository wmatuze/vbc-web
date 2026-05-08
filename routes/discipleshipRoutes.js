const express = require('express');
const router = express.Router();
const models = require('../models');
const { authMiddleware } = require('../auth-middleware');
const formatResponse = require('../utils/formatResponse');
const emailService = require('../utils/emailService');

// Get all discipleship classes
router.get('/classes', async (req, res) => {
  try {
    const classes = await models.DiscipleshipClass.find({ active: true })
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: classes.map(cls => formatResponse(cls))
    });
  } catch (error) {
    console.error('Error fetching discipleship classes:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch discipleship classes'
    });
  }
});

// Get a specific discipleship class
router.get('/classes/:id', async (req, res) => {
  try {
    const discipleshipClass = await models.DiscipleshipClass.findById(req.params.id)
      .populate('curriculum.resources');
    
    if (!discipleshipClass) {
      return res.status(404).json({
        success: false,
        error: 'Discipleship class not found'
      });
    }

    res.json({
      success: true,
      data: formatResponse(discipleshipClass)
    });
  } catch (error) {
    console.error('Error fetching discipleship class:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch discipleship class'
    });
  }
});

// Create a new discipleship class (admin only)
router.post('/classes', authMiddleware, async (req, res) => {
  try {
    const newClass = new models.DiscipleshipClass(req.body);
    const savedClass = await newClass.save();
    
    res.status(201).json({
      success: true,
      message: 'Discipleship class created successfully',
      data: formatResponse(savedClass)
    });
  } catch (error) {
    console.error('Error creating discipleship class:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create discipleship class'
    });
  }
});

// Update a discipleship class (admin only)
router.put('/classes/:id', authMiddleware, async (req, res) => {
  try {
    const updatedClass = await models.DiscipleshipClass.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );
    
    if (!updatedClass) {
      return res.status(404).json({
        success: false,
        error: 'Discipleship class not found'
      });
    }

    res.json({
      success: true,
      message: 'Discipleship class updated successfully',
      data: formatResponse(updatedClass)
    });
  } catch (error) {
    console.error('Error updating discipleship class:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update discipleship class'
    });
  }
});

// Delete a discipleship class (admin only)
router.delete('/classes/:id', authMiddleware, async (req, res) => {
  try {
    const deletedClass = await models.DiscipleshipClass.findByIdAndUpdate(
      req.params.id,
      { active: false },
      { new: true }
    );
    
    if (!deletedClass) {
      return res.status(404).json({
        success: false,
        error: 'Discipleship class not found'
      });
    }

    res.json({
      success: true,
      message: 'Discipleship class deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting discipleship class:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete discipleship class'
    });
  }
});

// Get all discipleship sessions
router.get('/sessions', async (req, res) => {
  try {
    const { classId, status } = req.query;
    let query = { active: true };
    
    if (classId) query.classId = classId;
    if (status) query.status = status;

    const sessions = await models.DiscipleshipSession.find(query)
      .populate('classId', 'title category level')
      .populate('resources')
      .sort({ startDate: 1 });
    
    res.json({
      success: true,
      data: sessions.map(session => formatResponse(session))
    });
  } catch (error) {
    console.error('Error fetching discipleship sessions:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch discipleship sessions'
    });
  }
});

// Get a specific discipleship session
router.get('/sessions/:id', async (req, res) => {
  try {
    const session = await models.DiscipleshipSession.findById(req.params.id)
      .populate('classId')
      .populate('resources');
    
    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'Discipleship session not found'
      });
    }

    res.json({
      success: true,
      data: formatResponse(session)
    });
  } catch (error) {
    console.error('Error fetching discipleship session:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch discipleship session'
    });
  }
});

// Create a new discipleship session (admin only)
router.post('/sessions', authMiddleware, async (req, res) => {
  try {
    const newSession = new models.DiscipleshipSession(req.body);
    const savedSession = await newSession.save();
    
    res.status(201).json({
      success: true,
      message: 'Discipleship session created successfully',
      data: formatResponse(savedSession)
    });
  } catch (error) {
    console.error('Error creating discipleship session:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create discipleship session'
    });
  }
});

// Update a discipleship session (admin only)
router.put('/sessions/:id', authMiddleware, async (req, res) => {
  try {
    const updatedSession = await models.DiscipleshipSession.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    ).populate('classId');
    
    if (!updatedSession) {
      return res.status(404).json({
        success: false,
        error: 'Discipleship session not found'
      });
    }

    res.json({
      success: true,
      message: 'Discipleship session updated successfully',
      data: formatResponse(updatedSession)
    });
  } catch (error) {
    console.error('Error updating discipleship session:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update discipleship session'
    });
  }
});

// Delete a discipleship session (admin only)
router.delete('/sessions/:id', authMiddleware, async (req, res) => {
  try {
    const deletedSession = await models.DiscipleshipSession.findByIdAndUpdate(
      req.params.id,
      { active: false },
      { new: true }
    );
    
    if (!deletedSession) {
      return res.status(404).json({
        success: false,
        error: 'Discipleship session not found'
      });
    }

    res.json({
      success: true,
      message: 'Discipleship session deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting discipleship session:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete discipleship session'
    });
  }
});

// REGISTRATION ROUTES

// Register for a discipleship class
router.post('/register', async (req, res) => {
  try {
    console.log('Received discipleship registration:', req.body);

    const { 
      fullName, 
      email, 
      phone, 
      preferredSession, 
      sessionId, 
      classId, 
      previousClasses, 
      questions,
      emergencyContact,
      motivationReason
    } = req.body;

    if (!fullName || !email || !phone || !preferredSession || !sessionId || !classId || !motivationReason) {
      return res.status(400).json({
        success: false,
        error: 'Please provide all required fields'
      });
    }

    if (!emergencyContact || !emergencyContact.name || !emergencyContact.phone || !emergencyContact.relationship) {
      return res.status(400).json({
        success: false,
        error: 'Emergency contact information is required'
      });
    }

    // Check if session exists and has capacity
    const session = await models.DiscipleshipSession.findById(sessionId);
    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'Session not found'
      });
    }

    if (session.enrolledCount >= session.capacity) {
      return res.status(400).json({
        success: false,
        error: 'Session is full'
      });
    }

    if (!session.registrationOpen) {
      return res.status(400).json({
        success: false,
        error: 'Registration is closed for this session'
      });
    }

    // Check if user is already registered for this session
    const existingRegistration = await models.DiscipleshipRegistration.findOne({
      email: email,
      sessionId: sessionId
    });

    if (existingRegistration) {
      return res.status(400).json({
        success: false,
        error: 'You are already registered for this session'
      });
    }

    // Create a new registration
    const registration = new models.DiscipleshipRegistration({
      fullName,
      email,
      phone,
      preferredSession,
      sessionId,
      classId,
      previousClasses: previousClasses || '',
      questions: questions || '',
      emergencyContact,
      motivationReason,
      registrationDate: new Date()
    });

    const savedRegistration = await registration.save();
    console.log('Discipleship registration saved successfully:', savedRegistration._id);

    // Update session enrolled count
    await models.DiscipleshipSession.findByIdAndUpdate(
      sessionId,
      { $inc: { enrolledCount: 1 } }
    );

    // Format for response
    const formattedRegistration = formatResponse(savedRegistration);

    // Send confirmation emails (implement if needed)
    // emailService.sendDiscipleshipRegistrationEmails(savedRegistration)
    //   .then(() => console.log('Registration emails sent successfully'))
    //   .catch((err) => console.error('Error sending registration emails:', err));

    res.status(201).json({
      success: true,
      message: 'Discipleship registration submitted successfully',
      data: formattedRegistration
    });
  } catch (error) {
    console.error('Error processing discipleship registration:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process registration. Please try again.'
    });
  }
});

// Get all discipleship registrations (admin only)
router.get('/registrations', authMiddleware, async (req, res) => {
  try {
    const registrations = await models.DiscipleshipRegistration.find()
      .populate('sessionId', 'cohortName schedule location facilitator')
      .populate('classId', 'title level duration instructor')
      .sort({ registrationDate: -1 });

    res.json({
      success: true,
      data: registrations.map(registration => formatResponse(registration))
    });
  } catch (error) {
    console.error('Error fetching discipleship registrations:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch discipleship registrations'
    });
  }
});

// Get a specific discipleship registration (admin only)
router.get('/registrations/:id', authMiddleware, async (req, res) => {
  try {
    const registration = await models.DiscipleshipRegistration.findById(req.params.id)
      .populate('sessionId')
      .populate('classId');

    if (!registration) {
      return res.status(404).json({
        success: false,
        error: 'Registration not found'
      });
    }

    res.json({
      success: true,
      data: formatResponse(registration)
    });
  } catch (error) {
    console.error('Error fetching discipleship registration:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch registration'
    });
  }
});

// Update discipleship registration status (admin only)
router.put('/registrations/:id', authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({
        success: false,
        error: 'Status is required'
      });
    }

    const validStatuses = ['pending', 'approved', 'attending', 'completed', 'cancelled', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status value'
      });
    }

    const registration = await models.DiscipleshipRegistration.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('sessionId').populate('classId');

    if (!registration) {
      return res.status(404).json({
        success: false,
        error: 'Registration not found'
      });
    }

    res.json({
      success: true,
      message: `Registration status updated to ${status}`,
      data: formatResponse(registration)
    });
  } catch (error) {
    console.error('Error updating discipleship registration status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update registration status'
    });
  }
});

// Delete discipleship registration (admin only)
router.delete('/registrations/:id', authMiddleware, async (req, res) => {
  try {
    const registration = await models.DiscipleshipRegistration.findByIdAndDelete(req.params.id);

    if (!registration) {
      return res.status(404).json({
        success: false,
        error: 'Registration not found'
      });
    }

    res.json({
      success: true,
      message: 'Registration deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting discipleship registration:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete registration'
    });
  }
});

// Send completion certificate (admin only) — also marks status as 'completed'
router.post('/registrations/:id/certificate', authMiddleware, async (req, res) => {
  try {
    const registration = await models.DiscipleshipRegistration.findById(req.params.id)
      .populate('sessionId', 'cohortName facilitator startDate endDate')
      .populate('classId', 'title level duration');

    if (!registration) {
      return res.status(404).json({ success: false, error: 'Registration not found' });
    }

    if (!registration.email) {
      return res.status(400).json({ success: false, error: 'Registration has no email address' });
    }

    // Mark as completed if not already
    if (registration.status !== 'completed') {
      registration.status = 'completed';
      await registration.save();
    }

    await emailService.sendDiscipleshipCertificate(registration);

    res.json({
      success: true,
      message: `Certificate sent to ${registration.email}`,
      data: { status: registration.status },
    });
  } catch (error) {
    console.error('Error sending discipleship certificate:', error);
    res.status(500).json({ success: false, error: 'Failed to send certificate' });
  }
});

module.exports = router;
