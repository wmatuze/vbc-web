/**
 * mockUpload.js - Provides browser-only media upload handling for development
 * This module simulates server-side file upload functionality when the actual server
 * upload endpoints are not working or unavailable.
 */

// Function to create a browser-only upload that mimics server-side storage
export const uploadMediaLocally = async (file, title, category) => {
  console.log("Using browser-only mock upload for:", file.name);

  return new Promise((resolve, reject) => {
    try {
      // Validate the file type
      if (!file.type.match(/^image\//)) {
        reject(new Error("Only image files are allowed (jpg, png, gif)"));
        return;
      }

      // Check file size - limit to 5MB
      if (file.size > 5 * 1024 * 1024) {
        reject(new Error("File is too large. Maximum size allowed is 5MB"));
        return;
      }

      // Create a local URL for the file
      const localUrl = URL.createObjectURL(file);

      // Generate a unique ID for the file
      const id = `local-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

      // Create a mock response that mimics server response
      const mockResponse = {
        id: id,
        filename: file.name,
        title: title || file.name.split(".")[0],
        category: category || "general",
        path: `/uploads/${file.name}`,
        uploadDate: new Date().toISOString(),
        localUrl: localUrl, // This is the key property for local files
        fileUrl: localUrl,
        thumbnailUrl: localUrl,
        size: file.size,
        type: file.type,
        isLocal: true // Mark this as a local file
      };

      console.log("Created mock media response:", mockResponse);

      // Store in sessionStorage to persist during the session
      try {
        // Get existing media from session storage
        const existingMedia = JSON.parse(sessionStorage.getItem("cachedMedia") || "[]");
        
        // Add the new media at the beginning
        existingMedia.unshift(mockResponse);
        
        // Save back to session storage
        sessionStorage.setItem("cachedMedia", JSON.stringify(existingMedia));
        console.log(`Saved mock media to session storage (${existingMedia.length} items total)`);
        
        // Also update localStorage backup if available
        try {
          const backupMedia = JSON.parse(localStorage.getItem("mediaBackup") || "[]");
          backupMedia.unshift(mockResponse);
          localStorage.setItem("mediaBackup", JSON.stringify(backupMedia));
        } catch (e) {
          console.warn("Could not update localStorage backup:", e);
        }
      } catch (storageError) {
        console.error("Error saving media to session storage:", storageError);
      }

      // Simulate a short delay to mimic network request
      setTimeout(() => {
        resolve(mockResponse);
      }, 500);
    } catch (error) {
      console.error("Mock upload error:", error);
      reject(error);
    }
  });
};

// Helper function to get a list of locally stored media
export const getLocalMedia = () => {
  try {
    const cachedMedia = sessionStorage.getItem("cachedMedia");
    if (cachedMedia) {
      return JSON.parse(cachedMedia).filter(media => media.isLocal === true);
    }
  } catch (error) {
    console.error("Error retrieving local media:", error);
  }
  return [];
};

// Helper function to delete a local media item
export const deleteLocalMedia = (id) => {
  try {
    const cachedMedia = JSON.parse(sessionStorage.getItem("cachedMedia") || "[]");
    const updatedMedia = cachedMedia.filter(media => media.id !== id);
    sessionStorage.setItem("cachedMedia", JSON.stringify(updatedMedia));
    
    // Also update localStorage if available
    try {
      const backupMedia = JSON.parse(localStorage.getItem("mediaBackup") || "[]");
      const updatedBackup = backupMedia.filter(media => media.id !== id);
      localStorage.setItem("mediaBackup", JSON.stringify(updatedBackup));
    } catch (e) {
      console.warn("Could not update localStorage backup during delete:", e);
    }
    
    console.log(`Deleted local media item: ${id}`);
    return true;
  } catch (error) {
    console.error("Error deleting local media:", error);
    return false;
  }
}; 