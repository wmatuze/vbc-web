import { Link } from "react-router-dom";
import { forwardRef, useState, useEffect, useMemo } from "react";
import { useEventsQuery } from "../../hooks/useEventsQuery";
import EventCard from "../ChurchCalendar/EventsCard";

// API URL for dynamic uploads from the backend
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// Skeleton loader component for events
const SkeletonLoader = () => (
  <div className="card bg-white/5 backdrop-blur-sm border border-white/10 p-6">
    <div className="animate-pulse space-y-4">
      <div className="h-4 bg-white/20 rounded w-3/4" />
      <div className="h-4 bg-white/20 rounded w-1/2" />
      <div className="h-4 bg-white/20 rounded w-2/3" />
    </div>
  </div>
);

// Error card component for failed API calls
const ErrorCard = ({ error, onRetry }) => (
  <div className="card bg-white/5 backdrop-blur-sm border border-red-500/20 p-6">
    <div className="flex items-center space-x-2 mb-2">
      <svg
        className="h-5 w-5 text-red-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <p className="text-red-400 text-sm">Failed to load events</p>
    </div>
    <p className="text-red-300 text-xs mb-3">
      {error?.message || error?.toString() || "An error occurred"}
    </p>
    <button
      onClick={onRetry}
      className="text-sm text-primary-400 hover:text-primary-300 flex items-center space-x-1"
    >
      <svg
        className="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
        />
      </svg>
      <span>Try again</span>
    </button>
  </div>
);

// Empty state component for when no events are available
const EmptyState = ({ message }) => (
  <div className="card bg-white/5 backdrop-blur-sm border border-white/10 p-6 mb-4 h-32 flex items-center justify-center w-full">
    <div className="text-center">
      <svg
        className="h-8 w-8 text-gray-400 mx-auto mb-2"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2z"
        />
      </svg>
      <p className="text-gray-300 text-lg">{message}</p>
      <p className="text-gray-400 text-sm mt-2">
        Check back soon for new events!
      </p>
    </div>
  </div>
);

const HeroSection = forwardRef((props, ref) => {
  // Use React Query for fetching events
  const {
    data: events = [],
    isLoading: loading,
    error,
    refetch: refetchEvents,
  } = useEventsQuery();

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Helper function to parse event dates consistently
  const parseEventDate = (event) => {
    try {
      const rawDate = event?.startDate || event?.date;
      if (!rawDate) throw new Error("No date field");

      // If it's already a Date object
      if (rawDate instanceof Date) return rawDate;

      // Parse string to Date
      const parsed = new Date(rawDate);
      if (!isNaN(parsed.getTime())) return parsed;

      // Extra: Handle "April 30, 2025" format
      const parsedFallback = Date.parse(rawDate);
      if (!isNaN(parsedFallback)) return new Date(parsedFallback);

      console.warn(`Could not parse a valid date for event: ${event?.title}`);
      return new Date();
    } catch (err) {
      console.error("Error parsing date for event:", err, event);
      return new Date();
    }
  };

  // Memoized upcoming events processing for better performance
  const upcomingEvents = useMemo(() => {
    if (loading) return [];

    if (!events?.length) {
      // Fallback static events when no events are available
      return [
        {
          id: "static1",
          title: "Sunday Worship Service",
          date: new Date(Date.now() + 86400000 * 3), // 3 days from now
          startDate: new Date(Date.now() + 86400000 * 3),
          time: "10:00 AM",
          location: "Main Sanctuary",
          imageUrl: "/assets/placeholders/default-event.svg",
        },
        {
          id: "static2",
          title: "Prayer Meeting",
          date: new Date(Date.now() + 86400000 * 5), // 5 days from now
          startDate: new Date(Date.now() + 86400000 * 5),
          time: "7:00 PM",
          location: "Prayer Room",
          imageUrl: "/assets/placeholders/default-event.svg",
        },
        {
          id: "static3",
          title: "Bible Study",
          date: new Date(Date.now() + 86400000 * 7), // 7 days from now
          startDate: new Date(Date.now() + 86400000 * 7),
          time: "6:30 PM",
          location: "Fellowship Hall",
          imageUrl: "/assets/placeholders/default-event.svg",
        },
        {
          id: "static4",
          title: "Youth Fellowship",
          date: new Date(Date.now() + 86400000 * 6), // 6 days from now
          startDate: new Date(Date.now() + 86400000 * 6),
          time: "5:00 PM",
          location: "Youth Center",
          imageUrl: "/assets/placeholders/default-event.svg",
        },
      ];
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return events
      .map((e) => ({ ...e, parsedDate: parseEventDate(e) }))
      .filter((e) => e.parsedDate >= today)
      .sort((a, b) => a.parsedDate - b.parsedDate)
      .slice(0, 4);
  }, [events, loading]);

  // Serve hero-bg.jpg directly from public/assets (no backend dependency)
  const bgImage = `/assets/hero-bg.jpg`;

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
    monthly: [
      {
        name: "Anointing Service",
        schedule: "First Sunday",
        time: "9:30 AM",
      },
      {
        name: "Holy Communion",
        schedule: "Third Sunday",
        time: "9:30 AM",
      },
      {
        name: "Prayer & Fasting",
        schedule: "Last Week",
        time: "Various Times",
      },
    ],
    address: "Victory Bible Church - Kitwe, Off Chiwala Road, CBU East Gate",
  };

  return (
    <section ref={ref} className="relative min-h-screen overflow-hidden">
      {/* Background with enhanced gradient overlay */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center transform scale-105 motion-safe:transition-transform motion-safe:duration-[2s]"
          style={{
            backgroundImage: `url('${bgImage}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
          role="img"
          aria-label="Victory Bible Church background"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-black/80" />
      </div>

      {/* Content Grid */}
      <div className="relative z-10 h-full grid grid-cols-1 lg:grid-cols-12 max-w-screen-3xl mx-auto lg:min-h-screen">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-7 xl:col-span-7 2xl:col-span-7 pt-24 lg:pt-32 p-8 lg:p-16 flex flex-col justify-start items-start h-full">
          {/* Welcome Content */}
          <div className="max-w-3xl mx-auto lg:mx-0 pt-10 space-y-8">
            <div className="flex items-center space-x-4 fade-in">
              <div className="h-0.5 w-12 bg-primary-500" />
              <span className="font-medium text-white text-base tracking-wider">
                Welcome to Victory Bible Church
              </span>
            </div>

            <div className="space-y-2">
              <h1 className="font-display text-5xl lg:text-6xl font-bold text-white leading-tight">
                <span className="block slide-up opacity-0 motion-safe:animate-[slideUp_0.7s_0.3s_forwards] motion-reduce:opacity-100">
                  Sinning when alone
                </span>
                <span className="block slide-up opacity-0 motion-safe:animate-[slideUp_0.7s_0.5s_forwards] motion-reduce:opacity-100">
                  is easy, <span className="text-primary-400">but</span>
                </span>
                <span className="block text-primary-400 slide-up opacity-0 motion-safe:animate-[slideUp_0.7s_0.7s_forwards] motion-reduce:opacity-100">
                  worshipping
                </span>
                <span className="block slide-up opacity-0 motion-safe:animate-[slideUp_0.7s_0.9s_forwards] motion-reduce:opacity-100">
                  alone is
                </span>
                <span className="block text-primary-400 slide-up opacity-0 motion-safe:animate-[slideUp_0.7s_1.1s_forwards] motion-reduce:opacity-100">
                  difficult.
                </span>
              </h1>
            </div>

            <p className="text-gray-300 text-xl leading-relaxed max-w-xl lg:max-w-2xl opacity-0 motion-safe:animate-[fadeIn_1s_1.3s_forwards] motion-reduce:opacity-100">
              Join our vibrant community where faith grows stronger through
              fellowship, worship, and service to others.
            </p>

            {/* Service Times Card - Enhanced with Monthly Programs */}
            <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4 border border-white/10 opacity-0 motion-safe:animate-[fadeIn_1s_1.4s_forwards] motion-reduce:opacity-100 lg:max-w-lg xl:max-w-xl">
              <div className="flex items-center space-x-2 mb-3">
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

              {/* Weekly Services */}
              <div className="grid grid-cols-2 gap-2 mb-3">
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

              {/* Monthly Special Services - Condensed Version */}
              <div className="mt-2 pt-2 border-t border-white/10 mb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-yellow-400"
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
                    <h3 className="text-white text-sm font-medium">
                      Monthly Programs
                    </h3>
                  </div>
                  <Link
                    to="#monthly-programs"
                    className="text-yellow-400 text-xs hover:text-yellow-300"
                    onClick={(e) => {
                      e.preventDefault();
                      const element =
                        document.getElementById("monthly-programs");
                      if (element) {
                        element.scrollIntoView({
                          behavior: "smooth",
                        });
                      }
                    }}
                  >
                    See All
                  </Link>
                </div>

                {/* Compact horizontal layout for monthly programs */}
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                  {serviceInfo.monthly.map((program, index) => (
                    <div key={index} className="flex items-center">
                      <span className="inline-block h-2 w-2 rounded-full bg-yellow-400 mr-1.5"></span>
                      <span className="text-white text-xs">{program.name}</span>
                      <span className="text-yellow-400 text-xs mx-1">•</span>
                      <span className="text-primary-300 text-xs">
                        {program.schedule}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Church Address */}
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

            <div className="flex flex-wrap gap-6 opacity-0 motion-safe:animate-[fadeIn_1s_1.5s_forwards] motion-reduce:opacity-100">
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
                to="/about"
                className="btn bg-secondary-500 hover:bg-secondary-600 text-white"
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
        <div className="lg:col-span-5 xl:col-span-5 2xl:col-span-5 relative h-full">
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-black/95 lg:bg-gradient-to-r lg:from-black/95 lg:to-black/80 h-full" />

          <div className="relative z-10 pt-24 lg:pt-32 p-8 lg:p-16 h-full flex flex-col opacity-0 motion-safe:animate-[fadeIn_1s_1.7s_forwards] motion-reduce:opacity-100 w-full">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4 pt-10">
                <div className="flex items-center space-x-4">
                  <div className="h-0.5 w-12 bg-primary-500" />
                  <span className="font-medium text-white text-base tracking-wider">
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
                <SkeletonLoader />
              ) : error ? (
                <ErrorCard error={error} onRetry={refetchEvents} />
              ) : upcomingEvents.length > 0 ? (
                <div className="space-y-4 mb-4 pr-1 w-full">
                  {upcomingEvents.map((event) => (
                    <EventCard key={event.id} event={event} highlight compact />
                  ))}
                </div>
              ) : (
                <EmptyState message="No upcoming events scheduled." />
              )}

              {/* Quick Info Links */}
              <div
                className={`${upcomingEvents.length > 0 ? "mt-3 space-y-2" : "mt-6 space-y-3"}`}
              >
                {upcomingEvents.length > 0 ? (
                  // More compact layout for when we have events
                  <div className="flex justify-between gap-4 w-full">
                    <Link
                      to="/events"
                      className="flex-1 card bg-white/5 backdrop-blur-sm border border-white/10 p-4 hover:bg-white/10 transition-colors flex items-center"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-primary-400 mr-3 flex-shrink-0"
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
                      <span className="text-white text-sm truncate">
                        Sunday: 10:00AM & 6:00PM
                      </span>
                    </Link>

                    <Link
                      to="/sermons"
                      className="flex-1 card bg-white/5 backdrop-blur-sm border border-white/10 p-4 hover:bg-white/10 transition-colors flex items-center"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-primary-400 mr-3 flex-shrink-0"
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
                      <span className="text-white text-sm truncate">
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
                      to="/sermons"
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
            <div className="mt-auto pt-8">
              <Link
                to="/events"
                className="flex items-center text-gray-300 hover:text-white transition-colors group w-full bg-white/5 backdrop-blur-sm border border-white/10 p-4 rounded-lg hover:bg-white/10"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-primary-500 mr-3"
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
                  hidden lg:flex flex-col items-center motion-safe:animate-bounce cursor-pointer
                  opacity-0 motion-safe:animate-[fadeIn_1s_2s_forwards] motion-reduce:opacity-100 3xl:bottom-12"
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
