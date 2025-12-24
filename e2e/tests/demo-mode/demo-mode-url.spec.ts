import { test, expect } from '@playwright/test'

test.describe('Demo Mode URL Activation', () => {
  test('should activate demo mode when visiting with ?demo=true', async ({
    page,
  }) => {
    // Navigate to the app with ?demo=true (no pre-set sessionStorage)
    await page.goto('/?demo=true')
    await page.waitForLoadState('domcontentloaded')

    // Wait for demo mode indicator to be visible
    await expect(page.locator('.demo-mode-indicator')).toBeVisible({
      timeout: 10000,
    })

    // Verify the URL shows org param (project param may or may not be present)
    await expect(page).toHaveURL(/org=demo-org/, { timeout: 10000 })

    // Verify demo org is selected (use .first() since there are desktop and mobile org switchers)
    await expect(
      page
        .locator('.org-label')
        .filter({ hasText: 'Demo Organization' })
        .first()
    ).toBeVisible({ timeout: 10000 })
  })

  test('should show demo issues after URL activation', async ({ page }) => {
    // Navigate with ?demo=true
    await page.goto('/?demo=true')
    await page.waitForLoadState('domcontentloaded')

    // Wait for demo mode to be active
    await expect(page.locator('.demo-mode-indicator')).toBeVisible({
      timeout: 10000,
    })

    // Navigate to issues page
    await page.click('a[href*="/issues"]')
    await page.waitForLoadState('domcontentloaded')

    // Verify demo issues are displayed
    await expect(page.locator('text=Implement dark mode toggle')).toBeVisible({
      timeout: 10000,
    })
  })

  test('should persist demo mode after navigation', async ({ page }) => {
    // Activate demo mode via URL
    await page.goto('/?demo=true')
    await page.waitForLoadState('domcontentloaded')

    // Wait for demo mode to be active
    await expect(page.locator('.demo-mode-indicator')).toBeVisible({
      timeout: 10000,
    })

    // Navigate to another page
    await page.click('a[href*="/issues"]')
    await page.waitForLoadState('domcontentloaded')

    // Demo mode indicator should still be visible
    await expect(page.locator('.demo-mode-indicator')).toBeVisible({
      timeout: 10000,
    })

    // Navigate back to home
    await page.click('a[href="/"]')
    await page.waitForLoadState('domcontentloaded')

    // Demo mode should still be active
    await expect(page.locator('.demo-mode-indicator')).toBeVisible({
      timeout: 10000,
    })
  })
})
