import { test, expect } from '@playwright/test'
import { navigateTo } from '../../utils/test-helpers'

test.describe('With Archived Projects', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      sessionStorage.setItem('centy_demo_mode', 'true')
      localStorage.setItem(
        'centy-archived-projects',
        JSON.stringify(['/demo/centy-showcase'])
      )
    })
  })

  test('should display archived project', async ({ page }) => {
    await navigateTo(page, '/archived')

    await expect(page.locator('.archived-projects')).toBeVisible()
    await expect(page.locator('.archived-item')).toBeVisible()
    await expect(page.locator('.archived-item-name').first()).toBeVisible()
  })

  test('should display project actions', async ({ page }) => {
    await navigateTo(page, '/archived')

    await expect(page.locator('.archived-item')).toBeVisible()
    await expect(page.locator('.restore-btn').first()).toBeVisible()
    await expect(page.locator('.restore-select-btn').first()).toBeVisible()
    await expect(page.locator('.remove-btn').first()).toBeVisible()
  })

  test('should show remove all button when projects exist', async ({
    page,
  }) => {
    await navigateTo(page, '/archived')

    await expect(page.locator('.archived-projects')).toBeVisible()
    await expect(page.locator('.archived-item')).toBeVisible()
    await expect(page.locator('.remove-all-btn')).toBeVisible({
      timeout: 5000,
    })
  })

  test('should show confirmation when clicking remove', async ({ page }) => {
    await navigateTo(page, '/archived')

    await expect(page.locator('.archived-item')).toBeVisible()
    await page.locator('.remove-btn').first().click()

    await expect(page.getByText('Remove permanently?')).toBeVisible()
    await expect(page.locator('.confirm-yes-btn').first()).toBeVisible()
    await expect(page.locator('.confirm-no-btn').first()).toBeVisible()
  })

  test('should cancel removal when clicking no', async ({ page }) => {
    await navigateTo(page, '/archived')

    await expect(page.locator('.archived-item')).toBeVisible()
    await page.locator('.remove-btn').first().click()
    await page.locator('.confirm-no-btn').first().click()

    await expect(page.locator('.remove-btn').first()).toBeVisible()
  })

  test('should restore project when clicking restore', async ({ page }) => {
    await navigateTo(page, '/archived')

    await expect(page.locator('.archived-item')).toBeVisible()
    await page.locator('.restore-btn').first().click()

    await expect(page.getByText('No archived projects')).toBeVisible()
  })
})

test.describe('Remove All Confirmation', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      sessionStorage.setItem('centy_demo_mode', 'true')
      localStorage.setItem(
        'centy-archived-projects',
        JSON.stringify(['/demo/centy-showcase'])
      )
    })
  })

  test('should show confirmation when clicking remove all', async ({
    page,
  }) => {
    await navigateTo(page, '/archived')

    await expect(page.locator('.archived-item')).toBeVisible()
    await page.locator('.remove-all-btn').click()

    await expect(page.getByText('Remove all permanently?')).toBeVisible()
  })

  test('should cancel remove all when clicking no', async ({ page }) => {
    await navigateTo(page, '/archived')

    await expect(page.locator('.archived-item')).toBeVisible()
    await page.locator('.remove-all-btn').click()
    await page.locator('.remove-all-confirm .confirm-no-btn').click()

    await expect(page.locator('.remove-all-btn')).toBeVisible()
  })
})
