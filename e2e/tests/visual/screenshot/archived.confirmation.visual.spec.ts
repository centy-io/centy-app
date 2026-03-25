import { test, expect } from '@playwright/test'
import { navigateTo } from '../../../utils/test-helpers'

test.describe('Remove Confirmation State', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      sessionStorage.setItem('centy_demo_mode', 'true')
      localStorage.setItem(
        'centy-archived-projects',
        JSON.stringify(['/demo/centy-showcase'])
      )
    })
  })

  test('archived page remove confirmation - light theme', async ({
    page,
    isMobile,
  }) => {
    test.skip(
      isMobile,
      'mobile-not-supported overlay prevents click interactions'
    )
    await page.emulateMedia({ colorScheme: 'light' })
    await navigateTo(page, '/archived')

    await expect(page.locator('.archived-item')).toBeVisible()
    await page.locator('.remove-btn').first().click()
    await expect(page.getByText('Remove permanently?')).toBeVisible()
    await page.waitForTimeout(300)

    await expect(page).toHaveScreenshot(
      'archived-remove-confirmation-light.png',
      { fullPage: true }
    )
  })

  test('archived page remove confirmation - dark theme', async ({
    page,
    isMobile,
  }) => {
    test.skip(
      isMobile,
      'mobile-not-supported overlay prevents click interactions'
    )
    await page.emulateMedia({ colorScheme: 'dark' })
    await navigateTo(page, '/archived')

    await expect(page.locator('.archived-item')).toBeVisible()
    await page.locator('.remove-btn').first().click()
    await expect(page.getByText('Remove permanently?')).toBeVisible()
    await page.waitForTimeout(300)

    await expect(page).toHaveScreenshot(
      'archived-remove-confirmation-dark.png',
      { fullPage: true }
    )
  })
})

test.describe('Remove All Confirmation State', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      sessionStorage.setItem('centy_demo_mode', 'true')
      localStorage.setItem(
        'centy-archived-projects',
        JSON.stringify(['/demo/centy-showcase'])
      )
    })
  })

  test('archived page remove all confirmation - light theme', async ({
    page,
    isMobile,
  }) => {
    test.skip(
      isMobile,
      'mobile-not-supported overlay prevents click interactions'
    )
    await page.emulateMedia({ colorScheme: 'light' })
    await navigateTo(page, '/archived')

    await expect(page.locator('.archived-item')).toBeVisible()
    await page.locator('.remove-all-btn').click()
    await expect(page.getByText('Remove all permanently?')).toBeVisible()
    await page.waitForTimeout(300)

    await expect(page).toHaveScreenshot(
      'archived-remove-all-confirmation-light.png',
      { fullPage: true }
    )
  })

  test('archived page remove all confirmation - dark theme', async ({
    page,
    isMobile,
  }) => {
    test.skip(
      isMobile,
      'mobile-not-supported overlay prevents click interactions'
    )
    await page.emulateMedia({ colorScheme: 'dark' })
    await navigateTo(page, '/archived')

    await expect(page.locator('.archived-item')).toBeVisible()
    await page.locator('.remove-all-btn').click()
    await expect(page.getByText('Remove all permanently?')).toBeVisible()
    await page.waitForTimeout(300)

    await expect(page).toHaveScreenshot(
      'archived-remove-all-confirmation-dark.png',
      { fullPage: true }
    )
  })
})
