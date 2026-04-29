// Media-related API functions
import {
  API_URL,
  getAuthHeaders,
  postData,
  updateData,
  deleteData,
} from "./core";
import { uploadFile } from "./uploads";

export { uploadFile };

/**
 * Get all media items with cache busting
 * @returns {Promise<Array>} Promise resolving to array of media items
 */
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

/**
 * Get a media item by ID
 * @param {string} id - Media ID
 * @returns {Promise<Object>} Promise resolving to media object
 */
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

/**
 * Create a new media item
 * @param {Object} media - Media data
 * @returns {Promise<Object>} Promise resolving to created media
 */
export const createMedia = (media) => postData("media", media);

/**
 * Update an existing media item
 * @param {string} id - Media ID
 * @param {Object} media - Updated media data
 * @returns {Promise<Object>} Promise resolving to updated media
 */
export const updateMedia = (id, media) => updateData("media", id, media);

/**
 * Delete a media item
 * @param {string} id - Media ID
 * @returns {Promise<Object>} Promise resolving to deletion result
 */
export const deleteMedia = (id) => deleteData("media", id);
