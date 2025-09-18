import { Link } from "react-router-dom";
import { motion } from "framer-motion";
// Removed unused image imports - now using consistent hero background
import { useState } from "react";
import { Helmet } from "react-helmet"; // Added for SEO
import HeroSection from "../components/common/HeroSection";

const mediaLinks = [
  {
    path: "/media/sermons",
    title: "Sermons",
    description: "Watch or listen to past messages",
    colorClasses:
      "bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800",
    image: "/assets/media/sermons.jpg",
    altText: "Pastor giving a sermon at the pulpit",
  },
  {
    path: "/media/videos",
    title: "Videos",
    description: "Worship, events & special moments",
    colorClasses:
      "bg-green-100 hover:bg-green-200 dark:bg-green-900 dark:hover:bg-green-800",
    image: "/assets/media/videos.jpg",
    altText: "Worship team performing during service",
  },
  {
    path: "/media/podcasts",
    title: "Podcasts",
    description: "Listen to inspirational teachings",
    colorClasses:
      "bg-purple-100 hover:bg-purple-200 dark:bg-purple-900 dark:hover:bg-purple-800",
    image: "/assets/media/podcasts.jpg",
    altText: "Microphone and audio recording equipment",
  },
  {
    path: "/media/gallery",
    title: "Gallery",
    description: "See moments from our community",
    colorClasses:
      "bg-yellow-100 hover:bg-yellow-200 dark:bg-yellow-900 dark:hover:bg-yellow-800",
    image: "/assets/media/gallery.jpg",
    altText: "Community members smiling together",
  },
  {
    path: "/media/resources",
    title: "Resources",
    description: "Access foundation class materials & church documents",
    colorClasses:
      "bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-800",
    image: "/assets/media/resources.jpg",
    altText: "Books, study materials, and a Bible on a table",
  },
];

const MediaCard = ({ media, index }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: index * 0.1 }}
    whileHover={{ scale: 1.05 }}
    className="h-full"
  >
    <Link
      to={media.path}
      className="group block h-full rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
    >
      <div className={`${media.colorClasses} h-full p-6 flex flex-col`}>
        <div className="relative w-full aspect-video overflow-hidden rounded-lg">
          <img
            src={media.image}
            alt={media.altText}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </div>
        <div className="text-center mt-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-3 transition-colors group-hover:text-blue-600">
            {media.title}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            {media.description}
          </p>
        </div>
      </div>
    </Link>
  </motion.div>
);

const Media = () => {
  const [isImageLoaded, setIsImageLoaded] = useState(false); // Loading state for Hero Image

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* SEO Meta Tags */}
      <Helmet>
        <title>Media Library - Victory Bible Church</title>
        <meta
          name="description"
          content="Explore spiritual resources and community moments from Victory Bible Church's media library."
        />
      </Helmet>

      {/* Hero Section */}
      <HeroSection
        title="Media Library"
        subtitle="Media Library"
        description="Explore our collection of spiritual resources and community moments."
        primaryAccentText="Library"
        scrollText="EXPLORE OUR MEDIA"
        backgroundImage="/assets/hero-bg.jpg"
      />

      {/* Content Section Below Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 3xl:max-w-[1920px]"
      >
        <header className="text-center mb-16">
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Explore our collection of spiritual resources and community moments
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-5 gap-8">
          {mediaLinks.map((media, index) => (
            <MediaCard key={media.path} media={media} index={index} />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Media;
