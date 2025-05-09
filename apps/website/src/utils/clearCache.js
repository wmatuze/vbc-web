/**
 * Utility function to clear the foundation class sessions cache
 */
export const clearFoundationClassSessionsCache = () => {
  try {
    localStorage.removeItem('foundation_class_sessions');
    localStorage.removeItem('foundation_class_sessions_last_fetched');
    console.log('Foundation class sessions cache cleared');
    return true;
  } catch (error) {
    console.error('Error clearing foundation class sessions cache:', error);
    return false;
  }
};

/**
 * Utility function to clear all caches
 */
export const clearAllCaches = () => {
  try {
    // Clear foundation class sessions cache
    localStorage.removeItem('foundation_class_sessions');
    localStorage.removeItem('foundation_class_sessions_last_fetched');
    
    // Clear other caches if needed
    // ...
    
    console.log('All caches cleared');
    return true;
  } catch (error) {
    console.error('Error clearing caches:', error);
    return false;
  }
};
