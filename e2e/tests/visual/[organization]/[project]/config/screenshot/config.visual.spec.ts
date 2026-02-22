import { test, expect, type Page } from '@playwright/test'
import {
  setupDemoMode,
  navigateToDemoProject,
} from '../../../../../../utils/test-helpers'

async function selectDemoProject(page: Page) {
  // Open project selector dropdown
  await page.click('.project-selector-trigger')
  await page.waitForSelector('.project-selector-dropdown', { state: 'visible' })

  // Click the demo project (centy-showcase)
  await page.click('.project-item-name')

  // Wait for project config sections to load
  await expect(page.locator('.settings-section').first()).toBeVisible({
    timeout: 10000,
  })
  await page.waitForTimeout(500)
}

test.describe('Project Config Visual Tests @visual', () => {
  test.beforeEach(async ({ page }) => {
    await setupDemoMode(page)
  })

  test('project config - light theme', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' })
    await navigateToDemoProject(page, '/config')
    await expect(page.locator('.settings-page')).toBeVisible()
    await selectDemoProject(page)

    await expect(page).toHaveScreenshot('config-light.png', {
      fullPage: true,
    })
  })

  test('project config - dark theme', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' })
    await navigateToDemoProject(page, '/config')
    await expect(page.locator('.settings-page')).toBeVisible()
    await selectDemoProject(page)

    await expect(page).toHaveScreenshot('config-dark.png', {
      fullPage: true,
    })
  })
})
