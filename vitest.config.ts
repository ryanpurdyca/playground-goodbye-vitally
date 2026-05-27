import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    css: true,
    exclude: ["node_modules", ".next", "e2e", "playwright-report", "test-results"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      exclude: ["**/*.config.*", "**/.next/**", "e2e/**", "src/app/layout.tsx"],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
