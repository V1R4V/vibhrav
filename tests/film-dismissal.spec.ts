import { test, expect } from "@playwright/test"

test("closing a film releases the player even when a CSS exit animation cannot finish", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/cinematic#product-films")
  const trigger = page.getByRole("button", { name: /Watch Nura film/ }).first()
  await trigger.click()
  const dialog = page.getByRole("dialog", { name: /Nura film/ })
  await expect(dialog).toBeVisible()
  await page.addStyleTag({ content: `@keyframes film-test-exit { to { opacity: 0; } } .film-dialog[data-state="closed"], .film-overlay[data-state="closed"] { animation: film-test-exit 60s linear paused !important; }` })
  await page.keyboard.press("Escape")
  await expect(dialog).toHaveCount(0, { timeout: 2000 })
  await expect(page.locator('[data-film-player="nura"] video')).toHaveCount(0)
  await expect(trigger).toBeFocused()
})
