import { useQuery } from "@tanstack/react-query";
import { getEvents, getEventById } from "../services/api/events";

/**
 * Custom hook for fetching events data using React Query
 * @param {Object} options - Additional options for the query
 * @returns {Object} Query result object with data, loading state, error, and refetch function
 */
export const useEventsQuery = (options = {}) => {
  const { year, ...queryOptions } = options;
  return useQuery({
    queryKey: ["events", year ?? "all"],
    queryFn: async () => {
      const data = await getEvents(year);
      if (!Array.isArray(data)) {
        console.error("useEventsQuery: unexpected response shape", data);
        return [];
      }
      return data;
    },
    // Re-fetch on mount so navigating back to the Calendar page always picks up new events.
    refetchOnMount: true,
    staleTime: 60 * 1000,
    retry: 2,
    ...queryOptions,
  });
};

/**
 * Custom hook for fetching events filtered by ministry
 * @param {string} ministry - The ministry to filter by
 * @returns {Object} Query result object with filtered data, loading state, error, and refetch function
 */
export const useMinistryEventsQuery = (ministry) => {
  return useQuery({
    queryKey: ["events", "ministry", ministry],
    queryFn: async () => {
      const events = await getEvents();
      return events.filter((event) => event?.ministry === ministry);
    },
    refetchOnMount: true,
    staleTime: 60 * 1000, // 60 seconds
    retry: 2,
    enabled: !!ministry, // Only run the query if we have a ministry
  });
};

/**
 * Custom hook for fetching a single event by ID
 * @param {string} id - The event ID
 * @returns {Object} Query result object with data, loading state, error, and refetch function
 */
export const useEventByIdQuery = (id) => {
  return useQuery({
    queryKey: ["events", id],
    queryFn: () => getEventById(id),
    refetchOnMount: true,
    staleTime: 60 * 1000, // 60 seconds
    retry: 2,
    enabled: !!id, // Only run the query if we have an ID
  });
};
