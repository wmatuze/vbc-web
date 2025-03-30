import React from "react";

const ToggleView = ({ viewMode, setViewMode }) => {
  return (
    <div className="flex border border-gray-300 rounded-lg overflow-hidden">
      <button
        className={`flex items-center px-3 py-2 ${
          viewMode === "grid"
            ? "bg-red-600 text-white"
            : "bg-white text-gray-700 hover:bg-gray-50"
        } transition-colors`}
        onClick={() => setViewMode("grid")}
        title="Grid View"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
          />
        </svg>
      </button>
      <button
        className={`flex items-center px-3 py-2 ${
          viewMode === "list"
            ? "bg-red-600 text-white"
            : "bg-white text-gray-700 hover:bg-gray-50"
        } transition-colors`}
        onClick={() => setViewMode("list")}
        title="List View"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 10h16M4 14h16M4 18h16"
          />
        </svg>
      </button>
      <button
        className={`flex items-center px-3 py-2 ${
          viewMode === "calendar"
            ? "bg-red-600 text-white"
            : "bg-white text-gray-700 hover:bg-gray-50"
        } transition-colors`}
        onClick={() => setViewMode("calendar")}
        title="Calendar View"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </button>
    </div>
  );
};

export default ToggleView;
