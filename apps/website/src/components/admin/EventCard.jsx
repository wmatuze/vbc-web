import { 
  CalendarIcon, 
  ClockIcon, 
  MapPinIcon as LocationMarkerIcon,
  DocumentDuplicateIcon as DuplicateIcon,
  PencilIcon,
  TrashIcon
} from "@heroicons/react/24/outline";
import { getImageUrl } from "../../utils/imageUtils";

// Import placeholder image for events
import eventPlaceholderImage from "../../assets/placeholders/default-event.svg";

/**
 * Event card component for displaying events in admin grid view
 * @param {Object} props - Component props
 * @param {Object} props.event - Event data to display
 * @param {Function} props.onEdit - Function to call when edit button is clicked
 * @param {Function} props.onDelete - Function to call when delete button is clicked
 * @param {Function} props.onDuplicate - Function to call when duplicate button is clicked
 * @param {Function} props.onImageClick - Function to call when image is clicked
 */
const EventCard = ({ 
  event, 
  onEdit, 
  onDelete, 
  onDuplicate, 
  onImageClick 
}) => {
  const handleImageError = (e) => {
    e.target.src = eventPlaceholderImage;
    e.target.onerror = null; // Prevent infinite error loop
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200 border border-gray-200 dark:border-gray-700">
      {event.imageUrl ? (
        <div className="relative h-48 bg-gray-200 dark:bg-gray-700">
          <img
            src={getImageUrl(event.imageUrl, eventPlaceholderImage)}
            alt={event.title}
            className="w-full h-full object-cover"
            onClick={() => onImageClick && onImageClick(event.imageUrl)}
            onError={handleImageError}
          />
          {event.featured && (
            <span className="absolute top-2 right-2 px-2 py-1 bg-yellow-400 dark:bg-yellow-500 text-xs font-medium rounded-full">
              Featured
            </span>
          )}
        </div>
      ) : (
        <div className="h-48 bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
          <CalendarIcon className="h-12 w-12 text-gray-400 dark:text-gray-500" />
        </div>
      )}

      <div className="p-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate">
          {event.title}
        </h3>

        <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
          <CalendarIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400 dark:text-gray-500" />
          <span>{event.date}</span>
          {event.time && (
            <>
              <ClockIcon className="flex-shrink-0 ml-4 mr-1.5 h-5 w-5 text-gray-400 dark:text-gray-500" />
              <span>{event.time}</span>
            </>
          )}
        </div>

        {event.location && (
          <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
            <LocationMarkerIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400 dark:text-gray-500" />
            <span className="truncate">{event.location}</span>
          </div>
        )}

        {event.ministry && (
          <span className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
            {event.ministry}
          </span>
        )}

        {event.tags && event.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {event.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="mt-4 flex justify-end space-x-2">
          <button
            onClick={() => onDuplicate && onDuplicate(event)}
            className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400"
            title="Duplicate"
          >
            <DuplicateIcon className="h-5 w-5" />
          </button>
          <button
            onClick={() => onEdit && onEdit(event)}
            className="p-2 text-blue-400 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300"
            title="Edit"
          >
            <PencilIcon className="h-5 w-5" />
          </button>
          <button
            onClick={() => onDelete && onDelete(event)}
            className="p-2 text-red-400 dark:text-red-400 hover:text-red-500 dark:hover:text-red-300"
            title="Delete"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventCard; 