import { useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import {
  MagnifyingGlassIcon,
  MapPinIcon,
  UserIcon,
  ClockIcon,
  UsersIcon,
  XMarkIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import JoinGroupModal from "../components/JoinGroupModal";
import { useCellGroupsQuery } from "../hooks/useCellGroupsQuery";
import { useZonesQuery } from "../hooks/useZonesQuery";
import config from "../config";

const API_URL = config.API_URL;

const resolveImage = (group) => {
  const src = group.imageUrl || group.image?.path;
  if (!src) return null;
  return src.startsWith("http") ? src : `${API_URL}${src}`;
};

const DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];

// ── Skeleton card ─────────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="bg-white animate-pulse">
    <div className="h-52 bg-gray-100" />
    <div className="p-6 space-y-3 border border-t-0 border-gray-100">
      <div className="h-4 bg-gray-100 rounded w-3/4" />
      <div className="h-3 bg-gray-50 rounded w-1/2" />
      <div className="h-3 bg-gray-50 rounded w-2/3" />
      <div className="h-10 bg-gray-100 mt-4" />
    </div>
  </div>
);

// ── Group card ────────────────────────────────────────────────────────────────
const GroupCard = ({ group, zoneName, onJoin }) => {
  const thumb = resolveImage(group);
  const contact = group.contact || group.leaderContact;
  const groupId = group._id || group.id;

  return (
    <div className="bg-white flex flex-col group">
      {/* Image */}
      <div className="relative h-52 overflow-hidden bg-gray-100 flex-shrink-0">
        {thumb ? (
          <img
            src={thumb}
            alt={group.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => { e.target.style.display = "none"; }}
          />
        ) : (
          <div className="w-full h-full bg-vbc-dark flex items-center justify-center">
            <UsersIcon className="h-12 w-12 text-white/10" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Zone badge */}
        {zoneName && (
          <span className="absolute top-4 left-4 px-2.5 py-1 text-xs font-semibold uppercase tracking-wider bg-brand-red text-white">
            {zoneName}
          </span>
        )}

        {/* Name + location overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-base font-black text-white leading-tight">{group.name}</h3>
          {group.location && (
            <p className="flex items-center gap-1 text-xs text-white/60 mt-1">
              <MapPinIcon className="h-3 w-3 flex-shrink-0" />
              {group.location}
            </p>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-6 border border-t-0 border-gray-100">

        {/* Meeting time */}
        {(group.meetingDay || group.meetingTime) && (
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
            <ClockIcon className="h-3.5 w-3.5 text-brand-red flex-shrink-0" />
            <span className="font-medium text-gray-700">
              {group.meetingDay}{group.meetingTime ? ` · ${group.meetingTime}` : ""}
            </span>
          </div>
        )}

        {/* Leader */}
        {group.leader && (
          <div className="flex items-center gap-2 mb-4">
            <UserIcon className="h-3.5 w-3.5 text-gray-300 flex-shrink-0" />
            <p className="text-xs text-gray-500">
              Led by <span className="font-semibold text-gray-700">{group.leader}</span>
            </p>
          </div>
        )}

        {/* Description */}
        <p className="text-xs text-gray-400 leading-relaxed line-clamp-2 flex-1 mb-5">
          {group.description || "A welcoming cell group for fellowship and spiritual growth."}
        </p>

        {/* Tags */}
        {group.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {group.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="px-2 py-0.5 text-xs bg-gray-50 text-gray-400 border border-gray-100">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Join button */}
        <button
          onClick={() => onJoin(group)}
          className="w-full py-3 text-xs font-semibold uppercase tracking-wider text-white bg-brand-red hover:bg-red-700 transition-colors"
        >
          Join This Group
        </button>
      </div>
    </div>
  );
};

// ── Main page ─────────────────────────────────────────────────────────────────
const CellGroups = () => {
  const { data: allGroups = [], isLoading: groupsLoading } = useCellGroupsQuery();
  const { data: zones = [],     isLoading: zonesLoading  } = useZonesQuery();

  const [search,          setSearch]          = useState("");
  const [activeZone,      setActiveZone]      = useState("all");
  const [activeDayFilter, setActiveDayFilter] = useState("");
  const [selectedGroup,   setSelectedGroup]   = useState(null);
  const [showDayFilter,   setShowDayFilter]   = useState(false);

  const isLoading = groupsLoading || zonesLoading;

  const zoneNameById = useMemo(() => {
    const m = {};
    zones.forEach((z) => { m[z._id || z.id] = z.name; });
    return m;
  }, [zones]);

  const filtered = useMemo(() => {
    const s = search.toLowerCase();
    return allGroups.filter((g) => {
      const gZoneId = g.zone?._id || g.zone?.id || g.zone || "";
      const matchZone   = activeZone === "all" || String(gZoneId) === String(activeZone);
      const matchDay    = !activeDayFilter || g.meetingDay === activeDayFilter;
      const matchSearch = !s ||
        g.name?.toLowerCase().includes(s) ||
        g.location?.toLowerCase().includes(s) ||
        g.leader?.toLowerCase().includes(s) ||
        g.description?.toLowerCase().includes(s);
      return matchZone && matchDay && matchSearch;
    });
  }, [allGroups, activeZone, activeDayFilter, search]);

  const clearFilters = () => { setActiveZone("all"); setActiveDayFilter(""); setSearch(""); };
  const hasFilters   = activeZone !== "all" || activeDayFilter || search;

  return (
    <div className="bg-white">
      <Helmet>
        <title>Find a Cell Group — Victory Bible Church</title>
        <meta name="description" content="Find a VBC cell group in your area. Small groups that meet weekly across Kitwe for fellowship, Bible study, and community." />
      </Helmet>

      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="relative bg-vbc-dark overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: "url(/assets/hero-bg.jpg)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-vbc-dark/60 to-vbc-dark" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-32 md:py-40">
          <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-6">Community & Fellowship</p>
          <h1
            className="font-black text-white leading-[0.88] mb-8"
            style={{ fontSize: "clamp(3.5rem, 9vw, 7rem)" }}
          >
            WHERE DO<br />
            <span className="text-white/20">YOU</span><br />
            BELONG?
          </h1>
          <p className="text-white/40 text-sm leading-relaxed max-w-md mb-12">
            Small groups meeting weekly across Kitwe — in homes, communities, and neighbourhoods. Find the one closest to you and show up.
          </p>

          {/* Search bar */}
          <div className="relative max-w-lg">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, location or leader…"
              className="w-full pl-12 pr-10 py-4 bg-white/5 border border-white/10 text-white text-sm placeholder-white/30 focus:outline-none focus:border-brand-red transition-colors"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                <XMarkIcon className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Quick stats */}
          <div className="flex items-center gap-8 mt-12 pt-12 border-t border-white/10">
            <div>
              <p className="text-2xl font-black text-white">{allGroups.length}</p>
              <p className="text-white/30 text-xs uppercase tracking-wider mt-0.5">Active Groups</p>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div>
              <p className="text-2xl font-black text-white">{zones.length}</p>
              <p className="text-white/30 text-xs uppercase tracking-wider mt-0.5">Zones</p>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div>
              <p className="text-2xl font-black text-white">7</p>
              <p className="text-white/30 text-xs uppercase tracking-wider mt-0.5">Days a Week</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Filter bar ────────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-0 overflow-x-auto" style={{ scrollbarWidth: "none" }}>

            {/* All */}
            <button
              onClick={() => setActiveZone("all")}
              className={`flex-shrink-0 px-5 py-4 text-xs font-semibold uppercase tracking-wider border-b-2 transition-colors ${
                activeZone === "all"
                  ? "border-brand-red text-brand-red"
                  : "border-transparent text-gray-400 hover:text-gray-700"
              }`}
            >
              All
              <span className="ml-1.5 opacity-60">({allGroups.length})</span>
            </button>

            {/* Zone tabs */}
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
                  className={`flex-shrink-0 px-5 py-4 text-xs font-semibold uppercase tracking-wider border-b-2 transition-colors ${
                    activeZone === String(zId)
                      ? "border-brand-red text-brand-red"
                      : "border-transparent text-gray-400 hover:text-gray-700"
                  }`}
                >
                  {zone.name}
                  <span className="ml-1.5 opacity-60">({count})</span>
                </button>
              );
            })}

            {/* Day filter */}
            <div className="flex-shrink-0 relative ml-auto pl-4">
              <button
                onClick={() => setShowDayFilter((p) => !p)}
                className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold uppercase tracking-wider border transition-colors my-2 ${
                  activeDayFilter
                    ? "border-brand-red text-brand-red"
                    : "border-gray-200 text-gray-400 hover:border-gray-300 hover:text-gray-600"
                }`}
              >
                <ClockIcon className="h-3.5 w-3.5" />
                {activeDayFilter || "Day"}
                <ChevronDownIcon className="h-3 w-3" />
              </button>
              {showDayFilter && (
                <div className="absolute right-0 top-full bg-white shadow-xl border border-gray-100 z-50 w-44 py-1">
                  <button
                    onClick={() => { setActiveDayFilter(""); setShowDayFilter(false); }}
                    className="w-full text-left px-4 py-2.5 text-xs text-gray-400 hover:bg-gray-50 hover:text-gray-700"
                  >
                    Any day
                  </button>
                  {DAYS.map((d) => (
                    <button
                      key={d}
                      onClick={() => { setActiveDayFilter(d); setShowDayFilter(false); }}
                      className={`w-full text-left px-4 py-2.5 text-xs transition-colors ${
                        activeDayFilter === d
                          ? "bg-brand-red/5 text-brand-red font-semibold"
                          : "text-gray-600 hover:bg-gray-50"
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
      </div>

      {/* ── Groups grid ───────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-14">

        {/* Results bar */}
        <div className="flex items-center justify-between mb-8">
          <p className="text-xs text-gray-400 uppercase tracking-wider">
            {isLoading ? "Loading…" : (
              <>
                <span className="text-gray-900 font-bold">{filtered.length}</span>
                {" "}group{filtered.length !== 1 ? "s" : ""}
                {activeZone !== "all" && zones.length > 0 && (
                  <> · <span className="text-gray-600">{zoneNameById[activeZone]}</span></>
                )}
                {activeDayFilter && (
                  <> · <span className="text-gray-600">{activeDayFilter}</span></>
                )}
              </>
            )}
          </p>
          {hasFilters && (
            <button onClick={clearFilters} className="flex items-center gap-1 text-xs text-brand-red hover:text-red-700 font-semibold uppercase tracking-wider">
              <XMarkIcon className="h-3.5 w-3.5" />
              Clear filters
            </button>
          )}
        </div>

        {/* Skeleton */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-100">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && filtered.length === 0 && (
          <div className="py-28 text-center">
            <div className="w-16 h-px bg-brand-red mx-auto mb-8" />
            <h3 className="text-xl font-black text-gray-900 mb-3">No groups found</h3>
            <p className="text-gray-400 text-sm mb-8 max-w-sm mx-auto">
              {hasFilters
                ? "Try removing some filters to see more results."
                : "No cell groups have been added yet. Check back soon."}
            </p>
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-2 bg-brand-red text-white text-xs font-semibold uppercase tracking-wider px-6 py-3 hover:bg-red-700 transition-colors"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}

        {/* Grid */}
        {!isLoading && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-100">
            {filtered.map((group) => {
              const gZoneId = group.zone?._id || group.zone?.id || group.zone || "";
              return (
                <GroupCard
                  key={group._id || group.id}
                  group={group}
                  zoneName={zoneNameById[gZoneId] || null}
                  onJoin={setSelectedGroup}
                />
              );
            })}
          </div>
        )}
      </section>

      {/* ── What is a Cell Group? ──────────────────────────────────── */}
      <section className="bg-vbc-section py-24">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-4">What is a cell group?</p>
            <h2
              className="font-black text-white leading-[0.88] mb-8"
              style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)" }}
            >
              CHURCH IN<br />YOUR<br />STREET.
            </h2>
            <p className="text-white/50 text-sm leading-relaxed max-w-sm">
              Cell groups are small gatherings — 8 to 15 people — that meet weekly in homes and community spaces across Kitwe. Bible study, prayer, and real friendship. The big church on Sunday is strengthened by what happens in living rooms through the week.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-px bg-white/5">
            {[
              { num: "01", title: "Study Together",  body: "Each week the group goes deeper into Scripture — asking questions the Sunday sermon doesn't have time for." },
              { num: "02", title: "Pray Together",   body: "Real needs, real names, real prayer. Cell groups carry each other through the hard weeks." },
              { num: "03", title: "Grow Together",   body: "Accountability, honesty, and the kind of friendship that only forms when you keep showing up." },
            ].map(({ num, title, body }) => (
              <div key={num} className="bg-vbc-section flex items-start gap-6 px-8 py-7">
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

      {/* ── Join modal ────────────────────────────────────────────── */}
      {selectedGroup && (
        <JoinGroupModal
          group={selectedGroup}
          onClose={() => setSelectedGroup(null)}
        />
      )}
    </div>
  );
};

export default CellGroups;
