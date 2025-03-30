import { useState, useEffect, useCallback } from 'react';
import { getEvents, createEvent, updateEvent, deleteEvent } from '../../services/api';
import {
  PlusIcon,
  CalendarIcon,
  ClockIcon,
  MapPinIcon as LocationMarkerIcon,
  UserGroupIcon,
  PhotoIcon as PhotographIcon,
  XMarkIcon as XIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  MagnifyingGlassIcon as SearchIcon,
  FunnelIcon as FilterIcon,
  Squares2X2Icon as ViewGridIcon,
  ListBulletIcon as ViewListIcon,
  ArrowPathIcon as RefreshIcon,
  DocumentDuplicateIcon as DuplicateIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { format, parseISO, isFuture, isPast } from 'date-fns';
import config from '../../config';

const API_URL = config.API_URL;

const placeholderImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZAAAADICAYAAADGFbfiAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFyGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIwLTAzLTA1VDIyOjMzOjMwLTA4OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMC0wMy0xM1QxMDowNTozOC0wNzowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMC0wMy0xM1QxMDowNTozOC0wNzowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpmYjRjYzkwZC1mNWRhLTRiNGMtOWVjYi0wYjgyODM0YzUxMmMiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDo0ZGYyZjI5Yi1iOGNiLTZlNDktYWE4Ni0yYzAzODJjY2M5YjkiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo2ZWJiZDlkOS0zYTVkLWM5NGMtOTVjNS0wNmM1Mzc0YmJhOTgiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjZlYmJkOWQ5LTNhNWQtYzk0Yy05NWM1LTA2YzUzNzRiYmE5OCIgc3RFdnQ6d2hlbj0iMjAyMC0wMy0wNVQyMjozMzozMC0wODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKFdpbmRvd3MpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDpmYjRjYzkwZC1mNWRhLTRiNGMtOWVjYi0wYjgyODM0YzUxMmMiIHN0RXZ0OndoZW49IjIwMjAtMDMtMTNUMTA6MDU6MzgtMDc6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE5IChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7JL8VBAAAF/UlEQVR4nO3dMW4bSRRA0TbgDbiJl+MluONGK3DGJVfoNbgEL8GdOzCgDowBDDPkkGxO/ycwGAgEWU3d4qtXPZ+engAAe/3v1QcAAO9JQAAgEhAA';

const EventManager = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState('add');
  const [currentEvent, setCurrentEvent] = useState({
    title: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    formattedDate: format(new Date(), 'MMMM d, yyyy'),
    time: '',
    description: '',
    location: '',
    capacity: '',
    ministry: '',
    imageUrl: '',
    registrationUrl: '',
    tags: [],
    recurring: false,
    recurringPattern: '',
    organizer: '',
    contactEmail: '',
    featured: false
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMinistry, setFilterMinistry] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('asc');
  const [successMessage, setSuccessMessage] = useState('');
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [eventFilter, setEventFilter] = useState('upcoming'); // 'all', 'upcoming', 'past'

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const data = await getEvents();
      setEvents(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Failed to load events. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentEvent(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setCurrentEvent({
      title: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      formattedDate: format(new Date(), 'MMMM d, yyyy'),
      time: '',
      description: '',
      location: '',
      capacity: '',
      ministry: '',
      imageUrl: '',
      registrationUrl: '',
      tags: [],
      recurring: false,
      recurringPattern: '',
      organizer: '',
      contactEmail: '',
      featured: false
    });
    setFormMode('add');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Use the formattedDate for the server payload
      const formattedEvent = {
        ...currentEvent,
        date: currentEvent.formattedDate || format(parseISO(currentEvent.date), 'MMMM d, yyyy')
      };
      
      // Delete the formattedDate before sending to server to avoid duplicate fields
      delete formattedEvent.formattedDate;
      
      // Transform the event data to match the server-expected format
      const serverEvent = {
        ...formattedEvent,
        // Convert date to startDate (required by the server model)
        startDate: formattedEvent.date,
        // Add endDate (can be the same as startDate for single-day events)
        endDate: formattedEvent.date,
        // Keep date for frontend compatibility
      };
      
      if (formMode === 'add') {
        await createEvent({
          ...serverEvent,
          id: Date.now()
        });
        setSuccessMessage('Event added successfully!');
      } else {
        await updateEvent(currentEvent.id, serverEvent);
        setSuccessMessage('Event updated successfully!');
      }
      
      await fetchEvents();
      resetForm();
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error saving event:', err);
      setError('Failed to save event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (event) => {
    try {
      // Convert display date to ISO format for input
      let isoDate;
      try {
        // Try to parse the date string
        const dateObj = new Date(event.date);
        isoDate = format(dateObj, 'yyyy-MM-dd');
      } catch (err) {
        // Fallback to current date if parsing fails
        console.error("Failed to parse date:", event.date);
        isoDate = format(new Date(), 'yyyy-MM-dd');
      }
      
      setCurrentEvent({ 
        ...event, 
        date: isoDate,
        formattedDate: event.date // Store original formatted date
      });
      setFormMode('edit');
      setShowForm(true);
    } catch (err) {
      console.error("Error in handleEdit:", err);
      setError("Error preparing event for editing. Please try again.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        setLoading(true);
        await deleteEvent(id);
        setSuccessMessage('Event deleted successfully!');
        await fetchEvents();
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (err) {
        console.error('Error deleting event:', err);
        setError('Failed to delete event. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDuplicate = (event) => {
    const duplicatedEvent = {
      ...event,
      id: undefined,
      title: `Copy of ${event.title}`,
      date: format(new Date(), 'yyyy-MM-dd')
    };
    setCurrentEvent(duplicatedEvent);
    setFormMode('add');
    setShowForm(true);
  };

  const handleImagePreview = (imageUrl) => {
    setSelectedImage(getImagePreviewUrl(imageUrl));
    setShowImagePreview(true);
  };

  // Get unique ministry options from existing events
  const existingMinistries = [...new Set(events.map(event => event.ministry).filter(Boolean))];
  const ministryOptions = existingMinistries.includes('General') 
    ? existingMinistries 
    : ['General', ...existingMinistries];

  // Format data for display
  const formatEventDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Ensure image URLs have proper domain
  const getFullImageUrl = (url) => {
    if (!url) return '';
    return url.startsWith('/') ? `${API_URL}${url}` : url;
  };

  // Helper function to get image preview URL
  const getImagePreviewUrl = (imageUrl) => {
    if (!imageUrl) return null;
    return imageUrl.startsWith('/') ? `${API_URL}${imageUrl}` : imageUrl;
  };

  // Add the handleImageError function after getImagePreviewUrl
  const handleImageError = (e) => {
    console.error('Image failed to load:', e.target.src);
    e.target.src = placeholderImage;
    e.target.onerror = null; // Prevent infinite error loop
  };

  // Filter events based on search, ministry, and upcoming/past status
  const filteredEvents = events
    .filter(event => {
      // Filter by search term
      const matchesSearch = searchTerm === '' || 
        event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.ministry?.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filter by ministry
      const matchesMinistry = filterMinistry === 'all' || event.ministry === filterMinistry;
      
      // Filter by event status (upcoming/past)
      let matchesEventFilter = true;
      if (eventFilter === 'upcoming') {
        const eventDate = new Date(event.date);
        matchesEventFilter = isFuture(eventDate);
      } else if (eventFilter === 'past') {
        const eventDate = new Date(event.date);
        matchesEventFilter = isPast(eventDate);
      }
      
      return matchesSearch && matchesMinistry && matchesEventFilter;
    })
    .sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

  if (loading && events.length === 0) {
    return <div className="text-center py-4 text-gray-800 dark:text-gray-200">Loading...</div>;
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Manage Events</h2>
      
      {error && (
        <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {successMessage && (
        <div className="bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-700 text-green-700 dark:text-green-200 px-4 py-3 rounded mb-4">
          {successMessage}
        </div>
      )}
      
      {/* Form for adding/editing events */}
      <form onSubmit={handleSubmit} className="mb-8 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">
          {formMode === 'add' ? 'Add New Event' : 'Edit Event'}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={currentEvent.title}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Date
            </label>
            <input
              type="date"
              name="date"
              value={currentEvent.date || ""}
              onChange={(e) => {
                const inputDate = e.target.value;
                if (inputDate) {
                  try {
                    // Keep the raw date for the input
                    // Format a readable version for display/submission
                    const date = new Date(inputDate);
                    const formattedDate = format(date, 'MMMM d, yyyy');
                    
                    setCurrentEvent(prev => ({ 
                      ...prev, 
                      date: inputDate,
                      formattedDate: formattedDate
                    }));
                  } catch (err) {
                    console.error("Error formatting date:", err);
                    setCurrentEvent(prev => ({ 
                      ...prev, 
                      date: inputDate,
                      formattedDate: inputDate
                    }));
                  }
                } else {
                  setCurrentEvent(prev => ({ 
                    ...prev, 
                    date: '',
                    formattedDate: ''
                  }));
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            />
            {currentEvent.formattedDate && (
              <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Display format: {currentEvent.formattedDate}
              </div>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Time
            </label>
            <input
              type="text"
              name="time"
              value={currentEvent.time}
              onChange={handleInputChange}
              placeholder="e.g. 10:30 AM"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Ministry
            </label>
            <select
              name="ministry"
              value={currentEvent.ministry}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            >
              <option value="">Select Ministry</option>
              {ministryOptions.map((ministry, index) => (
                <option key={index} value={ministry}>
                  {ministry}
                </option>
              ))}
              {/* Allow custom input if ministry not in list */}
              {currentEvent.ministry && !ministryOptions.includes(currentEvent.ministry) && (
                <option value={currentEvent.ministry}>{currentEvent.ministry}</option>
              )}
            </select>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={currentEvent.description}
              onChange={handleInputChange}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            ></textarea>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Image URL
            </label>
            <input
              type="text"
              name="imageUrl"
              value={currentEvent.imageUrl}
              onChange={handleInputChange}
              placeholder="/assets/events/event-name.jpg"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            />
            {currentEvent.imageUrl && (
              <div className="mt-2">
                <img 
                  src={getFullImageUrl(currentEvent.imageUrl)} 
                  alt="Event preview" 
                  className="h-20 object-cover rounded"
                />
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white py-2 px-4 rounded-md transition-colors"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Event'}
          </button>
          
          {formMode === 'edit' && (
            <button
              type="button"
              onClick={resetForm}
              className="ml-2 py-2 px-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Events Display */}
      {loading && events.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 dark:border-blue-400 border-t-transparent dark:border-t-transparent"></div>
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="text-center py-12">
          <CalendarIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No events found</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {searchTerm || filterMinistry !== 'all' || eventFilter !== 'all'
              ? 'Try adjusting your search or filter settings'
              : 'Get started by adding a new event'}
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map(event => (
            <div key={event.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200 border border-gray-200 dark:border-gray-700">
              {event.imageUrl ? (
                <div className="relative h-48 bg-gray-200 dark:bg-gray-700">
                  <img
                    src={getImagePreviewUrl(event.imageUrl)}
                    alt={event.title}
                    className="w-full h-full object-cover"
                    onClick={() => handleImagePreview(event.imageUrl)}
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
                  <ClockIcon className="flex-shrink-0 ml-4 mr-1.5 h-5 w-5 text-gray-400 dark:text-gray-500" />
                  <span>{event.time}</span>
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
                    {event.tags.map(tag => (
                      <span key={tag} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                
                <div className="mt-4 flex justify-end space-x-2">
                  <button
                    onClick={() => handleDuplicate(event)}
                    className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400"
                    title="Duplicate"
                  >
                    <DuplicateIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleEdit(event)}
                    className="p-2 text-blue-400 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300"
                    title="Edit"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(event.id)}
                    className="p-2 text-red-400 dark:text-red-400 hover:text-red-500 dark:hover:text-red-300"
                    title="Delete"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Event
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Date & Time
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Location
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Ministry
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredEvents.map(event => (
                <tr key={event.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      {event.imageUrl ? (
                        <img
                          src={getImagePreviewUrl(event.imageUrl)}
                          alt=""
                          className="h-10 w-10 rounded-full object-cover cursor-pointer"
                          onClick={() => handleImagePreview(event.imageUrl)}
                          onError={handleImageError}
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                          <CalendarIcon className="h-6 w-6 text-gray-400 dark:text-gray-500" />
                        </div>
                      )}
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {event.title}
                          {event.featured && (
                            <span className="ml-2 px-2 py-0.5 bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 text-xs font-medium rounded-full">
                              Featured
                            </span>
                          )}
                        </div>
                        {event.tags && event.tags.length > 0 && (
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {event.tags.join(', ')}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center">
                      <CalendarIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400 dark:text-gray-500" />
                      {event.date}
                      <ClockIcon className="flex-shrink-0 ml-4 mr-1.5 h-5 w-5 text-gray-400 dark:text-gray-500" />
                      {event.time}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {event.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {event.ministry && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                        {event.ministry}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleDuplicate(event)}
                        className="text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400"
                        title="Duplicate"
                      >
                        <DuplicateIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleEdit(event)}
                        className="text-blue-400 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300"
                        title="Edit"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(event.id)}
                        className="text-red-400 dark:text-red-400 hover:text-red-500 dark:hover:text-red-300"
                        title="Delete"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Image Preview Modal */}
      {showImagePreview && selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="relative bg-white dark:bg-gray-800 rounded-lg max-w-4xl max-h-[90vh] overflow-hidden">
            <button
              onClick={() => setShowImagePreview(false)}
              className="absolute top-4 right-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 z-10"
            >
              <XIcon className="h-6 w-6" />
            </button>
            <img
              src={selectedImage}
              alt="Preview"
              className="max-h-[90vh] max-w-full object-contain"
              onError={handleImageError}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default EventManager;
