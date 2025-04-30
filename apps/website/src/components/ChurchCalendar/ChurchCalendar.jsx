import React, { useState, useEffect } from "react";
import { useEventsQuery } from "../../hooks/useEventsQuery";
import EventCard from "./EventsCard";
import ToggleView from "./ToggleView";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import PlaceHolderbanner from "../../assets/ministry-banners/ph.png"; // Using the same placeholder banner as ministry pages
import FallbackImage from "../../assets/fallback-image.png"; // Import fallback image
import config from "../../config";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet"; // Added for SEO
import EventSignUpForm from "../EventSignUpForm"; // Import the sign-up form component

const API_URL = config.API_URL;

const ChurchCalendar = () => {
  const [viewMode, setViewMode] = useState("grid"); // Default to grid view
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSignUpFormOpen, setIsSignUpFormOpen] = useState(false);
  // Use React Query for fetching events
  const {
    data: events = [],
    isLoading: loading,
    error,
    refetch: refetchEvents,
  } = useEventsQuery();

  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const navigate = useNavigate();
  const [isImageLoaded, setIsImageLoaded] = useState(false); // Loading state for Hero Image

  // Log events data when it changes
  useEffect(() => {
    if (events && events.length > 0) {
      console.log("ChurchCalendar - API events data:", events);
      setFilteredEvents(events);
    }
  }, [events]);

  // Get unique ministries for filter dropdown
  const ministryCategories = [
    "All",
    ...new Set(events.map((event) => event.ministry).filter(Boolean)),
  ];

  // Filter events based on search term and category
  useEffect(() => {
    let result = events;

    // Filter by search term
    if (searchTerm) {
      result = result.filter(
        (event) =>
          event?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event?.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== "All") {
      result = result.filter((event) => event?.ministry === selectedCategory);
    }

    setFilteredEvents(result);
  }, [searchTerm, selectedCategory, events]);

  // Handle event click
  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  // Add to calendar function
  const addToCalendar = (event) => {
    // Format date for Google Calendar
    // Use startDate (API field) if available, otherwise use legacy date and time fields
    const startDate = event.startDate
      ? new Date(event.startDate)
      : new Date(event.date + " " + (event.time || "00:00"));

    // Use endDate (API field) if available, otherwise default to 2 hours duration
    const endDate = event.endDate
      ? new Date(event.endDate)
      : new Date(startDate.getTime() + 2 * 60 * 60 * 1000);

    const formattedStart = startDate.toISOString().replace(/-|:|\.\d+/g, "");
    const formattedEnd = endDate.toISOString().replace(/-|:|\.\d+/g, "");

    const googleCalendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      event.title
    )}&details=${encodeURIComponent(
      event.description || ""
    )}&location=${encodeURIComponent(
      event.location || "Victory Bible Church"
    )}&dates=${formattedStart}/${formattedEnd}`;

    window.open(googleCalendarUrl, "_blank");
  };

  // Get image URL with fallback
  const getImageUrl = (event) => {
    if (!event?.imageUrl && !event?.image) return FallbackImage;

    if (event.imageUrl) {
      // Handle API uploaded images
      return event.imageUrl.startsWith("http")
        ? event.imageUrl
        : `${API_URL}${event.imageUrl}`;
    } else if (event.image) {
      // Handle imported local images from the assets folder
      return event.image;
    }

    return FallbackImage;
  };

  // Format events for FullCalendar with robust date parsing
  const calendarEvents = events.map((event) => {
    // Log the event data for debugging
    console.log("Processing event for calendar:", {
      id: event?.id,
      title: event?.title,
      date: event?.date,
      startDate: event?.startDate,
      time: event?.time,
    });

    let eventDate;

    // First try to use startDate if it's a valid date
    if (event?.startDate) {
      try {
        const parsedDate = new Date(event.startDate);
        if (!isNaN(parsedDate.getTime())) {
          eventDate = parsedDate;
          console.log(`Using startDate for calendar event: ${eventDate}`);
        }
      } catch (err) {
        console.error(
          `Error parsing startDate for calendar:`,
          err,
          event.startDate
        );
      }
    }

    // If startDate didn't work, try to use date + time
    if (!eventDate && event?.date) {
      try {
        // If date is in format "April 30, 2025"
        if (typeof event.date === "string" && event.date.includes(",")) {
          const parts = event.date.split(",");
          if (parts.length === 2) {
            const monthDay = parts[0].trim().split(" ");
            const year = parts[1].trim();
            if (monthDay.length === 2) {
              const month = monthDay[0];
              const day = parseInt(monthDay[1]);
              const dateStr = `${month} ${day}, ${year}`;

              // Add time if available
              if (event.time) {
                eventDate = new Date(`${dateStr} ${event.time}`);
              } else {
                eventDate = new Date(dateStr);
              }

              if (!isNaN(eventDate.getTime())) {
                console.log(
                  `Using formatted date+time for calendar event: ${eventDate}`
                );
              } else {
                eventDate = undefined; // Reset if invalid
              }
            }
          }
        } else {
          // Try standard date parsing
          const dateStr =
            event.date + (event.time ? ` ${event.time}` : " 00:00");
          eventDate = new Date(dateStr);
          if (!isNaN(eventDate.getTime())) {
            console.log(
              `Using standard date+time for calendar event: ${eventDate}`
            );
          } else {
            eventDate = undefined; // Reset if invalid
          }
        }
      } catch (err) {
        console.error(
          `Error parsing date+time for calendar:`,
          err,
          event.date,
          event.time
        );
      }
    }

    // Fallback to current date if all parsing failed
    if (!eventDate || isNaN(eventDate.getTime())) {
      eventDate = new Date();
      console.warn(
        `Using fallback current date for calendar event: ${event?.title}`
      );
    }

    return {
      id: event.id,
      title: event.title,
      start: eventDate,
      extendedProps: { ...event },
    };
  });

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  // Helper function to get the event date, handling both API and legacy formats
  const getEventDate = (event) => {
    // Log the event data for debugging
    console.log("Getting event date for display:", {
      id: event?.id,
      title: event?.title,
      date: event?.date,
      startDate: event?.startDate,
    });

    try {
      // First priority: use the date field if it's in the expected format
      if (
        event?.date &&
        typeof event.date === "string" &&
        event.date.includes(",")
      ) {
        const parts = event.date.split(",");
        if (parts.length === 2) {
          const monthDay = parts[0].trim().split(" ");
          const year = parts[1].trim();
          if (monthDay.length === 2) {
            const month = monthDay[0];
            const day = parseInt(monthDay[1]);
            const parsedDate = new Date(`${month} ${day}, ${year}`);
            if (!isNaN(parsedDate.getTime())) {
              console.log(
                `Successfully parsed date from event.date: ${parsedDate}`
              );
              return parsedDate;
            }
          }
        }
      }

      // Second priority: use startDate if it's a valid date
      if (event?.startDate) {
        // If startDate is a string in ISO format or similar
        const parsedDate = new Date(event.startDate);
        if (!isNaN(parsedDate.getTime())) {
          console.log(
            `Successfully parsed date from event.startDate: ${parsedDate}`
          );
          return parsedDate;
        }
      }

      // Third priority: try to parse date field even if it's not in the expected format
      if (event?.date) {
        const parsedDate = new Date(event.date);
        if (!isNaN(parsedDate.getTime())) {
          console.log(
            `Successfully parsed date from event.date fallback: ${parsedDate}`
          );
          return parsedDate;
        }
      }
    } catch (err) {
      console.error(`Error parsing date for event:`, err, event);
    }

    // Fallback to current date if parsing fails
    const today = new Date();
    console.log(`Using fallback current date: ${today}`);
    return today;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* SEO Meta Tags */}
      <Helmet>
        <title>Church Calendar - Victory Bible Church</title>
        <meta
          name="description"
          content="Stay updated with Victory Bible Church's events calendar. Find upcoming services, programs, and community events."
        />
      </Helmet>

      {/* Hero Section - Similar to About Us Page */}
      <section className="relative overflow-hidden rounded-b-3xl h-[85vh]">
        <motion.div
          className={`absolute inset-0 ${
            !isImageLoaded ? "animate-pulse bg-gray-200" : ""
          }`}
          style={{
            backgroundImage: `url(${
              isImageLoaded ? PlaceHolderbanner : FallbackImage
            })`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
          onLoad={() => setIsImageLoaded(true)} // Update loading state
          aria-label="Hero background image" // Accessibility
        >
          <img
            src={PlaceHolderbanner}
            alt="Victory Bible Church banner for Church Calendar"
            className="hidden"
            onLoad={() => setIsImageLoaded(true)}
            onError={() => setIsImageLoaded(true)} // Fallback on error
          />
        </motion.div>

        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 via-purple-900/70 to-blue-900/80 rounded-b-3xl"></div>

        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden rounded-b-3xl">
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white/10"
              style={{
                width: Math.random() * 100 + 50,
                height: Math.random() * 100 + 50,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [Math.random() * 100, Math.random() * -100],
                opacity: [0.1, 0.3, 0.1],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 relative z-10 h-full flex flex-col justify-center items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl lg:text-5xl font-bold text-white text-center mb-4 tracking-tight">
              Church <span className="text-yellow-400">Calendar</span> 2025
            </h1>
            <p className="text-lg text-white text-center max-w-3xl mx-auto leading-relaxed font-light">
              Explore upcoming events and join us as we grow in faith and
              community.
            </p>
            <motion.div
              className="h-1 bg-yellow-400 mx-auto mt-8"
              initial={{ width: 0 }}
              animate={{ width: 100 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            />
          </motion.div>
        </div>
      </section>

      {/* Search and Filter Section - Below Hero */}
      <div className="max-w-7xl mx-auto bg-white p-4 rounded-lg shadow-md mt-8 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full md:w-1/2">
            <input
              type="text"
              placeholder="Search events..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={loading}
            />
            <span className="absolute right-3 top-2.5 text-gray-400">
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
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </span>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              disabled={loading}
            >
              {ministryCategories.map((ministry) => (
                <option
                  key={ministry || "unknown"}
                  value={ministry || "unknown"}
                >
                  {ministry || "Unknown Ministry"}
                </option>
              ))}
            </select>

            <ToggleView viewMode={viewMode} setViewMode={setViewMode} />
          </div>
        </div>
      </div>

      {/* Content Section (Events Grid, List, Calendar) - Below Search/Filter */}
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-md p-4 md:p-6">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">{error}</p>
            <button
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              onClick={() => refetchEvents()}
            >
              Retry
            </button>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">
              No events found matching your criteria.
            </p>
            <button
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("All");
              }}
            >
              Reset Filters
            </button>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                onClick={() => handleEventClick(event)}
                className="cursor-pointer"
              >
                <EventCard event={event} />
              </div>
            ))}
          </div>
        ) : viewMode === "list" ? (
          <ul className="space-y-4">
            {filteredEvents.map((event) => (
              <li
                key={event.id}
                className="p-4 bg-white rounded-lg shadow border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleEventClick(event)}
              >
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  {/* Date Box */}
                  <div className="flex flex-col items-center justify-center min-w-20 border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                    <div className="bg-red-600 text-white text-xs uppercase font-bold py-1 w-full text-center">
                      {getEventDate(event).toLocaleString("default", {
                        month: "short",
                      })}
                    </div>
                    <div className="text-gray-800 text-2xl font-bold py-2 w-full text-center">
                      {getEventDate(event).getDate()}
                    </div>
                  </div>

                  {/* Event Details */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">
                          {event?.title || "Unnamed Event"}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
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
                          <span>{event?.time || "TBA"}</span>

                          {event?.location && (
                            <>
                              <span className="mx-1">•</span>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                              </svg>
                              <span>{event.location}</span>
                            </>
                          )}
                        </div>
                      </div>
                      {event?.ministry && (
                        <span className="inline-block px-3 py-1 bg-red-100 text-red-700 text-sm font-medium rounded-full">
                          {event.ministry}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 mt-2 line-clamp-2">
                      {event?.description || "No description available."}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="h-96">
            <FullCalendar
              plugins={[dayGridPlugin]}
              initialView="dayGridMonth"
              events={calendarEvents}
              eventClick={(info) => {
                handleEventClick(info.event.extendedProps);
              }}
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,dayGridWeek",
              }}
              height="100%"
            />
          </div>
        )}
      </div>

      {/* Event Detail Modal */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        className="max-w-2xl mx-auto mt-20 bg-white rounded-lg shadow-xl overflow-hidden outline-none"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center z-50"
      >
        {selectedEvent && (
          <div>
            {/* Modal Header with Image */}
            <div className="relative h-48 bg-gray-200">
              <img
                src={getImageUrl(selectedEvent)}
                alt={selectedEvent?.title || "Event"}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = FallbackImage;
                  e.target.onerror = null;
                }}
              />
              <button
                onClick={closeModal}
                className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              {selectedEvent?.ministry && (
                <div className="absolute top-4 left-4 bg-red-600 text-white py-1 px-3 rounded-lg font-medium text-sm">
                  {selectedEvent.ministry}
                </div>
              )}
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="flex items-start gap-4 mb-6">
                {/* Date Box */}
                <div className="flex flex-col items-center justify-center min-w-20 border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                  <div className="bg-red-600 text-white text-xs uppercase font-bold py-1 w-full text-center">
                    {getEventDate(selectedEvent).toLocaleString("default", {
                      month: "short",
                    })}
                  </div>
                  <div className="text-gray-800 text-3xl font-bold py-2 w-full text-center">
                    {getEventDate(selectedEvent).getDate()}
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    {selectedEvent?.title || "Unnamed Event"}
                  </h2>
                  <div className="flex items-center gap-2 text-gray-600">
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
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>{selectedEvent?.time || "TBA"}</span>
                  </div>
                  {selectedEvent?.location && (
                    <div className="flex items-center mt-1 text-gray-600">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      {selectedEvent.location}
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">About This Event</h3>
                <p className="text-gray-700">
                  {selectedEvent?.description || "No description available."}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                {selectedEvent?.signupRequired && (
                  <button
                    onClick={() => {
                      closeModal();
                      setIsSignUpFormOpen(true);
                    }}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
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
                        d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                      />
                    </svg>
                    Sign Up
                  </button>
                )}
                <button
                  onClick={() => addToCalendar(selectedEvent)}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
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
                  Add to Calendar
                </button>
                <button
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Event Sign-up Form */}
      {isSignUpFormOpen && selectedEvent && (
        <EventSignUpForm
          event={selectedEvent}
          onClose={() => setIsSignUpFormOpen(false)}
          onSubmit={() => {
            setIsSignUpFormOpen(false);
            // Optionally refetch events if needed
            // refetchEvents();
          }}
        />
      )}
    </div>
  );
};

export default ChurchCalendar;
