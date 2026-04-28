import { useState, useEffect } from "react";
import { useDarkMode } from "../../contexts/DarkModeContext";
import useErrorHandler from "../../hooks/useErrorHandler";
import useRecurringEventForm from "../../hooks/useRecurringEventForm";
import RecurringEventForm from "./RecurringEventForm";
import { deleteRecurringEvent } from "../../services/api/events";
import { useRecurringEventsQuery } from "../../hooks/useRecurringEventsQuery";
import {
  PlusIcon,
  CalendarIcon,
  ClockIcon,
  MapPinIcon as LocationMarkerIcon,
  XMarkIcon as XIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  MagnifyingGlassIcon as SearchIcon,
  FunnelIcon as FilterIcon,
  Squares2X2Icon as ViewGridIcon,
  ListBulletIcon as ViewListIcon,
  ArrowPathIcon as RefreshIcon,
} from "@heroicons/react/24/outline";

const RecurringEventManager = () => {
  const { darkMode } = useDarkMode();
  // Use React Query for fetching recurring events
  const {
    data: recurringEvents = [],
    isLoading: eventsLoading,
    error: eventsError,
    refetch: refetchEvents,
  } = useRecurringEventsQuery();

  // Use our custom error handling hook
  const { error, errorMessage, handleError, clearError, withErrorHandling } =
    useErrorHandler("RecurringEventManager");

  // Use our custom form handling hook
  const {
    currentEvent,
    formErrors,
    formMode,
    showForm,
    isSubmitting,
    setShowForm,
    handleInputChange,
    handleCheckboxChange,
    resetForm,
    editEvent,
    addEvent,
    submitForm,
  } = useRecurringEventForm({
    onSuccess: (savedEvent, action) => {
      console.log(`Recurring event ${action} successfully:`, savedEvent);
      setSuccessMessage(`Recurring event ${action} successfully!`);
      refetchEvents();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(""), 3000);
    },
    onError: (error) => {
      console.error("Error in RecurringEventForm submission:", error);
      handleError(error, "Recurring Event Form Submission");
    },
  });

  // UI state
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("title");
  const [sortOrder, setSortOrder] = useState("asc");
  const [successMessage, setSuccessMessage] = useState("");

  // Display any query errors
  useEffect(() => {
    if (eventsError) {
      handleError(eventsError, "Failed to load recurring events");
    }
  }, [eventsError, handleError]);

  // Handle adding a new recurring event
  const handleAddEvent = () => {
    addEvent();
  };

  // Handle editing a recurring event
  const handleEdit = withErrorHandling(
    (event) => {
      editEvent(event);
    },
    {
      context: "Recurring Event Editing",
    }
  );

  // Handle deleting a recurring event
  const handleDelete = withErrorHandling(
    async (event) => {
      if (
        window.confirm("Are you sure you want to delete this recurring event?")
      ) {
        const eventId = event.id || event._id;

        if (!eventId) {
          throw new Error("Cannot delete recurring event: Missing event ID");
        }

        await deleteRecurringEvent(eventId);
        setSuccessMessage("Recurring event deleted successfully!");
        await refetchEvents();

        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(""), 3000);
      }
    },
    {
      context: "Recurring Event Deletion",
    }
  );

  // Filter recurring events based on search
  const filteredEvents = recurringEvents
    .filter((event) => {
      // Filter by search term
      const matchesSearch =
        searchTerm === "" ||
        event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location?.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesSearch;
    })
    .sort((a, b) => {
      // Sort by the selected field
      const aValue = a[sortBy] || "";
      const bValue = b[sortBy] || "";

      // Handle string comparison
      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortOrder === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      // Handle numeric comparison
      return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
    });

  return (
    <div className="space-y-6">
      {/* Success message */}
      {successMessage && (
        <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-4">
          <div className="flex">
            <CheckCircleIcon className="h-5 w-5 text-green-500 dark:text-green-400 mr-2" />
            <span className="text-green-800 dark:text-green-200">
              {successMessage}
            </span>
          </div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
          <div className="flex">
            <ExclamationCircleIcon className="h-5 w-5 text-red-500 dark:text-red-400 mr-2" />
            <div>
              <span className="text-red-800 dark:text-red-200 font-medium">
                Error:{" "}
              </span>
              <span className="text-red-800 dark:text-red-200">
                {errorMessage}
              </span>
            </div>
            <button
              onClick={clearError}
              className="ml-auto text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
            >
              <XIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Search and filters */}
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          {/* Search input */}
          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
            </div>
            <input
              type="text"
              placeholder="Search recurring events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* View mode toggle */}
          <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 ${
                viewMode === "grid"
                  ? "bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400"
                  : "bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400"
              }`}
              title="Grid view"
            >
              <ViewGridIcon className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 ${
                viewMode === "list"
                  ? "bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400"
                  : "bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400"
              }`}
              title="List view"
            >
              <ViewListIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Refresh button */}
          <button
            onClick={() => refetchEvents()}
            className="p-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
            title="Refresh"
          >
            <RefreshIcon className="h-5 w-5" />
          </button>

          {/* Add event button */}
          <button
            onClick={handleAddEvent}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Add Recurring Event</span>
          </button>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
              onClick={() => setShowForm(false)}
            >
              <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
            </div>

            {/* Modal panel */}
            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <h3
                      className="text-lg leading-6 font-medium text-gray-900 dark:text-white"
                      id="modal-title"
                    >
                      {formMode === "add"
                        ? "Add Recurring Event"
                        : "Edit Recurring Event"}
                    </h3>
                    <div className="mt-4">
                      <RecurringEventForm
                        currentEvent={currentEvent}
                        formErrors={formErrors}
                        formMode={formMode}
                        isSubmitting={isSubmitting}
                        handleInputChange={handleInputChange}
                        handleCheckboxChange={handleCheckboxChange}
                        submitForm={submitForm}
                        onCancel={() => setShowForm(false)}
                        darkMode={darkMode}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      {eventsLoading && recurringEvents.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 dark:border-blue-400 border-t-transparent dark:border-t-transparent"></div>
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="text-center py-12">
          <CalendarIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
            No recurring events found
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {searchTerm
              ? "Try adjusting your search"
              : "Get started by adding a new recurring event"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredEvents.map((event) => (
            <div
              key={event.id || event._id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {event.title}
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                  {event.description}
                </p>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <ClockIcon className="h-4 w-4 mr-1.5" />
                    <span>{event.time}</span>
                  </div>
                  {event.location && (
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <LocationMarkerIcon className="h-4 w-4 mr-1.5" />
                      <span>{event.location}</span>
                    </div>
                  )}
                </div>
                <div className="mt-4 flex justify-end space-x-2">
                  <button
                    onClick={() => handleEdit(event)}
                    className="px-3 py-1.5 text-sm bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/50"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(event)}
                    className="px-3 py-1.5 text-sm bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-md hover:bg-red-100 dark:hover:bg-red-900/50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecurringEventManager;
