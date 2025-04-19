const express = require("express");
const router = express.Router();
const models = require("../models");
const { authMiddleware } = require("../auth-middleware");
const formatResponse = require("../utils/formatResponse");

// Get all zones
router.get("/", async (req, res) => {
  try {
    const zones = await models.Zone.find()
      .populate("coverImage")
      .sort({ name: 1 });

    // Count cell groups for each zone
    const zonesWithCounts = await Promise.all(
      zones.map(async (zone) => {
        const cellCount = await models.CellGroup.countDocuments({
          zone: zone._id,
        });
        return {
          ...zone.toObject(),
          cellCount,
        };
      })
    );

    // Format zones for frontend compatibility
    const formattedZones = formatResponse(zonesWithCounts);

    res.json(formattedZones);
  } catch (error) {
    console.error("Error fetching zones:", error);
    res.status(500).json({ error: "Failed to fetch zones" });
  }
});

// Get a single zone by ID
router.get("/:id", async (req, res) => {
  try {
    const zone = await models.Zone.findById(req.params.id).populate(
      "coverImage"
    );

    if (!zone) {
      return res.status(404).json({ error: "Zone not found" });
    }

    // Count cell groups for this zone
    const cellCount = await models.CellGroup.countDocuments({
      zone: zone._id,
    });

    // Format zone for frontend compatibility
    const formattedZone = formatResponse({
      ...zone.toObject(),
      cellCount,
    });

    res.json(formattedZone);
  } catch (error) {
    console.error("Error fetching zone:", error);
    res.status(500).json({ error: "Failed to fetch zone" });
  }
});

// Get all cell groups for a specific zone
router.get("/:id/cell-groups", async (req, res) => {
  try {
    const cellGroups = await models.CellGroup.find({
      zone: req.params.id,
    })
      .populate("image")
      .populate("leaderImage")
      .sort({ name: 1 });

    // Format cell groups for frontend compatibility
    const formattedCellGroups = formatResponse(cellGroups);

    res.json(formattedCellGroups);
  } catch (error) {
    console.error("Error fetching cell groups for zone:", error);
    res.status(500).json({
      error: "Failed to fetch cell groups for zone",
    });
  }
});

// Create a new zone (admin only)
router.post("/", authMiddleware, async (req, res) => {
  try {
    console.log("Received zone creation request:", req.body);

    // Create a new zone from the request body
    const zoneData = {
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Create and save the new zone
    const zone = new models.Zone(zoneData);
    const savedZone = await zone.save();

    // Format for response
    const formattedZone = formatResponse(savedZone);

    console.log("Successfully created zone:", formattedZone.name);

    res.status(201).json(formattedZone);
  } catch (error) {
    console.error("Error creating zone:", error);
    res.status(500).json({ error: "Failed to create zone" });
  }
});

// Update a zone (admin only)
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const updateData = { ...req.body, updatedAt: new Date() };

    // Remove MongoDB-specific fields that might cause issues
    delete updateData._id;
    delete updateData.__v;
    delete updateData.createdAt;

    const zone = await models.Zone.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate("coverImage");

    if (!zone) {
      return res.status(404).json({ error: "Zone not found" });
    }

    // Format for response
    const formattedZone = formatResponse(zone);

    res.json(formattedZone);
  } catch (error) {
    console.error("Error updating zone:", error);
    res.status(500).json({ error: "Failed to update zone" });
  }
});

// Delete a zone (admin only)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    // Check if there are any cell groups in this zone
    const cellGroupCount = await models.CellGroup.countDocuments({
      zone: req.params.id,
    });

    if (cellGroupCount > 0) {
      return res.status(400).json({
        error: "Cannot delete zone with cell groups. Please move or delete the cell groups first.",
      });
    }

    const zone = await models.Zone.findByIdAndDelete(req.params.id);
    if (!zone) {
      return res.status(404).json({ error: "Zone not found" });
    }
    res.json({ message: "Zone deleted successfully" });
  } catch (error) {
    console.error("Error deleting zone:", error);
    res.status(500).json({ error: "Failed to delete zone" });
  }
});

module.exports = router;
