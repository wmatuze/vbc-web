import { API_URL, getAuthToken } from "./core";

// File types the server now accepts
const ALLOWED_TYPES = /^(image\/(jpeg|png|gif|webp)|audio\/(mpeg|wav|aac|ogg|mp4)|video\/(mp4|quicktime|webm)|application\/pdf)$/;
const MAX_SIZE_BYTES = 100 * 1024 * 1024; // 100 MB — Cloudinary enforces its own hard limits

/**
 * Upload a file to the backend, which streams it to Cloudinary.
 * Returns the media record including the permanent Cloudinary URL in `path`.
 */
export const uploadFile = async (file, title, category) => {
  if (!ALLOWED_TYPES.test(file.type)) {
    throw new Error(
      "File type not supported. Allowed: images (JPG/PNG/GIF/WebP), audio (MP3/WAV/AAC), video (MP4), PDF."
    );
  }

  if (file.size > MAX_SIZE_BYTES) {
    throw new Error("File exceeds the 100 MB limit.");
  }

  const token = getAuthToken();
  if (!token) throw new Error("Not authenticated. Please log in to upload files.");

  const formData = new FormData();
  formData.append("file", file);
  formData.append("title", title || file.name.replace(/\.[^.]+$/, ""));
  formData.append("category", category || "general");

  const response = await fetch(`${API_URL}/api/upload`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    let msg = `Upload failed (${response.status})`;
    try { msg = JSON.parse(body).error || msg; } catch {}
    throw new Error(msg);
  }

  const data = await response.json();

  // Normalise: path is always the full Cloudinary URL for new uploads
  return {
    ...data,
    fileUrl: data.path || data.url,
    thumbnailUrl: data.path || data.url,
  };
};
