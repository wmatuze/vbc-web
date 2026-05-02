import { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  MagnifyingGlassIcon,
  MapPinIcon,
  UserIcon,
  UsersIcon,
  ClockIcon,
  ArrowLeftIcon,
  XMarkIcon,
  EnvelopeIcon,
  PhoneIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { useZoneByIdQuery, useZoneCellGroupsQuery } from "../hooks/useZonesQuery";
import JoinGroupModal from "../components/JoinGroupModal";
import config from "../config";

const API_URL = config.API_URL;
const DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];

const resolveImage = (group) => {
  const src = group.imageUrl || group.image?.path;
  if (!src) return null;
  return src.startsWith("http") ? src : `${API_URL}${src}`;
};

// ── Skeleton card ─────────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="bg-white animate-pulse border border-gray-100">
    <div className="h-52 bg-gray-100" />
    <div className="p-6 space-y-3 border-t border-gray-100">
      <div className="h-4 bg-gray-100 w-3/4" />
      <div className="h-3 bg-gray-50 w-1/2" />
      <div className="h-10 bg-gray-100 mt-4" />
    </div>
  </div>
);

// ── Group card ────────────────────────────────────────────────────────────────
const GroupCard = ({ group, onJoin }) => {
  const thumb = resolveImage(group);
  const contact = group.contact || group.leaderContact;

  return (
    <div className="bg-white flex flex-col group">
      {/* Image */}
      <div className="relative h-52 overflow-hidden bg-gray-100 flex-shrink-0">
        {thumb ? (
          <img
            src={thumb} alt={group.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => { e.target.style.display = "none"; }}
          />
        ) : (
          <div className="w-full h-full bg-vbc-dark flex items-center justify-center">
            <UsersIcon className="h-12 w-12 text-white/10" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-base font-black text-white leading-tight">{group.name}</h3>
          {group.location && (
            <p className="flex items-center gap-1 text-xs text-white/60 mt-1">
              <MapPinIcon className="h-3 w-3 flex-shrink-0" />{group.location}
            </p>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-6 border border-t-0 border-gray-100">
        {(group.meetingDay || group.meetingTime) && (
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
            <ClockIcon className="h-3.5 w-3.5 text-brand-red flex-shrink-0" />
            <span className="font-medium text-gray-700">
              {group.meetingDay}{group.meetingTime ? ` · ${group.meetingTime}` : ""}
            </span>
          </div>
        )}
        {group.leader && (
          <div className="flex items-center gap-2 mb-4">
            <UserIcon className="h-3.5 w-3.5 text-gray-300 flex-shrink-0" />
            <p className="text-xs text-gray-500">
              Led by <span className="font-semibold text-gray-700">{group.leader}</span>
            </p>
          </div>
        )}
        <p className="text-xs text-gray-400 leading-relaxed line-clamp-2 flex-1 mb-5">
          {group.description || "A welcoming cell group for fellowship and spiritual growth."}
        </p>
        {group.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {group.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="px-2 py-0.5 text-xs bg-gray-50 text-gray-400 border border-gray-100">{tag}</span>
            ))}
          </div>
        )}
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

// ── Main ──────────────────────────────────────────────────────────────────────
const ZoneDetailPage = () => {
  const { zoneId } = useParams();

  const { data: zone,       isLoading: zoneLoading,   error: zoneError  } = useZoneByIdQuery(zoneId);
  const { data: cellGroups = [], isLoading: groupsLoading } = useZoneCellGroupsQuery(zoneId);

  const isLoading = zoneLoading || groupsLoading;

  const [search,          setSearch]          = useState("");
  const [activeDayFilter, setActiveDayFilter] = useState("");
  const [showDayDropdown, setShowDayDropdown] = useState(false);
  const [selectedGroup,   setSelectedGroup]   = useState(null);

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

  // ── Error state ───────────────────────────────────────────────────────────
  if (!isLoading && (zoneError || !zone)) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-6">
        <div className="text-center">
          <div className="w-16 h-px bg-brand-red mx-auto mb-8" />
          <h2 className="text-2xl font-black text-gray-900 mb-3">Zone Not Found</h2>
          <p className="text-gray-400 text-sm mb-8">
            {zoneError ? "There was an error loading this zone." : "This zone doesn't exist or has been removed."}
          </p>
          <Link to="/cell-groups"
            className="inline-flex items-center gap-2 bg-brand-red text-white text-xs font-semibold uppercase tracking-wider px-6 py-3 hover:bg-red-700 transition-colors">
            <ArrowLeftIcon className="h-3.5 w-3.5" />
            Browse All Zones
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <Helmet>
        <title>{zone ? `${zone.name} — Cell Groups` : "Loading…"} · Victory Bible Church</title>
        <meta name="description"
          content={zone ? `Cell groups in the ${zone.name} zone. Find one near you and join a small group for fellowship and growth.` : ""} />
      </Helmet>

      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="relative bg-vbc-dark overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: "url(/assets/hero-bg.jpg)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-vbc-dark/60 to-vbc-dark" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-28 md:py-36">
          <Link
            to="/cell-groups"
            className="inline-flex items-center gap-2 text-white/30 hover:text-white text-xs font-semibold uppercase tracking-wider transition-colors mb-8"
          >
            <ArrowLeftIcon className="h-3.5 w-3.5" />
            All Zones
          </Link>

          <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-4">Zone</p>

          {isLoading ? (
            <div className="h-16 w-64 bg-white/10 animate-pulse" />
          ) : (
            <h1
              className="font-black text-white leading-[0.88] mb-6"
              style={{ fontSize: "clamp(3rem, 8vw, 6rem)" }}
            >
              {zone?.name}
            </h1>
          )}

          {zone?.location && (
            <p className="flex items-center gap-2 text-white/40 text-sm">
              <MapPinIcon className="h-4 w-4" />
              {zone.location}
            </p>
          )}

          <div className="flex items-center gap-8 mt-12 pt-12 border-t border-white/10">
            <div>
              <p className="text-2xl font-black text-white">{cellGroups.length}</p>
              <p className="text-white/30 text-xs uppercase tracking-wider mt-0.5">Cell Groups</p>
            </div>
            {zone?.elder?.name && (
              <>
                <div className="w-px h-10 bg-white/10" />
                <div>
                  <p className="text-sm font-black text-white">{zone.elder.name}</p>
                  <p className="text-white/30 text-xs uppercase tracking-wider mt-0.5">{zone.elder.title || "Zone Elder"}</p>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ── Zone info + Elder ─────────────────────────────────────── */}
      {!isLoading && zone && (zone.description || zone.elder?.name) && (
        <section className="bg-vbc-section">
          <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {zone.description && (
              <div className="lg:col-span-2">
                <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-3">About this zone</p>
                <p className="text-white/60 text-sm leading-relaxed">{zone.description}</p>
              </div>
            )}
            {zone.elder?.name && (
              <div className="border border-white/10 p-6">
                <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-4">Zone Elder</p>
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-10 h-10 bg-white/5 flex items-center justify-center flex-shrink-0">
                    <UserIcon className="h-5 w-5 text-white/30" />
                  </div>
                  <div>
                    <p className="text-white font-black text-sm">{zone.elder.name}</p>
                    <p className="text-white/30 text-xs">{zone.elder.title || "Zone Elder"}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {zone.elder?.contact && (
                    <a href={`mailto:${zone.elder.contact}`}
                      className="flex items-center gap-2 text-xs text-white/40 hover:text-brand-red transition-colors">
                      <EnvelopeIcon className="h-3.5 w-3.5" />
                      {zone.elder.contact}
                    </a>
                  )}
                  {zone.elder?.phone && (
                    <a href={`tel:${zone.elder.phone}`}
                      className="flex items-center gap-2 text-xs text-white/40 hover:text-brand-red transition-colors">
                      <PhoneIcon className="h-3.5 w-3.5" />
                      {zone.elder.phone}
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── Filter bar ────────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-4 py-3">
            {/* Search */}
            <div className="relative flex-1 max-w-xs">
              <MagnifyingGlassIcon className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300 pointer-events-none" />
              <input
                type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search groups…"
                className="w-full pl-6 pr-8 py-2 text-sm text-gray-900 border-b-2 border-gray-100 focus:border-brand-red focus:outline-none bg-transparent placeholder-gray-300 transition-colors"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500">
                  <XMarkIcon className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Day filter */}
            <div className="relative flex-shrink-0">
              <button
                onClick={() => setShowDayDropdown((p) => !p)}
                className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold uppercase tracking-wider border transition-colors ${
                  activeDayFilter ? "border-brand-red text-brand-red" : "border-gray-200 text-gray-400 hover:border-gray-300"
                }`}
              >
                <ClockIcon className="h-3.5 w-3.5" />
                {activeDayFilter || "Day"}
                <ChevronDownIcon className="h-3 w-3" />
              </button>
              {showDayDropdown && (
                <div className="absolute right-0 top-full bg-white shadow-xl border border-gray-100 z-50 w-44 py-1">
                  <button
                    onClick={() => { setActiveDayFilter(""); setShowDayDropdown(false); }}
                    className="w-full text-left px-4 py-2.5 text-xs text-gray-400 hover:bg-gray-50">
                    Any day
                  </button>
                  {DAYS.map((d) => (
                    <button key={d}
                      onClick={() => { setActiveDayFilter(d); setShowDayDropdown(false); }}
                      className={`w-full text-left px-4 py-2.5 text-xs transition-colors ${
                        activeDayFilter === d ? "bg-brand-red/5 text-brand-red font-semibold" : "text-gray-600 hover:bg-gray-50"
                      }`}>
                      {d}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {hasFilters && (
              <button onClick={clearFilters}
                className="flex items-center gap-1 text-xs text-brand-red hover:text-red-700 font-semibold uppercase tracking-wider">
                <XMarkIcon className="h-3.5 w-3.5" />
                Clear
              </button>
            )}

            <p className="ml-auto text-xs text-gray-400 flex-shrink-0">
              {isLoading ? "Loading…" : <><span className="font-bold text-gray-900">{filtered.length}</span> group{filtered.length !== 1 ? "s" : ""}</>}
            </p>
          </div>
        </div>
      </div>

      {/* ── Groups grid ───────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-14">
        {/* Skeleton */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-100">
            {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* Empty */}
        {!isLoading && filtered.length === 0 && (
          <div className="py-28 text-center">
            <div className="w-16 h-px bg-brand-red mx-auto mb-8" />
            <h3 className="text-xl font-black text-gray-900 mb-3">
              {cellGroups.length === 0 ? "No cell groups in this zone yet" : "No groups match your filters"}
            </h3>
            <p className="text-gray-400 text-sm max-w-sm mx-auto mb-8">
              {cellGroups.length === 0
                ? "Groups will appear here as they are added."
                : "Try adjusting your search or removing the day filter."}
            </p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              {hasFilters && (
                <button onClick={clearFilters}
                  className="inline-block bg-brand-red text-white text-xs font-semibold uppercase tracking-wider px-6 py-3 hover:bg-red-700 transition-colors">
                  Clear filters
                </button>
              )}
              <Link to="/cell-groups"
                className="inline-flex items-center gap-2 border border-gray-200 text-gray-600 text-xs font-semibold uppercase tracking-wider px-6 py-3 hover:bg-gray-50 transition-colors">
                <ArrowLeftIcon className="h-3.5 w-3.5" />
                All zones
              </Link>
            </div>
          </div>
        )}

        {/* Grid */}
        {!isLoading && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-100">
            {filtered.map((group) => (
              <GroupCard
                key={group._id || group.id}
                group={group}
                onJoin={setSelectedGroup}
              />
            ))}
          </div>
        )}

        {/* Back link */}
        {!isLoading && (
          <div className="mt-14 pt-14 border-t border-gray-100 flex items-center gap-2">
            <Link to="/cell-groups"
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-400 hover:text-brand-red transition-colors">
              <ArrowLeftIcon className="h-3.5 w-3.5" />
              Back to all zones
            </Link>
          </div>
        )}
      </section>

      {/* ── Join modal ────────────────────────────────────────────── */}
      {selectedGroup && (
        <JoinGroupModal group={selectedGroup} onClose={() => setSelectedGroup(null)} />
      )}
    </div>
  );
};

export default ZoneDetailPage;
