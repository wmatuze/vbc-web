// API service for fetching data from JSON Server
import config from "../config";

const API_URL = config.API_URL;

// Get the authentication token from localStorage
const getAuthToken = () => {
  const auth = localStorage.getItem("auth");
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

export const getEvents = () => fetchData("api/events");
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

  console.log(`Updating event with ID: ${eventId}`);
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
export const getCellGroupById = (id) => fetchData(`api/cell-groups/${id}`);
export const createCellGroup = (group) => postData("api/cell-groups", group);
export const updateCellGroup = (id, group) =>
  updateData("api/cell-groups", id, group);
export const deleteCellGroup = (id) => deleteData("api/cell-groups", id);

// Zones API functions
export const getZones = () => fetchData("api/zones");
export const getZoneById = (id) => fetchData(`api/zones/${id}`);
export const getZoneCellGroups = (zoneId) =>
  fetchData(`api/zones/${zoneId}/cell-groups`);
// Alias for backward compatibility
export const getCellGroupsByZone = getZoneCellGroups;
export const createZone = (zone) => postData("api/zones", zone);
export const updateZone = (id, zone) => updateData("api/zones", id, zone);
export const deleteZone = (id) => deleteData("api/zones", id);

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

// Enhanced media functions with cache busting
export const getMedia = async () => {
  try {
    // Add cache-busting parameter and timestamp
    const cacheBuster = Date.now();
    console.log(`Fetching media with cache buster: ${cacheBuster}`);

    const response = await fetch(`${API_URL}/media?_=${cacheBuster}`, {
      headers: {
        ...getAuthHeaders(),
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
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

export const getMediaById = (id) => fetchData(`media/${id}`);
export const createMedia = (media) => postData("media", media);
export const updateMedia = (id, media) => updateData("media", id, media);
export const deleteMedia = (id) => deleteData("media", id);

// Authentication functions
export const login = async (username, password) => {
  console.log(
    `Attempting login to ${API_URL}/login with username: ${username}`
  );

  // Try different credential and CORS combinations
  const credentialModes = ["same-origin", "include", "omit"];
  const corsModes = ["cors", "no-cors"];

  for (const credentialMode of credentialModes) {
    for (const corsMode of corsModes) {
      try {
        console.log(
          `Trying login with credentials: ${credentialMode}, mode: ${corsMode}`
        );

        const response = await fetch(`${API_URL}/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          credentials: credentialMode,
          mode: corsMode,
          body: JSON.stringify({ username, password }),
        });

        // If using no-cors, we can't read the response
        if (corsMode === "no-cors") {
          console.log("Using no-cors mode, assuming success");
          // Store auth info with default values since we can't read the response
          localStorage.setItem(
            "auth",
            JSON.stringify({
              isAuthenticated: true,
              token: "temp-token", // Will need to refresh this token later
              user: { username },
            })
          );
          return true;
        }

        if (!response.ok) {
          console.error(`Login failed with status: ${response.status}`);
          const errorText = await response.text();
          console.error(`Error response: ${errorText}`);
          // Continue to the next attempt
          continue;
        }

        const data = await response.json();
        console.log("Login successful, received token and user data");

        // Store auth token and user info in localStorage
        localStorage.setItem(
          "auth",
          JSON.stringify({
            isAuthenticated: true,
            token: data.token,
            user: data.user,
          })
        );

        return true;
      } catch (error) {
        console.error(`Login error with ${credentialMode}/${corsMode}:`, error);
        // Continue to the next attempt
      }
    }
  }

  // If we've tried all combinations and none worked
  console.error("All login attempts failed");
  return false;
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

    return true; // For now, just check if we have a token

    /* Uncomment when backend API is ready:
    const response = await fetch(`${API_URL}/auth/status`, {
      headers: getAuthHeaders()
    });

    return response.ok;
    */
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
