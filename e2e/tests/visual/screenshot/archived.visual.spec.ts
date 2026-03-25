import { test, expect } from '@playwright/test'
import { setupDemoMode, navigateTo } from '../../../utils/test-helpers'

test.describe('Empty State', () => {
  test('archived page empty - light theme', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' })
    await setupDemoMode(page)
    await navigateTo(page, '/archived')

    // Wait for content to load
    await expect(page.locator('.archived-projects')).toBeVisible()
    await expect(page.getByText('No archived projects')).toBeVisible()
    await page.waitForTimeout(500)

    await expect(page).toHaveScreenshot('archived-empty-light.png', {
      fullPage: true,
    })
  })

  test('archived page empty - dark theme', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' })
    await setupDemoMode(page)
    await navigateTo(page, '/archived')

    // Wait for content to load
    await expect(page.locator('.archived-projects')).toBeVisible()
    await expect(page.getByText('No archived projects')).toBeVisible()
    await page.waitForTimeout(500)

    await expect(page).toHaveScreenshot('archived-empty-dark.png', {
      fullPage: true,
    })
  })
})

test.describe('With Archived Projects', () => {
  test.beforeEach(async ({ page }) => {
    // Set up demo mode with an archived project
    await page.addInitScript(() => {
      sessionStorage.setItem('centy_demo_mode', 'true')

      // Add the demo project to archived list
      localStorage.setItem(
        'centy-archived-projects',
        JSON.stringify(['/demo/centy-showcase'])
      )
    })
  })

  test('archived page with project - light theme', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' })
    await navigateTo(page, '/archived')

    // Wait for archived item to load
    await expect(page.locator('.archived-item')).toBeVisible()
    await page.waitForTimeout(500)

    await expect(page).toHaveScreenshot('archived-with-project-light.png', {
      fullPage: true,
    })
  })

  test('archived page with project - dark theme', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' })
    await navigateTo(page, '/archived')

    // Wait for archived item to load
    await expect(page.locator('.archived-item')).toBeVisible()
    await page.waitForTimeout(500)

    await expect(page).toHaveScreenshot('archived-with-project-dark.png', {
      fullPage: true,
    })
  })
})
