import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  FaSearch,
  FaMapMarkerAlt,
  FaUser,
  FaUsers,
  FaArrowRight,
  FaHome,
  FaHeart,
  FaHandsHelping,
  FaPray,
  FaBible,
} from "react-icons/fa";
import FallbackImage from "../assets/fallback-image.png";
import zonesData from "../data/zonesData";
import { useZonesQuery } from "../hooks/useZonesQuery";
import HeroSection from "../components/common/HeroSection";

const ZonesPage = () => {
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

      {/* Uniform Hero Section */}
      <HeroSection
        title="Find Your Community"
        subtitle="Church Zones"
        description="Connect with others in your area through our church zones. Each zone is led by a dedicated elder and contains cell groups where you can grow in faith and build lasting friendships."
        primaryAccentText="Community"
        scrollText="EXPLORE OUR ZONES"
        backgroundImage="/assets/hero-bg.jpg"
      />

      {/* Zones Section */}
      <section className="container mx-auto px-4 py-16 max-w-7xl">
        <div className="bg-white shadow-lg rounded-lg p-8 mb-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Find Your Zone</h2>

            {/* Search Bar */}
            <div className="relative w-full md:w-64">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search zones..."
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              Our church family is organized into zones across different areas, each lovingly led by a 
              dedicated elder. These zones help us build meaningful relationships and provide pastoral 
              care right in your neighborhood. Find a zone near you and discover the cell groups where 
              you can connect, grow, and belong.
            </p>
          </div>
        </div>

        {/* Zones Grid */}
        <div className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900">
              {filteredZones.length} Church Zones
            </h3>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
            </div>
          ) : filteredZones.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-lg shadow-md">
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
                  className="mt-6 px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200"
                >
                  Clear search
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredZones.map((zone, index) => (
                <div
                  key={zone.id}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={zone.coverImage || FallbackImage}
                      alt={zone.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = FallbackImage;
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
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
                    <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                      {zone.description}
                    </p>

                    {/* Elder Information */}
                    <div className="flex items-center mb-4 pb-4 border-b border-gray-100">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex-shrink-0 overflow-hidden mr-3">
                        {zone.elder.image ? (
                          <img
                            src={zone.elder.image}
                            alt={zone.elder.name}
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
                          {zone.elder.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {zone.elder.title}
                        </div>
                      </div>
                    </div>

                    {/* Cell Group Count */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center text-gray-600 text-sm">
                        <FaUsers className="mr-2 text-blue-600" />
                        {zone.cellCount} Cell Groups
                      </div>
                    </div>

                    {/* View Zone Button */}
                    <Link
                      to={`/cell-groups/${zone._id || zone.id}`}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center text-sm"
                    >
                      View Cell Groups
                      <FaArrowRight className="ml-2" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ZonesPage;