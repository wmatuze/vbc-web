const cloudinary = require("cloudinary").v2;
const { Readable } = require("stream");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure:     true,
});

/**
 * Map an upload category to the Cloudinary folder it lives in.
 * All assets are grouped under a top-level "vbc" namespace.
 */
const CATEGORY_FOLDER = {
  leadership:    "vbc/leadership",
  events:        "vbc/events",
  sermons:       "vbc/sermons",
  "cell-groups": "vbc/cell-groups",
  "cell_groups": "vbc/cell-groups",
  zones:         "vbc/zones",
  resources:     "vbc/resources",
  audio:         "vbc/audio",
  gallery:       "vbc/gallery",
  media:         "vbc/media",
  general:       "vbc/general",
};

const folderFor = (category) =>
  CATEGORY_FOLDER[category] ?? "vbc/general";

/**
 * Upload a Buffer to Cloudinary and return the result.
 * resource_type "auto" handles images, audio, video, and raw files (PDF).
 */
const uploadBuffer = (buffer, options = {}) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: "auto", ...options },
      (err, result) => (err ? reject(err) : resolve(result)),
    );
    Readable.from(buffer).pipe(stream);
  });

module.exports = { cloudinary, folderFor, uploadBuffer };
