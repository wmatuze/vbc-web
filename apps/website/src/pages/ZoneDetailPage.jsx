import { useState, useEffect, useRef } from "react";
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
} from "react-icons/fa";
import {
  useZoneByIdQuery,
  useZoneCellGroupsQuery,
} from "../hooks/useZonesQuery";
import { Helmet } from "react-helmet-async";
import JoinGroupModal from "../components/JoinGroupModal";
import FallbackImage from "../assets/fallback-image.png";
import HeroSection from "../components/common/HeroSection";

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

// Breadcrumb Component
const Breadcrumb = ({ zoneName }) => (
  <nav className="flex items-center space-x-2 text-sm mb-6">
    <Link to="/" className="text-gray-500 hover:text-blue-600 transition-colors">
      Home
    </Link>
    <span className="text-gray-400">/</span>
    <Link to="/cell-groups" className="text-gray-500 hover:text-blue-600 transition-colors">
      Zones
    </Link>
    <span className="text-gray-400">/</span>
    <span className="text-gray-900 font-medium">{zoneName}</span>
  </nav>
);

// Enhanced Elder Card Component
const ElderCard = ({ elder }) => (
  <div className="bg-blue-50 rounded-xl shadow-lg p-8 relative overflow-hidden max-w-sm mx-auto">
    {/* Decorative element */}
    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full -mr-16 -mt-16 opacity-50" />
    
    {/* Content */}
    <div className="relative">
      {/* Zone Elder Badge */}
      <div className="flex justify-center mb-4">
        <div className="inline-flex items-center bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">
          <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
          ZONE ELDER
        </div>
      </div>

      {/* Elder Image with better styling */}
      <div className="w-28 h-28 mx-auto mb-6 rounded-full ring-4 ring-white shadow-xl overflow-hidden bg-gray-100">
        {elder?.image ? (
          <img
            src={elder.image}
            alt={elder.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
            <FaUser className="text-2xl" />
          </div>
        )}
      </div>

      {/* Elder Info */}
      <div className="text-center">
        <h3 className="text-xl font-bold text-gray-900 mb-1">{elder?.name}</h3>
        <p className="text-blue-600 mb-4 font-medium">{elder?.title}</p>
        
        <p className="text-sm text-gray-600 mb-6 leading-relaxed">
          {elder?.bio || "Leading with faith, serving with love, building community together."}
        </p>

        {/* Contact Options */}
        <div className="space-y-3">
          {elder?.contact && (
            <a
              href={`mailto:${elder.contact}`}
              className="flex items-center justify-center space-x-2 bg-white hover:bg-blue-50 rounded-lg p-3 transition-colors duration-200 text-blue-700 shadow-sm"
            >
              <FaEnvelope className="text-sm" />
              <span className="text-sm font-medium">Send Message</span>
            </a>
          )}

          {elder?.phone && (
            <a
              href={`tel:${elder.phone}`}
              className="flex items-center justify-center space-x-2 bg-white hover:bg-green-50 rounded-lg p-3 transition-colors duration-200 text-green-700 shadow-sm"
            >
              <FaPhone className="text-sm" />
              <span className="text-sm font-medium">Call Now</span>
            </a>
          )}
        </div>
      </div>
    </div>
  </div>
);

// Loading Skeleton Component
const CellGroupSkeleton = () => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
    <div className="h-48 bg-gray-200" />
    <div className="p-6">
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-3" />
      <div className="h-3 bg-gray-200 rounded w-1/2 mb-4" />
      <div className="flex gap-2 mb-4">
        <div className="h-6 bg-gray-200 rounded-full w-16" />
        <div className="h-6 bg-gray-200 rounded-full w-16" />
      </div>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-gray-200 rounded-full" />
        <div className="flex-1">
          <div className="h-3 bg-gray-200 rounded w-2/3 mb-1" />
          <div className="h-2 bg-gray-200 rounded w-1/2" />
        </div>
      </div>
      <div className="h-10 bg-gray-200 rounded-lg" />
    </div>
  </div>
);

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


  // State for fallback data
  const [fallbackZone, setFallbackZone] = useState(null);
  const [fallbackCellGroups, setFallbackCellGroups] = useState([]);

  // Use fallback data if API fails
  useEffect(() => {
    if ((zoneError || !zone) && !isLoading) {
      console.log("Using fallback zone data for", zoneId);
      // Find the zone in the mock data - try both id and _id
      const mockZone = zonesData.find(
        (z) => z.id === zoneId || z._id === zoneId
      );
      if (mockZone) {
        console.log("Found fallback zone:", mockZone.name);
        setFallbackZone(mockZone);

        // Find cell groups for this zone - try both zoneId and zone
        const mockCellGroups = cellGroupsData.filter(
          (group) => group.zoneId === zoneId || group.zone === zoneId
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

  // Get all unique tags for filters (must be after displayCellGroups is defined)
  const allTags = [
    ...new Set(displayCellGroups.flatMap((group) => group.tags || [])),
  ];

  // Filter groups based on search and active filters (must be after displayCellGroups is defined)
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

  // Show error state if there's an error or zone not found and no fallback data
  if ((zoneError || !zone) && !isLoading && !fallbackZone) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
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
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 inline-flex items-center"
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

      {/* Uniform Hero Section */}
      {displayZone && (
        <HeroSection
          title={`${displayZone.name} Cell Groups`}
          subtitle="Zone Details"
          description={`Connect with others in ${displayZone.location}. Led by ${displayZone.elder.name}, this zone offers ${displayZone.cellCount || filteredGroups.length} cell groups where you can grow in faith and build lasting friendships.`}
          primaryAccentText="Cell Groups"
          scrollText="EXPLORE CELL GROUPS"
          backgroundImage="/assets/hero-bg.jpg"
        />
      )}

      {/* Zone Info Section */}
      {displayZone && (
        <section className="bg-white py-16">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
              {/* Zone Information */}
              <div className="lg:col-span-2">
                <div className="mb-8">
                  <Breadcrumb zoneName={displayZone.name} />
                  <div className="flex items-center mb-4">
                    <Link
                      to="/cell-groups"
                      className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
                    >
                      <FaArrowLeft className="mr-2" />
                      Back to All Zones
                    </Link>
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">{displayZone.name}</h2>
                  <div className="flex items-center text-gray-600 mb-4">
                    <FaMapMarkerAlt className="mr-2 text-blue-600" />
                        {displayZone.location}
                    </div>
                  <p className="text-gray-700 leading-relaxed">
                    {displayZone.description}
                  </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div className="bg-blue-50 rounded-lg p-6 text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      {displayZone.cellCount || filteredGroups.length}
                    </div>
                    <div className="text-sm text-gray-600 uppercase tracking-wider">
                      Cell Groups
                    </div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-6 text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">127</div>
                    <div className="text-sm text-gray-600 uppercase tracking-wider">
                      Members
                    </div>
                  </div>
            </div>
          </div>

              {/* Elder Card */}
              <div className="lg:col-span-1">
                <ElderCard elder={displayZone.elder} />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Sticky search header */}
      <AnimatePresence>
        {isHeaderSticky && (
          <motion.div
            className="fixed top-0 left-0 right-0 z-50 bg-white shadow-lg py-3 px-4"
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            exit={{ y: -100 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="max-w-7xl mx-auto flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <Link
                  to="/cell-groups"
                  className="flex items-center text-gray-700 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <FaArrowLeft />
                </Link>
                <h2 className="text-xl font-bold text-gray-900">
                  {displayZone ? displayZone.name : "Loading..."} Cell Groups
                </h2>
              </div>
              <div className="flex items-center space-x-4">
                <div className="relative w-64">
                    <input
                      type="text"
                      placeholder="Search..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                    <FaSearch className="absolute left-3 top-3 text-gray-400" />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search and filter section */}
      <section
        id="cell-groups-section"
        ref={searchRef}
        className="container mx-auto px-4 py-16 max-w-7xl"
      >
        <div className="bg-white shadow-lg rounded-lg p-8 mb-12">
        
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Find a Cell Group in{" "}
              {displayZone ? displayZone.name : "this Zone"}
            </h2>

            {/* Enhanced Mobile Search Bar */}
            <div className="w-full md:hidden relative mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search groups, leaders, or locations..."
                  className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all duration-200 bg-white"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <FaSearch className="absolute left-4 top-4 text-gray-400" />
                {search && (
                  <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-3 p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
                  >
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </motion.button>
                )}
              </div>
            </div>

            {/* Desktop Controls */}
            <div className="flex items-center gap-4 w-full md:w-auto">
              {/* Enhanced Desktop Search */}
              <div className="relative w-full md:w-80 hidden md:block">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search groups, leaders, or locations..."
                    className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all duration-200 bg-white"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <FaSearch className="absolute left-4 top-4 text-gray-400" />
                  {search && (
                    <motion.button
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      onClick={() => setSearch("")}
                      className="absolute right-3 top-3 p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
                    >
                      <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </motion.button>
                  )}
                </div>
              </div>

              {/* Filter Button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`py-2.5 px-4 flex items-center gap-2 rounded-lg ${
                  activeFilters.length > 0
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                } transition-colors duration-200`}
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
                  className="flex items-center bg-blue-100 text-blue-800 rounded-full px-4 py-1.5 text-sm"
                >
                  {filter}
                  <button
                    onClick={() => toggleFilter(filter)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
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
                            className={`px-4 py-1.5 text-sm rounded-full ${
                              activeFilters.includes(tag)
                                ? "bg-blue-600 text-white"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            } transition-colors duration-200`}
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
                            className={`px-4 py-1.5 text-sm rounded-full ${
                              activeFilters.includes(day)
                                ? "bg-blue-600 text-white"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            } transition-colors duration-200`}
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
                      className="px-6 py-2.5 bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200 rounded-lg"
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <CellGroupSkeleton key={i} />
              ))}
            </div>
          ) : filteredGroups.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16 bg-white rounded-xl shadow-lg"
            >
              <div className="w-32 h-32 mx-auto mb-8 bg-blue-50 rounded-full flex items-center justify-center">
                <svg className="w-16 h-16 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                No groups match your search
              </h3>
              <p className="text-gray-600 max-w-md mx-auto mb-8 leading-relaxed">
                We couldn't find any cell groups matching your criteria. Try adjusting your search terms or explore other zones to find the perfect community for you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {(search || activeFilters.length > 0) && (
                  <button
                    onClick={() => {
                      setSearch("");
                      setActiveFilters([]);
                    }}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                  >
                    Clear Filters
                  </button>
                )}
                <Link 
                  to="/cell-groups" 
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium"
                >
                  Browse All Zones
                </Link>
              </div>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGroups.map((group, index) => (
                <div
                  key={group.id}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={getImageUrl(group)}
                      alt={group.name}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => toggleFavorite(group.id)}
                      className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white transition-colors duration-200 shadow-md"
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
                            : "text-gray-400"
                        }`}
                      />
                    </button>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
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
                            className="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-800"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                      {group.description}
                    </p>

                    {/* Meeting Information */}
                    <div className="flex justify-between items-center text-sm mb-4">
                      <div className="flex items-center text-gray-700 bg-gray-100 rounded-full px-3 py-1.5">
                        <FaCalendarAlt className="mr-2 text-blue-600" />
                        {group.meetingDay} at {group.meetingTime}
                      </div>
                      {group.capacity && (
                        <span className="text-xs bg-green-100 text-green-800 rounded-full px-3 py-1.5">
                          {group.capacity}
                        </span>
                      )}
                    </div>

                    {/* Cell Leader Information */}
                    <div className="flex items-center mb-4 pb-4 border-b border-gray-100">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex-shrink-0 overflow-hidden mr-3">
                        {group.leaderImage ? (
                          <img
                            src={group.leaderImage}
                            alt={group.leader}
                            className="w-full h-full object-cover"
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
                        <div className="font-medium text-gray-900 text-sm">
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
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center text-sm"
                    >
                      Join this cell group
                      <FaArrowRight className="ml-2" />
                    </button>
                  </div>
                </div>
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
