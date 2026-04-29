import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";
import {
  MagnifyingGlassIcon,
  MapPinIcon,
  UserIcon,
  ClockIcon,
  UsersIcon,
  HeartIcon,
  ChevronDownIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import JoinGroupModal from "../components/JoinGroupModal";
import { useCellGroupsQuery } from "../hooks/useCellGroupsQuery";
import { useZonesQuery } from "../hooks/useZonesQuery";
import config from "../config";
import cellGroupPlaceholder from "../assets/placeholders/default-cell-group.svg";

const API_URL = config.API_URL;

const resolveImage = (group) => {
  const src = group.imageUrl || group.image?.path;
  if (!src) return null;
  return src.startsWith("http") ? src : `${API_URL}${src}`;
};

const DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];

// ── Skeleton card ─────────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
    <div className="h-48 bg-gray-200" />
    <div className="p-5 space-y-3">
      <div className="h-4 bg-gray-200 rounded w-3/4" />
      <div className="h-3 bg-gray-100 rounded w-1/2" />
      <div className="h-3 bg-gray-100 rounded w-2/3" />
      <div className="h-9 bg-gray-200 rounded-lg mt-4" />
    </div>
  </div>
);

// ── Cell group card ───────────────────────────────────────────────────────────
const GroupCard = ({ group, zoneName, isFavorite, onToggleFavorite, onJoin }) => {
  const thumb = resolveImage(group);
  const contact = group.contact || group.leaderContact;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300 flex flex-col"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 flex-shrink-0">
        {thumb ? (
          <img
            src={thumb}
            alt={group.name}
            className="w-full h-full object-cover"
            onError={(e) => { e.target.src = cellGroupPlaceholder; e.target.onerror = null; }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <UsersIcon className="h-14 w-14 text-blue-200" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

        {/* Favorite button */}
        <button
          onClick={() => onToggleFavorite(group._id || group.id)}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/40 transition-colors"
          aria-label={isFavorite ? "Remove from favourites" : "Save to favourites"}
        >
          {isFavorite
            ? <HeartSolid className="h-4 w-4 text-red-400" />
            : <HeartIcon className="h-4 w-4 text-white" />}
        </button>

        {/* Zone badge */}
        {zoneName && (
          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-600/80 text-white backdrop-blur-sm">
            {zoneName}
          </span>
        )}

        {/* Name overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-lg font-bold text-white leading-tight">{group.name}</h3>
          {group.location && (
            <p className="flex items-center gap-1 text-xs text-white/80 mt-0.5">
              <MapPinIcon className="h-3.5 w-3.5 flex-shrink-0" />
              {group.location}
            </p>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col flex-1">
        {/* Tags */}
        {group.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {group.tags.slice(0, 4).map((tag) => (
              <span key={tag} className="px-2.5 py-0.5 rounded-full text-xs bg-gray-100 text-gray-600">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Description */}
        <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 mb-4 flex-1">
          {group.description || "A welcoming cell group for fellowship and spiritual growth."}
        </p>

        {/* Meeting info */}
        {(group.meetingDay || group.meetingTime) && (
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
            <ClockIcon className="h-4 w-4 text-blue-500 flex-shrink-0" />
            <span>
              {group.meetingDay}{group.meetingTime ? ` · ${group.meetingTime}` : ""}
            </span>
            {group.capacity && (
              <span className="ml-auto text-xs text-gray-400">{group.capacity}</span>
            )}
          </div>
        )}

        {/* Leader */}
        {group.leader && (
          <div className="flex items-center gap-2.5 py-3 border-t border-gray-100 mb-4">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <UserIcon className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Led by {group.leader}</p>
              {contact && (
                <p className="text-xs text-gray-400 truncate max-w-[180px]">{contact}</p>
              )}
            </div>
          </div>
        )}

        {/* Join button */}
        <button
          onClick={() => onJoin(group)}
          className="w-full py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors"
        >
          Join this Group
        </button>
      </div>
    </motion.div>
  );
};

// ── Main page ─────────────────────────────────────────────────────────────────
const CellGroups = () => {
  const { data: allGroups = [], isLoading: groupsLoading } = useCellGroupsQuery();
  const { data: zones = [], isLoading: zonesLoading } = useZonesQuery();

  const [search, setSearch]               = useState("");
  const [activeZone, setActiveZone]       = useState("all");
  const [activeDayFilter, setActiveDayFilter] = useState("");
  const [favorites, setFavorites]         = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [showDayFilter, setShowDayFilter] = useState(false);

  const isLoading = groupsLoading || zonesLoading;

  // Stable decorative circles (no Math.random in render)
  const circles = useMemo(() =>
    Array.from({ length: 8 }, (_, i) => ({
      width:  80 + (i * 37) % 120,
      height: 80 + (i * 53) % 120,
      left:   `${(i * 13) % 100}%`,
      top:    `${(i * 17) % 100}%`,
      delay:  i * 1.5,
      duration: 10 + (i % 4) * 5,
    })), []);

  // Zone name lookup
  const zoneNameById = useMemo(() => {
    const m = {};
    zones.forEach((z) => { m[z._id || z.id] = z.name; });
    return m;
  }, [zones]);

  // Filtered groups
  const filtered = useMemo(() => {
    const s = search.toLowerCase();
    return allGroups.filter((g) => {
      const gZoneId = g.zone?._id || g.zone?.id || g.zone || "";

      const matchZone = activeZone === "all" || String(gZoneId) === String(activeZone);
      const matchDay  = !activeDayFilter || g.meetingDay === activeDayFilter;
      const matchSearch = !s ||
        g.name?.toLowerCase().includes(s) ||
        g.location?.toLowerCase().includes(s) ||
        g.leader?.toLowerCase().includes(s) ||
        g.description?.toLowerCase().includes(s);

      return matchZone && matchDay && matchSearch;
    });
  }, [allGroups, activeZone, activeDayFilter, search]);

  const toggleFavorite = (id) =>
    setFavorites((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

  const clearFilters = () => {
    setActiveZone("all");
    setActiveDayFilter("");
    setSearch("");
  };

  const hasFilters = activeZone !== "all" || activeDayFilter || search;

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Find a Cell Group – Victory Bible Church</title>
        <meta name="description" content="Connect with a Victory Bible Church cell group near you for fellowship, growth, and community." />
      </Helmet>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden h-[70vh] min-h-[480px] rounded-b-3xl">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url(/assets/hero-bg.jpg)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/85 via-blue-800/75 to-indigo-900/80" />

        {/* Decorative circles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {circles.map((c, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white/10"
              style={{ width: c.width, height: c.height, left: c.left, top: c.top }}
              animate={{ y: [0, -30, 0], opacity: [0.1, 0.25, 0.1] }}
              transition={{ duration: c.duration, repeat: Infinity, delay: c.delay }}
            />
          ))}
        </div>

        {/* Hero content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <p className="text-blue-300 text-sm font-semibold tracking-widest uppercase mb-4">Community & Fellowship</p>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
              Find Your <span className="text-yellow-400">Cell Group</span>
            </h1>
            <p className="text-lg text-white/80 max-w-2xl mx-auto mb-8 font-light">
              Small groups that meet weekly across the city. Find one near you and grow together in faith and friendship.
            </p>

            {/* Inline search */}
            <div className="max-w-lg mx-auto relative">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, location or leader…"
                className="w-full pl-12 pr-4 py-4 rounded-2xl text-gray-900 text-sm bg-white/95 backdrop-blur-sm shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <XMarkIcon className="h-4 w-4" />
                </button>
              )}
            </div>

            <motion.div
              className="h-0.5 bg-yellow-400 mx-auto mt-8 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: 80 }}
              transition={{ delay: 0.6, duration: 0.7 }}
            />
          </motion.div>
        </div>

        {/* Scroll hint */}
        <motion.div
          className="absolute bottom-6 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity }}
        >
          <ChevronDownIcon className="h-6 w-6 text-white/50" />
        </motion.div>
      </section>

      {/* ── Zone + Day filters ── */}
      <section className="bg-white border-b border-gray-100 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-hide">
            {/* All zones pill */}
            <button
              onClick={() => setActiveZone("all")}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeZone === "all"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              All Groups
              <span className="ml-1.5 text-xs opacity-70">({allGroups.length})</span>
            </button>

            {/* Zone pills */}
            {zones.map((zone) => {
              const zId = zone._id || zone.id;
              const count = allGroups.filter((g) => {
                const gZone = g.zone?._id || g.zone?.id || g.zone;
                return String(gZone) === String(zId);
              }).length;
              return (
                <button
                  key={zId}
                  onClick={() => setActiveZone(String(zId))}
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeZone === String(zId)
                      ? "bg-blue-600 text-white shadow-sm"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {zone.name}
                  <span className="ml-1.5 text-xs opacity-70">({count})</span>
                </button>
              );
            })}

            {/* Day filter button */}
            <div className="flex-shrink-0 relative ml-auto">
              <button
                onClick={() => setShowDayFilter((p) => !p)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                  activeDayFilter
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-gray-200 text-gray-600 hover:border-gray-300"
                }`}
              >
                <ClockIcon className="h-4 w-4" />
                {activeDayFilter || "Day"}
              </button>
              {showDayFilter && (
                <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 p-3 z-50 w-48">
                  <button
                    onClick={() => { setActiveDayFilter(""); setShowDayFilter(false); }}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-500 hover:bg-gray-50"
                  >
                    Any day
                  </button>
                  {DAYS.map((d) => (
                    <button
                      key={d}
                      onClick={() => { setActiveDayFilter(d); setShowDayFilter(false); }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        activeDayFilter === d ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Groups grid ── */}
      <section className="max-w-7xl mx-auto px-4 py-10">

        {/* Results header */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-gray-500">
            {isLoading ? "Loading…" : `${filtered.length} group${filtered.length !== 1 ? "s" : ""}`}
            {activeZone !== "all" && zones.length > 0 && (
              <> in <span className="font-medium text-gray-700">{zoneNameById[activeZone]}</span></>
            )}
            {activeDayFilter && (
              <> · <span className="font-medium text-gray-700">{activeDayFilter}</span></>
            )}
          </p>
          {hasFilters && (
            <button onClick={clearFilters} className="text-sm text-blue-600 hover:underline flex items-center gap-1">
              <XMarkIcon className="h-4 w-4" />
              Clear filters
            </button>
          )}
        </div>

        {/* Skeleton */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && filtered.length === 0 && (
          <div className="text-center py-20">
            <UsersIcon className="mx-auto h-14 w-14 text-gray-200 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No groups found</h3>
            <p className="text-gray-400 mb-6 max-w-sm mx-auto">
              {hasFilters
                ? "Try removing some filters to see more results."
                : "No cell groups have been added yet. Check back soon."}
            </p>
            {hasFilters && (
              <button onClick={clearFilters}
                className="px-6 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors">
                Clear all filters
              </button>
            )}
          </div>
        )}

        {/* Grid */}
        {!isLoading && filtered.length > 0 && (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filtered.map((group) => {
                const gZoneId = group.zone?._id || group.zone?.id || group.zone || "";
                return (
                  <GroupCard
                    key={group._id || group.id}
                    group={group}
                    zoneName={zoneNameById[gZoneId] || null}
                    isFavorite={favorites.includes(group._id || group.id)}
                    onToggleFavorite={toggleFavorite}
                    onJoin={setSelectedGroup}
                  />
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </section>

      {/* ── Join modal ── */}
      <AnimatePresence>
        {selectedGroup && (
          <JoinGroupModal
            group={selectedGroup}
            onClose={() => setSelectedGroup(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default CellGroups;
