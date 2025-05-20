// Re-export all API functions for backward compatibility
// This file ensures that existing imports continue to work
// while we transition to a more modular structure

// Import from the original api.js file to maintain backward compatibility
import * as originalApi from "../api";

// Re-export everything from the original api.js
export * from "../api";

// As we gradually migrate to the new structure, we're enabling these exports
// and updating the imports in components to use the new modules

// Core utilities
export * from "./core";

// Authentication
export * from "./auth";

// Domain-specific modules
export * from "./foundation-classes";
export * from "./sermons";
export * from "./events";
export * from "./leaders";
export * from "./cell-groups";
export * from "./zones";
export * from "./media";
export * from "./uploads";
export * from "./requests";

// This approach ensures that existing code continues to work
// while we gradually refactor the API service
