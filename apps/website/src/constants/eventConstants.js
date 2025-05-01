import { format } from "date-fns";

/**
 * Initial state for event form
 */
export const INITIAL_EVENT_STATE = {
  title: "",
  date: format(new Date(), "yyyy-MM-dd"),
  formattedDate: format(new Date(), "MMMM d, yyyy"),
  time: "",
  description: "",
  location: "",
  capacity: "",
  ministry: "",
  imageUrl: "",
  image: null,
  registrationUrl: "",
  tags: [],
  recurring: false,
  recurringPattern: "",
  organizer: "",
  contactEmail: "",
  featured: false,
  type: "event",
  signupRequired: false,
};

/**
 * Validation rules for event fields
 */
export const EVENT_VALIDATION_RULES = {
  title: {
    type: "string",
    required: true,
    minLength: 3,
    maxLength: 100,
    fieldName: "Title",
  },
  date: { type: "date", required: true, fieldName: "Date" },
  time: { type: "time", required: true, fieldName: "Time" },
  location: {
    type: "string",
    required: true,
    minLength: 3,
    maxLength: 100,
    fieldName: "Location",
  },
  description: { type: "string", maxLength: 1000, fieldName: "Description" },
  capacity: { type: "number", integer: true, min: 1, fieldName: "Capacity" },
  ministry: { type: "string", maxLength: 50, fieldName: "Ministry" },
  registrationUrl: { type: "url", fieldName: "Registration URL" },
  organizer: { type: "string", maxLength: 50, fieldName: "Organizer" },
  contactEmail: { type: "email", fieldName: "Contact Email" },
  recurringPattern: {
    type: "string",
    maxLength: 50,
    fieldName: "Recurring Pattern",
  },
};

/**
 * Event types for dropdown selection
 */
export const EVENT_TYPES = [
  { value: "event", label: "General Event" },
  { value: "baptism", label: "Baptism" },
  { value: "babyDedication", label: "Baby Dedication" },
  { value: "other", label: "Other" },
]; 