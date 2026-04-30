import React from "react";
import {
  XMarkIcon,
  UserIcon,
  BookOpenIcon,
  CalendarIcon,
  PhoneIcon,
  ChatBubbleLeftRightIcon,
  AcademicCapIcon,
} from "@heroicons/react/24/outline";
import { formatDate } from "../../../utils/requests/requestsUtils.jsx";
import StatusBadge from "./StatusBadge";

const Field = ({ label, value }) => (
  <div>
    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-0.5">
      {label}
    </p>
    <p className="text-sm text-gray-900 dark:text-white">{value || "—"}</p>
  </div>
);

const Section = ({ icon: Icon, title, children }) => (
  <div>
    <div className="flex items-center gap-2 mb-3 pb-1 border-b border-gray-100 dark:border-gray-700">
      <Icon className="h-4 w-4 text-gray-400 dark:text-gray-500" />
      <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
        {title}
      </p>
    </div>
    {children}
  </div>
);

const DiscipleshipDetailsModal = ({ registration, onClose, isOpen }) => {
  if (!isOpen || !registration) return null;

  return (
    <div className="fixed inset-0 bg-black/60 dark:bg-black/75 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center sticky top-0 bg-white dark:bg-gray-800 z-10">
          <div>
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">
              Discipleship Registration
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {registration.fullName}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={registration.status} />
            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-md transition-colors"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-6">
          {/* Personal + Class side by side */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Section icon={UserIcon} title="Personal Information">
              <div className="space-y-3">
                <Field label="Full Name" value={registration.fullName} />
                <Field label="Email"     value={registration.email} />
                <Field label="Phone"     value={registration.phone} />
                <Field label="Registered" value={formatDate(registration.registrationDate)} />
              </div>
            </Section>

            <Section icon={BookOpenIcon} title="Class Details">
              <div className="space-y-3">
                <Field label="Class"    value={registration.classId?.title} />
                <Field label="Level"    value={registration.classId?.level} />
                <Field label="Session"  value={registration.preferredSession} />
                <Field
                  label="Duration"
                  value={
                    registration.classId?.duration
                      ? `${registration.classId.duration.value} ${registration.classId.duration.unit}`
                      : undefined
                  }
                />
              </div>
            </Section>
          </div>

          {/* Session details */}
          {registration.sessionId && (
            <Section icon={CalendarIcon} title="Session Details">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label="Cohort"      value={registration.sessionId.cohortName} />
                <Field label="Location"    value={registration.sessionId.location} />
                <Field label="Facilitator" value={registration.sessionId.facilitator?.name} />
                <Field
                  label="Schedule"
                  value={
                    registration.sessionId.schedule
                      ? `${registration.sessionId.schedule.day}s at ${registration.sessionId.schedule.time}`
                      : undefined
                  }
                />
              </div>
            </Section>
          )}

          {/* Emergency contact */}
          {registration.emergencyContact && (
            <Section icon={PhoneIcon} title="Emergency Contact">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Field label="Name"         value={registration.emergencyContact.name} />
                <Field label="Phone"        value={registration.emergencyContact.phone} />
                <Field label="Relationship" value={registration.emergencyContact.relationship} />
              </div>
            </Section>
          )}

          {/* Instructor */}
          {registration.classId?.instructor && (
            <Section icon={UserIcon} title="Instructor">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label="Name"  value={registration.classId.instructor.name} />
                <Field label="Email" value={registration.classId.instructor.email} />
              </div>
              {registration.classId.instructor.bio && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 leading-relaxed">
                  {registration.classId.instructor.bio}
                </p>
              )}
            </Section>
          )}

          {/* Previous classes */}
          {registration.previousClasses && (
            <Section icon={AcademicCapIcon} title="Previous Classes">
              <p className="text-sm text-gray-700 dark:text-gray-300">{registration.previousClasses}</p>
            </Section>
          )}

          {/* Motivation */}
          {registration.motivationReason && (
            <Section icon={ChatBubbleLeftRightIcon} title="Motivation">
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                {registration.motivationReason}
              </p>
            </Section>
          )}

          {/* Curriculum preview */}
          {registration.classId?.curriculum?.length > 0 && (
            <Section icon={BookOpenIcon} title={`Curriculum (${registration.classId.curriculum.length} weeks)`}>
              <div className="space-y-1 max-h-36 overflow-y-auto">
                {registration.classId.curriculum.slice(0, 5).map((week, i) => (
                  <p key={i} className="text-xs text-gray-600 dark:text-gray-400">
                    <span className="font-medium text-gray-700 dark:text-gray-300">Week {week.week}:</span>{" "}
                    {week.title}
                  </p>
                ))}
                {registration.classId.curriculum.length > 5 && (
                  <p className="text-xs text-gray-400 dark:text-gray-500 italic">
                    +{registration.classId.curriculum.length - 5} more weeks…
                  </p>
                )}
              </div>
            </Section>
          )}

          {/* Questions */}
          {registration.questions && (
            <Section icon={ChatBubbleLeftRightIcon} title="Questions / Comments">
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                {registration.questions}
              </p>
            </Section>
          )}

          {/* Close */}
          <div className="flex justify-end pt-2 border-t border-gray-100 dark:border-gray-700">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 rounded-md transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscipleshipDetailsModal;
