import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useRecurringEventsQuery } from "../../hooks/useRecurringEventsQuery";

// Icons for different recurring event types
const getIconForEvent = (iconName) => {
  switch (iconName) {
    case "oil-lamp":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
          />
        </svg>
      );
    case "communion":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      );
    case "praying-hands":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11"
          />
        </svg>
      );
    default:
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      );
  }
};

// Helper function to get schedule text based on recurrence pattern
const getScheduleText = (event) => {
  if (event.recurrenceType === "monthly") {
    if (event.weekOfMonth) {
      return `${event.weekOfMonth.charAt(0).toUpperCase() + event.weekOfMonth.slice(1)} Sunday of each month`;
    } else if (event.dayOfMonth) {
      return `The ${event.dayOfMonth}${getDaySuffix(event.dayOfMonth)} of each month`;
    }
  } else if (event.recurrenceType === "weekly") {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return `Every ${days[event.dayOfWeek]}`;
  } else if (event.recurrenceType === "yearly") {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return `Annually in ${months[event.month]}`;
  }
  return "Recurring event";
};

// Helper function to get day suffix (1st, 2nd, 3rd, etc.)
const getDaySuffix = (day) => {
  if (day > 3 && day < 21) return "th";
  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
};

const MonthlyPrograms = () => {
  // Use React Query to fetch recurring events
  const {
    data: recurringEvents = [],
    isLoading,
    error,
    refetch: refetchEvents,
  } = useRecurringEventsQuery({
    staleTime: 60 * 1000, // 1 minute instead of 5 minutes
  });

  // Filter to only show featured events
  const [featuredPrograms, setFeaturedPrograms] = useState([]);

  useEffect(() => {
    if (recurringEvents && recurringEvents.length > 0) {
      // Filter for featured events and map to the format needed for display
      const featured = recurringEvents
        .filter((event) => event.featured && event.active)
        .map((event) => ({
          id: event.id || event._id,
          title: event.title,
          schedule: getScheduleText(event),
          time: event.time,
          description: event.description,
          icon: getIconForEvent(event.icon),
          color: event.color || "primary",
        }));

      setFeaturedPrograms(featured);
    }
  }, [recurringEvents]);

  // Helper function to get color classes based on event color or index
  const getColorClasses = (program, index) => {
    // Default color mapping if program.color is not specified
    if (!program.color || program.color === "primary") {
      switch (index % 3) {
        case 0:
          return {
            icon: "bg-yellow-50 text-yellow-600",
            text: "text-yellow-500",
            badge: "bg-yellow-100 text-yellow-800",
          };
        case 1:
          return {
            icon: "bg-red-50 text-red-600",
            text: "text-red-500",
            badge: "bg-red-100 text-red-800",
          };
        case 2:
          return {
            icon: "bg-blue-50 text-blue-600",
            text: "text-blue-500",
            badge: "bg-blue-100 text-blue-800",
          };
      }
    }

    // Map color names to Tailwind classes
    switch (program.color) {
      case "yellow":
        return {
          icon: "bg-yellow-50 text-yellow-600",
          text: "text-yellow-500",
          badge: "bg-yellow-100 text-yellow-800",
        };
      case "red":
        return {
          icon: "bg-red-50 text-red-600",
          text: "text-red-500",
          badge: "bg-red-100 text-red-800",
        };
      case "blue":
        return {
          icon: "bg-blue-50 text-blue-600",
          text: "text-blue-500",
          badge: "bg-blue-100 text-blue-800",
        };
      case "green":
        return {
          icon: "bg-green-50 text-green-600",
          text: "text-green-500",
          badge: "bg-green-100 text-green-800",
        };
      case "purple":
        return {
          icon: "bg-purple-50 text-purple-600",
          text: "text-purple-500",
          badge: "bg-purple-100 text-purple-800",
        };
      default:
        return {
          icon: "bg-blue-50 text-blue-600",
          text: "text-blue-500",
          badge: "bg-blue-100 text-blue-800",
        };
    }
  };

  return (
    <section id="monthly-programs" className="py-16 px-6 bg-white">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row items-center justify-between mb-12"
        >
          <div className="flex items-center">
            <div className="w-12 h-1 bg-primary-500 mr-4"></div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
              Monthly Programs
            </h2>
          </div>
          <p className="text-gray-600 mt-4 md:mt-0 max-w-xl">
            Join us for our consistent monthly programs designed to enrich your
            spiritual journey.
          </p>
        </motion.div>

        {isLoading ? (
          // Loading state
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
          </div>
        ) : error ? (
          // Error state
          <div className="text-center py-8">
            <div className="bg-red-50 text-red-700 p-4 rounded-lg inline-block mb-4">
              <p>Unable to load monthly programs</p>
              <button
                onClick={() => refetchEvents()}
                className="mt-2 text-sm underline hover:text-red-800"
              >
                Try again
              </button>
            </div>
          </div>
        ) : featuredPrograms.length === 0 ? (
          // Empty state
          <div className="text-center py-8">
            <p className="text-gray-500">
              No monthly programs are currently scheduled.
            </p>
          </div>
        ) : (
          // Programs grid
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredPrograms.map((program, index) => {
              const colorClasses = getColorClasses(program, index);

              return (
                <motion.div
                  key={program.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <div
                        className={`p-3 rounded-full ${colorClasses.icon} mr-4`}
                      >
                        {program.icon}
                      </div>
                      <h3 className="text-xl font-bold text-gray-800">
                        {program.title}
                      </h3>
                    </div>

                    <div className="mb-4 flex items-center text-gray-600">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-5 w-5 mr-2 ${colorClasses.text}`}
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
                      <span className="font-medium">{program.schedule}</span>
                    </div>

                    <div className="mb-4 flex items-center text-gray-600">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-5 w-5 mr-2 ${colorClasses.text}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>{program.time}</span>
                    </div>

                    <p className="text-gray-600 mb-4">{program.description}</p>

                    <div className="mt-2">
                      <span
                        className={`inline-block ${colorClasses.badge} text-xs px-3 py-1 rounded-full font-medium`}
                      >
                        {program.schedule.includes("week")
                          ? "Weekly"
                          : program.schedule.includes("month")
                            ? "Monthly"
                            : program.schedule.includes("Annually")
                              ? "Yearly"
                              : "Recurring"}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <Link
            to="/events"
            className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-medium px-6 py-3 rounded-lg transition-all duration-300 hover:shadow-lg"
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
            View Full Church Calendar
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default MonthlyPrograms;
