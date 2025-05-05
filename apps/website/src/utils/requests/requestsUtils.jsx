/**
 * Utility functions for the Requests Manager components
 */
import React from "react";
import { format, parseISO, isValid } from "date-fns";
import {
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

/**
 * Format date for display with robust error handling
 * @param {String|Date|Object} dateInput - The date input to format
 * @returns {String} - Formatted date string
 */
export const formatDate = (dateInput) => {
  // If no input, return a default message
  if (!dateInput) return "No date";

  // Special case: If it's an object with imageUrl property but no date properties,
  // it's likely not a date object at all (corrupted date object)
  if (
    typeof dateInput === "object" &&
    dateInput !== null &&
    dateInput.imageUrl
  ) {
    console.log("Detected corrupted date object with imageUrl:", dateInput);
    return "Date unavailable (corrupted)";
  }

  try {
    // If it's a string, try to parse it as a date
    if (typeof dateInput === "string") {
      // If it's already formatted like "January 1, 2023", just return it
      if (dateInput.includes(",") && /[a-zA-Z]/.test(dateInput)) {
        return dateInput;
      }

      // Try to parse it as a date
      const dateObj = new Date(dateInput);
      if (isValid(dateObj)) {
        return format(dateObj, "MMMM d, yyyy");
      }

      // If we can't parse it, return it as is
      return dateInput;
    }

    // If it's a Date object
    if (dateInput instanceof Date) {
      if (isValid(dateInput)) {
        return format(dateInput, "MMMM d, yyyy");
      }
      return "Invalid Date";
    }

    // If it's an object (like MongoDB date)
    if (typeof dateInput === "object" && dateInput !== null) {
      // Check for common date properties
      if (dateInput.year && dateInput.month && dateInput.day) {
        const dateObj = new Date(
          dateInput.year,
          dateInput.month - 1,
          dateInput.day
        );
        if (isValid(dateObj)) {
          return format(dateObj, "MMMM d, yyyy");
        }
      }

      // Try direct conversion to Date
      const dateObj = new Date(dateInput);
      if (isValid(dateObj)) {
        return format(dateObj, "MMMM d, yyyy");
      }

      // If we can't parse it as a date, return a default message
      return "Date format unavailable";
    }

    // For any other type, try to create a date
    const dateObj = new Date(dateInput);
    if (isValid(dateObj)) {
      return format(dateObj, "MMMM d, yyyy");
    }

    // If we can't parse it, return a default message
    return "Date unavailable";
  } catch (err) {
    console.error("Error formatting date:", err);
    return "Date unavailable";
  }
};

/**
 * Get status badge classes based on status
 * @param {String} status - The status value
 * @returns {String} - CSS classes for the status badge
 */
export const getStatusBadgeClasses = (status) => {
  switch (status) {
    case "approved":
    case "completed":
      return "bg-green-100 text-green-800";
    case "declined":
    case "cancelled":
      return "bg-red-100 text-red-800";
    case "pending":
    case "registered":
    case "attending":
    default:
      return "bg-yellow-100 text-yellow-800";
  }
};

/**
 * Get status icon based on status
 * @param {String} status - The status value
 * @returns {JSX.Element} - Icon component for the status
 */
export const getStatusIcon = (status) => {
  switch (status) {
    case "approved":
    case "completed":
      return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
    case "declined":
    case "cancelled":
      return <XCircleIcon className="h-5 w-5 text-red-500" />;
    case "pending":
    case "registered":
    case "attending":
    default:
      return <ClockIcon className="h-5 w-5 text-yellow-500" />;
  }
};

/**
 * Normalize a request date to ensure it's valid
 * @param {String|Date|Object} dateInput - The date input to normalize
 * @returns {Object} - Object with normalized date formats
 */
export const normalizeRequestDate = (dateInput) => {
  let dateObject;
  let originalValue = dateInput; // Store the original value

  try {
    // If it's already a Date object
    if (dateInput instanceof Date && isValid(dateInput)) {
      dateObject = dateInput;
    }
    // If it's a string date
    else if (typeof dateInput === "string" && dateInput) {
      // If it's an ISO-formatted date (yyyy-MM-dd)
      if (dateInput.match(/^\d{4}-\d{2}-\d{2}$/)) {
        dateObject = parseISO(dateInput);
      }
      // If it's a formatted date string with commas (Month Day, Year)
      else if (dateInput.includes(",")) {
        dateObject = new Date(dateInput);
      }
      // Any other format we can try to parse
      else {
        dateObject = new Date(dateInput);
      }
    }
    // If it's an object but not a Date
    else if (typeof dateInput === "object" && !(dateInput instanceof Date)) {
      // Try to convert to string if possible
      if (dateInput && dateInput.toString) {
        return normalizeRequestDate(dateInput.toString());
      }
    }

    // If we have a valid date object, use it
    if (dateObject && isValid(dateObject)) {
      // Generate the needed formats
      const isoDate = format(dateObject, "yyyy-MM-dd");
      const formattedDate = format(dateObject, "MMMM d, yyyy");

      return {
        date: isoDate, // For date input field (yyyy-MM-dd)
        formattedDate: formattedDate, // For display (Month Day, Year)
        dateObject: dateObject, // JavaScript Date object
        originalValue: originalValue, // Keep the original value
      };
    }

    // If we couldn't parse it, return the original value
    console.warn("Could not parse date, returning original:", dateInput);
    return {
      date:
        typeof originalValue === "string"
          ? originalValue
          : String(originalValue),
      formattedDate:
        typeof originalValue === "string"
          ? originalValue
          : String(originalValue),
      dateObject: originalValue,
      originalValue: originalValue,
    };
  } catch (error) {
    // Return the original value if any errors occur
    console.error("Error normalizing request date:", error);
    return {
      date:
        typeof originalValue === "string"
          ? originalValue
          : String(originalValue),
      formattedDate:
        typeof originalValue === "string"
          ? originalValue
          : String(originalValue),
      dateObject: originalValue,
      originalValue: originalValue,
    };
  }
};
