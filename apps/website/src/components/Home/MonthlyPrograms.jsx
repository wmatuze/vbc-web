import { useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRightIcon, MapPinIcon } from "@heroicons/react/24/outline";
import { useRecurringEventsQuery } from "../../hooks/useRecurringEventsQuery";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const getScheduleText = (event) => {
  if (event.recurrenceType === "monthly") {
    if (event.weekOfMonth) {
      return `${event.weekOfMonth.charAt(0).toUpperCase()}${event.weekOfMonth.slice(1)} Sunday`;
    }
    if (event.dayOfMonth) return `${event.dayOfMonth} of each month`;
  }
  if (event.recurrenceType === "weekly") {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return `Every ${days[event.dayOfWeek]}`;
  }
  if (event.recurrenceType === "yearly") return `Annually · ${MONTHS[event.month]}`;
  return "Recurring";
};

const FALLBACK_PROGRAMS = [
  { title: "Prayer & Fasting Week", schedule: "Last week", time: "Various times" },
  { title: "Holy Communion Service", schedule: "Third Sunday", time: "9:30 AM" },
  { title: "Anointing Service", schedule: "First Sunday", time: "9:30 AM" },
];

const MonthlyPrograms = () => {
  const { data: recurringEvents = [], isLoading } = useRecurringEventsQuery();

  const programs = useMemo(() => {
    const featured = recurringEvents
      .filter((event) => event.featured && event.active)
      .slice(0, 4)
      .map((event) => ({
        id: event.id || event._id,
        title: event.title,
        schedule: getScheduleText(event),
        time: event.time,
      }));
    return featured.length ? featured : FALLBACK_PROGRAMS;
  }, [recurringEvents]);

  return (
    <section id="monthly-programs" className="relative overflow-hidden bg-[#f3f0e8] text-[#10131a]">
      <div className="pointer-events-none absolute left-[43%] top-0 hidden h-24 w-px bg-brand-red lg:block" />

      <div className="mx-auto grid max-w-screen-2xl lg:min-h-[720px] lg:grid-cols-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.75 }}
          className="flex flex-col justify-between px-5 py-16 sm:px-10 lg:col-span-5 lg:px-14 lg:py-24 2xl:px-20"
        >
          <div>
            <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.3em] text-brand-red">We gather</p>
            <h2 className="max-w-md font-display text-5xl leading-[0.98] tracking-tight sm:text-6xl lg:text-7xl">
              We gather.<br />We grow.
            </h2>
          </div>

          <div className="mt-14 grid grid-cols-2 gap-8 lg:mt-20">
            <div className="border-r border-black/15 pr-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-black/45">Sunday</p>
              <p className="mt-2 font-display text-5xl tracking-tight sm:text-6xl">09:30</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-black/45">Wednesday</p>
              <p className="mt-2 font-display text-5xl tracking-tight sm:text-6xl">18:00</p>
            </div>
          </div>

          <div className="mt-14 border-t border-black/15 pt-5 text-sm text-black/55">
            <p className="flex items-start gap-3">
              <MapPinIcon className="mt-0.5 h-4 w-4 flex-none text-brand-red" />
              <span>Victory Bible Church · Off Chiwala Road, CBU East Gate, Kitwe</span>
            </p>
            <Link to="/contact" className="group mt-4 inline-flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-black/60 hover:text-black">
              Get directions
              <ArrowRightIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </motion.div>

        <div className="relative min-h-[360px] overflow-hidden sm:min-h-[460px] lg:col-span-7 lg:min-h-0">
          <div
            className="absolute inset-x-0 top-0 h-[58%] bg-cover bg-center"
            style={{ backgroundImage: "url(/images/pro-church-media-p2OQW69vXP4-unsplash.jpg)" }}
          />
          <div className="absolute inset-x-0 top-0 h-[58%] bg-gradient-to-t from-[#f3f0e8] via-transparent to-black/10" />

          <motion.div
            initial={{ opacity: 0, x: 36 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8 }}
            className="relative z-10 ml-auto flex min-h-full w-full flex-col justify-end px-5 py-14 sm:px-10 lg:px-14 lg:py-20 2xl:px-20"
          >
            <div className="bg-[#f3f0e8]/95 pt-8 backdrop-blur-sm lg:ml-12 lg:px-8 lg:pb-8">
              <div className="mb-5 flex items-end justify-between gap-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-brand-red">Monthly rhythm</p>
                  <h3 className="mt-2 font-display text-3xl sm:text-4xl">Regular Programs</h3>
                </div>
                <span className="hidden text-[10px] uppercase tracking-[0.2em] text-black/35 sm:block">Updated live</span>
              </div>

              <div className="border-t border-black/20">
                {isLoading && !recurringEvents.length
                  ? [1, 2, 3].map((item) => <div key={item} className="h-20 animate-pulse border-b border-black/10 bg-black/[0.025]" />)
                  : programs.map((program, index) => (
                      <div key={program.id || program.title} className="grid grid-cols-[2rem_1fr_auto] items-center gap-3 border-b border-black/15 py-5">
                        <span className="text-[10px] font-semibold text-brand-red">0{index + 1}</span>
                        <div>
                          <p className="font-semibold">{program.title}</p>
                          <p className="mt-1 text-xs text-black/45">{program.schedule}</p>
                        </div>
                        <p className="text-right text-xs font-semibold text-primary-600">{program.time}</p>
                      </div>
                    ))}
              </div>

              <Link to="/events" className="group mt-7 inline-flex items-center gap-4 border-b border-black/30 pb-2 text-[10px] font-bold uppercase tracking-[0.2em] hover:border-black">
                View full calendar
                <ArrowRightIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default MonthlyPrograms;
