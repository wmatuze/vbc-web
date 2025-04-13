import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet"; // For SEO meta tags
import PlaceHolderbanner from "../assets/ministry-banners/ph.png"; // Placeholder banner
import FallbackImage from "../assets/fallback-image.png"; // Fallback image
import {
  FaHandsHelping,
  FaGlobeAfrica,
  FaUsers,
  FaChurch,
  FaPrayingHands,
  FaHeart,
  FaArrowRight,
} from "react-icons/fa";

// --- Data ---
const missionProjects = [
  {
    title: "Local Community Outreach",
    description:
      "Providing food, shelter, and support to those in need within our community. Our local outreach programs focus on meeting immediate needs while sharing the love of Christ.",
    detailedDescription:
      "Our local outreach initiatives include food distribution programs, homeless shelter support, after-school tutoring, and emergency assistance for families in crisis. We partner with local organizations to maximize our impact and reach those most in need.",
    image: "/images/mission-local.jpg",
    altText: "Volunteers serving food in our local community.",
    link: "/missions/local-outreach",
    icon: <FaHandsHelping />,
    howToHelp: [
      "Volunteer at our monthly food drives",
      "Donate non-perishable food items",
      "Contribute to our emergency assistance fund",
      "Mentor youth in our after-school programs",
    ],
  },
  {
    title: "Global Missions",
    description:
      "Spreading the message of Christ through international mission trips and supporting missionaries around the world who are sharing the Gospel.",
    detailedDescription:
      "Our global missions focus on evangelism, discipleship, and humanitarian aid in regions where the Gospel is needed most. We send short-term mission teams annually and support long-term missionaries who are establishing sustainable ministry in various nations.",
    image: "/images/mission-global.jpg",
    altText: "Missionaries sharing the Gospel around the world.",
    link: "/missions/global",
    icon: <FaGlobeAfrica />,
    howToHelp: [
      "Join a short-term mission trip",
      "Sponsor a missionary",
      "Participate in our prayer team",
      "Donate to specific global projects",
    ],
  },
  {
    title: "Youth Empowerment",
    description:
      "Training and equipping young people with leadership skills, biblical knowledge, and spiritual growth opportunities to impact their generation.",
    detailedDescription:
      "Our youth empowerment programs focus on developing the next generation of leaders through mentorship, biblical training, and practical leadership experiences. We believe in investing in young people and giving them opportunities to serve and lead.",
    image: "/images/mission-youth.jpg",
    altText: "Youth engaged in leadership and spiritual development.",
    link: "/missions/youth",
    icon: <FaUsers />,
    howToHelp: [
      "Mentor a young person",
      "Volunteer with youth programs",
      "Sponsor a youth for leadership training",
      "Provide internship opportunities",
    ],
  },
  {
    title: "Church Planting",
    description:
      "Establishing new church communities to spread the Gospel in new areas and reach people with the life-changing message of Jesus Christ.",
    detailedDescription:
      "Our church planting initiatives focus on identifying, training, and supporting church planters who are called to establish new congregations. We provide resources, mentorship, and financial support to help these new churches become self-sustaining communities of faith.",
    image: "/images/mission-church.jpg",
    altText: "A newly planted church reaching a new community.",
    link: "/missions/church-planting",
    icon: <FaChurch />,
    howToHelp: [
      "Join a church planting team",
      "Provide financial support for new churches",
      "Offer professional skills (accounting, legal, etc.)",
      "Pray for church planters and new congregations",
    ],
  },
];

const testimonials = [
  {
    quote:
      "Participating in the local outreach program opened my eyes to the needs in our own community. Serving alongside fellow believers to meet these needs has strengthened my faith and given me a deeper understanding of Christ's love in action.",
    author: "David M.",
    authorTitle: "Local Outreach Volunteer",
    image: "/images/testimonial-jane.jpg",
    project: "Local Community Outreach",
  },
  {
    quote:
      "Our mission trip to East Africa was transformative. We helped build a school and witnessed several people come to Christ. The relationships we formed continue to this day, and I'm grateful for how God used our team to make an eternal impact.",
    author: "Sarah J.",
    authorTitle: "Global Missions Team Member",
    image: "/images/testimonial-john.jpg",
    project: "Global Missions",
  },
  {
    quote:
      "Being mentored through the youth empowerment program gave me confidence in my faith and leadership abilities. Now I'm serving as a youth leader myself, passing on what I've learned to the next generation.",
    author: "Michael T.",
    authorTitle: "Youth Leader",
    image: "/images/testimonial-jane.jpg",
    project: "Youth Empowerment",
  },
  {
    quote:
      "Supporting the church planting initiative has been one of the most rewarding experiences of my life. Seeing a new congregation form and grow, reaching people who might never have entered a traditional church, reminds me of the early church in Acts.",
    author: "Rebecca L.",
    authorTitle: "Church Planting Supporter",
    image: "/images/testimonial-john.jpg",
    project: "Church Planting",
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
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow duration-300"
    >
      <div
        className={`relative ${
          !isImageLoaded ? "animate-pulse bg-gray-200 dark:bg-gray-700" : ""
        }`}
      >
        <img
          src={mission.image}
          alt={mission.altText}
          className="w-full h-64 object-cover object-center filter grayscale"
          loading="lazy"
          onLoad={() => setIsImageLoaded(true)}
          onError={(e) => {
            e.target.src = FallbackImage; // Fallback on image load error
            setIsImageLoaded(true); // Ensure loading state is updated even on error
          }}
        />
        <div className="absolute top-4 left-4 bg-black/70 p-3 rounded-full text-white">
          {mission.icon}
        </div>
      </div>
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
          {mission.title}
        </h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          {mission.description}
        </p>
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Link
            to={mission.link}
            className="inline-flex items-center text-gray-900 dark:text-white font-medium hover:underline"
          >
            Learn More <FaArrowRight className="ml-2 text-sm" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

// --- Call to Action ---
const CallToAction = () => (
  <section className="py-32 bg-black text-white">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
        <div>
          <h2 className="text-5xl font-bold mb-8 leading-tight">
            Join Our Mission
          </h2>
          <p className="text-xl mb-10 font-light leading-relaxed">
            Support our missions and make a difference in the lives of people
            around the world. Whether through prayer, financial support, or
            hands-on service, your involvement matters.
          </p>
          <div className="flex flex-col sm:flex-row gap-6">
            <Link
              to="/donate"
              className="bg-white text-black px-8 py-4 font-semibold hover:bg-gray-100 transition-colors duration-300 inline-block text-center"
            >
              Donate Now
            </Link>
            <Link
              to="/volunteer"
              className="border-2 border-white text-white px-8 py-4 font-semibold hover:bg-white/10 transition-colors duration-300 inline-block text-center"
            >
              Volunteer
            </Link>
          </div>
        </div>
        <div className="border-l border-gray-800 pl-16 hidden lg:block">
          <blockquote className="text-2xl italic font-light leading-relaxed">
            "And how are they to preach unless they are sent? As it is written,
            'How beautiful are the feet of those who preach the good news!'"
          </blockquote>
          <p className="text-gray-400 mt-6 text-lg">Romans 10:15</p>
          <div className="mt-12 space-y-6">
            <p className="flex items-center text-lg">
              <FaPrayingHands className="mr-4 text-gray-400" /> Pray for our
              missions
            </p>
            <p className="flex items-center text-lg">
              <FaHeart className="mr-4 text-gray-400" /> Support a missionary
            </p>
            <p className="flex items-center text-lg">
              <FaUsers className="mr-4 text-gray-400" /> Join a mission team
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
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

      {/* Hero Section - Minimalist Black & White Design */}
      <section className="relative overflow-hidden h-[85vh] bg-black">
        <motion.div
          className={`absolute inset-0 opacity-40 ${
            !isImageLoaded ? "animate-pulse bg-gray-800" : ""
          }`}
          style={{
            backgroundImage: `url(${
              isImageLoaded ? PlaceHolderbanner : FallbackImage
            })`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "grayscale(100%)",
          }}
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
          aria-label="Hero background image"
        >
          <img
            src={PlaceHolderbanner}
            alt="Victory Bible Church Missions"
            className="hidden"
            onLoad={() => setIsImageLoaded(true)}
            onError={() => setIsImageLoaded(true)}
          />
        </motion.div>

        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/80"></div>

        <div className="container mx-auto px-4 relative z-10 h-full flex flex-col justify-center items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl"
          >
            <h1 className="text-6xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-none">
              OUR MISSIONS
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mx-auto leading-relaxed font-extralight tracking-wide max-w-2xl">
              Spreading the love of Christ through outreach, church planting,
              and humanitarian efforts around the world.
            </p>
            <motion.div
              className="h-px w-24 bg-white mx-auto mt-12"
              initial={{ width: 0 }}
              animate={{ width: 96 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            />
          </motion.div>
        </div>
      </section>

      {/* Biblical Foundation Section */}
      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-20">
            <h2 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Biblical Foundation
            </h2>
            <div className="w-16 h-0.5 bg-gray-900 dark:bg-white mx-auto mb-8"></div>
            <p className="text-xl text-gray-700 dark:text-gray-300">
              Our mission work is rooted in Scripture and motivated by Christ's
              command to share the Gospel with all nations.
            </p>
          </div>

          {/* Featured Scripture - Full Width */}
          <div className="relative h-[400px] mb-24 overflow-hidden">
            <div className="absolute inset-0 bg-black opacity-70"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="max-w-3xl text-center px-6">
                <p className="text-3xl md:text-4xl italic text-white font-light leading-relaxed mb-8">
                  "Go therefore and make disciples of all nations, baptizing
                  them in the name of the Father and of the Son and of the Holy
                  Spirit, teaching them to observe all that I have commanded
                  you. And behold, I am with you always, to the end of the age."
                </p>
                <p className="text-xl text-gray-300 font-medium">
                  Matthew 28:19-20
                </p>
              </div>
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 max-w-6xl mx-auto">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                The Great Commission
              </h3>
              <div className="w-12 h-0.5 bg-gray-900 dark:bg-white mb-8"></div>
              <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
                Jesus commanded His followers to go into all the world and make
                disciples. This commission drives our mission efforts locally
                and globally, as we seek to share the Gospel and make disciples
                in every nation.
              </p>
              <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed mt-6">
                We believe that the Great Commission is not just a suggestion
                but a mandate for all believers. It shapes our priorities,
                guides our decisions, and motivates our actions as a church
                community.
              </p>
            </div>

            <div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                Acts 1:8 Strategy
              </h3>
              <div className="w-12 h-0.5 bg-gray-900 dark:bg-white mb-8"></div>
              <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
                "But you will receive power when the Holy Spirit has come upon
                you, and you will be my witnesses in Jerusalem and in all Judea
                and Samaria, and to the end of the earth."
              </p>
              <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed mt-6">
                We follow this biblical model by reaching our local community
                (our Jerusalem), our region (our Judea and Samaria), and the
                nations (the ends of the earth). This strategic approach ensures
                that we are fulfilling our mission at every level, from our
                immediate neighborhood to the farthest corners of the globe.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Missions Projects Section - CRSA Style */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-20">
            <h2 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Our Mission Projects
            </h2>
            <div className="w-16 h-0.5 bg-gray-900 dark:bg-white mx-auto mb-8"></div>
            <p className="text-xl text-gray-700 dark:text-gray-300">
              Explore our key mission initiatives and discover how you can get
              involved.
            </p>
          </div>

          {/* Large Featured Project - First Row */}
          <div className="mb-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1">
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                  {missionProjects[0].title}
                </h3>
                <p className="text-xl text-gray-700 dark:text-gray-300 mb-6">
                  {missionProjects[0].detailedDescription}
                </p>
                <div className="mb-8">
                  <h4 className="font-bold text-gray-900 dark:text-white mb-3">
                    How you can help:
                  </h4>
                  <ul className="space-y-2">
                    {missionProjects[0].howToHelp.map((item, i) => (
                      <li key={i} className="flex items-start">
                        <span className="text-gray-900 dark:text-white mr-2">
                          •
                        </span>
                        <span className="text-gray-700 dark:text-gray-300">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Link
                  to={missionProjects[0].link}
                  className="inline-flex items-center text-gray-900 dark:text-white font-medium border-b border-gray-400 hover:border-gray-900 dark:hover:border-white transition-colors"
                >
                  Learn More <FaArrowRight className="ml-2 text-sm" />
                </Link>
              </div>
              <div className="order-1 lg:order-2">
                <div className="relative overflow-hidden h-[500px]">
                  <img
                    src={missionProjects[0].image}
                    alt={missionProjects[0].altText}
                    className="w-full h-full object-cover filter grayscale"
                    onError={(e) => {
                      e.target.src = FallbackImage;
                    }}
                  />
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div className="absolute top-6 left-6 bg-black/70 p-4 rounded-full text-white">
                    {missionProjects[0].icon}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Second Row - Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 mb-24">
            {/* Second Project */}
            <div>
              <div className="relative overflow-hidden h-[400px] mb-8">
                <img
                  src={missionProjects[1].image}
                  alt={missionProjects[1].altText}
                  className="w-full h-full object-cover filter grayscale"
                  onError={(e) => {
                    e.target.src = FallbackImage;
                  }}
                />
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="absolute top-6 left-6 bg-black/70 p-4 rounded-full text-white">
                  {missionProjects[1].icon}
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {missionProjects[1].title}
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                {missionProjects[1].detailedDescription}
              </p>
              <Link
                to={missionProjects[1].link}
                className="inline-flex items-center text-gray-900 dark:text-white font-medium border-b border-gray-400 hover:border-gray-900 dark:hover:border-white transition-colors"
              >
                Learn More <FaArrowRight className="ml-2 text-sm" />
              </Link>
            </div>

            {/* Third Project */}
            <div>
              <div className="relative overflow-hidden h-[400px] mb-8">
                <img
                  src={missionProjects[2].image}
                  alt={missionProjects[2].altText}
                  className="w-full h-full object-cover filter grayscale"
                  onError={(e) => {
                    e.target.src = FallbackImage;
                  }}
                />
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="absolute top-6 left-6 bg-black/70 p-4 rounded-full text-white">
                  {missionProjects[2].icon}
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {missionProjects[2].title}
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                {missionProjects[2].detailedDescription}
              </p>
              <Link
                to={missionProjects[2].link}
                className="inline-flex items-center text-gray-900 dark:text-white font-medium border-b border-gray-400 hover:border-gray-900 dark:hover:border-white transition-colors"
              >
                Learn More <FaArrowRight className="ml-2 text-sm" />
              </Link>
            </div>
          </div>

          {/* Fourth Project - Full Width */}
          <div>
            <div className="relative overflow-hidden h-[500px] mb-8">
              <img
                src={missionProjects[3].image}
                alt={missionProjects[3].altText}
                className="w-full h-full object-cover filter grayscale"
                onError={(e) => {
                  e.target.src = FallbackImage;
                }}
              />
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="absolute top-6 left-6 bg-black/70 p-4 rounded-full text-white">
                {missionProjects[3].icon}
              </div>
            </div>
            <div className="max-w-3xl mx-auto">
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                {missionProjects[3].title}
              </h3>
              <p className="text-xl text-gray-700 dark:text-gray-300 mb-6">
                {missionProjects[3].detailedDescription}
              </p>
              <Link
                to={missionProjects[3].link}
                className="inline-flex items-center text-gray-900 dark:text-white font-medium border-b border-gray-400 hover:border-gray-900 dark:hover:border-white transition-colors"
              >
                Learn More <FaArrowRight className="ml-2 text-sm" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section - CRSA Style */}
      <section className="py-24 bg-gray-100 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-20">
            <h2 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Stories from the Field
            </h2>
            <div className="w-16 h-0.5 bg-gray-900 dark:bg-white mx-auto mb-8"></div>
            <p className="text-xl text-gray-700 dark:text-gray-300">
              Hear from those who have experienced the impact of our mission
              work firsthand.
            </p>
          </div>

          {/* Featured Testimonial */}
          <div className="max-w-4xl mx-auto mb-20 bg-white dark:bg-gray-900 p-12 shadow-sm">
            <div className="flex flex-col md:flex-row gap-12 items-center">
              <div className="md:w-1/3">
                <div className="w-32 h-32 mx-auto bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <img
                    src={testimonials[0].image}
                    alt={testimonials[0].author}
                    className="w-full h-full object-cover filter grayscale"
                    onError={(e) => {
                      e.target.src = FallbackImage;
                    }}
                  />
                </div>
                <div className="text-center mt-4">
                  <p className="font-bold text-gray-900 dark:text-white text-lg">
                    {testimonials[0].author}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    {testimonials[0].authorTitle}
                  </p>
                  <p className="text-gray-500 dark:text-gray-500 text-sm mt-1">
                    {testimonials[0].project}
                  </p>
                </div>
              </div>
              <div className="md:w-2/3">
                <p className="text-2xl italic text-gray-700 dark:text-gray-300 leading-relaxed">
                  "{testimonials[0].quote}"
                </p>
              </div>
            </div>
          </div>

          {/* Other Testimonials */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.slice(1).map((testimonial, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-900 p-8 shadow-sm"
              >
                <p className="text-lg italic text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                  "
                  {testimonial.quote.length > 150
                    ? testimonial.quote.substring(0, 150) + "..."
                    : testimonial.quote}
                  "
                </p>
                <div className="flex items-center">
                  <div className="mr-4 w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <img
                      src={testimonial.image}
                      alt={testimonial.author}
                      className="w-full h-full object-cover filter grayscale"
                      onError={(e) => {
                        e.target.src = FallbackImage;
                      }}
                    />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white">
                      {testimonial.author}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {testimonial.authorTitle}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CallToAction />
    </div>
  );
};

export default Missions;
