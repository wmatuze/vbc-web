import React, { useState, useEffect, useCallback, useRef } from "react";
import { deleteMedia, uploadFile } from "../../services/api";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import useErrorHandler from "../../hooks/useErrorHandler";
import { validateField } from "../../utils/validationUtils";
import {
  validateMedia,
  mediaValidationRules,
} from "../../utils/mediaValidation";
import {
  Squares2X2Icon as ViewGridIcon,
  ListBulletIcon as ViewListIcon,
  ArrowUpTrayIcon as UploadIcon,
  TrashIcon,
  DocumentDuplicateIcon as DuplicateIcon,
  EyeIcon,
  ArrowPathIcon as RefreshIcon,
  XMarkIcon as XIcon,
  MagnifyingGlassIcon as SearchIcon,
  FunnelIcon as FilterIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import config from "../../config";
import placeholderImage from "../../assets/placeholders/default-image.svg";

const API_URL = config.API_URL;

class MediaErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Media manager error caught by boundary:", error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 bg-red-50 rounded border border-red-200">
          <h3 className="text-xl font-semibold text-red-700 mb-4">
            Something went wrong with the Media Manager
          </h3>
          <p className="mb-4 text-red-600">
            {this.state.error?.message || "Unknown error occurred"}
          </p>
          <button
            onClick={this.resetError}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

const MediaManager = () => {
  // Use React Query for fetching media
  const {
    data: mediaData = [],
    isLoading: mediaLoading,
    error: mediaError,
    refetch: refetchMedia,
  } = useMediaQuery();

  // Use our custom error handling hook
  const { error, errorMessage, handleError, clearError, withErrorHandling } =
    useErrorHandler("MediaManager");

  // Local state for media (will be updated with mediaData)
  const [media, setMedia] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("general");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const fileInputRef = useRef(null);
  const dropZoneRef = useRef(null);
  const isMounted = useRef(true);

  useEffect(() => {
    // Track component mounted state
    isMounted.current = true;

    return () => {
      isMounted.current = false;
    };
  }, []);

  // Update local media state when mediaData changes
  useEffect(() => {
    if (mediaData && mediaData.length > 0) {
      console.log("Fetched media data:", mediaData);

      // Validate media data
      const validData = mediaData.filter(
        (item) => item && item.id && (item.path || item.filename)
      );

      if (validData.length !== mediaData.length) {
        console.warn(
          `Filtered out ${mediaData.length - validData.length} invalid media items`
        );
      }

      // Store media items in both state and session storage for backup
      setMedia(validData);

      // Keep a local cache to ensure persistence
      try {
        sessionStorage.setItem("cachedMedia", JSON.stringify(validData));
        localStorage.setItem("mediaBackup", JSON.stringify(validData));
        const timestamp = new Date().toISOString();
        sessionStorage.setItem("mediaLastFetched", timestamp);
        localStorage.setItem("mediaLastFetched", timestamp);
        console.log("Media data cached successfully at", timestamp);
      } catch (cacheErr) {
        console.error("Failed to cache media data:", cacheErr);
      }

      clearError();
    } else if (mediaError) {
      console.error("Error fetching media:", mediaError);
      handleError(mediaError, "Failed to load media");

      // Try to recover from cached data if available
      const cachedData =
        sessionStorage.getItem("cachedMedia") ||
        localStorage.getItem("mediaBackup");
      if (cachedData) {
        try {
          const parsedData = JSON.parse(cachedData);
          console.log(
            "Recovered media from cache:",
            parsedData.length,
            "items"
          );
          setMedia(parsedData);
        } catch (cacheErr) {
          console.error("Error parsing cached media:", cacheErr);
        }
      }
    }
  }, [mediaData, mediaError]);

  // Initialize media from cache on component load
  useEffect(() => {
    console.log("Media manager component loaded");

    // First try to load from session storage (faster)
    const cachedData = sessionStorage.getItem("cachedMedia");
    if (cachedData) {
      try {
        const parsedData = JSON.parse(cachedData);
        console.log(
          "Loaded media from session cache:",
          parsedData.length,
          "items"
        );
        setMedia(parsedData);
      } catch (err) {
        console.error("Error parsing session cached media:", err);

        // Try local storage as fallback
        const localBackup = localStorage.getItem("mediaBackup");
        if (localBackup) {
          try {
            const localData = JSON.parse(localBackup);
            console.log(
              "Loaded media from local backup:",
              localData.length,
              "items"
            );
            setMedia(localData);
          } catch (localErr) {
            console.error("Error parsing local cached media:", localErr);
          }
        }
      }
    } else {
      console.log("No cached media found, waiting for server data");
    }

    // Set up less frequent refresh intervals to avoid overriding user uploads
    const refreshInterval = setInterval(() => {
      console.log("Performing scheduled media refresh");
      refetchMedia();
    }, 60000); // Reduced frequency to once per minute

    return () => {
      clearInterval(refreshInterval);
    };
  }, [refetchMedia, refreshTrigger]);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelection(files[0]);
    }
  };

  const handleFileSelection = (file) => {
    if (!file) return;

    // Validate file using our validation rules
    const { isValid, errors } = validateMedia({ file });

    if (!isValid && errors.file) {
      setUploadError(errors.file);
      return;
    }

    setSelectedFile(file);
    setTitle(file.name.split(".").slice(0, -1).join("."));
    setPreviewUrl(URL.createObjectURL(file));
    setUploadError(null);

    // Validate title field
    validateField(
      "title",
      file.name.split(".").slice(0, -1).join("."),
      mediaValidationRules.title,
      formErrors,
      setFormErrors
    );
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelection(file);
    }
  };

  const handleSubmit = withErrorHandling(
    async (e) => {
      e.preventDefault();

      // Validate all fields before submission
      const { isValid, errors } = validateMedia({
        file: selectedFile,
        title,
        category,
      });

      if (!isValid) {
        // Update form errors and stop submission
        setFormErrors(errors);
        setUploadError("Please fix the form errors before submitting");
        return;
      }

      try {
        setIsUploading(true);
        setUploadProgress(0);
        setUploadError(null);

        const uploadedMedia = await uploadFile(
          selectedFile,
          title || selectedFile.name,
          category,
          (progress) => {
            // Handle the new progress object format
            if (progress && typeof progress.percent === "number") {
              setUploadProgress(progress.percent);
            } else if (progress && progress.total) {
              // Fallback for old format
              setUploadProgress(
                Math.round((progress.loaded / progress.total) * 100)
              );
            } else if (progress && progress.lengthComputable) {
              // Fallback for XMLHttpRequest event format
              setUploadProgress(
                Math.round((progress.loaded / progress.total) * 100)
              );
            }
          }
        );

        if (!isMounted.current) return;

        console.log("Media upload successful:", uploadedMedia);

        // Ensure the path is properly set
        if (!uploadedMedia.path && uploadedMedia.filename) {
          uploadedMedia.path = `/uploads/${uploadedMedia.filename}`;
        }

        // Add to media state with proper preview URLs
        const mediaWithUrls = {
          ...uploadedMedia,
          // Add upload date for sorting
          uploadDate: new Date().toISOString(),
          // Ensure fileUrl and thumbnailUrl are properly set
          fileUrl: uploadedMedia.path.startsWith("http")
            ? uploadedMedia.path
            : `${API_URL}${uploadedMedia.path}`,
          thumbnailUrl: uploadedMedia.path.startsWith("http")
            ? uploadedMedia.path
            : `${API_URL}${uploadedMedia.path}`,
        };

        // Update state with new media at the beginning of the array
        setMedia((prev) => {
          // Check if we already have this media item (by id)
          const exists = prev.some((item) => item.id === mediaWithUrls.id);
          if (exists) {
            // Replace the existing item
            return prev.map((item) =>
              item.id === mediaWithUrls.id ? mediaWithUrls : item
            );
          }
          // Add new item to beginning
          return [mediaWithUrls, ...prev];
        });

        setSelectedFile(null);
        setTitle("");
        setPreviewUrl(null);
        setUploadProgress(0);
        setUploadSuccess(true);

        // Update cache with new media included
        const updatedMedia = [
          mediaWithUrls,
          ...media.filter((item) => item.id !== mediaWithUrls.id),
        ];
        sessionStorage.setItem("cachedMedia", JSON.stringify(updatedMedia));
        localStorage.setItem("mediaBackup", JSON.stringify(updatedMedia));
        console.log(
          "Updated media cache with new upload:",
          mediaWithUrls.title || mediaWithUrls.filename
        );

        // Close modal after short delay
        setTimeout(() => {
          setShowUploadModal(false);
          setUploadSuccess(false);
        }, 1500);
      } catch (err) {
        if (!isMounted.current) return;
        console.error("Upload error:", err);
        setUploadError(`Failed to upload file: ${err.message}`);
        throw err; // Re-throw for error handler
      } finally {
        if (isMounted.current) {
          setIsUploading(false);
        }
      }
    },
    {
      context: "Media Upload",
    }
  );

  const handleDelete = withErrorHandling(
    async (id) => {
      if (!window.confirm("Are you sure you want to delete this media item?")) {
        return;
      }

      await deleteMedia(id);
      setMedia((prev) => prev.filter((item) => item.id !== id));

      // Update cache
      const updatedMedia = media.filter((item) => item.id !== id);
      sessionStorage.setItem("cachedMedia", JSON.stringify(updatedMedia));
      localStorage.setItem("mediaBackup", JSON.stringify(updatedMedia));
    },
    {
      context: "Media Deletion",
    }
  );

  const copyToClipboard = withErrorHandling(
    (text) => {
      navigator.clipboard.writeText(text).then(
        () => {
          // Show success message
          const el = document.createElement("div");
          el.className =
            "fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg";
          el.textContent = "URL copied to clipboard!";
          document.body.appendChild(el);
          setTimeout(() => el.remove(), 2000);
        },
        (err) => {
          console.error("Failed to copy:", err);
          throw err; // Re-throw for error handler
        }
      );
    },
    {
      context: "Copy to Clipboard",
    }
  );

  const filteredMedia = media.filter((item) => {
    if (filterCategory !== "all" && item.category !== filterCategory)
      return false;
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        item.title?.toLowerCase().includes(searchLower) ||
        item.filename?.toLowerCase().includes(searchLower) ||
        item.category?.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  // Helper function to get the full URL for media items
  const getMediaImageUrl = useCallback((media) => {
    if (!media) return "";

    // If it's already a full URL
    if (media.fileUrl && media.fileUrl.startsWith("http")) {
      return media.fileUrl;
    }

    // If path is available
    if (media.path) {
      return media.path.startsWith("http")
        ? media.path
        : `${API_URL}${media.path}`;
    }

    // Fallback to filename
    if (media.filename) {
      return `${API_URL}/uploads/${media.filename}`;
    }

    return "";
  }, []);

  return (
    <MediaErrorBoundary>
      <div className="p-6">
        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <ExclamationCircleIcon className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{errorMessage}</p>
              </div>
              <div className="ml-auto pl-3">
                <div className="-mx-1.5 -my-1.5">
                  <button
                    type="button"
                    onClick={clearError}
                    className="inline-flex rounded-md p-1.5 text-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <span className="sr-only">Dismiss</span>
                    <XIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Media Library</h2>
            <p className="mt-1 text-sm text-gray-500">
              Manage your images and media files
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowUploadModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <UploadIcon className="h-5 w-5 mr-2" />
              Upload Media
            </button>

            <button
              onClick={() => {
                setRefreshTrigger((prev) => prev + 1);
                refetchMedia();
              }}
              className="p-2 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-lg"
              title="Refresh media"
            >
              <RefreshIcon className="h-5 w-5" />
            </button>

            <button
              onClick={() =>
                setViewMode((prev) => (prev === "grid" ? "list" : "grid"))
              }
              className="p-2 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-lg"
              title="Toggle view mode"
            >
              {viewMode === "grid" ? (
                <ViewListIcon className="h-5 w-5" />
              ) : (
                <ViewGridIcon className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search media..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <div className="relative inline-block text-left">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg"
            >
              <option value="all">All Categories</option>
              <option value="general">General</option>
              <option value="sermon">Sermon</option>
              <option value="event">Event</option>
              <option value="ministry">Ministry</option>
            </select>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <ExclamationCircleIcon className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Media Grid/List */}
        {mediaLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          </div>
        ) : filteredMedia.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No media items found</p>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredMedia.map((item) => (
              <div
                key={item.id}
                className="relative group rounded-lg overflow-hidden bg-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="relative pb-[75%] bg-gray-200">
                  <img
                    src={getMediaImageUrl(item)}
                    alt={item.title || item.filename}
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                      console.error("Image load error:", item);
                      e.target.src = placeholderImage;
                      e.target.alt = "Image not found";
                    }}
                  />
                </div>
                <div className="p-2">
                  <h3 className="text-sm font-medium text-gray-900 truncate">
                    {item.title || item.filename}
                  </h3>
                  <p className="text-xs text-gray-500 truncate">
                    {item.category || "Uncategorized"}
                  </p>
                </div>
                <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    onClick={() => {
                      setSelectedMedia(item);
                      setShowPreviewModal(true);
                    }}
                    className="p-1 bg-black/50 hover:bg-black/70 rounded-lg text-white"
                    title="Preview"
                  >
                    <EyeIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => copyToClipboard(getMediaImageUrl(item))}
                    className="p-1 bg-black/50 hover:bg-black/70 rounded-lg text-white"
                    title="Copy URL"
                  >
                    <DuplicateIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1 bg-black/50 hover:bg-black/70 rounded-lg text-white"
                    title="Delete"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Media
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredMedia.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-12 w-12 rounded overflow-hidden">
                        <img
                          src={getMediaImageUrl(item)}
                          alt={item.title || item.filename}
                          className="h-full w-full object-cover"
                          loading="lazy"
                          onError={(e) => {
                            e.target.src = `${API_URL}/assets/media/placeholder.jpg`;
                            e.target.alt = "Image not found";
                          }}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {item.title || item.filename}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                        {item.category || "Uncategorized"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => {
                          setSelectedMedia(item);
                          setShowPreviewModal(true);
                        }}
                        className="text-gray-400 hover:text-gray-500 mx-2"
                        title="Preview"
                      >
                        <EyeIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => copyToClipboard(getMediaImageUrl(item))}
                        className="text-gray-400 hover:text-gray-500 mx-2"
                        title="Copy URL"
                      >
                        <DuplicateIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-400 hover:text-red-500 mx-2"
                        title="Delete"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 overflow-y-auto z-50">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Upload Media
                      </h3>

                      <div className="mt-4">
                        <div
                          ref={dropZoneRef}
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                          onDrop={handleDrop}
                          className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg ${
                            isDragging
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-300 hover:border-gray-400"
                          }`}
                        >
                          <div className="space-y-1 text-center">
                            <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
                            <div className="flex text-sm text-gray-600">
                              <label className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                                <span>Upload a file</span>
                                <input
                                  ref={fileInputRef}
                                  type="file"
                                  className="sr-only"
                                  accept="image/*"
                                  onChange={handleFileChange}
                                />
                              </label>
                              <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs text-gray-500">
                              PNG, JPG, GIF up to 5MB
                            </p>
                          </div>
                        </div>

                        {uploadError && (
                          <p className="mt-2 text-sm text-red-600">
                            {uploadError}
                          </p>
                        )}

                        {selectedFile && (
                          <div className="mt-4">
                            <div className="relative rounded-lg overflow-hidden">
                              <img
                                src={previewUrl}
                                alt="Preview"
                                className="w-full h-48 object-cover"
                              />
                              <button
                                onClick={() => {
                                  setSelectedFile(null);
                                  setPreviewUrl(null);
                                  setTitle("");
                                }}
                                className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white hover:bg-black/70"
                              >
                                <XIcon className="h-4 w-4" />
                              </button>
                            </div>

                            <div className="mt-4 space-y-4">
                              <div>
                                <label
                                  htmlFor="title"
                                  className={`block text-sm font-medium ${formErrors.title ? "text-red-500" : "text-gray-700"}`}
                                >
                                  Title*
                                </label>
                                <input
                                  type="text"
                                  id="title"
                                  value={title}
                                  onChange={(e) => {
                                    setTitle(e.target.value);
                                    validateField(
                                      "title",
                                      e.target.value,
                                      mediaValidationRules.title,
                                      formErrors,
                                      setFormErrors
                                    );
                                  }}
                                  className={`mt-1 block w-full border ${formErrors.title ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                                />
                                {formErrors.title && (
                                  <p className="mt-1 text-xs text-red-500">
                                    {formErrors.title}
                                  </p>
                                )}
                              </div>

                              <div>
                                <label
                                  htmlFor="category"
                                  className={`block text-sm font-medium ${formErrors.category ? "text-red-500" : "text-gray-700"}`}
                                >
                                  Category*
                                </label>
                                <select
                                  id="category"
                                  value={category}
                                  onChange={(e) => {
                                    setCategory(e.target.value);
                                    validateField(
                                      "category",
                                      e.target.value,
                                      mediaValidationRules.category,
                                      formErrors,
                                      setFormErrors
                                    );
                                  }}
                                  className={`mt-1 block w-full border ${formErrors.category ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                                >
                                  <option value="general">General</option>
                                  <option value="sermons">Sermons</option>
                                  <option value="events">Events</option>
                                  <option value="leadership">Leadership</option>
                                  <option value="cell-groups">
                                    Cell Groups
                                  </option>
                                  <option value="banners">Banners</option>
                                  <option value="gallery">Gallery</option>
                                </select>
                                {formErrors.category && (
                                  <p className="mt-1 text-xs text-red-500">
                                    {formErrors.category}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={!selectedFile || isUploading}
                    className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white sm:ml-3 sm:w-auto sm:text-sm ${
                      !selectedFile || isUploading
                        ? "bg-blue-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    }`}
                  >
                    {isUploading ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Uploading ({uploadProgress}%)
                      </>
                    ) : uploadSuccess ? (
                      <>
                        <CheckCircleIcon className="h-5 w-5 mr-2" />
                        Uploaded!
                      </>
                    ) : (
                      "Upload"
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowUploadModal(false);
                      setSelectedFile(null);
                      setPreviewUrl(null);
                      setTitle("");
                      setUploadError(null);
                    }}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Preview Modal */}
        {showPreviewModal && selectedMedia && (
          <div className="fixed inset-0 overflow-y-auto z-50">
            <div className="flex items-center justify-center min-h-screen">
              <div
                className="fixed inset-0 bg-black opacity-75"
                onClick={() => setShowPreviewModal(false)}
              ></div>

              <div className="relative bg-white rounded-lg overflow-hidden shadow-xl max-w-3xl w-full m-4">
                <div className="absolute top-0 right-0 pt-4 pr-4">
                  <button
                    onClick={() => setShowPreviewModal(false)}
                    className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <XIcon className="h-6 w-6" />
                  </button>
                </div>

                <div className="p-6">
                  <img
                    src={getMediaImageUrl(selectedMedia)}
                    alt={selectedMedia.title || selectedMedia.filename}
                    className="w-full h-auto rounded-lg"
                    onError={(e) => {
                      e.target.src = placeholderImage;
                      e.target.alt = "Image not found";
                    }}
                  />

                  <div className="mt-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      {selectedMedia.title || selectedMedia.filename}
                    </h3>

                    <dl className="mt-2 border-t border-gray-200 pt-4">
                      <div className="sm:grid sm:grid-cols-3 sm:gap-4">
                        <dt className="text-sm font-medium text-gray-500">
                          Category
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                          {selectedMedia.category || "Uncategorized"}
                        </dd>
                      </div>
                      <div className="mt-4 sm:grid sm:grid-cols-3 sm:gap-4">
                        <dt className="text-sm font-medium text-gray-500">
                          URL
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                          <div className="flex items-center">
                            <span className="flex-1 font-mono text-sm truncate">
                              {getMediaImageUrl(selectedMedia)}
                            </span>
                            <button
                              onClick={() =>
                                copyToClipboard(getMediaImageUrl(selectedMedia))
                              }
                              className="ml-4 p-1 text-gray-400 hover:text-gray-500"
                            >
                              <DuplicateIcon className="h-5 w-5" />
                            </button>
                          </div>
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>

                <div className="bg-gray-50 px-6 py-3 flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleDelete(selectedMedia.id)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <TrashIcon className="h-5 w-5 mr-2" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </MediaErrorBoundary>
  );
};

export default MediaManager;
