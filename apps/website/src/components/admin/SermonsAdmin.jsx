import { useSearchParams } from "react-router-dom";
import { MusicalNoteIcon, VideoCameraIcon } from "@heroicons/react/24/outline";
import SermonManagerWrapper from "./SermonManagerWrapper";
import ResourceAdmin from "./ResourceAdmin";

const TABS = [
  { id: "video", label: "Video Sermons", icon: VideoCameraIcon },
  { id: "audio", label: "Audio Sermons", icon: MusicalNoteIcon },
];

const SermonsAdmin = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedTab = searchParams.get("tab");
  const activeTab = requestedTab === "audio" ? "audio" : "video";

  const selectTab = (tab) => {
    setSearchParams(tab === "video" ? {} : { tab });
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex gap-2" aria-label="Sermon formats" role="tablist">
          {TABS.map(({ id, label, icon: Icon }) => {
            const isActive = activeTab === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => selectTab(id)}
                aria-selected={isActive}
                role="tab"
                className={`inline-flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition-colors ${
                  isActive
                    ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                }`}
              >
                <Icon className="h-5 w-5" />
                {label}
              </button>
            );
          })}
        </nav>
      </div>

      {activeTab === "audio" ? (
        <ResourceAdmin
          lockedCategory="audio_sermons"
          lockedType="audio"
          title="Audio Sermons"
          createLabel="Add Audio Sermon"
        />
      ) : (
        <SermonManagerWrapper />
      )}
    </div>
  );
};

export default SermonsAdmin;
