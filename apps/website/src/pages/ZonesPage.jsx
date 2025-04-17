import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import {
  FaSearch,
  FaMapMarkerAlt,
  FaUser,
  FaUsers,
  FaChevronDown,
  FaArrowRight,
  FaHome,
  FaHeart,
  FaHandsHelping,
  FaPray,
  FaBible,
} from "react-icons/fa";
import PlaceHolderbanner from "../assets/ministry-banners/ph.png";
import FallbackImage from "../assets/fallback-image.png";
import zonesData from "../data/zonesData";
import { useZonesQuery } from "../hooks/useZonesQuery";

const ZonesPage = () => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [search, setSearch] = useState("");

  // Use React Query for fetching zones
  const {
    data: apiZones = [],
    isLoading,
    error,
    refetch: refetchZones,
  } = useZonesQuery({
    onError: (err) => {
      console.log("API not available, using mock data", err);
    },
  });

  // State to hold the final zones data (either from API or fallback)
  const [zones, setZones] = useState([]);

  // Use API data or fall back to mock data
  useEffect(() => {
    if (apiZones && apiZones.length > 0) {
      console.log("Using API zones data", apiZones);
      setZones(apiZones);
    } else if (isLoading) {
      // Don't set fallback data while still loading
      return;
    } else {
      // If API failed or returned empty, use mock data
      console.log("Using fallback zones data");
      setZones(zonesData);
    }
  }, [apiZones, isLoading]);

  // Filter zones based on search
  const filteredZones = zones.filter((zone) => {
    const searchLower = search.toLowerCase();
    return (
      zone.name.toLowerCase().includes(searchLower) ||
      zone.location.toLowerCase().includes(searchLower) ||
      zone.description.toLowerCase().includes(searchLower) ||
      zone.elder.name.toLowerCase().includes(searchLower)
    );
  });

  // Helper function to render the correct icon
  const renderIcon = (iconName) => {
    switch (iconName) {
      case "FaUsers":
        return <FaUsers />;
      case "FaHome":
        return <FaHome />;
      case "FaHeart":
        return <FaHeart />;
      case "FaHandsHelping":
        return <FaHandsHelping />;
      case "FaPray":
        return <FaPray />;
      case "FaBible":
        return <FaBible />;
      default:
        return <FaUsers />;
    }
  };

  // Card variants for animation
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
    hover: {
      y: -10,
      boxShadow:
        "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: { duration: 0.3 },
    },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* SEO Meta Tags */}
      <Helmet>
        <title>Cell Group Zones - Victory Bible Church</title>
        <meta
          name="description"
          content="Explore our church zones and find a cell group near you for fellowship, growth, and community."
        />
      </Helmet>

      {/* Hero Section */}
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
          aria-label="Hero background image"
        >
          <img
            src={PlaceHolderbanner}
            alt="Victory Bible Church banner for Cell Groups"
            className="hidden"
            onLoad={() => setIsImageLoaded(true)}
            onError={() => setIsImageLoaded(true)}
          />
        </motion.div>

        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 via-purple-900/70 to-blue-900/80 rounded-b-3xl"></div>

        {/* Enhanced decorative elements */}
        <div className="absolute inset-0 overflow-hidden rounded-b-3xl">
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white/10"
              style={{
                width: Math.random() * 150 + 50,
                height: Math.random() * 150 + 50,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [Math.random() * 100, Math.random() * -100],
                x: [Math.random() * 50, Math.random() * -50],
                opacity: [0.1, 0.3, 0.1],
              }}
              transition={{
                duration: Math.random() * 15 + 10,
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
            <h1 className="text-4xl lg:text-6xl font-bold text-white text-center mb-6 tracking-tight">
              Our Church <span className="text-yellow-400">Zones</span>
            </h1>
            <p className="text-xl text-white text-center max-w-3xl mx-auto leading-relaxed font-light mb-8">
              Our church is organized into zones led by dedicated elders, each
              containing multiple cell groups to help you connect and grow.
            </p>
            <motion.div
              className="h-1 bg-yellow-400 mx-auto mt-8 mb-10"
              initial={{ width: 0 }}
              animate={{ width: 120 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            />
          </motion.div>
        </div>
      </section>

      {/* Zones Section */}
      <section className="container mx-auto px-4 py-16 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/90 backdrop-blur-md shadow-lg rounded-xl p-8 mb-12 border border-white/20"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Find Your Zone</h2>

            {/* Search Bar */}
            <div className="relative w-full md:w-64">
              <div className="relative overflow-hidden rounded-lg shadow-sm bg-white/80 backdrop-blur-sm">
                <input
                  type="text"
                  placeholder="Search zones..."
                  className="w-full pl-10 pr-4 py-2.5 bg-transparent focus:outline-none transition-colors"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Zone Description */}
          <div className="mb-8 text-gray-700">
            <p>
              Our church is organized into geographical zones, each led by a
              dedicated elder. These zones help us provide better pastoral care
              and create stronger community connections. Click on a zone to see
              all the cell groups in that area.
            </p>
          </div>
        </motion.div>

        {/* Zones Grid */}
        <div className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900">
              {filteredZones.length} Church Zones
            </h3>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-900 border-t-transparent"></div>
            </div>
          ) : filteredZones.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-white/20"
            >
              <FaSearch className="mx-auto text-3xl text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No Zones Found
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                Try adjusting your search to find a zone in your area.
              </p>
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="mt-6 px-6 py-2.5 rounded-lg bg-white/80 backdrop-blur-sm hover:bg-white/90 text-gray-700 inline-block shadow-sm transition-all duration-300"
                >
                  Clear search
                </button>
              )}
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredZones.map((zone, index) => (
                <motion.div
                  key={zone.id}
                  custom={index}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                  className="bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-white/20 overflow-hidden transform transition-all duration-300"
                >
                  <div className="relative h-56 overflow-hidden rounded-t-xl">
                    <img
                      src={zone.coverImage || FallbackImage}
                      alt={zone.name}
                      className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-500"
                      onError={(e) => {
                        e.target.src = FallbackImage;
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                    <div className="absolute bottom-0 left-0 p-4 w-full">
                      <h3 className="text-xl font-bold text-white mb-1">
                        {zone.name}
                      </h3>
                      <div className="flex items-center text-sm text-white/90">
                        <FaMapMarkerAlt className="mr-1" />
                        {zone.location}
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <p className="text-gray-600 mb-6 line-clamp-3">
                      {zone.description}
                    </p>

                    {/* Elder Information */}
                    <div className="flex items-start mb-6 border-t border-b border-gray-100/50 py-4">
                      <div className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm shadow-md flex-shrink-0 overflow-hidden mr-3">
                        {zone.elder.image ? (
                          <img
                            src={zone.elder.image}
                            alt={zone.elder.name}
                            className="w-full h-full object-cover filter grayscale"
                            onError={(e) => {
                              e.target.src = FallbackImage;
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-white/90 text-gray-500">
                            <FaUser />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {zone.elder.name}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {zone.elder.title}
                        </div>
                      </div>
                    </div>

                    {/* Cell Group Count */}
                    <div className="flex justify-between text-sm mb-6">
                      <div className="flex items-center text-gray-700 bg-white/80 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-sm">
                        {zone.iconName ? (
                          <span className="mr-2">
                            {renderIcon(zone.iconName)}
                          </span>
                        ) : (
                          <FaUsers className="mr-2" />
                        )}
                        {zone.cellCount} Cell Groups
                      </div>
                    </div>

                    {/* View Zone Button */}
                    <Link
                      to={`/cell-groups/${zone.id}`}
                      className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 px-4 rounded-lg shadow-md transition-all duration-300 flex items-center justify-center"
                    >
                      View Cell Groups
                      <FaArrowRight className="ml-2" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ZonesPage;
