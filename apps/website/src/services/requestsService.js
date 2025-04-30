import axios from "axios";
import { getApiUrl, getAuthHeaders } from "./config";
import {
  validateMembershipRenewal,
  validateFoundationClassRegistration,
  validateMembershipStatusChange,
  validateFoundationClassStatusChange,
  validateEventSignupRequest,
  validateEventSignupStatusChange,
} from "../utils/requestsValidation";

/**
 * Requests Service for handling API requests related to membership, foundation classes, and event sign-up requests
 */
class RequestsService {
  /**
   * Create an axios instance with default config
   * @returns {Object} Configured axios instance
   */
  static getAxiosInstance() {
    const instance = axios.create({
      baseURL: getApiUrl(),
      timeout: 30000,
    });

    // Add response interceptor for error handling
    instance.interceptors.response.use(
      (response) => response,
      (error) => {
        // Handle 401 unauthorized errors - could trigger logout
        if (error.response && error.response.status === 401) {
          console.error(
            "Authentication error - user might need to log in again"
          );
          // Could redirect to login or dispatch an action to logout
        }

        return Promise.reject(error);
      }
    );

    return instance;
  }

  /* MEMBERSHIP RENEWALS API */

  /**
   * Fetch all membership renewals
   * @returns {Promise} Promise that resolves to array of renewals
   */
  static async getMembershipRenewals() {
    try {
      const axios = this.getAxiosInstance();
      const response = await axios.get("/api/membership/renewals", {
        headers: getAuthHeaders(),
      });

      return response.data;
    } catch (error) {
      console.error("Failed to fetch membership renewals:", error);
      throw error;
    }
  }

  /**
   * Update the status of a membership renewal
   * @param {String} id - The renewal ID
   * @param {String} status - The new status (pending, approved, declined)
   * @returns {Promise} Promise that resolves to updated renewal
   */
  static async updateMembershipRenewalStatus(id, status) {
    try {
      // Validate the status value
      const { isValid, error } = validateMembershipStatusChange(status);
      if (!isValid) {
        throw new Error(`Validation error: ${error}`);
      }

      const axios = this.getAxiosInstance();
      const response = await axios.put(
        `/api/membership/renewals/${id}`,
        { status },
        { headers: getAuthHeaders() }
      );

      return response.data;
    } catch (error) {
      console.error(`Failed to update renewal status to ${status}:`, error);
      throw error;
    }
  }

  /**
   * Get a single membership renewal by ID
   * @param {String} id - The renewal ID
   * @returns {Promise} Promise that resolves to renewal object
   */
  static async getMembershipRenewal(id) {
    try {
      const axios = this.getAxiosInstance();
      const response = await axios.get(`/api/membership/renewals/${id}`, {
        headers: getAuthHeaders(),
      });

      return response.data;
    } catch (error) {
      console.error("Failed to fetch membership renewal:", error);
      throw error;
    }
  }

  /* FOUNDATION CLASS REGISTRATION API */

  /**
   * Fetch all foundation class registrations
   * @returns {Promise} Promise that resolves to array of registrations
   */
  static async getFoundationClassRegistrations() {
    try {
      const axios = this.getAxiosInstance();
      const response = await axios.get(
        "/api/foundation-classes/registrations",
        {
          headers: getAuthHeaders(),
        }
      );

      return response.data;
    } catch (error) {
      console.error("Failed to fetch foundation class registrations:", error);
      throw error;
    }
  }

  /**
   * Update the status of a foundation class registration
   * @param {String} id - The registration ID
   * @param {String} status - The new status (registered, attending, completed, cancelled)
   * @returns {Promise} Promise that resolves to updated registration
   */
  static async updateFoundationClassStatus(id, status) {
    try {
      // Validate the status value
      const { isValid, error } = validateFoundationClassStatusChange(status);
      if (!isValid) {
        throw new Error(`Validation error: ${error}`);
      }

      const axios = this.getAxiosInstance();
      const response = await axios.put(
        `/api/foundation-classes/registrations/${id}`,
        { status },
        { headers: getAuthHeaders() }
      );

      return response.data;
    } catch (error) {
      console.error(
        `Failed to update foundation class status to ${status}:`,
        error
      );
      throw error;
    }
  }

  /**
   * Get a single foundation class registration by ID
   * @param {String} id - The registration ID
   * @returns {Promise} Promise that resolves to registration object
   */
  static async getFoundationClassRegistration(id) {
    try {
      const axios = this.getAxiosInstance();
      const response = await axios.get(
        `/api/foundation-classes/registrations/${id}`,
        {
          headers: getAuthHeaders(),
        }
      );

      return response.data;
    } catch (error) {
      console.error("Failed to fetch foundation class registration:", error);
      throw error;
    }
  }

  /* EXPORT FUNCTIONALITY */

  /**
   * Export approved members list as CSV
   * @returns {Promise} Promise that resolves to CSV content
   */
  static async exportApprovedMembers() {
    try {
      const axios = this.getAxiosInstance();
      const response = await axios.get("/api/export/members/approved", {
        headers: getAuthHeaders(),
        responseType: "blob", // Important for file downloading
      });

      return response.data;
    } catch (error) {
      console.error("Failed to export approved members:", error);
      throw error;
    }
  }

  /**
   * Export foundation class graduates as CSV
   * @returns {Promise} Promise that resolves to CSV content
   */
  static async exportFoundationClassGraduates() {
    try {
      const axios = this.getAxiosInstance();
      const response = await axios.get(
        "/api/export/foundation-classes/completed",
        {
          headers: getAuthHeaders(),
          responseType: "blob", // Important for file downloading
        }
      );

      return response.data;
    } catch (error) {
      console.error("Failed to export foundation class graduates:", error);
      throw error;
    }
  }

  /**
   * Delete a membership renewal
   * @param {String} id - The ID of the membership renewal to delete
   * @returns {Promise} - Promise that resolves with the API response
   */
  static async deleteMembershipRenewal(id) {
    try {
      // Validate the ID
      if (!id) {
        throw new Error("Membership renewal ID is required");
      }

      const response = await this.getAxiosInstance().delete(
        `/api/membership/renewals/${id}`,
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error(`Failed to delete membership renewal ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete a foundation class registration
   * @param {String} id - The ID of the foundation class registration to delete
   * @returns {Promise} - Promise that resolves with the API response
   */
  static async deleteFoundationClassRegistration(id) {
    try {
      // Validate the ID
      if (!id) {
        throw new Error("Foundation class registration ID is required");
      }

      const response = await this.getAxiosInstance().delete(
        `/api/foundation-classes/registrations/${id}`,
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error(
        `Failed to delete foundation class registration ${id}:`,
        error
      );
      throw error;
    }
  }

  /* EVENT SIGNUP REQUESTS API */

  /**
   * Fetch all event signup requests
   * @returns {Promise} Promise that resolves to array of event signup requests
   */
  static async getEventSignupRequests() {
    try {
      const axios = this.getAxiosInstance();
      const response = await axios.get("/api/event-signup-requests", {
        headers: getAuthHeaders(),
      });

      return response.data;
    } catch (error) {
      console.error("Failed to fetch event signup requests:", error);
      throw error;
    }
  }

  /**
   * Fetch event signup requests by event type
   * @param {String} eventType - The type of event (baptism, babyDedication, etc.)
   * @returns {Promise} Promise that resolves to array of event signup requests
   */
  static async getEventSignupRequestsByType(eventType) {
    try {
      const axios = this.getAxiosInstance();
      const response = await axios.get(
        `/api/event-signup-requests/type/${eventType}`,
        {
          headers: getAuthHeaders(),
        }
      );

      return response.data;
    } catch (error) {
      console.error(`Failed to fetch ${eventType} signup requests:`, error);
      throw error;
    }
  }

  /**
   * Fetch event signup requests for a specific event
   * @param {String} eventId - The ID of the event
   * @returns {Promise} Promise that resolves to array of event signup requests
   */
  static async getEventSignupRequestsByEvent(eventId) {
    try {
      const axios = this.getAxiosInstance();
      const response = await axios.get(
        `/api/event-signup-requests/event/${eventId}`,
        {
          headers: getAuthHeaders(),
        }
      );

      return response.data;
    } catch (error) {
      console.error(
        `Failed to fetch signup requests for event ${eventId}:`,
        error
      );
      throw error;
    }
  }

  /**
   * Update the status of an event signup request
   * @param {String} id - The request ID
   * @param {String} status - The new status (pending, approved, declined)
   * @returns {Promise} Promise that resolves to updated request
   */
  static async updateEventSignupRequestStatus(id, status) {
    try {
      // Validate the status value
      const { isValid, error } = validateEventSignupStatusChange(status);
      if (!isValid) {
        throw new Error(`Validation error: ${error}`);
      }

      const axios = this.getAxiosInstance();
      const response = await axios.put(
        `/api/event-signup-requests/${id}`,
        { status },
        { headers: getAuthHeaders() }
      );

      return response.data;
    } catch (error) {
      console.error(
        `Failed to update event signup request status to ${status}:`,
        error
      );
      throw error;
    }
  }

  /**
   * Delete an event signup request
   * @param {String} id - The ID of the event signup request to delete
   * @returns {Promise} - Promise that resolves with the API response
   */
  static async deleteEventSignupRequest(id) {
    try {
      // Validate the ID
      if (!id) {
        throw new Error("Event signup request ID is required");
      }

      const response = await this.getAxiosInstance().delete(
        `/api/event-signup-requests/${id}`,
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error(`Failed to delete event signup request ${id}:`, error);
      throw error;
    }
  }

  /**
   * Export approved event signup requests as CSV
   * @param {String} eventType - The type of event (baptism, babyDedication, etc.)
   * @returns {Promise} Promise that resolves to CSV content
   */
  static async exportApprovedEventSignups(eventType) {
    try {
      const axios = this.getAxiosInstance();
      const response = await axios.get(
        `/api/export/event-signups/${eventType}/approved`,
        {
          headers: getAuthHeaders(),
          responseType: "blob", // Important for file downloading
        }
      );

      return response.data;
    } catch (error) {
      console.error(`Failed to export approved ${eventType} signups:`, error);
      throw error;
    }
  }

  /**
   * Delete an event signup request
   * @param {String} id - The ID of the event signup request to delete
   * @returns {Promise} - Promise that resolves with the API response
   */
  static async deleteEventSignupRequest(id) {
    try {
      // Validate the ID
      if (!id) {
        throw new Error("Event signup request ID is required");
      }

      const response = await this.getAxiosInstance().delete(
        `/api/event-signup-requests/${id}`,
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error(`Failed to delete event signup request ${id}:`, error);
      throw error;
    }
  }
}

export default RequestsService;
