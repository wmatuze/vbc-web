import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRightIcon } from "@heroicons/react/24/outline";

// Each ministry has its own gradient overlay applied over the shared hero photo
const MINISTRIES = [
  {
    number: "01",
    label: "Youth Ministry",
    name: "Lit Nation",
    description: "Empowering the next generation to live boldly in faith.",
    path: "/ministries/youths",
    overlay: "from-blue-900/90 via-blue-800/70 to-transparent",
    accent: "text-blue-300",
  },
  {
    number: "02",
    label: "Men's Ministry",
    name: "Men of Valour",
    description: "Building men of integrity, purpose, and unshakeable faith.",
    path: "/ministries/mens",
    overlay: "from-slate-900/95 via-slate-800/75 to-transparent",
    accent: "text-gray-300",
  },
  {
    number: "03",
    label: "Women's Ministry",
    name: "Daughters of Zion",
    description: "Empowering women through fellowship, faith, and service.",
    path: "/ministries/womens",
    overlay: "from-rose-900/90 via-rose-800/70 to-transparent",
    accent: "text-rose-300",
  },
];

const PRAISE = {
  number: "04",
  label: "Praise & Worship",
  name: "Ministry",
  description: "Leading people into God's presence through worship.",
  path: "/ministries/praise",
  overlay: "from-purple-900/85 via-indigo-900/70 to-transparent",
  accent: "text-purple-300",
};

const MinistryCard = ({ ministry, className = "", textSize = "text-3xl" }) => (
  <Link
    to={ministry.path}
    className={`group relative overflow-hidden block ${className}`}
    style={{
      backgroundImage: "url(/assets/hero-bg.jpg)",
      backgroundSize: "cover",
      backgroundPosition: "center",
    }}
  >
    {/* Gradient overlay */}
    <div
      className={`absolute inset-0 bg-gradient-to-t ${ministry.overlay} group-hover:opacity-90 transition-opacity duration-500`}
    />

    {/* Bottom content */}
    <div className="absolute bottom-0 left-0 right-0 p-8">
      <p
        className={`${ministry.accent} text-xs font-semibold uppercase tracking-widest mb-1.5`}
      >
        {ministry.number} · {ministry.label}
      </p>
      <h3
        className={`${textSize} font-bold text-white leading-tight mb-3 group-hover:translate-x-1 transition-transform duration-300`}
      >
        {ministry.name}
      </h3>
      <p className="text-white/55 text-sm leading-relaxed mb-5 max-w-xs">
        {ministry.description}
      </p>
      <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-white/50 group-hover:text-white transition-colors duration-300">
        Explore
        <ArrowRightIcon className="h-3.5 w-3.5 group-hover:translate-x-1.5 transition-transform duration-300" />
      </span>
    </div>

    {/* Top number (decorative, fades on hover) */}
    <div className="absolute top-6 right-6 text-white/5 text-8xl font-black leading-none select-none group-hover:text-white/10 transition-colors duration-500">
      {ministry.number}
    </div>
  </Link>
);

const Ministries = () => {
  return (
    <section className="bg-[#0f172a]">
      {/* Section label */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="px-5 sm:px-10 pt-10 sm:pt-14 pb-6 sm:pb-8 flex items-end justify-between"
      >
        <div>
          <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-2">
            Serving Together
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Our <span className="text-primary-400">Ministries</span>
          </h2>
        </div>
        <Link
          to="/ministries"
          className="hidden md:inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-white/40 hover:text-white transition-colors group"
        >
          All Ministries
          <ArrowRightIcon className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </motion.div>

      {/* Main grid — large left + two stacked right */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="flex flex-col lg:flex-row"
      >
        {/* Large left card — Youth */}
        <MinistryCard
          ministry={MINISTRIES[0]}
          className="lg:w-3/5 min-h-[340px] sm:min-h-[420px] lg:min-h-[500px]"
          textSize="text-3xl sm:text-4xl"
        />

        {/* Right column — Men + Women stacked */}
        <div className="flex flex-col lg:w-2/5">
          <MinistryCard
            ministry={MINISTRIES[1]}
            className="flex-1 min-h-[200px] sm:min-h-[220px] lg:min-h-[250px] border-b border-white/5"
            textSize="text-2xl"
          />
          <MinistryCard
            ministry={MINISTRIES[2]}
            className="flex-1 min-h-[200px] sm:min-h-[220px] lg:min-h-[250px]"
            textSize="text-2xl"
          />
        </div>
      </motion.div>

      {/* Bottom banner — Praise & Worship */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="relative overflow-hidden border-t border-white/5"
        style={{
          backgroundImage: "url(/assets/hero-bg.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center 70%",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/90 via-indigo-950/85 to-purple-900/90" />
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 sm:gap-6 px-5 sm:px-10 py-8 sm:py-12 max-w-7xl mx-auto">
          <div>
            <p
              className={`${PRAISE.accent} text-xs font-semibold uppercase tracking-widest mb-1.5`}
            >
              {PRAISE.number} · {PRAISE.label}
            </p>
            <h3 className="text-3xl font-bold text-white">{PRAISE.name}</h3>
            <p className="text-white/50 text-sm mt-1">{PRAISE.description}</p>
          </div>
          <Link
            to={PRAISE.path}
            className="flex-shrink-0 inline-flex items-center gap-3 border border-white/25 text-white text-xs font-semibold uppercase tracking-widest px-8 py-4 hover:bg-white hover:text-black transition-all duration-300 group"
          >
            Explore Ministry
            <ArrowRightIcon className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </motion.div>

      {/* Mobile all-ministries link */}
      <div className="md:hidden px-10 py-6 text-center">
        <Link
          to="/ministries"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-white/40 hover:text-white transition-colors"
        >
          All Ministries <ArrowRightIcon className="h-3.5 w-3.5" />
        </Link>
      </div>
    </section>
  );
};

export default Ministries;
