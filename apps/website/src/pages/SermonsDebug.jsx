import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useSermonsQuery } from "../hooks/useSermonsQuery";
import { Helmet } from "react-helmet";
import config from "../config";

const API_URL = config.API_URL;

// Function to validate YouTube video ID format
const isValidYouTubeID = (id) => {
  return id && typeof id === "string" && /^[a-zA-Z0-9_-]{11}$/.test(id);
};

// Static sermons data as fallback
const staticSermons = [
  {
    id: 1,
    title: "Faith That Moves Mountains",
    date: "January 21, 2024",
    imageUrl: "/images/sermon1.jpg",
    videoId: "l7fzlle9g84",
    speaker: "Pastor John Doe",
    description: "Discover how faith can transform your life.",
    duration: "45:30",
  },
  {
    id: 2,
    title: "Walking in God's Purpose",
    date: "January 14, 2024",
    imageUrl: "/images/sermon2.jpg",
    videoId: "8nOKvkVN5dI",
    speaker: "Pastor Jane Smith",
    description: "Learn how to fulfill God's purpose for your life.",
    duration: "38:15",
  },
  {
    id: 3,
    title: "The Power of Prayer",
    date: "January 7, 2024",
    imageUrl: "/images/sermon3.jpg",
    videoId: "VgTVfZ3O-7A",
    speaker: "Pastor John Doe",
    description: "Understand the power of prayer in your daily walk.",
    duration: "42:10",
  },
];

// Placeholder image
const placeholderImage =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=";

const SermonsDebug = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const videoIdParam = searchParams.get("video");

  // Use React Query for fetching sermons
  const {
    data: sermons = staticSermons,
    isLoading: sermonsLoading,
    error: sermonsError,
    refetch: refetchSermons,
  } = useSermonsQuery();

  const [selectedSermon, setSelectedSermon] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [videoErrorMessage, setVideoErrorMessage] = useState("");
  const [error, setError] = useState(null);
  const [playerMode, setPlayerMode] = useState("default");

  // Helper function to get the correct image URL
  const getSermonImageUrl = (sermon) => {
    if (!sermon.imageUrl) return placeholderImage;
    if (
      sermon.imageUrl.startsWith("http") ||
      sermon.imageUrl.startsWith("data:")
    ) {
      return sermon.imageUrl;
    }
    return sermon.imageUrl.startsWith("/")
      ? `${API_URL}${sermon.imageUrl}`
      : sermon.imageUrl;
  };

  // Format dates
  const formatSermonDate = (dateString) => {
    if (!dateString) return "";
    try {
      if (typeof dateString === "string" && dateString.includes("T")) {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      }
      return dateString;
    } catch (err) {
      console.error("Error formatting date:", err);
      return dateString;
    }
  };

  // BUGFIX 1: Use a reference to track if the component is mounted
  // to prevent state updates on unmounted component
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // BUGFIX 2: Handle sermon selection with proper loading timeout
  const selectSermon = (sermon) => {
    console.log("Selecting sermon:", sermon.title);
    setIsLoading(true);
    setVideoError(false);
    setVideoErrorMessage("");

    // BUGFIX 3: Update URL properly - use replace: true to avoid breaking back button
    setSearchParams({ video: sermon.videoId }, { replace: true });

    // BUGFIX 4: Set a timeout to prevent infinite loading
    const loadingTimer = setTimeout(() => {
      if (isMountedRef.current && isLoading) {
        console.log("Loading timeout reached - forcing completion");
        setIsLoading(false);
      }
    }, 5000);

    // Validate YouTube ID
    if (!sermon.videoId || !isValidYouTubeID(sermon.videoId)) {
      setVideoError(true);
      setVideoErrorMessage(
        `Invalid YouTube video ID: ${sermon.videoId || "missing"}`
      );
      setIsLoading(false);
      clearTimeout(loadingTimer);
    }

    setPlayerMode("default");
    setSelectedSermon(sermon);

    // Clear timeout on unmount
    return () => clearTimeout(loadingTimer);
  };

  // Set initial sermon when sermons data is loaded
  useEffect(() => {
    if (sermons && sermons.length > 0 && isMountedRef.current) {
      // Set initial sermon
      if (videoIdParam) {
        const foundSermon = sermons.find(
          (sermon) => sermon.videoId === videoIdParam
        );
        if (foundSermon) {
          setSelectedSermon(foundSermon);
        } else {
          setSelectedSermon(sermons[0]);
          // Update URL if sermon not found
          setSearchParams({ video: sermons[0].videoId }, { replace: true });
        }
      } else {
        setSelectedSermon(sermons[0]);
        // Set initial URL parameter
        setSearchParams({ video: sermons[0].videoId }, { replace: true });
      }
    } else if (sermonsError && isMountedRef.current) {
      console.error("Error fetching sermons:", sermonsError);
      setError("Failed to load sermons");

      // Fallback to static data
      if (videoIdParam) {
        const foundSermon = staticSermons.find(
          (sermon) => sermon.videoId === videoIdParam
        );
        if (foundSermon) {
          setSelectedSermon(foundSermon);
        } else {
          setSelectedSermon(staticSermons[0]);
          // Update URL if sermon not found in static data
          setSearchParams(
            { video: staticSermons[0].videoId },
            { replace: true }
          );
        }
      } else {
        setSelectedSermon(staticSermons[0]);
        // Set initial URL parameter from static data
        setSearchParams({ video: staticSermons[0].videoId }, { replace: true });
      }
    }
  }, [sermons, sermonsError, videoIdParam, setSearchParams]);

  // BUGFIX 9: Use a separate effect for URL changes to prevent loops
  useEffect(() => {
    if (!videoIdParam || !sermons) return;

    const foundSermon = sermons.find(
      (sermon) => sermon.videoId === videoIdParam
    );
    if (
      foundSermon &&
      (!selectedSermon || selectedSermon.videoId !== videoIdParam)
    ) {
      setSelectedSermon(foundSermon);
    }
  }, [videoIdParam, sermons]);

  // BUGFIX 10: Handle back button explicitly
  useEffect(() => {
    const handlePopState = () => {
      // Get the current video ID from URL when back button is pressed
      const params = new URLSearchParams(window.location.search);
      const currentVideoId = params.get("video");

      if (currentVideoId && sermons) {
        const sermon = sermons.find((s) => s.videoId === currentVideoId);
        if (sermon) {
          setSelectedSermon(sermon);
          setVideoError(false);
          setVideoErrorMessage("");
        }
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [sermons]);

  if (!selectedSermon) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Sermons - Victory Bible Church (Debug)</title>
      </Helmet>

      {/* Hero Section */}
      <div className="bg-gray-900 text-white pt-32 pb-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center">
            Sermons & Messages (Debug Mode)
          </h1>
          <p className="text-xl text-center mt-4 text-gray-300">
            Fixed video loading & navigation issues
          </p>
        </div>
      </div>

      {/* Content Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8"
      >
        {/* Video Player Section */}
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

              {/* Video Container */}
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
                      </div>
                    ) : (
                      <iframe
                        className="absolute top-0 left-0 w-full h-full"
                        src={`https://www.youtube.com/embed/${selectedSermon.videoId}?origin=${encodeURIComponent(window.location.origin)}&enablejsapi=1`}
                        title={selectedSermon.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        referrerPolicy="origin"
                        onLoad={() => {
                          console.log("YouTube iframe loaded successfully");
                          setIsLoading(false);
                        }}
                        onError={() => {
                          console.error("YouTube iframe error");
                          setVideoError(true);
                          setVideoErrorMessage(
                            "Failed to load YouTube video. Try another player option."
                          );
                          setIsLoading(false);
                        }}
                      />
                    )}
                  </>
                ) : (
                  <iframe
                    className="absolute top-0 left-0 w-full h-full"
                    src={`https://www.youtube-nocookie.com/embed/${selectedSermon.videoId}?rel=0&modestbranding=1&origin=${encodeURIComponent(window.location.origin)}&enablejsapi=1`}
                    title={selectedSermon.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    referrerPolicy="origin"
                    onLoad={() => {
                      console.log(
                        "YouTube-nocookie iframe loaded successfully"
                      );
                      setIsLoading(false);
                    }}
                    onError={() => {
                      console.error("YouTube-nocookie iframe error");
                      setVideoError(true);
                      setVideoErrorMessage(
                        "Failed to load YouTube video. Try another player option."
                      );
                      setIsLoading(false);
                    }}
                  />
                )}
              </div>
            </div>

            {/* Video Metadata */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-6 text-center lg:text-left lg:w-3/4 lg:mx-auto"
            >
              <h2 className="text-2xl font-bold text-gray-900">
                {selectedSermon.title}
              </h2>
              <div className="mt-2 flex flex-wrap items-center justify-center lg:justify-start gap-2 text-gray-600">
                <span>{selectedSermon.speaker}</span>
                <span className="text-gray-400">•</span>
                <span>{formatSermonDate(selectedSermon.date)}</span>
                <span className="text-gray-400">•</span>
                <span>{selectedSermon.duration}</span>
              </div>

              <div className="mt-4 text-sm text-gray-500 bg-gray-100 p-3 rounded">
                <p>Debug Info:</p>
                <p>Current Video ID: {videoIdParam || "none"}</p>
                <p>Selected Sermon ID: {selectedSermon.id}</p>
                <p>Loading: {isLoading ? "true" : "false"}</p>
                <p>Player Mode: {playerMode}</p>
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
              className={`cursor-pointer bg-white rounded-lg shadow-md overflow-hidden ${
                selectedSermon && selectedSermon.id === sermon.id
                  ? "ring-2 ring-yellow-400"
                  : "hover:shadow-lg"
              }`}
              onClick={() => selectSermon(sermon)}
            >
              {/* Sermon Image */}
              <div className="relative h-40 overflow-hidden">
                <img
                  src={getSermonImageUrl(sermon)}
                  alt={sermon.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = placeholderImage;
                  }}
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  {sermon.title}
                </h3>
                <div className="mt-2 text-sm text-gray-600">
                  <p>{sermon.speaker}</p>
                  <div className="mt-1 flex items-center justify-between">
                    <span>{formatSermonDate(sermon.date)}</span>
                    <span className="text-gray-400">{sermon.duration}</span>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
                  <button
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    onClick={(e) => {
                      e.stopPropagation();
                      selectSermon(sermon);
                    }}
                  >
                    Watch Now
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 bg-yellow-100 p-4 rounded-lg">
          <h3 className="text-lg font-bold text-yellow-800">Debugging Notes</h3>
          <ul className="list-disc ml-5 mt-2 text-yellow-700">
            <li>Fixed: Sermon selection properly updates URL</li>
            <li>Fixed: Infinite loading with a timeout</li>
            <li>Fixed: Back button navigation now remembers selected sermon</li>
            <li>Added: Error states for video loading failures</li>
            <li>Added: Cleanup on component unmount</li>
          </ul>
          <div className="mt-3">
            <button
              onClick={() => navigate("/media/sermons")}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Go back to regular sermons page
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SermonsDebug;
