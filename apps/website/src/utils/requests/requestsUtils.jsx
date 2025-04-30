/**
 * Utility functions for the Requests Manager components
 */
import React from "react";
import { CheckCircleIcon, XCircleIcon, ClockIcon } from "@heroicons/react/24/outline";

/**
 * Format date for display
 * @param {String} dateString - The date string to format
 * @returns {String} - Formatted date string
 */
export const formatDate = (dateString) => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
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
