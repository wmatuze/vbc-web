import React, { useEffect } from "react";
import {
  CheckCircleIcon,
  XCircleIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { formatDate } from "../../../utils/requests/requestsUtils.jsx";
import StatusBadge from "./StatusBadge";

/**
 * Event Signup Details Modal component
 * @param {Object} props - Component props
 * @param {Object} props.selectedEventSignup - The selected event signup to display
 * @param {Function} props.setShowEventSignupDetails - Function to hide the modal
 * @param {Function} props.approveAndNotifyEventSignup - Function to approve and notify signup
 * @param {Function} props.declineAndNotifyEventSignup - Function to decline and notify signup
 * @param {Function} props.deleteEventSignupRequest - Function to delete event signup request
 * @param {Boolean} props.actionLoading - Whether an action is currently loading
 * @returns {JSX.Element} - Event signup details modal component
 */
const EventSignupDetailsModal = ({
  selectedEventSignup,
  setShowEventSignupDetails,
  approveAndNotifyEventSignup,
  declineAndNotifyEventSignup,
  deleteEventSignupRequest,
  actionLoading,
}) => {
  // Fix corrupted date objects
  useEffect(() => {
    // This function will be used to fix corrupted date objects
    const fixCorruptedDateObject = (obj, fieldName) => {
      if (!obj || !obj[fieldName]) return;

      // Check if the field is a corrupted date object (has imageUrl property)
      if (
        typeof obj[fieldName] === "object" &&
        !(obj[fieldName] instanceof Date) &&
        obj[fieldName].imageUrl
      ) {
        console.log(`Fixing corrupted ${fieldName} object:`, obj[fieldName]);

        // Replace the corrupted object with a proper date string
        // We'll use the current date as a fallback
        obj[fieldName] = new Date().toISOString();
        console.log(`Fixed ${fieldName} object:`, obj[fieldName]);
      }
    };

    // Fix corrupted date objects if they exist
    if (selectedEventSignup) {
      fixCorruptedDateObject(selectedEventSignup, "submittedAt");
      fixCorruptedDateObject(selectedEventSignup, "childDateOfBirth");

      // Debug logs
      console.log("SubmittedAt after fix:", selectedEventSignup.submittedAt);
      if (selectedEventSignup.childDateOfBirth) {
        console.log(
          "ChildDateOfBirth after fix:",
          selectedEventSignup.childDateOfBirth
        );
      }
    }
  }, [selectedEventSignup]);

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">
            Event Signup Request Details
          </h3>
          <button
            onClick={() => setShowEventSignupDetails(false)}
            className="text-gray-400 hover:text-gray-500"
          >
            <span className="sr-only">Close</span>
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <h4 className="text-sm font-medium text-gray-500">
                Requester Information
              </h4>
              <div className="mt-2 space-y-2">
                <p className="flex items-start">
                  <span className="font-medium w-32">Name:</span>{" "}
                  {selectedEventSignup.fullName}
                </p>
                <p className="flex items-start">
                  <span className="font-medium w-32">Email:</span>{" "}
                  {selectedEventSignup.email}
                </p>
                <p className="flex items-start">
                  <span className="font-medium w-32">Phone:</span>{" "}
                  {selectedEventSignup.phone}
                </p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500">
                Event Information
              </h4>
              <div className="mt-2 space-y-2">
                <p className="flex items-start">
                  <span className="font-medium w-32">Event Type:</span>{" "}
                  <span className="capitalize">
                    {selectedEventSignup.eventType === "babyDedication"
                      ? "Baby Dedication"
                      : selectedEventSignup.eventType}
                  </span>
                </p>
                {selectedEventSignup.eventId && (
                  <p className="flex items-start">
                    <span className="font-medium w-32">Event:</span>{" "}
                    {selectedEventSignup.eventId.title || "Event"}
                  </p>
                )}
                <p className="flex items-start">
                  <span className="font-medium w-32">Submitted:</span>{" "}
                  {formatDate(selectedEventSignup.submittedAt)}
                </p>
                <p className="flex items-start">
                  <span className="font-medium w-32">Status:</span>
                  <StatusBadge status={selectedEventSignup.status} />
                </p>
              </div>
            </div>
          </div>

          {/* Event-specific details */}
          {selectedEventSignup.eventType === "baptism" && (
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-500">
                Baptism Details
              </h4>
              <div className="mt-2 space-y-2">
                {selectedEventSignup.testimony && (
                  <div>
                    <p className="font-medium">Testimony:</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {selectedEventSignup.testimony}
                    </p>
                  </div>
                )}
                {selectedEventSignup.previousReligion && (
                  <div>
                    <p className="font-medium">
                      Previous Religious Background:
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {selectedEventSignup.previousReligion}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {selectedEventSignup.eventType === "babyDedication" && (
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-500">
                Baby Dedication Details
              </h4>
              <div className="mt-2 space-y-2">
                {selectedEventSignup.childName && (
                  <p className="flex items-start">
                    <span className="font-medium w-32">Child's Name:</span>{" "}
                    {selectedEventSignup.childName}
                  </p>
                )}
                {selectedEventSignup.childDateOfBirth && (
                  <p className="flex items-start">
                    <span className="font-medium w-32">Date of Birth:</span>{" "}
                    {formatDate(selectedEventSignup.childDateOfBirth)}
                  </p>
                )}
                {selectedEventSignup.parentNames && (
                  <p className="flex items-start">
                    <span className="font-medium w-32">Parents' Names:</span>{" "}
                    {selectedEventSignup.parentNames}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Additional message */}
          {selectedEventSignup.message && (
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-500">
                Additional Message
              </h4>
              <p className="mt-2 text-sm text-gray-600">
                {selectedEventSignup.message}
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-2 justify-end mt-6">
            {selectedEventSignup.status === "pending" && (
              <>
                <button
                  onClick={() => {
                    approveAndNotifyEventSignup(selectedEventSignup);
                  }}
                  disabled={actionLoading}
                  className={`inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                    actionLoading
                      ? "bg-green-400 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700"
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
                >
                  {actionLoading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircleIcon className="h-5 w-5 mr-2" />
                      Approve & Notify
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    declineAndNotifyEventSignup(selectedEventSignup);
                  }}
                  disabled={actionLoading}
                  className={`inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                    actionLoading
                      ? "bg-red-400 cursor-not-allowed"
                      : "bg-red-600 hover:bg-red-700"
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500`}
                >
                  {actionLoading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      <XCircleIcon className="h-5 w-5 mr-2" />
                      Decline
                    </>
                  )}
                </button>
              </>
            )}

            <button
              onClick={() => {
                deleteEventSignupRequest(selectedEventSignup);
              }}
              disabled={actionLoading}
              className={`inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 ${
                actionLoading
                  ? "bg-gray-100 cursor-not-allowed"
                  : "bg-white hover:bg-gray-50"
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500`}
            >
              <TrashIcon className="h-5 w-5 mr-2 text-gray-500" />
              Delete Request
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventSignupDetailsModal;
