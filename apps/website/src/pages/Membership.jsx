import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet";
import PlaceHolderbanner from "../assets/ministry-banners/ph.png";
import FallbackImage from "../assets/fallback-image.png";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaChevronDown,
  FaChevronRight,
  FaUserPlus,
  FaSync,
  FaQuestion,
  FaCheckCircle,
  FaAngleDown,
  FaRegLightbulb,
  FaStar,
  FaCertificate,
  FaCalendarCheck,
  FaUserFriends,
  FaClipboardList,
} from "react-icons/fa";

const Membership = () => {
  const location = useLocation();
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [activeSection, setActiveSection] = useState("overview");
  const [expandedFaq, setExpandedFaq] = useState(null);

  // Scroll effect for parallax
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToContent = () => {
    document
      .getElementById("membership-content-section")
      .scrollIntoView({ behavior: "smooth" });
  };

  // FAQ items
  const faqItems = [
    {
      question: "Is membership mandatory to attend church?",
      answer:
        "No, membership is not required to attend services or most activities. However, it is required for leadership roles, voting in church matters, and certain ministry participation.",
    },
    {
      question: "How long does it take to become a member?",
      answer:
        "The Foundation Classes typically take 4 weeks to complete (one class per week). After completion, you'll submit your application and attend a brief orientation. The entire process usually takes 5-6 weeks.",
    },
    {
      question: "Can I retake Foundation Classes?",
      answer:
        "Yes, Foundation Classes are offered quarterly. You can attend again as a refresher or if you missed some sessions previously.",
    },
    {
      question: "What are the benefits of membership renewal?",
      answer:
        "Renewing your membership maintains your voting rights, leadership eligibility, and access to member-only resources and discounts for church events and programs.",
    },
    {
      question: "When is the deadline for membership renewal?",
      answer:
        "Annual renewals should be completed before March 31st each year to maintain your membership status without interruption.",
    },
  ];

  // Steps for becoming a member
  const membershipSteps = [
    {
      title: "Attend Classes",
      description: "Complete all 4 Foundation Classes",
      icon: <FaClipboardList />,
    },
    {
      title: "Apply",
      description: "Submit membership application form",
      icon: <FaUserPlus />,
    },
    {
      title: "Orientation",
      description: "Attend a brief orientation session",
      icon: <FaUserFriends />,
    },
    {
      title: "Welcome",
      description: "Receive official membership welcome",
      icon: <FaCheckCircle />,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100">
      {/* SEO Meta Tags */}
      <Helmet>
        <title>Membership & Renewal - Victory Bible Church Kitwe</title>
        <meta
          name="description"
          content="Learn about membership at Victory Bible Church Kitwe, how to become a member through Foundation Classes, and membership renewal benefits and process."
        />
      </Helmet>

      {/* Hero Section with enhanced parallax and animations */}
      <section className="relative overflow-hidden rounded-b-3xl h-[90vh]">
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
            transform: `translateY(${scrollY * 0.4}px)`,
          }}
          initial={{ scale: 1.1 }}
          animate={{ scale: 1.05 }}
          transition={{ duration: 12, repeat: Infinity, repeatType: "reverse" }}
          onLoad={() => setIsImageLoaded(true)}
          aria-label="Hero background image"
        >
          <img
            src={PlaceHolderbanner}
            alt="Victory Bible Church banner"
            className="hidden"
            onLoad={() => setIsImageLoaded(true)}
            onError={() => setIsImageLoaded(true)}
          />
        </motion.div>

        {/* Enhanced gradient overlay with better color blending */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/85 via-purple-900/75 to-blue-900/85"></div>

        {/* Animated particles with improved variety */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white/10"
              style={{
                width: Math.random() * 120 + 50,
                height: Math.random() * 120 + 50,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [Math.random() * 100, Math.random() * -100],
                x: [Math.random() * 50, Math.random() * -50],
                opacity: [0.1, 0.4, 0.1],
              }}
              transition={{
                duration: Math.random() * 12 + 10,
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
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="inline-block mb-6"
            >
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full">
                <FaCertificate className="text-yellow-400 text-4xl md:text-5xl" />
              </div>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight">
              Become a{" "}
              <span className="text-yellow-400 relative">
                Member
                <motion.span
                  className="absolute bottom-1 left-0 h-1 bg-yellow-400"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                />
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-100 max-w-2xl mx-auto leading-relaxed font-light">
              Join our vibrant community and be part of something greater
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="mt-10"
            >
              <Link
                to="/foundation-classes"
                className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold px-8 py-4 rounded-full inline-flex items-center space-x-2 transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                <span>Start Your Membership Journey</span>
                <FaChevronRight />
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            className="absolute bottom-10 cursor-pointer bg-white/20 hover:bg-white/30 p-3 rounded-full backdrop-blur-sm transition-all duration-300"
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            onClick={scrollToContent}
            onKeyDown={(e) => e.key === "Enter" && scrollToContent()}
            role="button"
            tabIndex={0}
            aria-label="Scroll to membership information"
            whileHover={{ scale: 1.1 }}
          >
            <FaChevronDown className="text-white text-xl" />
          </motion.div>
        </div>
      </section>

      {/* Sticky Navigation Tabs */}
      <div className="sticky top-0 z-50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-md px-4 py-3 -mt-2 rounded-b-xl">
        <div className="container mx-auto flex justify-center gap-4 overflow-x-auto no-scrollbar">
          {[
            { id: "overview", label: "Overview", icon: <FaRegLightbulb /> },
            { id: "new-members", label: "New Members", icon: <FaUserPlus /> },
            { id: "renewal", label: "Renewal", icon: <FaSync /> },
            { id: "faq", label: "FAQs", icon: <FaQuestion /> },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                document
                  .getElementById(item.id)
                  .scrollIntoView({ behavior: "smooth" });
                setActiveSection(item.id);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 whitespace-nowrap ${
                activeSection === item.id
                  ? "bg-indigo-600 text-white"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Section - Redesigned with improved layout */}
      <div
        id="membership-content-section"
        className="container mx-auto px-4 py-20 max-w-6xl"
      >
        {/* Overview Section */}
        <motion.section
          id="overview"
          className="mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-8 md:p-12 text-white">
                <h2 className="text-3xl font-bold mb-6">Membership Overview</h2>
                <p className="text-lg leading-relaxed mb-6">
                  At Victory Bible Church, membership represents a commitment to
                  our shared values, mission, and community. It's more than just
                  attendance—it's belonging to a family.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <FaCheckCircle className="text-yellow-300 text-xl mt-1 flex-shrink-0" />
                    <p>
                      Complete Foundation Classes to establish a strong biblical
                      foundation
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <FaCheckCircle className="text-yellow-300 text-xl mt-1 flex-shrink-0" />
                    <p>
                      Renew annually to maintain your membership status and
                      privileges
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <FaCheckCircle className="text-yellow-300 text-xl mt-1 flex-shrink-0" />
                    <p>
                      Engage in church activities, ministries, and
                      decision-making
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm p-8 md:p-12 flex items-center justify-center">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 text-white w-full">
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <FaStar className="text-yellow-300 mr-2" /> Membership
                    Benefits
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start space-x-3">
                      <div className="h-6 w-6 rounded-full bg-indigo-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-sm font-bold">1</span>
                      </div>
                      <span className="text-white/90">
                        Voting rights in church decisions
                      </span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="h-6 w-6 rounded-full bg-indigo-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-sm font-bold">2</span>
                      </div>
                      <span className="text-white/90">
                        Eligibility for leadership roles
                      </span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="h-6 w-6 rounded-full bg-indigo-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-sm font-bold">3</span>
                      </div>
                      <span className="text-white/90">
                        Discounts on church events and retreats
                      </span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="h-6 w-6 rounded-full bg-indigo-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-sm font-bold">4</span>
                      </div>
                      <span className="text-white/90">
                        Access to members-only resources
                      </span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="h-6 w-6 rounded-full bg-indigo-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-sm font-bold">5</span>
                      </div>
                      <span className="text-white/90">
                        Special pastoral support and care
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* New Members Section with timeline visualization */}
        <motion.section
          id="new-members"
          className="mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white">
              <h2 className="text-3xl font-bold">Becoming a Member</h2>
              <p className="mt-2 opacity-80">
                Your step-by-step guide to joining our church family
              </p>
            </div>

            <div className="p-8 md:p-12">
              {/* Timeline visualization */}
              <div className="relative">
                <div className="absolute left-6 top-0 bottom-0 w-1 bg-indigo-100 dark:bg-gray-700 hidden md:block"></div>

                <div className="space-y-12 relative">
                  {membershipSteps.map((step, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="flex flex-col md:flex-row md:items-center gap-4"
                    >
                      <div className="md:w-32 flex-shrink-0 flex justify-center">
                        <div className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xl shadow-lg z-10">
                          {step.icon}
                        </div>
                      </div>
                      <div className="flex-grow bg-indigo-50 dark:bg-gray-700 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
                        <h3 className="text-xl font-semibold text-indigo-700 dark:text-indigo-300 mb-2">
                          {step.title}
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300">
                          {step.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="mt-12 flex flex-col items-center text-center">
                <p className="text-gray-700 dark:text-gray-300 mb-6 max-w-2xl">
                  Ready to take the first step? Our Foundation Classes will help you establish a biblical foundation and prepare you for membership.
                </p>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 shadow-md hover:shadow-xl"
                  >
                    <FaQuestion className="text-xl" />
                    <span>Questions About Classes?</span>
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Renewal Section with improved visualization and added FAQ */}
        <motion.section
          id="renewal"
          className="mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-8 text-white">
              <h2 className="text-3xl font-bold">Membership Renewal</h2>
              <p className="mt-2 opacity-80">
                Keep your membership active and enjoy continued benefits
              </p>
            </div>

            <div className="p-8 md:p-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div>
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-gray-700 flex items-center justify-center mr-3">
                      <FaSync className="text-purple-600 dark:text-purple-400" />
                    </div>
                    Why Renew?
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-6">
                    Renewing your membership before March 31st each year helps
                    you maintain all the benefits and privileges of being an
                    active church member.
                  </p>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <FaCheckCircle className="text-green-600 dark:text-green-400 text-sm" />
                      </div>
                      <div>
                        <h4 className="font-medium">Voting Rights</h4>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                          Participate in important church decisions
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <FaCheckCircle className="text-green-600 dark:text-green-400 text-sm" />
                      </div>
                      <div>
                        <h4 className="font-medium">Leadership Eligibility</h4>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                          Serve in ministry leadership positions
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <FaCheckCircle className="text-green-600 dark:text-green-400 text-sm" />
                      </div>
                      <div>
                        <h4 className="font-medium">Member Discounts</h4>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                          Special rates for retreats and events
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Added FAQ about renewal deadline */}
                  <div className="mt-8 p-4 border border-purple-200 dark:border-purple-900 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                    <h4 className="font-semibold flex items-center mb-2">
                      <FaQuestion className="text-purple-600 dark:text-purple-400 mr-2" />
                      When is the renewal deadline?
                    </h4>
                    <p className="text-gray-700 dark:text-gray-300">
                      Annual renewals should be completed before March 31st each year to maintain your membership status without interruption.
                    </p>
                  </div>
                </div>

                <div className="bg-purple-50 dark:bg-gray-700 rounded-xl p-6 md:p-8 flex flex-col justify-center">
                  <div className="text-center mb-6">
                    <div className="inline-block p-3 rounded-full bg-purple-100 dark:bg-purple-800 mb-4">
                      <FaCalendarCheck className="text-purple-600 dark:text-purple-300 text-3xl" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                      Ready to Renew?
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mt-2">
                      Complete your annual renewal in just a few minutes
                    </p>
                  </div>

                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between">
                        <span className="text-gray-700 dark:text-gray-300">
                          Renewal Deadline
                        </span>
                        <span className="font-semibold">March 31st</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700 dark:text-gray-300">
                          Process Time
                        </span>
                        <span className="font-semibold">5 minutes</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700 dark:text-gray-300">
                          Required Documents
                        </span>
                        <span className="font-semibold">None</span>
                      </div>
                    </div>

                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      className="mt-6"
                    >
                      <Link
                        to="/renew"
                        className="block w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold text-center px-6 py-3 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
                      >
                        Renew Your Membership
                      </Link>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* FAQ Section with accordion - Modified by removing the renewal deadline question */}
        <motion.section
          id="faq"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-gray-700 to-gray-900 p-8 text-white">
              <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
              <p className="mt-2 opacity-80">
                Find answers to common membership questions
              </p>
            </div>

            <div className="p-8 md:p-12 divide-y divide-gray-200 dark:divide-gray-700">
              {/* Filtering out the renewal deadline question since we'll move it to the renewal section */}
              {faqItems.filter(item => !item.question.includes("deadline")).map((item, index) => (
                <div key={index} className="py-4">
                  <button
                    className="flex justify-between items-center w-full text-left font-medium text-lg py-2"
                    onClick={() =>
                      setExpandedFaq(expandedFaq === index ? null : index)
                    }
                    aria-expanded={expandedFaq === index}
                  >
                    <span className="pr-8">{item.question}</span>
                    <motion.div
                      animate={{ rotate: expandedFaq === index ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <FaAngleDown className="text-indigo-600 dark:text-indigo-400 text-xl" />
                    </motion.div>
                  </button>

                  <AnimatePresence>
                    {expandedFaq === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <p className="pt-4 pb-2 text-gray-600 dark:text-gray-300">
                          {item.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 p-8 text-center">
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                Still have questions about membership? We're here to help!
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 border-2 border-gray-700 dark:border-gray-300 text-gray-700 dark:text-gray-300 font-medium rounded-full hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-300"
              >
                Contact Us For More Information
              </Link>
            </div>
          </div>
        </motion.section>

        {/* Replacing Testimonial Section and Final CTA with a Combined Section */}
        <motion.section
          className="mt-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Testimonial Side */}
              <div className="p-10 text-white">
                <blockquote>
                  <div className="text-5xl text-indigo-300 mb-4">"</div>
                  <p className="text-xl italic mb-6">
                    Becoming a member of Victory Bible Church has connected me with
                    a loving community that supports my spiritual growth. The
                    Foundation Classes gave me a strong biblical foundation, and I'm
                    thankful to be part of this church family.
                  </p>
                  <footer className="text-indigo-200">
                    <cite>— Maria Mulenga, Member since 2022</cite>
                  </footer>
                </blockquote>
              </div>
              
              {/* CTA Side */}
              <div className="bg-white/10 backdrop-blur-sm p-8 md:p-10 flex flex-col justify-center">
                <h2 className="text-3xl font-bold text-white mb-4">
                  Ready to Join Our Community?
                </h2>
                <p className="text-gray-100 mb-6">
                  Take the first step toward becoming a member of Victory Bible
                  Church today. We look forward to welcoming you into our family.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link
                    to="/foundation-classes"
                    className="inline-flex items-center gap-2 bg-white hover:bg-gray-100 text-indigo-700 font-semibold px-6 py-3 rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg"
                  >
                    <FaUserPlus />
                    <span>Register for Next Class</span>
                  </Link>
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-2 border-2 border-white text-white hover:bg-white/10 font-semibold px-6 py-3 rounded-lg transition-colors duration-300"
                  >
                    <FaQuestion />
                    <span>Ask Questions</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default Membership;
