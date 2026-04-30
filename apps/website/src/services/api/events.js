// Event-related API functions
import { fetchData, postData, updateData, deleteData } from './core';

/**
 * Get all events
 * @returns {Promise<Array>} Promise resolving to array of events
 */
export const getEvents = (year) => {
  const endpoint = year ? `api/events?year=${year}` : "api/events";
  return fetchData(endpoint);
};

/**
 * Get an event by ID
 * @param {string} id - Event ID
 * @returns {Promise<Object>} Promise resolving to event object
 */
export const getEventById = (id) => fetchData(`api/events/${id}`);

/**
 * Create a new event
 * @param {Object} event - Event data
 * @returns {Promise<Object>} Promise resolving to created event
 */
export const createEvent = (event) => {
  console.log("Creating event with data:", JSON.stringify(event, null, 2));
  return postData("api/events", event);
};

/**
 * Update an existing event
 * @param {string} id - Event ID
 * @param {Object} event - Updated event data
 * @returns {Promise<Object>} Promise resolving to updated event
 */
export const updateEvent = (id, event) => updateData("api/events", id, event);

/**
 * Delete an event
 * @param {string|Object} id - Event ID or event object
 * @returns {Promise<Object>} Promise resolving to deletion result
 */
export const deleteEvent = (id) => {
  // If id is an object (like a full event), extract the ID
  const eventId = typeof id === "object" ? id._id || id.id : id;

  if (!eventId) {
    console.error("Missing event ID for deletion");
    throw new Error("Cannot delete: Invalid event ID");
  }

  console.log(`Deleting event with ID: ${eventId}`);
  return deleteData("api/events", eventId);
};

/**
 * Get all recurring events
 * @returns {Promise<Array>} Promise resolving to array of recurring events
 */
export const getRecurringEvents = () => {
  console.log("Calling getRecurringEvents API");
  return fetchData("api/recurring-events")
    .then((data) => {
      console.log("Recurring Events API response:", data);
      return data;
    })
    .catch((error) => {
      console.error("Error fetching recurring events:", error);
      throw error;
    });
};

/**
 * Get a recurring event by ID
 * @param {string} id - Recurring event ID
 * @returns {Promise<Object>} Promise resolving to recurring event object
 */
export const getRecurringEventById = (id) =>
  fetchData(`api/recurring-events/${id}`);

/**
 * Create a new recurring event
 * @param {Object} event - Recurring event data
 * @returns {Promise<Object>} Promise resolving to created recurring event
 */
export const createRecurringEvent = (event) => {
  console.log(
    "Creating recurring event with data:",
    JSON.stringify(event, null, 2)
  );
  return postData("api/recurring-events", event);
};

/**
 * Update an existing recurring event
 * @param {string} id - Recurring event ID
 * @param {Object} event - Updated recurring event data
 * @returns {Promise<Object>} Promise resolving to updated recurring event
 */
export const updateRecurringEvent = (id, event) =>
  updateData("api/recurring-events", id, event);

/**
 * Delete a recurring event
 * @param {string|Object} id - Recurring event ID or event object
 * @returns {Promise<Object>} Promise resolving to deletion result
 */
export const deleteRecurringEvent = (id) => {
  // If id is an object (like a full event), extract the ID
  const eventId = typeof id === "object" ? id._id || id.id : id;

  if (!eventId) {
    console.error("Missing recurring event ID for deletion");
    throw new Error("Cannot delete: Invalid recurring event ID");
  }

  console.log(`Deleting recurring event with ID: ${eventId}`);
  return deleteData("api/recurring-events", eventId);
};
