import React, { useState, useEffect, useRef } from "react";
import {
  FaSearch,
  FaMapMarkerAlt,
  FaUser,
  FaEnvelope,
  FaChevronDown,
  FaCalendarAlt,
  FaHeart,
  FaFilter,
  FaMapMarkedAlt,
  FaListUl,
  FaArrowRight,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import {
  GoogleMap,
  LoadScript,
  InfoWindow,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";
import JoinGroupModal from "../components/JoinGroupModal";
import PlaceHolderbanner from "../assets/ministry-banners/ph.png";
import FallbackImage from "../assets/fallback-image.png";
import { Helmet } from "react-helmet-async";
import { getCellGroups } from "../services/api";
import config from "../config";

// For the map implementation
const libraries = ["places"];

// Import fallback images in case there are no API images
import CellGroupImage1 from "../assets/cell-groups/cell-group-1.jpg";
import CellGroupImage2 from "../assets/cell-groups/cell-group-2.jpg";
import CellGroupImage3 from "../assets/cell-groups/cell-group-3.jpg";
import CellGroupImage4 from "../assets/cell-groups/cell-group-4.jpg";

// Fallback images map
const fallbackImages = {
  1: CellGroupImage1,
  2: CellGroupImage2,
  3: CellGroupImage3,
  4: CellGroupImage4,
};

const CellGroups = () => {
  const [cellGroupsData, setCellGroupsData] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [viewMode, setViewMode] = useState("grid"); // grid or map
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [activeFilters, setActiveFilters] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [openInfoWindow, setOpenInfoWindow] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [expandedCard, setExpandedCard] = useState(null);
  const [isHeaderSticky, setIsHeaderSticky] = useState(false);
  // Using global back-to-top button from Navbar component

  // Fetch cell groups data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await getCellGroups();
        setCellGroupsData(data);
        setError("");
      } catch (err) {
        console.error("Error fetching cell groups:", err);
        setError("Failed to load cell groups. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const searchRef = useRef(null);
  const allTags = [
    ...new Set(cellGroupsData.flatMap((group) => group.tags || [])),
  ];
  const allLocations = [
    ...new Set(cellGroupsData.map((group) => group.location)),
  ];

  // Scroll tracking for sticky header
  useEffect(() => {
    const handleScroll = () => {
      setIsHeaderSticky(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Get image URL (either from API or fallback)
  const getImageUrl = (group) => {
    if (group.imageUrl) {
      return group.imageUrl.startsWith("http")
        ? group.imageUrl
        : `${config.API_URL}${group.imageUrl}`;
    }
    // Use a more reliable way to get fallback images
    const index = (group.id ? group.id % 4 : 0) + 1;
    try {
      return fallbackImages[index] || FallbackImage;
    } catch (error) {
      console.error("Error loading fallback image:", error);
      return FallbackImage;
    }
  };

  // Filter groups based on search and active filters
  const filteredGroups = cellGroupsData.filter((group) => {
    // Match search term
    const matchesSearch =
      group.name?.toLowerCase().includes(search.toLowerCase()) ||
      group.location?.toLowerCase().includes(search.toLowerCase()) ||
      group.description?.toLowerCase().includes(search.toLowerCase());

    // Match all active filters or return true if no filters active
    const matchesFilters =
      activeFilters.length === 0 ||
      activeFilters.some(
        (filter) =>
          (group.tags && group.tags.includes(filter)) ||
          group.location === filter ||
          group.meetingDay === filter
      );

    return matchesSearch && matchesFilters;
  });

  const handleJoinRequest = async (formData) => {
    setIsLoading(true);
    try {
      // Add your API call here
      console.log("Joining group:", selectedGroup.name);
      console.log("Form data:", formData);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
      setSelectedGroup(null);
    } catch (err) {
      setError("Failed to submit request. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFilter = (filter) => {
    setActiveFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter]
    );
  };

  const toggleFavorite = (groupId) => {
    setFavorites((prev) =>
      prev.includes(groupId)
        ? prev.filter((id) => id !== groupId)
        : [...prev, groupId]
    );
  };

  const scrollToSearch = () => {
    searchRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Card variants for framer motion
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

  // Map options
  const mapContainerStyle = {
    width: "100%",
    height: "600px",
    borderRadius: "12px",
  };

  const mapCenter = {
    lat: -12.8,
    lng: 28.2,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* SEO Meta Tags */}
      <Helmet>
        <title>Find a Cell Group - Victory Bible Church</title>
        <meta
          name="description"
          content="Connect with a Victory Bible Church cell group near you for fellowship, growth, and community."
        />
      </Helmet>

      {/* Hero Section with Parallax effect */}
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
              Find Your <span className="text-yellow-400">Community</span>
            </h1>
            <p className="text-xl text-white text-center max-w-3xl mx-auto leading-relaxed font-light mb-8">
              Connect with a cell group near you for fellowship, spiritual
              growth, and authentic community.
            </p>
            <motion.div
              className="h-1 bg-yellow-400 mx-auto mt-8 mb-10"
              initial={{ width: 0 }}
              animate={{ width: 120 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            />

            <motion.button
              onClick={scrollToSearch}
              className="bg-white text-purple-900 px-8 py-3 rounded-full font-semibold flex items-center mx-auto hover:bg-yellow-400 transition-all duration-300 shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Find a Group
              <FaChevronDown className="ml-2" />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Sticky search header */}
      <AnimatePresence>
        {isHeaderSticky && (
          <motion.div
            className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md py-3 px-4"
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            exit={{ y: -100 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="max-w-7xl mx-auto flex justify-between items-center">
              <h2 className="text-xl font-bold text-primary">
                Find a Cell Group
              </h2>
              <div className="flex items-center space-x-4">
                <div className="relative w-64">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <FaSearch className="absolute left-3 top-3 text-gray-400" />
                </div>
                <button
                  className={`p-2 rounded-full ${
                    viewMode === "grid"
                      ? "bg-purple-100 text-purple-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                  onClick={() => setViewMode("grid")}
                >
                  <FaListUl />
                </button>
                <button
                  className={`p-2 rounded-full ${
                    viewMode === "map"
                      ? "bg-purple-100 text-purple-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                  onClick={() => setViewMode("map")}
                >
                  <FaMapMarkedAlt />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search and filter section */}
      <section
        ref={searchRef}
        className="container mx-auto px-4 py-16 max-w-7xl"
      >
        <div className="bg-white border border-gray-100 p-8 mb-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Find Your Cell Group
            </h2>

            {/* Mobile Search Bar */}
            <div className="w-full md:hidden relative mb-4">
              <input
                type="text"
                placeholder="Search by name or location..."
                className="w-full pl-10 pr-4 py-3 border-b border-gray-200 focus:border-gray-900 focus:outline-none transition-colors"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <FaSearch className="absolute left-0 top-3.5 text-gray-400" />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-0 top-3 text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              )}
            </div>

            {/* Desktop Controls */}
            <div className="flex items-center gap-6 w-full md:w-auto">
              {/* Desktop Search */}
              <div className="relative w-full md:w-64 hidden md:block">
                <input
                  type="text"
                  placeholder="Search by name or location..."
                  className="w-full pl-10 pr-4 py-2 border-b border-gray-200 focus:border-gray-900 focus:outline-none transition-colors"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <FaSearch className="absolute left-0 top-2.5 text-gray-400" />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-0 top-2 text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                )}
              </div>

              {/* Filter Button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`py-2 px-4 flex items-center gap-2 border-b-2 ${
                  activeFilters.length > 0
                    ? "border-gray-900 text-gray-900"
                    : "border-transparent text-gray-500 hover:border-gray-300"
                } transition-colors`}
              >
                <FaFilter size={14} />
                <span>
                  Filters{" "}
                  {activeFilters.length > 0 && `(${activeFilters.length})`}
                </span>
              </button>

              {/* View Mode Toggles */}
              <div className="flex border border-gray-200">
                <button
                  className={`p-2 ${
                    viewMode === "grid"
                      ? "bg-gray-900 text-white"
                      : "bg-white text-gray-500 hover:bg-gray-100"
                  } transition-colors`}
                  onClick={() => setViewMode("grid")}
                  aria-label="Grid View"
                >
                  <FaListUl />
                </button>
                <button
                  className={`p-2 ${
                    viewMode === "map"
                      ? "bg-gray-900 text-white"
                      : "bg-white text-gray-500 hover:bg-gray-100"
                  } transition-colors`}
                  onClick={() => setViewMode("map")}
                  aria-label="Map View"
                >
                  <FaMapMarkedAlt />
                </button>
              </div>
            </div>
          </div>

          {/* Active Filters Display */}
          {activeFilters.length > 0 && (
            <div className="flex flex-wrap items-center gap-3 mb-6 pb-6 border-b border-gray-100">
              <span className="text-sm text-gray-500">Active filters:</span>
              {activeFilters.map((filter) => (
                <div
                  key={filter}
                  className="flex items-center border border-gray-200 px-3 py-1 text-sm"
                >
                  {filter}
                  <button
                    onClick={() => toggleFilter(filter)}
                    className="ml-2 text-gray-400 hover:text-gray-600"
                    aria-label={`Remove ${filter} filter`}
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                onClick={() => setActiveFilters([])}
                className="text-sm text-gray-500 hover:text-gray-700 underline ml-2"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Filter options */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="border-t border-gray-100 pt-6">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    Filter by:
                  </h3>

                  {/* Mobile-friendly filter layout */}
                  <div className="space-y-6 md:space-y-0 md:flex md:flex-wrap md:gap-8">
                    {/* Location filters */}
                    <div className="mb-2">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">
                        Location
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {allLocations.map((location) => (
                          <button
                            key={location}
                            onClick={() => toggleFilter(location)}
                            className={`px-3 py-1.5 text-sm ${
                              activeFilters.includes(location)
                                ? "bg-gray-900 text-white"
                                : "border border-gray-200 text-gray-600 hover:border-gray-300"
                            } transition-colors`}
                          >
                            {location}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Tag filters */}
                    <div className="mb-2">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">
                        Group Type
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {allTags.map((tag) => (
                          <button
                            key={tag}
                            onClick={() => toggleFilter(tag)}
                            className={`px-3 py-1.5 text-sm ${
                              activeFilters.includes(tag)
                                ? "bg-gray-900 text-white"
                                : "border border-gray-200 text-gray-600 hover:border-gray-300"
                            } transition-colors`}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Day filters */}
                    <div className="mb-2">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">
                        Meeting Day
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {[
                          "Monday",
                          "Tuesday",
                          "Wednesday",
                          "Thursday",
                          "Friday",
                          "Saturday",
                          "Sunday",
                        ].map((day) => (
                          <button
                            key={day}
                            onClick={() => toggleFilter(day)}
                            className={`px-3 py-1.5 text-sm ${
                              activeFilters.includes(day)
                                ? "bg-gray-900 text-white"
                                : "border border-gray-200 text-gray-600 hover:border-gray-300"
                            } transition-colors`}
                          >
                            {day}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={() => setShowFilters(false)}
                      className="px-6 py-2 bg-black text-white hover:bg-gray-800 transition-colors"
                    >
                      Apply Filters
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Results section */}
        <div className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900">
              {!isLoading && `${filteredGroups.length} Cell Groups`}
              {!isLoading && activeFilters.length > 0 && " (Filtered)"}
            </h3>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-900 border-t-transparent"></div>
            </div>
          ) : filteredGroups.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 bg-white border border-gray-100"
            >
              <FaSearch className="mx-auto text-3xl text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No Cell Groups Found
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                Try adjusting your search or filters to find a cell group that
                meets your needs.
              </p>
              {activeFilters.length > 0 && (
                <button
                  onClick={() => setActiveFilters([])}
                  className="mt-6 px-6 py-2 border border-gray-200 hover:border-gray-400 text-gray-700 inline-block"
                >
                  Clear all filters
                </button>
              )}
            </motion.div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGroups.map((group, index) => (
                <motion.div
                  key={group.id}
                  custom={index}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                  className={`bg-white border border-gray-100 overflow-hidden transform transition-all duration-300 ${
                    expandedCard === group.id
                      ? "lg:col-span-2 lg:row-span-2"
                      : ""
                  }`}
                >
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={getImageUrl(group)}
                      alt={group.name}
                      className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-500"
                    />
                    <button
                      onClick={() => toggleFavorite(group.id)}
                      className="absolute top-4 right-4 p-2 rounded-full bg-black/30 hover:bg-black/50 transition-colors z-10"
                      aria-label={
                        favorites.includes(group.id)
                          ? "Remove from favorites"
                          : "Add to favorites"
                      }
                    >
                      <FaHeart
                        className={`${
                          favorites.includes(group.id)
                            ? "text-white"
                            : "text-white/70"
                        }`}
                      />
                    </button>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                    <div className="absolute bottom-0 left-0 p-4 w-full">
                      <h3 className="text-xl font-bold text-white mb-1">
                        {group.name}
                      </h3>
                      <div className="flex items-center text-sm text-white/90">
                        <FaMapMarkerAlt className="mr-1" />
                        {group.location}
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    {/* Tags */}
                    {group.tags && group.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {group.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 text-xs border border-gray-200 text-gray-700"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <p className="text-gray-600 mb-6 line-clamp-3">
                      {group.description}
                    </p>

                    {/* Meeting Information */}
                    <div className="flex justify-between text-sm mb-6">
                      <div className="flex items-center text-gray-700">
                        <FaCalendarAlt className="mr-2" />
                        {group.meetingDay} at {group.meetingTime}
                      </div>
                      <div className="flex items-center text-gray-700">
                        {group.capacity && (
                          <span className="text-xs border border-gray-200 px-2 py-1">
                            {group.capacity}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Cell Leader Information */}
                    <div className="flex items-start mb-6 border-t border-b border-gray-100 py-4">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex-shrink-0 overflow-hidden mr-3">
                        {group.leaderImage ? (
                          <img
                            src={group.leaderImage}
                            alt={group.leader}
                            className="w-full h-full object-cover filter grayscale"
                            onError={(e) => {
                              e.target.src = FallbackImage;
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
                            <FaUser />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          Led by {group.leader}
                        </div>
                        {group.leaderContact && (
                          <div className="text-xs text-gray-500 mt-1 flex items-center">
                            <FaEnvelope className="mr-1" size={10} />
                            {group.leaderContact}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Join Button */}
                    <button
                      onClick={() => setSelectedGroup(group)}
                      className="w-full bg-black hover:bg-gray-800 text-white font-medium py-3 px-4 transition-colors duration-300 flex items-center justify-center"
                    >
                      Join this cell group
                      <FaArrowRight className="ml-2" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="h-[600px] overflow-hidden border border-gray-100">
              <LoadScript
                googleMapsApiKey={
                  import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ""
                }
                libraries={libraries}
              >
                <GoogleMap
                  mapContainerStyle={mapContainerStyle}
                  center={mapCenter}
                  zoom={13}
                  options={{
                    styles: mapStyles,
                    fullscreenControl: true,
                    streetViewControl: false,
                  }}
                >
                  {filteredGroups.map((group) => (
                    <Marker
                      key={group.id}
                      position={group.coordinates || mapCenter}
                      onClick={() => setOpenInfoWindow(group.id)}
                      // Use a simple default marker instead of a custom icon
                      // to avoid CORS issues with SVG files
                    >
                      {openInfoWindow === group.id && (
                        <InfoWindow
                          onCloseClick={() => setOpenInfoWindow(null)}
                        >
                          <div className="p-2 max-w-xs">
                            <div className="flex mb-2">
                              <img
                                src={getImageUrl(group)}
                                alt={group.name}
                                className="w-16 h-16 rounded-lg object-cover mr-3"
                              />
                              <div>
                                <h4 className="font-semibold text-gray-900">
                                  {group.name}
                                </h4>
                                <p className="text-sm text-gray-500">
                                  {group.location}
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() => setSelectedGroup(group)}
                              className="w-full bg-black text-white text-sm py-2 px-3 hover:bg-gray-800 transition-colors mt-2"
                            >
                              Join Group
                            </button>
                          </div>
                        </InfoWindow>
                      )}
                    </Marker>
                  ))}
                </GoogleMap>
              </LoadScript>
            </div>
          )}
        </div>
      </section>

      {/* Join Group Modal */}
      <AnimatePresence>
        {selectedGroup && (
          <JoinGroupModal
            group={selectedGroup}
            onClose={() => setSelectedGroup(null)}
            onSubmit={handleJoinRequest}
            isLoading={isLoading}
            error={error}
          />
        )}
      </AnimatePresence>

      {/* Using global back-to-top button from Navbar component */}
    </div>
  );
};

export default CellGroups;
