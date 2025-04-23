import React from "react";
import config from "../../config";
import FallbackImage from "../../assets/fallback-image.png"; // Import fallback image

// API base URL for image paths
const API_URL = config.API_URL;

const EventCard = ({ event, highlight, compact = false }) => {
  // Get image URL with fallback
  const getImageUrl = (event) => {
    if (!event?.imageUrl && !event?.image) return FallbackImage;

    if (event.imageUrl) {
      // Add console log to debug image URL
      console.log("Event image URL:", event.imageUrl);

      // Handle API uploaded images
      if (event.imageUrl.startsWith("http")) {
        return event.imageUrl;
      } else if (event.imageUrl.startsWith("/")) {
        return `${API_URL}${event.imageUrl}`;
      } else {
        // For relative paths without leading slash
        return `${API_URL}/${event.imageUrl}`;
      }
    } else if (event.image) {
      console.log("Event image object:", event.image);

      // Handle image object
      if (typeof event.image === "object") {
        if (event.image.path) {
          return event.image.path.startsWith("/")
            ? `${API_URL}${event.image.path}`
            : `${API_URL}/${event.image.path}`;
        } else if (event.image.filename) {
          return `${API_URL}/uploads/${event.image.filename}`;
        }
      }

      // Handle imported local images from the assets folder
      return event.image;
    }

    return FallbackImage;
  };

  // Get the image URL for the event
  const imageUrl = getImageUrl(event);

  // Helper function to format date and time from API data with robust parsing
  const getEventDate = (event) => {
    try {
      // Try parsing the date in different formats
      if (event?.startDate) {
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
              return new Date(`${month} ${day}, ${year}`);
            }
          }
        }
        // Try standard date parsing
        return new Date(event.startDate);
      } else if (event?.date) {
        // If it's a string like "April 30, 2025", parse it properly
        if (typeof event.date === "string" && event.date.includes(",")) {
          const parts = event.date.split(",");
          if (parts.length === 2) {
            const monthDay = parts[0].trim().split(" ");
            const year = parts[1].trim();
            if (monthDay.length === 2) {
              const month = monthDay[0];
              const day = parseInt(monthDay[1]);
              return new Date(`${month} ${day}, ${year}`);
            }
          }
        }
        // Try standard date parsing
        return new Date(event.date);
      }
    } catch (err) {
      console.error(`Error parsing date for event:`, err, event);
    }

    // Fallback to current date if parsing fails
    return new Date();
  };

  // Extract time from event with robust parsing
  const getEventTime = (event) => {
    // If event has a specific time field, use it
    if (event?.time) {
      return event.time;
    }

    // Otherwise, try to extract time from startDate
    if (event?.startDate) {
      try {
        const date = new Date(event.startDate);
        // Check if date is valid
        if (!isNaN(date.getTime())) {
          return date.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          });
        }
      } catch (err) {
        console.error(
          `Error extracting time from startDate:`,
          err,
          event.startDate
        );
      }
    }

    // Try to extract time from date field as fallback
    if (event?.date) {
      try {
        const date = new Date(event.date);
        // Check if date is valid
        if (!isNaN(date.getTime())) {
          return date.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          });
        }
      } catch (err) {
        console.error(`Error extracting time from date:`, err, event.date);
      }
    }

    return "TBA";
  };

  // Compact version for the hero section
  if (compact) {
    return (
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg overflow-hidden transition-all duration-300 hover:bg-white/10">
        {/* Compact horizontal layout */}
        <div className="flex h-24">
          {/* Optional image section - only if image is available */}
          {imageUrl && imageUrl !== FallbackImage && (
            <div className="relative w-24 overflow-hidden flex-shrink-0">
              <img
                src={imageUrl}
                alt={event?.title || "Event"}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = FallbackImage;
                  e.target.onerror = null;
                }}
              />
            </div>
          )}

          {/* Content Section */}
          <div className="p-3 flex-1 flex items-center">
            {/* Date in calendar style */}
            <div className="flex flex-col items-center justify-center w-12 h-12 mr-3 border border-white/20 rounded overflow-hidden flex-shrink-0">
              <div className="bg-primary-600 text-white text-xs uppercase font-bold w-full text-center leading-tight">
                {getEventDate(event).toLocaleString("default", {
                  month: "short",
                })}
              </div>
              <div className="text-white text-lg font-bold w-full text-center bg-black/30 flex-1 flex items-center justify-center">
                {getEventDate(event).getDate()}
              </div>
            </div>

            <div className="flex-1 overflow-hidden">
              <h3 className="font-bold text-white text-base mb-1 line-clamp-1">
                {event?.title || "Unnamed Event"}
              </h3>
              <div className="flex flex-col">
                <div className="text-xs text-gray-300 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3 mr-1 flex-shrink-0"
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
                  <span className="truncate">{getEventTime(event)}</span>
                </div>

                {event?.location && (
                  <div className="text-xs text-gray-300 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3 mr-1 flex-shrink-0"
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
                    <span className="truncate">{event.location}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Original full version
  return (
    <div
      className={`bg-white text-black rounded-lg overflow-hidden ${highlight ? "shadow-xl border-red-200" : "shadow-lg border-gray-100"} transition-all duration-300 border h-full transform hover:-translate-y-1`}
    >
      {/* Image Section */}
      <div className="relative h-40 overflow-hidden bg-gray-200">
        <img
          src={imageUrl}
          alt={event?.title || "Event"}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          onError={(e) => {
            e.target.src = FallbackImage; // Set fallback on error
            e.target.onerror = null; // Prevent infinite loop
          }}
        />
        {event?.ministry && (
          <div className="absolute top-0 right-0 bg-red-600 text-white py-1 px-3 rounded-bl-lg font-medium text-sm">
            {event.ministry}
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4">
        {/* Date in calendar style */}
        <div className="flex items-start gap-4 mb-3">
          <div className="flex flex-col items-center justify-center min-w-16 border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            <div className="bg-red-600 text-white text-xs uppercase font-bold py-1 w-full text-center">
              {getEventDate(event).toLocaleString("default", {
                month: "short",
              })}
            </div>
            <div className="text-gray-800 text-2xl font-bold py-1 w-full text-center">
              {getEventDate(event).getDate()}
            </div>
          </div>

          <div>
            <h3 className="font-bold text-xl mb-1 text-gray-800 line-clamp-2">
              {event?.title || "Unnamed Event"}
            </h3>
            <div className="text-sm text-gray-600 flex items-center gap-2">
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
              <span>{getEventTime(event)}</span>
            </div>
          </div>
        </div>

        {/* Description with line clamp */}
        <p className="text-gray-600 mb-4 line-clamp-3">
          {event?.description || "No description available."}
        </p>

        {/* Location info */}
        {event?.location && (
          <div className="flex items-center text-sm text-gray-500 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
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
          </div>
        )}

        {/* Button styled as a proper CTA */}
        <button className="flex items-center justify-center gap-1 w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 rounded-lg transition-colors mt-auto">
          LEARN MORE
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
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default EventCard;
