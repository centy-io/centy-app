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
test.describe('Daemon Disconnected Overlay Pre-push Visual Test @visual', () => {
  const platform = os.platform() // 'darwin', 'linux', 'win32'

  test.beforeEach(async ({ page }) => {
    // Block all gRPC requests to simulate a disconnected daemon
    await page.route('http://localhost:50051/**', async route => {
      await route.abort('connectionfailed')
    })
  })

  test.describe('Desktop viewport', () => {
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

  test.describe('Mobile viewport (375x667)', () => {
    test.beforeEach(async ({ page }) => {
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
})
