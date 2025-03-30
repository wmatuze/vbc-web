const express = require("express");
const router = express.Router();
const models = require("./models");
const emailService = require("./utils/emailService");
const { authMiddleware } = require("./auth-middleware");

// Helper function to format MongoDB data for frontend compatibility
const formatResponse = (data) => {
  // If data is an array, map over each item
  if (Array.isArray(data)) {
    return data.map((item) => formatObject(item));
  }

  // If data is a single object
  return formatObject(data);
};

// Helper to format a single object
const formatObject = (item) => {
  // If item is a Mongoose document, convert to plain object
  const obj = item && item.toObject ? item.toObject() : { ...item };

  // Add id property (frontend expects this)
  if (obj._id) {
    obj.id = obj._id.toString();
  }

  // Handle image/imageUrl
  if (obj.image) {
    // If image is a populated object with path
    if (obj.image.path) {
      obj.imageUrl = obj.image.path;
    }
    // If image is just an ID reference
    else if (obj.image._id || obj.image.toString) {
      // Keep any existing imageUrl or set default based on type
      if (!obj.imageUrl) {
        if (obj.type === "sermon" || obj.category === "sermon") {
          obj.imageUrl = "/assets/sermons/default-sermon.jpg";
        } else if (obj.type === "event" || obj.category === "event") {
          obj.imageUrl = "/assets/events/default-event.jpg";
        } else if (obj.type === "leader" || obj.category === "leader") {
          obj.imageUrl = "/assets/leadership/default-leader.jpg";
        } else if (obj.type === "cell-group" || obj.category === "cell-group") {
          obj.imageUrl = "/assets/cell-groups/default-cell-group.jpg";
        } else {
          obj.imageUrl = "/assets/media/default-image.jpg";
        }
      }
    }
  }
  // No image reference but need imageUrl
  else if (!obj.imageUrl) {
    if (obj.type === "sermon" || obj.category === "sermon") {
      obj.imageUrl = "/assets/sermons/default-sermon.jpg";
    } else if (obj.type === "event" || obj.category === "event") {
      obj.imageUrl = "/assets/events/default-event.jpg";
    } else if (obj.type === "leader" || obj.category === "leader") {
      obj.imageUrl = "/assets/leadership/default-leader.jpg";
    } else if (obj.type === "cell-group" || obj.category === "cell-group") {
      obj.imageUrl = "/assets/cell-groups/default-cell-group.jpg";
    } else {
      obj.imageUrl = "/assets/media/default-image.jpg";
    }
  }

  return obj;
};

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

    // Format sermons for frontend compatibility
    const formattedSermons = formatResponse(sermons);

    res.json(formattedSermons);
  } catch (error) {
    console.error("Error fetching sermons:", error);
    res.status(500).json({ error: "Failed to fetch sermons" });
  }
});

// Get a single sermon by ID
router.get("/sermons/:id", async (req, res) => {
  try {
    const sermon = await models.Sermon.findById(req.params.id).populate("image");
    
    if (!sermon) {
      return res.status(404).json({ error: "Sermon not found" });
    }

    // Format sermon for frontend compatibility
    const formattedSermon = formatResponse(sermon);
    
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
      updatedAt: new Date()
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
      .sort({ name: 1 });

    // Format cell groups for frontend compatibility
    const formattedCellGroups = formatResponse(cellGroups);

    res.json(formattedCellGroups);
  } catch (error) {
    console.error("Error fetching cell groups:", error);
    res.status(500).json({ error: "Failed to fetch cell groups" });
  }
});

// MEMBERSHIP RENEWAL ROUTES

// Submit membership renewal
router.post("/membership/renew", async (req, res) => {
  try {
    console.log("Received membership renewal submission:", req.body);

    // Basic validation
    if (!req.body.fullName || !req.body.email || !req.body.phone || !req.body.birthday || !req.body.memberSince) {
      console.error("Invalid renewal submission - missing required fields");
      return res.status(400).json({
        success: false,
        error: "Missing required fields. Please fill out all required fields."
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

    console.log("Sending success response:", JSON.stringify(response).substring(0, 100) + "...");
    res.status(201).json(response);
  } catch (error) {
    console.error("Error processing membership renewal:", error);
    res.status(500).json({
      success: false,
      error: "Failed to submit membership renewal. Please try again later."
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
    if (!status || !['pending', 'approved', 'declined'].includes(status)) {
      return res.status(400).json({ 
        success: false, 
        error: "Invalid status value. Must be 'pending', 'approved', or 'declined'." 
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
        error: "Membership renewal not found" 
      });
    }
    
    // Format for response
    const formattedRenewal = formatResponse(renewal);
    
    // If approved, send a notification email to the member
    if (status === 'approved') {
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
      data: formattedRenewal
    });
  } catch (error) {
    console.error("Error updating membership renewal:", error);
    res.status(500).json({ 
      success: false, 
      error: "Failed to update membership renewal status" 
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

module.exports = router;
