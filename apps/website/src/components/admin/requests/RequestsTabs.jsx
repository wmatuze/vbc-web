import React from "react";
import {
  IdentificationIcon,
  AcademicCapIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";

/**
 * Tab navigation component for the Requests Manager
 * @param {Object} props - Component props
 * @param {String} props.activeTab - The currently active tab
 * @param {Function} props.setActiveTab - Function to set the active tab
 * @returns {JSX.Element} - Tab navigation component
 */
const RequestsTabs = ({ activeTab, setActiveTab }) => {
  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex gap-6" aria-label="Tabs">
        <button
          onClick={() => setActiveTab("membership")}
          className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
            activeTab === "membership"
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
        >
          <IdentificationIcon className="h-5 w-5 mr-2" />
          Membership Renewals
        </button>
        <button
          onClick={() => setActiveTab("foundation")}
          className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
            activeTab === "foundation"
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
        >
          <AcademicCapIcon className="h-5 w-5 mr-2" />
          Foundation Class Enrollments
        </button>
        <button
          onClick={() => setActiveTab("events")}
          className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
            activeTab === "events"
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
        >
          <UserPlusIcon className="h-5 w-5 mr-2" />
          Event Signups
        </button>
      </nav>
    </div>
  );
};

export default RequestsTabs;
