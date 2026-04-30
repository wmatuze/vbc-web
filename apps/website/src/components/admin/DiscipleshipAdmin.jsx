import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Users,
  Calendar,
  Clock,
  MapPin,
  Book,
  GraduationCap,
  ChevronDown,
  ChevronUp,
  Save,
  X,
  ClipboardList,
} from "lucide-react";

const DiscipleshipAdmin = () => {
  const [classes, setClasses] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("classes");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [expandedClass, setExpandedClass] = useState(null);

  const [classForm, setClassForm] = useState({
    title: "",
    description: "",
    duration: { value: 8, unit: "weeks" },
    level: "beginner",
    prerequisites: [],
    instructor: { name: "", email: "", phone: "", bio: "" },
    category: "discipleship",
    curriculum: [],
  });

  const [sessionForm, setSessionForm] = useState({
    classId: "",
    cohortName: "",
    startDate: "",
    endDate: "",
    schedule: { day: "Sunday", time: "6:00 PM - 7:30 PM", frequency: "weekly" },
    location: "",
    capacity: 15,
    facilitator: { name: "", email: "", phone: "" },
    registrationDeadline: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      await Promise.all([fetchClasses(), fetchSessions(), fetchRegistrations()]);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchClasses = async () => {
    try {
      const res = await fetch("/api/discipleship/classes");
      const data = await res.json();
      if (data.success) setClasses(data.data);
    } catch (error) {
      console.error("Error fetching classes:", error);
    }
  };

  const fetchSessions = async () => {
    try {
      const res = await fetch("/api/discipleship/sessions");
      const data = await res.json();
      if (data.success) setSessions(data.data);
    } catch (error) {
      console.error("Error fetching sessions:", error);
    }
  };

  const fetchRegistrations = async () => {
    try {
      const res = await fetch("/api/discipleship/registrations", {
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
      });
      const data = await res.json();
      if (data.success) setRegistrations(data.data);
    } catch (error) {
      console.error("Error fetching registrations:", error);
    }
  };

  const handleCreateClass = () => {
    setModalType("createClass");
    setSelectedItem(null);
    setClassForm({
      title: "",
      description: "",
      duration: { value: 8, unit: "weeks" },
      level: "beginner",
      prerequisites: [],
      instructor: { name: "", email: "", phone: "", bio: "" },
      category: "discipleship",
      curriculum: [],
    });
    setShowModal(true);
  };

  const handleEditClass = (classItem) => {
    setModalType("editClass");
    setSelectedItem(classItem);
    setClassForm(classItem);
    setShowModal(true);
  };

  const handleCreateSession = (classId = "") => {
    setModalType("createSession");
    setSelectedItem(null);
    setSessionForm({
      classId,
      cohortName: "",
      startDate: "",
      endDate: "",
      schedule: { day: "Sunday", time: "6:00 PM - 7:30 PM", frequency: "weekly" },
      location: "",
      capacity: 15,
      facilitator: { name: "", email: "", phone: "" },
      registrationDeadline: "",
    });
    setShowModal(true);
  };

  const handleEditSession = (session) => {
    setModalType("editSession");
    setSelectedItem(session);
    setSessionForm({
      ...session,
      startDate: new Date(session.startDate).toISOString().split("T")[0],
      endDate: new Date(session.endDate).toISOString().split("T")[0],
      registrationDeadline: new Date(session.registrationDeadline)
        .toISOString()
        .split("T")[0],
    });
    setShowModal(true);
  };

  const handleSubmitClass = async (e) => {
    e.preventDefault();
    try {
      const url = selectedItem
        ? `/api/discipleship/classes/${selectedItem._id}`
        : "/api/discipleship/classes";
      const res = await fetch(url, {
        method: selectedItem ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify(classForm),
      });
      const data = await res.json();
      if (data.success) {
        await fetchClasses();
        setShowModal(false);
      } else {
        console.error("Error saving class:", data.error);
      }
    } catch (error) {
      console.error("Error submitting class:", error);
    }
  };

  const handleSubmitSession = async (e) => {
    e.preventDefault();
    try {
      const url = selectedItem
        ? `/api/discipleship/sessions/${selectedItem._id}`
        : "/api/discipleship/sessions";
      const res = await fetch(url, {
        method: selectedItem ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify(sessionForm),
      });
      const data = await res.json();
      if (data.success) {
        await fetchSessions();
        setShowModal(false);
      } else {
        console.error("Error saving session:", data.error);
      }
    } catch (error) {
      console.error("Error submitting session:", error);
    }
  };

  const handleDeleteClass = async (classId) => {
    if (!window.confirm("Are you sure you want to delete this class?")) return;
    try {
      const res = await fetch(`/api/discipleship/classes/${classId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
      });
      const data = await res.json();
      if (data.success) await fetchClasses();
    } catch (error) {
      console.error("Error deleting class:", error);
    }
  };

  const addCurriculumWeek = () => {
    setClassForm((prev) => ({
      ...prev,
      curriculum: [
        ...prev.curriculum,
        { week: prev.curriculum.length + 1, title: "", description: "", topics: [] },
      ],
    }));
  };

  const updateCurriculumWeek = (index, field, value) => {
    setClassForm((prev) => ({
      ...prev,
      curriculum: prev.curriculum.map((week, i) =>
        i === index ? { ...week, [field]: value } : week,
      ),
    }));
  };

  const removeCurriculumWeek = (index) => {
    setClassForm((prev) => ({
      ...prev,
      curriculum: prev.curriculum.filter((_, i) => i !== index),
    }));
  };

  const levelBadge = (level) => {
    const map = {
      beginner: "bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300",
      intermediate: "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-300",
      advanced: "bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300",
    };
    return map[level] || "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300";
  };

  const statusBadge = (status) => {
    const map = {
      upcoming: "bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300",
      active: "bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300",
      completed: "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400",
    };
    return map[status] || "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400";
  };

  const inputCls =
    "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";

  const labelCls =
    "block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5";

  const tabs = [
    { id: "classes", name: "Classes", icon: Book },
    { id: "sessions", name: "Sessions", icon: Calendar },
    { id: "registrations", name: "Registrations", icon: Users },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-2 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap gap-3 justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Discipleship Administration
        </h1>
        <div className="flex gap-3">
          <button
            onClick={handleCreateClass}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-md transition-colors"
          >
            <Plus className="h-4 w-4" />
            New Class
          </button>
          <button
            onClick={() => handleCreateSession()}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded-md transition-colors"
          >
            <Plus className="h-4 w-4" />
            New Session
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex gap-6">
          {tabs.map(({ id, name, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 py-2.5 px-1 border-b-2 text-sm font-medium transition-colors ${
                activeTab === id
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              <Icon className="h-4 w-4" />
              {name}
              {id === "classes" && (
                <span className="ml-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs px-1.5 py-0.5 rounded-full">
                  {classes.length}
                </span>
              )}
              {id === "sessions" && (
                <span className="ml-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs px-1.5 py-0.5 rounded-full">
                  {sessions.length}
                </span>
              )}
              {id === "registrations" && (
                <span className="ml-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs px-1.5 py-0.5 rounded-full">
                  {registrations.length}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* ── CLASSES TAB ───────────────────────────────────────────────── */}
      {activeTab === "classes" && (
        <div className="space-y-3">
          {classes.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <Book className="h-10 w-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400 text-sm">No classes yet.</p>
              <button
                onClick={handleCreateClass}
                className="mt-4 text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                Create your first class →
              </button>
            </div>
          ) : (
            classes.map((classItem) => (
              <div
                key={classItem._id}
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm"
              >
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <h3 className="text-base font-semibold text-gray-900 dark:text-white truncate">
                          {classItem.title}
                        </h3>
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${levelBadge(classItem.level)}`}>
                          {classItem.level}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">
                        {classItem.description}
                      </p>
                      <div className="flex flex-wrap gap-4 text-xs text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5" />
                          {classItem.durationDisplay}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <GraduationCap className="h-3.5 w-3.5" />
                          {classItem.instructor?.name}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Book className="h-3.5 w-3.5" />
                          {classItem.curriculumLength} sessions
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Users className="h-3.5 w-3.5" />
                          {sessions.filter((s) => s.classId?._id === classItem._id).length} cohorts
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={() =>
                          setExpandedClass(
                            expandedClass === classItem._id ? null : classItem._id,
                          )
                        }
                        className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded transition-colors"
                        title="Expand"
                      >
                        {expandedClass === classItem._id ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </button>
                      <button
                        onClick={() => handleCreateSession(classItem._id)}
                        className="p-1.5 text-green-600 hover:text-green-700 dark:text-green-400 rounded transition-colors"
                        title="Add Session"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleEditClass(classItem)}
                        className="p-1.5 text-blue-600 hover:text-blue-700 dark:text-blue-400 rounded transition-colors"
                        title="Edit Class"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteClass(classItem._id)}
                        className="p-1.5 text-red-600 hover:text-red-700 dark:text-red-400 rounded transition-colors"
                        title="Delete Class"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Expanded panel */}
                  {expandedClass === classItem._id && (
                    <div className="mt-5 pt-5 border-t border-gray-100 dark:border-gray-700 space-y-5">
                      {/* Prerequisites */}
                      {classItem.prerequisites?.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">
                            Prerequisites
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {classItem.prerequisites.map((prereq, i) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded"
                              >
                                {prereq}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Curriculum */}
                      {classItem.curriculum?.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">
                            Curriculum ({classItem.curriculum.length} weeks)
                          </p>
                          <div className="grid sm:grid-cols-2 gap-2">
                            {classItem.curriculum.map((week, i) => (
                              <div
                                key={i}
                                className="bg-gray-50 dark:bg-gray-700/50 rounded p-3 border border-gray-100 dark:border-gray-600"
                              >
                                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                                  Week {week.week}: {week.title}
                                </p>
                                {week.description && (
                                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                    {week.description}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Sessions for this class */}
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">
                          Active Sessions
                        </p>
                        {sessions.filter((s) => s.classId?._id === classItem._id).length === 0 ? (
                          <p className="text-xs text-gray-400 dark:text-gray-500 italic">
                            No sessions yet.{" "}
                            <button
                              onClick={() => handleCreateSession(classItem._id)}
                              className="text-green-600 dark:text-green-400 hover:underline"
                            >
                              Add one →
                            </button>
                          </p>
                        ) : (
                          <div className="space-y-2">
                            {sessions
                              .filter((s) => s.classId?._id === classItem._id)
                              .map((session) => (
                                <div
                                  key={session._id}
                                  className="bg-gray-50 dark:bg-gray-700/50 rounded p-3 border border-gray-100 dark:border-gray-600 flex justify-between items-center"
                                >
                                  <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                      {session.cohortName}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                      {session.schedule?.day}s at {session.schedule?.time} · {session.location}
                                    </p>
                                    <p className="text-xs text-gray-400 dark:text-gray-500">
                                      {session.enrolledCount}/{session.capacity} enrolled
                                    </p>
                                  </div>
                                  <button
                                    onClick={() => handleEditSession(session)}
                                    className="p-1.5 text-blue-600 hover:text-blue-700 dark:text-blue-400 rounded transition-colors"
                                    title="Edit Session"
                                  >
                                    <Edit className="h-3.5 w-3.5" />
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

      {/* ── SESSIONS TAB ──────────────────────────────────────────────── */}
      {activeTab === "sessions" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sessions.length === 0 ? (
            <div className="col-span-full text-center py-16 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <Calendar className="h-10 w-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400 text-sm">No sessions yet.</p>
            </div>
          ) : (
            sessions.map((session) => (
              <div
                key={session._id}
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-5"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white leading-snug">
                    {session.cohortName}
                  </h3>
                  <span className={`px-2 py-0.5 text-xs font-medium rounded-full ml-2 flex-shrink-0 ${statusBadge(session.status)}`}>
                    {session.status}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-gray-500 dark:text-gray-400 mb-4">
                  <div className="flex items-center gap-2">
                    <Book className="h-3.5 w-3.5 flex-shrink-0" />
                    <span className="truncate">{session.classId?.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
                    <span>{session.dateRange}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                    <span>{session.schedule?.day}s at {session.schedule?.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                    <span className="truncate">{session.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-3.5 w-3.5 flex-shrink-0" />
                    <span>{session.enrolledCount}/{session.capacity} enrolled</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditSession(session)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-md transition-colors"
                  >
                    <Edit className="h-3.5 w-3.5" />
                    Edit
                  </button>
                  <button
                    onClick={() => setActiveTab("registrations")}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-md transition-colors"
                  >
                    <ClipboardList className="h-3.5 w-3.5" />
                    Registrations
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ── REGISTRATIONS TAB ─────────────────────────────────────────── */}
      {activeTab === "registrations" && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          {registrations.length === 0 ? (
            <div className="text-center py-16">
              <ClipboardList className="h-10 w-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400 text-sm">No registrations yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                  <tr>
                    {["Student", "Class / Session", "Status", "Registered", "Actions"].map(
                      (h) => (
                        <th
                          key={h}
                          className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400"
                        >
                          {h}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {registrations.map((reg) => (
                    <tr
                      key={reg._id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {reg.fullName}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {reg.email}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm text-gray-900 dark:text-white">
                          {reg.classId?.title}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {reg.sessionId?.cohortName}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${
                            reg.status === "approved"
                              ? "bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300"
                              : reg.status === "pending"
                              ? "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-300"
                              : "bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300"
                          }`}
                        >
                          {reg.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500 dark:text-gray-400">
                        {new Date(reg.registrationDate).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-3 text-xs font-medium">
                          <button className="text-blue-600 dark:text-blue-400 hover:underline">
                            View
                          </button>
                          <button className="text-green-600 dark:text-green-400 hover:underline">
                            Approve
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── MODALS ────────────────────────────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center z-10">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {modalType === "createClass" && "Create New Class"}
                {modalType === "editClass" && "Edit Class"}
                {modalType === "createSession" && "Create New Session"}
                {modalType === "editSession" && "Edit Session"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* ── Class form ── */}
            {(modalType === "createClass" || modalType === "editClass") && (
              <form onSubmit={handleSubmitClass} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Class Title *</label>
                    <input
                      type="text"
                      value={classForm.title}
                      onChange={(e) =>
                        setClassForm((p) => ({ ...p, title: e.target.value }))
                      }
                      className={inputCls}
                      required
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Level</label>
                    <select
                      value={classForm.level}
                      onChange={(e) =>
                        setClassForm((p) => ({ ...p, level: e.target.value }))
                      }
                      className={inputCls}
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className={labelCls}>Description *</label>
                  <textarea
                    value={classForm.description}
                    onChange={(e) =>
                      setClassForm((p) => ({ ...p, description: e.target.value }))
                    }
                    rows={3}
                    className={inputCls}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className={labelCls}>Duration Value</label>
                    <input
                      type="number"
                      value={classForm.duration.value}
                      onChange={(e) =>
                        setClassForm((p) => ({
                          ...p,
                          duration: { ...p.duration, value: parseInt(e.target.value) },
                        }))
                      }
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Duration Unit</label>
                    <select
                      value={classForm.duration.unit}
                      onChange={(e) =>
                        setClassForm((p) => ({
                          ...p,
                          duration: { ...p.duration, unit: e.target.value },
                        }))
                      }
                      className={inputCls}
                    >
                      <option value="weeks">Weeks</option>
                      <option value="months">Months</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Category</label>
                    <select
                      value={classForm.category}
                      onChange={(e) =>
                        setClassForm((p) => ({ ...p, category: e.target.value }))
                      }
                      className={inputCls}
                    >
                      <option value="discipleship">Discipleship</option>
                      <option value="leadership">Leadership</option>
                      <option value="ministry">Ministry</option>
                      <option value="biblical_studies">Biblical Studies</option>
                      <option value="spiritual_growth">Spiritual Growth</option>
                    </select>
                  </div>
                </div>

                {/* Instructor */}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">
                    Instructor Information
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Name *</label>
                      <input
                        type="text"
                        value={classForm.instructor.name}
                        onChange={(e) =>
                          setClassForm((p) => ({
                            ...p,
                            instructor: { ...p.instructor, name: e.target.value },
                          }))
                        }
                        className={inputCls}
                        required
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Email</label>
                      <input
                        type="email"
                        value={classForm.instructor.email}
                        onChange={(e) =>
                          setClassForm((p) => ({
                            ...p,
                            instructor: { ...p.instructor, email: e.target.value },
                          }))
                        }
                        className={inputCls}
                      />
                    </div>
                  </div>
                </div>

                {/* Curriculum */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Curriculum ({classForm.curriculum.length} weeks)
                    </p>
                    <button
                      type="button"
                      onClick={addCurriculumWeek}
                      className="flex items-center gap-1 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded transition-colors"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Add Week
                    </button>
                  </div>

                  <div className="space-y-3">
                    {classForm.curriculum.map((week, index) => (
                      <div
                        key={index}
                        className="border border-gray-200 dark:border-gray-600 rounded-md p-4"
                      >
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Week {week.week}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeCurriculumWeek(index)}
                            className="text-red-500 hover:text-red-700 dark:text-red-400"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                          <div>
                            <label className={labelCls}>Title</label>
                            <input
                              type="text"
                              value={week.title}
                              onChange={(e) =>
                                updateCurriculumWeek(index, "title", e.target.value)
                              }
                              className={inputCls}
                            />
                          </div>
                          <div>
                            <label className={labelCls}>Topics (comma-separated)</label>
                            <input
                              type="text"
                              value={week.topics ? week.topics.join(", ") : ""}
                              onChange={(e) =>
                                updateCurriculumWeek(
                                  index,
                                  "topics",
                                  e.target.value.split(",").map((t) => t.trim()),
                                )
                              }
                              className={inputCls}
                            />
                          </div>
                        </div>
                        <div>
                          <label className={labelCls}>Description</label>
                          <textarea
                            value={week.description}
                            onChange={(e) =>
                              updateCurriculumWeek(index, "description", e.target.value)
                            }
                            rows={2}
                            className={inputCls}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2.5 rounded-md transition-colors"
                  >
                    <Save className="h-4 w-4" />
                    {selectedItem ? "Update Class" : "Create Class"}
                  </button>
                </div>
              </form>
            )}

            {/* ── Session form ── */}
            {(modalType === "createSession" || modalType === "editSession") && (
              <form onSubmit={handleSubmitSession} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Class *</label>
                    <select
                      value={sessionForm.classId}
                      onChange={(e) =>
                        setSessionForm((p) => ({ ...p, classId: e.target.value }))
                      }
                      className={inputCls}
                      required
                    >
                      <option value="">Select a class</option>
                      {classes.map((cls) => (
                        <option key={cls._id} value={cls._id}>
                          {cls.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Cohort Name *</label>
                    <input
                      type="text"
                      value={sessionForm.cohortName}
                      onChange={(e) =>
                        setSessionForm((p) => ({ ...p, cohortName: e.target.value }))
                      }
                      placeholder="e.g., Spring 2024 Discipleship"
                      className={inputCls}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className={labelCls}>Start Date *</label>
                    <input
                      type="date"
                      value={sessionForm.startDate}
                      onChange={(e) =>
                        setSessionForm((p) => ({ ...p, startDate: e.target.value }))
                      }
                      className={inputCls}
                      required
                    />
                  </div>
                  <div>
                    <label className={labelCls}>End Date *</label>
                    <input
                      type="date"
                      value={sessionForm.endDate}
                      onChange={(e) =>
                        setSessionForm((p) => ({ ...p, endDate: e.target.value }))
                      }
                      className={inputCls}
                      required
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Registration Deadline *</label>
                    <input
                      type="date"
                      value={sessionForm.registrationDeadline}
                      onChange={(e) =>
                        setSessionForm((p) => ({
                          ...p,
                          registrationDeadline: e.target.value,
                        }))
                      }
                      className={inputCls}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className={labelCls}>Day of Week</label>
                    <select
                      value={sessionForm.schedule.day}
                      onChange={(e) =>
                        setSessionForm((p) => ({
                          ...p,
                          schedule: { ...p.schedule, day: e.target.value },
                        }))
                      }
                      className={inputCls}
                    >
                      {["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"].map(
                        (d) => <option key={d} value={d}>{d}</option>,
                      )}
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Time</label>
                    <input
                      type="text"
                      value={sessionForm.schedule.time}
                      onChange={(e) =>
                        setSessionForm((p) => ({
                          ...p,
                          schedule: { ...p.schedule, time: e.target.value },
                        }))
                      }
                      placeholder="6:00 PM - 7:30 PM"
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Capacity</label>
                    <input
                      type="number"
                      value={sessionForm.capacity}
                      onChange={(e) =>
                        setSessionForm((p) => ({
                          ...p,
                          capacity: parseInt(e.target.value),
                        }))
                      }
                      className={inputCls}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelCls}>Location *</label>
                  <input
                    type="text"
                    value={sessionForm.location}
                    onChange={(e) =>
                      setSessionForm((p) => ({ ...p, location: e.target.value }))
                    }
                    className={inputCls}
                    required
                  />
                </div>

                {/* Facilitator */}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">
                    Facilitator Information
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Name *</label>
                      <input
                        type="text"
                        value={sessionForm.facilitator.name}
                        onChange={(e) =>
                          setSessionForm((p) => ({
                            ...p,
                            facilitator: { ...p.facilitator, name: e.target.value },
                          }))
                        }
                        className={inputCls}
                        required
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Email</label>
                      <input
                        type="email"
                        value={sessionForm.facilitator.email}
                        onChange={(e) =>
                          setSessionForm((p) => ({
                            ...p,
                            facilitator: { ...p.facilitator, email: e.target.value },
                          }))
                        }
                        className={inputCls}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2.5 rounded-md transition-colors"
                  >
                    <Save className="h-4 w-4" />
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
