import React from "react";
import {
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  CheckCircleIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { formatDate } from "../../../utils/requests/requestsUtils";
import StatusBadge from "./StatusBadge";

/**
 * Foundation Class Enrollments Tab component
 * @param {Object} props - Component props
 * @param {Array} props.sortedEnrollments - Sorted list of foundation class enrollments
 * @param {Function} props.viewEnrollmentDetails - Function to view enrollment details
 * @param {Function} props.approveAndSendSchedule - Function to approve and send schedule
 * @param {Function} props.cancelAndNotifyEnrollee - Function to cancel and notify enrollee
 * @param {Function} props.completeAndNotifyMember - Function to mark as completed and notify member
 * @param {Function} props.deleteFoundationClassRegistration - Function to delete foundation class registration
 * @param {Boolean} props.actionLoading - Whether an action is currently loading
 * @returns {JSX.Element} - Foundation class tab component
 */
const FoundationTab = ({
  sortedEnrollments,
  viewEnrollmentDetails,
  approveAndSendSchedule,
  cancelAndNotifyEnrollee,
  completeAndNotifyMember,
  deleteFoundationClassRegistration,
  actionLoading,
}) => {
  if (sortedEnrollments.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        No foundation class enrollments found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Enrollee
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Contact
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Preferred Session
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Status
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedEnrollments.map((enrollment) => (
            <tr key={enrollment.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <UserIcon className="h-6 w-6 text-gray-500" />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {enrollment.fullName}
                    </div>
                    <div className="text-sm text-gray-500">
                      Registered: {formatDate(enrollment.registrationDate)}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900 flex items-center">
                  <EnvelopeIcon className="h-4 w-4 mr-1 text-gray-500" />
                  {enrollment.email}
                </div>
                <div className="text-sm text-gray-500 flex items-center">
                  <PhoneIcon className="h-4 w-4 mr-1 text-gray-500" />
                  {enrollment.phone}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {enrollment.preferredSession}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <StatusBadge status={enrollment.status} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => viewEnrollmentDetails(enrollment)}
                    className="text-blue-600 hover:text-blue-900 px-2 py-1 rounded hover:bg-blue-50"
                  >
                    View
                  </button>
                  {enrollment.status === "registered" && (
                    <>
                      <button
                        onClick={() => {
                          approveAndSendSchedule(enrollment);
                        }}
                        disabled={actionLoading}
                        className={`text-green-600 hover:text-green-900 px-2 py-1 rounded hover:bg-green-50 ${
                          actionLoading ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        {actionLoading ? "Processing..." : "Approve"}
                      </button>
                      <button
                        onClick={() => {
                          cancelAndNotifyEnrollee(enrollment);
                        }}
                        disabled={actionLoading}
                        className={`text-red-600 hover:text-red-900 px-2 py-1 rounded hover:bg-red-50 ${
                          actionLoading ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        {actionLoading ? "Processing..." : "Cancel"}
                      </button>
                    </>
                  )}
                  {enrollment.status === "attending" && (
                    <button
                      onClick={() => {
                        completeAndNotifyMember(enrollment);
                      }}
                      disabled={actionLoading}
                      className={`text-green-600 hover:text-green-900 px-2 py-1 rounded hover:bg-green-50 flex items-center ${
                        actionLoading ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      {actionLoading ? (
                        "Processing..."
                      ) : (
                        <>
                          <CheckCircleIcon className="h-4 w-4 mr-1" />
                          Mark Completed
                        </>
                      )}
                    </button>
                  )}
                  <button
                    onClick={() => {
                      deleteFoundationClassRegistration(enrollment);
                    }}
                    disabled={actionLoading}
                    className={`text-gray-600 hover:text-gray-900 px-2 py-1 rounded hover:bg-gray-50 ${
                      actionLoading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    title="Delete this enrollment"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FoundationTab;
