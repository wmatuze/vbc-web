import React, { useState, useEffect } from "react";
import {
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  UsersIcon,
  CalendarDaysIcon,
  ClockIcon,
  MapPinIcon,
  BookOpenIcon,
  AcademicCapIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CheckIcon,
  XMarkIcon,
  ClipboardDocumentListIcon,
  ArrowPathIcon,
  MagnifyingGlassIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";
import { getApiUrl, getAuthHeaders } from "../../services/api/core";
import { toast } from "react-toastify";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const levelBadge = (level) => {
  const map = {
    beginner:     "bg-green-100  dark:bg-green-900/40  text-green-800  dark:text-green-300",
    intermediate: "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-300",
    advanced:     "bg-red-100    dark:bg-red-900/40    text-red-800    dark:text-red-300",
  };
  return map[level] || "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300";
};

const statusBadge = (status) => {
  const map = {
    upcoming:  "bg-blue-100  dark:bg-blue-900/40  text-blue-800  dark:text-blue-300",
    active:    "bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300",
    completed: "bg-gray-100  dark:bg-gray-700     text-gray-600  dark:text-gray-400",
  };
  return map[status] || "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400";
};

const regStatusBadge = (status) => {
  const map = {
    pending:   "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-300",
    approved:  "bg-blue-100   dark:bg-blue-900/40   text-blue-800   dark:text-blue-300",
    attending: "bg-green-100  dark:bg-green-900/40  text-green-800  dark:text-green-300",
    completed: "bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-300",
    rejected:  "bg-red-100    dark:bg-red-900/40    text-red-800    dark:text-red-300",
    cancelled: "bg-red-100    dark:bg-red-900/40    text-red-800    dark:text-red-300",
  };
  return map[status] || "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400";
};

const inputCls =
  "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";

const labelCls =
  "block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5";

const DAYS = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

// ─── Delete confirmation inline button ───────────────────────────────────────
const DeleteButton = ({ onConfirm, label = "Delete", size = "sm" }) => {
  const [confirming, setConfirming] = useState(false);
  if (confirming) {
    return (
      <span className="inline-flex items-center gap-1">
        <button onClick={() => { onConfirm(); setConfirming(false); }}
          className="text-xs font-medium text-red-600 dark:text-red-400 hover:underline">
          Confirm
        </button>
        <span className="text-gray-300 dark:text-gray-600">·</span>
        <button onClick={() => setConfirming(false)}
          className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
          Cancel
        </button>
      </span>
    );
  }
  return (
    <button onClick={() => setConfirming(true)}
      className={`p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors`}
      title={label}>
      <TrashIcon className={size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4"} />
    </button>
  );
};

// ─── Main component ───────────────────────────────────────────────────────────

const EMPTY_CLASS = {
  title: "", description: "",
  duration: { value: 8, unit: "weeks" },
  level: "beginner", prerequisites: [],
  instructor: { name: "", email: "", phone: "", bio: "" },
  category: "discipleship", curriculum: [],
};

const EMPTY_SESSION = {
  classId: "", cohortName: "", startDate: "", endDate: "",
  schedule: { day: "Sunday", time: "6:00 PM - 7:30 PM", frequency: "weekly" },
  location: "", capacity: 15,
  facilitator: { name: "", email: "", phone: "" },
  registrationDeadline: "",
};

const DiscipleshipAdmin = () => {
  const [classes,          setClasses]          = useState([]);
  const [sessions,         setSessions]         = useState([]);
  const [registrations,    setRegistrations]    = useState([]);
  const [loading,          setLoading]          = useState(true);
  const [saving,           setSaving]           = useState(false);
  const [certLoading,      setCertLoading]      = useState(null); // registration _id
  const [activeTab,        setActiveTab]        = useState("classes");
  const [showModal,        setShowModal]        = useState(false);
  const [modalType,        setModalType]        = useState("");
  const [selectedItem,     setSelectedItem]     = useState(null);
  const [expandedClass,    setExpandedClass]    = useState(null);
  const [classForm,        setClassForm]        = useState(EMPTY_CLASS);
  const [sessionForm,      setSessionForm]      = useState(EMPTY_SESSION);
  // Students tab filters
  const [studSearch,       setStudSearch]       = useState("");
  const [studStatusFilter, setStudStatusFilter] = useState("all");
  const [studClassFilter,  setStudClassFilter]  = useState("all");

  const API = getApiUrl();

  useEffect(() => {
    Promise.all([fetchClasses(), fetchSessions(), fetchRegistrations()]).finally(() => setLoading(false));
  }, []);

  const fetchClasses = async () => {
    try {
      const res  = await fetch(`${API}/api/discipleship/classes`, { headers: getAuthHeaders() });
      const data = await res.json();
      if (data.success) setClasses(data.data);
    } catch { toast.error("Failed to load classes."); }
  };

  const fetchSessions = async () => {
    try {
      const res  = await fetch(`${API}/api/discipleship/sessions`, { headers: getAuthHeaders() });
      const data = await res.json();
      if (data.success) setSessions(data.data);
    } catch { toast.error("Failed to load sessions."); }
  };

  const fetchRegistrations = async () => {
    try {
      const res  = await fetch(`${API}/api/discipleship/registrations`, { headers: getAuthHeaders() });
      const data = await res.json();
      if (data.success) setRegistrations(data.data);
    } catch { toast.error("Failed to load registrations."); }
  };

  const sendCertificate = async (reg) => {
    setCertLoading(reg._id);
    try {
      const res  = await fetch(`${API}/api/discipleship/registrations/${reg._id}/certificate`, {
        method: "POST",
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Certificate sent to ${reg.email}`);
        await fetchRegistrations();
      } else {
        toast.error(data.error || "Failed to send certificate.");
      }
    } catch { toast.error("Failed to send certificate."); }
    finally { setCertLoading(null); }
  };

  // ── Class handlers ──────────────────────────────────────────────────────────

  const openCreateClass = () => {
    setModalType("createClass"); setSelectedItem(null); setClassForm(EMPTY_CLASS); setShowModal(true);
  };

  const openEditClass = (item) => {
    setModalType("editClass"); setSelectedItem(item); setClassForm(item); setShowModal(true);
  };

  const submitClass = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const url    = selectedItem ? `${API}/api/discipleship/classes/${selectedItem._id}` : `${API}/api/discipleship/classes`;
      const method = selectedItem ? "PUT" : "POST";
      const res    = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify(classForm),
      });
      const data = await res.json();
      if (data.success) {
        await fetchClasses();
        setShowModal(false);
        toast.success(selectedItem ? "Class updated." : "Class created.");
      } else {
        toast.error(data.error || "Failed to save class.");
      }
    } catch { toast.error("Failed to save class."); }
    finally { setSaving(false); }
  };

  const deleteClass = async (id) => {
    try {
      const res  = await fetch(`${API}/api/discipleship/classes/${id}`, { method: "DELETE", headers: getAuthHeaders() });
      const data = await res.json();
      if (data.success) { await fetchClasses(); toast.success("Class deleted."); }
      else toast.error(data.error || "Failed to delete class.");
    } catch { toast.error("Failed to delete class."); }
  };

  // ── Session handlers ────────────────────────────────────────────────────────

  const openCreateSession = (classId = "") => {
    setModalType("createSession"); setSelectedItem(null);
    setSessionForm({ ...EMPTY_SESSION, classId }); setShowModal(true);
  };

  const openEditSession = (session) => {
    setModalType("editSession"); setSelectedItem(session);
    setSessionForm({
      ...session,
      startDate:            session.startDate            ? new Date(session.startDate).toISOString().split("T")[0]            : "",
      endDate:              session.endDate              ? new Date(session.endDate).toISOString().split("T")[0]              : "",
      registrationDeadline: session.registrationDeadline ? new Date(session.registrationDeadline).toISOString().split("T")[0] : "",
    });
    setShowModal(true);
  };

  const submitSession = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const url    = selectedItem ? `${API}/api/discipleship/sessions/${selectedItem._id}` : `${API}/api/discipleship/sessions`;
      const method = selectedItem ? "PUT" : "POST";
      const res    = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify(sessionForm),
      });
      const data = await res.json();
      if (data.success) {
        await fetchSessions();
        setShowModal(false);
        toast.success(selectedItem ? "Session updated." : "Session created.");
        if (!selectedItem) setActiveTab("sessions"); // navigate to sessions tab after creating
      } else {
        toast.error(data.error || "Failed to save session.");
      }
    } catch { toast.error("Failed to save session."); }
    finally { setSaving(false); }
  };

  // ── Curriculum helpers ──────────────────────────────────────────────────────

  const addWeek = () =>
    setClassForm((p) => ({
      ...p,
      curriculum: [...p.curriculum, { week: p.curriculum.length + 1, title: "", description: "", topics: [] }],
    }));

  const updateWeek = (i, field, val) =>
    setClassForm((p) => ({ ...p, curriculum: p.curriculum.map((w, idx) => idx === i ? { ...w, [field]: val } : w) }));

  const removeWeek = (i) =>
    setClassForm((p) => ({ ...p, curriculum: p.curriculum.filter((_, idx) => idx !== i) }));

  // ── Loading ─────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 gap-3">
        <ArrowPathIcon className="h-6 w-6 text-gray-400 dark:text-gray-500 animate-spin" />
        <p className="text-sm text-gray-500 dark:text-gray-400">Loading…</p>
      </div>
    );
  }

  const classSessions = (classId) => sessions.filter((s) => s.classId?._id === classId);

  return (
    <div className="space-y-6">

      {/* ── Header ──────────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-3 justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Discipleship</h1>
        <div className="flex gap-2">
          <button onClick={openCreateClass}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-2 rounded-md transition-colors">
            <PlusIcon className="h-4 w-4" /> New Class
          </button>
          <button onClick={() => openCreateSession()}
            className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white text-sm px-3 py-2 rounded-md transition-colors">
            <PlusIcon className="h-4 w-4" /> New Session
          </button>
        </div>
      </div>

      {/* ── Tabs ────────────────────────────────────────────────────── */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex gap-6">
          {[
            { id: "classes",  label: "Classes",  Icon: BookOpenIcon,              count: classes.length       },
            { id: "sessions", label: "Sessions", Icon: CalendarDaysIcon,          count: sessions.length      },
            { id: "students", label: "Students", Icon: ClipboardDocumentListIcon, count: registrations.length },
          ].map(({ id, label, Icon, count }) => (
            <button key={id} onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 py-2.5 px-1 border-b-2 text-sm font-medium transition-colors ${
                activeTab === id
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}>
              <Icon className="h-4 w-4" />
              {label}
              <span className="ml-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs px-1.5 py-0.5 rounded-full">
                {count}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* ── CLASSES TAB ─────────────────────────────────────────────── */}
      {activeTab === "classes" && (
        <div className="space-y-3">
          <div className="flex justify-end">
            <button onClick={() => Promise.all([fetchClasses(), fetchSessions()])}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 rounded-md transition-colors">
              <ArrowPathIcon className="h-3.5 w-3.5" /> Refresh
            </button>
          </div>
          {classes.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <BookOpenIcon className="h-10 w-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400 text-sm">No classes yet.</p>
              <button onClick={openCreateClass} className="mt-3 text-sm text-blue-600 dark:text-blue-400 hover:underline">
                Create your first class →
              </button>
            </div>
          ) : (
            classes.map((cls) => (
              <div key={cls._id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <h3 className="text-base font-semibold text-gray-900 dark:text-white">{cls.title}</h3>
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${levelBadge(cls.level)}`}>{cls.level}</span>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">{cls.description}</p>
                      <div className="flex flex-wrap gap-4 text-xs text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1.5"><ClockIcon className="h-3.5 w-3.5" />{cls.durationDisplay}</span>
                        <span className="flex items-center gap-1.5"><AcademicCapIcon className="h-3.5 w-3.5" />{cls.instructor?.name}</span>
                        <span className="flex items-center gap-1.5"><BookOpenIcon className="h-3.5 w-3.5" />{cls.curriculumLength} sessions</span>
                        <span className="flex items-center gap-1.5"><UsersIcon className="h-3.5 w-3.5" />{classSessions(cls._id).length} cohorts</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button onClick={() => setExpandedClass(expandedClass === cls._id ? null : cls._id)}
                        className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded transition-colors" title="Expand">
                        {expandedClass === cls._id ? <ChevronUpIcon className="h-4 w-4" /> : <ChevronDownIcon className="h-4 w-4" />}
                      </button>
                      <button onClick={() => openCreateSession(cls._id)}
                        className="p-1.5 text-green-600 hover:text-green-700 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded transition-colors" title="Add Session">
                        <PlusIcon className="h-4 w-4" />
                      </button>
                      <button onClick={() => openEditClass(cls)}
                        className="p-1.5 text-blue-600 hover:text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors" title="Edit">
                        <PencilSquareIcon className="h-4 w-4" />
                      </button>
                      <DeleteButton onConfirm={() => deleteClass(cls._id)} label="Delete Class" />
                    </div>
                  </div>

                  {/* Expanded panel */}
                  {expandedClass === cls._id && (
                    <div className="mt-5 pt-5 border-t border-gray-100 dark:border-gray-700 space-y-5">

                      {cls.prerequisites?.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">Prerequisites</p>
                          <div className="flex flex-wrap gap-1.5">
                            {cls.prerequisites.map((p, i) => (
                              <span key={i} className="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded">
                                {p}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {cls.curriculum?.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">
                            Curriculum ({cls.curriculum.length} weeks)
                          </p>
                          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-2">
                            {cls.curriculum.map((week, i) => (
                              <div key={i} className="bg-gray-50 dark:bg-gray-700/50 rounded p-3 border border-gray-100 dark:border-gray-600">
                                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">Week {week.week}: {week.title}</p>
                                {week.description && <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{week.description}</p>}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">Active Sessions</p>
                        {classSessions(cls._id).length === 0 ? (
                          <p className="text-xs text-gray-400 dark:text-gray-500 italic">
                            No sessions yet.{" "}
                            <button onClick={() => openCreateSession(cls._id)} className="text-green-600 dark:text-green-400 hover:underline">Add one →</button>
                          </p>
                        ) : (
                          <div className="space-y-2">
                            {classSessions(cls._id).map((s) => (
                              <div key={s._id} className="bg-gray-50 dark:bg-gray-700/50 rounded p-3 border border-gray-100 dark:border-gray-600 flex justify-between items-center gap-4">
                                <div className="min-w-0">
                                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{s.cohortName}</p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">{s.schedule?.day}s · {s.schedule?.time} · {s.location}</p>
                                  <p className="text-xs text-gray-400 dark:text-gray-500">{s.enrolledCount}/{s.capacity} enrolled</p>
                                </div>
                                <button onClick={() => openEditSession(s)}
                                  className="p-1.5 text-blue-600 hover:text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors flex-shrink-0">
                                  <PencilSquareIcon className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ── SESSIONS TAB ────────────────────────────────────────────── */}
      {activeTab === "sessions" && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button onClick={fetchSessions}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 rounded-md transition-colors">
              <ArrowPathIcon className="h-3.5 w-3.5" /> Refresh
            </button>
          </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
          {sessions.length === 0 ? (
            <div className="col-span-full text-center py-16 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <CalendarDaysIcon className="h-10 w-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400 text-sm">No sessions yet.</p>
            </div>
          ) : (
            sessions.map((s) => (
              <div key={s._id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-5 flex flex-col">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white leading-snug flex-1 min-w-0 pr-2">{s.cohortName}</h3>
                  <span className={`px-2 py-0.5 text-xs font-medium rounded-full flex-shrink-0 ${statusBadge(s.status)}`}>{s.status}</span>
                </div>

                <div className="space-y-1.5 text-xs text-gray-500 dark:text-gray-400 mb-4 flex-1">
                  <div className="flex items-center gap-2"><BookOpenIcon className="h-3.5 w-3.5 flex-shrink-0" /><span className="truncate">{s.classId?.title}</span></div>
                  <div className="flex items-center gap-2"><CalendarDaysIcon className="h-3.5 w-3.5 flex-shrink-0" /><span>{s.dateRange}</span></div>
                  <div className="flex items-center gap-2"><ClockIcon className="h-3.5 w-3.5 flex-shrink-0" /><span>{s.schedule?.day}s · {s.schedule?.time}</span></div>
                  <div className="flex items-center gap-2"><MapPinIcon className="h-3.5 w-3.5 flex-shrink-0" /><span className="truncate">{s.location}</span></div>
                  <div className="flex items-center gap-2"><UsersIcon className="h-3.5 w-3.5 flex-shrink-0" /><span>{s.enrolledCount}/{s.capacity} enrolled</span></div>
                </div>

                <button onClick={() => openEditSession(s)}
                  className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-md transition-colors">
                  <PencilSquareIcon className="h-3.5 w-3.5" /> Edit Session
                </button>
              </div>
            ))
          )}
        </div>
        </div>
      )}

      {/* ── STUDENTS TAB ────────────────────────────────────────────── */}
      {activeTab === "students" && (() => {
        const term = studSearch.toLowerCase();
        const filtered = registrations.filter((r) => {
          const matchSearch =
            !term ||
            r.fullName?.toLowerCase().includes(term) ||
            r.email?.toLowerCase().includes(term) ||
            r.phone?.toLowerCase().includes(term);
          const matchStatus = studStatusFilter === "all" || r.status === studStatusFilter;
          const matchClass  = studClassFilter  === "all" || r.classId?._id === studClassFilter || r.classId === studClassFilter;
          return matchSearch && matchStatus && matchClass;
        });

        const stats = {
          total:     registrations.length,
          attending: registrations.filter((r) => r.status === "attending").length,
          completed: registrations.filter((r) => r.status === "completed").length,
        };

        return (
          <div className="space-y-5">

            {/* Stats strip */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Total Enrolled", value: stats.total,     color: "text-gray-900 dark:text-white"   },
                { label: "Currently Attending", value: stats.attending, color: "text-green-600 dark:text-green-400" },
                { label: "Completed",      value: stats.completed, color: "text-purple-600 dark:text-purple-400" },
              ].map(({ label, value, color }) => (
                <div key={label} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 text-center">
                  <p className={`text-2xl font-bold ${color}`}>{value}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{label}</p>
                </div>
              ))}
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
              <div className="relative flex-1 min-w-[200px]">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search by name, email or phone…"
                  value={studSearch}
                  onChange={(e) => setStudSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <select value={studStatusFilter} onChange={(e) => setStudStatusFilter(e.target.value)}
                className="py-2 pl-3 pr-8 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500">
                <option value="all">All Statuses</option>
                {["pending","approved","attending","completed","rejected","cancelled"].map((s) => (
                  <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </select>
              <select value={studClassFilter} onChange={(e) => setStudClassFilter(e.target.value)}
                className="py-2 pl-3 pr-8 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500">
                <option value="all">All Classes</option>
                {classes.map((c) => <option key={c._id} value={c._id}>{c.title}</option>)}
              </select>
              <button onClick={fetchRegistrations}
                className="flex items-center gap-1.5 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 rounded-md transition-colors">
                <ArrowPathIcon className="h-4 w-4" /> Refresh
              </button>
            </div>

            {/* Student list */}
            {filtered.length === 0 ? (
              <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <AcademicCapIcon className="h-10 w-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400 text-sm">No students match your filters.</p>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                {/* Desktop table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                      <tr>
                        <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Student</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Class / Session</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Status</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Registered</th>
                        <th className="px-4 py-3"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                      {filtered.map((r) => (
                        <tr key={r._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                          <td className="px-4 py-3">
                            <p className="font-medium text-gray-900 dark:text-white">{r.fullName}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{r.email}</p>
                            {r.phone && <p className="text-xs text-gray-400 dark:text-gray-500">{r.phone}</p>}
                          </td>
                          <td className="px-4 py-3">
                            <p className="text-gray-900 dark:text-white">{r.classId?.title || "—"}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{r.preferredSession}</p>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${regStatusBadge(r.status)}`}>
                              {r.status?.charAt(0).toUpperCase() + r.status?.slice(1)}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-xs text-gray-500 dark:text-gray-400">
                            {r.registrationDate ? new Date(r.registrationDate).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "—"}
                          </td>
                          <td className="px-4 py-3 text-right">
                            {(r.status === "attending" || r.status === "completed") && (
                              <button
                                onClick={() => sendCertificate(r)}
                                disabled={certLoading === r._id}
                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white rounded-md disabled:opacity-50 transition-colors ${
                                  r.status === "completed"
                                    ? "bg-gray-500 hover:bg-gray-600"
                                    : "bg-purple-600 hover:bg-purple-700"
                                }`}
                              >
                                {certLoading === r._id
                                  ? <ArrowPathIcon className="h-3.5 w-3.5 animate-spin" />
                                  : <EnvelopeIcon className="h-3.5 w-3.5" />
                                }
                                {r.status === "completed" ? "Resend Certificate" : "Complete + Send Certificate"}
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile cards */}
                <div className="md:hidden divide-y divide-gray-100 dark:divide-gray-700">
                  {filtered.map((r) => (
                    <div key={r._id} className="p-4 space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">{r.fullName}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{r.email}</p>
                        </div>
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full flex-shrink-0 ${regStatusBadge(r.status)}`}>
                          {r.status?.charAt(0).toUpperCase() + r.status?.slice(1)}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 space-y-0.5">
                        <p><span className="font-medium text-gray-700 dark:text-gray-300">Class:</span> {r.classId?.title || "—"}</p>
                        <p><span className="font-medium text-gray-700 dark:text-gray-300">Session:</span> {r.preferredSession}</p>
                        {r.registrationDate && (
                          <p><span className="font-medium text-gray-700 dark:text-gray-300">Registered:</span> {new Date(r.registrationDate).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</p>
                        )}
                      </div>
                      {(r.status === "attending" || r.status === "completed") && (
                        <button
                          onClick={() => sendCertificate(r)}
                          disabled={certLoading === r._id}
                          className={`w-full flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-white rounded-md disabled:opacity-50 transition-colors ${
                            r.status === "completed"
                              ? "bg-gray-500 hover:bg-gray-600"
                              : "bg-purple-600 hover:bg-purple-700"
                          }`}
                        >
                          {certLoading === r._id
                            ? <ArrowPathIcon className="h-3.5 w-3.5 animate-spin" />
                            : <EnvelopeIcon className="h-3.5 w-3.5" />
                          }
                          {r.status === "completed" ? "Resend Certificate" : "Complete + Send Certificate"}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })()}

      {/* ── MODAL ───────────────────────────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-3xl my-8 shadow-2xl">

            {/* Modal header */}
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center z-10 rounded-t-lg">
              <h3 className="text-base font-bold text-gray-900 dark:text-white">
                {modalType === "createClass"   && "Create New Class"}
                {modalType === "editClass"     && "Edit Class"}
                {modalType === "createSession" && "Create New Session"}
                {modalType === "editSession"   && "Edit Session"}
              </h3>
              <button onClick={() => setShowModal(false)}
                className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded transition-colors">
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            {/* ── Class form ── */}
            {(modalType === "createClass" || modalType === "editClass") && (
              <form onSubmit={submitClass} className="p-6 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Class Title *</label>
                    <input type="text" required value={classForm.title}
                      onChange={(e) => setClassForm((p) => ({ ...p, title: e.target.value }))}
                      className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Level</label>
                    <select value={classForm.level}
                      onChange={(e) => setClassForm((p) => ({ ...p, level: e.target.value }))}
                      className={inputCls}>
                      {["beginner","intermediate","advanced"].map((l) => (
                        <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className={labelCls}>Description *</label>
                  <textarea required rows={3} value={classForm.description}
                    onChange={(e) => setClassForm((p) => ({ ...p, description: e.target.value }))}
                    className={inputCls} />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div>
                    <label className={labelCls}>Duration</label>
                    <input type="number" min={1} value={classForm.duration.value}
                      onChange={(e) => setClassForm((p) => ({ ...p, duration: { ...p.duration, value: +e.target.value } }))}
                      className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Unit</label>
                    <select value={classForm.duration.unit}
                      onChange={(e) => setClassForm((p) => ({ ...p, duration: { ...p.duration, unit: e.target.value } }))}
                      className={inputCls}>
                      <option value="weeks">Weeks</option>
                      <option value="months">Months</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Category</label>
                    <select value={classForm.category}
                      onChange={(e) => setClassForm((p) => ({ ...p, category: e.target.value }))}
                      className={inputCls}>
                      {["discipleship","leadership","ministry","biblical_studies","spiritual_growth"].map((c) => (
                        <option key={c} value={c}>{c.replace("_", " ")}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Instructor */}
                <div>
                  <p className={labelCls}>Instructor</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className={labelCls}>Name *</label>
                      <input type="text" required value={classForm.instructor.name}
                        onChange={(e) => setClassForm((p) => ({ ...p, instructor: { ...p.instructor, name: e.target.value } }))}
                        className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Email</label>
                      <input type="email" value={classForm.instructor.email}
                        onChange={(e) => setClassForm((p) => ({ ...p, instructor: { ...p.instructor, email: e.target.value } }))}
                        className={inputCls} />
                    </div>
                  </div>
                </div>

                {/* Curriculum */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <p className={labelCls}>Curriculum ({classForm.curriculum.length} weeks)</p>
                    <button type="button" onClick={addWeek}
                      className="flex items-center gap-1 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded transition-colors">
                      <PlusIcon className="h-3.5 w-3.5" /> Add Week
                    </button>
                  </div>
                  <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                    {classForm.curriculum.map((week, i) => (
                      <div key={i} className="border border-gray-200 dark:border-gray-600 rounded-md p-3">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">Week {week.week}</span>
                          <button type="button" onClick={() => removeWeek(i)}
                            className="text-red-400 hover:text-red-600 dark:text-red-500">
                            <TrashIcon className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
                          <input type="text" placeholder="Title" value={week.title}
                            onChange={(e) => updateWeek(i, "title", e.target.value)}
                            className={inputCls} />
                          <input type="text" placeholder="Topics (comma-separated)"
                            value={week.topics?.join(", ") || ""}
                            onChange={(e) => updateWeek(i, "topics", e.target.value.split(",").map((t) => t.trim()))}
                            className={inputCls} />
                        </div>
                        <textarea rows={2} placeholder="Description" value={week.description}
                          onChange={(e) => updateWeek(i, "description", e.target.value)}
                          className={inputCls} />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    Cancel
                  </button>
                  <button type="submit" disabled={saving}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm px-4 py-2.5 rounded-md transition-colors">
                    {saving ? <ArrowPathIcon className="h-4 w-4 animate-spin" /> : <CheckIcon className="h-4 w-4" />}
                    {selectedItem ? "Update Class" : "Create Class"}
                  </button>
                </div>
              </form>
            )}

            {/* ── Session form ── */}
            {(modalType === "createSession" || modalType === "editSession") && (
              <form onSubmit={submitSession} className="p-6 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Class *</label>
                    <select required value={sessionForm.classId}
                      onChange={(e) => setSessionForm((p) => ({ ...p, classId: e.target.value }))}
                      className={inputCls}>
                      <option value="">Select a class…</option>
                      {classes.map((c) => <option key={c._id} value={c._id}>{c.title}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Cohort Name *</label>
                    <input type="text" required placeholder="e.g., Spring 2025 Discipleship"
                      value={sessionForm.cohortName}
                      onChange={(e) => setSessionForm((p) => ({ ...p, cohortName: e.target.value }))}
                      className={inputCls} />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { label: "Start Date *",            field: "startDate",            req: true  },
                    { label: "End Date *",              field: "endDate",              req: true  },
                    { label: "Registration Deadline *", field: "registrationDeadline", req: true  },
                  ].map(({ label, field, req }) => (
                    <div key={field}>
                      <label className={labelCls}>{label}</label>
                      <input type="date" required={req} value={sessionForm[field]}
                        onChange={(e) => setSessionForm((p) => ({ ...p, [field]: e.target.value }))}
                        className={inputCls} />
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div>
                    <label className={labelCls}>Day of Week</label>
                    <select value={sessionForm.schedule.day}
                      onChange={(e) => setSessionForm((p) => ({ ...p, schedule: { ...p.schedule, day: e.target.value } }))}
                      className={inputCls}>
                      {DAYS.map((d) => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Time</label>
                    <input type="text" placeholder="6:00 PM – 7:30 PM"
                      value={sessionForm.schedule.time}
                      onChange={(e) => setSessionForm((p) => ({ ...p, schedule: { ...p.schedule, time: e.target.value } }))}
                      className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Capacity</label>
                    <input type="number" min={1} value={sessionForm.capacity}
                      onChange={(e) => setSessionForm((p) => ({ ...p, capacity: +e.target.value }))}
                      className={inputCls} />
                  </div>
                </div>

                <div>
                  <label className={labelCls}>Location *</label>
                  <input type="text" required value={sessionForm.location}
                    onChange={(e) => setSessionForm((p) => ({ ...p, location: e.target.value }))}
                    className={inputCls} />
                </div>

                <div>
                  <p className={labelCls}>Facilitator</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className={labelCls}>Name *</label>
                      <input type="text" required value={sessionForm.facilitator.name}
                        onChange={(e) => setSessionForm((p) => ({ ...p, facilitator: { ...p.facilitator, name: e.target.value } }))}
                        className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Email</label>
                      <input type="email" value={sessionForm.facilitator.email}
                        onChange={(e) => setSessionForm((p) => ({ ...p, facilitator: { ...p.facilitator, email: e.target.value } }))}
                        className={inputCls} />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    Cancel
                  </button>
                  <button type="submit" disabled={saving}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm px-4 py-2.5 rounded-md transition-colors">
                    {saving ? <ArrowPathIcon className="h-4 w-4 animate-spin" /> : <CheckIcon className="h-4 w-4" />}
                    {selectedItem ? "Update Session" : "Create Session"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DiscipleshipAdmin;
