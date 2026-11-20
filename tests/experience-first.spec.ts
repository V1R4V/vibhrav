import { expect, test } from "@playwright/test"
import { projects } from "../lib/portfolio-data"

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem("vibhrav:introduction:v2", "seen"))
})

test("catalogue combines search and category, supports history, grouping and empty reset", async ({ page }) => {
  await page.goto("/#project-catalogue")
  const catalogue = page.locator("#project-catalogue")
  const search = page.getByRole("searchbox", { name: "Search projects" })
  await search.fill("Kafka")
  await expect(search).toBeFocused()
  await expect(page).toHaveURL(/q=Kafka/)
  await expect(page.locator("[data-catalogue-project]")).toHaveCount(projects.filter(project => `${project.title} ${project.summary} ${project.stack.join(" ")}`.toLowerCase().includes("kafka")).length)
  await catalogue.getByRole("button", { name: "Distributed Systems", exact: true }).click()
  await expect(page).toHaveURL(/category=Distributed/)
  await page.goBack()
  await expect(catalogue.getByRole("button", { name: "All work", exact: true })).toHaveAttribute("aria-pressed", "true")
  await search.fill("")
  await page.getByLabel("Group by").selectOption("category")
  const slugs = await page.locator("[data-catalogue-project]").evaluateAll(nodes => nodes.map(node => node.getAttribute("data-catalogue-project")))
  expect(slugs).toHaveLength(33)
  expect(new Set(slugs).size).toBe(33)
  await search.fill("zz-no-matching-project-zz")
  await expect(catalogue.getByText("No projects match this filter.")).toBeVisible()
  await catalogue.getByRole("button", { name: "Show all work" }).click()
  await expect(page.locator("[data-catalogue-project]")).toHaveCount(33)
  await expect(search).toHaveValue("")
})

test("direct catalogue URL restores filters and browser reload keeps the selection", async ({ page }) => {
  await page.goto("/?category=ML+%26+AI&q=Python&group=category#project-catalogue")
  await expect(page.getByRole("searchbox", { name: "Search projects" })).toHaveValue("Python")
  const filter = page.locator("#project-catalogue").getByRole("button", { name: "ML & AI", exact: true })
  await expect(filter).toHaveAttribute("aria-pressed", "true")
  await expect(page.getByLabel("Group by")).toHaveValue("category")
  const count = await page.locator("[data-catalogue-project]").count()
  expect(count).toBeGreaterThan(0)
  await page.reload()
  await expect(filter).toHaveAttribute("aria-pressed", "true")
  await expect(page.locator("[data-catalogue-project]")).toHaveCount(count)
})

test("orb and ink render and global pause freezes both canvases", async ({ page }) => {
  await page.addInitScript(() => {
    const original = WebGL2RenderingContext.prototype.drawElements
    WebGL2RenderingContext.prototype.drawElements = function (...args: Parameters<typeof original>) {
      if (this.canvas instanceof HTMLCanvasElement) this.canvas.dataset.testDraws = String(Number(this.canvas.dataset.testDraws || 0) + 1)
      return original.apply(this, args)
    }
  })
  await page.goto("/#experience")
  const orb = page.locator('[data-atmosphere="orb"]')
  await expect(orb).toHaveAttribute("data-scene-state", "ready")
  // Settle the locator's scroll before pausing; screenshot-induced scrolling
  // otherwise measures fractional-position text compositing above the canvas.
  await orb.locator("canvas").scrollIntoViewIfNeeded()
  await page.getByRole("button", { name: "Pause animation" }).click()
  await expect(page.getByRole("button", { name: "Resume animation" })).toHaveAttribute("aria-pressed", "true")
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))))
  // The company lettering is a separate HTML overlay with fractional 3D text
  // antialiasing. Mask it to compare the actual decorative canvas pixels.
  const before = await orb.locator("canvas").screenshot({ mask: [page.locator(".experience-brand")] })
  const orbDraws = await orb.locator("canvas").getAttribute("data-test-draws")
  expect(Number(orbDraws)).toBeGreaterThan(0)
  await page.waitForTimeout(150)
  expect((await orb.locator("canvas").screenshot({ mask: [page.locator(".experience-brand")] })).equals(before)).toBe(true)
  await expect(orb.locator("canvas")).toHaveAttribute("data-test-draws", orbDraws!)
  await page.getByRole("button", { name: "Resume animation" }).click()
  const ink = page.locator('[data-atmosphere="ink"]')
  await ink.scrollIntoViewIfNeeded()
  await expect(ink).toHaveAttribute("data-scene-state", "ready")
  await page.getByRole("button", { name: "Pause animation" }).click()
  const inkBefore = await ink.locator("canvas").screenshot()
  const inkDraws = await ink.locator("canvas").getAttribute("data-test-draws")
  expect(Number(inkDraws)).toBeGreaterThan(0)
  await page.mouse.move(500, 500)
  await page.waitForTimeout(150)
  expect((await ink.locator("canvas").screenshot()).equals(inkBefore)).toBe(true)
  await expect(ink.locator("canvas")).toHaveAttribute("data-test-draws", inkDraws!)
})

test("reduced motion and no JavaScript retain every experience and catalogue entry", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, reducedMotion: "reduce" })
  const page = await context.newPage()
  await page.goto("/")
  await expect(page.locator("[data-experience-role]")).toHaveCount(8)
  await expect(page.locator("[data-catalogue-project]")).toHaveCount(33)
  await expect(page.locator("canvas")).toHaveCount(0)
  await expect(page.locator("#leadership")).toContainText("250+ referees cumulatively over two years")
  await expect(page.locator("#leadership")).toContainText("30% higher participation")
  await expect(page.locator("#leadership")).toContainText("Three-time Dean’s List")
  await context.close()
})

test("WebGL failure preserves experience, catalogue and footer navigation", async ({ page }) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext
    HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, contextId: string, options?: unknown) {
      if (contextId.includes("webgl")) return null
      return original.call(this, contextId, options)
    } as typeof original
  })
  await page.goto("/#experience")
  await expect(page.locator('[data-atmosphere="orb"]')).toHaveAttribute("data-scene-state", "fallback")
  await expect(page.locator("[data-experience-role]")).toHaveCount(8)
  await page.locator("footer").scrollIntoViewIfNeeded()
  await expect(page.locator('[data-atmosphere="ink"]')).toHaveAttribute("data-scene-state", "fallback")
  await expect(page.getByRole("navigation", { name: "Social links" }).getByRole("link", { name: "GitHub" })).toBeVisible()
})

test("mobile footer action and arrow remain inside the viewport", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 640 })
  await page.goto("/")
  await page.locator("footer").scrollIntoViewIfNeeded()
  const bounds = await page.locator(".footer-invitation").boundingBox()
  expect(bounds!.x).toBeGreaterThanOrEqual(0)
  expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(320)
  await expect(page.locator(".footer-invitation > span")).toBeInViewport()
})

for (const project of projects) {
  test(`approved project route: ${project.slug}`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" })
    await page.setViewportSize({ width: 390, height: 844 })
    const errors: string[] = []
    page.on("pageerror", error => errors.push(error.message))
    const response = await page.goto(`/projects/${project.slug}`)
    expect(response?.status()).toBe(200)
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(new RegExp(project.title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")))
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    const image = page.locator(".project-main-image img")
    await expect.poll(() => image.evaluate((el: HTMLImageElement) => el.naturalWidth)).toBeGreaterThan(0)
    await expect(page.locator("main")).not.toContainText("/Users/")
    expect(errors).toEqual([])
  })
}

test("experience precedes projects and the hero contains one visual identity", async ({ page }) => {
  await page.goto("/")
  expect(await page.locator("main section[id]").evaluateAll(nodes => nodes.map(node => node.id))).toEqual(
    expect.arrayContaining(["experience", "work", "leadership", "about", "contact"]),
  )
  expect(await page.locator("#experience").evaluate(el => Boolean(el.compareDocumentPosition(document.querySelector("#work")!) & Node.DOCUMENT_POSITION_FOLLOWING))).toBe(true)
  await expect(page.locator(".hero-name-foot")).not.toContainText("Vibhrav Jha")
  const pause = page.getByRole("button", { name: "Pause animation" })
  await expect(page.locator("header").getByRole("button", { name: "Pause animation" })).toBeVisible()
  await pause.click()
  await expect(page.getByRole("button", { name: "Resume animation" })).toHaveAttribute("aria-pressed", "true")
})

test("approved catalogue is complete and private repositories have no public action", async ({ page }) => {
  await page.goto("/#project-catalogue")
  await expect(page.locator("#project-catalogue")).toBeVisible()
  await expect(page.locator("[data-catalogue-project]")).toHaveCount(33)
  await expect(page.locator("[data-stack-card]")).toHaveCount(6)
  await page.goto("/projects/vyaya")
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Vyaya")
  await expect(page.getByRole("link", { name: "View repository" })).toHaveCount(0)
  await expect(page.locator("main")).not.toContainText("/Users/")
})
