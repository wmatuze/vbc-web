const express = require("express");
const router = express.Router();
const models = require("../models");
const { authMiddleware } = require("../auth-middleware");
const emailService = require("../utils/emailService");
const formatResponse = require("../utils/formatResponse");

// Submit a new join request
router.post("/", async (req, res) => {
  try {
    console.log("Received cell group join request:", req.body);

    const { cellGroupId, name, email, phone, whatsapp, message } = req.body;

    if (!cellGroupId || !name || !email || !phone) {
      return res.status(400).json({
        error: "Please provide all required fields: cellGroupId, name, email, phone",
      });
    }

    // Find the cell group
    const cellGroup = await models.CellGroup.findById(cellGroupId);
    if (!cellGroup) {
      return res.status(404).json({ error: "Cell group not found" });
    }

    // Create the join request
    const joinRequest = new models.CellGroupJoinRequest({
      cellGroup: cellGroupId,
      name,
      email,
      phone,
      whatsapp,
      message,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Save the join request
    const savedRequest = await joinRequest.save();

    // Send email notifications
    await emailService.sendCellGroupJoinRequestEmails(savedRequest, cellGroup);

    res.status(201).json({
      success: true,
      message: "Join request submitted successfully",
      request: formatResponse(savedRequest),
    });
  } catch (error) {
    console.error("Error submitting join request:", error);
    res.status(500).json({ error: "Failed to submit join request" });
  }
});

// Get all join requests (admin only)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const joinRequests = await models.CellGroupJoinRequest.find()
      .populate({
        path: "cellGroup",
        populate: { path: "zone" },
      })
      .sort({ createdAt: -1 });

    res.json(formatResponse(joinRequests));
  } catch (error) {
    console.error("Error fetching join requests:", error);
    res.status(500).json({ error: "Failed to fetch join requests" });
  }
});

// Get join requests for a specific cell group (admin only)
router.get("/cell-group/:cellGroupId", authMiddleware, async (req, res) => {
  try {
    const joinRequests = await models.CellGroupJoinRequest.find({
      cellGroup: req.params.cellGroupId,
    }).sort({ createdAt: -1 });

    res.json(formatResponse(joinRequests));
  } catch (error) {
    console.error("Error fetching join requests for cell group:", error);
    res.status(500).json({
      error: "Failed to fetch join requests for cell group",
    });
  }
});

// Update a join request status (admin only)
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;

    if (!status || !["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({
        error: "Please provide a valid status: pending, approved, or rejected",
      });
    }

    const joinRequest = await models.CellGroupJoinRequest.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: new Date() },
      { new: true }
    ).populate("cellGroup");

    if (!joinRequest) {
      return res.status(404).json({ error: "Join request not found" });
    }

    // TODO: Send email notification based on status change

    res.json(formatResponse(joinRequest));
  } catch (error) {
    console.error("Error updating join request:", error);
    res.status(500).json({ error: "Failed to update join request" });
  }
});

// Delete a join request (admin only)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const joinRequest = await models.CellGroupJoinRequest.findByIdAndDelete(
      req.params.id
    );

    if (!joinRequest) {
      return res.status(404).json({ error: "Join request not found" });
    }

    res.json({ message: "Join request deleted successfully" });
  } catch (error) {
    console.error("Error deleting join request:", error);
    res.status(500).json({ error: "Failed to delete join request" });
  }
});

module.exports = router;
