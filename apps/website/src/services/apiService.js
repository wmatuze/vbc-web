import axios from 'axios';
import { getApiUrl, getAuthHeaders } from './config';

/**
 * API Service for handling requests related to membership and foundation classes
 */
class ApiService {
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
      response => response,
      error => {
        // Handle 401 unauthorized errors - could trigger logout
        if (error.response && error.response.status === 401) {
          console.error('Authentication error - user might need to log in again');
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
      const response = await axios.get('/api/membership/renewals', {
        headers: getAuthHeaders()
      });
      
      return response.data;
    } catch (error) {
      console.error('Failed to fetch membership renewals:', error);
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
        headers: getAuthHeaders()
      });
      
      return response.data;
    } catch (error) {
      console.error('Failed to fetch membership renewal:', error);
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
      const response = await axios.get('/api/foundation-classes/registrations', {
        headers: getAuthHeaders()
      });
      
      return response.data;
    } catch (error) {
      console.error('Failed to fetch foundation class registrations:', error);
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
      const axios = this.getAxiosInstance();
      const response = await axios.put(
        `/api/foundation-classes/registrations/${id}`,
        { status },
        { headers: getAuthHeaders() }
      );
      
      return response.data;
    } catch (error) {
      console.error(`Failed to update foundation class status to ${status}:`, error);
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
      const response = await axios.get(`/api/foundation-classes/registrations/${id}`, {
        headers: getAuthHeaders()
      });
      
      return response.data;
    } catch (error) {
      console.error('Failed to fetch foundation class registration:', error);
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
      const response = await axios.get('/api/export/members/approved', {
        headers: getAuthHeaders(),
        responseType: 'blob' // Important for file downloading
      });
      
      return response.data;
    } catch (error) {
      console.error('Failed to export approved members:', error);
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
      const response = await axios.get('/api/export/foundation-classes/completed', {
        headers: getAuthHeaders(),
        responseType: 'blob' // Important for file downloading
      });
      
      return response.data;
    } catch (error) {
      console.error('Failed to export foundation class graduates:', error);
      throw error;
    }
  }
}

export default ApiService; 