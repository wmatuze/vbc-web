import React from "react";
import { MagnifyingGlassIcon, ArrowDownTrayIcon } from "@heroicons/react/24/outline";

/**
 * Search and filter controls component for the Requests Manager
 * @param {Object} props - Component props
 * @param {String} props.activeTab - The currently active tab
 * @param {String} props.searchTerm - The current search term
 * @param {Function} props.setSearchTerm - Function to set the search term
 * @param {String} props.filterStatus - The current status filter
 * @param {Function} props.setFilterStatus - Function to set the status filter
 * @param {String} props.eventTypeFilter - The current event type filter (for events tab)
 * @param {Function} props.setEventTypeFilter - Function to set the event type filter
 * @param {Function} props.fetchEventSignups - Function to fetch event signups
 * @param {Function} props.downloadMembersList - Function to download members list
 * @param {Function} props.downloadFoundationGraduatesList - Function to download foundation graduates list
 * @param {Boolean} props.actionLoading - Whether an action is currently loading
 * @returns {JSX.Element} - Search and filter controls component
 */
const SearchFilters = ({
  activeTab,
  searchTerm,
  setSearchTerm,
  filterStatus,
  setFilterStatus,
  eventTypeFilter,
  setEventTypeFilter,
  fetchEventSignups,
  downloadMembersList,
  downloadFoundationGraduatesList,
  actionLoading,
}) => {
  return (
    <div className="px-6 py-4 border-b border-gray-200">
      <div className="flex flex-col md:flex-row gap-4 md:items-center">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by name, email or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        <div className="w-full md:w-auto">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg"
          >
            <option value="all">All Statuses</option>
            {activeTab === "membership" ? (
              <>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="declined">Declined</option>
              </>
            ) : activeTab === "foundation" ? (
              <>
                <option value="registered">Registered</option>
                <option value="attending">Attending</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </>
            ) : (
              <>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="declined">Declined</option>
              </>
            )}
          </select>
        </div>

        {activeTab === "events" && (
          <div className="w-full md:w-auto">
            <select
              value={eventTypeFilter}
              onChange={(e) => {
                setEventTypeFilter(e.target.value);
                fetchEventSignups();
              }}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg"
            >
              <option value="all">All Event Types</option>
              <option value="baptism">Baptism</option>
              <option value="babyDedication">Baby Dedication</option>
              <option value="other">Other Events</option>
            </select>
          </div>
        )}

        {activeTab === "membership" && (
          <button
            onClick={downloadMembersList}
            disabled={actionLoading}
            className={`w-full md:w-auto flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
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
                <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
                Download Members List
              </>
            )}
          </button>
        )}

        {activeTab === "foundation" && (
          <button
            onClick={downloadFoundationGraduatesList}
            disabled={actionLoading}
            className={`w-full md:w-auto flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
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
                <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
                Download Graduates List
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchFilters;
