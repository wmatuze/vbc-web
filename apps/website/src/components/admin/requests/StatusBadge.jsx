import React from "react";
import {
  getStatusBadgeClasses,
  getStatusIcon,
} from "../../../utils/requests/requestsUtils.jsx";

/**
 * Status badge component for displaying request statuses
 * @param {Object} props - Component props
 * @param {String} props.status - The status value to display
 * @returns {JSX.Element} - Status badge component
 */
const StatusBadge = ({ status }) => {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClasses(
        status
      )}`}
    >
      {getStatusIcon(status)}
      <span className="ml-1 capitalize">{status}</span>
    </span>
  );
};

export default StatusBadge;


