import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet"; // Added for SEO
import PlaceHolderbanner from "../assets/ministry-banners/ph.png";
import FallbackImage from "../assets/fallback-image.png"; // Added fallback image
import { motion } from "framer-motion";
import {
  FaChevronDown,
  FaPlay,
  FaUsers,
  FaChurch,
  FaBookOpen,
  FaHeart,
} from "react-icons/fa";

// Reusable NavCard Component
const NavCard = ({ label, icon, path, activeTab }) => (
  <Link
    to={path}
    className={`flex items-center justify-center flex-col md:flex-row md:justify-start text-lg font-semibold transition-all duration-300 px-6 py-4 rounded-xl ${
      activeTab === path
        ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white transform shadow-lg"
        : "hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 hover:shadow"
    }`}
    aria-label={`Navigate to ${label}`} // Accessibility improvement
  >
    <div
      className={`${
        activeTab === path ? "text-white" : "text-blue-600 dark:text-blue-400"
      } mb-2 md:mb-0 md:mr-3`}
    >
      {icon}
    </div>
    {label}
  </Link>
);

// Reusable StatCard Component
const StatCard = ({ number, label, color, index }) => (
  <motion.div
    className="bg-gray-50 dark:bg-gray-900 rounded-2xl shadow-lg p-8 text-center"
    whileHover={{ y: -10 }}
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    viewport={{ once: true }}
  >
    <div
      className={`text-5xl font-bold mb-2 bg-gradient-to-r ${color} inline-block text-transparent bg-clip-text`}
    >
      {number}
    </div>
    <div className="text-gray-600 dark:text-gray-400 text-lg">{label}</div>
  </motion.div>
);

const AboutUs = () => {
  const location = useLocation();
  const activeTab = location.pathname;
  const [isImageLoaded, setIsImageLoaded] = useState(false); // Loading state

  const scrollToContent = () => {
    document
      .getElementById("nav-section")
      .scrollIntoView({ behavior: "smooth" });
  };

  // Navigation links data
  const navItems = [
    { label: "Our Story", icon: <FaChurch size={20} /> },
    { label: "Leadership Team", icon: <FaUsers size={20} /> },
    { label: "Vision & Mission", icon: <FaBookOpen size={20} /> },
    { label: "What We Believe", icon: <FaHeart size={20} /> },
  ];

  // Stats data
  const stats = [
    {
      number: "25+",
      label: "Years of Service",
      color: "from-blue-500 to-blue-600",
    },
    {
      number: "1,200+",
      label: "Church Members",
      color: "from-yellow-500 to-yellow-600",
    },
    {
      number: "30+",
      label: "Community Programs",
      color: "from-green-500 to-green-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100">
      {/* SEO Meta Tags */}
      <Helmet>
        <title>About Us - Victory Bible Church</title>
        <meta
          name="description"
          content="Learn about Victory Bible Church: our story, leadership, vision, mission, and beliefs."
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
          onLoad={() => setIsImageLoaded(true)} // Update loading state
          aria-label="Hero background image" // Accessibility
        >
          <img
            src={PlaceHolderbanner}
            alt="Victory Bible Church banner"
            className="hidden"
            onLoad={() => setIsImageLoaded(true)}
            onError={() => setIsImageLoaded(true)} // Fallback on error
          />
        </motion.div>

        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 via-purple-900/70 to-blue-900/80"></div>

        {/* Reduced decorative elements for performance */}
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

        <div className="container mx-auto px-4 relative z-10 h-full flex flex-col justify-center items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight">
              About <span className="text-yellow-400">Us</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-100 max-w-2xl mx-auto leading-relaxed font-light">
              Get to know Victory Bible Church: our story, leadership, vision,
              mission, and beliefs.
            </p>
            <motion.div
              className="h-1 bg-yellow-400 mx-auto mt-8"
              initial={{ width: 0 }}
              animate={{ width: 100 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            />
          </motion.div>

          <motion.div
            className="absolute bottom-10 cursor-pointer"
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            onClick={scrollToContent}
            onKeyDown={(e) => e.key === "Enter" && scrollToContent()} // Accessibility
            role="button"
            tabIndex={0}
            aria-label="Scroll to content"
          >
            <FaChevronDown className="text-white text-3xl" />
          </motion.div>
        </div>
      </section>

      {/* Navigation Section */}
      <div id="nav-section" className="relative">
        <div className="container mx-auto px-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl -mt-16 relative z-20 p-6">
            <nav className="flex flex-wrap justify-center gap-4">
              {navItems.map(({ label, icon }) => {
                const path = `/about/${label
                  .toLowerCase()
                  .replace(/ & /g, "-")
                  .replace(/ /g, "-")}`;
                return (
                  <NavCard
                    key={path}
                    label={label}
                    icon={icon}
                    path={path}
                    activeTab={activeTab}
                  />
                );
              })}
            </nav>
          </div>
        </div>

        {/* Why We Exist Section */}
        <section className="py-16 px-6 mt-12">
          <motion.div
            className="container mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/3 bg-gradient-to-br from-blue-600 to-blue-800 p-8 flex items-center justify-center">
                <h2 className="text-3xl font-bold text-white">Why We Exist</h2>
              </div>
              <div className="md:w-2/3 p-8 md:p-12">
                <p className="text-2xl text-gray-700 dark:text-gray-300 leading-relaxed font-light">
                  ...to{" "}
                  <span className="font-bold text-blue-600 dark:text-blue-400">
                    BE WITH JESUS
                  </span>
                  ,
                  <span className="font-bold text-blue-600 dark:text-blue-400">
                    {" "}
                    BECOME LIKE JESUS
                  </span>
                  , and
                  <span className="font-bold text-blue-600 dark:text-blue-400">
                    {" "}
                    CARRY ON THE MISSION OF JESUS
                  </span>{" "}
                  TO THE WORLD.
                </p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Video Section */}
        <section className="py-16 px-6 bg-gray-100 dark:bg-gray-900 rounded-t-3xl -mt-6">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold inline-block relative">
                More About Us
                <motion.div
                  className="h-1 bg-gradient-to-r from-yellow-400 to-yellow-500 absolute -bottom-2 left-0"
                  initial={{ width: 0 }}
                  whileInView={{ width: "100%" }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                />
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
              <motion.div
                className="w-full aspect-video bg-gray-800 rounded-2xl shadow-lg overflow-hidden relative group"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="flex items-center justify-center h-full">
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="bg-white/20 backdrop-blur-md p-4 rounded-full mb-4 group-hover:bg-yellow-500 transition-colors duration-300">
                      <FaPlay className="text-white text-2xl" />
                    </div>
                    <p className="text-white text-center px-4 font-medium">
                      Church Life & Community Video (Coming Soon)
                    </p>
                  </div>
                </div>
              </motion.div>

              <div className="flex flex-col justify-center">
                <h3 className="text-2xl font-semibold mb-4 text-blue-700 dark:text-blue-400">
                  Our Community & Life at Victory Bible Church
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                  At Victory Bible Church, we believe in creating a vibrant,
                  welcoming community where everyone can experience God's love.
                  Our diverse congregation comes together not just for Sunday
                  services, but throughout the week for small groups, outreach
                  events, and fellowship activities.
                </p>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/media"
                    className="mt-6 inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-full transition-all duration-300 hover:shadow-lg"
                  >
                    Explore more media content
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 px-6 bg-white dark:bg-gray-800">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {stats.map((stat, index) => (
                <StatCard
                  key={index}
                  number={stat.number}
                  label={stat.label}
                  color={stat.color}
                  index={index}
                />
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutUs;
