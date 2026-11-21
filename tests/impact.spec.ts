import { expect, test } from "@playwright/test"

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem("vibhrav:introduction:v2", "seen"))
})

for (const viewport of [{ width: 1440, height: 1000 }, { width: 390, height: 844 }]) {
  test(`results remain readable and correctly scoped at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport)
    await page.emulateMedia({ reducedMotion: "reduce" })
    await page.goto("/", { waitUntil: "domcontentloaded" })
    await expect(page.locator("[data-cinematic-hero] .hero-proof")).toHaveCount(0)
    await expect(page.locator("[data-cinematic-hero]")).not.toContainText(/two weeks|24 hours|8–10×/i)
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


test("approved experience copy preserves research, client anonymity and archived history", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, reducedMotion: "reduce" })
  try {
    const page = await context.newPage()
    await page.goto("/")
    await expect(page.locator("[data-experience-role]")).toHaveCount(6)
    await expect(page.locator("#experience-science-centre")).toHaveCount(0)
    await expect(page.locator("[data-cinematic-hero]")).toContainText("A founder’s ambition.")
    const teaching = page.locator("#experience-cs574 .experience-bullets")
    await expect(teaching).toContainText("4–6 new questions")
    await expect(teaching).toContainText("MongoDB")
    await expect(teaching).toContainText("Dynamic Tables question")
    const lab = page.locator("#experience-people-robots .experience-bullets")
    await expect(lab).toContainText("18+ participants")
    await expect(lab).toContainText("human-centered design principles")
    await expect(lab).toContainText("MoRA")
    const cornell = page.locator("#experience-cornell-acert .experience-bullets")
    await expect(cornell.locator("li").first()).toContainText("Hamming error")
    await expect(cornell).toContainText("30 variants across six source videos")
    await expect(cornell).toContainText("TAM/SAM/SOM")
    await expect(cornell).not.toContainText(/grant|funding awarded/i)
    const darukaa = page.locator("#experience-darukaa .experience-bullets")
    await expect(darukaa).toContainText("two discussions")
    await expect(darukaa).toContainText("requirements for custom API integration")
    await expect(darukaa).not.toContainText(/Tata|billion|75%|78%/i)
    await expect(page.locator("#experience-vdart .experience-bullets")).toContainText("team-led production deployment")
    await expect(page.locator("#experience-pinkcity .experience-bullets")).toContainText("$18,000")
    await expect(page.locator(".experience-bullets")).not.toContainText(["—"])
  } finally { await context.close() }
})
