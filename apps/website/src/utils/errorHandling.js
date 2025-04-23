/**
 * Utility functions for error handling throughout the application
 */

/**
 * Safely stringify an error object for logging or display
 * @param {Error|any} error - The error to stringify
 * @returns {string} A string representation of the error
 */
export const stringifyError = (error) => {
  if (!error) return 'Unknown error';
  
  if (error instanceof Error) {
    return `${error.name}: ${error.message}${error.stack ? `\n${error.stack}` : ''}`;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  try {
    return JSON.stringify(error, null, 2);
  } catch (e) {
    return String(error);
  }
};

/**
 * Safely extract a message from an error object
 * @param {Error|any} error - The error to extract a message from
 * @returns {string} The error message
 */
export const getErrorMessage = (error) => {
  if (!error) return 'An unknown error occurred';
  
  if (error instanceof Error) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  if (error.message && typeof error.message === 'string') {
    return error.message;
  }
  
  try {
    return JSON.stringify(error);
  } catch (e) {
    return String(error);
  }
};

/**
 * Log an error with consistent formatting
 * @param {string} context - The context where the error occurred
 * @param {Error|any} error - The error to log
 * @param {Object} [additionalInfo] - Additional information to log
 */
export const logError = (context, error, additionalInfo = {}) => {
  console.error(`[${context}] Error:`, getErrorMessage(error));
  
  if (process.env.NODE_ENV === 'development') {
    console.debug(`[${context}] Error details:`, {
      error,
      ...additionalInfo
    });
  }
};

/**
 * Create a safe version of a function that catches and handles errors
 * @param {Function} fn - The function to make safe
 * @param {Function} [errorHandler] - Optional custom error handler
 * @returns {Function} A wrapped version of the function that catches errors
 */
export const createSafeFunction = (fn, errorHandler) => {
  return (...args) => {
    try {
      return fn(...args);
    } catch (error) {
      if (errorHandler) {
        return errorHandler(error);
      }
      
      logError('SafeFunction', error, { args });
      return undefined;
    }
  };
};

/**
 * Safely parse JSON with error handling
 * @param {string} jsonString - The JSON string to parse
 * @param {any} defaultValue - The default value to return if parsing fails
 * @returns {any} The parsed JSON or the default value
 */
export const safeJsonParse = (jsonString, defaultValue = {}) => {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    logError('safeJsonParse', error, { jsonString });
    return defaultValue;
  }
};

/**
 * Safely access a nested property in an object
 * @param {Object} obj - The object to access
 * @param {string} path - The path to the property (e.g., 'user.profile.name')
 * @param {any} defaultValue - The default value to return if the property doesn't exist
 * @returns {any} The property value or the default value
 */
export const safeGet = (obj, path, defaultValue = undefined) => {
  try {
    const keys = path.split('.');
    let result = obj;
    
    for (const key of keys) {
      if (result === null || result === undefined) {
        return defaultValue;
      }
      result = result[key];
    }
    
    return result === undefined ? defaultValue : result;
  } catch (error) {
    logError('safeGet', error, { obj, path });
    return defaultValue;
  }
};
