import { test, expect } from '@playwright/test'
import { setupDemoMode, navigateToDemoProject } from '../../utils/test-helpers'

test.describe('Status Filter - Filtering', () => {
  test.beforeEach(async ({ page }) => {
    await setupDemoMode(page)
    await navigateToDemoProject(page, '/issues')

    await expect(page.locator('.demo-mode-indicator')).toBeVisible({
      timeout: 10000,
    })
  })

  test('should filter issues by for-validation state', async ({ page }) => {
    const statusFilter = page
      .locator('.column-filter-multi .multi-select-trigger')
      .first()
    await expect(statusFilter).toBeVisible({ timeout: 10000 })
    await statusFilter.click()

    const dropdown = page.locator('.multi-select-dropdown')
    await expect(dropdown).toBeVisible({ timeout: 5000 })

    await dropdown
      .locator('label')
      .filter({ hasText: 'For Validation' })
      .click()

    await page.keyboard.press('Escape')
    await page.waitForTimeout(300)

    await expect(page.getByText('Add keyboard shortcuts')).toBeVisible({
      timeout: 10000,
    })

    await expect(page).toHaveScreenshot(
      'status-filter-for-validation-results.png',
      { fullPage: true }
    )
  })

  test('should show for-validation status badge with correct styling', async ({
    page,
  }) => {
    const statusFilter = page
      .locator('.column-filter-multi .multi-select-trigger')
      .first()
    await expect(statusFilter).toBeVisible({ timeout: 10000 })
    await statusFilter.click()

    const dropdown = page.locator('.multi-select-dropdown')
    await expect(dropdown).toBeVisible({ timeout: 5000 })

    await dropdown
      .locator('label')
      .filter({ hasText: 'For Validation' })
      .click()

    await page.keyboard.press('Escape')
    await page.waitForTimeout(300)

    const forValidationBadge = page
      .locator('.status-badge')
      .filter({ hasText: 'for-validation' })
    await expect(forValidationBadge).toBeVisible({ timeout: 10000 })

    await forValidationBadge.scrollIntoViewIfNeeded()
    await expect(forValidationBadge).toHaveScreenshot(
      'for-validation-status-badge.png'
    )
  })
})
