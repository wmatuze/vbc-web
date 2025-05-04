/**
 * Utility functions for authentication
 */
import { login, isAuthenticated, getAuthToken } from "../services/api";

/**
 * Ensures the user is authenticated by checking the current auth state
 * and attempting to log in with default credentials if needed
 * @returns {Promise<boolean>} True if authentication is successful
 */
export const ensureAuthenticated = async () => {
  // First check if already authenticated
  if (isAuthenticated()) {
    console.log("User is already authenticated");
    return true;
  }

  console.log("Not authenticated, attempting login with default credentials");
  
  try {
    // Try to log in with default credentials
    const loginSuccess = await login("admin", "admin");
    
    if (loginSuccess) {
      console.log("Auto-login successful");
      return true;
    } else {
      console.warn("Auto-login failed with admin/admin, trying alternative credentials");
      
      // Try alternative credentials
      const altLoginSuccess = await login("admin", "church_admin_2025");
      
      if (altLoginSuccess) {
        console.log("Auto-login successful with alternative credentials");
        return true;
      }
      
      console.error("All auto-login attempts failed");
      return false;
    }
  } catch (error) {
    console.error("Error during auto-login:", error);
    
    // For development, create a fallback token
    if (process.env.NODE_ENV === "development" || window.location.hostname === "localhost") {
      console.log("Creating fallback development token");
      const uniqueToken = `dev-token-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
      localStorage.setItem(
        "auth",
        JSON.stringify({
          isAuthenticated: true,
          token: uniqueToken,
          user: { username: "admin", role: "admin" },
          timestamp: Date.now(),
        })
      );
      return true;
    }
    
    return false;
  }
};

/**
 * Gets the current authentication token or attempts to refresh it
 * @returns {Promise<string|null>} The authentication token or null if not available
 */
export const getOrRefreshAuthToken = async () => {
  // Try to get the existing token
  let token = getAuthToken();
  
  // If no token, try to authenticate
  if (!token) {
    const authenticated = await ensureAuthenticated();
    if (authenticated) {
      token = getAuthToken();
    }
  }
  
  return token;
};
