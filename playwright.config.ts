import { defineConfig, devices } from "@playwright/test";

// Smoke tests (docs/04-architecture.md, Testing): against a production build served by
// `next start`, on a desktop and a phone viewport. Run `npm run build` first, then
// `npm run test:e2e`. PLAYWRIGHT_CHROMIUM points at a local Chromium when Playwright's own is
// not installed (CI installs it).

const PORT = 3200;
const executablePath = process.env.PLAYWRIGHT_CHROMIUM || undefined;

export default defineConfig({
  testDir: "e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["list"]] : "list",
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "retain-on-failure",
    launchOptions: { executablePath },
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    {
      name: "phone",
      use: {
        ...devices["Pixel 7"],
        launchOptions: { executablePath },
      },
    },
  ],
  webServer: {
    command: `npx next start -p ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
