import React from "react";
import { motion } from "framer-motion";
import {
  XMarkIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarIcon,
  BookOpenIcon,
  ChatBubbleLeftRightIcon,
  AcademicCapIcon,
} from "@heroicons/react/24/outline";

/**
 * Modal component for displaying detailed discipleship registration information
 * @param {Object} props - Component props
 * @param {Object} props.registration - The discipleship registration object
 * @param {Function} props.onClose - Function to close the modal
 * @param {Boolean} props.isOpen - Whether the modal is open
 * @returns {JSX.Element} - DiscipleshipDetailsModal component
 */
const DiscipleshipDetailsModal = ({ registration, onClose, isOpen }) => {
  if (!isOpen || !registration) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      case "approved":
        return "text-blue-600 bg-blue-100";
      case "attending":
        return "text-green-600 bg-green-100";
      case "completed":
        return "text-purple-600 bg-purple-100";
      case "cancelled":
      case "rejected":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-25"
          onClick={onClose}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <AcademicCapIcon className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Discipleship Registration Details
                </h3>
                <p className="text-sm text-gray-500">
                  Registration ID: {registration._id}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Status */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">Status:</span>
              <span
                className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                  registration.status
                )}`}
              >
                {registration.status.charAt(0).toUpperCase() + registration.status.slice(1)}
              </span>
            </div>

            {/* Personal Information */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                <UserIcon className="w-4 h-4 mr-2" />
                Personal Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Full Name:</span>
                  <p className="text-gray-900">{registration.fullName}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Email:</span>
                  <p className="text-gray-900 flex items-center">
                    <EnvelopeIcon className="w-4 h-4 mr-1 text-gray-400" />
                    {registration.email}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Phone:</span>
                  <p className="text-gray-900 flex items-center">
                    <PhoneIcon className="w-4 h-4 mr-1 text-gray-400" />
                    {registration.phone}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Registration Date:</span>
                  <p className="text-gray-900 flex items-center">
                    <CalendarIcon className="w-4 h-4 mr-1 text-gray-400" />
                    {formatDate(registration.registrationDate)}
                  </p>
                </div>
              </div>
            </div>

            {/* Class Information */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                <BookOpenIcon className="w-4 h-4 mr-2" />
                Class Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Class:</span>
                  <p className="text-gray-900">
                    {registration.classId?.title || "N/A"}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Level:</span>
                  <p className="text-gray-900">
                    {registration.classId?.level || "N/A"}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Preferred Session:</span>
                  <p className="text-gray-900">{registration.preferredSession}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Duration:</span>
                  <p className="text-gray-900">
                    {registration.classId?.duration ? 
                      `${registration.classId.duration.value} ${registration.classId.duration.unit}` : 
                      "N/A"
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Session Information */}
            {registration.sessionId && (
              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  Session Details
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Cohort:</span>
                    <p className="text-gray-900">{registration.sessionId.cohortName || "N/A"}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Schedule:</span>
                    <p className="text-gray-900">
                      {registration.sessionId.schedule ? 
                        `${registration.sessionId.schedule.day}s at ${registration.sessionId.schedule.time}` : 
                        "N/A"
                      }
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Location:</span>
                    <p className="text-gray-900">{registration.sessionId.location || "N/A"}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Facilitator:</span>
                    <p className="text-gray-900">
                      {registration.sessionId.facilitator?.name || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Emergency Contact */}
            {registration.emergencyContact && (
              <div className="bg-red-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                  <PhoneIcon className="w-4 h-4 mr-2" />
                  Emergency Contact
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Name:</span>
                    <p className="text-gray-900">{registration.emergencyContact.name}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Phone:</span>
                    <p className="text-gray-900">{registration.emergencyContact.phone}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Relationship:</span>
                    <p className="text-gray-900">{registration.emergencyContact.relationship}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Motivation */}
            {registration.motivationReason && (
              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                  <ChatBubbleLeftRightIcon className="w-4 h-4 mr-2" />
                  Motivation for Taking This Class
                </h4>
                <p className="text-sm text-gray-900 whitespace-pre-wrap">
                  {registration.motivationReason}
                </p>
              </div>
            )}

            {/* Previous Classes */}
            {registration.previousClasses && (
              <div className="bg-purple-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                  <AcademicCapIcon className="w-4 h-4 mr-2" />
                  Previous Classes
                </h4>
                <p className="text-sm text-gray-900">{registration.previousClasses}</p>
              </div>
            )}

            {/* Questions/Comments */}
            {registration.questions && (
              <div className="bg-yellow-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                  <ChatBubbleLeftRightIcon className="w-4 h-4 mr-2" />
                  Questions/Comments
                </h4>
                <p className="text-sm text-gray-900 whitespace-pre-wrap">
                  {registration.questions}
                </p>
              </div>
            )}

            {/* Instructor Information */}
            {registration.classId?.instructor && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                  <UserIcon className="w-4 h-4 mr-2" />
                  Instructor Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Name:</span>
                    <p className="text-gray-900">{registration.classId.instructor.name}</p>
                  </div>
                  {registration.classId.instructor.email && (
                    <div>
                      <span className="font-medium text-gray-700">Email:</span>
                      <p className="text-gray-900">{registration.classId.instructor.email}</p>
                    </div>
                  )}
                </div>
                {registration.classId.instructor.bio && (
                  <div className="mt-3">
                    <span className="font-medium text-gray-700">Bio:</span>
                    <p className="text-gray-900 text-sm mt-1">{registration.classId.instructor.bio}</p>
                  </div>
                )}
              </div>
            )}

            {/* Curriculum Preview */}
            {registration.classId?.curriculum && registration.classId.curriculum.length > 0 && (
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                  <BookOpenIcon className="w-4 h-4 mr-2" />
                  Class Curriculum ({registration.classId.curriculum.length} weeks)
                </h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {registration.classId.curriculum.slice(0, 5).map((week, index) => (
                    <div key={index} className="text-sm">
                      <span className="font-medium text-gray-700">Week {week.week}:</span>
                      <span className="text-gray-900 ml-2">{week.title}</span>
                    </div>
                  ))}
                  {registration.classId.curriculum.length > 5 && (
                    <p className="text-xs text-gray-500 italic">
                      +{registration.classId.curriculum.length - 5} more weeks...
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end p-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DiscipleshipDetailsModal;
