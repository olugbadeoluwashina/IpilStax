// src/frontend/vite.config.ts
import { defineConfig } from "vite";
import deno from "deno/vite-plugin";
import react from "vitejs/plugin-react";

export default defineConfig({
  plugins: [react(), deno()],
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },
    },
  },
});