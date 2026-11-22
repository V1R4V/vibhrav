import { expect, test } from "@playwright/test"
import AxeBuilder from "@axe-core/playwright"

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem("vibhrav:introduction:v2", "seen"))
  // The creator-hosted model is smoke-tested separately in a real browser.
  // Keep CI deterministic while checking iframe lifecycle and the public source URL.
  await page.route("https://sketchfab.com/models/8e7158c8d6814294a5d688e6a0507af3/embed?**", route => route.fulfill({ contentType: "text/html", body: "<!doctype html><title>Creator viewer fixture</title><canvas aria-label='viewer lifecycle fixture'></canvas>" }))
})

test("football biography preserves its record and loads the creator-hosted model only in view", async ({ page }) => {
  await page.goto("/#football-title")
  const scene = page.locator(".bernabeu-viewer")
  await scene.scrollIntoViewIfNeeded()
  await expect(scene).toHaveAttribute("data-viewer-state", "loaded")
  await expect(scene.locator("iframe")).toHaveCount(1)
  await expect(scene.locator("iframe")).toHaveAttribute("src", /8e7158c8d6814294a5d688e6a0507af3/)
  await expect(page.locator(".bernabeu-credit")).toContainText("nuralam018")
  await expect(page.locator("#football-title")).toHaveText("Football, since seven.")
  await expect(page.locator(".football-story")).toContainText("district and state")
  await expect(page.locator(".football-record")).toContainText("8× Player of the Month")
  await expect(page.locator(".football-record")).toContainText("Asia-Pacific champions (U-15)")
  await expect(page.locator(".football-record")).toContainText("All-India champions (U-18)")
  await expect(page.locator(".football-record")).toContainText("Spring 2024, Spring 2025 and Fall 2025")
  await expect(page.locator("#about")).not.toContainText("Still on the field")
  await expect.poll(() => page.locator(".football-club img").evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0)
  await page.locator(".footer-invitation").scrollIntoViewIfNeeded()
  await expect(scene.locator("iframe")).toHaveCount(0)
  await scene.scrollIntoViewIfNeeded()
  await expect(scene.locator("iframe")).toHaveCount(1)
  await page.emulateMedia({ reducedMotion: "reduce" })
  await expect(scene.locator("iframe")).toHaveCount(0)
  await expect(scene.locator(".bernabeu-viewer-poster")).toHaveCSS("opacity", "1")
  await expect.poll(() => scene.locator("img").evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0)
  await page.emulateMedia({ reducedMotion: "no-preference" })
  await expect(scene).toHaveAttribute("data-viewer-state", "loaded")
})

for (const width of [320, 390, 768, 1440]) {
  test(`football story and stadium fit and remain accessible at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.goto("/#football-title")
    await page.emulateMedia({ reducedMotion: "reduce" })
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    const result = await new AxeBuilder({ page }).include("#about").withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze()
    expect(result.violations).toEqual([])
  })
}

test("football content and captured stadium are readable without JavaScript", async ({ browser }, testInfo) => {
  const context = await browser.newContext({ javaScriptEnabled: false })
  const page = await context.newPage()
  await page.goto(testInfo.project.use.baseURL! + "/#football-title")
  await expect(page.locator(".football-record li")).toHaveCount(5)
  await expect.poll(() => page.locator(".bernabeu-viewer-poster").evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0)
  await expect(page.locator(".bernabeu-viewer iframe")).toHaveCount(0)
  await context.close()
})
