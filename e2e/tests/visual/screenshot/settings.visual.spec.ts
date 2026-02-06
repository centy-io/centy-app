import { test, expect } from '@playwright/test'
import { setupDemoMode, navigateTo } from '../../../utils/test-helpers'

test.describe('Settings Page Visual Tests @visual', () => {
  test.beforeEach(async ({ page }) => {
    await setupDemoMode(page)
  })

  test('settings page - light theme', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' })
    await navigateTo(page, '/settings')

    await expect(page.locator('.settings-page')).toBeVisible()
    await page.waitForTimeout(500)

    // Mask the commit SHA since it changes with every commit
    const commitSha = page.locator('.commit-sha')

    await expect(page).toHaveScreenshot('settings-light.png', {
      fullPage: true,
      mask: (await commitSha.count()) > 0 ? [commitSha] : [],
    })
  })

  test('settings page - dark theme', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' })
    await navigateTo(page, '/settings')

    await expect(page.locator('.settings-page')).toBeVisible()
    await page.waitForTimeout(500)

    const commitSha = page.locator('.commit-sha')

    await expect(page).toHaveScreenshot('settings-dark.png', {
      fullPage: true,
      mask: (await commitSha.count()) > 0 ? [commitSha] : [],
    })
  })
})
