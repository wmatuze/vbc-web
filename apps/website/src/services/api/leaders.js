// Leader-related API functions
import { fetchData, postData, updateData, deleteData } from './core';

/**
 * Get all leaders
 * @returns {Promise<Array>} Promise resolving to array of leaders
 */
export const getLeaders = () => fetchData("api/leaders");

/**
 * Get a leader by ID
 * @param {string} id - Leader ID
 * @returns {Promise<Object>} Promise resolving to leader object
 */
export const getLeaderById = (id) => fetchData(`api/leaders/${id}`);

/**
 * Create a new leader
 * @param {Object} leader - Leader data
 * @returns {Promise<Object>} Promise resolving to created leader
 */
export const createLeader = (leader) => {
  console.log("Creating leader with data:", JSON.stringify(leader, null, 2));
  return postData("api/leaders", leader);
};

/**
 * Update an existing leader
 * @param {string} id - Leader ID
 * @param {Object} leader - Updated leader data
 * @returns {Promise<Object>} Promise resolving to updated leader
 */
export const updateLeader = (id, leader) =>
  updateData("api/leaders", id, leader);

/**
 * Delete a leader
 * @param {string} id - Leader ID
 * @returns {Promise<Object>} Promise resolving to deletion result
 */
export const deleteLeader = (id) => deleteData("api/leaders", id);
