/**
 * Validation rules for media
 */

// Media validation rules
export const mediaValidationRules = {
  title: {
    type: "string",
    required: true,
    minLength: 3,
    maxLength: 100,
    fieldName: "Title",
  },
  category: {
    type: "string",
    required: true,
    enum: ["general", "sermons", "events", "leadership", "cell-groups", "banners", "gallery"],
    fieldName: "Category",
  },
  file: {
    type: "file",
    required: true,
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ["image/jpeg", "image/png", "image/gif", "image/webp"],
    fieldName: "File",
  },
  description: {
    type: "string",
    maxLength: 500,
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
};

/**
 * Validate a media object against the validation rules
 * @param {Object} media - The media object to validate
 * @returns {Object} - Object with isValid flag and errors object
 */
export const validateMedia = (media) => {
  const errors = {};
  let isValid = true;

  // Validate each field according to its rules
  Object.entries(mediaValidationRules).forEach(([field, rules]) => {
    const value = media[field];
    
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
        if (value && typeof value !== "string") {
          errors[field] = `${rules.fieldName} must be text`;
          isValid = false;
        } else if (value) {
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

      case "file":
        if (value) {
          // Check file size
          if (rules.maxSize && value.size > rules.maxSize) {
            errors[field] = `${rules.fieldName} must be less than ${Math.round(rules.maxSize / (1024 * 1024))}MB`;
            isValid = false;
          }
          
          // Check file type
          if (rules.allowedTypes && !rules.allowedTypes.includes(value.type)) {
            errors[field] = `${rules.fieldName} must be one of these types: ${rules.allowedTypes.map(type => type.split('/')[1]).join(', ')}`;
            isValid = false;
          }
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

      default:
        break;
    }
  });

  return { isValid, errors };
};
