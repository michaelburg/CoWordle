import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === "production" ? "/CoWordle/" : "/",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3000,
    host: "0.0.0.0",
  },
  build: {
    outDir: "dist",
    sourcemap: false,
  },
});
