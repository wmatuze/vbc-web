const express = require("express");
const router = express.Router();
const models = require("../models");
const { authMiddleware } = require("../auth-middleware");
const formatResponse = require("../utils/formatResponse");

// Get all active foundation class sessions
router.get("/", async (req, res) => {
  try {
    // By default, only return active sessions
    const filter = req.query.showAll === "true" ? {} : { active: true };

    // Set CORS headers explicitly for this endpoint
    res.header("Access-Control-Allow-Origin", "http://localhost:5173");
    res.header("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.header("Access-Control-Allow-Credentials", "true");

    console.log("Fetching foundation class sessions with filter:", filter);

    const sessions = await models.FoundationClassSession.find(filter).sort({
      startDate: 1,
    });

    console.log(`Found ${sessions.length} foundation class sessions`);

    // Format sessions for frontend compatibility
    const formattedSessions = formatResponse(sessions);

    res.json(formattedSessions);
  } catch (error) {
    console.error("Error fetching foundation class sessions:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch foundation class sessions" });
  }
});

// Get a single foundation class session by ID
router.get("/:id", async (req, res) => {
  try {
    const session = await models.FoundationClassSession.findById(req.params.id);

    if (!session) {
      return res
        .status(404)
        .json({ error: "Foundation class session not found" });
    }

    // Format session for frontend compatibility
    const formattedSession = formatResponse(session);

    res.json(formattedSession);
  } catch (error) {
    console.error("Error fetching foundation class session:", error);
    res.status(500).json({ error: "Failed to fetch foundation class session" });
  }
});

// Create a new foundation class session (admin only)
router.post("/", authMiddleware, async (req, res) => {
  try {
    console.log("Creating new foundation class session:", req.body);

    // Create session data with proper date objects
    const sessionData = {
      ...req.body,
      startDate: new Date(req.body.startDate),
      endDate: new Date(req.body.endDate),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Create and save the new session
    const session = new models.FoundationClassSession(sessionData);
    const savedSession = await session.save();

    // Format for response
    const formattedSession = formatResponse(savedSession);

    console.log("Successfully created foundation class session");
    res.status(201).json(formattedSession);
  } catch (error) {
    console.error("Error creating foundation class session:", error);
    res
      .status(500)
      .json({ error: "Failed to create foundation class session" });
  }
});

// Update a foundation class session (admin only)
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const updateData = {
      ...req.body,
      updatedAt: new Date(),
    };

    // Convert date strings to Date objects if provided
    if (updateData.startDate) {
      updateData.startDate = new Date(updateData.startDate);
    }

    if (updateData.endDate) {
      updateData.endDate = new Date(updateData.endDate);
    }

    // Remove MongoDB-specific fields that might cause issues
    delete updateData._id;
    delete updateData.__v;
    delete updateData.createdAt;

    const session = await models.FoundationClassSession.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!session) {
      return res
        .status(404)
        .json({ error: "Foundation class session not found" });
    }

    // Format for response
    const formattedSession = formatResponse(session);

    res.json(formattedSession);
  } catch (error) {
    console.error("Error updating foundation class session:", error);
    res
      .status(500)
      .json({ error: "Failed to update foundation class session" });
  }
});

// Delete a foundation class session (admin only)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const session = await models.FoundationClassSession.findByIdAndDelete(
      req.params.id
    );

    if (!session) {
      return res
        .status(404)
        .json({ error: "Foundation class session not found" });
    }

    res.json({ message: "Foundation class session deleted successfully" });
  } catch (error) {
    console.error("Error deleting foundation class session:", error);
    res
      .status(500)
      .json({ error: "Failed to delete foundation class session" });
  }
});

// Increment enrolled count when someone registers (admin only)
router.post("/:id/increment-enrollment", authMiddleware, async (req, res) => {
  try {
    const session = await models.FoundationClassSession.findById(req.params.id);

    if (!session) {
      return res
        .status(404)
        .json({ error: "Foundation class session not found" });
    }

    // Check if there's capacity
    if (session.enrolledCount >= session.capacity) {
      return res.status(400).json({ error: "Session is at full capacity" });
    }

    // Increment the enrolled count
    session.enrolledCount += 1;
    await session.save();

    // Format for response
    const formattedSession = formatResponse(session);

    res.json(formattedSession);
  } catch (error) {
    console.error("Error incrementing enrollment:", error);
    res.status(500).json({ error: "Failed to increment enrollment" });
  }
});

module.exports = router;
