import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
// Removed unused image imports - now using consistent hero background
import { isAuthenticated } from "../services/api/auth";
import HeroSection from "../components/common/HeroSection";
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
  FaClock,
  FaMapMarkerAlt,
  FaUsers,
  FaStar,
  FaChalkboardTeacher,
} from "react-icons/fa";

const DiscipleshipClasses = () => {
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    preferredSession: "",
    sessionId: "",
    classId: "",
    previousClasses: "",
    questions: "",
    emergencyContact: {
      name: "",
      phone: "",
      relationship: ""
    },
    motivationReason: ""
  });
  const [formErrors, setFormErrors] = useState({});
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [classes, setClasses] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Check if user is admin
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

  // Fetch discipleship classes
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await fetch('/api/discipleship/classes');
        const data = await response.json();
        if (data.success) {
          setClasses(data.data);
        }
      } catch (error) {
        console.error('Error fetching discipleship classes:', error);
      }
    };

    const fetchSessions = async () => {
      try {
        const response = await fetch('/api/discipleship/sessions?status=upcoming');
        const data = await response.json();
        if (data.success) {
          setSessions(data.data);
        }
      } catch (error) {
        console.error('Error fetching discipleship sessions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
    fetchSessions();
  }, []);

  // FAQ data
  const faqItems = [
    {
      question: "What's the difference between Foundation Classes and Discipleship Classes?",
      answer: "Foundation Classes cover basic Christian beliefs and church membership, while Discipleship Classes are deeper, longer programs focusing on spiritual growth, leadership development, and specific ministry areas.",
    },
    {
      question: "Do I need to complete Foundation Classes first?",
      answer: "While not always required, we highly recommend completing Foundation Classes first as they provide essential groundwork. Some advanced discipleship classes may have specific prerequisites.",
    },
    {
      question: "How long do discipleship classes run?",
      answer: "Discipleship classes vary in length from 6 weeks to 6 months, depending on the program. Each class page shows the specific duration and time commitment required.",
    },
    {
      question: "Can I join a class that's already started?",
      answer: "This depends on the specific class and how far it has progressed. Contact the class facilitator to discuss your options - sometimes makeup sessions or resources are available.",
    },
    {
      question: "Are there any costs for discipleship classes?",
      answer: "Most discipleship classes are free, though some may require purchasing books or materials. Any costs will be clearly stated when you register.",
    },
    {
      question: "What if I miss classes due to travel or illness?",
      answer: "We understand life happens! Most classes provide recorded sessions or makeup opportunities. Contact your facilitator to discuss how to stay on track.",
    },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.fullName.trim()) errors.fullName = "Full name is required";
    if (!formData.email.trim()) errors.email = "Email is required";
    if (!formData.phone.trim()) errors.phone = "Phone number is required";
    if (!formData.preferredSession.trim()) errors.preferredSession = "Please select a session";
    if (!formData.motivationReason.trim()) errors.motivationReason = "Please explain your motivation for taking this class";

    // Emergency contact validation
    if (!formData.emergencyContact.name.trim()) errors.emergencyContactName = "Emergency contact name is required";
    if (!formData.emergencyContact.phone.trim()) errors.emergencyContactPhone = "Emergency contact phone is required";
    if (!formData.emergencyContact.relationship.trim()) errors.emergencyContactRelationship = "Emergency contact relationship is required";

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      errors.email = "Please enter a valid email address";
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
    
    try {
      const response = await fetch('/api/discipleship/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (data.success) {
        setFormSubmitted(true);
        setShowRegistrationForm(false);
      } else {
        setFormErrors({ submit: data.error || 'Registration failed. Please try again.' });
      }
    } catch (error) {
      console.error('Error submitting registration:', error);
      setFormErrors({ submit: 'Network error. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  const openRegistrationForm = (classItem, session) => {
    setSelectedClass(classItem);
    setSelectedSession(session);
    setFormData(prev => ({
      ...prev,
      preferredSession: session.cohortName,
      sessionId: session._id,
      classId: classItem._id,
    }));
    setShowRegistrationForm(true);
  };

  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading discipleship classes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Helmet>
        <title>Discipleship Classes - Victory Bible Church</title>
        <meta
          name="description"
          content="Join our discipleship classes at Victory Bible Church. Deepen your faith, develop leadership skills, and grow in your spiritual journey through structured programs."
        />
      </Helmet>

      {/* Hero Section */}
      <HeroSection
        title="Discipleship Classes"
        subtitle="Discipleship Classes"
        description="Deepen your faith, develop leadership skills, and grow in your spiritual journey through our comprehensive discipleship programs."
        primaryAccentText="Classes"
        scrollText="EXPLORE OUR CLASSES"
        backgroundImage="/assets/hero-bg.jpg"
      />

      {/* Success Message */}
      <AnimatePresence>
        {formSubmitted && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-green-100 border border-green-400 text-green-700 px-6 py-4 rounded-lg shadow-lg z-50"
          >
            <div className="flex items-center">
              <FaCheckCircle className="text-green-500 mr-2" />
              <span>Registration submitted successfully! We'll contact you soon.</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        
        {/* Available Classes */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-900 dark:text-white">
            Available Discipleship Programs
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {classes.map((classItem, index) => (
              <motion.div
                key={classItem._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {classItem.title}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      classItem.level === 'beginner' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : classItem.level === 'intermediate'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {classItem.level}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {classItem.description}
                  </p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <FaClock className="mr-2" />
                      <span>{classItem.durationDisplay}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <FaChalkboardTeacher className="mr-2" />
                      <span>{classItem.instructor.name}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <FaBookOpen className="mr-2" />
                      <span>{classItem.curriculumLength} sessions</span>
                    </div>
                  </div>

                  {/* Prerequisites */}
                  {classItem.prerequisites && classItem.prerequisites.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Prerequisites:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {classItem.prerequisites.map((prereq, i) => (
                          <span key={i} className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded">
                            {prereq}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Available Sessions */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Upcoming Sessions:
                    </p>
                    {sessions
                      .filter(session => session.classId._id === classItem._id)
                      .map(session => (
                        <div key={session._id} className="border border-gray-200 dark:border-gray-600 rounded p-3">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              {session.cohortName}
                            </h4>
                            <span className="text-xs text-gray-500">
                              {session.spotsLeft} spots left
                            </span>
                          </div>
                          <div className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                            <div className="flex items-center">
                              <FaCalendarAlt className="mr-2 text-xs" />
                              <span>{session.dateRange}</span>
                            </div>
                            <div className="flex items-center">
                              <FaClock className="mr-2 text-xs" />
                              <span>{session.schedule.day}s at {session.schedule.time}</span>
                            </div>
                            <div className="flex items-center">
                              <FaMapMarkerAlt className="mr-2 text-xs" />
                              <span>{session.location}</span>
                            </div>
                          </div>
                          <button
                            onClick={() => openRegistrationForm(classItem, session)}
                            className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
                            disabled={!session.registrationOpen}
                          >
                            {session.registrationOpen ? 'Register Now' : 'Registration Closed'}
                          </button>
                        </div>
                      ))}
                    {sessions.filter(session => session.classId._id === classItem._id).length === 0 && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                        No upcoming sessions scheduled
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
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
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-900 dark:text-white">
            Frequently Asked Questions
          </h2>
          
          <div className="max-w-3xl mx-auto space-y-4">
            {faqItems.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <span className="font-medium text-gray-900 dark:text-white">
                    {faq.question}
                  </span>
                  <FaAngleDown
                    className={`text-gray-500 transition-transform ${
                      expandedFaq === index ? "rotate-180" : ""
                    }`}
                  />
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
                      <div className="px-6 pb-4">
                        <p className="text-gray-600 dark:text-gray-300">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>

      {/* Registration Modal */}
      <AnimatePresence>
        {showRegistrationForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Register for {selectedClass?.title}
                  </h3>
                  <button
                    onClick={() => setShowRegistrationForm(false)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    ×
                  </button>
                </div>

                {selectedSession && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6">
                    <h4 className="font-medium text-blue-900 dark:text-blue-200 mb-2">
                      {selectedSession.cohortName}
                    </h4>
                    <div className="space-y-1 text-sm text-blue-700 dark:text-blue-300">
                      <p>{selectedSession.dateRange}</p>
                      <p>{selectedSession.schedule.day}s at {selectedSession.schedule.time}</p>
                      <p>{selectedSession.location}</p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        required
                      />
                      {formErrors.fullName && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.fullName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        required
                      />
                      {formErrors.email && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        required
                      />
                      {formErrors.phone && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Previous Classes Completed
                      </label>
                      <input
                        type="text"
                        name="previousClasses"
                        value={formData.previousClasses}
                        onChange={handleInputChange}
                        placeholder="e.g., Foundation Classes, Basic Discipleship"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>

                  {/* Emergency Contact */}
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      Emergency Contact Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Name *
                        </label>
                        <input
                          type="text"
                          name="emergencyContact.name"
                          value={formData.emergencyContact.name}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          required
                        />
                        {formErrors.emergencyContactName && (
                          <p className="text-red-500 text-sm mt-1">{formErrors.emergencyContactName}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Phone *
                        </label>
                        <input
                          type="tel"
                          name="emergencyContact.phone"
                          value={formData.emergencyContact.phone}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          required
                        />
                        {formErrors.emergencyContactPhone && (
                          <p className="text-red-500 text-sm mt-1">{formErrors.emergencyContactPhone}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Relationship *
                        </label>
                        <input
                          type="text"
                          name="emergencyContact.relationship"
                          value={formData.emergencyContact.relationship}
                          onChange={handleInputChange}
                          placeholder="e.g., Spouse, Parent, Friend"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          required
                        />
                        {formErrors.emergencyContactRelationship && (
                          <p className="text-red-500 text-sm mt-1">{formErrors.emergencyContactRelationship}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Motivation */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Why do you want to take this discipleship class? *
                    </label>
                    <textarea
                      name="motivationReason"
                      value={formData.motivationReason}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    />
                    {formErrors.motivationReason && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.motivationReason}</p>
                    )}
                  </div>

                  {/* Additional Questions */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Additional Questions or Comments
                    </label>
                    <textarea
                      name="questions"
                      value={formData.questions}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>

                  {formErrors.submit && (
                    <div className="text-red-500 text-sm">{formErrors.submit}</div>
                  )}

                  {/* Submit Button */}
                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={() => setShowRegistrationForm(false)}
                      className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-md transition-colors flex items-center justify-center"
                    >
                      {submitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Submitting...
                        </>
                      ) : (
                        "Submit Registration"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DiscipleshipClasses;
