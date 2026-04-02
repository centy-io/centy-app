import { test, expect } from '@playwright/test'
import { setupDemoMode, navigateToDemoProject } from '../../utils/test-helpers'

test.describe('Create Issue Form - Form interactions', () => {
  test('should update title input value as the user types', async ({
    page,
  }) => {
    await setupDemoMode(page)
    await navigateToDemoProject(page, '/issues/new')

    const titleInput = page.locator('input#title')
    await titleInput.fill('Fix the bug')

    await expect(titleInput).toHaveValue('Fix the bug')
  })

  test('should default priority to Medium', async ({ page }) => {
    await setupDemoMode(page)
    await navigateToDemoProject(page, '/issues/new')

    await expect(page.locator('select#priority')).toHaveValue('2')
  })

  test('should allow changing priority to High', async ({ page }) => {
    await setupDemoMode(page)
    await navigateToDemoProject(page, '/issues/new')

    await page.locator('select#priority').selectOption('1')
    await expect(page.locator('select#priority')).toHaveValue('1')
  })

  test('should allow changing priority to Low', async ({ page }) => {
    await setupDemoMode(page)
    await navigateToDemoProject(page, '/issues/new')

    await page.locator('select#priority').selectOption('3')
    await expect(page.locator('select#priority')).toHaveValue('3')
  })

  test('should default status to open', async ({ page }) => {
    await setupDemoMode(page)
    await navigateToDemoProject(page, '/issues/new')

    await expect(page.locator('select#status')).toHaveValue('open')
  })

  test('should populate status select with demo config allowed states', async ({
    page,
  }) => {
    await setupDemoMode(page)
    await navigateToDemoProject(page, '/issues/new')

    const statusSelect = page.locator('select#status')
    await expect(statusSelect.locator('option[value="open"]')).toBeAttached()
    await expect(
      statusSelect.locator('option[value="in-progress"]')
    ).toBeAttached()
    await expect(
      statusSelect.locator('option[value="for-validation"]')
    ).toBeAttached()
    await expect(statusSelect.locator('option[value="closed"]')).toBeAttached()
  })

  test('should allow changing status', async ({ page }) => {
    await setupDemoMode(page)
    await navigateToDemoProject(page, '/issues/new')

    await page.locator('select#status').selectOption('in-progress')
    await expect(page.locator('select#status')).toHaveValue('in-progress')
  })
})
