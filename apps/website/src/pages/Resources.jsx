import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import HeroSection from "../components/common/HeroSection";
import {
  Book,
  Users,
  Presentation,
  Book as BookAlt,
  Download,
  Eye,
  Search,
  Filter,
  FileText,
  Video,
  Music,
  Link as LinkIcon,
  Image,
  FileText as FilePPT,
  Star,
  X,
  ChevronDown,
} from "lucide-react";

// Static navigation cards for main resource categories
const resourceCategories = [
  {
    path: "/foundation-classes",
    title: "Foundation Classes",
    description: "Learn the core beliefs of our church",
    icon: <Book className="text-blue-600 dark:text-blue-300 text-4xl" />,
    color: "blue",
  },
  {
    path: "/discipleship-classes",
    title: "Discipleship Classes",
    description: "Deepen your faith and walk with Christ",
    icon: (
      <Presentation className="text-purple-600 dark:text-purple-300 text-4xl" />
    ),
    color: "purple",
  },
  {
    path: "/resources/leadership-training",
    title: "Leadership Training",
    description: "Grow as a leader in ministry",
    icon: <Users className="text-green-600 dark:text-green-300 text-4xl" />,
    color: "green",
  },
  {
    path: "/resources/bible-study",
    title: "Bible Study Guides",
    description: "Explore scripture with structured lessons",
    icon: <Book className="text-yellow-600 dark:text-yellow-300 text-4xl" />,
    color: "yellow",
  },
];

const typeIcons = {
  document: <FileText />,
  video: <Video />,
  audio: <Music />,
  link: <LinkIcon />,
  image: <Image />,
  presentation: <FileText />,
};

const categoryColors = {
  audio_sermons: "green",
  foundation: "blue",
  discipleship: "purple",
  leadership: "green",
  ministry: "indigo",
  bible_study: "yellow",
  worship: "pink",
  general: "gray",
};

const CategoryCard = ({ resource, index }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: index * 0.1 }}
    whileHover={{ scale: 1.05 }}
    className="h-full"
  >
    <Link
      to={resource.path}
      className="group block h-full rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 bg-white dark:bg-gray-800 p-6 flex flex-col items-center text-center"
    >
      <div className="mb-4">{resource.icon}</div>
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 transition-colors group-hover:text-blue-600">
        {resource.title}
      </h2>
      <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">
        {resource.description}
      </p>
    </Link>
  </motion.div>
);

const ResourceItem = ({ resource, index }) => {
  const handleDownload = async (e) => {
    e.preventDefault();
    if (resource.isDownloadable) {
      window.open(`/api/resources/${resource._id}/download`, "_blank");
    } else if (resource.url) {
      window.open(resource.url, "_blank");
    }
  };

  const categoryColor = categoryColors[resource.category] || "gray";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div
              className={`text-${categoryColor}-600 dark:text-${categoryColor}-400 text-xl`}
            >
              {typeIcons[resource.type] || <FileText />}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {resource.title}
              </h3>
              <div className="flex items-center space-x-2 mt-1">
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full bg-${categoryColor}-100 text-${categoryColor}-800 dark:bg-${categoryColor}-900 dark:text-${categoryColor}-200`}
                >
                  {resource.category.replace("_", " ")}
                </span>
                {resource.featured && (
                  <Star className="text-yellow-500 text-sm" />
                )}
              </div>
            </div>
          </div>

          <button
            onClick={handleDownload}
            className="flex items-center space-x-1 px-3 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
          >
            {resource.type === "link" ? <Eye /> : <Download />}
            <span>{resource.type === "link" ? "View" : "Download"}</span>
          </button>
        </div>

        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
          {resource.description}
        </p>

        {resource.tags && resource.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {resource.tags.map((tag, i) => (
              <span
                key={i}
                className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <Eye className="mr-1" />
              {resource.views || 0}
            </span>
            <span className="flex items-center">
              <Download className="mr-1" />
              {resource.downloads || 0}
            </span>
            {resource.fileSizeFormatted && (
              <span>{resource.fileSizeFormatted}</span>
            )}
          </div>

          {resource.author && <span>by {resource.author.name}</span>}
        </div>
      </div>
    </motion.div>
  );
};

const Resources = () => {
  const [resources, setResources] = useState([]);
  const [featuredResources, setFeaturedResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchResources();
    fetchFeaturedResources();
  }, []);

  const fetchResources = async () => {
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      if (selectedCategory) params.append("category", selectedCategory);
      if (selectedType) params.append("type", selectedType);

      const response = await fetch(`/api/resources?${params}`);
      const data = await response.json();

      if (data.success) {
        setResources(data.data);
      }
    } catch (error) {
      console.error("Error fetching resources:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFeaturedResources = async () => {
    try {
      const response = await fetch("/api/resources/featured/list");
      const data = await response.json();

      if (data.success) {
        setFeaturedResources(data.data);
      }
    } catch (error) {
      console.error("Error fetching featured resources:", error);
    }
  };

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      fetchResources();
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [searchTerm, selectedCategory, selectedType]);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setSelectedType("");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Helmet>
        <title>Church Resources - Victory Bible Church</title>
        <meta
          name="description"
          content="Access church resources, foundation class materials, discipleship guides, and more at Victory Bible Church."
        />
      </Helmet>

      {/* Hero Section */}
      <HeroSection
        title="Church Resources"
        subtitle="Resources"
        description="Explore foundational materials, discipleship guides, and leadership resources to deepen your faith and grow in Christ."
        primaryAccentText="Resources"
        scrollText="EXPLORE RESOURCES"
        backgroundImage="/assets/hero-bg.jpg"
      />

      <div className="py-20 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto"
        >
          {/* Main Category Navigation */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
              Explore Our Programs
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {resourceCategories.map((resource, index) => (
                <CategoryCard
                  key={resource.path}
                  resource={resource}
                  index={index}
                />
              ))}
            </div>
          </section>

          {/* Featured Resources */}
          {featuredResources.length > 0 && (
            <section className="mb-16">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
                Featured Resources
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredResources.slice(0, 6).map((resource, index) => (
                  <ResourceItem
                    key={resource._id}
                    resource={resource}
                    index={index}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Search and Filter Section */}
          <section className="mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <div className="flex flex-col md:flex-row gap-4 items-center">
                {/* Search Bar */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search resources..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                {/* Filter Toggle */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <Filter />
                  <span>Filters</span>
                  <ChevronDown
                    className={`transform transition-transform ${showFilters ? "rotate-180" : ""}`}
                  />
                </button>

                {/* Clear Filters */}
                {(searchTerm || selectedCategory || selectedType) && (
                  <button
                    onClick={clearFilters}
                    className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                  >
                    <X />
                    <span>Clear</span>
                  </button>
                )}
              </div>

              {/* Filter Options */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden mt-4 pt-4 border-t border-gray-200 dark:border-gray-600"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Category
                        </label>
                        <select
                          value={selectedCategory}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                          <option value="">All Categories</option>
                          <option value="audio_sermons">Audio Sermons</option>
                          <option value="foundation">Foundation</option>
                          <option value="discipleship">Discipleship</option>
                          <option value="leadership">Leadership</option>
                          <option value="ministry">Ministry</option>
                          <option value="bible_study">Bible Study</option>
                          <option value="worship">Worship</option>
                          <option value="general">General</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Type
                        </label>
                        <select
                          value={selectedType}
                          onChange={(e) => setSelectedType(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                          <option value="">All Types</option>
                          <option value="document">Documents</option>
                          <option value="video">Videos</option>
                          <option value="audio">Audio</option>
                          <option value="presentation">Presentations</option>
                          <option value="image">Images</option>
                          <option value="link">Links</option>
                        </select>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </section>

          {/* Resources Grid */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                All Resources
              </h2>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {resources.length} resources found
              </span>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600 dark:text-gray-400">
                  Loading resources...
                </p>
              </div>
            ) : resources.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-400">
                  No resources found matching your criteria.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {resources.map((resource, index) => (
                  <ResourceItem
                    key={resource._id}
                    resource={resource}
                    index={index}
                  />
                ))}
              </div>
            )}
          </section>
        </motion.div>
      </div>
    </div>
  );
};

export default Resources;
