// Cell Group-related API functions
import { fetchData, postData, updateData, deleteData } from './core';

/**
 * Get all cell groups
 * @returns {Promise<Array>} Promise resolving to array of cell groups
 */
export const getCellGroups = () => fetchData("api/cell-groups");

/**
 * Get a cell group by ID
 * @param {string} id - Cell group ID
 * @returns {Promise<Object>} Promise resolving to cell group object
 */
export const getCellGroupById = (id) => {
  // Ensure id is a valid string
  const groupId = id?.toString() || id;
  return fetchData(`api/cell-groups/${groupId}`);
};

/**
 * Create a new cell group
 * @param {Object} group - Cell group data
 * @returns {Promise<Object>} Promise resolving to created cell group
 */
export const createCellGroup = (group) => postData("api/cell-groups", group);

/**
 * Update an existing cell group
 * @param {string|Object} id - Cell group ID or cell group object
 * @param {Object} group - Updated cell group data
 * @returns {Promise<Object>} Promise resolving to updated cell group
 */
export const updateCellGroup = (id, group) => {
  // If id is an object (like a full cell group), extract the ID
  const groupId = typeof id === "object" ? id._id || id.id : id;

  if (!groupId) {
    console.error("Missing cell group ID for update");
    throw new Error("Cannot update: Invalid cell group ID");
  }

  // Clean the data before sending
  const cleanGroup = { ...group };
  delete cleanGroup._id;
  delete cleanGroup.__v;
  delete cleanGroup.createdAt;
  delete cleanGroup.updatedAt;

  // Ensure zone is a string
  if (cleanGroup.zone) {
    cleanGroup.zone = cleanGroup.zone.toString();
  }

  console.log(`Updating cell group with ID: ${groupId}`);
  console.log(
    `Cell group zone: ${cleanGroup.zone} (type: ${typeof cleanGroup.zone})`
  );
  return updateData("api/cell-groups", groupId, cleanGroup);
};

/**
 * Delete a cell group
 * @param {string|Object} id - Cell group ID or cell group object
 * @returns {Promise<Object>} Promise resolving to deletion result
 */
export const deleteCellGroup = (id) => {
  // If id is an object (like a full cell group), extract the ID
  const groupId = typeof id === "object" ? id._id || id.id : id;

  if (!groupId) {
    console.error("Missing cell group ID for deletion");
    throw new Error("Cannot delete: Invalid cell group ID");
  }

  console.log(`Deleting cell group with ID: ${groupId}`);
  return deleteData("api/cell-groups", groupId);
};

/**
 * Submit a cell group join request
 * @param {Object} request - Join request data
 * @returns {Promise<Object>} Promise resolving to created request
 */
export const submitCellGroupJoinRequest = (request) =>
  postData("api/cell-group-join-requests", request);

/**
 * Get all cell group join requests
 * @returns {Promise<Array>} Promise resolving to array of join requests
 */
export const getCellGroupJoinRequests = () =>
  fetchData("api/cell-group-join-requests");

/**
 * Get cell group join requests for a specific cell group
 * @param {string} cellGroupId - Cell group ID
 * @returns {Promise<Array>} Promise resolving to array of join requests
 */
export const getCellGroupJoinRequestsForCellGroup = (cellGroupId) =>
  fetchData(`api/cell-group-join-requests/cell-group/${cellGroupId}`);

/**
 * Update a cell group join request status
 * @param {string} id - Request ID
 * @param {string} status - New status
 * @returns {Promise<Object>} Promise resolving to updated request
 */
export const updateCellGroupJoinRequest = (id, status) =>
  updateData("api/cell-group-join-requests", id, { status });

/**
 * Delete a cell group join request
 * @param {string} id - Request ID
 * @returns {Promise<Object>} Promise resolving to deletion result
 */
export const deleteCellGroupJoinRequest = (id) =>
  deleteData("api/cell-group-join-requests", id);
