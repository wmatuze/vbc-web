import { useQuery } from "@tanstack/react-query";
import { getCellGroups, getCellGroupById } from "../services/api/cell-groups";
import { getZoneCellGroups } from "../services/api/zones";

/**
 * Custom hook for fetching cell groups data using React Query
 * @param {Object} options - Additional options for the query
 * @returns {Object} Query result object with data, loading state, error, and refetch function
 */
export const useCellGroupsQuery = (options = {}) => {
  return useQuery({
    queryKey: ["cellGroups"],
    queryFn: getCellGroups,
    ...options,
  });
};

/**
 * Custom hook for fetching cell groups by zone ID
 * @param {string} zoneId - The zone ID to filter by
 * @returns {Object} Query result object with filtered data, loading state, error, and refetch function
 */
export const useCellGroupsByZoneQuery = (zoneId) => {
  return useQuery({
    queryKey: ["cellGroups", "zone", zoneId],
    queryFn: () => getZoneCellGroups(zoneId),
    enabled: !!zoneId, // Only run the query if we have a zoneId
  });
};

/**
 * Custom hook for fetching a single cell group by ID
 * @param {string} id - The cell group ID
 * @returns {Object} Query result object with data, loading state, error, and refetch function
 */
export const useCellGroupByIdQuery = (id) => {
  return useQuery({
    queryKey: ["cellGroups", id],
    queryFn: () => getCellGroupById(id),
    enabled: !!id, // Only run the query if we have an ID
  });
};
