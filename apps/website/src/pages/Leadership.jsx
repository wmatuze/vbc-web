import React, { useState, useRef, useEffect } from "react";
import { EnvelopeIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { XMarkIcon } from "@heroicons/react/24/solid";
import PlaceHolderbanner from "../assets/ministry-banners/ph.png";
import FallbackImage from "../assets/fallback-image.png"; // Import fallback image
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { motion } from "framer-motion"; // Import motion
import { Helmet } from "react-helmet"; // Import Helmet
import { getLeaders } from "../services/api";
import config from "../config";

// Import fallback images for leaders
import bishMain from "../assets/leadership/bishop-main.jpg";
import placeholderImage from "../assets/leadership/placeholder.jpg";

// Fallback images map
const fallbackImages = {
  "bishop-cyrus": bishMain,
  default: placeholderImage
};

const Leadership = () => {
  const [selectedLeader, setSelectedLeader] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [leaders, setLeaders] = useState([]);
  const [error, setError] = useState("");
  const modalRef = useRef(null);
  const [isImageLoaded, setIsImageLoaded] = useState(false); // Loading state for Hero Image

  // Fetch leaders data from API
  useEffect(() => {
    const fetchLeaders = async () => {
      try {
        setIsLoading(true);
        const data = await getLeaders();
        console.log("Leadership - API leaders data:", data);
        
        // Process leaders to ensure email is properly extracted from contact object
        const processedLeaders = data.map(leader => ({
          ...leader,
          // Extract email from contact object if present
          email: leader.contact?.email || leader.email || 'info@victorybc.org'
        }));
        
        // Sort leaders by order property
        const sortedLeaders = processedLeaders.sort((a, b) => (a.order || 99) - (b.order || 99));
        setLeaders(sortedLeaders);
        setError("");
      } catch (err) {
        console.error("Error fetching leaders:", err);
        setError("Failed to load leadership information. Please try again later.");
      } finally {
        // Add a small delay to ensure smooth loading transition
        setTimeout(() => setIsLoading(false), 300);
      }
    };

    fetchLeaders();
  }, []);

  // Get image URL (either from API or fallback)
  const getImageUrl = (leader) => {
    // If leader has an image object with path, use that
    if (leader.image?.path) {
      return leader.image.path.startsWith('http')
        ? leader.image.path
        : `${config.API_URL}${leader.image.path}`;
    }
    
    // If leader has an imageUrl, use that
    if (leader.imageUrl) {
      return leader.imageUrl.startsWith('http') 
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
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
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

    leadersList.forEach(leader => {
      const title = leader.title?.toLowerCase() || '';
      
      // Tier 1: Senior and Assistant Pastors
      if (title.includes('senior pastor') || 
          title.includes('bishop') || 
          title.includes('assistant pastor') || 
          title === 'lead pastor') {
        tier1.push(leader);
      }
      // Tier 2: Five-fold ministry pastors
      else if (title.includes('pastor') || 
               title.includes('apostle') || 
               title.includes('evangelist') || 
               title.includes('prophet') || 
               title.includes('teacher') ||
               title.includes('director')) {
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
  const { tier1: categorizedTier1, tier2: categorizedTier2, tier3: categorizedTier3 } = categorizeLeaders(leaders);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* SEO Meta Tags */}
      <Helmet>
        <title>Our Leadership - Victory Bible Church</title>
        <meta
          name="description"
          content="Meet the dedicated leadership team of Victory Bible Church. Learn about our pastors, elders, and ministry leaders who guide our community."
        />
      </Helmet>

      {/* Hero Section with Accessibility Improvements */}
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
            alt="Victory Bible Church banner for Leadership"
            className="hidden"
            onLoad={() => setIsImageLoaded(true)}
            onError={() => setIsImageLoaded(true)} // Fallback on error
          />
        </motion.div>

        <div className="absolute inset-0 bg-gradient-to-r from-yellow-900/80 via-yellow-900/70 to-yellow-900/80 rounded-b-3xl"></div>

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
            <h1
              id="hero-heading"
              className="text-4xl lg:text-5xl font-bold text-white text-center mb-4 tracking-tight drop-shadow-lg"
            >
              Shepherds of Our <span className="text-yellow-400">Faith</span>
            </h1>
            <p className="text-lg text-white text-center max-w-3xl mx-auto leading-relaxed font-light drop-shadow-md">
              Meet the compassionate leaders who guide, nurture, and inspire our
              church community with love, wisdom, and unwavering commitment.
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
          <div className="flex justify-center items-center py-20">
            <div className="animate-pulse flex flex-col items-center">
              <div className="rounded-full bg-gray-300 dark:bg-gray-700 h-16 w-16 mb-4"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-48 mb-2"></div>
              <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-32"></div>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-8 px-4">
            <div className="text-red-500 mb-2">{error}</div>
            <button
              className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="space-y-16">
            {/* Tier 1: Senior and Assistant Pastors (First Row) */}
            {categorizedTier1.length > 0 && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-center text-yellow-600 mb-8">
                  Senior Leadership
                </h3>
                <div className="grid sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
                  {categorizedTier1.map((leader, index) => (
                    <article
                      key={leader.id || index}
                      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 focus-within:ring-2 focus-within:ring-yellow-500 overflow-hidden flex flex-col h-full"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <LazyLoadImage
                          src={getImageUrl(leader)}
                          alt={`Portrait of ${leader.name}`}
                          effect="blur"
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                          wrapperClassName="w-full h-full"
                          onError={(e) => {
                            e.target.src = fallbackImages.default;
                          }}
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                          <h3 className="text-xl md:text-2xl font-bold text-white">
                            {leader.name}
                          </h3>
                          <p className="text-md md:text-lg text-yellow-300 font-medium">
                            {leader.title}
                          </p>
                        </div>
                      </div>
                      <div className="p-5 md:p-6 flex-grow flex flex-col">
                        <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3 flex-grow">
                          {leader.bio}
                        </p>
                        <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-200 dark:border-gray-700">
                          <a
                            href={`mailto:${leader.email}`}
                            className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 hover:underline transition-colors"
                            onClick={(e) => e.stopPropagation()}
                            aria-label={`Email ${leader.name}`}
                          >
                            <EnvelopeIcon
                              className="h-5 w-5 mr-2"
                              aria-hidden="true"
                            />
                            Contact
                          </a>
                          <button
                            onClick={() => handleLeaderSelect(leader)}
                            className="flex items-center bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 px-3 py-1.5 rounded-full hover:bg-yellow-200 dark:hover:bg-yellow-900/50 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            aria-label={`View details about ${leader.name}`}
                          >
                            <UserCircleIcon
                              className="h-5 w-5 mr-1.5"
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
                <h3 className="text-2xl font-bold text-center text-yellow-600 mb-8">
                  Ministry Pastors
                </h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                  {categorizedTier2.map((leader, index) => (
                    <article
                      key={leader.id || index}
                      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 focus-within:ring-2 focus-within:ring-yellow-500 overflow-hidden flex flex-col h-full"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <LazyLoadImage
                          src={getImageUrl(leader)}
                          alt={`Portrait of ${leader.name}`}
                          effect="blur"
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                          wrapperClassName="w-full h-full"
                          onError={(e) => {
                            e.target.src = fallbackImages.default;
                          }}
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                          <h3 className="text-xl md:text-2xl font-bold text-white">
                            {leader.name}
                          </h3>
                          <p className="text-md md:text-lg text-yellow-300 font-medium">
                            {leader.title}
                          </p>
                        </div>
                      </div>
                      <div className="p-5 md:p-6 flex-grow flex flex-col">
                        <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3 flex-grow">
                          {leader.bio}
                        </p>
                        <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-200 dark:border-gray-700">
                          <a
                            href={`mailto:${leader.email}`}
                            className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 hover:underline transition-colors"
                            onClick={(e) => e.stopPropagation()}
                            aria-label={`Email ${leader.name}`}
                          >
                            <EnvelopeIcon
                              className="h-5 w-5 mr-2"
                              aria-hidden="true"
                            />
                            Contact
                          </a>
                          <button
                            onClick={() => handleLeaderSelect(leader)}
                            className="flex items-center bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 px-3 py-1.5 rounded-full hover:bg-yellow-200 dark:hover:bg-yellow-900/50 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            aria-label={`View details about ${leader.name}`}
                          >
                            <UserCircleIcon
                              className="h-5 w-5 mr-1.5"
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
                <h3 className="text-2xl font-bold text-center text-yellow-600 mb-8">
                  Church Leadership
                </h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                  {categorizedTier3.map((leader, index) => (
                    <article
                      key={leader.id || index}
                      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 focus-within:ring-2 focus-within:ring-yellow-500 overflow-hidden flex flex-col h-full"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <LazyLoadImage
                          src={getImageUrl(leader)}
                          alt={`Portrait of ${leader.name}`}
                          effect="blur"
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                          wrapperClassName="w-full h-full"
                          onError={(e) => {
                            e.target.src = fallbackImages.default;
                          }}
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                          <h3 className="text-xl md:text-2xl font-bold text-white">
                            {leader.name}
                          </h3>
                          <p className="text-md md:text-lg text-yellow-300 font-medium">
                            {leader.title}
                          </p>
                        </div>
                      </div>
                      <div className="p-5 md:p-6 flex-grow flex flex-col">
                        <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3 flex-grow">
                          {leader.bio}
                        </p>
                        <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-200 dark:border-gray-700">
                          <a
                            href={`mailto:${leader.email}`}
                            className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 hover:underline transition-colors"
                            onClick={(e) => e.stopPropagation()}
                            aria-label={`Email ${leader.name}`}
                          >
                            <EnvelopeIcon
                              className="h-5 w-5 mr-2"
                              aria-hidden="true"
                            />
                            Contact
                          </a>
                          <button
                            onClick={() => handleLeaderSelect(leader)}
                            className="flex items-center bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 px-3 py-1.5 rounded-full hover:bg-yellow-200 dark:hover:bg-yellow-900/50 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            aria-label={`View details about ${leader.name}`}
                          >
                            <UserCircleIcon
                              className="h-5 w-5 mr-1.5"
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
          className="fixed inset-0 bg-black/70 dark:bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm transition-opacity animate-fadeIn"
          onClick={closeModal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div
            ref={modalRef}
            className="bg-white dark:bg-gray-800 rounded-2xl max-w-4xl w-full shadow-2xl overflow-hidden animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="grid md:grid-cols-5 relative">
              <div className="md:col-span-2 h-64 md:h-auto overflow-hidden">
                <img
                  src={getImageUrl(selectedLeader)}
                  alt={`Portrait of ${selectedLeader.name}`}
                  className="w-full h-full object-cover"
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
                  className="text-3xl md:text-4xl font-bold text-yellow-600 dark:text-yellow-500 mb-2"
                >
                  {selectedLeader.name}
                </h2>
                <h3 className="text-xl text-gray-600 dark:text-gray-400 mb-5 font-medium">
                  {selectedLeader.title}
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                  {selectedLeader.bio}
                </p>

                {/* Display ministry focus if available */}
                {selectedLeader.ministryFocus &&
                  selectedLeader.ministryFocus.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
                        Ministry Focus
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedLeader.ministryFocus.map((focus, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-full text-sm"
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
                    className="flex items-center bg-blue-50 dark:bg-blue-900/30 px-4 py-2 rounded-full text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
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
    </main>
  );
};

export default Leadership;
