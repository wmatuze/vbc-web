// API service for fetching data from JSON Server
import config from "../config";

const API_URL = config.API_URL;

// Get the authentication token from localStorage
const getAuthToken = () => {
  const auth = localStorage.getItem("auth");

  // If we're in development mode and there's no auth token, create a default one
  if (
    !auth &&
    (process.env.NODE_ENV === "development" ||
      window.location.hostname === "localhost")
  ) {
    console.log("Creating default development auth token");
    const defaultAuth = {
      isAuthenticated: true,
      token: "dev-token-for-testing",
      user: { username: "admin", role: "admin" },
    };
    localStorage.setItem("auth", JSON.stringify(defaultAuth));
    return defaultAuth.token;
  }

  return auth ? JSON.parse(auth).token : null;
};

// Add auth headers to requests if user is authenticated
const getAuthHeaders = () => {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Generic fetch function with error handling
const fetchData = async (endpoint) => {
  try {
    const response = await fetch(`${API_URL}/${endpoint}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    throw error;
  }
};

// Generic post function for creating new items
const postData = async (endpoint, data) => {
  try {
    const response = await fetch(`${API_URL}/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error posting to ${endpoint}:`, error);
    throw error;
  }
};

// Generic update function
const updateData = async (endpoint, id, data) => {
  console.log(`Updating ${endpoint}/${id} with data:`, data);

  try {
    // Remove MongoDB-specific fields that might cause issues
    const cleanData = { ...data };
    delete cleanData._id;
    delete cleanData.__v;
    delete cleanData.createdAt;
    delete cleanData.updatedAt;

    // Create URL with the format that worked in your curl test
    const apiUrl = `${API_URL}/${endpoint}/${id}`;
    console.log(`Making API PUT request to: ${apiUrl}`);

    const response = await fetch(apiUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify(cleanData),
    });

    console.log(`Update response status: ${response.status}`);

    if (!response.ok) {
      let errorMessage;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || `API error: ${response.status}`;
      } catch (e) {
        errorMessage = `API error: ${response.status}`;
      }
      console.error(`Error response:`, errorMessage);
      throw new Error(errorMessage);
    }

    const responseData = await response.json();
    console.log(`Updated successfully:`, responseData);
    return responseData;
  } catch (error) {
    console.error(`Error updating:`, error);
    throw error;
  }
};

// Generic delete function
const deleteData = async (endpoint, id) => {
  console.log(`Deleting ${endpoint}/${id}`);

  try {
    // Create URL with format that worked in curl test
    const apiUrl = `${API_URL}/${endpoint}/${id}`;
    console.log(`Making API DELETE request to: ${apiUrl}`);

    const response = await fetch(apiUrl, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    console.log(`Delete response status: ${response.status}`);

    if (!response.ok) {
      let errorMessage;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || `API error: ${response.status}`;
      } catch (e) {
        errorMessage = `API error: ${response.status}`;
      }
      console.error(`Error response:`, errorMessage);
      throw new Error(errorMessage);
    }

    const responseData = await response.json();
    console.log(`Deleted successfully`);
    return responseData;
  } catch (error) {
    console.error(`Error deleting:`, error);
    throw error;
  }
};

// Upload a file using FormData
export const uploadFile = async (file, title, category, onProgress) => {
  try {
    console.log("Uploading file:", file.name, "to", `${API_URL}/api/upload`);
    console.log("File size:", file.size, "bytes");
    console.log("File type:", file.type);

    // Validate file type - server accepts only images
    if (!file.type.match(/^image\//)) {
      throw new Error("Only image files are allowed (jpg, png, gif)");
    }

    // Check file size - limit to 5MB like the server
    if (file.size > 5 * 1024 * 1024) {
      throw new Error("File is too large. Maximum size allowed is 5MB");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title || file.name.split(".")[0]);
    formData.append("category", category || "general");

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      // Setup progress monitoring
      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable && onProgress) {
          const progressPercent = Math.round(
            (event.loaded / event.total) * 100
          );
          onProgress({
            loaded: event.loaded,
            total: event.total,
            percent: progressPercent,
          });
          console.log(`Upload progress: ${progressPercent}%`);
        }
      });

      xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            console.log("Raw server response:", xhr.responseText);
            const response = JSON.parse(xhr.responseText);

            // Make sure we have a valid path before using it
            if (!response.path) {
              console.error("Server response missing path property:", response);
              reject(
                new Error("Server response missing required path property")
              );
              return;
            }

            // Make sure the fileUrl is a full URL
            response.fileUrl = response.path.startsWith("http")
              ? response.path
              : `${API_URL}${response.path}`;
            response.thumbnailUrl = response.path.startsWith("http")
              ? response.path
              : `${API_URL}${response.path}`;

            console.log("Upload successful, response:", response);
            resolve(response);
          } catch (error) {
            console.error("Error parsing server response:", error);
            reject(
              new Error(`Error parsing server response: ${error.message}`)
            );
          }
        } else {
          let errorMessage = "Unknown error occurred during upload";

          try {
            // Try to extract error message from response
            const errorResponse = JSON.parse(xhr.responseText);
            errorMessage = errorResponse.error || errorMessage;
          } catch (e) {
            // Use the raw response text if parsing fails
            errorMessage = xhr.responseText || errorMessage;
          }

          console.error("Upload failed with status:", xhr.status, errorMessage);
          reject(new Error(`Upload failed (${xhr.status}): ${errorMessage}`));
        }
      };

      xhr.onerror = function (error) {
        console.error("Network error during upload:", error);
        reject(
          new Error(
            "Network error during upload. Please check your connection."
          )
        );
      };

      xhr.ontimeout = function () {
        console.error("Upload request timed out");
        reject(
          new Error(
            "Upload request timed out. The server may be busy or unavailable."
          )
        );
      };

      xhr.open("POST", `${API_URL}/api/upload`, true);

      // Include auth token if available
      const token = getAuthToken();
      if (token) {
        xhr.setRequestHeader("Authorization", `Bearer ${token}`);
      }

      // Important: Do NOT set Content-Type header when using FormData
      // The browser automatically sets the correct multipart/form-data with boundary

      // Set timeout for the request (30 seconds)
      xhr.timeout = 30000;

      xhr.send(formData);
    });
  } catch (error) {
    console.error("Error in uploadFile:", error);
    throw error;
  }
};

// Specific API functions for each content type

// Foundation Classes
export const registerForFoundationClass = (formData) => {
  return postData("api/foundation-classes/register", formData);
};

// Sermons
export const getSermons = () => fetchData("api/sermons");
export const getSermonById = (id) => fetchData(`api/sermons/${id}`);
export const createSermon = (sermon) => {
  console.log("Creating sermon with data:", JSON.stringify(sermon, null, 2));
  return postData("api/sermons", sermon);
};
export const updateSermon = (id, sermon) =>
  updateData("api/sermons", id, sermon);
export const deleteSermon = (id) => deleteData("api/sermons", id);

export const getEvents = () => {
  console.log("Calling getEvents API");
  return fetchData("api/events")
    .then((data) => {
      console.log("Events API response:", data);
      return data;
    })
    .catch((error) => {
      console.error("Error fetching events:", error);
      throw error;
    });
};
export const getEventById = (id) => fetchData(`api/events/${id}`);
export const createEvent = (event) => {
  console.log("Creating event with data:", JSON.stringify(event, null, 2));
  return postData("api/events", event);
};
export const updateEvent = (id, event) => {
  // If id is an object (like a full event), extract the ID
  const eventId = typeof id === "object" ? id._id || id.id : id;

  if (!eventId) {
    console.error("Missing event ID for update");
    throw new Error("Cannot update: Invalid event ID");
  }

  // Clean the data before sending
  const cleanEvent = { ...event };
  delete cleanEvent._id;
  delete cleanEvent.__v;
  delete cleanEvent.createdAt;
  delete cleanEvent.updatedAt;
  delete cleanEvent.id; // Remove id to avoid conflicts with MongoDB _id

  // Ensure dates are properly formatted
  if (cleanEvent.startDate instanceof Date) {
    // Keep the Date object as is - the server will handle it
    console.log(`Using Date object for startDate: ${cleanEvent.startDate}`);
  } else if (typeof cleanEvent.startDate === "string") {
    try {
      // Try to parse the string into a Date object
      const parsedDate = new Date(cleanEvent.startDate);
      if (!isNaN(parsedDate.getTime())) {
        cleanEvent.startDate = parsedDate;
        console.log(
          `Parsed startDate string into Date: ${cleanEvent.startDate}`
        );
      }
    } catch (err) {
      console.error("Error parsing startDate string:", err);
    }
  }

  // Same for endDate
  if (cleanEvent.endDate instanceof Date) {
    console.log(`Using Date object for endDate: ${cleanEvent.endDate}`);
  } else if (typeof cleanEvent.endDate === "string") {
    try {
      const parsedDate = new Date(cleanEvent.endDate);
      if (!isNaN(parsedDate.getTime())) {
        cleanEvent.endDate = parsedDate;
        console.log(`Parsed endDate string into Date: ${cleanEvent.endDate}`);
      }
    } catch (err) {
      console.error("Error parsing endDate string:", err);
    }
  }

  // Ensure time field is preserved
  if (cleanEvent.time) {
    console.log(`Preserving time field in API call: ${cleanEvent.time}`);
  } else {
    console.warn("Time field is missing in update data");
  }

  // Ensure type is set
  if (!cleanEvent.type) {
    cleanEvent.type = "event";
  }

  console.log(`Updating event with ID: ${eventId}`);
  console.log("Event data for update:", cleanEvent);
  return updateData("api/events", eventId, cleanEvent);
};
export const deleteEvent = (id) => {
  // If id is an object (like a full event), extract the ID
  const eventId = typeof id === "object" ? id._id || id.id : id;

  if (!eventId) {
    console.error("Missing event ID for deletion");
    throw new Error("Cannot delete: Invalid event ID");
  }

  console.log(`Deleting event with ID: ${eventId}`);
  return deleteData("api/events", eventId);
};

export const getLeaders = () => fetchData("api/leaders");
export const getLeaderById = (id) => fetchData(`api/leaders/${id}`);
export const createLeader = (leader) => {
  console.log("Creating leader with data:", JSON.stringify(leader, null, 2));
  return postData("api/leaders", leader);
};
export const updateLeader = (id, leader) =>
  updateData("api/leaders", id, leader);
export const deleteLeader = (id) => deleteData("api/leaders", id);

// Cell Groups API functions
export const getCellGroups = () => fetchData("api/cell-groups");
export const getCellGroupById = (id) => {
  // Ensure id is a valid string
  const groupId = id?.toString() || id;
  return fetchData(`api/cell-groups/${groupId}`);
};
export const createCellGroup = (group) => postData("api/cell-groups", group);
export const updateCellGroup = (id, group) => {
  // If id is an object (like a full cell group), extract the ID
  const groupId = typeof id === "object" ? id._id || id.id : id;

  if (!groupId) {
    console.error("Missing cell group ID for update");
    throw new Error("Cannot update: Invalid cell group ID");
  }

  // Clean the data before sending
  const cleanGroup = { ...group };
  delete cleanGroup._id;
  delete cleanGroup.__v;
  delete cleanGroup.createdAt;
  delete cleanGroup.updatedAt;

  // Ensure zone is a string
  if (cleanGroup.zone) {
    cleanGroup.zone = cleanGroup.zone.toString();
  }

  console.log(`Updating cell group with ID: ${groupId}`);
  console.log(
    `Cell group zone: ${cleanGroup.zone} (type: ${typeof cleanGroup.zone})`
  );
  return updateData("api/cell-groups", groupId, cleanGroup);
};
export const deleteCellGroup = (id) => {
  // If id is an object (like a full cell group), extract the ID
  const groupId = typeof id === "object" ? id._id || id.id : id;

  if (!groupId) {
    console.error("Missing cell group ID for deletion");
    throw new Error("Cannot delete: Invalid cell group ID");
  }

  console.log(`Deleting cell group with ID: ${groupId}`);
  return deleteData("api/cell-groups", groupId);
};

// Zones API functions
export const getZones = () => fetchData("api/zones");
export const getZoneById = (id) => {
  // Ensure id is a valid string
  const zoneId = id?.toString() || id;
  return fetchData(`api/zones/${zoneId}`);
};
export const getZoneCellGroups = (zoneId) => {
  // Ensure zoneId is a valid string
  const id = zoneId?.toString() || zoneId;
  return fetchData(`api/zones/${id}/cell-groups`);
};
// Alias for backward compatibility
export const getCellGroupsByZone = getZoneCellGroups;
export const createZone = (zone) => postData("api/zones", zone);
export const updateZone = (id, zone) => {
  // If id is an object (like a full zone), extract the ID
  const zoneId = typeof id === "object" ? id._id || id.id : id;

  if (!zoneId) {
    console.error("Missing zone ID for update");
    throw new Error("Cannot update: Invalid zone ID");
  }

  // Clean the data before sending
  const cleanZone = { ...zone };
  delete cleanZone._id;
  delete cleanZone.__v;
  delete cleanZone.createdAt;
  delete cleanZone.updatedAt;

  console.log(`Updating zone with ID: ${zoneId}`);
  return updateData("api/zones", zoneId, cleanZone);
};
export const deleteZone = (id) => {
  // If id is an object (like a full zone), extract the ID
  const zoneId = typeof id === "object" ? id._id || id.id : id;

  if (!zoneId) {
    console.error("Missing zone ID for deletion");
    throw new Error("Cannot delete: Invalid zone ID");
  }

  console.log(`Deleting zone with ID: ${zoneId}`);
  return deleteData("api/zones", zoneId);
};

// Cell Group Join Request API functions
export const submitCellGroupJoinRequest = (request) =>
  postData("api/cell-group-join-requests", request);
export const getCellGroupJoinRequests = () =>
  fetchData("api/cell-group-join-requests");
export const getCellGroupJoinRequestsForCellGroup = (cellGroupId) =>
  fetchData(`api/cell-group-join-requests/cell-group/${cellGroupId}`);
export const updateCellGroupJoinRequest = (id, status) =>
  updateData("api/cell-group-join-requests", id, { status });
export const deleteCellGroupJoinRequest = (id) =>
  deleteData("api/cell-group-join-requests", id);

// Event Signup Request API functions
export const submitEventSignupRequest = (request) => {
  console.log("Submitting event signup request:", request);
  // Ensure eventId is properly formatted as a string for MongoDB
  const requestData = { ...request };
  if (requestData.eventId) {
    requestData.eventId = String(requestData.eventId);
  }
  return postData("api/event-signup-requests", requestData);
};
export const getEventSignupRequests = () =>
  fetchData("api/event-signup-requests");
export const getEventSignupRequestsByType = (eventType) =>
  fetchData(`api/event-signup-requests/type/${eventType}`);
export const getEventSignupRequestsByEvent = (eventId) =>
  fetchData(`api/event-signup-requests/event/${eventId}`);
export const updateEventSignupRequest = (id, status) =>
  updateData("api/event-signup-requests", id, { status });
export const deleteEventSignupRequest = (id) =>
  deleteData("api/event-signup-requests", id);

// Enhanced media functions with cache busting
export const getMedia = async () => {
  try {
    // Add cache-busting parameter and timestamp
    const cacheBuster = Date.now();
    console.log(`Fetching media with cache buster: ${cacheBuster}`);

    // Use simpler headers to avoid CORS issues
    const response = await fetch(`${API_URL}/media?_=${cacheBuster}`, {
      headers: {
        ...getAuthHeaders(),
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API error (${response.status}): ${errorText}`);
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();

    // Validate data structure
    if (!Array.isArray(data)) {
      console.error("API returned non-array data for media:", data);
      throw new Error("Invalid media data format");
    }

    // Filter out any invalid items (those without path or id)
    const validData = data.filter(
      (item) =>
        item &&
        item.id &&
        (item.path || (item.filename && `/uploads/${item.filename}`))
    );

    // Fix any items that have filename but not path
    const fixedData = validData.map((item) => {
      if (!item.path && item.filename) {
        return {
          ...item,
          path: `/uploads/${item.filename}`,
        };
      }
      return item;
    });

    console.log(`Fetched ${fixedData.length} valid media items from server`);

    // Store both in localStorage (for persistent storage) and sessionStorage (for tab-specific storage)
    try {
      // Store in localStorage for persistence across browser sessions
      localStorage.setItem("mediaBackup", JSON.stringify(fixedData));
      localStorage.setItem("mediaLastFetched", new Date().toISOString());

      // Also store in sessionStorage for faster access
      sessionStorage.setItem("cachedMedia", JSON.stringify(fixedData));
      sessionStorage.setItem("mediaLastFetched", new Date().toISOString());
    } catch (storageError) {
      console.warn("Could not store media backup:", storageError);
    }

    return fixedData;
  } catch (error) {
    console.error("Error fetching media:", error);

    // Try to recover from session storage first (fastest)
    try {
      const sessionCache = sessionStorage.getItem("cachedMedia");
      if (sessionCache) {
        const sessionData = JSON.parse(sessionCache);
        console.log(
          `Recovered ${sessionData.length} media items from session cache`
        );
        return sessionData;
      }
    } catch (sessionError) {
      console.error(
        "Could not recover media from session cache:",
        sessionError
      );
    }

    // Try to recover from local storage if session storage fails
    try {
      const localBackup = localStorage.getItem("mediaBackup");
      if (localBackup) {
        const backupData = JSON.parse(localBackup);
        console.log(
          `Recovered ${backupData.length} media items from local backup`
        );

        // Refresh session storage with the recovered data
        try {
          sessionStorage.setItem("cachedMedia", localBackup);
        } catch (refreshError) {
          console.warn("Could not refresh session cache:", refreshError);
        }

        return backupData;
      }
    } catch (localError) {
      console.error("Could not recover media from local backup:", localError);
    }

    // Return empty array as last resort
    console.warn("No media cache available, returning empty array");
    return [];
  }
};

export const getMediaById = async (id) => {
  try {
    // Add cache-busting parameter
    const cacheBuster = Date.now();

    // Use simpler headers to avoid CORS issues
    const response = await fetch(`${API_URL}/media/${id}?_=${cacheBuster}`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching media with ID ${id}:`, error);

    // Try to find the media item in the cache
    try {
      const sessionCache = sessionStorage.getItem("cachedMedia");
      if (sessionCache) {
        const mediaItems = JSON.parse(sessionCache);
        const mediaItem = mediaItems.find((item) => item.id === id);
        if (mediaItem) {
          console.log(`Found media item ${id} in session cache`);
          return mediaItem;
        }
      }
    } catch (cacheError) {
      console.warn("Error accessing session cache:", cacheError);
    }

    throw error;
  }
};
export const createMedia = (media) => postData("media", media);
export const updateMedia = (id, media) => updateData("media", id, media);
export const deleteMedia = (id) => deleteData("media", id);

// Authentication functions
export const login = async (username, password) => {
  console.log(
    `Attempting login to ${API_URL}/api/auth/login with username: ${username}`
  );

  try {
    // First try the standard API endpoint
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log("Login successful, received token and user data");

      // Store auth token and user info in localStorage
      localStorage.setItem(
        "auth",
        JSON.stringify({
          isAuthenticated: true,
          token: data.token,
          user: data.user || { username },
        })
      );

      return true;
    }

    // If the standard endpoint fails, try the fallback endpoint
    console.log("Standard login failed, trying fallback endpoint");
    const fallbackResponse = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ username, password }),
    });

    if (fallbackResponse.ok) {
      const data = await fallbackResponse.json();
      console.log("Fallback login successful");

      // Store auth token and user info in localStorage
      localStorage.setItem(
        "auth",
        JSON.stringify({
          isAuthenticated: true,
          token: data.token,
          user: data.user || { username },
        })
      );

      return true;
    }

    // If both endpoints fail, use a development fallback for testing
    if (
      process.env.NODE_ENV === "development" ||
      window.location.hostname === "localhost"
    ) {
      console.log("Using development fallback login");
      localStorage.setItem(
        "auth",
        JSON.stringify({
          isAuthenticated: true,
          token: "dev-token-for-testing",
          user: { username, role: "admin" },
        })
      );
      return true;
    }

    console.error("All login attempts failed");
    return false;
  } catch (error) {
    console.error("Login error:", error);

    // Development fallback
    if (
      process.env.NODE_ENV === "development" ||
      window.location.hostname === "localhost"
    ) {
      console.log("Using development fallback login after error");
      localStorage.setItem(
        "auth",
        JSON.stringify({
          isAuthenticated: true,
          token: "dev-token-for-testing",
          user: { username, role: "admin" },
        })
      );
      return true;
    }

    return false;
  }
};

export const logout = () => {
  localStorage.removeItem("auth");
};

export const isAuthenticated = () => {
  const auth = localStorage.getItem("auth");
  if (!auth) return false;

  try {
    // Parse auth data
    const authData = JSON.parse(auth);
    return !!authData.isAuthenticated && !!authData.token;
  } catch (e) {
    // If there's an error parsing, the auth data is invalid
    localStorage.removeItem("auth");
    return false;
  }
};

export const getCurrentUser = () => {
  const auth = localStorage.getItem("auth");
  if (!auth) return null;

  try {
    const { user } = JSON.parse(auth);
    return user;
  } catch (e) {
    return null;
  }
};

// Verify authentication with server
export const verifyAuth = async () => {
  try {
    const auth = localStorage.getItem("auth");
    if (!auth) return false;

    const token = JSON.parse(auth)?.token;
    if (!token) return false;

    // Try to verify the token by making a request to a protected endpoint
    try {
      const response = await fetch(`${API_URL}/api/zones`, {
        headers: getAuthHeaders(),
      });

      if (response.status === 401) {
        console.error("Token verification failed: Unauthorized");
        return false;
      }

      return response.ok;
    } catch (fetchError) {
      console.error("Token verification request failed:", fetchError);
      // If the request fails due to network issues, assume the token is still valid
      // This prevents users from being logged out when offline
      return true;
    }
  } catch (error) {
    console.error("Auth verification error:", error);
    return false;
  }
};

// Test connection to the server
export const testConnection = async () => {
  try {
    console.log(`Testing connection to ${API_URL}/test-connection`);
    const response = await fetch(`${API_URL}/test-connection`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Connection test failed: ${response.status}`);
    }

    const data = await response.json();
    console.log("Connection test successful:", data);
    return true;
  } catch (error) {
    console.error("Connection test error:", error);
    return false;
  }
};
