# API Service Module

This directory contains a modular implementation of the API service for the Victory Bible Church CMS. The code has been refactored from a single large file into domain-specific modules for better maintainability and organization.

## Structure

- `index.js` - Re-exports all API functions for backward compatibility
- `core.js` - Core HTTP utilities and authentication helpers
- `auth.js` - Authentication-related functions
- `foundation-classes.js` - Foundation class API functions
- `sermons.js` - Sermon API functions
- `events.js` - Events API functions
- `recurring-events.js` - Recurring events API functions (included in events.js)
- `leaders.js` - Leaders API functions
- `cell-groups.js` - Cell group API functions
- `zones.js` - Zones API functions
- `media.js` - Media API functions
- `uploads.js` - File upload functionality
- `requests.js` - Request management functions (event signups, etc.)

## Migration Strategy

The refactoring follows a gradual migration approach to maintain backward compatibility:

1. All functions are still available through the original import path (`../services/api`)
2. New modules can be imported directly for more specific access
3. The `index.js` file re-exports everything from the original api.js file
4. As components are updated to use the new modules, we'll gradually transition to the new structure

## Usage Examples

### Current usage (still supported)

```javascript
import { getSermons, createSermon } from '../services/api';

// Use the functions as before
const sermons = await getSermons();
```

### New modular usage (recommended for new code)

```javascript
import { getSermons, createSermon } from '../services/api/sermons';

// Use the functions directly from the domain module
const sermons = await getSermons();
```

## Benefits of the New Structure

- **Improved maintainability**: Smaller, focused files are easier to understand and modify
- **Better organization**: Clear separation of concerns by domain
- **Easier testing**: Smaller modules are easier to test in isolation
- **Scalability**: New features can be added as new modules without bloating existing files
- **Backward compatibility**: Existing code continues to work through the re-export pattern

## Migration Plan

1. Initially, all imports will continue to use the original path
2. New code should use the domain-specific modules
3. Gradually update existing components to use the new modules
4. Eventually, we can deprecate the original api.js file

## Core Utilities

The `core.js` module provides shared utilities used by all other modules:

- `fetchData` - Generic GET request function
- `postData` - Generic POST request function
- `updateData` - Generic PUT request function
- `deleteData` - Generic DELETE request function
- `getAuthToken` - Get authentication token from localStorage
- `getAuthHeaders` - Get authentication headers for requests
