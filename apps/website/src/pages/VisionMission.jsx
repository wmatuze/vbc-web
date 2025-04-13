import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import PlaceHolderbanner from "../assets/ministry-banners/ph.png";
import FallbackImage from "../assets/fallback-image.png";

const VisionMission = () => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Helmet>
        <title>Vision & Mission | Victory Bible Church</title>
        <meta
          name="description"
          content="Discover the vision and mission of Victory Bible Church - our purpose and calling in the community."
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
            alt="Vision & Mission banner"
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
              Vision <span className="font-thin">&</span> Mission
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mx-auto leading-relaxed font-extralight tracking-wide max-w-2xl">
              Our purpose and calling in the community and the world
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

      {/* Main Content */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-4xl">
          {/* Vision Section */}
          <motion.div
            className="mb-24"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Our Vision
              </h2>
              <div className="w-16 h-0.5 bg-gray-900 dark:bg-white mx-auto"></div>
            </div>

            <div className="max-w-3xl mx-auto">
              <p className="text-2xl font-light text-gray-900 dark:text-white leading-relaxed text-center mb-8">
                "Winning a generation for Christ"
              </p>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed text-center">
                Our vision is to reach and transform the current generation with
                the life-changing message of Jesus Christ, raising up disciples
                who will impact their communities and the nations.
              </p>
            </div>
          </motion.div>

          {/* Mission Section */}
          <motion.div
            className="mb-24"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Our Mission
              </h2>
              <div className="w-16 h-0.5 bg-gray-900 dark:bg-white mx-auto"></div>
            </div>

            <div className="max-w-3xl mx-auto mb-16">
              <p className="text-2xl font-light text-gray-900 dark:text-white leading-relaxed text-center mb-8">
                "Building lives, impacting nations, establishing the kingdom
                with excellence"
              </p>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed text-center">
                We are committed to developing people spiritually, equipping
                them to influence their communities and nations, while advancing
                God's kingdom through a standard of excellence in all we do.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-16">
                <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    Leadership Development
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    Equipping and raising up leaders who will impact their
                    spheres of influence with godly character and competence.
                  </p>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    Intercessory Prayer
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    Establishing a foundation of prayer that supports all
                    aspects of our ministry and impacts our community and
                    nation.
                  </p>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    Social Engagement
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    Actively participating in community transformation through
                    outreach, service, and addressing social needs.
                  </p>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    Apostolic Government
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    Establishing biblical principles of leadership and
                    governance in the church and community.
                  </p>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    Fellowship & Discipleship
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    Building authentic community and intentional discipleship
                    pathways that help believers grow in their faith.
                  </p>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    Economic Empowerment
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    Equipping our members with biblical financial principles and
                    practical skills for prosperity and kingdom impact.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Core Values Section */}
          <motion.div
            className="mb-24"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Core Values
              </h2>
              <div className="w-16 h-0.5 bg-gray-900 dark:bg-white mx-auto"></div>
            </div>

            <div className="max-w-3xl mx-auto">
              <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed text-center mb-12">
                These core values guide our decisions, shape our culture, and
                define who we are as a church.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    01. The Kingdom of God
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    We prioritize God's kingdom and His righteousness in all we
                    do, seeking to extend His rule and reign in every sphere of
                    life.
                  </p>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    02. Family
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    We value strong families as the foundation of church and
                    society, and we are committed to strengthening family
                    relationships.
                  </p>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    03. Prayer
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    We believe in the power of prayer and maintain a strong
                    prayer culture that undergirds all our ministries and
                    activities.
                  </p>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    04. Integrity
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    We uphold honesty, transparency, and ethical conduct in all
                    our dealings, maintaining consistency between our words and
                    actions.
                  </p>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    05. Excellence
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    We pursue excellence in all we do, giving our best as unto
                    the Lord and maintaining high standards in ministry and
                    service.
                  </p>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    06. Prosperity
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    We believe in holistic prosperity that encompasses
                    spiritual, physical, and material well-being for the
                    advancement of God's kingdom.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer Separator */}
      <div className="footer-separator">
        <div className="container mx-auto px-4 py-16">
          <div className="h-px bg-gray-200 dark:bg-gray-700 max-w-md mx-auto"></div>
        </div>
      </div>
    </div>
  );
};

export default VisionMission;
