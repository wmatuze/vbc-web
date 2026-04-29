import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { EnvelopeIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { Helmet } from "react-helmet-async";
import { useLeadershipQuery } from "../hooks/useLeadershipQuery";
import config from "../config";

const fallbackImages = {
  default: "/assets/placeholder.jpg",
};

const Leadership = () => {
  const [selectedLeader, setSelectedLeader] = useState(null);
  const { data: leaders = [], isLoading, error } = useLeadershipQuery();
  const modalRef = useRef(null);

  const getImageUrl = (leader) => {
    if (leader.image?.path) {
      return leader.image.path.startsWith("http")
        ? leader.image.path
        : `${config.API_URL}${leader.image.path}`;
    }
    if (leader.imageUrl) {
      return leader.imageUrl.startsWith("http")
        ? leader.imageUrl
        : `${config.API_URL}${leader.imageUrl}`;
    }
    return fallbackImages.default;
  };

  useEffect(() => {
    if (!selectedLeader) return;
    const focusableElements = modalRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    if (!focusableElements?.length) return;
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e) => {
      if (e.key === "Escape") { closeModal(); return; }
      if (e.key !== "Tab") return;
      if (e.shiftKey) {
        if (document.activeElement === firstElement) { lastElement.focus(); e.preventDefault(); }
      } else {
        if (document.activeElement === lastElement) { firstElement.focus(); e.preventDefault(); }
      }
    };

    document.addEventListener("keydown", handleTabKey);
    firstElement.focus();
    return () => document.removeEventListener("keydown", handleTabKey);
  }, [selectedLeader]);

  const closeModal = () => setSelectedLeader(null);
  const handleLeaderSelect = (leader) => setSelectedLeader(leader);

  const categorizeLeaders = (leadersList) => {
    const tier1 = [], tier2 = [], tier3 = [];
    leadersList.forEach((leader) => {
      const title = leader.title?.toLowerCase() || "";
      if (
        title.includes("senior pastor") ||
        title.includes("bishop") ||
        title.includes("assistant pastor") ||
        title === "lead pastor"
      ) {
        tier1.push(leader);
      } else if (
        title.includes("pastor") ||
        title.includes("apostle") ||
        title.includes("evangelist") ||
        title.includes("prophet") ||
        title.includes("teacher") ||
        title.includes("director")
      ) {
        tier2.push(leader);
      } else {
        tier3.push(leader);
      }
    });
    return { tier1, tier2, tier3 };
  };

  const { tier1: categorizedTier1, tier2: categorizedTier2, tier3: categorizedTier3 } =
    categorizeLeaders(leaders);

  const LeaderCard = ({ leader, index }) => (
    <article
      key={leader.id || index}
      className="border border-gray-200 overflow-hidden flex flex-col h-full group cursor-pointer bg-white"
      onClick={() => handleLeaderSelect(leader)}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
        <LazyLoadImage
          src={getImageUrl(leader)}
          alt={`Portrait of ${leader.name}`}
          effect="blur"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          wrapperClassName="w-full h-full"
          onError={(e) => { e.target.src = fallbackImages.default; }}
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4">
          <h3 className="text-xl font-bold text-white">{leader.name}</h3>
          <p className="text-sm text-white/70 tracking-wide">{leader.title}</p>
        </div>
      </div>
      <div className="p-5 flex-grow flex flex-col">
        {leader.bio && (
          <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 flex-grow mb-4">
            {leader.bio}
          </p>
        )}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          {leader.email ? (
            <a
              href={`mailto:${leader.email}`}
              className="flex items-center gap-1.5 text-gray-400 hover:text-gray-700 transition-colors text-xs"
              onClick={(e) => e.stopPropagation()}
              aria-label={`Email ${leader.name}`}
            >
              <EnvelopeIcon className="h-3.5 w-3.5" />
              Contact
            </a>
          ) : (
            <span />
          )}
          <button
            onClick={(e) => { e.stopPropagation(); handleLeaderSelect(leader); }}
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors group/btn"
            aria-label={`View profile for ${leader.name}`}
          >
            Profile <ArrowRightIcon className="h-3 w-3 group-hover/btn:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </article>
  );

  const TierSection = ({ eyebrow, title, leaders: tierLeaders, maxCols = 4 }) => {
    if (!tierLeaders.length) return null;
    const gridClass = {
      2: "grid sm:grid-cols-2 max-w-3xl mx-auto",
      3: "grid sm:grid-cols-2 lg:grid-cols-3",
      4: "grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
    }[maxCols] || "grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

    return (
      <div>
        <div className="text-center mb-10">
          <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-3">
            {eyebrow}
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{title}</h2>
        </div>
        <div className={`${gridClass} gap-px bg-gray-200`}>
          {tierLeaders.map((leader, index) => (
            <LeaderCard key={leader.id || index} leader={leader} index={index} />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white">
      <Helmet>
        <title>Our Leadership - Victory Bible Church</title>
        <meta
          name="description"
          content="Meet the dedicated leadership team of Victory Bible Church. Learn about our pastors, elders, and ministry leaders who guide our community."
        />
      </Helmet>

      {/* Hero */}
      <section className="relative min-h-screen overflow-hidden">
        <nav
          aria-label="Breadcrumb"
          className="absolute top-20 left-0 right-0 z-20 px-4 sm:px-6 lg:px-8"
        >
          <ol className="flex items-center space-x-1.5 text-sm text-white/60">
            <li>
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
            </li>
            <li aria-hidden="true"><span className="mx-1">›</span></li>
            <li>
              <Link to="/about" className="hover:text-white transition-colors">About</Link>
            </li>
            <li aria-hidden="true"><span className="mx-1">›</span></li>
            <li className="text-white/90" aria-current="page">Leadership</li>
          </ol>
        </nav>

        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/assets/hero-bg.jpg')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/85 via-black/70 to-black/85" />
        </div>

        <div className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-6">
              Our Leaders
            </p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Shepherds of Our <span className="text-primary-400">Faith</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 mb-12 leading-relaxed max-w-2xl mx-auto">
              Meet the leaders who guide, nurture, and inspire our church community with love,
              wisdom, and unwavering commitment.
            </p>
            <div
              className="flex flex-col items-center animate-bounce cursor-pointer"
              onClick={() => window.scrollTo({ top: window.innerHeight, behavior: "smooth" })}
            >
              <span className="text-white/50 text-xs font-light tracking-widest mb-2">
                MEET OUR LEADERS
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-white/50"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="bg-gray-50 py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          {isLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-px bg-gray-200">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse bg-white">
                  <div className="aspect-[4/5] bg-gray-200" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-gray-200 w-3/4" />
                    <div className="h-3 bg-gray-200 w-1/2" />
                    <div className="h-3 bg-gray-200 w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-16 border border-red-200 bg-red-50">
              <p className="text-red-700 font-semibold mb-4">
                Failed to load leadership information
              </p>
              <p className="text-red-500 text-sm mb-6">
                {error.message || "An unexpected error occurred. Please try again."}
              </p>
              <button
                className="border border-gray-900 text-gray-900 text-xs font-semibold uppercase tracking-widest px-8 py-3 hover:bg-gray-900 hover:text-white transition-all"
                onClick={() => window.location.reload()}
              >
                Try Again
              </button>
            </div>
          ) : leaders.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-400 text-lg">No leadership profiles found.</p>
              <p className="text-gray-300 text-sm mt-1">
                Leadership profiles added via the Admin panel will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-20">
              <TierSection
                eyebrow="Senior"
                title="Senior Leadership"
                leaders={categorizedTier1}
                maxCols={2}
              />
              <TierSection
                eyebrow="Ministry"
                title="Ministry Pastors"
                leaders={categorizedTier2}
                maxCols={4}
              />
              <TierSection
                eyebrow="Church"
                title="Church Leadership"
                leaders={categorizedTier3}
                maxCols={4}
              />
            </div>
          )}
        </div>
      </section>

      {/* Leader Profile Modal */}
      {selectedLeader && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={closeModal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div
            ref={modalRef}
            className="bg-white max-w-4xl w-full shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="grid md:grid-cols-5 relative">
              <div className="md:col-span-2 h-64 md:h-auto overflow-hidden bg-gray-100">
                <img
                  src={getImageUrl(selectedLeader)}
                  alt={`Portrait of ${selectedLeader.name}`}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.src = fallbackImages.default; }}
                />
              </div>
              <div className="md:col-span-3 p-8 relative">
                <button
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 p-2 transition-colors"
                  onClick={closeModal}
                  aria-label="Close profile details"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>

                <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-2">
                  {selectedLeader.title}
                </p>
                <h2
                  id="modal-title"
                  className="text-3xl md:text-4xl font-bold text-gray-900 mb-6"
                >
                  {selectedLeader.name}
                </h2>

                {selectedLeader.bio && (
                  <p className="text-gray-600 leading-relaxed mb-6">{selectedLeader.bio}</p>
                )}

                {selectedLeader.ministryFocus?.length > 0 && (
                  <div className="mb-6">
                    <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
                      Ministry Focus
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {selectedLeader.ministryFocus.map((focus, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 border border-gray-200 text-gray-600 text-xs"
                        >
                          {focus}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedLeader.email && (
                  <a
                    href={`mailto:${selectedLeader.email}`}
                    className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors"
                  >
                    <EnvelopeIcon className="h-4 w-4" />
                    {selectedLeader.email}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leadership;
