import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import events from "../../assets/data/events";
import EventCard from "../../components/ChurchCalendar/EventsCard";
import PlaceHolderbanner from "../../assets/ministry-banners/ph.png";
import youthGallery1 from "../../assets/images/youth/gallery1.jpg"; // Replace with actual youth event images
import youthGallery2 from "../../assets/images/youth/gallery2.jpg";
import youthGallery3 from "../../assets/images/youth/gallery3.jpg";
import cbuLogo from "../../assets/images/cbu-logo.png"; // Add a CBU logo image
import litNationLogo from "../../assets/images/litnationlogo.png"; // Add your Lit Nation logo

const YouthMinistry = () => {
  const [activeTab, setActiveTab] = useState("main");
  const [currentSlide, setCurrentSlide] = useState(0);

  // Image gallery for youth activities
  const galleryImages = [
    {
      src: youthGallery1,
      alt: "Youth worship night",
      caption: "Worship Night 2024",
    },
    {
      src: youthGallery2,
      alt: "Youth outdoor activities",
      caption: "Summer Retreat",
    },
    {
      src: youthGallery3,
      alt: "Youth community service",
      caption: "Community Outreach",
    },
    // Add more images as needed
  ];

  // Auto-advance gallery
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % galleryImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [galleryImages.length]);

  // Filter events for Youth Ministry
  const youthMinistryEvents = events.filter(
    (event) =>
      event.ministry === "Youth Ministry" || event.ministry === "CBU Fellowship"
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dynamic Hero Section with Lit Nation Branding */}
      <section className="relative h-[80vh] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${PlaceHolderbanner})`,
            filter: "brightness(0.6)",
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-r from-green-900/80 to-purple-900/70"></div>

        <div className="container mx-auto px-4 relative z-10 h-full flex flex-col justify-center items-center">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="flex justify-center mb-6">
              <img
                src={litNationLogo}
                alt="Lit Nation Youth Ministry"
                className="h-24 md:h-32"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%2310B981'/%3E%3Ctext x='50' y='50' font-family='Arial' font-size='20' text-anchor='middle' fill='white' dominant-baseline='middle'%3ELIT NATION%3C/text%3E%3C/svg%3E";
                }}
              />
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 tracking-tighter">
              LIT NATION
            </h1>
            <p className="text-xl md:text-2xl text-white mb-8 max-w-3xl mx-auto">
              A vibrant community where youth experience faith, friendship, and
              fun
            </p>

            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <a
                href="#join-us"
                className="px-8 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-full transform hover:scale-105 transition-all shadow-lg"
              >
                Join Us
              </a>
              <a
                href="#cbu-fellowship"
                className="px-8 py-3 bg-purple-500 hover:bg-purple-600 text-white font-bold rounded-full transform hover:scale-105 transition-all shadow-lg"
              >
                CBU Fellowship
              </a>
            </div>
          </motion.div>
        </div>

        {/* Animated down arrow */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10">
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              ></path>
            </svg>
          </motion.div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <div className="bg-white sticky top-0 z-30 shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto no-scrollbar py-4 space-x-1">
            <button
              onClick={() => setActiveTab("main")}
              className={`px-5 py-2 rounded-full whitespace-nowrap font-medium transition-all ${
                activeTab === "main"
                  ? "bg-green-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              About Lit Nation
            </button>
            <button
              onClick={() => setActiveTab("cbu")}
              className={`px-5 py-2 rounded-full whitespace-nowrap font-medium transition-all ${
                activeTab === "cbu"
                  ? "bg-purple-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              CBU Fellowship
            </button>
            <button
              onClick={() => setActiveTab("gallery")}
              className={`px-5 py-2 rounded-full whitespace-nowrap font-medium transition-all ${
                activeTab === "gallery"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Photo Gallery
            </button>
            <button
              onClick={() => setActiveTab("events")}
              className={`px-5 py-2 rounded-full whitespace-nowrap font-medium transition-all ${
                activeTab === "events"
                  ? "bg-yellow-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Upcoming Events
            </button>
            <button
              onClick={() => setActiveTab("leaders")}
              className={`px-5 py-2 rounded-full whitespace-nowrap font-medium transition-all ${
                activeTab === "leaders"
                  ? "bg-red-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Leadership Team
            </button>
          </div>
        </div>
      </div>

      {/* Dynamic Content Based on Active Tab */}
      <div className="py-12">
        {/* MAIN LIT NATION CONTENT */}
        {activeTab === "main" && (
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-center mb-8">
                <div className="w-2 h-12 bg-green-600 rounded-full mr-4"></div>
                <h2 className="text-3xl font-bold text-gray-800">
                  About Lit Nation Youth Ministry
                </h2>
              </div>

              <div className="flex flex-col md:flex-row gap-8 mb-10">
                <div className="md:w-2/3">
                  <p className="text-gray-700 text-lg mb-6 leading-relaxed">
                    Lit Nation is our dynamic youth ministry where teenagers and
                    young adults come alive in their faith journey. We create an
                    environment where youth can experience God's presence, build
                    authentic friendships, and discover their purpose.
                  </p>
                  <p className="text-gray-700 text-lg mb-6 leading-relaxed">
                    Our name "Lit Nation" represents both being on fire for God
                    and being a light in this generation. We believe young
                    people aren't just the church of tomorrow—they're the church
                    of today!
                  </p>
                  <p className="text-gray-700 text-lg leading-relaxed">
                    Join us every Friday at 6:30PM for worship, relevant
                    teaching, games, and community.
                  </p>
                </div>

                <div className="md:w-1/3 bg-gray-50 p-6 rounded-xl border border-gray-100">
                  <h3 className="font-bold text-xl mb-4 text-green-600">
                    Weekly Schedule
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold">Friday Night Live</h4>
                      <p className="text-gray-600">Every Friday @ 6:30PM</p>
                      <p className="text-sm text-gray-500">Main Sanctuary</p>
                    </div>

                    <div>
                      <h4 className="font-semibold">Sunday Youth Class</h4>
                      <p className="text-gray-600">Sundays @ 9:30AM</p>
                      <p className="text-sm text-gray-500">Youth Room</p>
                    </div>

                    <div>
                      <h4 className="font-semibold">Discipleship Groups</h4>
                      <p className="text-gray-600">Wednesdays @ 4:00PM</p>
                      <p className="text-sm text-gray-500">Various Locations</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Core Values */}
              <div className="mb-10">
                <h3 className="text-2xl font-semibold mb-6 text-gray-800 border-b pb-2 border-gray-200">
                  Our Core Values
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    {
                      icon: "🔥",
                      title: "Passion",
                      desc: "Living with enthusiasm for God and His purposes",
                    },
                    {
                      icon: "🤝",
                      title: "Community",
                      desc: "Building authentic relationships that last",
                    },
                    {
                      icon: "🌱",
                      title: "Growth",
                      desc: "Constantly developing in faith and character",
                    },
                    {
                      icon: "🌍",
                      title: "Impact",
                      desc: "Making a difference in our world",
                    },
                  ].map((value, i) => (
                    <div
                      key={i}
                      className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                    >
                      <div className="text-4xl mb-3">{value.icon}</div>
                      <h4 className="font-bold text-gray-800 mb-2">
                        {value.title}
                      </h4>
                      <p className="text-gray-600 text-sm">{value.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Testimonials */}
              <div>
                <h3 className="text-2xl font-semibold mb-6 text-gray-800 border-b pb-2 border-gray-200">
                  What Youth Are Saying
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    {
                      quote:
                        "Lit Nation isn't just a youth group, it's my second family. I've grown so much in my faith here.",
                      name: "Sarah K.",
                      age: "17",
                    },
                    {
                      quote:
                        "The leaders actually care about us and what we're going through. They make the Bible relevant to our lives.",
                      name: "David M.",
                      age: "16",
                    },
                  ].map((testimonial, i) => (
                    <div key={i} className="bg-gray-50 p-6 rounded-xl relative">
                      <div className="absolute -top-3 -left-3 text-4xl text-green-500">
                        "
                      </div>
                      <p className="italic text-gray-700 mb-4 pt-3">
                        {testimonial.quote}
                      </p>
                      <div className="font-medium text-right">
                        — {testimonial.name}, {testimonial.age}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CBU FELLOWSHIP CONTENT */}
        {activeTab === "cbu" && (
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-center mb-8">
                <div className="w-2 h-12 bg-purple-600 rounded-full mr-4"></div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-800 flex items-center">
                    CBU Student Fellowship
                    <img
                      src={cbuLogo}
                      alt="CBU Logo"
                      className="h-8 ml-3"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%237E22CE'/%3E%3Ctext x='50' y='50' font-family='Arial' font-size='20' text-anchor='middle' fill='white' dominant-baseline='middle'%3ECBU%3C/text%3E%3C/svg%3E";
                      }}
                    />
                  </h2>
                </div>
              </div>

              <div className="flex flex-col lg:flex-row gap-8 mb-10">
                <div className="lg:w-2/3">
                  <p className="text-gray-700 text-lg mb-6 leading-relaxed">
                    We're proud to host a thriving fellowship specifically for
                    Copperbelt University students. Located just minutes from
                    campus, our church serves as a spiritual home for many CBU
                    students seeking community, spiritual growth, and support
                    during their academic journey.
                  </p>

                  <p className="text-gray-700 text-lg mb-6 leading-relaxed">
                    Our CBU Fellowship connects students with peers who share
                    their faith, provides mentorship opportunities with
                    professionals in various fields, and offers a supportive
                    environment where students can thrive academically and
                    spiritually.
                  </p>

                  <div className="bg-purple-50 p-6 rounded-xl mb-6 border-l-4 border-purple-500">
                    <h3 className="font-bold text-xl mb-2 text-purple-700">
                      Transportation Available
                    </h3>
                    <p className="text-gray-700">
                      We provide free transportation from campus to church
                      events. Our shuttle leaves from the main entrance every
                      Sunday at 8:30AM and returns after service.
                    </p>
                  </div>

                  <p className="text-gray-700 text-lg leading-relaxed">
                    Join our WhatsApp group for CBU students to stay connected
                    and informed about upcoming events, study sessions, and
                    fellowship opportunities.
                  </p>
                </div>

                <div className="lg:w-1/3">
                  <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 mb-6">
                    <h3 className="font-bold text-xl mb-4 text-purple-600">
                      CBU Fellowship Activities
                    </h3>

                    <div className="space-y-4">
                      <div className="flex items-start">
                        <span className="bg-purple-100 p-2 rounded-full mr-3 text-purple-600">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </span>
                        <div>
                          <h4 className="font-medium">Midweek Bible Study</h4>
                          <p className="text-sm text-gray-600">
                            Wednesdays @ 5PM - Student Center
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <span className="bg-purple-100 p-2 rounded-full mr-3 text-purple-600">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                          </svg>
                        </span>
                        <div>
                          <h4 className="font-medium">Semester Kickoff</h4>
                          <p className="text-sm text-gray-600">
                            First Friday of each semester
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <span className="bg-purple-100 p-2 rounded-full mr-3 text-purple-600">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                          </svg>
                        </span>
                        <div>
                          <h4 className="font-medium">Exam Prayer Support</h4>
                          <p className="text-sm text-gray-600">
                            During final exam weeks
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <span className="bg-purple-100 p-2 rounded-full mr-3 text-purple-600">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5zm0 2h10v7h-2l-1 2H8l-1-2H5V5z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </span>
                        <div>
                          <h4 className="font-medium">Career Mentorship</h4>
                          <p className="text-sm text-gray-600">
                            Monthly professional networking
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Contact Card */}
                  <div className="bg-purple-600 text-white p-6 rounded-xl shadow-lg">
                    <h3 className="font-bold text-xl mb-4">Get Connected</h3>
                    <p className="mb-4">Join our CBU Fellowship today!</p>

                    <div className="flex items-center mb-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-3"
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
                      <span>cbufellowship@church.org</span>
                    </div>

                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                        />
                      </svg>
                      <span>+260 97X XXX XXX</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Testimonials */}
              <div>
                <h3 className="text-2xl font-semibold mb-6 text-gray-800 border-b pb-2 border-gray-200">
                  What CBU Students Are Saying
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    {
                      quote:
                        "Finding this church while at CBU has been life-changing. I've grown spiritually and made lifelong friends.",
                      name: "James C.",
                      program: "Computer Science",
                    },
                    {
                      quote:
                        "The CBU Fellowship helped me stay grounded during the stress of exams and coursework. It's been my anchor.",
                      name: "Mercy N.",
                      program: "Engineering",
                    },
                    {
                      quote:
                        "I appreciate the mentorship program that connected me with professionals in my field who share my faith.",
                      name: "Thomas M.",
                      program: "Business Administration",
                    },
                  ].map((testimonial, i) => (
                    <div key={i} className="bg-gray-50 p-6 rounded-xl relative">
                      <div className="absolute -top-3 -left-3 text-4xl text-purple-500">
                        "
                      </div>
                      <p className="italic text-gray-700 mb-4 pt-3">
                        {testimonial.quote}
                      </p>
                      <div className="font-medium text-right">
                        — {testimonial.name},{" "}
                        <span className="text-purple-600">
                          {testimonial.program}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PHOTO GALLERY */}
        {activeTab === "gallery" && (
          <div className="container mx-auto px-4">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-center mb-8">
                <div className="w-2 h-12 bg-blue-600 rounded-full mr-4"></div>
                <h2 className="text-3xl font-bold text-gray-800">
                  Youth Life in Pictures
                </h2>
              </div>

              {/* Main Gallery */}
              <div className="relative overflow-hidden rounded-xl mb-10 h-[400px] md:h-[500px]">
                {galleryImages.map((image, index) => (
                  <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-1000 ${
                      index === currentSlide ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://source.unsplash.com/random/800x600/?youth,church,${index}`;
                      }}
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                      <p className="text-white text-xl font-medium">
                        {image.caption}
                      </p>
                    </div>
                  </div>
                ))}

                {/* Navigation Dots */}
                <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                  {galleryImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-3 h-3 rounded-full ${
                        index === currentSlide
                          ? "bg-white"
                          : "bg-white/50 hover:bg-white/80"
                      } transition-all`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>

                {/* Navigation Arrows */}
                <button
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full"
                  onClick={() =>
                    setCurrentSlide(
                      (prev) =>
                        (prev - 1 + galleryImages.length) % galleryImages.length
                    )
                  }
                  aria-label="Previous image"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <button
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full"
                  onClick={() =>
                    setCurrentSlide((prev) => (prev + 1) % galleryImages.length)
                  }
                  aria-label="Next image"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>

              <h3 className="text-2xl font-semibold mb-6 text-gray-800">
                Memories We've Made
              </h3>

              {/* Activity Categories */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                {[
                  {
                    title: "Worship Nights",
                    image:
                      "https://source.unsplash.com/random/300x300/?worship",
                  },
                  {
                    title: "Summer Camp",
                    image: "https://source.unsplash.com/random/300x300/?camp",
                  },
                  {
                    title: "Mission Trips",
                    image:
                      "https://source.unsplash.com/random/300x300/?mission",
                  },
                  {
                    title: "Game Nights",
                    image: "https://source.unsplash.com/random/300x300/?games",
                  },
                  {
                    title: "Community Service",
                    image:
                      "https://source.unsplash.com/random/300x300/?volunteer",
                  },
                  {
                    title: "Bible Studies",
                    image: "https://source.unsplash.com/random/300x300/?bible",
                  },
                ].map((category, i) => (
                  <div
                    key={i}
                    className="group relative overflow-hidden rounded-xl h-60 shadow-md"
                  >
                    <img
                      src={category.image}
                      alt={category.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end">
                      <p className="p-6 text-white font-bold text-xl">
                        {category.title}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Instagram Link */}
              <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 p-8 rounded-xl text-white text-center">
                <h3 className="text-2xl font-bold mb-4">
                  Follow Us on Instagram
                </h3>
                <p className="text-lg mb-6">
                  See more photos and stories from our youth events
                </p>
                <a
                  href="https://instagram.com/litnation"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center bg-white text-pink-600 px-6 py-3 rounded-full font-bold hover:bg-gray-100 transition-colors"
                >
                  <svg
                    className="h-6 w-6 mr-2"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                  @litnation
                </a>
              </div>
            </div>
          </div>
        )}

        {/* EVENTS SECTION */}
        {activeTab === "events" && (
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-center mb-8">
                <div className="w-2 h-12 bg-yellow-500 rounded-full mr-4"></div>
                <h2 className="text-3xl font-bold text-gray-800">
                  Upcoming Youth Events
                </h2>
              </div>

              {youthMinistryEvents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {youthMinistryEvents.map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      className="hover:shadow-xl transition-shadow duration-300"
                    />
                  ))}
                </div>
              ) : (
                <div className="py-16 text-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 mx-auto text-yellow-300 mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="text-gray-500 text-xl">
                    No upcoming events for Youth Ministry.
                  </p>
                  <p className="text-gray-400 mt-2">
                    Check back soon for new events!
                  </p>
                </div>
              )}

              {/* Add Annual Calendar */}
              <div className="mt-12 bg-yellow-50 p-6 rounded-xl border border-yellow-100">
                <h3 className="text-2xl font-semibold mb-4 text-gray-800">
                  Annual Youth Calendar
                </h3>
                <p className="text-gray-700 mb-6">
                  Plan ahead with our major events for the year. Dates may be
                  subject to change.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    {
                      month: "January",
                      event: "Youth Vision Retreat",
                      date: "Jan 15-17",
                    },
                    {
                      month: "March",
                      event: "Spring Break Mission Trip",
                      date: "Mar 20-27",
                    },
                    {
                      month: "May",
                      event: "Graduate Recognition",
                      date: "May 22",
                    },
                    { month: "June", event: "Summer Camp", date: "Jun 15-21" },
                    {
                      month: "August",
                      event: "Back to School Rally",
                      date: "Aug 28",
                    },
                    {
                      month: "October",
                      event: "Fall Youth Conference",
                      date: "Oct 8-10",
                    },
                    {
                      month: "December",
                      event: "Christmas Celebration",
                      date: "Dec 17",
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center p-3 bg-white rounded-lg shadow-sm"
                    >
                      <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
                        <span className="font-bold text-yellow-700">
                          {item.month.substring(0, 3)}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-medium">{item.event}</h4>
                        <p className="text-sm text-gray-600">{item.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* LEADERSHIP TEAM */}
        {activeTab === "leaders" && (
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-center mb-8">
                <div className="w-2 h-12 bg-red-600 rounded-full mr-4"></div>
                <h2 className="text-3xl font-bold text-gray-800">
                  Our Leadership Team
                </h2>
              </div>

              <p className="text-gray-700 text-lg mb-10 leading-relaxed">
                Meet the dedicated team that serves and guides our youth
                ministry with passion, wisdom, and love. Our leaders are
                committed to creating a safe and nurturing environment where
                young people can grow in their faith.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
                {[
                  {
                    name: "Mr Youth Leader",
                    title: "Youth Pastor",
                    bio: "Passionate about helping young people discover their purpose and grow in faith.",
                    image: "https://source.unsplash.com/random/300x300/?pastor",
                  },
                  {
                    name: "Ms Assist Leader",
                    title: "Assistant Youth Leader",
                    bio: "Creative and energetic leader dedicated to building authentic community.",
                    image: "https://source.unsplash.com/random/300x300/?woman",
                  },
                  {
                    name: "John CBU Coordinator",
                    title: "CBU Fellowship Coordinator",
                    bio: "Connects church and campus life for university students with understanding and vision.",
                    image:
                      "https://source.unsplash.com/random/300x300/?teacher",
                  },
                ].map((leader, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                  >
                    <div className="h-64 overflow-hidden">
                      <img
                        src={leader.image}
                        alt={leader.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-800 mb-1">
                        {leader.name}
                      </h3>
                      <p className="text-red-600 font-medium mb-3">
                        {leader.title}
                      </p>
                      <p className="text-gray-600">{leader.bio}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Get Involved */}
              <div className="bg-red-50 p-8 rounded-xl border border-red-100">
                <h3 className="text-2xl font-semibold mb-4 text-gray-800">
                  Get Involved
                </h3>
                <p className="text-gray-700 mb-6">
                  We're always looking for passionate adults who want to make a
                  difference in the lives of young people. If you're interested
                  in volunteering with our youth ministry, we'd love to hear
                  from you!
                </p>

                <div className="flex flex-wrap gap-4">
                  <a
                    href="#volunteer"
                    className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors"
                  >
                    Volunteer Application
                  </a>
                  <a
                    href="mailto:youth@church.org"
                    className="px-6 py-3 bg-white hover:bg-gray-100 text-red-600 font-bold rounded-lg border border-red-200 transition-colors"
                  >
                    Contact Youth Pastor
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Call to Action Section */}
      <section
        id="join-us"
        className="py-16 bg-gradient-to-b from-green-900 to-green-800 text-white"
      >
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Join Lit Nation This Friday!
          </h2>
          <p className="text-xl max-w-3xl mx-auto mb-10">
            Experience worship, fun, and friendship in a community that helps
            you grow in your faith. All youth are welcome - bring a friend!
          </p>

          <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl inline-block">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div>
                <h3 className="font-bold text-xl mb-2 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  When
                </h3>
                <p>Every Friday at 6:30PM</p>
              </div>

              <div>
                <h3 className="font-bold text-xl mb-2 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Where
                </h3>
                <p>Main Sanctuary</p>
              </div>

              <div>
                <h3 className="font-bold text-xl mb-2 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  Who
                </h3>
                <p>Ages 13-25 Welcome</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default YouthMinistry;
