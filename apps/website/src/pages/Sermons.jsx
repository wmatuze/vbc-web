import { useState, useEffect, useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import config from "../config";
import { useSermonsQuery } from "../hooks/useSermonsQuery";
import placeholderImage from "../assets/placeholders/default-image.svg";
import HeroSection from "../components/common/HeroSection";

const API_URL = config.API_URL;

const checkYouTubeConnectivity = async () => {
  try {
    await fetch("https://i.ytimg.com/vi/default/default.jpg", {
      mode: "no-cors",
      cache: "no-store",
      method: "HEAD",
      timeout: 3000,
    });
    return true;
  } catch {
    return false;
  }
};

const isValidYouTubeID = (id) =>
  id && typeof id === "string" && /^[a-zA-Z0-9_-]{11}$/.test(id);

const staticSermons = [
  {
    id: 1,
    title: "Faith That Moves Mountains",
    date: "January 21, 2025",
    imageUrl: "/images/sermon1.jpg",
    videoId: "l7fzlle9g84",
    speaker: "Pastor John Doe",
    description:
      "Discover how faith can transform your life and overcome any obstacle in your path.",
    duration: "45:30",
  },
  {
    id: 2,
    title: "Walking in God's Purpose",
    date: "January 14, 2025",
    imageUrl: "/images/sermon2.jpg",
    videoId: "8nOKvkVN5dI",
    speaker: "Pastor Jane Smith",
    description: "Learn how to identify and fulfill God's purpose for your life.",
    duration: "38:15",
  },
  {
    id: 3,
    title: "The Power of Prayer",
    date: "January 7, 2025",
    imageUrl: "/images/sermon3.jpg",
    videoId: "VgTVfZ3O-7A",
    speaker: "Pastor John Doe",
    description:
      "Understand the transformative power of prayer in your daily walk with Christ.",
    duration: "42:10",
  },
];

const Sermons = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const videoIdParam = searchParams.get("video");

  const {
    data: sermons = [],
    isLoading: sermonsLoading,
    error: sermonsError,
    refetch: refetchSermons,
  } = useSermonsQuery();

  const [selectedSermon, setSelectedSermon] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [videoError, setVideoError] = useState(false);
  const [videoErrorMessage, setVideoErrorMessage] = useState("");
  const [playerMode, setPlayerMode] = useState("default");
  const [youtubeAccessible, setYoutubeAccessible] = useState(true);
  const [loadingTimeout, setLoadingTimeout] = useState(null);

  const sermonsToDisplay = useMemo(() => {
    const source = sermonsError || !sermons?.length ? staticSermons : sermons;
    return [...source].sort((a, b) => {
      const da = new Date(a.date)?.getTime() || 0;
      const db = new Date(b.date)?.getTime() || 0;
      return db - da;
    });
  }, [sermons, sermonsError]);

  const getSermonImageUrl = useCallback((sermon) => {
    if (!sermon || typeof sermon !== "object") return placeholderImage;
    if (sermon.videoId) return `https://img.youtube.com/vi/${sermon.videoId}/hqdefault.jpg`;
    if (sermon.image && typeof sermon.image === "object" && sermon.image.path) {
      const url = sermon.image.path.startsWith("/")
        ? `${API_URL}${sermon.image.path}`
        : sermon.image.path;
      return url;
    }
    if (sermon.imageUrl && typeof sermon.imageUrl === "string") {
      if (sermon.imageUrl.includes("default-image")) return placeholderImage;
      if (sermon.imageUrl.includes('{"')) {
        try {
          const parsed = JSON.parse(sermon.imageUrl);
          if (parsed?.path) {
            return parsed.path.startsWith("/")
              ? `${API_URL}${parsed.path}`
              : parsed.path;
          }
        } catch {
          // fall through
        }
      }
      if (sermon.imageUrl.startsWith("http") || sermon.imageUrl.startsWith("data:")) {
        return sermon.imageUrl;
      }
      return sermon.imageUrl.startsWith("/")
        ? `${API_URL}${sermon.imageUrl}`
        : sermon.imageUrl;
    }
    if (sermon.image && typeof sermon.image === "string") {
      if (sermon.image.startsWith("http") || sermon.image.startsWith("data:")) {
        return sermon.image;
      }
      return sermon.image.startsWith("/")
        ? `${API_URL}${sermon.image}`
        : sermon.image;
    }
    return placeholderImage;
  }, []);

  const formatSermonDate = (dateString) => {
    if (!dateString) return "";
    try {
      if (typeof dateString === "object" && !(dateString instanceof Date)) {
        return "Date unavailable";
      }
      if (typeof dateString === "string" && dateString.includes("T")) {
        const date = new Date(dateString);
        if (!isNaN(date.getTime())) {
          return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          });
        }
      }
      if (dateString instanceof Date && !isNaN(dateString.getTime())) {
        return dateString.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      }
      return dateString;
    } catch {
      return "Date unavailable";
    }
  };

  useEffect(() => {
    checkYouTubeConnectivity().then(setYoutubeAccessible);
  }, []);

  const selectSermon = (sermon) => {
    if (loadingTimeout) {
      clearTimeout(loadingTimeout);
      setLoadingTimeout(null);
    }

    setIsLoading(true);
    setVideoError(false);
    setVideoErrorMessage("");
    setSearchParams({ video: sermon.videoId }, { replace: true });

    if (!sermon.videoId || !isValidYouTubeID(sermon.videoId)) {
      setVideoError(true);
      setVideoErrorMessage(`Invalid YouTube video ID: ${sermon.videoId || "missing"}`);
      setIsLoading(false);
      return;
    }

    const timeout = setTimeout(() => {
      setIsLoading(false);
      if (isLoading) {
        setVideoError(true);
        setVideoErrorMessage("Video loading timed out. Please try again.");
      }
    }, 10000);

    setLoadingTimeout(timeout);
    setPlayerMode("default");
    setSelectedSermon(sermon);
  };

  useEffect(() => {
    return () => { if (loadingTimeout) clearTimeout(loadingTimeout); };
  }, [loadingTimeout]);

  useEffect(() => {
    const resetTimer = setTimeout(() => {
      if (isLoading) {
        setIsLoading(false);
        if (loadingTimeout) { clearTimeout(loadingTimeout); setLoadingTimeout(null); }
      }
    }, 3000);

    if (sermonsToDisplay?.length > 0) {
      if (videoIdParam) {
        const found = sermonsToDisplay.find((s) => s.videoId === videoIdParam);
        selectSermon(found || sermonsToDisplay[0]);
      } else {
        selectSermon(sermonsToDisplay[0]);
      }
    }

    return () => {
      clearTimeout(resetTimer);
      if (loadingTimeout) { clearTimeout(loadingTimeout); setLoadingTimeout(null); }
    };
  }, [sermonsToDisplay, videoIdParam]);

  if (sermonsLoading || (isLoading && !selectedSermon)) {
    return (
      <div className="min-h-screen bg-vbc-dark flex items-center justify-center">
        <div className="h-10 w-10 border-2 border-brand-red border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (sermonsError && !sermons?.length) {
    return (
      <div className="min-h-screen bg-vbc-dark flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-4">Error</p>
          <p className="text-white text-xl font-bold mb-2">Unable to load sermons</p>
          <p className="text-gray-400 text-sm mb-6">
            {sermonsError?.message || "Please try again later."}
          </p>
          <button
            onClick={refetchSermons}
            className="border border-white/20 text-white text-xs font-semibold uppercase tracking-widest px-8 py-3 hover:bg-white hover:text-black transition-all"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!isLoading && !sermonsError && sermons.length === 0) {
    return (
      <div className="min-h-screen bg-vbc-dark flex items-center justify-center">
        <div className="text-center">
          <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-4">
            Coming Soon
          </p>
          <p className="text-white text-xl font-bold">No Sermons Available</p>
          <p className="text-gray-400 text-sm mt-2">Check back later for new sermon uploads.</p>
        </div>
      </div>
    );
  }

  const VideoPlayer = () => {
    if (playerMode === "youtube") {
      return (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-vbc-section text-white p-6 text-center">
          <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-4">
            External Player
          </p>
          <p className="text-white/60 text-sm mb-6">
            Watch this sermon directly on YouTube.
          </p>
          <a
            href={`https://www.youtube.com/watch?v=${selectedSermon.videoId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="border border-white/20 text-white text-xs font-semibold uppercase tracking-widest px-6 py-3 hover:bg-white hover:text-black transition-all"
          >
            Open YouTube ↗
          </a>
        </div>
      );
    }

    if (videoError) {
      return (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-vbc-section text-white p-6 text-center">
          <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-4">
            Playback Error
          </p>
          <p className="text-white/60 text-sm mb-6 max-w-sm">
            {videoErrorMessage ||
              "There was an issue connecting to YouTube. Your network may be blocking YouTube content."}
          </p>
          <div className="flex gap-3 flex-wrap justify-center">
            <button
              onClick={() => {
                setPlayerMode(playerMode === "default" ? "alternate" : "default");
                setIsLoading(true);
                setVideoError(false);
              }}
              className="border border-white/20 text-white text-xs font-semibold uppercase tracking-widest px-5 py-2.5 hover:bg-white hover:text-black transition-all"
            >
              {playerMode === "default" ? "Try Player 2" : "Try Player 1"}
            </button>
            <button
              onClick={() => setPlayerMode("youtube")}
              className="border border-white/20 text-white text-xs font-semibold uppercase tracking-widest px-5 py-2.5 hover:bg-white hover:text-black transition-all"
            >
              YouTube ↗
            </button>
          </div>
        </div>
      );
    }

    const iframeSrc =
      playerMode === "alternate"
        ? `https://www.youtube-nocookie.com/embed/${selectedSermon.videoId}?rel=0&modestbranding=1&origin=${encodeURIComponent(window.location.origin)}&enablejsapi=0&autoplay=1`
        : `https://www.youtube.com/embed/${selectedSermon.videoId}?origin=${encodeURIComponent(window.location.origin)}&enablejsapi=0&rel=0&modestbranding=1&autoplay=1`;

    return (
      <>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
            <div className="h-10 w-10 border-2 border-brand-red border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        <iframe
          className="absolute inset-0 w-full h-full"
          src={iframeSrc}
          title={selectedSermon.title}
          allow="autoplay; fullscreen"
          allowFullScreen
          loading="eager"
          onLoad={() => {
            setIsLoading(false);
            if (loadingTimeout) { clearTimeout(loadingTimeout); setLoadingTimeout(null); }
          }}
        />
      </>
    );
  };

  return (
    <div className="bg-vbc-dark">
      <Helmet>
        <title>Sermons and Messages - Victory Bible Church</title>
        <meta
          name="description"
          content="Watch or listen to past messages and sermons from Victory Bible Church."
        />
      </Helmet>

      <HeroSection
        title="Sermons and Messages"
        subtitle="Spiritual Growth"
        description="Watch or listen to past messages from our church services and grow in your faith journey."
        primaryAccentText="Messages"
        scrollText="EXPLORE SERMONS"
        backgroundImage="/assets/hero-bg.jpg"
      />

      {/* Now Playing — dark section */}
      {selectedSermon && (
        <section className="bg-vbc-section">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
            <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-8">
              Now Playing
            </p>

            {sermonsError && (
              <div className="mb-6 flex items-center justify-between border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/60">
                <span>Showing cached sermons — latest data unavailable.</span>
                <button
                  onClick={refetchSermons}
                  className="text-xs font-semibold uppercase tracking-widest text-white/40 hover:text-white transition-colors ml-4"
                >
                  Retry
                </button>
              </div>
            )}

            <div className="flex flex-col lg:flex-row min-h-[300px] lg:min-h-[450px]">
              {/* Video */}
              <div className="w-full lg:w-3/5 aspect-video lg:aspect-auto relative flex-shrink-0 bg-black">
                <VideoPlayer />
              </div>

              {/* Info panel */}
              <div className="w-full lg:w-2/5 bg-[#111827] p-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-brand-red text-xs font-semibold uppercase tracking-widest">
                      {formatSermonDate(selectedSermon.date)}
                    </span>
                    {selectedSermon.duration && (
                      <>
                        <span className="text-white/20">·</span>
                        <span className="text-white/40 text-xs">{selectedSermon.duration}</span>
                      </>
                    )}
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-white mb-3 leading-tight">
                    {selectedSermon.title}
                  </h2>
                  <p className="text-gray-400 text-sm mb-4">{selectedSermon.speaker}</p>
                  {selectedSermon.description && (
                    <p className="text-gray-500 text-sm leading-relaxed">
                      {typeof selectedSermon.description === "string"
                        ? selectedSermon.description
                        : null}
                    </p>
                  )}
                </div>

                <div className="border-t border-white/10 pt-6 mt-6">
                  {/* Player mode switcher */}
                  <div className="flex items-center gap-4 mb-6">
                    <button
                      onClick={() => { setPlayerMode("default"); setIsLoading(true); setVideoError(false); }}
                      className={`text-xs uppercase tracking-widest transition-colors ${playerMode === "default" ? "text-white font-semibold" : "text-white/30 hover:text-white/60"}`}
                    >
                      Player 1
                    </button>
                    <span className="text-white/10">|</span>
                    <button
                      onClick={() => { setPlayerMode("alternate"); setIsLoading(true); setVideoError(false); }}
                      className={`text-xs uppercase tracking-widest transition-colors ${playerMode === "alternate" ? "text-white font-semibold" : "text-white/30 hover:text-white/60"}`}
                    >
                      Player 2
                    </button>
                    <span className="text-white/10">|</span>
                    <a
                      href={`https://www.youtube.com/watch?v=${selectedSermon.videoId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs uppercase tracking-widest text-white/30 hover:text-white/60 transition-colors"
                    >
                      YouTube ↗
                    </a>
                  </div>
                  {/* Share */}
                  <p className="text-white/30 text-xs uppercase tracking-widest mb-3">Share</p>
                  <ShareButtons
                    sermonTitle={selectedSermon.title}
                    sermonUrl={`${window.location.origin}/media/sermons?video=${selectedSermon.videoId}`}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Sermon Grid — light section */}
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-3">
              Our Messages
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Watch &amp; <span className="text-primary-600">Listen</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-200">
            {sermonsToDisplay?.map((sermon) => {
              const isActive = selectedSermon?.id === sermon.id;
              return (
                <div
                  key={sermon.id}
                  onClick={() => selectSermon(sermon)}
                  className={`cursor-pointer group flex flex-col bg-white ${
                    isActive ? "ring-inset ring-2 ring-primary-500" : ""
                  }`}
                >
                  {/* Thumbnail */}
                  <div className="relative h-48 overflow-hidden bg-gray-100">
                    <img
                      src={getSermonImageUrl(sermon)}
                      alt={sermon.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        if (sermon.videoId && !e.target.src.includes(sermon.videoId)) {
                          e.target.src = `https://img.youtube.com/vi/${sermon.videoId}/hqdefault.jpg`;
                        } else {
                          e.target.src = placeholderImage;
                        }
                      }}
                      loading="lazy"
                      decoding="async"
                    />
                    {sermon.videoId && (
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                        <div className="w-12 h-12 bg-brand-red flex items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 text-white ml-1"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                    )}
                    {isActive && (
                      <div className="absolute top-3 left-3 bg-brand-red px-2 py-1">
                        <span className="text-white text-xs font-semibold uppercase tracking-widest">
                          Playing
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-grow">
                    <p className="text-brand-red text-xs font-semibold uppercase tracking-widest mb-2">
                      {formatSermonDate(sermon.date)}
                    </p>
                    <h3 className="text-gray-900 font-bold text-base mb-1 leading-snug">
                      {sermon.title}
                    </h3>
                    <p className="text-gray-400 text-sm mb-3">{sermon.speaker}</p>
                    {sermon.description && (
                      <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 flex-grow mb-4">
                        {typeof sermon.description === "string"
                          ? sermon.description
                          : null}
                      </p>
                    )}
                    <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gray-400 group-hover:text-gray-900 transition-colors mt-auto">
                      {isActive ? (
                        <span className="text-primary-600">Now Playing</span>
                      ) : (
                        <>
                          Watch <ArrowRightIcon className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

const ShareButtons = ({ sermonTitle, sermonUrl }) => {
  const shareData = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(sermonUrl)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out this sermon: ${sermonTitle}`)}&url=${encodeURIComponent(sermonUrl)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`Check out this sermon from Victory Bible Church: ${sermonTitle} ${sermonUrl}`)}`,
    email: `mailto:?subject=${encodeURIComponent(`Sermon recommendation: ${sermonTitle}`)}&body=${encodeURIComponent(`I thought you might enjoy this sermon from Victory Bible Church: ${sermonUrl}`)}`,
  };

  return (
    <div className="flex items-center gap-4">
      <a
        href={shareData.facebook}
        target="_blank"
        rel="noopener noreferrer"
        className="text-white/30 hover:text-white transition-colors"
        aria-label="Share on Facebook"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
        </svg>
      </a>
      <a
        href={shareData.twitter}
        target="_blank"
        rel="noopener noreferrer"
        className="text-white/30 hover:text-white transition-colors"
        aria-label="Share on Twitter"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
        </svg>
      </a>
      <a
        href={shareData.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        className="text-white/30 hover:text-white transition-colors"
        aria-label="Share on WhatsApp"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
        </svg>
      </a>
      <a
        href={shareData.email}
        className="text-white/30 hover:text-white transition-colors"
        aria-label="Share via Email"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
          <polyline points="22,6 12,13 2,6"></polyline>
        </svg>
      </a>
    </div>
  );
};

export default Sermons;
