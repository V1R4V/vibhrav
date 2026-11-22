import { getProductFilm } from "../lib/project-films"
import { expect, test } from "@playwright/test"
import AxeBuilder from "@axe-core/playwright"

const slugs = ["aranyaka", "exam-prep-assistant", "stock-streaming", "studyflow", "habit-command-center", "dermanet"]

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem("vibhrav:introduction:v2", "seen"))
})

test("all chapters, project exhibits and honest contact fallback are present", async ({ page }) => {
  await page.goto("/")
  await expect(page.locator(".cinematic-page")).toHaveAttribute("data-motion-engine", "ready")
  await expect(page.getByRole("heading", { level: 1 })).toHaveAccessibleName("Vibhrav Jha")
  for (const id of ["work", "experience", "leadership", "about", "contact"]) await expect(page.locator(`#${id}`)).toBeAttached()
  await expect(page.locator("[data-stack-card]")).toHaveCount(6)
  await expect(page.locator("[data-catalogue-project]")).toHaveCount(34)
  await expect(page.locator("#cinematic-contact-title")).toHaveText("Let’s talk about what you’re building.")
  await expect(page.locator("#leadership-role-0")).toContainText("2,000+ participants and staff across five intramural programs")
  await page.locator("#contact").scrollIntoViewIfNeeded()
  await expect(page.getByText("The form is temporarily unavailable. Please email me directly.")).toBeVisible()
  await expect(page.getByRole("button", { name: "Send message" })).toBeDisabled()
  await expect(page.locator('#contact a[href="mailto:vibhrav@gmail.com"]')).toBeVisible()
})

test("name has its own upright letter motion and settles without skew", async ({ page }) => {
  await page.goto("/")
  const letter = page.locator(".name-letter").last()
  await expect(letter).toHaveCSS("animation-name", "name-arrive")
  await expect(letter).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 0)")
  await expect(page.locator(".cinematic-title")).toHaveCSS("font-style", "normal")
  const title = await page.locator(".cinematic-title").boundingBox()
  const wordmark = await page.locator(".cinematic-wordmark").boundingBox()
  expect(Math.abs(title!.x - wordmark!.x)).toBeLessThan(2)
})

test("experience role navigation works with keyboard", async ({ page }) => {
  await page.goto("/")
  const role = page.getByRole("navigation", { name: "Select an experience" }).getByRole("link").nth(1)
  await role.focus()
  await page.keyboard.press("Enter")
  await expect(page).toHaveURL(/#experience-people-robots$/)
  await expect(page.locator("#experience-people-robots")).toBeInViewport()
  await expect(page.locator("#experience-people-robots")).toContainText("Kotlin")
})

test("mobile navigation opens, closes with Escape and follows a chapter", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto("/")
  await page.getByRole("button", { name: "Open navigation" }).click()
  await expect(page.getByRole("navigation", { name: "Mobile navigation" })).toBeVisible()
  await page.keyboard.press("Escape")
  await expect(page.getByRole("button", { name: "Open navigation" })).toBeFocused()
  await page.getByRole("button", { name: "Open navigation" }).click()
  await page.getByRole("navigation", { name: "Mobile navigation" }).getByRole("link", { name: "Leadership" }).click()
  await expect(page).toHaveURL(/#leadership$/)
  await expect(page.getByRole("navigation", { name: "Mobile navigation" })).toBeHidden()
})

for (const slug of slugs) {
  test(`project detail ${slug} has real assets and a working next project`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    const errors: string[] = []
    page.on("pageerror", error => errors.push(error.message))
    const response = await page.goto(`/projects/${slug}`)
    expect(response!.status()).toBe(200)
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible()
    const film = getProductFilm(slug)
    if (film) {
      const video = page.locator(".project-image-stage video")
      await expect(video).toBeVisible()
      await expect(video.locator("source")).toHaveAttribute("src", film.src)
      await expect(video).toHaveAttribute("poster", film.poster)
      expect((await page.request.get(film.poster)).status()).toBe(200)
    } else {
      const image = page.locator(".project-main-image img")
      await expect(image).toBeVisible()
      await expect.poll(() => image.evaluate((element: HTMLImageElement) => element.naturalWidth)).toBeGreaterThan(0)
    }
    await expect(page.getByRole("heading", { name: "A decision worth examining" })).toBeAttached()
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    const next = page.locator(".project-next h2 a")
    await expect(next).toHaveAttribute("href", /^\/projects\//)
    await next.click()
    await expect(page).not.toHaveURL(new RegExp(`/projects/${slug}$`))
    expect(errors).toEqual([])
  })
}

test("unknown project returns 404", async ({ page }) => {
  const response = await page.goto("/projects/not-a-real-project")
  expect(response!.status()).toBe(404)
})

test("contact renders pending and provider-acceptance confirmation", async ({ page }) => {
  await page.route("**/api/contact", async route => {
    if (route.request().method() === "GET") return route.fulfill({ json: { challenge: "browser-test-challenge" } })
    await new Promise(resolve => setTimeout(resolve, 900))
    return route.fulfill({ status: 202, json: { message: "Accepted" } })
  })
  await page.goto("/")
  await page.getByLabel("Name", { exact: true }).fill("Test visitor")
  await page.getByLabel("Email", { exact: true }).fill("visitor@example.com")
  await page.getByLabel("Message", { exact: true }).fill("I would like to discuss an engineering project with you.")
  await expect(page.getByRole("button", { name: "Send message" })).toBeEnabled()
  await page.getByRole("button", { name: "Send message" }).click()
  await expect(page.getByRole("button", { name: "Sending…" })).toBeDisabled()
  await expect(page.getByText("Your message has been sent. Thank you for getting in touch.")).toBeVisible()
  await expect(page.getByLabel("Message", { exact: true })).toHaveValue("")
})

test("contact field errors remain accessible and preserve the message", async ({ page }) => {
  await page.route("**/api/contact", route => route.fulfill({ status: route.request().method() === "GET" ? 200 : 400, json: route.request().method() === "GET" ? { challenge: "browser-test-challenge" } : { fieldErrors: { email: "Please use a reachable email address." } } }))
  await page.goto("/")
  await page.getByLabel("Name", { exact: true }).fill("Test visitor")
  await page.getByLabel("Email", { exact: true }).fill("visitor@example.com")
  const message = "I would like to discuss an engineering project with you."
  await page.getByLabel("Message", { exact: true }).fill(message)
  await page.getByRole("button", { name: "Send message" }).click()
  await expect(page.getByLabel("Email", { exact: true })).toHaveAttribute("aria-invalid", "true")
  await expect(page.getByLabel("Email", { exact: true })).toBeFocused()
  await expect(page.getByText("Please use a reachable email address.")).toBeVisible()
  await expect(page.getByLabel("Message", { exact: true })).toHaveValue(message)
})

test("uncertain send retries preserve the same submission key", async ({ page }) => {
  const submissions: { challenge: string; message: string }[] = []
  await page.route("**/api/contact", route => {
    if (route.request().method() === "GET") return route.fulfill({ json: { challenge: "stable-retry-challenge" } })
    submissions.push(route.request().postDataJSON())
    return route.fulfill({ status: submissions.length === 1 ? 503 : 202, json: submissions.length === 1 ? { error: "Provider timeout" } : { message: "Accepted" } })
  })
  await page.goto("/")
  await page.getByLabel("Name", { exact: true }).fill("Test visitor")
  await page.getByLabel("Email", { exact: true }).fill("visitor@example.com")
  await page.getByLabel("Message", { exact: true }).fill("Please tell me more about your engineering work.")
  await page.getByRole("button", { name: "Send message" }).click()
  await expect(page.getByText("Sending could not be confirmed. Retry without editing your message, or email me directly.")).toBeVisible()
  await page.getByRole("button", { name: "Send message" }).click()
  await expect(page.getByText("Your message has been sent. Thank you for getting in touch.")).toBeVisible()
  expect(submissions).toHaveLength(2)
  expect(submissions[1].challenge).toBe(submissions[0].challenge)
  expect(submissions[1].message).toBe(submissions[0].message)
})

test("WCAG AA automated audit of all home chapters", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/")
  await expect(page.getByText("The form is temporarily unavailable. Please email me directly.")).toBeVisible()
  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze()
  expect(results.violations).toEqual([])
})

test("WCAG AA automated audit of project detail", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/projects/aranyaka")
  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze()
  expect(results.violations).toEqual([])
})
