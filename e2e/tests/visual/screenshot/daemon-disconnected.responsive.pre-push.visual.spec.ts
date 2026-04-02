import os from 'os'
import { test, expect } from '@playwright/test'

const platform = os.platform()

test.describe('Daemon Disconnected Overlay - Mobile @visual', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('http://localhost:50051/**', async route => {
      await route.abort('connectionfailed')
    })
    await page.setViewportSize({ width: 375, height: 667 })
  })

  test('overlay content - mobile light theme', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' })
    await page.goto('/')

    await expect(page.locator('.daemon-disconnected-overlay')).toBeVisible()
    await page.waitForTimeout(500)

    const content = page.locator('.daemon-disconnected-content')
    await expect(content).toBeVisible()

    await expect(content).toHaveScreenshot(
      `daemon-disconnected-mobile-light-${platform}.png`,
      { maxDiffPixelRatio: 0.05, threshold: 0.3 }
    )
  })

  test('overlay content - mobile dark theme', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' })
    await page.goto('/')

    await expect(page.locator('.daemon-disconnected-overlay')).toBeVisible()
    await page.waitForTimeout(500)

    const content = page.locator('.daemon-disconnected-content')
    await expect(content).toBeVisible()

    await expect(content).toHaveScreenshot(
      `daemon-disconnected-mobile-dark-${platform}.png`,
      { maxDiffPixelRatio: 0.05, threshold: 0.3 }
    )
  })
})

test.describe('Daemon Disconnected Overlay - Tablet @visual', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('http://localhost:50051/**', async route => {
      await route.abort('connectionfailed')
    })
    await page.setViewportSize({ width: 768, height: 1024 })
  })

  test('overlay content - tablet light theme', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' })
    await page.goto('/')

    await expect(page.locator('.daemon-disconnected-overlay')).toBeVisible()
    await page.waitForTimeout(500)

    const content = page.locator('.daemon-disconnected-content')
    await expect(content).toBeVisible()

    await expect(content).toHaveScreenshot(
      `daemon-disconnected-tablet-light-${platform}.png`,
      { maxDiffPixelRatio: 0.05, threshold: 0.3 }
    )
  })

  test('overlay content - tablet dark theme', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' })
    await page.goto('/')

    await expect(page.locator('.daemon-disconnected-overlay')).toBeVisible()
    await page.waitForTimeout(500)

    const content = page.locator('.daemon-disconnected-content')
    await expect(content).toBeVisible()

    await expect(content).toHaveScreenshot(
      `daemon-disconnected-tablet-dark-${platform}.png`,
      { maxDiffPixelRatio: 0.05, threshold: 0.3 }
    )
  })
})
