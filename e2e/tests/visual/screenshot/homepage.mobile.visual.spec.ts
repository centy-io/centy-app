import { test, expect } from '@playwright/test'

async function setupDemoModeLocal(page: import('@playwright/test').Page) {
  await page.addInitScript(() => {
    sessionStorage.setItem('centy_demo_mode', 'true')
  })
}

async function navigateDemoMode(
  page: import('@playwright/test').Page,
  path: string
) {
  const separator = path.includes('?') ? '&' : '?'
  await page.goto(
    `${path}${separator}org=demo-org&project=%2Fdemo%2Fcenty-showcase`
  )
  await page.waitForLoadState('networkidle')

  const dismissButton = page.locator('.mobile-dismiss-button')
  if (!(await dismissButton.isVisible().catch(() => false))) return
  await dismissButton.click()
  await page.waitForTimeout(300)
}

test.describe('Mobile Navbar Visual Tests - Mobile viewport (375x667) @visual', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await setupDemoModeLocal(page)
  })

  test('navbar - hamburger menu closed - light theme', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' })
    await navigateDemoMode(page, '/')
    await page.waitForTimeout(500)

    await expect(page.locator('.mobile-menu-toggle')).toBeVisible()
    await expect(page.locator('.app-nav')).not.toBeVisible()

    await expect(page).toHaveScreenshot('mobile-navbar-closed-light.png', {
      fullPage: true,
    })
  })

  test('navbar - hamburger menu closed - dark theme', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' })
    await navigateDemoMode(page, '/')
    await page.waitForTimeout(500)

    await expect(page.locator('.mobile-menu-toggle')).toBeVisible()

    await expect(page).toHaveScreenshot('mobile-navbar-closed-dark.png', {
      fullPage: true,
    })
  })

  test('navbar - hamburger menu open - light theme', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' })
    await navigateDemoMode(page, '/')
    await page.waitForTimeout(500)

    await page.locator('.mobile-menu-toggle').click()
    await page.waitForTimeout(400)

    await expect(page.locator('.mobile-menu.open')).toBeVisible()
    await expect(page.locator('.mobile-menu-nav')).toBeVisible()

    await expect(page).toHaveScreenshot('mobile-navbar-open-light.png', {
      fullPage: true,
    })
  })

  test('navbar - hamburger menu open - dark theme', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' })
    await navigateDemoMode(page, '/')
    await page.waitForTimeout(500)

    await page.locator('.mobile-menu-toggle').click()
    await page.waitForTimeout(400)

    await expect(page.locator('.mobile-menu.open')).toBeVisible()

    await expect(page).toHaveScreenshot('mobile-navbar-open-dark.png', {
      fullPage: true,
    })
  })
})

test.describe('Mobile Navbar Visual Tests - Tablet viewport (768x1024) @visual', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 })
    await setupDemoModeLocal(page)
  })

  test('navbar - desktop layout visible on tablet', async ({ page }) => {
    await navigateDemoMode(page, '/')
    await page.waitForTimeout(500)

    await expect(page.locator('.app-nav')).toBeVisible()
    await expect(page.locator('.mobile-menu-toggle')).not.toBeVisible()

    await expect(page).toHaveScreenshot('tablet-navbar-desktop-layout.png', {
      fullPage: true,
    })
  })
})
