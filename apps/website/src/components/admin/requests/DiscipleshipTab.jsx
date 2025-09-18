import React from "react";
import { motion } from "framer-motion";
import {
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  UserGroupIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";

/**
 * Tab component for displaying discipleship class registrations
 * @param {Object} props - Component props
 * @param {Array} props.registrations - Array of discipleship registrations
 * @param {Function} props.onViewDetails - Function to handle viewing registration details
 * @param {Function} props.onApprove - Function to handle approving a registration
 * @param {Function} props.onReject - Function to handle rejecting a registration
 * @param {Boolean} props.actionLoading - Whether an action is currently loading
 * @returns {JSX.Element} - DiscipleshipTab component
 */
const DiscipleshipTab = ({
  registrations,
  onViewDetails,
  onApprove,
  onReject,
  actionLoading,
}) => {
  // Helper function to get status badge styling
  const getStatusBadge = (status) => {
    const baseClasses = "px-2 py-1 text-xs font-medium rounded-full";
    switch (status) {
      case "pending":
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case "approved":
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case "attending":
        return `${baseClasses} bg-green-100 text-green-800`;
      case "completed":
        return `${baseClasses} bg-purple-100 text-purple-800`;
      case "cancelled":
      case "rejected":
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <ClockIcon className="h-4 w-4 text-yellow-500" />;
      case "approved":
      case "attending":
        return <CheckCircleIcon className="h-4 w-4 text-green-500" />;
      case "completed":
        return <UserGroupIcon className="h-4 w-4 text-purple-500" />;
      case "cancelled":
      case "rejected":
        return <XCircleIcon className="h-4 w-4 text-red-500" />;
      default:
        return <ClockIcon className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (!registrations || registrations.length === 0) {
    return (
      <div className="text-center py-12">
        <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          No discipleship registrations
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          No one has registered for discipleship classes yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {registrations.map((registration, index) => (
        <motion.div
          key={registration._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-3">
                {getStatusIcon(registration.status)}
                <h3 className="text-lg font-medium text-gray-900">
                  {registration.fullName}
                </h3>
                <span className={getStatusBadge(registration.status)}>
                  {registration.status.charAt(0).toUpperCase() + registration.status.slice(1)}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <p className="font-medium">Contact Information:</p>
                  <p>{registration.email}</p>
                  <p>{registration.phone}</p>
                </div>
                <div>
                  <p className="font-medium">Class Details:</p>
                  <p>
                    <span className="font-medium">Class:</span>{" "}
                    {registration.classId?.title || "N/A"}
                  </p>
                  <p>
                    <span className="font-medium">Session:</span>{" "}
                    {registration.preferredSession}
                  </p>
                </div>
              </div>

              {registration.previousClasses && (
                <div className="mt-3 text-sm text-gray-600">
                  <p className="font-medium">Previous Classes:</p>
                  <p>{registration.previousClasses}</p>
                </div>
              )}

              <div className="mt-3 flex items-center text-sm text-gray-500">
                <CalendarIcon className="h-4 w-4 mr-1" />
                <span>Registered: {formatDate(registration.registrationDate)}</span>
              </div>
            </div>

            <div className="flex flex-col space-y-2 ml-4">
              <button
                onClick={() => onViewDetails(registration)}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <EyeIcon className="h-4 w-4 mr-1" />
                View
              </button>

              {registration.status === "pending" && (
                <>
                  <button
                    onClick={() => onApprove(registration._id)}
                    disabled={actionLoading}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                  >
                    <CheckCircleIcon className="h-4 w-4 mr-1" />
                    Approve
                  </button>
                  <button
                    onClick={() => onReject(registration._id)}
                    disabled={actionLoading}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                  >
                    <XCircleIcon className="h-4 w-4 mr-1" />
                    Reject
                  </button>
                </>
              )}

              {registration.status === "approved" && (
                <button
                  onClick={() => onApprove(registration._id, "attending")}
                  disabled={actionLoading}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  <UserGroupIcon className="h-4 w-4 mr-1" />
                  Mark Attending
                </button>
              )}

              {registration.status === "attending" && (
                <button
                  onClick={() => onApprove(registration._id, "completed")}
                  disabled={actionLoading}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
                >
                  <CheckCircleIcon className="h-4 w-4 mr-1" />
                  Mark Completed
                </button>
              )}
            </div>
          </div>

          {registration.questions && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm font-medium text-gray-700 mb-1">Questions/Comments:</p>
              <p className="text-sm text-gray-600">{registration.questions}</p>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default DiscipleshipTab;
