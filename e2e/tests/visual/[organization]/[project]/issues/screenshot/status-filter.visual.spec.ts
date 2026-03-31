import { test, expect } from '@playwright/test'
import {
  setupDemoMode,
  navigateToDemoProject,
} from '../../../../../../utils/test-helpers'

test.describe('Status Filter Visual Tests - Dropdown open @visual', () => {
  test('status filter dropdown - all states visible', async ({
    page,
    isMobile,
  }) => {
    test.skip(
      isMobile,
      'mobile-not-supported overlay prevents click interactions'
    )
    await setupDemoMode(page)
    await navigateToDemoProject(page, '/issues')

    await expect(page.locator('.demo-mode-indicator')).toBeVisible({
      timeout: 10000,
    })

    const statusFilter = page
      .locator('.column-filter-multi .multi-select-trigger')
      .first()
    await expect(statusFilter).toBeVisible({ timeout: 10000 })
    await statusFilter.click()

    await page.waitForTimeout(500)

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

    await expect(page).toHaveScreenshot('status-filter-dropdown-open.png', {
      fullPage: true,
    })
  })
})

test.describe('Status Filter Visual Tests - Badge styling @visual', () => {
  test('issues list - for-validation status badge styling', async ({
    page,
  }) => {
    await setupDemoMode(page)
    await navigateToDemoProject(page, '/issues')

    // Wait for demo mode indicator to confirm data is loaded
    await expect(page.locator('.demo-mode-indicator')).toBeVisible({
      timeout: 10000,
    })

    // Wait for issues table to load (status filter confirms table is rendered with data)
    await expect(
      page.locator('.column-filter-multi .multi-select-trigger').first()
    ).toBeVisible({ timeout: 10000 })

    // Wait for content to stabilize
    await page.waitForTimeout(500)

    // Take screenshot of the full issues list showing the for-validation status badge
    await expect(page).toHaveScreenshot('issues-list-with-for-validation.png', {
      fullPage: true,
    })
  })
})

test.describe('Status Filter Responsive Visual Tests @visual', () => {
  test('status filter dropdown - mobile viewport', async ({
    page,
    isMobile,
  }) => {
    test.skip(
      isMobile,
      'mobile-not-supported overlay prevents click interactions'
    )
    await page.setViewportSize({ width: 375, height: 667 })
    await setupDemoMode(page)
    await navigateToDemoProject(page, '/issues')

    // Wait for demo mode indicator to confirm data is loaded
    await expect(page.locator('.demo-mode-indicator')).toBeVisible({
      timeout: 10000,
    })

    // Find and click the status filter dropdown trigger
    const statusFilter = page
      .locator('.column-filter-multi .multi-select-trigger')
      .first()
    await expect(statusFilter).toBeVisible({ timeout: 10000 })
    await statusFilter.click()

    // Wait for dropdown to open
    await page.waitForTimeout(500)

    await expect(page).toHaveScreenshot('status-filter-dropdown-mobile.png', {
      fullPage: true,
    })
  })
})
