import Timeline from "../components/Timeline/Timeline";

const OurStory = () => {

  return (
    <div className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Hero Section with dark background for navbar contrast */}
      <section className="relative min-h-screen overflow-hidden">
        {/* Background with dark gradient overlay */}
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center transform scale-105"
            style={{ backgroundImage: `url('/assets/hero-bg.jpg')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/85 via-black/70 to-black/85" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl xl:max-w-5xl 2xl:max-w-6xl 3xl:max-w-7xl mx-auto text-center">
            <div className="flex items-center justify-center space-x-4 mb-6 md:mb-8">
              <div className="h-0.5 w-8 md:w-12 bg-primary-500" />
              <span className="font-medium text-white text-base md:text-lg xl:text-xl tracking-wider">
                Our Story
              </span>
              <div className="h-0.5 w-8 md:w-12 bg-primary-500" />
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl 3xl:text-9xl font-bold text-white mb-6 md:mb-8 leading-tight">
              Our Journey of <span className="text-primary-400">Faith</span>
            </h1>
            
            <p className="text-lg sm:text-xl md:text-2xl xl:text-3xl 2xl:text-4xl text-gray-300 mb-8 md:mb-12 leading-relaxed max-w-2xl md:max-w-3xl xl:max-w-4xl 2xl:max-w-5xl mx-auto">
              Victory Bible Church has been on a remarkable journey since our
              founding. What began as a small gathering of believers has grown
              into a vibrant community of faith.
            </p>
            
            <div className="flex items-center justify-center space-x-3 md:space-x-4 mb-8 md:mb-12">
              <div className="h-px w-12 md:w-16 xl:w-20 bg-yellow-400" />
              <div className="w-2 h-2 xl:w-3 xl:h-3 bg-yellow-400 rounded-full" />
              <div className="h-px w-12 md:w-16 xl:w-20 bg-yellow-400" />
            </div>

            {/* Scroll indicator - positioned below yellow ribbon */}
            <div 
              className="flex flex-col items-center animate-bounce cursor-pointer hover:scale-110 transition-transform duration-300 mt-6 md:mt-8"
              onClick={() => {
                window.scrollTo({
                  top: window.innerHeight,
                  behavior: "smooth",
                });
              }}
            >
              <div className="flex flex-col items-center group">
                <span className="text-white/60 text-xs sm:text-sm xl:text-base font-light tracking-wider mb-2 group-hover:text-white/80 transition-colors">
                  EXPLORE OUR JOURNEY
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 md:h-6 md:w-6 xl:h-7 xl:w-7 text-white/60 group-hover:text-white/80 transition-colors"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-16 md:py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-gray-900">
            Building Lives, Impacting Nations
          </h2>
          <p className="text-xl text-gray-700 mb-8 leading-relaxed">
            Through the years, we've witnessed God's faithfulness as we've grown
            in numbers, expanded our facilities, developed new ministries, and
            reached out to our community and beyond.
          </p>
          <p className="text-lg text-gray-600 mb-8">
            Each milestone in our history represents countless stories of lives changed, faith
            strengthened, and communities transformed through the power of Christ.
          </p>
          <div className="w-24 h-1 bg-yellow-400 mx-auto mb-12 rounded-full"></div>
        </div>
      </section>

      <Timeline />

      {/* Conclusion Section */}
      <section className="py-12 md:py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">
            Join Us in Writing the Next Chapter
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
            As we look to the future, we're excited about what God has in store
            for Victory Bible Church. We invite you to be part of our ongoing
            story as we continue to pursue our vision of winning a generation
            for Christ.
          </p>
          <a
            href="/contact"
            className="inline-block bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-full transition-colors duration-300 shadow-md hover:shadow-lg"
          >
            Connect With Us
          </a>
        </div>
      </section>
    </div>
  );
};

export default OurStory;
