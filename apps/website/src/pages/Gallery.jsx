import { useState, useEffect, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import {
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MagnifyingGlassPlusIcon,
} from "@heroicons/react/24/outline";

// ─── Image data ───────────────────────────────────────────────────────────────

const IMAGES = [
  { id: 1,  src: "/images/gallery1.jpg",              alt: "Sunday Worship Service",        category: "worship"  },
  { id: 2,  src: "/images/gallery2.jpg",              alt: "Community Outreach",             category: "outreach" },
  { id: 3,  src: "/images/gallery3.jpg",              alt: "Youth Ministry",                 category: "youth"    },
  { id: 4,  src: "/images/gallery4.jpg",              alt: "Baptism Service",                category: "events"   },
  { id: 5,  src: "/images/gallery5.jpg",              alt: "Prayer Meeting",                 category: "worship"  },
  { id: 6,  src: "/images/gallery6.jpg",              alt: "Christmas Celebration",          category: "events"   },
  { id: 7,  src: "/images/gallery7.jpg",              alt: "Easter Service",                 category: "events"   },
  { id: 8,  src: "/images/gallery8.jpg",              alt: "Bible Study Group",              category: "worship"  },
  { id: 9,  src: "/images/gallery9.jpg",              alt: "Choir Rehearsal",                category: "worship"  },
  { id: 10, src: "/images/gallery10.jpg",             alt: "Community Service Day",          category: "outreach" },
  { id: 11, src: "/images/gallery11.jpg",             alt: "Church Fellowship",              category: "events"   },
  { id: 12, src: "/images/gallery12.jpg",             alt: "New Year Thanksgiving Service",  category: "events"   },
  { id: 13, src: "/assets/media/praise-ministry.jpg", alt: "Praise and Worship Team",        category: "worship"  },
  { id: 14, src: "/assets/media/youth-ministry.jpg",  alt: "Youth Ministry Gathering",       category: "youth"    },
  { id: 15, src: "/assets/media/mens-ministry.jpg",   alt: "Men's Ministry",                 category: "ministry" },
  { id: 16, src: "/assets/media/mission-local.jpg",   alt: "Local Mission Outreach",         category: "outreach" },
  { id: 17, src: "/assets/media/mission-church.jpg",  alt: "Church Missions",                category: "outreach" },
  { id: 18, src: "/assets/media/mission-global.jpg",  alt: "Global Mission Work",            category: "outreach" },
  { id: 19, src: "/assets/events/womens-sunday.jpg",  alt: "Women's Ministry Sunday",        category: "ministry" },
];

const CATEGORIES = [
  { value: "all",      label: "All"        },
  { value: "worship",  label: "Worship"    },
  { value: "youth",    label: "Youth"      },
  { value: "outreach", label: "Outreach"   },
  { value: "events",   label: "Events"     },
  { value: "ministry", label: "Ministry"   },
];

// ─── Lightbox ─────────────────────────────────────────────────────────────────

const Lightbox = ({ images, index, onClose, onNavigate }) => {
  const image = images[index];
  const total = images.length;

  const handleKey = useCallback((e) => {
    if (e.key === "Escape")     onClose();
    if (e.key === "ArrowLeft")  onNavigate("prev");
    if (e.key === "ArrowRight") onNavigate("next");
  }, [onClose, onNavigate]);

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [handleKey]);

  if (!image) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Counter */}
      <div className="absolute top-6 left-6 z-10">
        <span className="text-white/40 text-xs font-semibold uppercase tracking-wider">
          {index + 1} <span className="text-white/20">/</span> {total}
        </span>
      </div>

      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-10 w-10 h-10 border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-white/40 transition-colors"
        aria-label="Close"
      >
        <XMarkIcon className="h-5 w-5" />
      </button>

      {/* Prev */}
      <button
        onClick={(e) => { e.stopPropagation(); onNavigate("prev"); }}
        className="absolute left-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-white/40 transition-colors"
        aria-label="Previous"
      >
        <ChevronLeftIcon className="h-5 w-5" />
      </button>

      {/* Next */}
      <button
        onClick={(e) => { e.stopPropagation(); onNavigate("next"); }}
        className="absolute right-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-white/40 transition-colors"
        aria-label="Next"
      >
        <ChevronRightIcon className="h-5 w-5" />
      </button>

      {/* Image */}
      <div
        className="relative max-w-5xl max-h-[85vh] mx-20"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          key={image.id}
          src={image.src}
          alt={image.alt}
          className="max-w-full max-h-[78vh] object-contain"
          loading="eager"
        />
        {/* Caption */}
        <div className="mt-4 flex items-center gap-3">
          <div className="w-8 h-0.5 bg-brand-red flex-shrink-0" />
          <p className="text-white/60 text-sm">{image.alt}</p>
          {image.category && (
            <span className="ml-auto text-brand-red text-xs font-semibold uppercase tracking-wider flex-shrink-0">
              {image.category}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Gallery image tile ───────────────────────────────────────────────────────

const GalleryTile = ({ image, onClick }) => (
  <div
    className="relative overflow-hidden cursor-pointer group mb-3 lg:mb-4 break-inside-avoid"
    onClick={onClick}
  >
    <img
      src={image.src}
      alt={image.alt}
      className="w-full h-auto block group-hover:scale-105 transition-transform duration-500"
      loading="lazy"
      onError={(e) => { e.target.style.display = "none"; e.target.parentElement.style.display = "none"; }}
    />
    {/* Hover overlay */}
    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors duration-300 flex items-end">
      <div className="p-4 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 w-full">
        <p className="text-white text-xs font-semibold leading-snug">{image.alt}</p>
        <div className="flex items-center gap-1.5 mt-1.5">
          <MagnifyingGlassPlusIcon className="h-3.5 w-3.5 text-brand-red" />
          <span className="text-white/50 text-xs uppercase tracking-wider">View</span>
        </div>
      </div>
    </div>
  </div>
);

// ─── Main ─────────────────────────────────────────────────────────────────────

const Gallery = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [lightboxIndex,  setLightboxIndex]  = useState(null);

  const filtered = activeCategory === "all"
    ? IMAGES
    : IMAGES.filter((img) => img.category === activeCategory);

  const openLightbox = (index) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const navigate = (direction) => {
    if (lightboxIndex === null) return;
    setLightboxIndex((i) =>
      (i + (direction === "prev" ? -1 : 1) + filtered.length) % filtered.length
    );
  };

  const counts = CATEGORIES.reduce((acc, cat) => {
    acc[cat.value] = cat.value === "all"
      ? IMAGES.length
      : IMAGES.filter((i) => i.category === cat.value).length;
    return acc;
  }, {});

  return (
    <div className="bg-white">
      <Helmet>
        <title>Gallery — Victory Bible Church</title>
        <meta name="description" content="Photos from Victory Bible Church — worship services, youth events, community outreach, and church life in Kitwe." />
      </Helmet>

      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="relative bg-vbc-dark overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: "url(/assets/hero-bg.jpg)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-vbc-dark/50 to-vbc-dark" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-32 md:py-40">
          <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-6">Victory Bible Church</p>
          <h1
            className="font-black text-white leading-[0.88] mb-8"
            style={{ fontSize: "clamp(4rem, 10vw, 8rem)" }}
          >
            LIFE<br />
            <span className="text-white/20">AT</span><br />
            VBC.
          </h1>
          <p className="text-white/40 text-sm leading-relaxed max-w-sm">
            Moments from our worship services, community outreach, youth gatherings, and church life in Kitwe and beyond.
          </p>

          {/* Stats */}
          <div className="flex items-center gap-8 mt-12 pt-12 border-t border-white/10">
            <div>
              <p className="text-2xl font-black text-white">{IMAGES.length}</p>
              <p className="text-white/30 text-xs uppercase tracking-wider mt-0.5">Photos</p>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div>
              <p className="text-2xl font-black text-white">{CATEGORIES.length - 1}</p>
              <p className="text-white/30 text-xs uppercase tracking-wider mt-0.5">Collections</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Filter bar ────────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center overflow-x-auto" style={{ scrollbarWidth: "none" }}>
            {CATEGORIES.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setActiveCategory(value)}
                className={`flex-shrink-0 px-5 py-4 text-xs font-semibold uppercase tracking-wider border-b-2 transition-colors ${
                  activeCategory === value
                    ? "border-brand-red text-brand-red"
                    : "border-transparent text-gray-400 hover:text-gray-700"
                }`}
              >
                {label}
                <span className="ml-1.5 opacity-60">({counts[value]})</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Masonry grid ──────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-14">
        {filtered.length === 0 ? (
          <div className="py-28 text-center">
            <div className="w-16 h-px bg-brand-red mx-auto mb-8" />
            <p className="text-gray-400 text-sm">No photos in this collection yet.</p>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-3 lg:gap-4">
            {filtered.map((image, index) => (
              <GalleryTile
                key={image.id}
                image={image}
                onClick={() => openLightbox(index)}
              />
            ))}
          </div>
        )}
      </section>

      {/* ── Closing strip ─────────────────────────────────────────── */}
      <section className="bg-vbc-section py-16 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-2">Follow along</p>
            <p className="text-white font-black text-lg">See more on social media.</p>
            <p className="text-white/30 text-sm mt-1">We share moments from church life throughout the week.</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <a
              href="https://facebook.com/VictoryBibleChurchKitwe"
              target="_blank" rel="noopener noreferrer"
              className="inline-block border border-white/20 text-white text-xs font-semibold uppercase tracking-wider px-6 py-3 hover:bg-white/5 transition-colors"
            >
              Facebook
            </a>
            <a
              href="https://instagram.com/victorybiblechurch"
              target="_blank" rel="noopener noreferrer"
              className="inline-block bg-brand-red text-white text-xs font-semibold uppercase tracking-wider px-6 py-3 hover:bg-red-700 transition-colors"
            >
              Instagram
            </a>
          </div>
        </div>
      </section>

      {/* ── Lightbox ──────────────────────────────────────────────── */}
      {lightboxIndex !== null && (
        <Lightbox
          images={filtered}
          index={lightboxIndex}
          onClose={closeLightbox}
          onNavigate={navigate}
        />
      )}
    </div>
  );
};

export default Gallery;
