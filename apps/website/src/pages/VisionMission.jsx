import { Helmet } from "react-helmet-async";
import HeroSection from "../components/common/HeroSection";

const missionPillars = [
  {
    num: "01",
    title: "Leadership Development",
    text: "Equipping and raising up leaders who will impact their spheres of influence with godly character and competence.",
  },
  {
    num: "02",
    title: "Intercessory Prayer",
    text: "Establishing a foundation of prayer that supports all aspects of our ministry and impacts our community and nation.",
  },
  {
    num: "03",
    title: "Social Engagement",
    text: "Actively participating in community transformation through outreach, service, and addressing social needs.",
  },
  {
    num: "04",
    title: "Apostolic Government",
    text: "Establishing biblical principles of leadership and governance in the church and community.",
  },
  {
    num: "05",
    title: "Fellowship & Discipleship",
    text: "Building authentic community and intentional discipleship pathways that help believers grow in their faith.",
  },
  {
    num: "06",
    title: "Economic Empowerment",
    text: "Equipping our members with biblical financial principles and practical skills for prosperity and kingdom impact.",
  },
];

const coreValues = [
  {
    num: "01",
    title: "The Kingdom of God",
    text: "We prioritize God's kingdom and His righteousness in all we do, seeking to extend His rule and reign in every sphere of life.",
  },
  {
    num: "02",
    title: "Family",
    text: "We value strong families as the foundation of church and society, and we are committed to strengthening family relationships.",
  },
  {
    num: "03",
    title: "Prayer",
    text: "We believe in the power of prayer and maintain a strong prayer culture that undergirds all our ministries and activities.",
  },
  {
    num: "04",
    title: "Integrity",
    text: "We uphold honesty, transparency, and ethical conduct in all our dealings, maintaining consistency between our words and actions.",
  },
  {
    num: "05",
    title: "Excellence",
    text: "We pursue excellence in all we do, giving our best as unto the Lord and maintaining high standards in ministry and service.",
  },
  {
    num: "06",
    title: "Prosperity",
    text: "We believe in holistic prosperity that encompasses spiritual, physical, and material well-being for the advancement of God's kingdom.",
  },
];

const VisionMission = () => {
  return (
    <div className="bg-white">
      <Helmet>
        <title>Vision & Mission | Victory Bible Church</title>
        <meta
          name="description"
          content="Discover the vision and mission of Victory Bible Church — our purpose and calling in the community and the world."
        />
      </Helmet>

      <HeroSection
        title="Vision & Mission"
        subtitle="Our Purpose"
        description="Our purpose and calling in the community and the world."
        primaryAccentText="Mission"
        scrollText="EXPLORE OUR PURPOSE"
        backgroundImage="/assets/hero-bg.jpg"
        breadcrumbs={[
          { label: "Home", path: "/" },
          { label: "About", path: "/about" },
          { label: "Vision & Mission" },
        ]}
      />

      {/* ── VISION — dark declaration ───────────────────────────────────── */}
      <section className="bg-vbc-section py-20 md:py-28 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-10 md:mb-14">
            Our Vision
          </p>

          {/* The declaration — raw, big, left-aligned */}
          <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white leading-none mb-10 md:mb-14 uppercase">
            Winning a Generation<br className="hidden md:block" /> for{" "}
            <span className="text-primary-400">Christ</span>
          </h2>

          <div className="max-w-2xl border-l-2 border-brand-red pl-6">
            <p className="text-gray-400 leading-relaxed">
              Our vision is to reach and transform the current generation with
              the life-changing message of Jesus Christ, raising up disciples
              who will impact their communities and the nations. Every programme,
              every ministry, every gathering exists to serve this single
              overarching call.
            </p>
          </div>
        </div>
      </section>

      {/* ── MISSION — light, 2-col split + stacked pillar list ─────────── */}
      <section className="bg-white py-20 md:py-28 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">

          {/* Statement row */}
          <div className="grid md:grid-cols-5 gap-12 mb-16 md:mb-20 items-start">
            <div className="md:col-span-2">
              <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-6">
                Our Mission
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 leading-snug">
                Building Lives,<br />Impacting Nations,<br />
                <span className="text-primary-600">Establishing the Kingdom</span>{" "}
                with Excellence
              </h2>
            </div>
            <div className="md:col-span-3 md:pt-14">
              <p className="text-gray-500 leading-relaxed">
                We are committed to developing people spiritually, equipping them
                to influence their communities and nations, while advancing God's
                kingdom through a standard of excellence in all we do.
              </p>
            </div>
          </div>

          {/* Stacked pillar list */}
          <div className="border-t border-gray-100">
            {missionPillars.map((pillar) => (
              <div
                key={pillar.num}
                className="grid md:grid-cols-5 gap-6 md:gap-12 py-7 border-b border-gray-100 group"
              >
                {/* Number + title */}
                <div className="md:col-span-2 flex items-baseline gap-5">
                  <span className="text-xs font-semibold text-brand-red uppercase tracking-[0.2em] shrink-0 w-6">
                    {pillar.num}
                  </span>
                  <h3 className="text-base font-bold text-gray-900">
                    {pillar.title}
                  </h3>
                </div>
                {/* Description */}
                <p className="md:col-span-3 text-gray-500 text-sm leading-relaxed">
                  {pillar.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CORE VALUES — dark, stacked manifesto ───────────────────────── */}
      <section className="bg-vbc-section py-20 md:py-28 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-5 gap-12 mb-16 items-start">
            <div className="md:col-span-2">
              <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-6">
                Core Values
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-white leading-snug">
                What We Stand For
              </h2>
            </div>
            <div className="md:col-span-3 md:pt-14">
              <p className="text-gray-400 leading-relaxed">
                These values guide our decisions, shape our culture, and define
                who we are as a church — in the sanctuary and in the city.
              </p>
            </div>
          </div>

          {/* Stacked values */}
          <div className="border-t border-white/10">
            {coreValues.map((value) => (
              <div
                key={value.num}
                className="grid md:grid-cols-5 gap-6 md:gap-12 py-8 border-b border-white/10 group"
              >
                {/* Number + title */}
                <div className="md:col-span-2 flex items-baseline gap-5">
                  <span className="text-3xl md:text-4xl font-black text-brand-red leading-none shrink-0 w-12">
                    {value.num}
                  </span>
                  <h3 className="text-base font-bold text-white">
                    {value.title}
                  </h3>
                </div>
                {/* Description */}
                <p className="md:col-span-3 text-gray-400 text-sm leading-relaxed">
                  {value.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default VisionMission;
