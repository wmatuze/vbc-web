import React from "react";
import FormField from "../common/FormField";
import {
  XMarkIcon as XIcon,
  CheckIcon,
  CalendarIcon,
  ClockIcon,
  MapPinIcon as LocationMarkerIcon,
} from "@heroicons/react/24/outline";

const RecurringEventForm = ({
  currentEvent,
  formErrors,
  formMode,
  isSubmitting,
  handleInputChange,
  handleCheckboxChange,
  submitForm,
  onCancel,
  darkMode,
}) => {
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted with data:", currentEvent);
    try {
      const result = await submitForm();
      console.log("Form submission result:", result);
      if (result) {
        onCancel(); // Close the form on successful submission
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  // Helper function to render the appropriate recurrence type fields
  const renderRecurrenceFields = () => {
    const recurrenceType = currentEvent.recurrenceType || "monthly";

    switch (recurrenceType) {
      case "weekly":
        return (
          <div className="mb-4">
            <FormField
              label="Day of Week"
              name="dayOfWeek"
              type="select"
              value={currentEvent.dayOfWeek || 0}
              onChange={handleInputChange}
              error={formErrors.dayOfWeek}
              required
              darkmode={darkMode}
            >
              <option value="0">Sunday</option>
              <option value="1">Monday</option>
              <option value="2">Tuesday</option>
              <option value="3">Wednesday</option>
              <option value="4">Thursday</option>
              <option value="5">Friday</option>
              <option value="6">Saturday</option>
            </FormField>
          </div>
        );

      case "monthly":
        return (
          <>
            <div className="mb-4">
              <FormField
                label="Week of Month"
                name="weekOfMonth"
                type="select"
                value={currentEvent.weekOfMonth || ""}
                onChange={handleInputChange}
                error={formErrors.weekOfMonth}
                darkmode={darkMode}
                helpText="Select this for events like 'First Sunday of the month'"
              >
                <option value="">-- Select Week --</option>
                <option value="first">First</option>
                <option value="second">Second</option>
                <option value="third">Third</option>
                <option value="fourth">Fourth</option>
                <option value="last">Last</option>
              </FormField>
            </div>

            <div className="mb-4">
              <FormField
                label="Day of Month"
                name="dayOfMonth"
                type="number"
                min={1}
                max={31}
                value={currentEvent.dayOfMonth || ""}
                onChange={handleInputChange}
                error={formErrors.dayOfMonth}
                darkmode={darkMode}
                helpText="Select this for events on a specific date like 'The 15th of every month'"
              />
            </div>

            {formErrors.recurrenceConflict && (
              <div className="mb-4 text-red-500 text-sm">
                {formErrors.recurrenceConflict}
              </div>
            )}
          </>
        );

      case "yearly":
        return (
          <div className="mb-4">
            <FormField
              label="Month"
              name="month"
              type="select"
              value={currentEvent.month || 0}
              onChange={handleInputChange}
              error={formErrors.month}
              required
              darkmode={darkMode}
            >
              <option value="0">January</option>
              <option value="1">February</option>
              <option value="2">March</option>
              <option value="3">April</option>
              <option value="4">May</option>
              <option value="5">June</option>
              <option value="6">July</option>
              <option value="7">August</option>
              <option value="8">September</option>
              <option value="9">October</option>
              <option value="10">November</option>
              <option value="11">December</option>
            </FormField>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left column */}
        <div>
          <div className="mb-4">
            <FormField
              label="Title"
              name="title"
              type="text"
              value={currentEvent.title || ""}
              onChange={handleInputChange}
              error={formErrors.title}
              required
              darkmode={darkMode}
            />
          </div>

          <div className="mb-4">
            <FormField
              label="Description"
              name="description"
              type="textarea"
              rows={4}
              value={currentEvent.description || ""}
              onChange={handleInputChange}
              error={formErrors.description}
              required
              darkmode={darkMode}
            />
          </div>

          <div className="mb-4">
            <FormField
              label="Time"
              name="time"
              type="text"
              value={currentEvent.time || ""}
              onChange={handleInputChange}
              error={formErrors.time}
              required
              darkmode={darkMode}
              placeholder="e.g. 9:30 AM"
              icon={ClockIcon}
            />
          </div>

          <div className="mb-4">
            <FormField
              label="Location"
              name="location"
              type="text"
              value={currentEvent.location || ""}
              onChange={handleInputChange}
              error={formErrors.location}
              darkmode={darkMode}
              icon={LocationMarkerIcon}
            />
          </div>
        </div>

        {/* Right column */}
        <div>
          <div className="mb-4">
            <FormField
              label="Recurrence Type"
              name="recurrenceType"
              type="select"
              value={currentEvent.recurrenceType || "monthly"}
              onChange={handleInputChange}
              error={formErrors.recurrenceType}
              required
              darkmode={darkMode}
              icon={CalendarIcon}
            >
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </FormField>
          </div>

          {/* Render fields based on recurrence type */}
          {renderRecurrenceFields()}

          <div className="mb-4">
            <FormField
              label="Icon"
              name="icon"
              type="text"
              value={currentEvent.icon || ""}
              onChange={handleInputChange}
              error={formErrors.icon}
              darkmode={darkMode}
              helpText="Icon identifier (e.g., 'oil-lamp', 'communion', 'praying-hands')"
            />
          </div>

          <div className="mb-4">
            <FormField
              label="Color"
              name="color"
              type="select"
              value={currentEvent.color || "primary"}
              onChange={handleInputChange}
              error={formErrors.color}
              darkmode={darkMode}
            >
              <option value="primary">Primary (Blue)</option>
              <option value="secondary">Secondary (Gray)</option>
              <option value="success">Success (Green)</option>
              <option value="danger">Danger (Red)</option>
              <option value="warning">Warning (Yellow)</option>
              <option value="info">Info (Light Blue)</option>
            </FormField>
          </div>

          <div className="mb-4 flex items-center">
            <FormField
              label="Featured"
              name="featured"
              type="checkbox"
              checked={currentEvent.featured || false}
              onChange={handleCheckboxChange}
              error={formErrors.featured}
              darkmode={darkMode}
              helpText="Display this event prominently on the website"
            />
          </div>

          <div className="mb-4 flex items-center">
            <FormField
              label="Active"
              name="active"
              type="checkbox"
              checked={currentEvent.active !== false} // Default to true
              onChange={handleCheckboxChange}
              error={formErrors.active}
              darkmode={darkMode}
              helpText="Inactive events won't be displayed on the website"
            />
          </div>
        </div>
      </div>

      {/* Form actions */}
      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          disabled={isSubmitting}
        >
          <span className="flex items-center">
            <XIcon className="h-4 w-4 mr-1.5" />
            Cancel
          </span>
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isSubmitting}
        >
          <span className="flex items-center">
            <CheckIcon className="h-4 w-4 mr-1.5" />
            {isSubmitting
              ? "Saving..."
              : formMode === "add"
                ? "Create Event"
                : "Update Event"}
          </span>
        </button>
      </div>
    </form>
  );
};

export default RecurringEventForm;
