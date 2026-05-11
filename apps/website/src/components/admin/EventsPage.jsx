import { useSearchParams } from "react-router-dom";
import { useDarkMode } from "../../contexts/DarkModeContext";
import EventManager from "./EventManager";
import RecurringEventManager from "./RecurringEventManager";

const TABS = [
  { id: "events",    label: "Non-Recurring Events" },
  { id: "recurring", label: "Recurring Events"     },
];

const EventsPage = () => {
  const { darkMode } = useDarkMode();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") === "recurring" ? "recurring" : "events";
  const setTab = (tab) => setSearchParams({ tab }, { replace: true });

  return (
    <div>
      <div className={`border-b mb-6 -mt-1 ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
        <nav className="-mb-px flex gap-1 overflow-x-auto">
          {TABS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                activeTab === id
                  ? "border-red-600 text-red-600 dark:text-red-500"
                  : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600"
              }`}
            >
              {label}
            </button>
          ))}
        </nav>
      </div>

      {activeTab === "events"    && <EventManager />}
      {activeTab === "recurring" && <RecurringEventManager />}
    </div>
  );
};

export default EventsPage;
