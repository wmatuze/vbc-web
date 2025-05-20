import { useState } from "react";
import {
  createRecurringEvent,
  updateRecurringEvent,
} from "../services/api/events";

// Initial state for a new recurring event
const INITIAL_RECURRING_EVENT_STATE = {
  title: "",
  description: "",
  recurrenceType: "monthly", // Default to monthly
  dayOfWeek: 0, // Default to Sunday
  weekOfMonth: "first", // Default to first week
  dayOfMonth: 1, // Default to 1st day
  month: 0, // Default to January
  time: "",
  icon: "",
  color: "primary",
  featured: false,
  active: true,
  location: "",
};

// Validation rules for recurring event fields
const RECURRING_EVENT_VALIDATION_RULES = {
  title: { type: "string", required: true, maxLength: 100, fieldName: "Title" },
  description: {
    type: "string",
    required: true,
    maxLength: 1000,
    fieldName: "Description",
  },
  recurrenceType: {
    type: "string",
    required: true,
    enum: ["weekly", "monthly", "yearly"],
    fieldName: "Recurrence Type",
  },
  dayOfWeek: { type: "number", min: 0, max: 6, fieldName: "Day of Week" },
  weekOfMonth: {
    type: "string",
    enum: ["first", "second", "third", "fourth", "last"],
    fieldName: "Week of Month",
  },
  dayOfMonth: { type: "number", min: 1, max: 31, fieldName: "Day of Month" },
  month: { type: "number", min: 0, max: 11, fieldName: "Month" },
  time: { type: "string", required: true, fieldName: "Time" },
  location: { type: "string", maxLength: 100, fieldName: "Location" },
};

/**
 * Validate a single field based on its validation rules
 * @param {string} name - Field name
 * @param {any} value - Field value
 * @param {Object} rules - Validation rules
 * @param {Object} currentErrors - Current error state
 * @param {Function} setErrors - Function to update errors
 * @returns {boolean} - Whether the field is valid
 */
const validateField = (name, value, rules, currentErrors, setErrors) => {
  let isValid = true;
  let errorMessage = null;

  // Skip validation if no rules for this field
  if (!rules) return true;

  // Required field validation
  if (
    rules.required &&
    (value === undefined || value === null || value === "")
  ) {
    isValid = false;
    errorMessage = `${rules.fieldName || name} is required`;
  }
  // String validations
  else if (rules.type === "string" && typeof value === "string") {
    if (rules.maxLength && value.length > rules.maxLength) {
      isValid = false;
      errorMessage = `${rules.fieldName || name} must be less than ${rules.maxLength} characters`;
    }
    if (rules.minLength && value.length < rules.minLength) {
      isValid = false;
      errorMessage = `${rules.fieldName || name} must be at least ${rules.minLength} characters`;
    }
    if (rules.enum && !rules.enum.includes(value)) {
      isValid = false;
      errorMessage = `${rules.fieldName || name} must be one of: ${rules.enum.join(", ")}`;
    }
  }
  // Number validations
  else if (rules.type === "number" && !isNaN(Number(value))) {
    const numValue = Number(value);
    if (rules.min !== undefined && numValue < rules.min) {
      isValid = false;
      errorMessage = `${rules.fieldName || name} must be at least ${rules.min}`;
    }
    if (rules.max !== undefined && numValue > rules.max) {
      isValid = false;
      errorMessage = `${rules.fieldName || name} must be at most ${rules.max}`;
    }
  }

  // Update errors state
  if (errorMessage !== currentErrors[name]) {
    setErrors((prev) => ({
      ...prev,
      [name]: errorMessage,
    }));
  }

  return isValid;
};

/**
 * Validate all fields in the recurring event form
 * @param {Object} event - The recurring event data
 * @returns {Object} - Validation result with isValid flag and errors object
 */
const validateRecurringEvent = (event) => {
  const errors = {};
  let isValid = true;

  console.log("Validating recurring event:", event);

  // Validate required fields first
  if (!event.title || event.title.trim() === "") {
    errors.title = "Title is required";
    isValid = false;
  }

  if (!event.description || event.description.trim() === "") {
    errors.description = "Description is required";
    isValid = false;
  }

  if (!event.time || event.time.trim() === "") {
    errors.time = "Time is required";
    isValid = false;
  }

  // Validate recurrence type specific fields
  const recurrenceType = event.recurrenceType || "monthly";

  if (recurrenceType === "weekly") {
    // For weekly events, dayOfWeek is required
    if (
      event.dayOfWeek === undefined ||
      event.dayOfWeek === null ||
      event.dayOfWeek === ""
    ) {
      errors.dayOfWeek = "Day of week is required for weekly recurring events";
      isValid = false;
    }
  } else if (recurrenceType === "monthly") {
    // For monthly events, either weekOfMonth or dayOfMonth is required
    if (event.weekOfMonth && event.dayOfMonth) {
      errors.weekOfMonth =
        "Please choose either week of month or day of month, not both";
      isValid = false;
    } else if (!event.weekOfMonth && !event.dayOfMonth) {
      errors.weekOfMonth =
        "Either week of month or day of month is required for monthly recurring events";
      isValid = false;
    }
  } else if (recurrenceType === "yearly") {
    // For yearly events, month is required
    if (
      event.month === undefined ||
      event.month === null ||
      event.month === ""
    ) {
      errors.month = "Month is required for yearly recurring events";
      isValid = false;
    }
  }

  console.log("Validation result:", { isValid, errors });
  return { isValid, errors };
};

/**
 * Custom hook for managing recurring event form state and operations
 * @param {Object} options - Configuration options
 * @param {Function} options.onSuccess - Callback after successful save
 * @param {Function} options.onError - Callback for error handling
 * @returns {Object} Form state and event handlers
 */
export const useRecurringEventForm = ({ onSuccess, onError }) => {
  const [currentEvent, setCurrentEvent] = useState(
    INITIAL_RECURRING_EVENT_STATE
  );
  const [formErrors, setFormErrors] = useState({});
  const [formMode, setFormMode] = useState("add");
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Reset the form to initial state
   */
  const resetForm = () => {
    setCurrentEvent(INITIAL_RECURRING_EVENT_STATE);
    setFormMode("add");
    setFormErrors({});
    setShowForm(false);
  };

  /**
   * Handle input changes for form fields
   * @param {Object} e - Event object
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Convert numeric values for specific fields
    let processedValue = value;
    if (name === "dayOfWeek" || name === "month" || name === "dayOfMonth") {
      // Convert string numbers to actual numbers
      processedValue = value === "" ? "" : Number(value);
    }

    console.log(`Field ${name} changed to:`, processedValue);
    setCurrentEvent((prev) => ({ ...prev, [name]: processedValue }));

    // Validate the field if it has validation rules
    if (RECURRING_EVENT_VALIDATION_RULES[name]) {
      validateField(
        name,
        processedValue,
        RECURRING_EVENT_VALIDATION_RULES[name],
        formErrors,
        setFormErrors
      );
    }
  };

  /**
   * Handle checkbox changes
   * @param {Object} e - Event object
   */
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    console.log(`Checkbox ${name} changed to ${checked}`);
    setCurrentEvent((prev) => ({ ...prev, [name]: checked }));
  };

  /**
   * Set up the form for editing an existing recurring event
   * @param {Object} event - Event data to edit
   */
  const editEvent = (event) => {
    // Make sure we preserve the ID for updates
    const eventWithId = {
      ...event,
      id: event.id || event._id, // Normalize ID field
    };

    console.log("Setting up form for editing:", eventWithId);
    setCurrentEvent(eventWithId);
    setFormMode("edit");
    setShowForm(true);
  };

  /**
   * Set up the form for creating a new recurring event
   */
  const addEvent = () => {
    resetForm();
    setFormMode("add");
    setShowForm(true);
  };

  /**
   * Submit the recurring event form
   * @returns {Promise<Object|null>} The saved event or null if validation fails
   */
  const submitForm = async () => {
    console.log("Submitting recurring event form with data:", currentEvent);

    // Validate all fields before submission
    const { isValid, errors } = validateRecurringEvent(currentEvent);

    if (!isValid) {
      // Update form errors and stop submission
      console.error("Form validation failed with errors:", errors);
      setFormErrors(errors);

      if (onError) {
        onError(new Error("Please fix the form errors before submitting"));
      }
      return null;
    }

    setIsSubmitting(true);

    try {
      // Prepare the event data for the API
      const serverEvent = { ...currentEvent };

      // Remove any frontend-specific properties
      delete serverEvent.__v;
      delete serverEvent.createdAt;
      delete serverEvent.updatedAt;

      // Ensure numeric fields are properly typed
      if (serverEvent.dayOfWeek !== undefined && serverEvent.dayOfWeek !== "") {
        serverEvent.dayOfWeek = Number(serverEvent.dayOfWeek);
      }

      if (
        serverEvent.dayOfMonth !== undefined &&
        serverEvent.dayOfMonth !== ""
      ) {
        serverEvent.dayOfMonth = Number(serverEvent.dayOfMonth);
      }

      if (serverEvent.month !== undefined && serverEvent.month !== "") {
        serverEvent.month = Number(serverEvent.month);
      }

      console.log(
        "Prepared server event data:",
        JSON.stringify(serverEvent, null, 2)
      );

      let savedEvent;
      if (formMode === "add") {
        // Create a new recurring event
        console.log("Calling createRecurringEvent API...");
        savedEvent = await createRecurringEvent(serverEvent);
        console.log("Recurring event created successfully:", savedEvent);
      } else {
        // Update an existing recurring event
        const eventId = currentEvent.id || currentEvent._id;

        if (!eventId) {
          throw new Error("Cannot update recurring event: Missing event ID");
        }

        console.log(`Updating recurring event with ID: ${eventId}`);
        savedEvent = await updateRecurringEvent(eventId, serverEvent);
        console.log("Recurring event updated successfully:", savedEvent);
      }

      // Reset form state after successful save
      resetForm();

      // Call success callback if provided
      if (onSuccess) {
        onSuccess(savedEvent, formMode === "add" ? "added" : "updated");
      }

      return savedEvent;
    } catch (error) {
      console.error("Error submitting recurring event:", error);

      // Log more details about the error
      if (error.response) {
        console.error("Response error data:", error.response.data);
        console.error("Response status:", error.response.status);
      }

      if (onError) {
        onError(error);
      }
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    // State
    currentEvent,
    formErrors,
    formMode,
    showForm,
    isSubmitting,

    // Setters
    setCurrentEvent,
    setFormErrors,
    setShowForm,

    // Event handlers
    handleInputChange,
    handleCheckboxChange,

    // Form operations
    resetForm,
    editEvent,
    addEvent,
    submitForm,
  };
};

export default useRecurringEventForm;
