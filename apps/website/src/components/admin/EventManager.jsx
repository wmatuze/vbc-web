import { useState, useEffect, useRef } from "react";
import useErrorHandler from "../../hooks/useErrorHandler";
import { getAuthToken } from "../../services/api/core";
import { useEventForm } from "../../hooks/useEventForm";
import { useDarkMode } from "../../contexts/DarkModeContext";
import FormField from "../common/FormField";
import MediaSelector from "../common/MediaSelector";
import ImagePreview from "../common/ImagePreview";
import EventAdminCard from "./EventAdminCard";
import { deleteEvent } from "../../services/api/events";
import { useEventsQuery } from "../../hooks/useEventsQuery";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import {
  PlusIcon,
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  XMarkIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  MagnifyingGlassIcon,
  Squares2X2Icon,
  ListBulletIcon,
  ArrowPathIcon,
  DocumentDuplicateIcon,
  PencilIcon,
  TrashIcon,
  UserIcon,
  EnvelopeIcon,
  UsersIcon,
  PhotoIcon,
  TagIcon,
  StarIcon,
  ClipboardDocumentListIcon,
  ArrowUpTrayIcon,
} from "@heroicons/react/24/outline";
import { format, parseISO, isValid } from "date-fns";
import config from "../../config";
import {
  EVENT_VALIDATION_RULES,
  EVENT_TYPES,
  SIGNUP_MODES,
} from "../../constants/eventConstants";
import { normalizeEventDate, parseEventFromAPI } from "../../utils/dateUtils";
import { getImageUrl, processMediaItem } from "../../utils/imageUtils";
import eventPlaceholderImage from "../../assets/placeholders/default-event.svg";

const API_URL = config.API_URL;

const resolveImageUrl = (url) => {
  if (!url || url.includes("default-event")) return null;
  if (url.startsWith("http") || url.startsWith("data:")) return url;
  return `${API_URL}${url}`;
};

// ─── Section wrapper inside the form ─────────────────────────────────────────
const FormSection = ({ title, children, darkMode }) => (
  <div>
    <h4 className={`text-xs font-semibold uppercase tracking-wider mb-3 pb-2 border-b ${darkMode ? "text-gray-400 border-gray-700" : "text-gray-400 border-gray-100"}`}>
      {title}
    </h4>
    <div className="space-y-4">{children}</div>
  </div>
);

const EventManager = () => {
  const { darkMode } = useDarkMode();

  const { data: events = [], isLoading: eventsLoading, error: eventsError, refetch: refetchEvents } = useEventsQuery();
  const { error, errorMessage, handleError, clearError, withErrorHandling } = useErrorHandler("EventManager");

  const {
    currentEvent, formErrors, formMode, showForm, isSubmitting,
    setCurrentEvent, setFormErrors, handleInputChange, handleCheckboxChange,
    handleTagsChange, resetForm, editEvent, addEvent, duplicateEvent, submitForm,
  } = useEventForm({
    onSuccess: (_, action) => {
      setSuccessMessage(`Event ${action} successfully!`);
      refetchEvents();
      setTimeout(() => setSuccessMessage(""), 4000);
    },
    onError: (err) => handleError(err, "Event Form Submission"),
  });

  const [searchTerm, setSearchTerm]       = useState("");
  const [viewMode, setViewMode]           = useState("grid");
  const [eventFilter, setEventFilter]     = useState("all");
  const [sortOrder, setSortOrder]         = useState("asc");
  const [successMessage, setSuccessMessage] = useState("");
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isMediaSelectorOpen, setIsMediaSelectorOpen] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (eventsError) handleError(eventsError, "Failed to load events");
  }, [eventsError, handleError]);

  const { data: mediaItems = [] } = useMediaQuery({ enabled: isMediaSelectorOpen });

  const handleSubmit = async (e) => { e.preventDefault(); await submitForm(); };

  const handleEdit = withErrorHandling(
    (event) => editEvent(parseEventFromAPI(event)),
    { context: "Event Editing" }
  );

  const handleDelete = withErrorHandling(async (event) => {
    if (!window.confirm(`Delete "${event.title}"? This cannot be undone.`)) return;
    const id = event.id || event._id;
    if (!id) throw new Error("Missing event ID");
    await deleteEvent(id);
    setSuccessMessage("Event deleted.");
    await refetchEvents();
    setTimeout(() => setSuccessMessage(""), 4000);
  }, { context: "Event Deletion" });

  const handleMediaSelection = (item) => {
    if (item) {
      const p = processMediaItem(item);
      setCurrentEvent((prev) => ({ ...prev, imageUrl: p.path, image: p.id || p._id || null }));
    }
  };

  const handleImageUpload = withErrorHandling(async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      handleError(new Error("Image must be less than 10 MB"), "File Validation");
      return;
    }
    setImageUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", file.name.replace(/\.[^.]+$/, "") || "Event image");
      formData.append("category", "events");
      const token = getAuthToken();
      const res = await fetch(`${API_URL}/api/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
      const data = await res.json();
      setCurrentEvent((prev) => ({ ...prev, imageUrl: data.path, image: data.id || data._id || null }));
    } finally {
      setImageUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }, { context: "Image Upload" });

  const handleDateChange = (e) => {
    const val = e.target.value;
    if (!val) {
      setCurrentEvent((prev) => ({ ...prev, date: "", formattedDate: "" }));
      return;
    }
    try {
      const d = parseISO(val);
      if (!isValid(d)) throw new Error();
      setCurrentEvent((prev) => ({
        ...prev,
        date: val,
        formattedDate: format(d, "MMMM d, yyyy"),
        startDate: d,
      }));
      setFormErrors((prev) => ({ ...prev, date: null }));
    } catch {
      setFormErrors((prev) => ({ ...prev, date: "Invalid date" }));
    }
  };

  // ─── Filtered & sorted list ─────────────────────────────────────────────
  const filteredEvents = events
    .filter((ev) => {
      const s = searchTerm.toLowerCase();
      const matchSearch = !s ||
        ev.title?.toLowerCase().includes(s) ||
        ev.description?.toLowerCase().includes(s) ||
        ev.location?.toLowerCase().includes(s);

      let matchDate = true;
      if (eventFilter !== "all") {
        const today = new Date(); today.setHours(0,0,0,0);
        const evDay = new Date(ev.startDate || ev.date); evDay.setHours(0,0,0,0);
        matchDate = eventFilter === "upcoming" ? evDay >= today : evDay < today;
      }
      return matchSearch && matchDate;
    })
    .sort((a, b) => {
      const da = new Date(a.startDate || a.date);
      const db = new Date(b.startDate || b.date);
      return sortOrder === "asc" ? da - db : db - da;
    });

  // ─── Input classes helper ────────────────────────────────────────────────
  const inp = (hasError) =>
    `w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
      hasError ? "border-red-500" :
      darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
               : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
    }`;

  const sel = `w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
    darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"
  }`;

  return (
    <div className="relative">

      {/* ── Alerts ── */}
      {error && (
        <div className={`flex items-start gap-3 p-4 rounded-lg mb-5 border ${darkMode ? "bg-red-900/20 border-red-800 text-red-300" : "bg-red-50 border-red-200 text-red-700"}`}>
          <ExclamationCircleIcon className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <div className="flex-1 text-sm">{errorMessage}</div>
          <button onClick={clearError} className="text-xs underline opacity-70 hover:opacity-100">Dismiss</button>
        </div>
      )}
      {successMessage && (
        <div className={`flex items-center gap-2 p-4 rounded-lg mb-5 border ${darkMode ? "bg-green-900/20 border-green-800 text-green-300" : "bg-green-50 border-green-200 text-green-700"}`}>
          <CheckCircleIcon className="h-5 w-5 flex-shrink-0" />
          <span className="text-sm">{successMessage}</span>
        </div>
      )}

      {/* ── Toolbar ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2 flex-1 max-w-sm">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search events…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`${inp(false)} pl-9`}
            />
          </div>
          <select value={eventFilter} onChange={(e) => setEventFilter(e.target.value)} className={sel} style={{width: "auto"}}>
            <option value="all">All</option>
            <option value="upcoming">Upcoming</option>
            <option value="past">Past</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          {/* view toggle */}
          <div className={`flex rounded-lg border overflow-hidden ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
            <button onClick={() => setViewMode("grid")}
              className={`p-2 transition-colors ${viewMode === "grid" ? "bg-blue-600 text-white" : darkMode ? "bg-gray-800 text-gray-400 hover:bg-gray-700" : "bg-white text-gray-500 hover:bg-gray-50"}`}>
              <Squares2X2Icon className="h-4 w-4" />
            </button>
            <button onClick={() => setViewMode("list")}
              className={`p-2 transition-colors ${viewMode === "list" ? "bg-blue-600 text-white" : darkMode ? "bg-gray-800 text-gray-400 hover:bg-gray-700" : "bg-white text-gray-500 hover:bg-gray-50"}`}>
              <ListBulletIcon className="h-4 w-4" />
            </button>
          </div>

          <button onClick={() => refetchEvents()} title="Refresh"
            className={`p-2 rounded-lg transition-colors ${darkMode ? "text-gray-400 hover:bg-gray-700" : "text-gray-400 hover:bg-gray-100"}`}>
            <ArrowPathIcon className="h-4 w-4" />
          </button>

          <button onClick={addEvent}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm">
            <PlusIcon className="h-4 w-4" />
            Add Event
          </button>
        </div>
      </div>

      {/* ── Event count ── */}
      <p className={`text-xs mb-4 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
        {filteredEvents.length} event{filteredEvents.length !== 1 ? "s" : ""}
        {eventFilter !== "all" ? ` (${eventFilter})` : ""}
      </p>

      {/* ── Events list ── */}
      {eventsLoading && events.length === 0 ? (
        <div className={`grid gap-4 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"}`}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className={`rounded-xl border animate-pulse ${darkMode ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-100"}`}>
              <div className={`h-40 rounded-t-xl ${darkMode ? "bg-gray-700" : "bg-gray-200"}`} />
              <div className="p-4 space-y-2">
                <div className={`h-4 rounded w-3/4 ${darkMode ? "bg-gray-700" : "bg-gray-200"}`} />
                <div className={`h-3 rounded w-1/2 ${darkMode ? "bg-gray-700" : "bg-gray-200"}`} />
              </div>
            </div>
          ))}
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className={`text-center py-16 rounded-xl border ${darkMode ? "border-gray-700" : "border-gray-100"}`}>
          <CalendarIcon className={`mx-auto h-10 w-10 mb-3 ${darkMode ? "text-gray-600" : "text-gray-300"}`} />
          <p className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
            {searchTerm || eventFilter !== "all" ? "No events match your filters" : "No events yet"}
          </p>
          {!searchTerm && eventFilter === "all" && (
            <button onClick={addEvent} className="mt-3 text-sm text-blue-500 hover:underline">
              Create your first event →
            </button>
          )}
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredEvents.map((ev) => (
            <EventAdminCard key={ev.id || ev._id} event={ev}
              onEdit={handleEdit} onDelete={handleDelete}
              onDuplicate={duplicateEvent}
              onImageClick={(url) => { setSelectedImage(resolveImageUrl(url) || eventPlaceholderImage); setShowImagePreview(true); }}
            />
          ))}
        </div>
      ) : (
        // List view
        <div className={`rounded-xl border overflow-hidden ${darkMode ? "border-gray-700" : "border-gray-100"}`}>
          <table className="min-w-full">
            <thead className={`text-xs uppercase tracking-wider ${darkMode ? "bg-gray-800 text-gray-400" : "bg-gray-50 text-gray-500"}`}>
              <tr>
                <th className="px-5 py-3 text-left font-medium">Event</th>
                <th className="px-5 py-3 text-left font-medium">Date & Time</th>
                <th className="px-5 py-3 text-left font-medium">Location</th>
                <th className="px-5 py-3 text-left font-medium">Signup</th>
                <th className="px-5 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${darkMode ? "divide-gray-700" : "divide-gray-100"}`}>
              {filteredEvents.map((ev) => {
                const thumb = resolveImageUrl(ev.imageUrl);
                const signupLabel = ev.signupMode === "required" ? "Required" : ev.signupMode === "optional" ? "Optional" : null;
                return (
                  <tr key={ev.id || ev._id} className={`transition-colors ${darkMode ? "hover:bg-gray-800/50" : "hover:bg-gray-50"}`}>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className={`flex-shrink-0 w-12 h-10 rounded-lg overflow-hidden ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                          {thumb
                            ? <img src={thumb} alt="" className="w-full h-full object-cover" onError={(e) => { e.target.style.display="none"; }} />
                            : <CalendarIcon className={`w-full h-full p-2.5 ${darkMode ? "text-gray-500" : "text-gray-300"}`} />}
                        </div>
                        <div>
                          <p className={`text-sm font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>{ev.title}</p>
                          {ev.ministry && <p className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-400"}`}>{ev.ministry}</p>}
                        </div>
                      </div>
                    </td>
                    <td className={`px-5 py-3 text-sm whitespace-nowrap ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                      <div>{ev.date}</div>
                      {ev.time && <div className="text-xs">{ev.time}</div>}
                    </td>
                    <td className={`px-5 py-3 text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                      <span className="truncate max-w-[160px] block">{ev.location || "—"}</span>
                    </td>
                    <td className="px-5 py-3">
                      {signupLabel && (
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${ev.signupMode === "required" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300" : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400"}`}>
                          {signupLabel}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => duplicateEvent(ev)} title="Duplicate"
                          className={`p-1.5 rounded-lg transition-colors ${darkMode ? "text-gray-500 hover:bg-gray-700 hover:text-gray-300" : "text-gray-400 hover:bg-gray-100"}`}>
                          <DocumentDuplicateIcon className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleEdit(ev)} title="Edit"
                          className={`p-1.5 rounded-lg transition-colors ${darkMode ? "text-blue-400 hover:bg-blue-900/30" : "text-blue-500 hover:bg-blue-50"}`}>
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleDelete(ev)} title="Delete"
                          className={`p-1.5 rounded-lg transition-colors ${darkMode ? "text-red-400 hover:bg-red-900/30" : "text-red-400 hover:bg-red-50"}`}>
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Slide-over form panel ── */}
      {showForm && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/40 z-40" onClick={resetForm} />

          {/* Panel */}
          <div className={`fixed top-0 right-0 h-full w-full max-w-xl z-50 flex flex-col shadow-2xl transition-colors ${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}>

            {/* Panel header */}
            <div className={`flex items-center justify-between px-6 py-4 border-b flex-shrink-0 ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
              <div>
                <h3 className={`text-base font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
                  {formMode === "add" ? "New Event" : "Edit Event"}
                </h3>
                <p className={`text-xs mt-0.5 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                  Fill in the details below
                </p>
              </div>
              <button onClick={resetForm}
                className={`p-1.5 rounded-lg transition-colors ${darkMode ? "hover:bg-gray-700 text-gray-400" : "hover:bg-gray-100 text-gray-400"}`}>
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable form body */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
              <div className="px-6 py-5 space-y-7">

                {/* ── Basic Info ── */}
                <FormSection title="Basic Info" darkMode={darkMode}>
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                      Title <span className="text-red-500">*</span>
                    </label>
                    <input name="title" type="text" value={currentEvent.title} onChange={handleInputChange}
                      placeholder="Event title" className={inp(!!formErrors.title)} required />
                    {formErrors.title && <p className="mt-1 text-xs text-red-500">{formErrors.title}</p>}
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>Type</label>
                    <select name="type" value={currentEvent.type} onChange={handleInputChange} className={sel}>
                      {EVENT_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>Ministry / Category</label>
                    <input name="ministry" type="text" value={currentEvent.ministry || ""} onChange={handleInputChange}
                      placeholder="e.g. Youth, Women's, General" className={inp(false)} />
                  </div>
                </FormSection>

                {/* ── Schedule ── */}
                <FormSection title="Schedule" darkMode={darkMode}>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                        Date <span className="text-red-500">*</span>
                      </label>
                      <input type="date" name="date" value={currentEvent.date || ""} onChange={handleDateChange}
                        className={inp(!!formErrors.date)} required />
                      {formErrors.date && <p className="mt-1 text-xs text-red-500">{formErrors.date}</p>}
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                        Time <span className="text-red-500">*</span>
                      </label>
                      <input name="time" type="text" value={currentEvent.time || ""} onChange={handleInputChange}
                        placeholder="e.g. 10:30 AM" className={inp(!!formErrors.time)} />
                      {formErrors.time && <p className="mt-1 text-xs text-red-500">{formErrors.time}</p>}
                    </div>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>End Time <span className={`text-xs font-normal ${darkMode ? "text-gray-500" : "text-gray-400"}`}>(optional)</span></label>
                    <input name="endTime" type="text" value={currentEvent.endTime || ""} onChange={handleInputChange}
                      placeholder="e.g. 12:00 PM" className={inp(false)} />
                  </div>
                </FormSection>

                {/* ── Location & Details ── */}
                <FormSection title="Location & Details" darkMode={darkMode}>
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                      Location <span className="text-red-500">*</span>
                    </label>
                    <input name="location" type="text" value={currentEvent.location || ""} onChange={handleInputChange}
                      placeholder="Venue or address" className={inp(!!formErrors.location)} />
                    {formErrors.location && <p className="mt-1 text-xs text-red-500">{formErrors.location}</p>}
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea name="description" value={currentEvent.description || ""} onChange={handleInputChange}
                      placeholder="Describe the event…" rows={3}
                      className={inp(!!formErrors.description)} />
                    {formErrors.description && <p className="mt-1 text-xs text-red-500">{formErrors.description}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>Capacity</label>
                      <input name="capacity" type="number" min="1" value={currentEvent.capacity || ""} onChange={handleInputChange}
                        placeholder="Max attendees" className={inp(false)} />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>Organizer</label>
                      <input name="organizer" type="text" value={currentEvent.organizer || ""} onChange={handleInputChange}
                        placeholder="Name" className={inp(false)} />
                    </div>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>Contact Email</label>
                    <input name="contactEmail" type="email" value={currentEvent.contactEmail || ""} onChange={handleInputChange}
                      placeholder="contact@church.org" className={inp(false)} />
                  </div>
                </FormSection>

                {/* ── Sign-up Settings ── */}
                <FormSection title="Sign-up Settings" darkMode={darkMode}>
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>Sign-up Mode</label>
                    <select name="signupMode" value={currentEvent.signupMode || "none"} onChange={handleInputChange} className={sel}>
                      {SIGNUP_MODES.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
                    </select>
                    <p className={`mt-1 text-xs ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                      {currentEvent.signupMode === "required" && "Members must sign up to attend. Signup form will be shown on the event page."}
                      {currentEvent.signupMode === "optional" && "Signup is encouraged but not required. Form will be shown on the event page."}
                      {(!currentEvent.signupMode || currentEvent.signupMode === "none") && "No signup form will be shown on the event page."}
                    </p>
                  </div>

                  {currentEvent.signupMode !== "none" && (
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                        Sign-up Deadline <span className={`text-xs font-normal ${darkMode ? "text-gray-500" : "text-gray-400"}`}>(optional)</span>
                      </label>
                      <input type="datetime-local" name="signupDeadline" value={currentEvent.signupDeadline || ""} onChange={handleInputChange}
                        className={inp(false)} />
                      <p className={`mt-1 text-xs ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                        Sign-up form hides automatically after this date/time.
                      </p>
                    </div>
                  )}
                </FormSection>

                {/* ── Event Image ── */}
                <FormSection title="Event Image" darkMode={darkMode}>
                  <div className="flex items-start gap-5">
                    {/* Preview — landscape ratio */}
                    <div className={`flex-shrink-0 w-40 h-28 rounded-xl overflow-hidden border-2 ${darkMode ? "border-gray-600 bg-gray-700" : "border-gray-200 bg-gray-100"}`}>
                      {currentEvent.imageUrl ? (
                        <img
                          src={resolveImageUrl(currentEvent.imageUrl) || currentEvent.imageUrl}
                          alt="Preview" className="w-full h-full object-cover"
                          onError={(e) => { e.target.src = eventPlaceholderImage; e.target.onerror = null; }}
                        />
                      ) : (
                        <div className={`w-full h-full flex items-center justify-center ${darkMode ? "text-gray-600" : "text-gray-300"}`}>
                          <PhotoIcon className="h-10 w-10" />
                        </div>
                      )}
                    </div>

                    {/* Buttons */}
                    <div className="flex flex-col gap-2 pt-1">
                      <button type="button" onClick={() => fileInputRef.current?.click()} disabled={imageUploading}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-colors disabled:opacity-50 ${darkMode ? "border-gray-600 text-gray-300 hover:bg-gray-700" : "border-gray-300 text-gray-700 hover:bg-gray-50"}`}>
                        {imageUploading
                          ? <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                          : <ArrowUpTrayIcon className="h-4 w-4" />}
                        {imageUploading ? "Uploading…" : "Upload Image"}
                      </button>
                      <button type="button" onClick={() => setIsMediaSelectorOpen(true)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${darkMode ? "border-gray-600 text-gray-300 hover:bg-gray-700" : "border-gray-300 text-gray-700 hover:bg-gray-50"}`}>
                        <PhotoIcon className="h-4 w-4" />
                        Browse Library
                      </button>
                      {currentEvent.imageUrl && (
                        <button type="button"
                          onClick={() => setCurrentEvent((prev) => ({ ...prev, imageUrl: "", image: null }))}
                          className="text-xs text-red-400 hover:text-red-600 text-left transition-colors">
                          Remove image
                        </button>
                      )}
                      <p className={`text-xs leading-relaxed ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                        JPG, PNG, WebP<br/>Max 10 MB
                      </p>
                    </div>
                  </div>
                </FormSection>

                {/* ── Tags & Options ── */}
                <FormSection title="Tags & Options" darkMode={darkMode}>
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>Tags</label>
                    <input id="tags" name="tags" type="text"
                      value={currentEvent.tags?.join(", ") || ""}
                      onChange={handleTagsChange}
                      placeholder="worship, prayer, outreach"
                      className={inp(!!formErrors.tags)} />
                    <p className={`mt-1 text-xs ${darkMode ? "text-gray-500" : "text-gray-400"}`}>Comma-separated, max 10</p>
                  </div>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" name="featured" checked={!!currentEvent.featured} onChange={handleCheckboxChange}
                      className="h-4 w-4 rounded text-blue-600 border-gray-300 focus:ring-blue-500" />
                    <div>
                      <span className={`text-sm font-medium ${darkMode ? "text-gray-200" : "text-gray-700"}`}>Featured event</span>
                      <p className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-400"}`}>Shows a Featured badge on the event card</p>
                    </div>
                  </label>
                </FormSection>

              </div>{/* end form body padding */}

              {/* Panel footer — sticky at bottom */}
              <div className={`flex justify-end gap-3 px-6 py-4 border-t flex-shrink-0 sticky bottom-0 ${darkMode ? "border-gray-700 bg-gray-900" : "border-gray-200 bg-white"}`}>
                <button type="button" onClick={resetForm}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${darkMode ? "border-gray-600 text-gray-300 hover:bg-gray-800" : "border-gray-300 text-gray-700 hover:bg-gray-50"}`}>
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting}
                  className="px-5 py-2 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors inline-flex items-center gap-2">
                  {isSubmitting && <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>}
                  {isSubmitting ? "Saving…" : formMode === "add" ? "Create Event" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </>
      )}

      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
      <MediaSelector
        isOpen={isMediaSelectorOpen}
        onClose={() => setIsMediaSelectorOpen(false)}
        onSelect={handleMediaSelection}
      />
      <ImagePreview
        isOpen={showImagePreview}
        imageUrl={selectedImage}
        onClose={() => setShowImagePreview(false)}
      />
    </div>
  );
};

export default EventManager;
