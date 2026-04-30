import React, { useEffect } from "react";
import {
  CheckCircleIcon,
  XCircleIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { formatDate } from "../../../utils/requests/requestsUtils.jsx";
import StatusBadge from "./StatusBadge";

const Spinner = () => (
  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
  </svg>
);

const Field = ({ label, value }) => (
  <div>
    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-0.5">
      {label}
    </p>
    <p className="text-sm text-gray-900 dark:text-white">{value || "—"}</p>
  </div>
);

const MembershipDetailsModal = ({
  selectedRenewal,
  setShowRenewalDetails,
  approveAndNotifyMember,
  declineAndNotifyMember,
  deleteMembershipRenewal,
  actionLoading,
}) => {
  // Fix any corrupted date fields silently
  useEffect(() => {
    if (!selectedRenewal) return;
    ["birthday", "renewalDate"].forEach((field) => {
      if (
        typeof selectedRenewal[field] === "object" &&
        !(selectedRenewal[field] instanceof Date) &&
        selectedRenewal[field]?.imageUrl
      ) {
        selectedRenewal[field] = new Date().toISOString();
      }
    });
  }, [selectedRenewal]);

  if (!selectedRenewal) return null;

  return (
    <div className="fixed inset-0 bg-black/60 dark:bg-black/75 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center sticky top-0 bg-white dark:bg-gray-800 z-10">
          <div>
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">
              Membership Renewal
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {selectedRenewal.fullName}
            </p>
          </div>
          <button
            onClick={() => setShowRenewalDetails(false)}
            className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-md transition-colors"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-6">
          {/* Member + Renewal info side by side */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 pb-1 border-b border-gray-100 dark:border-gray-700">
                Member Information
              </p>
              <Field label="Name"         value={selectedRenewal.fullName} />
              <Field label="Email"        value={selectedRenewal.email} />
              <Field label="Phone"        value={selectedRenewal.phone} />
              <Field label="Member Since" value={selectedRenewal.memberSince} />
              <Field label="Birthday"     value={formatDate(selectedRenewal.birthday)} />
            </div>

            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 pb-1 border-b border-gray-100 dark:border-gray-700">
                Renewal Information
              </p>
              <Field label="Renewal Date" value={formatDate(selectedRenewal.renewalDate)} />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-0.5">
                  Status
                </p>
                <StatusBadge status={selectedRenewal.status} />
              </div>
              <Field
                label="Address Change"
                value={selectedRenewal.addressChange ? "Yes" : "No"}
              />
              {selectedRenewal.addressChange && selectedRenewal.newAddress && (
                <Field label="New Address" value={selectedRenewal.newAddress} />
              )}
            </div>
          </div>

          {/* Ministry involvement */}
          {selectedRenewal.ministryInvolvement && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">
                Ministry Involvement
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                {selectedRenewal.ministryInvolvement}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-3 pt-2 border-t border-gray-100 dark:border-gray-700">
            {selectedRenewal.status === "pending" && (
              <>
                <button
                  onClick={() => approveAndNotifyMember(selectedRenewal)}
                  disabled={actionLoading}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md disabled:opacity-50 transition-colors"
                >
                  {actionLoading ? <Spinner /> : <CheckCircleIcon className="h-4 w-4" />}
                  {actionLoading ? "Processing…" : "Approve & Notify"}
                </button>
                <button
                  onClick={() => declineAndNotifyMember(selectedRenewal)}
                  disabled={actionLoading}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md disabled:opacity-50 transition-colors"
                >
                  {actionLoading ? <Spinner /> : <XCircleIcon className="h-4 w-4" />}
                  {actionLoading ? "Processing…" : "Decline"}
                </button>
              </>
            )}
            <button
              onClick={() => deleteMembershipRenewal(selectedRenewal)}
              disabled={actionLoading}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 hover:border-red-300 dark:hover:border-red-700 rounded-md disabled:opacity-50 transition-colors ml-auto"
            >
              <TrashIcon className="h-4 w-4" />
              Delete Request
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MembershipDetailsModal;
