import { useState, useEffect, useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  ArrowRightIcon,
  ArrowPathIcon,
  ArrowTopRightOnSquareIcon,
} from "@heroicons/react/24/outline";
import config from "../config";
import { useSermonsQuery } from "../hooks/useSermonsQuery";
import placeholderImage from "../assets/placeholders/default-image.svg";

const API_URL = config.API_URL;

// ─── Helpers ─────────────────────────────────────────────────────────────────

const checkYouTubeConnectivity = async () => {
  try {
    await fetch("https://i.ytimg.com/vi/default/default.jpg", {
      mode: "no-cors", cache: "no-store", method: "HEAD",
    });
    return true;
  } catch { return false; }
};

const isValidYouTubeID = (id) =>
  id && typeof id === "string" && /^[a-zA-Z0-9_-]{11}$/.test(id);

const staticSermons = [
  { id: 1, title: "Faith That Moves Mountains",   date: "January 21, 2025", videoId: "l7fzlle9g84", speaker: "Pastor John Doe",   description: "Discover how faith can transform your life and overcome any obstacle in your path.", duration: "45:30" },
  { id: 2, title: "Walking in God's Purpose",     date: "January 14, 2025", videoId: "8nOKvkVN5dI", speaker: "Pastor Jane Smith", description: "Learn how to identify and fulfill God's purpose for your life.", duration: "38:15" },
  { id: 3, title: "The Power of Prayer",          date: "January 7, 2025",  videoId: "VgTVfZ3O-7A", speaker: "Pastor John Doe",   description: "Understand the transformative power of prayer in your daily walk with Christ.", duration: "42:10" },
];

// ─── Share buttons ────────────────────────────────────────────────────────────

const ShareButtons = ({ sermonTitle, sermonUrl }) => {
  const share = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(sermonUrl)}`,
    twitter:  `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out this sermon: ${sermonTitle}`)}&url=${encodeURIComponent(sermonUrl)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`Check out this sermon from Victory Bible Church: ${sermonTitle} ${sermonUrl}`)}`,
    email:    `mailto:?subject=${encodeURIComponent(`Sermon: ${sermonTitle}`)}&body=${encodeURIComponent(`I thought you might enjoy this sermon from Victory Bible Church: ${sermonUrl}`)}`,
  };
  const links = [
    { key: "facebook", label: "FB",  href: share.facebook },
    { key: "twitter",  label: "X",   href: share.twitter  },
    { key: "whatsapp", label: "WA",  href: share.whatsapp },
    { key: "email",    label: "✉",   href: share.email    },
  ];
  return (
    <div className="flex items-center gap-3">
      {links.map(({ key, label, href }) => (
        <a key={key} href={href}
          target={key !== "email" ? "_blank" : undefined}
          rel="noopener noreferrer"
          className="w-8 h-8 border border-white/10 flex items-center justify-center text-xs text-white/30 hover:border-brand-red hover:text-brand-red transition-colors"
        >
          {label}
        </a>
      ))}
    </div>
  );
};

// ─── Sermon card ──────────────────────────────────────────────────────────────

const SermonCard = ({ sermon, isActive, onSelect, getImage, formatDate }) => (
  <div
    onClick={() => onSelect(sermon)}
    className={`flex gap-0 cursor-pointer group transition-colors ${
      isActive ? "bg-white/5 border-l-2 border-brand-red" : "border-l-2 border-transparent hover:bg-white/3 hover:border-white/10"
    }`}
  >
    {/* Thumbnail */}
    <div className="relative w-32 sm:w-40 flex-shrink-0 aspect-video overflow-hidden bg-black">
      <img
        src={getImage(sermon)}
        alt={sermon.title}
        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
        onError={(e) => {
          if (sermon.videoId && !e.target.src.includes(sermon.videoId)) {
            e.target.src = `https://img.youtube.com/vi/${sermon.videoId}/hqdefault.jpg`;
          } else {
            e.target.src = placeholderImage;
          }
        }}
        loading="lazy"
      />
      {/* Play overlay */}
      <div className={`absolute inset-0 flex items-center justify-center transition-opacity ${isActive ? "opacity-100 bg-black/30" : "opacity-0 group-hover:opacity-100 bg-black/50"}`}>
        {isActive ? (
          <span className="bg-brand-red px-2 py-0.5 text-white text-xs font-bold uppercase tracking-wider">▶ Playing</span>
        ) : (
          <div className="w-8 h-8 bg-brand-red flex items-center justify-center">
            <svg className="h-4 w-4 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
          </div>
        )}
      </div>
    </div>

    {/* Info */}
    <div className="flex-1 p-4 min-w-0">
      <p className="text-brand-red text-xs font-semibold uppercase tracking-widest mb-1 truncate">
        {formatDate(sermon.date)}{sermon.duration ? ` · ${sermon.duration}` : ""}
      </p>
      <h3 className={`text-sm font-black leading-snug mb-1 line-clamp-2 transition-colors ${isActive ? "text-white" : "text-white/70 group-hover:text-white"}`}>
        {sermon.title}
      </h3>
      <p className="text-white/30 text-xs truncate">{sermon.speaker}</p>
    </div>
  </div>
);

// ─── Main page ────────────────────────────────────────────────────────────────

const Sermons = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const videoIdParam = searchParams.get("video");

  const { data: sermons = [], isLoading: sermonsLoading, error: sermonsError, refetch: refetchSermons } = useSermonsQuery();

  const [selectedSermon,    setSelectedSermon]    = useState(null);
  const [isLoading,         setIsLoading]         = useState(true);
  const [videoError,        setVideoError]        = useState(false);
  const [videoErrorMessage, setVideoErrorMessage] = useState("");
  const [playerMode,        setPlayerMode]        = useState("default");
  const [youtubeAccessible, setYoutubeAccessible] = useState(true);
  const [loadingTimeout,    setLoadingTimeout]    = useState(null);

  useEffect(() => { checkYouTubeConnectivity().then(setYoutubeAccessible); }, []);

  const sermonsToDisplay = useMemo(() => {
    const source = sermonsError || !sermons?.length ? staticSermons : sermons;
    return [...source].sort((a, b) => (new Date(b.date)?.getTime() || 0) - (new Date(a.date)?.getTime() || 0));
  }, [sermons, sermonsError]);

  const getSermonImageUrl = useCallback((sermon) => {
    if (!sermon || typeof sermon !== "object") return placeholderImage;
    if (sermon.videoId) return `https://img.youtube.com/vi/${sermon.videoId}/hqdefault.jpg`;
    if (sermon.image && typeof sermon.image === "object" && sermon.image.path) {
      const url = sermon.image.path.startsWith("/") ? `${API_URL}${sermon.image.path}` : sermon.image.path;
      return url;
    }
    if (sermon.imageUrl && typeof sermon.imageUrl === "string") {
      if (sermon.imageUrl.includes("default-image")) return placeholderImage;
      if (sermon.imageUrl.includes('{"')) {
        try {
          const parsed = JSON.parse(sermon.imageUrl);
          if (parsed?.path) return parsed.path.startsWith("/") ? `${API_URL}${parsed.path}` : parsed.path;
        } catch { /* fall through */ }
      }
      if (sermon.imageUrl.startsWith("http") || sermon.imageUrl.startsWith("data:")) return sermon.imageUrl;
      return sermon.imageUrl.startsWith("/") ? `${API_URL}${sermon.imageUrl}` : sermon.imageUrl;
    }
    if (sermon.image && typeof sermon.image === "string") {
      if (sermon.image.startsWith("http") || sermon.image.startsWith("data:")) return sermon.image;
      return sermon.image.startsWith("/") ? `${API_URL}${sermon.image}` : sermon.image;
    }
    return placeholderImage;
  }, []);

  const formatSermonDate = (dateString) => {
    if (!dateString) return "";
    try {
      if (typeof dateString === "object" && !(dateString instanceof Date)) return "Date unavailable";
      const date = new Date(dateString);
      if (!isNaN(date.getTime())) return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
      return dateString;
    } catch { return "Date unavailable"; }
  };

  const selectSermon = (sermon) => {
    if (loadingTimeout) { clearTimeout(loadingTimeout); setLoadingTimeout(null); }
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
      setIsLoading((stillLoading) => {
        if (stillLoading) {
          setVideoError(true);
          setVideoErrorMessage("Video loading timed out. Please try again.");
        }
        return false;
      });
    }, 12000);
    setLoadingTimeout(timeout);
    setPlayerMode("default");
    setSelectedSermon(sermon);
  };

  useEffect(() => () => { if (loadingTimeout) clearTimeout(loadingTimeout); }, [loadingTimeout]);

  useEffect(() => {
    const resetTimer = setTimeout(() => {
      if (isLoading) { setIsLoading(false); if (loadingTimeout) { clearTimeout(loadingTimeout); setLoadingTimeout(null); } }
    }, 3000);

    if (sermonsToDisplay?.length > 0) {
      if (videoIdParam) {
        const found = sermonsToDisplay.find((s) => s.videoId === videoIdParam);
        selectSermon(found || sermonsToDisplay[0]);
      } else {
        selectSermon(sermonsToDisplay[0]);
      }
    }
    return () => { clearTimeout(resetTimer); if (loadingTimeout) { clearTimeout(loadingTimeout); setLoadingTimeout(null); } };
  }, [sermonsToDisplay, videoIdParam]);

  // ── Loading state ──────────────────────────────────────────────────────────
  if (sermonsLoading || (isLoading && !selectedSermon)) {
    return (
      <div className="min-h-screen bg-vbc-dark flex items-center justify-center">
        <div className="h-8 w-8 border-2 border-brand-red border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // ── Error state (hard) ─────────────────────────────────────────────────────
  if (sermonsError && !sermons?.length) {
    return (
      <div className="min-h-screen bg-vbc-dark flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-4">Error</p>
          <p className="text-white text-xl font-black mb-2">Unable to load sermons</p>
          <p className="text-white/40 text-sm mb-8">{sermonsError?.message || "Please try again later."}</p>
          <button onClick={refetchSermons}
            className="inline-flex items-center gap-2 border border-white/20 text-white text-xs font-semibold uppercase tracking-wider px-6 py-3 hover:bg-white/5 transition-colors">
            <ArrowPathIcon className="h-3.5 w-3.5" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  // ── Empty state ────────────────────────────────────────────────────────────
  if (!isLoading && !sermonsError && sermons.length === 0) {
    return (
      <div className="min-h-screen bg-vbc-dark flex items-center justify-center">
        <div className="text-center">
          <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-4">Coming Soon</p>
          <p className="text-white text-xl font-black">No Sermons Available</p>
          <p className="text-white/40 text-sm mt-2">Check back later for new sermon uploads.</p>
        </div>
      </div>
    );
  }

  // ── Video player ───────────────────────────────────────────────────────────
  // Player modes:
  //   "default"   → youtube-nocookie.com (fewer tracking restrictions, less likely to be blocked)
  //   "alternate" → youtube.com standard embed
  //   "youtube"   → external link fallback
  const VideoPlayer = () => {
    if (playerMode === "youtube") {
      return (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black text-white p-6 text-center">
          <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-3">Watch on YouTube</p>
          <p className="text-white/40 text-sm mb-6">Click below to watch this sermon directly on YouTube.</p>
          <a
            href={`https://www.youtube.com/watch?v=${selectedSermon.videoId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-brand-red text-white text-xs font-semibold uppercase tracking-wider px-6 py-3 hover:bg-red-700 transition-colors"
          >
            Open on YouTube
            <ArrowTopRightOnSquareIcon className="h-3.5 w-3.5" />
          </a>
        </div>
      );
    }

    if (videoError) {
      return (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black text-white p-6 text-center">
          <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-3">Video Unavailable</p>
          <p className="text-white/40 text-sm mb-6 max-w-xs leading-relaxed">
            {videoErrorMessage || "The video could not load. Try a different player or watch directly on YouTube."}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => {
                setVideoError(false);
                setVideoErrorMessage("");
                setIsLoading(true);
                setPlayerMode((m) => m === "default" ? "alternate" : "default");
              }}
              className="border border-white/20 text-white text-xs font-semibold uppercase tracking-wider px-5 py-2.5 hover:bg-white/10 transition-colors"
            >
              {playerMode === "default" ? "Try Player 2" : "Try Player 1"}
            </button>
            <a
              href={`https://www.youtube.com/watch?v=${selectedSermon.videoId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-brand-red text-white text-xs font-semibold uppercase tracking-wider px-5 py-2.5 hover:bg-red-700 transition-colors"
            >
              Watch on YouTube
              <ArrowTopRightOnSquareIcon className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      );
    }

    // Player 1 (default): youtube-nocookie — no tracking cookies, less likely to be
    // blocked by privacy filters or corporate/school networks.
    // Player 2 (alternate): standard youtube.com embed as fallback.
    const iframeSrc = playerMode === "default"
      ? `https://www.youtube-nocookie.com/embed/${selectedSermon.videoId}?rel=0&modestbranding=1&origin=${encodeURIComponent(window.location.origin)}`
      : `https://www.youtube.com/embed/${selectedSermon.videoId}?rel=0&modestbranding=1&origin=${encodeURIComponent(window.location.origin)}`;

    return (
      <>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
            <div className="h-8 w-8 border-2 border-brand-red border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        <iframe
          key={`${selectedSermon.videoId}-${playerMode}`}
          className="absolute inset-0 w-full h-full"
          src={iframeSrc}
          title={selectedSermon.title}
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
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
    <div className="bg-vbc-dark min-h-screen">
      <Helmet>
        <title>Sermons & Messages — Victory Bible Church</title>
        <meta name="description" content="Watch and listen to past messages from Victory Bible Church. Grow in your faith through Scripture-driven preaching." />
      </Helmet>

      {/* ── Page header ───────────────────────────────────────────── */}
      <div className="border-b border-white/10 bg-vbc-dark">
        <div className="max-w-7xl mx-auto px-6 pt-24 pb-6 flex items-center justify-between">
          <div>
            <h1 className="text-white font-black text-lg leading-tight">Sermons and Messages</h1>
          </div>
          <p className="text-white/20 text-xs uppercase tracking-wider hidden sm:block">
            {sermonsToDisplay.length} message{sermonsToDisplay.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* ── Soft retry banner ─────────────────────────────────────── */}
      {sermonsError && (
        <div className="bg-white/5 border-b border-white/10">
          <div className="max-w-7xl mx-auto px-6 py-2.5 flex items-center justify-between">
            <span className="text-white/40 text-xs">Showing cached sermons — latest data unavailable.</span>
            <button onClick={refetchSermons}
              className="text-xs font-semibold uppercase tracking-wider text-white/30 hover:text-white transition-colors ml-4 flex items-center gap-1">
              <ArrowPathIcon className="h-3 w-3" /> Retry
            </button>
          </div>
        </div>
      )}

      {/* ── Now playing ───────────────────────────────────────────── */}
      {selectedSermon && (
        <section className="bg-vbc-section border-b border-white/5">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row">

              {/* Video */}
              <div className="w-full lg:w-3/5 aspect-video relative bg-black flex-shrink-0">
                <VideoPlayer />
              </div>

              {/* Info */}
              <div className="w-full lg:w-2/5 flex flex-col p-8 lg:p-10">
                <div className="flex-1">
                  <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-6">Now Playing</p>

                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-white/40 text-xs">{formatSermonDate(selectedSermon.date)}</span>
                    {selectedSermon.duration && (
                      <>
                        <span className="text-white/20">·</span>
                        <span className="text-white/40 text-xs">{selectedSermon.duration}</span>
                      </>
                    )}
                  </div>

                  <h2 className="text-xl md:text-2xl font-black text-white mb-3 leading-tight">
                    {selectedSermon.title}
                  </h2>
                  <p className="text-white/40 text-sm mb-5 font-medium">{selectedSermon.speaker}</p>

                  {selectedSermon.description && typeof selectedSermon.description === "string" && (
                    <p className="text-white/30 text-sm leading-relaxed border-l-2 border-white/10 pl-4">
                      {selectedSermon.description}
                    </p>
                  )}
                </div>

                <div className="border-t border-white/10 pt-6 mt-8 space-y-5">
                  {/* Player switcher */}
                  <div className="flex items-center gap-4">
                    <p className="text-white/20 text-xs uppercase tracking-wider mr-1">Player</p>
                    {[
                      { mode: "default",   label: "1 (Recommended)" },
                      { mode: "alternate", label: "2" },
                    ].map(({ mode, label }) => (
                      <button key={mode}
                        onClick={() => { setPlayerMode(mode); setIsLoading(true); setVideoError(false); setVideoErrorMessage(""); }}
                        className={`text-xs uppercase tracking-widest transition-colors ${playerMode === mode ? "text-white font-bold" : "text-white/30 hover:text-white/60"}`}
                      >
                        {label}
                      </button>
                    ))}
                    <span className="text-white/10">·</span>
                    <a href={`https://www.youtube.com/watch?v=${selectedSermon.videoId}`}
                      target="_blank" rel="noopener noreferrer"
                      className="text-xs uppercase tracking-widest text-white/30 hover:text-brand-red transition-colors inline-flex items-center gap-1">
                      YouTube <ArrowTopRightOnSquareIcon className="h-3 w-3" />
                    </a>
                  </div>

                  {/* Share */}
                  <div>
                    <p className="text-white/20 text-xs uppercase tracking-wider mb-3">Share</p>
                    <ShareButtons
                      sermonTitle={selectedSermon.title}
                      sermonUrl={`${window.location.origin}/sermons?video=${selectedSermon.videoId}`}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── All sermons ───────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-14">
        <div className="mb-8">
          <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-2">All Messages</p>
          <h2 className="text-2xl font-black text-white">Watch &amp; Listen</h2>
        </div>

        {/* Desktop: 3-col grid of cards. Mobile: single column */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5">
          {sermonsToDisplay.map((sermon) => {
            const isActive = selectedSermon?.id === sermon.id ||
              selectedSermon?.videoId === sermon.videoId;
            return (
              <SermonCard
                key={sermon.id || sermon._id}
                sermon={sermon}
                isActive={isActive}
                onSelect={selectSermon}
                getImage={getSermonImageUrl}
                formatDate={formatSermonDate}
              />
            );
          })}
        </div>
      </section>

      {/* ── Footer CTA ────────────────────────────────────────────── */}
      <section className="bg-vbc-section border-t border-white/5 py-16">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-2">Subscribe</p>
            <p className="text-white font-black text-lg">Never miss a message.</p>
            <p className="text-white/30 text-sm mt-1">New sermons are uploaded after each Sunday service.</p>
          </div>
          <a
            href="https://youtube.com/@BishopSimwanza"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-brand-red text-white text-xs font-semibold uppercase tracking-wider px-8 py-4 hover:bg-red-700 transition-colors flex-shrink-0"
          >
            Subscribe on YouTube
            <ArrowTopRightOnSquareIcon className="h-3.5 w-3.5" />
          </a>
        </div>
      </section>
    </div>
  );
};

export default Sermons;
