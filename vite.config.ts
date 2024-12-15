import { defineConfig } from "vite";
import livePreview from "vite-live-preview";
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    livePreview({
      reload: true,
    }),
    react()
  ],
  base: '/penpot-ai-ollama',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        plugin: "src/plugin.ts",
        index: "./index.html",
      },
      output: {
        entryFileNames: "[name].js",
      },
    },
  },
  preview: {
    port: 4400,
  },
});
