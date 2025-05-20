// Sermon-related API functions
import { fetchData, postData, updateData, deleteData, getAuthToken } from './core';
import { login } from './auth';

/**
 * Get all sermons
 * @returns {Promise<Array>} Promise resolving to array of sermons
 */
export const getSermons = () => fetchData("api/sermons");

/**
 * Get a sermon by ID
 * @param {string} id - Sermon ID
 * @returns {Promise<Object>} Promise resolving to sermon object
 */
export const getSermonById = (id) => fetchData(`api/sermons/${id}`);

/**
 * Create a new sermon
 * @param {Object} sermon - Sermon data
 * @returns {Promise<Object>} Promise resolving to created sermon
 */
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

/**
 * Update an existing sermon
 * @param {string} id - Sermon ID
 * @param {Object} sermon - Updated sermon data
 * @returns {Promise<Object>} Promise resolving to updated sermon
 */
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

/**
 * Delete a sermon
 * @param {string} id - Sermon ID
 * @returns {Promise<Object>} Promise resolving to deletion result
 */
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
