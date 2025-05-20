// Core API utilities for HTTP requests and authentication
import config from "../../config";

const API_URL = config.API_URL;

/**
 * Get the authentication token from localStorage
 * @returns {string|null} The authentication token or null if not available
 */
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

/**
 * Add auth headers to requests if user is authenticated
 * @returns {Object} Headers object with authorization if available
 */
export const getAuthHeaders = () => {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * Generic fetch function with error handling
 * @param {string} endpoint - API endpoint to fetch from
 * @returns {Promise<any>} Promise resolving to the response data
 */
export const fetchData = async (endpoint) => {
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

/**
 * Generic post function for creating new items
 * @param {string} endpoint - API endpoint to post to
 * @param {Object} data - Data to send in the request body
 * @returns {Promise<any>} Promise resolving to the response data
 */
export const postData = async (endpoint, data) => {
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
      // Note: login function will be imported from auth.js in the future
      const loginSuccess = await import("./auth").then((auth) =>
        auth.login("admin", "admin")
      );

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

/**
 * Generic update function
 * @param {string} endpoint - API endpoint base
 * @param {string} id - ID of the item to update
 * @param {Object} data - Data to send in the request body
 * @returns {Promise<any>} Promise resolving to the response data
 */
export const updateData = async (endpoint, id, data) => {
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
      // Note: login function will be imported from auth.js in the future
      const loginSuccess = await import("./auth").then((auth) =>
        auth.login("admin", "admin")
      );

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

/**
 * Generic delete function
 * @param {string} endpoint - API endpoint base
 * @param {string} id - ID of the item to delete
 * @returns {Promise<any>} Promise resolving to the response data
 */
export const deleteData = async (endpoint, id) => {
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

// Export API_URL for use in other modules
export { API_URL };
