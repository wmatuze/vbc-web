import React from "react";
import {
  CheckCircleIcon,
  XCircleIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { formatDate } from "../../../utils/requests/requestsUtils";
import StatusBadge from "./StatusBadge";

/**
 * Membership Renewal Details Modal component
 * @param {Object} props - Component props
 * @param {Object} props.selectedRenewal - The selected renewal to display
 * @param {Function} props.setShowRenewalDetails - Function to hide the modal
 * @param {Function} props.approveAndNotifyMember - Function to approve and notify member
 * @param {Function} props.declineAndNotifyMember - Function to decline and notify member
 * @param {Function} props.deleteMembershipRenewal - Function to delete membership renewal
 * @param {Boolean} props.actionLoading - Whether an action is currently loading
 * @returns {JSX.Element} - Membership details modal component
 */
const MembershipDetailsModal = ({
  selectedRenewal,
  setShowRenewalDetails,
  approveAndNotifyMember,
  declineAndNotifyMember,
  deleteMembershipRenewal,
  actionLoading,
}) => {
  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">
            Membership Renewal Details
          </h3>
          <button
            onClick={() => setShowRenewalDetails(false)}
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
                Member Information
              </h4>
              <div className="mt-2 space-y-2">
                <p className="flex items-start">
                  <span className="font-medium w-32">Name:</span>{" "}
                  {selectedRenewal.fullName}
                </p>
                <p className="flex items-start">
                  <span className="font-medium w-32">Email:</span>{" "}
                  {selectedRenewal.email}
                </p>
                <p className="flex items-start">
                  <span className="font-medium w-32">Phone:</span>{" "}
                  {selectedRenewal.phone}
                </p>
                <p className="flex items-start">
                  <span className="font-medium w-32">Member Since:</span>{" "}
                  {selectedRenewal.memberSince}
                </p>
                <p className="flex items-start">
                  <span className="font-medium w-32">Birthday:</span>{" "}
                  {formatDate(selectedRenewal.birthday)}
                </p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500">
                Renewal Information
              </h4>
              <div className="mt-2 space-y-2">
                <p className="flex items-start">
                  <span className="font-medium w-32">Renewal Date:</span>{" "}
                  {formatDate(selectedRenewal.renewalDate)}
                </p>
                <p className="flex items-start">
                  <span className="font-medium w-32">Status:</span>
                  <StatusBadge status={selectedRenewal.status} />
                </p>
                <p className="flex items-start">
                  <span className="font-medium w-32">Address Change:</span>{" "}
                  {selectedRenewal.addressChange ? "Yes" : "No"}
                </p>
                {selectedRenewal.addressChange &&
                  selectedRenewal.newAddress && (
                    <p className="flex items-start">
                      <span className="font-medium w-32">New Address:</span>{" "}
                      {selectedRenewal.newAddress}
                    </p>
                  )}
              </div>
            </div>
          </div>

          {selectedRenewal.ministryInvolvement && (
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-500">
                Ministry Involvement
              </h4>
              <p className="mt-2 text-sm text-gray-600">
                {selectedRenewal.ministryInvolvement}
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-2 justify-end mt-6">
            {selectedRenewal.status === "pending" && (
              <>
                <button
                  onClick={() => {
                    approveAndNotifyMember(selectedRenewal);
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
                    declineAndNotifyMember(selectedRenewal);
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
                deleteMembershipRenewal(selectedRenewal);
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

export default MembershipDetailsModal;
