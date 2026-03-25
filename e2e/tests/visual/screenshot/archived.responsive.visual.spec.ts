import { test, expect } from '@playwright/test'
import { navigateTo } from '../../../utils/test-helpers'

test.describe('Responsive - Mobile Viewport', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
  })

  test('archived page empty - mobile light', async ({ page }) => {
    await page.addInitScript(() => {
      sessionStorage.setItem('centy_demo_mode', 'true')
    })
    await page.emulateMedia({ colorScheme: 'light' })
    await navigateTo(page, '/archived')

    await expect(page.locator('.archived-projects')).toBeVisible()
    await page.waitForTimeout(500)

    await expect(page).toHaveScreenshot('archived-empty-mobile-light.png', {
      fullPage: true,
    })
  })

  test('archived page with project - mobile light', async ({ page }) => {
    await page.addInitScript(() => {
      sessionStorage.setItem('centy_demo_mode', 'true')
      localStorage.setItem(
        'centy-archived-projects',
        JSON.stringify(['/demo/centy-showcase'])
      )
    })
    await page.emulateMedia({ colorScheme: 'light' })
    await navigateTo(page, '/archived')

    await expect(page.locator('.archived-item')).toBeVisible()
    await page.waitForTimeout(500)

    await expect(page).toHaveScreenshot(
      'archived-with-project-mobile-light.png',
      { fullPage: true }
    )
  })
})

test.describe('Responsive - Tablet Viewport', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 })
  })

  test('archived page with project - tablet light', async ({ page }) => {
    await page.addInitScript(() => {
      sessionStorage.setItem('centy_demo_mode', 'true')
      localStorage.setItem(
        'centy-archived-projects',
        JSON.stringify(['/demo/centy-showcase'])
      )
    })
    await page.emulateMedia({ colorScheme: 'light' })
    await navigateTo(page, '/archived')

    await expect(page.locator('.archived-item')).toBeVisible()
    await page.waitForTimeout(500)

    await expect(page).toHaveScreenshot(
      'archived-with-project-tablet-light.png',
      { fullPage: true }
    )
  })
})
