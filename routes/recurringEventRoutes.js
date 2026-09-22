const express = require("express");
const router = express.Router();
const RecurringEvent = require("../models/RecurringEvent");
const { authMiddleware } = require("../auth-middleware");
const formatResponse = require("../utils/formatResponse");

const WEEK_ORDER = { first: 1, second: 2, third: 3, fourth: 4, last: 5 };

const getRecurringEventOrder = (event) => {
  if (event.recurrenceType === "monthly") {
    if (event.weekOfMonth) {
      return (WEEK_ORDER[event.weekOfMonth] || 6) * 10 + (event.dayOfWeek ?? 0);
    }
    if (event.dayOfMonth) return Number(event.dayOfMonth);
  }
  if (event.recurrenceType === "weekly") return 100 + (event.dayOfWeek ?? 7);
  if (event.recurrenceType === "yearly") return 200 + (event.month ?? 12);
  return 999;
};

const sortRecurringEvents = (events) =>
  events.sort((a, b) => getRecurringEventOrder(a) - getRecurringEventOrder(b));

const normalizeRecurrence = (data) => {
  const normalized = { ...data };

  if (normalized.recurrenceType === "weekly") {
    normalized.weekOfMonth = undefined;
    normalized.dayOfMonth = undefined;
    normalized.month = undefined;
  } else if (normalized.recurrenceType === "monthly") {
    normalized.month = undefined;
    if (normalized.weekOfMonth) {
      normalized.dayOfMonth = undefined;
    } else if (normalized.dayOfMonth) {
      normalized.dayOfWeek = undefined;
    }
  } else if (normalized.recurrenceType === "yearly") {
    normalized.dayOfWeek = undefined;
    normalized.weekOfMonth = undefined;
    normalized.dayOfMonth = undefined;
  }

  return normalized;
};

const sendWriteError = (res, error, message) => {
  if (error.name === "ValidationError") {
    return res.status(400).json({ error: error.message });
  }
  return res.status(500).json({ error: message });
};

// Get all recurring events
router.get("/", async (req, res) => {
  try {
    const recurringEvents = await RecurringEvent.find({ active: true });
    sortRecurringEvents(recurringEvents);
    const formattedEvents = formatResponse(recurringEvents);
    
    res.json(formattedEvents);
  } catch (error) {
    console.error("Error fetching recurring events:", error);
    res.status(500).json({ error: "Failed to fetch recurring events" });
  }
});

// Get all recurring events for administration, including inactive ones.
router.get("/admin", authMiddleware, async (req, res) => {
  try {
    const recurringEvents = await RecurringEvent.find({});
    sortRecurringEvents(recurringEvents);
    res.json(formatResponse(recurringEvents));
  } catch (error) {
    console.error("Error fetching recurring events for admin:", error);
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
    const recurringEventData = normalizeRecurrence({
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    
    const recurringEvent = new RecurringEvent(recurringEventData);
    const savedRecurringEvent = await recurringEvent.save();
    
    const formattedEvent = formatResponse(savedRecurringEvent);
    res.status(201).json(formattedEvent);
  } catch (error) {
    console.error("Error creating recurring event:", error);
    sendWriteError(res, error, "Failed to create recurring event");
  }
});

// Update a recurring event (admin only)
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const recurringEvent = await RecurringEvent.findById(req.params.id);
    if (!recurringEvent) {
      return res.status(404).json({ error: "Recurring event not found" });
    }

    const updateData = normalizeRecurrence({
      ...recurringEvent.toObject(),
      ...req.body,
      _id: recurringEvent._id,
      createdAt: recurringEvent.createdAt,
      updatedAt: new Date(),
    });

    recurringEvent.set(updateData);
    const updatedRecurringEvent = await recurringEvent.save();
    
    const formattedEvent = formatResponse(updatedRecurringEvent);
    res.json(formattedEvent);
  } catch (error) {
    console.error("Error updating recurring event:", error);
    sendWriteError(res, error, "Failed to update recurring event");
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
