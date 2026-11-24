/**
 * Browser (end-to-end) tests: build the site, serve it locally, and drive it
 * with a headless Chromium. Files are named *.e2e.ts so Vitest ignores them.
 */
import { defineConfig, devices } from "@playwright/test";

const PORT = 4322; // not 4321, so it can run next to `npm run dev`

export default defineConfig({
  testDir: "e2e",
  testMatch: "**/*.e2e.ts",
  use: { baseURL: `http://localhost:${PORT}` },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
  webServer: {
    command: `npm run build && npx astro preview --port ${PORT} --ignore-lock`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
  },
});
