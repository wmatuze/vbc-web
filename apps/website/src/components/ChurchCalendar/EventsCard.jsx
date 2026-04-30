import React from "react";
import config from "../../config";
import eventPlaceholderImage from "../../assets/placeholders/default-event.svg";
import { MapPinIcon, ClockIcon } from "@heroicons/react/24/outline";

const API_URL = config.API_URL;

const resolveImageUrl = (event) => {
  if (!event?.imageUrl && !event?.image) return eventPlaceholderImage;

  if (event.imageUrl) {
    return event.imageUrl.startsWith("http")
      ? event.imageUrl
      : `${API_URL}${event.imageUrl.startsWith("/") ? "" : "/"}${event.imageUrl}`;
  }

  if (event.image && typeof event.image === "object") {
    if (event.image.path) {
      return event.image.path.startsWith("http")
        ? event.image.path
        : `${API_URL}${event.image.path.startsWith("/") ? "" : "/"}${event.image.path}`;
    }
    if (event.image.filename) return `${API_URL}/uploads/${event.image.filename}`;
  }

  return eventPlaceholderImage;
};

const getEventDate = (event) => {
  try {
    if (event?.startDate) { const d = new Date(event.startDate); if (!isNaN(d.getTime())) return d; }
    if (event?.date)      { const d = new Date(event.date);      if (!isNaN(d.getTime())) return d; }
  } catch {}
  return new Date();
};

const getEventTime = (event) => {
  if (event?.time?.trim()) return event.time;
  if (event?.startDate) {
    try {
      const d = new Date(event.startDate);
      if (!isNaN(d.getTime()) && (d.getHours() || d.getMinutes()))
        return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "numeric", hour12: true });
    } catch {}
  }
  return "TBA";
};

const MONTH = (d) => d.toLocaleString("default", { month: "short" }).toUpperCase();

// ─── Compact (used on homepage dark strips) ──────────────────────────────────
const CompactCard = ({ event }) => {
  const imageUrl = resolveImageUrl(event);
  const d = getEventDate(event);

  return (
    <div className="bg-white/5 border border-white/10 overflow-hidden flex h-24 hover:bg-white/10 transition-colors">
      {imageUrl !== eventPlaceholderImage && (
        <div className="w-24 flex-shrink-0 overflow-hidden">
          <img src={imageUrl} alt="" className="w-full h-full object-cover"
            onError={(e) => { e.target.style.display = "none"; }} />
        </div>
      )}
      <div className="flex items-center gap-3 px-4 flex-1 min-w-0">
        <div className="flex-shrink-0 text-center w-10">
          <p className="text-brand-red text-[10px] font-bold uppercase leading-none">{MONTH(d)}</p>
          <p className="text-white text-xl font-black leading-tight">{d.getDate()}</p>
        </div>
        <div className="min-w-0">
          <p className="text-white text-sm font-semibold truncate">{event?.title}</p>
          <p className="text-white/50 text-xs">{getEventTime(event)}</p>
          {event?.location && <p className="text-white/40 text-xs truncate">{event.location}</p>}
        </div>
      </div>
    </div>
  );
};

// ─── Full card (events grid) ─────────────────────────────────────────────────
const EventCard = ({ event, highlight, compact = false }) => {
  if (compact) return <CompactCard event={event} />;

  const imageUrl = resolveImageUrl(event);
  const d        = getEventDate(event);
  const time     = getEventTime(event);

  return (
    <div className={`group bg-white flex flex-col h-full border ${
      highlight ? "border-brand-red" : "border-gray-100"
    } hover:border-gray-300 transition-colors overflow-hidden`}>

      {/* Image */}
      <div className="relative h-48 bg-gray-100 overflow-hidden flex-shrink-0">
        <img
          src={imageUrl}
          alt={event?.title || "Event"}
          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
          onError={(e) => { e.target.src = eventPlaceholderImage; e.target.onerror = null; }}
        />

        {/* Date chip — top left */}
        <div className="absolute top-3 left-3 text-center">
          <div className="bg-brand-red text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5">
            {MONTH(d)}
          </div>
          <div className="bg-vbc-dark text-white text-xl font-black px-2 py-1 min-w-[2.5rem] text-center">
            {d.getDate()}
          </div>
        </div>

        {/* Ministry badge — top right */}
        {event?.ministry && (
          <div className="absolute top-3 right-3 bg-vbc-dark/80 text-white text-[10px] font-semibold uppercase tracking-wider px-2 py-1">
            {event.ministry}
          </div>
        )}

        {/* Signup badge */}
        {(event?.signupMode === "required" || event?.signupRequired) && (
          <div className="absolute bottom-3 left-3 bg-brand-red text-white text-[10px] font-semibold uppercase tracking-wider px-2 py-1">
            Sign-up required
          </div>
        )}
        {event?.signupMode === "optional" && (
          <div className="absolute bottom-3 left-3 bg-white/90 text-gray-800 text-[10px] font-semibold uppercase tracking-wider px-2 py-1">
            Sign-up optional
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        <h3 className="text-base font-bold text-gray-900 mb-3 line-clamp-2 leading-snug">
          {event?.title || "Unnamed Event"}
        </h3>

        <div className="space-y-1.5 mb-4">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <ClockIcon className="h-3.5 w-3.5 flex-shrink-0 text-gray-400" />
            {time}
          </div>
          {event?.location && (
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <MapPinIcon className="h-3.5 w-3.5 flex-shrink-0 text-gray-400" />
              <span className="truncate">{event.location}</span>
            </div>
          )}
        </div>

        <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed flex-1 mb-4">
          {event?.description || ""}
        </p>

        <div className="mt-auto">
          <span className="inline-flex items-center gap-1.5 text-brand-red text-xs font-semibold uppercase tracking-wider group-hover:gap-3 transition-all">
            Learn more
            <span aria-hidden>→</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
export { getEventDate, getEventTime, resolveImageUrl };
