import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRightIcon } from "@heroicons/react/24/outline";

const CallToAction = () => (
  <section className="relative overflow-hidden bg-[#06090f] text-white">
    <div className="mx-auto grid max-w-screen-2xl items-center gap-12 px-5 py-16 sm:px-10 sm:py-20 lg:min-h-[720px] lg:grid-cols-12 lg:px-14 lg:py-24 2xl:px-20">
      <motion.div
        initial={{ opacity: 0, x: -28 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 lg:col-span-5"
      >
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-red">Your next step</p>
        <h2 className="mt-6 max-w-xl font-display text-5xl leading-[0.98] tracking-tight sm:text-6xl lg:text-7xl">
          Worship was never meant to be done <span className="text-primary-400">alone.</span>
        </h2>
        <p className="mt-6 max-w-md text-sm leading-7 text-white/50 sm:text-base">
          Come as you are. Meet our family, experience a service, and discover where your story can grow.
        </p>

        <div className="mt-9 flex flex-wrap items-center gap-6">
          <Link
            to="/first-timers"
            className="group inline-flex items-center gap-5 border border-white/60 px-8 py-4 text-[11px] font-bold uppercase tracking-[0.2em] transition-colors hover:bg-white hover:text-black"
          >
            I'm New Here
            <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link to="/cell-groups" className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/45 hover:text-white">
            Find your community
          </Link>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.78 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative mx-auto aspect-square w-full max-w-[42rem] lg:col-span-7"
      >
        <div className="absolute -inset-[7%] rounded-full border border-brand-red/65" />
        <div className="absolute -inset-[15%] rounded-full border border-primary-500/15" />
        <div className="absolute inset-0 overflow-hidden rounded-full">
          <img
            src="/images/mission-church.jpg"
            alt="Victory Bible Church community gathering"
            className="h-full w-full object-cover transition-transform duration-1000 hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-black/55 via-transparent to-primary-900/20" />
        </div>
        <span className="absolute -bottom-4 left-1/2 h-20 w-px -translate-x-1/2 bg-gradient-to-b from-brand-red to-transparent" />
      </motion.div>
    </div>
  </section>
);

export default CallToAction;
