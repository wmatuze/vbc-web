/**
 * Utility functions for data validation throughout the application
 */

/**
 * Validates a string field
 * @param {string} value - The value to validate
 * @param {Object} options - Validation options
 * @param {boolean} [options.required=false] - Whether the field is required
 * @param {number} [options.minLength] - Minimum length
 * @param {number} [options.maxLength] - Maximum length
 * @param {RegExp} [options.pattern] - Regex pattern to match
 * @param {string} [options.fieldName='Field'] - Name of the field for error messages
 * @returns {string|null} Error message or null if valid
 */
export const validateString = (value, options = {}) => {
  const {
    required = false,
    minLength,
    maxLength,
    pattern,
    fieldName = "Field",
  } = options;

  // Convert to string and trim
  const strValue = String(value || "").trim();

  // Check if required
  if (required && !strValue) {
    return `${fieldName} is required`;
  }

  // Skip further validation if empty and not required
  if (!strValue && !required) {
    return null;
  }

  // Check min length
  if (minLength !== undefined && strValue.length < minLength) {
    return `${fieldName} must be at least ${minLength} characters`;
  }

  // Check max length
  if (maxLength !== undefined && strValue.length > maxLength) {
    return `${fieldName} must be no more than ${maxLength} characters`;
  }

  // Check pattern
  if (pattern && !pattern.test(strValue)) {
    return `${fieldName} has an invalid format`;
  }

  return null;
};

/**
 * Validates a date field
 * @param {string|Date} value - The date to validate
 * @param {Object} options - Validation options
 * @param {boolean} [options.required=false] - Whether the field is required
 * @param {Date} [options.minDate] - Minimum date
 * @param {Date} [options.maxDate] - Maximum date
 * @param {string} [options.fieldName='Date'] - Name of the field for error messages
 * @returns {string|null} Error message or null if valid
 */
export const validateDate = (value, options = {}) => {
  const { required = false, minDate, maxDate, fieldName = "Date" } = options;

  // Handle empty values
  if (!value) {
    return required ? `${fieldName} is required` : null;
  }

  // Convert to Date object
  const dateValue = value instanceof Date ? value : new Date(value);

  // Check if valid date
  if (isNaN(dateValue.getTime())) {
    return `${fieldName} is not a valid date`;
  }

  // Check min date
  if (minDate && dateValue < minDate) {
    return `${fieldName} must be after ${minDate.toLocaleDateString()}`;
  }

  // Check max date
  if (maxDate && dateValue > maxDate) {
    return `${fieldName} must be before ${maxDate.toLocaleDateString()}`;
  }

  return null;
};

/**
 * Validates a URL field
 * @param {string} value - The URL to validate
 * @param {Object} options - Validation options
 * @param {boolean} [options.required=false] - Whether the field is required
 * @param {string} [options.fieldName='URL'] - Name of the field for error messages
 * @returns {string|null} Error message or null if valid
 */
export const validateUrl = (value, options = {}) => {
  const { required = false, fieldName = "URL" } = options;

  // Convert to string and trim
  const strValue = String(value || "").trim();

  // Check if required
  if (required && !strValue) {
    return `${fieldName} is required`;
  }

  // Skip further validation if empty and not required
  if (!strValue && !required) {
    return null;
  }

  // Simple URL validation
  try {
    new URL(strValue);
    return null;
  } catch (e) {
    return `${fieldName} is not a valid URL`;
  }
};

/**
 * Validates a YouTube video ID
 * @param {string} value - The YouTube video ID to validate
 * @param {Object} options - Validation options
 * @param {boolean} [options.required=false] - Whether the field is required
 * @param {string} [options.fieldName='YouTube ID'] - Name of the field for error messages
 * @returns {string|null} Error message or null if valid
 */
export const validateYouTubeId = (value, options = {}) => {
  const { required = false, fieldName = "YouTube ID" } = options;

  // Convert to string and trim
  const strValue = String(value || "").trim();

  // Check if required
  if (required && !strValue) {
    return `${fieldName} is required`;
  }

  // Skip further validation if empty and not required
  if (!strValue && !required) {
    return null;
  }

  // YouTube ID validation (11 characters, alphanumeric and some special chars)
  const youtubeIdPattern = /^[a-zA-Z0-9_-]{11}$/;
  if (!youtubeIdPattern.test(strValue)) {
    return `${fieldName} is not a valid YouTube video ID`;
  }

  return null;
};

/**
 * Validates an array field
 * @param {Array} value - The array to validate
 * @param {Object} options - Validation options
 * @param {boolean} [options.required=false] - Whether the field is required
 * @param {number} [options.minLength] - Minimum array length
 * @param {number} [options.maxLength] - Maximum array length
 * @param {Function} [options.itemValidator] - Function to validate each item
 * @param {string} [options.fieldName='List'] - Name of the field for error messages
 * @returns {string|null} Error message or null if valid
 */
export const validateArray = (value, options = {}) => {
  const {
    required = false,
    minLength,
    maxLength,
    itemValidator,
    fieldName = "List",
  } = options;

  // Ensure value is an array
  const arrayValue = Array.isArray(value) ? value : [];

  // Check if required
  if (required && arrayValue.length === 0) {
    return `${fieldName} is required`;
  }

  // Check min length
  if (minLength !== undefined && arrayValue.length < minLength) {
    return `${fieldName} must have at least ${minLength} items`;
  }

  // Check max length
  if (maxLength !== undefined && arrayValue.length > maxLength) {
    return `${fieldName} must have no more than ${maxLength} items`;
  }

  // Validate each item if itemValidator is provided
  if (itemValidator && arrayValue.length > 0) {
    for (let i = 0; i < arrayValue.length; i++) {
      const itemError = itemValidator(arrayValue[i], i);
      if (itemError) {
        return `${fieldName} item ${i + 1}: ${itemError}`;
      }
    }
  }

  return null;
};

/**
 * Validates a duration string (e.g., "1:30:45")
 * @param {string} value - The duration string to validate
 * @param {Object} options - Validation options
 * @param {boolean} [options.required=false] - Whether the field is required
 * @param {string} [options.fieldName='Duration'] - Name of the field for error messages
 * @returns {string|null} Error message or null if valid
 */
export const validateDuration = (value, options = {}) => {
  const { required = false, fieldName = "Duration" } = options;

  // Convert to string and trim
  const strValue = String(value || "").trim();

  // Check if required
  if (required && !strValue) {
    return `${fieldName} is required`;
  }

  // Skip further validation if empty and not required
  if (!strValue && !required) {
    return null;
  }

  // Duration validation (h:mm:ss or mm:ss)
  const durationPattern = /^(?:(?:([01]?\d|2[0-3]):)?([0-5]?\d):)?([0-5]?\d)$/;
  if (!durationPattern.test(strValue)) {
    return `${fieldName} must be in the format h:mm:ss or mm:ss`;
  }

  return null;
};

/**
 * Validates an email address
 * @param {string} value - The email to validate
 * @param {Object} options - Validation options
 * @param {boolean} [options.required=false] - Whether the field is required
 * @param {string} [options.fieldName='Email'] - Name of the field for error messages
 * @returns {string|null} Error message or null if valid
 */
export const validateEmail = (value, options = {}) => {
  const { required = false, fieldName = "Email" } = options;

  // Convert to string and trim
  const strValue = String(value || "").trim();

  // Check if required
  if (required && !strValue) {
    return `${fieldName} is required`;
  }

  // Skip further validation if empty and not required
  if (!strValue && !required) {
    return null;
  }

  // Email validation
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailPattern.test(strValue)) {
    return `${fieldName} must be a valid email address`;
  }

  return null;
};

/**
 * Validates a phone number
 * @param {string} value - The phone number to validate
 * @param {Object} options - Validation options
 * @param {boolean} [options.required=false] - Whether the field is required
 * @param {string} [options.fieldName='Phone'] - Name of the field for error messages
 * @returns {string|null} Error message or null if valid
 */
export const validatePhone = (value, options = {}) => {
  const { required = false, fieldName = "Phone" } = options;

  // Convert to string and trim
  const strValue = String(value || "").trim();

  // Check if required
  if (required && !strValue) {
    return `${fieldName} is required`;
  }

  // Skip further validation if empty and not required
  if (!strValue && !required) {
    return null;
  }

  // Basic phone validation (allows various formats)
  // This is a simple validation - you might want to use a more sophisticated one
  const phonePattern = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
  if (!phonePattern.test(strValue.replace(/\s/g, ""))) {
    return `${fieldName} must be a valid phone number`;
  }

  return null;
};

/**
 * Validates a time string (e.g., "14:30" or "2:30 PM")
 * @param {string} value - The time string to validate
 * @param {Object} options - Validation options
 * @param {boolean} [options.required=false] - Whether the field is required
 * @param {string} [options.fieldName='Time'] - Name of the field for error messages
 * @returns {string|null} Error message or null if valid
 */
export const validateTime = (value, options = {}) => {
  const { required = false, fieldName = "Time" } = options;

  // Convert to string and trim
  const strValue = String(value || "").trim();

  // Check if required
  if (required && !strValue) {
    return `${fieldName} is required`;
  }

  // Skip further validation if empty and not required
  if (!strValue && !required) {
    return null;
  }

  // Time validation (24-hour format or 12-hour format with AM/PM)
  const timePattern24h = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  const timePattern12h = /^(0?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM|am|pm)$/;

  if (!timePattern24h.test(strValue) && !timePattern12h.test(strValue)) {
    return `${fieldName} must be in a valid format (e.g., "14:30" or "2:30 PM")`;
  }

  return null;
};

/**
 * Validates a number
 * @param {string|number} value - The number to validate
 * @param {Object} options - Validation options
 * @param {boolean} [options.required=false] - Whether the field is required
 * @param {number} [options.min] - Minimum value
 * @param {number} [options.max] - Maximum value
 * @param {boolean} [options.integer=false] - Whether the number must be an integer
 * @param {string} [options.fieldName='Number'] - Name of the field for error messages
 * @returns {string|null} Error message or null if valid
 */
export const validateNumber = (value, options = {}) => {
  const {
    required = false,
    min,
    max,
    integer = false,
    fieldName = "Number",
  } = options;

  // Handle empty values
  if (value === "" || value === null || value === undefined) {
    return required ? `${fieldName} is required` : null;
  }

  // Convert to number
  const numValue = Number(value);

  // Check if valid number
  if (isNaN(numValue)) {
    return `${fieldName} must be a valid number`;
  }

  // Check if integer
  if (integer && !Number.isInteger(numValue)) {
    return `${fieldName} must be a whole number`;
  }

  // Check min value
  if (min !== undefined && numValue < min) {
    return `${fieldName} must be at least ${min}`;
  }

  // Check max value
  if (max !== undefined && numValue > max) {
    return `${fieldName} must be no more than ${max}`;
  }

  return null;
};

/**
 * Validates a boolean value
 * @param {boolean} value - The boolean to validate
 * @param {Object} options - Validation options
 * @param {boolean} [options.required=false] - Whether the field is required
 * @param {string} [options.fieldName='Field'] - Name of the field for error messages
 * @returns {string|null} Error message or null if valid
 */
export const validateBoolean = (value, options = {}) => {
  const { required = false, fieldName = "Field" } = options;

  // Check if required and undefined
  if (required && value === undefined) {
    return `${fieldName} is required`;
  }

  // Check if boolean
  if (value !== undefined && typeof value !== "boolean") {
    return `${fieldName} must be a boolean value`;
  }

  return null;
};

/**
 * Validates a sermon object
 * @param {Object} sermon - The sermon object to validate
 * @returns {Object} Object with validation results
 */
export const validateSermon = (sermon) => {
  const errors = {};

  // Validate title
  const titleError = validateString(sermon.title, {
    required: true,
    minLength: 3,
    maxLength: 100,
    fieldName: "Title",
  });
  if (titleError) errors.title = titleError;

  // Validate speaker
  const speakerError = validateString(sermon.speaker, {
    required: true,
    minLength: 2,
    maxLength: 50,
    fieldName: "Speaker",
  });
  if (speakerError) errors.speaker = speakerError;

  // Validate date
  const dateError = validateDate(sermon.date, {
    required: true,
    fieldName: "Date",
  });
  if (dateError) errors.date = dateError;

  // Validate videoId
  const videoIdError = validateYouTubeId(sermon.videoId, {
    required: true,
    fieldName: "YouTube Video ID",
  });
  if (videoIdError) errors.videoId = videoIdError;

  // Validate duration
  const durationError = validateDuration(sermon.duration, {
    required: true,
    fieldName: "Duration",
  });
  if (durationError) errors.duration = durationError;

  // Validate description
  const descriptionError = validateString(sermon.description, {
    maxLength: 1000,
    fieldName: "Description",
  });
  if (descriptionError) errors.description = descriptionError;

  // Validate series
  const seriesError = validateString(sermon.series, {
    maxLength: 50,
    fieldName: "Series",
  });
  if (seriesError) errors.series = seriesError;

  // Validate tags
  const tagsError = validateArray(sermon.tags, {
    maxLength: 10,
    itemValidator: (tag) =>
      validateString(tag, {
        maxLength: 20,
        fieldName: "Tag",
      }),
    fieldName: "Tags",
  });
  if (tagsError) errors.tags = tagsError;

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validates an event object
 * @param {Object} event - The event object to validate
 * @returns {Object} Object with validation results
 */
export const validateEvent = (event) => {
  const errors = {};

  // Validate title
  const titleError = validateString(event.title, {
    required: true,
    minLength: 3,
    maxLength: 100,
    fieldName: "Title",
  });
  if (titleError) errors.title = titleError;

  // Validate date
  const dateError = validateDate(event.date, {
    required: true,
    fieldName: "Date",
  });
  if (dateError) errors.date = dateError;

  // Validate time
  const timeError = validateTime(event.time, {
    required: true,
    fieldName: "Time",
  });
  if (timeError) errors.time = timeError;

  // Validate location
  const locationError = validateString(event.location, {
    required: true,
    minLength: 3,
    maxLength: 100,
    fieldName: "Location",
  });
  if (locationError) errors.location = locationError;

  // Validate description
  const descriptionError = validateString(event.description, {
    maxLength: 1000,
    fieldName: "Description",
  });
  if (descriptionError) errors.description = descriptionError;

  // Validate capacity
  if (event.capacity) {
    const capacityError = validateNumber(event.capacity, {
      integer: true,
      min: 1,
      fieldName: "Capacity",
    });
    if (capacityError) errors.capacity = capacityError;
  }

  // Validate ministry
  const ministryError = validateString(event.ministry, {
    maxLength: 50,
    fieldName: "Ministry",
  });
  if (ministryError) errors.ministry = ministryError;

  // Validate registration URL
  if (event.registrationUrl) {
    const registrationUrlError = validateUrl(event.registrationUrl, {
      fieldName: "Registration URL",
    });
    if (registrationUrlError) errors.registrationUrl = registrationUrlError;
  }

  // Validate organizer
  const organizerError = validateString(event.organizer, {
    maxLength: 50,
    fieldName: "Organizer",
  });
  if (organizerError) errors.organizer = organizerError;

  // Validate contact email
  if (event.contactEmail) {
    const contactEmailError = validateEmail(event.contactEmail, {
      fieldName: "Contact Email",
    });
    if (contactEmailError) errors.contactEmail = contactEmailError;
  }

  // Validate tags
  const tagsError = validateArray(event.tags, {
    maxLength: 10,
    itemValidator: (tag) =>
      validateString(tag, {
        maxLength: 20,
        fieldName: "Tag",
      }),
    fieldName: "Tags",
  });
  if (tagsError) errors.tags = tagsError;

  // Validate recurring pattern
  if (event.recurring && event.recurringPattern) {
    const recurringPatternError = validateString(event.recurringPattern, {
      maxLength: 50,
      fieldName: "Recurring Pattern",
    });
    if (recurringPatternError) errors.recurringPattern = recurringPatternError;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validates a form field and updates the errors state
 * @param {string} name - Field name
 * @param {any} value - Field value
 * @param {Object} validationRules - Validation rules for the field
 * @param {Object} errors - Current errors object
 * @param {Function} setErrors - Function to update errors
 */
export const validateField = (
  name,
  value,
  validationRules,
  errors,
  setErrors
) => {
  let error = null;

  // Apply the appropriate validation function based on field type
  switch (validationRules.type) {
    case "string":
      error = validateString(value, validationRules);
      break;
    case "date":
      error = validateDate(value, validationRules);
      break;
    case "url":
      error = validateUrl(value, validationRules);
      break;
    case "youtubeId":
      error = validateYouTubeId(value, validationRules);
      break;
    case "array":
      error = validateArray(value, validationRules);
      break;
    case "duration":
      error = validateDuration(value, validationRules);
      break;
    case "time":
      error = validateTime(value, validationRules);
      break;
    case "email":
      error = validateEmail(value, validationRules);
      break;
    case "number":
      error = validateNumber(value, validationRules);
      break;
    case "phone":
      error = validatePhone(value, validationRules);
      break;
    case "boolean":
      error = validateBoolean(value, validationRules);
      break;
    default:
      console.warn(`No validation function for type: ${validationRules.type}`);
  }

  // Update errors state
  if (error) {
    setErrors((prev) => ({ ...prev, [name]: error }));
  } else {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });
  }

  return error;
};
