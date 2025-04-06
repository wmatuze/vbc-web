# Services Directory

This directory contains service modules that handle API calls and other external services.

## Services Overview

### `api.js`
- General-purpose API service for the application
- Handles various API endpoints (sermons, events, leaders, media, etc.)
- Uses the native `fetch` API for HTTP requests
- Used by most components throughout the application

### `requestsService.js`
- Specialized service for membership renewals and foundation class enrollments
- Used specifically by the `RequestsManager` component
- Uses `axios` for HTTP requests
- Handles operations related to user requests, approvals, and exports

### `notificationService.js`
- Handles sending notifications to users
- Provides methods for different types of notifications:
  - Membership renewal approvals/rejections
  - Foundation class enrollments/completions
- Used by the `RequestsManager` component

### `config.js`
- Configuration service with environment variable handling
- Provides utility functions for API URLs and authentication headers
- Used by other services to maintain consistent configuration

## Best Practices

1. **Service Responsibility**: Each service should have a clear and focused responsibility.
2. **Error Handling**: All API calls should include proper error handling.
3. **Authentication**: Use the `getAuthHeaders()` function from `config.js` for authenticated requests.
4. **Environment Variables**: Access environment variables through the config service rather than directly. 