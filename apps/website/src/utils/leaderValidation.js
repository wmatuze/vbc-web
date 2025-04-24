/**
 * Validation rules for leaders
 */

// Leader validation rules
export const leaderValidationRules = {
  name: {
    type: "string",
    required: true,
    minLength: 3,
    maxLength: 100,
    fieldName: "Name",
  },
  title: {
    type: "string",
    required: true,
    minLength: 2,
    maxLength: 100,
    fieldName: "Title",
  },
  imageUrl: {
    type: "string",
    fieldName: "Image URL",
  },
  bio: {
    type: "string",
    required: true,
    minLength: 10,
    maxLength: 2000,
    fieldName: "Bio",
  },
  email: {
    type: "email",
    fieldName: "Email",
  },
  phone: {
    type: "phone",
    fieldName: "Phone",
  },
  ministryFocus: {
    type: "array",
    maxLength: 10,
    itemValidator: (item) => {
      if (typeof item !== "string") return "Item must be a string";
      if (item.length > 50) return "Item must be less than 50 characters";
      return null;
    },
    fieldName: "Ministry Focus",
  },
  socialMedia: {
    type: "object",
    fieldName: "Social Media",
    properties: {
      facebook: {
        type: "url",
        fieldName: "Facebook URL",
      },
      twitter: {
        type: "url",
        fieldName: "Twitter URL",
      },
      instagram: {
        type: "url",
        fieldName: "Instagram URL",
      },
      linkedin: {
        type: "url",
        fieldName: "LinkedIn URL",
      },
    },
  },
  education: {
    type: "array",
    fieldName: "Education",
    itemValidator: (item) => {
      if (typeof item !== "string") return "Education item must be a string";
      if (item.length > 200) return "Education item must be less than 200 characters";
      return null;
    },
  },
  experience: {
    type: "array",
    fieldName: "Experience",
    itemValidator: (item) => {
      if (typeof item !== "string") return "Experience item must be a string";
      if (item.length > 200) return "Experience item must be less than 200 characters";
      return null;
    },
  },
  order: {
    type: "number",
    min: 0,
    max: 9999,
    fieldName: "Display Order",
  },
  status: {
    type: "string",
    enum: ["active", "inactive", "former"],
    fieldName: "Status",
  },
  department: {
    type: "string",
    maxLength: 100,
    fieldName: "Department",
  },
  startDate: {
    type: "date",
    fieldName: "Start Date",
  },
  responsibilities: {
    type: "array",
    fieldName: "Responsibilities",
    itemValidator: (item) => {
      if (typeof item !== "string") return "Responsibility must be a string";
      if (item.length > 200) return "Responsibility must be less than 200 characters";
      return null;
    },
  },
  achievements: {
    type: "array",
    fieldName: "Achievements",
    itemValidator: (item) => {
      if (typeof item !== "string") return "Achievement must be a string";
      if (item.length > 200) return "Achievement must be less than 200 characters";
      return null;
    },
  },
  speakingTopics: {
    type: "array",
    fieldName: "Speaking Topics",
    itemValidator: (item) => {
      if (typeof item !== "string") return "Speaking topic must be a string";
      if (item.length > 100) return "Speaking topic must be less than 100 characters";
      return null;
    },
  },
  availability: {
    type: "object",
    fieldName: "Availability",
    properties: {
      office: {
        type: "string",
        fieldName: "Office Hours",
        maxLength: 100,
      },
      meetings: {
        type: "string",
        fieldName: "Meeting Availability",
        maxLength: 100,
      },
      counseling: {
        type: "string",
        fieldName: "Counseling Hours",
        maxLength: 100,
      },
    },
  },
  profileVideo: {
    type: "url",
    fieldName: "Profile Video URL",
  },
  publications: {
    type: "array",
    fieldName: "Publications",
    itemValidator: (item) => {
      if (typeof item !== "string") return "Publication must be a string";
      if (item.length > 200) return "Publication must be less than 200 characters";
      return null;
    },
  },
  certifications: {
    type: "array",
    fieldName: "Certifications",
    itemValidator: (item) => {
      if (typeof item !== "string") return "Certification must be a string";
      if (item.length > 200) return "Certification must be less than 200 characters";
      return null;
    },
  },
};

/**
 * Validate a leader object against the validation rules
 * @param {Object} leader - The leader object to validate
 * @returns {Object} - Object with isValid flag and errors object
 */
export const validateLeader = (leader) => {
  const errors = {};
  let isValid = true;

  // Validate each field according to its rules
  Object.entries(leaderValidationRules).forEach(([field, rules]) => {
    const value = leader[field];
    
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

      case "email":
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          errors[field] = `${rules.fieldName} must be a valid email address`;
          isValid = false;
        }
        break;

      case "phone":
        if (value && !/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(value)) {
          errors[field] = `${rules.fieldName} must be a valid phone number`;
          isValid = false;
        }
        break;

      case "url":
        if (value && !/^(https?:\/\/)?[\w.-]+\.[a-z]{2,}(\/.*)?$/i.test(value)) {
          errors[field] = `${rules.fieldName} must be a valid URL`;
          isValid = false;
        }
        break;

      case "date":
        if (value) {
          const date = new Date(value);
          if (isNaN(date.getTime())) {
            errors[field] = `${rules.fieldName} must be a valid date`;
            isValid = false;
          }
        }
        break;

      case "number":
        if (value !== undefined && value !== null) {
          const numValue = Number(value);
          if (isNaN(numValue)) {
            errors[field] = `${rules.fieldName} must be a number`;
            isValid = false;
          } else {
            if (rules.min !== undefined && numValue < rules.min) {
              errors[field] = `${rules.fieldName} must be at least ${rules.min}`;
              isValid = false;
            }
            if (rules.max !== undefined && numValue > rules.max) {
              errors[field] = `${rules.fieldName} must be at most ${rules.max}`;
              isValid = false;
            }
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

              // Type-specific validation for properties
              switch (propRules.type) {
                case "string":
                  if (propValue && typeof propValue !== "string") {
                    errors[`${field}.${propName}`] = `${propRules.fieldName} must be text`;
                    isValid = false;
                  } else if (propValue) {
                    if (propRules.minLength && propValue.length < propRules.minLength) {
                      errors[`${field}.${propName}`] = `${propRules.fieldName} must be at least ${propRules.minLength} characters`;
                      isValid = false;
                    }
                    if (propRules.maxLength && propValue.length > propRules.maxLength) {
                      errors[`${field}.${propName}`] = `${propRules.fieldName} must be less than ${propRules.maxLength} characters`;
                      isValid = false;
                    }
                  }
                  break;

                case "url":
                  if (propValue && !/^(https?:\/\/)?[\w.-]+\.[a-z]{2,}(\/.*)?$/i.test(propValue)) {
                    errors[`${field}.${propName}`] = `${propRules.fieldName} must be a valid URL`;
                    isValid = false;
                  }
                  break;

                default:
                  break;
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
