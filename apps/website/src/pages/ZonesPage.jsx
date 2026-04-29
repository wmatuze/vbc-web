import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
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

// ── Skeleton card ─────────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
    <div className="h-44 bg-gray-200" />
    <div className="p-5 space-y-3">
      <div className="h-4 bg-gray-200 rounded w-2/3" />
      <div className="h-3 bg-gray-100 rounded w-1/2" />
      <div className="h-3 bg-gray-100 rounded w-3/4" />
      <div className="h-10 bg-gray-200 rounded-xl mt-4" />
    </div>
  </div>
);

// ── Zone card ─────────────────────────────────────────────────────────────────
const ZoneCard = ({ zone, groupCount, index }) => {
  const zoneId = zone._id || zone.id;

  // Colour palette for zone header bars (cycles through 6 colours)
  const colours = [
    "from-blue-600 to-blue-700",
    "from-indigo-600 to-indigo-700",
    "from-purple-600 to-purple-700",
    "from-teal-600 to-teal-700",
    "from-sky-600 to-sky-700",
    "from-violet-600 to-violet-700",
  ];
  const colour = colours[index % colours.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300 flex flex-col"
    >
      {/* Colour header */}
      <div className={`h-2 bg-gradient-to-r ${colour}`} />

      <div className="p-6 flex flex-col flex-1">
        {/* Zone name + location */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-1">{zone.name}</h3>
          {zone.location && (
            <p className="flex items-center gap-1.5 text-sm text-gray-500">
              <MapPinIcon className="h-4 w-4 flex-shrink-0 text-blue-500" />
              {zone.location}
            </p>
          )}
        </div>

        {/* Description */}
        {zone.description && (
          <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 mb-5">
            {zone.description}
          </p>
        )}

        {/* Elder info */}
        {zone.elder?.name && (
          <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 mb-5">
            <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <UserIcon className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">{zone.elder.name}</p>
              <p className="text-xs text-gray-500">{zone.elder.title || "Zone Elder"}</p>
            </div>
          </div>
        )}

        {/* Group count */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-5">
          <UsersIcon className="h-4 w-4 text-blue-500" />
          <span>
            <strong className="text-gray-900">{groupCount}</strong> cell group{groupCount !== 1 ? "s" : ""}
          </span>
        </div>

        {/* CTA */}
        <Link
          to={`/cell-groups/${zoneId}`}
          className={`mt-auto w-full py-3 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r ${colour} hover:opacity-90 transition-opacity flex items-center justify-center gap-2`}
        >
          View Cell Groups
          <ArrowRightIcon className="h-4 w-4" />
        </Link>
      </div>
    </motion.div>
  );
};

// ── Main page ─────────────────────────────────────────────────────────────────
const ZonesPage = () => {
  const [search, setSearch] = useState("");

  const { data: zones = [], isLoading: zonesLoading } = useZonesQuery();
  const { data: allGroups = [], isLoading: groupsLoading } = useCellGroupsQuery();

  const isLoading = zonesLoading || groupsLoading;

  // Count groups per zone
  const groupCountByZone = useMemo(() => {
    const counts = {};
    allGroups.forEach((g) => {
      const zoneId = g.zone?._id || g.zone?.id || g.zone;
      if (zoneId) {
        const key = String(zoneId);
        counts[key] = (counts[key] || 0) + 1;
      }
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
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Church Zones – Victory Bible Church</title>
        <meta
          name="description"
          content="Explore our church zones and find a cell group near you for fellowship, growth, and community."
        />
      </Helmet>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden rounded-b-3xl h-[50vh] min-h-[360px]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url(/assets/hero-bg.jpg)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 via-blue-800/80 to-indigo-900/85" />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-blue-300 text-sm font-semibold tracking-widest uppercase mb-4">
              Church Zones
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Find Your <span className="text-yellow-400">Zone</span>
            </h1>
            <p className="text-white/75 max-w-xl mx-auto text-base font-light">
              Our church family is organised into zones across the city, each led by a dedicated elder with several cell groups to connect with.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Search + content ── */}
      <section className="max-w-7xl mx-auto px-4 py-12">

        {/* Search bar */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">All Zones</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {isLoading ? "Loading…" : `${filtered.length} zone${filtered.length !== 1 ? "s" : ""} · ${allGroups.length} total cell groups`}
            </p>
          </div>
          <div className="relative w-full sm:w-64">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search zones…"
              className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <XMarkIcon className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Skeleton */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && filtered.length === 0 && (
          <div className="text-center py-20">
            <BuildingOfficeIcon className="mx-auto h-14 w-14 text-gray-200 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {zones.length === 0 ? "No zones yet" : "No zones match your search"}
            </h3>
            <p className="text-gray-400 max-w-sm mx-auto">
              {zones.length === 0
                ? "Zones will appear here once they've been added by the church admin."
                : "Try a different search term."}
            </p>
            {search && (
              <button
                onClick={() => setSearch("")}
                className="mt-5 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Clear search
              </button>
            )}
          </div>
        )}

        {/* Grid */}
        {!isLoading && filtered.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((zone, i) => {
              const zId = String(zone._id || zone.id);
              return (
                <ZoneCard
                  key={zId}
                  zone={zone}
                  groupCount={groupCountByZone[zId] || 0}
                  index={i}
                />
              );
            })}
          </div>
        )}

        {/* Call to action */}
        {!isLoading && zones.length > 0 && (
          <div className="mt-14 text-center bg-white rounded-2xl border border-gray-100 shadow-sm p-10">
            <UsersIcon className="mx-auto h-10 w-10 text-blue-500 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Ready to connect?</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto text-sm">
              Browse all cell groups across every zone and find the right fit for you.
            </p>
            <Link
              to="/cell-groups"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              Browse All Cell Groups
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
        )}
      </section>
    </div>
  );
};

export default ZonesPage;
