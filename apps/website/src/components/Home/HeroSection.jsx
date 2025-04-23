import { Link } from "react-router-dom";
import { forwardRef, useState, useEffect } from "react";
import { useEventsQuery } from "../../hooks/useEventsQuery";
import EventCard from "../ChurchCalendar/EventsCard";

// API URL for static assets and uploads
const API_URL = "http://localhost:3000";

const HeroSection = forwardRef((props, ref) => {
  // Use React Query for fetching events
  const {
    data: events = [],
    isLoading: loading,
    error,
    refetch: refetchEvents,
  } = useEventsQuery();

  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Process events data when it changes
  useEffect(() => {
    try {
      console.log("Hero section - Events data received:", events);
      console.log("Loading state:", loading);
      console.log("Error state:", error);

      if (events && events.length > 0) {
        console.log("Hero section - API events data:", events);

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        console.log("Today's date for comparison:", today);

        const upcomingOnly = events
          .filter((event) => {
            // Check if we should use startDate (API format) or date (legacy format)
            let eventDate;

            try {
              // Try parsing the date in different formats
              if (event.startDate) {
                // If it's a string like "April 30, 2025", parse it properly
                if (
                  typeof event.startDate === "string" &&
                  event.startDate.includes(",")
                ) {
                  const parts = event.startDate.split(",");
                  if (parts.length === 2) {
                    const monthDay = parts[0].trim().split(" ");
                    const year = parts[1].trim();
                    if (monthDay.length === 2) {
                      const month = monthDay[0];
                      const day = parseInt(monthDay[1]);
                      eventDate = new Date(`${month} ${day}, ${year}`);
                    }
                  }
                } else {
                  // Try standard date parsing
                  eventDate = new Date(event.startDate);
                }
              } else if (event.date) {
                // If it's a string like "April 30, 2025", parse it properly
                if (
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
                      eventDate = new Date(`${month} ${day}, ${year}`);
                    }
                  }
                } else {
                  // Try standard date parsing
                  eventDate = new Date(event.date);
                }
              } else {
                // Fallback to current date
                eventDate = new Date();
              }

              // Check if the date is valid
              if (isNaN(eventDate.getTime())) {
                console.error(
                  `Invalid date for event: ${event.title}`,
                  event.startDate || event.date
                );
                eventDate = new Date(); // Fallback to current date
              }
            } catch (err) {
              console.error(
                `Error parsing date for event: ${event.title}`,
                err
              );
              eventDate = new Date(); // Fallback to current date
            }

            console.log(
              `Event: ${event.title}, Date: ${eventDate.toISOString()}, Original: ${event.startDate || event.date}, Is upcoming: ${eventDate >= today}`
            );
            return eventDate >= today;
          })
          .sort((a, b) => {
            // Sort by date, using the appropriate field with robust parsing
            const parseEventDate = (event) => {
              try {
                if (event.startDate) {
                  return new Date(event.startDate);
                } else if (event.date) {
                  return new Date(event.date);
                }
              } catch (err) {
                console.error(`Error parsing date for sorting:`, err);
              }
              return new Date(); // Fallback
            };

            return parseEventDate(a) - parseEventDate(b);
          });

        console.log("Upcoming events after filtering:", upcomingOnly);
        setUpcomingEvents(upcomingOnly.slice(0, 4));
      } else if (!loading && (!events || events.length === 0)) {
        // If no events are available and we're not loading, use fallback data
        console.error("No events available in the database");

        // Fallback static events
        const staticEvents = [
          {
            id: "static1",
            title: "Sunday Worship Service",
            date: new Date(Date.now() + 86400000 * 3), // 3 days from now
            startDate: new Date(Date.now() + 86400000 * 3),
            time: "10:00 AM",
            location: "Main Sanctuary",
            imageUrl: "/assets/events/default-event.jpg",
          },
          {
            id: "static2",
            title: "Prayer Meeting",
            date: new Date(Date.now() + 86400000 * 5), // 5 days from now
            startDate: new Date(Date.now() + 86400000 * 5),
            time: "7:00 PM",
            location: "Prayer Room",
            imageUrl: "/assets/events/default-event.jpg",
          },
          {
            id: "static3",
            title: "Bible Study",
            date: new Date(Date.now() + 86400000 * 7), // 7 days from now
            startDate: new Date(Date.now() + 86400000 * 7),
            time: "6:30 PM",
            location: "Fellowship Hall",
            imageUrl: "/assets/events/default-event.jpg",
          },
          {
            id: "static4",
            title: "Youth Fellowship",
            date: new Date(Date.now() + 86400000 * 6), // 6 days from now
            startDate: new Date(Date.now() + 86400000 * 6),
            time: "5:00 PM",
            location: "Youth Center",
            imageUrl: "/assets/events/default-event.jpg",
          },
        ];

        setUpcomingEvents(staticEvents);
      }
    } catch (err) {
      console.error("Error processing events:", err);
    }
  }, [events, loading]);

  const bgImage = `${API_URL}/assets/hero-bg.jpg`;

  // Church service information
  const serviceInfo = {
    sunday: {
      name: "Sunday Service",
      time: "9:30 AM",
    },
    wednesday: {
      name: "Midweek Service",
      time: "6:00 PM",
    },
    address: "Victory Bible Church - Kitwe, Off Chiwala Road, CBU East Gate",
  };

  return (
    <section ref={ref} className="relative min-h-screen overflow-hidden">
      {/* Background with enhanced gradient overlay */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center transform scale-105 transition-transform duration-[2s]"
          style={{ backgroundImage: `url('${bgImage}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-black/80" />
      </div>

      {/* Content Grid */}
      <div className="relative z-10 h-full grid grid-cols-1 lg:grid-cols-5 max-w-screen-2xl mx-auto">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-3 pt-24 lg:pt-32 p-8 lg:p-16 flex flex-col justify-start items-start">
          {/* Welcome Content */}
          <div className="max-w-2xl pt-4 space-y-8">
            <div className="flex items-center space-x-4 fade-in">
              <div className="h-0.5 w-12 bg-primary-500" />
              <span className="font-medium text-white text-lg tracking-wider">
                Welcome to Victory Bible Church
              </span>
            </div>

            <div className="space-y-2">
              <h1 className="font-display text-5xl lg:text-7xl font-bold text-white leading-tight">
                <span className="block slide-up opacity-0 animate-[slideUp_0.7s_0.3s_forwards]">
                  Sinning when alone
                </span>
                <span className="block slide-up opacity-0 animate-[slideUp_0.7s_0.5s_forwards]">
                  is easy, <span className="text-primary-400">but</span>
                </span>
                <span className="block text-primary-400 slide-up opacity-0 animate-[slideUp_0.7s_0.7s_forwards]">
                  worshipping
                </span>
                <span className="block slide-up opacity-0 animate-[slideUp_0.7s_0.9s_forwards]">
                  alone is
                </span>
                <span className="block text-primary-400 slide-up opacity-0 animate-[slideUp_0.7s_1.1s_forwards]">
                  difficult.
                </span>
              </h1>
            </div>

            <p className="text-gray-300 text-xl leading-relaxed max-w-xl opacity-0 animate-[fadeIn_1s_1.3s_forwards]">
              Join our vibrant community where faith grows stronger through
              fellowship, worship, and service to others.
            </p>

            {/* Service Times Card - New Addition */}
            <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4 border border-white/10 opacity-0 animate-[fadeIn_1s_1.4s_forwards]">
              <div className="flex items-center space-x-2 mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-primary-400"
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
                <h3 className="text-white font-medium">Service Times</h3>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-white text-sm">
                    {serviceInfo.sunday.name}
                  </p>
                  <p className="text-primary-300 font-medium">
                    {serviceInfo.sunday.time}
                  </p>
                </div>
                <div>
                  <p className="text-white text-sm">
                    {serviceInfo.wednesday.name}
                  </p>
                  <p className="text-primary-300 font-medium">
                    {serviceInfo.wednesday.time}
                  </p>
                </div>
              </div>
              <div className="mt-2 pt-2 border-t border-white/10">
                <div className="flex items-center space-x-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-primary-400"
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
                  <p className="text-white text-sm">{serviceInfo.address}</p>
                </div>
                <Link
                  to="/contact"
                  className="text-primary-300 text-sm mt-1 hover:text-primary-200 flex items-center"
                >
                  Get Directions
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 ml-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </Link>
              </div>
            </div>

            <div className="flex flex-wrap gap-6 opacity-0 animate-[fadeIn_1s_1.5s_forwards]">
              <Link to="/membership" className="btn btn-primary group">
                GET CONNECTED
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 ml-2 transform group-hover:translate-x-1 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </Link>

              <Link to="/about" className="btn btn-outline text-white border-2">
                LEARN MORE
              </Link>

              {/* New Button for "I'm New Here" */}
              <Link
                to="/about/visitors"
                className="btn bg-secondary hover:bg-secondary-600 text-white"
              >
                I'M NEW HERE
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 ml-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column - Events Section */}
        <div className="lg:col-span-2 relative h-full">
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-black/95 lg:bg-gradient-to-r lg:from-black/95 lg:to-black/80" />

          <div className="relative z-10 p-8 lg:p-16 h-full flex flex-col opacity-0 animate-[fadeIn_1s_1.7s_forwards]">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4 pt-10">
                <div className="flex items-center space-x-4">
                  <div className="h-0.5 w-12 bg-primary-500" />
                  <span className="font-medium text-white text-lg tracking-wider">
                    Upcoming Events
                  </span>
                </div>

                <Link
                  to="/events"
                  className="text-white hover:text-primary-400 text-sm flex items-center group"
                >
                  View All
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 ml-1 transform group-hover:translate-x-1 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </div>
            </div>

            <div className="flex-grow">
              {loading ? (
                <div className="card bg-white/5 backdrop-blur-sm border border-white/10 p-6">
                  <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-white/20 rounded w-3/4" />
                    <div className="h-4 bg-white/20 rounded w-1/2" />
                    <div className="h-4 bg-white/20 rounded w-2/3" />
                  </div>
                </div>
              ) : error ? (
                <div className="card bg-white/5 backdrop-blur-sm border border-white/10 p-6">
                  <p className="text-red-400">{error}</p>
                  <button
                    onClick={() => refetchEvents()}
                    className="text-sm text-primary-400 hover:text-primary-300 mt-2"
                  >
                    Try again
                  </button>
                </div>
              ) : upcomingEvents.length > 0 ? (
                <div className="space-y-3 mb-4 pr-1">
                  {upcomingEvents.map((event) => (
                    <EventCard key={event.id} event={event} highlight compact />
                  ))}
                </div>
              ) : (
                <div className="card bg-white/5 backdrop-blur-sm border border-white/10 p-4 mb-4 h-24 flex items-center justify-center">
                  <div>
                    <p className="text-gray-300 text-center">
                      No upcoming events scheduled.
                    </p>
                    <p className="text-gray-400 text-sm mt-1 text-center">
                      Check back soon for new events!
                    </p>
                  </div>
                </div>
              )}

              {/* Quick Info Links */}
              <div
                className={`${upcomingEvents.length > 0 ? "mt-3 space-y-2" : "mt-6 space-y-3"}`}
              >
                {upcomingEvents.length > 0 ? (
                  // More compact layout for when we have events
                  <div className="flex justify-between gap-2">
                    <Link
                      to="/events"
                      className="flex-1 card bg-white/5 backdrop-blur-sm border border-white/10 p-3 hover:bg-white/10 transition-colors flex items-center"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-primary-400 mr-2 flex-shrink-0"
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
                      <span className="text-white text-xs truncate">
                        Sunday: 10:00AM & 6:00PM
                      </span>
                    </Link>

                    <Link
                      to="/media/sermons"
                      className="flex-1 card bg-white/5 backdrop-blur-sm border border-white/10 p-3 hover:bg-white/10 transition-colors flex items-center"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-primary-400 mr-2 flex-shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                      <span className="text-white text-xs truncate">
                        Latest Sermons
                      </span>
                    </Link>
                  </div>
                ) : (
                  // Original layout for when we don't have events
                  <>
                    <Link
                      to="/events"
                      className="block card bg-white/5 backdrop-blur-sm border border-white/10 p-4 hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-primary-400 mr-3"
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
                        <span className="text-white text-sm">
                          Sunday Service: 10:00 AM & 6:00 PM
                        </span>
                      </div>
                    </Link>

                    <Link
                      to="/media/sermons"
                      className="block card bg-white/5 backdrop-blur-sm border border-white/10 p-4 hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-primary-400 mr-3"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                        <span className="text-white text-sm">
                          Latest Sermons
                        </span>
                      </div>
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* Additional Event Information */}
            <div className="mt-auto pt-6">
              <Link
                to="/events"
                className="flex items-center text-gray-300 hover:text-white transition-colors group"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-primary-500 mr-2"
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
                <span className="text-sm group-hover:translate-x-1 transition-transform">
                  View our service schedule & regular activities
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20
                  hidden lg:flex flex-col items-center animate-bounce cursor-pointer
                  opacity-0 animate-[fadeIn_1s_2s_forwards]"
        onClick={() => {
          window.scrollTo({
            top: window.innerHeight,
            behavior: "smooth",
          });
        }}
      >
        <span className="text-white/60 text-sm font-light tracking-wider mb-2">
          SCROLL DOWN
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-white/60"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>
    </section>
  );
});

export default HeroSection;
