import { useState, useEffect } from "react";
import { useDarkMode } from "../../contexts/DarkModeContext";
import useErrorHandler from "../../hooks/useErrorHandler";
import useRecurringEventForm from "../../hooks/useRecurringEventForm";
import RecurringEventForm from "./RecurringEventForm";
import { deleteRecurringEvent } from "../../services/api/events";
import { useRecurringEventsQuery } from "../../hooks/useRecurringEventsQuery";
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
  PencilIcon,
  TrashIcon,
  StarIcon,
} from "@heroicons/react/24/outline";

// ── Recurrence helpers ────────────────────────────────────────────────────────
const DAY_NAMES    = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const MONTH_NAMES  = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const ordinal = (n) => { const s=["th","st","nd","rd"]; const v=n%100; return n+(s[(v-20)%10]||s[v]||s[0]); };

const formatRecurrence = (ev) => {
  const t = ev.recurrenceType;
  if (t === "weekly") return `Every ${DAY_NAMES[ev.dayOfWeek] ?? "week"}`;
  if (t === "monthly") {
    if (ev.weekOfMonth != null && ev.dayOfWeek != null)
      return `${String(ev.weekOfMonth).charAt(0).toUpperCase()+String(ev.weekOfMonth).slice(1)} ${DAY_NAMES[ev.dayOfWeek]??""} monthly`;
    if (ev.dayOfMonth) return `${ordinal(ev.dayOfMonth)} of every month`;
    return "Monthly";
  }
  if (t === "yearly") return `Every ${MONTH_NAMES[ev.month] ?? "year"}`;
  return t ? t.charAt(0).toUpperCase()+t.slice(1) : "Recurring";
};

// ─────────────────────────────────────────────────────────────────────────────

const RecurringEventManager = () => {
  const { darkMode } = useDarkMode();

  const { data: recurringEvents = [], isLoading: eventsLoading, error: eventsError, refetch: refetchEvents } =
    useRecurringEventsQuery();

  const { error, errorMessage, handleError, clearError, withErrorHandling } =
    useErrorHandler("RecurringEventManager");

  const { currentEvent, formErrors, formMode, showForm, isSubmitting, setShowForm,
    handleInputChange, handleCheckboxChange, resetForm, editEvent, addEvent, submitForm } =
    useRecurringEventForm({
      onSuccess: (_, action) => {
        setSuccessMessage(`Recurring event ${action} successfully!`);
        refetchEvents();
        setTimeout(() => setSuccessMessage(""), 3000);
      },
      onError: (err) => handleError(err, "Recurring Event Form Submission"),
    });

  const [searchTerm,      setSearchTerm]      = useState("");
  const [viewMode,        setViewMode]        = useState("grid");
  const [successMessage,  setSuccessMessage]  = useState("");

  useEffect(() => {
    if (eventsError) handleError(eventsError, "Failed to load recurring events");
  }, [eventsError, handleError]);

  const handleEdit = withErrorHandling((ev) => editEvent(ev), { context: "Recurring Event Editing" });

  const handleDelete = withErrorHandling(async (ev) => {
    if (!window.confirm("Delete this recurring event? This cannot be undone.")) return;
    const id = ev.id || ev._id;
    if (!id) throw new Error("Missing event ID");
    await deleteRecurringEvent(id);
    setSuccessMessage("Recurring event deleted.");
    await refetchEvents();
    setTimeout(() => setSuccessMessage(""), 3000);
  }, { context: "Recurring Event Deletion" });

  const filtered = recurringEvents.filter((ev) =>
    !searchTerm ||
    ev.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ev.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ev.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ── Style helpers ──────────────────────────────────────────────────────────
  const card = darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100";
  const actionBtn = (red) => `p-1.5 rounded-lg transition-colors ${
    red
      ? darkMode ? "text-red-400 hover:bg-red-900/30" : "text-red-400 hover:bg-red-50"
      : darkMode ? "text-gray-400 hover:bg-gray-700 hover:text-gray-200" : "text-gray-400 hover:bg-gray-100"
  }`;

  return (
    <div className="space-y-5">

      {/* Alerts */}
      {successMessage && (
        <div className={`flex items-center gap-2 p-4 rounded-lg border text-sm ${darkMode ? "bg-green-900/20 border-green-800 text-green-300" : "bg-green-50 border-green-200 text-green-700"}`}>
          <CheckCircleIcon className="h-5 w-5 flex-shrink-0" />
          {successMessage}
        </div>
      )}
      {error && (
        <div className={`flex items-start gap-3 p-4 rounded-lg border text-sm ${darkMode ? "bg-red-900/20 border-red-800 text-red-300" : "bg-red-50 border-red-200 text-red-700"}`}>
          <ExclamationCircleIcon className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <span className="flex-1">{errorMessage}</span>
          <button onClick={clearError} className="text-xs underline opacity-70 hover:opacity-100">Dismiss</button>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm w-full">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search recurring events…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`pl-9 pr-3 py-2 w-full rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-red-600 transition-colors ${
              darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
            }`}
          />
        </div>

        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className={`flex rounded-lg border overflow-hidden ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
            <button onClick={() => setViewMode("grid")}
              className={`p-2 transition-colors ${viewMode === "grid" ? "bg-red-600 text-white" : darkMode ? "bg-gray-800 text-gray-400 hover:bg-gray-700" : "bg-white text-gray-500 hover:bg-gray-50"}`}>
              <Squares2X2Icon className="h-4 w-4" />
            </button>
            <button onClick={() => setViewMode("list")}
              className={`p-2 transition-colors ${viewMode === "list" ? "bg-red-600 text-white" : darkMode ? "bg-gray-800 text-gray-400 hover:bg-gray-700" : "bg-white text-gray-500 hover:bg-gray-50"}`}>
              <ListBulletIcon className="h-4 w-4" />
            </button>
          </div>

          <button onClick={() => refetchEvents()} title="Refresh"
            className={`p-2 rounded-lg transition-colors ${darkMode ? "text-gray-400 hover:bg-gray-700" : "text-gray-400 hover:bg-gray-100"}`}>
            <ArrowPathIcon className="h-4 w-4" />
          </button>

          <button onClick={() => addEvent()}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors shadow-sm">
            <PlusIcon className="h-4 w-4" />
            Add Recurring Event
          </button>
        </div>
      </div>

      <p className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
        {filtered.length} recurring event{filtered.length !== 1 ? "s" : ""}
      </p>

      {/* Content */}
      {eventsLoading && recurringEvents.length === 0 ? (
        <div className="flex items-center justify-center h-48">
          <div className="h-8 w-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className={`text-center py-16 rounded-xl border ${darkMode ? "border-gray-700" : "border-gray-100"}`}>
          <CalendarIcon className={`mx-auto h-10 w-10 mb-3 ${darkMode ? "text-gray-600" : "text-gray-300"}`} />
          <p className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
            {searchTerm ? "No events match your search" : "No recurring events yet"}
          </p>
          {!searchTerm && (
            <button onClick={() => addEvent()} className="mt-3 text-sm text-red-600 hover:underline">
              Add your first recurring event →
            </button>
          )}
        </div>
      ) : viewMode === "grid" ? (

        /* ── Grid ── */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((ev) => (
            <div key={ev.id || ev._id}
              className={`rounded-xl border overflow-hidden transition-all hover:shadow-md hover:-translate-y-0.5 flex flex-col ${card}`}>
              <div className="p-4 flex flex-col flex-1">

                {/* Title + featured */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className={`font-semibold text-sm leading-snug line-clamp-2 flex-1 ${darkMode ? "text-white" : "text-gray-900"}`}>
                    {ev.title}
                  </h3>
                  {ev.featured && (
                    <span title="Featured" className="flex-shrink-0 mt-0.5">
                      <StarIcon className="h-4 w-4 text-amber-400" />
                    </span>
                  )}
                </div>

                {/* Recurrence badge */}
                <span className={`inline-flex items-center gap-1 self-start px-2 py-0.5 rounded-full text-xs font-medium mb-3 ${
                  darkMode ? "bg-red-900/30 text-red-400" : "bg-red-50 text-red-700"
                }`}>
                  <ArrowPathIcon className="h-3 w-3" />
                  {formatRecurrence(ev)}
                </span>

                {/* Time + Location */}
                <div className={`space-y-1 text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                  <div className="flex items-center gap-1.5">
                    <ClockIcon className="h-3.5 w-3.5 flex-shrink-0" />
                    <span>{ev.time || "—"}</span>
                  </div>
                  {ev.location && (
                    <div className="flex items-center gap-1.5">
                      <MapPinIcon className="h-3.5 w-3.5 flex-shrink-0" />
                      <span className="truncate">{ev.location}</span>
                    </div>
                  )}
                </div>

                {ev.description && (
                  <p className={`mt-2 text-xs line-clamp-2 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                    {ev.description}
                  </p>
                )}

                {/* Footer */}
                <div className={`mt-auto pt-3 flex items-center justify-between border-t ${darkMode ? "border-gray-700" : "border-gray-100"}`}>
                  <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                    ev.active !== false
                      ? darkMode ? "bg-green-900/30 text-green-400" : "bg-green-100 text-green-700"
                      : darkMode ? "bg-gray-700 text-gray-500" : "bg-gray-100 text-gray-500"
                  }`}>
                    {ev.active !== false ? "Active" : "Inactive"}
                  </span>
                  <div className="flex items-center gap-0.5">
                    <button onClick={() => handleEdit(ev)} title="Edit" className={actionBtn(false)}>
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button onClick={() => handleDelete(ev)} title="Delete" className={actionBtn(true)}>
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      ) : (

        /* ── List ── */
        <div className={`rounded-xl border overflow-hidden ${darkMode ? "border-gray-700" : "border-gray-100"}`}>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className={`text-xs uppercase tracking-wider ${darkMode ? "bg-gray-800 text-gray-400" : "bg-gray-50 text-gray-500"}`}>
                <tr>
                  <th className="px-5 py-3 text-left font-medium">Event</th>
                  <th className="px-5 py-3 text-left font-medium">Recurrence</th>
                  <th className="px-5 py-3 text-left font-medium">Time</th>
                  <th className="px-5 py-3 text-left font-medium">Location</th>
                  <th className="px-5 py-3 text-left font-medium">Status</th>
                  <th className="px-5 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${darkMode ? "divide-gray-700" : "divide-gray-100"}`}>
                {filtered.map((ev) => (
                  <tr key={ev.id || ev._id} className={`transition-colors ${darkMode ? "hover:bg-gray-800/50" : "hover:bg-gray-50"}`}>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        {ev.featured && <StarIcon className="h-3.5 w-3.5 text-amber-400 flex-shrink-0" />}
                        <div>
                          <p className={`text-sm font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>{ev.title}</p>
                          {ev.description && (
                            <p className={`text-xs truncate max-w-[200px] ${darkMode ? "text-gray-500" : "text-gray-400"}`}>{ev.description}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                        darkMode ? "bg-red-900/30 text-red-400" : "bg-red-50 text-red-700"
                      }`}>
                        <ArrowPathIcon className="h-3 w-3" />
                        {formatRecurrence(ev)}
                      </span>
                    </td>
                    <td className={`px-5 py-3 text-sm whitespace-nowrap ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                      {ev.time || "—"}
                    </td>
                    <td className={`px-5 py-3 text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                      <span className="truncate max-w-[160px] block">{ev.location || "—"}</span>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        ev.active !== false
                          ? darkMode ? "bg-green-900/30 text-green-400" : "bg-green-100 text-green-700"
                          : darkMode ? "bg-gray-700 text-gray-500" : "bg-gray-100 text-gray-500"
                      }`}>
                        {ev.active !== false ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => handleEdit(ev)} title="Edit" className={actionBtn(false)}>
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleDelete(ev)} title="Delete" className={actionBtn(true)}>
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 py-8">
            <div className="fixed inset-0 bg-black/50" onClick={() => setShowForm(false)} />
            <div className={`relative w-full max-w-4xl rounded-xl shadow-2xl overflow-hidden ${darkMode ? "bg-gray-800" : "bg-white"}`}>
              <div className={`flex items-center justify-between px-6 py-4 border-b ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
                <h3 className={`text-base font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
                  {formMode === "add" ? "New Recurring Event" : "Edit Recurring Event"}
                </h3>
                <button onClick={() => setShowForm(false)}
                  className={`p-1.5 rounded-lg transition-colors ${darkMode ? "hover:bg-gray-700 text-gray-400" : "hover:bg-gray-100 text-gray-400"}`}>
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
              <div className="px-6 py-5 overflow-y-auto max-h-[80vh]">
                <RecurringEventForm
                  currentEvent={currentEvent}
                  formErrors={formErrors}
                  formMode={formMode}
                  isSubmitting={isSubmitting}
                  handleInputChange={handleInputChange}
                  handleCheckboxChange={handleCheckboxChange}
                  submitForm={submitForm}
                  onCancel={() => setShowForm(false)}
                  darkMode={darkMode}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecurringEventManager;
