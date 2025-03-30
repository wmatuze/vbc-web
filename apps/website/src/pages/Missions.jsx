import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet"; // For SEO meta tags
import PlaceHolderbanner from "../assets/ministry-banners/ph.png"; // Placeholder banner
import FallbackImage from "../assets/fallback-image.png"; // Fallback image

// --- Data ---
const missionProjects = [
  {
    title: "Local Community Outreach",
    description:
      "Providing food, shelter, and support to those in need within our community.",
    image: "/images/mission-local.jpg",
    altText: "Volunteers serving food in our local community.",
    link: "/missions/local-outreach",
  },
  {
    title: "Global Missions",
    description:
      "Spreading the message of Christ through international mission trips.",
    image: "/images/mission-global.jpg",
    altText: "Missionaries sharing the Gospel around the world.",
    link: "/missions/global",
  },
  {
    title: "Youth Empowerment",
    description:
      "Training and equipping young people with leadership and spiritual growth programs.",
    image: "/images/mission-youth.jpg",
    altText: "Youth engaged in leadership and spiritual development.",
    link: "/missions/youth",
  },
  {
    title: "Church Planting",
    description:
      "Establishing new church branches to spread the Gospel in new areas.",
    image: "/images/mission-church.jpg",
    altText: "A newly planted church reaching a new community.",
    link: "/missions/church-planting",
  },
];

const testimonials = [
  {
    quote: "Seeing the impact of our work firsthand was truly life-changing.",
    author: "Jane Doe",
    authorTitle: "Volunteer, Local Outreach",
    image: "/images/testimonial-jane.jpg",
  },
  {
    quote:
      "The support we received allowed us to reach so many people in need.",
    author: "John Smith",
    authorTitle: "Missionary, Global Missions",
    image: "/images/testimonial-john.jpg",
  },
];

// --- Components ---

const MissionCard = ({ mission, index }) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false); // Loading state for Mission Card Image

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
    >
      <div
        className={`relative ${
          !isImageLoaded ? "animate-pulse bg-gray-200" : ""
        }`}
      >
        <img
          src={mission.image}
          alt={mission.altText}
          className="w-full h-64 object-cover object-center"
          loading="lazy"
          onLoad={() => setIsImageLoaded(true)}
          onError={(e) => {
            e.target.src = FallbackImage; // Fallback on image load error
            setIsImageLoaded(true); // Ensure loading state is updated even on error
          }}
        />
      </div>
      <div className="p-6">
        <h2 className="text-2xl font-semibold text-gray-900">
          {mission.title}
        </h2>
        <p className="text-gray-600 mt-2">{mission.description}</p>
        <Link
          to={mission.link}
          className="mt-4 inline-block text-[#C89C5E] hover:text-[#B2854A] transition-colors duration-300 font-semibold"
        >
          Learn More →
        </Link>
      </div>
    </motion.div>
  );
};

const Testimonial = ({ testimonial }) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false); // Loading state for Testimonial Image

  return (
    <div className="bg-gray-100 p-6 rounded-lg shadow-md">
      <p className="text-gray-700 italic">"{testimonial.quote}"</p>
      <div className="mt-4 flex items-center">
        {testimonial.image && (
          <div
            className={`relative rounded-full overflow-hidden w-12 h-12 mr-4 ${
              !isImageLoaded ? "animate-pulse bg-gray-200" : ""
            }`}
          >
            <img
              src={testimonial.image}
              alt={testimonial.author}
              className="w-full h-full object-cover"
              onLoad={() => setIsImageLoaded(true)}
              onError={(e) => {
                e.target.src = FallbackImage; // Fallback on image load error
                setIsImageLoaded(true); // Ensure loading state is updated even on error
              }}
            />
          </div>
        )}
        <div>
          <p className="font-semibold text-gray-800">{testimonial.author}</p>
          {testimonial.authorTitle && (
            <p className="text-gray-600">{testimonial.authorTitle}</p>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Call to Action ---
const CallToAction = () => (
  <div className="bg-[#1E3A8A] text-white py-12 text-center mt-12 rounded-lg shadow-lg">
    <div className="container mx-auto px-4">
      <h2 className="text-3xl font-bold mb-4">Get Involved</h2>
      <p className="text-lg mb-8">
        Support our missions and make a difference.
      </p>
      <div className="flex flex-col md:flex-row justify-center gap-4">
        <Link
          to="/donate"
          className="bg-[#C89C5E] text-white px-6 py-3 rounded-md font-semibold hover:bg-[#B2854A] transition-colors duration-300"
        >
          Donate Now
        </Link>
        <Link
          to="/volunteer"
          className="border-2 border-white text-white px-6 py-3 rounded-md font-semibold hover:bg-white hover:text-[#1E3A8A] transition-colors duration-300"
        >
          Volunteer
        </Link>
      </div>
    </div>
  </div>
);

// --- Main Missions Component ---
const Missions = () => {
  const [isImageLoaded, setIsImageLoaded] = useState(false); // Loading state for Hero Image

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* SEO Meta Tags */}
      <Helmet>
        <title>Our Missions - Victory Bible Church</title>
        <meta
          name="description"
          content="Discover the missions of Victory Bible Church. Learn about our local outreach, global missions, youth empowerment, and church planting initiatives."
        />
      </Helmet>

      {/* Hero Section - Similar to About Us Page */}
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
            alt="Victory Bible Church banner for Missions"
            className="hidden"
            onLoad={() => setIsImageLoaded(true)}
            onError={() => setIsImageLoaded(true)} // Fallback on error
          />
        </motion.div>

        <div className="absolute inset-0 bg-gradient-to-r from-[#1E3A8A]/80 via-[#2E4A9A]/70 to-[#1E3A8A]/80 rounded-b-3xl"></div>

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
              Our <span className="text-[#C89C5E]">Missions</span>
            </h1>
            <p className="text-lg text-white text-center max-w-3xl mx-auto leading-relaxed font-light drop-shadow-md">
              Spreading the love of Christ through outreach, church planting,
              and humanitarian efforts.
            </p>
            <motion.div
              className="h-1 bg-[#C89C5E] mx-auto mt-8"
              initial={{ width: 0 }}
              animate={{ width: 100 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            />
          </motion.div>
        </div>
      </section>

      {/* Missions Projects Section */}
      <div className="container mx-auto px-4 py-10">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
          Our Mission Projects
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {missionProjects.map((mission, index) => (
            <MissionCard key={index} mission={mission} index={index} />
          ))}
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="container mx-auto px-4 py-16 bg-gray-100 rounded-lg mt-12">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
          Stories from the Field
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <Testimonial key={index} testimonial={testimonial} />
          ))}
        </div>
      </div>

      <CallToAction />
    </div>
  );
};

export default Missions;
