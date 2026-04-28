import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDarkMode } from "../../contexts/DarkModeContext";
import { getCurrentUser } from "../../services/api/auth";
import config from "../../config";
import {
  VideoCameraIcon,
  CalendarIcon,
  UserGroupIcon,
  UsersIcon,
  PlusIcon,
  ArrowRightIcon,
  PhotoIcon,
  DocumentTextIcon,
  ArrowTrendingUpIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

const API = config.API_URL;

const sermonThumb = (s) => {
  if (s?.videoId) return `https://img.youtube.com/vi/${s.videoId}/mqdefault.jpg`;
  const raw = s?.imageUrl;
  if (!raw || raw.includes("default-sermon") || raw.includes("default-image")) return null;
  if (raw.startsWith("http") || raw.startsWith("data:")) return raw;
  return `${API}${raw}`;
};

const fetchCount = async (endpoint) => {
  try {
    const res = await fetch(`${API}${endpoint}`);
    if (!res.ok) return null;
    const data = await res.json();
    return Array.isArray(data) ? data.length : null;
  } catch {
    return null;
  }
};

const StatCard = ({ icon: Icon, label, value, color, to, darkMode }) => (
  <Link
    to={to}
    className={`group flex items-center gap-4 p-5 rounded-xl border transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${
      darkMode
        ? "bg-gray-800 border-gray-600 hover:border-gray-500"
        : "bg-white border-gray-100 hover:border-gray-200"
    }`}
  >
    <div className={`p-3 rounded-xl ${color}`}>
      <Icon className="h-6 w-6 text-white" />
    </div>
    <div className="flex-1 min-w-0">
      <p className={`text-sm font-medium truncate ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{label}</p>
      <p className={`text-2xl font-bold mt-0.5 ${darkMode ? "text-white" : "text-gray-900"}`}>
        {value === null ? (
          <span className="inline-block h-7 w-12 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
        ) : (
          value
        )}
      </p>
    </div>
    <ArrowRightIcon className={`h-4 w-4 flex-shrink-0 transition-transform group-hover:translate-x-1 ${darkMode ? "text-gray-500" : "text-gray-300"}`} />
  </Link>
);

const QuickAction = ({ icon: Icon, label, to, color, darkMode }) => (
  <Link
    to={to}
    className={`flex flex-col items-center gap-2 p-4 rounded-xl border text-center transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${
      darkMode
        ? "bg-gray-800 border-gray-600 hover:border-gray-500"
        : "bg-white border-gray-100 hover:border-gray-200"
    }`}
  >
    <div className={`p-2.5 rounded-lg ${color}`}>
      <Icon className="h-5 w-5 text-white" />
    </div>
    <span className={`text-xs font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>{label}</span>
  </Link>
);

const DashboardContent = () => {
  const { darkMode } = useDarkMode();
  const user = getCurrentUser();

  const [counts, setCounts] = useState({
    sermons: null,
    events: null,
    leaders: null,
    cellGroups: null,
  });
  const [recentSermons, setRecentSermons] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loadingRecent, setLoadingRecent] = useState(true);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  useEffect(() => {
    Promise.all([
      fetchCount("/api/sermons"),
      fetchCount("/api/events"),
      fetchCount("/api/leaders"),
      fetchCount("/api/cell-groups"),
    ]).then(([sermons, events, leaders, cellGroups]) => {
      setCounts({ sermons, events, leaders, cellGroups });
    });

    // Fetch recent sermons
    fetch(`${API}/api/sermons`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setRecentSermons(data.slice(0, 4));
      })
      .catch(() => {})
      .finally(() => setLoadingRecent(false));

    // Fetch upcoming events
    fetch(`${API}/api/events`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const now = Date.now();
          const upcoming = data
            .filter((e) => new Date(e.startDate).getTime() >= now)
            .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
            .slice(0, 4);
          setUpcomingEvents(upcoming);
        }
      })
      .catch(() => {});
  }, []);

  const stats = [
    { icon: VideoCameraIcon, label: "Sermons",     value: counts.sermons,    color: "bg-blue-500",   to: "/admin/sermons"   },
    { icon: CalendarIcon,    label: "Events",      value: counts.events,     color: "bg-violet-500", to: "/admin/events"    },
    { icon: UserGroupIcon,   label: "Leaders",     value: counts.leaders,    color: "bg-amber-500",  to: "/admin/leaders"   },
    { icon: UsersIcon,       label: "Cell Groups", value: counts.cellGroups, color: "bg-emerald-500",to: "/admin/cell-groups"},
  ];

  const quickActions = [
    { icon: PlusIcon,          label: "New Sermon",        to: "/admin/sermons",       color: "bg-blue-500"    },
    { icon: CalendarIcon,      label: "New Event",         to: "/admin/events",        color: "bg-violet-500"  },
    { icon: UserGroupIcon,     label: "New Leader",        to: "/admin/leaders",       color: "bg-amber-500"   },
    { icon: UsersIcon,         label: "Cell Group",        to: "/admin/cell-groups",   color: "bg-emerald-500" },
    { icon: PhotoIcon,         label: "Upload Media",      to: "/admin/media",         color: "bg-pink-500"    },
    { icon: DocumentTextIcon,  label: "Add Resource",      to: "/admin/resources",     color: "bg-cyan-500"    },
  ];

  return (
    <div className="space-y-8">

      {/* Welcome banner */}
      <div className={`relative overflow-hidden rounded-2xl p-6 md:p-8 ${darkMode ? "bg-gradient-to-br from-blue-900/60 to-indigo-900/60 border border-blue-800/40" : "bg-gradient-to-br from-blue-600 to-indigo-600"}`}>
        <div className="relative z-10">
          <p className="text-blue-200 text-sm font-medium mb-1">{greeting()},</p>
          <h2 className="text-white text-2xl md:text-3xl font-bold capitalize">
            {user?.name || user?.username || "Admin"}
          </h2>
          <p className="text-blue-100/80 mt-2 text-sm max-w-lg">
            Welcome to the Victory Bible Church admin portal. Manage your church content, track activity, and keep everything up to date.
          </p>
        </div>
        {/* decorative cross */}
        <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-10 select-none pointer-events-none">
          <svg viewBox="0 0 80 80" className="w-32 h-32 text-white fill-current">
            <rect x="34" y="0"  width="12" height="80" />
            <rect x="0"  y="28" width="80" height="12" />
          </svg>
        </div>
      </div>

      {/* Stats */}
      <div>
        <h3 className={`text-sm font-semibold uppercase tracking-wider mb-3 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
          Content Overview
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {stats.map((s) => (
            <StatCard key={s.label} {...s} darkMode={darkMode} />
          ))}
        </div>
      </div>

      {/* Quick actions */}
      <div>
        <h3 className={`text-sm font-semibold uppercase tracking-wider mb-3 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
          Quick Actions
        </h3>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {quickActions.map((a) => (
            <QuickAction key={a.label} {...a} darkMode={darkMode} />
          ))}
        </div>
      </div>

      {/* Recent content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Recent sermons */}
        <div className={`rounded-xl border overflow-hidden ${darkMode ? "bg-gray-800 border-gray-600" : "bg-white border-gray-100"}`}>
          <div className={`flex items-center justify-between px-5 py-4 border-b ${darkMode ? "border-gray-700" : "border-gray-100"}`}>
            <div className="flex items-center gap-2">
              <VideoCameraIcon className={`h-4 w-4 ${darkMode ? "text-blue-400" : "text-blue-500"}`} />
              <span className={`font-semibold text-sm ${darkMode ? "text-white" : "text-gray-900"}`}>Recent Sermons</span>
            </div>
            <Link to="/admin/sermons" className={`text-xs font-medium flex items-center gap-1 hover:underline ${darkMode ? "text-blue-400" : "text-blue-600"}`}>
              View all <ArrowRightIcon className="h-3 w-3" />
            </Link>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {loadingRecent ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="px-5 py-3 flex items-center gap-3">
                  <div className={`h-9 w-9 rounded-lg animate-pulse ${darkMode ? "bg-gray-700" : "bg-gray-100"}`} />
                  <div className="flex-1 space-y-1.5">
                    <div className={`h-3 rounded animate-pulse ${darkMode ? "bg-gray-700" : "bg-gray-100"}`} />
                    <div className={`h-2.5 w-24 rounded animate-pulse ${darkMode ? "bg-gray-700" : "bg-gray-100"}`} />
                  </div>
                </div>
              ))
            ) : recentSermons.length === 0 ? (
              <p className={`px-5 py-6 text-sm text-center ${darkMode ? "text-gray-500" : "text-gray-400"}`}>No sermons yet</p>
            ) : (
              recentSermons.map((s) => {
                const thumb = sermonThumb(s);
                return (
                <div key={s._id || s.id} className={`px-5 py-3 flex items-center gap-3 transition-colors ${darkMode ? "hover:bg-gray-700/50" : "hover:bg-gray-50"}`}>
                  {thumb ? (
                    <img
                      src={thumb}
                      alt=""
                      className="h-10 w-16 rounded-lg object-cover flex-shrink-0 bg-gray-100"
                      onError={(e) => { e.target.style.display = "none"; e.target.nextSibling.style.display = "flex"; }}
                    />
                  ) : null}
                  <div className={`h-10 w-16 rounded-lg flex-shrink-0 items-center justify-center ${darkMode ? "bg-gray-700" : "bg-gray-100"} ${thumb ? "hidden" : "flex"}`}>
                    <VideoCameraIcon className={`h-5 w-5 ${darkMode ? "text-gray-500" : "text-gray-300"}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${darkMode ? "text-gray-200" : "text-gray-800"}`}>{s.title}</p>
                    <p className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                      {s.speaker || s.preacher || "—"}
                    </p>
                  </div>
                  <span className={`text-xs flex-shrink-0 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                    {s.date ? new Date(s.date).toLocaleDateString("en-GB", { day: "numeric", month: "short" }) : ""}
                  </span>
                </div>
              );})
            )}
          </div>
        </div>

        {/* Upcoming events */}
        <div className={`rounded-xl border overflow-hidden ${darkMode ? "bg-gray-800 border-gray-600" : "bg-white border-gray-100"}`}>
          <div className={`flex items-center justify-between px-5 py-4 border-b ${darkMode ? "border-gray-700" : "border-gray-100"}`}>
            <div className="flex items-center gap-2">
              <CalendarIcon className={`h-4 w-4 ${darkMode ? "text-violet-400" : "text-violet-500"}`} />
              <span className={`font-semibold text-sm ${darkMode ? "text-white" : "text-gray-900"}`}>Upcoming Events</span>
            </div>
            <Link to="/admin/events" className={`text-xs font-medium flex items-center gap-1 hover:underline ${darkMode ? "text-violet-400" : "text-violet-600"}`}>
              View all <ArrowRightIcon className="h-3 w-3" />
            </Link>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {loadingRecent ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="px-5 py-3 flex items-center gap-3">
                  <div className={`h-9 w-14 rounded-lg animate-pulse ${darkMode ? "bg-gray-700" : "bg-gray-100"}`} />
                  <div className="flex-1 space-y-1.5">
                    <div className={`h-3 rounded animate-pulse ${darkMode ? "bg-gray-700" : "bg-gray-100"}`} />
                    <div className={`h-2.5 w-20 rounded animate-pulse ${darkMode ? "bg-gray-700" : "bg-gray-100"}`} />
                  </div>
                </div>
              ))
            ) : upcomingEvents.length === 0 ? (
              <div className="px-5 py-6 text-center">
                <ClockIcon className={`h-8 w-8 mx-auto mb-2 ${darkMode ? "text-gray-600" : "text-gray-300"}`} />
                <p className={`text-sm ${darkMode ? "text-gray-500" : "text-gray-400"}`}>No upcoming events</p>
                <Link to="/admin/events" className={`text-xs mt-1 inline-block font-medium ${darkMode ? "text-violet-400" : "text-violet-600"}`}>
                  Add one now →
                </Link>
              </div>
            ) : (
              upcomingEvents.map((e) => {
                const d = new Date(e.startDate);
                return (
                  <div key={e._id || e.id} className={`px-5 py-3 flex items-center gap-3 transition-colors ${darkMode ? "hover:bg-gray-700/50" : "hover:bg-gray-50"}`}>
                    <div className={`flex-shrink-0 w-10 rounded-lg p-1.5 text-center ${darkMode ? "bg-violet-900/40" : "bg-violet-50"}`}>
                      <p className={`text-xs font-bold uppercase leading-none ${darkMode ? "text-violet-300" : "text-violet-600"}`}>
                        {d.toLocaleDateString("en-GB", { month: "short" })}
                      </p>
                      <p className={`text-lg font-bold leading-tight ${darkMode ? "text-white" : "text-gray-900"}`}>
                        {d.getDate()}
                      </p>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${darkMode ? "text-gray-200" : "text-gray-800"}`}>{e.title}</p>
                      <p className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                        {e.location || e.venue || "—"}
                      </p>
                    </div>
                    <span className={`text-xs flex-shrink-0 px-2 py-0.5 rounded-full ${darkMode ? "bg-violet-900/30 text-violet-300" : "bg-violet-50 text-violet-700"}`}>
                      {d.toLocaleDateString("en-GB", { weekday: "short" })}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>

      {/* Tips banner */}
      <div className={`rounded-xl border p-5 flex items-start gap-4 ${darkMode ? "bg-amber-900/20 border-amber-800/30" : "bg-amber-50 border-amber-100"}`}>
        <ArrowTrendingUpIcon className={`h-5 w-5 mt-0.5 flex-shrink-0 ${darkMode ? "text-amber-400" : "text-amber-600"}`} />
        <div>
          <p className={`text-sm font-semibold ${darkMode ? "text-amber-300" : "text-amber-800"}`}>
            Keep content fresh
          </p>
          <p className={`text-xs mt-0.5 ${darkMode ? "text-amber-400/80" : "text-amber-700/80"}`}>
            Regularly update sermons and events so members always see current information.
            Mark recurring programs as <span className="font-medium">Featured</span> to show them on the home page.
          </p>
        </div>
      </div>

    </div>
  );
};

export default DashboardContent;
