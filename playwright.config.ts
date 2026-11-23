import { defineConfig } from "@playwright/test"

const port = process.env.PORTFOLIO_TEST_PORT || "4310"
const baseURL = `http://127.0.0.1:${port}`

export default defineConfig({
  testDir: "./tests",
  testMatch: "**/*.spec.ts",
  fullyParallel: false,
  workers: 1,
  timeout: 30_000,
  reporter: "list",
  outputDir: ".artifacts/playwright",
  use: {
    baseURL,
    channel: "chrome",
    headless: true,
    screenshot: "only-on-failure",
  },
  webServer: {
    command: `npm run ${process.env.CI ? "start" : "dev"} -- --hostname 127.0.0.1 --port ${port}`,
    url: `${baseURL}/cinematic`,
    reuseExistingServer: !process.env.CI,
    timeout: 90_000,
  },
})
