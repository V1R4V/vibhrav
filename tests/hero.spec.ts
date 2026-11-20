import { expect, test } from "@playwright/test"

test.beforeEach(async ({ page }) => {
  // Individual layout tests start after the once-per-session entrance.
  await page.addInitScript(() => sessionStorage.setItem("vibhrav:introduction:v2", "seen"))
})

const sizes = [
  { width: 1440, height: 900 },
  { width: 1366, height: 768 },
  { width: 1024, height: 768 },
  { width: 820, height: 1180 },
  { width: 768, height: 1024 },
  { width: 390, height: 844 },
  { width: 320, height: 640 },
  { width: 844, height: 390 },
  { width: 1440, height: 600 },
]

for (const viewport of sizes) {
  test(`hero fits ${viewport.width}x${viewport.height}`, async ({ page }) => {
    await page.setViewportSize(viewport)
    const errors: string[] = []
    page.on("pageerror", error => errors.push(error.message))
    await page.goto("/cinematic")
    await expect(page.locator(".cinematic-page")).toHaveAttribute("data-intro", "complete")
    await expect(page.getByRole("heading", { level: 1 })).toHaveAccessibleName("Vibhrav Jha")
    const action = page.getByRole("link", { name: "View experience" })
    // Short landscape screens use normal flow so every control remains reachable.
    await action.scrollIntoViewIfNeeded()
    await expect(action).toBeInViewport({ ratio: 1 })
    await expect(page.locator(".gold-sculpture")).toBeInViewport()
    await expect(page.locator(".gold-sculpture")).toHaveAttribute("data-scene-state", /ready|fallback/)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    const overlaps = await page.evaluate(() => {
      const action = document.querySelector(".cinematic-primary")!.getBoundingClientRect()
      const controls = document.querySelector(".cinematic-foot")!.getBoundingClientRect()
      const collides = (a: DOMRect, b: DOMRect) => a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top
      return collides(action, controls)
    })
    expect(overlaps).toBe(false)
    // Artwork is now a background spanning the stage, behind all interactions.
    expect(await page.locator(".cinematic-art").evaluate(el => {
      const art = el.getBoundingClientRect()
      const stage = el.parentElement!.getBoundingClientRect()
      return Math.abs(art.width - stage.width) < 1 && Math.abs(art.height - stage.height) < 1 && getComputedStyle(el).pointerEvents === "none"
    })).toBe(true)
    await expect(page.locator(".cinematic-hero")).toHaveCSS("min-height", `${viewport.height}px`)
    expect(errors).toEqual([])
    await page.evaluate(() => window.scrollTo(0, 0))
    await page.screenshot({ path: `.artifacts/hero-${viewport.width}x${viewport.height}.png` })
  })
}

test("keyboard reaches content and pause controls", async ({ page }) => {
  await page.goto("/cinematic")
  await expect(page.locator(".cinematic-page")).toHaveAttribute("data-intro", "complete")
  await page.keyboard.press("Tab")
  await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused()
  await page.keyboard.press("Enter")
  await expect(page.locator("#introduction")).toBeFocused()
  const pause = page.getByRole("button", { name: "Pause animation" })
  await pause.focus()
  await page.keyboard.press("Enter")
  await expect(page.getByRole("button", { name: "Resume animation" })).toHaveAttribute("aria-pressed", "true")
  await page.keyboard.press("Enter")
  await expect(pause).toHaveAttribute("aria-pressed", "false")
})

test("WebGL draws the sculpture and pause freezes the actual canvas", async ({ page }) => {
  await page.goto("/cinematic")
  const sculpture = page.locator(".gold-sculpture")
  await expect(sculpture).toHaveAttribute("data-scene-state", "ready")
  await expect(sculpture).toHaveAttribute("data-draw-calls", "4")
  expect(Number(await sculpture.getAttribute("data-triangles"))).toBeLessThan(25_000)
  await expect(page.locator(".name-letter").last()).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 0)")
  await page.getByRole("button", { name: "Pause animation" }).click()
  await expect(page.getByRole("button", { name: "Resume animation" })).toHaveAttribute("aria-pressed", "true")
  // The transparent canvas overlaps the control's hover transition. Settle that
  // separate UI feedback before comparing the frozen WebGL pixels.
  await page.mouse.move(0, 0)
  await expect(page.getByRole("button", { name: "Resume animation" })).toHaveCSS("color", "rgb(198, 165, 108)")
  const canvas = sculpture.locator("canvas")
  const before = await canvas.screenshot()
  await page.waitForTimeout(300)
  const after = await canvas.screenshot()
  expect(after.equals(before)).toBe(true)
})

test("changing motion preference releases the live canvas", async ({ page }) => {
  await page.goto("/cinematic")
  await expect(page.locator(".gold-sculpture")).toHaveAttribute("data-scene-state", "ready")
  await page.emulateMedia({ reducedMotion: "reduce" })
  await expect(page.locator(".gold-sculpture canvas")).toHaveCount(0)
  await expect(page.locator(".gold-sculpture img")).toBeVisible()
  await expect(page.getByRole("button", { name: "Pause animation" })).toHaveCount(0)
  await page.emulateMedia({ reducedMotion: "no-preference" })
  await expect(page.locator(".gold-sculpture")).toHaveAttribute("data-scene-state", "ready")
  await expect(page.locator(".gold-sculpture canvas")).toHaveCount(1)
})

test("reduced motion keeps static art and readable content", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/cinematic")
  await expect(page.locator(".gold-sculpture")).toHaveAttribute("data-scene-state", "fallback")
  await expect(page.locator(".gold-sculpture img")).toBeVisible()
  await expect(page.getByRole("button", { name: "Pause animation" })).toHaveCount(0)
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible()
  expect(await page.locator(".name-letter").first().evaluate(el => getComputedStyle(el).animationName)).toBe("none")
})

test("WebGL failure preserves artwork and navigation", async ({ page }) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext
    HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, type: string, ...args: unknown[]) {
      if (type.startsWith("webgl")) return null
      return Reflect.apply(original, this, [type, ...args])
    } as typeof original
  })
  await page.goto("/cinematic")
  await expect(page.locator(".gold-sculpture")).toHaveAttribute("data-scene-state", "fallback")
  await expect(page.locator(".gold-sculpture img")).toBeVisible()
  await expect(page.getByRole("link", { name: "View experience" })).toHaveAttribute("href", "#experience")
})

test("server HTML works without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false })
  const page = await context.newPage()
  await page.goto("/cinematic")
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible()
  await expect(page.locator(".name-letter").first()).toHaveCSS("transform", "none")
  await expect(page.locator(".gold-sculpture img")).toBeVisible()
  await expect(page.getByRole("link", { name: "View experience" })).toBeVisible()
  await context.close()
})
