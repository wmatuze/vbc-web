import { useState, useEffect } from "react";
import { FoundationClassSessionService } from "../services/foundationClassSessionService";
import { refreshFoundationClassSessions } from "../utils/refreshFoundationClassSessions";

/**
 * Custom hook for foundation class sessions
 * @param {Object} options - Hook options
 * @param {boolean} options.useMockOnFailure - Use mock data if API fails
 * @returns {Object} - Hook state and methods
 */
export const useFoundationClassSessions = (
  options = { useMockOnFailure: true }
) => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usingMockData, setUsingMockData] = useState(false);

  // Fetch sessions
  const fetchSessions = async (forceRefresh = false) => {
    setLoading(true);
    setError(null);

    try {
      console.log(
        `Fetching foundation class sessions (forceRefresh: ${forceRefresh})`
      );

      let data;
      if (forceRefresh) {
        // Use the utility function to force refresh
        try {
          data = await refreshFoundationClassSessions();
          console.log("Successfully refreshed foundation class sessions");
        } catch (refreshError) {
          console.error(
            "Error refreshing foundation class sessions:",
            refreshError
          );
          // Fall back to regular fetch if refresh fails
          data = await FoundationClassSessionService.getSessions({
            forceRefresh: false,
            useMockOnFailure: options.useMockOnFailure,
          });
        }
      } else {
        // Regular fetch
        data = await FoundationClassSessionService.getSessions({
          forceRefresh: false,
          useMockOnFailure: options.useMockOnFailure,
        });
      }

      // Sort sessions by start date (nearest first)
      const sortedSessions = [...data].sort((a, b) => {
        return new Date(a.startDate) - new Date(b.startDate);
      });

      console.log(
        `Processed ${sortedSessions.length} foundation class sessions`
      );
      setSessions(sortedSessions);

      // Check if we're using mock data by comparing with cached data
      const cachedData = FoundationClassSessionService.getCachedSessions();
      const usingMock = !cachedData || cachedData.length === 0;
      setUsingMockData(usingMock);
      console.log(`Using mock data: ${usingMock}`);
    } catch (err) {
      console.error("Error in fetchSessions:", err);
      setError(err.message || "Failed to fetch foundation class sessions");
    } finally {
      setLoading(false);
    }
  };

  // Register for a session
  const registerForSession = async (formData, sessionId) => {
    try {
      console.log(
        `Registering for foundation class session ${sessionId}`,
        formData
      );

      const result = await FoundationClassSessionService.register(
        formData,
        sessionId
      );
      console.log("Registration successful:", result);

      // Refresh sessions after registration
      console.log("Refreshing sessions after registration");
      await fetchSessions(true);

      return result;
    } catch (err) {
      console.error("Error registering for foundation class session:", err);
      throw err;
    }
  };

  // Fetch sessions on mount
  useEffect(() => {
    fetchSessions();
  }, []);

  return {
    sessions,
    loading,
    error,
    usingMockData,
    refreshSessions: () => fetchSessions(true),
    registerForSession,
  };
};

export default useFoundationClassSessions;
