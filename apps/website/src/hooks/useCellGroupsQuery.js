import { useQuery } from "@tanstack/react-query";
import {
  getCellGroups,
  getCellGroupById,
  getZoneCellGroups,
} from "../services/api";

/**
 * Custom hook for fetching cell groups data using React Query
 * @param {Object} options - Additional options for the query
 * @returns {Object} Query result object with data, loading state, error, and refetch function
 */
export const useCellGroupsQuery = (options = {}) => {
  return useQuery({
    queryKey: ["cellGroups"],
    queryFn: getCellGroups,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    retry: 1,
    onError: (error) => {
      console.error("Error fetching cell groups:", error);
    },
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
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    retry: 1,
    enabled: !!zoneId, // Only run the query if we have a zoneId
    onError: (error) => {
      console.error(`Error fetching cell groups for zone ${zoneId}:`, error);
    },
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
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    retry: 1,
    enabled: !!id, // Only run the query if we have an ID
    onError: (error) => {
      console.error(`Error fetching cell group with ID ${id}:`, error);
    },
  });
};
