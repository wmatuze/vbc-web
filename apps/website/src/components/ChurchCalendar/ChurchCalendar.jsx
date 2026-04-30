import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import Modal from "react-modal";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { toast } from "react-toastify";
import {
  MagnifyingGlassIcon,
  Squares2X2Icon,
  ListBulletIcon,
  CalendarDaysIcon,
  ClockIcon,
  MapPinIcon,
  XMarkIcon,
  CalendarIcon,
  UserPlusIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

import { useEventsQuery } from "../../hooks/useEventsQuery";
import EventCard, { getEventDate, getEventTime, resolveImageUrl } from "./EventsCard";
import EventSignUpForm from "../EventSignUpForm";
import HeroSection from "../common/HeroSection";
import eventPlaceholderImage from "../../assets/placeholders/default-event.svg";

Modal.setAppElement("#root");

const MONTH = (d) => d.toLocaleString("default", { month: "short" }).toUpperCase();

const ChurchCalendar = () => {
  const currentYear = new Date().getFullYear();
  const { data: events = [], isLoading: loading, error, refetch } = useEventsQuery({ year: currentYear });

  const [viewMode,         setViewMode]         = useState("grid");
  const [selectedEvent,    setSelectedEvent]    = useState(null);
  const [isModalOpen,      setIsModalOpen]      = useState(false);
  const [isSignUpOpen,     setIsSignUpOpen]     = useState(false);
  const [filteredEvents,   setFilteredEvents]   = useState([]);
  const [searchTerm,       setSearchTerm]       = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const ministryCategories = [
    "All",
    ...new Set(events.map((e) => e.ministry).filter(Boolean)),
  ];

  useEffect(() => {
    let result = events;
    if (searchTerm)
      result = result.filter(
        (e) =>
          e?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          e?.description?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    if (selectedCategory !== "All")
      result = result.filter((e) => e?.ministry === selectedCategory);
    setFilteredEvents(result);
  }, [searchTerm, selectedCategory, events]);

  useEffect(() => {
    if (isSignUpOpen && !selectedEvent) {
      toast.error("Error loading form. Please try again.");
      setIsSignUpOpen(false);
    }
  }, [isSignUpOpen, selectedEvent]);

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
    setIsSignUpOpen(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => { if (!isSignUpOpen) setSelectedEvent(null); }, 300);
  };

  const shouldShowSignupButton = (event) => {
    if (!event) return false;
    const enabled =
      event.signupMode === "required" ||
      event.signupMode === "optional" ||
      event.signupRequired;
    if (!enabled) return false;
    if (event.signupDeadline && new Date() > new Date(event.signupDeadline)) return false;
    return true;
  };

  const handleOpenSignupForm = () => {
    if (!selectedEvent) { toast.error("No event selected."); return; }
    const title = selectedEvent.title?.toLowerCase() || "";
    let type = selectedEvent.type || "event";
    if (title.includes("baptism")) type = "baptism";
    else if (title.includes("dedication") || title.includes("baby")) type = "babyDedication";
    const updated = { ...selectedEvent, type };
    setIsModalOpen(false);
    setSelectedEvent(updated);
    setTimeout(() => { if (updated) setIsSignUpOpen(true); else toast.error("Error preparing form."); }, 400);
  };

  const addToCalendar = (event) => {
    const start = event.startDate ? new Date(event.startDate) : new Date(event.date + " " + (event.time || "00:00"));
    const end   = event.endDate   ? new Date(event.endDate)   : new Date(start.getTime() + 2 * 60 * 60 * 1000);
    const fmt   = (d) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d+/, "");
    window.open(
      `https://www.google.com/calendar/render?action=TEMPLATE` +
      `&text=${encodeURIComponent(event.title)}` +
      `&details=${encodeURIComponent(event.description || "")}` +
      `&location=${encodeURIComponent(event.location || "Victory Bible Church")}` +
      `&dates=${fmt(start)}/${fmt(end)}`,
      "_blank",
    );
  };

  const calendarEvents = events.map((e) => {
    let start = e.startDate ? new Date(e.startDate) : (e.date ? new Date(e.date) : new Date());
    if (isNaN(start.getTime())) start = new Date();
    return { id: e.id, title: e.title, start, extendedProps: { ...e } };
  });

  return (
    <div className="bg-white">
      <Helmet>
        <title>Events — Victory Bible Church</title>
        <meta name="description" content="Upcoming events at Victory Bible Church Kitwe. Join us for services, programmes, and community gatherings." />
      </Helmet>

      {/* ── Hero ──────────────────────────────────────────────────── */}
      <HeroSection
        subtitle="What's On"
        title="Events & Gatherings"
        description="Join us for worship, community, and growth. Something is always happening at Victory Bible Church."
        backgroundImage="/assets/hero-bg.jpg"
        breadcrumbs={[{ label: "Home", path: "/" }, { label: "Events" }]}
      />

      {/* ── Filter bar ────────────────────────────────────────────── */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-3 flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search events…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={loading}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 focus:border-brand-red focus:outline-none bg-white text-gray-900 placeholder-gray-400 transition-colors"
            />
          </div>

          {/* Ministry filter */}
          {ministryCategories.length > 1 && (
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              disabled={loading}
              className="text-sm border border-gray-200 focus:border-brand-red focus:outline-none bg-white text-gray-700 py-2 px-3 transition-colors"
            >
              {ministryCategories.map((m) => (
                <option key={m || "all"} value={m}>{m}</option>
              ))}
            </select>
          )}

          {/* View toggle */}
          <div className="flex border border-gray-200">
            {[
              { mode: "grid",     Icon: Squares2X2Icon,  label: "Grid" },
              { mode: "list",     Icon: ListBulletIcon,  label: "List" },
              { mode: "calendar", Icon: CalendarDaysIcon, label: "Calendar" },
            ].map(({ mode, Icon, label }) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                title={label}
                className={`px-3 py-2 transition-colors ${
                  viewMode === mode
                    ? "bg-brand-red text-white"
                    : "bg-white text-gray-500 hover:bg-gray-50"
                }`}
              >
                <Icon className="h-4 w-4" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Content ───────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-100">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse bg-white">
                <div className="h-48 bg-gray-100" />
                <div className="p-5 space-y-2">
                  <div className="h-4 bg-gray-100 rounded w-3/4" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                  <div className="h-3 bg-gray-100 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-gray-900 font-semibold mb-1">Failed to load events</p>
            <p className="text-gray-400 text-sm mb-6">{error.message || "An unexpected error occurred."}</p>
            <button onClick={() => refetch()} className="inline-flex items-center gap-2 bg-brand-red text-white text-sm font-semibold px-6 py-3 hover:bg-red-700 transition-colors">
              <ArrowPathIcon className="h-4 w-4" /> Retry
            </button>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-20">
            <CalendarDaysIcon className="h-12 w-12 text-gray-200 mx-auto mb-4" />
            {searchTerm || selectedCategory !== "All" ? (
              <>
                <p className="text-gray-700 font-semibold mb-1">No events match your filters</p>
                <p className="text-gray-400 text-sm mb-6">Try adjusting your search or ministry selection.</p>
                <button onClick={() => { setSearchTerm(""); setSelectedCategory("All"); }}
                  className="bg-brand-red text-white text-sm font-semibold px-6 py-3 hover:bg-red-700 transition-colors">
                  Clear Filters
                </button>
              </>
            ) : (
              <>
                <p className="text-gray-700 font-semibold mb-1">No upcoming events</p>
                <p className="text-gray-400 text-sm">Events added in the admin panel will appear here.</p>
              </>
            )}
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-100">
            {filteredEvents.map((event) => (
              <div key={event.id} onClick={() => handleEventClick(event)} className="cursor-pointer bg-white">
                <EventCard event={event} />
              </div>
            ))}
          </div>
        ) : viewMode === "list" ? (
          <div className="divide-y divide-gray-100">
            {filteredEvents.map((event) => {
              const d    = getEventDate(event);
              const time = getEventTime(event);
              return (
                <div
                  key={event.id}
                  onClick={() => handleEventClick(event)}
                  className="flex gap-5 py-5 cursor-pointer hover:bg-gray-50 transition-colors group"
                >
                  {/* Date box */}
                  <div className="flex-shrink-0 w-14 text-center">
                    <div className="bg-brand-red text-white text-[10px] font-bold uppercase tracking-wider py-0.5">{MONTH(d)}</div>
                    <div className="bg-vbc-dark text-white text-2xl font-black py-1">{d.getDate()}</div>
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="text-base font-bold text-gray-900 group-hover:text-brand-red transition-colors line-clamp-1">
                        {event?.title}
                      </h3>
                      {event?.ministry && (
                        <span className="flex-shrink-0 text-[10px] font-semibold uppercase tracking-wider text-brand-red border border-brand-red/30 px-2 py-0.5">
                          {event.ministry}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 mt-1.5 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <ClockIcon className="h-3.5 w-3.5" />{time}
                      </span>
                      {event?.location && (
                        <span className="flex items-center gap-1 truncate">
                          <MapPinIcon className="h-3.5 w-3.5 flex-shrink-0" />{event.location}
                        </span>
                      )}
                    </div>
                    {event?.description && (
                      <p className="text-sm text-gray-500 mt-2 line-clamp-2 leading-relaxed">{event.description}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="border border-gray-100 overflow-hidden" style={{ height: 600 }}>
            <FullCalendar
              plugins={[dayGridPlugin]}
              initialView="dayGridMonth"
              events={calendarEvents}
              eventClick={(info) => handleEventClick(info.event.extendedProps)}
              headerToolbar={{ left: "prev,next today", center: "title", right: "dayGridMonth,dayGridWeek" }}
              height="100%"
            />
          </div>
        )}
      </div>

      {/* ── Event detail modal ────────────────────────────────────── */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        className="w-full max-w-2xl mx-auto my-8 bg-white overflow-hidden outline-none max-h-[90vh] flex flex-col"
        overlayClassName="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50"
      >
        {selectedEvent && (() => {
          const d    = getEventDate(selectedEvent);
          const time = getEventTime(selectedEvent);
          const img  = resolveImageUrl(selectedEvent);
          const showSignup = shouldShowSignupButton(selectedEvent);
          return (
            <div className="flex flex-col max-h-[90vh]">
              {/* Image header */}
              <div className="relative h-52 bg-gray-100 flex-shrink-0">
                <img src={img} alt={selectedEvent.title} className="w-full h-full object-cover"
                  onError={(e) => { e.target.src = eventPlaceholderImage; e.target.onerror = null; }} />
                <div className="absolute inset-0 bg-gradient-to-t from-vbc-dark/80 to-transparent" />

                {/* Close */}
                <button onClick={closeModal}
                  className="absolute top-3 right-3 p-1.5 bg-white/10 hover:bg-white/20 text-white transition-colors">
                  <XMarkIcon className="h-5 w-5" />
                </button>

                {/* Date overlay bottom-left */}
                <div className="absolute bottom-4 left-4 flex items-end gap-3">
                  <div className="text-center">
                    <div className="bg-brand-red text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5">{MONTH(d)}</div>
                    <div className="bg-vbc-dark text-white text-2xl font-black px-3 py-1">{d.getDate()}</div>
                  </div>
                  <div>
                    <h2 className="text-white text-xl font-bold leading-tight line-clamp-2">{selectedEvent.title}</h2>
                    {selectedEvent.ministry && (
                      <span className="text-brand-red text-xs font-semibold uppercase tracking-wider">{selectedEvent.ministry}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-6">
                {/* Meta */}
                <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-5 pb-5 border-b border-gray-100">
                  <span className="flex items-center gap-2"><ClockIcon className="h-4 w-4 text-gray-400" />{time}</span>
                  {selectedEvent.location && (
                    <span className="flex items-center gap-2"><MapPinIcon className="h-4 w-4 text-gray-400" />{selectedEvent.location}</span>
                  )}
                </div>

                {/* Description */}
                {selectedEvent.description && (
                  <div className="mb-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-400 mb-2">About This Event</p>
                    <p className="text-gray-700 text-sm leading-relaxed">{selectedEvent.description}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-wrap gap-3">
                  {showSignup && (
                    <button
                      onClick={(e) => { e.preventDefault(); setIsModalOpen(false); setTimeout(handleOpenSignupForm, 300); }}
                      className="inline-flex items-center gap-2 bg-brand-red text-white text-sm font-semibold px-5 py-2.5 hover:bg-red-700 transition-colors"
                    >
                      <UserPlusIcon className="h-4 w-4" />
                      {selectedEvent.signupMode === "required" || selectedEvent.signupRequired
                        ? "Sign Up (Required)"
                        : "Sign Up (Optional)"}
                    </button>
                  )}
                  <button
                    onClick={() => addToCalendar(selectedEvent)}
                    className="inline-flex items-center gap-2 border border-gray-300 text-gray-700 text-sm font-semibold px-5 py-2.5 hover:bg-gray-50 transition-colors"
                  >
                    <CalendarIcon className="h-4 w-4" />
                    Add to Calendar
                  </button>
                  <button onClick={closeModal}
                    className="ml-auto text-sm text-gray-400 hover:text-gray-600 transition-colors px-3 py-2.5">
                    Close
                  </button>
                </div>
              </div>
            </div>
          );
        })()}
      </Modal>

      {/* ── Sign-up form ──────────────────────────────────────────── */}
      {isSignUpOpen && selectedEvent && (
        <EventSignUpForm
          event={selectedEvent}
          onClose={() => { setIsSignUpOpen(false); setSelectedEvent(null); }}
          onSubmit={() => {
            setIsSignUpOpen(false);
            setSelectedEvent(null);
            toast.success("Registration submitted successfully!");
          }}
        />
      )}
    </div>
  );
};

export default ChurchCalendar;
