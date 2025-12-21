import { test, expect } from '@playwright/test'

test.describe('Demo Mode Visual Tests @visual', () => {
  test('demo mode - homepage with demo org and project', async ({ page }) => {
    // Set up demo mode before navigating
    await page.addInitScript(() => {
      sessionStorage.setItem('centy_demo_mode', 'true')
      localStorage.setItem('centy-selected-org', 'demo-org')
      localStorage.setItem('centy-project-path', '/demo/centy-showcase')
    })

    // Navigate to demo mode URL
    await page.goto('/?org=demo-org&project=%2Fdemo%2Fcenty-showcase')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(500)

    // Verify demo mode indicator is visible
    await expect(page.locator('.demo-mode-indicator')).toBeVisible()

    // Verify org selector shows demo org
    await expect(page.locator('text=Demo Organization')).toBeVisible()

    // Take screenshot of demo mode homepage
    await expect(page).toHaveScreenshot('demo-mode-homepage.png', {
      fullPage: true,
    })
  })

  test('demo mode - issues page with demo data', async ({ page }) => {
    // Set up demo mode before navigating
    await page.addInitScript(() => {
      sessionStorage.setItem('centy_demo_mode', 'true')
      localStorage.setItem('centy-selected-org', 'demo-org')
      localStorage.setItem('centy-project-path', '/demo/centy-showcase')
    })

    // Navigate directly to issues page in demo mode
    await page.goto('/issues?org=demo-org&project=%2Fdemo%2Fcenty-showcase')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(500)

    // Verify demo mode indicator is visible
    await expect(page.locator('.demo-mode-indicator')).toBeVisible()

    // Verify demo issues are displayed
    await expect(page.locator('text=Implement dark mode toggle')).toBeVisible()

    // Take screenshot
    await expect(page).toHaveScreenshot('demo-mode-issues.png', {
      fullPage: true,
    })
  })
})
