import {
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  DocumentDuplicateIcon,
  PencilIcon,
  TrashIcon,
  ClipboardDocumentListIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import { useDarkMode } from "../../contexts/DarkModeContext";
import config from "../../config";
import eventPlaceholderImage from "../../assets/placeholders/default-event.svg";

const API_URL = config.API_URL;

const resolveUrl = (url) => {
  if (!url || url.includes("default-event")) return null;
  if (url.startsWith("http") || url.startsWith("data:")) return url;
  return `${API_URL}${url}`;
};

const signupBadge = (mode) => {
  if (mode === "required") return { label: "Sign-up Required", cls: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300" };
  if (mode === "optional") return { label: "Sign-up Open",     cls: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300" };
  return null;
};

const EventAdminCard = ({ event, onEdit, onDelete, onDuplicate, onImageClick }) => {
  const { darkMode } = useDarkMode();
  const thumb = resolveUrl(event.imageUrl);
  const badge = signupBadge(event.signupMode);

  const formatDate = (d) => {
    if (!d) return "";
    try {
      return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
    } catch { return d; }
  };

  return (
    <div className={`rounded-xl border overflow-hidden transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 flex flex-col ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"}`}>

      {/* Image */}
      <div className={`relative h-44 flex-shrink-0 ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
        {thumb ? (
          <img src={thumb} alt={event.title}
            className="w-full h-full object-cover cursor-pointer"
            onClick={() => onImageClick?.(event.imageUrl)}
            onError={(e) => { e.target.style.display = "none"; e.target.nextSibling.style.display = "flex"; }}
          />
        ) : null}
        <div
          className={`absolute inset-0 items-center justify-center ${thumb ? "hidden" : "flex"}`}
          style={{ display: thumb ? "none" : "flex" }}
        >
          <CalendarIcon className={`h-12 w-12 ${darkMode ? "text-gray-600" : "text-gray-300"}`} />
        </div>

        {/* Overlay badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {event.featured && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-400 text-amber-900">
              <StarIcon className="h-3 w-3" />
              Featured
            </span>
          )}
          {badge && (
            <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${badge.cls}`}>
              <ClipboardDocumentListIcon className="h-3 w-3" />
              {badge.label}
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className={`font-semibold text-sm leading-snug line-clamp-2 ${darkMode ? "text-white" : "text-gray-900"}`}>
          {event.title}
        </h3>

        <div className={`mt-2 space-y-1 text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
          <div className="flex items-center gap-1.5">
            <CalendarIcon className="h-3.5 w-3.5 flex-shrink-0" />
            <span>{formatDate(event.startDate || event.date)}</span>
            {event.time && <><span className="opacity-40">·</span><ClockIcon className="h-3.5 w-3.5 flex-shrink-0" /><span>{event.time}</span></>}
          </div>
          {event.location && (
            <div className="flex items-center gap-1.5">
              <MapPinIcon className="h-3.5 w-3.5 flex-shrink-0" />
              <span className="truncate">{event.location}</span>
            </div>
          )}
        </div>

        {/* Tags */}
        {event.tags?.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {event.tags.slice(0, 3).map((tag) => (
              <span key={tag} className={`px-1.5 py-0.5 rounded text-xs ${darkMode ? "bg-gray-700 text-gray-400" : "bg-gray-100 text-gray-500"}`}>
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className={`mt-auto pt-3 flex items-center justify-between border-t ${darkMode ? "border-gray-700" : "border-gray-100"}`}>
          <span className={`text-xs ${darkMode ? "text-gray-600" : "text-gray-300"}`}>
            {event.ministry || event.type || ""}
          </span>
          <div className="flex items-center gap-0.5">
            <button onClick={() => onDuplicate?.(event)} title="Duplicate"
              className={`p-1.5 rounded-lg transition-colors ${darkMode ? "text-gray-500 hover:bg-gray-700 hover:text-gray-300" : "text-gray-400 hover:bg-gray-100"}`}>
              <DocumentDuplicateIcon className="h-4 w-4" />
            </button>
            <button onClick={() => onEdit?.(event)} title="Edit"
              className={`p-1.5 rounded-lg transition-colors ${darkMode ? "text-blue-400 hover:bg-blue-900/30" : "text-blue-500 hover:bg-blue-50"}`}>
              <PencilIcon className="h-4 w-4" />
            </button>
            <button onClick={() => onDelete?.(event)} title="Delete"
              className={`p-1.5 rounded-lg transition-colors ${darkMode ? "text-red-400 hover:bg-red-900/30" : "text-red-400 hover:bg-red-50"}`}>
              <TrashIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventAdminCard;
