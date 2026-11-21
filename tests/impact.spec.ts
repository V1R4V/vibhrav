import { expect, test } from "@playwright/test"

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem("vibhrav:introduction:v2", "seen"))
})

for (const viewport of [{ width: 1440, height: 1000 }, { width: 390, height: 844 }]) {
  test(`results remain readable and correctly scoped at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport)
    await page.emulateMedia({ reducedMotion: "reduce" })
    await page.goto("/", { waitUntil: "domcontentloaded" })
    await expect(page.locator("[data-cinematic-hero] .hero-proof")).toContainText("24 hours")
    const proposal = page.locator("#experience-vdart")
    await proposal.scrollIntoViewIfNeeded()
    await expect(proposal.getByRole("definition").first()).toContainText("24")
    await expect(proposal.locator(".impact-metrics")).toContainText("2 weeks")
    const recwell = page.locator(".p-recwell")
    await recwell.scrollIntoViewIfNeeded()
    const results = recwell.locator(".impact-metrics")
    await expect(results).toContainText("250+")
    await expect(results).toContainText("cumulatively over two years")
    await expect(results).toContainText("program-level")
    await expect(results).toContainText("35%")
    await expect(page.locator(".p-venture-roles .impact-metrics").first()).toContainText("20+")
    expect(await results.evaluate(node => node.scrollWidth <= node.clientWidth + 1)).toBe(true)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true)
  })
}

test("a project leads with its result while retaining benchmark provenance", async ({ page }) => {
  await page.goto("/projects/before-it-breaks")
  const opening = page.locator(".project-opening")
  await expect(opening.locator(".impact-metrics")).toContainText("6–9 days")
  await expect(opening.locator(".impact-metrics")).toContainText("synthetic")
  await expect(opening.locator(".impact-metrics")).toContainText(/false-alarm/i)
  const firstStory = page.locator(".project-stories article").first()
  await expect(firstStory.getByRole("heading")).toHaveText("The result")
  await expect(firstStory).toContainText("synthetic")
})

test("results and their qualifiers are server rendered without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, reducedMotion: "reduce" })
  try {
    const page = await context.newPage()
    await page.goto("/")
    await expect(page.locator("#experience-darukaa .impact-metrics")).toContainText("batch")
    await expect(page.locator(".p-recwell .impact-metrics")).toContainText("cumulatively over two years")
  } finally { await context.close() }
})
