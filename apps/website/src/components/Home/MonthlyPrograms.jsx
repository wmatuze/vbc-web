import { useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useRecurringEventsQuery } from "../../hooks/useRecurringEventsQuery";
import { ArrowRightIcon, MapPinIcon } from "@heroicons/react/24/outline";

const getScheduleText = (event) => {
  if (event.recurrenceType === "monthly") {
    if (event.weekOfMonth)
      return `${event.weekOfMonth.charAt(0).toUpperCase() + event.weekOfMonth.slice(1)} Sunday`;
    if (event.dayOfMonth) {
      const s =
        event.dayOfMonth > 3 && event.dayOfMonth < 21
          ? "th"
          : ["st", "nd", "rd"][(event.dayOfMonth % 10) - 1] || "th";
      return `${event.dayOfMonth}${s} of each month`;
    }
  } else if (event.recurrenceType === "weekly") {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return `Every ${days[event.dayOfWeek]}`;
  } else if (event.recurrenceType === "yearly") {
    const months = [
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
    return `Annually · ${months[event.month]}`;
  }
  return "Recurring";
};

// Static service times always shown on the left panel
const SERVICE_TIMES = [
  { label: "Sunday Service", time: "9:30 AM" },
  { label: "Wednesday Service", time: "6:00 PM" },
];

const MonthlyPrograms = () => {
  const {
    data: recurringEvents = [],
    isLoading,
    refetch,
  } = useRecurringEventsQuery();

  const programs = useMemo(() => {
    if (!recurringEvents.length) return [];
    return recurringEvents
      .filter((e) => e.featured && e.active)
      .map((e) => ({
        id: e.id || e._id,
        title: e.title,
        schedule: getScheduleText(e),
        time: e.time,
      }));
  }, [recurringEvents]);

  return (
    <section
      id="monthly-programs"
      className="flex flex-col lg:flex-row min-h-[640px]"
    >
      {/* ── Left panel — photo + service times ──────────────────────────── */}
      <div className="relative lg:w-5/12 min-h-[320px] sm:min-h-[380px] lg:min-h-0 overflow-hidden">
        {/* Background photo */}
        <div
          className="absolute inset-0 bg-cover bg-center scale-105"
          style={{ backgroundImage: "url(/assets/hero-bg.jpg)" }}
        />
        {/* Deep navy overlay */}
        <div className="absolute inset-0 bg-blue-950/88" />

        {/* Thin left red line accent */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-red" />

        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="relative z-10 h-full flex flex-col justify-center px-6 sm:px-12 3xl:px-20 py-10 sm:py-14 3xl:max-w-xl 3xl:mx-auto 3xl:w-full"
        >
          <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-8">
            Service Times
          </p>

          {/* Service times */}
          <div className="space-y-8 mb-10">
            {SERVICE_TIMES.map((s, i) => (
              <div key={i}>
                <p className="text-white text-4xl sm:text-5xl 3xl:text-6xl font-bold leading-none">
                  {s.time}
                </p>
                <p className="text-white/50 text-xs uppercase tracking-widest mt-2">
                  {s.label}
                </p>
                {i < SERVICE_TIMES.length - 1 && (
                  <div className="h-px bg-white/10 mt-8" />
                )}
              </div>
            ))}
          </div>

          {/* Location */}
          <div className="mt-auto pt-8 border-t border-white/10">
            <div className="flex items-start gap-2 mb-3">
              <MapPinIcon className="h-4 w-4 text-brand-red mt-0.5 flex-shrink-0" />
              <p className="text-white/60 text-sm leading-relaxed">
                Victory Bible Church – Kitwe
                <br />
                Off Chiwala Road, CBU East Gate
              </p>
            </div>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-white/40 hover:text-white transition-colors group"
            >
              Get Directions
              <ArrowRightIcon className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>
      </div>

      {/* ── Right panel — white + programs list ─────────────────────────── */}
      <div className="lg:w-7/12 bg-white flex flex-col justify-center px-6 sm:px-10 lg:px-16 py-10 sm:py-14">
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="w-full 3xl:max-w-2xl 3xl:mx-auto"
        >
          <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-3">
            Regular Services
          </p>
          <h2 className="text-3xl md:text-4xl 3xl:text-5xl font-bold text-gray-900 mb-10">
            Monthly <span className="text-primary-600">Programs</span>
          </h2>

          {/* Programs list */}
          {isLoading ? (
            <div className="divide-y divide-gray-100">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="py-5 flex justify-between animate-pulse"
                >
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-100 rounded w-40" />
                    <div className="h-3 bg-gray-100 rounded w-24" />
                  </div>
                  <div className="h-4 bg-gray-100 rounded w-16" />
                </div>
              ))}
            </div>
          ) : programs.length === 0 ? (
            /* Fallback static programs if none from API */
            <div className="divide-y divide-gray-100">
              {[
                {
                  title: "Anointing Service",
                  schedule: "First Sunday",
                  time: "9:30 AM",
                },
                {
                  title: "Holy Communion",
                  schedule: "Third Sunday",
                  time: "9:30 AM",
                },
                {
                  title: "Prayer & Fasting",
                  schedule: "Last Week",
                  time: "Various",
                },
              ].map((p, i) => (
                <div
                  key={i}
                  className="py-5 flex items-center justify-between gap-4"
                >
                  <div>
                    <p className="font-bold text-gray-900 text-lg leading-tight">
                      {p.title}
                    </p>
                    <p className="text-gray-400 text-sm mt-0.5">{p.schedule}</p>
                  </div>
                  <p className="text-primary-600 font-semibold text-sm flex-shrink-0">
                    {p.time}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {programs.map((p) => (
                <div
                  key={p.id}
                  className="py-5 flex items-center justify-between gap-4"
                >
                  <div>
                    <p className="font-bold text-gray-900 text-lg leading-tight">
                      {p.title}
                    </p>
                    <p className="text-gray-400 text-sm mt-0.5">{p.schedule}</p>
                  </div>
                  <p className="text-primary-600 font-semibold text-sm flex-shrink-0">
                    {p.time}
                  </p>
                </div>
              ))}
            </div>
          )}

          <Link
            to="/events"
            className="inline-flex items-center gap-3 mt-10 border border-gray-900 text-gray-900 text-xs font-semibold uppercase tracking-widest px-8 py-4 hover:bg-gray-900 hover:text-white transition-all duration-300 group"
          >
            View Full Calendar
            <ArrowRightIcon className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default MonthlyPrograms;
