import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useState, useCallback, useMemo, useEffect } from "react";
import config from "../../config";
import { useSermonsQuery } from "../../hooks/useSermonsQuery";
import placeholderImage from "../../assets/placeholders/default-image.svg";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { PlayIcon } from "@heroicons/react/24/solid";

// ── Helpers ───────────────────────────────────────────────────────────────────
const getSermonImage = (sermon) => {
  if (!sermon) return placeholderImage;
  if (sermon.videoId)
    return `https://img.youtube.com/vi/${sermon.videoId}/hqdefault.jpg`;
  if (sermon.image?.path)
    return sermon.image.path.startsWith("/")
      ? `${config.API_URL}${sermon.image.path}`
      : sermon.image.path;
  if (
    typeof sermon.imageUrl === "string" &&
    sermon.imageUrl &&
    !sermon.imageUrl.includes("default-image")
  )
    return sermon.imageUrl.startsWith("/")
      ? `${config.API_URL}${sermon.imageUrl}`
      : sermon.imageUrl;
  return placeholderImage;
};

const formatDate = (d) => {
  if (!d) return "";
  try {
    const date = d instanceof Date ? d : new Date(d);
    if (isNaN(date.getTime())) return String(d);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return "";
  }
};

// ── Video Modal ───────────────────────────────────────────────────────────────
function VideoModal({ sermon, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-4xl">
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-white/60 hover:text-white text-sm uppercase tracking-widest"
        >
          Close ✕
        </button>
        <div className="relative pt-[56.25%]">
          <iframe
            src={`https://www.youtube.com/embed/${sermon.videoId}?autoplay=1&rel=0&modestbranding=1`}
            title={sermon.title}
            className="absolute inset-0 w-full h-full"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
const Sermons = () => {
  const { data: sermons = [], isLoading, error, refetch } = useSermonsQuery();
  const [selectedSermon, setSelectedSermon] = useState(null);

  const sermonsToDisplay = useMemo(() => {
    if (!sermons?.length) return [];
    return [...sermons].sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [sermons]);

  if (isLoading && !sermons?.length) {
    return (
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto flex justify-center min-h-[300px] items-center">
          <div className="w-10 h-10 rounded-full border-2 border-primary-500 border-t-transparent animate-spin" />
        </div>
      </section>
    );
  }

  if (!sermonsToDisplay.length) return null;

  const latest = sermonsToDisplay[0];
  const rest = sermonsToDisplay.slice(1, 4);

  return (
    <section className="bg-gray-50">
      {/* ── Section header ── */}
      <div className="max-w-7xl 3xl:max-w-screen-2xl mx-auto px-4 sm:px-8 pt-14 sm:pt-20 pb-8 sm:pb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-2">
            Messages
          </p>
          <h2 className="text-3xl md:text-4xl 3xl:text-5xl font-bold text-gray-900">
            Latest <span className="text-primary-600">Sermons</span>
          </h2>
        </motion.div>
        <Link
          to="/sermons"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors group"
        >
          View All Sermons
          <ArrowRightIcon className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* ── Featured sermon — horizontal split ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
        className="max-w-7xl 3xl:max-w-screen-2xl mx-auto px-4 sm:px-8 mb-8 sm:mb-12"
      >
        <div className="flex flex-col md:flex-row overflow-hidden shadow-lg">
          {/* Thumbnail */}
          <button
            type="button"
            onClick={() => setSelectedSermon(latest)}
            className="relative md:w-3/5 h-64 md:h-auto group text-left overflow-hidden"
            aria-label={`Watch ${latest.title}`}
          >
            <img
              src={getSermonImage(latest)}
              alt={latest.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              onError={(e) => {
                e.target.src = placeholderImage;
                e.target.onerror = null;
              }}
            />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/15 transition-colors" />
            {/* Play button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-primary-600/90 flex items-center justify-center group-hover:bg-primary-500 group-hover:scale-110 transition-all shadow-xl">
                <PlayIcon className="h-7 w-7 text-white ml-1" />
              </div>
            </div>
            <span className="absolute top-5 left-5 bg-brand-red text-white text-xs font-bold uppercase tracking-widest px-3 py-1.5">
              Latest
            </span>
          </button>

          {/* Info panel — charcoal dark */}
          <div className="md:w-2/5 bg-[#111827] flex flex-col justify-center p-8 md:p-10">
            <p className="text-brand-red text-xs font-bold uppercase tracking-widest mb-3">
              {formatDate(latest.date)}
            </p>
            <h3 className="text-2xl md:text-3xl font-bold text-white leading-tight mb-3">
              {latest.title}
            </h3>
            <p className="text-primary-400 text-sm font-medium mb-4">
              {latest.speaker || "Guest Speaker"}
            </p>
            {latest.series && (
              <span className="inline-block text-xs border border-white/10 text-gray-400 px-3 py-1 mb-5 self-start">
                {latest.series}
              </span>
            )}
            {latest.description && typeof latest.description === "string" && (
              <p className="text-gray-400 text-sm leading-relaxed mb-7 line-clamp-3">
                {latest.description}
              </p>
            )}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setSelectedSermon(latest)}
                className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold uppercase tracking-widest px-6 py-3 transition-colors"
              >
                <PlayIcon className="h-4 w-4" />
                Watch Now
              </button>
              <Link
                to="/sermons"
                className="inline-flex items-center gap-2 border border-white/15 text-white text-xs font-bold uppercase tracking-widest px-6 py-3 hover:bg-white/5 transition-colors"
              >
                All Messages
              </Link>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Recent sermons — flat cards ── */}
      {rest.length > 0 && (
        <div className="max-w-7xl 3xl:max-w-screen-2xl mx-auto px-4 sm:px-8 pb-14 sm:pb-20">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-0 border-t border-l border-gray-200">
            {rest.map((sermon, i) => (
              <motion.div
                key={sermon.id || i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="border-r border-b border-gray-200 group"
              >
                {/* Thumbnail */}
                <button
                  type="button"
                  onClick={() => setSelectedSermon(sermon)}
                  className="relative block w-full h-52 overflow-hidden text-left"
                >
                  <img
                    src={getSermonImage(sermon)}
                    alt={sermon.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.src = placeholderImage;
                      e.target.onerror = null;
                    }}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-primary-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity scale-90 group-hover:scale-100 transition-transform">
                      <PlayIcon className="h-5 w-5 text-white ml-0.5" />
                    </div>
                  </div>
                </button>

                {/* Text */}
                <div className="p-6 bg-white">
                  <p className="text-brand-red text-xs font-bold uppercase tracking-widest mb-2">
                    {formatDate(sermon.date)}
                  </p>
                  <h3 className="text-lg font-bold text-gray-900 leading-snug mb-1 line-clamp-2">
                    {sermon.title}
                  </h3>
                  <p className="text-primary-600 text-xs font-medium mb-3">
                    {sermon.speaker || "Guest Speaker"}
                  </p>
                  {sermon.description &&
                    typeof sermon.description === "string" && (
                      <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2">
                        {sermon.description}
                      </p>
                    )}
                  <button
                    onClick={() => setSelectedSermon(sermon)}
                    className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors group/link"
                  >
                    Watch Sermon
                    <ArrowRightIcon className="h-3.5 w-3.5 group-hover/link:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {selectedSermon && (
        <VideoModal
          sermon={selectedSermon}
          onClose={() => setSelectedSermon(null)}
        />
      )}
    </section>
  );
};

export default Sermons;
