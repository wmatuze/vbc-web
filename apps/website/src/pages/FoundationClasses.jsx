import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import HeroSection from "../components/common/HeroSection";
import useFoundationClassSessions from "../hooks/useFoundationClassSessions";
import { isAuthenticated } from "../services/api/auth";
import {
  BookOpen,
  Calendar,
  ChevronRight,
  Clipboard,
  User,
  Mail,
  Phone,
  Sparkles,
  Book,
  Heart,
  Building2,
  CheckCircle,
  ChevronDown,
  GraduationCap,
} from "lucide-react";

const FoundationClasses = () => {
  const [expandedFaq, setExpandedFaq] = useState(null);
  const shouldReduceMotion = useReducedMotion();

  // Helper function to conditionally apply animation props
  const getAnimationProps = (animationProps) =>
    shouldReduceMotion ? {} : animationProps;
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
  const [isAdmin, setIsAdmin] = useState(false);

  // Check if user is admin (for showing mock data notification)
  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const authStatus = await isAuthenticated();
        setIsAdmin(authStatus);
      } catch (error) {
        console.error("Error checking authentication:", error);
        setIsAdmin(false);
      }
    };

    checkAdmin();
  }, []);

  // Focus management for form submission success
  useEffect(() => {
    if (formSubmitted) {
      document.getElementById("success-heading")?.focus();
    }
  }, [formSubmitted]);

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
      icon: <Sparkles className="text-blue-500" />,
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
      icon: <Book className="text-blue-500" />,
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
      icon: <Heart className="text-blue-500" />,
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
      icon: <Building2 className="text-blue-500" />,
    },
  ];

  // Use our custom hook for foundation class sessions
  const {
    sessions: availableSessions,
    loading: loadingSessions,
    error: sessionError,
    usingMockData,
    refreshSessions,
    registerForSession,
  } = useFoundationClassSessions();

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setSubmitting(true);

    // Find the selected session
    const selectedSessionId = formData.preferredSession;
    const selectedSession = availableSessions.find(
      (session) => session.id === selectedSessionId,
    );

    if (!selectedSession) {
      setFormErrors({
        ...formErrors,
        preferredSession: "Please select a valid session",
      });
      setSubmitting(false);
      return;
    }

    try {
      // Use our service to register
      await registerForSession(formData, selectedSessionId);

      // Show success message
      setFormSubmitted(true);
    } catch (error) {
      console.error("Error submitting registration form:", error);
      alert("There was a problem submitting your form. Please try again.");
    } finally {
      setSubmitting(false);
    }
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
      <HeroSection
        title="Foundation Classes"
        subtitle="Foundation Classes"
        description="Build a strong biblical foundation and prepare for church membership through our comprehensive 4-week program."
        primaryAccentText="Foundation"
        scrollText="EXPLORE CLASSES"
        backgroundImage="/assets/hero-bg.jpg"
      />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-20 max-w-6xl">
        {/* Overview Section */}
        <motion.section
          {...getAnimationProps({
            initial: { opacity: 0, y: 20 },
            whileInView: { opacity: 1, y: 0 },
            transition: { duration: 0.5 },
          })}
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
                    <Calendar className="text-blue-600 dark:text-blue-400 text-xl" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">4-Week Program</h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    One class per week, building progressively on biblical
                    foundations and church community.
                  </p>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center mb-4">
                    <GraduationCap className="text-blue-600 dark:text-blue-400 text-xl" />
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
                    <CheckCircle className="text-blue-600 dark:text-blue-400 text-xl" />
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
                    key={session.week}
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
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
                Classes are offered quarterly throughout the year. Registration
                is required as space is limited. Select your preferred session
                when you register.
              </p>

              {/* Mock data notification for admins */}
              {isAdmin && usingMockData && (
                <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 rounded-lg text-sm">
                  <p className="font-medium">Admin Notice: Using Mock Data</p>
                  <p>
                    The API endpoint for foundation class sessions is not
                    available. Using mock data instead.
                  </p>
                  <p>
                    Changes made to sessions will be stored locally but won't be
                    saved to the server.
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {loadingSessions ? (
                  // Loading state
                  Array.from({ length: 3 }).map((_, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 dark:bg-gray-700 rounded-xl overflow-hidden shadow-md animate-pulse"
                    >
                      <div className="bg-blue-400 p-4 h-14"></div>
                      <div className="p-6">
                        <div className="flex items-start gap-3 mb-4">
                          <div className="w-6 h-6 bg-blue-300 rounded-full"></div>
                          <div className="flex-1">
                            <div className="h-5 bg-gray-200 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
                            <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/2"></div>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 mb-6">
                          <div className="w-6 h-6 bg-blue-300 rounded-full"></div>
                          <div className="flex-1">
                            <div className="h-5 bg-gray-200 dark:bg-gray-600 rounded w-1/3 mb-2"></div>
                            <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-2/3"></div>
                          </div>
                        </div>
                        <div className="h-10 bg-blue-400 rounded-lg"></div>
                      </div>
                    </div>
                  ))
                ) : sessionError ? (
                  // Error state
                  <div className="col-span-1 md:col-span-3 bg-red-50 dark:bg-red-900/20 p-6 rounded-xl text-center">
                    <p className="text-red-600 dark:text-red-400 mb-4">
                      {sessionError}
                    </p>
                    <button
                      onClick={refreshSessions}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300"
                    >
                      Try Again
                    </button>
                  </div>
                ) : availableSessions.length === 0 ? (
                  // No sessions available
                  <div className="col-span-1 md:col-span-3 bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-xl text-center">
                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                      There are currently no upcoming foundation class sessions
                      scheduled. Please check back later or contact the church
                      office for more information.
                    </p>
                  </div>
                ) : (
                  // Display available sessions
                  availableSessions.map((session, index) => (
                    <motion.div
                      key={session.id}
                      whileHover={{ y: -5 }}
                      className="bg-gray-50 dark:bg-gray-700 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300"
                    >
                      <div className="bg-blue-600 p-4 text-white">
                        <div className="flex justify-between items-center">
                          <h3 className="font-semibold">
                            {session.day} Series
                          </h3>
                          <span className="text-xs bg-blue-500 py-1 px-2 rounded-full">
                            {session.spotsLeft} spots left
                          </span>
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="flex items-start gap-3 mb-4">
                          <Calendar className="text-blue-500 mt-1 flex-shrink-0" />
                          <div>
                            <div className="font-medium">
                              {new Date(session.startDate).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                },
                              )}{" "}
                              -{" "}
                              {new Date(session.endDate).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                },
                              )}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              {session.time}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 mb-6">
                          <Building2 className="text-blue-500 mt-1 flex-shrink-0" />
                          <div>
                            <div className="font-medium">Location</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              {session.location}
                            </div>
                          </div>
                        </div>
                        <a
                          href="#register"
                          className={`block text-center font-medium py-2 px-4 rounded-lg transition-colors duration-300 ${
                            session.spotsLeft > 0
                              ? "bg-blue-600 hover:bg-blue-700 text-white"
                              : "bg-gray-400 cursor-not-allowed text-white pointer-events-none"
                          }`}
                          aria-disabled={session.spotsLeft === 0}
                          onClick={(e) => {
                            if (session.spotsLeft === 0) {
                              e.preventDefault();
                              return;
                            }
                            // Pre-fill the form with selected session
                            setFormData((prev) => ({
                              ...prev,
                              preferredSession: session.id,
                            }));
                            // Scroll to form after a brief delay
                            setTimeout(() => {
                              document
                                .getElementById("register")
                                ?.scrollIntoView({
                                  behavior: "smooth",
                                });
                            }, 100);
                          }}
                        >
                          {session.spotsLeft > 0
                            ? "Register Now"
                            : "Class Full"}
                        </a>
                      </div>
                    </motion.div>
                  ))
                )}
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
                    id={`faq-button-${index}`}
                    className="flex justify-between items-center w-full text-left font-medium text-lg py-2"
                    onClick={() =>
                      setExpandedFaq(expandedFaq === index ? null : index)
                    }
                    aria-expanded={expandedFaq === index}
                    aria-controls={`faq-panel-${index}`}
                  >
                    <span className="pr-8">{item.question}</span>
                    <motion.div
                      {...getAnimationProps({
                        animate: { rotate: expandedFaq === index ? 180 : 0 },
                        transition: { duration: 0.3 },
                      })}
                    >
                      <FaAngleDown
                        aria-hidden="true"
                        className="text-blue-600 dark:text-blue-400 text-xl"
                      />
                    </motion.div>
                  </button>

                  <AnimatePresence>
                    {expandedFaq === index && (
                      <motion.div
                        id={`faq-panel-${index}`}
                        role="region"
                        aria-labelledby={`faq-button-${index}`}
                        {...getAnimationProps({
                          initial: { height: 0, opacity: 0 },
                          animate: { height: "auto", opacity: 1 },
                          exit: { height: 0, opacity: 0 },
                          transition: { duration: 0.3 },
                        })}
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
                  <CheckCircle className="text-green-600 dark:text-green-400 text-3xl" />
                </div>
                <h2
                  id="success-heading"
                  className="text-3xl font-bold mb-4"
                  tabIndex={-1}
                >
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
                  <label
                    htmlFor="fullName"
                    className="block text-gray-700 dark:text-gray-300 font-medium mb-2"
                  >
                    <span className="flex items-center gap-2">
                      <FaUser
                        aria-hidden="true"
                        className="text-blue-600 dark:text-blue-400"
                      />
                      Full Name
                    </span>
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    autoComplete="name"
                    aria-invalid={!!formErrors.fullName}
                    aria-describedby={
                      formErrors.fullName ? "fullName-error" : undefined
                    }
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 ${
                      formErrors.fullName
                        ? "border-red-500 dark:border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {formErrors.fullName && (
                    <p
                      id="fullName-error"
                      className="mt-2 text-red-500 text-sm"
                      role="alert"
                    >
                      {formErrors.fullName}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-gray-700 dark:text-gray-300 font-medium mb-2"
                  >
                    <span className="flex items-center gap-2">
                      <FaEnvelope
                        aria-hidden="true"
                        className="text-blue-600 dark:text-blue-400"
                      />
                      Email Address
                    </span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email address"
                    autoComplete="email"
                    aria-invalid={!!formErrors.email}
                    aria-describedby={
                      formErrors.email ? "email-error" : undefined
                    }
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 ${
                      formErrors.email
                        ? "border-red-500 dark:border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {formErrors.email && (
                    <p
                      id="email-error"
                      className="mt-2 text-red-500 text-sm"
                      role="alert"
                    >
                      {formErrors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-gray-700 dark:text-gray-300 font-medium mb-2"
                  >
                    <span className="flex items-center gap-2">
                      <FaPhone
                        aria-hidden="true"
                        className="text-blue-600 dark:text-blue-400"
                      />
                      Phone Number
                    </span>
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    autoComplete="tel"
                    inputMode="tel"
                    aria-invalid={!!formErrors.phone}
                    aria-describedby={
                      formErrors.phone ? "phone-error" : undefined
                    }
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 ${
                      formErrors.phone
                        ? "border-red-500 dark:border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {formErrors.phone && (
                    <p
                      id="phone-error"
                      className="mt-2 text-red-500 text-sm"
                      role="alert"
                    >
                      {formErrors.phone}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="preferredSession"
                    className="block text-gray-700 dark:text-gray-300 font-medium mb-2"
                  >
                    <span className="flex items-center gap-2">
                      <FaCalendarAlt
                        aria-hidden="true"
                        className="text-blue-600 dark:text-blue-400"
                      />
                      Preferred Session
                    </span>
                  </label>
                  {loadingSessions ? (
                    <div className="w-full h-12 bg-gray-200 dark:bg-gray-600 rounded-lg animate-pulse"></div>
                  ) : (
                    <select
                      id="preferredSession"
                      name="preferredSession"
                      value={formData.preferredSession}
                      onChange={handleChange}
                      aria-invalid={!!formErrors.preferredSession}
                      aria-describedby={
                        formErrors.preferredSession
                          ? "preferredSession-error"
                          : undefined
                      }
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 ${
                        formErrors.preferredSession
                          ? "border-red-500 dark:border-red-500"
                          : "border-gray-300"
                      }`}
                      disabled={
                        submitting ||
                        availableSessions.length === 0 ||
                        availableSessions.filter((s) => s.spotsLeft > 0)
                          .length === 0
                      }
                    >
                      <option value="">Select a session</option>
                      {availableSessions
                        .filter((session) => session.spotsLeft > 0)
                        .map((session) => (
                          <option key={session.id} value={session.id}>
                            {session.day} ({session.time}) -{" "}
                            {new Date(session.startDate).toLocaleDateString(
                              "en-US",
                              {
                                month: "long",
                                year: "numeric",
                              },
                            )}
                          </option>
                        ))}
                      {availableSessions.length > 0 &&
                        availableSessions.filter(
                          (session) => session.spotsLeft > 0,
                        ).length === 0 && (
                          <option value="" disabled>
                            No available sessions at this time
                          </option>
                        )}
                    </select>
                  )}
                  {formErrors.preferredSession && (
                    <p
                      id="preferredSession-error"
                      className="mt-2 text-red-500 text-sm"
                      role="alert"
                    >
                      {formErrors.preferredSession}
                    </p>
                  )}
                  {availableSessions.length === 0 &&
                    !loadingSessions &&
                    !sessionError && (
                      <p className="mt-2 text-yellow-600 dark:text-yellow-400 text-sm">
                        No sessions are currently available. Please check back
                        later.
                      </p>
                    )}
                  {sessionError && (
                    <p className="mt-2 text-red-500 text-sm">{sessionError}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label
                    htmlFor="questions"
                    className="block text-gray-700 dark:text-gray-300 font-medium mb-2"
                  >
                    <span className="flex items-center gap-2">
                      <FaClipboardList
                        aria-hidden="true"
                        className="text-blue-600 dark:text-blue-400"
                      />
                      Questions or Special Requests
                    </span>
                  </label>
                  <textarea
                    id="questions"
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
                      — Watu Matuze, Completed Foundation Classes in 2023
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
                    <Calendar />
                    <span>Reserve Your Spot</span>
                  </a>
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-2 border-2 border-white text-white hover:bg-white/10 font-semibold px-6 py-3 rounded-lg transition-colors duration-300"
                  >
                    <Mail />
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
