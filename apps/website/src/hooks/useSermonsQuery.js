import { useQuery } from "@tanstack/react-query";
import { getSermons, getSermonById } from "../services/api";

/**
 * Custom hook for fetching sermons data using React Query
 * @param {Object} options - Additional options for the query
 * @returns {Object} Query result object with data, loading state, error, and refetch function
 */
export const useSermonsQuery = (options = {}) => {
  return useQuery({
    queryKey: ["sermons"],
    queryFn: async () => {
      const sermons = await getSermons();

      // Process sermons to ensure no objects are rendered directly
      return sermons.map((sermon) => ({
        ...sermon,
        // Convert description to string if it's an object
        description:
          typeof sermon.description === "object"
            ? "View sermon details"
            : sermon.description,
        // Convert imageUrl to string if it's an object
        imageUrl:
          typeof sermon.imageUrl === "object"
            ? "/assets/media/default-image.jpg"
            : sermon.imageUrl,
      }));
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    retry: 1,
    onError: (error) => {
      console.error("Error fetching sermons:", error);
    },
    ...options,
  });
};

/**
 * Custom hook for fetching a single sermon by ID
 * @param {string} id - The sermon ID
 * @returns {Object} Query result object with data, loading state, error, and refetch function
 */
export const useSermonByIdQuery = (id) => {
  return useQuery({
    queryKey: ["sermons", id],
    queryFn: async () => {
      const sermon = await getSermonById(id);

      // Process sermon to ensure no objects are rendered directly
      return {
        ...sermon,
        // Convert description to string if it's an object
        description:
          typeof sermon.description === "object"
            ? "View sermon details"
            : sermon.description,
        // Convert imageUrl to string if it's an object
        imageUrl:
          typeof sermon.imageUrl === "object"
            ? "/assets/media/default-image.jpg"
            : sermon.imageUrl,
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    retry: 1,
    enabled: !!id, // Only run the query if we have an ID
    onError: (error) => {
      console.error(`Error fetching sermon with ID ${id}:`, error);
    },
  });
};
