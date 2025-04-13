import { useEffect } from "react";
import Timeline from "../components/Timeline/Timeline";

const OurStory = () => {
  // Ensure the navbar is visible by setting a CSS variable that can be used in the navbar component
  useEffect(() => {
    // Add a class to the body to ensure the navbar is visible on this page
    document.body.classList.add("force-navbar-visible");

    return () => {
      // Clean up when component unmounts
      document.body.classList.remove("force-navbar-visible");
    };
  }, []);

  return (
    <div className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Spacer div to push content below navbar */}
      <div className="h-20"></div>

      {/* Introduction Section */}
      <section className="py-12 md:py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">
            Our Journey of Faith
          </h1>
          <p className="text-xl text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
            Victory Bible Church has been on a remarkable journey since our
            founding. What began as a small gathering of believers has grown
            into a vibrant community of faith committed to building lives,
            impacting nations, and establishing God's kingdom with excellence.
          </p>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            Through the years, we've witnessed God's faithfulness as we've grown
            in numbers, expanded our facilities, developed new ministries, and
            reached out to our community and beyond. Each milestone in our
            history represents countless stories of lives changed, faith
            strengthened, and communities transformed.
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
