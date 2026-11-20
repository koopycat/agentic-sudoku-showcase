import { existsSync } from "node:fs";
import { chromium, defineConfig, devices } from "@playwright/test";

const hasBundledChromium = (() => {
  try {
    return existsSync(chromium.executablePath());
  } catch {
    return false;
  }
})();

const chromiumChannel = hasBundledChromium ? "chromium" : "chrome";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [["html", { open: "never" }], ["list"]],
  use: {
    baseURL: "http://127.0.0.1:4173",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"], channel: chromiumChannel },
    },
  ],
  webServer: {
    command: "corepack pnpm preview --host 127.0.0.1",
    url: "http://127.0.0.1:4173",
    reuseExistingServer: !process.env.CI,
  },
});