import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getEvents } from "../../services/api";
import EventCard from "../../components/ChurchCalendar/EventsCard";
import PlaceHolderbanner from "../../assets/ministry-banners/ph.png";
import FallbackImage from "../../assets/fallback-image.png"; // Import fallback image
import { Helmet } from "react-helmet"; // Import Helmet

const MensMinistry = () => {
  const [mensMinistryEvents, setMensMinistryEvents] = useState([]);
  const [isImageLoaded, setIsImageLoaded] = useState(false); // Loading state for Hero Image
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch events from API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const data = await getEvents();
        // Filter events for Men's Ministry
        const filteredEvents = data.filter(
          (event) => event?.ministry === "Men's Ministry"
        );
        setMensMinistryEvents(filteredEvents);
        setError(null);
      } catch (err) {
        console.error("Error fetching events:", err);
        setError("Failed to load events. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    // Simulate loading all images
    const timer = setTimeout(() => setIsImageLoaded(true), 800);
    return () => clearTimeout(timer);
  }, []);

  // Sample testimonials data
  const testimonials = [
    {
      id: 1,
      name: "John Smith",
      quote: "Being part of the Men's Ministry has strengthened my faith and given me a brotherhood I can rely on.",
      role: "Member since 2018"
    },
    {
      id: 2,
      name: "Robert Johnson",
      quote: "The weekly Bible studies have helped me grow spiritually and apply God's word in my daily life.",
      role: "Member since 2020"
    },
    {
      id: 3,
      name: "David Williams",
      quote: "The service projects we organize have given me purpose and a way to give back to our community.",
      role: "Member since 2019"
    }
  ];

  // FAQ data
  const faqs = [
    {
      id: 1,
      question: "When and where does the Men's Ministry meet?",
      answer: "We hold our weekly Bible studies every Tuesday at 7:00 PM in Room 201. We also have a monthly Men's Breakfast on the first Saturday of each month."
    },
    {
      id: 2,
      question: "Do I need to register before attending?",
      answer: "No registration is required. You're welcome to join us at any time. Just show up and you'll be greeted by our team."
    },
    {
      id: 3,
      question: "Is there a membership fee?",
      answer: "There is no fee to join our ministry. Some special events like retreats may have associated costs, but our regular meetings are free to attend."
    },
    {
      id: 4,
      question: "How can I volunteer with the Men's Ministry?",
      answer: "We're always looking for volunteers! Please speak with one of our ministry leaders after a meeting, or email us at [email protected]"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* SEO Meta Tags */}
      <Helmet>
        <title>Men's Ministry - Victory Bible Church</title>
        <meta
          name="description"
          content="Discover Victory Bible Church's Men's Ministry: dedicated to helping men grow in faith, strengthen relationships, and serve God and community."
        />
      </Helmet>

      {/* Hero Section - Implemented similar to About Us */}
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
            alt="Victory Bible Church banner for Men's Ministry"
            className="hidden"
            onLoad={() => setIsImageLoaded(true)}
            onError={() => setIsImageLoaded(true)} // Fallback on error
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-r from-red-900/80 via-red-900/70 to-red-900/80 rounded-b-3xl"></div>{" "}
        {/* Red gradient overlay */}
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden rounded-b-3xl">
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
            <h1 className="text-4xl lg:text-5xl font-bold text-white text-center mb-4 tracking-tight drop-shadow-lg">
              <span className="text-red-400">Men's</span> Ministry
            </h1>
            <p className="text-lg text-white text-center max-w-3xl mx-auto leading-relaxed font-light drop-shadow-md">
              Connect, grow, and serve with Victory Bible Church Men's Ministry.
              Join us as we journey together in faith.
            </p>
            <motion.div
              className="h-1 bg-red-400 mx-auto mt-8"
              initial={{ width: 0 }}
              animate={{ width: 100 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            />
          </motion.div>
        </div>
      </section>

      {/* About Us Section - Redesigned with card-like appearance */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.div
            className="bg-white rounded-xl shadow-lg p-8 transform -mt-20 relative z-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center mb-8">
              <div className="w-2 h-12 bg-red-600 rounded-full mr-4"></div>
              <h2 className="text-3xl font-bold text-gray-800">
                About Men's Ministry
              </h2>
            </div>

            <p className="text-gray-700 text-lg mb-8 leading-relaxed">
              Our Men's Ministry is dedicated to helping men of all ages grow in
              their faith, strengthen their relationships, and serve God and our
              community. We provide opportunities for fellowship, Bible study,
              and service projects. Whether you are new to the church or have
              been a long-time member, we invite you to join us as we journey
              together in faith. We meet weekly for Bible study and organize
              monthly service events to give back to those in need. Contact our
              ministry leader, [Men's Ministry Leader Name], at [email
              protected] to learn more.
            </p>

            {/* Activities with icons */}
            <h3 className="text-2xl font-semibold mb-6 text-gray-800 border-b pb-2 border-gray-200">
              Activities
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              <div className="flex items-start">
                <div className="bg-red-100 p-3 rounded-lg mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-red-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">
                    Weekly Bible Studies
                  </h4>
                  <p className="text-gray-600">Tuesdays, 7:00 PM</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-red-100 p-3 rounded-lg mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-red-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">
                    Monthly Men's Breakfast
                  </h4>
                  <p className="text-gray-600">First Saturday of each month</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-red-100 p-3 rounded-lg mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-red-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">
                    Annual Men's Retreat
                  </h4>
                  <p className="text-gray-600">
                    Spiritual growth and fellowship
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-red-100 p-3 rounded-lg mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-red-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">
                    Community Service Projects
                  </h4>
                  <p className="text-gray-600">
                    Quarterly outreach initiatives
                  </p>
                </div>
              </div>
            </div>

            {/* Ministry Leaders Section with profile cards */}
            <h3 className="text-2xl font-semibold mb-6 text-gray-800 border-b pb-2 border-gray-200">
              Ministry Leaders
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                className="bg-gray-50 rounded-lg p-6 border border-gray-100 shadow-sm"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center">
                  <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center text-red-600 font-bold text-xl mr-4">
                    MA
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">Mr ABCD</h4>
                    <p className="text-gray-600">Men's Ministry Leader</p>
                    <p className="text-red-600 text-sm mt-1">
                      [email protected]
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="bg-gray-50 rounded-lg p-6 border border-gray-100 shadow-sm"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex items-center">
                  <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center text-red-600 font-bold text-xl mr-4">
                    MA
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">Mr ABCD</h4>
                    <p className="text-gray-600">Assistant Leader</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section - New addition */}
      <section className="py-16 bg-gray-50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: "radial-gradient(#ef4444 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          ></div>
        </div>

        <div className="container mx-auto px-4 relative z-10 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 relative inline-block">
              <span className="relative z-10">
                Member Testimonials
              </span>
              <span className="absolute bottom-0 left-0 w-full h-3 bg-red-200 -z-10 rounded"></span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <motion.div
                key={testimonial.id}
                className="bg-white p-6 rounded-lg shadow-md border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: testimonial.id * 0.1 }}
              >
                <div className="mb-4">
                  <svg className="h-8 w-8 text-red-400 mb-4" fill="currentColor" viewBox="0 0 32 32">
                    <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                  </svg>
                  <p className="text-gray-600 italic mb-4">{testimonial.quote}</p>
                  <div className="flex items-center">
                    <div className="bg-red-100 w-10 h-10 rounded-full flex items-center justify-center text-red-600 font-bold text-sm mr-3">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">{testimonial.name}</h4>
                      <p className="text-gray-500 text-sm">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section - New addition */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 relative inline-block">
              <span className="relative z-10">
                Frequently Asked Questions
              </span>
              <span className="absolute bottom-0 left-0 w-full h-3 bg-red-200 -z-10 rounded"></span>
            </h2>
          </div>

          <div className="space-y-6">
            {faqs.map((faq) => (
              <motion.div
                key={faq.id}
                className="bg-gray-50 rounded-lg p-6 border border-gray-100 shadow-sm"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: faq.id * 0.1 }}
              >
                <h3 className="font-semibold text-lg text-gray-800 mb-2 flex items-center">
                  <div className="bg-red-100 w-8 h-8 rounded-full flex items-center justify-center text-red-600 font-bold text-sm mr-3">
                    Q
                  </div>
                  {faq.question}
                </h3>
                <div className="pl-11">
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Get Involved Section - Redesigned with action-oriented layout */}
      <section className="py-16 bg-gradient-to-b from-white to-gray-100 rounded-t-3xl">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.div
            className="bg-white rounded-xl shadow-lg overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="bg-red-600 py-4 px-8">
              <h2 className="text-3xl font-bold text-white text-center">
                Get Involved with Men's Ministry!
              </h2>
            </div>

            <div className="p-8">
              <p className="text-gray-700 text-lg mb-8 text-center">
                Ready to connect with other men and grow in your faith? Here's
                how to get involved:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <motion.div
                  className="border border-gray-200 rounded-lg p-6 text-center hover:shadow-md transition-shadow"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="bg-red-100 w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-red-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">
                    Weekly Bible Study
                  </h3>
                  <p className="text-gray-600">
                    Tuesdays at 7:00 PM in Room 201
                  </p>
                </motion.div>

                <motion.div
                  className="border border-gray-200 rounded-lg p-6 text-center hover:shadow-md transition-shadow"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="bg-red-100 w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-red-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">
                    Monthly Men's Breakfast
                  </h3>
                  <p className="text-gray-600">
                    First Saturday of each month
                  </p>
                </motion.div>

                <motion.div
                  className="border border-gray-200 rounded-lg p-6 text-center hover:shadow-md transition-shadow"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <div className="bg-red-100 w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-red-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">
                    Contact Us
                  </h3>
                  <p className="text-gray-600">Email: [email protected]</p>
                </motion.div>
              </div>

              <div className="text-center">
                <motion.button
                  className="px-8 py-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors shadow-md hover:shadow-lg inline-flex items-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>Join our community</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 ml-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default MensMinistry;
