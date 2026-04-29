import config from "../config";

const API_URL = config.API_URL;

/**
 * Resolve a stored image URL/path to a fully-qualified URL.
 *
 * New uploads: path is already a full Cloudinary HTTPS URL → returned as-is.
 * Legacy uploads: path is a local server path like /uploads/abc.jpg → prefixed with API_URL.
 */
export const getImageUrl = (imageUrl, fallbackImage = null) => {
  if (!imageUrl) return fallbackImage;

  // Cloudinary URL or any other absolute URL — use directly, no prefix needed
  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl;
  }

  // Legacy local server path (/uploads/..., /assets/...)
  if (imageUrl.startsWith("/")) {
    return `${API_URL}${imageUrl}`;
  }

  return `${API_URL}/${imageUrl}`;
};

/**
 * Normalise a media item returned from the API so every component
 * can rely on the same shape.
 */
export const processMediaItem = (mediaItem) => {
  if (!mediaItem) return null;

  const path =
    mediaItem.path ||
    (mediaItem.filename ? `/uploads/${mediaItem.filename}` : null);

  return {
    id: mediaItem.id || mediaItem._id,
    path,
    filename: mediaItem.filename,
    title: mediaItem.title || mediaItem.filename || "Untitled",
    imageUrl: path,
    url: path,
  };
};
