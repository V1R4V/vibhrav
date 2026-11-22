import { expect, test } from "@playwright/test"
import AxeBuilder from "@axe-core/playwright"

test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem("vibhrav:introduction:v2", "seen"))
})

test("touch scrolling drives hero departure and the next chapter covers the stage", async ({ page, context }) => {
  await page.goto("/")
  await expect(page.locator(".cinematic-page")).toHaveAttribute("data-motion-engine", "ready")
  await expect(page.locator(".cinematic-stage")).toHaveCSS("position", "sticky")
  const touch = await context.newCDPSession(page)
  await touch.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: 190, y: 620, id: 1 }] })
  for (let step = 1; step <= 10; step++) {
    await touch.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: 190, y: 620 - step * 35, id: 1 }] })
    await page.waitForTimeout(20)
  }
  await touch.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] })
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(100)
  await expect.poll(() => page.locator(".hero-letter-drift").first().evaluate(el => new DOMMatrix(getComputedStyle(el).transform).m42)).toBeLessThan(-10)
  await page.evaluate(() => scrollTo(0, innerHeight))
  await expect(page.locator("#experience")).toBeInViewport()
  expect(await page.locator("#experience").evaluate(el => el.getBoundingClientRect().top)).toBeLessThan(100)
})

test("mobile orb stays with scrolling roles and direct navigation lands below it", async ({ page }) => {
  await page.goto("/#experience-darukaa")
  const orb = page.locator(".experience-sculpture")
  await expect(orb).toHaveCSS("position", "sticky")
  await expect(page.locator(".experience-brand-mark")).toHaveText("Darukaa.Earth")
  await expect(page.locator('[data-atmosphere="orb"]')).toHaveAttribute("data-scene-state", "ready")
  const bounds = await orb.boundingBox()
  expect(bounds!.y).toBeGreaterThanOrEqual(70)
  expect(bounds!.y + bounds!.height).toBeLessThan(320)
  await page.getByRole("navigation", { name: "Select an experience" }).getByRole("link", { name: /People.*Robots Lab/ }).tap()
  await expect(page).toHaveURL(/#experience-people-robots$/)
  await expect(page.locator(".experience-brand-mark")).toHaveText("People & Robots Lab")
  const title = await page.locator("#experience-people-robots h3").boundingBox()
  const bar = await orb.boundingBox()
  expect(title!.y).toBeGreaterThanOrEqual(bar!.y + bar!.height)
})

test("mobile project display changes in depth while its visual remains pinned", async ({ page }) => {
  await page.goto("/#work")
  const project = page.locator('[data-project="aranyaka"]')
  const display = project.locator("[data-project-display]")
  await project.evaluate(el => scrollTo({ top: scrollY + el.getBoundingClientRect().top - 130, behavior: "instant" }))
  await expect(page.locator("#work")).toHaveAttribute("data-project-motion", "scroll")
  await expect(display).toHaveAttribute("data-display-state", "scrolling")
  await expect(project.locator(".pg-exhibit-visual")).toHaveCSS("position", "sticky")
  const before = await display.evaluate(el => getComputedStyle(el).transform)
  await page.evaluate(() => scrollBy(0, 240))
  await expect.poll(() => display.evaluate(el => getComputedStyle(el).transform)).not.toBe(before)
  const action = project.getByRole("link", { name: /Read the technical details/ }).first()
  await action.scrollIntoViewIfNeeded()
  await expect(action).toBeInViewport({ ratio: 1 })
  await action.tap()
  await expect(page).toHaveURL(/\/projects\/aranyaka$/)
})

test("device reduced motion stops mobile choreography without losing content", async ({ page }) => {
  await page.goto("/#work")
  await page.emulateMedia({ reducedMotion: "reduce" })
  await expect(page.locator("#work")).toHaveAttribute("data-project-motion", "static")
  const display = page.locator("[data-project-display]").first()
  await expect(display).toHaveCSS("transform", "none")
  await page.emulateMedia({ reducedMotion: "reduce" })
  await expect(page.locator(".experience-sculpture")).toHaveCSS("position", "relative")
  await expect(page.locator(".pg-exhibit-visual").first()).toHaveCSS("position", "relative")
  await expect(page.locator("[data-experience-role]")).toHaveCount(6)
  await expect(page.locator("[data-catalogue-project]")).toHaveCount(34)
})

for (const width of [320, 390, 768]) {
  test(`mobile scroll scenes remain readable and accessible at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 })
    await page.goto("/#experience-darukaa")
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    const results = await new AxeBuilder({ page }).include("#experience").include("#work").withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze()
    expect(results.violations).toEqual([])
  })
}
