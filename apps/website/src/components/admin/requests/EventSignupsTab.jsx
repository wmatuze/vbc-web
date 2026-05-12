import React from "react";
import {
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  XCircleIcon,
  TrashIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import { formatDate } from "../../../utils/requests/requestsUtils.jsx";
import StatusBadge from "./StatusBadge";

const formatEventType = (type) => {
  if (!type) return "—";
  if (type === "babyDedication") return "Baby Dedication";
  if (type === "event" || type === "general") return "General Event";
  return type.charAt(0).toUpperCase() + type.slice(1);
};

const EventSignupsTab = ({
  sortedEventSignups,
  viewEventSignupDetails,
  approveAndNotifyEventSignup,
  declineAndNotifyEventSignup,
  deleteEventSignupRequest,
  actionLoading,
}) => {
  if (!sortedEventSignups?.length) {
    return (
      <div className="text-center py-16">
        <CalendarDaysIcon className="mx-auto h-10 w-10 text-gray-300 dark:text-gray-600 mb-3" />
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
          No event signup requests found
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
          Event signup requests will appear here once submitted.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-[700px] w-full table-fixed divide-y divide-gray-200 dark:divide-gray-700">
        <colgroup>
          <col style={{ width: "30%" }} />
          <col style={{ width: "26%" }} />
          <col style={{ width: "17%" }} />
          <col style={{ width: "14%" }} />
          <col style={{ width: "13%" }} />
        </colgroup>
        <thead className="bg-gray-50 dark:bg-gray-700/50">
          <tr>
            {[
              { label: "Requester", cls: "text-left"  },
              { label: "Contact",   cls: "text-left"  },
              { label: "Event",     cls: "text-left"  },
              { label: "Status",    cls: "text-left"  },
              { label: "Actions",   cls: "text-right" },
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
          {sortedEventSignups.map((signup) => (
            <tr
              key={signup.id}
              className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
            >
              {/* Requester */}
              <td className="px-5 py-3.5 whitespace-nowrap">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
                    <UserIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {signup.fullName}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      Submitted {formatDate(signup.submittedAt)}
                    </p>
                  </div>
                </div>
              </td>

              {/* Contact */}
              <td className="px-5 py-3.5">
                <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400 mb-0.5 min-w-0">
                  <EnvelopeIcon className="h-3.5 w-3.5 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                  <span className="truncate">{signup.email}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                  <PhoneIcon className="h-3.5 w-3.5 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                  {signup.phone}
                </div>
              </td>

              {/* Event */}
              <td className="px-5 py-3.5 whitespace-nowrap">
                <p className="text-sm text-gray-900 dark:text-white">
                  {formatEventType(signup.eventType)}
                </p>
                {signup.eventId?.title && (
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                    {signup.eventId.title}
                  </p>
                )}
              </td>

              {/* Status */}
              <td className="px-5 py-3.5 whitespace-nowrap">
                <StatusBadge status={signup.status} />
              </td>

              {/* Actions */}
              <td className="px-5 py-3.5 whitespace-nowrap">
                <div className="flex items-center justify-end gap-1.5">
                  <button
                    onClick={() => viewEventSignupDetails(signup)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 rounded-md transition-colors"
                  >
                    <EyeIcon className="h-3.5 w-3.5" />
                    View
                  </button>

                  {signup.status === "pending" && (
                    <>
                      <button
                        onClick={() => approveAndNotifyEventSignup(signup)}
                        disabled={actionLoading}
                        title="Approve"
                        className="inline-flex items-center justify-center p-1.5 text-white bg-green-600 hover:bg-green-700 rounded-md disabled:opacity-50 transition-colors"
                      >
                        <CheckCircleIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => declineAndNotifyEventSignup(signup)}
                        disabled={actionLoading}
                        title="Decline"
                        className="inline-flex items-center justify-center p-1.5 text-white bg-red-600 hover:bg-red-700 rounded-md disabled:opacity-50 transition-colors"
                      >
                        <XCircleIcon className="h-4 w-4" />
                      </button>
                    </>
                  )}

                  <button
                    onClick={() => deleteEventSignupRequest(signup)}
                    disabled={actionLoading}
                    className="inline-flex items-center p-1.5 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md disabled:opacity-50 transition-colors"
                    title="Delete signup request"
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

export default EventSignupsTab;
