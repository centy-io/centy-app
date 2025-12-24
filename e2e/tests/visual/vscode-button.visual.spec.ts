import { test, expect } from '@playwright/test'

test.describe('VS Code Button Visual Tests @visual', () => {
  test.describe('VS Code Available (Demo Mode)', () => {
    test('button visible - light theme', async ({ page }) => {
      await page.emulateMedia({ colorScheme: 'light' })

      // Enable demo mode and navigate directly to issue detail in one step
      // This avoids navigation race conditions from the demo mode URL redirect
      await page.goto('/issues/demo-issue-1?demo=true')
      await page.waitForLoadState('networkidle')
      await page.waitForTimeout(500)

      // Verify button is visible
      await expect(page.locator('.vscode-btn')).toBeVisible()
      await expect(page.locator('.vscode-unavailable-hint')).not.toBeVisible()

      await expect(page).toHaveScreenshot('vscode-button-visible-light.png', {
        fullPage: true,
      })
    })

    test('button visible - dark theme', async ({ page }) => {
      await page.emulateMedia({ colorScheme: 'dark' })

      await page.goto('/issues/demo-issue-1?demo=true')
      await page.waitForLoadState('networkidle')
      await page.waitForTimeout(500)

      await expect(page.locator('.vscode-btn')).toBeVisible()

      await expect(page).toHaveScreenshot('vscode-button-visible-dark.png', {
        fullPage: true,
      })
    })
  })

  test.describe('VS Code Unavailable', () => {
    test('info message shown - light theme', async ({ page }) => {
      await page.emulateMedia({ colorScheme: 'light' })

      // Set the test override BEFORE enabling demo mode
      await page.addInitScript(() => {
        ;(
          window as Window & { __TEST_VSCODE_AVAILABLE__?: boolean }
        ).__TEST_VSCODE_AVAILABLE__ = false
      })

      // Enable demo mode and navigate directly to issue detail
      await page.goto('/issues/demo-issue-1?demo=true')
      await page.waitForLoadState('networkidle')
      await page.waitForTimeout(500)

      // Verify button is hidden and info message is shown
      await expect(page.locator('.vscode-btn')).not.toBeVisible()
      await expect(page.locator('.vscode-unavailable-hint')).toBeVisible()

      await expect(page).toHaveScreenshot(
        'vscode-button-hidden-info-light.png',
        {
          fullPage: true,
        }
      )
    })

    test('info message shown - dark theme', async ({ page }) => {
      await page.emulateMedia({ colorScheme: 'dark' })

      // Set the test override BEFORE enabling demo mode
      await page.addInitScript(() => {
        ;(
          window as Window & { __TEST_VSCODE_AVAILABLE__?: boolean }
        ).__TEST_VSCODE_AVAILABLE__ = false
      })

      await page.goto('/issues/demo-issue-1?demo=true')
      await page.waitForLoadState('networkidle')
      await page.waitForTimeout(500)

      await expect(page.locator('.vscode-unavailable-hint')).toBeVisible()

      await expect(page).toHaveScreenshot(
        'vscode-button-hidden-info-dark.png',
        {
          fullPage: true,
        }
      )
    })
  })
})
