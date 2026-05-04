import { Link } from "react-router-dom";
import { forwardRef, useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useEventsQuery } from "../../hooks/useEventsQuery";
import {
  ArrowRightIcon,
  CalendarDaysIcon,
  MapPinIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

// ── Date helpers ──────────────────────────────────────────────────────────────
const parseEventDate = (event) => {
  try {
    const raw = event?.startDate || event?.date;
    if (!raw) return new Date();
    if (raw instanceof Date) return raw;
    const d = new Date(raw);
    return isNaN(d.getTime()) ? new Date() : d;
  } catch {
    return new Date();
  }
};

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const MONTH_FULL = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// ── Compact event row (secondary events) ──────────────────────────────────────
const EventRow = ({ event }) => {
  const date = parseEventDate(event);
  return (
    <div className="flex items-center gap-4 py-4 border-b border-white/10 group">
      {/* Red date badge */}
      <div className="flex-shrink-0 w-10 text-center">
        <p className="text-brand-red text-xs font-bold uppercase">
          {MONTH_NAMES[date.getMonth()]}
        </p>
        <p className="text-white text-xl font-black leading-none">
          {date.getDate()}
        </p>
      </div>
      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-white text-sm font-semibold leading-snug truncate group-hover:text-primary-300 transition-colors">
          {event.title}
        </p>
        {event.time && (
          <p className="text-white/40 text-xs mt-0.5">{event.time}</p>
        )}
      </div>
      <ArrowRightIcon className="h-3.5 w-3.5 text-white/20 group-hover:text-white/60 flex-shrink-0 transition-colors group-hover:translate-x-0.5 transition-transform" />
    </div>
  );
};

// ── Main HeroSection ──────────────────────────────────────────────────────────
const HeroSection = forwardRef((props, ref) => {
  const { data: events = [], isLoading, refetch } = useEventsQuery();

  const upcomingEvents = useMemo(() => {
    if (isLoading || !events?.length) return [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return events
      .map((e) => ({ ...e, _parsed: parseEventDate(e) }))
      .filter((e) => e._parsed >= today)
      .sort((a, b) => a._parsed - b._parsed)
      .slice(0, 4);
  }, [events, isLoading]);

  const featured = upcomingEvents[0] || null;
  const secondary = upcomingEvents.slice(1, 4);

  return (
    <section ref={ref} className="relative min-h-screen overflow-hidden">
      {/* ── Background ── */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url(/assets/hero-bg.jpg)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/85 via-black/70 to-black/85" />
      </div>

      {/* ── Content grid ── */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 min-h-screen max-w-screen-2xl 3xl:max-w-[1800px] 4xl:max-w-[2400px] mx-auto">
        {/* ════════════════════════════════════════════════════════════
            LEFT COLUMN — welcome + headline + CTAs
        ═══════════════════════════════════════════════════════════════ */}
        <div className="lg:col-span-7 flex flex-col justify-start px-5 sm:px-8 lg:px-16 3xl:px-24 pt-24 sm:pt-28 lg:pt-36 3xl:pt-48 pb-10 sm:pb-16 lg:pb-24 3xl:pb-36">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="flex items-center gap-4 mb-8"
          >
            <div className="h-px w-10 bg-brand-red" />
            <p className="text-white/70 text-xs font-semibold uppercase tracking-[0.2em]">
              Welcome to Victory Bible Church
            </p>
          </motion.div>

          {/* Headline */}
          <div className="mb-6 sm:mb-8 space-y-0.5 sm:space-y-1 overflow-hidden">
            {[
              { text: "Sinning when alone", delay: 0.2 },
              { text: "is easy, but", delay: 0.35, accent: false },
              { text: "worshipping", delay: 0.5, accent: true },
              { text: "alone is", delay: 0.65 },
              { text: "difficult.", delay: 0.8, accent: true },
            ].map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: line.delay,
                  ease: "easeOut",
                }}
              >
                <span
                  className={`block text-3xl sm:text-4xl lg:text-6xl 2xl:text-7xl 3xl:text-8xl font-black leading-tight tracking-tight ${
                    line.accent ? "text-primary-400" : "text-white"
                  }`}
                >
                  {line.text}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="text-white/60 text-base sm:text-lg 3xl:text-xl leading-relaxed max-w-md 3xl:max-w-xl mb-8 sm:mb-12"
          >
            Join our vibrant community where faith grows stronger through
            fellowship, worship, and service to others.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="flex flex-wrap items-center gap-5"
          >
            <Link
              to="/membership"
              className="inline-flex items-center gap-3 border-2 border-white text-white text-xs font-bold uppercase tracking-widest px-8 py-4 hover:bg-white hover:text-black transition-all duration-300 group"
            >
              Get Connected
              <ArrowRightIcon className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/about"
              className="inline-flex items-center gap-2 text-white/60 text-xs font-semibold uppercase tracking-widest hover:text-white transition-colors group"
            >
              Learn More
              <ArrowRightIcon className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>

        {/* ════════════════════════════════════════════════════════════
            RIGHT COLUMN — events spotlight
        ═══════════════════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="lg:col-span-5 relative flex flex-col justify-start px-5 sm:px-8 lg:px-10 pt-6 sm:pt-8 pb-10 sm:pb-14 lg:pt-36 lg:pb-24"
        >
          {/* Dark panel background */}
          <div className="absolute inset-0 bg-black/50 lg:bg-black/60 backdrop-blur-sm" />
          {/* Red top accent line */}
          <div className="absolute top-0 left-0 right-0 h-px bg-brand-red/60" />

          <div className="relative z-10">
            {/* Section header — mirrors the left eyebrow */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="h-px w-10 bg-brand-red" />
                <p className="text-white/70 text-xs font-semibold uppercase tracking-[0.2em]">
                  Upcoming Events
                </p>
              </div>
              <Link
                to="/events"
                className="inline-flex items-center gap-1.5 text-white/40 hover:text-white text-xs font-semibold uppercase tracking-widest transition-colors group"
              >
                View All
                <ArrowRightIcon className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            {/* Loading state */}
            {isLoading && (
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-32 bg-white/5 mb-3" />
                    <div className="h-3 bg-white/5 rounded w-3/4 mb-2" />
                    <div className="h-3 bg-white/5 rounded w-1/2" />
                  </div>
                ))}
              </div>
            )}

            {/* No events state */}
            {!isLoading && !featured && (
              <div className="text-center py-12">
                <CalendarDaysIcon className="h-10 w-10 text-white/15 mx-auto mb-4" />
                <p className="text-white/30 text-sm">
                  No upcoming events scheduled.
                </p>
                <p className="text-white/20 text-xs mt-1">Check back soon!</p>
              </div>
            )}

            {/* Featured event — spotlight */}
            {featured &&
              (() => {
                const date = featured._parsed;
                return (
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.9 }}
                    className="mb-8"
                  >
                    {/* Date block */}
                    <div className="flex items-end gap-4 mb-5">
                      <div>
                        <p className="text-white text-6xl sm:text-8xl 3xl:text-9xl font-black leading-none tracking-tighter">
                          {date.getDate()}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-brand-red text-xs font-bold uppercase tracking-widest">
                            {MONTH_FULL[date.getMonth()]}
                          </p>
                          <span className="text-white/20 text-xs">·</span>
                          <p className="text-white/40 text-xs uppercase tracking-wider">
                            {DAY_NAMES[date.getDay()]}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Event title */}
                    <h3 className="text-2xl font-bold text-white leading-snug mb-3">
                      {featured.title}
                    </h3>

                    {/* Meta */}
                    <div className="flex flex-wrap gap-4 mb-5">
                      {featured.time && (
                        <div className="flex items-center gap-1.5 text-white/50 text-xs">
                          <ClockIcon className="h-3.5 w-3.5" />
                          {featured.time}
                        </div>
                      )}
                      {featured.location && (
                        <div className="flex items-center gap-1.5 text-white/50 text-xs">
                          <MapPinIcon className="h-3.5 w-3.5" />
                          {featured.location}
                        </div>
                      )}
                    </div>

                    <Link
                      to="/events"
                      className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary-400 hover:text-primary-300 transition-colors group"
                    >
                      Learn More
                      <ArrowRightIcon className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                    </Link>

                    {/* Divider */}
                    {secondary.length > 0 && (
                      <div className="h-px bg-white/10 mt-8" />
                    )}
                  </motion.div>
                );
              })()}

            {/* Secondary events — compact list */}
            {secondary.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 1.1 }}
              >
                {secondary.map((event) => (
                  <EventRow key={event.id || event._id} event={event} />
                ))}
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>

      {/* ── Scroll indicator ── */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 hidden lg:flex flex-col items-center cursor-pointer"
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        onClick={() =>
          window.scrollTo({ top: window.innerHeight, behavior: "smooth" })
        }
      >
        <span className="text-white/30 text-xs font-medium uppercase tracking-widest mb-2">
          Scroll
        </span>
        <div className="w-px h-8 bg-gradient-to-b from-white/30 to-transparent" />
      </motion.div>
    </section>
  );
});

HeroSection.displayName = "HeroSection";
export default HeroSection;
