import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  timeout: 30000,

  use: {
    baseURL: "http://localhost:5173",
    headless: true,
  },

  webServer: {
    command: "VITE_E2E_TEST=true npm run dev",
    url: "http://localhost:5173",
    reuseExistingServer: false,
    timeout: 120000,
  },
});