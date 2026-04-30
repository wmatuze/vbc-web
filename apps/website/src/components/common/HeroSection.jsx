import React from "react";

const HeroSection = ({
  title,
  subtitle,
  description,
  backgroundImage = "/assets/hero-bg.jpg",
  primaryAccentText,
  scrollText = "SCROLL DOWN",
  className = "",
  titleClassName = "",
  showScrollIndicator = true,
  showGoldenRibbon = false,
  breadcrumbs = [],
}) => {
  const handleScrollDown = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth",
    });
  };

  return (
    <section className={`relative min-h-screen overflow-hidden ${className}`}>
      {/* Breadcrumb */}
      {breadcrumbs.length > 0 && (
        <nav aria-label="Breadcrumb" className="absolute top-20 left-0 right-0 z-20 px-4 sm:px-6 lg:px-8">
          <ol className="flex items-center gap-1.5 text-sm text-white/50">
            {breadcrumbs.map((crumb, i) => (
              <li key={i} className="flex items-center gap-1.5">
                {i > 0 && <span aria-hidden="true">›</span>}
                {crumb.path ? (
                  <a href={crumb.path} className="hover:text-white transition-colors">
                    {crumb.label}
                  </a>
                ) : (
                  <span className="text-white/90" aria-current="page">{crumb.label}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      )}

      {/* Background with dark gradient overlay */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center transform scale-105"
          style={{ backgroundImage: `url('${backgroundImage}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/85 via-black/70 to-black/85" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl xl:max-w-5xl 2xl:max-w-6xl 3xl:max-w-7xl mx-auto text-center">
          
          {/* Eyebrow label */}
          {subtitle && (
            <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-6 md:mb-8">
              {subtitle}
            </p>
          )}

          {/* Main Title */}
          <h1 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl 3xl:text-9xl font-bold text-white mb-6 md:mb-8 leading-tight ${titleClassName}`}>
            {primaryAccentText ? (
              <>
                {title.split(primaryAccentText)[0]}
                <span className="text-primary-400">{primaryAccentText}</span>
                {title.split(primaryAccentText)[1]}
              </>
            ) : (
              title
            )}
          </h1>

          {/* Description */}
          {description && (
            <p className="text-lg sm:text-xl md:text-2xl xl:text-3xl 2xl:text-4xl text-gray-300 mb-8 md:mb-12 leading-relaxed max-w-2xl md:max-w-3xl xl:max-w-4xl 2xl:max-w-5xl mx-auto">
              {description}
            </p>
          )}

          {/* Golden Ribbon - decorative element */}
          {showGoldenRibbon && (
            <div className="flex items-center justify-center space-x-3 md:space-x-4 mb-8 md:mb-12">
              <div className="h-px w-12 md:w-16 xl:w-20 bg-yellow-400" />
              <div className="w-2 h-2 xl:w-3 xl:h-3 bg-yellow-400 rounded-full" />
              <div className="h-px w-12 md:w-16 xl:w-20 bg-yellow-400" />
            </div>
          )}

          {/* Scroll indicator */}
          {showScrollIndicator && (
            <div 
              className="flex flex-col items-center animate-bounce cursor-pointer hover:scale-110 transition-transform duration-300 mt-6 md:mt-8"
              onClick={handleScrollDown}
            >
              <div className="flex flex-col items-center group">
                <span className="text-white/60 text-xs sm:text-sm xl:text-base font-light tracking-wider mb-2 group-hover:text-white/80 transition-colors">
                  {scrollText}
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 md:h-6 md:w-6 xl:h-7 xl:w-7 text-white/60 group-hover:text-white/80 transition-colors"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
              </div>
            </div>
          )}

        </div>
      </div>
    </section>
  );
};

export default HeroSection;

