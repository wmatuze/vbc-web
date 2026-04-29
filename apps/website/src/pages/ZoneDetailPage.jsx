import { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";
import {
  MagnifyingGlassIcon,
  MapPinIcon,
  UserIcon,
  UsersIcon,
  ClockIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  XMarkIcon,
  EnvelopeIcon,
  PhoneIcon,
  HeartIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import { useZoneByIdQuery, useZoneCellGroupsQuery } from "../hooks/useZonesQuery";
import JoinGroupModal from "../components/JoinGroupModal";
import config from "../config";
import cellGroupPlaceholder from "../assets/placeholders/default-cell-group.svg";

const API_URL = config.API_URL;
const DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];

const resolveImage = (group) => {
  const src = group.imageUrl || group.image?.path;
  if (!src) return null;
  return src.startsWith("http") ? src : `${API_URL}${src}`;
};

// ── Elder card ────────────────────────────────────────────────────────────────
const ElderCard = ({ elder }) => (
  <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-white relative overflow-hidden">
    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10" />
    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-8 -mb-8" />
    <div className="relative">
      <span className="inline-block bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full mb-4 tracking-wider uppercase">
        Zone Elder
      </span>
      <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4 ring-4 ring-white/30">
        <UserIcon className="h-10 w-10 text-white/80" />
      </div>
      <h3 className="text-xl font-bold text-center mb-1">{elder?.name || "Zone Elder"}</h3>
      <p className="text-blue-200 text-sm text-center mb-5">{elder?.title || "Zone Elder"}</p>
      <div className="space-y-2">
        {elder?.contact && (
          <a href={`mailto:${elder.contact}`}
            className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors">
            <EnvelopeIcon className="h-4 w-4" />
            Send Message
          </a>
        )}
        {elder?.phone && (
          <a href={`tel:${elder.phone}`}
            className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors">
            <PhoneIcon className="h-4 w-4" />
            {elder.phone}
          </a>
        )}
      </div>
    </div>
  </div>
);

// ── Skeleton card ─────────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
    <div className="h-48 bg-gray-200" />
    <div className="p-5 space-y-3">
      <div className="h-4 bg-gray-200 rounded w-3/4" />
      <div className="h-3 bg-gray-100 rounded w-1/2" />
      <div className="h-9 bg-gray-200 rounded-xl mt-4" />
    </div>
  </div>
);

// ── Group card ────────────────────────────────────────────────────────────────
const GroupCard = ({ group, isFavorite, onToggleFavorite, onJoin }) => {
  const thumb = resolveImage(group);
  const contact = group.contact || group.leaderContact;
  const id = group._id || group.id;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300 flex flex-col"
    >
      <div className="relative h-48 flex-shrink-0 bg-gradient-to-br from-blue-50 to-indigo-50">
        {thumb ? (
          <img src={thumb} alt={group.name} className="w-full h-full object-cover"
            onError={(e) => { e.target.src = cellGroupPlaceholder; e.target.onerror = null; }} />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <UsersIcon className="h-14 w-14 text-blue-200" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

        <button onClick={() => onToggleFavorite(id)}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/40 transition-colors">
          {isFavorite
            ? <HeartSolid className="h-4 w-4 text-red-400" />
            : <HeartIcon className="h-4 w-4 text-white" />}
        </button>

        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-lg font-bold text-white leading-tight">{group.name}</h3>
          {group.location && (
            <p className="flex items-center gap-1 text-xs text-white/80 mt-0.5">
              <MapPinIcon className="h-3.5 w-3.5 flex-shrink-0" />{group.location}
            </p>
          )}
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        {group.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {group.tags.slice(0, 4).map((tag) => (
              <span key={tag} className="px-2.5 py-0.5 rounded-full text-xs bg-gray-100 text-gray-600">{tag}</span>
            ))}
          </div>
        )}

        <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 mb-4 flex-1">
          {group.description || "A welcoming cell group for fellowship and spiritual growth."}
        </p>

        {(group.meetingDay || group.meetingTime) && (
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
            <ClockIcon className="h-4 w-4 text-blue-500 flex-shrink-0" />
            {group.meetingDay}{group.meetingTime ? ` · ${group.meetingTime}` : ""}
            {group.capacity && <span className="ml-auto text-xs text-gray-400">{group.capacity}</span>}
          </div>
        )}

        {group.leader && (
          <div className="flex items-center gap-2.5 py-3 border-t border-gray-100 mb-4">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <UserIcon className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Led by {group.leader}</p>
              {contact && <p className="text-xs text-gray-400 truncate max-w-[180px]">{contact}</p>}
            </div>
          </div>
        )}

        <button onClick={() => onJoin(group)}
          className="w-full py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors">
          Join this Group
        </button>
      </div>
    </motion.div>
  );
};

// ── Main page ─────────────────────────────────────────────────────────────────
const ZoneDetailPage = () => {
  const { zoneId } = useParams();

  const { data: zone, isLoading: zoneLoading, error: zoneError } = useZoneByIdQuery(zoneId);
  const { data: cellGroups = [], isLoading: groupsLoading } = useZoneCellGroupsQuery(zoneId);

  const isLoading = zoneLoading || groupsLoading;

  const [search, setSearch]             = useState("");
  const [activeDayFilter, setActiveDayFilter] = useState("");
  const [showDayDropdown, setShowDayDropdown] = useState(false);
  const [favorites, setFavorites]       = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);

  const toggleFavorite = (id) =>
    setFavorites((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

  const filtered = useMemo(() => {
    const s = search.toLowerCase();
    return cellGroups.filter((g) => {
      const matchSearch = !s ||
        g.name?.toLowerCase().includes(s) ||
        g.location?.toLowerCase().includes(s) ||
        g.leader?.toLowerCase().includes(s) ||
        g.description?.toLowerCase().includes(s);
      const matchDay = !activeDayFilter || g.meetingDay === activeDayFilter;
      return matchSearch && matchDay;
    });
  }, [cellGroups, search, activeDayFilter]);

  const hasFilters = search || activeDayFilter;
  const clearFilters = () => { setSearch(""); setActiveDayFilter(""); };

  // ── Error / not found state ──
  if (!isLoading && (zoneError || !zone)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <UsersIcon className="mx-auto h-16 w-16 text-gray-200 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Zone Not Found</h2>
          <p className="text-gray-500 mb-6">
            {zoneError ? "There was an error loading this zone." : "This zone doesn't exist or has been removed."}
          </p>
          <Link to="/cell-groups"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors">
            <ArrowLeftIcon className="h-4 w-4" />
            Browse All Groups
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>{zone ? `${zone.name} Cell Groups` : "Loading…"} – Victory Bible Church</title>
        <meta name="description"
          content={zone ? `Explore cell groups in the ${zone.name} zone. Find a group near you for fellowship, growth, and community.` : "Loading zone information."} />
      </Helmet>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden rounded-b-3xl h-[48vh] min-h-[340px]">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url(/assets/hero-bg.jpg)" }} />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 via-blue-800/80 to-indigo-900/85" />

        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
          {isLoading ? (
            <div className="w-48 h-8 bg-white/20 rounded-xl animate-pulse" />
          ) : (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
              <Link to="/cell-groups"
                className="inline-flex items-center gap-1.5 text-blue-300 text-sm hover:text-white transition-colors mb-4">
                <ArrowLeftIcon className="h-4 w-4" />
                All Zones
              </Link>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
                {zone?.name}
              </h1>
              {zone?.location && (
                <p className="flex items-center justify-center gap-1.5 text-white/70 text-sm">
                  <MapPinIcon className="h-4 w-4" />{zone.location}
                </p>
              )}
              <motion.div className="h-0.5 bg-yellow-400 mx-auto mt-6 rounded-full"
                initial={{ width: 0 }} animate={{ width: 60 }} transition={{ delay: 0.4, duration: 0.6 }} />
            </motion.div>
          )}
        </div>

        <motion.div className="absolute bottom-6 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 6, 0] }} transition={{ duration: 1.8, repeat: Infinity }}>
          <ChevronDownIcon className="h-6 w-6 text-white/40" />
        </motion.div>
      </section>

      {/* ── Zone info + Elder ── */}
      {!isLoading && zone && (
        <section className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 py-10">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

              {/* Zone description + stats */}
              <div className="lg:col-span-2">
                {zone.description && (
                  <p className="text-gray-600 leading-relaxed mb-6">{zone.description}</p>
                )}
                <div className="grid grid-cols-2 gap-4 max-w-xs">
                  <div className="bg-blue-50 rounded-xl p-4 text-center">
                    <p className="text-3xl font-bold text-blue-600">{cellGroups.length}</p>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">Cell Groups</p>
                  </div>
                  <div className="bg-indigo-50 rounded-xl p-4 text-center">
                    <p className="text-3xl font-bold text-indigo-600">{zone.elder?.name ? "1" : "—"}</p>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">Zone Elder</p>
                  </div>
                </div>
              </div>

              {/* Elder card */}
              {zone.elder?.name && (
                <div className="lg:col-span-1">
                  <ElderCard elder={zone.elder} />
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ── Cell groups section ── */}
      <section className="max-w-7xl mx-auto px-4 py-10">

        {/* Search + Day filter */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {isLoading ? "Loading groups…" : `${filtered.length} group${filtered.length !== 1 ? "s" : ""}`}
              {activeDayFilter && <span className="font-normal text-gray-500"> · {activeDayFilter}</span>}
            </h2>
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            {/* Search */}
            <div className="relative flex-1 sm:w-64">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search groups…"
                className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <XMarkIcon className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Day filter */}
            <div className="relative flex-shrink-0">
              <button onClick={() => setShowDayDropdown((p) => !p)}
                className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-sm font-medium border transition-colors ${
                  activeDayFilter ? "border-blue-600 bg-blue-50 text-blue-700" : "border-gray-200 text-gray-600 hover:border-gray-300 bg-white"
                }`}>
                <ClockIcon className="h-4 w-4" />
                {activeDayFilter || "Day"}
              </button>
              {showDayDropdown && (
                <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 p-2 z-50 w-44">
                  <button onClick={() => { setActiveDayFilter(""); setShowDayDropdown(false); }}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-500 hover:bg-gray-50">Any day</button>
                  {DAYS.map((d) => (
                    <button key={d} onClick={() => { setActiveDayFilter(d); setShowDayDropdown(false); }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        activeDayFilter === d ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-700 hover:bg-gray-50"
                      }`}>{d}</button>
                  ))}
                </div>
              )}
            </div>

            {hasFilters && (
              <button onClick={clearFilters} className="flex items-center gap-1 px-3 py-2.5 rounded-xl text-sm text-gray-500 hover:text-gray-700 border border-gray-200 bg-white">
                <XMarkIcon className="h-4 w-4" />
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Skeletons */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && filtered.length === 0 && (
          <div className="text-center py-16">
            <UsersIcon className="mx-auto h-14 w-14 text-gray-200 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {cellGroups.length === 0 ? "No cell groups in this zone yet" : "No groups match your search"}
            </h3>
            <p className="text-gray-400 max-w-sm mx-auto mb-6">
              {cellGroups.length === 0
                ? "Check back soon — groups will appear here as they're added."
                : "Try adjusting your search or remove the day filter."}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {hasFilters && (
                <button onClick={clearFilters}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors">
                  Clear filters
                </button>
              )}
              <Link to="/cell-groups"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:border-gray-300 hover:bg-gray-50 transition-colors">
                <ArrowLeftIcon className="h-4 w-4" />
                Browse all zones
              </Link>
            </div>
          </div>
        )}

        {/* Grid */}
        {!isLoading && filtered.length > 0 && (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filtered.map((group) => (
                <GroupCard
                  key={group._id || group.id}
                  group={group}
                  isFavorite={favorites.includes(group._id || group.id)}
                  onToggleFavorite={toggleFavorite}
                  onJoin={setSelectedGroup}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Back link */}
        {!isLoading && (
          <div className="mt-12 text-center">
            <Link to="/cell-groups"
              className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition-colors">
              <ArrowLeftIcon className="h-4 w-4" />
              Back to all zones
            </Link>
          </div>
        )}
      </section>

      {/* Join modal */}
      <AnimatePresence>
        {selectedGroup && (
          <JoinGroupModal group={selectedGroup} onClose={() => setSelectedGroup(null)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ZoneDetailPage;
