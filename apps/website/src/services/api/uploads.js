// File upload API functions
import { API_URL, getAuthToken } from "./core";

/**
 * Upload a file using FormData
 * @param {File} file - The file to upload
 * @param {string} title - Optional title for the file
 * @param {string} category - Optional category for the file
 * @param {Function} onProgress - Optional progress callback
 * @returns {Promise<Object>} Promise resolving to the uploaded file data
 */
export const uploadFile = async (file, title, category, onProgress) => {
  try {
    console.log("Uploading file:", file.name, "to", `${API_URL}/api/upload`);
    console.log("File size:", file.size, "bytes");
    console.log("File type:", file.type);

    // Validate file type - server accepts only images
    if (!file.type.match(/^image\//)) {
      throw new Error("Only image files are allowed (jpg, png, gif)");
    }

    // Check file size - limit to 5MB like the server
    if (file.size > 5 * 1024 * 1024) {
      throw new Error("File is too large. Maximum size allowed is 5MB");
    }

    // Get the current auth token (getAuthToken handles dev token creation automatically)
    const token = getAuthToken();
    console.log("Auth token available:", !!token);

    if (!token) {
      throw new Error("Not authenticated. Please log in to upload files.");
    }

    // Try multiple authentication methods
    try {
      // Try standard token in URL first
      const uploadUrlWithToken = token
        ? `${API_URL}/api/upload?token=${encodeURIComponent(token)}`
        : `${API_URL}/api/upload`;

      console.log("Attempting upload with token in URL:", uploadUrlWithToken);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", title || file.name.split(".")[0]);
      formData.append("category", category || "general");

      // Add token as form field
      if (token) {
        formData.append("token", token);
      }

      const headers = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(uploadUrlWithToken, {
        method: "POST",
        headers: headers,
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Upload successful with token in URL:", data);

        if (data.path) {
          data.fileUrl = data.path.startsWith("http")
            ? data.path
            : `${API_URL}${data.path}`;
          data.thumbnailUrl = data.path.startsWith("http")
            ? data.path
            : `${API_URL}${data.path}`;
        }

        return data;
      } else {
        // Try direct upload as a fallback in development
        if (
          process.env.NODE_ENV === "development" ||
          window.location.hostname === "localhost"
        ) {
          console.log(
            "Standard upload failed, trying direct upload for development",
          );
          return directUpload(file, title, category, onProgress);
        }

        // If not in development or direct upload failed, throw the original error
        const errorText = await response.text();
        console.error(
          `Upload failed with status ${response.status}:`,
          errorText,
        );

        try {
          const jsonError = JSON.parse(errorText);
          throw new Error(
            `Upload failed (${response.status}): ${jsonError.error || jsonError.message || "Unknown error"}`,
          );
        } catch (e) {
          throw new Error(
            `Upload failed (${response.status}): ${errorText || "Unknown error"}`,
          );
        }
      }
    } catch (error) {
      // Try direct upload as fallback for development
      if (
        (process.env.NODE_ENV === "development" ||
          window.location.hostname === "localhost") &&
        (error.message.includes("token") ||
          error.message.includes("authorization"))
      ) {
        console.log(
          "Token-based upload failed, trying direct upload for development",
        );
        return directUpload(file, title, category, onProgress);
      }
      throw error;
    }
  } catch (error) {
    console.error("Error in uploadFile:", error);
    throw error;
  }
};

/**
 * DirectUpload - A fallback method for development environments
 * This bypasses authentication by using a different endpoint or approach
 * @param {File} file - The file to upload
 * @param {string} title - Optional title for the file
 * @param {string} category - Optional category for the file
 * @param {Function} onProgress - Optional progress callback
 * @returns {Promise<Object>} Promise resolving to the uploaded file data
 */
export const directUpload = async (file, title, category, onProgress) => {
  console.log("Attempting direct upload without authentication tokens");

  try {
    // Create a FormData object without authentication tokens
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title || file.name.split(".")[0]);
    formData.append("category", category || "general");
    formData.append("mode", "development");

    // Option 1: Try the direct media endpoint
    try {
      console.log("Trying direct media upload endpoint");
      const response = await fetch(`${API_URL}/media/upload`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Direct media upload successful:", data);

        // Normalize the response
        return {
          id: data.id || `temp-${Date.now()}`,
          path: data.path || data.url || `/uploads/${file.name}`,
          filename: file.name,
          title: title || file.name,
          category: category || "general",
          fileUrl: data.url || data.path || `/uploads/${file.name}`,
          thumbnailUrl: data.url || data.path || `/uploads/${file.name}`,
        };
      }
      // Fall through to next option if this fails
    } catch (error) {
      console.log("Direct media upload failed:", error);
      // Fall through to next option
    }

    // Option 2: Try a file upload without authentication
    try {
      console.log("Trying file upload without authentication");
      const response = await fetch(`${API_URL}/upload`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Unauthenticated upload successful:", data);

        // Normalize the response
        return {
          id: data.id || `temp-${Date.now()}`,
          path: data.path || data.url || `/uploads/${file.name}`,
          filename: file.name,
          title: title || file.name,
          category: category || "general",
          fileUrl: data.url || data.path || `/uploads/${file.name}`,
          thumbnailUrl: data.url || data.path || `/uploads/${file.name}`,
        };
      }
      // Fall through to next option if this fails
    } catch (error) {
      console.log("Unauthenticated upload failed:", error);
      // Fall through to next option
    }

    // All real upload options have failed – surface the error to the caller
    throw new Error(
      "Upload failed: could not reach the server upload endpoint. " +
        "Please ensure you are logged in and the server is running.",
    );
  } catch (error) {
    console.error("Direct upload error:", error);
    throw error;
  }
};
