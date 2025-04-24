import React from "react";
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import placeholderImage from "../../assets/placeholders/default-image.svg";

// Using SVG placeholder image imported at the top

const LeaderCard = React.memo(
  ({ leader, onEdit, onDelete, onImagePreview, getImagePreviewUrl }) => {
    // Handle image load errors
    const handleImageError = (e) => {
      console.error("Image failed to load:", e.target.src);
      e.target.src = placeholderImage;
      e.target.onerror = null; // Prevent infinite error loop
    };

    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200">
        <div className="relative h-48">
          {leader.imageUrl ? (
            <img
              src={getImagePreviewUrl(leader.imageUrl)}
              alt={leader.name}
              className="w-full h-full object-cover"
              onClick={() => onImagePreview(leader.imageUrl)}
              loading="lazy"
              onError={handleImageError}
            />
          ) : (
            <div className="w-full h-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
              <UserIcon className="h-20 w-20 text-gray-400 dark:text-gray-500" />
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {leader.name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
            {leader.title}
          </p>

          {leader.department && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100 mt-2">
              {leader.department}
            </span>
          )}

          <div className="mt-4 space-y-2">
            {leader.email && (
              <a
                href={`mailto:${leader.email}`}
                className="flex items-center text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
              >
                <EnvelopeIcon className="h-4 w-4 mr-2" />
                {leader.email}
              </a>
            )}

            {leader.phone && (
              <a
                href={`tel:${leader.phone}`}
                className="flex items-center text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
              >
                <PhoneIcon className="h-4 w-4 mr-2" />
                {leader.phone}
              </a>
            )}
          </div>

          {leader.ministryFocus && leader.ministryFocus.length > 0 && (
            <div className="mt-4">
              <h4 className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-medium">
                Ministry Focus
              </h4>
              <div className="flex flex-wrap gap-1 mt-2">
                {leader.ministryFocus.map((focus) => (
                  <span
                    key={focus}
                    className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                  >
                    {focus}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900 flex justify-end space-x-2">
          <button
            onClick={() => onEdit(leader.id)}
            className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 dark:text-blue-400 bg-blue-100 dark:bg-blue-900 hover:bg-blue-200 dark:hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <PencilIcon className="h-4 w-4 mr-1" />
            Edit
          </button>

          <button
            onClick={() => onDelete(leader.id)}
            className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-900 hover:bg-red-200 dark:hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <TrashIcon className="h-4 w-4 mr-1" />
            Delete
          </button>
        </div>
      </div>
    );
  }
);

export default LeaderCard;
