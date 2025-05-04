import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useState } from "react";
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

  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  // Helper function to get the correct image URL
  const getSermonImageUrl = (sermon) => {
    // Ensure we have a valid sermon object
    if (!sermon || typeof sermon !== "object") {
      console.log("Invalid sermon object, using placeholder");
      return placeholderImage;
    }

    // For debugging
    console.log("Processing sermon image:", sermon.title, sermon.imageUrl);

    // 1. First priority: Use YouTube thumbnail if available (most reliable)
    if (sermon.videoId) {
      const youtubeThumb = `https://img.youtube.com/vi/${sermon.videoId}/hqdefault.jpg`;
      console.log("Using auto-generated YouTube thumbnail:", youtubeThumb);
      return youtubeThumb;
    }

    // 2. Try to get image from populated image object with path property
    if (sermon.image && typeof sermon.image === "object" && sermon.image.path) {
      const url = sermon.image.path.startsWith("/")
        ? `${config.API_URL}${sermon.image.path}`
        : sermon.image.path;
      console.log("Using image.path:", url);
      return url;
    }
    
    // 3. Try to get image from imageUrl string
    if (sermon.imageUrl && typeof sermon.imageUrl === "string") {
      // Skip if it's a default image path and we have better options
      if (sermon.imageUrl.includes('default-image')) {
        console.log("Skipping default image path, using sermon thumbnail");
        return "/assets/sermons/default-sermon.jpg";
      }
      
      // Handle JSON string that might have been passed
      if (sermon.imageUrl.includes('{"')) {
        try {
          const parsed = JSON.parse(sermon.imageUrl);
          if (parsed && parsed.path) {
            const url = parsed.path.startsWith("/")
              ? `${config.API_URL}${parsed.path}`
              : parsed.path;
            console.log("Using parsed imageUrl path:", url);
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
      console.log("Using regular imageUrl:", url);
      return url;
    }
    
    // 4. Try to get image from direct image string (static data)
    if (sermon.image && typeof sermon.image === "string") {
      const url = sermon.image.startsWith("/")
        ? `${config.API_URL}${sermon.image}`
        : sermon.image;
      console.log("Using sermon.image string:", url);
      return url;
    }

    // If no image is found, return a sermon-specific placeholder
    console.log("No image found, using sermon thumbnail placeholder");
    return "/assets/sermons/default-sermon.jpg";
  };

  // Helper function to format dates
  const formatSermonDate = (dateString) => {
    if (!dateString) return "";
    try {
      // Check if it's an ISO date string
      if (typeof dateString === "string" && dateString.includes("T")) {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      }
      // Otherwise return as is (already formatted)
      return dateString;
    } catch (err) {
      console.error("Error formatting date:", err);
      return dateString;
    }
  };

  // Log sermon data when it changes
  if (sermons && sermons.length > 0) {
    console.log("API Sermon Data:", sermons);

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

  if (isLoading) {
    return (
      <section className="py-20 px-6 bg-gray-50">
        <div className="container mx-auto flex justify-center items-center min-h-[300px]">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
        </div>
      </section>
    );
  }

  if (error || (!isLoading && (!sermons || sermons.length === 0))) {
    // If there's an error or no sermons, use static data
    const staticData = staticSermons;
    return (
      <section className="py-20 px-6 bg-gray-50">
        <div className="container mx-auto">
          <div className="flex items-center mb-12">
            <div className="w-12 h-1 bg-primary-500 mr-4"></div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
              Latest Message
            </h2>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-lg">
            <p className="text-gray-700">
              {error
                ? "Failed to load sermons from API, using static data"
                : "No sermons available at the moment. Please check back later."}
            </p>
          </div>
        </div>
      </section>
    );
  }

  // If we have an error but we're showing static data, log it
  let sermonsToDisplay = sermons;
  if (error && sermons.length === 0) {
    console.log("Using static sermon data due to API error");
    sermonsToDisplay = staticSermons;
  }

  const latestSermon = sermonsToDisplay[0];

  return (
    <section className="py-20 px-6 bg-gray-50">
      <div className="container mx-auto">
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
              to="/media/sermons"
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
              <div
                className="md:col-span-3 relative group cursor-pointer h-64 md:h-auto"
                onClick={() => setIsVideoModalOpen(true)}
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
                    console.error(`Failed to load featured sermon image`);
                    // First try YouTube thumbnail if available
                    if (latestSermon.videoId && !e.target.src.includes(latestSermon.videoId)) {
                      console.log("Fallback to direct YouTube thumbnail for featured sermon");
                      e.target.src = `https://img.youtube.com/vi/${latestSermon.videoId}/hqdefault.jpg`;
                    } else {
                      // Otherwise use default sermon image
                      e.target.src = "/assets/sermons/default-sermon.jpg";
                    }
                  }}
                  loading="eager"
                />
                <div className="absolute top-4 left-4 bg-primary-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Latest
                </div>
              </div>

              {/* Sermon Info */}
              <div className="md:col-span-2 p-6 md:p-8 flex flex-col">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    {latestSermon.title}
                  </h3>
                  <p className="text-primary-600 font-medium mb-1">
                    {latestSermon.speaker}
                  </p>
                  <p className="text-gray-500 mb-4">
                    {formatSermonDate(latestSermon.date)}
                  </p>
                  <p className="text-gray-600 mb-6">
                    {typeof latestSermon.description === "string"
                      ? latestSermon.description
                      : typeof latestSermon.description === "object"
                        ? "View sermon details"
                        : "No description available"}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setIsVideoModalOpen(true)}
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
                    to={`/media/sermons`}
                    className="btn btn-outline text-primary-600 border-primary-600 hover:bg-primary-50"
                  >
                    See All Messages
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
              <div className="relative">
                <img
                  src={getSermonImageUrl(sermon)}
                  alt={sermon.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    console.error(`Failed to load recent sermon image for ${sermon.title}`);
                    // First try YouTube thumbnail if available
                    if (sermon.videoId && !e.target.src.includes(sermon.videoId)) {
                      console.log("Fallback to direct YouTube thumbnail for recent sermon");
                      e.target.src = `https://img.youtube.com/vi/${sermon.videoId}/hqdefault.jpg`;
                    } else {
                      // Otherwise use default sermon image
                      e.target.src = "/assets/sermons/default-sermon.jpg";
                    }
                  }}
                  loading="eager"
                />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Link
                    to={`/media/sermons?video=${sermon.videoId}`}
                    className="w-12 h-12 rounded-full bg-primary-500 flex items-center justify-center"
                  >
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
                  </Link>
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                  {sermon.title}
                </h3>
                <p className="text-primary-600 text-sm mb-1">
                  {sermon.speaker}
                </p>
                <p className="text-gray-500 text-sm mb-3">
                  {formatSermonDate(sermon.date)}
                </p>
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
        {isVideoModalOpen && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <div className="relative w-full lg:w-3/4 lg:mx-auto">
              <button
                onClick={() => setIsVideoModalOpen(false)}
                className="absolute -top-12 right-0 text-white hover:text-primary-400"
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
              <div className="relative pt-[56.25%] h-[50vh] md:h-[60vh] lg:h-auto">
                <iframe
                  src={`https://www.youtube.com/embed/${latestSermon.videoId}?autoplay=1&rel=0&modestbranding=1&enablejsapi=0`}
                  frameBorder="0"
                  allow="autoplay; fullscreen"
                  allowFullScreen
                  loading="eager"
                  title={latestSermon.title}
                  className="absolute top-0 left-0 w-full h-full"
                  onLoad={() => console.log("Video modal iframe loaded successfully")}
                ></iframe>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Sermons;
