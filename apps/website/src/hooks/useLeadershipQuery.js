import { useQuery } from '@tanstack/react-query';
import { getLeaders } from '../services/api';

/**
 * Custom hook for fetching leadership data for the public-facing Leadership page
 * @returns {Object} Query result object with data, loading state, error, and refetch function
 */
export const useLeadershipQuery = () => {
  return useQuery({
    queryKey: ['leadership'],
    queryFn: async () => {
      const data = await getLeaders();
      
      // Process leaders to ensure email is properly extracted from contact object
      const processedLeaders = data.map((leader) => ({
        ...leader,
        // Extract email from contact object if present
        email: leader.contact?.email || leader.email || "info@victorybc.org",
      }));

      // Sort leaders by order property
      return processedLeaders.sort((a, b) => (a.order || 99) - (b.order || 99));
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    retry: 1,
  });
};
