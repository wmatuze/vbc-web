import { useState, useEffect } from "react";
import { Outlet, NavLink, useNavigate, Navigate, useLocation } from "react-router-dom";
import {
  isAuthenticated,
  verifyAuth,
  logout,
  getCurrentUser,
} from "../../services/api/auth";
import { DarkModeProvider, useDarkMode } from "../../contexts/DarkModeContext";
import AdminFooter from "./AdminFooter";
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
  BookOpenIcon,
  DocumentTextIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

const NAV_ITEMS = [
  { path: "/admin",               label: "Dashboard",           icon: HomeIcon,          end: true },
  { path: "/admin/sermons",       label: "Sermons",             icon: VideoCameraIcon },
  { path: "/admin/events",        label: "Events",              icon: CalendarIcon },
  { path: "/admin/recurring-events", label: "Recurring Events", icon: CalendarIcon },
  { path: "/admin/leaders",       label: "Leadership",          icon: UserGroupIcon },
  { path: "/admin/cell-groups",   label: "Cell Groups",         icon: UsersIcon },
  { path: "/admin/members",       label: "Members & Requests",  icon: IdentificationIcon },
  { path: "/admin/foundation-classes", label: "Foundation Classes", icon: AcademicCapIcon },
  { path: "/admin/discipleship",  label: "Discipleship",        icon: BookOpenIcon },
  { path: "/admin/resources",     label: "Resources",           icon: DocumentTextIcon },
  { path: "/admin/reports",       label: "Reports",             icon: ChartBarIcon },
  { path: "/admin/media",         label: "Media Library",       icon: PhotoIcon },
  { path: "/admin/settings",      label: "Settings",            icon: Cog8ToothIcon },
];

const PAGE_TITLES = {
  "/admin":                    { title: "Dashboard",           sub: "Overview of your church content" },
  "/admin/sermons":            { title: "Sermons",             sub: "Manage sermon recordings and notes" },
  "/admin/events":             { title: "Events",              sub: "Manage upcoming church events" },
  "/admin/recurring-events":   { title: "Recurring Events",    sub: "Manage regular weekly and monthly programs" },
  "/admin/leaders":            { title: "Leadership",          sub: "Manage church leaders and pastors" },
  "/admin/cell-groups":        { title: "Cell Groups",         sub: "Manage zones and cell groups" },
  "/admin/members":            { title: "Members & Requests",  sub: "Review membership and signup requests" },
  "/admin/foundation-classes": { title: "Foundation Classes",  sub: "Manage foundation class sessions" },
  "/admin/discipleship":       { title: "Discipleship",        sub: "Manage discipleship programs" },
  "/admin/resources":          { title: "Resources",           sub: "Manage documents and links" },
  "/admin/reports":            { title: "Reports",             sub: "View analytics and reports" },
  "/admin/media":              { title: "Media Library",       sub: "Manage uploaded images and files" },
  "/admin/settings":           { title: "Settings",            sub: "Configure your admin portal" },
  "/admin/help":               { title: "Admin Guide",         sub: "Documentation and help" },
  "/admin/support":            { title: "Support",             sub: "Get help from the team" },
};

const AdminLayoutInner = () => {
  const { darkMode, toggleDarkMode } = useDarkMode();
  const navigate = useNavigate();
  const location = useLocation();
  const page = PAGE_TITLES[location.pathname] ?? { title: "Admin", sub: "" };

  const [authenticated, setAuthenticated] = useState(false);
  const [authenticating, setAuthenticating] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const authed = isAuthenticated();
      if (authed) {
        const valid = await verifyAuth();
        if (valid) {
          setAuthenticated(true);
          setCurrentUser(getCurrentUser());
        } else {
          logout();
        }
      }
      setAuthenticating(false);
    };
    checkAuth();
  }, []);

  useEffect(() => {
    const close = (e) => {
      if (!e.target.closest(".notification-area")) setNotificationsOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/admin/login", { replace: true });
  };

  if (authenticating) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  if (!authenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className={`h-screen flex flex-col overflow-hidden transition-colors duration-200 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>

      {/* Top header — fixed height, never shrinks */}
      <header className={`h-16 flex-shrink-0 px-4 flex items-center justify-between shadow-sm z-20 transition-colors duration-200 ${darkMode ? "bg-gray-800 border-b border-gray-700" : "bg-white border-b border-gray-200"}`}>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarCollapsed((c) => !c)}
            className={`p-2 rounded-lg transition-colors ${darkMode ? "hover:bg-gray-700 text-gray-300" : "hover:bg-gray-100 text-gray-500"}`}
            aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {sidebarCollapsed
              ? <ChevronDoubleRightIcon className="h-5 w-5" />
              : <ChevronDoubleLeftIcon className="h-5 w-5" />}
          </button>
          <img src="/assets/logo.png" alt="Victory Bible Church" className="h-8 w-auto" />
          <span className={`font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}>Admin Portal</span>
        </div>

        <div className="flex items-center gap-3">
          {/* Dark mode toggle */}
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-lg transition-colors ${darkMode ? "bg-gray-700 text-yellow-300 hover:bg-gray-600" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
          </button>

          {/* Notifications */}
          <div className="relative notification-area">
            <button
              onClick={() => setNotificationsOpen((o) => !o)}
              className={`p-2 rounded-lg transition-colors ${darkMode ? "hover:bg-gray-700 text-gray-300" : "hover:bg-gray-100 text-gray-500"}`}
              aria-label="Notifications"
            >
              <BellIcon className="h-5 w-5" />
            </button>
            {notificationsOpen && (
              <div className={`absolute right-0 mt-2 w-72 rounded-lg shadow-lg z-50 overflow-hidden ${darkMode ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"}`}>
                <div className={`px-4 py-3 border-b ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
                  <p className={`text-sm font-semibold ${darkMode ? "text-gray-200" : "text-gray-700"}`}>Notifications</p>
                </div>
                <div className={`px-4 py-6 text-center text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                  No new notifications
                </div>
              </div>
            )}
          </div>

          {/* User + logout */}
          <div className="hidden sm:block text-right">
            <p className={`text-sm font-medium ${darkMode ? "text-gray-200" : "text-gray-900"}`}>{currentUser?.username}</p>
            <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{currentUser?.role}</p>
          </div>
          <button
            onClick={handleLogout}
            className={`flex items-center gap-1 px-3 py-2 rounded-lg font-medium text-sm transition-colors ${darkMode ? "bg-red-900/30 text-red-300 hover:bg-red-900/50" : "bg-red-50 text-red-700 hover:bg-red-100"}`}
          >
            <ArrowLeftOnRectangleIcon className="h-5 w-5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Body — fills remaining viewport height, both columns scroll independently */}
      <div className="flex flex-1 min-h-0 overflow-hidden">

        {/* Sidebar */}
        <aside className={`border-r transition-all duration-200 z-10 overflow-y-auto flex-shrink-0 ${sidebarCollapsed ? "w-16" : "w-60"} ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
          <nav className="p-3 space-y-0.5">
            {NAV_ITEMS.map(({ path, label, icon: Icon, end }) => (
              <NavLink
                key={path}
                to={path}
                end={end}
                className={({ isActive }) =>
                  `w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-150 text-sm font-medium ${
                    isActive
                      ? darkMode ? "bg-blue-900/40 text-blue-300" : "bg-blue-50 text-blue-700"
                      : darkMode ? "text-gray-300 hover:bg-gray-700" : "text-gray-600 hover:bg-gray-50"
                  }`
                }
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {!sidebarCollapsed && <span className="truncate">{label}</span>}
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className={`flex-1 overflow-y-auto transition-colors duration-200 ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
          <div className="p-6 flex flex-col min-h-full max-w-[1920px] mx-auto">
            {/* Page header */}
            <div className="mb-6">
              <h1 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
                {page.title}
              </h1>
              {page.sub && (
                <p className={`mt-1 text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                  {page.sub}
                </p>
              )}
            </div>

            {/* Section content card */}
            <div className={`rounded-xl shadow-sm p-6 flex-1 mb-6 transition-colors duration-200 ${darkMode ? "bg-gray-800 border border-gray-700" : "bg-white"}`}>
              <Outlet />
            </div>
            <AdminFooter />
          </div>
        </main>
      </div>
    </div>
  );
};

const AdminLayout = () => (
  <DarkModeProvider>
    <AdminLayoutInner />
  </DarkModeProvider>
);

export default AdminLayout;
