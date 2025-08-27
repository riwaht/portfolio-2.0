import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/",
  server: {
    host: "0.0.0.0", // Allow access from any IP
    port: 5173, // Ensure this matches the port you're trying to access
    strictPort: true, // Ensure it fails if the port is already in use
    // Enable history API fallback for client-side routing
    historyApiFallback: true,
  },
  // Also configure for production builds
  build: {
    rollupOptions: {
      // Ensure proper handling of client-side routes in production
      input: {
        main: '/index.html',
      },
    },
  },
});
