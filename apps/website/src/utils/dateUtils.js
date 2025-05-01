import { format, parseISO, isValid } from "date-fns";

/**
 * Normalize date input to return standard date formats for an event
 * @param {string|Date} dateInput - The date input (can be ISO string, Date object, or formatted string)
 * @returns {Object} Object containing normalized date formats
 */
export const normalizeEventDate = (dateInput) => {
  let isoDate;           // ISO format for input fields (yyyy-MM-dd)
  let formattedDate;     // Human-readable format (MMMM d, yyyy)
  let dateObject;        // JavaScript Date object
  
  try {
    // If it's already a Date object
    if (dateInput instanceof Date && isValid(dateInput)) {
      dateObject = dateInput;
    } 
    // If it's a string date
    else if (typeof dateInput === 'string' && dateInput) {
      // If it's an ISO-formatted date (yyyy-MM-dd)
      if (dateInput.match(/^\d{4}-\d{2}-\d{2}$/)) {
        dateObject = parseISO(dateInput);
      } 
      // If it's a formatted date string with commas (Month Day, Year)
      else if (dateInput.includes(',')) {
        dateObject = new Date(dateInput);
      } 
      // Any other format we can try to parse
      else {
        dateObject = new Date(dateInput);
      }
    } 
    // Default to current date if no valid input or parse failed
    if (!dateObject || !isValid(dateObject)) {
      dateObject = new Date();
    }
    
    // Generate the needed formats
    isoDate = format(dateObject, "yyyy-MM-dd");
    formattedDate = format(dateObject, "MMMM d, yyyy");
    
    return {
      date: isoDate,                // For date input field
      formattedDate: formattedDate, // For display and API
      startDate: dateObject,        // Date object for the API
      endDate: dateObject,          // Date object for the API
    };
  } catch (error) {
    // Fallback to current date if any errors occur
    const today = new Date();
    return {
      date: format(today, "yyyy-MM-dd"),
      formattedDate: format(today, "MMMM d, yyyy"),
      startDate: today,
      endDate: today,
    };
  }
};

/**
 * Prepare an event object for API submission with proper date fields
 * @param {Object} event - The event object to prepare
 * @returns {Object} Event object ready for API submission
 */
export const prepareEventForAPI = (event) => {
  // Extract a clean copy to avoid mutations
  const cleanEvent = { ...event };
  
  // Handle date normalization
  const dateData = normalizeEventDate(event.date || event.formattedDate);
  
  // Prepare the event data for the API
  const serverEvent = {
    title: cleanEvent.title || '',
    description: cleanEvent.description || '',
    date: dateData.formattedDate,
    time: cleanEvent.time || '',
    location: cleanEvent.location || '',
    ministry: cleanEvent.ministry || '',
    // Add server model fields with proper Date objects
    startDate: dateData.startDate,
    endDate: dateData.endDate,
    // Optional fields with defaults
    capacity: cleanEvent.capacity || '',
    registrationUrl: cleanEvent.registrationUrl || '',
    recurring: cleanEvent.recurring || false,
    recurringPattern: cleanEvent.recurringPattern || '',
    organizer: cleanEvent.organizer || '',
    contactEmail: cleanEvent.contactEmail || '',
    featured: cleanEvent.featured || false,
    tags: cleanEvent.tags || [],
    type: cleanEvent.type || 'event',
    signupRequired: cleanEvent.signupRequired || false,
  };
  
  // Handle image paths properly
  if (cleanEvent.image && typeof cleanEvent.image === 'object') {
    // If we have an image object from the media selector
    if (cleanEvent.image.id) {
      // Use the ID for direct reference
      serverEvent.image = cleanEvent.image.id;
    } else if (cleanEvent.image.path) {
      // If it has a path but no ID, use the path
      serverEvent.imageUrl = cleanEvent.image.path;
    } else if (cleanEvent.image.filename) {
      // If it just has a filename, construct the path
      serverEvent.imageUrl = `/uploads/${cleanEvent.image.filename}`;
    }
  } else if (cleanEvent.imageUrl) {
    // If only the URL was entered manually, use that
    serverEvent.imageUrl = cleanEvent.imageUrl;
  }
  
  return serverEvent;
};

/**
 * Parse an event object from the API to display format
 * @param {Object} event - Event object from the API
 * @returns {Object} Event object formatted for display/edit
 */
export const parseEventFromAPI = (event) => {
  if (!event) return null;
  
  // Get the normalized date formats
  let dateData;
  
  // First try to use startDate if available (more reliable)
  if (event.startDate) {
    dateData = normalizeEventDate(event.startDate);
  }
  // If startDate fails or doesn't exist, try the date field
  else if (event.date) {
    dateData = normalizeEventDate(event.date);
  }
  // Fallback to current date
  else {
    dateData = normalizeEventDate(new Date());
  }
  
  // Ensure ID is normalized
  const eventId = event.id || event._id;
  
  // Return the parsed event
  return {
    ...event,
    id: eventId,
    date: dateData.date,
    formattedDate: dateData.formattedDate,
  };
}; 