import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import PlaceHolderbanner from "../assets/ministry-banners/ph.png";
import FallbackImage from "../assets/fallback-image.png";

const WhatWeBelieve = () => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  // Core belief statements
  const beliefs = [
    {
      title: "The Bible",
      content:
        "We believe the Bible is the inspired, infallible Word of God, the supreme authority for faith and practice. Scripture is our foundation for understanding God's truth and guidance for daily living.",
    },
    {
      title: "God",
      content:
        "We believe in one God, eternally existing in three persons: Father, Son, and Holy Spirit. God is the Creator and Sustainer of all things, infinite in love, perfect in holiness, and worthy of all worship.",
    },
    {
      title: "Jesus Christ",
      content:
        "We believe in Jesus Christ, God's only Son, fully divine and fully human. We affirm His virgin birth, sinless life, sacrificial death, bodily resurrection, and ascension to heaven where He now intercedes for believers.",
    },
    {
      title: "Holy Spirit",
      content:
        "We believe in the Holy Spirit who convicts the world of sin, regenerates believers, and empowers Christians for godly living and service. The Spirit bestows spiritual gifts for the edification of the church and the advancement of God's kingdom.",
    },
    {
      title: "Salvation",
      content:
        "We believe salvation is by grace through faith in Jesus Christ alone. This salvation includes regeneration, justification, sanctification, and glorification. Good works are the fruit of genuine faith, not the means of salvation.",
    },
    {
      title: "The Church",
      content:
        "We believe the Church is the body of Christ, composed of all true believers. The local church is called to worship God, nurture believers, and proclaim the gospel through word and deed to all nations.",
    },
    {
      title: "Baptism & Communion",
      content:
        "We believe in water baptism by immersion as a public declaration of faith in Christ. We observe the Lord's Supper in remembrance of His sacrifice, examining ourselves and recognizing our unity in the body of Christ.",
    },
    {
      title: "The Lord's Return",
      content:
        "We believe in the personal, visible return of Christ to establish His kingdom in its fullness. We anticipate the resurrection of the dead, the final judgment, and the eternal state of either heaven or hell.",
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Helmet>
        <title>What We Believe | Victory Bible Church</title>
        <meta
          name="description"
          content="Our statement of faith and core beliefs at Victory Bible Church."
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
            alt="What We Believe banner"
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
              WHAT WE BELIEVE
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mx-auto leading-relaxed font-extralight tracking-wide max-w-2xl">
              Our statement of faith and core doctrinal beliefs
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
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-4xl">
          {/* Introduction */}
          <motion.div
            className="mb-24 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Our Statement of Faith
              </h2>
              <div className="w-16 h-0.5 bg-gray-900 dark:bg-white mx-auto"></div>
            </div>

            <div className="max-w-3xl mx-auto">
              <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
                At Victory Bible Church, we hold to the foundational truths of
                the Christian faith as revealed in Scripture. These beliefs
                shape our teaching, guide our practices, and unite us in our
                mission to win a generation for Christ.
              </p>
            </div>
          </motion.div>

          {/* Bible Verse */}
          <motion.div
            className="mb-24"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="border-t border-b border-gray-200 dark:border-gray-700 py-12 text-center max-w-3xl mx-auto">
              <p className="text-2xl italic text-gray-800 dark:text-gray-200 font-light leading-relaxed">
                "For I delivered to you as of first importance what I also
                received: that Christ died for our sins in accordance with the
                Scriptures, that he was buried, that he was raised on the third
                day in accordance with the Scriptures."
              </p>
              <p className="text-gray-600 dark:text-gray-400 font-medium mt-6">
                1 Corinthians 15:3-4
              </p>
            </div>
          </motion.div>

          {/* Beliefs List */}
          <div className="space-y-16">
            {beliefs.map((belief, index) => (
              <motion.div
                key={belief.title}
                className="border-t border-gray-200 dark:border-gray-700 pt-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  {belief.title}
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed max-w-3xl">
                  {belief.content}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Conclusion */}
          <motion.div
            className="mt-24 mb-16 max-w-3xl mx-auto border-t border-gray-200 dark:border-gray-700 pt-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <p className="text-lg text-gray-700 dark:text-gray-300 italic leading-relaxed">
              This statement of faith does not exhaust the extent of our
              beliefs. The Bible itself, as the inspired and infallible Word of
              God, speaks with final authority concerning truth, morality, and
              the proper conduct of mankind.
            </p>
            <p className="text-lg text-gray-700 dark:text-gray-300 mt-6 leading-relaxed">
              We invite you to join us in worship and study as we explore these
              beliefs together and apply them to our daily lives. If you have
              questions about our beliefs or would like to discuss them further,
              please{" "}
              <a
                href="/contact"
                className="text-gray-900 dark:text-white font-medium border-b border-gray-400 hover:border-gray-900 dark:hover:border-white transition-colors"
              >
                contact us
              </a>{" "}
              or speak with one of our pastors after a service.
            </p>
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

export default WhatWeBelieve;
