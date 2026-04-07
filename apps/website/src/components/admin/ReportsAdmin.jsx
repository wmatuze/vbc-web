import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  PieChart,
  LineChart,
  Download,
  Calendar,
  Users,
  GraduationCap,
  File,
  Eye,
  User,
  ClipboardList,
  Trophy,
  Filter,
  RefreshCw,
} from "lucide-react";

const ReportsAdmin = ({ darkMode }) => {
  const [reportData, setReportData] = useState({
    discipleshipClasses: [],
    sessions: [],
    discipleshipRegistrations: [],
    resources: [],
    membershipRenewals: [],
    foundationRegistrations: [],
    eventSignups: [],
  });
  const [loading, setLoading] = useState(true);
  const [activeReport, setActiveReport] = useState("overview");
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setMonth(new Date().getMonth() - 6))
      .toISOString()
      .split("T")[0],
    end: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    fetchReportData();
  }, [dateRange]);

  const fetchReportData = async () => {
    setLoading(true);
    try {
      const authHeaders = {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      };

      const [
        discipleshipRes,
        sessionsRes,
        discipleshipRegistrationsRes,
        resourcesRes,
        membershipRenewalsRes,
        foundationRegistrationsRes,
        eventSignupsRes,
      ] = await Promise.all([
        fetch("/api/discipleship/classes"),
        fetch("/api/discipleship/sessions"),
        fetch("/api/discipleship/registrations", { headers: authHeaders }),
        fetch("/api/resources"),
        fetch("/api/membership/renewals", { headers: authHeaders }),
        fetch("/api/foundation-classes/registrations", {
          headers: authHeaders,
        }),
        fetch("/api/event-signup-requests", { headers: authHeaders }),
      ]);

      // Process responses with error handling
      const processResponse = async (response, name) => {
        try {
          if (!response.ok) {
            console.warn(`${name} API returned ${response.status}`);
            return { success: false, data: [] };
          }
          return await response.json();
        } catch (error) {
          console.warn(`Error parsing ${name} response:`, error);
          return { success: false, data: [] };
        }
      };

      const [
        discipleshipData,
        sessionsData,
        discipleshipRegistrationsData,
        resourcesData,
        membershipRenewalsData,
        foundationRegistrationsData,
        eventSignupsData,
      ] = await Promise.all([
        processResponse(discipleshipRes, "Discipleship Classes"),
        processResponse(sessionsRes, "Discipleship Sessions"),
        processResponse(
          discipleshipRegistrationsRes,
          "Discipleship Registrations",
        ),
        processResponse(resourcesRes, "Resources"),
        processResponse(membershipRenewalsRes, "Membership Renewals"),
        processResponse(foundationRegistrationsRes, "Foundation Registrations"),
        processResponse(eventSignupsRes, "Event Signups"),
      ]);

      setReportData({
        discipleshipClasses: discipleshipData.success
          ? discipleshipData.data
          : [],
        sessions: sessionsData.success ? sessionsData.data : [],
        discipleshipRegistrations: discipleshipRegistrationsData.success
          ? discipleshipRegistrationsData.data
          : [],
        resources: resourcesData.success ? resourcesData.data : [],
        membershipRenewals: membershipRenewalsData.success
          ? membershipRenewalsData.data
          : [],
        foundationRegistrations: foundationRegistrationsData.success
          ? foundationRegistrationsData.data
          : [],
        eventSignups: eventSignupsData.success ? eventSignupsData.data : [],
      });
    } catch (error) {
      console.error("Error fetching report data:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateOverviewStats = () => {
    const {
      discipleshipClasses = [],
      sessions = [],
      discipleshipRegistrations = [],
      resources = [],
      membershipRenewals = [],
      foundationRegistrations = [],
      eventSignups = [],
    } = reportData;

    // Discipleship stats
    const totalDiscipleshipClasses = discipleshipClasses.length;
    const totalDiscipleshipSessions = sessions.length;
    const totalDiscipleshipRegistrations = discipleshipRegistrations.length;

    // All registrations stats
    const totalMembershipRenewals = membershipRenewals.length;
    const totalFoundationRegistrations = foundationRegistrations.length;
    const totalEventSignups = eventSignups.length;
    const totalAllRegistrations =
      totalDiscipleshipRegistrations +
      totalMembershipRenewals +
      totalFoundationRegistrations +
      totalEventSignups;

    // Resources stats
    const totalResources = resources.length;

    // Status breakdown for all types
    const pendingRequests = [
      ...discipleshipRegistrations.filter((r) => r.status === "pending"),
      ...membershipRenewals.filter((r) => r.status === "pending"),
      ...foundationRegistrations.filter((r) => r.status === "pending"),
      ...eventSignups.filter((r) => r.status === "pending"),
    ].length;

    const approvedRequests = [
      ...discipleshipRegistrations.filter(
        (r) => r.status === "approved" || r.status === "attending",
      ),
      ...membershipRenewals.filter((r) => r.status === "approved"),
      ...foundationRegistrations.filter(
        (r) => r.status === "approved" || r.status === "attending",
      ),
      ...eventSignups.filter((r) => r.status === "approved"),
    ].length;

    const completedRequests = [
      ...discipleshipRegistrations.filter((r) => r.status === "completed"),
      ...membershipRenewals.filter((r) => r.status === "completed"),
      ...foundationRegistrations.filter((r) => r.status === "completed"),
      ...eventSignups.filter((r) => r.status === "completed"),
    ].length;

    const activeSessions = sessions.filter((s) => s.status === "active").length;

    const classLevels = discipleshipClasses.reduce((acc, cls) => {
      acc[cls.level] = (acc[cls.level] || 0) + 1;
      return acc;
    }, {});

    const resourceCategories = resources.reduce((acc, res) => {
      acc[res.category] = (acc[res.category] || 0) + 1;
      return acc;
    }, {});

    // Request types breakdown
    const requestTypes = {
      "Discipleship Classes": totalDiscipleshipRegistrations,
      "Foundation Classes": totalFoundationRegistrations,
      "Membership Renewals": totalMembershipRenewals,
      "Event Signups": totalEventSignups,
    };

    return {
      // Discipleship specific
      totalDiscipleshipClasses,
      totalDiscipleshipSessions,
      totalDiscipleshipRegistrations,

      // All requests overview
      totalAllRegistrations,
      totalMembershipRenewals,
      totalFoundationRegistrations,
      totalEventSignups,

      // Resources
      totalResources,

      // Status breakdown
      pendingRequests,
      approvedRequests,
      completedRequests,
      activeSessions,

      // Categories
      classLevels,
      resourceCategories,
      requestTypes,
    };
  };

  const generateSessionReport = () => {
    const { sessions = [], discipleshipRegistrations = [] } = reportData;

    return sessions.map((session) => {
      const sessionRegistrations = discipleshipRegistrations.filter(
        (r) => r.sessionId?._id === session._id,
      );
      const completedCount = sessionRegistrations.filter(
        (r) => r.status === "completed",
      ).length;
      const averageAttendance =
        sessionRegistrations.reduce((sum, reg) => {
          return sum + (reg.attendancePercentage || 0);
        }, 0) / (sessionRegistrations.length || 1);

      return {
        ...session,
        registrationCount: sessionRegistrations.length,
        completedCount,
        completionRate:
          sessionRegistrations.length > 0
            ? Math.round((completedCount / sessionRegistrations.length) * 100)
            : 0,
        averageAttendance: Math.round(averageAttendance),
        capacity: session.capacity,
        utilizationRate: Math.round(
          (sessionRegistrations.length / session.capacity) * 100,
        ),
      };
    });
  };

  const generateStudentReport = () => {
    const { discipleshipRegistrations = [] } = reportData;

    const statusBreakdown = discipleshipRegistrations.reduce((acc, reg) => {
      acc[reg.status] = (acc[reg.status] || 0) + 1;
      return acc;
    }, {});

    const attendanceRanges = discipleshipRegistrations.reduce((acc, reg) => {
      const attendance = reg.attendancePercentage || 0;
      if (attendance >= 90) acc.excellent = (acc.excellent || 0) + 1;
      else if (attendance >= 80) acc.good = (acc.good || 0) + 1;
      else if (attendance >= 70) acc.fair = (acc.fair || 0) + 1;
      else acc.poor = (acc.poor || 0) + 1;
      return acc;
    }, {});

    return {
      totalStudents: discipleshipRegistrations.length,
      statusBreakdown,
      attendanceRanges,
    };
  };

  const generateResourceReport = () => {
    const { resources = [] } = reportData;

    const categoryBreakdown = resources.reduce((acc, res) => {
      acc[res.category] = (acc[res.category] || 0) + 1;
      return acc;
    }, {});

    const typeBreakdown = resources.reduce((acc, res) => {
      acc[res.type] = (acc[res.type] || 0) + 1;
      return acc;
    }, {});

    const totalDownloads = resources.reduce(
      (sum, res) => sum + (res.downloads || 0),
      0,
    );
    const totalViews = resources.reduce(
      (sum, res) => sum + (res.views || 0),
      0,
    );

    const topResources = resources
      .sort((a, b) => (b.downloads || 0) - (a.downloads || 0))
      .slice(0, 10);

    return {
      totalResources: resources.length,
      categoryBreakdown,
      typeBreakdown,
      totalDownloads,
      totalViews,
      topResources,
    };
  };

  const exportReport = (reportType) => {
    let csvData = "";
    let filename = "";

    switch (reportType) {
      case "sessions":
        const sessionReport = generateSessionReport();
        csvData = generateSessionCSV(sessionReport);
        filename = "session-report";
        break;
      case "students":
        csvData = generateStudentCSV();
        filename = "student-report";
        break;
      case "resources":
        csvData = generateResourceCSV();
        filename = "resource-report";
        break;
      default:
        csvData = generateOverviewCSV();
        filename = "overview-report";
    }

    downloadCSV(
      csvData,
      `${filename}-${new Date().toISOString().split("T")[0]}.csv`,
    );
  };

  const generateSessionCSV = (sessionReport) => {
    const headers = [
      "Session",
      "Class",
      "Start Date",
      "End Date",
      "Capacity",
      "Enrolled",
      "Completed",
      "Completion Rate",
      "Avg Attendance",
      "Utilization Rate",
    ];
    const rows = sessionReport.map((session) => [
      session.cohortName,
      session.classId.title,
      new Date(session.startDate).toLocaleDateString(),
      new Date(session.endDate).toLocaleDateString(),
      session.capacity,
      session.registrationCount,
      session.completedCount,
      `${session.completionRate}%`,
      `${session.averageAttendance}%`,
      `${session.utilizationRate}%`,
    ]);

    return [headers, ...rows].map((row) => row.join(",")).join("\n");
  };

  const generateStudentCSV = () => {
    const headers = [
      "Name",
      "Email",
      "Class",
      "Session",
      "Status",
      "Registration Date",
      "Attendance %",
    ];
    const rows = reportData.registrations.map((reg) => [
      reg.fullName,
      reg.email,
      reg.classId.title,
      reg.sessionId.cohortName,
      reg.status,
      new Date(reg.registrationDate).toLocaleDateString(),
      `${reg.attendancePercentage || 0}%`,
    ]);

    return [headers, ...rows].map((row) => row.join(",")).join("\n");
  };

  const generateResourceCSV = () => {
    const headers = [
      "Title",
      "Category",
      "Type",
      "Views",
      "Downloads",
      "Featured",
      "Created Date",
    ];
    const rows = reportData.resources.map((res) => [
      res.title,
      res.category,
      res.type,
      res.views || 0,
      res.downloads || 0,
      res.featured ? "Yes" : "No",
      new Date(res.createdAt).toLocaleDateString(),
    ]);

    return [headers, ...rows].map((row) => row.join(",")).join("\n");
  };

  const generateOverviewCSV = () => {
    const stats = generateOverviewStats();
    const data = [
      ["Metric", "Value"],
      ["Total Classes", stats.totalClasses],
      ["Total Sessions", stats.totalSessions],
      ["Total Registrations", stats.totalRegistrations],
      ["Total Resources", stats.totalResources],
      ["Active Sessions", stats.activeSessions],
      ["Completed Students", stats.completedStudents],
      ["Average Attendance", `${stats.averageAttendance}%`],
      ["", ""],
      ["Class Levels", ""],
      ...Object.entries(stats.classLevels).map(([level, count]) => [
        `${level} Classes`,
        count,
      ]),
      ["", ""],
      ["Resource Categories", ""],
      ...Object.entries(stats.resourceCategories).map(([category, count]) => [
        `${category} Resources`,
        count,
      ]),
    ];

    return data.map((row) => row.join(",")).join("\n");
  };

  const downloadCSV = (csvData, filename) => {
    const blob = new Blob([csvData], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const overviewStats = generateOverviewStats();
  const sessionReport = generateSessionReport();
  const studentReport = generateStudentReport();
  const resourceReport = generateResourceReport();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Reports & Analytics
        </h1>
        <div className="flex space-x-3">
          <button
            onClick={fetchReportData}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            <FaSync />
            <span>Refresh</span>
          </button>
          <button
            onClick={() => exportReport(activeReport)}
            className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            <FaDownload />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Date Range Filter */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Start Date
            </label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) =>
                setDateRange((prev) => ({ ...prev, start: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              End Date
            </label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) =>
                setDateRange((prev) => ({ ...prev, end: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div className="flex items-end">
            <select
              value={activeReport}
              onChange={(e) => setActiveReport(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="overview">Overview</option>
              <option value="sessions">Sessions</option>
              <option value="students">Students</option>
              <option value="resources">Resources</option>
            </select>
          </div>
        </div>
      </div>

      {/* Report Content */}
      {activeReport === "overview" && (
        <>
          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <FaGraduationCap className="text-blue-600 dark:text-blue-400 text-2xl mr-4" />
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {overviewStats.totalClasses}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Total Classes
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <FaCalendarAlt className="text-green-600 dark:text-green-400 text-2xl mr-4" />
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {overviewStats.activeSessions}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Active Sessions
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <FaUsers className="text-purple-600 dark:text-purple-400 text-2xl mr-4" />
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {overviewStats.totalRegistrations}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Total Students
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <FaFileAlt className="text-orange-600 dark:text-orange-400 text-2xl mr-4" />
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {overviewStats.totalResources}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Resources
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Class Levels Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Classes by Level</h3>
              <div className="space-y-3">
                {Object.entries(overviewStats.classLevels).map(
                  ([level, count]) => (
                    <div
                      key={level}
                      className="flex justify-between items-center"
                    >
                      <span className="capitalize text-gray-600 dark:text-gray-400">
                        {level}
                      </span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              level === "beginner"
                                ? "bg-green-500"
                                : level === "intermediate"
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                            }`}
                            style={{
                              width: `${(count / overviewStats.totalClasses) * 100}%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{count}</span>
                      </div>
                    </div>
                  ),
                )}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Key Metrics</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">
                    Completed Students
                  </span>
                  <span className="text-lg font-semibold text-green-600">
                    {overviewStats.completedStudents}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">
                    Average Attendance
                  </span>
                  <span className="text-lg font-semibold text-blue-600">
                    {overviewStats.averageAttendance}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">
                    Completion Rate
                  </span>
                  <span className="text-lg font-semibold text-purple-600">
                    {Math.round(
                      (overviewStats.completedStudents /
                        overviewStats.totalRegistrations) *
                        100,
                    )}
                    %
                  </span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {activeReport === "sessions" && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">
              Session Performance Report
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Session
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Class
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Enrolled/Capacity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Completion Rate
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Avg Attendance
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Utilization
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-600">
                  {sessionReport.map((session) => (
                    <tr key={session._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {session.cohortName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {session.classId.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {session.registrationCount}/{session.capacity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            session.completionRate >= 80
                              ? "bg-green-100 text-green-800"
                              : session.completionRate >= 60
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {session.completionRate}%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {session.averageAttendance}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {session.utilizationRate}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeReport === "students" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">
              Student Status Breakdown
            </h3>
            <div className="space-y-3">
              {Object.entries(studentReport.statusBreakdown).map(
                ([status, count]) => (
                  <div
                    key={status}
                    className="flex justify-between items-center"
                  >
                    <span className="capitalize text-gray-600 dark:text-gray-400">
                      {status}
                    </span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            status === "completed"
                              ? "bg-green-500"
                              : status === "attending"
                                ? "bg-blue-500"
                                : status === "approved"
                                  ? "bg-yellow-500"
                                  : "bg-gray-500"
                          }`}
                          style={{
                            width: `${(count / studentReport.totalStudents) * 100}%`,
                          }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{count}</span>
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">
              Attendance Distribution
            </h3>
            <div className="space-y-3">
              {Object.entries(studentReport.attendanceRanges).map(
                ([range, count]) => (
                  <div
                    key={range}
                    className="flex justify-between items-center"
                  >
                    <span className="capitalize text-gray-600 dark:text-gray-400">
                      {range === "excellent"
                        ? "90-100%"
                        : range === "good"
                          ? "80-89%"
                          : range === "fair"
                            ? "70-79%"
                            : "Below 70%"}
                    </span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            range === "excellent"
                              ? "bg-green-500"
                              : range === "good"
                                ? "bg-blue-500"
                                : range === "fair"
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                          }`}
                          style={{
                            width: `${(count / studentReport.totalStudents) * 100}%`,
                          }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{count}</span>
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      )}

      {activeReport === "resources" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <FaFileAlt className="text-blue-600 dark:text-blue-400 text-2xl mr-4" />
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {resourceReport.totalResources}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Total Resources
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <FaEye className="text-green-600 dark:text-green-400 text-2xl mr-4" />
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {resourceReport.totalViews.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Total Views
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <FaDownload className="text-purple-600 dark:text-purple-400 text-2xl mr-4" />
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {resourceReport.totalDownloads.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Total Downloads
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <FaTrophy className="text-orange-600 dark:text-orange-400 text-2xl mr-4" />
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {resourceReport.topResources[0]?.downloads || 0}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Top Downloads
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">
                Top Downloaded Resources
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Resource
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Downloads
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Views
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-600">
                    {resourceReport.topResources.map((resource) => (
                      <tr key={resource._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {resource.title}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {resource.category.replace("_", " ")}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {resource.type}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {resource.downloads || 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {resource.views || 0}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsAdmin;
