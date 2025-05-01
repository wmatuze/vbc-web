import config from "../config";

const API_URL = config.API_URL;

/**
 * Get a properly formatted image URL with cache busting
 * @param {string} imageUrl - The raw image URL
 * @param {string} fallbackImage - Optional fallback image if URL is empty
 * @returns {string} Properly formatted image URL
 */
export const getImageUrl = (imageUrl, fallbackImage = null) => {
  // If no image URL is provided, return the fallback
  if (!imageUrl) return fallbackImage;

  // Add cache busting parameter
  const cacheBuster = `?t=${Date.now()}`;

  // Handle absolute URLs that already include http/https
  if (imageUrl.startsWith("http")) {
    // Add cache buster to URL
    const hasParams = imageUrl.includes("?");
    return `${imageUrl}${hasParams ? "&" : "?"}t=${Date.now()}`;
  }

  // Handle local server paths
  if (imageUrl.startsWith("/")) {
    return `${API_URL}${imageUrl}${cacheBuster}`;
  }

  // Handle relative paths
  return `${API_URL}/${imageUrl}${cacheBuster}`;
};

/**
 * Process a media item for consistent use in components
 * @param {Object} mediaItem - The media item from the API
 * @returns {Object} Processed media item with normalized properties
 */
export const processMediaItem = (mediaItem) => {
  if (!mediaItem) return null;
  
  // Ensure ID is normalized
  const mediaId = mediaItem.id || mediaItem._id;
  
  // Ensure path is properly formatted
  let imagePath;
  if (mediaItem.path) {
    // If path exists, use it directly
    imagePath = mediaItem.path;
  } else if (mediaItem.filename) {
    // If only filename exists, construct path
    imagePath = `/uploads/${mediaItem.filename}`;
  }
  
  return {
    id: mediaId,
    path: imagePath,
    filename: mediaItem.filename,
    title: mediaItem.title || mediaItem.filename || 'Untitled',
    imageUrl: imagePath, // For compatibility with direct image URL fields
  };
}; 