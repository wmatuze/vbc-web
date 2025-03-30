import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import PlaceHolderbanner from "../assets/ministry-banners/ph.png"; // Import placeholder banner
import FallbackImage from "../assets/fallback-image.png"; // Import fallback image
import React, { useState } from "react";
import { Helmet } from "react-helmet"; // Added for SEO

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
            alt="Victory Bible Church banner for Media Library"
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
              Media <span className="text-yellow-400">Library</span>
            </h1>
            <p className="text-lg text-white text-center max-w-3xl mx-auto leading-relaxed font-light">
              Explore our collection of spiritual resources and community
              moments.
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

      {/* Content Section Below Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8"
      >
        <header className="text-center mb-16">
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Explore our collection of spiritual resources and community moments
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {mediaLinks.map((media, index) => (
            <MediaCard key={media.path} media={media} index={index} />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Media;
