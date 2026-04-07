import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/",
  build: {
    sourcemap: false,
    assetsDir: "assets",
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React runtime - changes rarely, cached longest
          "vendor-react": ["react", "react-dom", "react-router-dom"],
          // Animation library
          "vendor-motion": ["framer-motion"],
          // Icon libraries
          "vendor-icons": ["lucide-react", "@heroicons/react"],
          // Data fetching
          "vendor-query": ["@tanstack/react-query"],
          // Remaining UI libs
          "vendor-misc": [
            "react-helmet-async",
            "react-lazy-load-image-component",
            "react-toastify",
          ],
        },
      },
    },
  },
  server: {
    port: 5173,
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin",
    },
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
