import { useQuery } from "@tanstack/react-query";
import { getLeaders } from "../services/api/leaders";

/**
 * Custom hook for fetching leaders data using React Query
 * @returns {Object} Query result object with data, loading state, error, and refetch function
 */
export const useLeadersQuery = () => {
  return useQuery({
    queryKey: ["leaders"],
    queryFn: getLeaders,
    select: (data) => {
      // Sort leaders by order
      return [...data].sort((a, b) => (a.order || 0) - (b.order || 0));
    },
  });
};
