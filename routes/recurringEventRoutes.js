const express = require("express");
const router = express.Router();
const RecurringEvent = require("../models/RecurringEvent");
const { authMiddleware } = require("../auth-middleware");
const formatResponse = require("../utils/formatResponse");

// Get all recurring events
router.get("/", async (req, res) => {
  try {
    const recurringEvents = await RecurringEvent.find({ active: true }).sort({ createdAt: -1 });
    const formattedEvents = formatResponse(recurringEvents);
    
    res.json(formattedEvents);
  } catch (error) {
    console.error("Error fetching recurring events:", error);
    res.status(500).json({ error: "Failed to fetch recurring events" });
  }
});

// Get a single recurring event by ID
router.get("/:id", async (req, res) => {
  try {
    const recurringEvent = await RecurringEvent.findById(req.params.id);
    
    if (!recurringEvent) {
      return res.status(404).json({ error: "Recurring event not found" });
    }
    
    const formattedEvent = formatResponse(recurringEvent);
    res.json(formattedEvent);
  } catch (error) {
    console.error("Error fetching recurring event:", error);
    res.status(500).json({ error: "Failed to fetch recurring event" });
  }
});

// Create a new recurring event (admin only)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const recurringEventData = {
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    const recurringEvent = new RecurringEvent(recurringEventData);
    const savedRecurringEvent = await recurringEvent.save();
    
    const formattedEvent = formatResponse(savedRecurringEvent);
    res.status(201).json(formattedEvent);
  } catch (error) {
    console.error("Error creating recurring event:", error);
    res.status(500).json({ error: "Failed to create recurring event" });
  }
});

// Update a recurring event (admin only)
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const updateData = {
      ...req.body,
      updatedAt: new Date(),
    };
    
    const updatedRecurringEvent = await RecurringEvent.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    
    if (!updatedRecurringEvent) {
      return res.status(404).json({ error: "Recurring event not found" });
    }
    
    const formattedEvent = formatResponse(updatedRecurringEvent);
    res.json(formattedEvent);
  } catch (error) {
    console.error("Error updating recurring event:", error);
    res.status(500).json({ error: "Failed to update recurring event" });
  }
});

// Delete a recurring event (admin only)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const deletedRecurringEvent = await RecurringEvent.findByIdAndDelete(req.params.id);
    
    if (!deletedRecurringEvent) {
      return res.status(404).json({ error: "Recurring event not found" });
    }
    
    res.json({ message: "Recurring event deleted successfully" });
  } catch (error) {
    console.error("Error deleting recurring event:", error);
    res.status(500).json({ error: "Failed to delete recurring event" });
  }
});

module.exports = router;
