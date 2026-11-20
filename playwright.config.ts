import { defineConfig } from "@playwright/test"

export default defineConfig({
  testDir: "./tests",
  testMatch: "**/*.spec.ts",
  fullyParallel: false,
  workers: 1,
  timeout: 30_000,
  reporter: "list",
  outputDir: ".artifacts/playwright",
  use: {
    baseURL: "http://127.0.0.1:4310",
    channel: "chrome",
    headless: true,
    screenshot: "only-on-failure",
  },
  webServer: {
    command: process.env.CI ? "npm run start -- --hostname 127.0.0.1 --port 4310" : "npm run dev -- --hostname 127.0.0.1 --port 4310",
    url: "http://127.0.0.1:4310/cinematic",
    reuseExistingServer: !process.env.CI,
    timeout: 90_000,
  },
})
