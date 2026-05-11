import React from "react";
import { MagnifyingGlassIcon, ArrowDownTrayIcon } from "@heroicons/react/24/outline";

const STATUS_OPTIONS = {
  membership:   ["pending", "approved", "declined"],
  foundation:   ["registered", "attending", "completed", "cancelled"],
  discipleship: ["pending", "approved", "attending", "completed", "rejected"],
  events:       ["pending", "approved", "declined"],
};

const DownloadButton = ({ onClick, disabled, label }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="flex items-center gap-2 px-3 py-2 text-xs font-semibold border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-colors whitespace-nowrap"
  >
    <ArrowDownTrayIcon className="h-3.5 w-3.5" />
    {label}
  </button>
);

const SearchFilters = ({
  activeTab,
  searchTerm,
  onSearchTermChange,
  filterStatus,
  onFilterStatusChange,
  eventTypeFilter,
  onEventTypeFilterChange,
  onFetchEventSignups,
  onDownloadMembers,
  onDownloadGraduates,
  actionLoading,
}) => {
  const statuses = STATUS_OPTIONS[activeTab] || STATUS_OPTIONS.events;

  const handleEventTypeChange = (e) => {
    onEventTypeFilterChange(e.target.value);
    onFetchEventSignups();
  };

  // Visitors tab has its own filter UI built in
  if (activeTab === "visitors") return null;

  return (
    <div className="px-6 py-3 border-b border-gray-200 dark:border-gray-700 flex flex-wrap gap-3 items-center">
      {/* Search */}
      <div className="relative flex-1 min-w-[200px]">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        <input
          type="text"
          placeholder="Search by name, email or phone…"
          value={searchTerm}
          onChange={(e) => onSearchTermChange(e.target.value)}
          className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-md focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600"
        />
      </div>

      {/* Status filter */}
      <select
        value={filterStatus}
        onChange={(e) => onFilterStatusChange(e.target.value)}
        className="py-2 pl-3 pr-8 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-1 focus:ring-red-600"
      >
        <option value="all">All Statuses</option>
        {statuses.map((s) => (
          <option key={s} value={s} className="capitalize">
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </option>
        ))}
      </select>

      {/* Event type filter */}
      {activeTab === "events" && (
        <select
          value={eventTypeFilter}
          onChange={handleEventTypeChange}
          className="py-2 pl-3 pr-8 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-1 focus:ring-red-600"
        >
          <option value="all">All Event Types</option>
          <option value="baptism">Baptism</option>
          <option value="babyDedication">Baby Dedication</option>
          <option value="other">Other Events</option>
        </select>
      )}

      {/* Download buttons */}
      {activeTab === "membership" && (
        <DownloadButton
          onClick={onDownloadMembers}
          disabled={actionLoading}
          label="Download Members"
        />
      )}
      {activeTab === "foundation" && (
        <DownloadButton
          onClick={onDownloadGraduates}
          disabled={actionLoading}
          label="Download Graduates"
        />
      )}
    </div>
  );
};

export default SearchFilters;
