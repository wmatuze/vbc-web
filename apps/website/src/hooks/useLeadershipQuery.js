import { useQuery } from "@tanstack/react-query";
import { getLeaders } from "../services/api/leaders";

/**
 * Custom hook for fetching leadership data for the public-facing Leadership page.
 * Uses the same query key as the admin LeadersQuery so that cache invalidations
 * performed by the admin panel also refresh the public page.
 *
 * @returns {Object} Query result object with data, loading state, error, and refetch function
 */
export const useLeadershipQuery = () => {
  return useQuery({
    // Use the same key as useLeadersQuery ("leaders") so admin mutations
    // that invalidate ["leaders"] automatically bust this cache too.
    queryKey: ["leaders"],
    queryFn: async () => {
      const data = await getLeaders();

      if (!Array.isArray(data)) {
        console.error("useLeadershipQuery: unexpected response shape", data);
        return [];
      }

      // Process leaders to ensure email is properly extracted from contact object
      const processedLeaders = data.map((leader) => ({
        ...leader,
        // Extract email from contact object if present
        email: leader.contact?.email || leader.email || "info@victorybc.org",
      }));

      // Sort leaders by order property
      return processedLeaders.sort((a, b) => (a.order || 99) - (b.order || 99));
    },
    // Re-fetch whenever the component mounts so freshly-saved leaders always appear.
    refetchOnMount: true,
    // Keep stale data visible while re-fetching so there is no flash of empty content.
    staleTime: 60 * 1000, // 60 seconds
    retry: 2,
  });
};
