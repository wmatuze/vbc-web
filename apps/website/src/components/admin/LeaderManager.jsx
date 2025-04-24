import { useState, useEffect, useCallback, useRef } from "react";
import { createLeader, updateLeader, deleteLeader } from "../../services/api";
import { useLeadersQuery } from "../../hooks/useLeadersQuery";
import useErrorHandler from "../../hooks/useErrorHandler";
import { validateField } from "../../utils/validationUtils";
import {
  validateLeader,
  leaderValidationRules,
} from "../../utils/leaderValidation";
import {
  PlusIcon,
  UserIcon,
  PhotoIcon,
  XMarkIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ViewColumnsIcon,
  ListBulletIcon,
  ArrowPathIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  EnvelopeIcon,
  LinkIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  PencilIcon,
  TrashIcon,
  PhoneIcon,
  ArrowUpTrayIcon,
  ArrowDownTrayIcon,
  DocumentArrowDownIcon,
} from "@heroicons/react/24/outline";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useLeaderFilters } from "../../hooks/useLeaderFilters";
import LeaderCard from "./LeaderCard";
import ConfirmDialog from "../common/ConfirmDialog";
import config from "../../config";
import LeaderForm from "./LeaderForm";

const API_URL = config.API_URL;

const ITEMS_PER_PAGE = 9; // Number of items to show per page in grid view

// Base64 encoded placeholder image for leaders
const placeholderImage =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZAAAADICAYAAADGFbfiAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFyGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIwLTAzLTA1VDIyOjMzOjMwLTA4OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMC0wMy0xM1QxMDowNTozOC0wNzowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMC0wMy0xM1QxMDowNTozOC0wNzowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpmYjRjYzkwZC1mNWRhLTRiNGMtOWVjYi0wYjgyODM0YzUxMmMiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDo0ZGYyZjI5Yi1iOGNiLTZlNDktYWE4Ni0yYzAzODJjY2M5YjkiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo2ZWJiZDlkOS0zYTVkLWM5NGMtOTVjNS0wNmM1Mzc0YmJhOTgiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjZlYmJkOWQ5LTNhNWQtYzk0Yy05NWM1LTA2YzUzNzRiYmE5OCIgc3RFdnQ6d2hlbj0iMjAyMC0wMy0wNVQyMjozMzozMC0wODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKFdpbmRvd3MpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDpmYjRjYzkwZC1mNWRhLTRiNGMtOWVjYi0wYjgyODM0YzUxMmMiIHN0RXZ0OndoZW49IjIwMjAtMDMtMTNUMTA6MDU6MzgtMDc6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE5IChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7JL8VBAAAF/UlEQVR4nO3dMW4bSRRA0TbgDbiJl+MluONGK3DGJVfoNbgEL8GdOzCgDowBDDPkkGxO/ycwGAgEWU3d4qtXPZ+engAAe/3v1QcAAO9JQAAgEhAA";

const LeaderManager = () => {
  // Use our custom error handling hook
  const { error, errorMessage, handleError, clearError, withErrorHandling } =
    useErrorHandler("LeaderManager");

  // Core state
  const [successMessage, setSuccessMessage] = useState("");

  // Use React Query to fetch leaders
  const {
    data: leaders = [],
    isLoading,
    error: queryError,
    refetch: refetchLeaders,
  } = useLeadersQuery();

  // UI state
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState("add");
  const [viewMode, setViewMode] = useState("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLeaders, setSelectedLeaders] = useState(new Set());
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  // Dialog state
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: null,
    type: "danger",
  });

  // File input ref for image upload
  const fileInputRef = useRef(null);

  // Get filtered and sorted leaders
  const {
    searchTerm,
    setSearchTerm,
    filterDepartment,
    setFilterDepartment,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    departmentList,
    filteredLeaders,
  } = useLeaderFilters(leaders);

  // Calculate pagination
  const totalPages = Math.ceil(filteredLeaders.length / ITEMS_PER_PAGE);
  const paginatedLeaders =
    viewMode === "grid"
      ? filteredLeaders.slice(
          (currentPage - 1) * ITEMS_PER_PAGE,
          currentPage * ITEMS_PER_PAGE
        )
      : filteredLeaders;

  // Leader form state with validation
  const [currentLeader, setCurrentLeader] = useState({
    name: "",
    title: "",
    imageUrl: "",
    bio: "",
    email: "",
    phone: "",
    ministryFocus: [],
    socialMedia: {
      facebook: "",
      twitter: "",
      instagram: "",
      linkedin: "",
    },
    education: [],
    experience: [],
    order: 0,
    status: "active",
    department: "",
    startDate: "",
    responsibilities: [],
    achievements: [],
    speakingTopics: [],
    availability: {
      office: "",
      meetings: "",
      counseling: "",
    },
    profileVideo: "",
    publications: [],
    certifications: [],
  });

  const [formErrors, setFormErrors] = useState({});

  // Display any query errors
  useEffect(() => {
    if (queryError) {
      handleError(queryError, "Failed to load leaders");
    }
  }, [queryError, handleError]);

  // Form validation
  const validateForm = (data) => {
    // Use our validation rules
    const { isValid, errors } = validateLeader(data);
    return errors;
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Clear the specific error when the user starts typing
    setFormErrors((prev) => ({ ...prev, [name]: "" }));

    if (name.startsWith("social-")) {
      const platform = name.replace("social-", "");
      setCurrentLeader((prev) => ({
        ...prev,
        socialMedia: {
          ...prev.socialMedia,
          [platform]: value,
        },
      }));

      // Validate social media field
      if (leaderValidationRules.socialMedia.properties[platform]) {
        validateField(
          `socialMedia.${platform}`,
          value,
          leaderValidationRules.socialMedia.properties[platform],
          formErrors,
          setFormErrors
        );
      }
    } else if (name === "ministryFocus") {
      const items = value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
      setCurrentLeader((prev) => ({ ...prev, [name]: items }));

      // Validate ministry focus field
      validateField(
        name,
        items,
        leaderValidationRules.ministryFocus,
        formErrors,
        setFormErrors
      );
    } else {
      setCurrentLeader((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));

      // Validate the field if it has validation rules
      if (leaderValidationRules[name]) {
        validateField(
          name,
          type === "checkbox" ? checked : value,
          leaderValidationRules[name],
          formErrors,
          setFormErrors
        );
      }
    }
  };

  // Handle image upload
  const handleImageUpload = withErrorHandling(
    async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      // Validate file type and size
      const validTypes = ["image/jpeg", "image/png", "image/gif"];
      if (!validTypes.includes(file.type)) {
        handleError(
          new Error("Please upload a valid image file (JPEG, PNG, or GIF)"),
          "File Type Validation"
        );
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        handleError(
          new Error("Image size should be less than 5MB"),
          "File Size Validation"
        );
        return;
      }

      // Create FormData for upload
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", file.name.split(".")[0] || "Leader image");
      formData.append("category", "leadership");

      // Important: Don't set Content-Type header when using FormData
      // The browser will automatically set the correct multipart/form-data with boundary
      const response = await fetch(`${API_URL}/api/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error("Server response:", errorData);
        throw new Error(
          `Failed to upload image: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log("Upload success:", data);
      setCurrentLeader((prev) => ({ ...prev, imageUrl: data.path }));
      clearError(); // Clear any previous errors
      setSuccessMessage("Image uploaded successfully!");

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(""), 3000);
    },
    {
      context: "Image Upload",
    }
  );

  // Handle form submission
  const handleSubmit = withErrorHandling(
    async (e) => {
      e.preventDefault();

      // Validate form
      const { isValid, errors } = validateLeader(currentLeader);
      if (!isValid) {
        setFormErrors(errors);
        handleError(
          new Error("Please fix the form errors before submitting"),
          "Form Validation"
        );
        return;
      }

      if (formMode === "add") {
        // Set order to be last in the list
        const newLeader = {
          ...currentLeader,
          id: Date.now(),
          order: leaders.length,
        };
        await createLeader(newLeader);
        setSuccessMessage("Leader added successfully!");
      } else {
        await updateLeader(currentLeader.id, currentLeader);
        setSuccessMessage("Leader updated successfully!");
      }

      await refetchLeaders();
      setShowForm(false);
      resetForm();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(""), 3000);
    },
    {
      context: "Leader Form Submission",
    }
  );

  // Handle delete
  const handleDelete = withErrorHandling(
    async (id) => {
      await deleteLeader(id);
      setSuccessMessage("Leader deleted successfully!");
      await refetchLeaders();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(""), 3000);
    },
    {
      context: "Leader Deletion",
    }
  );

  // Handle bulk delete
  const handleBulkDelete = withErrorHandling(
    async () => {
      if (selectedLeaders.size === 0) return;

      await Promise.all(
        Array.from(selectedLeaders).map((id) => deleteLeader(id))
      );
      setSuccessMessage(
        `Successfully deleted ${selectedLeaders.size} leader(s)`
      );
      setSelectedLeaders(new Set());
      await refetchLeaders();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(""), 3000);
    },
    {
      context: "Bulk Leader Deletion",
    }
  );

  // Handle drag and drop reordering
  const handleDragEnd = withErrorHandling(
    async (result) => {
      if (!result.destination) return;

      const items = Array.from(leaders);
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);

      // Update order values
      const updatedItems = items.map((item, index) => ({
        ...item,
        order: index,
      }));

      // Update local state temporarily until refetch completes
      // This will be overwritten when refetchLeaders() completes

      await Promise.all(
        updatedItems.map((leader) => updateLeader(leader.id, leader))
      );
      setSuccessMessage("Leader order updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    },
    {
      context: "Leader Reordering",
      onError: () => {
        // Revert to original order on error
        refetchLeaders();
      },
    }
  );

  // Handle export
  const handleExport = () => {
    const exportData = leaders.map((leader) => ({
      ...leader,
      password: undefined, // Remove sensitive data
    }));

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "leaders-export.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Reset form
  const resetForm = () => {
    setCurrentLeader({
      name: "",
      title: "",
      imageUrl: "",
      bio: "",
      email: "",
      phone: "",
      ministryFocus: [],
      socialMedia: {
        facebook: "",
        twitter: "",
        instagram: "",
        linkedin: "",
      },
      education: [],
      experience: [],
      order: 0,
      status: "active",
      department: "",
      startDate: "",
      responsibilities: [],
      achievements: [],
      speakingTopics: [],
      availability: {
        office: "",
        meetings: "",
        counseling: "",
      },
      profileVideo: "",
      publications: [],
      certifications: [],
    });
    setFormErrors({});
    setFormMode("add");
    setShowForm(false);
  };

  // Helper function for image preview URLs
  const getImagePreviewUrl = useCallback((imageUrl) => {
    if (!imageUrl) return null;
    return imageUrl.startsWith("/") ? `${API_URL}${imageUrl}` : imageUrl;
  }, []);

  // Handle image load errors
  const handleImageError = (e) => {
    console.error("Image failed to load:", e.target.src);
    e.target.src = placeholderImage;
    e.target.onerror = null; // Prevent infinite error loop
  };

  // Show loading state when initially loading data
  if (isLoading && leaders.length === 0) {
    return (
      <div className="text-center py-4">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
        <p className="mt-2 text-gray-600">Loading leaders...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Leadership</h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage your church leadership team
          </p>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              setFormMode("add");
              setShowForm(true);
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Leader
          </button>

          {selectedLeaders.size > 0 && (
            <button
              onClick={handleBulkDelete}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Delete Selected ({selectedLeaders.size})
            </button>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={handleExport}
              className="p-2 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-lg"
              title="Export leaders"
            >
              <DocumentArrowDownIcon className="h-5 w-5" />
            </button>

            <button
              onClick={() => refetchLeaders()}
              className="p-2 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-lg"
              title="Refresh leaders"
            >
              <ArrowPathIcon className="h-5 w-5" />
            </button>

            <div className="flex items-center border border-gray-300 rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded ${viewMode === "grid" ? "bg-gray-100 text-gray-900" : "text-gray-400 hover:text-gray-500"}`}
                title="Grid view"
              >
                <ViewColumnsIcon className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded ${viewMode === "list" ? "bg-gray-100 text-gray-900" : "text-gray-400 hover:text-gray-500"}`}
                title="List view"
              >
                <ListBulletIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="mb-6 bg-green-50 border-l-4 border-green-400 p-4 animate-fade-in-out">
          <div className="flex">
            <div className="flex-shrink-0">
              <CheckCircleIcon className="h-5 w-5 text-green-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">{successMessage}</p>
            </div>
          </div>
        </div>
      )}

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
                  <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filter Bar */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search leaders..."
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        <div className="flex items-center gap-4">
          <select
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg"
          >
            <option value="all">All Departments</option>
            {departmentList
              .filter((d) => d !== "all")
              .map((department) => (
                <option key={department} value={department}>
                  {department}
                </option>
              ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg"
          >
            <option value="order">Sort by Order</option>
            <option value="name">Sort by Name</option>
          </select>

          <button
            onClick={() =>
              setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
            }
            className="p-2 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-lg"
            title={`Sort ${sortOrder === "asc" ? "ascending" : "descending"}`}
          >
            {sortOrder === "asc" ? (
              <ArrowUpIcon className="h-5 w-5" />
            ) : (
              <ArrowDownIcon className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Leaders Display */}
      {isLoading && leaders.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
        </div>
      ) : filteredLeaders.length === 0 ? (
        <div className="text-center py-12">
          <UserIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No leaders found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || filterDepartment !== "all"
              ? "Try adjusting your search or filter settings"
              : "Get started by adding a new leader"}
          </p>
        </div>
      ) : viewMode === "grid" ? (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {paginatedLeaders.map((leader) => (
              <LeaderCard
                key={leader.id}
                leader={leader}
                onEdit={() => {
                  setCurrentLeader(leader);
                  setFormMode("edit");
                  setShowForm(true);
                }}
                onDelete={handleDelete}
                onImagePreview={(imageUrl) => {
                  setSelectedImage(getImagePreviewUrl(imageUrl));
                  setShowImagePreview(true);
                }}
                getImagePreviewUrl={getImagePreviewUrl}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex justify-center">
              <nav
                className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                aria-label="Pagination"
              >
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                    currentPage === 1
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  Previous
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      currentPage === i + 1
                        ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                        : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                    currentPage === totalPages
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  Next
                </button>
              </nav>
            </div>
          )}
        </>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="w-8 px-6 py-3">
                    <input
                      type="checkbox"
                      checked={selectedLeaders.size === filteredLeaders.length}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedLeaders(
                            new Set(filteredLeaders.map((l) => l.id))
                          );
                        } else {
                          setSelectedLeaders(new Set());
                        }
                      }}
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Leader
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Contact
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Department
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Ministry Focus
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <Droppable droppableId="leaders">
                {(provided) => (
                  <tbody
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="bg-white divide-y divide-gray-200"
                  >
                    {paginatedLeaders.map((leader, index) => (
                      <Draggable
                        key={leader.id}
                        draggableId={leader.id.toString()}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <tr
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={
                              snapshot.isDragging
                                ? "bg-gray-50"
                                : "hover:bg-gray-50"
                            }
                          >
                            <td className="px-6 py-4">
                              <input
                                type="checkbox"
                                checked={selectedLeaders.has(leader.id)}
                                onChange={(e) => {
                                  const newSelected = new Set(selectedLeaders);
                                  if (e.target.checked) {
                                    newSelected.add(leader.id);
                                  } else {
                                    newSelected.delete(leader.id);
                                  }
                                  setSelectedLeaders(newSelected);
                                }}
                                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                              />
                            </td>
                            <td
                              className="px-6 py-4"
                              {...provided.dragHandleProps}
                            >
                              <div className="flex items-center">
                                {leader.imageUrl ? (
                                  <img
                                    src={getImagePreviewUrl(leader.imageUrl)}
                                    alt=""
                                    className="h-10 w-10 rounded-full object-cover cursor-pointer"
                                    onClick={() => {
                                      setSelectedImage(
                                        getImagePreviewUrl(leader.imageUrl)
                                      );
                                      setShowImagePreview(true);
                                    }}
                                    onError={handleImageError}
                                  />
                                ) : (
                                  <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                                    <UserIcon className="h-6 w-6 text-gray-400" />
                                  </div>
                                )}
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">
                                    {leader.name}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {leader.title}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <div className="space-y-1">
                                {leader.email && (
                                  <a
                                    href={`mailto:${leader.email}`}
                                    className="flex items-center hover:text-gray-700"
                                  >
                                    <EnvelopeIcon className="h-4 w-4 mr-1" />
                                    {leader.email}
                                  </a>
                                )}
                                {leader.phone && (
                                  <a
                                    href={`tel:${leader.phone}`}
                                    className="flex items-center hover:text-gray-700"
                                  >
                                    <PhoneIcon className="h-4 w-4 mr-1" />
                                    {leader.phone}
                                  </a>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {leader.department && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  {leader.department}
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex flex-wrap gap-2">
                                {leader.ministryFocus?.map((focus) => (
                                  <span
                                    key={focus}
                                    className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                                  >
                                    {focus}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => {
                                    setCurrentLeader(leader);
                                    setFormMode("edit");
                                    setShowForm(true);
                                  }}
                                  className="text-blue-400 hover:text-blue-500"
                                  title="Edit"
                                >
                                  <PencilIcon className="h-5 w-5" />
                                </button>
                                <button
                                  onClick={() => handleDelete(leader.id)}
                                  className="text-red-400 hover:text-red-500"
                                  title="Delete"
                                >
                                  <TrashIcon className="h-5 w-5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </tbody>
                )}
              </Droppable>
            </table>
          </div>
        </DragDropContext>
      )}

      {/* Leader Form Modal */}
      {showForm && (
        <div className="fixed inset-0 overflow-y-auto z-50">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={resetForm}
            ></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <LeaderForm
                currentLeader={currentLeader}
                formMode={formMode}
                loading={loading}
                formErrors={formErrors}
                onSubmit={handleSubmit}
                onChange={handleInputChange}
                onCancel={resetForm}
                onImageUpload={handleImageUpload}
                fileInputRef={fileInputRef}
              />
            </div>
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {showImagePreview && selectedImage && (
        <div
          className="fixed z-50 inset-0 overflow-y-auto"
          onClick={() => setShowImagePreview(false)}
        >
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <img
                src={selectedImage}
                alt="Preview"
                className="w-full h-auto"
                onError={handleImageError}
              />
            </div>
          </div>
        </div>
      )}

      {/* Hidden file input for image upload */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleImageUpload}
      />
    </div>
  );
};

export default LeaderManager;
