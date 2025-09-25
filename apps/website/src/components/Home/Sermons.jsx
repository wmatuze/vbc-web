import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useState, useCallback, useMemo, useEffect } from "react";
import config from "../../config";
import { useSermonsQuery } from "../../hooks/useSermonsQuery";
import placeholderImage from "../../assets/placeholders/default-image.svg";

// Using SVG placeholder image imported at the top

// Fallback static data in case API fails
const staticSermons = [
  {
    id: 1,
    title: "Faith That Moves Mountains",
    date: "January 21, 2025",
    image: "/images/sermon1.jpg",
    videoId: "l7fzlle9g84",
    speaker: "Pastor John Doe",
    description:
      "Discover how faith can transform your life and overcome any obstacle in your path.",
  },
  {
    id: 2,
    title: "Walking in God's Purpose",
    date: "January 14, 2025",
    image: "/images/sermon2.jpg",
    videoId: "8nOKvkVN5dI",
    speaker: "Pastor Jane Smith",
    description:
      "Learn how to identify and fulfill God's purpose for your life.",
  },
  {
    id: 3,
    title: "The Power of Prayer",
    date: "January 7, 2025",
    image: "/images/sermon3.jpg",
    videoId: "VgTVfZ3O-7A",
    speaker: "Pastor John Doe",
    description:
      "Understand the transformative power of prayer in your daily walk with Christ.",
  },
];

const Sermons = () => {
  // Use React Query for fetching sermons
  const {
    data: sermons = [],
    isLoading,
    error,
    refetch: refetchSermons,
  } = useSermonsQuery({
    onError: (err) => {
      console.error("Error fetching sermons:", err);
    },
  });

  const [selectedSermon, setSelectedSermon] = useState(null);

  // Normalize and sort sermons by date (desc)
  const sermonsToDisplay = useMemo(() => {
    const source = (error || !sermons?.length) ? staticSermons : sermons;
    return [...source].sort((a, b) => {
      const da = new Date(a.date)?.getTime() || 0;
      const db = new Date(b.date)?.getTime() || 0;
      return db - da;
    });
  }, [sermons, error]);

  // Helper function to get the correct image URL
  const getSermonImageUrl = useCallback((sermon) => {
    // Ensure we have a valid sermon object
    if (!sermon || typeof sermon !== "object") {
      if (import.meta.env.DEV) console.log("Invalid sermon object, using placeholder");
      return placeholderImage;
    }

    // For debugging
    if (import.meta.env.DEV) console.log("Processing sermon image:", sermon.title, sermon.imageUrl);

    // 1. First priority: Use YouTube thumbnail if available (most reliable)
    if (sermon.videoId) {
      const youtubeThumb = `https://img.youtube.com/vi/${sermon.videoId}/hqdefault.jpg`;
      if (import.meta.env.DEV) console.log("Using auto-generated YouTube thumbnail:", youtubeThumb);
      return youtubeThumb;
    }

    // 2. Try to get image from populated image object with path property
    if (sermon.image && typeof sermon.image === "object" && sermon.image.path) {
      const url = sermon.image.path.startsWith("/")
        ? `${config.API_URL}${sermon.image.path}`
        : sermon.image.path;
      if (import.meta.env.DEV) console.log("Using image.path:", url);
      return url;
    }

    // 3. Try to get image from imageUrl string
    if (sermon.imageUrl && typeof sermon.imageUrl === "string") {
      // Skip if it's a default image path and we have better options
      if (sermon.imageUrl.includes("default-image")) {
        if (import.meta.env.DEV) console.log("Skipping default image path, using placeholder");
        return placeholderImage;
      }

      // Handle JSON string that might have been passed
      if (sermon.imageUrl.includes('{"')) {
        try {
          const parsed = JSON.parse(sermon.imageUrl);
          if (parsed && parsed.path) {
            const url = parsed.path.startsWith("/")
              ? `${config.API_URL}${parsed.path}`
              : parsed.path;
            if (import.meta.env.DEV) console.log("Using parsed imageUrl path:", url);
            return url;
          }
        } catch (e) {
          console.error("Failed to parse imageUrl JSON:", e);
        }
      }

      // Regular imageUrl string
      const url = sermon.imageUrl.startsWith("/")
        ? `${config.API_URL}${sermon.imageUrl}`
        : sermon.imageUrl;
      if (import.meta.env.DEV) console.log("Using regular imageUrl:", url);
      return url;
    }

    // 4. Try to get image from direct image string (static data)
    if (sermon.image && typeof sermon.image === "string") {
      const url = sermon.image.startsWith("/")
        ? `${config.API_URL}${sermon.image}`
        : sermon.image;
      if (import.meta.env.DEV) console.log("Using sermon.image string:", url);
      return url;
    }

    // If no image is found, return the imported placeholder
    if (import.meta.env.DEV) console.log("No image found, using placeholder");
    return placeholderImage;
  }, []);

  // Helper function to format dates
  const formatSermonDate = (dateString) => {
    if (!dateString) return "";
    try {
      // If it's an object, try to convert it to a string
      if (typeof dateString === "object" && !(dateString instanceof Date)) {
        console.warn(
          "Sermon date is an object but not a Date instance:",
          dateString
        );
        // Try to extract date from the object if possible
        if (dateString.toString) {
          dateString = dateString.toString();
        } else {
          // Set a default date
          return "Date unavailable";
        }
      }

      // Check if it's an ISO date string
      if (typeof dateString === "string" && dateString.includes("T")) {
        const date = new Date(dateString);
        if (!isNaN(date.getTime())) {
          return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          });
        }
      }

      // If it's a Date object
      if (dateString instanceof Date) {
        if (!isNaN(dateString.getTime())) {
          return dateString.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          });
        }
      }

      // Otherwise return as is (already formatted)
      return dateString;
    } catch (err) {
      console.error("Error formatting date:", err);
      return "Date unavailable";
    }
  };

  // Log sermon data when it changes
  if (sermons && sermons.length > 0) {
    if (import.meta.env.DEV) console.log("API Sermon Data:", sermons);

    // Debug: Check for objects that might be incorrectly rendered
    sermons.forEach((sermon) => {
      if (sermon.description && typeof sermon.description === "object") {
        console.warn(
          "Found object description that might cause rendering issues:",
          sermon.description
        );
      }
      if (sermon.imageUrl && typeof sermon.imageUrl === "object") {
        console.warn(
          "Found object imageUrl that might cause rendering issues:",
          sermon.imageUrl
        );
      }
    });
  }

  // Loading state (only show spinner if we have nothing at all to show yet)
  if (isLoading && !sermons?.length) {
    return (
      <section className="py-20 px-6 bg-gray-50" aria-busy="true" aria-live="polite">
        <div className="container mx-auto flex justify-center items-center min-h-[300px]">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent" role="progressbar" aria-label="Loading sermons"></div>
        </div>
      </section>
    );
  }

  if (!sermonsToDisplay.length) {
    return (
      <section className="py-20 px-6 bg-gray-50">
        <div className="container mx-auto">
          <p className="text-gray-700">No sermons available right now.</p>
        </div>
      </section>
    );
  }

  const latestSermon = sermonsToDisplay[0];

  // Debug: Log the actual sermon data to see what fields are available
  if (import.meta.env.DEV && latestSermon) {
    console.log("Latest sermon data:", latestSermon);
    console.log("Description value:", latestSermon.description);
    console.log("Series value:", latestSermon.series);
    console.log("Tags value:", latestSermon.tags);
    console.log("Duration value:", latestSermon.duration);
  }

  return (
    <section className="py-20 px-6 bg-gray-50">
      <div className="container mx-auto">
        {error && (
          <div className="mb-6 rounded-lg bg-red-50 border border-red-200 p-4 text-red-700 flex items-center justify-between">
            <span>We couldn't load the latest sermons. Showing a backup list.</span>
            <button onClick={refetchSermons} className="btn btn-sm btn-outline border-red-300 text-red-700 hover:bg-red-100">
              Retry
            </button>
          </div>
        )}

        <div className="flex flex-col md:flex-row items-center justify-between mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex items-center"
          >
            <div className="w-12 h-1 bg-primary-500 mr-4"></div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
              Latest Message
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Link
              to="/sermons"
              className="text-primary-600 hover:text-primary-700 flex items-center group mt-4 md:mt-0"
            >
              View All Sermons
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 ml-1 transform group-hover:translate-x-1 transition-transform"
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
          </motion.div>
        </div>

        {/* Featured Latest Sermon */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="grid md:grid-cols-5 gap-0">
              {/* Video Thumbnail */}
              <button
                type="button"
                className="md:col-span-3 relative group h-64 md:h-auto text-left"
                onClick={() => setSelectedSermon(latestSermon)}
                aria-label={`Watch ${latestSermon.title}`}
              >
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-primary-500 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-10 w-10 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </div>
                <img
                  src={getSermonImageUrl(latestSermon)}
                  alt={latestSermon.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    if (import.meta.env.DEV) console.error(`Failed to load featured sermon image`);
                    // First try YouTube thumbnail if available
                    if (
                      latestSermon.videoId &&
                      !e.target.src.includes(latestSermon.videoId)
                    ) {
                      if (import.meta.env.DEV) console.log(
                        "Fallback to direct YouTube thumbnail for featured sermon"
                      );
                      e.target.src = `https://img.youtube.com/vi/${latestSermon.videoId}/hqdefault.jpg`;
                    } else {
                      // Otherwise use placeholder image
                      e.target.src = placeholderImage;
                    }
                  }}
                  loading="eager"
                  decoding="async"
                />
                <span className="absolute top-4 left-4 bg-primary-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Latest
                </span>
              </button>

              {/* Sermon Info */}
              <div className="md:col-span-2 p-6 md:p-8 flex flex-col">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    {latestSermon.title}
                  </h3>
                  <p className="text-primary-600 font-medium mb-1">
                    {latestSermon.speaker || "Guest Speaker"}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <p className="text-gray-500">
                      {formatSermonDate(latestSermon.date)}
                    </p>
                    {latestSermon.duration && (
                      <>
                        <span className="text-gray-300">•</span>
                        <p className="text-gray-500">{latestSermon.duration}</p>
                      </>
                    )}
                    {latestSermon.series && (
                      <>
                        <span className="text-gray-300">•</span>
                        <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full">
                          {latestSermon.series}
                        </span>
                      </>
                    )}
                  </div>
                  {latestSermon.description && latestSermon.description.trim() !== "" ? (
                    <p className="text-gray-700 mb-4 leading-relaxed">
                      {typeof latestSermon.description === "string"
                        ? latestSermon.description.length > 280
                          ? latestSermon.description.substring(0, 280) + "..."
                          : latestSermon.description
                        : typeof latestSermon.description === "object"
                          ? "View sermon details"
                          : ""}
                    </p>
                  ) : (
                    <p className="text-gray-500 mb-4 italic">
                      Click to watch this powerful message.
                    </p>
                  )}
                  {latestSermon.tags && Array.isArray(latestSermon.tags) && latestSermon.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {latestSermon.tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setSelectedSermon(latestSermon)}
                    className="btn btn-primary flex items-center"
                  >
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
                        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Watch Now
                  </button>
                  <Link
                    to={`/media/sermons?video=${latestSermon.videoId}`}
                    className="btn btn-outline text-primary-600 border-primary-600 hover:bg-primary-50"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Recent Sermons Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {sermonsToDisplay.slice(1, 4).map((sermon, index) => (
            <motion.div
              key={sermon.id || index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white shadow-lg rounded-xl overflow-hidden group hover:shadow-xl transition-shadow"
            >
              <button
                type="button"
                className="relative block text-left"
                onClick={() => setSelectedSermon(sermon)}
                aria-label={`Watch ${sermon.title}`}
              >
                <img
                  src={getSermonImageUrl(sermon)}
                  alt={sermon.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    if (import.meta.env.DEV) console.error(
                      `Failed to load recent sermon image for ${sermon.title}`
                    );
                    // First try YouTube thumbnail if available
                    if (
                      sermon.videoId &&
                      !e.target.src.includes(sermon.videoId)
                    ) {
                      if (import.meta.env.DEV) console.log(
                        "Fallback to direct YouTube thumbnail for recent sermon"
                      );
                      e.target.src = `https://img.youtube.com/vi/${sermon.videoId}/hqdefault.jpg`;
                    } else {
                      // Otherwise use placeholder image
                      e.target.src = placeholderImage;
                    }
                  }}
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-primary-500 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </div>
              </button>
              <div className="p-5">
                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                  {sermon.title}
                </h3>
                <p className="text-primary-600 text-sm mb-1">
                  {sermon.speaker || "Guest Speaker"}
                </p>
                <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 mb-3">
                  <span>{formatSermonDate(sermon.date)}</span>
                  {sermon.duration && (
                    <>
                      <span className="text-gray-300">•</span>
                      <span>{sermon.duration}</span>
                    </>
                  )}
                  {sermon.series && (
                    <>
                      <span className="text-gray-300">•</span>
                      <span className="bg-primary-100 text-primary-700 px-2 py-1 rounded-full">
                        {sermon.series}
                      </span>
                    </>
                  )}
                </div>
                {sermon.description && sermon.description.trim() !== "" ? (
                  <p className="text-gray-600 text-sm mb-3 leading-relaxed">
                    {typeof sermon.description === "string"
                      ? sermon.description.length > 100
                        ? sermon.description.substring(0, 100) + "..."
                        : sermon.description
                      : "View sermon details"}
                  </p>
                ) : (
                  <p className="text-gray-400 text-sm mb-3 italic">
                    Watch this inspiring message
                  </p>
                )}
                <Link
                  to={`/media/sermons?video=${sermon.videoId}`}
                  className="text-primary-600 hover:text-primary-700 text-sm flex items-center group"
                >
                  Watch Sermon
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
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Video Modal */}
        {selectedSermon && (
          <VideoModal sermon={selectedSermon} onClose={() => setSelectedSermon(null)} />
        )}
      </div>
    </section>
  );
};

function VideoModal({ sermon, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`Watch ${sermon.title}`}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full lg:w-3/4 lg:mx-auto">
        <button 
          onClick={onClose} 
          className="absolute -top-12 right-0 text-white hover:text-primary-400" 
          aria-label="Close video"
        >
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
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <div className="relative pt-[56.25%]">
          <iframe
            src={`https://www.youtube.com/embed/${sermon.videoId}?autoplay=1&rel=0&modestbranding=1`}
            title={sermon.title}
            className="absolute top-0 left-0 w-full h-full"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
      </div>
    </div>
  );
}

export default Sermons;
