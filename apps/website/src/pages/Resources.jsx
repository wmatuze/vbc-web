import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  MagnifyingGlassIcon,
  XMarkIcon,
  ArrowDownTrayIcon,
  EyeIcon,
  ChevronDownIcon,
  ArrowRightIcon,
  BookOpenIcon,
  UserGroupIcon,
  AcademicCapIcon,
  DocumentTextIcon,
  VideoCameraIcon,
  MusicalNoteIcon,
  LinkIcon,
  PhotoIcon,
  StarIcon,
  RectangleStackIcon,
  FunnelIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarSolid } from "@heroicons/react/24/solid";

// ─── Static config ────────────────────────────────────────────────────────────

const PROGRAMS = [
  {
    num: "01",
    path: "/foundation-classes",
    title: "Foundation Classes",
    desc: "Core beliefs, doctrines, and the foundations of the Christian faith.",
    Icon: BookOpenIcon,
  },
  {
    num: "02",
    path: "/discipleship-classes",
    title: "Discipleship Classes",
    desc: "Structured growth in your personal walk with Christ.",
    Icon: AcademicCapIcon,
  },
  {
    num: "03",
    path: "/resources/leadership-training",
    title: "Leadership Training",
    desc: "Equipping men and women to lead with integrity and purpose.",
    Icon: UserGroupIcon,
  },
  {
    num: "04",
    path: "/resources/bible-study",
    title: "Bible Study Guides",
    desc: "Structured scripture exploration for individuals and groups.",
    Icon: BookOpenIcon,
  },
];

const CATEGORIES = [
  { value: "",               label: "All"           },
  { value: "foundation",     label: "Foundation"    },
  { value: "discipleship",   label: "Discipleship"  },
  { value: "leadership",     label: "Leadership"    },
  { value: "bible_study",    label: "Bible Study"   },
  { value: "ministry",       label: "Ministry"      },
  { value: "audio_sermons",  label: "Audio Sermons" },
  { value: "worship",        label: "Worship"       },
  { value: "general",        label: "General"       },
];

const TYPES = [
  { value: "",               label: "All Types"      },
  { value: "document",       label: "Documents"      },
  { value: "audio",          label: "Audio"          },
  { value: "video",          label: "Video"          },
  { value: "presentation",   label: "Presentations"  },
  { value: "image",          label: "Images"         },
  { value: "link",           label: "Links"          },
];

const TYPE_META = {
  document:     { Icon: DocumentTextIcon,  label: "PDF / Doc"    },
  audio:        { Icon: MusicalNoteIcon,   label: "Audio"        },
  video:        { Icon: VideoCameraIcon,   label: "Video"        },
  presentation: { Icon: RectangleStackIcon,label: "Slides"       },
  image:        { Icon: PhotoIcon,         label: "Image"        },
  link:         { Icon: LinkIcon,          label: "Link"         },
};

// ─── Skeleton card ────────────────────────────────────────────────────────────

const SkeletonCard = () => (
  <div className="bg-white animate-pulse border border-gray-100">
    <div className="p-6 space-y-3">
      <div className="h-3 bg-gray-100 w-16" />
      <div className="h-5 bg-gray-100 w-3/4" />
      <div className="h-3 bg-gray-100 w-full" />
      <div className="h-3 bg-gray-100 w-2/3" />
      <div className="h-10 bg-gray-100 mt-4" />
    </div>
  </div>
);

// ─── Resource card ────────────────────────────────────────────────────────────

const ResourceCard = ({ resource }) => {
  const meta = TYPE_META[resource.type] || { Icon: DocumentTextIcon, label: resource.type };
  const { Icon: TypeIcon } = meta;
  const isLink = resource.type === "link";

  const handleAction = (e) => {
    e.preventDefault();
    if (resource.isDownloadable) {
      window.open(`/api/resources/${resource._id}/download`, "_blank");
    } else if (resource.url) {
      window.open(resource.url, "_blank");
    }
  };

  const categoryLabel = resource.category?.replace("_", " ") || "";

  return (
    <div className="bg-white flex flex-col group border border-gray-100 hover:border-gray-200 transition-colors">
      <div className="p-6 flex flex-col flex-1">

        {/* Top row: type badge + featured */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1.5 text-xs text-gray-400 uppercase tracking-wider">
            <TypeIcon className="h-3.5 w-3.5 text-brand-red flex-shrink-0" />
            {meta.label}
          </div>
          {resource.featured && (
            <StarSolid className="h-3.5 w-3.5 text-brand-red flex-shrink-0" title="Featured" />
          )}
        </div>

        {/* Category eyebrow */}
        {categoryLabel && (
          <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.15em] mb-2">
            {categoryLabel}
          </p>
        )}

        {/* Title */}
        <h3 className="text-gray-900 font-black text-base leading-snug mb-3 group-hover:text-brand-red transition-colors">
          {resource.title}
        </h3>

        {/* Description */}
        {resource.description && (
          <p className="text-gray-400 text-xs leading-relaxed line-clamp-2 flex-1 mb-4">
            {resource.description}
          </p>
        )}

        {/* Tags */}
        {resource.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {resource.tags.slice(0, 4).map((tag, i) => (
              <span key={i} className="px-2 py-0.5 text-xs bg-gray-50 text-gray-400 border border-gray-100">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center gap-4 text-xs text-gray-300 mb-5">
          {resource.views > 0 && (
            <span className="flex items-center gap-1">
              <EyeIcon className="h-3 w-3" />
              {resource.views.toLocaleString()}
            </span>
          )}
          {resource.downloads > 0 && (
            <span className="flex items-center gap-1">
              <ArrowDownTrayIcon className="h-3 w-3" />
              {resource.downloads.toLocaleString()}
            </span>
          )}
          {resource.fileSizeFormatted && (
            <span>{resource.fileSizeFormatted}</span>
          )}
          {resource.author?.name && (
            <span className="ml-auto truncate max-w-[120px]">{resource.author.name}</span>
          )}
        </div>

        {/* Action button */}
        <button
          onClick={handleAction}
          className="w-full py-3 flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-white bg-brand-red hover:bg-red-700 transition-colors mt-auto"
        >
          {isLink ? (
            <><EyeIcon className="h-3.5 w-3.5" /> View Resource</>
          ) : (
            <><ArrowDownTrayIcon className="h-3.5 w-3.5" /> Download</>
          )}
        </button>
      </div>
    </div>
  );
};

// ─── Featured card (larger, for hero-style feature) ──────────────────────────

const FeaturedCard = ({ resource, index }) => {
  const meta = TYPE_META[resource.type] || { Icon: DocumentTextIcon, label: resource.type };
  const { Icon: TypeIcon } = meta;
  const num = String(index + 1).padStart(2, "0");

  const handleAction = (e) => {
    e.preventDefault();
    if (resource.isDownloadable) {
      window.open(`/api/resources/${resource._id}/download`, "_blank");
    } else if (resource.url) {
      window.open(resource.url, "_blank");
    }
  };

  return (
    <div className="bg-vbc-dark p-8 relative overflow-hidden group flex flex-col">
      {/* Ghost number */}
      <p
        className="absolute -bottom-4 -right-2 font-black text-white select-none leading-none pointer-events-none"
        style={{ fontSize: "clamp(5rem, 8vw, 7rem)", opacity: 0.04 }}
      >
        {num}
      </p>

      <div className="flex items-center gap-2 mb-4">
        <TypeIcon className="h-4 w-4 text-brand-red flex-shrink-0" />
        <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em]">
          {resource.category?.replace("_", " ") || meta.label}
        </p>
        <StarSolid className="h-3 w-3 text-brand-red ml-auto flex-shrink-0" />
      </div>

      <div className="w-8 h-0.5 bg-brand-red mb-5 group-hover:w-14 transition-all duration-300" />

      <h3 className="text-white font-black text-lg leading-snug mb-3 flex-1">
        {resource.title}
      </h3>

      {resource.description && (
        <p className="text-white/40 text-xs leading-relaxed line-clamp-2 mb-6">
          {resource.description}
        </p>
      )}

      <button
        onClick={handleAction}
        className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-red hover:text-white transition-colors group/btn"
      >
        {resource.type === "link" ? "View Resource" : "Download"}
        <ArrowRightIcon className="h-3.5 w-3.5 group-hover/btn:translate-x-1 transition-transform" />
      </button>
    </div>
  );
};

// ─── Main page ────────────────────────────────────────────────────────────────

const Resources = () => {
  const [resources,         setResources]         = useState([]);
  const [featuredResources, setFeaturedResources] = useState([]);
  const [loading,           setLoading]           = useState(true);
  const [error,             setError]             = useState(false);
  const [searchTerm,        setSearchTerm]        = useState("");
  const [selectedCategory,  setSelectedCategory]  = useState("");
  const [selectedType,      setSelectedType]      = useState("");
  const [showTypeFilter,    setShowTypeFilter]    = useState(false);

  const hasFilters = searchTerm || selectedCategory || selectedType;

  // Fetch featured on mount
  useEffect(() => {
    fetch("/api/resources/featured/list")
      .then((r) => r.json())
      .then((d) => { if (d.success) setFeaturedResources(d.data); })
      .catch(() => {});
  }, []);

  // Debounced fetch for search/filter changes
  useEffect(() => {
    setLoading(true);
    setError(false);
    const params = new URLSearchParams();
    if (searchTerm)       params.append("search",   searchTerm);
    if (selectedCategory) params.append("category", selectedCategory);
    if (selectedType)     params.append("type",     selectedType);

    const timer = setTimeout(() => {
      fetch(`/api/resources?${params}`)
        .then((r) => r.json())
        .then((d) => { if (d.success) setResources(d.data); })
        .catch(() => setError(true))
        .finally(() => setLoading(false));
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, selectedCategory, selectedType]);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setSelectedType("");
  };

  return (
    <div className="bg-white">
      <Helmet>
        <title>Resources — Victory Bible Church</title>
        <meta name="description" content="Access foundation class materials, discipleship guides, leadership resources, Bible study tools, and more at Victory Bible Church." />
      </Helmet>

      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="relative bg-vbc-dark overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: "url(/assets/hero-bg.jpg)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-vbc-dark/60 to-vbc-dark" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-32 md:py-40">
          <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-6">Church Library</p>
          <h1
            className="font-black text-white leading-[0.88] mb-8"
            style={{ fontSize: "clamp(3.5rem, 9vw, 7rem)" }}
          >
            GROW.<br />
            <span className="text-white/20">STUDY.</span><br />
            LEAD.
          </h1>
          <p className="text-white/40 text-sm leading-relaxed max-w-md mb-12">
            Every resource you need to go deeper — foundation materials, discipleship guides, leadership tools, Bible studies, and more. All in one place.
          </p>

          {/* Search */}
          <div className="relative max-w-xl">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search resources, guides, studies…"
              className="w-full pl-12 pr-10 py-4 bg-white/5 border border-white/10 text-white text-sm placeholder-white/30 focus:outline-none focus:border-brand-red transition-colors"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                <XMarkIcon className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ── Programs nav ──────────────────────────────────────────── */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12">
            <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-3">Start here</p>
            <h2 className="text-4xl font-black text-gray-900 leading-tight">Our programmes.</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-gray-100">
            {PROGRAMS.map(({ num, path, title, desc, Icon }) => (
              <Link
                key={num}
                to={path}
                className="bg-white px-8 py-10 group relative overflow-hidden flex flex-col hover:bg-gray-50 transition-colors"
              >
                <Icon
                  className="absolute -bottom-3 -right-3 text-gray-900 pointer-events-none"
                  style={{ width: "6rem", height: "6rem", opacity: 0.04 }}
                  strokeWidth={1}
                />
                <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-2">{num}</p>
                <div className="w-8 h-0.5 bg-brand-red mb-5 group-hover:w-14 transition-all duration-300" />
                <h3 className="text-lg font-black text-gray-900 mb-3 group-hover:text-brand-red transition-colors">{title}</h3>
                <p className="text-gray-400 text-xs leading-relaxed flex-1 mb-5">{desc}</p>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-red opacity-0 group-hover:opacity-100 transition-opacity">
                  Explore <ArrowRightIcon className="h-3.5 w-3.5" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured resources ────────────────────────────────────── */}
      {featuredResources.length > 0 && (
        <section className="bg-vbc-section py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-12">
              <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-3">Handpicked</p>
              <h2 className="text-4xl font-black text-white leading-tight">Featured resources.</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5">
              {featuredResources.slice(0, 6).map((resource, i) => (
                <FeaturedCard key={resource._id} resource={resource} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Filter bar ────────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-0 overflow-x-auto" style={{ scrollbarWidth: "none" }}>

            {/* Category tabs */}
            {CATEGORIES.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setSelectedCategory(value)}
                className={`flex-shrink-0 px-4 py-4 text-xs font-semibold uppercase tracking-wider border-b-2 transition-colors ${
                  selectedCategory === value
                    ? "border-brand-red text-brand-red"
                    : "border-transparent text-gray-400 hover:text-gray-700"
                }`}
              >
                {label}
              </button>
            ))}

            {/* Type dropdown */}
            <div className="flex-shrink-0 relative ml-auto pl-4">
              <button
                onClick={() => setShowTypeFilter((p) => !p)}
                className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold uppercase tracking-wider border transition-colors my-2 ${
                  selectedType
                    ? "border-brand-red text-brand-red"
                    : "border-gray-200 text-gray-400 hover:border-gray-300 hover:text-gray-600"
                }`}
              >
                <FunnelIcon className="h-3.5 w-3.5" />
                {TYPES.find((t) => t.value === selectedType)?.label || "Type"}
                <ChevronDownIcon className="h-3 w-3" />
              </button>
              {showTypeFilter && (
                <div className="absolute right-0 top-full bg-white shadow-xl border border-gray-100 z-50 w-44 py-1">
                  {TYPES.map(({ value, label }) => (
                    <button
                      key={value}
                      onClick={() => { setSelectedType(value); setShowTypeFilter(false); }}
                      className={`w-full text-left px-4 py-2.5 text-xs transition-colors ${
                        selectedType === value
                          ? "bg-brand-red/5 text-brand-red font-semibold"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Resources grid ────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-14">

        {/* Results bar */}
        <div className="flex items-center justify-between mb-8">
          <p className="text-xs text-gray-400 uppercase tracking-wider">
            {loading ? "Loading…" : (
              <><span className="text-gray-900 font-bold">{resources.length}</span> resource{resources.length !== 1 ? "s" : ""}</>
            )}
          </p>
          {hasFilters && (
            <button onClick={clearFilters} className="flex items-center gap-1 text-xs text-brand-red hover:text-red-700 font-semibold uppercase tracking-wider">
              <XMarkIcon className="h-3.5 w-3.5" />
              Clear filters
            </button>
          )}
        </div>

        {/* Skeletons */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-100">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="py-28 text-center">
            <div className="w-16 h-px bg-brand-red mx-auto mb-8" />
            <h3 className="text-xl font-black text-gray-900 mb-3">Could not load resources</h3>
            <p className="text-gray-400 text-sm mb-8">Please check your connection and try again.</p>
            <button
              onClick={() => { setError(false); setLoading(true); }}
              className="inline-flex items-center gap-2 bg-brand-red text-white text-xs font-semibold uppercase tracking-wider px-6 py-3 hover:bg-red-700 transition-colors"
            >
              <ArrowPathIcon className="h-3.5 w-3.5" />
              Retry
            </button>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && resources.length === 0 && (
          <div className="py-28 text-center">
            <div className="w-16 h-px bg-brand-red mx-auto mb-8" />
            <h3 className="text-xl font-black text-gray-900 mb-3">No resources found</h3>
            <p className="text-gray-400 text-sm mb-8 max-w-sm mx-auto">
              {hasFilters ? "Try adjusting your filters or search term." : "No resources have been uploaded yet. Check back soon."}
            </p>
            {hasFilters && (
              <button onClick={clearFilters}
                className="inline-block bg-brand-red text-white text-xs font-semibold uppercase tracking-wider px-6 py-3 hover:bg-red-700 transition-colors">
                Clear filters
              </button>
            )}
          </div>
        )}

        {/* Grid */}
        {!loading && !error && resources.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-100">
            {resources.map((resource) => (
              <ResourceCard key={resource._id} resource={resource} />
            ))}
          </div>
        )}
      </section>

      {/* ── What's here ───────────────────────────────────────────── */}
      <section className="bg-vbc-section py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-4">What you'll find</p>
            <h2
              className="font-black text-white leading-[0.9] mb-8"
              style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)" }}
            >
              EVERYTHING<br />YOU NEED<br />TO GO DEEPER.
            </h2>
            <p className="text-white/50 text-sm leading-relaxed max-w-sm">
              From your first steps in the faith to advanced leadership development — our library is built to serve every believer at every stage of the journey.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-px bg-white/5">
            {[
              { num: "01", title: "Teaching Materials",  body: "Notes, slides, and structured guides from our Foundation and Discipleship programmes." },
              { num: "02", title: "Audio & Video",       body: "Recorded sessions, sermon series, and worship resources available to download or stream." },
              { num: "03", title: "Bible Study Tools",   body: "Verse-by-verse guides, topical studies, and small group workbooks for personal or group use." },
              { num: "04", title: "Leadership Resources",body: "Practical tools, books, and training materials for those serving in ministry roles." },
            ].map(({ num, title, body }) => (
              <div key={num} className="bg-vbc-section flex items-start gap-6 px-8 py-6">
                <p className="text-brand-red text-xs font-black font-mono flex-shrink-0 mt-0.5">{num}</p>
                <div>
                  <p className="text-white font-bold text-sm mb-1">{title}</p>
                  <p className="text-white/40 text-xs leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Resources;
