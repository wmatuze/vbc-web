import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Play, Users, Building2, BookOpen, Heart } from "lucide-react";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import HeroSection from "../components/common/HeroSection";

const AboutUs = () => {
  const location = useLocation();
  const activeTab = location.pathname;

  const navItems = [
    {
      label: "Our Story",
      description: "How Victory Bible Church began and grew over 25+ years of faithful ministry.",
      icon: <Building2 size={20} />,
    },
    {
      label: "Leadership Team",
      description: "Meet the pastors and leaders who shepherd our congregation.",
      icon: <Users size={20} />,
    },
    {
      label: "Vision & Mission",
      description: "The purpose and direction that guides everything we do as a church.",
      icon: <BookOpen size={20} />,
    },
    {
      label: "What We Believe",
      description: "The biblical foundations and core beliefs of our faith community.",
      icon: <Heart size={20} />,
    },
  ];

  const stats = [
    { number: "25+", label: "Years of Service" },
    { number: "1,200+", label: "Church Members" },
    { number: "30+", label: "Community Programs" },
  ];

  return (
    <div className="bg-white">
      <Helmet>
        <title>About Us - Victory Bible Church</title>
        <meta
          name="description"
          content="Learn about Victory Bible Church: our story, leadership, vision, mission, and beliefs."
        />
      </Helmet>

      <HeroSection
        title="About Victory Bible Church"
        subtitle="Who We Are"
        description="Get to know our story, our leaders, our vision, and what we believe."
        primaryAccentText="Victory Bible Church"
        scrollText="EXPLORE OUR STORY"
        backgroundImage="/assets/hero-bg.jpg"
      />

      {/* Stats strip — overlaps the bottom of the hero */}
      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 -mt-16">
        <div className="bg-vbc-section border border-white/10 grid grid-cols-3 divide-x divide-white/10">
          {stats.map(({ number, label }, i) => (
            <div key={i} className="py-7 px-4 md:px-8 text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-1">{number}</div>
              <div className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em]">
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Numbered editorial nav grid */}
      <section className="bg-white pt-16 pb-0 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-8">
            Explore
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-gray-200">
            {navItems.map(({ label, description }, i) => {
              const path = `/about/${label
                .toLowerCase()
                .replace(/ & /g, "-")
                .replace(/ /g, "-")}`;
              const isActive = activeTab === path;
              const num = String(i + 1).padStart(2, "0");

              return (
                <Link
                  key={path}
                  to={path}
                  className={`relative overflow-hidden flex flex-col justify-between min-h-[200px] p-8 group transition-colors ${
                    isActive ? "bg-gray-50" : "bg-white hover:bg-gray-50"
                  }`}
                >
                  {/* Ghost number decoration */}
                  <span className="absolute -top-2 right-4 text-[7rem] font-black text-gray-100 select-none leading-none pointer-events-none">
                    {num}
                  </span>

                  <div className="relative">
                    <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-3">
                      {num}
                    </p>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{label}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
                  </div>

                  <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gray-400 group-hover:text-gray-900 transition-colors mt-6 relative">
                    Explore{" "}
                    <ArrowRightIcon className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why We Exist — editorial typography */}
      <section className="bg-gray-50 py-20 md:py-28 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-10">
            Our Purpose
          </p>
          <p className="text-gray-400 text-lg md:text-xl font-light mb-4">...to</p>
          <h2 className="text-5xl sm:text-6xl md:text-7xl font-black text-gray-900 leading-none mb-1 uppercase">
            Be With Jesus,
          </h2>
          <h2 className="text-5xl sm:text-6xl md:text-7xl font-black text-gray-900 leading-none mb-8 uppercase">
            Become Like Jesus,
          </h2>
          <p className="text-gray-400 text-lg md:text-xl font-light mb-4">and</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-primary-600 leading-tight uppercase">
            Carry On the Mission of Jesus to the World.
          </h2>
        </div>
      </section>

      {/* Community — video placeholder + text */}
      <section className="bg-white py-16 md:py-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Video placeholder */}
            <div className="aspect-video bg-vbc-section flex items-center justify-center group cursor-pointer">
              <div className="flex flex-col items-center gap-4">
                <div className="w-14 h-14 border border-white/20 flex items-center justify-center group-hover:bg-brand-red group-hover:border-brand-red transition-all duration-300">
                  <Play className="text-white w-5 h-5 ml-0.5" />
                </div>
                <p className="text-white/30 text-xs uppercase tracking-widest">
                  Coming Soon
                </p>
              </div>
            </div>

            {/* Text */}
            <div>
              <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-4">
                Community Life
              </p>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-snug">
                Life at Victory{" "}
                <span className="text-primary-600">Bible Church</span>
              </h3>
              <p className="text-gray-500 leading-relaxed mb-8">
                At Victory Bible Church, we believe in creating a vibrant, welcoming
                community where everyone can experience God's love. Our diverse
                congregation comes together not just for Sunday services, but throughout
                the week for small groups, outreach events, and fellowship activities.
              </p>
              <Link
                to="/gallery"
                className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors group/link"
              >
                Explore our media{" "}
                <ArrowRightIcon className="h-3 w-3 group-hover/link:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
