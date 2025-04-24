/**
 * Validation rules and functions for membership renewals and foundation class registrations
 */

// Membership renewal validation rules
export const membershipRenewalValidationRules = {
  fullName: {
    type: "string",
    required: true,
    minLength: 3,
    maxLength: 100,
    fieldName: "Full Name",
  },
  email: {
    type: "email",
    required: true,
    fieldName: "Email",
  },
  phone: {
    type: "phone",
    required: true,
    fieldName: "Phone Number",
  },
  birthday: {
    type: "date",
    required: true,
    fieldName: "Birthday",
  },
  memberSince: {
    type: "string",
    required: true,
    fieldName: "Member Since",
  },
  ministryInvolvement: {
    type: "string",
    maxLength: 500,
    fieldName: "Ministry Involvement",
  },
  addressChange: {
    type: "boolean",
    fieldName: "Address Change",
  },
  newAddress: {
    type: "string",
    maxLength: 200,
    fieldName: "New Address",
    conditionalRequired: (data) => data.addressChange === true,
  },
  agreeToTerms: {
    type: "boolean",
    required: true,
    mustBeTrue: true,
    fieldName: "Agreement to Terms",
  },
  status: {
    type: "string",
    enum: ["pending", "approved", "declined"],
    fieldName: "Status",
  },
};

// Foundation class registration validation rules
export const foundationClassValidationRules = {
  fullName: {
    type: "string",
    required: true,
    minLength: 3,
    maxLength: 100,
    fieldName: "Full Name",
  },
  email: {
    type: "email",
    required: true,
    fieldName: "Email",
  },
  phone: {
    type: "phone",
    required: true,
    fieldName: "Phone Number",
  },
  preferredSession: {
    type: "string",
    required: true,
    fieldName: "Preferred Session",
  },
  questions: {
    type: "string",
    maxLength: 1000,
    fieldName: "Questions",
  },
  status: {
    type: "string",
    enum: ["registered", "attending", "completed", "cancelled"],
    fieldName: "Status",
  },
};

/**
 * Validate a membership renewal object against the validation rules
 * @param {Object} renewal - The membership renewal object to validate
 * @returns {Object} - Object with isValid flag and errors object
 */
export const validateMembershipRenewal = (renewal) => {
  const errors = {};
  let isValid = true;

  // Validate each field according to its rules
  Object.entries(membershipRenewalValidationRules).forEach(([field, rules]) => {
    const value = renewal[field];
    
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

    // Conditional required validation
    if (rules.conditionalRequired && rules.conditionalRequired(renewal) && 
        (value === undefined || value === null || value === "")) {
      errors[field] = `${rules.fieldName} is required when address change is selected`;
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

      case "date":
        if (value) {
          const date = new Date(value);
          if (isNaN(date.getTime())) {
            errors[field] = `${rules.fieldName} must be a valid date`;
            isValid = false;
          }
        }
        break;

      case "boolean":
        if (value !== undefined && typeof value !== "boolean") {
          errors[field] = `${rules.fieldName} must be a boolean value`;
          isValid = false;
        }
        if (rules.mustBeTrue && value !== true) {
          errors[field] = `You must agree to the ${rules.fieldName}`;
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
 * Validate a foundation class registration object against the validation rules
 * @param {Object} registration - The foundation class registration object to validate
 * @returns {Object} - Object with isValid flag and errors object
 */
export const validateFoundationClassRegistration = (registration) => {
  const errors = {};
  let isValid = true;

  // Validate each field according to its rules
  Object.entries(foundationClassValidationRules).forEach(([field, rules]) => {
    const value = registration[field];
    
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

      default:
        break;
    }
  });

  return { isValid, errors };
};

/**
 * Validate a status change for membership renewal
 * @param {String} status - The new status value
 * @returns {Object} - Object with isValid flag and error message
 */
export const validateMembershipStatusChange = (status) => {
  const validStatuses = ["pending", "approved", "declined"];
  
  if (!status || !validStatuses.includes(status)) {
    return {
      isValid: false,
      error: `Status must be one of: ${validStatuses.join(", ")}`
    };
  }
  
  return { isValid: true, error: null };
};

/**
 * Validate a status change for foundation class registration
 * @param {String} status - The new status value
 * @returns {Object} - Object with isValid flag and error message
 */
export const validateFoundationClassStatusChange = (status) => {
  const validStatuses = ["registered", "attending", "completed", "cancelled"];
  
  if (!status || !validStatuses.includes(status)) {
    return {
      isValid: false,
      error: `Status must be one of: ${validStatuses.join(", ")}`
    };
  }
  
  return { isValid: true, error: null };
};
