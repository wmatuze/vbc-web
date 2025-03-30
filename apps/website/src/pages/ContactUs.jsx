import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet";
import PlaceHolderbanner from "../assets/ministry-banners/ph.png";
import FallbackImage from "../assets/fallback-image.png";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaChevronDown,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaClock,
  FaFacebook,
  FaInstagram,
  FaYoutube,
  FaWhatsapp,
  FaDirections,
  FaUserTie,
  FaQuestionCircle,
  FaPrayingHands,
  FaBell,
} from "react-icons/fa";

const ContactUs = () => {
  const location = useLocation();
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [activeSection, setActiveSection] = useState("contact-info");

  const scrollToContent = () => {
    document
      .getElementById("contact-info-section")
      .scrollIntoView({ behavior: "smooth" });
  };

  // Parallax effect on scroll
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100 overflow-hidden">
      {/* SEO Meta Tags */}
      <Helmet>
        <title>Contact Us - Victory Bible Church Kitwe</title>
        <meta
          name="description"
          content="Contact Victory Bible Church Kitwe for inquiries, prayer requests, and visit information. Find our address, phone, email, service times, and social media links."
        />
      </Helmet>

      {/* Hero Section - Enhanced with parallax and animations */}
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

        {/* Enhanced gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/80 via-purple-900/70 to-blue-900/80"></div>

        {/* Animated particles */}
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
            <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight">
              Get In{" "}
              <span className="text-yellow-400 relative">
                Touch
                <motion.span
                  className="absolute bottom-1 left-0 h-1 bg-yellow-400"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                />
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-100 max-w-2xl mx-auto leading-relaxed font-light">
              We'd love to hear from you! Reach out for inquiries, prayer
              requests, or visit information.
            </p>
          </motion.div>

          <motion.div
            className="absolute bottom-10 cursor-pointer bg-white/20 hover:bg-white/30 p-3 rounded-full backdrop-blur-sm transition-all duration-300"
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            onClick={scrollToContent}
            onKeyDown={(e) => e.key === "Enter" && scrollToContent()}
            role="button"
            tabIndex={0}
            aria-label="Scroll to contact information"
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
            { id: "contact-info", label: "Contact Info", icon: <FaEnvelope /> },
            { id: "service-times", label: "Service Times", icon: <FaClock /> },
            { id: "social-media", label: "Social Media", icon: <FaFacebook /> },
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
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Contact Information Section */}
      <section id="contact-info" className="py-20 px-6 mt-4">
        <motion.div
          className="container mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white">
            <h2 className="text-3xl font-bold">Contact Information</h2>
            <p className="mt-2 opacity-80">Reach out to us anytime</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            <div className="p-8 md:p-12 bg-blue-50 dark:bg-gray-700">
              <div className="space-y-8">
                <motion.div
                  className="flex items-start gap-4"
                  whileHover={{ x: 5 }}
                >
                  <div className="bg-blue-600 rounded-full p-3 text-white mt-1">
                    <FaMapMarkerAlt />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Our Location</h3>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      Victory Bible Church, [Street Name], Kitwe, Zambia
                    </p>
                    <a
                      href="#"
                      className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 mt-2 hover:underline"
                    >
                      <FaDirections /> Get directions
                    </a>
                  </div>
                </motion.div>

                <motion.div
                  className="flex items-start gap-4"
                  whileHover={{ x: 5 }}
                >
                  <div className="bg-blue-600 rounded-full p-3 text-white mt-1">
                    <FaPhone />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Phone Number</h3>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      [+260 Phone Number]
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>

            <div className="p-8 md:p-12">
              <div className="space-y-8">
                <motion.div
                  className="flex items-start gap-4"
                  whileHover={{ x: 5 }}
                >
                  <div className="bg-indigo-600 rounded-full p-3 text-white mt-1">
                    <FaEnvelope />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      Email Address
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      info@victorybiblekitwe.org
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  className="flex items-start gap-4"
                  whileHover={{ x: 5 }}
                >
                  <div className="bg-indigo-600 rounded-full p-3 text-white mt-1">
                    <FaClock />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Office Hours</h3>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      Mon-Fri: 8:00 AM – 5:00 PM
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16 px-6">
        <motion.div
          className="container mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-6">Send Us a Message</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-8">
                We'd love to hear from you. Fill out the form and we'll get back
                to you as soon as possible.
              </p>

              <motion.form
                className="space-y-6"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Message subject"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows="5"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Your message..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-semibold px-6 py-3 rounded-lg hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
                >
                  Send Message
                </button>
              </motion.form>
            </div>

            <div className="hidden md:block relative rounded-xl overflow-hidden h-[500px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3890.559565493077!2d28.22997607453223!3d-12.807075856521612!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x196ce7fb9948f75b%3A0xe20f6f1190003491!2sVictory%20Christian%20Center%20(Victory%20Bible%20Church)!5e0!3m2!1sen!2szm!4v1743212386447!5m2!1sen!2szm"
                className="absolute inset-0 w-full h-full border-0"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Service Times Section */}
      <section
        id="service-times"
        className="py-16 px-6 bg-gray-100 dark:bg-gray-900 rounded-t-3xl -mt-6"
      >
        <motion.div
          className="container mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="bg-gradient-to-r from-purple-600 to-indigo-700 p-8 text-white">
            <h2 className="text-3xl font-bold">Service Times</h2>
            <p className="mt-2 opacity-80">
              Join us for worship and fellowship
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8 md:p-12">
            <motion.div
              className="bg-purple-50 dark:bg-gray-700 p-6 rounded-xl text-center"
              whileHover={{
                y: -5,
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
              }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="bg-purple-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-white">
                <FaPrayingHands className="text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Sunday Worship</h3>
              <p className="text-gray-700 dark:text-gray-300 text-lg">[Time]</p>
            </motion.div>

            <motion.div
              className="bg-indigo-50 dark:bg-gray-700 p-6 rounded-xl text-center"
              whileHover={{
                y: -5,
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
              }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="bg-indigo-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-white">
                <FaQuestionCircle className="text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Bible Study</h3>
              <p className="text-gray-700 dark:text-gray-300 text-lg">
                [Day/Time]
              </p>
            </motion.div>

            <motion.div
              className="bg-blue-50 dark:bg-gray-700 p-6 rounded-xl text-center"
              whileHover={{
                y: -5,
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
              }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="bg-blue-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-white">
                <FaBell className="text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Prayer Meetings</h3>
              <p className="text-gray-700 dark:text-gray-300 text-lg">
                [Day/Time]
              </p>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Social Media Links Section */}
      <section
        id="social-media"
        className="py-16 px-6 bg-white dark:bg-gray-800"
      >
        <motion.div
          className="container mx-auto bg-gradient-to-br from-blue-600 to-indigo-800 rounded-2xl shadow-xl p-8 md:p-12 text-white"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold mb-8 text-center">
            Connect With Us
          </h2>
          <p className="text-center text-white/80 max-w-2xl mx-auto mb-10">
            Follow us on social media to stay updated with our latest events,
            sermons, and community activities.
          </p>

          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            <motion.div
              whileHover={{ y: -10, scale: 1.1 }}
              className="text-center"
            >
              <Link
                to="https://www.facebook.com/VictoryBibleChurchKitwe/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="block"
              >
                <div className="bg-white/20 hover:bg-white/30 p-6 rounded-full backdrop-blur-sm mb-3 mx-auto">
                  <FaFacebook className="text-white text-3xl" />
                </div>
                <span className="block">Facebook</span>
              </Link>
            </motion.div>

            <motion.div
              whileHover={{ y: -10, scale: 1.1 }}
              className="text-center"
            >
              <Link
                to="#"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="block"
              >
                <div className="bg-white/20 hover:bg-white/30 p-6 rounded-full backdrop-blur-sm mb-3 mx-auto">
                  <FaInstagram className="text-white text-3xl" />
                </div>
                <span className="block">Instagram</span>
              </Link>
            </motion.div>

            <motion.div
              whileHover={{ y: -10, scale: 1.1 }}
              className="text-center"
            >
              <Link
                to="#"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="block"
              >
                <div className="bg-white/20 hover:bg-white/30 p-6 rounded-full backdrop-blur-sm mb-3 mx-auto">
                  <FaYoutube className="text-white text-3xl" />
                </div>
                <span className="block">YouTube</span>
              </Link>
            </motion.div>

            <motion.div
              whileHover={{ y: -10, scale: 1.1 }}
              className="text-center"
            >
              <Link
                to="#"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="block"
              >
                <div className="bg-white/20 hover:bg-white/30 p-6 rounded-full backdrop-blur-sm mb-3 mx-auto">
                  <FaWhatsapp className="text-white text-3xl" />
                </div>
                <span className="block">WhatsApp</span>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default ContactUs;
