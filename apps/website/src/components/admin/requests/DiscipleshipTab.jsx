import React from "react";
import {
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  UserGroupIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";

const statusConfig = {
  pending:   { badge: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300", Icon: ClockIcon,        iconCls: "text-yellow-500" },
  approved:  { badge: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",         Icon: CheckCircleIcon,  iconCls: "text-blue-500"   },
  attending: { badge: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",     Icon: CheckCircleIcon,  iconCls: "text-green-500"  },
  completed: { badge: "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300", Icon: UserGroupIcon,    iconCls: "text-purple-500" },
  cancelled: { badge: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",             Icon: XCircleIcon,     iconCls: "text-red-500"    },
  rejected:  { badge: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",             Icon: XCircleIcon,     iconCls: "text-red-500"    },
};

const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

const DiscipleshipTab = ({ registrations, onViewDetails, onApprove, onReject, actionLoading }) => {
  if (!registrations?.length) {
    return (
      <div className="text-center py-16">
        <UserGroupIcon className="mx-auto h-10 w-10 text-gray-300 dark:text-gray-600 mb-3" />
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
          No discipleship registrations
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
          Registrations will appear here once people sign up.
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-100 dark:divide-gray-700">
      {registrations.map((reg) => {
        const config = statusConfig[reg.status] || statusConfig.pending;
        const StatusIcon = config.Icon;

        return (
          <div key={reg._id} className="py-5 first:pt-0 last:pb-0">
            <div className="flex items-start justify-between gap-4">
              {/* Left — info */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <StatusIcon className={`h-4 w-4 flex-shrink-0 ${config.iconCls}`} />
                  <span className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                    {reg.fullName}
                  </span>
                  <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${config.badge}`}>
                    {reg.status.charAt(0).toUpperCase() + reg.status.slice(1)}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1 text-xs text-gray-500 dark:text-gray-400 mb-2">
                  <div className="space-y-0.5">
                    <p className="font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 text-[10px]">Contact</p>
                    <p>{reg.email}</p>
                    <p>{reg.phone}</p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 text-[10px]">Class Details</p>
                    <p><span className="font-medium text-gray-700 dark:text-gray-300">Class:</span> {reg.classId?.title || "N/A"}</p>
                    <p><span className="font-medium text-gray-700 dark:text-gray-300">Session:</span> {reg.preferredSession}</p>
                  </div>
                </div>

                {reg.previousClasses && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    <span className="font-medium text-gray-700 dark:text-gray-300">Previous classes: </span>
                    {reg.previousClasses}
                  </p>
                )}

                <div className="flex items-center gap-1 mt-2 text-xs text-gray-400 dark:text-gray-500">
                  <CalendarIcon className="h-3.5 w-3.5" />
                  <span>Registered {formatDate(reg.registrationDate)}</span>
                </div>

                {reg.questions && (
                  <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-0.5">Questions / Comments</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{reg.questions}</p>
                  </div>
                )}
              </div>

              {/* Right — actions */}
              <div className="flex flex-col gap-2 flex-shrink-0">
                <button
                  onClick={() => onViewDetails(reg)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 dark:border-gray-600 text-xs font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 rounded-md transition-colors"
                >
                  <EyeIcon className="h-3.5 w-3.5" />
                  View
                </button>

                {reg.status === "pending" && (
                  <>
                    <button
                      onClick={() => onApprove(reg._id)}
                      disabled={actionLoading}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-green-600 hover:bg-green-700 rounded-md disabled:opacity-50 transition-colors"
                    >
                      <CheckCircleIcon className="h-3.5 w-3.5" />
                      Approve
                    </button>
                    <button
                      onClick={() => onReject(reg._id)}
                      disabled={actionLoading}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-red-600 hover:bg-red-700 rounded-md disabled:opacity-50 transition-colors"
                    >
                      <XCircleIcon className="h-3.5 w-3.5" />
                      Reject
                    </button>
                  </>
                )}

                {reg.status === "approved" && (
                  <button
                    onClick={() => onApprove(reg._id, "attending")}
                    disabled={actionLoading}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-50 transition-colors"
                  >
                    <UserGroupIcon className="h-3.5 w-3.5" />
                    Mark Attending
                  </button>
                )}

                {reg.status === "attending" && (
                  <button
                    onClick={() => onApprove(reg._id, "completed")}
                    disabled={actionLoading}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-md disabled:opacity-50 transition-colors"
                  >
                    <CheckCircleIcon className="h-3.5 w-3.5" />
                    Mark Completed
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DiscipleshipTab;
