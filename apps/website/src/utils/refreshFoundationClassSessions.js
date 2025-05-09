/**
 * Utility function to force refresh foundation class sessions
 */
import { FoundationClassSessionService } from '../services/foundationClassSessionService';

export const refreshFoundationClassSessions = async () => {
  try {
    console.log('Force refreshing foundation class sessions...');
    
    // Clear the cache first
    FoundationClassSessionService.clearCache();
    
    // Fetch fresh data from API with forceRefresh option
    const sessions = await FoundationClassSessionService.getSessions({
      forceRefresh: true,
      useMockOnFailure: false // Don't use mock data if API fails
    });
    
    console.log(`Successfully refreshed ${sessions.length} foundation class sessions`);
    return sessions;
  } catch (error) {
    console.error('Error refreshing foundation class sessions:', error);
    throw error;
  }
};
