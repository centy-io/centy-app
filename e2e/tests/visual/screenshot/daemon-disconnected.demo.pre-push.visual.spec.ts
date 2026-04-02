import os from 'os'
import { test, expect } from '@playwright/test'

const platform = os.platform()

test.describe('Daemon Disconnected Overlay - Demo mode section @visual', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('http://localhost:50051/**', async route => {
      await route.abort('connectionfailed')
    })
  })

  test('demo mode button is visible and renders correctly', async ({
    page,
  }) => {
    await page.goto('/')

    await expect(page.locator('.daemon-disconnected-overlay')).toBeVisible()
    await page.waitForTimeout(500)

    const demoSection = page.locator('.daemon-disconnected-demo-section')
    await expect(demoSection).toBeVisible()

    const demoButton = page.locator('.daemon-demo-button')
    await expect(demoButton).toBeVisible()
    await expect(demoButton).toHaveText('Try Demo Mode')

    const boundingBox = await demoButton.boundingBox()
    expect(boundingBox && boundingBox.height).toBeGreaterThanOrEqual(36)

    await expect(demoSection).toHaveScreenshot(
      `daemon-demo-section-${platform}.png`,
      { maxDiffPixelRatio: 0.05, threshold: 0.3 }
    )
  })

  test('demo mode button is full-width with adequate touch target on mobile', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')

    await expect(page.locator('.daemon-disconnected-overlay')).toBeVisible()
    await page.waitForTimeout(500)

    const demoButton = page.locator('.daemon-demo-button')
    await expect(demoButton).toBeVisible()

    const boundingBox = await demoButton.boundingBox()
    expect(boundingBox && boundingBox.height).toBeGreaterThanOrEqual(44)

    await expect(demoButton).toHaveScreenshot(
      `daemon-demo-button-mobile-${platform}.png`,
      { maxDiffPixelRatio: 0.05, threshold: 0.3 }
    )
  })
})
