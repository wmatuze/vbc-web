import { useQuery } from "@tanstack/react-query";
import {
  getZones,
  getZoneById,
  getZoneCellGroups,
} from "../services/api/zones";

/**
 * Custom hook for fetching zones data using React Query
 * @param {Object} options - Additional options for the query
 * @returns {Object} Query result object with data, loading state, error, and refetch function
 */
export const useZonesQuery = (options = {}) => {
  return useQuery({
    queryKey: ["zones"],
    queryFn: getZones,
    ...options,
  });
};

/**
 * Custom hook for fetching a single zone by ID
 * @param {string} id - The zone ID
 * @returns {Object} Query result object with data, loading state, error, and refetch function
 */
export const useZoneByIdQuery = (id) => {
  return useQuery({
    queryKey: ["zones", id],
    queryFn: () => getZoneById(id),
    enabled: !!id, // Only run the query if we have an ID
  });
};

/**
 * Custom hook for fetching cell groups in a specific zone
 * @param {string} zoneId - The zone ID
 * @returns {Object} Query result object with data, loading state, error, and refetch function
 */
export const useZoneCellGroupsQuery = (zoneId) => {
  return useQuery({
    queryKey: ["zones", zoneId, "cellGroups"],
    queryFn: () => getZoneCellGroups(zoneId),
    enabled: !!zoneId, // Only run the query if we have a zone ID
  });
};
