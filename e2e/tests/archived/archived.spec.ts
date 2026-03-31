import { test, expect } from '@playwright/test'
import { setupDemoMode, navigateTo } from '../../utils/test-helpers'

test.describe('Empty State', () => {
  test('should display empty state when no archived projects', async ({
    page,
  }) => {
    await setupDemoMode(page)
    await navigateTo(page, '/archived')

    // Wait for loading to complete
    await expect(page.locator('.archived-projects')).toBeVisible()

    // Should show empty state message
    await expect(page.getByText('No archived projects')).toBeVisible()
    await expect(
      page.getByText('Archive projects from the project selector')
    ).toBeVisible()
  })

  test('should display header with back link', async ({ page }) => {
    await setupDemoMode(page)
    await navigateTo(page, '/archived')

    // Should show header
    await expect(page.getByRole('heading', { level: 2 })).toContainText(
      'Archived Projects'
    )

    // Should have back link
    await expect(page.getByText('Back to Projects')).toBeVisible()
  })

  test('should navigate back to home when clicking back link', async ({
    page,
  }) => {
    await setupDemoMode(page)
    await navigateTo(page, '/archived')

    // Click back link
    await page.getByText('Back to Projects').click()

    // Should navigate to home
    await expect(page).toHaveURL('/')
  })
})
