import { defineConfig } from "vite";

export default defineConfig({
  base: "/mm-games/",
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },
});
