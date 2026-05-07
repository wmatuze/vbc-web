import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRightIcon } from "@heroicons/react/24/outline";

const ACTION_LINKS = [
  { label: "Plan Your Visit", path: "/first-timers" },
  { label: "Meet Our Pastors", path: "/about/leadership-team" },
  { label: "Join a Cell Group", path: "/cell-groups" },
];

const CallToAction = () => {
  return (
    <section className="relative overflow-hidden min-h-[600px] 3xl:min-h-[700px] flex items-center">
      {/* Background photo */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url(/assets/hero-bg.jpg)" }}
      />
      {/* Dark overlay — intentionally heavy, cinematic */}
      <div className="absolute inset-0 bg-black/82" />

      {/* Subtle animated glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{ opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(29,78,216,0.15) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 w-full max-w-4xl 2xl:max-w-5xl 3xl:max-w-7xl mx-auto px-5 sm:px-8 py-16 sm:py-24 3xl:py-32 text-center">
        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-brand-red text-xs font-semibold uppercase tracking-[0.25em] mb-6"
        >
          First Time Here?
        </motion.p>

        {/* Main headline */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl md:text-6xl 3xl:text-7xl font-bold text-white leading-tight mb-5 sm:mb-6"
        >
          New to <span className="text-primary-400">Victory</span> Bible Church?
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-gray-400 text-base sm:text-lg 3xl:text-xl leading-relaxed max-w-xl 3xl:max-w-2xl mx-auto mb-8 sm:mb-12"
        >
          We'd love to welcome you to our church family. Discover what to
          expect, meet our team, and find your place in our community.
        </motion.p>

        {/* Three text action links */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row items-center justify-center gap-0 mb-12"
        >
          {ACTION_LINKS.map((link, i) => (
            <div key={i} className="flex items-center">
              <Link
                to={link.path}
                className="group inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-white/50 hover:text-white transition-colors px-6 py-2"
              >
                {link.label}
                <ArrowRightIcon className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
              {i < ACTION_LINKS.length - 1 && (
                <span className="text-white/15 hidden sm:block">|</span>
              )}
            </div>
          ))}
        </motion.div>

        {/* Primary CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <Link
            to="/first-timers"
            className="inline-flex items-center gap-3 border-2 border-white text-white text-sm font-bold uppercase tracking-widest px-8 sm:px-12 py-4 sm:py-5 hover:bg-white hover:text-black transition-all duration-300 group"
          >
            I'm New Here
            <ArrowRightIcon className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default CallToAction;
