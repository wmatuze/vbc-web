import React from "react";
import {
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  CheckCircleIcon,
  XCircleIcon,
  AcademicCapIcon,
  TrashIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import { formatDate } from "../../../utils/requests/requestsUtils.jsx";
import StatusBadge from "./StatusBadge";
import SessionDisplay from "./SessionDisplay";

const FoundationTab = ({
  sortedEnrollments,
  viewEnrollmentDetails,
  approveAndSendSchedule,
  cancelAndNotifyEnrollee,
  completeAndNotifyMember,
  deleteFoundationClassRegistration,
  actionLoading,
}) => {
  if (!sortedEnrollments?.length) {
    return (
      <div className="text-center py-16">
        <AcademicCapIcon className="mx-auto h-10 w-10 text-gray-300 dark:text-gray-600 mb-3" />
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
          No foundation class enrollments found
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
          Enrollment requests will appear here once submitted.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-[700px] w-full table-fixed divide-y divide-gray-200 dark:divide-gray-700">
        <colgroup>
          <col />
          <col className="w-40" />
          <col className="w-48" />
          <col className="w-28" />
          <col className="w-32" />
        </colgroup>
        <thead className="bg-gray-50 dark:bg-gray-700/50">
          <tr>
            {[
              { label: "Enrollee",          cls: "text-left"  },
              { label: "Contact",           cls: "text-left"  },
              { label: "Preferred Session", cls: "text-left"  },
              { label: "Status",            cls: "text-left"  },
              { label: "Actions",           cls: "text-right" },
            ].map(({ label, cls }) => (
              <th
                key={label}
                scope="col"
                className={`px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 ${cls}`}
              >
                {label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
          {sortedEnrollments.map((enrollment) => (
            <tr
              key={enrollment.id}
              className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
            >
              {/* Enrollee */}
              <td className="px-5 py-3.5 whitespace-nowrap">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
                    <UserIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {enrollment.fullName}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      Registered {formatDate(enrollment.registrationDate)}
                    </p>
                  </div>
                </div>
              </td>

              {/* Contact */}
              <td className="px-5 py-3.5">
                <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400 mb-0.5 min-w-0">
                  <EnvelopeIcon className="h-3.5 w-3.5 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                  <span className="truncate">{enrollment.email}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                  <PhoneIcon className="h-3.5 w-3.5 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                  {enrollment.phone}
                </div>
              </td>

              {/* Preferred Session */}
              <td className="px-5 py-3.5">
                <div className="truncate">
                  <SessionDisplay sessionId={enrollment.preferredSession} />
                </div>
              </td>

              {/* Status */}
              <td className="px-5 py-3.5 whitespace-nowrap">
                <StatusBadge status={enrollment.status} />
              </td>

              {/* Actions */}
              <td className="px-5 py-3.5 whitespace-nowrap">
                <div className="flex items-center justify-end gap-1.5">
                  <button
                    onClick={() => viewEnrollmentDetails(enrollment)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 rounded-md transition-colors"
                  >
                    <EyeIcon className="h-3.5 w-3.5" />
                    View
                  </button>

                  {(enrollment.status === "registered" || enrollment.status === "pending") && (
                    <>
                      <button
                        onClick={() => approveAndSendSchedule(enrollment)}
                        disabled={actionLoading}
                        title="Approve"
                        className="inline-flex items-center justify-center p-1.5 text-white bg-green-600 hover:bg-green-700 rounded-md disabled:opacity-50 transition-colors"
                      >
                        <CheckCircleIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => cancelAndNotifyEnrollee(enrollment)}
                        disabled={actionLoading}
                        title="Cancel"
                        className="inline-flex items-center justify-center p-1.5 text-white bg-red-600 hover:bg-red-700 rounded-md disabled:opacity-50 transition-colors"
                      >
                        <XCircleIcon className="h-4 w-4" />
                      </button>
                    </>
                  )}

                  {enrollment.status === "attending" && (
                    <button
                      onClick={() => completeAndNotifyMember(enrollment)}
                      disabled={actionLoading}
                      title="Mark Complete"
                      className="inline-flex items-center justify-center p-1.5 text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-50 transition-colors"
                    >
                      <AcademicCapIcon className="h-4 w-4" />
                    </button>
                  )}

                  <button
                    onClick={() => deleteFoundationClassRegistration(enrollment)}
                    disabled={actionLoading}
                    className="inline-flex items-center p-1.5 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md disabled:opacity-50 transition-colors"
                    title="Delete enrollment"
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

export default FoundationTab;
