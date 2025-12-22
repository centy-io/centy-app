import { test, expect } from '@playwright/test'

test.describe('Daemon Disconnected Overlay Visual Tests @visual', () => {
  test.beforeEach(async ({ page }) => {
    // Block all gRPC requests to simulate disconnected daemon
    await page.route('http://localhost:50051/**', async route => {
      await route.abort('connectionfailed')
    })
  })

  test('daemon disconnected - desktop viewport', async ({ page }) => {
    await page.goto('/')

    // Wait for the overlay to appear (daemon check happens after mount)
    await expect(page.locator('.daemon-disconnected-overlay')).toBeVisible({
      timeout: 15000,
    })

    // Wait for animations to settle
    await page.waitForTimeout(500)

    await expect(page).toHaveScreenshot('daemon-disconnected-desktop.png', {
      fullPage: true,
    })
  })

  test('daemon disconnected - mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })

    await page.goto('/')

    // Wait for the overlay to appear
    await expect(page.locator('.daemon-disconnected-overlay')).toBeVisible({
      timeout: 15000,
    })

    // Wait for animations to settle
    await page.waitForTimeout(500)

    await expect(page).toHaveScreenshot('daemon-disconnected-mobile.png', {
      fullPage: true,
    })
  })

  test('daemon disconnected - tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 })

    await page.goto('/')

    // Wait for the overlay to appear
    await expect(page.locator('.daemon-disconnected-overlay')).toBeVisible({
      timeout: 15000,
    })

    // Wait for animations to settle
    await page.waitForTimeout(500)

    await expect(page).toHaveScreenshot('daemon-disconnected-tablet.png', {
      fullPage: true,
    })
  })
})
