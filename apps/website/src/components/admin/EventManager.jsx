import { useState, useEffect } from "react";
import useErrorHandler from "../../hooks/useErrorHandler";
import { useEventForm } from "../../hooks/useEventForm";
import FormField from "../common/FormField";
import MediaSelector from "../common/MediaSelector";
import ImagePreview from "../common/ImagePreview";
import EventAdminCard from "./EventAdminCard";
import { deleteEvent } from "../../services/api";
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
import { format, parseISO, isValid } from "date-fns";
import config from "../../config";
import { EVENT_VALIDATION_RULES, EVENT_TYPES } from "../../constants/eventConstants";
import { normalizeEventDate, parseEventFromAPI } from "../../utils/dateUtils";
import { getImageUrl, processMediaItem } from "../../utils/imageUtils";

// Import placeholder image for events
import eventPlaceholderImage from "../../assets/placeholders/default-event.svg";

const EventManager = () => {
  // Use React Query for fetching events
  const {
    data: events = [],
    isLoading: eventsLoading,
    error: eventsError,
    refetch: refetchEvents,
  } = useEventsQuery();

  // Use our custom error handling hook
  const { error, errorMessage, handleError, clearError, withErrorHandling } =
    useErrorHandler("EventManager");

  // Use our custom form handling hook
  const {
    currentEvent,
    formErrors,
    formMode,
    showForm,
    isSubmitting,
    setCurrentEvent,
    setFormErrors,
    handleInputChange,
    handleCheckboxChange,
    handleTagsChange,
    resetForm,
    editEvent,
    addEvent,
    duplicateEvent,
    submitForm,
  } = useEventForm({
    onSuccess: (savedEvent, action) => {
      setSuccessMessage(`Event ${action} successfully!`);
      refetchEvents();
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(""), 3000);
    },
    onError: (error) => {
      handleError(error, "Event Form Submission");
    }
  });

  // UI state
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMinistry, setFilterMinistry] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("asc");
  const [successMessage, setSuccessMessage] = useState("");
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [eventFilter, setEventFilter] = useState("all"); // 'all', 'upcoming', 'past'
  
  // Media selector state
  const [isMediaSelectorOpen, setIsMediaSelectorOpen] = useState(false);

  // Display any query errors
  useEffect(() => {
    if (eventsError) {
      handleError(eventsError, "Failed to load events");
    }
  }, [eventsError, handleError]);

  // Use React Query for fetching media
  const {
    data: mediaItems = [],
    isLoading: mediaLoading,
  } = useMediaQuery({
    enabled: isMediaSelectorOpen, // Only fetch when media selector is open
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await submitForm();
  };

  const handleEdit = withErrorHandling(
    (event) => {
      // Parse and normalize the event data
      const normalizedEvent = parseEventFromAPI(event);
      
      // Log the event data before and after normalization for debugging
      console.log("Original event data:", event);
      console.log("Normalized event data:", normalizedEvent);
      
      editEvent(normalizedEvent);
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

  const handleImagePreview = (imageUrl) => {
    setSelectedImage(getImageUrl(imageUrl, eventPlaceholderImage));
    setShowImagePreview(true);
  };

  const handleImageError = (e) => {
    // Use the imported SVG placeholder directly (not as a URL)
    e.target.src = eventPlaceholderImage;
    e.target.onerror = null; // Prevent infinite error loop
  };

  // Handle media selection from the media library
  const handleMediaSelection = (selectedItem) => {
    if (selectedItem) {
      const processedItem = processMediaItem(selectedItem);
      
      // Update the event with the processed media item
      setCurrentEvent((prev) => ({
        ...prev,
        imageUrl: processedItem.path,
        image: processedItem,
      }));
    }
  };

  // Enhanced date change handler to ensure date updates work correctly
  const handleDateChange = (e) => {
    const inputDate = e.target.value;
    
    if (inputDate) {
      try {
        // Parse the date and ensure it's valid
        const dateObj = parseISO(inputDate);
        
        if (!isValid(dateObj)) {
          throw new Error("Invalid date format");
        }
        
        // Format the date properly for display and API
        const formattedDate = format(dateObj, "MMMM d, yyyy");
        
        // Update the date fields in the event
        setCurrentEvent((prev) => ({
          ...prev,
          date: inputDate, // ISO format for the input field (yyyy-MM-dd)
          formattedDate: formattedDate, // Human-readable format
          startDate: dateObj, // Date object for the API
        }));
        
        console.log("Date updated successfully:", {
          date: inputDate,
          formattedDate,
          startDate: dateObj,
        });
        
        // Clear any previous errors
        if (formErrors.date) {
          setFormErrors((prev) => ({ ...prev, date: null }));
        }
      } catch (err) {
        console.error("Error formatting date:", err);
        
        // Set validation error
        setFormErrors((prev) => ({
          ...prev,
          date: "Invalid date format. Please use the date picker.",
        }));
      }
    } else {
      // Handle empty date
      setCurrentEvent((prev) => ({
        ...prev,
        date: "",
        formattedDate: "",
      }));
      
      // Set validation error for required field
      if (EVENT_VALIDATION_RULES.date.required) {
        setFormErrors((prev) => ({
          ...prev,
          date: "Date is required",
        }));
      }
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
            validation={EVENT_VALIDATION_RULES.title}
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
              onChange={handleDateChange}
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
            validation={EVENT_VALIDATION_RULES.time}
            errors={formErrors}
            setErrors={setFormErrors}
            helpText="Format: HH:MM or HH:MM AM/PM"
            className="mb-0"
          />

          <FormField
            label="Location"
            name="location"
            type="text"
            value={currentEvent.location}
            onChange={handleInputChange}
            placeholder="Enter event location"
            required={true}
            validation={EVENT_VALIDATION_RULES.location}
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
            validation={EVENT_VALIDATION_RULES.description}
            errors={formErrors}
            setErrors={setFormErrors}
            rows="3"
            className="md:col-span-2"
          />

          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Event Type
              </label>
              <select
                name="type"
                value={currentEvent.type}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {EVENT_TYPES.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Requires Sign-up
              </label>
              <div className="flex items-center mt-2">
                <input
                  type="checkbox"
                  id="signupRequired"
                  name="signupRequired"
                  checked={currentEvent.signupRequired}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="signupRequired"
                  className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                >
                  Enable sign-up form for this event
                </label>
              </div>
            </div>
          </div>

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
                  src={getImageUrl(currentEvent.imageUrl, eventPlaceholderImage)}
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

        {!showForm && (
          <button
            type="button"
            onClick={addEvent}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add New Event
          </button>
        )}

        {showForm && (
          <div className="flex items-center">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white py-2 px-4 rounded-md transition-colors"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save Event"}
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
        )}
      </form>

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
            <EventAdminCard 
              key={event.id || event._id}
              event={event}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onDuplicate={duplicateEvent}
              onImageClick={handleImagePreview}
            />
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
                  key={event.id || event._id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      {event.imageUrl ? (
                        <img
                          src={getImageUrl(event.imageUrl, eventPlaceholderImage)}
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
                        onClick={() => duplicateEvent(event)}
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

      <MediaSelector 
        isOpen={isMediaSelectorOpen}
        onClose={() => setIsMediaSelectorOpen(false)}
        onSelect={handleMediaSelection}
      />
      
      <ImagePreview
        isOpen={showImagePreview}
        imageUrl={selectedImage}
        onClose={() => setShowImagePreview(false)}
      />
    </div>
  );
};

export default EventManager;
