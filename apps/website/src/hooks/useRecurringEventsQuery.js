import { useQuery } from "@tanstack/react-query";
import { getRecurringEvents, getRecurringEventById } from "../services/api";

/**
 * Custom hook for fetching recurring events data using React Query
 * @param {Object} options - Additional options for the query
 * @returns {Object} Query result object with data, loading state, error, and refetch function
 */
export const useRecurringEventsQuery = (options = {}) => {
  return useQuery({
    queryKey: ["recurring-events"],
    queryFn: getRecurringEvents,
    staleTime: 60 * 1000, // 1 minute (reduced from 5 minutes for more frequent updates)
    refetchOnWindowFocus: true, // Changed to true to refresh data when user returns to the tab
    retry: 1,
    onError: (error) => {
      console.error("Error fetching recurring events:", error);
    },
    ...options,
  });
};

/**
 * Custom hook for fetching a single recurring event by ID
 * @param {string} id - The recurring event ID
 * @returns {Object} Query result object with data, loading state, error, and refetch function
 */
export const useRecurringEventByIdQuery = (id) => {
  return useQuery({
    queryKey: ["recurring-events", id],
    queryFn: () => getRecurringEventById(id),
    staleTime: 60 * 1000, // 1 minute (reduced from 5 minutes for more frequent updates)
    refetchOnWindowFocus: true, // Changed to true to refresh data when user returns to the tab
    retry: 1,
    enabled: !!id, // Only run the query if we have an ID
    onError: (error) => {
      console.error(`Error fetching recurring event with ID ${id}:`, error);
    },
  });
};
