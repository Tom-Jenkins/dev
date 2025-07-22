import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";

// https://vite.dev/config/
export default defineConfig({
  root: resolve(__dirname), // ensures Vite treats this folder as root
  base: "./",
  plugins: [react(), tailwindcss()],
  build: {
    outDir: resolve(__dirname, "../dist/CRU-Timeseries"),
    emptyOutDir: true,
  },
});
