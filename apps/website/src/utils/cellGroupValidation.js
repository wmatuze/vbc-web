/**
 * Validation rules for cell groups and zones
 */

// Cell Group validation rules
export const cellGroupValidationRules = {
  name: {
    type: "string",
    required: true,
    minLength: 3,
    maxLength: 100,
    fieldName: "Group Name",
  },
  zone: {
    type: "string",
    required: true,
    fieldName: "Zone",
  },
  location: {
    type: "string",
    required: true,
    minLength: 3,
    maxLength: 100,
    fieldName: "Location",
  },
  leader: {
    type: "string",
    required: true,
    minLength: 3,
    maxLength: 100,
    fieldName: "Leader Name",
  },
  contact: {
    type: "email",
    required: true,
    fieldName: "Contact Email",
  },
  meetingDay: {
    type: "string",
    required: true,
    fieldName: "Meeting Day",
    enum: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  },
  meetingTime: {
    type: "time",
    required: true,
    fieldName: "Meeting Time",
  },
  capacity: {
    type: "string",
    maxLength: 50,
    fieldName: "Capacity",
  },
  description: {
    type: "string",
    required: true,
    minLength: 10,
    maxLength: 1000,
    fieldName: "Description",
  },
  tags: {
    type: "array",
    maxLength: 10,
    itemValidator: (tag) => {
      if (typeof tag !== "string") return "Tag must be a string";
      if (tag.length > 20) return "Tag must be less than 20 characters";
      return null;
    },
    fieldName: "Tags",
  },
  imageUrl: {
    type: "url",
    fieldName: "Image URL",
  },
  coordinates: {
    type: "object",
    fieldName: "Coordinates",
    properties: {
      lat: {
        type: "number",
        min: -90,
        max: 90,
        fieldName: "Latitude",
      },
      lng: {
        type: "number",
        min: -180,
        max: 180,
        fieldName: "Longitude",
      },
    },
  },
};

// Zone validation rules
export const zoneValidationRules = {
  name: {
    type: "string",
    required: true,
    minLength: 3,
    maxLength: 100,
    fieldName: "Zone Name",
  },
  location: {
    type: "string",
    required: true,
    minLength: 3,
    maxLength: 100,
    fieldName: "Location",
  },
  description: {
    type: "string",
    maxLength: 1000,
    fieldName: "Description",
  },
  iconName: {
    type: "string",
    fieldName: "Icon Name",
  },
  elder: {
    type: "object",
    required: true,
    fieldName: "Elder Information",
    properties: {
      name: {
        type: "string",
        required: true,
        minLength: 3,
        maxLength: 100,
        fieldName: "Elder Name",
      },
      title: {
        type: "string",
        maxLength: 100,
        fieldName: "Elder Title",
      },
      bio: {
        type: "string",
        maxLength: 1000,
        fieldName: "Elder Bio",
      },
      contact: {
        type: "email",
        fieldName: "Elder Contact Email",
      },
      phone: {
        type: "phone",
        fieldName: "Elder Phone",
      },
    },
  },
};

/**
 * Validate a cell group object against the validation rules
 * @param {Object} cellGroup - The cell group object to validate
 * @returns {Object} - Object with isValid flag and errors object
 */
export const validateCellGroup = (cellGroup) => {
  const errors = {};
  let isValid = true;

  // Validate each field according to its rules
  Object.entries(cellGroupValidationRules).forEach(([field, rules]) => {
    const value = cellGroup[field];
    
    // Skip validation for optional fields that are empty
    if (!rules.required && (value === undefined || value === null || value === "")) {
      return;
    }

    // Required field validation
    if (rules.required && (value === undefined || value === null || value === "")) {
      errors[field] = `${rules.fieldName} is required`;
      isValid = false;
      return;
    }

    // Type-specific validation
    switch (rules.type) {
      case "string":
        if (typeof value !== "string") {
          errors[field] = `${rules.fieldName} must be text`;
          isValid = false;
        } else {
          if (rules.minLength && value.length < rules.minLength) {
            errors[field] = `${rules.fieldName} must be at least ${rules.minLength} characters`;
            isValid = false;
          }
          if (rules.maxLength && value.length > rules.maxLength) {
            errors[field] = `${rules.fieldName} must be less than ${rules.maxLength} characters`;
            isValid = false;
          }
          if (rules.enum && !rules.enum.includes(value)) {
            errors[field] = `${rules.fieldName} must be one of: ${rules.enum.join(", ")}`;
            isValid = false;
          }
        }
        break;

      case "email":
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          errors[field] = `${rules.fieldName} must be a valid email address`;
          isValid = false;
        }
        break;

      case "time":
        // Simple time format validation (HH:MM or H:MM AM/PM)
        if (value && !/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](\s*[AP]M)?$/.test(value)) {
          errors[field] = `${rules.fieldName} must be in format HH:MM or HH:MM AM/PM`;
          isValid = false;
        }
        break;

      case "url":
        if (value && !/^(https?:\/\/)?[\w.-]+\.[a-z]{2,}(\/.*)?$/i.test(value)) {
          errors[field] = `${rules.fieldName} must be a valid URL`;
          isValid = false;
        }
        break;

      case "array":
        if (value) {
          const arrayValue = Array.isArray(value) ? value : 
                            typeof value === "string" ? value.split(",").map(item => item.trim()) : 
                            [value];
          
          if (rules.maxLength && arrayValue.length > rules.maxLength) {
            errors[field] = `${rules.fieldName} can have at most ${rules.maxLength} items`;
            isValid = false;
          }

          if (rules.itemValidator) {
            const itemErrors = arrayValue
              .map((item, index) => {
                const error = rules.itemValidator(item);
                return error ? `Item ${index + 1}: ${error}` : null;
              })
              .filter(Boolean);

            if (itemErrors.length > 0) {
              errors[field] = `${rules.fieldName}: ${itemErrors.join(", ")}`;
              isValid = false;
            }
          }
        }
        break;

      case "object":
        if (value && typeof value === "object") {
          if (rules.properties) {
            Object.entries(rules.properties).forEach(([propName, propRules]) => {
              const propValue = value[propName];
              
              // Skip validation for optional properties that are empty
              if (!propRules.required && (propValue === undefined || propValue === null || propValue === "")) {
                return;
              }

              // Required property validation
              if (propRules.required && (propValue === undefined || propValue === null || propValue === "")) {
                errors[`${field}.${propName}`] = `${propRules.fieldName} is required`;
                isValid = false;
                return;
              }

              // Number validation
              if (propRules.type === "number") {
                const numValue = parseFloat(propValue);
                if (isNaN(numValue)) {
                  errors[`${field}.${propName}`] = `${propRules.fieldName} must be a number`;
                  isValid = false;
                } else {
                  if (propRules.min !== undefined && numValue < propRules.min) {
                    errors[`${field}.${propName}`] = `${propRules.fieldName} must be at least ${propRules.min}`;
                    isValid = false;
                  }
                  if (propRules.max !== undefined && numValue > propRules.max) {
                    errors[`${field}.${propName}`] = `${propRules.fieldName} must be at most ${propRules.max}`;
                    isValid = false;
                  }
                }
              }
            });
          }
        } else if (rules.required) {
          errors[field] = `${rules.fieldName} is required`;
          isValid = false;
        }
        break;

      default:
        break;
    }
  });

  return { isValid, errors };
};

/**
 * Validate a zone object against the validation rules
 * @param {Object} zone - The zone object to validate
 * @returns {Object} - Object with isValid flag and errors object
 */
export const validateZone = (zone) => {
  const errors = {};
  let isValid = true;

  // Validate each field according to its rules
  Object.entries(zoneValidationRules).forEach(([field, rules]) => {
    const value = zone[field];
    
    // Skip validation for optional fields that are empty
    if (!rules.required && (value === undefined || value === null || value === "")) {
      return;
    }

    // Required field validation
    if (rules.required && (value === undefined || value === null || value === "")) {
      errors[field] = `${rules.fieldName} is required`;
      isValid = false;
      return;
    }

    // Type-specific validation
    switch (rules.type) {
      case "string":
        if (typeof value !== "string") {
          errors[field] = `${rules.fieldName} must be text`;
          isValid = false;
        } else {
          if (rules.minLength && value.length < rules.minLength) {
            errors[field] = `${rules.fieldName} must be at least ${rules.minLength} characters`;
            isValid = false;
          }
          if (rules.maxLength && value.length > rules.maxLength) {
            errors[field] = `${rules.fieldName} must be less than ${rules.maxLength} characters`;
            isValid = false;
          }
        }
        break;

      case "object":
        if (value && typeof value === "object") {
          if (rules.properties) {
            Object.entries(rules.properties).forEach(([propName, propRules]) => {
              const propValue = value[propName];
              
              // Skip validation for optional properties that are empty
              if (!propRules.required && (propValue === undefined || propValue === null || propValue === "")) {
                return;
              }

              // Required property validation
              if (propRules.required && (propValue === undefined || propValue === null || propValue === "")) {
                errors[`${field}.${propName}`] = `${propRules.fieldName} is required`;
                isValid = false;
                return;
              }

              // String validation
              if (propRules.type === "string") {
                if (typeof propValue !== "string") {
                  errors[`${field}.${propName}`] = `${propRules.fieldName} must be text`;
                  isValid = false;
                } else {
                  if (propRules.minLength && propValue.length < propRules.minLength) {
                    errors[`${field}.${propName}`] = `${propRules.fieldName} must be at least ${propRules.minLength} characters`;
                    isValid = false;
                  }
                  if (propRules.maxLength && propValue.length > propRules.maxLength) {
                    errors[`${field}.${propName}`] = `${propRules.fieldName} must be less than ${propRules.maxLength} characters`;
                    isValid = false;
                  }
                }
              }

              // Email validation
              if (propRules.type === "email" && propValue) {
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(propValue)) {
                  errors[`${field}.${propName}`] = `${propRules.fieldName} must be a valid email address`;
                  isValid = false;
                }
              }

              // Phone validation
              if (propRules.type === "phone" && propValue) {
                if (!/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(propValue)) {
                  errors[`${field}.${propName}`] = `${propRules.fieldName} must be a valid phone number`;
                  isValid = false;
                }
              }
            });
          }
        } else if (rules.required) {
          errors[field] = `${rules.fieldName} is required`;
          isValid = false;
        }
        break;

      default:
        break;
    }
  });

  return { isValid, errors };
};
