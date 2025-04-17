import { useQuery } from '@tanstack/react-query';
import { getSermons } from '../services/api';

/**
 * Custom hook for fetching sermons data using React Query
 * @param {Object} options - Additional options for the query
 * @returns {Object} Query result object with data, loading state, error, and refetch function
 */
export const useSermonsQuery = (options = {}) => {
  return useQuery({
    queryKey: ['sermons'],
    queryFn: getSermons,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    retry: 1,
    onError: (error) => {
      console.error('Error fetching sermons:', error);
    },
    ...options
  });
};

/**
 * Custom hook for fetching a single sermon by ID
 * @param {string} id - The sermon ID
 * @returns {Object} Query result object with data, loading state, error, and refetch function
 */
export const useSermonByIdQuery = (id) => {
  return useQuery({
    queryKey: ['sermons', id],
    queryFn: () => getSermonById(id),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    retry: 1,
    enabled: !!id, // Only run the query if we have an ID
    onError: (error) => {
      console.error(`Error fetching sermon with ID ${id}:`, error);
    }
  });
};
