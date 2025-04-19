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
        } else if (obj.type === "zone" || obj.category === "zone") {
          obj.imageUrl = "/assets/zones/default-zone.jpg";
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
    } else if (obj.type === "zone" || obj.category === "zone") {
      obj.imageUrl = "/assets/zones/default-zone.jpg";
    } else {
      obj.imageUrl = "/assets/media/default-image.jpg";
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
        obj.coverImageUrl = "/assets/zones/default-zone.jpg";
      }
    }
  }
  // No coverImage reference but need coverImageUrl for zones
  else if (!obj.coverImageUrl && (obj.type === "zone" || obj.category === "zone")) {
    obj.coverImageUrl = "/assets/zones/default-zone.jpg";
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
        obj.leaderImageUrl = "/assets/leadership/default-leader.jpg";
      }
    }
  }
  // No leaderImage reference but need leaderImageUrl for cell groups
  else if (!obj.leaderImageUrl && (obj.type === "cell-group" || obj.category === "cell-group")) {
    obj.leaderImageUrl = "/assets/leadership/default-leader.jpg";
  }

  // Recursively format nested objects
  Object.keys(obj).forEach((key) => {
    if (obj[key] && typeof obj[key] === "object" && !Array.isArray(obj[key]) && key !== "_id") {
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
