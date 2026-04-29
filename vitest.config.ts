import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
  environment: "jsdom",
  setupFiles: "./tests/setup.ts",
  globals: true,
  threads: false,
  include: ["tests/unit/**/*.ts", "tests/integration/**/*.tsx"], // ✅ ADD THIS
  exclude: ["tests/e2e/**"],
},
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
});