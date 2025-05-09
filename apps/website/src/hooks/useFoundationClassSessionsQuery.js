import { useState, useEffect } from "react";
import {
  getFoundationClassSessions,
  createFoundationClassSession,
  updateFoundationClassSession,
  deleteFoundationClassSession,
} from "../services/api";
import { FoundationClassSessionService } from "../services/foundationClassSessionService";

/**
 * Custom hook for fetching foundation class sessions
 * @param {Object} options - Additional options for the query
 * @returns {Object} Query result object with data, loading state, error, and refetch function
 */
export const useFoundationClassSessionsQuery = (options = {}) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usingMockData, setUsingMockData] = useState(false);

  const fetchData = async (forceRefresh = false) => {
    setIsLoading(true);
    try {
      // Try to fetch from API
      const sessions = await FoundationClassSessionService.getSessions({
        forceRefresh,
        useMockOnFailure: true,
      });

      setData(sessions);

      // Check if we're using mock data
      const cachedData = FoundationClassSessionService.getCachedSessions();
      setUsingMockData(!cachedData || cachedData.length === 0);

      setError(null);
    } catch (err) {
      console.error("Error fetching foundation class sessions:", err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data on mount
  useEffect(() => {
    fetchData();
  }, []);

  return {
    data,
    isLoading,
    error,
    usingMockData,
    refetch: () => fetchData(true),
  };
};

/**
 * Custom hook for creating a foundation class session
 * @returns {Object} Mutation result object
 */
export const useCreateFoundationClassSessionMutation = () => {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);

  const mutateAsync = async (sessionData) => {
    setIsPending(true);
    try {
      const result = await createFoundationClassSession(sessionData);
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setIsPending(false);
    }
  };

  return {
    mutateAsync,
    isPending,
    error,
  };
};

/**
 * Custom hook for updating a foundation class session
 * @returns {Object} Mutation result object
 */
export const useUpdateFoundationClassSessionMutation = () => {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);

  const mutateAsync = async ({ id, sessionData }) => {
    setIsPending(true);
    try {
      const result = await updateFoundationClassSession(id, sessionData);
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setIsPending(false);
    }
  };

  return {
    mutateAsync,
    isPending,
    error,
  };
};

/**
 * Custom hook for deleting a foundation class session
 * @returns {Object} Mutation result object
 */
export const useDeleteFoundationClassSessionMutation = () => {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);

  const mutateAsync = async (id) => {
    setIsPending(true);
    try {
      const result = await deleteFoundationClassSession(id);
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setIsPending(false);
    }
  };

  return {
    mutateAsync,
    isPending,
    error,
  };
};
