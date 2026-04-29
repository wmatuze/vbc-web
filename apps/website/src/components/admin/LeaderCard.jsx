import { memo } from "react";
import { EnvelopeIcon, PhoneIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useDarkMode } from "../../contexts/DarkModeContext";
import placeholderImage from "../../assets/placeholders/default-image.svg";

const LeaderCard = memo(({ leader, getImageUrl, onEdit, onDelete }) => {
  const { darkMode } = useDarkMode();
  const imgSrc = getImageUrl ? getImageUrl(leader.imageUrl) : leader.imageUrl;

  // Colour for the avatar initial background
  const avatarColors = [
    "bg-blue-600", "bg-violet-600", "bg-amber-600",
    "bg-emerald-600", "bg-rose-600", "bg-cyan-600",
  ];
  const colorIndex = (leader.name?.charCodeAt(0) ?? 0) % avatarColors.length;
  const avatarBg   = avatarColors[colorIndex];

  return (
    <div className={`rounded-2xl border overflow-hidden flex flex-col transition-all duration-200 hover:shadow-lg hover:-translate-y-1 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100 shadow-sm"}`}>

      {/* ── Photo area ── */}
      <div className={`relative h-52 flex-shrink-0 ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={leader.name}
            className="w-full h-full object-cover object-top"
            onError={(e) => { e.target.src = placeholderImage; e.target.onerror = null; }}
          />
        ) : (
          <div className={`w-full h-full flex items-center justify-center ${avatarBg}`}>
            <span className="text-6xl font-bold text-white/80 select-none">
              {leader.name?.[0]?.toUpperCase() ?? "?"}
            </span>
          </div>
        )}

        {/* Bottom gradient scrim */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />

        {/* Department badge */}
        {leader.department && (
          <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-semibold bg-white/90 text-gray-800 shadow-sm">
            {leader.department}
          </span>
        )}
      </div>

      {/* ── Info ── */}
      <div className="p-5 flex flex-col flex-1">
        <div>
          <h3 className={`text-base font-bold leading-tight ${darkMode ? "text-white" : "text-gray-900"}`}>
            {leader.name}
          </h3>
          <p className={`text-sm mt-0.5 font-medium ${darkMode ? "text-blue-400" : "text-blue-600"}`}>
            {leader.title}
          </p>
        </div>

        {/* Bio snippet */}
        {leader.bio && (
          <p className={`mt-2 text-xs leading-relaxed line-clamp-2 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
            {leader.bio}
          </p>
        )}

        {/* Contact */}
        {(leader.email || leader.phone) && (
          <div className={`mt-3 space-y-1.5 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
            {leader.email && (
              <a href={`mailto:${leader.email}`}
                className={`flex items-center gap-2 text-xs transition-colors hover:underline ${darkMode ? "hover:text-white" : "hover:text-gray-800"}`}>
                <EnvelopeIcon className="h-3.5 w-3.5 flex-shrink-0" />
                <span className="truncate">{leader.email}</span>
              </a>
            )}
            {leader.phone && (
              <a href={`tel:${leader.phone}`}
                className={`flex items-center gap-2 text-xs transition-colors hover:underline ${darkMode ? "hover:text-white" : "hover:text-gray-800"}`}>
                <PhoneIcon className="h-3.5 w-3.5 flex-shrink-0" />
                <span>{leader.phone}</span>
              </a>
            )}
          </div>
        )}

        {/* Ministry focus */}
        {leader.ministryFocus?.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {leader.ministryFocus.slice(0, 3).map((f) => (
              <span key={f}
                className={`px-2 py-0.5 rounded-full text-xs font-medium ${darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-600"}`}>
                {f}
              </span>
            ))}
            {leader.ministryFocus.length > 3 && (
              <span className={`px-2 py-0.5 rounded-full text-xs ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                +{leader.ministryFocus.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Actions */}
        <div className={`mt-auto pt-4 flex items-center justify-between border-t ${darkMode ? "border-gray-700" : "border-gray-100"}`}>
          <span className={`text-xs ${darkMode ? "text-gray-600" : "text-gray-300"}`}>
            #{leader.order ?? 0}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={onEdit}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${darkMode ? "text-blue-400 hover:bg-blue-900/30 border border-blue-900/40" : "text-blue-600 hover:bg-blue-50 border border-blue-100"}`}
            >
              <PencilIcon className="h-3.5 w-3.5" />
              Edit
            </button>
            <button
              onClick={onDelete}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${darkMode ? "text-red-400 hover:bg-red-900/30 border border-red-900/40" : "text-red-500 hover:bg-red-50 border border-red-100"}`}
            >
              <TrashIcon className="h-3.5 w-3.5" />
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

export default LeaderCard;
