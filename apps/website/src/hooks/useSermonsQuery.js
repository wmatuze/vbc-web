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
      return sermons.map((sermon) => {
        // Create a safe copy of the sermon
        const safeSermom = { ...sermon };

        // Process all properties to ensure they're safe for rendering
        Object.keys(safeSermom).forEach((key) => {
          const value = safeSermom[key];

          // Handle null or undefined
          if (value === null || value === undefined) {
            safeSermom[key] = "";
          }
          // Handle objects (except arrays)
          else if (typeof value === "object" && !Array.isArray(value)) {
            // For image objects, extract the path
            if (key === "image" && value.path) {
              safeSermom.imageUrl = value.path;
              // Keep the image object intact for reference
            } else {
              // Convert other objects to string to prevent rendering issues
              safeSermom[key] = JSON.stringify(value);
            }
          }
          // Handle arrays - ensure each item is safe
          else if (Array.isArray(value)) {
            safeSermom[key] = value.map((item) =>
              typeof item === "object" ? JSON.stringify(item) : String(item)
            );
          }
        });

        // Ensure these specific fields are always strings
        safeSermom.description =
          typeof safeSermom.description === "object"
            ? "View sermon details"
            : String(safeSermom.description || "");

        // Handle image URL - Always generate YouTube thumbnail if a videoId is available
        if (safeSermom.videoId) {
          // Generate YouTube thumbnail URL - this should be the primary fallback
          const youtubeThumb = `https://img.youtube.com/vi/${safeSermom.videoId}/hqdefault.jpg`;
          
          // Only set this if we don't have a valid image path
          if (!safeSermom.imageUrl || 
              safeSermom.imageUrl === "" || 
              safeSermom.imageUrl.includes("default-image") ||
              typeof safeSermom.imageUrl === "object") {
            safeSermom.imageUrl = youtubeThumb;
            console.log("Using YouTube thumbnail for:", safeSermom.title);
          }
        } 
        
        // Ensure imageUrl has a value
        if (!safeSermom.imageUrl || typeof safeSermom.imageUrl === "object") {
          safeSermom.imageUrl = "/assets/sermons/default-sermon.jpg";
        }
        
        safeSermom.imageUrl = String(safeSermom.imageUrl);
        safeSermom.title = String(safeSermom.title || "Untitled Sermon");
        safeSermom.speaker = String(safeSermom.speaker || "Unknown Speaker");

        return safeSermom;
      });
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

      // Create a safe copy of the sermon
      const safeSermom = { ...sermon };

      // Process all properties to ensure they're safe for rendering
      Object.keys(safeSermom).forEach((key) => {
        const value = safeSermom[key];

        // Handle null or undefined
        if (value === null || value === undefined) {
          safeSermom[key] = "";
        }
        // Handle objects (except arrays)
        else if (typeof value === "object" && !Array.isArray(value)) {
          // For image objects, extract the path
          if (key === "image" && value.path) {
            safeSermom.imageUrl = value.path;
            // Keep the image object intact for reference
          } else {
            // Convert other objects to string to prevent rendering issues
            safeSermom[key] = JSON.stringify(value);
          }
        }
        // Handle arrays - ensure each item is safe
        else if (Array.isArray(value)) {
          safeSermom[key] = value.map((item) =>
            typeof item === "object" ? JSON.stringify(item) : String(item)
          );
        }
      });

      // Ensure these specific fields are always strings
      safeSermom.description =
        typeof safeSermom.description === "object"
          ? "View sermon details"
          : String(safeSermom.description || "");

      // Handle image URL - Always generate YouTube thumbnail if a videoId is available
      if (safeSermom.videoId) {
        // Generate YouTube thumbnail URL - this should be the primary fallback
        const youtubeThumb = `https://img.youtube.com/vi/${safeSermom.videoId}/hqdefault.jpg`;
        
        // Only set this if we don't have a valid image path
        if (!safeSermom.imageUrl || 
            safeSermom.imageUrl === "" || 
            safeSermom.imageUrl.includes("default-image") ||
            typeof safeSermom.imageUrl === "object") {
          safeSermom.imageUrl = youtubeThumb;
          console.log("Using YouTube thumbnail for single sermon:", safeSermom.title);
        }
      }
      
      // Ensure imageUrl has a value
      if (!safeSermom.imageUrl || typeof safeSermom.imageUrl === "object") {
        safeSermom.imageUrl = "/assets/sermons/default-sermon.jpg";
      }
      
      safeSermom.imageUrl = String(safeSermom.imageUrl);
      safeSermom.title = String(safeSermom.title || "Untitled Sermon");
      safeSermom.speaker = String(safeSermom.speaker || "Unknown Speaker");

      return safeSermom;
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
