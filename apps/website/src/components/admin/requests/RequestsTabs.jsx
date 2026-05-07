import React from "react";
import {
  IdentificationIcon,
  AcademicCapIcon,
  UserPlusIcon,
  BookOpenIcon,
  HandRaisedIcon,
} from "@heroicons/react/24/outline";

const TABS = [
  { id: "membership",   label: "Membership Renewals",        Icon: IdentificationIcon },
  { id: "foundation",   label: "Foundation Enrollments",     Icon: AcademicCapIcon    },
  { id: "discipleship", label: "Discipleship Registrations", Icon: BookOpenIcon       },
  { id: "events",       label: "Event Signups",              Icon: UserPlusIcon       },
  { id: "visitors",     label: "First Timers",               Icon: HandRaisedIcon     },
];

const RequestsTabs = ({ activeTab, setActiveTab, counts = {} }) => (
  <div className="border-b border-gray-200 dark:border-gray-700 px-6">
    <nav className="-mb-px flex gap-1 overflow-x-auto" aria-label="Request tabs">
      {TABS.map(({ id, label, Icon }) => {
        const isActive = activeTab === id;
        const count = counts[id];
        return (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 py-3.5 px-3 border-b-2 text-sm font-medium whitespace-nowrap transition-colors ${
              isActive
                ? "border-blue-500 text-blue-600 dark:text-blue-400"
                : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600"
            }`}
          >
            <Icon className="h-4 w-4 flex-shrink-0" />
            {label}
            {count !== undefined && (
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${
                isActive
                  ? "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
              }`}>
                {count}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  </div>
);

export default RequestsTabs;
