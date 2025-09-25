// Resource-related API functions
import { fetchData, postData, updateData, deleteData } from './core';

/**
 * Get all resources with optional filtering
 * @param {Object} filters - Filter options
 * @param {string} filters.category - Resource category
 * @param {string} filters.type - Resource type
 * @param {boolean} filters.active - Active status
 * @returns {Promise<Array>} Promise resolving to array of resources
 */
export const getResources = (filters = {}) => {
  const params = new URLSearchParams();
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.append(key, value);
    }
  });
  
  const queryString = params.toString();
  return fetchData(`api/resources${queryString ? `?${queryString}` : ''}`);
};

/**
 * Get resources by category (specifically for audio sermons)
 * @param {string} category - Resource category ('audio_sermons', 'foundation', etc.)
 * @returns {Promise<Array>} Promise resolving to array of resources
 */
export const getResourcesByCategory = (category) => {
  return fetchData(`api/resources?category=${category}&active=true`);
};

/**
 * Get audio sermons specifically
 * @returns {Promise<Array>} Promise resolving to array of audio sermon resources
 */
export const getAudioSermons = () => {
  return getResourcesByCategory('audio_sermons');
};

/**
 * Get foundation class resources
 * @param {string} classId - Optional specific class ID
 * @returns {Promise<Array>} Promise resolving to array of foundation resources
 */
export const getFoundationResources = (classId = null) => {
  const filters = { category: 'foundation' };
  if (classId) {
    filters.classId = classId;
  }
  return getResources(filters);
};

/**
 * Get a resource by ID
 * @param {string} id - Resource ID
 * @returns {Promise<Object>} Promise resolving to resource object
 */
export const getResourceById = (id) => fetchData(`api/resources/${id}`);

/**
 * Create a new resource
 * @param {Object} resourceData - Resource data
 * @returns {Promise<Object>} Promise resolving to created resource
 */
export const createResource = (resourceData) => {
  return postData('api/resources', resourceData);
};

/**
 * Update a resource
 * @param {string} id - Resource ID
 * @param {Object} resourceData - Updated resource data
 * @returns {Promise<Object>} Promise resolving to updated resource
 */
export const updateResource = (id, resourceData) => {
  return updateData('api/resources', id, resourceData);
};

/**
 * Delete a resource
 * @param {string} id - Resource ID
 * @returns {Promise<void>} Promise resolving when deletion is complete
 */
export const deleteResource = (id) => {
  return deleteData('api/resources', id);
};

/**
 * Upload a resource file
 * @param {FormData} formData - Form data containing file and metadata
 * @returns {Promise<Object>} Promise resolving to upload response
 */
export const uploadResourceFile = async (formData) => {
  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3000'}/api/upload-resource`, {
      method: 'POST',
      headers: {
        // Don't set Content-Type for FormData, let browser set it with boundary
        'Authorization': localStorage.getItem('token') ? `Bearer ${localStorage.getItem('token')}` : '',
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error uploading resource file:', error);
    throw error;
  }
};

/**
 * Increment download count for a resource
 * @param {string} id - Resource ID
 * @returns {Promise<void>} Promise resolving when increment is complete
 */
export const incrementDownloadCount = (id) => {
  return postData(`api/resources/${id}/download`, {});
};

/**
 * Increment view count for a resource
 * @param {string} id - Resource ID
 * @returns {Promise<void>} Promise resolving when increment is complete
 */
export const incrementViewCount = (id) => {
  return postData(`api/resources/${id}/view`, {});
};

/**
 * Get resource statistics
 * @returns {Promise<Object>} Promise resolving to resource statistics
 */
export const getResourceStats = () => {
  return fetchData('api/resources/stats');
};

/**
 * Search resources
 * @param {string} query - Search query
 * @param {Object} filters - Additional filters
 * @returns {Promise<Array>} Promise resolving to array of matching resources
 */
export const searchResources = (query, filters = {}) => {
  const params = new URLSearchParams({ search: query });
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.append(key, value);
    }
  });
  
  return fetchData(`api/resources/search?${params.toString()}`);
};

/**
 * Toggle featured status of a resource
 * @param {string} id - Resource ID
 * @param {boolean} featured - Featured status
 * @returns {Promise<Object>} Promise resolving to updated resource
 */
export const toggleResourceFeatured = (id, featured) => {
  return updateData('api/resources', id, { featured });
};

/**
 * Toggle active status of a resource
 * @param {string} id - Resource ID
 * @param {boolean} active - Active status
 * @returns {Promise<Object>} Promise resolving to updated resource
 */
export const toggleResourceActive = (id, active) => {
  return updateData('api/resources', id, { active });
};
