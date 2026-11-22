import { expect, test } from "@playwright/test"
import AxeBuilder from "@axe-core/playwright"
import { projects } from "../lib/portfolio-data"

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
})

test("a public project's README renders on the detail page", async ({ page }) => {
  await page.goto("/projects/aranyaka")
  await page.getByRole("link", { name: "Read README", exact: true }).click()
  const document = page.getByRole("region", { name: "Repository README" })
  await expect(document).toBeVisible()
  await expect(document.getByRole("heading", { name: "Architecture", exact: true })).toBeVisible()
  await expect(document.locator("pre").first()).toBeVisible()
  await expect(page.getByRole("link", { name: "View original README" })).toHaveAttribute("href", /^https:\/\/github.com\/V1R4V\/Aranyaka\/blob\//)
})

test("README table-of-contents links stay inside the rendered document", async ({ page }) => {
  await page.goto("/projects/aranyaka#project-readme")
  const document = page.getByRole("region", { name: "Repository README" })
  await expect(document).toBeVisible()
  await document.getByRole("link", { name: "Architecture", exact: true }).click()
  await expect(page).toHaveURL(/#readme-architecture$/)
  await expect(document.getByRole("heading", { name: "Architecture", exact: true })).toBeInViewport()
})

test("private projects use their existing notes without a public-source claim", async ({ page }) => {
  await page.goto("/projects/vyaya")
  await expect(page.getByRole("link", { name: "Read project notes", exact: true })).toHaveAttribute("href", "#project-overview")
  await expect(page.getByRole("region", { name: "Repository README" })).toHaveCount(0)
  await expect(page.getByRole("link", { name: "View original README" })).toHaveCount(0)
})

test("an image-only README shows its repository images", async ({ page }) => {
  await page.goto("/projects/pca-eigenfaces#project-readme")
  const document = page.getByRole("region", { name: "Repository README" })
  await expect(document).toBeVisible()
  await expect(document.locator("img")).toHaveCount(2)
  await expect(document.locator("img").first()).toHaveAttribute("src", /^https:\/\/github.com\/user-attachments\/assets\//)
})

for (const width of [1440, 390, 320]) {
  test(`project chooser scrolls both ways and navigates at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.goto("/projects/aranyaka#project-browser")
    const browser = page.getByRole("region", { name: "Browse projects" })
    const track = browser.getByRole("list", { name: "Project choices" })
    await expect(track.getByRole("link")).toHaveCount(projects.length)
    await expect(track.getByRole("link").first()).toHaveAttribute("aria-current", "page")
    await expect(browser.getByRole("button", { name: "Scroll projects left" })).toBeDisabled()
    const next = browser.getByRole("button", { name: "Scroll projects right" })
    await next.click()
    await expect.poll(() => track.evaluate(el => el.scrollLeft)).toBeGreaterThan(40)
    await browser.getByRole("button", { name: "Scroll projects left" }).click()
    await expect.poll(() => track.evaluate(el => el.scrollLeft)).toBeLessThan(5)
    await expect(browser.getByRole("button", { name: "Scroll projects left" })).toBeDisabled()
    await track.focus()
    await page.keyboard.press("ArrowRight")
    await expect.poll(() => track.evaluate(el => el.scrollLeft)).toBeGreaterThan(40)
    await track.getByRole("link", { name: /DermaNet/ }).click()
    await expect(page).toHaveURL(/\/projects\/dermanet$/)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  })
}

test("opening a later project keeps the page at its title", async ({ page }) => {
  await page.goto("/projects/bayesian-language")
  await expect(page.getByRole("heading", { level: 1 })).toBeInViewport()
  expect(await page.evaluate(() => scrollY)).toBeLessThan(40)
  const current = page.locator('.project-browser-track a[aria-current="page"]')
  await expect(current).toContainText("Bayesian Language Detection")
})

test("the project chooser responds to a touch swipe", async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: "reduce" })
  try {
    const page = await context.newPage()
    await page.goto("/projects/aranyaka#project-browser")
    const track = page.locator(".project-browser-track")
    await track.scrollIntoViewIfNeeded()
    const box = await track.boundingBox()
    expect(box).not.toBeNull()
    const client = await context.newCDPSession(page)
    const start = { x: box!.x + box!.width * .85, y: box!.y + box!.height * .5 }
    await client.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [start] })
    for (const distance of [30, 70, 110, 150, 190]) {
      await client.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: start.x - distance, y: start.y }] })
    }
    await client.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] })
    await expect.poll(() => track.evaluate(el => el.scrollLeft)).toBeGreaterThan(40)
  } finally { await context.close() }
})

test("README and project links remain usable without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, reducedMotion: "reduce" })
  try {
    const page = await context.newPage()
    await page.goto("/projects/aranyaka#project-readme")
    await expect(page.getByRole("region", { name: "Repository README" })).toBeVisible()
    await expect(page.locator(".project-browser-track a")).toHaveCount(projects.length)
    await page.locator(".project-browser-track a").nth(1).click()
    await expect(page).toHaveURL(/\/projects\/dermanet$/)
  } finally { await context.close() }
})

test("the open document and project chooser have no serious accessibility violations", async ({ page }) => {
  await page.goto("/projects/aranyaka#project-readme")
  const results = await new AxeBuilder({ page }).include(".project-documentation").include(".project-browser").analyze()
  expect(results.violations.filter(item => ["critical", "serious"].includes(item.impact || ""))).toEqual([])
})
