import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"

export default defineConfig({
  plugins: [ react( ) ],
  server: {
    proxy: {
      "/api": {
        target: process.env.API_URL || "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
})
