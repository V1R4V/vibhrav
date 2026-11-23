import { expect, test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

const providerConfig = { provider: 'web3forms', accessKey: '00000000-0000-4000-8000-000000000001', challenge: 'web3forms', readyAfterMs: 1500, expiresAfterMs: 600000 }
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem('vibhrav:introduction:v2', 'seen'))
})
for (const width of [320, 390, 768, 1440]) {
  test(`name and quick links remain legible at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')
    await expect(page.locator('.cinematic-wordmark')).toHaveText('Vibhrav Jha.')
    await expect(page.locator('.name-line')).toHaveText('Vibhrav')
    await expect(page.locator('.footer-signature')).toHaveText('Vibhrav Jha.')
    for (const name of ['LinkedIn', 'GitHub', 'Résumé', 'Email']) await expect(page.getByRole('navigation', { name: 'Quick links', exact: true }).getByRole('link', { name: new RegExp(name) })).toBeVisible()
    expect(await page.evaluate(() => {
      const elements = [...document.querySelectorAll('.cinematic-nav > a, .mobile-menu-toggle, .name-line, .hero-name-foot, .hero-bottomline, .cinematic-foot')].filter(el => el.getBoundingClientRect().width)
      return elements.every(el => { const r = el.getBoundingClientRect(); return r.left >= 0 && r.right <= innerWidth }) && document.documentElement.scrollWidth <= innerWidth
    })).toBe(true)
    const result = await new AxeBuilder({ page }).include('.cinematic-nav').include('.hero-bottomline').include('.site-footer').withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze()
    expect(result.violations).toEqual([])
    await page.screenshot({ path: `.artifacts/quick-fixes/hero-${width}.png` })
    await page.locator('.site-footer').scrollIntoViewIfNeeded()
    await page.screenshot({ path: `.artifacts/quick-fixes/footer-${width}.png` })
  })
}
async function fill(page: import('@playwright/test').Page) {
  await page.goto('/#contact')
  await page.getByLabel('Name', { exact: true }).fill('Test visitor')
  await page.getByLabel('Email', { exact: true }).fill('visitor@example.com')
  await page.getByLabel('Message', { exact: true }).fill('I would like to discuss a software engineering opportunity.')
}
test('browser provider sends the actual form, shows acceptance and clears only on success', async ({ page }) => {
  await page.route('**/api/contact', route => route.fulfill({ json: providerConfig }))
  let payload: Record<string, unknown> = {}
  await page.route('https://api.web3forms.com/submit', async route => { payload = route.request().postDataJSON(); await route.fulfill({ json: { success: true } }) })
  await fill(page)
  await page.getByRole('button', { name: 'Send message' }).click()
  await expect(page.getByText('Your message has been sent. Thank you for getting in touch.')).toBeVisible()
  expect(payload.email).toBe('visitor@example.com')
  expect(payload.botcheck).toBe(false)
  await expect(page.getByLabel('Message', { exact: true })).toHaveValue('')
})
test('uncertain delivery preserves text, prevents duplicate sends and offers direct email', async ({ page }) => {
  await page.route('**/api/contact', route => route.fulfill({ json: providerConfig }))
  await page.route('https://api.web3forms.com/submit', route => route.abort('failed'))
  await fill(page)
  await page.getByRole('button', { name: 'Send message' }).click()
  await expect(page.getByText('Delivery could not be confirmed. Please email me directly before resending.')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Send message' })).toBeDisabled()
  await expect(page.getByLabel('Message', { exact: true })).not.toHaveValue('')
  await expect(page.locator('#contact a[href="mailto:vibhrav@gmail.com"]')).toBeVisible()
})
