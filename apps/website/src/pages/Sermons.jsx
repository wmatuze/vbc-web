import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet"; // Added Helmet for SEO
import config from "../config"; // Import centralized config
import { useSermonsQuery } from "../hooks/useSermonsQuery";
import placeholderImage from "../assets/placeholders/default-image.svg";

const API_URL = config.API_URL;

// Function to check if YouTube is accessible
const checkYouTubeConnectivity = async () => {
  try {
    // Try to fetch a YouTube image resource instead of favicon 
    // (more reliable and less likely to be cached)
    const response = await fetch("https://i.ytimg.com/vi/default/default.jpg", {
      mode: "no-cors",
      cache: "no-store",
      method: "HEAD",
      timeout: 3000
    });
    
    console.log("YouTube connectivity check successful");
    return true;
  } catch (error) {
    console.error("YouTube connectivity check failed:", error);
    return false;
  }
};

// Function to validate YouTube video ID format
const isValidYouTubeID = (id) => {
  // Basic validation - YouTube IDs are typically 11 characters
  // and consist of letters, numbers, hyphens and underscores
  return id && typeof id === "string" && /^[a-zA-Z0-9_-]{11}$/.test(id);
};

// Static sermons data as a fallback
const staticSermons = [
  {
    id: 1,
    title: "Faith That Moves Mountains",
    date: "January 21, 2025",
    image: "/images/sermon1.jpg",
    imageUrl: "/images/sermon1.jpg",
    videoId: "l7fzlle9g84",
    speaker: "Pastor John Doe",
    description:
      "Discover how faith can transform your life and overcome any obstacle in your path.",
    duration: "45:30",
  },
  {
    id: 2,
    title: "Walking in God's Purpose",
    date: "January 14, 2025",
    image: "/images/sermon2.jpg",
    imageUrl: "/images/sermon2.jpg",
    videoId: "8nOKvkVN5dI",
    speaker: "Pastor Jane Smith",
    description:
      "Learn how to identify and fulfill God's purpose for your life.",
    duration: "38:15",
  },
  {
    id: 3,
    title: "The Power of Prayer",
    date: "January 7, 2025",
    image: "/images/sermon3.jpg",
    imageUrl: "/images/sermon3.jpg",
    videoId: "VgTVfZ3O-7A",
    speaker: "Pastor John Doe",
    description:
      "Understand the transformative power of prayer in your daily walk with Christ.",
    duration: "42:10",
  },
];

// Using SVG placeholder image imported at the top

const Sermons = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const videoIdParam = searchParams.get("video");

  // Use React Query for fetching sermons
  const {
    data: sermons = [],
    isLoading: sermonsLoading,
    error: sermonsError,
  } = useSermonsQuery();

  const [selectedSermon, setSelectedSermon] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [videoError, setVideoError] = useState(false);
  const [videoErrorMessage, setVideoErrorMessage] = useState("");
  const [playerMode, setPlayerMode] = useState("default"); // 'default', 'alternate', 'youtube'
  const [youtubeAccessible, setYoutubeAccessible] = useState(true);
  const [loadingTimeout, setLoadingTimeout] = useState(null);

  // Helper function to get the correct image URL
  const getSermonImageUrl = (sermon) => {
    // Ensure we have a valid sermon object
    if (!sermon || typeof sermon !== "object") {
      console.log("Invalid sermon object, using placeholder");
      return placeholderImage;
    }

    // For debugging
    console.log("Processing sermon image:", sermon.title, sermon.imageUrl);

    // 1. Try to get image from populated image object with path property
    if (sermon.image && typeof sermon.image === "object" && sermon.image.path) {
      const url = sermon.image.path.startsWith("/")
        ? `${API_URL}${sermon.image.path}`
        : sermon.image.path;
      console.log("Using image.path:", url);
      return url;
    }
    
    // 2. Try to get image from imageUrl string
    if (sermon.imageUrl && typeof sermon.imageUrl === "string") {
      // Handle JSON string that might have been passed
      if (sermon.imageUrl.includes('{"')) {
        try {
          const parsed = JSON.parse(sermon.imageUrl);
          if (parsed && parsed.path) {
            const url = parsed.path.startsWith("/")
              ? `${API_URL}${parsed.path}`
              : parsed.path;
            console.log("Using parsed imageUrl path:", url);
            return url;
          }
        } catch (e) {
          console.error("Failed to parse imageUrl JSON:", e);
        }
      }
      
      // Don't prepend API_URL if the URL is already absolute or a data URL
      if (
        sermon.imageUrl.startsWith("http") ||
        sermon.imageUrl.startsWith("data:")
      ) {
        console.log("Using absolute imageUrl:", sermon.imageUrl);
        return sermon.imageUrl;
      }
      
      // Regular imageUrl string
      const url = sermon.imageUrl.startsWith("/")
        ? `${API_URL}${sermon.imageUrl}`
        : sermon.imageUrl;
      console.log("Using regular imageUrl:", url);
      return url;
    }
    
    // 3. Try to get image from direct image string (static data)
    if (sermon.image && typeof sermon.image === "string") {
      // Don't prepend API_URL if the URL is already absolute or a data URL
      if (sermon.image.startsWith("http") || sermon.image.startsWith("data:")) {
        console.log("Using absolute image string:", sermon.image);
        return sermon.image;
      }
      
      const url = sermon.image.startsWith("/")
        ? `${API_URL}${sermon.image}`
        : sermon.image;
      console.log("Using sermon.image string:", url);
      return url;
    }
    
    // 4. Generate thumbnail from YouTube video if possible
    if (sermon.videoId) {
      const youtubeThumb = `https://img.youtube.com/vi/${sermon.videoId}/hqdefault.jpg`;
      console.log("Using auto-generated YouTube thumbnail:", youtubeThumb);
      return youtubeThumb;
    }

    console.log("No image found, using placeholder");
    return placeholderImage;
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

  // Check YouTube connectivity on component mount
  useEffect(() => {
    const checkConnectivity = async () => {
      const canAccessYouTube = await checkYouTubeConnectivity();
      setYoutubeAccessible(canAccessYouTube);
      if (!canAccessYouTube) {
        console.warn(
          "YouTube appears to be inaccessible. Videos may not play correctly."
        );
      }
    };

    checkConnectivity();
  }, []);

  // Reset video error state when selecting a new sermon
  const selectSermon = (sermon) => {
    // Clear any existing timeout to prevent race conditions
    if (loadingTimeout) {
      clearTimeout(loadingTimeout);
      setLoadingTimeout(null);
    }

    setIsLoading(true);
    setVideoError(false);
    setVideoErrorMessage("");

    // Update the URL parameter to maintain history - use replace: true to fix back button
    setSearchParams({ video: sermon.videoId }, { replace: true });

    // First validate YouTube ID before proceeding
    if (!sermon.videoId || !isValidYouTubeID(sermon.videoId)) {
      console.error("Invalid YouTube video ID:", sermon.videoId);
      setVideoError(true);
      setVideoErrorMessage(
        `Invalid YouTube video ID: ${sermon.videoId || "missing"}`
      );
      setIsLoading(false);
      return;
    }

    // Set a timeout to prevent indefinite loading
    const timeout = setTimeout(() => {
      console.warn("Video loading timeout - forcing completion");
      setIsLoading(false);
      
      // Only set error if we're still in loading state
      if (isLoading) {
        setVideoError(true);
        setVideoErrorMessage(
          "Video loading timed out. Please try again or use a different player."
        );
      }
    }, 10000); // 10 second timeout (increased for slower connections)

    setLoadingTimeout(timeout);

    // Check if YouTube is accessible
    if (!youtubeAccessible) {
      console.warn(
        "YouTube appears to be inaccessible, but will try to load video anyway."
      );
    }

    setPlayerMode("default");
    setSelectedSermon(sermon);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (loadingTimeout) {
        clearTimeout(loadingTimeout);
      }
    };
  }, [loadingTimeout]);

  // Set the initially selected sermon when sermons data is loaded
  useEffect(() => {
    // Reset loading states when component mounts
    const resetLoadingState = setTimeout(() => {
      if (isLoading) {
        console.log("Force resetting loading state after component mount");
        setIsLoading(false);
        
        if (loadingTimeout) {
          clearTimeout(loadingTimeout);
          setLoadingTimeout(null);
        }
      }
    }, 3000);
    
    if (sermons && sermons.length > 0) {
      console.log("Sermons page - API data:", sermons);

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

      // Set the initially selected sermon
      if (videoIdParam) {
        const foundSermon = sermons.find(
          (sermon) => sermon.videoId === videoIdParam
        );
        if (foundSermon) {
          selectSermon(foundSermon);
        } else {
          selectSermon(sermons[0]);
        }
      } else {
        selectSermon(sermons[0]);
      }
    } else if (sermonsError) {
      console.error("Error fetching sermons:", sermonsError);
      // Use static data as fallback

      // Set the initially selected sermon from static data
      if (videoIdParam) {
        const foundSermon = staticSermons.find(
          (sermon) => sermon.videoId === videoIdParam
        );
        if (foundSermon) {
          selectSermon(foundSermon);
        } else {
          selectSermon(staticSermons[0]);
        }
      } else {
        selectSermon(staticSermons[0]);
      }

      setError("Using local sermon data - API server unavailable");
    }
    
    // Clear any loading timeouts on component unmount
    return () => {
      clearTimeout(resetLoadingState);
      if (loadingTimeout) {
        clearTimeout(loadingTimeout);
        setLoadingTimeout(null);
      }
    };
  }, [sermons, sermonsError, videoIdParam]);

  // Loading state for the whole page
  if (sermonsLoading || (isLoading && !selectedSermon)) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  // Error state for fetching sermons
  if (error || sermonsError) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  // No sermons available in the database
  if (!isLoading && !error && sermons.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            No Sermons Available
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Check back later for new sermon uploads.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* SEO Meta Tags */}
      <Helmet>
        <title>Sermons - Victory Bible Church</title>
        <meta
          name="description"
          content="Watch or listen to past messages and sermons from Victory Bible Church."
        />
      </Helmet>

      {/* Hero Section for Navbar Background */}
      <div className="bg-gray-900 text-white pt-32 pb-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center">Sermons & Messages</h1>
          <p className="text-xl text-center mt-4 text-gray-300">
            Watch or listen to past messages from our church services
          </p>
        </div>
      </div>

      {/* Content Section Below Navbar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8"
      >
        {/* Enhanced Video Player Section */}
        {selectedSermon && (
          <div className="mb-12">
            <div className="relative bg-black rounded-xl overflow-hidden shadow-xl lg:w-3/4 lg:mx-auto">
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
                </div>
              )}

              {/* Player Mode Switcher */}
              <div className="absolute top-0 right-0 z-10 flex space-x-1 m-2">
                <button
                  onClick={() => {
                    setPlayerMode("default");
                    setIsLoading(true);
                  }}
                  className={`px-2 py-1 text-xs rounded ${playerMode === "default" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"}`}
                >
                  Player 1
                </button>
                <button
                  onClick={() => {
                    setPlayerMode("alternate");
                    setIsLoading(true);
                  }}
                  className={`px-2 py-1 text-xs rounded ${playerMode === "alternate" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"}`}
                >
                  Player 2
                </button>
                <button
                  onClick={() => setPlayerMode("youtube")}
                  className={`px-2 py-1 text-xs rounded ${playerMode === "youtube" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"}`}
                >
                  YouTube
                </button>
              </div>

              {/* Adaptive Height Container */}
              <div className="relative pt-[56.25%] h-[50vh] md:h-[60vh] lg:h-auto">
                {playerMode === "youtube" ? (
                  <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center bg-gray-900 text-white p-6 text-center">
                    <div className="text-xl mb-4">External YouTube Player</div>
                    <p className="mb-4">
                      Click below to watch this sermon on YouTube's website
                    </p>
                    <a
                      href={`https://www.youtube.com/watch?v=${selectedSermon.videoId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                    >
                      Watch on YouTube
                    </a>
                  </div>
                ) : playerMode === "default" ? (
                  <>
                    {videoError ? (
                      <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center bg-gray-900 text-white p-6 text-center">
                        <div className="text-xl mb-4">Video Playback Error</div>
                        <p className="mb-4">
                          {videoErrorMessage ||
                            "There was an issue connecting to YouTube. This could be due to network restrictions or the video might be unavailable."}
                        </p>
                        {!youtubeAccessible && (
                          <div className="bg-red-800 p-3 mb-4 rounded text-sm">
                            <p>
                              YouTube connectivity check failed. Your network
                              may be blocking YouTube content.
                            </p>
                            <p className="mt-2">
                              Try using a different network or check your
                              firewall/proxy settings.
                            </p>
                          </div>
                        )}
                        <div className="flex space-x-3">
                          <button
                            onClick={() => {
                              setPlayerMode("alternate");
                              setIsLoading(true);
                              setVideoError(false);
                            }}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                          >
                            Try Player 2
                          </button>
                          <button
                            onClick={() => setPlayerMode("youtube")}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                          >
                            YouTube
                          </button>
                        </div>
                        <div className="mt-4 text-xs text-gray-400">
                          <p>
                            Debug Info: Video ID: {selectedSermon.videoId},
                            YouTube API Accessible:{" "}
                            {youtubeAccessible ? "Yes" : "No"}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="absolute top-0 left-0 w-full h-full">
                        <iframe
                          className="absolute top-0 left-0 w-full h-full"
                          src={`https://www.youtube.com/embed/${selectedSermon.videoId}?origin=${encodeURIComponent(window.location.origin)}&enablejsapi=0&rel=0&modestbranding=1&autoplay=1`}
                          title={selectedSermon.title}
                          allow="autoplay; fullscreen"
                          allowFullScreen
                          loading="eager"
                          onLoad={() => {
                            console.log("YouTube iframe loaded successfully");
                            setIsLoading(false);
                            // Clear any existing timeout to prevent race conditions
                            if (loadingTimeout) {
                              clearTimeout(loadingTimeout);
                              setLoadingTimeout(null);
                            }
                          }}
                        />
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    {videoError ? (
                      <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center bg-gray-900 text-white p-6 text-center">
                        <div className="text-xl mb-4">Video Playback Error</div>
                        <p className="mb-4">
                          {videoErrorMessage ||
                            "There was an issue playing this video. Try the primary player or YouTube option."}
                        </p>
                        {!youtubeAccessible && (
                          <div className="bg-red-800 p-3 mb-4 rounded text-sm">
                            <p>
                              YouTube connectivity check failed. Your network
                              may be blocking YouTube content.
                            </p>
                            <p className="mt-2">
                              Try using a different network or check your
                              firewall/proxy settings.
                            </p>
                          </div>
                        )}
                        <div className="flex space-x-3">
                          <button
                            onClick={() => {
                              setPlayerMode("default");
                              setIsLoading(true);
                              setVideoError(false);
                            }}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                          >
                            Try Player 1
                          </button>
                          <button
                            onClick={() => setPlayerMode("youtube")}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                          >
                            YouTube
                          </button>
                        </div>
                        <div className="mt-4 text-xs text-gray-400">
                          <p>
                            Debug Info: Video ID: {selectedSermon.videoId},
                            YouTube API Accessible:{" "}
                            {youtubeAccessible ? "Yes" : "No"}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="absolute top-0 left-0 w-full h-full">
                        <iframe
                          className="absolute top-0 left-0 w-full h-full"
                          src={`https://www.youtube-nocookie.com/embed/${selectedSermon.videoId}?rel=0&modestbranding=1&origin=${encodeURIComponent(window.location.origin)}&enablejsapi=0&autoplay=1`}
                          title={selectedSermon.title}
                          allow="autoplay; fullscreen"
                          allowFullScreen
                          loading="eager" 
                          onLoad={() => {
                            console.log("YouTube-nocookie iframe loaded successfully");
                            setIsLoading(false);
                            // Clear any existing timeout to prevent race conditions
                            if (loadingTimeout) {
                              clearTimeout(loadingTimeout);
                              setLoadingTimeout(null);
                            }
                          }}
                        />
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Video Metadata with Animation */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-6 text-center lg:text-left lg:w-3/4 lg:mx-auto"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {selectedSermon.title}
              </h2>
              <div className="mt-2 flex flex-wrap items-center justify-center lg:justify-start gap-2 text-gray-600 dark:text-gray-300">
                <span>{selectedSermon.speaker}</span>
                <span className="text-gray-400">•</span>
                <span>{formatSermonDate(selectedSermon.date)}</span>
                <span className="text-gray-400">•</span>
                <span>{selectedSermon.duration}</span>
              </div>

              {/* Add sharing options */}
              <div className="mt-4 flex items-center justify-center lg:justify-start">
                <span className="mr-3 text-sm text-gray-500 dark:text-gray-400">
                  Share:
                </span>
                <ShareButtons
                  sermonTitle={selectedSermon.title}
                  sermonUrl={`${window.location.origin}/media/sermons?video=${selectedSermon.videoId}`}
                />
              </div>
            </motion.div>
          </div>
        )}

        {/* Sermons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sermons?.map((sermon) => (
            <motion.div
              key={sermon.id}
              whileHover={{ scale: 1.02 }}
              className={`cursor-pointer bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden ${
                selectedSermon && selectedSermon.id === sermon.id
                  ? "ring-2 ring-yellow-400"
                  : "hover:shadow-lg"
              }`}
              onClick={() => selectSermon(sermon)}
            >
              {/* Add sermon image if available */}
              <div className="relative h-40 overflow-hidden">
                <img
                  src={getSermonImageUrl(sermon)}
                  alt={sermon.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.error(
                      `Failed to load image: ${getSermonImageUrl(sermon)}`
                    );
                    e.target.src = placeholderImage;
                  }}
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {sermon.title}
                </h3>
                <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  <p>{sermon.speaker}</p>
                  <div className="mt-1 flex items-center justify-between">
                    <span>{formatSermonDate(sermon.date)}</span>
                    <span className="text-gray-400">{sermon.duration}</span>
                  </div>
                </div>

                {/* Add sharing options */}
                <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
                  <button
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 text-sm font-medium"
                    onClick={(e) => {
                      e.stopPropagation();
                      selectSermon(sermon);
                    }}
                  >
                    Watch Now
                  </button>
                  <ShareButtons
                    sermonTitle={sermon.title}
                    sermonUrl={`${window.location.origin}/media/sermons?video=${sermon.videoId}`}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

// Add ShareButtons component that receives sermonTitle and sermonUrl
const ShareButtons = ({ sermonTitle, sermonUrl }) => {
  const shareData = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(sermonUrl)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out this sermon: ${sermonTitle}`)}&url=${encodeURIComponent(sermonUrl)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`Check out this sermon from Victory Bible Church: ${sermonTitle} ${sermonUrl}`)}`,
    email: `mailto:?subject=${encodeURIComponent(`Sermon recommendation: ${sermonTitle}`)}&body=${encodeURIComponent(`I thought you might enjoy this sermon from Victory Bible Church: ${sermonUrl}`)}`,
  };

  return (
    <div className="sermon-share-buttons flex space-x-2 mt-2">
      <a
        href={shareData.facebook}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:text-blue-800 transition-colors"
        aria-label="Share on Facebook"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
        </svg>
      </a>
      <a
        href={shareData.twitter}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-400 hover:text-blue-600 transition-colors"
        aria-label="Share on Twitter"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
        </svg>
      </a>
      <a
        href={shareData.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        className="text-green-500 hover:text-green-700 transition-colors"
        aria-label="Share on WhatsApp"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
        </svg>
      </a>
      <a
        href={shareData.email}
        className="text-gray-500 hover:text-gray-700 transition-colors"
        aria-label="Share via Email"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
          <polyline points="22,6 12,13 2,6"></polyline>
        </svg>
      </a>
    </div>
  );
};

export default Sermons;
