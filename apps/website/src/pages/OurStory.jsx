import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import HeroSection from "../components/common/HeroSection";
import Timeline from "../components/Timeline/Timeline";

const OurStory = () => {
  return (
    <div className="bg-white">
      <Helmet>
        <title>Our Story - Victory Bible Church</title>
        <meta
          name="description"
          content="The story of Victory Bible Church — from humble beginnings to a vibrant community of faith impacting lives and nations."
        />
      </Helmet>

      <HeroSection
        title="Our Journey of Faith"
        subtitle="Our Story"
        description="What began as a small gathering of believers has grown into a vibrant community reaching lives and nations."
        primaryAccentText="Faith"
        scrollText="EXPLORE OUR JOURNEY"
        backgroundImage="/assets/hero-bg.jpg"
      />

      {/* Intro */}
      <section className="bg-white py-16 md:py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-start">
          <div>
            <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-4">
              Our History
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
              Building Lives,<br />Impacting Nations
            </h2>
          </div>
          <div className="space-y-4 pt-1">
            <p className="text-gray-500 leading-relaxed">
              Through the years, we've witnessed God's faithfulness as we've grown in numbers,
              expanded our facilities, developed new ministries, and reached out to our
              community and beyond.
            </p>
            <p className="text-gray-400 text-sm leading-relaxed">
              Each milestone in our history represents countless stories of lives changed,
              faith strengthened, and communities transformed through the power of Christ.
            </p>
          </div>
        </div>
      </section>

      {/* Timeline — full-screen dark interactive */}
      <Timeline />

      {/* Conclusion */}
      <section className="bg-gray-50 py-16 md:py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-4">
              What's Next
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
              Join Us in Writing<br />the Next Chapter
            </h2>
          </div>
          <div>
            <p className="text-gray-500 leading-relaxed mb-8">
              As we look to the future, we're excited about what God has in store for
              Victory Bible Church. We invite you to be part of our ongoing story as we
              continue to pursue our vision of winning a generation for Christ.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors group"
            >
              Connect With Us
              <ArrowRightIcon className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OurStory;
