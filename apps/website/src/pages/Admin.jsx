import { useState, useEffect } from "react";
import { Navigate, useSearchParams, useNavigate } from "react-router-dom";
import {
  login,
  isAuthenticated,
  logout,
  verifyAuth,
  getCurrentUser,
} from "../services/api";
import SermonManager from "../components/admin/SermonManager";
import SermonManagerWrapper from "../components/admin/SermonManagerWrapper";
import EventManager from "../components/admin/EventManager";
import LeaderManager from "../components/admin/LeaderManager";
import CellGroupManager from "../components/admin/CellGroupManager";
import MediaManager from "../components/admin/MediaManager";
import FoundationClassSessionManager from "../components/admin/FoundationClassSessionManager";
import DashboardContent from "../components/admin/DashboardContent";
import SettingsContent from "../components/admin/SettingsContent";
import RequestsManager from "../components/admin/RequestsManager";
import AdminFooter from "../components/admin/AdminFooter";
import {
  HomeIcon,
  VideoCameraIcon,
  CalendarIcon,
  UserGroupIcon,
  UsersIcon,
  PhotoIcon,
  Cog8ToothIcon,
  ArrowLeftOnRectangleIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  BellIcon,
  IdentificationIcon,
  SunIcon,
  MoonIcon,
  AcademicCapIcon,
} from "@heroicons/react/24/outline";

const Admin = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [authenticated, setAuthenticated] = useState(false);
  const [authenticating, setAuthenticating] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState(
    searchParams.get("tab") || "dashboard"
  );
  const [loginError, setLoginError] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notificationDropdownOpen, setNotificationDropdownOpen] =
    useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    // Check for saved preference or system preference
    const savedMode = localStorage.getItem("darkMode");
    if (savedMode !== null) {
      return savedMode === "true";
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });
  const [notifications] = useState([
    { id: 1, text: "New sermon uploaded", time: "5m ago" },
    { id: 2, text: 'Event "Youth Sunday" updated', time: "1h ago" },
  ]);

  // Apply dark mode class to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    // Save preference
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Authentication effect
  useEffect(() => {
    // Check authentication status on load
    const checkAuth = async () => {
      setAuthenticating(true);
      const isAuthed = isAuthenticated();

      if (isAuthed) {
        // Verify with server that token is still valid
        const valid = await verifyAuth();
        setAuthenticated(valid);

        if (valid) {
          setCurrentUser(getCurrentUser());
        } else {
          // If server says token is invalid, log out
          logout();
          setAuthenticated(false);
        }
      } else {
        setAuthenticated(false);
      }

      setAuthenticating(false);
    };

    checkAuth();
  }, []);

  // Initialize tab from URL on first render only
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, []); // Empty dependency array means this runs once on mount

  // Handle tab change and update URL
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setSearchParams({ tab: tabId }, { replace: true });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");

    try {
      const success = await login(username, password);
      if (success) {
        setAuthenticated(true);
        setCurrentUser(getCurrentUser());

        // Get the redirect URL from query params if it exists
        const params = new URLSearchParams(window.location.search);
        const redirectTo = params.get("redirectTo") || "/admin";
        navigate(redirectTo);
      } else {
        setLoginError("Invalid username or password");
      }
    } catch (error) {
      setLoginError("Error logging in. Please try again.");
      console.error("Login error:", error);
    }
  };

  const handleLogout = () => {
    logout();
    setAuthenticated(false);
    setCurrentUser(null);
    navigate("/admin");
  };

  const toggleNotifications = () => {
    setNotificationDropdownOpen(!notificationDropdownOpen);
  };

  // Close notification dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationDropdownOpen &&
        !event.target.closest(".notification-area")
      ) {
        setNotificationDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [notificationDropdownOpen]);

  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: HomeIcon, count: null },
    { id: "sermons", label: "Sermons", icon: VideoCameraIcon, count: 4 },
    { id: "events", label: "Events", icon: CalendarIcon, count: 2 },
    { id: "leaders", label: "Leadership", icon: UserGroupIcon, count: null },
    { id: "cellGroups", label: "Cell Groups", icon: UsersIcon, count: 3 },
    {
      id: "members",
      label: "Membership",
      icon: IdentificationIcon,
      count: null,
    },
    {
      id: "foundationClasses",
      label: "Foundation Classes",
      icon: AcademicCapIcon,
      count: null,
    },
    { id: "media", label: "Media Library", icon: PhotoIcon, count: null },
    { id: "settings", label: "Settings", icon: Cog8ToothIcon, count: null },
  ];

  // Get current year for footer
  const currentYear = new Date().getFullYear();

  // Show loading state during authentication check
  if (authenticating) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}
      >
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  // Show login form if not authenticated
  if (!authenticated) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center px-4 transition-colors duration-200 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}
      >
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <img
              src="/assets/logo.png"
              alt="Victory Bible Church"
              className="mx-auto h-16 w-auto mb-4"
            />
            <h2
              className={`text-3xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}
            >
              Welcome Back
            </h2>
            <p
              className={`mt-2 text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}
            >
              Sign in to access your admin dashboard
            </p>
          </div>

          <div
            className={`rounded-xl shadow-lg p-8 transition-colors duration-200 ${darkMode ? "bg-gray-800 border border-gray-700" : "bg-white"}`}
          >
            <div className="flex justify-end mb-4">
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-full ${darkMode ? "bg-gray-700 text-yellow-300" : "bg-gray-100 text-gray-700"}`}
                aria-label={
                  darkMode ? "Switch to light mode" : "Switch to dark mode"
                }
              >
                {darkMode ? (
                  <SunIcon className="h-5 w-5" />
                ) : (
                  <MoonIcon className="h-5 w-5" />
                )}
              </button>
            </div>

            {loginError && (
              <div
                className={`border-l-4 p-4 mb-6 ${darkMode ? "bg-red-900/30 border-red-600 text-red-200" : "bg-red-50 border-red-400 text-red-700"}`}
              >
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className={`h-5 w-5 ${darkMode ? "text-red-500" : "text-red-400"}`}
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm">{loginError}</p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label
                  htmlFor="username"
                  className={`block text-sm font-medium ${darkMode ? "text-gray-200" : "text-gray-700"}`}
                >
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  className={`mt-1 block w-full px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white focus:border-blue-500"
                      : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                  }`}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className={`block text-sm font-medium ${darkMode ? "text-gray-200" : "text-gray-700"}`}
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  className={`mt-1 block w-full px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white focus:border-blue-500"
                      : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                  }`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
              >
                Sign in to Dashboard
              </button>

              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={() => {
                    localStorage.removeItem("auth");
                    sessionStorage.clear();
                    window.location.reload();
                  }}
                  className={`text-sm hover:underline transition-colors duration-200 ${darkMode ? "text-gray-400 hover:text-gray-300" : "text-gray-500 hover:text-gray-700"}`}
                >
                  Reset Authentication State
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-200 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}
    >
      {/* Top Navigation */}
      <header
        className={`shadow-sm z-20 transition-colors duration-200 ${darkMode ? "bg-gray-800 border-b border-gray-700" : "bg-white"}`}
      >
        <div className="h-16 px-4 flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className={`p-2 mr-3 rounded-lg transition-colors duration-200 ${
                darkMode
                  ? "hover:bg-gray-700 text-gray-300"
                  : "hover:bg-gray-100 text-gray-500"
              }`}
              aria-label={
                sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"
              }
            >
              {sidebarCollapsed ? (
                <ChevronDoubleRightIcon className="h-5 w-5" />
              ) : (
                <ChevronDoubleLeftIcon className="h-5 w-5" />
              )}
            </button>

            <div className="flex items-center">
              <img
                src="/assets/logo.png"
                alt="Victory Bible Church"
                className="h-8 w-auto"
              />
              <span
                className={`ml-3 font-semibold transition-colors duration-200 ${darkMode ? "text-white" : "text-gray-800"}`}
              >
                Admin Portal
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Dark mode toggle */}
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-lg transition-colors duration-200 ${
                darkMode
                  ? "bg-gray-700 text-yellow-300 hover:bg-gray-600"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              aria-label={
                darkMode ? "Switch to light mode" : "Switch to dark mode"
              }
            >
              {darkMode ? (
                <SunIcon className="h-5 w-5" />
              ) : (
                <MoonIcon className="h-5 w-5" />
              )}
            </button>

            {/* Notifications dropdown */}
            <div className="relative notification-area">
              <button
                className={`p-2 rounded-lg relative transition-colors duration-200 ${
                  darkMode
                    ? "hover:bg-gray-700 text-gray-300"
                    : "hover:bg-gray-100 text-gray-500"
                }`}
                onClick={toggleNotifications}
                aria-label="Notifications"
              >
                <BellIcon className="h-5 w-5" />
                {notifications.length > 0 && (
                  <span className="absolute top-1 right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {notificationDropdownOpen && (
                <div
                  className={`absolute right-0 mt-2 w-80 rounded-lg shadow-lg z-50 overflow-hidden transition-colors duration-200 ${
                    darkMode
                      ? "bg-gray-800 border border-gray-700"
                      : "bg-white border border-gray-200"
                  }`}
                >
                  <div
                    className={`p-3 border-b transition-colors duration-200 ${
                      darkMode ? "border-gray-700" : "border-gray-200"
                    }`}
                  >
                    <h3
                      className={`text-sm font-semibold ${
                        darkMode ? "text-gray-200" : "text-gray-700"
                      }`}
                    >
                      Notifications
                    </h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div
                        className={`py-4 px-3 text-center ${
                          darkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        No new notifications
                      </div>
                    ) : (
                      <div>
                        {notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`px-3 py-2 border-b transition-colors duration-200 ${
                              darkMode
                                ? "hover:bg-gray-700 border-gray-700"
                                : "hover:bg-gray-50 border-gray-100"
                            }`}
                          >
                            <p
                              className={`text-sm ${
                                darkMode ? "text-gray-200" : "text-gray-800"
                              }`}
                            >
                              {notification.text}
                            </p>
                            <p
                              className={`text-xs mt-1 ${
                                darkMode ? "text-gray-400" : "text-gray-500"
                              }`}
                            >
                              {notification.time}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div
                    className={`p-2 border-t text-center transition-colors duration-200 ${
                      darkMode ? "border-gray-700" : "border-gray-200"
                    }`}
                  >
                    <button
                      className={`text-xs hover:underline ${
                        darkMode
                          ? "text-blue-400 hover:text-blue-300"
                          : "text-blue-600 hover:text-blue-800"
                      }`}
                    >
                      View all notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* User info and logout */}
            <div className="flex items-center space-x-3">
              <div
                className={`text-right hidden sm:block transition-colors duration-200 ${
                  darkMode ? "text-gray-200" : "text-gray-900"
                }`}
              >
                <p className="text-sm font-medium">{currentUser?.username}</p>
                <p
                  className={`text-xs ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {currentUser?.role}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className={`flex items-center px-3 py-2 rounded-lg font-medium transition-all duration-200 ${
                  darkMode
                    ? "bg-red-900/30 text-red-300 hover:bg-red-900/50"
                    : "bg-red-50 text-red-700 hover:bg-red-100"
                }`}
                title="Sign out"
              >
                <ArrowLeftOnRectangleIcon
                  className={`h-5 w-5 mr-1 ${
                    darkMode ? "text-red-400" : "text-red-500"
                  }`}
                />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Navigation */}
        <aside
          className={`border-r transition-all duration-200 z-10 overflow-y-auto ${
            sidebarCollapsed ? "w-16" : "w-64"
          } ${
            darkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <nav className="p-4 space-y-1">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id)}
                className={`w-full flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 ${
                  activeTab === item.id
                    ? darkMode
                      ? "bg-blue-900/30 text-blue-300"
                      : "bg-blue-50 text-blue-700"
                    : darkMode
                      ? "text-gray-300 hover:bg-gray-700"
                      : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <item.icon
                  className={`h-5 w-5 ${
                    activeTab === item.id
                      ? darkMode
                        ? "text-blue-400"
                        : "text-blue-700"
                      : darkMode
                        ? "text-gray-400"
                        : "text-gray-400"
                  }`}
                />
                {!sidebarCollapsed && (
                  <>
                    <span className="ml-3 flex-1 text-left font-medium">
                      {item.label}
                    </span>
                    {item.count !== null && (
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          activeTab === item.id
                            ? darkMode
                              ? "bg-blue-800 text-blue-200"
                              : "bg-blue-100 text-blue-800"
                            : darkMode
                              ? "bg-gray-700 text-gray-300"
                              : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {item.count}
                      </span>
                    )}
                  </>
                )}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content Area */}
        <main
          className={`flex-1 overflow-y-auto transition-colors duration-200 ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}
        >
          <div className="p-6 flex flex-col h-full">
            {/* Page Header */}
            <div className="mb-6">
              <h1
                className={`text-2xl font-bold transition-colors duration-200 ${darkMode ? "text-white" : "text-gray-900"}`}
              >
                {navigationItems.find((item) => item.id === activeTab)?.label ||
                  "Dashboard"}
              </h1>
              <p
                className={`mt-1 text-sm transition-colors duration-200 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
              >
                Manage your{" "}
                {navigationItems
                  .find((item) => item.id === activeTab)
                  ?.label.toLowerCase() || "dashboard"}{" "}
                content
              </p>
            </div>

            {/* Content Card */}
            <div
              className={`rounded-xl shadow-sm p-6 flex-1 mb-6 transition-colors duration-200 ${
                darkMode ? "bg-gray-800 border border-gray-700" : "bg-white"
              }`}
            >
              {activeTab === "sermons" && (
                <SermonManagerWrapper darkMode={darkMode} />
              )}
              {activeTab === "events" && <EventManager darkMode={darkMode} />}
              {activeTab === "leaders" && <LeaderManager darkMode={darkMode} />}
              {activeTab === "cellGroups" && (
                <CellGroupManager darkMode={darkMode} />
              )}
              {activeTab === "foundationClasses" && (
                <FoundationClassSessionManager darkMode={darkMode} />
              )}
              {activeTab === "media" && <MediaManager darkMode={darkMode} />}
              {activeTab === "dashboard" && (
                <DashboardContent darkMode={darkMode} />
              )}
              {activeTab === "settings" && (
                <SettingsContent
                  darkMode={darkMode}
                  setDarkMode={setDarkMode}
                />
              )}
              {activeTab === "members" && (
                <RequestsManager darkMode={darkMode} />
              )}
            </div>

            {/* Admin Footer */}
            <AdminFooter darkMode={darkMode} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Admin;
