import React from "react";

/**
 * Shared banner for public inner pages.
 *
 * Keep this intentionally simple so every page gets the same compact hero
 * and page-specific content starts immediately below it.
 */
const HeroSection = ({
  title,
  backgroundImage = "/assets/hero-bg.jpg",
  className = "",
  titleClassName = "",
}) => (
  <section
    className={`relative h-[25rem] overflow-hidden bg-vbc-dark sm:h-[28rem] lg:h-screen ${className}`}
  >
    <div
      className="absolute inset-0 bg-cover bg-center"
      style={{ backgroundImage: `url('${backgroundImage}')` }}
      aria-hidden="true"
    />
    <div className="absolute inset-0 bg-black/65" aria-hidden="true" />
    <div
      className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/45"
      aria-hidden="true"
    />

    <div className="relative z-10 flex h-full items-center justify-center px-5 pt-16 sm:px-8 sm:pt-20">
      <div className="mx-auto max-w-4xl text-center">
        <span className="mx-auto mb-4 block h-px w-12 bg-white/60" aria-hidden="true" />

        <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-white sm:text-xs">
          Victory Bible Church
        </p>

        <h1
          className={`font-sans text-4xl font-semibold leading-tight tracking-tight text-white lg:text-5xl ${titleClassName}`}
        >
          {title}
        </h1>
      </div>
    </div>
  </section>
);

export default HeroSection;
