import { useState, useEffect, useCallback } from "react";
import useErrorHandler from "../../hooks/useErrorHandler";
import { validateEvent, validateField } from "../../utils/validationUtils";
import FormField from "../common/FormField";
import { createEvent, updateEvent, deleteEvent } from "../../services/api";
import { useEventsQuery } from "../../hooks/useEventsQuery";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import {
  PlusIcon,
  CalendarIcon,
  ClockIcon,
  MapPinIcon as LocationMarkerIcon,
  UserGroupIcon,
  PhotoIcon as PhotographIcon,
  XMarkIcon as XIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  MagnifyingGlassIcon as SearchIcon,
  FunnelIcon as FilterIcon,
  Squares2X2Icon as ViewGridIcon,
  ListBulletIcon as ViewListIcon,
  ArrowPathIcon as RefreshIcon,
  DocumentDuplicateIcon as DuplicateIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { format, parseISO, isFuture, isPast } from "date-fns";
import config from "../../config";

const API_URL = config.API_URL;

const placeholderImage =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZAAAADICAYAAADGFbfiAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFyGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIwLTAzLTA1VDIyOjMzOjMwLTA4OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMC0wMy0xM1QxMDowNTozOC0wNzowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMC0wMy0xM1QxMDowNTozOC0wNzowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpmYjRjYzkwZC1mNWRhLTRiNGMtOWVjYi0wYjgyODM0YzUxMmMiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDo0ZGYyZjI5Yi1iOGNiLTZlNDktYWE4Ni0yYzAzODJjY2M5YjkiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo2ZWJiZDlkOS0zYTVkLWM5NGMtOTVjNS0wNmM1Mzc0YmJhOTgiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjZlYmJkOWQ5LTNhNWQtYzk0Yy05NWM1LTA2YzUzNzRiYmE5OCIgc3RFdnQ6d2hlbj0iMjAyMC0wMy0wNVQyMjozMzozMC0wODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKFdpbmRvd3MpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDpmYjRjYzkwZC1mNWRhLTRiNGMtOWVjYi0wYjgyODM0YzUxMmMiIHN0RXZ0OndoZW49IjIwMjAtMDMtMTNUMTA6MDU6MzgtMDc6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE5IChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7JL8VBAAAF/UlEQVR4nO3dMW4bSRRA0TbgDbiJl+MluONGK3DGJVfoNbgEL8GdOzCgDowBDDPkkGxO/ycwGAgEWU3d4qtXPZ+engAAe/3v1QcAAO9JQAAgEhAA";

const EventManager = () => {
  // Use React Query for fetching events
  const {
    data: events = [],
    isLoading: eventsLoading,
    error: eventsError,
    refetch: refetchEvents,
  } = useEventsQuery();

  // Local state for operations other than fetching
  // Use our custom error handling hook
  const { error, errorMessage, handleError, clearError, withErrorHandling } =
    useErrorHandler("EventManager");

  // Form validation errors
  const [formErrors, setFormErrors] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState("add");
  const [currentEvent, setCurrentEvent] = useState({
    title: "",
    date: format(new Date(), "yyyy-MM-dd"),
    formattedDate: format(new Date(), "MMMM d, yyyy"),
    time: "",
    description: "",
    location: "",
    capacity: "",
    ministry: "",
    imageUrl: "",
    image: null,
    registrationUrl: "",
    tags: [],
    recurring: false,
    recurringPattern: "",
    organizer: "",
    contactEmail: "",
    featured: false,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMinistry, setFilterMinistry] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("asc");
  const [successMessage, setSuccessMessage] = useState("");
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [eventFilter, setEventFilter] = useState("all"); // 'all', 'upcoming', 'past'
  const [isMediaSelectorOpen, setIsMediaSelectorOpen] = useState(false);
  const [mediaSearchTerm, setMediaSearchTerm] = useState("");
  const [isLoadingMedia, setIsLoadingMedia] = useState(false);
  const [mediaItems, setMediaItems] = useState([]);
  const [selectedMediaItem, setSelectedMediaItem] = useState(null);

  // Display any query errors
  useEffect(() => {
    if (eventsError) {
      setError("Failed to load events. Please try again.");
    }
  }, [eventsError]);

  // Use React Query for fetching media
  const {
    data: mediaData = [],
    isLoading: mediaLoading,
    refetch: refetchMedia,
  } = useMediaQuery({
    enabled: isMediaSelectorOpen, // Only fetch when media selector is open
    onSuccess: (data) => {
      console.log("Fetched media items:", data);
      setMediaItems(data);
    },
    onError: (error) => {
      console.error("Error fetching media:", error);
    },
  });

  // Update media items when mediaData changes
  useEffect(() => {
    if (mediaData.length > 0) {
      setMediaItems(mediaData);
    }
  }, [mediaData]);

  // Define validation rules for event fields
  const validationRules = {
    title: {
      type: "string",
      required: true,
      minLength: 3,
      maxLength: 100,
      fieldName: "Title",
    },
    date: { type: "date", required: true, fieldName: "Date" },
    time: { type: "time", required: true, fieldName: "Time" },
    location: {
      type: "string",
      required: true,
      minLength: 3,
      maxLength: 100,
      fieldName: "Location",
    },
    description: { type: "string", maxLength: 1000, fieldName: "Description" },
    capacity: { type: "number", integer: true, min: 1, fieldName: "Capacity" },
    ministry: { type: "string", maxLength: 50, fieldName: "Ministry" },
    registrationUrl: { type: "url", fieldName: "Registration URL" },
    organizer: { type: "string", maxLength: 50, fieldName: "Organizer" },
    contactEmail: { type: "email", fieldName: "Contact Email" },
    recurringPattern: {
      type: "string",
      maxLength: 50,
      fieldName: "Recurring Pattern",
    },
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentEvent((prev) => ({ ...prev, [name]: value }));

    // Validate the field if it has validation rules
    if (validationRules[name]) {
      validateField(
        name,
        value,
        validationRules[name],
        formErrors,
        setFormErrors
      );
    }
  };

  // Handle tags input with validation
  const handleTagsChange = (e) => {
    const tags = e.target.value
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
    setCurrentEvent((prev) => ({ ...prev, tags }));

    // Validate tags
    validateField(
      "tags",
      tags,
      {
        type: "array",
        maxLength: 10,
        itemValidator: (tag) =>
          validateField(
            "tag",
            tag,
            { type: "string", maxLength: 20, fieldName: "Tag" },
            {},
            () => {}
          ),
        fieldName: "Tags",
      },
      formErrors,
      setFormErrors
    );
  };

  const resetForm = () => {
    setCurrentEvent({
      title: "",
      date: format(new Date(), "yyyy-MM-dd"),
      formattedDate: format(new Date(), "MMMM d, yyyy"),
      time: "",
      description: "",
      location: "",
      capacity: "",
      ministry: "",
      imageUrl: "",
      image: null,
      registrationUrl: "",
      tags: [],
      recurring: false,
      recurringPattern: "",
      organizer: "",
      contactEmail: "",
      featured: false,
    });
    setFormMode("add");
    setFormErrors({});
  };

  const handleSubmit = withErrorHandling(
    async (e) => {
      e.preventDefault();

      // Validate all fields before submission
      const { isValid, errors } = validateEvent(currentEvent);

      if (!isValid) {
        // Update form errors and stop submission
        setFormErrors(errors);
        // Show error message
        handleError(
          new Error("Please fix the form errors before submitting"),
          "Form Validation"
        );
        return;
      }

      // Show loading state in UI

      // Create a clean copy of the event data
      const cleanEvent = { ...currentEvent };

      // Log current event data for debugging
      console.log("Original event data:", cleanEvent);

      // Format the date properly
      let eventDate;
      try {
        // Use the formattedDate if available, otherwise format the date input
        if (cleanEvent.formattedDate) {
          eventDate = cleanEvent.formattedDate;
          console.log(`Using pre-formatted date: ${eventDate}`);
        } else if (cleanEvent.date) {
          // Ensure date is in a consistent format (MMMM d, yyyy)
          const parsedDate = parseISO(cleanEvent.date);
          eventDate = format(parsedDate, "MMMM d, yyyy");
          console.log(
            `Formatted date for event: ${eventDate} (from ${cleanEvent.date})`
          );
        } else {
          // Fallback to current date
          eventDate = format(new Date(), "MMMM d, yyyy");
          console.warn("No date provided for event, using current date");
        }
      } catch (dateError) {
        console.error("Date parsing error:", dateError, cleanEvent.date);
        eventDate = format(new Date(), "MMMM d, yyyy"); // Fallback to current date
      }

      // Prepare the data for saving
      const serverEvent = {
        title: cleanEvent.title,
        description: cleanEvent.description,
        date: eventDate,
        time: cleanEvent.time,
        location: cleanEvent.location,
        ministry: cleanEvent.ministry,
        // Add server model fields
        startDate: eventDate,
        endDate: eventDate,
        // Optional fields
        capacity: cleanEvent.capacity,
        registrationUrl: cleanEvent.registrationUrl,
        recurring: cleanEvent.recurring,
        recurringPattern: cleanEvent.recurringPattern,
        organizer: cleanEvent.organizer,
        contactEmail: cleanEvent.contactEmail,
        featured: cleanEvent.featured,
        tags: cleanEvent.tags,
      };

      // Handle image paths properly
      if (cleanEvent.image && typeof cleanEvent.image === "object") {
        // If we have an image object from the media selector
        if (cleanEvent.image.id) {
          // Use the ID for direct reference
          serverEvent.image = cleanEvent.image.id;
        } else if (cleanEvent.image.path) {
          // If it has a path but no ID, use the path
          serverEvent.imageUrl = cleanEvent.image.path;
        } else if (cleanEvent.image.filename) {
          // If it just has a filename, construct the path
          serverEvent.imageUrl = `/uploads/${cleanEvent.image.filename}`;
        }
      } else if (cleanEvent.imageUrl) {
        // If only the URL was entered manually, use that
        serverEvent.imageUrl = cleanEvent.imageUrl;
      }

      console.log("Prepared event data for saving:", serverEvent);

      let savedEvent;
      if (formMode === "add") {
        // Create a new event
        console.log("Creating new event...");
        savedEvent = await createEvent(serverEvent);
        console.log("Event created successfully:", savedEvent);
        setSuccessMessage("Event added successfully!");
      } else {
        // Update an existing event
        // Get the correct ID (could be id, _id, or both)
        const eventId = cleanEvent.id || cleanEvent._id;
        console.log(`Updating event with ID: ${eventId}`);

        if (!eventId) {
          throw new Error("Cannot update event: Missing event ID");
        }

        savedEvent = await updateEvent(eventId, serverEvent);
        console.log("Event updated successfully:", savedEvent);
        setSuccessMessage("Event updated successfully!");
      }

      // Refresh the events list
      await refetchEvents();
      resetForm();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(""), 3000);
    },
    {
      showLoading: false, // We're handling loading state manually
      showSuccess: false, // We're handling success messages manually
      context: "Event Form Submission",
    }
  );

  const handleEdit = withErrorHandling(
    (event) => {
      // Convert display date to ISO format for input
      let isoDate;
      try {
        // Try to parse the date string
        const dateObj = new Date(event.date);
        isoDate = format(dateObj, "yyyy-MM-dd");
      } catch (err) {
        // Fallback to current date if parsing fails
        console.error("Failed to parse date:", event.date);
        isoDate = format(new Date(), "yyyy-MM-dd");
      }

      // Map the MongoDB _id to id for the API
      const eventData = {
        ...event,
        // Use _id as id if id doesn't exist
        id: event.id || event._id,
        date: isoDate,
        formattedDate: event.date, // Store original formatted date
      };

      console.log("Editing event with mapped ID:", eventData.id);

      setCurrentEvent(eventData);
      setFormMode("edit");
      setShowForm(true);
    },
    {
      context: "Event Editing",
    }
  );

  const handleDelete = withErrorHandling(
    async (event) => {
      if (window.confirm("Are you sure you want to delete this event?")) {
        // Get the correct ID (could be id, _id, or both)
        const eventId = event.id || event._id;

        if (!eventId) {
          throw new Error("Cannot delete event: Missing event ID");
        }

        console.log(`Deleting event with ID: ${eventId}`);

        await deleteEvent(eventId);
        setSuccessMessage("Event deleted successfully!");
        await refetchEvents();

        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(""), 3000);
      }
    },
    {
      context: "Event Deletion",
    }
  );

  const handleDuplicate = (event) => {
    const duplicatedEvent = {
      ...event,
      id: undefined,
      title: `Copy of ${event.title}`,
      date: format(new Date(), "yyyy-MM-dd"),
    };
    setCurrentEvent(duplicatedEvent);
    setFormMode("add");
    setShowForm(true);
  };

  const handleImagePreview = (imageUrl) => {
    setSelectedImage(getImagePreviewUrl(imageUrl));
    setShowImagePreview(true);
  };

  // Get unique ministry options from existing events
  const existingMinistries = [
    ...new Set(events.map((event) => event.ministry).filter(Boolean)),
  ];
  const ministryOptions = existingMinistries.includes("General")
    ? existingMinistries
    : ["General", ...existingMinistries];

  // Format data for display
  const formatEventDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Ensure image URLs have proper domain
  const getFullImageUrl = (url) => {
    if (!url) return "";

    // Handle absolute URLs that already include http/https
    if (url.startsWith("http")) {
      return url;
    }

    // Handle local server paths
    if (url.startsWith("/")) {
      return `${API_URL}${url}`;
    }

    // Handle relative paths
    return `${API_URL}/${url}`;
  };

  // Helper function to get image preview URL with cache busting
  const getImagePreviewUrl = (imageUrl) => {
    if (!imageUrl) return null;

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

  // Add the handleImageError function after getImagePreviewUrl
  const handleImageError = (e) => {
    console.error("Failed to load image:", e.target.src);
    // Use the base64 encoded placeholder image that's already defined above
    e.target.src = placeholderImage;
    e.target.onerror = null; // Prevent infinite error loop
  };

  // Handle media selection from the media library
  const handleMediaSelection = () => {
    if (selectedMediaItem) {
      // Ensure proper path construction
      let imagePath;

      if (selectedMediaItem.path) {
        // If path exists, use it directly
        imagePath = selectedMediaItem.path;
      } else if (selectedMediaItem.filename) {
        // If only filename exists, construct path
        imagePath = `/uploads/${selectedMediaItem.filename}`;
      }

      console.log("Selected media item:", selectedMediaItem);
      console.log("Using image path:", imagePath);

      // Set imageUrl and image reference in the form data
      // Make sure we're passing the ID for proper MongoDB reference
      setCurrentEvent((prev) => ({
        ...prev,
        imageUrl: imagePath,
        // Store the full media object with ID for proper reference
        image: {
          id: selectedMediaItem._id || selectedMediaItem.id,
          path: imagePath,
          filename: selectedMediaItem.filename,
          title: selectedMediaItem.title,
        },
      }));

      console.log("Updated event with image reference:", {
        id: selectedMediaItem._id || selectedMediaItem.id,
        path: imagePath,
      });

      setSelectedMediaItem(null);
      setIsMediaSelectorOpen(false);
    }
  };

  // Filter events based on search, ministry, and upcoming/past status
  const filteredEvents = events
    .filter((event) => {
      // Filter by search term
      const matchesSearch =
        searchTerm === "" ||
        event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.ministry?.toLowerCase().includes(searchTerm.toLowerCase());

      // Filter by ministry
      const matchesMinistry =
        filterMinistry === "all" || event.ministry === filterMinistry;

      // Filter by event status (upcoming/past)
      let matchesEventFilter = true;
      if (eventFilter !== "all") {
        // Parse the date safely
        const eventDate = new Date(event.date);
        const now = new Date();
        const today = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate()
        );

        // Set time to beginning of day for comparison
        const eventDay = new Date(
          eventDate.getFullYear(),
          eventDate.getMonth(),
          eventDate.getDate()
        );

        if (eventFilter === "upcoming") {
          // For upcoming events, include today and future dates
          matchesEventFilter = eventDay >= today;
        } else if (eventFilter === "past") {
          // For past events, exclude today
          matchesEventFilter = eventDay < today;
        }
      }

      return matchesSearch && matchesMinistry && matchesEventFilter;
    })
    .sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

  if (eventsLoading && events.length === 0) {
    return (
      <div className="text-center py-4 text-gray-800 dark:text-gray-200">
        Loading...
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
        Manage Events
      </h2>

      {error && (
        <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <ExclamationCircleIcon className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700 dark:text-red-200 font-medium">
                {errorMessage}
              </p>
              <button
                onClick={clearError}
                className="mt-2 text-xs text-red-500 dark:text-red-300 hover:text-red-700 dark:hover:text-red-100 underline"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {successMessage && (
        <div className="bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-700 text-green-700 dark:text-green-200 px-4 py-3 rounded mb-4">
          {successMessage}
        </div>
      )}

      {/* Form for adding/editing events */}
      <form
        onSubmit={handleSubmit}
        className="mb-8 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow-sm"
      >
        <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">
          {formMode === "add" ? "Add New Event" : "Edit Event"}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <FormField
            label="Title"
            name="title"
            type="text"
            value={currentEvent.title}
            onChange={handleInputChange}
            placeholder="Enter event title"
            required={true}
            validation={validationRules.title}
            errors={formErrors}
            setErrors={setFormErrors}
            className="mb-0"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Date
            </label>
            <input
              type="date"
              name="date"
              value={currentEvent.date || ""}
              onChange={(e) => {
                const inputDate = e.target.value;
                if (inputDate) {
                  try {
                    // Keep the raw date for the input
                    // Format a readable version for display/submission
                    const date = new Date(inputDate);
                    const formattedDate = format(date, "MMMM d, yyyy");

                    setCurrentEvent((prev) => ({
                      ...prev,
                      date: inputDate,
                      formattedDate: formattedDate,
                    }));

                    // Validate the date field
                    validateField(
                      "date",
                      inputDate,
                      validationRules.date,
                      formErrors,
                      setFormErrors
                    );
                  } catch (err) {
                    console.error("Error formatting date:", err);
                    setCurrentEvent((prev) => ({
                      ...prev,
                      date: inputDate,
                      formattedDate: inputDate,
                    }));

                    // Show validation error
                    setFormErrors((prev) => ({
                      ...prev,
                      date: "Invalid date format",
                    }));
                  }
                } else {
                  setCurrentEvent((prev) => ({
                    ...prev,
                    date: "",
                    formattedDate: "",
                  }));

                  // Validate empty date if required
                  validateField(
                    "date",
                    "",
                    validationRules.date,
                    formErrors,
                    setFormErrors
                  );
                }
              }}
              className={`w-full px-3 py-2 border ${formErrors.date ? "border-red-500" : "border-gray-300 dark:border-gray-600"} rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
              required
            />
            {!formErrors.date && currentEvent.formattedDate && (
              <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Display format: {currentEvent.formattedDate}
              </div>
            )}
            {formErrors.date && (
              <p className="mt-1 text-xs text-red-500">{formErrors.date}</p>
            )}
          </div>

          <FormField
            label="Time"
            name="time"
            type="text"
            value={currentEvent.time}
            onChange={handleInputChange}
            placeholder="e.g. 10:30 AM"
            required={true}
            validation={validationRules.time}
            errors={formErrors}
            setErrors={setFormErrors}
            helpText="Format: HH:MM or HH:MM AM/PM"
            className="mb-0"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Ministry
            </label>
            <select
              name="ministry"
              value={currentEvent.ministry}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            >
              <option value="">Select Ministry</option>
              {ministryOptions.map((ministry, index) => (
                <option key={index} value={ministry}>
                  {ministry}
                </option>
              ))}
              {/* Allow custom input if ministry not in list */}
              {currentEvent.ministry &&
                !ministryOptions.includes(currentEvent.ministry) && (
                  <option value={currentEvent.ministry}>
                    {currentEvent.ministry}
                  </option>
                )}
            </select>
          </div>

          <FormField
            label="Location"
            name="location"
            type="text"
            value={currentEvent.location}
            onChange={handleInputChange}
            placeholder="Enter event location"
            required={true}
            validation={validationRules.location}
            errors={formErrors}
            setErrors={setFormErrors}
            className="mb-0"
          />

          <FormField
            label="Description"
            name="description"
            type="textarea"
            value={currentEvent.description}
            onChange={handleInputChange}
            placeholder="Enter event description"
            validation={validationRules.description}
            errors={formErrors}
            setErrors={setFormErrors}
            rows="3"
            className="md:col-span-2"
          />

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Image URL
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                name="imageUrl"
                value={currentEvent.imageUrl}
                onChange={handleInputChange}
                placeholder="/assets/events/event-name.jpg"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
              />
              <button
                type="button"
                onClick={() => setIsMediaSelectorOpen(true)}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
              >
                <PhotographIcon className="h-5 w-5 mr-2 text-gray-400" />
                Browse Media
              </button>
            </div>
            {currentEvent.imageUrl && (
              <div className="mt-2">
                <img
                  src={getImagePreviewUrl(currentEvent.imageUrl)}
                  alt="Event preview"
                  className="h-20 object-cover rounded"
                  onError={handleImageError}
                />
              </div>
            )}
          </div>

          <div
            className={`md:col-span-2 ${formErrors.tags ? "has-error" : ""}`}
          >
            <label
              htmlFor="tags"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Tags
            </label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={currentEvent.tags?.join(", ") || ""}
              onChange={handleTagsChange}
              placeholder="e.g. worship, prayer, outreach"
              className={`w-full px-3 py-2 border ${formErrors.tags ? "border-red-500" : "border-gray-300 dark:border-gray-600"} rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500`}
            />
            {!formErrors.tags && (
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Separate tags with commas (max 10 tags)
              </p>
            )}
            {formErrors.tags && (
              <p className="mt-1 text-xs text-red-500">{formErrors.tags}</p>
            )}
          </div>
        </div>

        <div className="flex items-center">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white py-2 px-4 rounded-md transition-colors"
            disabled={eventsLoading}
          >
            {eventsLoading ? "Saving..." : "Save Event"}
          </button>

          {formMode === "edit" && (
            <button
              type="button"
              onClick={resetForm}
              className="ml-2 py-2 px-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Events Display */}
      <div className="flex flex-wrap items-center justify-between mb-4 gap-2">
        <div className="flex items-center space-x-2">
          <label className="text-sm text-gray-700 dark:text-gray-300">
            Show:
          </label>
          <select
            value={eventFilter}
            onChange={(e) => setEventFilter(e.target.value)}
            className="border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-1 text-sm"
          >
            <option value="all">All Events</option>
            <option value="upcoming">Upcoming Events</option>
            <option value="past">Past Events</option>
          </select>
        </div>
      </div>

      {eventsLoading && events.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 dark:border-blue-400 border-t-transparent dark:border-t-transparent"></div>
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="text-center py-12">
          <CalendarIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
            No events found
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {searchTerm || filterMinistry !== "all" || eventFilter !== "all"
              ? "Try adjusting your search or filter settings"
              : "Get started by adding a new event"}
          </p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200 border border-gray-200 dark:border-gray-700"
            >
              {event.imageUrl ? (
                <div className="relative h-48 bg-gray-200 dark:bg-gray-700">
                  <img
                    src={getImagePreviewUrl(event.imageUrl)}
                    alt={event.title}
                    className="w-full h-full object-cover"
                    onClick={() => handleImagePreview(event.imageUrl)}
                    onError={handleImageError}
                  />
                  {event.featured && (
                    <span className="absolute top-2 right-2 px-2 py-1 bg-yellow-400 dark:bg-yellow-500 text-xs font-medium rounded-full">
                      Featured
                    </span>
                  )}
                </div>
              ) : (
                <div className="h-48 bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                  <CalendarIcon className="h-12 w-12 text-gray-400 dark:text-gray-500" />
                </div>
              )}

              <div className="p-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate">
                  {event.title}
                </h3>

                <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <CalendarIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400 dark:text-gray-500" />
                  <span>{event.date}</span>
                  <ClockIcon className="flex-shrink-0 ml-4 mr-1.5 h-5 w-5 text-gray-400 dark:text-gray-500" />
                  <span>{event.time}</span>
                </div>

                {event.location && (
                  <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <LocationMarkerIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400 dark:text-gray-500" />
                    <span className="truncate">{event.location}</span>
                  </div>
                )}

                {event.ministry && (
                  <span className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                    {event.ministry}
                  </span>
                )}

                {event.tags && event.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {event.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-4 flex justify-end space-x-2">
                  <button
                    onClick={() => handleDuplicate(event)}
                    className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400"
                    title="Duplicate"
                  >
                    <DuplicateIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleEdit(event)}
                    className="p-2 text-blue-400 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300"
                    title="Edit"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(event)}
                    className="p-2 text-red-400 dark:text-red-400 hover:text-red-500 dark:hover:text-red-300"
                    title="Delete"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Event
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Date & Time
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Location
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Ministry
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredEvents.map((event) => (
                <tr
                  key={event.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      {event.imageUrl ? (
                        <img
                          src={getImagePreviewUrl(event.imageUrl)}
                          alt=""
                          className="h-10 w-10 rounded-full object-cover cursor-pointer"
                          onClick={() => handleImagePreview(event.imageUrl)}
                          onError={handleImageError}
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                          <CalendarIcon className="h-6 w-6 text-gray-400 dark:text-gray-500" />
                        </div>
                      )}
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {event.title}
                          {event.featured && (
                            <span className="ml-2 px-2 py-0.5 bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 text-xs font-medium rounded-full">
                              Featured
                            </span>
                          )}
                        </div>
                        {event.tags && event.tags.length > 0 && (
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {event.tags.join(", ")}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center">
                      <CalendarIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400 dark:text-gray-500" />
                      {event.date}
                      <ClockIcon className="flex-shrink-0 ml-4 mr-1.5 h-5 w-5 text-gray-400 dark:text-gray-500" />
                      {event.time}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {event.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {event.ministry && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                        {event.ministry}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleDuplicate(event)}
                        className="text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400"
                        title="Duplicate"
                      >
                        <DuplicateIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleEdit(event)}
                        className="text-blue-400 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300"
                        title="Edit"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(event)}
                        className="text-red-400 dark:text-red-400 hover:text-red-500 dark:hover:text-red-300"
                        title="Delete"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Image Preview Modal */}
      {showImagePreview && selectedImage && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-75 flex items-center justify-center">
          <div className="relative max-w-5xl mx-auto">
            <button
              onClick={() => setShowImagePreview(false)}
              className="absolute top-4 right-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 z-10"
            >
              <XIcon className="h-6 w-6" />
            </button>
            <img
              src={selectedImage}
              alt="Preview"
              className="max-h-[90vh] max-w-full object-contain"
              onError={handleImageError}
            />
          </div>
        </div>
      )}

      {/* Media Selector Modal */}
      {isMediaSelectorOpen && (
        <div className="fixed inset-0 overflow-y-auto z-50">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={() => setIsMediaSelectorOpen(false)}
            ></div>

            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      Select Event Image
                    </h3>
                    <div className="mt-4">
                      {/* Search bar */}
                      <div className="relative mb-4">
                        <input
                          type="text"
                          placeholder="Search media..."
                          value={mediaSearchTerm}
                          onChange={(e) => setMediaSearchTerm(e.target.value)}
                          className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <SearchIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                        </div>
                      </div>

                      {/* Loading indicator */}
                      {isLoadingMedia ? (
                        <div className="flex justify-center p-12">
                          <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent"></div>
                        </div>
                      ) : mediaItems.length === 0 ? (
                        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                          No media items found
                        </div>
                      ) : (
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 max-h-96 overflow-y-auto p-2">
                          {mediaItems
                            .filter(
                              (item) =>
                                !mediaSearchTerm ||
                                item.title
                                  ?.toLowerCase()
                                  .includes(mediaSearchTerm.toLowerCase()) ||
                                item.filename
                                  ?.toLowerCase()
                                  .includes(mediaSearchTerm.toLowerCase())
                            )
                            .map((item) => (
                              <div
                                key={item.id}
                                className={`cursor-pointer rounded-lg overflow-hidden border-2 ${selectedMediaItem?.id === item.id ? "border-blue-500" : "border-transparent"} hover:border-blue-300`}
                                onClick={() => setSelectedMediaItem(item)}
                              >
                                <div className="relative aspect-w-1 aspect-h-1 bg-gray-200 dark:bg-gray-700">
                                  <img
                                    src={
                                      item.path
                                        ? `${API_URL}${item.path}`
                                        : `${API_URL}/uploads/${item.filename}`
                                    }
                                    alt={item.title || item.filename}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      console.error(
                                        `Failed to load image: ${item.path || item.filename}`
                                      );
                                      e.target.src = placeholderImage;
                                    }}
                                  />
                                </div>
                                <div className="p-1 text-xs text-center truncate">
                                  {item.title || item.filename}
                                </div>
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  disabled={!selectedMediaItem}
                  className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm ${
                    !selectedMediaItem ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  onClick={handleMediaSelection}
                >
                  Select Image
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setIsMediaSelectorOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventManager;
