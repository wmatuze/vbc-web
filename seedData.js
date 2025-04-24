const models = require("./models");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

// Hash password
const hashPassword = (password) => {
  return crypto.createHash("sha256").update(password).digest("hex");
};

// Seed users
const seedUsers = async () => {
  try {
    // Check if admin user already exists
    const adminExists = await models.User.findOne({ username: "admin" });

    if (!adminExists) {
      console.log("Seeding admin user...");

      // Create admin user
      const admin = new models.User({
        username: "admin",
        hashedPassword: hashPassword("admin123"),
        name: "Admin User",
        role: "admin",
        email: "admin@example.com",
      });

      await admin.save();
      console.log("Admin user created successfully");
    } else {
      console.log("Admin user already exists, skipping...");
    }
  } catch (error) {
    console.error("Error seeding users:", error);
  }
};

// Hardcoded zone data
const zonesData = [
  {
    id: "zone1",
    name: "Central Zone",
    description:
      "Covering the central areas of Kitwe including CBD and surrounding neighborhoods.",
    elder: {
      name: "Elder James Mwanza",
      title: "Zone Elder",
      image: "/assets/elders/elder1.jpg",
      bio: "Serving as an elder for 8 years, James has a passion for discipleship and community building.",
      contact: "james.mwanza@example.com",
      phone: "+260 97 1234567",
    },
    location: "Kitwe Central",
    iconName: "FaUsers",
    cellCount: 5,
    coverImage: "/assets/zones/central-zone.jpg",
  },
  {
    id: "zone2",
    name: "Northern Zone",
    description:
      "Serving the northern communities of Kitwe including Riverside and Parklands areas.",
    elder: {
      name: "Elder Sarah Banda",
      title: "Zone Elder",
      image: "/assets/elders/elder2.jpg",
      bio: "With a background in counseling, Sarah leads the Northern Zone with compassion and wisdom.",
      contact: "sarah.banda@example.com",
      phone: "+260 97 7654321",
    },
    location: "Kitwe North",
    iconName: "FaHome",
    cellCount: 4,
    coverImage: "/assets/zones/northern-zone.jpg",
  },
  {
    id: "zone3",
    name: "Eastern Zone",
    description:
      "Covering the eastern regions of Kitwe including Chamboli and Chimwemwe areas.",
    elder: {
      name: "Elder David Mutale",
      title: "Zone Elder",
      image: "/assets/elders/elder3.jpg",
      bio: "David has been serving in church leadership for over a decade with a focus on family ministry.",
      contact: "david.mutale@example.com",
      phone: "+260 96 8765432",
    },
    location: "Kitwe East",
    iconName: "FaHeart",
    cellCount: 6,
    coverImage: "/assets/zones/eastern-zone.jpg",
  },
];

// Hardcoded cell group data
const cellGroupsData = [
  {
    id: 1,
    name: "Faith Builders",
    zoneId: "zone1",
    description:
      "A welcoming group focused on building faith through Bible study and prayer.",
    leader: "John Mulenga",
    leaderBio:
      "John has been leading cell groups for 5 years and has a passion for teaching the Word.",
    leaderContact: "john.mulenga@example.com",
    location: "Kitwe Central",
    coordinates: { lat: -12.809, lng: 28.213 },
    meetingDay: "Wednesday",
    meetingTime: "6:30 PM",
    capacity: "10-15 people",
    tags: ["Bible Study", "Prayer", "Families"],
    imageUrl: "/assets/cell-groups/cell-group-1.jpg",
  },
  {
    id: 2,
    name: "Grace Fellowship",
    zoneId: "zone1",
    description:
      "A group dedicated to experiencing God's grace through fellowship and worship.",
    leader: "Mary Banda",
    leaderBio:
      "Mary loves creating a welcoming atmosphere where people can grow together.",
    leaderContact: "mary.banda@example.com",
    location: "Kitwe Central",
    coordinates: { lat: -12.815, lng: 28.219 },
    meetingDay: "Thursday",
    meetingTime: "7:00 PM",
    capacity: "8-12 people",
    tags: ["Worship", "Fellowship", "Young Adults"],
    imageUrl: "/assets/cell-groups/cell-group-2.jpg",
  },
  {
    id: 3,
    name: "New Believers",
    zoneId: "zone1",
    description:
      "A supportive group for those new to the faith, focusing on foundational teachings.",
    leader: "Peter Chanda",
    leaderBio:
      "Peter specializes in helping new believers establish a strong foundation in Christ.",
    leaderContact: "peter.chanda@example.com",
    location: "Kitwe Central",
    coordinates: { lat: -12.805, lng: 28.208 },
    meetingDay: "Tuesday",
    meetingTime: "6:00 PM",
    capacity: "5-10 people",
    tags: ["New Christians", "Bible Basics", "Mentoring"],
    imageUrl: "/assets/cell-groups/cell-group-3.jpg",
  },
];

// Seed zones
const seedZones = async () => {
  try {
    // Check if zones already exist
    const zonesCount = await models.Zone.countDocuments();

    if (zonesCount === 0) {
      console.log("Seeding zones...");

      // Create a map to store the mapping between frontend IDs and MongoDB ObjectIds
      const zoneIdMap = new Map();

      // Create zones from data
      for (const zoneData of zonesData) {
        const zone = new models.Zone({
          // Let MongoDB generate the _id
          name: zoneData.name,
          location: zoneData.location,
          description: zoneData.description,
          elder: {
            name: zoneData.elder.name,
            title: zoneData.elder.title,
            bio: zoneData.elder.bio,
            contact: zoneData.elder.contact,
            phone: zoneData.elder.phone,
          },
          iconName: zoneData.iconName,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        const savedZone = await zone.save();

        // Store the mapping between frontend ID and MongoDB ObjectId
        zoneIdMap.set(zoneData.id, savedZone._id);
      }

      // Store the zone ID mapping in global scope for use in seedCellGroups
      global.zoneIdMap = zoneIdMap;

      console.log("Zones created successfully");
    } else {
      console.log("Zones already exist, skipping...");

      // If zones already exist, create a mapping for existing zones
      const zones = await models.Zone.find();
      const zoneIdMap = new Map();

      // Create a mapping based on zone names
      for (const zone of zones) {
        const frontendZone = zonesData.find((z) => z.name === zone.name);
        if (frontendZone) {
          zoneIdMap.set(frontendZone.id, zone._id);
        }
      }

      global.zoneIdMap = zoneIdMap;
    }
  } catch (error) {
    console.error("Error seeding zones:", error);
  }
};

// Seed cell groups
const seedCellGroups = async () => {
  try {
    // Check if cell groups already exist
    const cellGroupsCount = await models.CellGroup.countDocuments();

    if (cellGroupsCount === 0) {
      console.log("Seeding cell groups...");

      // Make sure we have the zone ID mapping
      if (!global.zoneIdMap || global.zoneIdMap.size === 0) {
        console.log(
          "Zone ID mapping not found. Make sure to run seedZones first."
        );
        return;
      }

      // Create cell groups from data
      for (const cellGroupData of cellGroupsData) {
        // Get the MongoDB ObjectId for this zone
        const zoneId = global.zoneIdMap.get(cellGroupData.zoneId);

        if (!zoneId) {
          console.log(
            `Zone ID ${cellGroupData.zoneId} not found in mapping. Skipping cell group ${cellGroupData.name}.`
          );
          continue;
        }

        const cellGroup = new models.CellGroup({
          name: cellGroupData.name,
          leader: cellGroupData.leader,
          leaderContact: cellGroupData.leaderContact,
          location: cellGroupData.location,
          zone: zoneId, // Use the MongoDB ObjectId from our mapping
          meetingDay: cellGroupData.meetingDay,
          meetingTime: cellGroupData.meetingTime,
          description: cellGroupData.description,
          capacity: cellGroupData.capacity,
          tags: cellGroupData.tags,
          coordinates: cellGroupData.coordinates,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        await cellGroup.save();
      }

      console.log("Cell groups created successfully");
    } else {
      console.log("Cell groups already exist, skipping...");
    }
  } catch (error) {
    console.error("Error seeding cell groups:", error);
  }
};

// Seed all data
const seedAllData = async () => {
  await seedUsers();
  await seedZones();
  await seedCellGroups();
};

module.exports = {
  seedUsers,
  seedZones,
  seedCellGroups,
  seedAllData,
};
