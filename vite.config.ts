import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [solid(), tailwindcss()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    port: 3000,
    host: "0.0.0.0",
    strictPort: true,
    // Allow the sandbox gateway host (and any other) to reach the dev server.
    allowedHosts: true,
    fs: {
      // Avoid Vite scanning skills/examples/etc. for deps
      allow: [fileURLToPath(new URL(".", import.meta.url))],
    },
  },
  preview: {
    port: 3000,
    host: "0.0.0.0",
    strictPort: true,
    allowedHosts: true,
  },
  build: {
    target: "esnext",
    outDir: "dist",
    sourcemap: false,
  },
  optimizeDeps: {
    // Only scan the real app entry; ignore skills/examples/etc.
    entries: ["index.html"],
  },
});
