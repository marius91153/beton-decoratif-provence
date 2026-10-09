import { defineConfig } from "@playwright/test";
import { existsSync } from "node:fs";

const executablePath =
  process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ||
  (existsSync("/usr/bin/chromium") ? "/usr/bin/chromium" : undefined);

export default defineConfig({
  testDir: "./tests",
  testMatch: process.env.PAGES_TEST
    ? ["**/pages.spec.js", "**/scroll.spec.js", "**/seo.spec.js", "**/theme.spec.js"]
    : ["**/site.spec.js", "**/scroll.spec.js", "**/seo.spec.js", "**/theme.spec.js"],
  fullyParallel: true,
  workers: 2,
  reporter: "list",
  use: {
    baseURL: process.env.PAGES_TEST
      ? "http://127.0.0.1:4173/beton-decoratif-provence/"
      : "http://127.0.0.1:4173",
    browserName: "chromium",
    launchOptions: { executablePath },
    trace: "retain-on-failure",
  },
  projects: [
    { name: "desktop", use: { viewport: { width: 1440, height: 1000 } } },
    {
      name: "mobile",
      use: {
        viewport: { width: 390, height: 844 },
        isMobile: true,
        hasTouch: true,
      },
    },
  ],
  webServer: {
    command: process.env.PAGES_TEST
      ? "npm run preview -- --mode pages --port 4173 --strictPort"
      : "npm run preview -- --port 4173 --strictPort",
    url: process.env.PAGES_TEST
      ? "http://127.0.0.1:4173/beton-decoratif-provence/"
      : "http://127.0.0.1:4173",
    reuseExistingServer: false,
  },
});
