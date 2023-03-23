import { defineConfig } from "vite"
import backend from "./server/index.js"
import react from "@vitejs/plugin-react"

// https://vitejs.dev/config/
export default defineConfig({

    plugins: [
        react(),
        backend()
    ],

})
