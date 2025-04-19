import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaSearch,
  FaMapMarkerAlt,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaCalendarAlt,
  FaHeart,
  FaFilter,
  FaArrowRight,
  FaArrowLeft,
  FaUsers,
} from "react-icons/fa";
import {
  useZoneByIdQuery,
  useZoneCellGroupsQuery,
} from "../hooks/useZonesQuery";
import { Helmet } from "react-helmet-async";
import JoinGroupModal from "../components/JoinGroupModal";
import FallbackImage from "../assets/fallback-image.png";

// Import fallback images in case there are no API images
import CellGroupImage1 from "../assets/cell-groups/cell-group-1.jpg";
import CellGroupImage2 from "../assets/cell-groups/cell-group-2.jpg";
import CellGroupImage3 from "../assets/cell-groups/cell-group-3.jpg";
import CellGroupImage4 from "../assets/cell-groups/cell-group-4.jpg";

// Import mock data for fallback
import zonesData from "../data/zonesData";
import cellGroupsData from "../data/cellGroupsData";

// Fallback images map
const fallbackImages = {
  1: CellGroupImage1,
  2: CellGroupImage2,
  3: CellGroupImage3,
  4: CellGroupImage4,
};

const ZoneDetailPage = () => {
  const { zoneId } = useParams();
  const [search, setSearch] = useState("");
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [activeFilters, setActiveFilters] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [isHeaderSticky, setIsHeaderSticky] = useState(false);
  const searchRef = useRef(null);

  // Use React Query for fetching zone data
  const {
    data: zone,
    isLoading: isZoneLoading,
    error: zoneError,
  } = useZoneByIdQuery(zoneId);

  // Use React Query for fetching cell groups in this zone
  const { data: cellGroups = [], isLoading: isCellGroupsLoading } =
    useZoneCellGroupsQuery(zoneId);

  // Determine if we're in a loading state
  const isLoading = isZoneLoading || isCellGroupsLoading;

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [zoneId]);

  // Scroll tracking for sticky header
  useEffect(() => {
    const handleScroll = () => {
      setIsHeaderSticky(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Get all unique tags for filters
  const allTags = [
    ...new Set(displayCellGroups.flatMap((group) => group.tags || [])),
  ];
  // Get all unique locations for filters (commented out as it's not currently used)
  // const allLocations = [...new Set(cellGroups.map((group) => group.location))];

  // Get image URL (either from API or fallback)
  const getImageUrl = (group) => {
    if (group.imageUrl) {
      return group.imageUrl.startsWith("http")
        ? group.imageUrl
        : group.imageUrl;
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
  const filteredGroups = displayCellGroups.filter((group) => {
    // Match search term
    const matchesSearch =
      group.name?.toLowerCase().includes(search.toLowerCase()) ||
      group.location?.toLowerCase().includes(search.toLowerCase()) ||
      group.description?.toLowerCase().includes(search.toLowerCase()) ||
      group.leader?.toLowerCase().includes(search.toLowerCase());

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

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleJoinRequest = async (formData) => {
    setIsSubmitting(true);
    try {
      // Add your API call here
      console.log("Joining group:", selectedGroup.name);
      console.log("Form data:", formData);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
      setSelectedGroup(null);
    } catch (err) {
      console.error("Failed to submit request:", err);
    } finally {
      setIsSubmitting(false);
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

  // Function to scroll to search section (commented out as it's not currently used)
  // const scrollToSearch = () => {
  //   searchRef.current?.scrollIntoView({ behavior: "smooth" });
  // };

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

  // State for fallback data
  const [fallbackZone, setFallbackZone] = useState(null);
  const [fallbackCellGroups, setFallbackCellGroups] = useState([]);

  // Use fallback data if API fails
  useEffect(() => {
    if ((zoneError || !zone) && !isLoading) {
      console.log("Using fallback zone data for", zoneId);
      // Find the zone in the mock data
      const mockZone = zonesData.find((z) => z.id === zoneId);
      if (mockZone) {
        console.log("Found fallback zone:", mockZone.name);
        setFallbackZone(mockZone);

        // Find cell groups for this zone
        const mockCellGroups = cellGroupsData.filter(
          (group) => group.zoneId === zoneId
        );
        console.log(`Found ${mockCellGroups.length} fallback cell groups`);
        setFallbackCellGroups(mockCellGroups);
      }
    }
  }, [zoneError, zone, isLoading, zoneId]);

  // Use fallback data if API fails
  const displayZone = zone || fallbackZone;
  const displayCellGroups =
    cellGroups.length > 0 ? cellGroups : fallbackCellGroups;

  // Show error state if there's an error or zone not found and no fallback data
  if ((zoneError || !zone) && !isLoading && !fallbackZone) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-white/20 max-w-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Zone Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            {zoneError
              ? "There was an error loading this zone. Please try again later."
              : "The zone you're looking for doesn't exist or has been moved."}
          </p>
          <Link
            to="/cell-groups"
            className="bg-gray-900 text-white px-6 py-3 rounded-lg shadow-md hover:bg-gray-800 transition-all duration-300 inline-flex items-center"
          >
            <FaArrowLeft className="mr-2" /> Return to Zones
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* SEO Meta Tags */}
      <Helmet>
        <title>
          {displayZone
            ? `${displayZone.name} - Cell Groups`
            : "Loading Zone..."}{" "}
          - Victory Bible Church
        </title>
        <meta
          name="description"
          content={
            displayZone
              ? `Explore cell groups in the ${displayZone.name} led by ${displayZone.elder.name}. Find a group near you for fellowship, growth, and community.`
              : "Loading zone information..."
          }
        />
      </Helmet>

      {/* Zone Header */}
      {displayZone && (
        <section className="relative bg-gray-900 text-white py-16 pt-32">
          <div className="container mx-auto px-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12">
              <Link
                to="/cell-groups"
                className="inline-flex items-center text-gray-300 hover:text-white bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full shadow-md transition-all duration-300"
              >
                <FaArrowLeft className="mr-2" /> Back to All Zones
              </Link>

              <div className="flex items-center text-yellow-400 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full shadow-md">
                <FaUsers className="mr-2" />
                <span>
                  {displayZone.cellCount || filteredGroups.length} Cell Groups
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
              <div className="lg:col-span-2">
                <h1 className="text-4xl font-bold mb-4">{displayZone.name}</h1>
                <div className="flex items-center text-gray-300 mb-4 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full shadow-md inline-block">
                  <FaMapMarkerAlt className="mr-2" />
                  <span>{displayZone.location}</span>
                </div>
                <p className="text-lg text-gray-300 mb-6 bg-black/20 backdrop-blur-sm p-4 rounded-xl shadow-md">
                  {displayZone.description}
                </p>
              </div>

              {/* Elder Information */}
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-lg border border-white/10">
                <h2 className="text-xl font-bold mb-4">Zone Elder</h2>
                <div className="flex items-start">
                  <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm overflow-hidden mr-4 shadow-md">
                    {displayZone.elder.image ? (
                      <img
                        src={displayZone.elder.image}
                        alt={displayZone.elder.name}
                        className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-500"
                        onError={(e) => {
                          e.target.src = FallbackImage;
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-white/20 text-white/80">
                        <FaUser size={32} />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">
                      {displayZone.elder.name}
                    </h3>
                    <p className="text-gray-300 mb-2">
                      {displayZone.elder.title}
                    </p>
                    <p className="text-sm text-gray-300 mb-4">
                      {displayZone.elder.bio}
                    </p>
                    <div className="flex flex-col space-y-2">
                      {displayZone.elder.contact && (
                        <div className="flex items-center text-gray-300 text-sm bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm">
                          <FaEnvelope className="mr-2" />
                          <span>{displayZone.elder.contact}</span>
                        </div>
                      )}
                      {displayZone.elder.phone && (
                        <div className="flex items-center text-gray-300 text-sm bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm">
                          <FaPhone className="mr-2" />
                          <span>{displayZone.elder.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Sticky search header */}
      <AnimatePresence>
        {isHeaderSticky && (
          <motion.div
            className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md shadow-lg py-3 px-4"
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            exit={{ y: -100 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="max-w-7xl mx-auto flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <Link
                  to="/cell-groups"
                  className="flex items-center text-gray-700 hover:text-gray-900 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-sm transition-all duration-300"
                >
                  <FaArrowLeft />
                </Link>
                <h2 className="text-xl font-bold text-gray-900 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-lg shadow-sm">
                  {displayZone ? displayZone.name : "Loading..."} Cell Groups
                </h2>
              </div>
              <div className="flex items-center space-x-4">
                <div className="relative w-64">
                  <div className="relative overflow-hidden rounded-lg shadow-sm bg-white/80 backdrop-blur-sm">
                    <input
                      type="text"
                      placeholder="Search..."
                      className="w-full pl-10 pr-4 py-2 bg-transparent focus:outline-none transition-colors"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                    <FaSearch className="absolute left-3 top-3 text-gray-400" />
                  </div>
                </div>
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/90 backdrop-blur-md shadow-lg rounded-xl p-8 mb-12 border border-white/20"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Find a Cell Group in{" "}
              {displayZone ? displayZone.name : "this Zone"}
            </h2>

            {/* Mobile Search Bar */}
            <div className="w-full md:hidden relative mb-4">
              <div className="relative overflow-hidden rounded-lg shadow-sm bg-white/80 backdrop-blur-sm">
                <input
                  type="text"
                  placeholder="Search by name or leader..."
                  className="w-full pl-10 pr-4 py-3 bg-transparent focus:outline-none transition-colors"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <FaSearch className="absolute left-3 top-3.5 text-gray-400" />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            {/* Desktop Controls */}
            <div className="flex items-center gap-4 w-full md:w-auto">
              {/* Desktop Search */}
              <div className="relative w-full md:w-64 hidden md:block">
                <div className="relative overflow-hidden rounded-lg shadow-sm bg-white/80 backdrop-blur-sm">
                  <input
                    type="text"
                    placeholder="Search by name or leader..."
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

              {/* Filter Button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`py-2.5 px-4 flex items-center gap-2 rounded-lg shadow-sm ${
                  activeFilters.length > 0
                    ? "bg-gray-900 text-white"
                    : "bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-white/90"
                } transition-all duration-300`}
              >
                <FaFilter size={14} />
                <span>
                  Filters{" "}
                  {activeFilters.length > 0 && `(${activeFilters.length})`}
                </span>
              </button>
            </div>
          </div>

          {/* Active Filters Display */}
          {activeFilters.length > 0 && (
            <div className="flex flex-wrap items-center gap-3 mb-6 pb-6 border-b border-gray-100">
              <span className="text-sm text-gray-500">Active filters:</span>
              {activeFilters.map((filter) => (
                <div
                  key={filter}
                  className="flex items-center bg-white/80 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm shadow-sm"
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
                            className={`px-4 py-1.5 text-sm rounded-full shadow-sm ${
                              activeFilters.includes(tag)
                                ? "bg-gray-900 text-white"
                                : "bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-white/90"
                            } transition-all duration-300`}
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
                            className={`px-4 py-1.5 text-sm rounded-full shadow-sm ${
                              activeFilters.includes(day)
                                ? "bg-gray-900 text-white"
                                : "bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-white/90"
                            } transition-all duration-300`}
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
                      className="px-6 py-2.5 bg-gray-900 text-white hover:bg-gray-800 transition-all duration-300 rounded-lg shadow-md"
                    >
                      Apply Filters
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

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
              className="text-center py-16 bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-white/20"
            >
              <FaSearch className="mx-auto text-3xl text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No Cell Groups Found
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                Try adjusting your search or filters to find a cell group that
                matches your criteria.
              </p>
              {(search || activeFilters.length > 0) && (
                <button
                  onClick={() => {
                    setSearch("");
                    setActiveFilters([]);
                  }}
                  className="mt-6 px-6 py-2.5 rounded-lg bg-white/80 backdrop-blur-sm hover:bg-white/90 text-gray-700 inline-block shadow-sm transition-all duration-300"
                >
                  Clear all filters
                </button>
              )}
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredGroups.map((group, index) => (
                <motion.div
                  key={group.id}
                  custom={index}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                  className="bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-white/20 overflow-hidden transform transition-all duration-300"
                >
                  <div className="relative h-56 overflow-hidden rounded-t-xl">
                    <img
                      src={getImageUrl(group)}
                      alt={group.name}
                      className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-500"
                    />
                    <button
                      onClick={() => toggleFavorite(group.id)}
                      className="absolute top-4 right-4 p-2 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 transition-all duration-300 z-10 shadow-md"
                      aria-label={
                        favorites.includes(group.id)
                          ? "Remove from favorites"
                          : "Add to favorites"
                      }
                    >
                      <FaHeart
                        className={`${
                          favorites.includes(group.id)
                            ? "text-red-500"
                            : "text-white"
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
                            className="px-3 py-1 text-xs rounded-full bg-white/80 backdrop-blur-sm shadow-sm text-gray-700"
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
                      <div className="flex items-center text-gray-700 bg-white/80 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-sm">
                        <FaCalendarAlt className="mr-2" />
                        {group.meetingDay} at {group.meetingTime}
                      </div>
                      <div className="flex items-center text-gray-700">
                        {group.capacity && (
                          <span className="text-xs bg-white/80 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-sm">
                            {group.capacity}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Cell Leader Information */}
                    <div className="flex items-start mb-6 border-t border-b border-gray-100/50 py-4">
                      <div className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm shadow-md flex-shrink-0 overflow-hidden mr-3">
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
                          <div className="w-full h-full flex items-center justify-center bg-white/90 text-gray-500">
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
                      className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 px-4 rounded-lg shadow-md transition-all duration-300 flex items-center justify-center"
                    >
                      Join this cell group
                      <FaArrowRight className="ml-2" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Join Group Modal */}
      {selectedGroup && (
        <JoinGroupModal
          group={selectedGroup}
          onClose={() => setSelectedGroup(null)}
          onSubmit={handleJoinRequest}
          isLoading={isSubmitting}
        />
      )}
    </div>
  );
};

export default ZoneDetailPage;
