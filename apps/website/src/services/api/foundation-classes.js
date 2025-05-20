// Foundation Class-related API functions
import { API_URL, fetchData, postData, updateData, deleteData, getAuthHeaders } from './core';

/**
 * Register for a foundation class
 * @param {Object} formData - Registration form data
 * @returns {Promise<Object>} Promise resolving to registration result
 */
export const registerForFoundationClass = (formData) => {
  return postData("api/foundation-classes/register", formData);
};

/**
 * Get all foundation class sessions
 * @returns {Promise<Array>} Promise resolving to array of foundation class sessions
 */
export const getFoundationClassSessions = async () => {
  try {
    console.log("Fetching foundation class sessions...");
    // Add cache-busting parameter
    const cacheBuster = Date.now();
    const url = `${API_URL}/api/foundation-class-sessions?_=${cacheBuster}`;
    console.log(`Making API request to: ${url}`);

    const headers = getAuthHeaders();
    console.log("Using headers:", headers);

    const response = await fetch(url, {
      headers: headers,
    });

    console.log(`Response status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API error (${response.status}): ${errorText}`);

      // If we get a 404, try the alternative URL without the /api prefix
      if (response.status === 404) {
        console.log("Trying alternative URL without /api prefix...");
        const altUrl = `${API_URL}/foundation-class-sessions?_=${cacheBuster}`;
        console.log(`Making alternative API request to: ${altUrl}`);

        const altResponse = await fetch(altUrl, {
          headers: headers,
        });

        console.log(`Alternative response status: ${altResponse.status}`);

        if (altResponse.ok) {
          const altData = await altResponse.json();
          console.log(
            `Successfully fetched ${altData.length} foundation class sessions from alternative URL`
          );
          return altData;
        } else {
          const altErrorText = await altResponse.text();
          console.error(
            `Alternative API error (${altResponse.status}): ${altErrorText}`
          );
        }
      }

      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    console.log(
      `Successfully fetched ${data.length} foundation class sessions`
    );
    return data;
  } catch (error) {
    console.error("Error fetching foundation class sessions:", error);
    throw error;
  }
};

/**
 * Get a foundation class session by ID
 * @param {string} id - Session ID
 * @returns {Promise<Object>} Promise resolving to session object
 */
export const getFoundationClassSessionById = (id) => {
  return fetchData(`api/foundation-class-sessions/${id}`);
};

/**
 * Create a new foundation class session
 * @param {Object} session - Session data
 * @returns {Promise<Object>} Promise resolving to created session
 */
export const createFoundationClassSession = (session) => {
  return postData("api/foundation-class-sessions", session);
};

/**
 * Update an existing foundation class session
 * @param {string} id - Session ID
 * @param {Object} session - Updated session data
 * @returns {Promise<Object>} Promise resolving to updated session
 */
export const updateFoundationClassSession = (id, session) => {
  return updateData("api/foundation-class-sessions", id, session);
};

/**
 * Delete a foundation class session
 * @param {string} id - Session ID
 * @returns {Promise<Object>} Promise resolving to deletion result
 */
export const deleteFoundationClassSession = async (id) => {
  try {
    console.log(`Deleting foundation class session with ID: ${id}`);

    // Try with /api prefix first
    try {
      console.log(
        `Making API DELETE request to: ${API_URL}/api/foundation-class-sessions/${id}`
      );
      const result = await deleteData("api/foundation-class-sessions", id);
      console.log("Successfully deleted foundation class session");
      return result;
    } catch (error) {
      console.error(
        "Error deleting foundation class session with /api prefix:",
        error
      );

      // If we get a 404, try without the /api prefix
      if (error.message && error.message.includes("404")) {
        console.log("Trying alternative URL without /api prefix...");

        // Create a custom delete request without the /api prefix
        const url = `${API_URL}/foundation-class-sessions/${id}`;
        console.log(`Making alternative API DELETE request to: ${url}`);

        const response = await fetch(url, {
          method: "DELETE",
          headers: getAuthHeaders(),
        });

        console.log(`Alternative response status: ${response.status}`);

        if (response.ok) {
          const data = await response.json();
          console.log(
            "Successfully deleted foundation class session from alternative URL"
          );
          return data;
        } else {
          const errorText = await response.text();
          console.error(
            `Alternative API error (${response.status}): ${errorText}`
          );
          throw new Error(`API error: ${response.status}`);
        }
      }

      // If it's not a 404 or the alternative URL also failed, rethrow the original error
      throw error;
    }
  } catch (error) {
    console.error("Error in deleteFoundationClassSession:", error);
    throw error;
  }
};

/**
 * Increment enrollment count for a foundation class session
 * @param {string} id - Session ID
 * @returns {Promise<Object>} Promise resolving to updated session
 */
export const incrementFoundationClassEnrollment = async (id) => {
  try {
    console.log(
      `Incrementing enrollment for foundation class session with ID: ${id}`
    );

    // Try with /api prefix first
    try {
      console.log(
        `Making API POST request to: ${API_URL}/api/foundation-class-sessions/${id}/increment-enrollment`
      );
      const result = await postData(
        `api/foundation-class-sessions/${id}/increment-enrollment`,
        {}
      );
      console.log(
        "Successfully incremented enrollment for foundation class session"
      );
      return result;
    } catch (error) {
      console.error("Error incrementing enrollment with /api prefix:", error);

      // If we get a 404, try without the /api prefix
      if (error.message && error.message.includes("404")) {
        console.log("Trying alternative URL without /api prefix...");

        // Create a custom post request without the /api prefix
        const url = `${API_URL}/foundation-class-sessions/${id}/increment-enrollment`;
        console.log(`Making alternative API POST request to: ${url}`);

        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
          },
          body: JSON.stringify({}),
        });

        console.log(`Alternative response status: ${response.status}`);

        if (response.ok) {
          const data = await response.json();
          console.log(
            "Successfully incremented enrollment from alternative URL"
          );
          return data;
        } else {
          const errorText = await response.text();
          console.error(
            `Alternative API error (${response.status}): ${errorText}`
          );
          throw new Error(`API error: ${response.status}`);
        }
      }

      // If it's not a 404 or the alternative URL also failed, rethrow the original error
      throw error;
    }
  } catch (error) {
    console.error("Error in incrementFoundationClassEnrollment:", error);
    throw error;
  }
};
