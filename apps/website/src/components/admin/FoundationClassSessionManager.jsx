import React, { useState } from "react";
import { format, parseISO, isValid } from "date-fns";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  UserGroupIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon as RefreshIcon,
} from "@heroicons/react/24/outline";
import {
  useFoundationClassSessionsQuery,
  useCreateFoundationClassSessionMutation,
  useUpdateFoundationClassSessionMutation,
  useDeleteFoundationClassSessionMutation,
} from "../../hooks/useFoundationClassSessionsQuery";
import { useErrorHandler } from "../../hooks/useErrorHandler";
import { ensureAuthenticated } from "../../utils/authUtils";
import { FoundationClassSessionService } from "../../services/foundationClassSessionService";

const FoundationClassSessionManager = () => {
  // Use our custom hooks
  const {
    data: sessions = [],
    isLoading: sessionsLoading,
    error: sessionsError,
    refetch: refetchSessions,
    usingMockData,
  } = useFoundationClassSessionsQuery();

  const createSessionMutation = useCreateFoundationClassSessionMutation();
  const updateSessionMutation = useUpdateFoundationClassSessionMutation();
  const deleteSessionMutation = useDeleteFoundationClassSessionMutation();

  // Local state
  const { error, errorMessage, handleError, clearError, withErrorHandling } =
    useErrorHandler("FoundationClassSessionManager");
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState("add");
  const [successMessage, setSuccessMessage] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [currentSession, setCurrentSession] = useState({
    startDate: format(new Date(), "yyyy-MM-dd"),
    endDate: format(
      new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
      "yyyy-MM-dd"
    ), // 3 weeks later
    day: "Sundays",
    time: "9:00 AM - 10:30 AM",
    location: "Room 201",
    capacity: 20,
    enrolledCount: 0,
    active: true,
  });

  // Reset form to default values
  const resetForm = () => {
    setCurrentSession({
      startDate: format(new Date(), "yyyy-MM-dd"),
      endDate: format(
        new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
        "yyyy-MM-dd"
      ),
      day: "Sundays",
      time: "9:00 AM - 10:30 AM",
      location: "Room 201",
      capacity: 20,
      enrolledCount: 0,
      active: true,
    });
    setFormMode("add");
    setFormErrors({});
    setShowForm(false);
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentSession((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when field is edited
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  // Handle checkbox changes
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setCurrentSession((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  // Validate form
  const validateForm = () => {
    const errors = {};

    if (!currentSession.startDate) {
      errors.startDate = "Start date is required";
    }

    if (!currentSession.endDate) {
      errors.endDate = "End date is required";
    }

    if (!currentSession.day) {
      errors.day = "Day is required";
    }

    if (!currentSession.time) {
      errors.time = "Time is required";
    }

    if (!currentSession.location) {
      errors.location = "Location is required";
    }

    if (!currentSession.capacity || currentSession.capacity <= 0) {
      errors.capacity = "Capacity must be greater than 0";
    }

    return errors;
  };

  // Handle form submission
  const handleSubmit = withErrorHandling(
    async (e) => {
      e.preventDefault();

      // Validate form
      const errors = validateForm();
      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        return;
      }

      // Ensure we're authenticated
      try {
        const isAuthenticated = await ensureAuthenticated();
        if (!isAuthenticated) {
          handleError(
            new Error(
              "Authentication failed. Please log in again before submitting."
            ),
            "Authentication"
          );
          return;
        }
      } catch (authError) {
        handleError(authError, "Authentication");
        return;
      }

      try {
        // Format dates properly
        const formattedSession = {
          ...currentSession,
          startDate: new Date(currentSession.startDate),
          endDate: new Date(currentSession.endDate),
          capacity: parseInt(currentSession.capacity, 10),
          enrolledCount: parseInt(currentSession.enrolledCount, 10) || 0,
        };

        if (formMode === "add") {
          await createSessionMutation.mutateAsync(formattedSession);
          setSuccessMessage("Foundation class session created successfully!");
        } else {
          await updateSessionMutation.mutateAsync({
            id: currentSession.id,
            sessionData: formattedSession,
          });
          setSuccessMessage("Foundation class session updated successfully!");
        }

        // Clear cache to ensure we get fresh data
        FoundationClassSessionService.clearCache();
        await refetchSessions();
        resetForm();

        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(""), 3000);
      } catch (error) {
        handleError(error, "Session Submission");
      }
    },
    {
      context: "Form Submission",
    }
  );

  // Handle edit session
  const handleEdit = (session) => {
    try {
      // Format dates for form inputs
      const startDate = format(new Date(session.startDate), "yyyy-MM-dd");
      const endDate = format(new Date(session.endDate), "yyyy-MM-dd");

      setCurrentSession({
        ...session,
        startDate,
        endDate,
        capacity: session.capacity.toString(),
        enrolledCount: session.enrolledCount.toString(),
      });

      setFormMode("edit");
      setShowForm(true);
    } catch (error) {
      handleError(error, "Editing Session");
    }
  };

  // Handle delete session
  const handleDelete = withErrorHandling(
    async (session) => {
      if (window.confirm("Are you sure you want to delete this session?")) {
        try {
          await deleteSessionMutation.mutateAsync(session.id);
          setSuccessMessage("Foundation class session deleted successfully!");

          // Clear cache to ensure we get fresh data
          FoundationClassSessionService.clearCache();
          await refetchSessions();

          // Clear success message after 3 seconds
          setTimeout(() => setSuccessMessage(""), 3000);
        } catch (error) {
          handleError(error, "Session Deletion");
        }
      }
    },
    {
      context: "Session Deletion",
    }
  );

  // Format date for display
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "MMMM d, yyyy");
    } catch (error) {
      return "Invalid date";
    }
  };

  // Calculate spots left
  const calculateSpotsLeft = (session) => {
    return Math.max(0, session.capacity - session.enrolledCount);
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 sm:p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Foundation Class Sessions
        </h2>
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={() => {
              FoundationClassSessionService.clearCache();
              refetchSessions();
            }}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
          >
            <RefreshIcon className="-ml-0.5 mr-2 h-4 w-4" />
            Refresh
          </button>
          <button
            type="button"
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <PlusIcon className="-ml-0.5 mr-2 h-4 w-4" />
            Add Session
          </button>
        </div>
      </div>

      {/* Success message */}
      {successMessage && (
        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-md">
          {successMessage}
        </div>
      )}

      {/* Mock data notification */}
      {usingMockData && (
        <div className="mb-4 p-4 bg-yellow-100 text-yellow-700 rounded-md">
          <p className="font-medium">Using Mock Data</p>
          <p>
            The API endpoint for foundation class sessions is not available.
            Using mock data instead.
          </p>
          <p className="mt-2 text-sm">
            Note: Changes made here will be stored locally but won't be saved to
            the server.
          </p>
        </div>
      )}

      {/* Error message */}
      {errorMessage && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
          <p className="font-medium">Error</p>
          <p>{errorMessage}</p>
          <button
            onClick={clearError}
            className="mt-2 text-sm underline hover:text-red-800"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Form for adding/editing sessions */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-8 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
        >
          <h3 className="text-lg font-medium mb-4">
            {formMode === "add" ? "Add New Session" : "Edit Session"}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Start Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Start Date
              </label>
              <input
                type="date"
                name="startDate"
                value={currentSession.startDate}
                onChange={handleInputChange}
                className={`w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white ${
                  formErrors.startDate ? "border-red-500" : "border-gray-300"
                }`}
              />
              {formErrors.startDate && (
                <p className="mt-1 text-sm text-red-500">
                  {formErrors.startDate}
                </p>
              )}
            </div>

            {/* End Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                End Date
              </label>
              <input
                type="date"
                name="endDate"
                value={currentSession.endDate}
                onChange={handleInputChange}
                className={`w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white ${
                  formErrors.endDate ? "border-red-500" : "border-gray-300"
                }`}
              />
              {formErrors.endDate && (
                <p className="mt-1 text-sm text-red-500">
                  {formErrors.endDate}
                </p>
              )}
            </div>

            {/* Day */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Day
              </label>
              <select
                name="day"
                value={currentSession.day}
                onChange={handleInputChange}
                className={`w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white ${
                  formErrors.day ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Select a day</option>
                <option value="Sundays">Sundays</option>
                <option value="Mondays">Mondays</option>
                <option value="Tuesdays">Tuesdays</option>
                <option value="Wednesdays">Wednesdays</option>
                <option value="Thursdays">Thursdays</option>
                <option value="Fridays">Fridays</option>
                <option value="Saturdays">Saturdays</option>
              </select>
              {formErrors.day && (
                <p className="mt-1 text-sm text-red-500">{formErrors.day}</p>
              )}
            </div>

            {/* Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Time
              </label>
              <input
                type="text"
                name="time"
                value={currentSession.time}
                onChange={handleInputChange}
                placeholder="e.g. 9:00 AM - 10:30 AM"
                className={`w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white ${
                  formErrors.time ? "border-red-500" : "border-gray-300"
                }`}
              />
              {formErrors.time && (
                <p className="mt-1 text-sm text-red-500">{formErrors.time}</p>
              )}
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={currentSession.location}
                onChange={handleInputChange}
                placeholder="e.g. Room 201"
                className={`w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white ${
                  formErrors.location ? "border-red-500" : "border-gray-300"
                }`}
              />
              {formErrors.location && (
                <p className="mt-1 text-sm text-red-500">
                  {formErrors.location}
                </p>
              )}
            </div>

            {/* Capacity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Capacity
              </label>
              <input
                type="number"
                name="capacity"
                value={currentSession.capacity}
                onChange={handleInputChange}
                min="1"
                className={`w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white ${
                  formErrors.capacity ? "border-red-500" : "border-gray-300"
                }`}
              />
              {formErrors.capacity && (
                <p className="mt-1 text-sm text-red-500">
                  {formErrors.capacity}
                </p>
              )}
            </div>

            {/* Enrolled Count (only for edit mode) */}
            {formMode === "edit" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Enrolled Count
                </label>
                <input
                  type="number"
                  name="enrolledCount"
                  value={currentSession.enrolledCount}
                  onChange={handleInputChange}
                  min="0"
                  max={currentSession.capacity}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                />
              </div>
            )}

            {/* Active Status */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="active"
                name="active"
                checked={currentSession.active}
                onChange={handleCheckboxChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="active"
                className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
              >
                Active (visible to users)
              </label>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={
                createSessionMutation.isPending ||
                updateSessionMutation.isPending
              }
              className="inline-flex justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {createSessionMutation.isPending ||
              updateSessionMutation.isPending
                ? "Saving..."
                : formMode === "add"
                  ? "Create Session"
                  : "Update Session"}
            </button>
          </div>
        </form>
      )}

      {/* Sessions List */}
      <div className="overflow-x-auto">
        {sessionsLoading ? (
          <div className="text-center py-4">Loading sessions...</div>
        ) : sessionsError ? (
          <div className="text-center py-4 text-red-500">
            Error loading sessions. Please try again.
          </div>
        ) : sessions.length === 0 ? (
          <div className="text-center py-4 text-gray-500 dark:text-gray-400">
            No foundation class sessions found. Click "Add Session" to create
            one.
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Dates
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Day & Time
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Location
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Capacity
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
              {sessions.map((session) => (
                <tr
                  key={session.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <CalendarIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {formatDate(session.startDate)}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          to {formatDate(session.endDate)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <ClockIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {session.day}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {session.time}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <MapPinIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                      <span className="text-sm text-gray-900 dark:text-white">
                        {session.location}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <UserGroupIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {session.enrolledCount} / {session.capacity}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {calculateSpotsLeft(session)} spots left
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {session.active ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
                        <CheckCircleIcon className="mr-1 h-4 w-4" />
                        Active
                      </span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                        <XCircleIcon className="mr-1 h-4 w-4" />
                        Inactive
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(session)}
                      className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(session)}
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      disabled={deleteSessionMutation.isPending}
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default FoundationClassSessionManager;
