import { useQuery } from "@tanstack/react-query";
import { getMedia, getMediaById } from "../services/api";

/**
 * Custom hook for fetching media data using React Query
 * @param {Object} options - Additional options for the query
 * @returns {Object} Query result object with data, loading state, error, and refetch function
 */
export const useMediaQuery = (options = {}) => {
  return useQuery({
    queryKey: ["media"],
    queryFn: async () => {
      const media = await getMedia();

      // Process media to ensure no objects are rendered directly
      return media.map((item) => ({
        ...item,
        // Convert any object properties to strings to prevent rendering issues
        title:
          typeof item.title === "object"
            ? JSON.stringify(item.title)
            : item.title,
        description:
          typeof item.description === "object"
            ? "Media description"
            : item.description,
        path:
          typeof item.path === "object"
            ? "/assets/media/default-image.jpg"
            : item.path,
      }));
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    retry: 1,
    onError: (error) => {
      console.error("Error fetching media:", error);
    },
    ...options,
  });
};

/**
 * Custom hook for fetching a single media item by ID
 * @param {string} id - The media ID
 * @returns {Object} Query result object with data, loading state, error, and refetch function
 */
export const useMediaByIdQuery = (id) => {
  return useQuery({
    queryKey: ["media", id],
    queryFn: async () => {
      const item = await getMediaById(id);

      // Process media to ensure no objects are rendered directly
      return {
        ...item,
        // Convert any object properties to strings to prevent rendering issues
        title:
          typeof item.title === "object"
            ? JSON.stringify(item.title)
            : item.title,
        description:
          typeof item.description === "object"
            ? "Media description"
            : item.description,
        path:
          typeof item.path === "object"
            ? "/assets/media/default-image.jpg"
            : item.path,
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    retry: 1,
    enabled: !!id, // Only run the query if we have an ID
    onError: (error) => {
      console.error(`Error fetching media with ID ${id}:`, error);
    },
  });
};
