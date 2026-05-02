import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  MagnifyingGlassIcon,
  MapPinIcon,
  UserIcon,
  UsersIcon,
  ArrowRightIcon,
  XMarkIcon,
  BuildingOfficeIcon,
} from "@heroicons/react/24/outline";
import { useZonesQuery } from "../hooks/useZonesQuery";
import { useCellGroupsQuery } from "../hooks/useCellGroupsQuery";

// ── Skeleton ──────────────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="bg-white animate-pulse border border-gray-100">
    <div className="p-8 space-y-4">
      <div className="h-3 bg-gray-100 w-10" />
      <div className="h-5 bg-gray-100 w-2/3" />
      <div className="h-3 bg-gray-100 w-1/2" />
      <div className="h-10 bg-gray-100 mt-6" />
    </div>
  </div>
);

// ── Zone card ─────────────────────────────────────────────────────────────────
const ZoneCard = ({ zone, groupCount, index }) => {
  const zoneId = zone._id || zone.id;
  const num = String(index + 1).padStart(2, "0");

  return (
    <Link
      to={`/cell-groups/${zoneId}`}
      className="bg-white group relative overflow-hidden flex flex-col hover:bg-gray-50 transition-colors border border-gray-100"
    >
      {/* Ghost number */}
      <p
        className="absolute -bottom-4 -right-2 font-black text-gray-900 select-none leading-none pointer-events-none"
        style={{ fontSize: "clamp(6rem, 10vw, 9rem)", opacity: 0.04 }}
      >
        {num}
      </p>

      <div className="p-8 flex flex-col flex-1 relative">
        <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-2">{num}</p>
        <div className="w-8 h-0.5 bg-brand-red mb-5 group-hover:w-14 transition-all duration-300" />

        <h3 className="text-xl font-black text-gray-900 mb-2">{zone.name}</h3>

        {zone.location && (
          <p className="flex items-center gap-1.5 text-xs text-gray-400 mb-4">
            <MapPinIcon className="h-3.5 w-3.5 flex-shrink-0" />
            {zone.location}
          </p>
        )}

        {zone.description && (
          <p className="text-xs text-gray-400 leading-relaxed line-clamp-2 mb-5">
            {zone.description}
          </p>
        )}

        <div className="mt-auto space-y-2">
          {zone.elder?.name && (
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <UserIcon className="h-3.5 w-3.5 text-gray-300 flex-shrink-0" />
              <span>{zone.elder.title || "Zone Elder"}: <span className="font-semibold text-gray-700">{zone.elder.name}</span></span>
            </div>
          )}
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <UsersIcon className="h-3.5 w-3.5 text-gray-300 flex-shrink-0" />
            <span><span className="font-bold text-gray-900">{groupCount}</span> cell group{groupCount !== 1 ? "s" : ""}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-6 text-xs font-semibold uppercase tracking-wider text-brand-red group-hover:gap-3 transition-all duration-200">
          Explore Zone
          <ArrowRightIcon className="h-3.5 w-3.5" />
        </div>
      </div>
    </Link>
  );
};

// ── Main ──────────────────────────────────────────────────────────────────────
const ZonesPage = () => {
  const [search, setSearch] = useState("");

  const { data: zones = [],     isLoading: zonesLoading  } = useZonesQuery();
  const { data: allGroups = [], isLoading: groupsLoading } = useCellGroupsQuery();

  const isLoading = zonesLoading || groupsLoading;

  const groupCountByZone = useMemo(() => {
    const counts = {};
    allGroups.forEach((g) => {
      const zoneId = g.zone?._id || g.zone?.id || g.zone;
      if (zoneId) counts[String(zoneId)] = (counts[String(zoneId)] || 0) + 1;
    });
    return counts;
  }, [allGroups]);

  const filtered = useMemo(() => {
    if (!search) return zones;
    const s = search.toLowerCase();
    return zones.filter(
      (z) =>
        z.name?.toLowerCase().includes(s) ||
        z.location?.toLowerCase().includes(s) ||
        z.description?.toLowerCase().includes(s) ||
        z.elder?.name?.toLowerCase().includes(s),
    );
  }, [zones, search]);

  return (
    <div className="bg-white">
      <Helmet>
        <title>Cell Groups — Victory Bible Church</title>
        <meta name="description" content="Find a VBC cell group near you. Browse our zones and connect with a small group meeting in your area every week." />
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
            Our church is organised into zones across Kitwe — each led by a dedicated elder, each carrying a cluster of small groups meeting weekly in homes and neighbourhoods. Find yours.
          </p>

          {/* Search */}
          <div className="relative max-w-lg">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search zones, elders, or locations…"
              className="w-full pl-12 pr-10 py-4 bg-white/5 border border-white/10 text-white text-sm placeholder-white/30 focus:outline-none focus:border-brand-red transition-colors"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                <XMarkIcon className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Stats */}
          <div className="flex items-center gap-8 mt-12 pt-12 border-t border-white/10">
            <div>
              <p className="text-2xl font-black text-white">{zones.length}</p>
              <p className="text-white/30 text-xs uppercase tracking-wider mt-0.5">Zones</p>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div>
              <p className="text-2xl font-black text-white">{allGroups.length}</p>
              <p className="text-white/30 text-xs uppercase tracking-wider mt-0.5">Cell Groups</p>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div>
              <p className="text-2xl font-black text-white">7</p>
              <p className="text-white/30 text-xs uppercase tracking-wider mt-0.5">Days a Week</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Zones grid ────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-16">

        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider">
              {isLoading ? "Loading…" : (
                <><span className="text-gray-900 font-bold">{filtered.length}</span> zone{filtered.length !== 1 ? "s" : ""}</>
              )}
            </p>
          </div>
          {search && (
            <button onClick={() => setSearch("")} className="flex items-center gap-1 text-xs text-brand-red hover:text-red-700 font-semibold uppercase tracking-wider">
              <XMarkIcon className="h-3.5 w-3.5" />
              Clear
            </button>
          )}
        </div>

        {/* Skeleton */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-100">
            {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* Empty */}
        {!isLoading && filtered.length === 0 && (
          <div className="py-28 text-center">
            <div className="w-16 h-px bg-brand-red mx-auto mb-8" />
            <h3 className="text-xl font-black text-gray-900 mb-3">
              {zones.length === 0 ? "No zones yet" : "No zones match your search"}
            </h3>
            <p className="text-gray-400 text-sm max-w-sm mx-auto mb-6">
              {zones.length === 0
                ? "Zones will appear here once they've been added by the church admin."
                : "Try a different search term."}
            </p>
            {search && (
              <button onClick={() => setSearch("")}
                className="inline-block bg-brand-red text-white text-xs font-semibold uppercase tracking-wider px-6 py-3 hover:bg-red-700 transition-colors">
                Clear search
              </button>
            )}
          </div>
        )}

        {/* Grid */}
        {!isLoading && filtered.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-100">
            {filtered.map((zone, i) => (
              <ZoneCard
                key={zone._id || zone.id}
                zone={zone}
                groupCount={groupCountByZone[String(zone._id || zone.id)] || 0}
                index={i}
              />
            ))}
          </div>
        )}
      </section>

      {/* ── What is a cell group ───────────────────────────────────── */}
      <section className="bg-vbc-section py-24">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-4">What is a cell group?</p>
            <h2
              className="font-black text-white leading-[0.9] mb-8"
              style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)" }}
            >
              CHURCH IN<br />YOUR<br />STREET.
            </h2>
            <p className="text-white/50 text-sm leading-relaxed max-w-sm">
              Cell groups are small gatherings — 8 to 15 people — meeting weekly in homes and communities across Kitwe. Bible study, prayer, and real friendship. The big church on Sunday is strengthened by what happens in living rooms through the week.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-px bg-white/5">
            {[
              { num: "01", title: "Study Together",  body: "Each week the group goes deeper into Scripture — asking the questions Sunday doesn't have time for." },
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
    </div>
  );
};

export default ZonesPage;
