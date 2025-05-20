// Zone-related API functions
import { fetchData, postData, updateData, deleteData } from './core';

/**
 * Get all zones
 * @returns {Promise<Array>} Promise resolving to array of zones
 */
export const getZones = () => fetchData("api/zones");

/**
 * Get a zone by ID
 * @param {string} id - Zone ID
 * @returns {Promise<Object>} Promise resolving to zone object
 */
export const getZoneById = (id) => {
  // Ensure id is a valid string
  const zoneId = id?.toString() || id;
  return fetchData(`api/zones/${zoneId}`);
};

/**
 * Get cell groups for a specific zone
 * @param {string} zoneId - Zone ID
 * @returns {Promise<Array>} Promise resolving to array of cell groups
 */
export const getZoneCellGroups = (zoneId) => {
  // Ensure zoneId is a valid string
  const id = zoneId?.toString() || zoneId;
  return fetchData(`api/zones/${id}/cell-groups`);
};

/**
 * Alias for backward compatibility
 * @param {string} zoneId - Zone ID
 * @returns {Promise<Array>} Promise resolving to array of cell groups
 */
export const getCellGroupsByZone = getZoneCellGroups;

/**
 * Create a new zone
 * @param {Object} zone - Zone data
 * @returns {Promise<Object>} Promise resolving to created zone
 */
export const createZone = (zone) => postData("api/zones", zone);

/**
 * Update an existing zone
 * @param {string|Object} id - Zone ID or zone object
 * @param {Object} zone - Updated zone data
 * @returns {Promise<Object>} Promise resolving to updated zone
 */
export const updateZone = (id, zone) => {
  // If id is an object (like a full zone), extract the ID
  const zoneId = typeof id === "object" ? id._id || id.id : id;

  if (!zoneId) {
    console.error("Missing zone ID for update");
    throw new Error("Cannot update: Invalid zone ID");
  }

  // Clean the data before sending
  const cleanZone = { ...zone };
  delete cleanZone._id;
  delete cleanZone.__v;
  delete cleanZone.createdAt;
  delete cleanZone.updatedAt;

  console.log(`Updating zone with ID: ${zoneId}`);
  return updateData("api/zones", zoneId, cleanZone);
};

/**
 * Delete a zone
 * @param {string|Object} id - Zone ID or zone object
 * @returns {Promise<Object>} Promise resolving to deletion result
 */
export const deleteZone = (id) => {
  // If id is an object (like a full zone), extract the ID
  const zoneId = typeof id === "object" ? id._id || id.id : id;

  if (!zoneId) {
    console.error("Missing zone ID for deletion");
    throw new Error("Cannot delete: Invalid zone ID");
  }

  console.log(`Deleting zone with ID: ${zoneId}`);
  return deleteData("api/zones", zoneId);
};
