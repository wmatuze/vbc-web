import React from "react";
import {
  UserIcon,
  CalendarIcon,
  PhoneIcon,
  EnvelopeIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import { formatDate } from "../../../utils/requests/requestsUtils.jsx";
import StatusBadge from "./StatusBadge";

const MembershipTab = ({
  sortedRenewals,
  viewRenewalDetails,
  approveAndNotifyMember,
  declineAndNotifyMember,
  deleteMembershipRenewal,
  actionLoading,
}) => {
  if (!sortedRenewals?.length) {
    return (
      <div className="text-center py-16">
        <UserIcon className="mx-auto h-10 w-10 text-gray-300 dark:text-gray-600 mb-3" />
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
          No membership renewals found
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
          Renewal requests submitted by members will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-700/50">
          <tr>
            {["Member", "Contact", "Renewal Date", "Status", "Actions"].map((h, i) => (
              <th
                key={h}
                scope="col"
                className={`px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 ${
                  i === 4 ? "text-right" : "text-left"
                }`}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
          {sortedRenewals.map((renewal) => (
            <tr
              key={renewal.id}
              className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
            >
              {/* Member */}
              <td className="px-5 py-3.5 whitespace-nowrap">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
                    <UserIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {renewal.fullName}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      Member since {renewal.memberSince}
                    </p>
                  </div>
                </div>
              </td>

              {/* Contact */}
              <td className="px-5 py-3.5 whitespace-nowrap">
                <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400 mb-0.5">
                  <EnvelopeIcon className="h-3.5 w-3.5 text-gray-400 dark:text-gray-500" />
                  {renewal.email}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                  <PhoneIcon className="h-3.5 w-3.5 text-gray-400 dark:text-gray-500" />
                  {renewal.phone}
                </div>
              </td>

              {/* Renewal Date */}
              <td className="px-5 py-3.5 whitespace-nowrap">
                <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
                  <CalendarIcon className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                  {formatDate(renewal.renewalDate)}
                </div>
              </td>

              {/* Status */}
              <td className="px-5 py-3.5 whitespace-nowrap">
                <StatusBadge status={renewal.status} />
              </td>

              {/* Actions */}
              <td className="px-5 py-3.5 whitespace-nowrap">
                <div className="flex items-center justify-end gap-1.5">
                  <button
                    onClick={() => viewRenewalDetails(renewal)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 rounded-md transition-colors"
                  >
                    <EyeIcon className="h-3.5 w-3.5" />
                    View
                  </button>

                  {renewal.status === "pending" && (
                    <>
                      <button
                        onClick={() => approveAndNotifyMember(renewal)}
                        disabled={actionLoading}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-white bg-green-600 hover:bg-green-700 rounded-md disabled:opacity-50 transition-colors"
                      >
                        <CheckCircleIcon className="h-3.5 w-3.5" />
                        Approve
                      </button>
                      <button
                        onClick={() => declineAndNotifyMember(renewal)}
                        disabled={actionLoading}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-white bg-red-600 hover:bg-red-700 rounded-md disabled:opacity-50 transition-colors"
                      >
                        <XCircleIcon className="h-3.5 w-3.5" />
                        Decline
                      </button>
                    </>
                  )}

                  <button
                    onClick={() => deleteMembershipRenewal(renewal)}
                    disabled={actionLoading}
                    className="inline-flex items-center p-1.5 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md disabled:opacity-50 transition-colors"
                    title="Delete renewal request"
                  >
                    <TrashIcon className="h-3.5 w-3.5" />
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

export default MembershipTab;
