import { test, expect } from '@playwright/test'
import {
  setupDemoMode,
  navigateToDemoProject,
} from '../../../../../../../utils/test-helpers'

test.describe('Editor Selector Visual Tests - Dropdown Open @visual', () => {
  test('dropdown menu visible - light theme', async ({ page, isMobile }) => {
    test.skip(
      isMobile,
      'mobile-not-supported overlay prevents click interactions'
    )
    await page.emulateMedia({ colorScheme: 'light' })
    await setupDemoMode(page)
    await navigateToDemoProject(page, '/issues/demo-issue-1')

    await expect(page.locator('.demo-mode-indicator')).toBeVisible()
    await expect(page.locator('.editor-selector')).toBeVisible()
    await page.locator('.editor-dropdown-btn').click()
    await expect(page.locator('.editor-dropdown')).toBeVisible()
    await page.waitForTimeout(300)

    await expect(page).toHaveScreenshot(
      'editor-selector-dropdown-open-light.png',
      { fullPage: true }
    )
  })

  test('dropdown menu visible - dark theme', async ({ page, isMobile }) => {
    test.skip(
      isMobile,
      'mobile-not-supported overlay prevents click interactions'
    )
    await page.emulateMedia({ colorScheme: 'dark' })
    await setupDemoMode(page)
    await navigateToDemoProject(page, '/issues/demo-issue-1')

    await expect(page.locator('.demo-mode-indicator')).toBeVisible()
    await expect(page.locator('.editor-selector')).toBeVisible()
    await page.locator('.editor-dropdown-btn').click()
    await expect(page.locator('.editor-dropdown')).toBeVisible()
    await page.waitForTimeout(300)

    await expect(page).toHaveScreenshot(
      'editor-selector-dropdown-open-dark.png',
      { fullPage: true }
    )
  })
})

test.describe('Editor Selector Visual Tests - Terminal Selected @visual', () => {
  test('terminal selected - light theme', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' })
    await page.addInitScript(() => {
      localStorage.setItem('centy-preferred-editor', '2')
    })

    await setupDemoMode(page)
    await navigateToDemoProject(page, '/issues/demo-issue-1')

    await expect(page.locator('.demo-mode-indicator')).toBeVisible()
    await expect(page.locator('.editor-selector')).toBeVisible()
    await expect(page.locator('.editor-primary-btn.terminal')).toBeVisible()
    await page.waitForTimeout(500)

    await expect(page).toHaveScreenshot('editor-selector-terminal-light.png', {
      fullPage: true,
    })
  })

  test('terminal selected - dark theme', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' })
    await page.addInitScript(() => {
      localStorage.setItem('centy-preferred-editor', '2')
    })

    await setupDemoMode(page)
    await navigateToDemoProject(page, '/issues/demo-issue-1')

    await expect(page.locator('.demo-mode-indicator')).toBeVisible()
    await expect(page.locator('.editor-selector')).toBeVisible()
    await expect(page.locator('.editor-primary-btn.terminal')).toBeVisible()
    await page.waitForTimeout(500)

    await expect(page).toHaveScreenshot('editor-selector-terminal-dark.png', {
      fullPage: true,
    })
  })
})

test.describe('Editor Selector Visual Tests - Selection Workflow @visual', () => {
  test('selecting Terminal from dropdown', async ({ page, isMobile }) => {
    test.skip(
      isMobile,
      'mobile-not-supported overlay prevents click interactions'
    )
    await page.emulateMedia({ colorScheme: 'light' })
    await setupDemoMode(page)
    await navigateToDemoProject(page, '/issues/demo-issue-1')

    await expect(page.locator('.demo-mode-indicator')).toBeVisible()
    await expect(page.locator('.editor-selector')).toBeVisible()
    await expect(page.locator('.editor-primary-btn.vscode')).toBeVisible()

    await page.locator('.editor-dropdown-btn').click()
    await expect(page.locator('.editor-dropdown')).toBeVisible()

    await page.locator('.editor-option').filter({ hasText: 'Terminal' }).click()

    await expect(page.locator('.editor-dropdown')).not.toBeVisible()
    await page.waitForTimeout(500)

    await expect(page).toHaveScreenshot(
      'editor-selector-after-terminal-select.png',
      { fullPage: true }
    )
  })
})
