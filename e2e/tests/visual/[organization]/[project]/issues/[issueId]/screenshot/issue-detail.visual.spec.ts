import { test, expect } from '@playwright/test'
import {
  setupDemoMode,
  navigateToDemoProject,
} from '../../../../../../../utils/test-helpers'

test.describe('Issue Detail Visual Tests @visual', () => {
  test('issue detail page', async ({ page }) => {
    await setupDemoMode(page)
    await navigateToDemoProject(page, '/issues/demo-issue-1')

    // Wait for demo mode indicator to confirm data is loaded
    await expect(page.locator('.demo-mode-indicator')).toBeVisible()

    // Wait for content to stabilize
    await page.waitForTimeout(500)

    await expect(page).toHaveScreenshot('issue-detail.png', {
      fullPage: true,
    })
  })
})

test.describe('Editor Selector Visual Tests - Default State @visual', () => {
  test('editor selector - light theme', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' })
    await setupDemoMode(page)
    await navigateToDemoProject(page, '/issues/demo-issue-1')

    // Wait for demo mode to be fully active before checking editor selector
    await expect(page.locator('.demo-mode-indicator')).toBeVisible()
    // Verify editor selector is visible
    await expect(page.locator('.editor-selector')).toBeVisible()
    // Verify primary button shows VS Code
    await expect(page.locator('.editor-primary-btn.vscode')).toBeVisible()
    await page.waitForTimeout(500)

    await expect(page).toHaveScreenshot('editor-selector-vscode-light.png', {
      fullPage: true,
    })
  })

  test('editor selector - dark theme', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' })
    await setupDemoMode(page)
    await navigateToDemoProject(page, '/issues/demo-issue-1')

    // Wait for demo mode to be fully active before checking editor selector
    await expect(page.locator('.demo-mode-indicator')).toBeVisible()
    await expect(page.locator('.editor-selector')).toBeVisible()
    await page.waitForTimeout(500)

    await expect(page).toHaveScreenshot('editor-selector-vscode-dark.png', {
      fullPage: true,
    })
  })
})
