import { test, expect } from "@playwright/test"

test("a project film loads only when the viewer asks to watch", async ({ page }) => {
  const movieRequests: string[] = []
  page.on("request", request => { if (request.url().endsWith(".mp4")) movieRequests.push(request.url()) })
  await page.goto("/projects/vyaya")
  const play = page.getByRole("button", { name: /Watch Vyaya film/ }).first()
  await expect(play).toBeVisible()
  expect(movieRequests).toEqual([])
  await play.click()
  const video = page.locator('[data-film-player="vyaya"] video')
  await expect.poll(() => video.evaluate((element: HTMLVideoElement) => element.currentTime), { timeout: 15000 }).toBeGreaterThan(0)
  expect(movieRequests.length).toBeGreaterThan(0)
  await expect(video).toBeFocused()
})

test("a shelf film closes with Escape and returns focus without losing the page", async ({ page }) => {
  await page.goto("/cinematic#product-films")
  const trigger = page.getByRole("button", { name: /Watch Nura film/ }).first()
  await trigger.scrollIntoViewIfNeeded()
  await trigger.focus()
  const scrollBefore = await page.evaluate(() => scrollY)
  await page.keyboard.press("Enter")
  const dialog = page.getByRole("dialog", { name: /Nura film/ })
  await expect(dialog).toBeVisible()
  await page.keyboard.press("Escape")
  await expect(dialog).not.toBeVisible()
  await expect(trigger).toBeFocused()
  expect(Math.abs(await page.evaluate(() => scrollY) - scrollBefore)).toBeLessThan(2)
})

test("Nura has a direct film page with captions and the verified public app link", async ({ page }) => {
  await page.goto("/films/nura")
  await expect(page.getByRole("heading", { level: 1, name: "Nura" })).toBeVisible()
  const player = page.locator('[data-film-player="nura"]')
  await expect(player.locator('track[kind="captions"]')).toHaveAttribute("src", /nura.*\.vtt$/)
  await expect(page.getByRole("link", { name: "Try Nura" }).first()).toHaveAttribute("href", "https://nura-v1r4v.vercel.app")
})

test("films remain playable without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false })
  const page = await context.newPage()
  await page.goto("http://127.0.0.1:4310/films/nura")
  await expect(page.locator('[data-film-player="nura"] video')).toBeVisible()
  await expect(page.locator('[data-film-player="nura"] video')).toHaveAttribute("controls", "")
  await expect(page.locator('[data-film-player="nura"] .film-start')).not.toBeVisible()
  await context.close()
})

test("the film dialog fits a narrow viewport", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto("/cinematic#product-films")
  await page.getByRole("button", { name: /Watch StudyFlow film/ }).first().click()
  const dialog = page.getByRole("dialog", { name: /StudyFlow film/ })
  await expect(dialog).toBeVisible()
  const box = await dialog.boundingBox()
  expect(box!.x).toBeGreaterThanOrEqual(0)
  expect(box!.x + box!.width).toBeLessThanOrEqual(390)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy()
  await page.getByRole("button", { name: "Close film" }).click()
  await expect(dialog).not.toBeVisible()
})
