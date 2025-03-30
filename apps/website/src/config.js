// Configuration settings for the application
// These can be environment-specific in a production setup

const config = {
  // API settings
  API_URL: 'http://localhost:3000',
  
  // Other global settings can be added here
  defaultImagePlaceholder: '/assets/placeholders/default-image.jpg',
  
  // Date formatting options
  dateFormat: {
    display: {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }
  }
};

export default config;
