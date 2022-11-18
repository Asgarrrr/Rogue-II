import { defineConfig } from "vite"
import backend from "./api.mjs"
import react from "@vitejs/plugin-react"

// https://vitejs.dev/config/
export default defineConfig({

    plugins: [
        react(),
    ]
})