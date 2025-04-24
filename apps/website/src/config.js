// Configuration settings for the application
// These can be environment-specific in a production setup

const config = {
  // API settings
  API_URL: "http://localhost:3000",

  // Placeholder images for different content types
  placeholders: {
    default: "/assets/placeholders/default-image.svg",
    sermon: "/assets/placeholders/default-sermon.svg",
    event: "/assets/placeholders/default-event.svg",
    leader: "/assets/placeholders/default-leader.svg",
    cellGroup: "/assets/placeholders/default-cell-group.svg",
    zone: "/assets/placeholders/default-zone.svg",
  },

  // Date formatting options
  dateFormat: {
    display: {
      year: "numeric",
      month: "long",
      day: "numeric",
    },
  },
};

export default config;
