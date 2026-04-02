import { test, expect } from '@playwright/test'

// Helper to set up demo mode with project context
async function setupDemoWithProject(page: import('@playwright/test').Page) {
  // Set up demo mode before navigating
  await page.addInitScript(() => {
    sessionStorage.setItem('centy_demo_mode', 'true')
  })

  // Navigate to issues page with project context via query params
  await page.goto('/issues?org=demo-org&project=%2Fdemo%2Fcenty-showcase')
  await page.waitForLoadState('domcontentloaded')

  // Wait for demo mode indicator
  await expect(page.locator('.demo-mode-indicator')).toBeVisible()

  // Wait for demo issues to load (confirms projectPath is set)
  await expect(page.locator('text=Implement dark mode toggle')).toBeVisible()
}

test.describe('Standalone Workspace Modal Visual Tests @visual', () => {
  test('issues list with New Workspace button', async ({ page }) => {
    await setupDemoWithProject(page)

    // Wait for content to stabilize
    await page.waitForTimeout(500)

    await expect(page).toHaveScreenshot(
      'issues-list-with-workspace-button.png',
      {
        fullPage: true,
      }
    )
  })

  test('standalone workspace modal - open state', async ({
    page,
    isMobile,
  }) => {
    test.skip(
      isMobile,
      'mobile-not-supported overlay prevents click interactions'
    )
    await setupDemoWithProject(page)

    // Open the modal
    await page.getByRole('button', { name: '+ New Workspace' }).click()

    // Wait for modal to be visible
    await expect(page.locator('.standalone-modal-overlay')).toBeVisible()

    // Wait for modal animation
    await page.waitForTimeout(300)

    await expect(page).toHaveScreenshot('standalone-workspace-modal.png', {
      fullPage: true,
    })
  })

  test('standalone workspace modal - with filled form', async ({
    page,
    isMobile,
  }) => {
    test.skip(
      isMobile,
      'mobile-not-supported overlay prevents click interactions'
    )
    await setupDemoWithProject(page)

    // Open the modal
    await page.getByRole('button', { name: '+ New Workspace' }).click()

    // Wait for modal to be visible
    await expect(page.locator('.standalone-modal-overlay')).toBeVisible()

    // Fill in the form
    await page.getByLabel('Name (optional)').fill('My Experimental Workspace')
    await page
      .getByLabel('Description (optional)')
      .fill(
        'Exploring new API integration patterns and testing edge cases for authentication flow'
      )

    // Select 24 hours TTL
    await page.getByLabel('Workspace Duration').selectOption('24')

    // Wait for content to stabilize
    await page.waitForTimeout(300)

    await expect(page).toHaveScreenshot(
      'standalone-workspace-modal-filled.png',
      {
        fullPage: true,
      }
    )
  })
})
