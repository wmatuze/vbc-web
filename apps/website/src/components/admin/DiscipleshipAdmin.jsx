import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
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
  User,
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

  // Form states
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
      await Promise.all([
        fetchClasses(),
        fetchSessions(),
        fetchRegistrations(),
      ]);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchClasses = async () => {
    try {
      const response = await fetch("/api/discipleship/classes");
      const data = await response.json();
      if (data.success) {
        setClasses(data.data);
      }
    } catch (error) {
      console.error("Error fetching classes:", error);
    }
  };

  const fetchSessions = async () => {
    try {
      const response = await fetch("/api/discipleship/sessions");
      const data = await response.json();
      if (data.success) {
        setSessions(data.data);
      }
    } catch (error) {
      console.error("Error fetching sessions:", error);
    }
  };

  const fetchRegistrations = async () => {
    try {
      const response = await fetch("/api/discipleship/registrations", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setRegistrations(data.data);
      }
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
      classId: classId,
      cohortName: "",
      startDate: "",
      endDate: "",
      schedule: {
        day: "Sunday",
        time: "6:00 PM - 7:30 PM",
        frequency: "weekly",
      },
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

      const method = selectedItem ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify(classForm),
      });

      const data = await response.json();
      if (data.success) {
        await fetchClasses();
        setShowModal(false);
        // Show success message
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

      const method = selectedItem ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify(sessionForm),
      });

      const data = await response.json();
      if (data.success) {
        await fetchSessions();
        setShowModal(false);
        // Show success message
      } else {
        console.error("Error saving session:", data.error);
      }
    } catch (error) {
      console.error("Error submitting session:", error);
    }
  };

  const handleDeleteClass = async (classId) => {
    if (window.confirm("Are you sure you want to delete this class?")) {
      try {
        const response = await fetch(`/api/discipleship/classes/${classId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });

        const data = await response.json();
        if (data.success) {
          await fetchClasses();
        }
      } catch (error) {
        console.error("Error deleting class:", error);
      }
    }
  };

  const addCurriculumWeek = () => {
    setClassForm((prev) => ({
      ...prev,
      curriculum: [
        ...prev.curriculum,
        {
          week: prev.curriculum.length + 1,
          title: "",
          description: "",
          topics: [],
        },
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Discipleship Administration
        </h1>
        <div className="flex space-x-3">
          <button
            onClick={handleCreateClass}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            <Plus />
            <span>New Class</span>
          </button>
          <button
            onClick={() => handleCreateSession()}
            className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            <Plus />
            <span>New Session</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-600">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: "classes", name: "Classes", icon: FaBook },
            { id: "sessions", name: "Sessions", icon: FaCalendarAlt },
            { id: "registrations", name: "Registrations", icon: FaUsers },
          ].map(({ id, name, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === id
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              <Icon />
              <span>{name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="mt-6">
        {activeTab === "classes" && (
          <div className="space-y-4">
            {classes.map((classItem) => (
              <motion.div
                key={classItem._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-600"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {classItem.title}
                        </h3>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            classItem.level === "beginner"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              : classItem.level === "intermediate"
                                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                          }`}
                        >
                          {classItem.level}
                        </span>
                      </div>

                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        {classItem.description}
                      </p>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center text-gray-500 dark:text-gray-400">
                          <FaClock className="mr-2" />
                          <span>{classItem.durationDisplay}</span>
                        </div>
                        <div className="flex items-center text-gray-500 dark:text-gray-400">
                          <FaUserGraduate className="mr-2" />
                          <span>{classItem.instructor.name}</span>
                        </div>
                        <div className="flex items-center text-gray-500 dark:text-gray-400">
                          <FaBook className="mr-2" />
                          <span>{classItem.curriculumLength} sessions</span>
                        </div>
                        <div className="flex items-center text-gray-500 dark:text-gray-400">
                          <FaUsers className="mr-2" />
                          <span>
                            {
                              sessions.filter(
                                (s) => s.classId._id === classItem._id,
                              ).length
                            }{" "}
                            cohorts
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() =>
                          setExpandedClass(
                            expandedClass === classItem._id
                              ? null
                              : classItem._id,
                          )
                        }
                        className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      >
                        {expandedClass === classItem._id ? (
                          <ChevronUp />
                        ) : (
                          <ChevronDown />
                        )}
                      </button>
                      <button
                        onClick={() => handleCreateSession(classItem._id)}
                        className="p-2 text-green-600 hover:text-green-700 dark:text-green-400"
                        title="Add Session"
                      >
                        <Plus />
                      </button>
                      <button
                        onClick={() => handleEditClass(classItem)}
                        className="p-2 text-blue-600 hover:text-blue-700 dark:text-blue-400"
                        title="Edit Class"
                      >
                        <Edit />
                      </button>
                      <button
                        onClick={() => handleDeleteClass(classItem._id)}
                        className="p-2 text-red-600 hover:text-red-700 dark:text-red-400"
                        title="Delete Class"
                      >
                        <Trash2 />
                      </button>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  <AnimatePresence>
                    {expandedClass === classItem._id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden mt-6 pt-6 border-t border-gray-200 dark:border-gray-600"
                      >
                        {/* Prerequisites */}
                        {classItem.prerequisites &&
                          classItem.prerequisites.length > 0 && (
                            <div className="mb-4">
                              <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                                Prerequisites:
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {classItem.prerequisites.map(
                                  (prereq, index) => (
                                    <span
                                      key={index}
                                      className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded"
                                    >
                                      {prereq}
                                    </span>
                                  ),
                                )}
                              </div>
                            </div>
                          )}

                        {/* Curriculum */}
                        {classItem.curriculum &&
                          classItem.curriculum.length > 0 && (
                            <div className="mb-4">
                              <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                                Curriculum:
                              </h4>
                              <div className="space-y-2">
                                {classItem.curriculum.map((week, index) => (
                                  <div
                                    key={index}
                                    className="bg-gray-50 dark:bg-gray-700 rounded p-3"
                                  >
                                    <div className="font-medium text-sm">
                                      Week {week.week}: {week.title}
                                    </div>
                                    {week.description && (
                                      <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                        {week.description}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                        {/* Sessions for this class */}
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                            Active Sessions:
                          </h4>
                          <div className="space-y-2">
                            {sessions
                              .filter(
                                (session) =>
                                  session.classId._id === classItem._id,
                              )
                              .map((session) => (
                                <div
                                  key={session._id}
                                  className="bg-gray-50 dark:bg-gray-700 rounded p-3 flex justify-between items-center"
                                >
                                  <div>
                                    <div className="font-medium text-sm">
                                      {session.cohortName}
                                    </div>
                                    <div className="text-xs text-gray-600 dark:text-gray-400">
                                      {session.schedule.day}s at{" "}
                                      {session.schedule.time} •{" "}
                                      {session.location}
                                    </div>
                                    <div className="text-xs text-gray-600 dark:text-gray-400">
                                      {session.enrolledCount}/{session.capacity}{" "}
                                      enrolled
                                    </div>
                                  </div>
                                  <div className="flex space-x-2">
                                    <button
                                      onClick={() => handleEditSession(session)}
                                      className="p-1 text-blue-600 hover:text-blue-700"
                                    >
                                      <FaEdit size={12} />
                                    </button>
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === "sessions" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sessions.map((session) => (
              <motion.div
                key={session._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-600 p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {session.cohortName}
                  </h3>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      session.status === "upcoming"
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                        : session.status === "active"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                    }`}
                  >
                    {session.status}
                  </span>
                </div>

                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300 mb-4">
                  <div className="flex items-center">
                    <FaBook className="mr-2" />
                    <span>{session.classId.title}</span>
                  </div>
                  <div className="flex items-center">
                    <FaCalendarAlt className="mr-2" />
                    <span>{session.dateRange}</span>
                  </div>
                  <div className="flex items-center">
                    <FaClock className="mr-2" />
                    <span>
                      {session.schedule.day}s at {session.schedule.time}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <FaMapMarkerAlt className="mr-2" />
                    <span>{session.location}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="mr-2" />
                    <span>
                      {session.enrolledCount}/{session.capacity} enrolled
                    </span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditSession(session)}
                    className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
                  >
                    <Edit />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => {
                      /* Navigate to registrations for this session */
                    }}
                    className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded transition-colors"
                  >
                    <ClipboardList />
                    <span>Manage</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === "registrations" && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">
                Registration Overview
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Student
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Class/Session
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Registered
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-600">
                    {registrations.map((registration) => (
                      <tr key={registration._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {registration.fullName}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {registration.email}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">
                            {registration.classId.title}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {registration.sessionId.cohortName}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              registration.status === "approved"
                                ? "bg-green-100 text-green-800"
                                : registration.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                            }`}
                          >
                            {registration.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {new Date(
                            registration.registrationDate,
                          ).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 mr-3">
                            View
                          </button>
                          <button className="text-green-600 hover:text-green-900 dark:text-green-400">
                            Approve
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {modalType === "createClass" && "Create New Class"}
                    {modalType === "editClass" && "Edit Class"}
                    {modalType === "createSession" && "Create New Session"}
                    {modalType === "editSession" && "Edit Session"}
                  </h3>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <X />
                  </button>
                </div>

                {(modalType === "createClass" || modalType === "editClass") && (
                  <form onSubmit={handleSubmitClass} className="space-y-6">
                    {/* Class Form Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Class Title *
                        </label>
                        <input
                          type="text"
                          value={classForm.title}
                          onChange={(e) =>
                            setClassForm((prev) => ({
                              ...prev,
                              title: e.target.value,
                            }))
                          }
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Level
                        </label>
                        <select
                          value={classForm.level}
                          onChange={(e) =>
                            setClassForm((prev) => ({
                              ...prev,
                              level: e.target.value,
                            }))
                          }
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                          <option value="beginner">Beginner</option>
                          <option value="intermediate">Intermediate</option>
                          <option value="advanced">Advanced</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Description *
                      </label>
                      <textarea
                        value={classForm.description}
                        onChange={(e) =>
                          setClassForm((prev) => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Duration Value
                        </label>
                        <input
                          type="number"
                          value={classForm.duration.value}
                          onChange={(e) =>
                            setClassForm((prev) => ({
                              ...prev,
                              duration: {
                                ...prev.duration,
                                value: parseInt(e.target.value),
                              },
                            }))
                          }
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Duration Unit
                        </label>
                        <select
                          value={classForm.duration.unit}
                          onChange={(e) =>
                            setClassForm((prev) => ({
                              ...prev,
                              duration: {
                                ...prev.duration,
                                unit: e.target.value,
                              },
                            }))
                          }
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                          <option value="weeks">Weeks</option>
                          <option value="months">Months</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Category
                        </label>
                        <select
                          value={classForm.category}
                          onChange={(e) =>
                            setClassForm((prev) => ({
                              ...prev,
                              category: e.target.value,
                            }))
                          }
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                          <option value="discipleship">Discipleship</option>
                          <option value="leadership">Leadership</option>
                          <option value="ministry">Ministry</option>
                          <option value="biblical_studies">
                            Biblical Studies
                          </option>
                          <option value="spiritual_growth">
                            Spiritual Growth
                          </option>
                        </select>
                      </div>
                    </div>

                    {/* Instructor Information */}
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                        Instructor Information
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Name *
                          </label>
                          <input
                            type="text"
                            value={classForm.instructor.name}
                            onChange={(e) =>
                              setClassForm((prev) => ({
                                ...prev,
                                instructor: {
                                  ...prev.instructor,
                                  name: e.target.value,
                                },
                              }))
                            }
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Email
                          </label>
                          <input
                            type="email"
                            value={classForm.instructor.email}
                            onChange={(e) =>
                              setClassForm((prev) => ({
                                ...prev,
                                instructor: {
                                  ...prev.instructor,
                                  email: e.target.value,
                                },
                              }))
                            }
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Curriculum */}
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                          Curriculum
                        </h4>
                        <button
                          type="button"
                          onClick={addCurriculumWeek}
                          className="flex items-center space-x-1 px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded"
                        >
                          <Plus />
                          <span>Add Week</span>
                        </button>
                      </div>

                      <div className="space-y-3">
                        {classForm.curriculum.map((week, index) => (
                          <div
                            key={index}
                            className="border border-gray-200 dark:border-gray-600 rounded-md p-4"
                          >
                            <div className="flex justify-between items-center mb-3">
                              <h5 className="font-medium">Week {week.week}</h5>
                              <button
                                type="button"
                                onClick={() => removeCurriculumWeek(index)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 />
                              </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                  Title
                                </label>
                                <input
                                  type="text"
                                  value={week.title}
                                  onChange={(e) =>
                                    updateCurriculumWeek(
                                      index,
                                      "title",
                                      e.target.value,
                                    )
                                  }
                                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                  Topics (comma-separated)
                                </label>
                                <input
                                  type="text"
                                  value={
                                    week.topics ? week.topics.join(", ") : ""
                                  }
                                  onChange={(e) =>
                                    updateCurriculumWeek(
                                      index,
                                      "topics",
                                      e.target.value
                                        .split(",")
                                        .map((t) => t.trim()),
                                    )
                                  }
                                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                />
                              </div>
                            </div>

                            <div className="mt-3">
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Description
                              </label>
                              <textarea
                                value={week.description}
                                onChange={(e) =>
                                  updateCurriculumWeek(
                                    index,
                                    "description",
                                    e.target.value,
                                  )
                                }
                                rows={2}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex space-x-4 pt-6">
                      <button
                        type="button"
                        onClick={() => setShowModal(false)}
                        className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md transition-colors flex items-center justify-center space-x-2"
                      >
                        <Save />
                        <span>
                          {selectedItem ? "Update Class" : "Create Class"}
                        </span>
                      </button>
                    </div>
                  </form>
                )}

                {(modalType === "createSession" ||
                  modalType === "editSession") && (
                  <form onSubmit={handleSubmitSession} className="space-y-6">
                    {/* Session Form Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Class *
                        </label>
                        <select
                          value={sessionForm.classId}
                          onChange={(e) =>
                            setSessionForm((prev) => ({
                              ...prev,
                              classId: e.target.value,
                            }))
                          }
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Cohort Name *
                        </label>
                        <input
                          type="text"
                          value={sessionForm.cohortName}
                          onChange={(e) =>
                            setSessionForm((prev) => ({
                              ...prev,
                              cohortName: e.target.value,
                            }))
                          }
                          placeholder="e.g., Spring 2024 Discipleship"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Start Date *
                        </label>
                        <input
                          type="date"
                          value={sessionForm.startDate}
                          onChange={(e) =>
                            setSessionForm((prev) => ({
                              ...prev,
                              startDate: e.target.value,
                            }))
                          }
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          End Date *
                        </label>
                        <input
                          type="date"
                          value={sessionForm.endDate}
                          onChange={(e) =>
                            setSessionForm((prev) => ({
                              ...prev,
                              endDate: e.target.value,
                            }))
                          }
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Registration Deadline *
                        </label>
                        <input
                          type="date"
                          value={sessionForm.registrationDeadline}
                          onChange={(e) =>
                            setSessionForm((prev) => ({
                              ...prev,
                              registrationDeadline: e.target.value,
                            }))
                          }
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Day of Week
                        </label>
                        <select
                          value={sessionForm.schedule.day}
                          onChange={(e) =>
                            setSessionForm((prev) => ({
                              ...prev,
                              schedule: {
                                ...prev.schedule,
                                day: e.target.value,
                              },
                            }))
                          }
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                          <option value="Sunday">Sunday</option>
                          <option value="Monday">Monday</option>
                          <option value="Tuesday">Tuesday</option>
                          <option value="Wednesday">Wednesday</option>
                          <option value="Thursday">Thursday</option>
                          <option value="Friday">Friday</option>
                          <option value="Saturday">Saturday</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Time
                        </label>
                        <input
                          type="text"
                          value={sessionForm.schedule.time}
                          onChange={(e) =>
                            setSessionForm((prev) => ({
                              ...prev,
                              schedule: {
                                ...prev.schedule,
                                time: e.target.value,
                              },
                            }))
                          }
                          placeholder="6:00 PM - 7:30 PM"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Capacity
                        </label>
                        <input
                          type="number"
                          value={sessionForm.capacity}
                          onChange={(e) =>
                            setSessionForm((prev) => ({
                              ...prev,
                              capacity: parseInt(e.target.value),
                            }))
                          }
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Location *
                      </label>
                      <input
                        type="text"
                        value={sessionForm.location}
                        onChange={(e) =>
                          setSessionForm((prev) => ({
                            ...prev,
                            location: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        required
                      />
                    </div>

                    {/* Facilitator Information */}
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                        Facilitator Information
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Name *
                          </label>
                          <input
                            type="text"
                            value={sessionForm.facilitator.name}
                            onChange={(e) =>
                              setSessionForm((prev) => ({
                                ...prev,
                                facilitator: {
                                  ...prev.facilitator,
                                  name: e.target.value,
                                },
                              }))
                            }
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Email
                          </label>
                          <input
                            type="email"
                            value={sessionForm.facilitator.email}
                            onChange={(e) =>
                              setSessionForm((prev) => ({
                                ...prev,
                                facilitator: {
                                  ...prev.facilitator,
                                  email: e.target.value,
                                },
                              }))
                            }
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex space-x-4 pt-6">
                      <button
                        type="button"
                        onClick={() => setShowModal(false)}
                        className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md transition-colors flex items-center justify-center space-x-2"
                      >
                        <Save />
                        <span>
                          {selectedItem ? "Update Session" : "Create Session"}
                        </span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DiscipleshipAdmin;
