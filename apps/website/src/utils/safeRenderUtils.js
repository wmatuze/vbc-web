/**
 * Safely converts a value to a string for rendering in React
 * Prevents "Objects are not valid as a React child" errors
 * 
 * @param {any} value - The value to convert to a string
 * @param {string} fallback - Optional fallback string if value is an object
 * @returns {string} A string representation of the value
 */
export const safeRenderValue = (value, fallback = 'N/A') => {
  if (value === null || value === undefined) {
    return fallback;
  }
  
  if (typeof value === 'object') {
    try {
      // Try to convert to JSON string
      return JSON.stringify(value);
    } catch (e) {
      console.warn('Failed to stringify object for rendering:', e);
      return fallback;
    }
  }
  
  // For primitive values, convert to string
  return String(value);
};

/**
 * Safely processes an object to ensure all properties are safe for rendering
 * 
 * @param {Object} obj - The object to process
 * @returns {Object} A new object with all properties safe for rendering
 */
export const safeRenderObject = (obj) => {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }
  
  const result = {};
  
  Object.keys(obj).forEach(key => {
    const value = obj[key];
    
    if (value === null || value === undefined) {
      result[key] = '';
    } else if (typeof value === 'object' && !Array.isArray(value)) {
      // For nested objects, convert to string to prevent rendering issues
      result[key] = JSON.stringify(value);
    } else if (Array.isArray(value)) {
      // For arrays, process each item
      result[key] = value.map(item => 
        typeof item === 'object' ? JSON.stringify(item) : item
      );
    } else {
      // For primitive values, keep as is
      result[key] = value;
    }
  });
  
  return result;
};
