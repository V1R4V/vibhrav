import { expect, test } from "@playwright/test"
import { experiences, projects } from "../lib/portfolio-data"

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem("vibhrav:introduction:v2", "seen"))
})

test("the surname shares the desktop name's visual scale", async ({ page }) => {
  await page.setViewportSize({ width: 1366, height: 768 })
  await page.goto("/")
  const ratio = await page.evaluate(() => parseFloat(getComputedStyle(document.querySelector(".hero-name-foot > span")!).fontSize) / parseFloat(getComputedStyle(document.querySelector(".cinematic-title")!).fontSize))
  expect(ratio).toBeGreaterThanOrEqual(.85)
})

test("featured imagery keeps its colour before, during and after scrolling", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto("/#work")
  const image = page.locator('[data-project="aranyaka"] .pg-display-surface img')
  await image.scrollIntoViewIfNeeded()
  await page.mouse.move(0, 0)
  await expect(image).toHaveCSS("filter", "none")
  await page.evaluate(() => scrollBy(0, 220))
  await expect(image).toHaveCSS("filter", "none")
})

test("current teaching role leads the chronology and research collaboration is a project", async ({ page }) => {
  await page.goto("/#experience")
  await expect(page.locator("[data-experience-role]").first()).toHaveAttribute("id", "experience-cs574")
  await expect(page.locator("[data-experience-role]")).toHaveCount(6)
  await expect(page.locator('[data-experience-role]')).not.toContainText(["Video fingerprinting research collaboration"])
  expect(projects.some(project => /fingerprint/i.test(project.title))).toBe(true)
  await expect(page.locator("[data-catalogue-project]")).toHaveCount(projects.length)
})

test("verified experience metrics have semantic emphasis and a complete roadmap", async ({ page }) => {
  await page.goto("/#experience-vdart")
  const role = page.locator("#experience-vdart")
  await expect(role.locator("li")).toHaveCount(experiences.find(role => role.slug === "vdart")!.bullets.length)
  expect(await role.locator("li").count()).toBeGreaterThan(3)
  await expect(role.locator("strong").filter({ hasText: "50+" }).first()).toBeVisible()
  const roadmap = page.getByRole("navigation", { name: "Career roadmap" })
  await expect(roadmap.getByRole("link")).toHaveCount(6)
})

test("the orb has visible idle motion and device reduced motion freezes its orbital system", async ({ page }) => {
  await page.goto("/#experience-darukaa")
  const orb = page.locator('[data-atmosphere="orb"]')
  await orb.scrollIntoViewIfNeeded()
  await expect(orb).toHaveAttribute("data-scene-state", "ready")
  await expect(page.locator(".experience-brand-mark")).toHaveText("Darukaa.Earth")
  const ring = page.locator(".experience-orbit--outer")
  const before = await ring.evaluate(el => getComputedStyle(el).transform)
  await expect.poll(() => ring.evaluate(el => getComputedStyle(el).transform)).not.toBe(before)
  const logo = page.locator(".experience-company-logo img")
  await expect.poll(() => logo.evaluate((el: HTMLImageElement) => el.naturalWidth)).toBeGreaterThan(0)
  await page.emulateMedia({ reducedMotion: "reduce" })
  await expect(page.locator("#experience")).toHaveAttribute("data-orb-motion", "paused")
  const stopped = await ring.evaluate(el => getComputedStyle(el).transform)
  await page.waitForTimeout(250)
  await expect(ring).toHaveCSS("transform", stopped)
})

test("supplementary presentation imagery stays alongside the actual project interface", async ({ page }) => {
  await page.goto("/projects/dermanet")
  await expect(page.locator(".project-main-image img")).toHaveAttribute("src", /dermanet-analysis/)
  await expect(page.locator(".project-evidence img")).toHaveCount(3)
  await expect(page.locator(".project-evidence")).toContainText("three-person team presenting")
})

test("desktop exhibit depth continues changing after the card sticks", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto("/#work")
  const card = page.locator('[data-project="aranyaka"]')
  await card.evaluate(el => scrollTo(0, scrollY + el.getBoundingClientRect().top - 112 + 40))
  await expect(card).toHaveCSS("position", "sticky")
  await expect.poll(() => card.evaluate(el => Math.round(el.getBoundingClientRect().top))).toBe(112)
  const progress = Number(await card.getAttribute("data-project-progress"))
  await page.evaluate(() => scrollBy(0, 160))
  await expect.poll(async () => Number(await card.getAttribute("data-project-progress"))).toBeGreaterThan(progress)
})
