import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { chromium } from "@playwright/test";

function hasBundledChromium() {
  try {
    return existsSync(chromium.executablePath());
  } catch {
    return false;
  }
}

if (!hasBundledChromium()) {
  try {
    execFileSync("pnpm", ["exec", "playwright", "install", "chromium"], {
      stdio: "inherit",
    });
  } catch {
    console.warn(
      "Could not install Playwright Chromium; falling back to the system Chrome channel.",
    );
  }
}