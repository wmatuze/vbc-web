import { memo } from "react";
import { UserIcon, EnvelopeIcon, PhoneIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useDarkMode } from "../../contexts/DarkModeContext";
import placeholderImage from "../../assets/placeholders/default-image.svg";

const LeaderCard = memo(({ leader, getImageUrl, onEdit, onDelete }) => {
  const { darkMode } = useDarkMode();
  const imgSrc = getImageUrl ? getImageUrl(leader.imageUrl) : leader.imageUrl;

  return (
    <div className={`rounded-xl border overflow-hidden flex flex-col transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"}`}>

      {/* Photo */}
      <div className={`relative h-44 flex-shrink-0 ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
        {imgSrc ? (
          <img src={imgSrc} alt={leader.name} className="w-full h-full object-cover object-top"
            onError={(e) => { e.target.src = placeholderImage; e.target.onerror = null; }} />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className={`text-5xl font-bold ${darkMode ? "text-gray-600" : "text-gray-300"}`}>
              {leader.name?.[0]?.toUpperCase() ?? "?"}
            </div>
          </div>
        )}
        {leader.department && (
          <span className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs font-medium ${darkMode ? "bg-blue-900/70 text-blue-300" : "bg-blue-600 text-white"}`}>
            {leader.department}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className={`font-semibold text-sm ${darkMode ? "text-white" : "text-gray-900"}`}>{leader.name}</h3>
        <p className={`text-xs mt-0.5 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{leader.title}</p>

        {/* Contact */}
        <div className={`mt-3 space-y-1 text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
          {leader.email && (
            <a href={`mailto:${leader.email}`} className={`flex items-center gap-1.5 hover:underline transition-colors ${darkMode ? "hover:text-white" : "hover:text-gray-700"}`}>
              <EnvelopeIcon className="h-3.5 w-3.5 flex-shrink-0" />
              <span className="truncate">{leader.email}</span>
            </a>
          )}
          {leader.phone && (
            <a href={`tel:${leader.phone}`} className={`flex items-center gap-1.5 hover:underline transition-colors ${darkMode ? "hover:text-white" : "hover:text-gray-700"}`}>
              <PhoneIcon className="h-3.5 w-3.5 flex-shrink-0" />
              <span>{leader.phone}</span>
            </a>
          )}
        </div>

        {/* Ministry focus tags */}
        {leader.ministryFocus?.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {leader.ministryFocus.slice(0, 4).map((f) => (
              <span key={f} className={`px-1.5 py-0.5 rounded text-xs ${darkMode ? "bg-gray-700 text-gray-400" : "bg-gray-100 text-gray-500"}`}>
                {f}
              </span>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className={`mt-auto pt-3 flex justify-end gap-1 border-t ${darkMode ? "border-gray-700" : "border-gray-100"}`}>
          <button onClick={onEdit} title="Edit"
            className={`p-1.5 rounded-lg transition-colors ${darkMode ? "text-blue-400 hover:bg-blue-900/30" : "text-blue-500 hover:bg-blue-50"}`}>
            <PencilIcon className="h-4 w-4" />
          </button>
          <button onClick={onDelete} title="Delete"
            className={`p-1.5 rounded-lg transition-colors ${darkMode ? "text-red-400 hover:bg-red-900/30" : "text-red-400 hover:bg-red-50"}`}>
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
});

export default LeaderCard;
