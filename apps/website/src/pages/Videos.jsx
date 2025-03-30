import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const videosData = [
  {
    id: 1,
    title: "Church Anniversary Highlights",
    description: "A look back at our amazing journey and growth.",
    videoId: "l7fzlle9g84", // Use video IDs instead of full URLs
  },
  {
    id: 2,
    title: "Powerful Testimonies",
    description: "Life-changing testimonies from our members.",
    videoId: "8nOKvkVN5dI",
  },
  {
    id: 3,
    title: "Sunday Service Worship",
    description: "Experience the presence of God through worship.",
    videoId: "VgTVfZ3O-7A",
  },
];

const Videos = () => {
  const [selectedVideo, setSelectedVideo] = useState(videosData[0]);
  const [isLoading, setIsLoading] = useState(true);

  // Reset loading state when video changes
  useEffect(() => {
    setIsLoading(true);
  }, [selectedVideo]);

  return (
    <div className="container mx-auto px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Inspirational Videos
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Watch powerful moments from our services, events, and member testimonies.
        </p>
      </motion.div>

      {/* Video Player Section */}
      <div className="max-w-4xl mx-auto mb-12">
        <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-xl relative">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
            </div>
          )}
          
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${selectedVideo.videoId}?rel=0`}
            title={selectedVideo.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            onLoad={() => setIsLoading(false)}
          />
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6"
        >
          <h2 className="text-2xl font-semibold text-gray-900">
            {selectedVideo.title}
          </h2>
          <p className="text-gray-600 mt-2">{selectedVideo.description}</p>
        </motion.div>
      </div>

      {/* Video List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {videosData.map((video) => (
          <motion.div
            key={video.id}
            whileHover={{ scale: 1.02 }}
            className="cursor-pointer"
            onClick={() => setSelectedVideo(video)}
          >
            <div
              className={`p-4 rounded-lg shadow-md transition-all ${
                selectedVideo.id === video.id
                  ? "ring-2 ring-primary bg-gray-50"
                  : "bg-white hover:shadow-lg"
              }`}
            >
              <h3 className="text-lg font-semibold text-gray-900">
                {video.title}
              </h3>
              <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                {video.description}
              </p>
              <div className="mt-4 text-primary font-medium">
                Watch Video →
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Videos;