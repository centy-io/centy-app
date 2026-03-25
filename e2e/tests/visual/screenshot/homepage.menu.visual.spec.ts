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

test.describe('Mobile Navbar Visual Tests - Menu interactions @visual', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await setupDemoModeLocal(page)
  })

  test('menu closes on overlay click', async ({ page }) => {
    await navigateDemoMode(page, '/')
    await page.waitForTimeout(500)

    await page.locator('.mobile-menu-toggle').click()
    await page.waitForTimeout(400)

    await expect(page.locator('.mobile-menu.open')).toBeVisible()

    await page.locator('.mobile-menu-overlay').click({ force: true })
    await page.waitForTimeout(400)

    await expect(page.locator('.mobile-menu.open')).not.toBeVisible()
  })

  test('menu closes on escape key', async ({ page }) => {
    await navigateDemoMode(page, '/')
    await page.waitForTimeout(500)

    await page.locator('.mobile-menu-toggle').click()
    await page.waitForTimeout(400)

    await expect(page.locator('.mobile-menu.open')).toBeVisible()

    await page.keyboard.press('Escape')
    await page.waitForTimeout(400)

    await expect(page.locator('.mobile-menu.open')).not.toBeVisible()
  })

  test('hamburger icon animates to X when open', async ({ page }) => {
    await navigateDemoMode(page, '/')
    await page.waitForTimeout(500)

    await expect(page.locator('.mobile-menu-toggle')).not.toHaveClass(/open/)

    await page.locator('.mobile-menu-toggle').click()
    await page.waitForTimeout(400)

    await expect(page.locator('.mobile-menu-toggle.open')).toBeVisible()

    await expect(page).toHaveScreenshot('mobile-hamburger-to-x.png')
  })
})

test.describe('Daemon Disconnected Overlay Visual Tests @visual', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('http://localhost:50051/**', async route => {
      await route.abort('connectionfailed')
    })
  })

  test('daemon disconnected - desktop viewport', async ({ page }) => {
    await page.goto('/')

    await expect(page.locator('.daemon-disconnected-overlay')).toBeVisible()
    await page.waitForTimeout(500)

    await expect(page).toHaveScreenshot('daemon-disconnected-desktop.png', {
      fullPage: true,
    })
  })

  test('daemon disconnected - mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')

    await expect(page.locator('.daemon-disconnected-overlay')).toBeVisible()
    await page.waitForTimeout(500)

    await expect(page).toHaveScreenshot('daemon-disconnected-mobile.png', {
      fullPage: true,
    })
  })

  test('daemon disconnected - tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 })
    await page.goto('/')

    await expect(page.locator('.daemon-disconnected-overlay')).toBeVisible()
    await page.waitForTimeout(500)

    await expect(page).toHaveScreenshot('daemon-disconnected-tablet.png', {
      fullPage: true,
    })
  })
})
