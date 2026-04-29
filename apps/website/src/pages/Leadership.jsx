import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { EnvelopeIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { motion } from "framer-motion"; // Import motion
import { Helmet } from "react-helmet-async"; // Import Helmet
import { useLeadershipQuery } from "../hooks/useLeadershipQuery";
import config from "../config";

// Fallback images served from public placeholders (no large ES-module imports)
const fallbackImages = {
  default: "/assets/placeholder.jpg",
};

const Leadership = () => {
  const [selectedLeader, setSelectedLeader] = useState(null);
  const { data: leaders = [], isLoading, error } = useLeadershipQuery();
  const modalRef = useRef(null);
  const [isImageLoaded, setIsImageLoaded] = useState(false); // Loading state for Hero Image

  // Log leaders data when it changes
  useEffect(() => {
  }, [leaders]);

  // Get image URL (either from API or fallback)
  const getImageUrl = (leader) => {
    // If leader has an image object with path, use that
    if (leader.image?.path) {
      return leader.image.path.startsWith("http")
        ? leader.image.path
        : `${config.API_URL}${leader.image.path}`;
    }

    // If leader has an imageUrl, use that
    if (leader.imageUrl) {
      return leader.imageUrl.startsWith("http")
        ? leader.imageUrl
        : `${config.API_URL}${leader.imageUrl}`;
    }

    // Fall back to our static images if available
    return fallbackImages[leader.id] || fallbackImages.default;
  };

  // Handle modal focus trap and keyboard navigation
  useEffect(() => {
    if (selectedLeader) {
      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      const handleTabKey = (e) => {
        if (e.key === "Escape") {
          closeModal();
          return;
        }

        if (e.key !== "Tab") return;

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      };

      document.addEventListener("keydown", handleTabKey);
      firstElement.focus();

      return () => document.removeEventListener("keydown", handleTabKey);
    }
  }, [selectedLeader]);

  const closeModal = () => setSelectedLeader(null);

  const handleLeaderSelect = (leader) => {
    setSelectedLeader(leader);
    // Analytics event could be added here
  };

  // Function to categorize leaders into hierarchical tiers
  const categorizeLeaders = (leadersList) => {
    // Create empty arrays for each tier
    const tier1 = []; // Senior & Assistant Pastors
    const tier2 = []; // Five-fold ministry pastors
    const tier3 = []; // Other church leaders

    leadersList.forEach((leader) => {
      const title = leader.title?.toLowerCase() || "";

      // Tier 1: Senior and Assistant Pastors
      if (
        title.includes("senior pastor") ||
        title.includes("bishop") ||
        title.includes("assistant pastor") ||
        title === "lead pastor"
      ) {
        tier1.push(leader);
      }
      // Tier 2: Five-fold ministry pastors
      else if (
        title.includes("pastor") ||
        title.includes("apostle") ||
        title.includes("evangelist") ||
        title.includes("prophet") ||
        title.includes("teacher") ||
        title.includes("director")
      ) {
        tier2.push(leader);
      }
      // Tier 3: All other leaders
      else {
        tier3.push(leader);
      }
    });

    return { tier1, tier2, tier3 };
  };

  // Categorize leaders into tiers (do this once)
  const {
    tier1: categorizedTier1,
    tier2: categorizedTier2,
    tier3: categorizedTier3,
  } = categorizeLeaders(leaders);

  return (
    <div className="bg-gray-50">
      {/* SEO Meta Tags */}
      <Helmet>
        <title>Our Leadership - Victory Bible Church</title>
        <meta
          name="description"
          content="Meet the dedicated leadership team of Victory Bible Church. Learn about our pastors, elders, and ministry leaders who guide our community."
        />
      </Helmet>

      {/* Hero Section with Accessibility Improvements */}
      <section className="relative min-h-screen overflow-hidden">
        {/* Breadcrumb navigation */}
        <div className="absolute top-20 left-0 right-0 z-20 px-4 sm:px-6 lg:px-8 pointer-events-none">
          <nav aria-label="Breadcrumb" className="pointer-events-auto">
            <ol className="flex items-center space-x-1.5 text-sm text-white/80">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">
                <span className="mx-1">›</span>
              </li>
              <li>
                <Link
                  to="/about"
                  className="hover:text-white transition-colors"
                >
                  About
                </Link>
              </li>
              <li aria-hidden="true">
                <span className="mx-1">›</span>
              </li>
              <li className="text-white font-medium" aria-current="page">
                Leadership Team
              </li>
            </ol>
          </nav>
        </div>
        <motion.div
          className={`absolute inset-0 ${
            !isImageLoaded ? "animate-pulse bg-gray-200" : ""
          }`}
          style={{
            backgroundImage: `url('/assets/hero-bg.jpg')`,
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
            src="/assets/hero-bg.jpg"
            alt="Victory Bible Church banner for Leadership"
            className="hidden"
            onLoad={() => setIsImageLoaded(true)}
            onError={() => setIsImageLoaded(true)} // Fallback on error
          />
        </motion.div>

        <div className="absolute inset-0 bg-gradient-to-br from-black/85 via-black/70 to-black/85"></div>

        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
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

        <div className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl xl:max-w-5xl 2xl:max-w-6xl mx-auto"
          >
            {/* Primary Ribbon with subtitle */}
            <div className="flex items-center justify-center space-x-4 mb-6 md:mb-8">
              <div className="h-0.5 w-8 md:w-12 bg-primary-500" />
              <span className="font-medium text-white text-base md:text-lg xl:text-xl tracking-wider">
                Leadership Team
              </span>
              <div className="h-0.5 w-8 md:w-12 bg-primary-500" />
            </div>

            <h1
              id="hero-heading"
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-6 md:mb-8 leading-tight"
            >
              Shepherds of Our <span className="text-primary-400">Faith</span>
            </h1>

            <p className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-8 md:mb-12 leading-relaxed max-w-2xl md:max-w-3xl xl:max-w-4xl mx-auto">
              Meet the compassionate leaders who guide, nurture, and inspire our
              church community with love, wisdom, and unwavering commitment.
            </p>

            {/* Golden Ribbon - decorative element */}
            <div className="flex items-center justify-center space-x-3 md:space-x-4 mb-8 md:mb-12">
              <div className="h-px w-12 md:w-16 xl:w-20 bg-yellow-400" />
              <div className="w-2 h-2 xl:w-3 xl:h-3 bg-yellow-400 rounded-full" />
              <div className="h-px w-12 md:w-16 xl:w-20 bg-yellow-400" />
            </div>

            {/* Scroll indicator */}
            <div
              className="flex flex-col items-center animate-bounce cursor-pointer hover:scale-110 transition-transform duration-300 mt-6 md:mt-8"
              onClick={() => {
                window.scrollTo({
                  top: window.innerHeight,
                  behavior: "smooth",
                });
              }}
            >
              <div className="flex flex-col items-center group">
                <span className="text-white/60 text-xs sm:text-sm xl:text-base font-light tracking-wider mb-2 group-hover:text-white/80 transition-colors">
                  MEET OUR LEADERS
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 md:h-6 md:w-6 xl:h-7 xl:w-7 text-white/60 group-hover:text-white/80 transition-colors"
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
            </div>
          </motion.div>
        </div>
      </section>

      {/* Leadership Team Section with Improved Structure */}
      <section
        aria-labelledby="leadership-heading"
        className="container mx-auto px-4 md:px-6 py-12 md:py-16"
      >
        <h2
          id="leadership-heading"
          className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white"
        >
          Our Leadership Team
        </h2>

        {isLoading ? (
          /* Loading skeleton — 4 card placeholders in a grid */
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse bg-white rounded-2xl shadow overflow-hidden"
              >
                <div className="aspect-[4/5] bg-gray-200" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                  <div className="h-3 bg-gray-200 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12 px-4 bg-red-50 rounded-xl border border-red-200">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-red-400 mx-auto mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-red-700 font-semibold mb-1">
              Failed to load leadership information
            </p>
            <p className="text-red-500 text-sm mb-4">
              {error.message ||
                "An unexpected error occurred. Please try again."}
            </p>
            <button
              className="bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-600 transition-colors"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        ) : leaders.length === 0 ? (
          <div className="text-center py-12 px-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-gray-300 mx-auto mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0"
              />
            </svg>
            <p className="text-gray-500 text-lg">
              No leadership profiles found.
            </p>
            <p className="text-gray-400 text-sm mt-1">
              Leadership profiles added via the Admin panel will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-16">
            {/* Tier 1: Senior and Assistant Pastors (First Row) */}
            {categorizedTier1.length > 0 && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-center text-yellow-600 mb-6">
                  Senior Leadership
                </h3>
                <div className="w-24 h-1 bg-yellow-400 mx-auto mb-6 rounded-full"></div>
                <div className="grid sm:grid-cols-2 gap-8 md:gap-10 max-w-4xl mx-auto">
                  {categorizedTier1.map((leader, index) => (
                    <article
                      key={leader.id || index}
                      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 focus-within:ring-2 focus-within:ring-yellow-500 overflow-hidden flex flex-col h-full group"
                    >
                      <div className="relative aspect-[4/5] overflow-hidden">
                        <LazyLoadImage
                          src={getImageUrl(leader)}
                          alt={`Portrait of ${leader.name}`}
                          effect="blur"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 filter group-hover:brightness-110"
                          wrapperClassName="w-full h-full"
                          onError={(e) => {
                            e.target.src = fallbackImages.default;
                          }}
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4">
                          <h3 className="text-xl md:text-2xl font-extrabold text-white">
                            {leader.name}
                          </h3>
                          <p className="text-sm md:text-base text-yellow-300 font-light tracking-wide">
                            {leader.title}
                          </p>
                        </div>
                      </div>
                      <div className="p-4 flex-grow flex flex-col">
                        <p className="text-gray-600 dark:text-gray-300 mb-3 line-clamp-2 flex-grow text-sm leading-relaxed">
                          {leader.bio}
                        </p>
                        <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-200 dark:border-gray-700">
                          <a
                            href={`mailto:${leader.email}`}
                            className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 hover:underline transition-colors text-sm"
                            onClick={(e) => e.stopPropagation()}
                            aria-label={`Email ${leader.name}`}
                          >
                            <EnvelopeIcon
                              className="h-4 w-4 mr-1.5"
                              aria-hidden="true"
                            />
                            Contact
                          </a>
                          <button
                            onClick={() => handleLeaderSelect(leader)}
                            className="flex items-center bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 px-2.5 py-1 text-sm rounded-full hover:bg-yellow-200 dark:hover:bg-yellow-900/50 transition-all focus:outline-none focus:ring-2 focus:ring-yellow-500 hover:shadow-md"
                            aria-label={`View details about ${leader.name}`}
                          >
                            <UserCircleIcon
                              className="h-4 w-4 mr-1.5"
                              aria-hidden="true"
                            />
                            Profile
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}

            {/* Tier 2: Five-fold Ministry Pastors (Second Row) */}
            {categorizedTier2.length > 0 && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-center text-yellow-600 mb-6">
                  Ministry Pastors
                </h3>
                <div className="w-24 h-1 bg-yellow-400 mx-auto mb-6 rounded-full"></div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                  {categorizedTier2.map((leader, index) => (
                    <article
                      key={leader.id || index}
                      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 focus-within:ring-2 focus-within:ring-yellow-500 overflow-hidden flex flex-col h-full group"
                    >
                      <div className="relative aspect-[4/5] overflow-hidden">
                        <LazyLoadImage
                          src={getImageUrl(leader)}
                          alt={`Portrait of ${leader.name}`}
                          effect="blur"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 filter group-hover:brightness-110"
                          wrapperClassName="w-full h-full"
                          onError={(e) => {
                            e.target.src = fallbackImages.default;
                          }}
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4">
                          <h3 className="text-xl md:text-2xl font-extrabold text-white">
                            {leader.name}
                          </h3>
                          <p className="text-sm md:text-base text-yellow-300 font-light tracking-wide">
                            {leader.title}
                          </p>
                        </div>
                      </div>
                      <div className="p-4 flex-grow flex flex-col">
                        <p className="text-gray-600 dark:text-gray-300 mb-3 line-clamp-2 flex-grow text-sm leading-relaxed">
                          {leader.bio}
                        </p>
                        <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-200 dark:border-gray-700">
                          <a
                            href={`mailto:${leader.email}`}
                            className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 hover:underline transition-colors text-sm"
                            onClick={(e) => e.stopPropagation()}
                            aria-label={`Email ${leader.name}`}
                          >
                            <EnvelopeIcon
                              className="h-4 w-4 mr-1.5"
                              aria-hidden="true"
                            />
                            Contact
                          </a>
                          <button
                            onClick={() => handleLeaderSelect(leader)}
                            className="flex items-center bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 px-2.5 py-1 text-sm rounded-full hover:bg-yellow-200 dark:hover:bg-yellow-900/50 transition-all focus:outline-none focus:ring-2 focus:ring-yellow-500 hover:shadow-md"
                            aria-label={`View details about ${leader.name}`}
                          >
                            <UserCircleIcon
                              className="h-4 w-4 mr-1.5"
                              aria-hidden="true"
                            />
                            Profile
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}

            {/* Tier 3: Other Church Leaders (Third Row) */}
            {categorizedTier3.length > 0 && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-center text-yellow-600 mb-6">
                  Church Leadership
                </h3>
                <div className="w-24 h-1 bg-yellow-400 mx-auto mb-6 rounded-full"></div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                  {categorizedTier3.map((leader, index) => (
                    <article
                      key={leader.id || index}
                      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 focus-within:ring-2 focus-within:ring-yellow-500 overflow-hidden flex flex-col h-full group"
                    >
                      <div className="relative aspect-[4/5] overflow-hidden">
                        <LazyLoadImage
                          src={getImageUrl(leader)}
                          alt={`Portrait of ${leader.name}`}
                          effect="blur"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 filter group-hover:brightness-110"
                          wrapperClassName="w-full h-full"
                          onError={(e) => {
                            e.target.src = fallbackImages.default;
                          }}
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4">
                          <h3 className="text-xl md:text-2xl font-extrabold text-white">
                            {leader.name}
                          </h3>
                          <p className="text-sm md:text-base text-yellow-300 font-light tracking-wide">
                            {leader.title}
                          </p>
                        </div>
                      </div>
                      <div className="p-4 flex-grow flex flex-col">
                        <p className="text-gray-600 dark:text-gray-300 mb-3 line-clamp-2 flex-grow text-sm leading-relaxed">
                          {leader.bio}
                        </p>
                        <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-200 dark:border-gray-700">
                          <a
                            href={`mailto:${leader.email}`}
                            className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 hover:underline transition-colors text-sm"
                            onClick={(e) => e.stopPropagation()}
                            aria-label={`Email ${leader.name}`}
                          >
                            <EnvelopeIcon
                              className="h-4 w-4 mr-1.5"
                              aria-hidden="true"
                            />
                            Contact
                          </a>
                          <button
                            onClick={() => handleLeaderSelect(leader)}
                            className="flex items-center bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 px-2.5 py-1 text-sm rounded-full hover:bg-yellow-200 dark:hover:bg-yellow-900/50 transition-all focus:outline-none focus:ring-2 focus:ring-yellow-500 hover:shadow-md"
                            aria-label={`View details about ${leader.name}`}
                          >
                            <UserCircleIcon
                              className="h-4 w-4 mr-1.5"
                              aria-hidden="true"
                            />
                            Profile
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Improved Accessible Modal */}
      {selectedLeader && (
        <div
          className="fixed inset-0 bg-black/70 dark:bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-md transition-opacity animate-fadeIn"
          onClick={closeModal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div
            ref={modalRef}
            className="bg-white dark:bg-gray-800 rounded-2xl max-w-4xl w-full shadow-2xl overflow-hidden animate-scaleIn border border-gray-100 dark:border-gray-700"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="grid md:grid-cols-5 relative">
              <div className="md:col-span-2 h-64 md:h-auto overflow-hidden">
                <img
                  src={getImageUrl(selectedLeader)}
                  alt={`Portrait of ${selectedLeader.name}`}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105 filter hover:brightness-110"
                  onError={(e) => {
                    e.target.src = fallbackImages.default;
                  }}
                />
              </div>
              <div className="md:col-span-3 p-6 md:p-8 relative">
                <button
                  className="absolute top-4 right-4 text-gray-600 dark:text-gray-300 hover:text-red-500 p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                  onClick={closeModal}
                  aria-label="Close profile details"
                >
                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                </button>
                <h2
                  id="modal-title"
                  className="text-3xl md:text-4xl font-extrabold text-yellow-600 dark:text-yellow-500 mb-2"
                >
                  {selectedLeader.name}
                </h2>
                <h3 className="text-xl text-gray-600 dark:text-gray-400 mb-5 font-light tracking-wide">
                  {selectedLeader.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed text-base">
                  {selectedLeader.bio}
                </p>

                {/* Display ministry focus if available */}
                {selectedLeader.ministryFocus &&
                  selectedLeader.ministryFocus.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
                        Ministry Focus
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedLeader.ministryFocus.map((focus, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-full text-xs font-medium tracking-wide shadow-sm"
                          >
                            {focus}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                <div className="flex items-center space-x-4">
                  <a
                    href={`mailto:${selectedLeader.email}`}
                    className="flex items-center bg-blue-50 dark:bg-blue-900/30 px-4 py-2 rounded-full text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-all hover:shadow-md font-medium"
                  >
                    <EnvelopeIcon className="h-5 w-5 mr-2" aria-hidden="true" />
                    {selectedLeader.email}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leadership;
