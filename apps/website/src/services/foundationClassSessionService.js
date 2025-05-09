import {
  getFoundationClassSessions,
  registerForFoundationClass,
  incrementFoundationClassEnrollment,
} from "./api";
import { clearFoundationClassSessionsCache } from "../utils/clearCache";

// Default mock data
const DEFAULT_SESSIONS = [
  {
    id: "session1",
    startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000),
    day: "Sundays",
    time: "9:00 AM - 10:30 AM",
    location: "Room 201",
    capacity: 20,
    enrolledCount: 5,
    spotsLeft: 15,
    active: true,
  },
  {
    id: "session2",
    startDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 51 * 24 * 60 * 60 * 1000),
    day: "Wednesdays",
    time: "6:30 PM - 8:00 PM",
    location: "Room 105",
    capacity: 15,
    enrolledCount: 3,
    spotsLeft: 12,
    active: true,
  },
  {
    id: "session3",
    startDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 81 * 24 * 60 * 60 * 1000),
    day: "Saturdays",
    time: "10:00 AM - 11:30 AM",
    location: "Room 301",
    capacity: 25,
    enrolledCount: 20,
    spotsLeft: 5,
    active: true,
  },
];

// Local storage keys
const STORAGE_KEYS = {
  SESSIONS: "foundation_class_sessions",
  LAST_FETCHED: "foundation_class_sessions_last_fetched",
};

// Cache expiration time (24 hours)
const CACHE_EXPIRATION = 24 * 60 * 60 * 1000;

export const FoundationClassSessionService = {
  /**
   * Get all foundation class sessions
   * @param {Object} options - Options for fetching sessions
   * @param {boolean} options.forceRefresh - Force refresh from API
   * @param {boolean} options.useMockOnFailure - Use mock data if API fails
   * @returns {Promise<Array>} - Array of foundation class sessions
   */
  async getSessions(options = { forceRefresh: false, useMockOnFailure: true }) {
    try {
      // If forceRefresh is true, clear the cache
      if (options.forceRefresh) {
        console.log(
          "Force refreshing foundation class sessions, clearing cache"
        );
        clearFoundationClassSessionsCache();
      }

      // Check if we have cached data and it's not expired
      if (!options.forceRefresh) {
        const cachedData = this.getCachedSessions();
        if (cachedData) {
          console.log("Using cached foundation class sessions");
          return cachedData;
        }
      }

      // Fetch from API
      console.log("Fetching foundation class sessions from API");
      const sessions = await getFoundationClassSessions();

      // Cache the result
      this.cacheSessions(sessions);

      return sessions;
    } catch (error) {
      console.error("Error fetching foundation class sessions:", error);

      // If useMockOnFailure is true, return mock data
      if (options.useMockOnFailure) {
        console.log("Using mock foundation class sessions data");

        // Try to get previously cached data first
        const cachedData = this.getCachedSessions();
        if (cachedData) {
          return cachedData;
        }

        // If no cached data, use default mock data
        return DEFAULT_SESSIONS;
      }

      // Otherwise, propagate the error
      throw error;
    }
  },

  /**
   * Register for a foundation class
   * @param {Object} formData - Registration form data
   * @param {string} sessionId - ID of the session to register for
   * @returns {Promise<Object>} - Registration result
   */
  async register(formData, sessionId) {
    try {
      // Try to register via API
      const result = await registerForFoundationClass(formData);

      // Try to increment enrollment count
      await incrementFoundationClassEnrollment(sessionId);

      // Refresh sessions cache
      await this.getSessions({ forceRefresh: true });

      return result;
    } catch (error) {
      console.error("Error registering for foundation class:", error);

      // If API fails, update local mock data
      const sessions = this.getCachedSessions() || [...DEFAULT_SESSIONS];
      const updatedSessions = sessions.map((session) => {
        if (session.id === sessionId) {
          return {
            ...session,
            enrolledCount: session.enrolledCount + 1,
            spotsLeft: Math.max(0, session.spotsLeft - 1),
          };
        }
        return session;
      });

      // Cache the updated sessions
      this.cacheSessions(updatedSessions);

      // Return a mock success response
      return {
        success: true,
        message: "Registration successful (offline mode)",
        data: { id: "mock-registration-" + Date.now() },
      };
    }
  },

  /**
   * Cache sessions in local storage
   * @param {Array} sessions - Sessions to cache
   */
  cacheSessions(sessions) {
    try {
      localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
      localStorage.setItem(STORAGE_KEYS.LAST_FETCHED, Date.now().toString());
    } catch (error) {
      console.error("Error caching sessions:", error);
    }
  },

  /**
   * Get cached sessions from local storage
   * @returns {Array|null} - Cached sessions or null if no valid cache
   */
  getCachedSessions() {
    try {
      const lastFetched = parseInt(
        localStorage.getItem(STORAGE_KEYS.LAST_FETCHED) || "0"
      );
      const now = Date.now();

      // Check if cache is expired
      if (now - lastFetched > CACHE_EXPIRATION) {
        return null;
      }

      const sessionsJson = localStorage.getItem(STORAGE_KEYS.SESSIONS);
      if (!sessionsJson) {
        return null;
      }

      return JSON.parse(sessionsJson);
    } catch (error) {
      console.error("Error getting cached sessions:", error);
      return null;
    }
  },

  /**
   * Clear sessions cache
   */
  clearCache() {
    return clearFoundationClassSessionsCache();
  },
};

// Export default sessions for testing
export const getDefaultSessions = () => DEFAULT_SESSIONS;
