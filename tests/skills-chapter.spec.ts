import { expect, test } from "@playwright/test"

test("desktop navigation reaches the cinematic skills chapter", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto("/#skills")

  await expect(page.locator("#skills-title")).toBeVisible()
  await expect(page.locator("#skills .skills-group")).toHaveCount(4)
  await expect(page.getByRole("link", { name: "Skills", exact: true }).first()).toHaveAttribute("href", "#skills")
  await expect(page.locator("#skills").getByText("FastAPI", { exact: true })).toBeVisible()
})

test("mobile navigation can open the skills chapter without horizontal overflow", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto("/")

  await page.getByRole("button", { name: "Open navigation" }).click()
  await page.locator("#mobile-navigation").getByRole("link", { name: "Skills" }).click()
  await expect(page).toHaveURL(/#skills$/)
  await expect(page.locator("#skills-title")).toBeVisible()
  await expect(page.locator("#skills .skills-group")).toHaveCount(4)

  const widths = await page.evaluate(() => ({ document: document.documentElement.scrollWidth, viewport: window.innerWidth }))
  expect(widths.document).toBeLessThanOrEqual(widths.viewport)
})
