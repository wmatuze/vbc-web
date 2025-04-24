/**
 * Format MongoDB data for frontend compatibility
 * @param {Object|Array} data - Data to format
 * @returns {Object|Array} - Formatted data
 */
const formatResponse = (data) => {
  // If data is an array, map over each item
  if (Array.isArray(data)) {
    return data.map((item) => formatObject(item));
  }

  // If data is a single object
  return formatObject(data);
};

/**
 * Format a single object
 * @param {Object} item - Object to format
 * @returns {Object} - Formatted object
 */
const formatObject = (item) => {
  // If item is null or undefined, return it as is
  if (!item) return item;

  // If item is a Mongoose document, convert to plain object
  const obj = item && item.toObject ? item.toObject() : { ...item };

  // Add id property (frontend expects this)
  if (obj._id) {
    obj.id = obj._id.toString();
  }

  // Determine the object type based on schema or collection
  if (!obj.type && !obj.category) {
    // Try to infer type from the object structure
    if (obj.startDate && obj.title) {
      obj.type = "event";
    } else if (obj.preacher && obj.title) {
      obj.type = "sermon";
    } else if (obj.position && obj.name) {
      obj.type = "leader";
    } else if (obj.meetingDay && obj.meetingTime) {
      obj.type = "cell-group";
    } else if (obj.zoneLeader && obj.zoneName) {
      obj.type = "zone";
    }
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
          obj.imageUrl = "/assets/placeholders/default-sermon.svg";
        } else if (obj.type === "event" || obj.category === "event") {
          obj.imageUrl = "/assets/placeholders/default-event.svg";
        } else if (obj.type === "leader" || obj.category === "leader") {
          obj.imageUrl = "/assets/placeholders/default-leader.svg";
        } else if (obj.type === "cell-group" || obj.category === "cell-group") {
          obj.imageUrl = "/assets/placeholders/default-cell-group.svg";
        } else if (obj.type === "zone" || obj.category === "zone") {
          obj.imageUrl = "/assets/placeholders/default-zone.svg";
        } else {
          obj.imageUrl = "/assets/placeholders/default-image.svg";
        }
      }
    }
  }
  // No image reference but need imageUrl
  else if (!obj.imageUrl) {
    if (obj.type === "sermon" || obj.category === "sermon") {
      obj.imageUrl = "/assets/placeholders/default-sermon.svg";
    } else if (obj.type === "event" || obj.category === "event") {
      obj.imageUrl = "/assets/placeholders/default-event.svg";
    } else if (obj.type === "leader" || obj.category === "leader") {
      obj.imageUrl = "/assets/placeholders/default-leader.svg";
    } else if (obj.type === "cell-group" || obj.category === "cell-group") {
      obj.imageUrl = "/assets/placeholders/default-cell-group.svg";
    } else if (obj.type === "zone" || obj.category === "zone") {
      obj.imageUrl = "/assets/placeholders/default-zone.svg";
    } else {
      obj.imageUrl = "/assets/placeholders/default-image.svg";
    }
  }

  // Handle coverImage/coverImageUrl for zones
  if (obj.coverImage) {
    // If coverImage is a populated object with path
    if (obj.coverImage.path) {
      obj.coverImageUrl = obj.coverImage.path;
    }
    // If coverImage is just an ID reference
    else if (obj.coverImage._id || obj.coverImage.toString) {
      // Keep any existing coverImageUrl or set default
      if (!obj.coverImageUrl) {
        obj.coverImageUrl = "/assets/placeholders/default-zone.svg";
      }
    }
  }
  // No coverImage reference but need coverImageUrl for zones
  else if (
    !obj.coverImageUrl &&
    (obj.type === "zone" || obj.category === "zone")
  ) {
    obj.coverImageUrl = "/assets/placeholders/default-zone.svg";
  }

  // Handle leaderImage/leaderImageUrl for cell groups
  if (obj.leaderImage) {
    // If leaderImage is a populated object with path
    if (obj.leaderImage.path) {
      obj.leaderImageUrl = obj.leaderImage.path;
    }
    // If leaderImage is just an ID reference
    else if (obj.leaderImage._id || obj.leaderImage.toString) {
      // Keep any existing leaderImageUrl or set default
      if (!obj.leaderImageUrl) {
        obj.leaderImageUrl = "/assets/placeholders/default-leader.svg";
      }
    }
  }
  // No leaderImage reference but need leaderImageUrl for cell groups
  else if (
    !obj.leaderImageUrl &&
    (obj.type === "cell-group" || obj.category === "cell-group")
  ) {
    obj.leaderImageUrl = "/assets/placeholders/default-leader.svg";
  }

  // Ensure events have date and time fields for frontend compatibility
  if (obj.type === "event" || (obj.startDate && obj.title)) {
    // Make sure we have a date field (frontend expects this)
    if (obj.startDate && !obj.date) {
      // Format the date as a string in the format the frontend expects
      try {
        const startDate = new Date(obj.startDate);
        if (!isNaN(startDate.getTime())) {
          // Format as "Month Day, Year" (e.g., "April 30, 2025")
          const month = startDate.toLocaleString("default", { month: "long" });
          const day = startDate.getDate();
          const year = startDate.getFullYear();
          obj.date = `${month} ${day}, ${year}`;

          // Also add time field if not present
          if (!obj.time) {
            obj.time = startDate.toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "numeric",
              hour12: true,
            });
          }
        }
      } catch (err) {
        console.error("Error formatting date:", err);
      }
    }

    // Ensure we have a ministry field (even if empty)
    if (!obj.hasOwnProperty("ministry")) {
      obj.ministry = "";
    }
  }

  // Recursively format nested objects
  Object.keys(obj).forEach((key) => {
    if (
      obj[key] &&
      typeof obj[key] === "object" &&
      !Array.isArray(obj[key]) &&
      key !== "_id"
    ) {
      obj[key] = formatObject(obj[key]);
    } else if (Array.isArray(obj[key])) {
      obj[key] = obj[key].map((item) => {
        if (item && typeof item === "object") {
          return formatObject(item);
        }
        return item;
      });
    }
  });

  return obj;
};

module.exports = formatResponse;
