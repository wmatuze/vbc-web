import { useQuery } from '@tanstack/react-query';
import { getZones, getZoneById } from '../services/api';

/**
 * Custom hook for fetching zones data using React Query
 * @param {Object} options - Additional options for the query
 * @returns {Object} Query result object with data, loading state, error, and refetch function
 */
export const useZonesQuery = (options = {}) => {
  return useQuery({
    queryKey: ['zones'],
    queryFn: getZones,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    retry: 1,
    onError: (error) => {
      console.error('Error fetching zones:', error);
    },
    ...options
  });
};

/**
 * Custom hook for fetching a single zone by ID
 * @param {string} id - The zone ID
 * @returns {Object} Query result object with data, loading state, error, and refetch function
 */
export const useZoneByIdQuery = (id) => {
  return useQuery({
    queryKey: ['zones', id],
    queryFn: () => getZoneById(id),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    retry: 1,
    enabled: !!id, // Only run the query if we have an ID
    onError: (error) => {
      console.error(`Error fetching zone with ID ${id}:`, error);
    }
  });
};
