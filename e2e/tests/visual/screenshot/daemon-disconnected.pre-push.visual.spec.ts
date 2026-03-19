import os from 'os'
import { test, expect } from '@playwright/test'

/**
 * Pre-push visual regression test for the Daemon Disconnected Overlay.
 *
 * This test validates the overlay appearance including:
 * - The disconnected icon and title
 * - The install command code block (must not wrap — see issue #144)
 * - The copy-to-clipboard button
 * - The retry and demo mode buttons
 *
 * Uses platform-specific baselines (darwin/linux/win32) to handle font
 * rendering differences across operating systems.
 *
 * This test runs as part of the pre-push hook to catch regressions in the
 * overlay before code is pushed.
 */

const platform = os.platform() // 'darwin', 'linux', 'win32'

test.describe('Daemon Disconnected Overlay - Desktop @visual', () => {
  test.beforeEach(async ({ page }) => {
    // Block all gRPC requests to simulate a disconnected daemon
    await page.route('http://localhost:50051/**', async route => {
      await route.abort('connectionfailed')
    })
  })

  test('overlay content - light theme', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' })
    await page.goto('/')

    const overlay = page.locator('.daemon-disconnected-overlay')
    await expect(overlay).toBeVisible()

    // Wait for animations to settle
    await page.waitForTimeout(500)

    const content = page.locator('.daemon-disconnected-content')
    await expect(content).toBeVisible()

    await expect(content).toHaveScreenshot(
      `daemon-disconnected-light-${platform}.png`,
      {
        maxDiffPixelRatio: 0.05,
        threshold: 0.3,
      }
    )
  })

  test('overlay content - dark theme', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' })
    await page.goto('/')

    const overlay = page.locator('.daemon-disconnected-overlay')
    await expect(overlay).toBeVisible()

    await page.waitForTimeout(500)

    const content = page.locator('.daemon-disconnected-content')
    await expect(content).toBeVisible()

    await expect(content).toHaveScreenshot(
      `daemon-disconnected-dark-${platform}.png`,
      {
        maxDiffPixelRatio: 0.05,
        threshold: 0.3,
      }
    )
  })

  test('install command does not wrap (issue #144)', async ({ page }) => {
    await page.goto('/')

    await expect(page.locator('.daemon-disconnected-overlay')).toBeVisible()
    await page.waitForTimeout(500)

    const codeBlock = page.locator('.daemon-code-block')
    await expect(codeBlock).toBeVisible()

    // Verify white-space: nowrap is applied — the fix for issue #144
    const whiteSpace = await codeBlock
      .locator('code')
      .evaluate((el: HTMLElement) => getComputedStyle(el).whiteSpace)
    expect(whiteSpace).toBe('nowrap')

    // Verify the code block is a single line (scrollHeight === clientHeight)
    const isSingleLine = await codeBlock
      .locator('code')
      .evaluate((el: HTMLElement) => el.scrollHeight <= el.clientHeight + 2)
    expect(isSingleLine).toBe(true)

    // Screenshot the code block to lock in the no-wrap layout
    await expect(codeBlock).toHaveScreenshot(
      `daemon-code-block-${platform}.png`,
      {
        maxDiffPixelRatio: 0.05,
        threshold: 0.3,
      }
    )
  })
})

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
      {
        maxDiffPixelRatio: 0.05,
        threshold: 0.3,
      }
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
      {
        maxDiffPixelRatio: 0.05,
        threshold: 0.3,
      }
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
      {
        maxDiffPixelRatio: 0.05,
        threshold: 0.3,
      }
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
      {
        maxDiffPixelRatio: 0.05,
        threshold: 0.3,
      }
    )
  })
})

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

    // Verify button meets minimum touch target height
    const boundingBox = await demoButton.boundingBox()
    expect(boundingBox && boundingBox.height).toBeGreaterThanOrEqual(36)

    await expect(demoSection).toHaveScreenshot(
      `daemon-demo-section-${platform}.png`,
      {
        maxDiffPixelRatio: 0.05,
        threshold: 0.3,
      }
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

    // On mobile the button should be full-width (min-height: 44px)
    const boundingBox = await demoButton.boundingBox()
    expect(boundingBox && boundingBox.height).toBeGreaterThanOrEqual(44)

    await expect(demoButton).toHaveScreenshot(
      `daemon-demo-button-mobile-${platform}.png`,
      {
        maxDiffPixelRatio: 0.05,
        threshold: 0.3,
      }
    )
  })
})
