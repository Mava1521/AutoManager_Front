// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  server: {
    proxy: {
      // Todas las rutas /api/* se redirigen al backend FastAPI en desarrollo.
      // Sin esto, fetch("/api/support/contact") va al puerto de Vite (5173)
      // en lugar del backend (8000) y devuelve 404.
      "/api": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
      },
    },
  },
});