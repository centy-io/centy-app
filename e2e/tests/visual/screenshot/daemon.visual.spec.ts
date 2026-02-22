import { test, expect } from '@playwright/test'
import { setupDemoMode, navigateTo } from '../../../utils/test-helpers'

test.describe('Daemon Page Visual Tests @visual', () => {
  test.beforeEach(async ({ page }) => {
    await setupDemoMode(page)
  })

  test('daemon page - light theme', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' })
    await navigateTo(page, '/daemon')

    await expect(page.locator('.settings-page')).toBeVisible()
    await page.waitForTimeout(500)

    // Mask the last checked time since it changes
    const lastCheckedValue = page.locator(
      '.info-item:has(.info-label:text("Last Checked")) .info-value'
    )

    await expect(page).toHaveScreenshot('daemon-light.png', {
      fullPage: true,
      mask: (await lastCheckedValue.count()) > 0 ? [lastCheckedValue] : [],
    })
  })

  test('daemon page - dark theme', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' })
    await navigateTo(page, '/daemon')

    await expect(page.locator('.settings-page')).toBeVisible()
    await page.waitForTimeout(500)

    const lastCheckedValue = page.locator(
      '.info-item:has(.info-label:text("Last Checked")) .info-value'
    )

    await expect(page).toHaveScreenshot('daemon-dark.png', {
      fullPage: true,
      mask: (await lastCheckedValue.count()) > 0 ? [lastCheckedValue] : [],
    })
  })
})
