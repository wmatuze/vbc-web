import { useQuery } from "@tanstack/react-query";
import {
  getRecurringEvents,
  getRecurringEventById,
} from "../services/api/events";

/**
 * Custom hook for fetching recurring events data using React Query
 * @param {Object} options - Additional options for the query
 * @returns {Object} Query result object with data, loading state, error, and refetch function
 */
export const useRecurringEventsQuery = (options = {}) => {
  return useQuery({
    queryKey: ["recurring-events"],
    queryFn: getRecurringEvents,
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
    enabled: !!id, // Only run the query if we have an ID
  });
};
