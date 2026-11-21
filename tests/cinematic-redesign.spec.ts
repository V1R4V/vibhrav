import { expect, test } from "@playwright/test"
import AxeBuilder from "@axe-core/playwright"

test("curtain can be skipped and does not replay within the session", async ({ page }) => {
  // Hold the entrance clock while checking keyboard/click access. On a busy
  // runner the real 900ms entrance can finish between the focus and click.
  await page.clock.install({ time: new Date("2026-11-20T00:00:00Z") })
  await page.clock.pauseAt(new Date("2026-11-20T00:00:01Z"))
  await page.goto("/")
  const opening = page.getByRole("dialog", { name: "Opening portfolio" })
  await expect(opening).toBeVisible()
  await page.keyboard.press("Tab")
  await expect(page.getByRole("button", { name: "Skip introduction" })).toBeFocused()
  await page.getByRole("button", { name: "Skip introduction" }).click()
  await expect(opening).toHaveCount(0)
  await expect(page.locator(".cinematic-page")).toHaveAttribute("data-intro", "complete")
  await page.reload()
  await expect(opening).toHaveCount(0)
  await expect(page.locator(".cinematic-page")).toHaveAttribute("data-intro", "complete")
})

test("curtain reaches 100, releases the page and keeps the name upright", async ({ page }) => {
  await page.goto("/")
  await expect(page.locator(".curtain-count")).toHaveText("100%")
  await expect(page.locator(".cinematic-page")).toHaveAttribute("data-intro", "complete")
  await expect(page.locator(".curtain-loader")).toHaveCount(0)
  await expect(page.locator(".cinematic-title")).toHaveCSS("font-style", "normal")
  const ratio = await page.locator(".cinematic-title").evaluate(el => el.getBoundingClientRect().width / innerWidth)
  expect(ratio).toBeGreaterThan(.8)
  await expect(page.locator("main")).not.toHaveAttribute("inert", "")
})

test("work panels stack at 24px intervals and experience navigation follows focus", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto("/#work")
  const cards = page.locator("[data-stack-card]")
  await expect(cards).toHaveCount(6)
  const tops = await cards.evaluateAll(elements => elements.map(el => parseFloat(getComputedStyle(el).top)))
  for (let index = 1; index < tops.length; index++) expect(tops[index] - tops[index - 1]).toBe(24)
  const role = page.getByRole("navigation", { name: "Select an experience" }).getByRole("link", { name: /Darukaa/ })
  await role.focus()
  await page.keyboard.press("Enter")
  await expect(page).toHaveURL(/#experience-darukaa$/)
  await expect(page.locator("#experience-darukaa")).toBeInViewport()

})

test("reduced motion bypasses the curtain and renders an unpinned project list", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/")
  await expect(page.locator(".cinematic-page")).toHaveAttribute("data-intro", "complete")
  await expect(page.locator(".curtain-loader")).toHaveCount(0)
  await expect(page.locator("[data-stack-card]").first()).toHaveCSS("position", "relative")
  await expect(page.locator(".gold-sculpture canvas")).toHaveCount(0)
})

test("paused identity remains readable when motion preferences change", async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem("vibhrav:introduction:v2", "seen"))
  await page.goto("/")
  await page.getByRole("button", { name: "Pause animation" }).click()
  await page.emulateMedia({ reducedMotion: "reduce" })
  await expect(page.locator(".gold-sculpture canvas")).toHaveCount(0)
  await page.emulateMedia({ reducedMotion: "no-preference" })
  await expect(page.getByRole("button", { name: "Resume animation" })).toBeVisible()
  await expect(page.locator(".name-letter").last()).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 0)")
})

test("keyboard focus brings a covered project above the stack", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto("/#work")
  const cards = page.locator("[data-stack-card]")
  await cards.last().scrollIntoViewIfNeeded()
  const link = cards.first().getByRole("link", { name: /Read the technical details/ })
  await link.focus()
  await expect(link).toBeFocused()
  expect(await link.evaluate(el => {
    const box = el.getBoundingClientRect()
    return el.contains(document.elementFromPoint(box.x + box.width / 2, box.y + box.height / 2))
  })).toBe(true)
})

test("hero action stays legible on hover", async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem("vibhrav:introduction:v2", "seen"))
  await page.goto("/")
  await page.getByRole("link", { name: "View experience" }).hover()
  const results = await new AxeBuilder({ page }).include(".cinematic-primary").withTags(["wcag2aa"]).analyze()
  expect(results.violations).toEqual([])
})
