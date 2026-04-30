import { defineConfig } from "@playwright/test";
import path from "path";

const authFile = path.join(__dirname, "tests/.auth/user.json");

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 30000,
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: true,
  },
  use: {
    baseURL: "http://localhost:3000",
  },
  projects: [
    {
      name: "setup",
      testMatch: /auth\.setup\.ts/,
    },
    {
      name: "e2e",
      dependencies: ["setup"],
      use: {
        // All e2e tests start with the seeded logged-in session
        storageState: authFile,
      },
    },
  ],
});