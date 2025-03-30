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
        <meta name="description" content="Discover the vision and mission of Victory Bible Church - our purpose and calling in the community." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative overflow-hidden h-[70vh]">
        <motion.div
          className={`absolute inset-0 ${
            !isImageLoaded ? "animate-pulse bg-gray-200 dark:bg-gray-700" : ""
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

        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 via-purple-900/70 to-blue-900/80"></div>

        <div className="container mx-auto px-4 relative z-10 h-full flex flex-col justify-center items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight">
              Vision & <span className="text-yellow-400">Mission</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-100 max-w-2xl mx-auto leading-relaxed font-light">
              Our purpose and calling in the community and the world
            </p>
            <motion.div
              className="h-1 bg-yellow-400 mx-auto mt-8"
              initial={{ width: 0 }}
              animate={{ width: 100 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            />
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-4xl">
          {/* Vision Section */}
          <motion.div
            className="mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl dark:shadow-gray-900/30 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-blue-800 py-8 px-8">
                <h2 className="text-3xl font-bold text-white text-center">Our Vision</h2>
              </div>
              <div className="p-8 md:p-12">
                <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed text-center mb-8">
                  To be a placeholder for the church's vision statement. This section will be updated with the actual vision statement.
                </p>
                <div className="flex flex-col md:flex-row items-center justify-center gap-8 mt-8">
                  {/* Icons/illustrations can be added here */}
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-full w-40 h-40 flex items-center justify-center">
                    <span className="text-5xl text-blue-600 dark:text-blue-400">🔍</span>
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-full w-40 h-40 flex items-center justify-center">
                    <span className="text-5xl text-blue-600 dark:text-blue-400">🌟</span>
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-full w-40 h-40 flex items-center justify-center">
                    <span className="text-5xl text-blue-600 dark:text-blue-400">🌎</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Mission Section */}
          <motion.div
            className="mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl dark:shadow-gray-900/30 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 to-purple-800 py-8 px-8">
                <h2 className="text-3xl font-bold text-white text-center">Our Mission</h2>
              </div>
              <div className="p-8 md:p-12">
                <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed text-center mb-8">
                  To be a placeholder for the church's mission statement. This section will be updated with the actual mission statement.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 text-center shadow-sm dark:shadow-gray-900/20">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">Connect</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Placeholder text for the "Connect" aspect of the mission.
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 text-center shadow-sm dark:shadow-gray-900/20">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">Grow</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Placeholder text for the "Grow" aspect of the mission.
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 text-center shadow-sm dark:shadow-gray-900/20">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">Serve</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Placeholder text for the "Serve" aspect of the mission.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Core Values Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl dark:shadow-gray-900/30 overflow-hidden">
              <div className="bg-gradient-to-r from-yellow-500 to-yellow-700 py-8 px-8">
                <h2 className="text-3xl font-bold text-white text-center">Core Values</h2>
              </div>
              <div className="p-8 md:p-12">
                <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed text-center mb-8">
                  Placeholder for core values. This section will be updated with the church's actual core values.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[1, 2, 3, 4, 5, 6].map((index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="bg-yellow-100 dark:bg-yellow-900/30 rounded-full w-12 h-12 flex items-center justify-center shrink-0">
                        <span className="font-bold text-yellow-700 dark:text-yellow-400">{index}</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800 dark:text-gray-100 text-lg mb-2">Value {index}</h3>
                        <p className="text-gray-600 dark:text-gray-300">Placeholder description for core value {index}.</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer Separator */}
      <div className="footer-separator">
        <div className="container mx-auto px-4 py-10">
          <div className="h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent"></div>
          <div className="flex justify-center mt-8">
            <div className="bg-white dark:bg-gray-800 rounded-full p-4 shadow-lg">
              <div className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisionMission; 