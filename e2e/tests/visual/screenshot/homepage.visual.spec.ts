import { test, expect } from '@playwright/test'
import { setupDemoMode, navigateTo } from '../../../utils/test-helpers'

/**
 * Set up demo mode for testing without daemon connection
 */
async function setupDemoModeLocal(page: import('@playwright/test').Page) {
  await page.addInitScript(() => {
    sessionStorage.setItem('centy_demo_mode', 'true')
  })
}

/**
 * Navigate to a page in demo mode and dismiss mobile overlay if present
 */
async function navigateDemoMode(
  page: import('@playwright/test').Page,
  path: string
) {
  const separator = path.includes('?') ? '&' : '?'
  await page.goto(
    `${path}${separator}org=demo-org&project=%2Fdemo%2Fcenty-showcase`
  )
  await page.waitForLoadState('networkidle')

  // Dismiss mobile not supported overlay if present
  const dismissButton = page.locator('.mobile-dismiss-button')
  if (!(await dismissButton.isVisible().catch(() => false))) return
  await dismissButton.click()
  await page.waitForTimeout(300)
}

test.describe('Homepage Layout Visual Tests @visual', () => {
  test('homepage - light theme', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' })
    await setupDemoMode(page)
    await navigateTo(page, '/')

    // Wait for demo mode indicator to confirm data is loaded
    await expect(page.locator('.demo-mode-indicator')).toBeVisible()
    await page.waitForTimeout(500)

    await expect(page).toHaveScreenshot('homepage-light.png', {
      fullPage: true,
    })
  })

  test('homepage - dark theme', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' })
    await setupDemoMode(page)
    await navigateTo(page, '/')

    // Wait for demo mode indicator to confirm data is loaded
    await expect(page.locator('.demo-mode-indicator')).toBeVisible()
    await page.waitForTimeout(500)

    await expect(page).toHaveScreenshot('homepage-dark.png', {
      fullPage: true,
    })
  })
})

test.describe('Demo Mode Homepage Visual Tests @visual', () => {
  test('demo mode - homepage with demo org and project', async ({ page }) => {
    // Set up demo mode before navigating
    await page.addInitScript(() => {
      sessionStorage.setItem('centy_demo_mode', 'true')
    })

    // Navigate to demo mode URL
    await page.goto('/?org=demo-org&project=%2Fdemo%2Fcenty-showcase')
    await page.waitForLoadState('domcontentloaded')

    // Handle mobile not supported overlay if present
    const continueBtn = page.getByRole('button', { name: 'Continue Anyway' })
    if (await continueBtn.isVisible().catch(() => false)) {
      await continueBtn.click()
    }

    // Verify demo mode indicator is visible
    await expect(page.locator('.demo-mode-indicator')).toBeVisible()

    // Verify demo org is shown (check button text which works on both desktop and mobile)
    await expect(
      page.getByRole('button', { name: /Demo Organization/ })
    ).toBeVisible()

    // Wait for page to stabilize before screenshot
    await page.waitForTimeout(500)

    // Take screenshot of demo mode homepage
    await expect(page).toHaveScreenshot('demo-mode-homepage.png', {
      fullPage: true,
    })
  })
})
