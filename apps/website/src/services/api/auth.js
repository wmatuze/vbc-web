// Authentication-related API functions
import { API_URL, getAuthToken, getAuthHeaders } from './core';

/**
 * Login with username and password
 * @param {string} username - Username
 * @param {string} password - Password
 * @returns {Promise<boolean>} Promise resolving to login success status
 */
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

/**
 * Logout the current user
 */
export const logout = () => {
  localStorage.removeItem("auth");
};

/**
 * Check if user is authenticated
 * @returns {boolean} Authentication status
 */
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

/**
 * Get the current user information
 * @returns {Object|null} User object or null if not authenticated
 */
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

/**
 * Verify authentication with server
 * @returns {Promise<boolean>} Promise resolving to authentication status
 */
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

/**
 * Test connection to the server
 * @returns {Promise<boolean>} Promise resolving to connection status
 */
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
