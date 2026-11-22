import { expect, test } from "@playwright/test"
import AxeBuilder from "@axe-core/playwright"
import { experiences, leadership } from "../lib/portfolio-data"

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem("vibhrav:introduction:v2", "seen"))
})

test("both experience views use every finalized bullet, with visible markers", async ({ page }) => {
  await page.goto("/#experience")
  for (const [index, experience] of experiences.entries()) {
    await expect(page.locator(`#experience-${experience.slug} .experience-bullets li`)).toHaveText(experience.bullets)
    const card = page.locator(".experience-roadmap-card").nth(index)
    await card.locator("summary").click()
    await expect(card.locator(".experience-bullets li")).toHaveText(experience.bullets)
    await expect(card.locator(".experience-bullets")).toHaveCSS("list-style-type", "disc")
    await expect(card.locator(".experience-bullets li").first()).toBeVisible()
  }
})

test("skill marks load, and scroll moves the dimensional toolkit", async ({ page }) => {
  await page.goto("/#skills")
  const model = page.locator(".skills-planetarium-model")
  await model.scrollIntoViewIfNeeded()
  await expect(page.locator(".skills-node .skill-mark")).toHaveCount(8)
  await expect.poll(() => page.locator("#skills img").evaluateAll(images => images.every(image => (image as HTMLImageElement).complete && (image as HTMLImageElement).naturalWidth > 0))).toBe(true)
  const before = await model.evaluate(el => getComputedStyle(el).transform)
  await page.evaluate(() => scrollBy(0, 250))
  await expect.poll(() => model.evaluate(el => getComputedStyle(el).transform)).not.toBe(before)
})

test("leadership preserves approved copy and direct links select the dimensional stage", async ({ page }) => {
  await page.goto("/#leadership")
  for (const [index, role] of leadership.entries()) {
    await expect(page.locator(`#leadership-role-${index} .leadership-bullets li`)).toHaveText(role.bullets)
    await expect(page.locator(`#leadership-role-${index} .leadership-bullets`)).toHaveCSS("list-style-type", "disc")
  }
  await page.getByRole("navigation", { name: "Leadership roles" }).getByRole("link", { name: "Badger VC", exact: true }).click()
  await expect(page).toHaveURL(/#leadership-role-1$/)
  await expect(page.locator(".leadership-plane--front > span")).toHaveText("15+")
  await expect(page.locator(".leadership-navigation a").nth(1)).toHaveAttribute("aria-current", "location")
})

test("motion is enabled by default, device preference works, and footer uses a gold vector arrow", async ({ page }) => {
  await page.goto("/#skills")
  await expect(page.locator(".motion-toggle")).toHaveCount(0)
  await expect(page.locator(".cinematic-page")).toHaveAttribute("data-motion", "playing")
  await expect(page.locator(".footer-invitation svg")).toHaveCount(1)
  await expect(page.locator(".footer-invitation svg")).toHaveCSS("color", "rgb(198, 165, 108)")
  await expect(page.locator(".footer-invitation")).not.toContainText("↗")
  await page.emulateMedia({ reducedMotion: "reduce" })
  await expect(page.locator(".skills-planetarium-model")).toHaveCSS("transform", "none")
  await expect(page.locator(".leadership-sculpture")).toHaveCSS("transform", "none")
  await expect(page.locator("[data-leadership-role]")).toHaveCount(5)
})

for (const width of [320, 390, 768, 1440]) {
  test(`refined chapters fit and remain accessible at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.goto("/#skills")
    await page.emulateMedia({ reducedMotion: "reduce" })
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    const result = await new AxeBuilder({ page }).include("#skills").include("#leadership").withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze()
    expect(result.violations).toEqual([])
  })
}

test("no JavaScript retains contribution disclosures, skills and all leadership roles", async ({ browser }, testInfo) => {
  const context = await browser.newContext({ javaScriptEnabled: false, reducedMotion: "reduce" })
  const page = await context.newPage()
  await page.goto(testInfo.project.use.baseURL!)
  await page.locator(".experience-roadmap-details summary").first().click()
  await expect(page.locator(".experience-roadmap-details .experience-bullets li").first()).toBeVisible()
  await expect(page.locator("[data-leadership-role]")).toHaveCount(5)
  await expect(page.locator(".skills-group")).toHaveCount(4)
  await context.close()
})
