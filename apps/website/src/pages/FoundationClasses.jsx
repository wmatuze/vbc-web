import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import PlaceHolderbanner from "../assets/ministry-banners/ph.png";
import FallbackImage from "../assets/fallback-image.png";
import { registerForFoundationClass } from "../services/api";
import {
  FaBookOpen,
  FaCalendarAlt,
  FaChevronRight,
  FaClipboardList,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaPray,
  FaBible,
  FaHandHoldingHeart,
  FaChurch,
  FaCheckCircle,
  FaAngleDown,
  FaGraduationCap,
} from "react-icons/fa";

const FoundationClasses = () => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    preferredSession: "",
    questions: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Class curriculum data
  const classSessions = [
    {
      week: 1,
      title: "Understanding Salvation and Church Basics",
      description:
        "Explore the fundamentals of salvation, the significance of being born again, and the purpose of the local church in a believer's life.",
      topics: [
        "The plan of salvation",
        "What it means to be born again",
        "The purpose of the local church",
        "Introduction to our church's history",
      ],
      icon: <FaPray className="text-blue-500" />,
    },
    {
      week: 2,
      title: "Bible Study Methods and Prayer Life",
      description:
        "Learn practical methods for effective Bible study and develop a consistent prayer life that deepens your relationship with God.",
      topics: [
        "How to study the Bible effectively",
        "Understanding different Bible translations",
        "Developing a consistent prayer life",
        "Types of prayer",
      ],
      icon: <FaBible className="text-blue-500" />,
    },
    {
      week: 3,
      title: "Spiritual Gifts and Service",
      description:
        "Discover your unique spiritual gifts and learn how to use them effectively in serving within the church community.",
      topics: [
        "Understanding spiritual gifts",
        "Identifying your spiritual gifts",
        "Areas of service in the church",
        "The importance of volunteering",
      ],
      icon: <FaHandHoldingHeart className="text-blue-500" />,
    },
    {
      week: 4,
      title: "Church Mission and Membership Responsibilities",
      description:
        "Understand our church's mission and vision, and learn about the expectations and benefits of becoming an active member.",
      topics: [
        "Church mission and vision",
        "Membership responsibilities",
        "Financial stewardship",
        "Next steps after membership",
      ],
      icon: <FaChurch className="text-blue-500" />,
    },
  ];

  // Upcoming class schedule
  const upcomingClasses = [
    {
      startDate: "January 7, 2024",
      endDate: "January 28, 2024",
      day: "Sundays",
      time: "9:00 AM - 10:30 AM",
      location: "Room 201",
      spotsLeft: 12,
    },
    {
      startDate: "February 4, 2024",
      endDate: "February 25, 2024",
      day: "Sundays",
      time: "9:00 AM - 10:30 AM",
      location: "Room 201",
      spotsLeft: 15,
    },
    {
      startDate: "April 3, 2024",
      endDate: "April 24, 2024",
      day: "Wednesdays",
      time: "6:30 PM - 8:00 PM",
      location: "Room 105",
      spotsLeft: 20,
    },
  ];

  // FAQ data
  const faqItems = [
    {
      question: "Do I need to attend all four classes?",
      answer:
        "Yes, attendance at all four classes is required to complete the Foundation Classes series. Each class builds on the previous one to provide a comprehensive foundation for your faith and church membership.",
    },
    {
      question: "What if I miss a class?",
      answer:
        "If you miss a class, you can make it up during the next Foundation Classes series. We understand that emergencies happen, and our team will work with you to ensure you can complete all four sessions.",
    },
    {
      question: "Is childcare provided during the classes?",
      answer:
        "Yes, childcare is provided for children ages 0-10 during the Sunday morning sessions. Please indicate on your registration form if you will need childcare services.",
    },
    {
      question: "Do I need to bring anything to the classes?",
      answer:
        "We recommend bringing a Bible, notebook, and pen. We will provide all other materials, including a Foundation Classes workbook.",
    },
    {
      question: "Is there a fee for the classes?",
      answer:
        "No, Foundation Classes are offered free of charge as part of our ministry to help people grow in their faith and become connected to our church family.",
    },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error when field is being edited
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null,
      });
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.fullName.trim()) {
      errors.fullName = "Full name is required";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required";
    }

    if (!formData.preferredSession.trim()) {
      errors.preferredSession = "Please select a preferred session";
    }

    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setSubmitting(true);

    // Send data to the backend API using the API service
    registerForFoundationClass(formData)
      .then((data) => {
        console.log("Registration submitted successfully:", data);
        setFormSubmitted(true);
        setSubmitting(false);
      })
      .catch((error) => {
        console.error("Error submitting registration form:", error);
        setSubmitting(false);
        // Could add error state handling here
        alert("There was a problem submitting your form. Please try again.");
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100">
      {/* SEO Meta Tags */}
      <Helmet>
        <title>Foundation Classes - Victory Bible Church Kitwe</title>
        <meta
          name="description"
          content="Join our Foundation Classes to establish a strong biblical foundation and prepare for church membership at Victory Bible Church Kitwe."
        />
      </Helmet>

      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-b-3xl h-[60vh]">
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

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/85 via-indigo-900/80 to-blue-900/85"></div>

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
                <FaBookOpen className="text-blue-300 text-4xl md:text-5xl" />
              </div>
            </motion.div>

            <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
              Foundation <span className="text-blue-300">Classes</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-100 max-w-2xl mx-auto leading-relaxed font-light mb-8">
              Build a strong biblical foundation and prepare for church
              membership
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <a
                href="#register"
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-8 py-4 rounded-full inline-flex items-center justify-center space-x-2 transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                <span>Register Now</span>
                <FaChevronRight />
              </a>
              <a
                href="#curriculum"
                className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-semibold px-8 py-4 rounded-full inline-flex items-center justify-center space-x-2 transition-all duration-300"
              >
                <span>View Curriculum</span>
                <FaClipboardList />
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        {/* Overview Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
            <div className="p-8 md:p-12">
              <h2 className="text-3xl font-bold mb-6 text-blue-600 dark:text-blue-400">
                What Are Foundation Classes?
              </h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                Foundation Classes are a 4-week journey designed to establish a
                strong biblical foundation and prepare you for meaningful church
                membership. Whether you're new to Christianity or looking to
                take your next step of commitment, these classes will equip you
                with essential knowledge and practical tools for your faith
                journey.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center mb-4">
                    <FaCalendarAlt className="text-blue-600 dark:text-blue-400 text-xl" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">4-Week Program</h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    One class per week, building progressively on biblical
                    foundations and church community.
                  </p>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center mb-4">
                    <FaGraduationCap className="text-blue-600 dark:text-blue-400 text-xl" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    Membership Pathway
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    Completion of all classes is required for church membership
                    and leadership opportunities.
                  </p>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center mb-4">
                    <FaCheckCircle className="text-blue-600 dark:text-blue-400 text-xl" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No Cost</h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    All materials are provided free of charge as part of our
                    ministry to help you grow.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Curriculum Section */}
        <motion.section
          id="curriculum"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-xl overflow-hidden">
            <div className="p-8 md:p-12 text-white">
              <h2 className="text-3xl font-bold mb-6">Class Curriculum</h2>
              <p className="text-lg opacity-90 mb-10 max-w-3xl">
                Our curriculum is designed to provide a comprehensive foundation
                for your faith journey and church membership. Each week builds
                on the previous one to create a complete understanding.
              </p>

              <div className="space-y-8">
                {classSessions.map((session, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden"
                  >
                    <div className="p-6 md:p-8">
                      <div className="flex flex-col md:flex-row md:items-center gap-6">
                        <div className="flex-shrink-0">
                          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-3xl">
                            {session.icon}
                          </div>
                        </div>
                        <div className="flex-grow">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                            <div>
                              <span className="bg-blue-700 text-xs font-bold py-1 px-2 rounded-full">
                                WEEK {session.week}
                              </span>
                              <h3 className="text-xl md:text-2xl font-semibold mt-2">
                                {session.title}
                              </h3>
                            </div>
                          </div>
                          <p className="opacity-90 mb-4">
                            {session.description}
                          </p>
                          <div className="bg-white/10 rounded-lg p-4">
                            <h4 className="font-medium mb-2">
                              Topics Covered:
                            </h4>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {session.topics.map((topic, i) => (
                                <li key={i} className="flex items-center gap-2">
                                  <div className="w-1.5 h-1.5 rounded-full bg-blue-300"></div>
                                  <span className="opacity-90">{topic}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        {/* Upcoming Classes Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
            <div className="p-8 md:p-12">
              <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">
                Upcoming Classes
              </h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
                Classes are offered quarterly throughout the year. Registration
                is required as space is limited. Select your preferred session
                when you register.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {upcomingClasses.map((classSession, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ y: -5 }}
                    className="bg-gray-50 dark:bg-gray-700 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    <div className="bg-blue-600 p-4 text-white">
                      <div className="flex justify-between items-center">
                        <h3 className="font-semibold">
                          {classSession.day} Series
                        </h3>
                        <span className="text-xs bg-blue-500 py-1 px-2 rounded-full">
                          {classSession.spotsLeft} spots left
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-start gap-3 mb-4">
                        <FaCalendarAlt className="text-blue-500 mt-1 flex-shrink-0" />
                        <div>
                          <div className="font-medium">
                            {classSession.startDate} - {classSession.endDate}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {classSession.time}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 mb-6">
                        <FaChurch className="text-blue-500 mt-1 flex-shrink-0" />
                        <div>
                          <div className="font-medium">Location</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {classSession.location}
                          </div>
                        </div>
                      </div>
                      <a
                        href="#register"
                        className="block text-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300"
                      >
                        Register Now
                      </a>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        {/* FAQ Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-gray-700 to-gray-900 p-8 text-white">
              <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
              <p className="mt-2 opacity-80">
                Find answers to common questions about Foundation Classes
              </p>
            </div>

            <div className="p-8 md:p-12 divide-y divide-gray-200 dark:divide-gray-700">
              {faqItems.map((item, index) => (
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
                      <FaAngleDown className="text-blue-600 dark:text-blue-400 text-xl" />
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
          </div>
        </motion.section>

        {/* Registration Form Section */}
        <motion.section
          id="register"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white">
              <h2 className="text-3xl font-bold">
                Register for Foundation Classes
              </h2>
              <p className="mt-2 opacity-80">
                Complete the form below to secure your spot in our next class
              </p>
            </div>

            {formSubmitted ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-8 md:p-12 text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full mb-6">
                  <FaCheckCircle className="text-green-600 dark:text-green-400 text-3xl" />
                </div>
                <h2 className="text-3xl font-bold mb-4">
                  Registration Complete!
                </h2>
                <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                  Thank you for registering for Foundation Classes. We've sent a
                  confirmation email to <strong>{formData.email}</strong> with
                  all the details you need.
                </p>
                <p className="text-md text-gray-600 dark:text-gray-400 mb-8">
                  If you have any questions before your first class, please
                  contact our church office.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link
                    to="/membership"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300"
                  >
                    Learn About Membership
                  </Link>
                  <Link
                    to="/"
                    className="border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 font-semibold px-6 py-3 rounded-lg transition-all duration-300"
                  >
                    Return to Homepage
                  </Link>
                </div>
              </motion.div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                    <span className="flex items-center gap-2">
                      <FaUser className="text-blue-600 dark:text-blue-400" />
                      Full Name
                    </span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 ${
                      formErrors.fullName
                        ? "border-red-500 dark:border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {formErrors.fullName && (
                    <p className="mt-2 text-red-500 text-sm">
                      {formErrors.fullName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                    <span className="flex items-center gap-2">
                      <FaEnvelope className="text-blue-600 dark:text-blue-400" />
                      Email Address
                    </span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email address"
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 ${
                      formErrors.email
                        ? "border-red-500 dark:border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {formErrors.email && (
                    <p className="mt-2 text-red-500 text-sm">
                      {formErrors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                    <span className="flex items-center gap-2">
                      <FaPhone className="text-blue-600 dark:text-blue-400" />
                      Phone Number
                    </span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 ${
                      formErrors.phone
                        ? "border-red-500 dark:border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {formErrors.phone && (
                    <p className="mt-2 text-red-500 text-sm">
                      {formErrors.phone}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                    <span className="flex items-center gap-2">
                      <FaCalendarAlt className="text-blue-600 dark:text-blue-400" />
                      Preferred Session
                    </span>
                  </label>
                  <select
                    name="preferredSession"
                    value={formData.preferredSession}
                    onChange={handleChange}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 ${
                      formErrors.preferredSession
                        ? "border-red-500 dark:border-red-500"
                        : "border-gray-300"
                    }`}
                  >
                    <option value="">Select a session</option>
                    {upcomingClasses.map((classSession, index) => (
                      <option
                        key={index}
                        value={`${classSession.startDate} (${classSession.day})`}
                      >
                        {classSession.startDate} - {classSession.day}{" "}
                        {classSession.time}
                      </option>
                    ))}
                  </select>
                  {formErrors.preferredSession && (
                    <p className="mt-2 text-red-500 text-sm">
                      {formErrors.preferredSession}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                    <span className="flex items-center gap-2">
                      <FaClipboardList className="text-blue-600 dark:text-blue-400" />
                      Questions or Special Requests
                    </span>
                  </label>
                  <textarea
                    name="questions"
                    value={formData.questions}
                    onChange={handleChange}
                    placeholder="Do you have any questions or special requests? (Optional)"
                    rows={4}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600"
                  ></textarea>
                </div>

                <div className="md:col-span-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center"
                  >
                    {submitting ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      <>Register for Foundation Classes</>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.section>

        {/* Testimonial Section */}
        <motion.section
          className="mt-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Testimonial Side */}
              <div className="p-10 text-white">
                <blockquote>
                  <div className="text-5xl text-blue-300 mb-4">"</div>
                  <p className="text-xl italic mb-6">
                    The Foundation Classes gave me clarity about my faith and
                    how to live it out daily. I met wonderful people who became
                    friends, and I finally understand what it means to be part
                    of a church family.
                  </p>
                  <footer className="text-blue-200">
                    <cite>
                      — John Banda, Completed Foundation Classes in 2023
                    </cite>
                  </footer>
                </blockquote>
              </div>

              {/* CTA Side */}
              <div className="bg-white/10 backdrop-blur-sm p-8 md:p-10 flex flex-col justify-center">
                <h2 className="text-3xl font-bold text-white mb-4">
                  Begin Your Journey Today
                </h2>
                <p className="text-gray-100 mb-6">
                  Foundation Classes are your first step toward meaningful
                  church membership and a stronger walk with God.
                </p>
                <div className="flex flex-wrap gap-4">
                  <a
                    href="#register"
                    className="inline-flex items-center gap-2 bg-white hover:bg-gray-100 text-blue-700 font-semibold px-6 py-3 rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg"
                  >
                    <FaCalendarAlt />
                    <span>Reserve Your Spot</span>
                  </a>
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-2 border-2 border-white text-white hover:bg-white/10 font-semibold px-6 py-3 rounded-lg transition-colors duration-300"
                  >
                    <FaEnvelope />
                    <span>Contact Us</span>
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

export default FoundationClasses;
