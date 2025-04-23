import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { logError, getErrorMessage } from '../utils/errorHandling';

/**
 * A custom hook for handling errors in components
 * @param {string} componentName - The name of the component using this hook
 * @returns {Object} - Error handling utilities
 */
export const useErrorHandler = (componentName) => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  /**
   * Handle an error by logging it and updating state
   * @param {Error|any} err - The error to handle
   * @param {string} [context] - Additional context about where the error occurred
   * @param {Object} [additionalInfo] - Additional information about the error
   */
  const handleError = useCallback((err, context = '', additionalInfo = {}) => {
    const fullContext = componentName + (context ? ` (${context})` : '');
    logError(fullContext, err, additionalInfo);
    
    setError(err);
    
    // Show a toast notification with the error message
    toast.error(getErrorMessage(err));
  }, [componentName]);
  
  /**
   * Clear the current error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);
  
  /**
   * Wrap an async function with error handling
   * @param {Function} fn - The async function to wrap
   * @param {Object} options - Options for the wrapped function
   * @param {boolean} [options.showLoading=true] - Whether to show loading state
   * @param {boolean} [options.showSuccess=false] - Whether to show a success toast
   * @param {string} [options.successMessage='Operation completed successfully'] - The success message
   * @param {string} [options.context=''] - Additional context about the operation
   * @returns {Function} - The wrapped function
   */
  const withErrorHandling = useCallback((fn, options = {}) => {
    const {
      showLoading = true,
      showSuccess = false,
      successMessage = 'Operation completed successfully',
      context = '',
    } = options;
    
    return async (...args) => {
      try {
        if (showLoading) {
          setIsLoading(true);
        }
        
        const result = await fn(...args);
        
        if (showSuccess) {
          toast.success(successMessage);
        }
        
        return result;
      } catch (err) {
        handleError(err, context, { args });
        return null;
      } finally {
        if (showLoading) {
          setIsLoading(false);
        }
      }
    };
  }, [handleError]);
  
  return {
    error,
    isLoading,
    handleError,
    clearError,
    withErrorHandling,
    
    // Helper for rendering error state
    errorMessage: error ? getErrorMessage(error) : null,
    hasError: !!error,
  };
};

export default useErrorHandler;
