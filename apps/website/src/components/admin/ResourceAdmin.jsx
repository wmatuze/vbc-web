import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getAuthToken } from "../../services/api/core";
import {
  Plus,
  Edit,
  Trash2,
  Download,
  Eye,
  Upload,
  Search,
  Filter,
  File,
  Video,
  Music,
  Link as LinkIcon,
  Image,
  FileText,
  Star,
  X,
  Save,
  CloudUpload,
  ChevronDown,
  ToggleRight,
  ToggleLeft,
} from "lucide-react";

const ResourceAdmin = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [selectedResource, setSelectedResource] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterType, setFilterType] = useState("");
  const fileInputRef = useRef(null);

  const [resourceForm, setResourceForm] = useState({
    title: "",
    description: "",
    type: "document",
    category: "general",
    url: "",
    tags: [],
    featured: false,
    author: { name: "", email: "" },
  });

  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  const typeIcons = {
    document: <File />,
    video: <Video />,
    audio: <Music />,
    link: <LinkIcon />,
    image: <Image />,
    presentation: <FileText />,
  };

  useEffect(() => {
    fetchResources();
  }, []);

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      fetchResources();
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [searchTerm, filterCategory, filterType]);

  const fetchResources = async () => {
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      if (filterCategory) params.append("category", filterCategory);
      if (filterType) params.append("type", filterType);

      const response = await fetch(`/api/resources?${params}`);
      const data = await response.json();

      if (data.success) {
        setResources(data.data);
      }
    } catch (error) {
      console.error("Error fetching resources:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateResource = () => {
    setModalType("create");
    setSelectedResource(null);
    setResourceForm({
      title: "",
      description: "",
      type: "document",
      category: "general",
      url: "",
      tags: [],
      featured: false,
      author: { name: "", email: "" },
    });
    setShowModal(true);
  };

  const handleEditResource = (resource) => {
    setModalType("edit");
    setSelectedResource(resource);
    setResourceForm({
      ...resource,
      tags: resource.tags || [],
    });
    setShowModal(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Auto-detect type based on file extension
      const extension = file.name.split(".").pop().toLowerCase();
      let detectedType = "document";

      if (["jpg", "jpeg", "png", "gif", "webp"].includes(extension)) {
        detectedType = "image";
      } else if (["mp4", "avi", "mov", "wmv", "webm"].includes(extension)) {
        detectedType = "video";
      } else if (["mp3", "wav", "ogg", "aac"].includes(extension)) {
        detectedType = "audio";
      } else if (["ppt", "pptx"].includes(extension)) {
        detectedType = "presentation";
      }

      setResourceForm((prev) => ({
        ...prev,
        type: detectedType,
        title: prev.title || file.name.replace(/\.[^/.]+$/, ""),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!resourceForm.title.trim()) {
      alert("Please enter a title for the resource");
      return;
    }

    if (!resourceForm.description.trim()) {
      alert("Please enter a description for the resource");
      return;
    }

    if (resourceForm.type === "link" && !resourceForm.url.trim()) {
      alert("Please enter a URL for link resources");
      return;
    }

    if (
      resourceForm.type !== "link" &&
      !selectedResource &&
      !fileInputRef.current?.files[0]
    ) {
      alert("Please select a file to upload");
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();

      // Add file if selected
      if (fileInputRef.current?.files[0]) {
        formData.append("file", fileInputRef.current.files[0]);
      }

      // Add form data with validation
      Object.keys(resourceForm).forEach((key) => {
        const value = resourceForm[key];
        if (key === "tags") {
          formData.append(key, JSON.stringify(value || []));
        } else if (key === "author") {
          formData.append(
            key,
            JSON.stringify(value || { name: "", email: "" }),
          );
        } else if (value !== null && value !== undefined) {
          formData.append(key, String(value));
        }
      });

      const url = selectedResource
        ? `/api/resources/${selectedResource._id}`
        : "/api/resources";

      const method = selectedResource ? "PUT" : "POST";

      // Use fetch API for better error handling
      const response = await fetch(url, {
        method: method,
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: formData,
      });

      setUploading(false);
      setUploadProgress(100);

      if (response.ok) {
        const result = await response.json();
        console.log("Resource saved successfully:", result);
        await fetchResources();
        setShowModal(false);
        setUploadProgress(0);
        // Show success message if you have a toast system
      } else {
        const errorData = await response.text();
        console.error("Error saving resource:", response.status, errorData);
        throw new Error(`HTTP ${response.status}: ${errorData}`);
      }
    } catch (error) {
      console.error("Error submitting resource:", error);
      setUploading(false);
      setUploadProgress(0);

      // Show error message to user
      alert(
        `Error saving resource: ${error.message || "Unknown error occurred"}`,
      );
    }
  };

  const handleDelete = async (resourceId) => {
    if (window.confirm("Are you sure you want to delete this resource?")) {
      try {
        const response = await fetch(`/api/resources/${resourceId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
          },
        });

        if (response.ok) {
          fetchResources();
        }
      } catch (error) {
        console.error("Error deleting resource:", error);
      }
    }
  };

  const toggleFeatured = async (resource) => {
    try {
      const response = await fetch(`/api/resources/${resource._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify({ featured: !resource.featured }),
      });

      if (response.ok) {
        fetchResources();
      }
    } catch (error) {
      console.error("Error toggling featured status:", error);
    }
  };

  const addTag = (tag) => {
    if (tag && !resourceForm.tags.includes(tag)) {
      setResourceForm((prev) => ({
        ...prev,
        tags: [...prev.tags, tag],
      }));
    }
  };

  const removeTag = (tagToRemove) => {
    setResourceForm((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Resource Management
        </h1>
        <div className="flex space-x-3">
          <button
            onClick={handleCreateResource}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            <Plus />
            <span>Add Resource</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">All Categories</option>
            <option value="audio_sermons">Audio Sermons</option>
            <option value="foundation">Foundation</option>
            <option value="discipleship">Discipleship</option>
            <option value="leadership">Leadership</option>
            <option value="ministry">Ministry</option>
            <option value="bible_study">Bible Study</option>
            <option value="worship">Worship</option>
            <option value="general">General</option>
          </select>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">All Types</option>
            <option value="document">Documents</option>
            <option value="video">Videos</option>
            <option value="audio">Audio</option>
            <option value="presentation">Presentations</option>
            <option value="image">Images</option>
            <option value="link">Links</option>
          </select>

          <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
            {resources.length} resources found
          </div>
        </div>
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map((resource) => (
          <motion.div
            key={resource._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-600 overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="text-blue-600 dark:text-blue-400 text-xl">
                    {typeIcons[resource.type] || <File />}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {resource.title}
                    </h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        {resource.category.replace("_", " ")}
                      </span>
                      {resource.featured && (
                        <Star className="text-yellow-500 text-sm" />
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col space-y-2">
                  <button
                    onClick={() => toggleFeatured(resource)}
                    className={`p-2 rounded transition-colors ${
                      resource.featured
                        ? "text-yellow-500 hover:text-yellow-600"
                        : "text-gray-400 hover:text-yellow-500"
                    }`}
                    title="Toggle Featured"
                  >
                    <Star />
                  </button>
                  <button
                    onClick={() => handleEditResource(resource)}
                    className="p-2 text-blue-600 hover:text-blue-700 dark:text-blue-400"
                    title="Edit Resource"
                  >
                    <Edit />
                  </button>
                  <button
                    onClick={() => handleDelete(resource._id)}
                    className="p-2 text-red-600 hover:text-red-700 dark:text-red-400"
                    title="Delete Resource"
                  >
                    <Trash2 />
                  </button>
                </div>
              </div>

              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
                {resource.description}
              </p>

              {resource.tags && resource.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-4">
                  {resource.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                  {resource.tags.length > 3 && (
                    <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded">
                      +{resource.tags.length - 3} more
                    </span>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center space-x-4">
                  <span className="flex items-center">
                    <Eye className="mr-1" />
                    {resource.views || 0}
                  </span>
                  <span className="flex items-center">
                    <Download className="mr-1" />
                    {resource.downloads || 0}
                  </span>
                  {resource.fileSizeFormatted && (
                    <span>{resource.fileSizeFormatted}</span>
                  )}
                </div>

                <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  Public
                </span>
              </div>

              <div className="mt-4 flex space-x-2">
                <button
                  onClick={() =>
                    window.open(
                      `/api/resources/${resource._id}/download`,
                      "_blank",
                    )
                  }
                  className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded transition-colors"
                >
                  {resource.type === "link" ? <Eye /> : <Download />}
                  <span>{resource.type === "link" ? "View" : "Download"}</span>
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {resources.length === 0 && (
        <div className="text-center py-12">
          <File className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No resources found
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Create your first resource to get started.
          </p>
        </div>
      )}

      {/* Resource Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {modalType === "create"
                      ? "Add New Resource"
                      : "Edit Resource"}
                  </h3>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <X />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* File Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      File Upload
                    </label>
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6">
                      <div className="text-center">
                        <CloudUpload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <div className="flex text-sm text-gray-600 dark:text-gray-400">
                          <label className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                            <span>Upload a file</span>
                            <input
                              ref={fileInputRef}
                              type="file"
                              onChange={handleFileChange}
                              className="sr-only"
                              accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.rtf,.odt,.ods,.odp,.jpg,.jpeg,.png,.gif,.webp,.mp3,.wav,.ogg,.aac,.mp4,.avi,.mov,.wmv,.webm,.mkv"
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Documents (PDF, DOC, PPT, TXT), Images (JPG, PNG,
                          GIF), Audio (MP3, WAV), Video (MP4, AVI) up to 50MB
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Upload Progress */}
                  {uploading && (
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  )}

                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Title *
                      </label>
                      <input
                        type="text"
                        value={resourceForm.title}
                        onChange={(e) =>
                          setResourceForm((prev) => ({
                            ...prev,
                            title: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Type
                      </label>
                      <select
                        value={resourceForm.type}
                        onChange={(e) =>
                          setResourceForm((prev) => ({
                            ...prev,
                            type: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="document">Document</option>
                        <option value="video">Video</option>
                        <option value="audio">Audio</option>
                        <option value="presentation">Presentation</option>
                        <option value="image">Image</option>
                        <option value="link">Link</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Description *
                    </label>
                    <textarea
                      value={resourceForm.description}
                      onChange={(e) =>
                        setResourceForm((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    />
                  </div>

                  {/* Link URL for link type */}
                  {resourceForm.type === "link" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        URL *
                      </label>
                      <input
                        type="url"
                        value={resourceForm.url}
                        onChange={(e) =>
                          setResourceForm((prev) => ({
                            ...prev,
                            url: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        required={resourceForm.type === "link"}
                      />
                    </div>
                  )}

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Category
                    </label>
                    <select
                      value={resourceForm.category}
                      onChange={(e) =>
                        setResourceForm((prev) => ({
                          ...prev,
                          category: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="general">General</option>
                      <option value="audio_sermons">Audio Sermons</option>
                      <option value="foundation">Foundation</option>
                      <option value="discipleship">Discipleship</option>
                      <option value="leadership">Leadership</option>
                      <option value="ministry">Ministry</option>
                      <option value="bible_study">Bible Study</option>
                      <option value="worship">Worship</option>
                    </select>
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Tags
                    </label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {resourceForm.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="ml-1 text-blue-600 hover:text-blue-800"
                          >
                            <X size={10} />
                          </button>
                        </span>
                      ))}
                    </div>
                    <input
                      type="text"
                      placeholder="Add tags (press Enter)"
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addTag(e.target.value.trim());
                          e.target.value = "";
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>

                  {/* Author Information */}
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      Author Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Name
                        </label>
                        <input
                          type="text"
                          value={resourceForm.author.name}
                          onChange={(e) =>
                            setResourceForm((prev) => ({
                              ...prev,
                              author: { ...prev.author, name: e.target.value },
                            }))
                          }
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          value={resourceForm.author.email}
                          onChange={(e) =>
                            setResourceForm((prev) => ({
                              ...prev,
                              author: { ...prev.author, email: e.target.value },
                            }))
                          }
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Featured Toggle */}
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Featured Resource
                      </label>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Featured resources appear prominently on the resources
                        page
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setResourceForm((prev) => ({
                          ...prev,
                          featured: !prev.featured,
                        }))
                      }
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        resourceForm.featured
                          ? "bg-blue-600"
                          : "bg-gray-200 dark:bg-gray-600"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          resourceForm.featured
                            ? "translate-x-6"
                            : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Submit Buttons */}
                  <div className="flex space-x-4 pt-6">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      disabled={uploading}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={uploading}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-md transition-colors flex items-center justify-center space-x-2"
                    >
                      {uploading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Uploading...</span>
                        </>
                      ) : (
                        <>
                          <Save />
                          <span>
                            {selectedResource
                              ? "Update Resource"
                              : "Create Resource"}
                          </span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ResourceAdmin;
