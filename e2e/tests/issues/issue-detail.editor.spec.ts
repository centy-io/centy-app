import { test, expect } from '@playwright/test'
import { setupDemoMode, navigateToDemoProject } from '../../utils/test-helpers'

const DEMO_ISSUE = {
  id: 'demo-issue-1',
}

test.describe('Editor Selector - Basic behavior', () => {
  test('should display editor selector button', async ({ page }) => {
    await setupDemoMode(page)
    await navigateToDemoProject(page, `/issues/${DEMO_ISSUE.id}`)

    await expect(page.locator('.demo-mode-indicator')).toBeVisible()
    await expect(page.locator('.editor-selector')).toBeVisible()
    await expect(page.locator('.editor-primary-btn')).toContainText(
      /Open in VS Code/i
    )
  })

  test('should open dropdown when clicking dropdown button', async ({
    page,
  }) => {
    await setupDemoMode(page)
    await navigateToDemoProject(page, `/issues/${DEMO_ISSUE.id}`)

    await expect(page.locator('.demo-mode-indicator')).toBeVisible()
    await expect(page.locator('.editor-selector')).toBeVisible()
    await page.locator('.editor-dropdown-btn').click()

    await expect(page.locator('.editor-dropdown')).toBeVisible()
    await expect(
      page.locator('.editor-option').filter({ hasText: 'VS Code' })
    ).toBeVisible()
    await expect(
      page.locator('.editor-option').filter({ hasText: 'Terminal' })
    ).toBeVisible()
  })

  test('should close dropdown when clicking outside', async ({ page }) => {
    await setupDemoMode(page)
    await navigateToDemoProject(page, `/issues/${DEMO_ISSUE.id}`)

    await expect(page.locator('.demo-mode-indicator')).toBeVisible()
    await page.locator('.editor-dropdown-btn').click()
    await expect(page.locator('.editor-dropdown')).toBeVisible()
    await page.locator('.issue-content').click()

    await expect(page.locator('.editor-dropdown')).not.toBeVisible()
  })

  test('should show VS Code as selected by default', async ({ page }) => {
    await setupDemoMode(page)
    await navigateToDemoProject(page, `/issues/${DEMO_ISSUE.id}`)

    await expect(page.locator('.demo-mode-indicator')).toBeVisible()
    await page.locator('.editor-dropdown-btn').click()

    await expect(
      page.locator('.editor-option.selected').filter({ hasText: 'VS Code' })
    ).toBeVisible()
  })
})

test.describe('Editor Selector - Preferences and styling', () => {
  test('should show Terminal as selected when preference is set', async ({
    page,
  }) => {
    await page.addInitScript(() => {
      localStorage.setItem('centy-preferred-editor', '2')
    })

    await setupDemoMode(page)
    await navigateToDemoProject(page, `/issues/${DEMO_ISSUE.id}`)

    await expect(page.locator('.demo-mode-indicator')).toBeVisible()
    await expect(page.locator('.editor-primary-btn.terminal')).toBeVisible()
    await expect(page.locator('.editor-primary-btn')).toContainText(
      /Open in Terminal/i
    )

    await page.locator('.editor-dropdown-btn').click()
    await expect(
      page.locator('.editor-option.selected').filter({ hasText: 'Terminal' })
    ).toBeVisible()
  })

  test('should have correct button styling for VS Code', async ({ page }) => {
    await setupDemoMode(page)
    await navigateToDemoProject(page, `/issues/${DEMO_ISSUE.id}`)

    await expect(page.locator('.demo-mode-indicator')).toBeVisible()
    await expect(page.locator('.editor-primary-btn.vscode')).toBeVisible()
    await expect(page.locator('.editor-dropdown-btn.vscode')).toBeVisible()
  })

  test('should have correct button styling for Terminal', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('centy-preferred-editor', '2')
    })

    await setupDemoMode(page)
    await navigateToDemoProject(page, `/issues/${DEMO_ISSUE.id}`)

    await expect(page.locator('.demo-mode-indicator')).toBeVisible()
    await expect(page.locator('.editor-primary-btn.terminal')).toBeVisible()
    await expect(page.locator('.editor-dropdown-btn.terminal')).toBeVisible()
  })
})
