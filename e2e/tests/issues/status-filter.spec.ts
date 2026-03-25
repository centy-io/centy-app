import { test, expect } from '@playwright/test'
import { setupDemoMode, navigateToDemoProject } from '../../utils/test-helpers'

test.describe('Status Filter - Display', () => {
  test.beforeEach(async ({ page }) => {
    await setupDemoMode(page)
    await navigateToDemoProject(page, '/issues')

    // Wait for demo mode and issues to load
    await expect(page.locator('.demo-mode-indicator')).toBeVisible({
      timeout: 10000,
    })
  })

  test('should display all allowed states in the status filter dropdown', async ({
    page,
  }) => {
    // Find and click the status filter dropdown trigger
    const statusFilter = page
      .locator('.column-filter-multi .multi-select-trigger')
      .first()
    await expect(statusFilter).toBeVisible({ timeout: 10000 })
    await statusFilter.click()

    // Wait for dropdown to open
    await page.waitForTimeout(200)

    // Verify all states from demo config are present in the dropdown
    // Demo config has: ['open', 'in-progress', 'for-validation', 'closed']
    const dropdown = page.locator('.multi-select-dropdown')
    await expect(dropdown).toBeVisible({ timeout: 5000 })

    await expect(
      dropdown.locator('label').filter({ hasText: 'Open' })
    ).toBeVisible()
    await expect(
      dropdown.locator('label').filter({ hasText: 'In Progress' })
    ).toBeVisible()
    await expect(
      dropdown.locator('label').filter({ hasText: 'For Validation' })
    ).toBeVisible()
    await expect(
      dropdown.locator('label').filter({ hasText: 'Closed' })
    ).toBeVisible()

    // Take screenshot of the dropdown with all states visible
    await expect(page).toHaveScreenshot('status-filter-dropdown-all-states.png')
  })

  test('should display correct count of states in filter', async ({ page }) => {
    // Find and click the status filter dropdown trigger
    const statusFilter = page
      .locator('.column-filter-multi .multi-select-trigger')
      .first()
    await expect(statusFilter).toBeVisible({ timeout: 10000 })
    await statusFilter.click()

    // Wait for dropdown to open
    const dropdown = page.locator('.multi-select-dropdown')
    await expect(dropdown).toBeVisible({ timeout: 5000 })

    // Count the number of options (excluding the "All" option)
    const options = dropdown.locator('.multi-select-option:not(.select-all)')
    const optionCount = await options.count()

    // Should have 4 states: open, in-progress, for-validation, closed
    expect(optionCount).toBe(4)
  })
})
