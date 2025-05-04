const express = require("express");
const router = express.Router();
const models = require("./models");
const emailService = require("./utils/emailService");
const { authMiddleware } = require("./auth-middleware");
const notificationRoutes = require("./routes/notificationRoutes");
const exportRoutes = require("./routes/exportRoutes");
const zoneRoutes = require("./routes/zoneRoutes");
const cellGroupJoinRequestRoutes = require("./routes/cellGroupJoinRequestRoutes");
const eventSignupRequestRoutes = require("./routes/eventSignupRequestRoutes");
const formatResponse = require("./utils/formatResponse");

// Mount notification routes
router.use("/notifications", notificationRoutes);

// Mount export routes
router.use("/export", exportRoutes);

// Mount zone routes
router.use("/zones", zoneRoutes);

// Mount cell group join request routes
router.use("/cell-group-join-requests", cellGroupJoinRequestRoutes);

// Mount event signup request routes
router.use("/event-signup-requests", eventSignupRequestRoutes);

// Support request endpoint
router.post("/support", async (req, res) => {
  try {
    const { name, email, subject, message, priority } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        error: "Please provide all required fields",
      });
    }

    // Create email content
    const emailContent = {
      to: "watu.matuze@hotmail.com",
      subject: `Support Request: ${subject} (${priority} priority)`,
      text: `
Support Request from Admin Portal

From: ${name} (${email})
Priority: ${priority}

Message:
${message}

---
This message was sent from the Victory Bible Church CMS Support Form.
      `,
      html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background-color: #4f46e5; color: white; padding: 20px; text-align: center;">
    <h1>Support Request from Admin Portal</h1>
  </div>
  <div style="padding: 20px; border: 1px solid #e5e7eb; border-top: none;">
    <p><strong>From:</strong> ${name} (${email})</p>
    <p><strong>Priority:</strong> <span style="color: ${priority === "urgent" ? "#dc2626" : priority === "high" ? "#ea580c" : priority === "medium" ? "#0284c7" : "#059669"};">${priority}</span></p>
    <p><strong>Subject:</strong> ${subject}</p>

    <div style="background-color: #f9fafb; padding: 15px; border-radius: 5px; margin: 15px 0;">
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, "<br>")}</p>
    </div>

    <p style="font-size: 12px; color: #6b7280; margin-top: 30px; padding-top: 10px; border-top: 1px solid #e5e7eb;">
      This message was sent from the Victory Bible Church CMS Support Form.
    </p>
  </div>
</div>
      `,
    };

    // Send the email
    await emailService.sendEmail(emailContent);

    res.status(200).json({
      success: true,
      message: "Support request sent successfully",
    });
  } catch (error) {
    console.error("Error sending support request:", error);
    res.status(500).json({
      success: false,
      error: "Failed to send support request",
    });
  }
});

// Use the formatResponse utility function

// Get all events
router.get("/events", async (req, res) => {
  try {
    const events = await models.Event.find()
      .populate("image")
      .sort({ startDate: 1 });

    // Format events for frontend compatibility
    const formattedEvents = formatResponse(events);
    console.log(`API returning ${formattedEvents.length} events`);

    res.json(formattedEvents);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

// Get a single event by ID
router.get("/events/:id", async (req, res) => {
  try {
    const event = await models.Event.findById(req.params.id).populate("image");

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    // Format event for frontend compatibility
    const formattedEvent = formatResponse(event);
    console.log("API returning single event:", formattedEvent.title);

    res.json(formattedEvent);
  } catch (error) {
    console.error("Error fetching event:", error);
    res.status(500).json({ error: "Failed to fetch event" });
  }
});

// Create a new event
router.post("/events", authMiddleware, async (req, res) => {
  try {
    console.log("Received event creation request:", req.body);

    // Create a new event from the request body
    const eventData = {
      ...req.body,
      type: "event", // Ensure type is set for proper categorization
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Handle date conversion properly
    if (req.body.startDate) {
      // If startDate is provided, use it
      eventData.startDate = new Date(req.body.startDate);
    } else if (req.body.date) {
      // If only date string is provided (e.g., "April 30, 2025")
      try {
        // Try to parse the date string
        const dateStr = req.body.date;
        // Handle different date formats
        let parsedDate;

        if (dateStr.includes(",")) {
          // Format like "April 30, 2025"
          const parts = dateStr.split(",");
          if (parts.length === 2) {
            const monthDay = parts[0].trim().split(" ");
            const year = parts[1].trim();
            if (monthDay.length === 2) {
              parsedDate = new Date(`${monthDay[0]} ${monthDay[1]}, ${year}`);
            }
          }
        } else {
          // Try standard date parsing
          parsedDate = new Date(dateStr);
        }

        // If we have a valid date, use it
        if (parsedDate && !isNaN(parsedDate.getTime())) {
          eventData.startDate = parsedDate;

          // If time is provided, incorporate it
          if (req.body.time) {
            const timeStr = req.body.time;
            const timeParts = timeStr.match(/([0-9]+):([0-9]+)\s*(AM|PM)?/i);
            if (timeParts) {
              let hours = parseInt(timeParts[1]);
              const minutes = parseInt(timeParts[2]);
              const ampm = timeParts[3] ? timeParts[3].toUpperCase() : null;

              // Convert to 24-hour format if needed
              if (ampm === "PM" && hours < 12) hours += 12;
              if (ampm === "AM" && hours === 12) hours = 0;

              parsedDate.setHours(hours, minutes, 0, 0);
              eventData.startDate = parsedDate;
            }
          }
        } else {
          // Fallback to current date
          console.warn(
            `Could not parse date string: ${dateStr}, using current date`
          );
          eventData.startDate = new Date();
        }
      } catch (err) {
        console.error("Error parsing date:", err);
        eventData.startDate = new Date();
      }
    } else {
      // No date provided, use current date
      eventData.startDate = new Date();
    }

    // Set endDate (default to 2 hours after startDate if not provided)
    if (req.body.endDate) {
      eventData.endDate = new Date(req.body.endDate);
    } else {
      eventData.endDate = new Date(
        eventData.startDate.getTime() + 2 * 60 * 60 * 1000
      );
    }

    // Store the formatted date and time strings for frontend compatibility
    if (!eventData.date) {
      const month = eventData.startDate.toLocaleString("default", {
        month: "long",
      });
      const day = eventData.startDate.getDate();
      const year = eventData.startDate.getFullYear();
      eventData.date = `${month} ${day}, ${year}`;
    }

    if (!eventData.time) {
      eventData.time = eventData.startDate.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      });
    }

    // If imageUrl is provided but no image object, use the imageUrl
    if (req.body.imageUrl && !req.body.image) {
      eventData.imageUrl = req.body.imageUrl;
    }

    // Create and save the new event
    const event = new models.Event(eventData);
    const savedEvent = await event.save();

    // Format for response
    const formattedEvent = formatResponse(savedEvent);

    console.log("Successfully created event:", formattedEvent.title);

    res.status(201).json(formattedEvent);
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ error: "Failed to create event" });
  }
});

// Update an event
router.put("/events/:id", authMiddleware, async (req, res) => {
  try {
    console.log(`Updating event with ID: ${req.params.id}`);
    console.log("Update data:", req.body);

    // Prepare update data
    const updateData = {
      ...req.body,
      updatedAt: new Date(),
      type: "event", // Ensure type is set for proper categorization
    };

    // Handle date conversion properly
    if (req.body.startDate) {
      // If startDate is provided, use it
      updateData.startDate = new Date(req.body.startDate);
    } else if (req.body.date) {
      // If only date string is provided (e.g., "April 30, 2025")
      try {
        // Try to parse the date string
        const dateStr = req.body.date;
        // Handle different date formats
        let parsedDate;

        if (dateStr.includes(",")) {
          // Format like "April 30, 2025"
          const parts = dateStr.split(",");
          if (parts.length === 2) {
            const monthDay = parts[0].trim().split(" ");
            const year = parts[1].trim();
            if (monthDay.length === 2) {
              parsedDate = new Date(`${monthDay[0]} ${monthDay[1]}, ${year}`);
            }
          }
        } else {
          // Try standard date parsing
          parsedDate = new Date(dateStr);
        }

        // If we have a valid date, use it
        if (parsedDate && !isNaN(parsedDate.getTime())) {
          updateData.startDate = parsedDate;

          // If time is provided, incorporate it
          if (req.body.time) {
            const timeStr = req.body.time;
            const timeParts = timeStr.match(/([0-9]+):([0-9]+)\s*(AM|PM)?/i);
            if (timeParts) {
              let hours = parseInt(timeParts[1]);
              const minutes = parseInt(timeParts[2]);
              const ampm = timeParts[3] ? timeParts[3].toUpperCase() : null;

              // Convert to 24-hour format if needed
              if (ampm === "PM" && hours < 12) hours += 12;
              if (ampm === "AM" && hours === 12) hours = 0;

              parsedDate.setHours(hours, minutes, 0, 0);
              updateData.startDate = parsedDate;
            }
          }
        }
      } catch (err) {
        console.error("Error parsing date:", err);
        // Don't update startDate if parsing fails
      }
    }

    // Set endDate if provided
    if (req.body.endDate) {
      updateData.endDate = new Date(req.body.endDate);
    } else if (updateData.startDate && !updateData.endDate) {
      // Default to 2 hours after startDate if not provided
      updateData.endDate = new Date(
        updateData.startDate.getTime() + 2 * 60 * 60 * 1000
      );
    }

    // Store the formatted date and time strings for frontend compatibility
    if (updateData.startDate) {
      const month = updateData.startDate.toLocaleString("default", {
        month: "long",
      });
      const day = updateData.startDate.getDate();
      const year = updateData.startDate.getFullYear();
      updateData.date = `${month} ${day}, ${year}`;

      updateData.time = updateData.startDate.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      });
    }

    // Handle image properly
    if (updateData.image) {
      // If image is an object with an id, use the id as a reference
      if (typeof updateData.image === "object" && updateData.image.id) {
        updateData.image = updateData.image.id;
        console.log("Using image reference ID:", updateData.image);
      } else if (
        typeof updateData.image === "string" &&
        updateData.image.match(/^[0-9a-fA-F]{24}$/)
      ) {
        // If image is already a valid MongoDB ID string, keep it
        console.log("Using existing image ID:", updateData.image);
      } else {
        // If it's not a valid reference, remove it to avoid errors
        console.log("Invalid image reference, removing from update");
        delete updateData.image;
      }
    } else if (updateData.imageUrl && !updateData.image) {
      // If only imageUrl is provided, keep it for backward compatibility
      console.log("Using imageUrl:", updateData.imageUrl);
    }

    // Remove MongoDB-specific fields that might cause issues
    delete updateData._id;
    delete updateData.__v;
    delete updateData.createdAt;

    console.log("Final update data:", updateData);

    const event = await models.Event.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate("image");

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    // Format for response
    const formattedEvent = formatResponse(event);
    console.log("Successfully updated event:", formattedEvent.title);

    res.json(formattedEvent);
  } catch (error) {
    console.error("Error updating event:", error);
    res.status(500).json({ error: "Failed to update event" });
  }
});

// Delete an event
router.delete("/events/:id", authMiddleware, async (req, res) => {
  try {
    console.log(`Deleting event with ID: ${req.params.id}`);

    const event = await models.Event.findByIdAndDelete(req.params.id);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    console.log("Successfully deleted event:", event.title);
    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({ error: "Failed to delete event" });
  }
});

// Get all leaders
router.get("/leaders", async (req, res) => {
  try {
    const leaders = await models.Leader.find()
      .populate("image")
      .sort({ order: 1 });

    // Format leaders for frontend compatibility
    const formattedLeaders = formatResponse(leaders);

    res.json(formattedLeaders);
  } catch (error) {
    console.error("Error fetching leaders:", error);
    res.status(500).json({ error: "Failed to fetch leaders" });
  }
});

// Create a new leader
router.post("/leaders", authMiddleware, async (req, res) => {
  try {
    console.log("Received leader creation request:", req.body);

    // Create a new leader from the request body
    const leaderData = {
      ...req.body,
      // Set default values if not provided
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // If imageUrl is provided but no image object, use the imageUrl
    if (req.body.imageUrl && !req.body.image) {
      leaderData.imageUrl = req.body.imageUrl;
    }

    // Create and save the new leader
    const leader = new models.Leader(leaderData);
    const savedLeader = await leader.save();

    // Format for response
    const formattedLeader = formatResponse(savedLeader);

    console.log("Successfully created leader:", formattedLeader.name);

    res.status(201).json(formattedLeader);
  } catch (error) {
    console.error("Error creating leader:", error);
    res.status(500).json({ error: "Failed to create leader" });
  }
});

// Update a leader
router.put("/leaders/:id", authMiddleware, async (req, res) => {
  try {
    const leader = await models.Leader.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true }
    ).populate("image");

    if (!leader) {
      return res.status(404).json({ error: "Leader not found" });
    }

    // Format for response
    const formattedLeader = formatResponse(leader);

    res.json(formattedLeader);
  } catch (error) {
    console.error("Error updating leader:", error);
    res.status(500).json({ error: "Failed to update leader" });
  }
});

// Delete a leader
router.delete("/leaders/:id", authMiddleware, async (req, res) => {
  try {
    const leader = await models.Leader.findByIdAndDelete(req.params.id);
    if (!leader) {
      return res.status(404).json({ error: "Leader not found" });
    }
    res.json({ message: "Leader deleted successfully" });
  } catch (error) {
    console.error("Error deleting leader:", error);
    res.status(500).json({ error: "Failed to delete leader" });
  }
});

// Get all sermons
router.get("/sermons", async (req, res) => {
  try {
    const sermons = await models.Sermon.find()
      .populate("image")
      .sort({ date: -1 });

    // Log the raw sermon data for debugging
    console.log("Raw sermon data from database:");
    sermons.forEach((sermon, index) => {
      console.log(`Sermon ${index + 1}: "${sermon.title}"`);
      console.log(`  - Date in DB: ${sermon.date}`);
      console.log(`  - Date type: ${typeof sermon.date}`);
      console.log(`  - Is Date object: ${sermon.date instanceof Date}`);
    });

    // Format sermons for frontend compatibility
    const formattedSermons = formatResponse(sermons);

    // Log the formatted sermon data for debugging
    console.log("Formatted sermon data after processing:");
    formattedSermons.forEach((sermon, index) => {
      console.log(`Sermon ${index + 1}: "${sermon.title}"`);
      console.log(`  - Formatted date: ${sermon.date}`);
      console.log(`  - Date type: ${typeof sermon.date}`);
    });

    res.json(formattedSermons);
  } catch (error) {
    console.error("Error fetching sermons:", error);
    res.status(500).json({ error: "Failed to fetch sermons" });
  }
});

// Get a single sermon by ID
router.get("/sermons/:id", async (req, res) => {
  try {
    const sermon = await models.Sermon.findById(req.params.id).populate(
      "image"
    );

    if (!sermon) {
      return res.status(404).json({ error: "Sermon not found" });
    }

    // Log the raw sermon data for debugging
    console.log("Raw single sermon data from database:");
    console.log(`Sermon: "${sermon.title}"`);
    console.log(`  - Date in DB: ${sermon.date}`);
    console.log(`  - Date type: ${typeof sermon.date}`);
    console.log(`  - Is Date object: ${sermon.date instanceof Date}`);

    // Format sermon for frontend compatibility
    const formattedSermon = formatResponse(sermon);

    // Log the formatted sermon data for debugging
    console.log("Formatted single sermon data after processing:");
    console.log(`Sermon: "${formattedSermon.title}"`);
    console.log(`  - Formatted date: ${formattedSermon.date}`);
    console.log(`  - Date type: ${typeof formattedSermon.date}`);

    res.json(formattedSermon);
  } catch (error) {
    console.error("Error fetching sermon:", error);
    res.status(500).json({ error: "Failed to fetch sermon" });
  }
});

// Create a new sermon
router.post("/sermons", authMiddleware, async (req, res) => {
  try {
    console.log("Received sermon creation request:", req.body);

    // Create a new sermon from the request body
    const sermonData = {
      ...req.body,
      // Parse date string to Date object if needed
      date: req.body.date ? new Date(req.body.date) : new Date(),
      // Set default values if not provided
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // If imageUrl is provided but no image object, use the imageUrl
    if (req.body.imageUrl && !req.body.image) {
      sermonData.imageUrl = req.body.imageUrl;
    }

    // Create and save the new sermon
    const sermon = new models.Sermon(sermonData);
    const savedSermon = await sermon.save();

    // Format for response
    const formattedSermon = formatResponse(savedSermon);

    console.log("Successfully created sermon:", formattedSermon.title);

    res.status(201).json(formattedSermon);
  } catch (error) {
    console.error("Error creating sermon:", error);
    res.status(500).json({ error: "Failed to create sermon" });
  }
});

// Update a sermon
router.put("/sermons/:id", authMiddleware, async (req, res) => {
  try {
    // Parse date string to Date object if needed
    const updateData = { ...req.body, updatedAt: new Date() };
    if (updateData.date) {
      updateData.date = new Date(updateData.date);
    }

    const sermon = await models.Sermon.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate("image");

    if (!sermon) {
      return res.status(404).json({ error: "Sermon not found" });
    }

    // Format for response
    const formattedSermon = formatResponse(sermon);

    res.json(formattedSermon);
  } catch (error) {
    console.error("Error updating sermon:", error);
    res.status(500).json({ error: "Failed to update sermon" });
  }
});

// Delete a sermon
router.delete("/sermons/:id", authMiddleware, async (req, res) => {
  try {
    const sermon = await models.Sermon.findByIdAndDelete(req.params.id);
    if (!sermon) {
      return res.status(404).json({ error: "Sermon not found" });
    }
    res.json({ message: "Sermon deleted successfully" });
  } catch (error) {
    console.error("Error deleting sermon:", error);
    res.status(500).json({ error: "Failed to delete sermon" });
  }
});

// Get all cell groups
router.get("/cell-groups", async (req, res) => {
  try {
    const cellGroups = await models.CellGroup.find()
      .populate("image")
      .populate("leaderImage")
      .populate("zone")
      .sort({ name: 1 });

    // Format cell groups for frontend compatibility
    const formattedCellGroups = formatResponse(cellGroups);

    res.json(formattedCellGroups);
  } catch (error) {
    console.error("Error fetching cell groups:", error);
    res.status(500).json({ error: "Failed to fetch cell groups" });
  }
});

// Get a single cell group by ID
router.get("/cell-groups/:id", async (req, res) => {
  try {
    const cellGroup = await models.CellGroup.findById(req.params.id)
      .populate("image")
      .populate("leaderImage")
      .populate("zone");

    if (!cellGroup) {
      return res.status(404).json({ error: "Cell group not found" });
    }

    // Format cell group for frontend compatibility
    const formattedCellGroup = formatResponse(cellGroup);

    res.json(formattedCellGroup);
  } catch (error) {
    console.error("Error fetching cell group:", error);
    res.status(500).json({ error: "Failed to fetch cell group" });
  }
});

// Create a new cell group (admin only)
router.post("/cell-groups", authMiddleware, async (req, res) => {
  try {
    console.log("Received cell group creation request:", req.body);

    // Create a new cell group from the request body
    const cellGroupData = {
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Create and save the new cell group
    const cellGroup = new models.CellGroup(cellGroupData);
    const savedCellGroup = await cellGroup.save();

    // Format for response
    const formattedCellGroup = formatResponse(savedCellGroup);

    console.log("Successfully created cell group:", formattedCellGroup.name);

    res.status(201).json(formattedCellGroup);
  } catch (error) {
    console.error("Error creating cell group:", error);
    res.status(500).json({ error: "Failed to create cell group" });
  }
});

// Update a cell group (admin only)
router.put("/cell-groups/:id", authMiddleware, async (req, res) => {
  try {
    const updateData = { ...req.body, updatedAt: new Date() };

    // Remove MongoDB-specific fields that might cause issues
    delete updateData._id;
    delete updateData.__v;
    delete updateData.createdAt;

    const cellGroup = await models.CellGroup.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    )
      .populate("image")
      .populate("leaderImage")
      .populate("zone");

    if (!cellGroup) {
      return res.status(404).json({ error: "Cell group not found" });
    }

    // Format for response
    const formattedCellGroup = formatResponse(cellGroup);

    res.json(formattedCellGroup);
  } catch (error) {
    console.error("Error updating cell group:", error);
    res.status(500).json({ error: "Failed to update cell group" });
  }
});

// Delete a cell group (admin only)
router.delete("/cell-groups/:id", authMiddleware, async (req, res) => {
  try {
    // Check if there are any join requests for this cell group
    const joinRequestCount = await models.CellGroupJoinRequest.countDocuments({
      cellGroup: req.params.id,
    });

    if (joinRequestCount > 0) {
      // Delete all join requests for this cell group
      await models.CellGroupJoinRequest.deleteMany({
        cellGroup: req.params.id,
      });
      console.log(
        `Deleted ${joinRequestCount} join requests for cell group ${req.params.id}`
      );
    }

    const cellGroup = await models.CellGroup.findByIdAndDelete(req.params.id);
    if (!cellGroup) {
      return res.status(404).json({ error: "Cell group not found" });
    }
    res.json({ message: "Cell group deleted successfully" });
  } catch (error) {
    console.error("Error deleting cell group:", error);
    res.status(500).json({ error: "Failed to delete cell group" });
  }
});

// MEMBERSHIP RENEWAL ROUTES

// Submit membership renewal
router.post("/membership/renew", async (req, res) => {
  try {
    console.log("Received membership renewal submission:", req.body);

    // Basic validation
    if (
      !req.body.fullName ||
      !req.body.email ||
      !req.body.phone ||
      !req.body.birthday ||
      !req.body.memberSince
    ) {
      console.error("Invalid renewal submission - missing required fields");
      return res.status(400).json({
        success: false,
        error: "Missing required fields. Please fill out all required fields.",
      });
    }

    // Parse birthday from string to Date object if needed
    let formData = { ...req.body };
    if (formData.birthday && typeof formData.birthday === "string") {
      formData.birthday = new Date(formData.birthday);
    }

    // Create and save the renewal record
    const memberRenewal = new models.MemberRenewal({
      ...formData,
      renewalDate: new Date(),
    });

    const savedRenewal = await memberRenewal.save();
    console.log("Membership renewal saved successfully:", savedRenewal._id);

    // Format for response
    const formattedRenewal = formatResponse(savedRenewal);

    // Send confirmation emails
    try {
      await emailService.sendMembershipRenewalEmails(savedRenewal);
      console.log("Renewal emails sent successfully");
    } catch (emailErr) {
      console.error("Error sending renewal emails:", emailErr);
      // Continue with success response even if emails fail
    }

    const response = {
      success: true,
      message: "Membership renewal submitted successfully",
      data: formattedRenewal,
    };

    console.log(
      "Sending success response:",
      JSON.stringify(response).substring(0, 100) + "..."
    );
    res.status(201).json(response);
  } catch (error) {
    console.error("Error processing membership renewal:", error);
    res.status(500).json({
      success: false,
      error: "Failed to submit membership renewal. Please try again later.",
    });
  }
});

// Get all membership renewals (admin access only)
router.get("/membership/renewals", authMiddleware, async (req, res) => {
  try {
    const renewals = await models.MemberRenewal.find().sort({
      renewalDate: -1,
    });

    // Format renewals for frontend compatibility
    const formattedRenewals = formatResponse(renewals);

    res.json(formattedRenewals);
  } catch (error) {
    console.error("Error fetching membership renewals:", error);
    res.status(500).json({ error: "Failed to fetch membership renewals" });
  }
});

// Update a membership renewal status (admin access only)
router.put("/membership/renewals/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    console.log(`Updating membership renewal ${id} status to: ${status}`);

    // Validate status value
    if (!status || !["pending", "approved", "declined"].includes(status)) {
      return res.status(400).json({
        success: false,
        error:
          "Invalid status value. Must be 'pending', 'approved', or 'declined'.",
      });
    }

    const renewal = await models.MemberRenewal.findByIdAndUpdate(
      id,
      { status, updatedAt: new Date() },
      { new: true }
    );

    if (!renewal) {
      return res.status(404).json({
        success: false,
        error: "Membership renewal not found",
      });
    }

    // Format for response
    const formattedRenewal = formatResponse(renewal);

    // If approved, send a notification email to the member
    if (status === "approved") {
      try {
        await emailService.sendMembershipApprovalEmail(renewal);
        console.log("Membership approval email sent successfully");
      } catch (emailErr) {
        console.error("Error sending approval email:", emailErr);
        // Continue with success response even if email fails
      }
    }

    res.json({
      success: true,
      message: `Membership renewal ${status}`,
      data: formattedRenewal,
    });
  } catch (error) {
    console.error("Error updating membership renewal:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update membership renewal status",
    });
  }
});

// Delete a membership renewal (admin access only)
router.delete("/membership/renewals/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Deleting membership renewal ${id}`);

    const renewal = await models.MemberRenewal.findByIdAndDelete(id);

    if (!renewal) {
      return res.status(404).json({
        success: false,
        error: "Membership renewal not found",
      });
    }

    res.json({
      success: true,
      message: "Membership renewal deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting membership renewal:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete membership renewal",
    });
  }
});

// FOUNDATION CLASSES ROUTES

// Submit foundation classes registration
router.post(
  "/foundation-classes/register",
  authMiddleware,
  async (req, res) => {
    try {
      console.log("Received foundation classes registration:", req.body);

      // Create and save the registration record
      const registration = new models.FoundationClassRegistration({
        ...req.body,
        registrationDate: new Date(),
      });

      const savedRegistration = await registration.save();
      console.log(
        "Foundation classes registration saved successfully:",
        savedRegistration._id
      );

      // Format for response
      const formattedRegistration = formatResponse(savedRegistration);

      // Send confirmation emails
      emailService
        .sendFoundationClassRegistrationEmails(savedRegistration)
        .then(() => console.log("Registration emails sent successfully"))
        .catch((err) =>
          console.error("Error sending registration emails:", err)
        );

      res.status(201).json({
        success: true,
        message: "Foundation classes registration submitted successfully",
        data: formattedRegistration,
      });
    } catch (error) {
      console.error("Error processing foundation classes registration:", error);
      res.status(500).json({
        success: false,
        error: "Failed to submit registration. Please try again later.",
      });
    }
  }
);

// Get all foundation classes registrations (admin access only)
router.get(
  "/foundation-classes/registrations",
  authMiddleware,
  async (req, res) => {
    try {
      const registrations =
        await models.FoundationClassRegistration.find().sort({
          registrationDate: -1,
        });

      // Format registrations for frontend compatibility
      const formattedRegistrations = formatResponse(registrations);

      res.json(formattedRegistrations);
    } catch (error) {
      console.error("Error fetching foundation classes registrations:", error);
      res.status(500).json({ error: "Failed to fetch registrations" });
    }
  }
);

// Update a foundation class registration status (admin access only)
router.put(
  "/foundation-classes/registrations/:id",
  authMiddleware,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      console.log(
        `Updating foundation class registration ${id} status to: ${status}`
      );

      // Validate status value
      if (
        !status ||
        !["registered", "attending", "completed", "cancelled"].includes(status)
      ) {
        return res.status(400).json({
          success: false,
          error:
            "Invalid status value. Must be 'registered', 'attending', 'completed', or 'cancelled'.",
        });
      }

      const registration =
        await models.FoundationClassRegistration.findByIdAndUpdate(
          id,
          { status, updatedAt: new Date() },
          { new: true }
        );

      if (!registration) {
        return res.status(404).json({
          success: false,
          error: "Foundation class registration not found",
        });
      }

      // Format for response
      const formattedRegistration = formatResponse(registration);

      // Send notification based on status change
      try {
        if (status === "completed") {
          // Use the foundation class completion email for new members
          await emailService.sendFoundationClassCompletionEmail(registration);
          console.log("Sent foundation class completion email to new member");
        }
      } catch (emailErr) {
        console.error("Error sending status update email:", emailErr);
        // Continue with success response even if email fails
      }

      res.json({
        success: true,
        message: `Foundation class registration status updated to ${status}`,
        data: formattedRegistration,
      });
    } catch (error) {
      console.error(
        "Error updating foundation class registration status:",
        error
      );
      res.status(500).json({
        success: false,
        error: "Failed to update registration status. Please try again.",
      });
    }
  }
);

// Delete a foundation class registration (admin access only)
router.delete(
  "/foundation-classes/registrations/:id",
  authMiddleware,
  async (req, res) => {
    try {
      const { id } = req.params;
      console.log(`Deleting foundation class registration ${id}`);

      const registration =
        await models.FoundationClassRegistration.findByIdAndDelete(id);

      if (!registration) {
        return res.status(404).json({
          success: false,
          error: "Foundation class registration not found",
        });
      }

      res.json({
        success: true,
        message: "Foundation class registration deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting foundation class registration:", error);
      res.status(500).json({
        success: false,
        error: "Failed to delete foundation class registration",
      });
    }
  }
);

module.exports = router;
