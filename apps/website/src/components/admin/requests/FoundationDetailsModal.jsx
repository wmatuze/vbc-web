import React, { useEffect } from "react";
import {
  CheckCircleIcon,
  XCircleIcon,
  AcademicCapIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { formatDate } from "../../../utils/requests/requestsUtils.jsx";
import StatusBadge from "./StatusBadge";

/**
 * Foundation Class Enrollment Details Modal component
 * @param {Object} props - Component props
 * @param {Object} props.selectedEnrollment - The selected enrollment to display
 * @param {Function} props.setShowEnrollmentDetails - Function to hide the modal
 * @param {Function} props.approveAndSendSchedule - Function to approve and send schedule
 * @param {Function} props.cancelAndNotifyEnrollee - Function to cancel and notify enrollee
 * @param {Function} props.completeAndNotifyMember - Function to mark as completed and notify member
 * @param {Function} props.deleteFoundationClassRegistration - Function to delete foundation class registration
 * @param {Boolean} props.actionLoading - Whether an action is currently loading
 * @returns {JSX.Element} - Foundation class details modal component
 */
const FoundationDetailsModal = ({
  selectedEnrollment,
  setShowEnrollmentDetails,
  approveAndSendSchedule,
  cancelAndNotifyEnrollee,
  completeAndNotifyMember,
  deleteFoundationClassRegistration,
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
    if (selectedEnrollment) {
      fixCorruptedDateObject(selectedEnrollment, "registrationDate");

      // Debug logs
      console.log(
        "Registration Date after fix:",
        selectedEnrollment.registrationDate
      );
    }
  }, [selectedEnrollment]);

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">
            Foundation Class Enrollment Details
          </h3>
          <button
            onClick={() => setShowEnrollmentDetails(false)}
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
                Enrollee Information
              </h4>
              <div className="mt-2 space-y-2">
                <p className="flex items-start">
                  <span className="font-medium w-32">Name:</span>{" "}
                  {selectedEnrollment.fullName}
                </p>
                <p className="flex items-start">
                  <span className="font-medium w-32">Email:</span>{" "}
                  {selectedEnrollment.email}
                </p>
                <p className="flex items-start">
                  <span className="font-medium w-32">Phone:</span>{" "}
                  {selectedEnrollment.phone}
                </p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500">
                Enrollment Information
              </h4>
              <div className="mt-2 space-y-2">
                <p className="flex items-start">
                  <span className="font-medium w-32">Registration Date:</span>{" "}
                  {formatDate(selectedEnrollment.registrationDate)}
                </p>
                <p className="flex items-start">
                  <span className="font-medium w-32">Preferred Session:</span>{" "}
                  {selectedEnrollment.preferredSession}
                </p>
                <p className="flex items-start">
                  <span className="font-medium w-32">Status:</span>
                  <StatusBadge status={selectedEnrollment.status} />
                </p>
              </div>
            </div>
          </div>

          {selectedEnrollment.questions && (
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-500">
                Questions/Comments
              </h4>
              <p className="mt-2 text-sm text-gray-600">
                {selectedEnrollment.questions}
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-2 justify-end mt-6">
            {selectedEnrollment.status === "registered" && (
              <>
                <button
                  onClick={() => {
                    approveAndSendSchedule(selectedEnrollment);
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
                      Approve & Send Schedule
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    cancelAndNotifyEnrollee(selectedEnrollment);
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
                      Cancel Enrollment
                    </>
                  )}
                </button>
              </>
            )}

            {selectedEnrollment.status === "attending" && (
              <>
                <button
                  onClick={() => {
                    completeAndNotifyMember(selectedEnrollment);
                  }}
                  disabled={actionLoading}
                  className={`inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                    actionLoading
                      ? "bg-blue-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
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
                      <AcademicCapIcon className="h-5 w-5 mr-2" />
                      Mark as Completed & Notify
                    </>
                  )}
                </button>
              </>
            )}

            <button
              onClick={() => {
                deleteFoundationClassRegistration(selectedEnrollment);
              }}
              disabled={actionLoading}
              className={`inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 ${
                actionLoading
                  ? "bg-gray-100 cursor-not-allowed"
                  : "bg-white hover:bg-gray-50"
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500`}
            >
              <TrashIcon className="h-5 w-5 mr-2 text-gray-500" />
              Delete Registration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoundationDetailsModal;
