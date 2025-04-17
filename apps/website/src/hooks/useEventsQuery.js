import { useQuery } from '@tanstack/react-query';
import { getEvents, getEventById } from '../services/api';

/**
 * Custom hook for fetching events data using React Query
 * @param {Object} options - Additional options for the query
 * @returns {Object} Query result object with data, loading state, error, and refetch function
 */
export const useEventsQuery = (options = {}) => {
  return useQuery({
    queryKey: ['events'],
    queryFn: getEvents,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    retry: 1,
    onError: (error) => {
      console.error('Error fetching events:', error);
    },
    ...options
  });
};

/**
 * Custom hook for fetching events filtered by ministry
 * @param {string} ministry - The ministry to filter by
 * @returns {Object} Query result object with filtered data, loading state, error, and refetch function
 */
export const useMinistryEventsQuery = (ministry) => {
  return useQuery({
    queryKey: ['events', 'ministry', ministry],
    queryFn: async () => {
      const events = await getEvents();
      return events.filter(event => event?.ministry === ministry);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    retry: 1,
    enabled: !!ministry, // Only run the query if we have a ministry
    onError: (error) => {
      console.error(`Error fetching events for ministry ${ministry}:`, error);
    }
  });
};

/**
 * Custom hook for fetching a single event by ID
 * @param {string} id - The event ID
 * @returns {Object} Query result object with data, loading state, error, and refetch function
 */
export const useEventByIdQuery = (id) => {
  return useQuery({
    queryKey: ['events', id],
    queryFn: () => getEventById(id),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    retry: 1,
    enabled: !!id, // Only run the query if we have an ID
    onError: (error) => {
      console.error(`Error fetching event with ID ${id}:`, error);
    }
  });
};
