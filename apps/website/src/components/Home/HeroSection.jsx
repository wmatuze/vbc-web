import { forwardRef, useLayoutEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import {
  ArrowRightIcon,
  CalendarDaysIcon,
  ClockIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import { useEventsQuery } from "../../hooks/useEventsQuery";

const parseEventDate = (event) => {
  const raw = event?.startDate || event?.date;
  const parsed = raw ? new Date(raw) : null;
  return parsed && !Number.isNaN(parsed.getTime()) ? parsed : null;
};

const formatEventDate = (date) =>
  date?.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  });

const HeroSection = forwardRef((props, forwardedRef) => {
  const sectionRef = useRef(null);
  const ringRef = useRef(null);
  const contentRef = useRef(null);
  const eventRef = useRef(null);
  const { data: events = [], isLoading } = useEventsQuery();

  const upcomingEvents = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return events
      .map((event) => ({ ...event, _date: parseEventDate(event) }))
      .filter((event) => event._date && event._date >= today)
      .sort((a, b) => a._date - b._date)
      .slice(0, 2);
  }, [events]);

  const featuredEvent = upcomingEvents[0];
  const secondaryEvent = upcomingEvents[1];

  const setSectionRef = (node) => {
    sectionRef.current = node;
    if (typeof forwardedRef === "function") forwardedRef(node);
    else if (forwardedRef) forwardedRef.current = node;
  };

  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    const context = gsap.context(() => {
      gsap.fromTo(
        contentRef.current?.children || [],
        { y: 34, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.85, stagger: 0.1, ease: "power3.out" },
      );
      gsap.fromTo(
        ringRef.current,
        { scale: 0.65, opacity: 0, rotate: -18 },
        { scale: 1, opacity: 1, rotate: 0, duration: 1.4, ease: "power3.out" },
      );
      gsap.fromTo(
        eventRef.current,
        { x: 40, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.9, delay: 0.45, ease: "power3.out" },
      );
    }, sectionRef);

    return () => context.revert();
  }, []);

  const eventId = featuredEvent?.id || featuredEvent?._id;
  const secondaryEventId = secondaryEvent?.id || secondaryEvent?._id;

  return (
    <section
      ref={setSectionRef}
      className="relative isolate min-h-[100svh] overflow-hidden bg-[#06080d] text-white"
    >
      <div
        className="absolute inset-0 bg-cover bg-[72%_center] lg:bg-center"
        style={{ backgroundImage: "url(/assets/hero-bg.jpg)" }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(4,6,10,.98)_0%,rgba(4,6,10,.88)_42%,rgba(4,6,10,.34)_72%,rgba(4,6,10,.7)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.22),rgba(0,0,0,.08)_60%,rgba(0,0,0,.82))]" />

      <div
        ref={ringRef}
        className="pointer-events-none absolute -right-[34vw] top-[12vh] h-[82vw] w-[82vw] rounded-full border border-brand-red/55 sm:-right-[26vw] lg:-right-[8vw] lg:top-[-18vh] lg:h-[70vw] lg:w-[70vw] xl:h-[58vw] xl:w-[58vw]"
        aria-hidden="true"
      >
        <div className="absolute inset-[12%] rounded-full border border-primary-500/20" />
      </div>

      <div className="relative z-10 mx-auto grid min-h-[100svh] max-w-screen-2xl grid-cols-1 items-end px-5 pb-10 pt-28 sm:px-8 sm:pb-14 lg:grid-cols-12 lg:items-center lg:px-14 lg:pb-20 lg:pt-32 2xl:px-20">
        <div ref={contentRef} className="lg:col-span-7 lg:max-w-3xl">
          <div className="mb-6 flex items-center gap-4 sm:mb-8">
            <span className="h-px w-10 bg-brand-red" />
          </div>

          <h1 className="max-w-[15ch] font-sans text-[clamp(2.65rem,6.2vw,6.8rem)] font-black leading-[0.94] tracking-[-0.055em]">
            <span className="block">Sinning when alone</span>
            <span className="block">is easy, but</span>
            <span className="block text-primary-400">worshipping</span>
            <span className="block">
              alone is <span className="text-primary-400">difficult.</span>
            </span>
          </h1>

          <p className="mt-6 max-w-md text-sm leading-7 text-white/60 sm:text-base">
            Faith grows stronger when we gather—through fellowship, worship,
            and service to others.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-5 sm:mt-10">
            <Link
              to="/membership"
              className="group inline-flex items-center gap-4 bg-brand-red px-7 py-4 text-[11px] font-bold uppercase tracking-[0.18em] text-white transition-colors hover:bg-red-700"
            >
              Get Connected
              <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/about"
              className="group inline-flex items-center gap-3 border-b border-white/30 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70 transition-colors hover:border-white hover:text-white"
            >
              Discover Victory
              <ArrowRightIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        <div ref={eventRef} className="mt-10 lg:col-span-4 lg:col-start-9 lg:mt-0 lg:self-end lg:pb-4">
          <div className="block border-l border-brand-red bg-black/55 px-6 py-6 backdrop-blur-md sm:max-w-md lg:ml-auto">
            <div className="mb-5 flex items-center justify-between gap-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-brand-red">
                Upcoming Events
              </p>
              <Link to="/events" className="group inline-flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.18em] text-white/45 hover:text-white">
                View all
                <ArrowRightIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            {isLoading ? (
              <div className="space-y-3 animate-pulse">
                <div className="h-5 w-2/3 bg-white/10" />
                <div className="h-12 w-1/2 bg-white/10" />
              </div>
            ) : featuredEvent ? (
              <div>
                <Link to={eventId ? `/events?event=${eventId}` : "/events"} className="group block">
                <p className="font-display text-2xl text-white sm:text-3xl">
                  {featuredEvent.title}
                </p>
                <p className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
                  {featuredEvent.time || formatEventDate(featuredEvent._date)}
                </p>
                <div className="mt-5 flex flex-wrap gap-4 border-t border-white/15 pt-4 text-xs text-white/55">
                  <span className="inline-flex items-center gap-2">
                    <ClockIcon className="h-4 w-4 text-brand-red" />
                    {formatEventDate(featuredEvent._date)}
                  </span>
                  {featuredEvent.location && (
                    <span className="inline-flex items-center gap-2">
                      <MapPinIcon className="h-4 w-4 text-brand-red" />
                      {featuredEvent.location}
                    </span>
                  )}
                </div>
                </Link>

                {secondaryEvent && (
                  <Link
                    to={secondaryEventId ? `/events?event=${secondaryEventId}` : "/events"}
                    className="group mt-5 grid grid-cols-[auto_1fr_auto] items-center gap-3 border-t border-white/15 pt-4"
                  >
                    <span className="font-display text-2xl text-white/80">
                      {secondaryEvent._date.getDate().toString().padStart(2, "0")}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold text-white/75 group-hover:text-white">
                        {secondaryEvent.title}
                      </span>
                      <span className="mt-0.5 block text-[10px] uppercase tracking-[0.14em] text-white/35">
                        {formatEventDate(secondaryEvent._date)}{secondaryEvent.time ? ` · ${secondaryEvent.time}` : ""}
                      </span>
                    </span>
                    <ArrowRightIcon className="h-3.5 w-3.5 text-white/30 transition-transform group-hover:translate-x-1 group-hover:text-white" />
                  </Link>
                )}
              </div>
            ) : (
              <div className="flex min-h-36 items-center gap-4 border-t border-white/10 py-5">
                <CalendarDaysIcon className="h-9 w-9 shrink-0 text-white/20" aria-hidden="true" />
                <div>
                  <p className="font-display text-2xl text-white">
                    No upcoming events scheduled.
                  </p>
                  <p className="mt-2 text-xs leading-5 text-white/40">
                    New events will appear here as soon as they are posted.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => document.getElementById("monthly-programs")?.scrollIntoView({ behavior: "smooth" })}
        className="absolute bottom-5 left-1/2 z-20 hidden -translate-x-1/2 flex-col items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.3em] text-white/35 lg:flex"
        aria-label="Scroll to service times"
      >
        Scroll
        <span className="h-8 w-px bg-gradient-to-b from-white/45 to-transparent" />
      </button>
    </section>
  );
});

HeroSection.displayName = "HeroSection";
export default HeroSection;
