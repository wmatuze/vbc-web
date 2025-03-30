import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import PlaceHolderbanner from "../assets/ministry-banners/ph.png";
import FallbackImage from "../assets/fallback-image.png";

const WhatWeBelieve = () => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  // Sample belief items - these will be replaced with actual content
  const beliefs = [
    {
      title: "The Bible",
      content: "Placeholder text about the Bible being the inspired Word of God. This will be updated with the church's actual statement of belief."
    },
    {
      title: "God",
      content: "Placeholder text about the belief in one true God, eternally existing in three persons. This will be updated with the church's actual statement of belief."
    },
    {
      title: "Jesus Christ",
      content: "Placeholder text about Jesus Christ being the Son of God. This will be updated with the church's actual statement of belief."
    },
    {
      title: "Holy Spirit",
      content: "Placeholder text about the Holy Spirit. This will be updated with the church's actual statement of belief."
    },
    {
      title: "Salvation",
      content: "Placeholder text about salvation through faith in Jesus Christ. This will be updated with the church's actual statement of belief."
    },
    {
      title: "The Church",
      content: "Placeholder text about the Church being the body of Christ. This will be updated with the church's actual statement of belief."
    },
    {
      title: "Baptism",
      content: "Placeholder text about baptism. This will be updated with the church's actual statement of belief."
    },
    {
      title: "The Lord's Return",
      content: "Placeholder text about the second coming of Christ. This will be updated with the church's actual statement of belief."
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Helmet>
        <title>What We Believe | Victory Bible Church</title>
        <meta name="description" content="Our statement of faith and core beliefs at Victory Bible Church." />
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
            alt="What We Believe banner"
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
              What We <span className="text-yellow-400">Believe</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-100 max-w-2xl mx-auto leading-relaxed font-light">
              Our statement of faith and core doctrinal beliefs
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
          {/* Introduction */}
          <motion.div
            className="mb-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">Our Statement of Faith</h2>
            <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
              This is a placeholder introduction to the Statement of Faith. This section will be updated with the church's actual introduction to their beliefs.
            </p>
          </motion.div>

          {/* Bible Verse */}
          <motion.div
            className="mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="bg-blue-50 dark:bg-blue-900/30 rounded-2xl shadow-lg dark:shadow-gray-900/30 p-10 text-center">
              <p className="text-2xl italic text-blue-800 dark:text-blue-300 font-light">
                "For I delivered to you as of first importance what I also received: that Christ died for our sins in accordance with the Scriptures, that he was buried, that he was raised on the third day in accordance with the Scriptures."
              </p>
              <p className="text-blue-600 dark:text-blue-400 font-medium mt-4">1 Corinthians 15:3-4</p>
            </div>
          </motion.div>

          {/* Beliefs List */}
          <div className="space-y-12">
            {beliefs.map((belief, index) => (
              <motion.div
                key={belief.title}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900/30 overflow-hidden border border-gray-100 dark:border-gray-700"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 py-4 px-6">
                  <h3 className="text-xl font-bold text-white">{belief.title}</h3>
                </div>
                <div className="p-6">
                  <p className="text-gray-700 dark:text-gray-300">{belief.content}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Conclusion */}
          <motion.div
            className="mt-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <p className="text-lg text-gray-700 dark:text-gray-300 italic">
              This statement of faith does not exhaust the extent of our beliefs. The Bible itself, as the inspired and infallible Word of God, speaks with final authority concerning truth, morality, and the proper conduct of mankind.
            </p>
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
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatWeBelieve; 