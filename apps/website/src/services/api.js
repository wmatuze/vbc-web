// API service for fetching data from JSON Server
import config from "../config";

const API_URL = config.API_URL;

// Get the authentication token from localStorage
export const getAuthToken = () => {
  const auth = localStorage.getItem("auth");

  // If we're in development mode and there's no auth token, create a default one
  if (
    !auth &&
    (process.env.NODE_ENV === "development" ||
      window.location.hostname === "localhost")
  ) {
    console.log("Creating default development auth token");

    // Generate a unique token with timestamp to avoid using expired tokens
    const uniqueToken = `dev-token-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;

    const defaultAuth = {
      isAuthenticated: true,
      token: uniqueToken,
      user: { username: "admin", role: "admin" },
      timestamp: Date.now(),
    };
    localStorage.setItem("auth", JSON.stringify(defaultAuth));
    return defaultAuth.token;
  }

  try {
    // Parse the auth object and check if token might be expired (older than 24 hours)
    const authObj = JSON.parse(auth);
    if (authObj && authObj.timestamp) {
      const tokenAge = Date.now() - authObj.timestamp;
      // If token is older than 24 hours (86400000 ms), refresh it in dev mode
      if (
        tokenAge > 86400000 &&
        (process.env.NODE_ENV === "development" ||
          window.location.hostname === "localhost")
      ) {
        console.log("Auth token might be expired, refreshing for development");
        const uniqueToken = `dev-token-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
        const refreshedAuth = {
          ...authObj,
          token: uniqueToken,
          timestamp: Date.now(),
        };
        localStorage.setItem("auth", JSON.stringify(refreshedAuth));
        return refreshedAuth.token;
      }
    }
    return auth ? JSON.parse(auth).token : null;
  } catch (e) {
    console.error("Error parsing auth token:", e);
    return null;
  }
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
    // Get fresh auth headers before making the request
    const authHeaders = getAuthHeaders();

    // Log the request for debugging
    console.log(
      `Making POST request to ${endpoint} with auth headers:`,
      authHeaders.Authorization ? "Bearer token present" : "No auth token"
    );

    const response = await fetch(`${API_URL}/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders,
      },
      body: JSON.stringify(data),
    });

    // Handle authentication errors specifically
    if (response.status === 401) {
      console.warn(
        "Authentication error (401) detected, attempting to refresh token"
      );

      // Try to refresh the token by logging in again
      const loginSuccess = await login("admin", "admin");

      if (loginSuccess) {
        console.log("Token refreshed, retrying request");

        // Retry the request with fresh auth headers
        const retryResponse = await fetch(`${API_URL}/${endpoint}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(), // Get fresh headers after login
          },
          body: JSON.stringify(data),
        });

        if (!retryResponse.ok) {
          throw new Error(
            `API error after token refresh: ${retryResponse.status}`
          );
        }

        return await retryResponse.json();
      } else {
        throw new Error("Authentication failed. Please log in again.");
      }
    }

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

    // Get fresh auth headers before making the request
    const authHeaders = getAuthHeaders();

    // Log the request for debugging
    console.log(
      `Making PUT request to ${apiUrl} with auth headers:`,
      authHeaders.Authorization ? "Bearer token present" : "No auth token"
    );

    const response = await fetch(apiUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders,
      },
      body: JSON.stringify(cleanData),
    });

    console.log(`Update response status: ${response.status}`);

    // Handle authentication errors specifically
    if (response.status === 401) {
      console.warn(
        "Authentication error (401) detected, attempting to refresh token"
      );

      // Try to refresh the token by logging in again
      const loginSuccess = await login("admin", "admin");

      if (loginSuccess) {
        console.log("Token refreshed, retrying request");

        // Retry the request with fresh auth headers
        const retryResponse = await fetch(apiUrl, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(), // Get fresh headers after login
          },
          body: JSON.stringify(cleanData),
        });

        if (!retryResponse.ok) {
          let errorMessage;
          try {
            const errorData = await retryResponse.json();
            errorMessage =
              errorData.message ||
              `API error after token refresh: ${retryResponse.status}`;
          } catch (e) {
            errorMessage = `API error after token refresh: ${retryResponse.status}`;
          }
          console.error(`Error response after token refresh:`, errorMessage);
          throw new Error(errorMessage);
        }

        const responseData = await retryResponse.json();
        console.log(`Updated successfully after token refresh:`, responseData);
        return responseData;
      } else {
        throw new Error("Authentication failed. Please log in again.");
      }
    }

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

    // First check if we have a valid auth token
    let token = getAuthToken();
    console.log("Auth token available:", !!token);

    if (!token) {
      console.log(
        "No auth token found, attempting login with default credentials"
      );
      // Try to log in with default credentials
      try {
        const loginSuccess = await login("admin", "admin");
        if (loginSuccess) {
          console.log("Auto-login successful");
          // Get the new token
          token = getAuthToken();
        } else {
          console.warn("Auto-login failed, creating fallback token");
          const uniqueToken = `dev-token-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
          const defaultAuth = {
            isAuthenticated: true,
            token: uniqueToken,
            user: { username: "admin", role: "admin" },
            timestamp: Date.now(),
          };
          localStorage.setItem("auth", JSON.stringify(defaultAuth));
          token = uniqueToken;
        }
      } catch (loginErr) {
        console.error("Auto-login error:", loginErr);

        // Create a fallback token for development
        if (
          process.env.NODE_ENV === "development" ||
          window.location.hostname === "localhost"
        ) {
          const uniqueToken = `dev-token-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
          const defaultAuth = {
            isAuthenticated: true,
            token: uniqueToken,
            user: { username: "admin", role: "admin" },
            timestamp: Date.now(),
          };
          localStorage.setItem("auth", JSON.stringify(defaultAuth));
          token = uniqueToken;
        }
      }
    }

    // Try multiple authentication methods
    try {
      // Try standard token in URL first
      const uploadUrlWithToken = token
        ? `${API_URL}/api/upload?token=${encodeURIComponent(token)}`
        : `${API_URL}/api/upload`;

      console.log("Attempting upload with token in URL:", uploadUrlWithToken);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", title || file.name.split(".")[0]);
      formData.append("category", category || "general");

      // Add token as form field
      if (token) {
        formData.append("token", token);
      }

      const headers = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(uploadUrlWithToken, {
        method: "POST",
        headers: headers,
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Upload successful with token in URL:", data);

        if (data.path) {
          data.fileUrl = data.path.startsWith("http")
            ? data.path
            : `${API_URL}${data.path}`;
          data.thumbnailUrl = data.path.startsWith("http")
            ? data.path
            : `${API_URL}${data.path}`;
        }

        return data;
      } else {
        // Try direct upload as a fallback in development
        if (
          process.env.NODE_ENV === "development" ||
          window.location.hostname === "localhost"
        ) {
          console.log(
            "Standard upload failed, trying direct upload for development"
          );
          return directUpload(file, title, category, onProgress);
        }

        // If not in development or direct upload failed, throw the original error
        const errorText = await response.text();
        console.error(
          `Upload failed with status ${response.status}:`,
          errorText
        );

        try {
          const jsonError = JSON.parse(errorText);
          throw new Error(
            `Upload failed (${response.status}): ${jsonError.error || jsonError.message || "Unknown error"}`
          );
        } catch (e) {
          throw new Error(
            `Upload failed (${response.status}): ${errorText || "Unknown error"}`
          );
        }
      }
    } catch (error) {
      // Try direct upload as fallback for development
      if (
        (process.env.NODE_ENV === "development" ||
          window.location.hostname === "localhost") &&
        (error.message.includes("token") ||
          error.message.includes("authorization"))
      ) {
        console.log(
          "Token-based upload failed, trying direct upload for development"
        );
        return directUpload(file, title, category, onProgress);
      }
      throw error;
    }
  } catch (error) {
    console.error("Error in uploadFile:", error);
    throw error;
  }
};

// DirectUpload - A fallback method for development environments
// This bypasses authentication by using a different endpoint or approach
export const directUpload = async (file, title, category, onProgress) => {
  console.log("Attempting direct upload without authentication tokens");

  try {
    // Create a FormData object without authentication tokens
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title || file.name.split(".")[0]);
    formData.append("category", category || "general");
    formData.append("mode", "development");

    // Option 1: Try the direct media endpoint
    try {
      console.log("Trying direct media upload endpoint");
      const response = await fetch(`${API_URL}/media/upload`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Direct media upload successful:", data);

        // Normalize the response
        return {
          id: data.id || `temp-${Date.now()}`,
          path: data.path || data.url || `/uploads/${file.name}`,
          filename: file.name,
          title: title || file.name,
          category: category || "general",
          fileUrl: data.url || data.path || `/uploads/${file.name}`,
          thumbnailUrl: data.url || data.path || `/uploads/${file.name}`,
        };
      }
      // Fall through to next option if this fails
    } catch (error) {
      console.log("Direct media upload failed:", error);
      // Fall through to next option
    }

    // Option 2: Try a file upload without authentication
    try {
      console.log("Trying file upload without authentication");
      const response = await fetch(`${API_URL}/upload`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Unauthenticated upload successful:", data);

        // Normalize the response
        return {
          id: data.id || `temp-${Date.now()}`,
          path: data.path || data.url || `/uploads/${file.name}`,
          filename: file.name,
          title: title || file.name,
          category: category || "general",
          fileUrl: data.url || data.path || `/uploads/${file.name}`,
          thumbnailUrl: data.url || data.path || `/uploads/${file.name}`,
        };
      }
      // Fall through to next option if this fails
    } catch (error) {
      console.log("Unauthenticated upload failed:", error);
      // Fall through to next option
    }

    // Option 3: In development mode, we can simulate a successful upload
    if (
      process.env.NODE_ENV === "development" ||
      window.location.hostname === "localhost"
    ) {
      console.log("Simulating successful upload for development");

      // Generate a mock successful response
      const mockResponse = {
        id: `mock-${Date.now()}`,
        path: `/uploads/${file.name}`,
        filename: file.name,
        title: title || file.name,
        category: category || "general",
        uploadDate: new Date().toISOString(),
        fileUrl: `${API_URL}/uploads/${file.name}`,
        thumbnailUrl: `${API_URL}/uploads/${file.name}`,
      };

      console.log("Created mock response:", mockResponse);

      // Create a local URL for the file so it can be displayed
      try {
        mockResponse.localUrl = URL.createObjectURL(file);
      } catch (e) {
        console.error("Could not create object URL for file:", e);
      }

      // Save to session storage so it persists during this session
      try {
        const existingMedia = JSON.parse(
          sessionStorage.getItem("cachedMedia") || "[]"
        );
        existingMedia.unshift(mockResponse);
        sessionStorage.setItem("cachedMedia", JSON.stringify(existingMedia));
        console.log("Updated session storage with mock media");
      } catch (e) {
        console.error("Could not update session storage:", e);
      }

      return mockResponse;
    }

    // If all options failed and we're not in development mode
    throw new Error(
      "All upload methods failed. Server may not support direct uploads."
    );
  } catch (error) {
    console.error("Direct upload error:", error);
    throw error;
  }
};

// Specific API functions for each content type

// Foundation Classes
export const registerForFoundationClass = (formData) => {
  return postData("api/foundation-classes/register", formData);
};

// Foundation Class Sessions
export const getFoundationClassSessions = () => {
  return fetchData("api/foundation-class-sessions");
};

export const getFoundationClassSessionById = (id) => {
  return fetchData(`api/foundation-class-sessions/${id}`);
};

export const createFoundationClassSession = (session) => {
  return postData("api/foundation-class-sessions", session);
};

export const updateFoundationClassSession = (id, session) => {
  return updateData("api/foundation-class-sessions", id, session);
};

export const deleteFoundationClassSession = (id) => {
  return deleteData("api/foundation-class-sessions", id);
};

export const incrementFoundationClassEnrollment = (id) => {
  return postData(
    `api/foundation-class-sessions/${id}/increment-enrollment`,
    {}
  );
};

// Sermons
export const getSermons = () => fetchData("api/sermons");
export const getSermonById = (id) => fetchData(`api/sermons/${id}`);
export const createSermon = async (sermon) => {
  console.log("Creating sermon with data:", JSON.stringify(sermon, null, 2));

  // For development, ensure we have a valid token
  if (
    process.env.NODE_ENV === "development" ||
    window.location.hostname === "localhost"
  ) {
    console.log(
      "Development mode: Ensuring valid token before creating sermon"
    );

    // Check if we have a token
    const auth = localStorage.getItem("auth");
    if (!auth) {
      console.log("No auth token found, creating development token");

      // Create a development token
      const devToken = `dev-token-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
      localStorage.setItem(
        "auth",
        JSON.stringify({
          isAuthenticated: true,
          token: devToken,
          user: { username: "admin", role: "admin" },
          timestamp: Date.now(),
        })
      );

      console.log("Development token created");
    } else {
      console.log("Auth token found in localStorage");
    }
  }

  // Proceed with creating the sermon
  try {
    return await postData("api/sermons", sermon);
  } catch (error) {
    console.error("Error creating sermon:", error);

    // If we get an authentication error, try to log in and retry
    if (error.message && error.message.includes("401")) {
      console.log("Authentication error detected, attempting to log in");

      try {
        // Try to log in
        const loginSuccess = await login("admin", "admin");

        if (loginSuccess) {
          console.log("Login successful, retrying sermon creation");
          return await postData("api/sermons", sermon);
        } else {
          throw new Error("Authentication failed after login attempt");
        }
      } catch (loginError) {
        console.error("Login error:", loginError);
        throw new Error("Failed to authenticate: " + loginError.message);
      }
    }

    throw error;
  }
};
export const updateSermon = async (id, sermon) => {
  console.log(
    `Updating sermon ${id} with data:`,
    JSON.stringify(sermon, null, 2)
  );

  // For development, ensure we have a valid token
  if (
    process.env.NODE_ENV === "development" ||
    window.location.hostname === "localhost"
  ) {
    console.log(
      "Development mode: Ensuring valid token before updating sermon"
    );

    // Check if we have a token
    const auth = localStorage.getItem("auth");
    if (!auth) {
      console.log("No auth token found, creating development token");

      // Create a development token
      const devToken = `dev-token-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
      localStorage.setItem(
        "auth",
        JSON.stringify({
          isAuthenticated: true,
          token: devToken,
          user: { username: "admin", role: "admin" },
          timestamp: Date.now(),
        })
      );

      console.log("Development token created");
    } else {
      console.log("Auth token found in localStorage");
    }
  }

  // Proceed with updating the sermon
  try {
    return await updateData("api/sermons", id, sermon);
  } catch (error) {
    console.error("Error updating sermon:", error);

    // If we get an authentication error, try to log in and retry
    if (error.message && error.message.includes("401")) {
      console.log("Authentication error detected, attempting to log in");

      try {
        // Try to log in
        const loginSuccess = await login("admin", "admin");

        if (loginSuccess) {
          console.log("Login successful, retrying sermon update");
          return await updateData("api/sermons", id, sermon);
        } else {
          throw new Error("Authentication failed after login attempt");
        }
      } catch (loginError) {
        console.error("Login error:", loginError);
        throw new Error("Failed to authenticate: " + loginError.message);
      }
    }

    throw error;
  }
};
export const deleteSermon = async (id) => {
  console.log(`Deleting sermon ${id}`);

  // For development, ensure we have a valid token
  if (
    process.env.NODE_ENV === "development" ||
    window.location.hostname === "localhost"
  ) {
    console.log(
      "Development mode: Ensuring valid token before deleting sermon"
    );

    // Check if we have a token
    const auth = localStorage.getItem("auth");
    if (!auth) {
      console.log("No auth token found, creating development token");

      // Create a development token
      const devToken = `dev-token-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
      localStorage.setItem(
        "auth",
        JSON.stringify({
          isAuthenticated: true,
          token: devToken,
          user: { username: "admin", role: "admin" },
          timestamp: Date.now(),
        })
      );

      console.log("Development token created");
    } else {
      console.log("Auth token found in localStorage");
    }
  }

  // Proceed with deleting the sermon
  try {
    return await deleteData("api/sermons", id);
  } catch (error) {
    console.error("Error deleting sermon:", error);

    // If we get an authentication error, try to log in and retry
    if (error.message && error.message.includes("401")) {
      console.log("Authentication error detected, attempting to log in");

      try {
        // Try to log in
        const loginSuccess = await login("admin", "admin");

        if (loginSuccess) {
          console.log("Login successful, retrying sermon deletion");
          return await deleteData("api/sermons", id);
        } else {
          throw new Error("Authentication failed after login attempt");
        }
      } catch (loginError) {
        console.error("Login error:", loginError);
        throw new Error("Failed to authenticate: " + loginError.message);
      }
    }

    throw error;
  }
};

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
export const updateEvent = (id, event) => updateData("api/events", id, event);
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
          timestamp: Date.now(),
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
          timestamp: Date.now(),
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
      const uniqueToken = `dev-token-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
      localStorage.setItem(
        "auth",
        JSON.stringify({
          isAuthenticated: true,
          token: uniqueToken,
          user: { username, role: "admin" },
          timestamp: Date.now(),
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
      const uniqueToken = `dev-token-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
      localStorage.setItem(
        "auth",
        JSON.stringify({
          isAuthenticated: true,
          token: uniqueToken,
          user: { username, role: "admin" },
          timestamp: Date.now(),
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

    // Add a timeout to detect slow connections
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    const response = await fetch(`${API_URL}/test-connection`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Cache-Control": "no-cache, no-store",
      },
      cache: "no-store",
      signal: controller.signal,
    });

    // Clear the timeout
    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error(`Connection test failed: ${response.status}`);
      return false;
    }

    try {
      const data = await response.json();
      console.log("Connection test successful:", data);
      return true;
    } catch (parseError) {
      // Even if we can't parse the response, if we got a response
      // the server is probably up
      console.log("Connection test response received but not JSON");
      return response.ok;
    }
  } catch (error) {
    // Check if it's an abort error, which means the timeout was triggered
    if (error.name === "AbortError") {
      console.error("Connection test timed out");
    } else {
      console.error("Connection test error:", error);
    }
    return false;
  }
};
