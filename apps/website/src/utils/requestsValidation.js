/**
 * Validation rules and functions for membership renewals, foundation class registrations, and event sign-up requests
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
    if (
      !rules.required &&
      (value === undefined || value === null || value === "")
    ) {
      return;
    }

    // Required field validation
    if (
      rules.required &&
      (value === undefined || value === null || value === "")
    ) {
      errors[field] = `${rules.fieldName} is required`;
      isValid = false;
      return;
    }

    // Conditional required validation
    if (
      rules.conditionalRequired &&
      rules.conditionalRequired(renewal) &&
      (value === undefined || value === null || value === "")
    ) {
      errors[field] =
        `${rules.fieldName} is required when address change is selected`;
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
            errors[field] =
              `${rules.fieldName} must be at least ${rules.minLength} characters`;
            isValid = false;
          }
          if (rules.maxLength && value.length > rules.maxLength) {
            errors[field] =
              `${rules.fieldName} must be less than ${rules.maxLength} characters`;
            isValid = false;
          }
          if (rules.enum && !rules.enum.includes(value)) {
            errors[field] =
              `${rules.fieldName} must be one of: ${rules.enum.join(", ")}`;
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
        if (
          value &&
          !/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(value)
        ) {
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
    if (
      !rules.required &&
      (value === undefined || value === null || value === "")
    ) {
      return;
    }

    // Required field validation
    if (
      rules.required &&
      (value === undefined || value === null || value === "")
    ) {
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
            errors[field] =
              `${rules.fieldName} must be at least ${rules.minLength} characters`;
            isValid = false;
          }
          if (rules.maxLength && value.length > rules.maxLength) {
            errors[field] =
              `${rules.fieldName} must be less than ${rules.maxLength} characters`;
            isValid = false;
          }
          if (rules.enum && !rules.enum.includes(value)) {
            errors[field] =
              `${rules.fieldName} must be one of: ${rules.enum.join(", ")}`;
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
        if (
          value &&
          !/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(value)
        ) {
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
      error: `Status must be one of: ${validStatuses.join(", ")}`,
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
      error: `Status must be one of: ${validStatuses.join(", ")}`,
    };
  }

  return { isValid: true, error: null };
};

// Event signup request validation rules
export const eventSignupRequestValidationRules = {
  eventId: {
    type: "string",
    required: true,
    fieldName: "Event ID",
  },
  eventType: {
    type: "string",
    required: true,
    enum: ["baptism", "babyDedication", "other"],
    fieldName: "Event Type",
  },
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
  // Baptism-specific fields
  testimony: {
    type: "string",
    maxLength: 2000,
    fieldName: "Testimony",
    conditionalRequired: (data) => data.eventType === "baptism",
  },
  previousReligion: {
    type: "string",
    maxLength: 100,
    fieldName: "Previous Religious Background",
  },
  // Baby dedication-specific fields
  childName: {
    type: "string",
    maxLength: 100,
    fieldName: "Child's Name",
    conditionalRequired: (data) => data.eventType === "babyDedication",
  },
  childDateOfBirth: {
    type: "date",
    fieldName: "Child's Date of Birth",
    conditionalRequired: (data) => data.eventType === "babyDedication",
  },
  parentNames: {
    type: "string",
    maxLength: 200,
    fieldName: "Parents' Names",
    conditionalRequired: (data) => data.eventType === "babyDedication",
  },
  // General fields
  message: {
    type: "string",
    maxLength: 1000,
    fieldName: "Message",
  },
  status: {
    type: "string",
    enum: ["pending", "approved", "declined"],
    fieldName: "Status",
  },
};

/**
 * Validate an event signup request object against the validation rules
 * @param {Object} request - The event signup request object to validate
 * @returns {Object} - Object with isValid flag and errors object
 */
export const validateEventSignupRequest = (request) => {
  const errors = {};
  let isValid = true;

  // Debug: Log the request object being validated
  console.log("Validating event signup request:", request);

  // Validate each field according to its rules
  Object.entries(eventSignupRequestValidationRules).forEach(
    ([field, rules]) => {
      const value = request[field];

      // Debug: Log each field's value and type
      console.log(`Field: ${field}, Value:`, value, `Type: ${typeof value}`);

      // Skip validation for optional fields that are empty
      if (
        !rules.required &&
        !rules.conditionalRequired &&
        (value === undefined || value === null || value === "")
      ) {
        console.log(`Skipping validation for optional field: ${field}`);
        return;
      }

      // Required field validation
      if (
        rules.required &&
        (value === undefined || value === null || value === "")
      ) {
        errors[field] = `${rules.fieldName} is required`;
        isValid = false;
        console.log(`Required field validation failed for ${field}`);
        return;
      }

      // Conditional required validation
      if (
        rules.conditionalRequired &&
        rules.conditionalRequired(request) &&
        (value === undefined || value === null || value === "")
      ) {
        errors[field] = `${rules.fieldName} is required for this event type`;
        isValid = false;
        console.log(`Conditional required validation failed for ${field}`);
        return;
      }

      // Type-specific validation
      switch (rules.type) {
        case "string":
          // Special handling for eventId field - accept both string and object with toString method
          if (field === "eventId" && value) {
            // If it's already a string, we're good
            if (typeof value === "string") {
              console.log("EventId is already a string:", value);
            }
            // If it's an object with toString method, convert it
            else if (typeof value === "object" && value.toString) {
              console.log("EventId is an object with toString method");
              // Don't add an error, we'll handle this specially
            }
            // Otherwise it's an invalid type
            else {
              errors[field] =
                `${rules.fieldName} must be text or a valid ID object`;
              isValid = false;
              console.log(`Invalid eventId type: ${typeof value}`);
            }
          }
          // Normal string validation for other fields
          else if (value && typeof value !== "string") {
            errors[field] = `${rules.fieldName} must be text`;
            isValid = false;
            console.log(`String type validation failed for ${field}`);
          } else if (value) {
            if (rules.minLength && value.length < rules.minLength) {
              errors[field] =
                `${rules.fieldName} must be at least ${rules.minLength} characters`;
              isValid = false;
              console.log(`Min length validation failed for ${field}`);
            }
            if (rules.maxLength && value.length > rules.maxLength) {
              errors[field] =
                `${rules.fieldName} must be less than ${rules.maxLength} characters`;
              isValid = false;
              console.log(`Max length validation failed for ${field}`);
            }
            if (rules.enum && !rules.enum.includes(value)) {
              errors[field] =
                `${rules.fieldName} must be one of: ${rules.enum.join(", ")}`;
              isValid = false;
              console.log(`Enum validation failed for ${field}`);
            }
          }
          break;

        case "email":
          if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            errors[field] = `${rules.fieldName} must be a valid email address`;
            isValid = false;
            console.log(`Email validation failed for ${field}`);
          }
          break;

        case "phone":
          if (
            value &&
            !/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(
              value
            )
          ) {
            errors[field] = `${rules.fieldName} must be a valid phone number`;
            isValid = false;
            console.log(`Phone validation failed for ${field}`);
          }
          break;

        case "date":
          if (value) {
            const date = new Date(value);
            if (isNaN(date.getTime())) {
              errors[field] = `${rules.fieldName} must be a valid date`;
              isValid = false;
              console.log(`Date validation failed for ${field}`);
            }
          }
          break;

        default:
          break;
      }
    }
  );

  // Debug: Log validation results
  console.log("Validation complete. isValid:", isValid, "Errors:", errors);

  return { isValid, errors };
};

/**
 * Validate a status change for event signup request
 * @param {String} status - The new status value
 * @returns {Object} - Object with isValid flag and error message
 */
export const validateEventSignupStatusChange = (status) => {
  const validStatuses = ["pending", "approved", "declined"];

  if (!status || !validStatuses.includes(status)) {
    return {
      isValid: false,
      error: `Status must be one of: ${validStatuses.join(", ")}`,
    };
  }

  return { isValid: true, error: null };
};
