import { expect, test } from "@playwright/test"
import AxeBuilder from "@axe-core/playwright"

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem("vibhrav:introduction:v2", "seen"))
})

test("football biography shows the candidate's record and a live stadium", async ({ page }) => {
  await page.goto("/#football-title")
  const scene = page.locator(".bernabeu-scene")
  await scene.scrollIntoViewIfNeeded()
  await expect(scene).toHaveAttribute("data-scene-state", "ready")
  await expect(scene.locator("canvas")).toHaveCount(1)
  await expect(page.locator("#football-title")).toHaveText("Football, since seven.")
  await expect(page.locator(".football-story")).toContainText("district and state")
  await expect(page.locator(".football-record")).toContainText("8× Player of the Month")
  await expect(page.locator(".football-record")).toContainText("Asia-Pacific champions (U-15)")
  await expect(page.locator(".football-record")).toContainText("All-India champions (U-18)")
  await expect(page.locator(".football-record")).toContainText("Spring 2024, Spring 2025 and Fall 2025")
  await expect(page.locator("#about")).not.toContainText("Still on the field")
  await expect.poll(() => page.locator(".football-club img").evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0)
  await page.emulateMedia({ reducedMotion: "reduce" })
  await expect(scene.locator("canvas")).toHaveCount(0)
  await expect(scene.locator(".bernabeu-poster")).toHaveCSS("opacity", "1")
  await expect.poll(() => scene.locator("img").evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0)
  await page.emulateMedia({ reducedMotion: "no-preference" })
  await expect(scene).toHaveAttribute("data-scene-state", "ready")
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
  await expect.poll(() => page.locator(".bernabeu-poster").evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0)
  await expect(page.locator(".bernabeu-scene canvas")).toHaveCount(0)
  await context.close()
})
