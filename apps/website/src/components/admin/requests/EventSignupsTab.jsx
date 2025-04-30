import React from "react";
import {
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  CheckCircleIcon,
  XCircleIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { formatDate } from "../../../utils/requests/requestsUtils";
import StatusBadge from "./StatusBadge";

/**
 * Event Signups Tab component
 * @param {Object} props - Component props
 * @param {Array} props.sortedEventSignups - Sorted list of event signup requests
 * @param {Function} props.viewEventSignupDetails - Function to view signup details
 * @param {Function} props.approveAndNotifyEventSignup - Function to approve and notify signup
 * @param {Function} props.declineAndNotifyEventSignup - Function to decline and notify signup
 * @param {Function} props.deleteEventSignupRequest - Function to delete event signup request
 * @param {Boolean} props.actionLoading - Whether an action is currently loading
 * @returns {JSX.Element} - Event signups tab component
 */
const EventSignupsTab = ({
  sortedEventSignups,
  viewEventSignupDetails,
  approveAndNotifyEventSignup,
  declineAndNotifyEventSignup,
  deleteEventSignupRequest,
  actionLoading,
}) => {
  if (sortedEventSignups.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        No event signup requests found.
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
              Requester
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
              Event Type
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
          {sortedEventSignups.map((signup) => (
            <tr key={signup.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <UserIcon className="h-6 w-6 text-gray-500" />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {signup.fullName}
                    </div>
                    <div className="text-sm text-gray-500">
                      Submitted: {formatDate(signup.submittedAt)}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900 flex items-center">
                  <EnvelopeIcon className="h-4 w-4 mr-1 text-gray-500" />
                  {signup.email}
                </div>
                <div className="text-sm text-gray-500 flex items-center">
                  <PhoneIcon className="h-4 w-4 mr-1 text-gray-500" />
                  {signup.phone}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900 capitalize">
                  {signup.eventType === "babyDedication"
                    ? "Baby Dedication"
                    : signup.eventType}
                </div>
                {signup.eventId && (
                  <div className="text-xs text-gray-500">
                    {signup.eventId.title || "Event"}
                  </div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <StatusBadge status={signup.status} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => viewEventSignupDetails(signup)}
                    className="text-blue-600 hover:text-blue-900 px-2 py-1 rounded hover:bg-blue-50"
                  >
                    View
                  </button>
                  {signup.status === "pending" && (
                    <>
                      <button
                        onClick={() => {
                          approveAndNotifyEventSignup(signup);
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
                          declineAndNotifyEventSignup(signup);
                        }}
                        disabled={actionLoading}
                        className={`text-red-600 hover:text-red-900 px-2 py-1 rounded hover:bg-red-50 ${
                          actionLoading ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        {actionLoading ? "Processing..." : "Decline"}
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => {
                      deleteEventSignupRequest(signup);
                    }}
                    disabled={actionLoading}
                    className={`text-gray-600 hover:text-gray-900 px-2 py-1 rounded hover:bg-gray-50 ${
                      actionLoading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    title="Delete this signup request"
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

export default EventSignupsTab;
