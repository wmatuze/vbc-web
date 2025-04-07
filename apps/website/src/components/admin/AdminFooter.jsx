import React from "react";
import { Link } from "react-router-dom";

const AdminFooter = ({ darkMode }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className={`bg-gray-100 border-t border-gray-200 py-3 mt-auto rounded-lg shadow-sm transition-colors duration-200 ${
        darkMode
          ? "bg-gray-800 border-gray-700 text-gray-300"
          : "bg-white border-gray-200 text-gray-600"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center text-sm">
          <div className="mb-2 md:mb-0">
            © {currentYear} Victory Bible Church CMS •{" "}
            <span className={darkMode ? "text-gray-400" : "text-gray-500"}>
              Admin Portal
            </span>
          </div>
          <div className="flex space-x-4">
            <Link
              to="/admin/help"
              className={`hover:text-indigo-600 transition-colors ${darkMode ? "text-gray-400 hover:text-indigo-400" : "text-gray-600 hover:text-indigo-600"}`}
            >
              Admin Guide
            </Link>
            <Link
              to="/admin/support"
              className={`hover:text-indigo-600 transition-colors ${darkMode ? "text-gray-400 hover:text-indigo-400" : "text-gray-600 hover:text-indigo-600"}`}
            >
              Support
            </Link>
            <span className={darkMode ? "text-gray-500" : "text-gray-400"}>
              v1.0.2
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default AdminFooter;
