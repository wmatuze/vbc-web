import { useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRightIcon } from "@heroicons/react/24/outline";

gsap.registerPlugin(ScrollTrigger);

const MINISTRIES = [
  {
    number: "01",
    label: "Youth Ministry",
    name: "Lit Nation",
    description: "A generation learning to live boldly in faith.",
    path: "/ministries/youths",
    image: "/images/youth-ministry.jpg",
    size: "max-w-[13rem] lg:h-[11rem] lg:w-[11rem] xl:h-[13rem] xl:w-[13rem] xl:max-w-none",
  },
  {
    number: "02",
    label: "Men's Ministry",
    name: "Men of Valour",
    description: "Men shaped by integrity, purpose, and service.",
    path: "/ministries/mens",
    image: "/images/mens-ministry.jpg",
    size: "max-w-[17rem] lg:h-[16rem] lg:w-[16rem] xl:h-[18rem] xl:w-[18rem] xl:max-w-none",
  },
  {
    number: "03",
    label: "Women's Ministry",
    name: "Daughters of Zion",
    description: "Women growing together through faith and fellowship.",
    path: "/ministries/womens",
    image: "/images/andressa-voltolini-H7WdV-dNRZE-unsplash.jpg",
    size: "max-w-[21rem] lg:h-[21rem] lg:w-[21rem] xl:h-[24rem] xl:w-[24rem] xl:max-w-none",
  },
  {
    number: "04",
    label: "Praise & Worship",
    name: "Praise Ministry",
    description: "Leading people into God's presence through worship.",
    path: "/ministries/praise",
    image: "/images/praise-ministry.jpg",
    size: "max-w-[25rem] lg:h-[27rem] lg:w-[27rem] xl:h-[30rem] xl:w-[30rem] xl:max-w-none",
  },
];

const Ministries = () => {
  const sectionRef = useRef(null);
  const stickyRef = useRef(null);
  const circlesRef = useRef([]);
  const lineRef = useRef(null);

  useLayoutEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return undefined;

    const context = gsap.context(() => {
      const media = gsap.matchMedia();

      media.add("(min-width: 1024px)", () => {
        gsap.fromTo(
          circlesRef.current,
          { scale: 0.45, opacity: 0.16, y: 100 },
          {
            scale: 1,
            opacity: 1,
            y: 0,
            stagger: 0.22,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top top",
              end: "bottom bottom",
              scrub: 1,
            },
          },
        );
        gsap.fromTo(
          lineRef.current,
          { scaleY: 0, transformOrigin: "top" },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 70%",
              end: "bottom 45%",
              scrub: 1,
            },
          },
        );
      });

      media.add("(max-width: 1023px)", () => {
        gsap.fromTo(
          circlesRef.current,
          { scale: 0.82, opacity: 0, y: 45 },
          {
            scale: 1,
            opacity: 1,
            y: 0,
            duration: 0.65,
            stagger: 0.12,
            ease: "power2.out",
            scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
          },
        );
      });

      return () => media.revert();
    }, sectionRef);

    return () => context.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative min-h-[140vh] bg-[#07101f] text-white lg:min-h-[190vh]">
      <div ref={stickyRef} className="relative overflow-hidden px-5 py-16 sm:px-10 lg:sticky lg:top-0 lg:flex lg:h-screen lg:items-center lg:px-12 lg:py-20 2xl:px-20">
        <div className="pointer-events-none absolute -right-[18vw] top-[-25vw] h-[55vw] w-[55vw] rounded-full border border-primary-500/10" />
        <div ref={lineRef} className="pointer-events-none absolute left-7 top-0 hidden h-full w-px bg-gradient-to-b from-brand-red via-brand-red/80 to-transparent lg:block" />

        <div className="relative z-10 mx-auto grid w-full max-w-screen-2xl gap-14 lg:grid-cols-[0.7fr_2.3fr] lg:items-center lg:gap-8">
          <div className="lg:self-start lg:pt-8">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-red">Our ministries</p>
            <h2 className="mt-5 max-w-sm font-display text-5xl leading-[0.96] sm:text-6xl lg:max-w-[15rem] lg:text-6xl xl:text-7xl">
              There is a place for you here.
            </h2>
            <p className="mt-6 max-w-xs text-sm leading-7 text-white/45 lg:max-w-[13rem]">
              One church. Different generations, gifts, and callings—growing outward from the same centre.
            </p>

            <div className="mt-10 hidden items-center gap-4 lg:flex">
              <span className="h-2.5 w-2.5 rounded-full bg-brand-red" />
              <span className="h-px w-16 bg-white/25" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/45">Featured ministries</span>
            </div>

            <Link
              to="/ministries/youths"
              className="group mt-10 inline-flex items-center gap-3 border-b border-white/20 pb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/60 hover:border-white hover:text-white"
            >
              Begin exploring
              <ArrowUpRightIcon className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="flex flex-col items-center gap-8 lg:flex-row lg:items-end lg:justify-end lg:gap-0">
            {MINISTRIES.map((ministry, index) => (
              <Link
                key={ministry.number}
                ref={(node) => { circlesRef.current[index] = node; }}
                to={ministry.path}
                className={`group relative aspect-square w-full flex-none overflow-hidden rounded-full border ${
                  index === MINISTRIES.length - 1 ? "border-brand-red/70" : "border-primary-400/55"
                } ${ministry.size} lg:-ml-24 xl:-ml-28`}
                style={{ zIndex: MINISTRIES.length - index }}
                aria-label={`Explore ${ministry.name}`}
              >
                <img
                  src={ministry.image}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover grayscale-[20%] transition duration-700 group-hover:scale-105 group-hover:grayscale-0"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050b16] via-[#07101f]/30 to-transparent" />
                <div className="absolute inset-[7%] rounded-full border border-white/10 transition-transform duration-700 group-hover:scale-95" />

                <div className="absolute inset-x-0 bottom-0 p-[12%]">
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-primary-300">
                    {ministry.number} · {ministry.label}
                  </p>
                  <h3 className="mt-2 max-w-[12ch] text-xl font-semibold leading-tight sm:text-2xl">
                    {ministry.name}
                  </h3>
                  {index >= 2 && (
                    <p className="mt-2 hidden max-w-[24ch] text-xs leading-5 text-white/55 xl:block">
                      {ministry.description}
                    </p>
                  )}
                </div>

                <ArrowUpRightIcon className="absolute right-[12%] top-[12%] h-5 w-5 text-white/45 transition-all group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-white" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Ministries;
