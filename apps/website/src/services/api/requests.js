// Request-related API functions (event signups, etc.)
import { fetchData, postData, updateData, deleteData } from './core';

/**
 * Submit an event signup request
 * @param {Object} request - Signup request data
 * @returns {Promise<Object>} Promise resolving to created request
 */
export const submitEventSignupRequest = (request) => {
  console.log("Submitting event signup request:", request);
  // Ensure eventId is properly formatted as a string for MongoDB
  const requestData = { ...request };
  if (requestData.eventId) {
    requestData.eventId = String(requestData.eventId);
  }
  return postData("api/event-signup-requests", requestData);
};

/**
 * Get all event signup requests
 * @returns {Promise<Array>} Promise resolving to array of signup requests
 */
export const getEventSignupRequests = () =>
  fetchData("api/event-signup-requests");

/**
 * Get event signup requests by type
 * @param {string} eventType - Event type (e.g., 'baptism', 'babyDedication')
 * @returns {Promise<Array>} Promise resolving to array of signup requests
 */
export const getEventSignupRequestsByType = (eventType) =>
  fetchData(`api/event-signup-requests/type/${eventType}`);

/**
 * Get event signup requests for a specific event
 * @param {string} eventId - Event ID
 * @returns {Promise<Array>} Promise resolving to array of signup requests
 */
export const getEventSignupRequestsByEvent = (eventId) =>
  fetchData(`api/event-signup-requests/event/${eventId}`);

/**
 * Update an event signup request status
 * @param {string} id - Request ID
 * @param {string} status - New status
 * @returns {Promise<Object>} Promise resolving to updated request
 */
export const updateEventSignupRequest = (id, status) =>
  updateData("api/event-signup-requests", id, { status });

/**
 * Delete an event signup request
 * @param {string} id - Request ID
 * @returns {Promise<Object>} Promise resolving to deletion result
 */
export const deleteEventSignupRequest = (id) =>
  deleteData("api/event-signup-requests", id);
