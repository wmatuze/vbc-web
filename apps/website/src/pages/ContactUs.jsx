import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import HeroSection from "../components/common/HeroSection";
import {
  ChevronDown,
  MapPin,
  Phone,
  Mail,
  Clock,
  Facebook,
  Instagram,
  Youtube,
  MessageCircle,
  Navigation,
  HelpCircle,
  Sparkles,
  Calendar,
} from "lucide-react";

const ContactUs = () => {
  const location = useLocation();
  const [activeSection, setActiveSection] = useState("contact-info");

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

      {/* Consistent Hero Section */}
      <HeroSection
        title="Get In Touch"
        subtitle="Contact Us"
        description="We'd love to hear from you! Reach out for inquiries, prayer requests, or visit information."
        primaryAccentText="Touch"
        scrollText="CONTACT INFO BELOW"
        backgroundImage="/assets/hero-bg.jpg"
      />

      {/* Sticky Navigation Tabs */}
      <div className="sticky top-0 z-50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-md px-4 py-3 -mt-2 rounded-b-xl">
        <div className="container mx-auto flex justify-center gap-4 overflow-x-auto no-scrollbar">
          {[
            { id: "contact-info", label: "Contact Info", icon: <Mail /> },
            { id: "service-times", label: "Service Times", icon: <Clock /> },
            { id: "social-media", label: "Social Media", icon: <Facebook /> },
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
                    <MapPin />
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
                    <Phone />
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
                    <Mail />
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
                    <Clock />
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

          <div className="p-8 md:p-12">
            <h3 className="text-2xl font-bold mb-6 text-center">
              Weekly Services
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
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
                <p className="text-gray-700 dark:text-gray-300 text-lg">
                  9:30 AM
                </p>
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
                <h3 className="text-xl font-semibold mb-2">Midweek Service</h3>
                <p className="text-gray-700 dark:text-gray-300 text-lg">
                  Wednesday, 6:00 PM
                </p>
              </motion.div>
            </div>

            <h3 className="text-2xl font-bold mb-6 text-center">
              Monthly Programs
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div
                className="bg-yellow-50 dark:bg-gray-700 p-6 rounded-xl text-center"
                whileHover={{
                  y: -5,
                  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="bg-yellow-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Anointing Service
                </h3>
                <p className="text-gray-700 dark:text-gray-300 text-lg">
                  First Sunday of each month
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
                  9:30 AM
                </p>
              </motion.div>

              <motion.div
                className="bg-red-50 dark:bg-gray-700 p-6 rounded-xl text-center"
                whileHover={{
                  y: -5,
                  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="bg-red-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Holy Communion</h3>
                <p className="text-gray-700 dark:text-gray-300 text-lg">
                  Third Sunday of each month
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
                  9:30 AM
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
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Prayer & Fasting</h3>
                <p className="text-gray-700 dark:text-gray-300 text-lg">
                  Last week of each month
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
                  Various times
                </p>
              </motion.div>
            </div>

            <div className="text-center mt-10">
              <Link
                to="/events"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-700 text-white font-medium px-6 py-3 rounded-lg hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
              >
                <FaCalendarAlt /> View Full Church Calendar
              </Link>
            </div>
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
