/**
 * Get the base API URL based on environment
 * @returns {String} The base API URL
 */
export const getApiUrl = () => {
  // Use environment variable if available, or fallback to localhost
  return import.meta.env.VITE_API_URL || "http://localhost:3000";
};

/**
 * Get authentication token from local storage
 * @returns {String|null} The auth token or null if not available
 */
export const getAuthToken = () => {
  const auth = localStorage.getItem("auth");
  if (!auth) return null;

  try {
    const authData = JSON.parse(auth);
    return authData.token;
  } catch (e) {
    console.error("Error parsing auth data:", e);
    return null;
  }
};

/**
 * Generate common headers for API requests, including authentication
 * @param {Boolean} includeContentType - Whether to include Content-Type: application/json
 * @returns {Object} Headers object for fetch/axios
 */
export const getAuthHeaders = (includeContentType = true) => {
  const headers = {};
  const token = getAuthToken();

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  if (includeContentType) {
    headers["Content-Type"] = "application/json";
  }

  return headers;
};

/**
 * Configuration object for the application
 */
export const config = {
  apiUrl: getApiUrl(),

  // Default pagination settings
  pagination: {
    defaultPageSize: 10,
    pageSizeOptions: [5, 10, 20, 50, 100],
  },

  // Timeout settings (in milliseconds)
  timeouts: {
    apiRequest: 30000, // 30 seconds
    userSession: 3600000, // 1 hour
  },
};
